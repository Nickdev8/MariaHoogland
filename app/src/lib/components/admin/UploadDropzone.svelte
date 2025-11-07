<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ select: { file: File; dataUrl: string } }>();

	let fileInput: HTMLInputElement | null = null;

	export let label = 'Upload afbeelding';
	export let value: string | null = null;

	const triggerSelect = () => {
		fileInput?.click();
	};

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const file = files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = typeof reader.result === 'string' ? reader.result : '';
			dispatch('select', { file, dataUrl });
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer) {
			handleFiles(event.dataTransfer.files);
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};

	const handleChange = (event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		handleFiles(input.files);
	};
</script>

<button
    type="button"
    class="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 px-4 py-6 text-center text-xs uppercase tracking-[0.28em] text-neutral-500 transition hover:border-primary hover:bg-primary/5"
    onclick={triggerSelect}
    ondrop={handleDrop}
    ondragover={handleDragOver}
>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleChange}
	/>
 
	{#if value}
		<div class="mb-3 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
			<img src={value} alt={label} class="h-32 w-full object-cover" />
		</div>
	{/if}

	<p class="font-semibold text-neutral-600 group-hover:text-primary">{label}</p>
	<span class="mt-1 text-[10px] text-neutral-400">Klik of sleep bestand</span>
</button>
