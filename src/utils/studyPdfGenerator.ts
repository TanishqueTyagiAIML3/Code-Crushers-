import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuizQuestion, MindMapNode } from '../types';
import { sanitizeForPDF, setupPdfFonts } from './pdfHelpers';

export { sanitizeForPDF };

// ======================================================================
// 1. ADAPTIVE QUIZ PDF GENERATOR
// ======================================================================

export interface QuizPDFOptions {
  quizTitle?: string;
  topic?: string;
  documentFileName?: string;
  questions: QuizQuestion[];
  languageName?: string;
  totalScore?: number;
  isCompleted?: boolean;
}

/**
 * Generates and downloads a clean, beautifully formatted Quiz PDF.
 * Contains the Quiz Title, questions, options (A, B, C, D), correct answers,
 * and comprehensive explanations with dialect nuances.
 */
export async function generateQuizPDF(options: QuizPDFOptions): Promise<void> {
  const {
    quizTitle,
    topic,
    documentFileName,
    questions,
    languageName = 'Standard English / Vernacular',
    totalScore,
    isCompleted
  } = options;

  if (!questions || questions.length === 0) {
    throw new Error('No quiz questions available to export.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeFont = await setupPdfFonts(doc, languageName);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - 20;

  // Color Palette - Deep Emerald Accent & Slate
  const slateDark: [number, number, number] = [15, 23, 42];      // #0f172a
  const emeraldAccent: [number, number, number] = [16, 185, 129]; // #10b981
  const lightBg: [number, number, number] = [248, 250, 252];     // #f8fafc
  const cardBorder: [number, number, number] = [226, 232, 240];  // #e2e8f0
  const emeraldBg: [number, number, number] = [236, 253, 245];   // #ecfdf5
  const emeraldText: [number, number, number] = [6, 95, 70];      // #065f46
  const mutedText: [number, number, number] = [100, 116, 139];   // #64748b

  const effectiveTitle = quizTitle || (topic ? `Adaptive Quiz: ${topic}` : documentFileName ? `Quiz: ${documentFileName}` : 'Adaptive Learning Assessment');

  // --- HEADER RENDERER ---
  const renderHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top Dark Banner
      doc.setFillColor(...slateDark);
      doc.rect(0, 0, pageWidth, 26, 'F');

      // Emerald Accent Strip
      doc.setFillColor(...emeraldAccent);
      doc.rect(0, 26, pageWidth, 2.5, 'F');

      // Main Title
      doc.setTextColor(255, 255, 255);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(14);
      const titleLines = doc.splitTextToSize(sanitizeForPDF(effectiveTitle), contentWidth);
      doc.text(titleLines[0] || 'Adaptive Learning Quiz', margin, 12);

      // Subtitle
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Comprehensive Question Bank & In-Depth Solutions  •  ${sanitizeForPDF(languageName)}`, margin, 19.5);
    } else {
      // Running Page Header
      doc.setFillColor(...slateDark);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFillColor(...emeraldAccent);
      doc.rect(0, 12, pageWidth, 1, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(sanitizeForPDF(effectiveTitle), margin, 8);

      doc.setFont(activeFont, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Question Bank  •  ${sanitizeForPDF(languageName)}`, pageWidth - margin, 8, { align: 'right' });
    }
  };

  // --- FOOTER RENDERER ---
  const addFooter = (currentPage: number, totalPages: number) => {
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(`Vernacular Adaptive Learning  •  Generated on ${dateStr}`, margin, pageHeight - 7);
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // Start Page 1
  renderHeader(true);
  let currentY = 34;

  // --- METADATA SUMMARY CARD ---
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2.5, 2.5, 'FD');

  doc.setFont(activeFont, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);

  // Col 1: Topic / Document
  doc.text('Source / Topic:', margin + 4, currentY + 7);
  doc.setFont(activeFont, 'normal');
  const sourceLabel = sanitizeForPDF(documentFileName || topic || 'Curriculum Subject');
  doc.text(sourceLabel.length > 35 ? `${sourceLabel.slice(0, 35)}...` : sourceLabel, margin + 28, currentY + 7);

  // Col 2: Total Questions & Language
  doc.setFont(activeFont, 'bold');
  doc.text('Total Questions:', margin + 4, currentY + 14);
  doc.setFont(activeFont, 'normal');
  doc.text(`${questions.length} Multiple-Choice Items`, margin + 28, currentY + 14);

  // Right Side: Score or Status Badge
  const badgeWidth = 48;
  const badgeX = pageWidth - margin - badgeWidth - 4;
  if (isCompleted && totalScore !== undefined) {
    const pct = Math.round((totalScore / questions.length) * 100);
    doc.setFillColor(...emeraldAccent);
    doc.roundedRect(badgeX, currentY + 4, badgeWidth, 14, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(9);
    doc.text(`Score: ${totalScore}/${questions.length} (${pct}%)`, badgeX + badgeWidth / 2, currentY + 12.5, { align: 'center' });
  } else {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(badgeX, currentY + 4, badgeWidth, 14, 2, 2, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(8);
    doc.text('Practice & Assessment', badgeX + badgeWidth / 2, currentY + 12.5, { align: 'center' });
  }

  currentY += 28;

  // --- RENDER EACH QUESTION ---
  questions.forEach((q, index) => {
    // Estimate needed vertical height for this question card
    const questionTextClean = sanitizeForPDF(q.question);
    const questionLines = doc.splitTextToSize(questionTextClean, contentWidth - 10);
    const dialectLines = q.questionDialect ? doc.splitTextToSize(`"${sanitizeForPDF(q.questionDialect)}"`, contentWidth - 14) : [];
    
    // Options lines calculation
    let optionsHeight = 0;
    const renderedOptions: { label: string; lines: string[] }[] = [];
    (q.options || []).forEach((opt, optIdx) => {
      const optLetter = String.fromCharCode(65 + optIdx);
      const optLines = doc.splitTextToSize(`${optLetter}.  ${sanitizeForPDF(opt)}`, contentWidth - 16);
      renderedOptions.push({ label: optLetter, lines: optLines });
      optionsHeight += (optLines.length * 4.5) + 2;
    });

    const explanationClean = sanitizeForPDF(q.explanation);
    const explanationLines = doc.splitTextToSize(explanationClean, contentWidth - 14);
    const dialectExplanationLines = q.explanationDialect ? doc.splitTextToSize(`Vernacular Note: "${sanitizeForPDF(q.explanationDialect)}"`, contentWidth - 14) : [];

    const estimatedCardHeight = 
      12 + // Header badge
      (questionLines.length * 5) + 
      (dialectLines.length ? dialectLines.length * 4 + 4 : 0) + 
      optionsHeight + 
      10 + // Correct answer pill
      (explanationLines.length * 4.2) + 
      (dialectExplanationLines.length ? dialectExplanationLines.length * 4 + 4 : 0) + 
      10; // Padding

    // Check if new page is needed
    if (currentY + estimatedCardHeight > bottomThreshold) {
      doc.addPage();
      renderHeader(false);
      currentY = 20;
    }

    const cardStartY = currentY;

    // Outer Question Card Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, cardStartY, contentWidth, estimatedCardHeight, 2.5, 2.5, 'FD');

    // Question Number Pill & Difficulty Tag
    doc.setFillColor(...slateDark);
    doc.roundedRect(margin + 4, cardStartY + 4, 28, 6, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(7.5);
    doc.text(`Question ${index + 1}`, margin + 18, cardStartY + 8.2, { align: 'center' });

    if (q.difficulty) {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 34, cardStartY + 4, 24, 6, 1.5, 1.5, 'F');
      doc.setTextColor(...mutedText);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(7);
      doc.text(sanitizeForPDF(q.difficulty), margin + 46, cardStartY + 8.2, { align: 'center' });
    }

    let innerY = cardStartY + 15;

    // Question Text
    doc.setTextColor(...slateDark);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(9.5);
    doc.text(questionLines, margin + 5, innerY);
    innerY += (questionLines.length * 5) + 1;

    // Dialect translation of question if present
    if (dialectLines.length > 0) {
      doc.setTextColor(194, 65, 12); // Warm orange / dialect tone
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(8);
      doc.text(dialectLines, margin + 6, innerY);
      innerY += (dialectLines.length * 4) + 3;
    } else {
      innerY += 2;
    }

    // Options (A, B, C, D)
    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8.5);

    renderedOptions.forEach((ro, optIdx) => {
      const isCorrect = optIdx === q.correctAnswer;

      if (isCorrect) {
        doc.setFillColor(...emeraldBg);
        doc.setDrawColor(167, 243, 208);
        doc.setLineWidth(0.3);
        const optHeight = (ro.lines.length * 4.5) + 2;
        doc.roundedRect(margin + 5, innerY - 3, contentWidth - 10, optHeight, 1.5, 1.5, 'FD');
        doc.setTextColor(...emeraldText);
        doc.setFont(activeFont, 'bold');
      } else {
        doc.setTextColor(51, 65, 85);
        doc.setFont(activeFont, 'normal');
      }

      doc.text(ro.lines, margin + 8, innerY);
      innerY += (ro.lines.length * 4.5) + 2;
    });

    innerY += 3;

    // Correct Answer Highlight Banner
    const correctLetter = String.fromCharCode(65 + (q.correctAnswer ?? 0));
    const correctText = q.options && q.options[q.correctAnswer] ? sanitizeForPDF(q.options[q.correctAnswer]) : '';

    doc.setFillColor(...emeraldBg);
    doc.setDrawColor(110, 231, 183);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin + 5, innerY - 2.5, contentWidth - 10, 7, 1.5, 1.5, 'FD');

    doc.setTextColor(...emeraldText);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(8);
    doc.text(`✓ Correct Answer: Option ${correctLetter}  -  ${correctText.slice(0, 75)}`, margin + 8, innerY + 2);

    innerY += 9;

    // Detailed Academic Explanation Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 5, innerY - 2, contentWidth - 10, (explanationLines.length * 4.2) + (dialectExplanationLines.length ? dialectExplanationLines.length * 4 + 4 : 0) + 7, 1.5, 1.5, 'FD');

    // Left accent bar
    doc.setFillColor(...emeraldAccent);
    doc.rect(margin + 5, innerY - 2, 1.5, (explanationLines.length * 4.2) + (dialectExplanationLines.length ? dialectExplanationLines.length * 4 + 4 : 0) + 7, 'F');

    doc.setTextColor(...slateDark);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(7.5);
    doc.text('Detailed Explanation:', margin + 9, innerY + 2);
    innerY += 5;

    doc.setTextColor(71, 85, 105);
    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8);
    doc.text(explanationLines, margin + 9, innerY);
    innerY += (explanationLines.length * 4.2);

    if (dialectExplanationLines.length > 0) {
      innerY += 1;
      doc.setTextColor(154, 52, 18);
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(7.5);
      doc.text(dialectExplanationLines, margin + 9, innerY);
      innerY += (dialectExplanationLines.length * 4);
    }

    currentY = cardStartY + estimatedCardHeight + 6;
  });

  // Stamp Footers across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Trigger browser download
  const safeName = (effectiveTitle || 'Adaptive_Quiz')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')
    .slice(0, 30);
  doc.save(`${safeName}_Quiz_${Date.now()}.pdf`);
}

// ======================================================================
// 2. MIND MAP HIERARCHY PDF GENERATOR
// ======================================================================

export interface MindMapPDFOptions {
  rootNode: MindMapNode;
  topic?: string;
  documentFileName?: string;
  languageName?: string;
  mindMapImageBase64?: string | null;
  imageWidth?: number;
  imageHeight?: number;
}

interface FlattenedNodeRow {
  index: string;
  label: string;
  level: number;
  category: string;
  description: string;
}

/**
 * Generates and downloads a clean, beautifully formatted Mind Map PDF.
 * Formats the hierarchical tree (JSON format) as an indented outline
 * and structured knowledge reference table so students can easily study
 * core branches and sub-topics.
 */
export async function generateMindMapPDF(options: MindMapPDFOptions): Promise<void> {
  const {
    rootNode,
    topic,
    documentFileName,
    languageName = 'Standard English / Vernacular',
    mindMapImageBase64,
    imageWidth,
    imageHeight
  } = options;

  if (!rootNode) {
    throw new Error('No mind map data available to export.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeFont = await setupPdfFonts(doc, languageName);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - 20;

  // Color Palette - Deep Sky Theme & Slate
  const slateDark: [number, number, number] = [15, 23, 42];     // #0f172a
  const skyAccent: [number, number, number] = [14, 165, 233];   // #0ea5e9
  const lightBg: [number, number, number] = [248, 250, 252];    // #f8fafc
  const cardBorder: [number, number, number] = [226, 232, 240]; // #e2e8f0
  const skyBg: [number, number, number] = [240, 249, 255];      // #f0f9ff
  const skyText: [number, number, number] = [3, 105, 161];      // #0369a1
  const mutedText: [number, number, number] = [100, 116, 139];  // #64748b

  const effectiveTitle = rootNode.label || topic || documentFileName || 'Concept Mind Map';

  // --- HEADER RENDERER ---
  const renderHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top Dark Banner
      doc.setFillColor(...slateDark);
      doc.rect(0, 0, pageWidth, 26, 'F');

      // Sky Accent Strip
      doc.setFillColor(...skyAccent);
      doc.rect(0, 26, pageWidth, 2.5, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(14);
      const titleLines = doc.splitTextToSize(`Mind Map: ${sanitizeForPDF(effectiveTitle)}`, contentWidth);
      doc.text(titleLines[0] || 'Mind Map Concept Hierarchy', margin, 12);

      // Subtitle
      doc.setFont(activeFont, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Structured Hierarchical Outline & Knowledge Tree  •  ${sanitizeForPDF(languageName)}`, margin, 19.5);
    } else {
      // Running Header
      doc.setFillColor(...slateDark);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFillColor(...skyAccent);
      doc.rect(0, 12, pageWidth, 1, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(8.5);
      doc.text(`Mind Map: ${sanitizeForPDF(effectiveTitle)}`, margin, 8);

      doc.setFont(activeFont, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      doc.text(`Concept Breakdown Outline`, pageWidth - margin, 8, { align: 'right' });
    }
  };

  // --- FOOTER RENDERER ---
  const addFooter = (currentPage: number, totalPages: number) => {
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(`Vernacular Concept Maps  •  D3 Tree Outline  •  Generated on ${dateStr}`, margin, pageHeight - 7);
    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // Count total branches and nodes recursively
  let totalNodesCount = 0;
  let maxDepth = 0;

  const countTree = (node: MindMapNode, depth: number) => {
    totalNodesCount++;
    if (depth > maxDepth) maxDepth = depth;
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => countTree(child, depth + 1));
    }
  };
  countTree(rootNode, 0);

  // Start Page 1
  renderHeader(true);
  let currentY = 34;

  // --- METADATA SUMMARY CARD ---
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2.5, 2.5, 'FD');

  doc.setFont(activeFont, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);

  doc.text('Root Concept:', margin + 4, currentY + 7);
  doc.setFont(activeFont, 'normal');
  doc.text(sanitizeForPDF(rootNode.label), margin + 28, currentY + 7);

  doc.setFont(activeFont, 'bold');
  doc.text('Primary Branches:', margin + 4, currentY + 14);
  doc.setFont(activeFont, 'normal');
  const mainBranchCount = rootNode.children?.length || 0;
  doc.text(`${mainBranchCount} Main Branches  (${totalNodesCount} Total Concepts)`, margin + 32, currentY + 14);

  doc.setFont(activeFont, 'bold');
  doc.text('Hierarchy Depth:', margin + 4, currentY + 21);
  doc.setFont(activeFont, 'normal');
  doc.text(`${maxDepth + 1} Structural Levels`, margin + 32, currentY + 21);

  // Right Side: Visual Badge
  const badgeWidth = 48;
  const badgeX = pageWidth - margin - badgeWidth - 4;
  doc.setFillColor(...skyBg);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(badgeX, currentY + 4, badgeWidth, 16, 2, 2, 'FD');
  doc.setTextColor(...skyText);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(8);
  doc.text('D3.js Concept Graph', badgeX + badgeWidth / 2, currentY + 11, { align: 'center' });
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(7);
  doc.text('Structured Outline', badgeX + badgeWidth / 2, currentY + 16, { align: 'center' });

  currentY += 30;

  // --- VISUAL MIND MAP DIAGRAM (CENTERED ON PAGE 1) ---
  if (mindMapImageBase64) {
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...slateDark);
    doc.text('Visual Concept Graph — Hierarchical Map', margin, currentY - 2);

    const startImageY = currentY + 3;
    const availableHeightForImage = bottomThreshold - startImageY - 14;
    const availableWidthForImage = contentWidth;

    const imgAr = (imageWidth && imageHeight && imageHeight > 0) ? (imageWidth / imageHeight) : 1.6;

    let drawW = availableWidthForImage;
    let drawH = drawW / imgAr;

    if (drawH > availableHeightForImage) {
      drawH = availableHeightForImage;
      drawW = drawH * imgAr;
    }

    // Mathematically center horizontally and vertically within the available page section
    const posX = margin + (contentWidth - drawW) / 2;
    const posY = startImageY + (availableHeightForImage - drawH) / 2;

    // Elegant card container framing the centered mind map diagram
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.4);
    doc.roundedRect(posX - 2.5, posY - 2.5, drawW + 5, drawH + 5, 2.5, 2.5, 'FD');

    // Embed high-resolution mind map image
    try {
      doc.addImage(mindMapImageBase64, 'PNG', posX, posY, drawW, drawH, undefined, 'FAST');
    } catch (e) {
      console.warn('Could not insert mind map image into PDF:', e);
    }

    // Centered caption and legend beneath the image
    doc.setFont(activeFont, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text(
      `AI Concept Mind Map  •  Centered Graphical Overview  •  ${totalNodesCount} Total Concept Nodes  •  D3 Tree Layout`,
      pageWidth / 2,
      posY + drawH + 5.5,
      { align: 'center' }
    );

    // Advance to Page 2 for the structured data matrix and hierarchical text outline
    doc.addPage();
    renderHeader(false);
    currentY = 20;
  }

  // --- SECTION 1: OVERVIEW AUTO-TABLE ---
  // Flatten tree for clean summary table
  const tableRows: FlattenedNodeRow[] = [];
  const traverseForTable = (node: MindMapNode, prefix: string, level: number) => {
    tableRows.push({
      index: prefix,
      label: sanitizeForPDF(node.label),
      level,
      category: sanitizeForPDF(node.category || (level === 0 ? 'Root' : level === 1 ? 'Core Branch' : 'Sub-topic')),
      description: sanitizeForPDF(node.description || 'Core concept component')
    });

    if (node.children && node.children.length > 0) {
      node.children.forEach((child, idx) => {
        const nextPrefix = level === 0 ? `${idx + 1}` : `${prefix}.${idx + 1}`;
        traverseForTable(child, nextPrefix, level + 1);
      });
    }
  };
  traverseForTable(rootNode, '0', 0);

  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...slateDark);
  doc.text('1. Executive Branch Index & Concept Matrix', margin, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Concept Branch', 'Level', 'Category', 'Description / Learning Objectives']],
    body: tableRows.map(row => [
      row.index === '0' ? 'Root' : row.index,
      row.level > 0 ? `${'  '.repeat(row.level * 2)}• ${row.label}` : `★ ${row.label}`,
      `L${row.level}`,
      row.category,
      row.description
    ]),
    theme: 'striped',
    headStyles: {
      font: activeFont,
      fontStyle: 'bold',
      fillColor: slateDark,
      textColor: [255, 255, 255],
      fontSize: 8,
      cellPadding: 2.5,
    },
    styles: {
      font: activeFont,
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2.5,
      valign: 'top',
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 26 },
      4: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : currentY + 40;

  // --- SECTION 2: DETAILED HIERARCHICAL INDENTED OUTLINE ---
  if (currentY > bottomThreshold - 30) {
    doc.addPage();
    renderHeader(false);
    currentY = 20;
  }

  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...slateDark);
  doc.text('2. Comprehensive Hierarchical Concept Outline', margin, currentY);
  currentY += 6;

  // Recursive outline formatter with indentation and tree markers
  const renderOutlineNode = (node: MindMapNode, level: number, prefix: string) => {
    const indent = level * 8;
    const nodeWidth = contentWidth - indent;

    const labelClean = sanitizeForPDF(node.label);
    const descClean = sanitizeForPDF(node.description || '');
    const categoryClean = sanitizeForPDF(node.category || '');

    const labelLines = doc.splitTextToSize(
      level === 0 
        ? `★ [Root] ${labelClean}` 
        : level === 1 
          ? `■ ${prefix} ${labelClean}` 
          : `├── ${prefix} ${labelClean}`, 
      nodeWidth - 5
    );

    const descLines = descClean ? doc.splitTextToSize(descClean, nodeWidth - 10) : [];
    const itemHeight = (labelLines.length * 4.5) + (descLines.length ? descLines.length * 4 + 3 : 0) + 4;

    // Check page space
    if (currentY + itemHeight > bottomThreshold) {
      doc.addPage();
      renderHeader(false);
      currentY = 20;
    }

    // Styling according to tree depth
    if (level === 0) {
      // Root Card
      doc.setFillColor(...slateDark);
      doc.roundedRect(margin, currentY, contentWidth, itemHeight + 2, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(9.5);
      doc.text(labelLines, margin + 4, currentY + 6);

      if (descLines.length > 0) {
        doc.setTextColor(226, 232, 240);
        doc.setFont(activeFont, 'normal');
        doc.setFontSize(8);
        doc.text(descLines, margin + 4, currentY + 12);
      }
      currentY += itemHeight + 6;
    } else if (level === 1) {
      // Primary Branch Card
      doc.setFillColor(...skyBg);
      doc.setDrawColor(186, 230, 253);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin + indent, currentY, nodeWidth, itemHeight + 2, 1.5, 1.5, 'FD');

      // Left Accent Strip
      doc.setFillColor(...skyAccent);
      doc.rect(margin + indent, currentY, 1.5, itemHeight + 2, 'F');

      doc.setTextColor(...skyText);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(9);
      doc.text(labelLines, margin + indent + 4, currentY + 5.5);

      if (categoryClean) {
        doc.setFont(activeFont, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`[${categoryClean}]`, margin + indent + nodeWidth - 4, currentY + 5.5, { align: 'right' });
      }

      if (descLines.length > 0) {
        doc.setTextColor(51, 65, 85);
        doc.setFont(activeFont, 'normal');
        doc.setFontSize(7.5);
        doc.text(descLines, margin + indent + 4, currentY + 11);
      }
      currentY += itemHeight + 5;
    } else {
      // Sub-Branch & Leaves (Indented List Style)
      doc.setTextColor(30, 41, 59);
      doc.setFont(activeFont, 'bold');
      doc.setFontSize(8);
      doc.text(labelLines, margin + indent, currentY + 3.5);

      if (descLines.length > 0) {
        doc.setTextColor(100, 116, 139);
        doc.setFont(activeFont, 'normal');
        doc.setFontSize(7.5);
        doc.text(descLines, margin + indent + 6, currentY + 8);
      }
      currentY += itemHeight + 2;
    }

    // Recurse children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child, idx) => {
        const nextPrefix = level === 0 ? `${idx + 1}.0` : `${prefix}.${idx + 1}`;
        renderOutlineNode(child, level + 1, nextPrefix);
      });
    }
  };

  renderOutlineNode(rootNode, 0, '0');

  // Stamp Footers across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Trigger browser download
  const safeName = (effectiveTitle || 'Concept_Mind_Map')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')
    .slice(0, 30);
  doc.save(`${safeName}_MindMap_${Date.now()}.pdf`);
}
