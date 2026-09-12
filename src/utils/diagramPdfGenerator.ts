import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DiagramAnalysis } from '../types';
import { sanitizeForPDF, setupPdfFonts } from './pdfHelpers';

/**
 * Load image natural dimensions to preserve exact aspect ratio in PDF
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ width: 400, height: 300 });
      return;
    }
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width || 400,
        height: img.naturalHeight || img.height || 300,
      });
    };
    img.onerror = () => {
      resolve({ width: 400, height: 300 });
    };
    img.src = dataUrl;
  });
}

export interface DiagramPdfOptions {
  analysis: DiagramAnalysis;
  imagePreview?: string | null;
  languageName?: string;
  dialectName?: string;
}

/**
 * Generates and downloads a polished Diagram Analysis Study PDF Report
 */
export async function downloadDiagramAnalysisPdf({
  analysis,
  imagePreview,
  languageName = 'Hindi',
  dialectName = 'Hindi',
}: DiagramPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Setup fonts
  const activeFont = await setupPdfFonts(doc, languageName);

  // Helper for footer
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Sahayak AI • Multimodal Visual Diagram Explainer & Study Notes', margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // 1. Top Decorative Brand Banner
  doc.setFillColor(234, 88, 12); // #ea580c Deep Orange
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Header Section
  let currentY = 16;

  // App Badge & Tag
  doc.setFillColor(255, 247, 237); // orange-50
  doc.setDrawColor(253, 186, 116); // orange-300
  doc.roundedRect(margin, currentY, 78, 6.5, 2, 2, 'FD');
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(194, 65, 12); // orange-700
  doc.text('SAHAYAK AI • DIAGRAM VISION STUDY GUIDE', margin + 3, currentY + 4.5);

  // Date & Language badge
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`${dateStr} • Lang: ${dialectName || languageName}`, pageWidth - margin, currentY + 4.5, { align: 'right' });

  currentY += 12;

  // Diagram Title
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  const cleanTitle = sanitizeForPDF(analysis.diagramTitle || 'Scientific Diagram Analysis');
  const titleLines = doc.splitTextToSize(cleanTitle, contentWidth);
  doc.text(titleLines, margin, currentY);
  currentY += titleLines.length * 7.5;

  // Subject Subtitle
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12); // #ea580c
  doc.text(`Subject: ${sanitizeForPDF(analysis.subject || 'Academic Study')}`, margin, currentY);
  currentY += 7;

  // 2. Embedded Diagram Image (if available)
  if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('data:image')) {
    try {
      // Calculate natural aspect ratio to avoid stretching or overly wide dimensions
      const { width: natW, height: natH } = await getImageDimensions(imagePreview);
      const aspect = (natW > 0 && natH > 0) ? (natW / natH) : (4 / 3);

      // Constrain to a clean, well-proportioned thumbnail box
      const maxImgWidth = 52; // max width in mm (compact, balanced)
      const maxImgHeight = 44; // max height in mm

      let renderedWidth = maxImgWidth;
      let renderedHeight = renderedWidth / aspect;

      if (renderedHeight > maxImgHeight) {
        renderedHeight = maxImgHeight;
        renderedWidth = renderedHeight * aspect;
      }
      if (renderedWidth > maxImgWidth) {
        renderedWidth = maxImgWidth;
        renderedHeight = renderedWidth / aspect;
      }

      const padding = 2;
      const cardWidth = Math.round((renderedWidth + padding * 2) * 10) / 10;
      const cardHeight = Math.round((renderedHeight + padding * 2) * 10) / 10;

      const imgX = pageWidth - margin - cardWidth;
      const textWidth = contentWidth - cardWidth - 8;

      // Draw subtle background card & frame for image
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(imgX, currentY, cardWidth, cardHeight, 2, 2, 'FD');

      // Determine image format
      const imgFormat = imagePreview.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(
        imagePreview,
        imgFormat,
        imgX + padding,
        currentY + padding,
        renderedWidth,
        renderedHeight,
        undefined,
        'FAST'
      );

      // Diagram Input caption
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Diagram Input', imgX + (cardWidth / 2), currentY + cardHeight + 3.5, { align: 'center' });

      // Overview text placed side-by-side with image
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('Overview & Visual Summary:', margin, currentY + 4);

      doc.setFont(activeFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const summaryText = sanitizeForPDF(analysis.summary);
      const summaryLines = doc.splitTextToSize(summaryText, textWidth);
      doc.text(summaryLines, margin, currentY + 10);

      currentY += Math.max(cardHeight + 8, (summaryLines.length * 4.5) + 16);
    } catch {
      // Fallback if image embedding fails
      renderStandardOverview();
    }
  } else {
    renderStandardOverview();
  }

  function renderStandardOverview() {
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    const summaryText = sanitizeForPDF(analysis.summary);
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 8);
    const boxHeight = (summaryLines.length * 4.5) + 12;

    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('Overview & Visual Summary:', margin + 4, currentY + 5.5);

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(summaryLines, margin + 4, currentY + 11);
    currentY += boxHeight + 6;
  }

  // 3. Dialect Spoken Explanation Box
  if (analysis.explanationInLanguage) {
    // Check if new page needed
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }

    const dialectText = sanitizeForPDF(analysis.explanationInLanguage);
    const dialectLines = doc.splitTextToSize(`"${dialectText}"`, contentWidth - 10);
    const dialectBoxHeight = (dialectLines.length * 4.5) + 14;

    doc.setFillColor(255, 247, 237); // orange-50
    doc.setDrawColor(253, 186, 116); // orange-300
    doc.roundedRect(margin, currentY, contentWidth, dialectBoxHeight, 2, 2, 'FD');

    // Dialect Header
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(194, 65, 12);
    doc.text(`Explanation in ${dialectName || languageName}:`, margin + 5, currentY + 6);

    // Dialect Content
    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(67, 56, 202); // indigo-900 / clear readable tone
    doc.text(dialectLines, margin + 5, currentY + 11);

    currentY += dialectBoxHeight + 8;
  }

  // 4. Structural Components Table (using autoTable)
  if (analysis.components && analysis.components.length > 0) {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont(activeFont, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Key Structural Components (${analysis.components.length})`, margin, currentY);
    currentY += 4;

    const tableRows = analysis.components.map((comp, idx) => [
      `${idx + 1}`,
      sanitizeForPDF(comp.name),
      sanitizeForPDF(comp.visualLocation || 'Identified in Diagram'),
      sanitizeForPDF(comp.functionDescription),
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['#', 'Component Name', 'Visual Location', 'Functional Role & Description']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [234, 88, 12], // #ea580c
        textColor: [255, 255, 255],
        font: activeFont,
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 2.5,
      },
      bodyStyles: {
        font: activeFont,
        fontSize: 8,
        textColor: [51, 65, 85],
        cellPadding: 2.5,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 40, fontStyle: 'bold' },
        2: { cellWidth: 32 },
        3: { cellWidth: 'auto' },
      },
      alternateRowStyles: {
        fillColor: [254, 251, 247],
      },
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
    if (finalY) {
      currentY = finalY + 8;
    }
  }

  // 5. Step-by-Step Process Flow
  if (analysis.stepByStepProcess && analysis.stepByStepProcess.length > 0) {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont(activeFont, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Step-by-Step Mechanism / Process Flow', margin, currentY);
    currentY += 6;

    analysis.stepByStepProcess.forEach((step, idx) => {
      const stepClean = sanitizeForPDF(step);
      const stepLines = doc.splitTextToSize(stepClean, contentWidth - 22);
      const itemHeight = Math.max(10, (stepLines.length * 4.5) + 4);

      if (currentY + itemHeight > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }

      // Step Number Pill
      doc.setFillColor(255, 237, 213); // orange-100
      doc.roundedRect(margin, currentY, 16, 6, 1.5, 1.5, 'F');
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(194, 65, 12);
      doc.text(`Step ${idx + 1}`, margin + 8, currentY + 4.2, { align: 'center' });

      // Step Text
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(stepLines, margin + 20, currentY + 4.2);

      currentY += itemHeight + 2;
    });
  }

  // Add Footers across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Trigger download with sanitized filename
  const safeTitle = (cleanTitle || 'Diagram_Explanation')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')
    .slice(0, 32);
  doc.save(`${safeTitle}_Explanation_${Date.now()}.pdf`);
}
