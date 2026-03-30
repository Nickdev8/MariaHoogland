<script lang="ts">
	import { Globe, PenTool, Users, Lightbulb } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import type { AboutContent } from '$lib/types/content';

	export let data: { about: AboutContent };
	const { about } = data;

	const iconMap: Record<string, typeof Globe> = {
		Globe,
		PenTool,
		Users,
		Lightbulb
	};

	const resolveIcon = (name: string) => iconMap[name] ?? Globe;
	const leadMember = about.team.members[0];
</script>

<section class="border-b border-secondary/15 bg-[#f6f8f7] py-20 sm:py-24">
	<div class="section-wrap grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
		<div class="max-w-2xl" in:fade={{ duration: 450 }}>
			<p class="section-eyebrow">{about.introLabel}</p>
			<h1 class="section-title">{about.title}</h1>
			<p class="section-copy">{about.description}</p>
		</div>

		{#if leadMember}
			<figure class="overflow-hidden border border-secondary/20 bg-white">
				<img class="aspect-[4/5] w-full object-cover" src={leadMember.image.src} alt={leadMember.image.alt} />
				<figcaption class="border-t border-secondary/15 px-4 py-3 text-sm text-secondary">
					<span class="font-semibold text-textcolor">{leadMember.name}</span> · {leadMember.role}
				</figcaption>
			</figure>
		{/if}
	</div>
</section>

<section class="border-b border-secondary/15 bg-white py-20 sm:py-24">
	<div class="section-wrap">
		<div class="max-w-3xl">
			<p class="section-eyebrow">Werkwijze</p>
			<h2 class="section-title">Heldere stappen, persoonlijk begeleid</h2>
		</div>

		<dl class="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
			{#each about.features as feature}
				<div class="flat-panel p-6">
					<dt class="flex items-center gap-3 text-2xl text-textcolor">
						<span class="inline-flex h-9 w-9 items-center justify-center border border-secondary/25 text-secondary">
							<svelte:component this={resolveIcon(feature.icon)} class="h-5 w-5" />
						</span>
						{feature.title}
					</dt>
					<dd class="mt-4 text-sm leading-7 text-secondary">{feature.description}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<section class="bg-[#e2e9e7] py-20 sm:py-24">
	<div class="section-wrap">
		<div class="max-w-3xl">
			<p class="section-eyebrow">{about.team.title}</p>
			<h2 class="section-title">Eén vast aanspreekpunt</h2>
			<p class="section-copy">{about.team.description}</p>
		</div>
		<div class="mt-10 space-y-4">
			{#each about.team.members as member}
				<div class="flat-panel grid grid-cols-1 overflow-hidden sm:grid-cols-[220px_1fr]">
					<img src={member.image.src} alt={member.image.alt} class="h-full w-full object-cover" />
					<div class="p-6">
						<h3 class="text-2xl text-textcolor">{member.name}</h3>
						<p class="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">
							{member.role}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
