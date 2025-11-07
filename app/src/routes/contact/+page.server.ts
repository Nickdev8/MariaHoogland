import type { Actions } from './$types.ts';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import {
  EMAIL_APP_USER,
  EMAIL_APP_PASSWORD,
  EMAIL_APP_TO_ADDRESS
} from '$env/static/private';
import { env as privateEnv } from '$env/dynamic/private';

export const prerender = false;

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_APP_USER,
    pass: EMAIL_APP_PASSWORD
  }
});

const MIN_SUBMISSION_TIME_MS = 4000;
const TURNSTILE_SECRET_KEY = privateEnv.TURNSTILE_SECRET_KEY;

export const actions: Actions = {
  default: async (event) => {
    const { request } = event;
    const data = await request.formData();

    const sanityCheck = data.get('sanity_check')?.toString();
    const formTimestamp = data.get('form_timestamp')?.toString();
    const turnstileToken = data.get('turnstile_token')?.toString();
    const name = data.get('name')?.toString().trim() || 'Anonymous';
    const email = data.get('email')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const subject = data.get('subject')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!formTimestamp) {
      return fail(400, { error: 'Fout bij het verzenden. Vernieuw de pagina en probeer opnieuw.' });
    }

    const parsedTimestamp = Number(formTimestamp);

    if (!Number.isFinite(parsedTimestamp)) {
      return fail(400, { error: 'Fout bij het verzenden. Vernieuw de pagina en probeer opnieuw.' });
    }

    const elapsed = Date.now() - parsedTimestamp;

    if (elapsed < MIN_SUBMISSION_TIME_MS) {
      return fail(429, {
        error: 'Je hebt het formulier wel heel snel verzonden. Vul het rustig opnieuw in.'
      });
    }

    if (TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return fail(400, { error: 'Bevestig alstublieft dat je geen robot bent.' });
      }

      try {
        const verifyPayload = new URLSearchParams();
        verifyPayload.append('secret', TURNSTILE_SECRET_KEY);
        verifyPayload.append('response', turnstileToken);

        try {
          const clientAddress = event.getClientAddress();
          if (clientAddress) {
            verifyPayload.append('remoteip', clientAddress);
          }
        } catch (addressError) {
          console.warn('Kon clientadres niet bepalen voor Turnstile verificatie:', addressError);
        }

        const verifyResponse = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            body: verifyPayload,
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }
        );

        if (!verifyResponse.ok) {
          console.error('Turnstile verificatie request faalde met status', verifyResponse.status);
          return fail(502, { error: 'Verificatie mislukt. Probeer het later opnieuw.' });
        }

        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success) {
          console.warn('Turnstile verificatie mislukt:', verifyResult);
          return fail(400, { error: 'Verificatie mislukt. Probeer het opnieuw.' });
        }
      } catch (verificationError) {
        console.error('Fout bij Turnstile verificatie:', verificationError);
        return fail(500, { error: 'Verificatie mislukt. Probeer het later opnieuw.' });
      }
    }

    // Basic validation
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
        from: `"AMH Website" <${EMAIL_APP_USER}>`,
        to: EMAIL_APP_TO_ADDRESS,
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
