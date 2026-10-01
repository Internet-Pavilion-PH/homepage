<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	const rawUrl = 'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/manila_lights.md';
	const imageBaseUrl = 'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/ManilaLights/';

	let html = '';
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch(rawUrl);
			if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

			const markdown = await response.text();
			const resolvedMarkdown = markdown.replace(
				/(!\[[^\]]*\]\()(ManilaLights\/)([^)]+)\)/g,
				(_, prefix, _directory, filename) => `${prefix}${imageBaseUrl}${filename})`
			);
			const parsed = await marked.parse(resolvedMarkdown);
			const DOMPurify = (await import('dompurify')).default;
			html = DOMPurify.sanitize(parsed);
		} catch (caught) {
			error = String(caught);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Manila Lights | Low Bandwidth Dreams</title>
</svelte:head>

<main class="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
	{#if loading}
		<p class="py-12 text-center text-2xl text-amber-50">Loading Manila Lights...</p>
	{:else if error}
		<p class="py-12 text-center text-2xl text-amber-100">Unable to load the project note: {error}</p>
	{:else}
		<article class="manila-lights-content" aria-label="Manila Lights project note">
			{@html html}
		</article>
	{/if}
</main>

<style>
	:global(.manila-lights-content) {
		font-size: clamp(1.4rem, 3vw, 2rem);
		line-height: 1.25;
	}

	:global(.manila-lights-content p:first-child) {
		margin-bottom: 2rem;
		text-align: center;
	}

	:global(.manila-lights-content a) {
		color: #fff7d6;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	:global(.manila-lights-content img) {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 auto 2rem;
		border: 1px solid rgba(255, 247, 214, 0.45);
	}

	:global(.manila-lights-content p:has(img)) {
		margin: 0;
	}
</style>
