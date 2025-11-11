<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';

  // Keep `data` as a fallback for SSR/prerender (if present), but prefer live fetch.
  export let data: { html: string };

  // reactive HTML used in the template
  let htmlSafe: string = data?.html || '';

  const rawUrl = 'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/low_bandwidth_dreams.md';

  onMount(async () => {
    try {
      const res = await fetch(rawUrl);
      if (!res.ok) {
        console.warn('Could not fetch remote markdown:', res.status, res.statusText);
        return;
      }
      const md = await res.text();
      const unsafe = await Promise.resolve(marked.parse(md));
      // sanitize before injecting
      htmlSafe = DOMPurify.sanitize(unsafe as string);
    } catch (err) {
      console.error('Error fetching markdown:', err);
    }
  });
</script>

<main class="min-h-screen bg-green-700 py-12 px-4">


  <div class="prose prose-invert max-w-4xl mx-auto p-6 info-container text-white text-3xl">
    {@html htmlSafe}
  </div>

    <div class="max-w-4xl mx-auto px-4 mb-4 flex justify-center">
    <a
      href="https://github.com/Internet-Pavilion-PH/notes/blob/main/low_bandwidth_dreams.md"
      target="_blank"
      rel="noopener"
      class="text-white underline"
    >
      Edit this page on GitHub
    </a>
  </div>
</main>


<style>
  /* Improve link and inline code visibility on the dark background */
  :global(.info-container a) {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :global(.info-container code) {
    background: rgba(255,255,255,0.06);
    color: #fff;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  :global(.info-container pre) {
    background: rgba(0,0,0,0.15);
    color: #fff;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow: auto;
  }

  /* Fallback spacing rules in case Tailwind/prose isn't applied */
  :global(.info-container h1),
  :global(.info-container h2),
  :global(.info-container h3),
  :global(.info-container h4) {
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    line-height: 1.2;
    color: #fff;
  }

  :global(.info-container p),
  :global(.info-container ul),
  :global(.info-container ol),
  :global(.info-container blockquote) {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    color: #ffffffe6;
  }

  :global(.info-container ul li),
  :global(.info-container ol li) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  /* Ensure images and iframes fit */
  :global(.info-container img),
  :global(.info-container iframe) {
    max-width: 100%;
    height: auto;
  }

  /* Make list markers visible on dark background */
  :global(.info-container ul),
  :global(.info-container ol) {
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  :global(.info-container li::marker) {
    color: #fff;
    opacity: 0.95;
  }

  /* Force visible list markers (handles prose/typography overrides) */
  :global(.info-container ul) {
    list-style-type: disc !important;
    list-style-position: outside !important;
  }

  :global(.info-container ol) {
    list-style-type: decimal !important;
    list-style-position: outside !important;
  }

  /* Fallback for environments that don't support ::marker */
  :global(.info-container li) {
    color: inherit;
    display: list-item;
  }
</style>


