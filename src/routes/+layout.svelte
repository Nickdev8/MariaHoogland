<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>AMH – Architect Maria Hoogland</title>
	<meta name="robots" content="max-image-preview:large" />

	<link rel="icon" href="/images/LogoMAG2-120x120.png" sizes="32x32" />
	<link rel="icon" href="/images/LogoMAG2.png" sizes="192x192" />

	<link rel="dns-prefetch" href="//use.typekit.net" />
	<link rel="stylesheet" href="https://use.typekit.net/uyr3aws.css" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
	/>

	<link rel="stylesheet" href="/css/style.css" />
</svelte:head>

<Header />
{@render children()}
<Footer />
