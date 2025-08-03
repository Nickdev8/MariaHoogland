<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from '@lucide/svelte';

	let formResult: { success?: boolean; message?: string; error?: string } = {};
	$: formResult = $page.form ?? {};

	let name = '';
	let email = '';
	let phone = '';
	let subject = '';
	let message = '';
</script>

<div class="bg-gray-50/50">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 px-6 py-24 lg:grid-cols-2">
		<!-- LEFT COLUMN: Contact Information -->
		<div class="max-w-xl lg:max-w-lg">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900">Neem contact op</h2>
			<p class="mt-4 text-lg leading-8 text-gray-600">
				Heeft u een vraag of wilt u een project bespreken? Vul het formulier in of neem direct
				contact op via onderstaande gegevens.
			</p>

			<div class="mt-10 space-y-6 text-base leading-7 text-gray-600">
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Adres</span>
						<MapPin class="h-7 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<p>Lagedijk 10e, 2064KT SPAARNDAM</p>
				</div>
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Telefoon</span>
						<PhoneIcon class="h-7 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<a href="tel:0645776029" class="hover:text-gray-900">06 45 77 60 29</a>
				</div>
				<div class="flex gap-x-4">
					<div class="flex-none">
						<span class="sr-only">Email</span>
						<MailIcon class="h-7 w-6 text-gray-400" aria-hidden="true" />
					</div>
					<a href="mailto:architect@mariahoogland.nl" class="hover:text-gray-900"
						>architect@mariahoogland.nl</a
					>
				</div>
			</div>

			<div class="mt-10 border-t border-gray-200 pt-10">
				<h3 class="text-base font-semibold text-gray-800">Bedrijfsgegevens</h3>
				<p class="mt-4 text-sm text-gray-500">
					Ir. ING Maria Hoogland<br />
					BNA lidnummer: 16076<br />
					Bureau Architectenregister: 1.070515.028<br />
					KvK-nummer: 34325681<br />
					BTW-nummer: NL 0020.80.940.B82
				</p>
			</div>
		</div>

		<!-- RIGHT COLUMN: Contact Form -->
		<form
			method="POST"
			use:enhance
			class="space-y-8 rounded-2xl bg-white p-8 shadow-lg lg:p-10"
		>
			<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
				<!-- Name -->
				<div>
					<label for="name" class="block text-sm font-semibold leading-6 text-gray-900">
						Naam
					</label>
					<div class="mt-2.5">
						<input
							type="text"
							name="name"
							id="name"
							bind:value={name}
							required
							class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
							placeholder="Uw volledige naam"
						/>
					</div>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-semibold leading-6 text-gray-900">
						E-mailadres
					</label>
					<div class="mt-2.5">
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							required
							class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
							placeholder="uwnaam@voorbeeld.nl"
						/>
					</div>
				</div>

				<!-- Phone -->
				<div>
					<label for="phone" class="block text-sm font-semibold leading-6 text-gray-900">
						Telefoonnummer
					</label>
					<div class="mt-2.5">
						<input
							type="tel"
							name="phone"
							id="phone"
							bind:value={phone}
							class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
							placeholder="+31 6 12345678"
						/>
					</div>
				</div>

				<!-- Subject -->
				<div>
					<label for="subject" class="block text-sm font-semibold leading-6 text-gray-900">
						Onderwerp
					</label>
					<div class="mt-2.5">
						<input
							type="text"
							name="subject"
							id="subject"
							bind:value={subject}
							required
							class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
							placeholder="Korte omschrijving"
						/>
					</div>
				</div>
			</div>

			<!-- Message -->
			<div class="sm:col-span-2">
				<label for="message" class="block text-sm font-semibold leading-6 text-gray-900"
					>Bericht</label
				>
				<div class="mt-2.5">
					<textarea
						name="message"
						id="message"
						bind:value={message}
						rows="6"
						required
						class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
						placeholder="Laat hier uw bericht achter..."
					></textarea>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="mt-10">
				<button
					type="submit"
					class="block w-full rounded-md bg-sky-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
				>
					Bericht versturen
				</button>
			</div>

			<!-- Feedback Message -->
			{#if formResult.success}
				<div
					class="rounded-md border border-green-300 bg-green-50 p-4 text-center"
					role="alert"
				>
					<p class="text-sm font-medium text-green-800">{formResult.message}</p>
				</div>
			{:else if formResult.error}
				<div class="rounded-md border border-red-300 bg-red-50 p-4 text-center" role="alert">
					<p class="text-sm font-medium text-red-800">{formResult.error}</p>
				</div>
			{/if}
		</form>
	</div>
</div>