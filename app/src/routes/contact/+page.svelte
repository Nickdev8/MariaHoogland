<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import type { ContactContent } from '$lib/types/content';

	let formResult: { success?: boolean; message?: string; error?: string } = {};
	$: formResult = $page.form ?? {};

	export let data: { contact: ContactContent; turnstileSiteKey: string };
	const { contact } = data;
	const turnstileSiteKey = data.turnstileSiteKey;

	let name = '';
	let email = '';
	let phone = '';
	let subject = '';
	let message = '';
</script>

<svelte:head>
	{#if turnstileSiteKey}
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
	{/if}
</svelte:head>

<section class="contact-page">
	<div class="contact-page__intro">
		<p class="contact-page__label">Contact</p>
		<h1>{contact.title}</h1>
		<p class="contact-page__lead">{contact.description}</p>
	</div>

	<div class="contact-page__content">
		<aside class="contact-page__details" aria-label="Contactgegevens">
			<div class="contact-page__detail-list">
				<div class="contact-page__detail">
					<MapPin size={19} strokeWidth={1.5} aria-hidden="true" />
					<div><h2>Adres</h2><p>{contact.address.lines.join(', ')}</p></div>
				</div>
				<div class="contact-page__detail">
					<PhoneIcon size={19} strokeWidth={1.5} aria-hidden="true" />
					<div><h2>Telefoon</h2><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
				</div>
				<div class="contact-page__detail">
					<MailIcon size={19} strokeWidth={1.5} aria-hidden="true" />
					<div><h2>E-mail</h2><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
				</div>
			</div>
			{#if contact.businessDetails.length}
				<div class="contact-page__business"><h2>Bedrijfsgegevens</h2>{#each contact.businessDetails as detail}<p>{detail}</p>{/each}</div>
			{/if}
		</aside>

		<form method="POST" use:enhance class="contact-form">
			<div class="hidden" aria-hidden="true"><label for="sanity_check">Do not fill this out</label><input type="text" name="sanity_check" id="sanity_check" tabindex="-1" autocomplete="off" /></div>
			<div class="contact-form__heading"><h2>Vertel over uw plan</h2><p>Een korte omschrijving is genoeg om het gesprek te beginnen.</p></div>
			<div class="contact-form__fields">
				<label><span>Naam</span><input type="text" name="name" bind:value={name} required autocomplete="name" placeholder="Uw naam" /></label>
				<label><span>E-mailadres</span><input type="email" name="email" bind:value={email} required autocomplete="email" placeholder="naam@voorbeeld.nl" /></label>
				<label><span>Telefoonnummer <em>optioneel</em></span><input type="tel" name="phone" bind:value={phone} autocomplete="tel" placeholder="06 12345678" /></label>
				<label><span>Onderwerp</span><input type="text" name="subject" bind:value={subject} required placeholder="Bijvoorbeeld: verbouwing woning" /></label>
				<label class="contact-form__message"><span>Bericht</span><textarea name="message" bind:value={message} rows="7" required placeholder="Vertel kort wat u voor ogen heeft..."></textarea></label>
			</div>

			{#if turnstileSiteKey}
				<div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" data-size="flexible" data-action="contact"></div>
			{:else}
				<p class="contact-form__notice">Captcha is nog niet ingesteld. Voeg eerst de Turnstile-sleutels toe aan de omgeving.</p>
			{/if}

			<button type="submit" disabled={!turnstileSiteKey}>Bericht versturen</button>
			{#if formResult.success}<p class="contact-form__result contact-form__result--success" role="alert">{formResult.message}</p>{:else if formResult.error}<p class="contact-form__result contact-form__result--error" role="alert">{formResult.error}</p>{/if}
		</form>
	</div>
</section>

<style>
	.contact-page { min-height:calc(100svh - 3.5rem); background:#f7f9fc; padding:clamp(56px,9vw,128px) 24px; color:#000; }.contact-page__intro,.contact-page__content { max-width:1180px; margin:auto; }.contact-page__label { margin:0; color:#555; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; }.contact-page h1 { max-width:780px; margin:15px 0 0; font-size:clamp(2.8rem,6.2vw,6rem); line-height:.95; letter-spacing:-.06em; font-weight:500; }.contact-page__lead { max-width:570px; margin:24px 0 0; color:#555; font-size:1.1rem; line-height:1.65; }.contact-page__content { display:grid; grid-template-columns:minmax(260px,.75fr) minmax(0,1.25fr); gap:clamp(56px,11vw,170px); margin-top:clamp(64px,10vw,126px); }.contact-page__details { color:#555; }.contact-page__detail-list { border-top:1px solid rgba(0,0,0,.14); }.contact-page__detail { display:grid; grid-template-columns:20px 1fr; gap:14px; border-bottom:1px solid rgba(0,0,0,.14); padding:20px 0; }.contact-page__detail h2,.contact-page__business h2,.contact-form h2 { margin:0; color:#000; font-size:1rem; font-weight:600; }.contact-page__detail p,.contact-page__detail a { display:block; margin:5px 0 0; color:#555; font-size:.94rem; line-height:1.5; text-decoration:none; }.contact-page__detail a:hover { color:#000; text-decoration:underline; text-underline-offset:3px; }.contact-page__business { margin-top:32px; }.contact-page__business p { margin:5px 0 0; color:#555; font-size:.87rem; line-height:1.45; }
	.contact-form { border-top:1px solid #000; padding-top:18px; }.contact-form__heading { margin-bottom:34px; }.contact-form__heading p { margin:7px 0 0; color:#555; line-height:1.55; }.contact-form__fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px 18px; }.contact-form label { display:block; }.contact-form label span { display:block; color:#000; font-size:.88rem; font-weight:500; }.contact-form label em { color:#777; font-size:.78rem; font-style:normal; font-weight:400; }.contact-form input,.contact-form textarea { box-sizing:border-box; width:100%; border:1px solid rgba(0,0,0,.2); outline:0; background:#fff; color:#000; font:inherit; font-size:1rem; margin-top:8px; padding:12px; }.contact-form input::placeholder,.contact-form textarea::placeholder { color:#8a8a8a; }.contact-form input:focus,.contact-form textarea:focus { border-color:#00ffff; box-shadow:0 0 0 2px rgba(0,255,255,.18); }.contact-form__message { grid-column:1 / -1; }.contact-form textarea { display:block; line-height:1.6; resize:vertical; }.contact-form :global(.cf-turnstile) { margin-top:26px; }.contact-form__notice { margin:26px 0 0; border-left:2px solid #555; padding-left:12px; color:#555; font-size:.88rem; line-height:1.5; }.contact-form button { margin-top:26px; border:1px solid #555; background:#555; color:#fff; padding:12px 18px; font:inherit; font-size:.9rem; cursor:pointer; transition:background 160ms ease,color 160ms ease; }.contact-form button:hover:not(:disabled) { background:transparent; color:#000; }.contact-form button:disabled { cursor:not-allowed; opacity:.5; }.contact-form__result { margin:20px 0 0; font-size:.92rem; }.contact-form__result--success { color:#1d6a4b; }.contact-form__result--error { color:#b42318; }
	@media(max-width:720px){.contact-page{padding-left:16px;padding-right:16px}.contact-page__content{grid-template-columns:1fr;gap:58px;margin-top:64px}.contact-form__fields{grid-template-columns:1fr}.contact-form__message{grid-column:auto}}
</style>
