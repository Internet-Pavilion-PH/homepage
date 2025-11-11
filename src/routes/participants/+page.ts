import { marked } from 'marked';

export const prerender = true;

export async function load() {
  const url = 'https://raw.githubusercontent.com/Internet-Pavilion-PH/notes/main/cyber_purok_bio.md';

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch markdown from GitHub');
  }

  const md = await res.text();
  const html = marked.parse(md);

  return { html };
}
