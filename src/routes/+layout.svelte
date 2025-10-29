<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
	const favicon = `${base}/lbd1.png`;
</script>

<svelte:head>
	<!-- Use the project image as favicon; base ensures it works from a subpath -->
	<title>Low Bandwidth Dreams</title>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="shortcut icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
</svelte:head>

{@render children?.()}
