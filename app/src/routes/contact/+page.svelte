<script lang="ts">
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';
	import type { SiteContent } from '$lib/types/content';

	let { data } = $props<{ data: { content: SiteContent } }>();
	const contactContent = data.content.contact;

	const infoIcon: Record<string, typeof MapPin> = {
		address: MapPin,
		phone: PhoneIcon,
		email: MailIcon
	};

	const emailInfo = contactContent.info.find((info) => info.type === 'email');
</script>

<section class="relative overflow-hidden bg-neutral-900 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Architectonische details met avondlicht"
			class="h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-neutral-900/55 to-neutral-950/80"></div>
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

<section class="bg-[#f3efe8] py-16 sm:py-20 lg:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
			<div class="flex flex-col items-center gap-4 text-center">
				<h2 class="font-display text-2xl text-neutral-900">{contactContent.form.title}</h2>
				<p class="max-w-3xl text-sm leading-relaxed text-neutral-600">
					{contactContent.form.body}
				</p>
				{#if emailInfo}
					<a
						href={emailInfo.href ?? `mailto:${emailInfo.value}`}
						class="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
					>
						<MailIcon class="h-5 w-5" />
						<span>{emailInfo.value}</span>
					</a>
				{/if}
			</div>

			<div class="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
				<div class="space-y-4">
					<h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
						Contact
					</h3>
					<ul class="grid gap-4 text-left text-neutral-700">
						{#each contactContent.info as info}
							{@const Icon = infoIcon[info.type] ?? MapPin}
							<li class="flex items-start gap-4 rounded-2xl bg-neutral-50 px-4 py-3">
								<span class="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
									<Icon class="h-5 w-5" />
								</span>
								<div>
									<p class="text-xs font-semibold text-neutral-500">{info.label}</p>
									{#if info.href}
										<a
											href={info.href}
											class="mt-1 block text-sm font-semibold text-neutral-900 transition hover:text-primary"
										>
											{info.value}
										</a>
									{:else}
										<p class="mt-1 text-sm font-semibold text-neutral-900">{info.value}</p>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
					<h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
						Bedrijfsgegevens
					</h3>
					<div class="mt-4 space-y-2">
						{#each contactContent.businessDetails as detail}
							<p class="leading-relaxed">{detail}</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
