<script lang="ts">
	import {
		ArrowUpRight,
		Compass,
		FileText,
		Handshake,
		Landmark,
		Layers,
		Lightbulb,
		Ruler,
		Sparkles,
		Users
	} from '@lucide/svelte';
import CountUp from '$lib/CountUp.svelte';
import type { Project, SmallProject } from '$lib/data/projects';
import type { IconName, SiteContent } from '$lib/types/content';

export let data: {
	mainProjects: SmallProject[];
	projects: Project[];
	content: SiteContent;
};

	const home = data.content.home;

	const yearsInPractice = new Date().getFullYear() - 2004;
	const heroStats = home.hero.stats.map((stat) =>
		stat.label.toLowerCase().includes('jaar')
			? { ...stat, value: yearsInPractice }
			: stat
	);

	const iconMap: Partial<Record<IconName, typeof Compass>> = {
		'arrow-up-right': ArrowUpRight,
		compass: Compass,
		globe: Landmark,
		'file-text': FileText,
		handshake: Handshake,
		layers: Layers,
		landmark: Landmark,
		lightbulb: Lightbulb,
		ruler: Ruler,
		sparkles: Sparkles,
		users: Users
	};

	const resolveIcon = (icon: IconName) => iconMap[icon] ?? Compass;

	const summaryPanel = home.summaryPanel;
const highlightsIntro = home.highlightsIntro;
const highlights = home.highlights;
	const processSteps = home.process.steps;
	const commitments = home.commitments.points;
const galleryIntro = home.galleryIntro;
const gallery = home.gallery;
	const testimonials = home.testimonials.items;
	const projectSection = home.projectSection;
	const cta = home.cta;
</script>

<section class="relative overflow-hidden bg-neutral-950 text-white">
	<div class="absolute inset-0">
		<img
			src="/images/heroimageproject.jpg"
			alt="Sfeervolle architectuur in avondlicht"
			class="h-full w-full object-cover opacity-60"
		/>
		<div class="absolute inset-0 bg-neutral-950/70"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(115,199,242,0.45),rgba(15,23,42,0.95))]"></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
		<div class="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.2fr,0.8fr]">
			<div class="space-y-6 sm:space-y-8">
				<h1 class="font-display text-3xl leading-tight sm:text-4xl lg:text-[3.1rem] lg:leading-[1.1]">
					{home.hero.title}
				</h1>
				<p class="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
					{home.hero.body}
				</p>
				<div class="flex flex-wrap gap-4">
					<a
						href={home.hero.primaryCta.href}
						class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-primary-strong hover:text-white"
					>
						{home.hero.primaryCta.label}
					</a>
					<a
						href={home.hero.secondaryCta.href}
						class="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white hover:bg-white/10"
					>
						{home.hero.secondaryCta.label}
						<ArrowUpRight class="h-4 w-4" />
					</a>
				</div>

				<div class="grid gap-5 sm:grid-cols-3">
					{#each heroStats as stat}
						<div class="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
							<p class="font-display text-3xl font-semibold text-white sm:text-4xl">
								<CountUp value={stat.value} suffix={`${stat.suffix} `} />
							</p>
							<p class="mt-2 text-sm uppercase tracking-[0.2em] text-white/70">{stat.label}</p>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-lg sm:p-8">
				<h2 class="font-display text-2xl text-white">{summaryPanel.title}</h2>
				<p class="mt-4 text-sm leading-relaxed text-white/70">
					{summaryPanel.copy}
				</p>
				<ul class="mt-8 space-y-4 text-white/80">
					{#each summaryPanel.bullets as bullet}
						<li class="flex items-center gap-3">
							<span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
								<svelte:component this={resolveIcon(bullet.icon)} class="h-5 w-5" />
							</span>
							{bullet.text}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<section class="bg-[#f5f7fb] py-20 sm:py-24 lg:py-28">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="grid gap-10 sm:gap-12 lg:grid-cols-[0.8fr,1.2fr] lg:items-center">
			<div class="space-y-6">
				<span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
					{highlightsIntro.kicker}
				</span>
				<h2 class="font-display text-3xl leading-tight text-neutral-900 sm:text-4xl">
					{highlightsIntro.title}
				</h2>
				<p class="text-base leading-relaxed text-neutral-600">
					{highlightsIntro.copy}
				</p>
			</div>
			<div class="grid gap-6 sm:grid-cols-2 sm:gap-8">
				{#each highlights as highlight}
					<div class="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_24px_55px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.1)]">
						<span class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
							<svelte:component this={resolveIcon(highlight.icon)} class="h-6 w-6" />
						</span>
						<h3 class="font-display text-lg text-neutral-900">{highlight.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-neutral-600">{highlight.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

{#if data.mainProjects.length}
	<section class="bg-white py-20 sm:py-24 lg:py-28">
		<div class="mx-auto max-w-7xl px-4 sm:px-6">
			<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
				<div>
					<span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
						{projectSection.kicker}
					</span>
					<h2 class="mt-4 font-display text-3xl text-neutral-900 sm:text-4xl">
						{projectSection.title}
					</h2>
					<p class="mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
						{projectSection.copy}
					</p>
				</div>
				<a
					href={projectSection.cta.href}
					class="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 sm:tracking-[0.3em]"
				>
					{projectSection.cta.label}
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</div>

			<div class="mt-10 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-3">
				{#each data.mainProjects as project}
					<a
						href={project.sublink}
						class="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50/60 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
					>
						<div class="relative overflow-hidden">
							<img
								src={project.src}
								alt={project.title}
								class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-neutral-950/10 to-transparent"></div>
						</div>
						<div class="flex flex-1 flex-col gap-4 p-6">
							<div>
								<h3 class="font-display text-xl text-neutral-900">{project.title}</h3>
								<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">
									{project.subtitle}
								</p>
							</div>
							<span class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
								Bekijk project
								<ArrowUpRight class="h-4 w-4 transition group-hover:translate-x-1" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<section class="bg-[#111826] py-20 sm:py-24 lg:py-28 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
			<div class="max-w-xl space-y-6">
				<span class="inline-flex rounded-full bg-primary/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
					{home.process.kicker}
				</span>
				<h2 class="font-display text-3xl leading-tight sm:text-4xl">
					{home.process.title}
				</h2>
				<p class="text-base leading-relaxed text-white/70">
					{home.process.copy}
				</p>
			</div>
			<div class="grid flex-1 gap-6 sm:gap-8 lg:grid-cols-3">
				{#each processSteps as step, index}
					<div class="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
						<div class="flex items-center justify-between">
							<span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-primary">
								{index + 1}
							</span>
							<svelte:component this={resolveIcon(step.icon)} class="h-6 w-6 text-primary" />
						</div>
						<h3 class="mt-6 font-display text-lg text-white">{step.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-white/70">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="bg-[#f5f7fb] py-20 sm:py-24 lg:py-28">
	<div class="mx-auto max-w-7xl px-4 sm:px-6">
		<div class="grid gap-8 lg:grid-cols-[0.75fr,1.25fr] lg:items-center">
			<div class="space-y-6">
				<span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
					{home.commitments.kicker}
				</span>
				<h2 class="font-display text-3xl text-neutral-900 sm:text-4xl">
					{home.commitments.title}
				</h2>
				<p class="text-base leading-relaxed text-neutral-600">
					{home.commitments.copy}
				</p>
			</div>
			<div class="grid gap-5 sm:grid-cols-2 sm:gap-6">
				{#each commitments as point}
					<div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
						<div class="flex items-center gap-3">
							<span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
								<svelte:component this={resolveIcon(point.icon)} class="h-5 w-5" />
							</span>
							<h3 class="font-display text-base text-neutral-900">{point.title}</h3>
						</div>
						<p class="mt-3 text-sm leading-relaxed text-neutral-600">{point.copy}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

{#if gallery.length}
	<section class="bg-white py-20 sm:py-24 lg:py-28">
		<div class="mx-auto max-w-7xl px-4 sm:px-6">
			<div class="mx-auto max-w-2xl text-center">
				<span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
					{galleryIntro.kicker}
				</span>
				<h2 class="mt-4 font-display text-3xl text-neutral-900 sm:text-4xl">{galleryIntro.title}</h2>
				<p class="mt-4 text-base leading-relaxed text-neutral-600">
					{galleryIntro.copy}
				</p>
			</div>
			<div class="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
				{#each gallery as item}
					<div class="overflow-hidden rounded-2xl bg-neutral-100">
						<img
							src={item.src}
							alt={item.alt}
							loading="lazy"
							class="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-105"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if testimonials.length}
	<section class="bg-[#f5f7fb] py-20 sm:py-24 lg:py-28">
		<div class="mx-auto max-w-7xl px-4 sm:px-6">
			<div class="mx-auto max-w-2xl text-center">
				<span class="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.3em]">
					{home.testimonials.kicker}
				</span>
				<h2 class="mt-4 font-display text-3xl text-neutral-900 sm:text-4xl">
					{home.testimonials.title}
				</h2>
			</div>
			<div class="mt-10 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-2">
				{#each testimonials as testimonial}
					<article class="flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)] sm:p-8">
						<p class="text-base leading-relaxed text-neutral-700 sm:text-lg">“{testimonial.quote}”</p>
						<div class="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary sm:text-sm sm:tracking-[0.25em]">
							{testimonial.name}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<section class="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-primary to-primary-strong px-4 py-14 sm:px-6 sm:py-18 lg:mx-auto lg:mb-24 lg:max-w-6xl">
	<div class="absolute -inset-x-24 -top-24 h-48 bg-white/20 blur-3xl"></div>
	<div class="relative mx-auto max-w-4xl text-center text-white">
		<h2 class="font-display text-3xl leading-tight sm:text-4xl">
			{cta.title}
		</h2>
		<p class="mt-4 text-base leading-relaxed text-white/80">
			{cta.copy}
		</p>
		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<a
				href={cta.primaryCta.href}
				class="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-900 sm:tracking-[0.25em]"
			>
				{cta.primaryCta.label}
			</a>
			<a
				href={cta.secondaryCta.href}
				class="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white hover:bg-white/10 sm:tracking-[0.25em]"
			>
				{cta.secondaryCta.label}
			</a>
		</div>
	</div>
</section>
