<script lang="ts">
	import type { AboutContent } from '$lib/types/content';

	export let data: { about: AboutContent };
	const maria = data.about.team.members[0];
	const story = {
		introLabel: 'Over Maria Hoogland',
		title: 'Een persoonlijk bureau met een heldere geschiedenis',
		description:
			'Deze pagina wordt de rustige introductie van Maria Hoogland en Architectuur AMH. Hier vertellen we straks wie Maria is, hoe het bureau is ontstaan en waarom persoonlijke begeleiding, duidelijke lijnen en zorgvuldig ontwerpen al jaren de basis vormen van de praktijk.'
	};
	const historyText = [
		'Hier komt straks een kort hoofdstuk over de geschiedenis van Architectuur AMH: hoe Maria Hoogland haar bureau heeft opgebouwd, welke ervaringen daarbij bepalend waren en hoe daaruit een persoonlijke ontwerppraktijk is ontstaan.',
		'Daarnaast is dit de plek voor een tweede alinea over de ontwikkeling van het bureau door de jaren heen, met ruimte voor de visie van nu en de manier waarop Maria opdrachtgevers vandaag begeleidt.'
	];
	const bio = 'Persoonlijke begeleiding, heldere keuzes en rustige architectuur.';
</script>

<section class="bg-[#f5f8fc]">
	<div class="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-7xl items-center px-6 py-10 lg:px-8">
		<div class="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
			<div class="max-w-2xl">
				<p class="section-eyebrow">{story.introLabel}</p>
				<h1 class="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-textcolor sm:text-5xl">
					{story.title}
				</h1>
				<p class="mt-6 max-w-xl text-base leading-8 text-secondary sm:text-lg">
					{story.description}
				</p>

				<div class="mt-10 border-t border-black/10 pt-8">
					<div class="max-w-xl space-y-5">
						{#each historyText as paragraph}
							<p class="text-sm leading-7 text-secondary sm:text-base">
								{paragraph}
							</p>
						{/each}
					</div>
				</div>
			</div>

			<div class="lg:justify-self-end">
				<div class="grid gap-5">
					<div class="relative overflow-hidden rounded-xl bg-[#e8eef6]">
						<img
							class="aspect-[4/4.8] w-full object-cover object-[center_42%]"
							src={maria?.image.src}
							alt={maria?.image.alt ?? 'Portret van Maria Hoogland'}
						/>
					</div>

					<div class="border-t border-black/10 pt-5">
						<div>
							<p class="text-[0.68rem] font-light tracking-[0.28em] text-secondary uppercase">
								Architect
							</p>
							<h2 class="mt-2 text-2xl font-semibold tracking-tight text-textcolor sm:text-[2rem]">
								{maria?.name ?? 'Maria Hoogland'}
							</h2>
						</div>
						<p class="mt-3 max-w-sm text-sm leading-7 text-secondary">
							{bio}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
