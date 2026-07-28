<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import AdminImageUploader from '$lib/components/AdminImageUploader.svelte';
	import AdminSaveDock from '$lib/components/admin/AdminSaveDock.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import type { AboutContent } from '$lib/types/content';
	import type { PageData } from './$types';

	type FormState = { error?: string; success?: boolean } | undefined;

	export let data: PageData;
	export let form: FormState = undefined;

	let about: AboutContent = data.authenticated && data.content ? structuredClone(data.content.about) : ({} as AboutContent);
	let baseline = data.authenticated && data.content ? JSON.stringify(data.content.about) : '';
	let pending = false;
	let successMessage = form?.success ? 'Opgeslagen.' : '';
	let errorMessage = form?.error ?? '';
	const formId = 'admin-about-form';
	const iconOptions = ['Globe', 'PenTool', 'Users', 'Lightbulb'];

	$: dirty = data.authenticated ? JSON.stringify(about) !== baseline : false;

	const saveEnhancer: SubmitFunction = ({ formData }) => {
		pending = true;
		successMessage = '';
		errorMessage = '';
		formData.set('payload', JSON.stringify({ about }));
		return async ({ result, update }) => {
			pending = false;
			if (result.type === 'success') {
				await update({ reset: false, invalidateAll: false });
				baseline = JSON.stringify(about);
				successMessage = 'Opgeslagen.';
			} else if (result.type === 'failure') {
				await update({ reset: false, invalidateAll: false });
				errorMessage = typeof result.data?.error === 'string' ? result.data.error : 'Opslaan mislukt.';
			} else {
				await update();
			}
		};
	};

	const addFeature = () => {
		about = { ...about, features: [...about.features, { icon: 'Globe', title: '', description: '' }] };
	};
	const removeFeature = (index: number) => {
		const remaining = about.features.filter((_item, i) => i !== index);
		about = { ...about, features: remaining.length ? remaining : [{ icon: 'Globe', title: '', description: '' }] };
	};
	const addMember = () => {
		about = {
			...about,
			team: {
				...about.team,
				members: [...about.team.members, { name: '', role: '', image: { src: '', alt: '' } }]
			}
		};
	};
	const removeMember = (index: number) => {
		const remaining = about.team.members.filter((_item, i) => i !== index);
		about = {
			...about,
			team: {
				...about.team,
				members: remaining.length ? remaining : [{ name: '', role: '', image: { src: '', alt: '' } }]
			}
		};
	};
</script>

{#if data.authenticated}
	<AdminShell title="Over mij bewerken" subtitle="Introductie, bureauverhaal en Maria’s profiel." active="about">
		<form id={formId} method="post" action="?/save" use:enhance={saveEnhancer} class="space-y-6">
			<input type="hidden" name="payload" />
			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Intro</p>
				<div class="mt-5 space-y-4">
					<div>
						<label for="about-intro-label" class="block text-sm font-medium text-neutral-700">Intro label</label>
						<input id="about-intro-label" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={about.introLabel} />
					</div>
					<div>
						<label for="about-title" class="block text-sm font-medium text-neutral-700">Titel</label>
						<input id="about-title" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={about.title} />
					</div>
					<div>
						<label for="about-description" class="block text-sm font-medium text-neutral-700">Beschrijving</label>
						<textarea id="about-description" rows="5" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={about.description}></textarea>
					</div>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Historieblokken</p>
				<div class="mt-5 space-y-4">
					{#each about.features as feature, index}
						<div class="rounded-2xl border border-black/10 p-4">
							<div class="grid gap-3 md:grid-cols-3">
								<select class="rounded-2xl border border-black/10 px-4 py-3" bind:value={feature.icon}>
									{#each iconOptions as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
								<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Titel" bind:value={feature.title} />
								<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Korte omschrijving" bind:value={feature.description} />
							</div>
							<button type="button" class="mt-3 text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeFeature(index)}>Verwijder blok</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addFeature}>+ Blok</button>
				</div>
			</section>

			<section class="rounded-3xl border border-black/10 bg-white p-6">
				<p class="section-eyebrow">Maria profiel</p>
				<div class="mt-5 space-y-4">
					<div>
						<label for="team-title" class="block text-sm font-medium text-neutral-700">Sectietitel</label>
						<input id="team-title" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={about.team.title} />
					</div>
					<div>
						<label for="team-description" class="block text-sm font-medium text-neutral-700">Beschrijving</label>
						<textarea id="team-description" rows="3" class="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3" bind:value={about.team.description}></textarea>
					</div>
					{#each about.team.members as member, index}
						<div class="rounded-2xl border border-black/10 p-4">
							<AdminImageUploader label={`Profielfoto ${index + 1}`} bind:url={member.image.src} bind:alt={member.image.alt} />
							<div class="mt-4 grid gap-3 md:grid-cols-2">
								<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Naam" bind:value={member.name} />
								<input class="rounded-2xl border border-black/10 px-4 py-3" placeholder="Rol" bind:value={member.role} />
							</div>
							<button type="button" class="mt-3 text-xs uppercase tracking-[0.2em] text-red-500" on:click={() => removeMember(index)}>Verwijder profiel</button>
						</div>
					{/each}
					<button type="button" class="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em]" on:click={addMember}>+ Profiel</button>
				</div>
			</section>
		</form>
		<AdminSaveDock {dirty} {pending} {formId} {successMessage} {errorMessage} />
	</AdminShell>
{/if}
