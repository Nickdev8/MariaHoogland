<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import XHRUpload from '@uppy/xhr-upload';
	import '@uppy/core/css/style.css';
	import '@uppy/dashboard/css/style.css';

	const MAX_SIZE_BYTES = 25 * 1024 * 1024;
	const MAX_SIZE_LABEL = '25 MB';
	const SUPPORTED_FORMAT_LABEL = 'JPG, PNG, WEBP, GIF, SVG, AVIF';

	export let url: string;
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

	let uppy: Uppy | null = null;
	let dashboardRoot: HTMLDivElement | null = null;
	let statusTone: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
	let statusMessage = '';

	const setStatus = (tone: typeof statusTone, message: string) => {
		statusTone = tone;
		statusMessage = message;
	};

	const buildFriendlyError = (error: unknown, response?: { status?: number; body?: unknown }) => {
		const status = response?.status;
		const body = response?.body as { message?: string; error?: string } | undefined;
		if (status === 413) {
			return `Bestand is te groot (maximaal ${MAX_SIZE_LABEL}).`;
		}
		if (status === 415) {
			return `Alleen ${SUPPORTED_FORMAT_LABEL} bestanden zijn toegestaan.`;
		}
		if (status === 401 || status === 403) {
			return 'Je sessie is verlopen. Log opnieuw in en probeer het opnieuw.';
		}
		if (body?.message || body?.error) {
			return body.message ?? body.error ?? 'Upload mislukt.';
		}
		if (error instanceof Error) {
			return error.message || 'Upload mislukt.';
		}
		return 'Upload mislukt.';
	};

	onMount(() => {
		if (!dashboardRoot) return;
		uppy = new Uppy({
			autoProceed: true,
			restrictions: {
				maxNumberOfFiles: 1,
				maxFileSize: MAX_SIZE_BYTES,
				allowedFileTypes: accept
			}
		});

		uppy.use(Dashboard, {
			inline: true,
			target: dashboardRoot,
			proudlyDisplayPoweredByUppy: false,
			height: 180,
			hideUploadButton: true,
			hideRetryButton: true,
			hideCancelButton: true,
			hidePauseResumeButton: true,
			showProgressDetails: true,
			note: `Max ${MAX_SIZE_LABEL}. ${SUPPORTED_FORMAT_LABEL}.`
		});

		uppy.use(XHRUpload, {
			endpoint: '/admin/upload',
			fieldName: 'file',
			responseType: 'json'
		});

		uppy.on('upload', () => {
			setStatus('uploading', 'Bezig met uploaden...');
		});

		uppy.on('upload-success', (_file, response) => {
			const body = response?.body as { url?: string } | undefined;
			if (body?.url) {
				url = body.url;
			}
			setStatus('success', 'Upload voltooid.');
		});

		uppy.on('upload-error', (_file, error, response) => {
			setStatus('error', buildFriendlyError(error, response ?? undefined));
		});
	});

	onDestroy(() => {
		uppy?.close({ reason: 'unmount' });
		uppy = null;
	});
</script>

<div class="uppy-shell text-xs text-neutral-500">
	<div class="uppy-embed" bind:this={dashboardRoot}></div>
	{#if statusTone !== 'idle'}
		<p
			class={`mt-2 text-xs ${
				statusTone === 'error'
					? 'text-red-600'
					: statusTone === 'success'
						? 'text-emerald-600'
						: 'text-neutral-500'
			}`}
		>
			{statusMessage}
		</p>
	{/if}
	{#if url}
		<p class="mt-2 truncate text-xs text-neutral-400">Huidige waarde: {url}</p>
	{/if}
</div>

<style>
	.uppy-shell :global(.uppy-Dashboard) {
		--uppy-theme-color: #e11d48;
		--uppy-theme-background-color: #fff7f9;
		--uppy-dashboard-padding: 12px;
		--uppy-border-radius: 16px;
		--uppy-font-family: inherit;
	}

	.uppy-shell :global(.uppy-Dashboard-inner) {
		border: 1px dashed #e2e8f0;
		background: #fff7f9;
	}

	.uppy-shell :global(.uppy-Dashboard-AddFiles-title) {
		font-size: 0.85rem;
		font-weight: 600;
		color: #111827;
	}

	.uppy-shell :global(.uppy-Dashboard-note) {
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #9ca3af;
	}

	.uppy-shell :global(.uppy-Dashboard-browse) {
		color: #be123c;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.uppy-shell :global(.uppy-Dashboard-Item-name) {
		font-size: 0.8rem;
		color: #111827;
	}

	.uppy-shell :global(.uppy-StatusBar) {
		background: #fff;
		border-top: 1px solid #f1f5f9;
	}
</style>
