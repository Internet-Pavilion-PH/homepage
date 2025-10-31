<script>
	import { base } from '$app/paths';
	const src = `${base}/lbd.svg`;
	const cyber_purok = `${base}/cyber_purok.png`;
	const powerplant = `${base}/powerplant.png`;
</script>

<main class="min-h-screen w-full flex flex-col bg-white overflow-x-hidden">
	<section id="hero" class="flex-1 flex items-center justify-center">
		<img
			src={src}
			alt="lbd"
			loading="lazy"
			class="w-auto h-auto max-w-full max-h-[90vh] lg:max-w-[80vw] lg:max-h-[80vh] block object-contain"
		/>
	</section>

	<section id="about" class="flex flex-col items-center justify-center w-full">
		<div class="max-w-4xl mx-auto py-6 px-4">

			<a href="/info" class="text-center text-green-700 underline text-xl block">
				About Low Bandwidth Dreams
			</a>
			<a href="https://internetpavilion2024.web.app/" class="text-center text-green-700 underline text-xl block">
				ph islands internet pavilion2024
			</a>

			<a href="https://internetpavilion2025.web.app/" class="text-center text-green-700 underline text-xl block">
				ph islands internet pavilion2025
			</a>
			
			<a href="https://github.com/Internet-Pavilion-PH" class="text-center text-green-700 underline text-xl block">
				github org
			</a>
			
		</div>
	</section>

<section id="about" class="flex flex-col items-center justify-center bg-emerald-800 text-amber-50 py-5 w-full">

	<div class="max-w-6xl mx-auto px-4">


	<h1 class= " font-bold text-center text-4xl">ESC Biennale projects</h1>

	

	<a href="https://cyberpurok.lowbandwidthdreams.com/">
		<img
			src={cyber_purok}
			alt="lbd"
			loading="lazy"
			class="w-auto h-auto mx-auto max-w-full max-h-[90vh] lg:max-w-[80vw] lg:max-h-[80vh] block object-contain"
		/>
	</a>

	
			<a href="https://yellowbasket.lowbandwidthdreams.com/" class="text-center text-amber-50 text-8xl block">
				Yellow Basket
			</a>

			
			<a href="/">
		<img
			src={powerplant}
			alt="lbd"
			loading="lazy"
			class="w-auto h-auto mx-auto max-w-full max-h-[90vh] lg:max-w-[80vw] lg:max-h-[80vh] block object-contain"
		/>
	</a>

			<a href="/" class="text-center text-amber-50 text-8xl block">
				Panawagan Banner
			</a>

			<a href="/" class="text-center text-amber-50 text-8xl block">
				Drop_Call
			</a>

			<a href="/" class="text-center text-amber-50 text-8xl block">
				Aninipot
			</a>

	</div>

</section>

</main>