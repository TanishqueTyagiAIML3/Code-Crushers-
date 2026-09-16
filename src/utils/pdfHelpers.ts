import { jsPDF } from 'jspdf';

/**
 * Sanitizes and strips HTML tags and Markdown formatting so text renders cleanly in PDF documents.
 */
export function sanitizeForPDF(text: string | null | undefined): string {
  if (!text) return '';
  let clean = String(text);

  clean = clean.replace(/<[^>]*>/g, '');
  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  clean = clean.replace(/^#{1,6}\s+/gm, '');
  clean = clean.replace(/(\*\*|__)(.*?)\1/g, '$2');
  clean = clean.replace(/(\*|_)(.*?)\1/g, '$2');
  clean = clean.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '');
  });
  clean = clean.replace(/`([^`]+)`/g, '$1');
  clean = clean.replace(/^>\s*/gm, '');
  clean = clean.replace(/^\s*[-*+]\s+/gm, '• ');
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  clean = clean.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  return clean.trim();
}

/**
 * Shared memory cache for base64 encoded TTF fonts
 */
const fontCache: Record<string, string> = {};

/**
 * Fetches and encodes custom Unicode fonts for Devanagari / Indic dialect rendering in jsPDF
 */
export async function loadFontAsBase64(fileName: string, url: string): Promise<string | null> {
  if (fontCache[fileName]) return fontCache[fileName];
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    const base64 = window.btoa(binary);
    if (base64 && base64.length > 500) {
      fontCache[fileName] = base64;
      return base64;
    }
  } catch {
    // Non-blocking fallback to standard fonts
  }
  return null;
}

/**
 * Configures optimal document fonts with Devanagari and Latin Unicode fallbacks
 */
export async function setupPdfFonts(doc: jsPDF, languageName?: string): Promise<string> {
  let activeFont = 'helvetica';
  const isDevanagari = languageName ? /hindi|bhojpuri|maithili|marathi|sanskrit|nepali/i.test(languageName) : false;

  try {
    if (isDevanagari) {
      const devanagariBase64 = await loadFontAsBase64(
        'NotoSansDevanagari-Regular.ttf',
        'https://fonts.gstatic.com/s/notosansdevanagari/v30/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL_08AlXQly-A.ttf'
      );
      if (devanagariBase64) {
        doc.addFileToVFS('NotoSansDevanagari.ttf', devanagariBase64);
        doc.addFont('NotoSansDevanagari.ttf', 'NotoSans', 'normal');
        doc.addFont('NotoSansDevanagari.ttf', 'NotoSans', 'bold');
        activeFont = 'NotoSans';
      }
    } else {
      const robotoBase64 = await loadFontAsBase64(
        'Roboto-Regular.ttf',
        'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf'
      );
      if (robotoBase64) {
        doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        activeFont = 'Roboto';
      }
    }
  } catch {
    activeFont = 'helvetica';
  }

  return activeFont;
}
