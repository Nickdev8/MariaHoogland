<script lang="ts">
	import { Globe, PenTool, Users, Lightbulb } from '@lucide/svelte';
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
</script>

<div class="bg-white py-16 sm:py-20">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-3xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-sky-600">{about.introLabel}</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {about.title}
      </p>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        {about.description}
      </p>
    </div>

    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-10 gap-y-12 lg:max-w-none lg:grid-cols-2">
        {#each about.features as feature}
          <div class="relative pl-16">
            <dt class="text-base font-semibold leading-7 text-gray-900">
              <div class="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50">
                <svelte:component this={resolveIcon(feature.icon)} class="h-5 w-5 text-sky-700" />
              </div>
              {feature.title}
            </dt>
            <dd class="mt-2 text-base leading-7 text-gray-600">
              {feature.description}
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</div>

<div class="bg-gray-50/50 py-20 sm:py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{about.team.title}</h2>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        {about.team.description}
      </p>
    </div>
    <div class="mt-12 flex justify-center">
      <ul role="list" class="max-w-md">
        {#each about.team.members as member}
          <li>
            <img class="aspect-[1/1] w-full rounded-2xl object-cover" src={member.image.src} alt={member.image.alt}>
            <h3 class="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{member.name}</h3>
            <p class="text-base leading-7 text-gray-600">{member.role}</p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
