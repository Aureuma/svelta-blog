import { marked } from 'marked';
import { bundledLanguages, createHighlighter } from 'shiki';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: Object.keys(bundledLanguages)
});

const normalizeLanguage = (lang?: string) => {
  if (!lang) return null;
  const cleaned = lang.trim().match(/^[^\s{]+/)?.[0];
  return cleaned ? cleaned.replace(/^language-/, '') : null;
};

const renderer = new marked.Renderer();

renderer.code = (code: string, infostring?: string) => {
  const text = code ?? '';
  const lang = normalizeLanguage(infostring);

  try {
    const available = highlighter.getLoadedLanguages();
    const resolved = lang && available.includes(lang) ? lang : 'text';
    return highlighter.codeToHtml(text, {
      lang: resolved,
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      cssVariablePrefix: '--shiki-'
    });
  } catch {
    return `<pre><code>${escapeHtml(text)}</code></pre>`;
  }
};

marked.use({ renderer });

export const renderMarkdown = async (markdown: string) =>
  marked.parse(markdown);
