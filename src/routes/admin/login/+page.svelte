<script lang="ts">
	import { page } from '$app/stores';

	const formResult = $derived($page.form ?? {});
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-16">
	<div class="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl">
		<h1 class="font-display text-2xl uppercase tracking-[0.35em] text-primary">Admin</h1>
		<p class="mt-3 text-sm text-white/80">Voer het gedeelde wachtwoord in om het beheerpaneel te openen.</p>
		<form method="POST" class="mt-8 space-y-6">
			<label class="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
				<span>Wachtwoord</span>
				<input
					type="password"
					name="password"
					required
					class="rounded-full border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
					placeholder="••••••••"
					autocomplete="current-password"
				/>
			</label>
			<button
				type="submit"
				class="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-950 transition hover:bg-primary-strong hover:text-white"
			>
				Log in
			</button>
			{#if formResult?.error}
				<p class="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
					{formResult.error}
				</p>
			{/if}
		</form>
	</div>
</div>
