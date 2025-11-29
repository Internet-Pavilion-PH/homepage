<script lang="ts">
    import * as Papa from 'papaparse';
    import { onMount } from 'svelte';

    // Public CSV export URL (Google Sheets published as CSV)
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEdKEDTTuFtg3hBpqhwPApiiTk6o0d3VxO5Gb6TqFp7Spt4XrKpBnwYITbTDAqZT-kYzQWw-KbplfI/pub?gid=0&single=true&output=csv';

    let plants: any[] = [];
    let status: string = '';

    const BASE_IMAGE_URL = 'https://streetkonect.com/storage/object_curator/powerplant';

    // Build a full URL for an image filename.
    function imageUrl(filename: string) {
        if (!filename) return '';
        if (/^https?:\/\//.test(filename)) return filename;
        return `${BASE_IMAGE_URL.replace(/\/$/, '')}/${encodeURIComponent(filename)}`;
    }

    onMount(async () => {
        try {
            status = 'Fetching CSV...';
            const res = await fetch(csvUrl);
            const data = await res.text();
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (h: any) => (h ?? '').toString().trim(),
                transform: (v: any) => (v ?? '').toString().trim()
            });
            plants = Array.isArray(results.data) ? results.data : [];
            status = `Loaded ${plants.length} rows`;
        } catch (err) {
            console.error('Failed to load CSV', err);
            status = 'Error loading CSV';
        }
    });
</script>

<main class="min-h-screen flex flex-col items-center p-6">
    <div class="text-center max-w-2xl">
        <h1 class="text-3xl font-bold mb-2">Power Plant</h1>
        <p class="text-lg text-gray-200">a medicinal plant cataloging project by Luyo_Space</p>
         <p class="text-lg text-gray-200">instead of producing a general pamplet we started with what is the readily available in the local community.</p>
          <p class="text-lg text-gray-200">Below are sketches by visitng artists and community members. These plants are found in the local community. This is a work in progress and this site is constantly updating as well as its data.  </p>
      <p class="text-lg text-gray-200">This page in the future would have a pdf export that can be easily distributed back to the Luyo_Space community.</p>
        </div>

    <div class="w-full max-w-6xl mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {#each plants as plant}
                <article class="bg-lime-950 rounded-lg overflow-hidden shadow-lg w-full flex flex-col items-center">
                    {#if plant.image}
                            <img src="{imageUrl(plant.image)}" alt="{plant.english_name || plant.local_name || `Plant ${plant.item_no}` }" class="w-full object-cover rounded-t-lg" style="aspect-ratio:3/4;" />
                    {:else}
                            <div class="w-full flex items-center justify-center bg-green-700 text-gray-300 rounded-t-lg" style="aspect-ratio:3/4;">No image</div>
                    {/if}
                    <div class="p-4 text-center">
                        <div class="text-xs text-green-500">#{plant.item_no}</div>
                        <div class="mt-2 text-left">
                            <div class="text-sm text-gray-100"><span class="font-semibold">Local name:</span> {plant.local_name}</div>
                            <div class="text-sm text-gray-100"><span class="font-semibold">English name:</span> {plant.english_name}</div>
                            <div class="mt-2 text-sm text-gray-300"><span class="font-semibold">Draftsperson:</span> {plant.draftsperson}</div>
                             <div class="mt-2 text-sm text-gray-300"><span class="font-semibold">For:</span> {plant.for}</div>
                            <div class="mt-1 text-sm text-gray-300"><span class="font-semibold">Status:</span> {plant.status}</div>
                        </div>
                    </div>
                </article>
            {/each}
        </div>
    </div>

</main>