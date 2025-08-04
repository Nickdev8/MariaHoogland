import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import {
  EMAIL_APP_USER,
  EMAIL_APP_PASSWORD,
  EMAIL_APP_TO_ADDRESS
} from '$env/static/private';

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

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const name = data.get('name')?.toString().trim() || 'Anonymous';
    const email = data.get('email')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const subject = data.get('subject')?.toString().trim();
    const message = data.get('message')?.toString().trim();

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

    const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });

    const fullText = `
Naam: ${name}
Email: ${email}
Telefoon: ${phone}
Onderwerp: ${subject}

Bericht:
${message}

---
Verzonden op: ${timestamp}
`.trim();

    try {
      await transporter.sendMail({
        from: `"MariaHoogland.nl" <${EMAIL_APP_USER}>`,
        to: EMAIL_APP_TO_ADDRESS,
        replyTo: `"${name}" <${email}>`,
        subject: `Nieuw bericht: ${subject}`,
        text: fullText
      });
      return { success: true, message: 'Je bericht is succesvol verzonden!' };
    } catch (err) {
      console.error('Email send failed:', err);
      return fail(500, { error: 'Verzenden mislukt. Probeer het later opnieuw.' });
    }
  }
};