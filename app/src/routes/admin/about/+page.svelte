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
			<section class="editor-panel">
				<h2 class="editor-panel-title">Intro</h2>
				<div class="mt-5 space-y-4">
					<div>
						<label for="about-intro-label" class="field-label">Intro label</label>
						<input id="about-intro-label" class="field mt-2" bind:value={about.introLabel} />
					</div>
					<div>
						<label for="about-title" class="field-label">Titel</label>
						<input id="about-title" class="field mt-2" bind:value={about.title} />
					</div>
					<div>
						<label for="about-description" class="field-label">Beschrijving</label>
						<textarea id="about-description" rows="5" class="field mt-2" bind:value={about.description}></textarea>
					</div>
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Historieblokken</h2>
				<div class="mt-5 space-y-4">
					{#each about.features as feature, index}
						<div class="border border-line p-4">
							<div class="grid gap-3 md:grid-cols-3">
								<select class="field" bind:value={feature.icon}>
									{#each iconOptions as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
								<input class="field" placeholder="Titel" bind:value={feature.title} />
								<input class="field" placeholder="Korte omschrijving" bind:value={feature.description} />
							</div>
							<button type="button" class="mt-3 text-sm font-medium text-red-600" on:click={() => removeFeature(index)}>Verwijder blok</button>
						</div>
					{/each}
					<button type="button" class="plain-action" on:click={addFeature}>+ Blok</button>
				</div>
			</section>

			<section class="editor-panel">
				<h2 class="editor-panel-title">Maria profiel</h2>
				<div class="mt-5 space-y-4">
					<div>
						<label for="team-title" class="field-label">Sectietitel</label>
						<input id="team-title" class="field mt-2" bind:value={about.team.title} />
					</div>
					<div>
						<label for="team-description" class="field-label">Beschrijving</label>
						<textarea id="team-description" rows="3" class="field mt-2" bind:value={about.team.description}></textarea>
					</div>
					{#each about.team.members as member, index}
						<div class="border border-line p-4">
							<AdminImageUploader label={`Profielfoto ${index + 1}`} bind:url={member.image.src} bind:alt={member.image.alt} />
							<div class="mt-4 grid gap-3 md:grid-cols-2">
								<input class="field" placeholder="Naam" bind:value={member.name} />
								<input class="field" placeholder="Rol" bind:value={member.role} />
							</div>
							<button type="button" class="mt-3 text-sm font-medium text-red-600" on:click={() => removeMember(index)}>Verwijder profiel</button>
						</div>
					{/each}
					<button type="button" class="plain-action" on:click={addMember}>+ Profiel</button>
				</div>
			</section>
		</form>
		<AdminSaveDock {dirty} {pending} {formId} {successMessage} {errorMessage} />
	</AdminShell>
{/if}
