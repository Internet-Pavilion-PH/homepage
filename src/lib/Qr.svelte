<script lang="ts">
  import { onMount } from 'svelte';

  export let text: string = '';
  export let size: number = 1200; // resolution for generated svg
  export let margin: number = 1;
  // CSS class applied to container to control QR color (Tailwind class, e.g. 'text-green-700')
  export let colorClass: string = 'text-green-700';
  // optional center icon (SVG path or image). Use '/lbd.svg' to center the site logo.
  export let centerSrc: string | null = '/lbd2.svg';
  // size of center icon as fraction of QR width (0.0 - 1.0)
  export let centerSizePct: number = 0.18;

  let svg: string | null = null;
  let error: string | null = null;
  let centerSvg: string | null = null; // inlined and colorized center SVG
  let centerImgSrc: string | null = null; // fallback if not svg
  // apply CSS var for center size
  $: document && (document.documentElement.style.setProperty('--center-pct', String(centerSizePct)));

  onMount(async () => {
    try {
      const QR = await import('qrcode');
      const input = text || (typeof location !== 'undefined' ? location.href : '');
      // generate SVG string
      let s = await QR.toString(input, { type: 'svg', width: size, margin });

      // Replace explicit black fills/strokes with currentColor so CSS can control the color
      // handle attributes like fill="#000000" or fill="#000" or fill="black"
      s = s.replace(/fill=("|')(?:#0{3,6}|#000|black)("|')/gi, 'fill=$1currentColor$2');
      s = s.replace(/stroke=("|')(?:#0{3,6}|#000|black)("|')/gi, 'stroke=$1currentColor$2');
      // handle inline style occurrences: style="fill:#000;stroke:#000"
      s = s.replace(/fill:\s*#0{3,6}/gi, 'fill:currentColor');
      s = s.replace(/stroke:\s*#0{3,6}/gi, 'stroke:currentColor');

      svg = s;
    } catch (err) {
      console.error('QR generation failed', err);
      error = String(err);
    }

    // load center icon if provided
    if (centerSrc) {
      try {
        if (centerSrc.toLowerCase().endsWith('.svg')) {
          const res = await fetch(centerSrc);
          if (res.ok) {
            let cs = await res.text();
            // Force fills/strokes to currentColor so the icon matches the QR color
            cs = cs.replace(/fill=("|')(.*?)\1/gi, 'fill=$1currentColor$1');
            cs = cs.replace(/stroke=("|')(.*?)\1/gi, 'stroke=$1currentColor$1');
            cs = cs.replace(/fill:\s*[^;"']+/gi, 'fill:currentColor');
            cs = cs.replace(/stroke:\s*[^;"']+/gi, 'stroke:currentColor');
            centerSvg = cs;
            centerImgSrc = null;
          } else {
            // fallback to using the URL as an <img>
            centerSvg = null;
            centerImgSrc = centerSrc;
          }
        } else {
          centerSvg = null;
          centerImgSrc = centerSrc;
        }
      } catch (err) {
        console.warn('Failed to load centerSrc', err);
        centerSvg = null;
        centerImgSrc = centerSrc;
      }
    }
  });
</script>

{#if error}
  <div class="text-red-500">{error}</div>
{:else if !svg}
  <div class="text-white/70">Generating QR…</div>
{:else}
  <div class={`qr-svg ${colorClass}`} aria-hidden="true" style="position:relative; display:inline-block;">
    {@html svg}

    {#if centerSvg}
      <div class="center-icon" aria-hidden="true">{@html centerSvg}</div>
    {:else if centerImgSrc}
      <img class="center-icon-img" src={centerImgSrc} alt="" aria-hidden="true" />
    {/if}
  </div>
{/if}

<style>
  :global(.qr-svg svg) {
    display: block;
    width: 100%;
    height: auto;
  }
  /* center icon styling */
  .center-icon,
  .center-icon-img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--center-pct, 0.18) * 100%);
    height: auto;
    display: block;
    pointer-events: none;
    background: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
    box-sizing: border-box;
  }

  /* ensure inlined svg inside center wrapper scales */
  :global(.center-icon svg) { width: 100%; height: auto; display: block; }
</style>
