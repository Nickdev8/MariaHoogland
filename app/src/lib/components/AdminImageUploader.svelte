<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let url: string;
	export let alt: string | null | undefined = '';
	export let label = 'Afbeelding';
	export let shape: 'square' | 'wide' | 'tall' | undefined = undefined;
	export let previewMode: 'default' | 'portfolio' = 'default';
	export let maxBytes = 25 * 1024 * 1024;
	export let accept: string[] = [
		'image/jpeg',
		'image/jpg',
		'image/pjpeg',
		'image/png',
		'image/x-png',
		'image/webp',
		'image/gif',
		'image/svg+xml',
		'image/avif'
	];

	const dispatch = createEventDispatcher();
	let dragging = false;
	let statusTone: 'idle' | 'success' | 'error' = 'idle';
	let statusMessage = '';
	let fileInput: HTMLInputElement | null = null;

	const normalizeUrl = (value: string | null | undefined) => {
		const trimmed = value?.trim() ?? '';
		if (!trimmed) return '';
		if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
		if (trimmed.startsWith('/')) return trimmed;
		return `/${trimmed}`;
	};

	$: previewSrc = normalizeUrl(url);
	$: description = alt?.trim() ?? '';
	const getAspectClass = () => {
		if (previewMode === 'portfolio') {
			if (shape === 'wide') return 'aspect-[3/2]';
			if (shape === 'tall') return 'aspect-[3/4]';
			if (shape === 'square') return 'aspect-square';
			return 'aspect-[4/3]';
		}
		if (shape === 'wide') return 'aspect-[3/2]';
		if (shape === 'tall') return 'aspect-[3/4]';
		if (shape === 'square') return 'aspect-square';
		return 'aspect-[4/3]';
	};

	$: aspectClass = getAspectClass();

	const openPicker = () => {
		fileInput?.click();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openPicker();
		}
	};

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		dragging = true;
	};

	const onDragLeave = (event: DragEvent) => {
		event.preventDefault();
		dragging = false;
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();
		dragging = false;
		handleFiles(event.dataTransfer?.files ?? null);
	};

	const setStatus = (tone: typeof statusTone, message: string) => {
		statusTone = tone;
		statusMessage = message;
		if (tone === 'success') {
			setTimeout(() => {
				if (statusTone === 'success') {
					statusTone = 'idle';
					statusMessage = '';
				}
			}, 2500);
		}
	};

	const handleFiles = async (fileList: FileList | null) => {
		const file = fileList?.[0];
		if (!file) return;
		if (!accept.includes(file.type)) {
			setStatus('error', 'Alleen afbeeldingsbestanden zijn toegestaan.');
			return;
		}
		if (file.size > maxBytes) {
			setStatus('error', 'Bestand is te groot (max 25 MB).');
			return;
		}
		setStatus('idle', '');
		try {
			const formData = new FormData();
			formData.set('file', file);
			const response = await fetch('/admin/upload', { method: 'POST', body: formData });
			const data = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
			if (!response.ok) {
				throw new Error(data?.message ?? 'Upload mislukt.');
			}
			if (!data?.url) {
				throw new Error('Upload mislukt.');
			}
			url = data.url;
			dispatch('change');
			setStatus('success', 'Upload voltooid.');
		} catch {
			setStatus('error', 'Upload mislukt.');
		}
	};
</script>

<div class="space-y-2">
	{#if label}
		<p class="field-label">{label}</p>
	{/if}
	<div
		class={`group relative w-full overflow-hidden border bg-stone transition-colors ${
			dragging ? 'border-primary bg-paper' : 'border-line hover:border-primary'
		} ${aspectClass}`}
		role="button"
		tabindex="0"
		aria-label="Sleep een afbeelding hierheen of kies een bestand"
		ondrop={onDrop}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		onclick={openPicker}
		onkeydown={onKeyDown}
	>
		{#if previewSrc}
			<img
				src={previewSrc}
				alt={description || `${label} afbeelding`}
				class="h-full w-full object-cover"
				loading="lazy"
				decoding="async"
			/>
		{:else}
			<div class="flex h-full items-center justify-center text-sm text-secondary">Geen afbeelding</div>
		{/if}
		<div class="absolute right-3 bottom-3 border border-line bg-white px-3 py-1.5 text-sm font-medium text-textcolor opacity-0 transition-opacity group-hover:opacity-100">
			{previewSrc ? 'Vervangen' : 'Afbeelding kiezen'}
		</div>
	</div>
	<input
		type="file"
		class="hidden"
		bind:this={fileInput}
		accept={accept.join(',')}
		onchange={(event) => handleFiles((event.currentTarget as HTMLInputElement).files)}
	/>
	{#if statusTone !== 'idle'}
		<p class={`text-sm ${statusTone === 'error' ? 'text-red-600' : 'text-primary'}`}>
			{statusMessage}
		</p>
	{/if}
</div>
