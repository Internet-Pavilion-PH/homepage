<script lang="ts">
  // Kiosk layout — intentionally minimal to avoid global header/footer
</script>

<svelte:head>
  <title>Low Bandwidth Dreams — Kiosk</title>
</svelte:head>

<main class="min-h-screen bg-[#083a22] text-white">
  <slot />
</main>

<style>
  :global(body) { margin: 0; }
</style>
