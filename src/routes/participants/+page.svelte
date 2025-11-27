<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  // DOMPurify is browser-only; import it dynamically inside onMount to avoid SSR errors

  type Participant = {
    id: string;
    name: string;
    project?: string;
    location?: string;
  image?: string; // URL to avatar image
    bio?: string; // markdown
    badges?: string[];
  };

  let participants: Participant[] = [];
  let loading = true;
  let error: string | null = null;
  // (no explicit expand toggle; bios reveal on hover/focus)

  // Raw URL to the participants.json in the notes repo
  const rawJson =
    'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/participants.json';

  onMount(async () => {
    try {
      const res = await fetch(rawJson);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as Participant[];

          // Import DOMPurify dynamically (only runs in browser/onMount)
          const dompurifyModule = (await import('dompurify')) as any;
          const DOMPurify = (dompurifyModule.default ?? dompurifyModule) as any;

          // Convert bio markdown to sanitized HTML
          participants = data.map((p) => {
            const md = p.bio || '';
            const unsafe = (marked.parse(md) as unknown) as string;
            const safe = DOMPurify?.sanitize ? DOMPurify.sanitize(unsafe) : unsafe;
            return { ...p, bio: safe } as Participant;
          });
    } catch (err) {
      console.error('Failed to load participants.json', err);
      error = String(err);
    } finally {
      loading = false;
    }
  });

  // toggleExpand removed; bios are revealed via hover/focus CSS only
</script>


<main class="min-h-screen bg-green-700 text-white py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center">Participants</h1>

    {#if loading}
      <p class="text-center">Loading participants…</p>
    {:else if error}
      <p class="text-center text-yellow-200">Error loading participants: {error}</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {#each participants as p}
          <article class="bg-green-800/60 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-150">
            <div class="flex items-center space-x-4">
              <img
                src={p.image}
                alt={p.name}
                class="w-16 h-16 rounded-full object-cover border-2 border-white/25"
                on:error={(e) => ((e.currentTarget as HTMLImageElement).src = '/lbd.svg')}
              />
              <div class="flex-1">
                <div class="flex items-baseline justify-between">
                  <h2 class="text-lg font-semibold">{p.name}</h2>
                  <div class="flex items-center">
                    {#if p.badges && p.badges.length}
                      <span class="text-sm opacity-80">{p.badges.join(', ')}</span>
                    {/if}
                    <!-- (bio revealed on hover or focus; toggle removed) -->
                  </div>
                </div>
                {#if p.location}
                  <div class="text-sm text-green-200 mt-1">{p.location}</div>
                {/if}
                {#if p.project}
                  <div class="text-sm text-green-200">{p.project}</div>
                {/if}
              </div>
            </div>

            {#if p.bio}
              <div id={`bio-${p.id}`} class="prose prose-invert mt-4 text-base bio-content">
                {@html p.bio}
              </div>
            {/if}
          </article>
        {/each}
      </div>
    {/if}

    <div class="mt-8 text-center">
      <a
        href="https://github.com/Internet-Pavilion-PH/notes/blob/main/participants.json"
        target="_blank"
        rel="noopener"
        class="underline"
      >
        Edit participants.json on GitHub
      </a>
    </div>
  </div>
</main>

<style>
  :global(.prose a) {
    color: #fff;
    text-decoration: underline;
  }

  /* ensure list markers visible */
  :global(.prose ul) {
    list-style-position: outside !important;
  }

  /* bio reveal animation: hidden by default, show on hover/focus/expanded */
  :global(.bio-content) {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 260ms ease, opacity 200ms ease;
  }

  /* when the parent article is hovered or focused, or explicitly expanded, reveal */
  :global(article:hover .bio-content),
  :global(article:focus-within .bio-content),
  :global(article.expanded .bio-content) {
    max-height: 40rem; /* large enough to show a full bio */
    opacity: 1;
  }

  :global(article) {
    outline: none;
  }
</style>
