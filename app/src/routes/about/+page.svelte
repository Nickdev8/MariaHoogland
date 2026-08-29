<script lang="ts">
	import type { AboutContent } from '$lib/types/content';

	export let data: { about: AboutContent };
	const maria = data.about.team.members[0];
	const story = {
		introLabel: data.about.introLabel,
		title: data.about.title,
		description: data.about.description
	};
	const historyText = [
		'Maria Hoogland is ir. ing. architect en begeleidt opdrachtgevers persoonlijk bij verbouwingen, nieuwbouw, woningrenovaties en vergunningstrajecten. Vanuit Spaarndam werkt zij aan projecten in Noord-Holland, waaronder Haarlem en Amsterdam.',
		'Maria begint ieder ontwerp met luisteren naar de plek, de mensen en wat een huis of gebouw in het dagelijks leven moet kunnen. Vervolgens vertaalt zij die uitgangspunten naar heldere keuzes, tekeningen en een overzichtelijk traject van eerste idee tot uitvoering.'
	];
</script>

<svelte:head>
	<title>Over Maria Hoogland | Architect in Spaarndam</title>
	<meta
		name="description"
		content="Maak kennis met Maria Hoogland, ir. ing. architect in Spaarndam. Persoonlijke begeleiding voor verbouwingen, nieuwbouw, woningrenovaties en vergunningen."
	/>
	<meta property="og:type" content="profile" />
	<meta property="og:title" content="Over Maria Hoogland | Architect in Spaarndam" />
	<meta
		property="og:description"
		content="Maak kennis met Maria Hoogland, ir. ing. architect voor verbouwingen, nieuwbouw en vergunningen."
	/>
	<meta
		property="og:image"
		content="https://mariahoogland.nl/images/people/maria-sunset-portrait-cropped.webp"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Over Maria Hoogland | Architect in Spaarndam" />
	<meta
		name="twitter:description"
		content="Persoonlijke begeleiding voor verbouwingen, nieuwbouw en vergunningen."
	/>
	<meta
		name="twitter:image"
		content="https://mariahoogland.nl/images/people/maria-sunset-portrait-cropped.webp"
	/>
</svelte:head>

<section class="bg-[#f5f8fc] px-6 py-16 sm:px-8 sm:py-24">
	<div
		class="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,.72fr)] lg:gap-20"
	>
		<div class="max-w-3xl">
			<p class="section-eyebrow">{story.introLabel}</p>
			<h1 class="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-textcolor sm:text-5xl">
				{story.title}
			</h1>
			<p class="mt-6 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
				{story.description}
			</p>

			<div class="mt-10 border-t border-black/10 pt-8">
				<div class="max-w-2xl space-y-5">
					{#each historyText as paragraph}
						<p class="text-sm leading-7 text-secondary sm:text-base">{paragraph}</p>
					{/each}
				</div>
			</div>
		</div>

		<aside class="flex h-full flex-col gap-5" aria-label="Portret en video van Maria Hoogland">
			<div class="aspect-video overflow-hidden rounded-lg bg-black">
				<video
					class="h-full w-full bg-black object-cover"
					controls
					preload="metadata"
					playsinline
					aria-label="Video van Maria Hoogland"
				>
					<source src="/videos/linkedin-video.mp4" type="video/mp4" />
					<track
						kind="captions"
						src="/videos/linkedin-video.nl.vtt"
						srclang="nl"
						label="Nederlands"
					/>
					Uw browser ondersteunt deze video niet.
				</video>
			</div>

			<div class="mt-auto flex items-end gap-4 border-t border-black/10 pt-4">
				<img
					class="aspect-square w-20 rounded-tl-2xl rounded-br-2xl object-cover sm:w-24"
					src={maria?.image.src}
					alt={maria?.image.alt ?? 'Portret van Maria Hoogland'}
				/>
				<div class="pb-1">
					<p class="text-[0.68rem] font-light tracking-[0.28em] text-secondary uppercase">
						Architect
					</p>
					<h2 class="mt-1 text-lg font-semibold tracking-tight text-textcolor sm:text-xl">
						{maria?.name ?? 'Maria Hoogland'}
					</h2>
				</div>
			</div>
		</aside>
	</div>
</section>
