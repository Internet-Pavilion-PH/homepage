<script lang="ts">
  import { base } from '$app/paths';
  export let data: { html: string };

  function rewriteLocal(html: string) {
    if (!html) return html;
    return html.replace(/(src|href)=(['\"])\/([^"']+)\2/gi, (_m, attr, quote, path) => {
      const prefix = base || '';
      const joined = prefix.endsWith('/') ? `${prefix}${path}` : `${prefix}/${path}`;
      return `${attr}=${quote}${joined}${quote}`;
    });
  }

  $: htmlSafe = rewriteLocal(data?.html || '');
</script>

<main class="min-h-screen bg-[#006C35] py-12 px-4">
  <div class="max-w-4xl mx-auto px-4 mb-4 flex justify-end">
    <a
      href="https://github.com/Internet-Pavilion-PH/notes/blob/main/low_bandwidth_dreams.md"
      target="_blank"
      rel="noopener"
      class="text-white underline"
      >
      Edit this page on GitHub
    </a>
  </div>

  <div class="prose prose-invert max-w-4xl mx-auto p-6 info-container text-white text-3xl">
    {@html htmlSafe}
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
</style>
