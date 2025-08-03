<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	// 👇 import Lucide icons
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';

	let formResult: { success?: boolean; message?: string; error?: string } = {};
	$: formResult = $page.form ?? {};

	let name = '';
	let email = '';
	let phone = '';
	let subject = '';
	let message = '';
</script>

<div
	style="
			background-image: url('/images/mainbg.png');
			background-position: center left;
			background-repeat: no-repeat;"
>
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2">
		<!-- LEFT COLUMN: static contact info -->
		<div class="space-y-4">
			<h2 class="text-4xl font-semibold text-sky-400">Contact</h2>
			<p class="text-gray-700">Ir. ING Maria Hoogland</p>
			<p class="text-gray-600">
				BNA lidnummer 16076<br />
				Bureau Architectenregister 1.070515.028<br />
				BTW nr. NL 0020.80.940.B82<br />
				Kamer van Koophandel nummer: 34325681
			</p>

			<p class="inline-flex items-center text-gray-700">
				<!-- Lucide MapPin -->
				<MapPin class="mr-2 h-5 w-5 text-gray-500" />
				Lagedijk 10e 2064KT SPAARNDAM
			</p>

			<p class="inline-flex items-center font-medium text-sky-600">
				<!-- Lucide Phone -->
				<PhoneIcon class="mr-2 h-5 w-5" />
				0645776029
			</p>

			<p class="inline-flex items-center text-gray-700">
				<!-- Lucide Mail -->
				<MailIcon class="mr-2 h-5 w-5 text-gray-500" />
				architect@mariahoogland.nl
			</p>
		</div>

		<!-- RIGHT COLUMN: the form -->
		<form method="POST" use:enhance class="space-y-6 rounded-lg bg-white p-8">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- Naam -->
				<div>
					<label for="name" class="mb-1 block text-gray-600"> Naam </label>
					<input
						id="name"
						name="name"
						type="text"
						bind:value={name}
						required
						class="w-full border-b border-gray-300 pb-1 outline-none focus:border-sky-400"
						placeholder="Uw naam"
					/>
				</div>

				<!-- E-mail -->
				<div>
					<label for="email" class="mb-1 block text-gray-600"> E-mail </label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						required
						class="w-full border-b border-gray-300 pb-1 outline-none focus:border-sky-400"
						placeholder="naam@voorbeeld.nl"
					/>
				</div>

				<!-- Telefoon -->
				<div>
					<label for="phone" class="mb-1 block text-gray-600"> Telefoon </label>
					<input
						id="phone"
						name="phone"
						type="tel"
						bind:value={phone}
						class="w-full border-b border-gray-300 pb-1 outline-none focus:border-sky-400"
						placeholder="+31612345678"
					/>
				</div>

				<!-- Onderwerp -->
				<div>
					<label for="subject" class="mb-1 block text-gray-600"> Onderwerp </label>
					<input
						id="subject"
						name="subject"
						type="text"
						bind:value={subject}
						required
						class="w-full border-b border-gray-300 pb-1 outline-none focus:border-sky-400"
						placeholder="Onderwerp van uw bericht"
					/>
				</div>
			</div>

			<!-- Uw bericht (full width) -->
			<div>
				<label for="message" class="mb-1 block text-gray-600"> Uw bericht </label>
				<textarea
					id="message"
					name="message"
					bind:value={message}
					rows="5"
					required
					class="w-full border-b border-gray-300 pb-1 outline-none focus:border-sky-400"
					placeholder="Typ hier uw bericht…"
				></textarea>
			</div>

			<!-- Submit -->
			<button
				type="submit"
				class="mt-4 rounded-md bg-sky-600 px-6 py-3 font-medium text-white shadow hover:bg-sky-700"
			>
				Versturen
			</button>

			<!-- Feedback -->
			{#if formResult.success}
				<p class="mt-4 text-green-600">
					{formResult.message}
				</p>
			{:else if formResult.error}
				<p class="mt-4 text-red-600">
					{formResult.error}
				</p>
			{/if}
		</form>
	</div>
</div>
