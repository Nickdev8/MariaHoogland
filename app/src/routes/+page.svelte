<script lang="ts">
	import { onMount } from 'svelte';
	import CountUp from '$lib/CountUp.svelte';
	import type { SiteContent } from '$lib/types/content';
	import type { ProjectWithHtml } from '$lib/server/projects';
	export let data: { content: SiteContent; projects: ProjectWithHtml[] };
	const home = data.content.home;
	let hero: HTMLElement;
	let parallaxEnabled = false;
	let backgroundOffset = 0;
	let frame: number | undefined;

	function updateParallax() {
		if (!parallaxEnabled || frame || !hero) return;
		frame = requestAnimationFrame(() => {
			const top = hero.getBoundingClientRect().top;
			backgroundOffset = Math.max(-180, Math.min(180, top * -0.35));
			frame = undefined;
		});
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const setMotionPreference = () => {
			parallaxEnabled = !reducedMotion.matches;
			if (!parallaxEnabled) backgroundOffset = 0;
			else updateParallax();
		};
		setMotionPreference();
		reducedMotion.addEventListener('change', setMotionPreference);
		return () => {
			reducedMotion.removeEventListener('change', setMotionPreference);
			if (frame) cancelAnimationFrame(frame);
		};
	});
</script>

<svelte:window on:scroll={updateParallax} />

<section bind:this={hero} class="overflow-hidden bg-[#f7f9fc]" style={`background-image:url(${home.hero.backgroundImage || '/images/mainbg.png'});background-position:left calc(50% + ${backgroundOffset}px);background-repeat:no-repeat;background-size:cover`}><div class="mx-auto grid min-h-[min(680px,calc(100svh-3.5rem))] max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_.75fr] lg:items-center lg:px-8"><div class="max-w-xl"><p class="text-xs font-medium uppercase tracking-[.12em] text-secondary">Maria Hoogland Architectuur</p><h1 class="mt-5 max-w-md text-[clamp(2.5rem,4.6vw,4.5rem)] font-medium leading-[.98] tracking-[-.055em]">Ruimte die verder helpt.</h1><p class="mt-6 text-base leading-7 text-secondary">Voor verbouwingen, nieuwbouw en vergunningen.</p><div class="mt-8 flex flex-wrap items-center gap-5"><a class="border border-secondary bg-secondary px-5 py-3 text-sm text-white no-underline hover:bg-transparent hover:text-textcolor" href={home.hero.primaryCta.href}>{home.hero.primaryCta.label}</a><a class="border-b border-textcolor pb-1 text-sm text-textcolor no-underline" href={home.hero.secondaryCta.href}>{home.hero.secondaryCta.label}</a></div></div><figure class="w-full max-w-md justify-self-end"><img class="aspect-[4/5] w-full object-cover object-top" src={home.hero.images[0]?.src ?? 'https://picsum.photos/seed/maria-v5-hero/900/1125'} alt={home.hero.images[0]?.alt ?? 'Maria Hoogland'} /><figcaption class="mt-3 border-t border-black/10 pt-3 text-sm text-secondary">Ruimte maken voor hoe u wilt leven.</figcaption></figure></div></section>

<section class="bg-[#e8edf4] px-6 py-20 sm:px-8 sm:py-28"><div class="mx-auto max-w-7xl"><div class="flex items-end justify-between gap-6"><div><p class="text-xs font-medium uppercase tracking-[.12em] text-secondary">Werk</p><h2 class="mt-4 text-[clamp(2.4rem,4.5vw,4.6rem)] font-medium leading-[.96] tracking-[-.06em]">Een praktijk in beelden.</h2></div><a class="hidden border-b border-textcolor pb-1 text-sm text-textcolor no-underline sm:block" href="/portfolio">Alle projecten</a></div><div class="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{#each data.projects as project, index}<a class={`text-textcolor no-underline ${index === 0 ? 'col-span-2 row-span-2' : ''}`} href={`/${project.slug}`}><img class={`w-full object-cover ${index === 0 ? 'aspect-square' : 'aspect-[4/3]'}`} src={project.mainImage} alt={project.title} loading="lazy" /><div class="mt-3 border-t border-black/15 pt-2"><p class="text-xs text-secondary">{project.category}</p><h3 class="mt-1 text-sm font-semibold sm:text-base">{project.title}</h3></div></a>{/each}</div><a class="mt-10 inline-block border-b border-textcolor pb-1 text-sm text-textcolor no-underline sm:hidden" href="/portfolio">Alle projecten</a></div></section>

<section class="relative isolate overflow-hidden bg-neutral-900 text-white"><img class="absolute inset-[-12px] z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] scale-105 object-cover blur-md" src="https://picsum.photos/seed/maria-experience/1800/900" alt="" /><div class="absolute inset-0 z-10 bg-black/55"></div><div class="relative z-20 mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/25 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">{#each home.stats as stat}<div class="py-11 text-left sm:px-8 sm:first:pl-0 sm:last:pr-0"><h2 class="text-4xl font-semibold tracking-[-.04em] sm:text-5xl"><CountUp value={stat.value} suffix={stat.suffix ? `${stat.suffix} ` : ''} /></h2><p class="mt-3 text-sm leading-6 text-white/75">{stat.label}</p></div>{/each}</div></section>

<section class="bg-[#f7f9fc] px-6 py-16 sm:px-8"><div class="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><p class="text-xs font-medium uppercase tracking-[.12em] text-secondary">Eerste gesprek</p><h2 class="mt-4 max-w-2xl text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[.98] tracking-[-.055em]">Heeft u plannen voor uw huis of gebouw?</h2></div><a class="border border-secondary px-5 py-3 text-sm text-textcolor no-underline hover:bg-secondary hover:text-white" href="/contact">Vertel over uw plannen</a></div></section>
