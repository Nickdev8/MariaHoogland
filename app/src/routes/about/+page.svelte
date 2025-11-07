<script lang="ts">
	import { Landmark, Lightbulb, Sparkles, Users } from '@lucide/svelte';
	import type { IconName, SiteContent } from '$lib/types/content';

	export let data: { content: SiteContent };

	const about = data.content.about;

	const iconMap: Partial<Record<IconName, typeof Landmark>> = {
		globe: Landmark,
		sparkles: Sparkles,
		users: Users,
		lightbulb: Lightbulb
	};

	const resolveIcon = (icon: IconName) => iconMap[icon] ?? Landmark;
</script>

<section class="relative overflow-hidden bg-neutral-950 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Architectonische details in avondlicht"
			class="h-full w-full object-cover opacity-50"
		/>
		<div class="absolute inset-0 bg-neutral-950/70"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(115,199,242,0.35),rgba(15,23,42,0.95))]"></div>
	</div>

	<div class="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-18 lg:py-20">
		<h1 class="mt-5 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
			{about.hero.title}
		</h1>
		<p class="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
			{about.hero.body}
		</p>
	</div>
</section>

<section class="bg-[#f5f7fb] py-20 sm:py-24 lg:py-28">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid gap-8 sm:grid-cols-2">
			{#each about.pillars as pillar}
				<div class="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-8">
					<span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
						<svelte:component this={resolveIcon(pillar.icon)} class="h-6 w-6" />
					</span>
					<h2 class="mt-6 font-display text-xl text-neutral-900">{pillar.title}</h2>
					<p class="mt-3 text-sm leading-relaxed text-neutral-600">{pillar.copy}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-white py-20 sm:py-24 lg:py-28">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid gap-10 sm:gap-12 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
			<div class="space-y-6">
				<h2 class="font-display text-3xl text-neutral-900 sm:text-4xl">
					{about.architect.name}
				</h2>
				<p class="text-xs uppercase tracking-[0.22em] text-primary sm:text-sm sm:tracking-[0.3em]">
					{about.architect.title}
				</p>
				<p class="text-base leading-relaxed text-neutral-600">
					{about.architect.bio}
				</p>
			</div>
			<div class="overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-50/80 p-4 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
				<img
					src={about.architect.image}
					alt={`Portret van ${about.architect.name}`}
					class="w-full rounded-[2rem] object-cover"
				/>
			</div>
		</div>
	</div>
</section>
