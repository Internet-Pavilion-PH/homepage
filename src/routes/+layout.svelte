<script lang="ts">
	import '../app.css';
	const src = `/lbd2.svg`;
	

	let { children } = $props();
	const favicon = `https://internetpavilion2025.web.app/icon.svg`;
</script>

<svelte:head>
	<!-- Use the project image as favicon; base ensures it works from a subpath -->
	<title>Low Bandwidth Dreams</title>
	<link rel="icon" type="image/png" href={favicon} />
	<link rel="shortcut icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
</svelte:head>

<header class="bg-green-700 text-amber-50">
	<div class="max-w-5xl mx-auto flex flex-col items-center text-center gap-4 py-6 px-4">
		<!-- Centered logo -->
		<a href="/" aria-label="Low Bandwidth Dreams home" class="shrink-0">
			<img
				src={src}
				alt="Low Bandwidth Dreams logo"
				loading="lazy"
				class="h-12 w-auto object-contain mx-auto md:h-16 lg:h-20"
			/>
		</a>

		<!-- Centered title and subtitle -->
		<div>
			<!-- <h1 class="text-2xl font-bold text-amber-50">Low Bandwidth Dreams</h1> -->
			<!-- <p class="text-sm text-amber-100">A tiny site for the Internet Pavilion PH</p> -->
		</div>

		<!-- Centered navigation -->
		<nav aria-label="Main navigation" class="flex flex-wrap gap-4 justify-center">
			<a href="/" class=" text-amber-50 text-lg">ESC 2025</a>
			<a href="/notes" class=" text-amber-50 text-lg">Notes</a>
			<a href="/info" class=" text-amber-50 text-lg">About</a>
			<a href="/participants" class=" text-amber-50 text-lg">Participants</a>
		</nav>
	</div>
</header>

<main class="bg-green-700 text-white min-h-screen">
	{@render children?.()}
</main>

<footer class="bg-green-700 text-amber-50">
	<div class="max-w-5xl mx-auto text-center py-6 px-4">
		<nav aria-label="Footer navigation" class="flex flex-wrap gap-4 justify-center">
			<a href="https://internetpavilion2024.web.app/" class="underline text-amber-50">IP 2024</a>
			<a href="https://internetpavilion2025.web.app/" class="underline text-amber-50">IP 2025</a>
			<a href="https://github.com/Internet-Pavilion-PH" class="underline text-amber-50">GitHub Org</a>
		</nav>
	</div>
</footer>
