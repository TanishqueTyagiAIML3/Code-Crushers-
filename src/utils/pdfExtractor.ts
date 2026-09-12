import { PDFParse } from 'pdf-parse';

/**
 * Checks whether a given string is raw binary PDF data instead of human-readable text.
 * Detects common PDF magic headers and stream/filter metadata keywords.
 */
export function isRawPdfBinary(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  // PDF header signature
  if (trimmed.startsWith('%PDF-')) return true;
  // Common binary PDF stream markers
  if (trimmed.includes('/FlateDecode') || trimmed.includes('/Filter') || trimmed.includes('endstream\nendobj')) {
    return true;
  }
  // Check for high proportion of non-printable / control characters
  let nonPrintableCount = 0;
  const sampleSize = Math.min(trimmed.length, 500);
  for (let i = 0; i < sampleSize; i++) {
    const code = trimmed.charCodeAt(i);
    // Allow standard whitespace: newline, return, tab
    if (code < 32 && code !== 10 && code !== 13 && code !== 9) {
      nonPrintableCount++;
    }
  }
  return nonPrintableCount / sampleSize > 0.05;
}

/**
 * Checks whether a given Buffer contains a valid PDF header (%PDF- in first 1024 bytes).
 */
export function isValidPdfBuffer(buffer: Buffer): boolean {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 32) return false;
  const headerSample = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('latin1');
  return headerSample.includes('%PDF-');
}

export interface PDFInspectionResult {
  text: string;
  totalPages: number;
  isValid: boolean;
  isScanned: boolean;
  cleanBase64?: string;
  error?: string;
}

/**
 * Robustly inspects and extracts text from a PDF Buffer or Base64 string.
 * Validates PDF structure, counts pages, and safely distinguishes between:
 * 1. Valid PDFs with extractable text
 * 2. Valid scanned PDFs (pages exist, text is embedded in images)
 * 3. Invalid / empty / zero-page documents or non-PDF files
 */
export async function inspectAndExtractPDF(pdfInput: Buffer | string): Promise<PDFInspectionResult> {
  let parser: any = null;
  try {
    let buffer: Buffer;
    let cleanBase64Str = '';

    if (Buffer.isBuffer(pdfInput)) {
      buffer = pdfInput;
      cleanBase64Str = buffer.toString('base64');
    } else if (typeof pdfInput === 'string') {
      const trimmed = pdfInput.trim();
      if (trimmed.startsWith('%PDF-') || trimmed.includes('/FlateDecode')) {
        // Raw ASCII/binary representation from accidental FileReader.readAsText
        buffer = Buffer.from(pdfInput, 'binary');
        cleanBase64Str = buffer.toString('base64');
      } else {
        // Strip data URL scheme if present (e.g. data:application/pdf;base64,... or data:...;base64,...)
        const commaIdx = trimmed.indexOf(',');
        cleanBase64Str = (trimmed.startsWith('data:') && commaIdx !== -1)
          ? trimmed.slice(commaIdx + 1).trim()
          : trimmed;
        buffer = Buffer.from(cleanBase64Str, 'base64');
      }
    } else {
      return { text: '', totalPages: 0, isValid: false, isScanned: false, error: 'Unsupported input format' };
    }

    if (!buffer || buffer.length === 0) {
      return { text: '', totalPages: 0, isValid: false, isScanned: false, error: 'Empty buffer (0 bytes)' };
    }

    // Check if it has a valid PDF magic header (%PDF-)
    const hasPdfHeader = isValidPdfBuffer(buffer);
    if (!hasPdfHeader) {
      // Check if it is readable plain text / markdown instead of a PDF
      const asUtf8 = buffer.subarray(0, Math.min(buffer.length, 2000)).toString('utf-8');
      const isReadableText = !isRawPdfBinary(asUtf8) && asUtf8.trim().length > 10;
      if (isReadableText) {
        return {
          text: buffer.toString('utf-8').trim(),
          totalPages: 1,
          isValid: false, // Not a PDF binary, but usable as text
          isScanned: false,
          cleanBase64: cleanBase64Str,
        };
      }
      return {
        text: '',
        totalPages: 0,
        isValid: false,
        isScanned: false,
        error: 'Invalid PDF structure: missing %PDF- header',
      };
    }

    // Initialize the PDF parser with the raw buffer
    parser = new PDFParse({ data: buffer });
    
    // Safely retrieve both page info and text content
    const [infoRes, textRes] = await Promise.all([
      parser.getInfo().catch(() => null),
      parser.getText().catch(() => null),
    ]);

    const totalPages = Number(infoRes?.total || (textRes as any)?.total || 0);

    if (totalPages === 0) {
      return {
        text: '',
        totalPages: 0,
        isValid: false,
        isScanned: false,
        error: 'The document contains 0 pages',
      };
    }

    const rawText = (textRes && typeof textRes === 'object' && (textRes as any).text)
      ? (textRes as any).text
      : (typeof textRes === 'string' ? textRes : '');

    // Clean and normalize extracted text:
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const isScanned = cleanText.length < 35 && totalPages >= 1;

    return {
      text: cleanText,
      totalPages,
      isValid: true,
      isScanned,
      cleanBase64: cleanBase64Str,
    };
  } catch (error: any) {
    console.warn("⚠️ [PDF Extractor] Could not parse text from PDF buffer:", error?.message || error);
    return {
      text: '',
      totalPages: 0,
      isValid: false,
      isScanned: false,
      error: error?.message || 'Invalid PDF structure',
    };
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch (e) {
        // Safe disposal
      }
    }
  }
}

/**
 * Extracts clean, human-readable text from a PDF Buffer or Base64 string.
 * Strips formatting artifacts, headers/footers, and excess whitespace.
 *
 * @param pdfInput - Node Buffer or Base64-encoded PDF string
 * @returns Clean extracted text string (or empty string if extraction fails)
 */
export async function extractTextFromPDF(pdfInput: Buffer | string): Promise<string> {
  const result = await inspectAndExtractPDF(pdfInput);
  return result.text;
}

