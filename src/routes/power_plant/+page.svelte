<script lang="ts">
    import * as Papa from 'papaparse';
    import { onMount } from 'svelte';
    import { jsPDF } from "jspdf";

    // Public CSV export URL (Google Sheets published as CSV)
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEdKEDTTuFtg3hBpqhwPApiiTk6o0d3VxO5Gb6TqFp7Spt4XrKpBnwYITbTDAqZT-kYzQWw-KbplfI/pub?gid=0&single=true&output=csv';

    let plants: any[] = [];
    let status: string = '';
    let generating = false;
    let progress = 0;

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

    // Convert an image URL to a data URL (base64) for embedding in jsPDF
    // Tries direct CORS fetch first; if that fails, falls back to images.weserv.nl proxy.
    async function imageUrlToDataURL(url: string) {
        if (!url) return null;

        const blobToDataUrl = (b: Blob) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(b);
        });

        // 1) Try direct fetch (works if origin has CORS)
        try {
            const res = await fetch(url, { mode: 'cors' });
            if (res.ok) {
                const blob = await res.blob();
                return await blobToDataUrl(blob);
            }
        } catch (e) {
            // continue to fallback
        }

        // 2) Fallback to images.weserv.nl public proxy
        try {
            const u = new URL(url);
            const remote = encodeURIComponent(u.host + u.pathname + (u.search || ''));
            // request a reasonably sized image; adjust `w` param as needed
            const proxied = `https://images.weserv.nl/?url=${remote}&w=1600&output=png`;
            const res2 = await fetch(proxied);
            if (!res2.ok) throw new Error('weserv fetch failed');
            const blob2 = await res2.blob();
            return await blobToDataUrl(blob2);
        } catch (err) {
            console.warn('Could not load image for PDF (direct and proxy failed):', url, err);
            return null;
        }
    }

    // Generate PDF from `plants` data; preview=true opens in new tab, else triggers download
    async function generatePdf(preview = false) {
        if (!plants || plants.length === 0) return alert('No plant data to export');
        generating = true;
        progress = 0;
        try {
            const { jsPDF } = await import('jspdf');

            // Half short-bondpaper size (approx): 6.5" x 8.5" → 165.1mm x 215.9mm
            const pdf = new jsPDF({ unit: 'mm', format: [165.1, 215.9], orientation: 'portrait' });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 15;

            // Title / front page
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(36);
            pdf.text('Power Plant', pageW / 2, pageH / 2 - 8, { align: 'center' });
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            const subtitle = 'A medicinal plant catalog by Luyo_Space';
            pdf.text(subtitle, pageW / 2, pageH / 2 + 6, { align: 'center' });
            const contentW = pageW - margin * 2;
            const lineHeight = 7;

            for (let i = 0; i < plants.length; i++) {
                const plant = plants[i];
                // add a new page for each plant (first plant will be on page 2)
                pdf.addPage();

                let y = margin;

                // 1) Draw image at top (if present)
                if (plant.image) {
                    const src = imageUrl(plant.image);
                    const dataUrl = await imageUrlToDataURL(src);
                    if (dataUrl) {
                        const img = new Image();
                        await new Promise((resolve) => { img.onload = resolve; img.src = dataUrl; });
                        const iw = img.width;
                        const ih = img.height;
                        const maxW = contentW;
                        // Reserve up to ~60% of page height for image, keep margins
                        const maxH = (pageH - margin * 2) * 0.6;
                        let drawW = maxW;
                        let drawH = (ih * drawW) / iw;
                        if (drawH > maxH) {
                            drawH = maxH;
                            drawW = (iw * drawH) / ih;
                        }
                        const x = margin + (contentW - drawW) / 2;
                        pdf.addImage(dataUrl, 'JPEG', x, y, drawW, drawH);
                        y += drawH + 8;
                    }
                }

                // 2) Title
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                const title = plant.english_name || plant.local_name || `Plant ${plant.item_no || i + 1}`;
                const titleLines = pdf.splitTextToSize(title, contentW);
                pdf.text(titleLines, margin, y);
                y += titleLines.length * lineHeight + 4;

                // update progress after each plant page is rendered
                progress = Math.round(((i + 1) / plants.length) * 100);

                // 3) Meta lines: render item no before name (if present) and render labeled fields
                pdf.setFontSize(10);
                // If item_no exists, put it before the title on the same line by prepending to title
                // (we already rendered the title above; if item_no exists but wasn't included, prepend here)
                // 3a) Labeled fields: each label is bold, value is normal on same line
                const labeled = [
                    ['Local name:', plant.local_name],
                    ['English name:', plant.english_name],
                    ['Draftsperson:', plant.draftsperson],
                    ['For:', plant.for],
                ];
                for (const [label, value] of labeled) {
                    if (!value) continue;
                    // Bold label
                    pdf.setFont('helvetica', 'bold');
                    const labelText = label + ' ';
                    pdf.text(labelText, margin, y);
                    const labelW = pdf.getTextWidth(labelText);
                    // Normal value after label
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(80);
                    pdf.text(value, margin + labelW + 2, y);
                    pdf.setTextColor(0);
                    y += lineHeight;
                }
                y += 6;

                // 4) Description / notes
                if (plant.notes || plant.description || plant.common_description) {
                    const desc = plant.description || plant.notes || plant.common_description || '';
                    const descLines = pdf.splitTextToSize(desc, contentW);
                    // If not enough space on page, add page
                    if (y + descLines.length * lineHeight + margin > pageH) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.setFontSize(11);
                    pdf.text(descLines, margin, y);
                    y += descLines.length * lineHeight + 4;
                }
            }

            // Ensure total pages is a multiple of 4 for print imposition/booklet folding
            const totalPages = pdf.getNumberOfPages();
            const remainder = totalPages % 4;
            if (remainder !== 0) {
                const toAdd = 4 - remainder;
                for (let k = 0; k < toAdd; k++) pdf.addPage();
            }

            // mark complete
            progress = 100;

            if (preview) {
                const blob = pdf.output('blob');
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                pdf.save('powerplant.pdf');
            }
        } catch (err) {
            console.error('PDF generation failed', err);
            alert('PDF generation failed — check console for details.');
        } finally {
            generating = false;
            setTimeout(() => progress = 0, 800);
        }
    }
</script>

<main class="min-h-screen flex flex-col items-center p-6">
    <div class="text-center max-w-2xl">
        <h1 class="text-3xl font-bold mb-2">Power Plant</h1>
        <p class="text-lg text-gray-200">a medicinal plant cataloging project by Luyo_Space. 
          
             This is a work in progress and this site is constantly updating as well as its data.
              The goal is to generate a pdf for zine in this web page.</p>
        </div>

        <div class="w-full max-w-6xl mt-6 flex flex-col items-center gap-3">
            <button class="px-4 py-2 bg-green-700 text-white rounded flex items-center gap-2" on:click={() => generatePdf(true)} disabled={generating}>
                {generating ? `Generating… (${progress}%)` : 'Preview PDF'}
            </button>
            {#if generating}
                <div class="w-full max-w-6xl mt-2 px-4">
                    <div class="h-2 bg-gray-700 rounded overflow-hidden">
                        <div class="h-2 bg-green-500" style="width: {progress}%"></div>
                    </div>
                </div>
            {/if}
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