<script context="module" lang="ts">
    // avoid build-time fetch of external markdown
    export const prerender = false;
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';

    // raw GitHub URL for the markdown description
    const mdUrl =
        'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/gabferrer_statement.md';

    let mdHtml = '';
    let loading = false;
    let error: string | null = null;

    onMount(async () => {
        loading = true;
        try {
            const res = await fetch(mdUrl);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const md = await res.text();

            // import DOMPurify on the client only and sanitize HTML
            const DOMPurify = (await import('dompurify')).default;
            const parsed = await marked.parse(md);
            mdHtml = DOMPurify.sanitize(parsed as string);
        } catch (err) {
            error = String(err);
            console.error('Failed to load markdown:', err);
        } finally {
            loading = false;
        }
    });
</script>

<main class="min-h-screen flex flex-col items-center p-6">
        <div class="text-center max-w-2xl mb-8">
                <h1 class="text-3xl font-bold mb-2">Error 405: Panawagan Cannot Be Fulfilled</h1>
                <p class="text-lg text-gray-200">a project by Gab Ferrer</p>
        </div>

        <div class="w-full max-w-4xl">
                <div class="bg-black rounded-lg overflow-hidden shadow-lg">
                        <video
                                src="https://streetkonect.com/storage/object_curator/panawagan_banner/P1090807.MP4"
                                controls
                                class="w-full"
                                preload="auto"
                        >
                                <track kind="captions" />
                                Your browser does not support the video tag.
                        </video>
                </div>
        
        </div>

        <!-- markdown content fetched from GitHub -->
        <div class="w-full max-w-4xl mt-6">
            {#if loading}
                <p class="text-center text-gray-600">Loading description…</p>
            {:else if error}
                <p class="text-center text-red-500">Error loading description: {error}</p>
            {:else if mdHtml}
                <div class="prose mt-4 mx-auto text-gray-200 text-2xl">{@html mdHtml}</div>
            {/if}
        </div>

</main>

<style>
    :global(.prose img) {
        max-width: 100%;
        height: auto;
    }
    /* add vertical spacing between paragraphs rendered from markdown */
    :global(.prose p) {
        margin-block-start: 2rem;
        margin-block-end: 1rem;
    }
</style>