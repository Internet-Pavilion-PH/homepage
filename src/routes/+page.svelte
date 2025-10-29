<script>
	import { base } from '$app/paths';
	const src = `${base}/lbd1.png`;
</script>

<main class="min-h-screen flex items-center justify-center p-4 bg-white">
	<img
		src={src}
		alt="lbd1"
		loading="lazy"
		class="max-w-full w-[min(90vw,800px)] h-auto block"
	/>
</main>