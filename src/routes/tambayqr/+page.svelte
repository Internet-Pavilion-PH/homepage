<script lang="ts">
  import Qr from '$lib/Qr.svelte';
  import { onMount } from 'svelte';

  type Card = { url: string; caption?: string };
  const generateSize = 1200; // high resolution for print

  // Hardcoded cards array — edit this list to add/remove QR pages.
  // Each card: { url: string, caption?: string }
  let cards: Card[] = [
    { url: 'https://lowbandwidthdreams.com', caption: 'Low Bandwidth Dreams' },
    { url: 'https://cyberpurok.lowbandwidthdreams.com', caption: 'cyberpurok' },
    { url: 'https://yellowbasket.lowbandwidthdreams.com', caption: 'yellowbasket' },
    { url: 'https://lowbandwidthdreams.com/power_plant', caption: 'power plant' },
    { url: 'https://cyberpurok.lowbandwidthdreams.com/panawagan_banner', caption: 'panawagan banner' },
    { url: 'https://kolown.net/dropcall', caption: 'dropcall' }
  ];

  onMount(() => {
    // keep cards hardcoded by default; no runtime JSON parsing
  });

  function doPrint() {
    window.print();
  }
</script>

<main class="min-h-screen bg-white text-black flex items-center justify-center p-6">
  <div class="w-full max-w-3xl mx-auto">
    <div class="mb-6 controls flex justify-center">
      <button on:click={doPrint} class="px-4 py-2 bg-green-700 text-white rounded">Print all</button>
    </div>

    {#if cards.length === 0}
      <p class="text-center text-gray-600">No cards to generate.</p>
    {/if}

    {#each cards as card, i}
      <div class="print-page print-area w-full max-w-[180mm] mx-auto flex flex-col items-center mb-6">
        <div class="qr-wrap w-full max-w-[150mm]">
          <Qr text={card.url} size={generateSize} />
        </div>

        <div class="caption mt-6 text-center text-lg leading-snug">
          {card.caption}
        </div>

        <div class="mt-2 text-sm text-gray-600">{card.url}</div>
      </div>
    {/each}
  </div>
</main>

<style>
  /* Layout for screen */
  main { background: white; }
  .qr-wrap { aspect-ratio: 1 / 1; }

  /* Print styling — short bondpaper: use A5 portrait */
  @page { size: A5 portrait; margin: 10mm; }
  @media print {
    /* hide site chrome when printing this page */
    :global(header), :global(footer) { display: none !important; }
    :global(body), :global(html), main { background: white; color: black; }
    .controls { display: none; }
    .print-area { max-width: 180mm; margin: 0 auto; }
    .qr-wrap { max-width: 150mm; margin: 0 auto; }
    /* larger, centered caption for print */
    .caption { font-size: 16pt; margin-top: 8mm; text-align: center; }
  }

  :global(.qr-wrap svg) { width: 100%; height: auto; display: block; }
</style>
