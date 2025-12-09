
  <script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let slides: Array<any> = [];

    let index = 0;
    const delay = 3500;
    let timer: number | undefined;
    let paused = false;

    function next() {
      if (slides.length > 0) index = (index + 1) % slides.length;
    }

    function start() {
      stop();
      timer = window.setInterval(() => {
        if (!paused && slides.length > 0) next();
      }, delay);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    onMount(async () => {
      try {
        const res = await fetch('/kiosk/data.json');
        if (res.ok) {
          const data = await res.json();
          slides = Array.isArray(data) ? data : [];
          index = 0;
        } else {
          console.warn('Failed to load kiosk data.json', res.status);
        }
      } catch (err) {
        console.error('Error loading kiosk data.json', err);
      }

      start();
    });

    onDestroy(() => {
      stop();
    });
  </script>

  <main class="min-h-screen flex flex-col items-center">

    <div class="w-full flex justify-center mb-6">
      <div class="container" style="width:calc(100vw - 2rem); max-width:1400px; text-align:center">
        <h2 class="mt-0.5 text-2xl md:text-3xl lg:text-4xl font-semibold text-white">Low Bandwidth Dreams Projects for ESC Biennale 2025</h2>
      </div>
    </div>

    <div
      class="viewport overflow-hidden relative"
      role="region"
      aria-label="Image carousel"
      onmouseenter={() => (paused = true)}
      onmouseleave={() => (paused = false)}
    >
      <div
        class="track flex h-full"
        style={`transform: translateX(-${index * 100}%); transition: transform 600ms ease;`}
      >
        {#if slides.length === 0}
          <div class="w-full h-full flex items-center justify-center text-gray-300">Loading slides…</div>
        {:else}
          {#each slides as s}
            <section class="slide shrink-0 w-full h-full relative" style={s.color ? `background: ${s.color};` : ''}>
              <div class="w-full h-full flex flex-col" role="group" aria-label={s.title}>
                <div class="meta p-8 text-white text-center">
                  <h3 class="text-5xl md:text-7xl font-extrabold leading-tight">{s.title}</h3>
                  {#if s.description}
                    <p class="mt-4 text-2xl md:text-3xl max-w-4xl mx-auto">{s.description}</p>
                  {/if}

                  {#if s.url}
                    <div class="mt-6">
                      <a href={s.url} target={s.url && s.url.startsWith('http') ? '_blank' : '_self'} rel="noopener" class="text-lg md:text-xl text-blue-200 underline">
                        {s.url}
                      </a>
                    </div>
                  {/if}
                </div>

                <div class="media flex-1 flex items-center justify-center overflow-hidden">
                  {#if s.image && (s.image.endsWith('.mp4') || s.image.endsWith('.webm'))}
                    <video src={s.image} autoplay muted playsinline loop class="media-element"></video>
                  {:else if s.image}
                    <img src={s.image} alt={s.title} class="media-element" loading="lazy" />
                  {/if}
                </div>
              </div>
            </section>
          {/each}
        {/if}
      </div>

      <!-- basic controls -->
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
        aria-label="Previous"
        onclick={() => { index = (index - 1 + slides.length) % slides.length }}
      >
        ◀
      </button>

      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
        aria-label="Next"
        onclick={() => next()}
      >
        ▶
      </button>
    </div>
  </main>

<style>
  /* Responsive viewport: reduce side gutters so slides reach closer to edges */
  .viewport { width: min(98vw, 1600px); margin: 0 auto; padding-block: 1.25rem; box-sizing: border-box; }
  /* Make the slider height adapt to the viewport minus safe top/bottom margins */
  .viewport { height: calc(100vh - 6rem); max-height: 96vh; }
  .track { width: 100%; height: 100%; }
  .slide { min-width: 100%; height: 100%; background: #083a22; }
  button { backdrop-filter: blur(4px); }
  :global(.swiper-slide) { display: flex; align-items: center; justify-content: center; }

  /* Media sizing: keep aspect ratio and fit inside media area */
  .media { background: transparent; }
  .media-element { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }

    @media (max-width: 640px) {
      .viewport { width: calc(100vw - 1rem); height: calc(100vh - 6rem); padding-block: 0.75rem; }
    }

  @media (min-width: 1024px) {
    .viewport { height: calc(100vh - 6rem); }
  }
</style>
