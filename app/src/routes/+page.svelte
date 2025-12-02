<script lang="ts">
	import { ArrowUpRight, Mail, MapPin, Phone as PhoneIcon } from '@lucide/svelte';
	import CountUp from '$lib/CountUp.svelte';
	import type { SiteContent } from '$lib/types/content';

	export let data: { content: SiteContent };

	const home = data.content.home;
	const contactInfo = data.content.contact.info;
	const yearsInPractice = new Date().getFullYear() - 2004;
	const heroStats = home.hero.stats.map((stat) =>
		stat.label.toLowerCase().includes('jaar')
			? { ...stat, value: yearsInPractice }
			: stat
	);

	const infoIcon: Record<string, typeof MapPin> = {
		address: MapPin,
		phone: PhoneIcon,
		email: Mail
	};
</script>

<section class="relative overflow-hidden bg-neutral-900 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Sfeervolle architectuur in avondlicht"
			class="h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-neutral-900/55 to-neutral-950/80"></div>
	</div>

	<div class="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
		<div class="space-y-8 sm:space-y-10">
			<div class="space-y-6">
				<h1 class="font-display text-3xl leading-tight sm:text-4xl lg:text-[3.1rem] lg:leading-[1.1]">
					{home.hero.title}
				</h1>
				<p class="max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
					{home.hero.body}
				</p>
				<div class="flex flex-wrap gap-3">
					<a
						href={home.hero.primaryCta.href}
						class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong"
					>
						{home.hero.primaryCta.label}
					</a>
					<a
						href={home.hero.secondaryCta.href}
						class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
					>
						{home.hero.secondaryCta.label}
						<ArrowUpRight class="h-4 w-4" />
					</a>
				</div>
			</div>

			<div class="grid gap-5 sm:grid-cols-3">
				{#each heroStats as stat}
					<div class="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
						<p class="font-display text-3xl font-semibold text-white sm:text-4xl">
							<CountUp value={stat.value} suffix={`${stat.suffix} `} />
						</p>
						<p class="mt-2 text-sm text-white/75">{stat.label}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="bg-[#f3efe8] py-18 sm:py-22 lg:py-24">
	<div class="mx-auto max-w-5xl px-4 sm:px-6">
		<div class="space-y-6 text-center sm:space-y-7">
			<span class="inline-flex rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold text-primary sm:text-sm">
				Plan direct een gesprek
			</span>
			<h2 class="font-display text-3xl leading-tight text-neutral-900 sm:text-4xl">
				Klaar om te overleggen? Laat iets van u horen.
			</h2>
			<p class="mx-auto max-w-2xl text-base leading-relaxed text-neutral-700">
				Een korte kennismaking is meestal genoeg om helder te krijgen wat er nodig is. Vertel kort uw vraag of project en ik reageer persoonlijk.
			</p>
			<div class="flex flex-wrap justify-center gap-3">
				<a
					href="/contact"
					class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-strong"
				>
					Contactformulier openen
				</a>
				<a
					href="tel:0645776029"
					class="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-900 hover:text-neutral-900"
				>
					Bel direct
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</div>
		</div>

		<div class="mt-10 grid gap-4 sm:mt-12">
			{#each contactInfo as info}
				{@const Icon = infoIcon[info.type] ?? MapPin}
				<div class="rounded-2xl border border-neutral-200 bg-white p-5 text-left">
					<div class="flex items-center gap-3">
						<span class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
							<Icon class="h-5 w-5" />
						</span>
						<div>
							<p class="text-xs font-semibold text-neutral-500">{info.label}</p>
							{#if info.href}
								<a href={info.href} class="text-sm font-semibold text-neutral-900 transition hover:text-primary">
									{info.value}
								</a>
							{:else}
								<p class="text-sm font-semibold text-neutral-900">{info.value}</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
