<script lang="ts">
	import '../app.css';
	

	let { children } = $props();
	const favicon = `/lbd.svg`;
</script>

<svelte:head>
	<!-- Use the project image as favicon; base ensures it works from a subpath -->
	<title>Low Bandwidth Dreams</title>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="shortcut icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
</svelte:head>

{@render children?.()}
