<script lang="ts">
	import type { AboutContent } from '$lib/types/content';

	export let data: { about: AboutContent };
	const maria = data.about.team.members[0];
</script>

<section class="bg-paper">
	<div class="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
		<div class="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
			<div class="max-w-2xl">
				<p class="section-kicker">{data.about.introLabel}</p>
				<h1 class="mt-3 max-w-xl text-4xl font-semibold leading-tight text-textcolor sm:text-5xl">
					{data.about.title}
				</h1>
				<p class="mt-6 max-w-xl text-base leading-8 text-secondary sm:text-lg">
					{data.about.description}
				</p>

				<div class="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
					{#each data.about.features as feature}
						<article class="bg-white p-5">
							<h2 class="text-base font-semibold text-textcolor">{feature.title}</h2>
							<p class="mt-3 text-sm leading-7 text-secondary">{feature.description}</p>
						</article>
					{/each}
				</div>

				<figure class="mt-10 border-t border-line pt-6">
					<img
						src="/images/IMG_1877.JPG"
						alt="Maria Hoogland aan het werk aan tafel met tekeningen"
						class="aspect-[4/3] w-full max-w-xl object-cover"
						loading="lazy"
					/>
					<figcaption class="mt-3 text-sm leading-6 text-secondary">
						Maria aan het werk: persoonlijk betrokken bij ontwerp, tekenwerk en overleg.
					</figcaption>
				</figure>
			</div>

			<div class="lg:justify-self-end">
				<div class="grid gap-5">
					<div class="relative overflow-hidden bg-stone">
						<img
							class="aspect-[4/4.8] w-full object-cover object-center"
							src={maria?.image.src}
							alt={maria?.image.alt ?? 'Portret van Maria Hoogland'}
						/>
					</div>

					<div class="border-t border-line pt-5">
						<div>
							<h2 class="mt-2 text-2xl font-semibold text-textcolor sm:text-[2rem]">
								{maria?.name ?? 'Maria Hoogland'}
							</h2>
							<p class="mt-1 text-sm text-secondary">{maria?.role ?? 'Architect'}</p>
						</div>
						<p class="mt-3 max-w-sm text-sm leading-7 text-secondary">
							{data.about.team.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
