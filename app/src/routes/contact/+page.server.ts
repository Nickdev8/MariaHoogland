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

export const prerender = false;

const getTurnstileSiteKey = () =>
  dev ? TURNSTILE_TEST_SITE_KEY : publicEnv.PUBLIC_TURNSTILE_SITE_KEY ?? '';

const getTurnstileSecretKey = () =>
  dev ? TURNSTILE_TEST_SECRET_KEY : privateEnv.TURNSTILE_SECRET_KEY ?? '';

export const load: PageServerLoad = async () => {
  const content = await readContent();
  return { contact: content.contact, turnstileSiteKey: getTurnstileSiteKey() };
};

const smtpPort = Number.parseInt(SMTP_PORT, 10);
const smtpSecure = SMTP_SECURE === 'true';

const transporter = nodemailer.createTransport({
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

export const actions: Actions = {
  default: async ({ request, getClientAddress, fetch }) => {
    const data = await request.formData();

    const sanityCheck = data.get('sanity_check')?.toString();
    const turnstileToken = data.get('cf-turnstile-response')?.toString();
    const name = data.get('name')?.toString().trim() || 'Anonymous';
    const email = data.get('email')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const subject = data.get('subject')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!email) {
      return fail(400, { error: 'Vul je e-mailadres in.' });
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
      return fail(500, { error: 'Formulierbeveiliging is niet ingesteld. Probeer het later opnieuw.' });
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

    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: verificationBody
      }
    );

    const verification = (await verificationResponse.json()) as {
      success?: boolean;
      'error-codes'?: string[];
    };

    if (!verificationResponse.ok || !verification.success) {
      console.warn('Turnstile verification failed', verification['error-codes'] ?? []);
      return fail(400, { error: 'Captcha-verificatie mislukt. Probeer het opnieuw.' });
    }

    let fullText = `
- Naam: ${name}
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

    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        replyTo: `"${name}" <${email}>`,
        subject: emailSubject,
        text: fullText
      });
      return { success: true, message: 'Je bericht is succesvol verzonden!' };
    } catch (err) {
      console.error('Email send failed:', err);
      return fail(500, { error: 'Verzenden mislukt. Probeer het later opnieuw.' });
    }
  }
};
