import type { Actions, PageServerLoad } from './$types.ts';
import { dev } from '$app/environment';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { readContent } from '$lib/server/content';
import {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_SECURE,
	SMTP_USER,
	SMTP_PASSWORD,
	EMAIL_FROM,
	EMAIL_TO
} from '$env/static/private';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readField = (data: FormData, field: string, maxLength: number) => {
	const value = data.get(field)?.toString().trim() ?? '';
	return value.length <= maxLength ? value : null;
};

export const prerender = false;

const getTurnstileSiteKey = () =>
	dev ? TURNSTILE_TEST_SITE_KEY : (publicEnv.PUBLIC_TURNSTILE_SITE_KEY ?? '');

const getTurnstileSecretKey = () =>
	dev ? TURNSTILE_TEST_SECRET_KEY : (privateEnv.TURNSTILE_SECRET_KEY ?? '');

const getSmtpConfigError = () => {
	if (!SMTP_HOST) return 'SMTP_HOST ontbreekt.';
	if (!EMAIL_FROM) return 'EMAIL_FROM ontbreekt.';
	if (!EMAIL_TO) return 'EMAIL_TO ontbreekt.';
	if (SMTP_USER && !SMTP_PASSWORD) return 'SMTP_PASSWORD ontbreekt terwijl SMTP_USER is ingesteld.';
	return null;
};

const createTransporter = () => {
	const smtpPort = Number.parseInt(SMTP_PORT, 10);
	const smtpSecure = SMTP_SECURE === 'true';

	return nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number.isNaN(smtpPort) ? 587 : smtpPort,
		secure: smtpSecure,
		auth: SMTP_USER
			? {
					user: SMTP_USER,
					pass: SMTP_PASSWORD
				}
			: undefined
	});
};

export const load: PageServerLoad = async () => {
	const content = await readContent();
	return { contact: content.contact, turnstileSiteKey: getTurnstileSiteKey() };
};

export const actions: Actions = {
	default: async ({ request, getClientAddress, fetch }) => {
		try {
			const data = await request.formData();

			const sanityCheck = data.get('sanity_check')?.toString();
			const turnstileToken = data.get('cf-turnstile-response')?.toString();
			const name = readField(data, 'name', 100);
			const email = readField(data, 'email', 254);
			const phone = readField(data, 'phone', 50);
			const subject = readField(data, 'subject', 160);
			const message = readField(data, 'message', 5000);

			if ([name, email, phone, subject, message].some((value) => value === null)) {
				return fail(400, { error: 'Een of meer velden zijn te lang.' });
			}

			if (!email) {
				return fail(400, { error: 'Vul je e-mailadres in.' });
			}
			if (!EMAIL_PATTERN.test(email)) {
				return fail(400, { error: 'Vul een geldig e-mailadres in.' });
			}
			if (!phone) {
				return fail(400, { error: 'Vul je telefoonnummer in.' });
			}
			if (!subject) {
				return fail(400, { error: 'Vul een onderwerp in.' });
			}
			if (!message) {
				return fail(400, { error: 'Vul een bericht in.' });
			}

			const turnstileSiteKey = getTurnstileSiteKey();
			const turnstileSecretKey = getTurnstileSecretKey();
			if (!turnstileSiteKey || !turnstileSecretKey) {
				return fail(500, {
					error: 'Formulierbeveiliging is niet ingesteld. Probeer het later opnieuw.'
				});
			}
			if (!turnstileToken) {
				return fail(400, { error: 'Bevestig eerst dat je geen robot bent.' });
			}

			const verificationBody = new URLSearchParams({
				secret: turnstileSecretKey,
				response: turnstileToken
			});

			try {
				const remoteip = getClientAddress();
				if (remoteip) verificationBody.set('remoteip', remoteip);
			} catch {
				// Some adapters may not expose a client IP.
			}

			let verificationResponse: Response;
			let verification: {
				success?: boolean;
				'error-codes'?: string[];
			};

			try {
				verificationResponse = await fetch(
					'https://challenges.cloudflare.com/turnstile/v0/siteverify',
					{
						method: 'POST',
						body: verificationBody
					}
				);
				verification = (await verificationResponse.json()) as {
					success?: boolean;
					'error-codes'?: string[];
				};
			} catch (error) {
				console.error('Turnstile verification request failed:', error);
				return fail(502, {
					error: 'Captcha-verificatie is tijdelijk niet beschikbaar. Probeer het later opnieuw.'
				});
			}

			if (!verificationResponse.ok || !verification.success) {
				console.warn('Turnstile verification failed', verification['error-codes'] ?? []);
				return fail(400, { error: 'Captcha-verificatie mislukt. Probeer het opnieuw.' });
			}

			const smtpConfigError = getSmtpConfigError();
			if (smtpConfigError) {
				console.error('Contact form email configuration invalid:', smtpConfigError);
				return fail(500, {
					error: 'E-mailverzending is niet correct ingesteld. Probeer het later opnieuw.'
				});
			}

			let fullText = `
- Naam: ${name || 'Anonymous'}
- Email: ${email}
- Telefoon: ${phone}
- Onderwerp: ${subject}

Bericht:
${message}
`.trim();

			let emailSubject = `Nieuw bericht: ${subject}`;

			if (sanityCheck) {
				emailSubject = `[MOGELIJK SPAM] ${emailSubject}`;
				fullText = `
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
! WAARSCHUWING: Mogelijk een bot!
! Het verborgen "sanity_check" veld was ingevuld met: ${sanityCheck}
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

${fullText}
`.trim();
			}

			await createTransporter().sendMail({
				from: EMAIL_FROM,
				to: EMAIL_TO,
				replyTo: `"${name || 'Anonymous'}" <${email}>`,
				subject: emailSubject,
				text: fullText
			});

			return { success: true, message: 'Je bericht is succesvol verzonden!' };
		} catch (error) {
			console.error('Contact form action failed:', error);
			return fail(500, { error: 'Verzenden mislukt. Probeer het later opnieuw.' });
		}
	}
};
