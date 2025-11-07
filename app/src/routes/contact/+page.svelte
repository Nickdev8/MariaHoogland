<script module lang="ts">
	declare global {
		interface Window {
			turnstile?: {
				render: (
					container: HTMLElement,
					options: {
						sitekey: string;
						callback: (token: string) => void;
						'expired-callback'?: () => void;
						'error-callback'?: () => void;
					}
				) => string;
				reset: (widgetId: string) => void;
			};
			initTurnstile?: () => void;
		}
	}

	export {};
</script>

<script lang="ts">
import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
import { onMount } from 'svelte';
import { env as publicEnv } from '$env/dynamic/public';
import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
import type { SiteContent } from '$lib/types/content';
import { page } from '$app/stores';

	let { data } = $props<{ data: { content: SiteContent } }>();
	const contactContent = data.content.contact;

let name = $state('');
let email = $state('');
let phone = $state('');
let subject = $state('');
let message = $state('');

const initialTimestamp = Date.now().toString();
let formTimestamp = $state(initialTimestamp);

const turnstileSiteKey = publicEnv.PUBLIC_TURNSTILE_SITE_KEY;
let turnstileToken = $state('');
const captchaRequired = Boolean(turnstileSiteKey);
let captchaValid = $state(!captchaRequired);
let turnstileWidgetId: string | undefined;
let captchaContainer = $state<HTMLDivElement | null>(null);

	const infoIcon: Record<string, typeof MapPin> = {
		address: MapPin,
		phone: PhoneIcon,
		email: MailIcon
	};

	const handleEnhance: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();

			if (
				turnstileSiteKey &&
				typeof window !== 'undefined' &&
				window.turnstile &&
				turnstileWidgetId
			) {
				window.turnstile.reset(turnstileWidgetId);
				captchaValid = false;
				turnstileToken = '';
			}

			if (result.type !== 'error') {
				formTimestamp = Date.now().toString();
			}
		};
	};

	onMount(() => {
		formTimestamp = Date.now().toString();

		if (!turnstileSiteKey || typeof window === 'undefined') {
			return;
		}

		const renderTurnstile = () => {
			if (!captchaContainer || !window.turnstile) {
				return;
			}

			turnstileWidgetId = window.turnstile.render(captchaContainer, {
				sitekey: turnstileSiteKey,
				callback(token: string) {
					turnstileToken = token;
					captchaValid = true;
				},
				'error-callback'() {
					captchaValid = false;
					turnstileToken = '';
				},
				'expired-callback'() {
					captchaValid = false;
					turnstileToken = '';
				}
			});
		};

		const existingScript = document.querySelector<HTMLScriptElement>('script[data-turnstile]');

		if (existingScript) {
			if (window.turnstile) {
				renderTurnstile();
			}
			return;
		}

		window.initTurnstile = () => {
			renderTurnstile();
		};

		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=initTurnstile';
		script.async = true;
		script.defer = true;
		script.dataset.turnstile = 'true';
		document.head.appendChild(script);
	});

</script>

<section class="relative overflow-hidden bg-neutral-950 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Architectonische details met avondlicht"
			class="h-full w-full object-cover opacity-50"
		/>
		<div class="absolute inset-0 bg-neutral-950/70"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(115,199,242,0.3),rgba(17,24,39,0.9))]"></div>
	</div>

	<div class="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-18 lg:py-20">
		<h1 class="mt-5 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
			{contactContent.hero.title}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
			{contactContent.hero.body}
		</p>
	</div>
</section>

<section class="bg-[#f5f7fb] py-16 sm:py-20 lg:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid gap-10 lg:grid-cols-12 lg:items-start xl:gap-16">
			<form
				method="POST"
				use:enhance={handleEnhance}
				class="order-1 space-y-6 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8 lg:order-2 lg:col-span-7 lg:space-y-7"
			>
				<div class="hidden" aria-hidden="true">
					<label for="sanity_check">Do not fill this out</label>
					<input
						type="text"
						name="sanity_check"
						id="sanity_check"
						tabindex="-1"
						autocomplete="off"
					/>
				</div>
				<input type="hidden" name="form_timestamp" value={formTimestamp} />
				{#if turnstileSiteKey}
					<input type="hidden" name="turnstile_token" value={turnstileToken} />
				{/if}

				<div class="grid gap-5 sm:grid-cols-2">
					<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
						<span>Naam</span>
						<input
							type="text"
							name="name"
							id="name"
							bind:value={name}
							required
							class="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="Uw volledige naam"
						/>
					</label>

					<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
						<span>E-mailadres</span>
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							required
							class="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="uwnaam@voorbeeld.nl"
						/>
					</label>

					<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
						<span>Telefoonnummer</span>
						<input
							type="tel"
							name="phone"
							id="phone"
							bind:value={phone}
							class="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="+31 6 12345678"
						/>
					</label>

					<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
						<span>Onderwerp</span>
						<input
							type="text"
							name="subject"
							id="subject"
							bind:value={subject}
							required
							class="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							placeholder="Korte omschrijving"
						/>
					</label>
				</div>

				<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400">
					<span>Bericht</span>
					<textarea
						name="message"
						id="message"
						bind:value={message}
						rows="6"
						required
						class="min-h-[180px] rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder="Beschrijf uw project, planning en vragen..."
					></textarea>
				</label>

				{#if turnstileSiteKey}
					<div class="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-4 text-center">
						<div
							bind:this={captchaContainer}
							class="cf-turnstile flex justify-center"
							data-sitekey={turnstileSiteKey}
						></div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={!captchaValid}
					class="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-950 transition hover:bg-primary-strong hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
				>
					Bericht versturen
				</button>

			{#if $page.form?.success}
				<div class="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center text-sm font-semibold text-emerald-700" role="status">
					{$page.form.message}
				</div>
			{:else if $page.form?.error}
				<div class="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-center text-sm font-semibold text-red-700" role="alert">
					{$page.form.error}
				</div>
			{/if}
			</form>

			<aside class="order-2 space-y-8 rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8 lg:order-1 lg:col-span-5">
				<h2 class="font-display text-2xl text-neutral-900">{contactContent.form.title}</h2>
				<p class="text-sm leading-relaxed text-neutral-600">{contactContent.form.body}</p>

				<ul class="grid gap-5 text-left text-neutral-700 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1">
					{#each contactContent.info as info}
						{@const Icon = infoIcon[info.type] ?? MapPin}
						<li class="flex h-full items-start gap-4 rounded-2xl bg-neutral-50/80 p-4">
							<span class="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
								<Icon class="h-5 w-5" />
							</span>
							<div>
								<p class="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
									{info.label}
								</p>
								{#if info.href}
									<a href={info.href} class="mt-1 block text-sm font-semibold text-neutral-900 transition hover:text-primary">
										{info.value}
									</a>
								{:else}
									<p class="mt-1 text-sm font-semibold text-neutral-900">{info.value}</p>
								{/if}
							</div>
						</li>
					{/each}
				</ul>

				<div class="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 text-xs uppercase tracking-[0.22em] text-neutral-500 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:text-[0.7rem] lg:block lg:text-xs">
					{#each contactContent.businessDetails as detail}
						<p class="py-1">{detail}</p>
					{/each}
				</div>
			</aside>
		</div>
	</div>
</section>
