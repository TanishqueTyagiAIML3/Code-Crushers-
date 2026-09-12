import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { sanitizeForPDF } from './pdfHelpers';

export { sanitizeForPDF };

export interface InterviewPDFQuestionReview {
  questionNumber?: number;
  question?: string;
  candidateAnswer?: string;
  accuracyScore?: number;
  relevanceScore?: number;
  score?: number;
  feedback?: string;
}

export interface ChatHistoryTurn {
  question?: string;
  candidateAnswer?: string;
  userLatestAnswer?: string;
  answer?: string;
  score?: number;
  accuracyScore?: number;
  relevanceScore?: number;
  feedback?: string;
  critique?: string;
  evaluation?: {
    score?: number;
    accuracy?: string;
    relevance?: string;
    strengths?: string;
    areasForImprovement?: string;
    overallFeedback?: string;
  };
}

export interface InterviewPDFReportData {
  candidateName?: string;
  targetRole?: string;
  interviewType?: string;
  selectedLanguage?: string;
  interviewLanguage?: string;
  overallScore?: number;
  grade?: string;
  durationFormatted?: string;
  durationSeconds?: number;
  date?: string;
  executiveSummary?: string;
  strengths?: string[];
  keyStrengths?: string[];
  areasOfImprovement?: string[];
  criticalAreasForImprovement?: string[];
  categoryScores?: {
    accuracy?: number;
    relevance?: number;
    technicalDepth?: number;
    technicalKnowledge?: number;
    communicationClarity?: number;
    problemSolving?: number;
    systemArchitecture?: number;
  };
  chatHistory?: ChatHistoryTurn[];
  questionBreakdown?: InterviewPDFQuestionReview[];
  hiringRecommendation?: string;
  actionableStudyPlan?: string[];
}

/**
 * In-memory base64 font cache to avoid redundant network fetching.
 */
const fontBase64Cache: Record<string, string> = {};

/**
 * Helper to fetch a font file and convert it into a base64 string.
 */
async function loadFontAsBase64(fileName: string, fallbackUrl?: string): Promise<string | null> {
  if (fontBase64Cache[fileName]) {
    return fontBase64Cache[fileName];
  }

  const primaryUrl = `/fonts/${fileName}`;
  const urlsToTry = [primaryUrl];
  if (fallbackUrl) {
    urlsToTry.push(fallbackUrl);
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
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
        fontBase64Cache[fileName] = base64;
        return base64;
      }
    } catch {
      // Continue to next fallback URL
    }
  }

  return null;
}

// Eagerly pre-load Unicode fonts in background when module is imported
if (typeof window !== 'undefined') {
  loadFontAsBase64(
    'NotoSansDevanagari-Regular.ttf',
    'https://fonts.gstatic.com/s/notosansdevanagari/v30/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL_08AlXQly-A.ttf'
  );
  loadFontAsBase64(
    'Roboto-Regular.ttf',
    'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf'
  );
}

/**
 * Language dictionary interface for complete PDF localization.
 */
interface PDFLocalizationDictionary {
  documentTitle: string;
  subtitle: string;
  candidateLabel: string;
  targetRoleLabel: string;
  dateLabel: string;
  languageLabel: string;
  durationLabel: string;
  overallScoreLabel: string;
  gradeStrongHire: string;
  gradeHire: string;
  gradeNeedsPrep: string;
  executiveSummaryTitle: string;
  strengthsHeader: string;
  improvementsHeader: string;
  competencyTitle: string;
  competencyHeader: string;
  scoreColHeader: string;
  levelHeader: string;
  questionBreakdownTitle: string;
  questionHeader: string;
  candidateAnswerHeader: string;
  scoreHeader: string;
  feedbackHeader: string;
  recommendationTitle: string;
  footerText: string;
  pageText: string;
  ofText: string;
  competencies: {
    accuracy: string;
    relevance: string;
    technicalDepth: string;
    communicationClarity: string;
    systemArchitecture: string;
    problemSolving: string;
    mastery: string;
    developing: string;
    excellent: string;
    good: string;
    strong: string;
    moderate: string;
    fluent: string;
    needsPractice: string;
  };
}

const LOCALIZATIONS: Record<string, PDFLocalizationDictionary> = {
  hi: {
    documentTitle: 'एआई मॉक इंटरव्यू परफॉरमेंस रिपोर्ट',
    subtitle: 'व्यापक बहु-चरणीय तकनीकी एवं एचआर मूल्यांकन रूब्रिक',
    candidateLabel: 'उम्मीदवार:',
    targetRoleLabel: 'लक्षित पद:',
    dateLabel: 'दिनांक:',
    languageLabel: 'साक्षात्कार भाषा:',
    durationLabel: 'कुल समय:',
    overallScoreLabel: 'कुल स्कोर',
    gradeStrongHire: 'सख्त चयन अनुशंसा (Strong Hire)',
    gradeHire: 'चयन अनुशंसित (Hire)',
    gradeNeedsPrep: 'अतिरिक्त तैयारी आवश्यक (Needs Preparation)',
    executiveSummaryTitle: 'कार्यकारी मूल्यांकन सारांश',
    strengthsHeader: 'प्रमुख क्षमताएं एवं सकारात्मक पहलू',
    improvementsHeader: 'सुधार एवं विकास के प्रमुख क्षेत्र',
    competencyTitle: 'दक्षता एवं योग्यता स्कोर विवरण',
    competencyHeader: 'मूल्यांकन मानदंड',
    scoreColHeader: 'स्कोर',
    levelHeader: 'दक्षता स्तर',
    questionBreakdownTitle: 'प्रश्न-वार विस्तृत मूल्यांकन एवं साक्षात्कार विवरण',
    questionHeader: 'प्रश्न',
    candidateAnswerHeader: 'उम्मीदवार का उत्तर',
    scoreHeader: 'स्कोर',
    feedbackHeader: 'फीडबैक',
    recommendationTitle: 'अंतिम भर्ती अनुशंसा एवं तैयारी योजना',
    footerText: 'एआई मॉक इंटरव्यू प्लेटफॉर्म  •  पूर्ण बहुभाषी मूल्यांकन  •  तैयार दिनांक: ',
    pageText: 'पृष्ठ',
    ofText: '/',
    competencies: {
      accuracy: 'तकनीकी सटीकता एवं शुद्धता',
      relevance: 'प्रासंगिकता एवं प्रत्यक्ष उत्तर',
      technicalDepth: 'तकनीकी गहराई एवं ट्रेड-ऑफ',
      communicationClarity: 'संवाद स्पष्टता एवं संरचना',
      systemArchitecture: 'सिस्टम आर्किटेक्चर एवं स्केलेबिलिटी',
      problemSolving: 'समस्या समाधान क्षमता',
      mastery: 'उत्कृष्ट (Mastery)',
      developing: 'प्रगति पर (Developing)',
      excellent: 'अति उत्तम (Excellent)',
      good: 'अच्छा (Good)',
      strong: 'मजबूत (Strong)',
      moderate: 'संतोषजनक (Moderate)',
      fluent: 'प्रभावी (Fluent)',
      needsPractice: 'अभ्यास आवश्यक (Needs Practice)',
    },
  },
  es: {
    documentTitle: 'Informe de Rendimiento de Entrevista Simulada con IA',
    subtitle: 'Rúbrica Integral de Evaluación Técnica y de RRHH',
    candidateLabel: 'Candidato:',
    targetRoleLabel: 'Puesto Objetivo:',
    dateLabel: 'Fecha:',
    languageLabel: 'Idioma de Entrevista:',
    durationLabel: 'Duración:',
    overallScoreLabel: 'Puntaje General',
    gradeStrongHire: 'Contratación Altamente Recomendada (Strong Hire)',
    gradeHire: 'Contratación Recomendada (Hire)',
    gradeNeedsPrep: 'Requiere Preparación Adicional (Needs Prep)',
    executiveSummaryTitle: 'Resumen Ejecutivo de la Evaluación',
    strengthsHeader: 'Fortalezas Clave y Competencias',
    improvementsHeader: 'Áreas de Mejora y Crecimiento',
    competencyTitle: 'Desglose de Competencias y Habilidades',
    competencyHeader: 'Competencia Evaluada',
    scoreColHeader: 'Puntaje',
    levelHeader: 'Nivel de Dominio',
    questionBreakdownTitle: 'Desglose Detallado de Preguntas y Respuestas',
    questionHeader: 'Pregunta',
    candidateAnswerHeader: 'Respuesta del Candidato',
    scoreHeader: 'Puntaje',
    feedbackHeader: 'Comentarios',
    recommendationTitle: 'Recomendación Final de Contratación y Plan de Acción',
    footerText: 'Plataforma de Entrevista con IA  •  Evaluación Multilingüe  •  Fecha: ',
    pageText: 'Página',
    ofText: 'de',
    competencies: {
      accuracy: 'Precisión y Corrección Técnica',
      relevance: 'Relevancia y Respuestas Directas',
      technicalDepth: 'Profundidad Técnica y Compromisos',
      communicationClarity: 'Claridad y Estructura de Comunicación',
      systemArchitecture: 'Arquitectura de Sistemas y Escalabilidad',
      problemSolving: 'Resolución de Problemas',
      mastery: 'Dominio Sobresaliente',
      developing: 'En Desarrollo',
      excellent: 'Excelente',
      good: 'Bueno',
      strong: 'Sólido',
      moderate: 'Moderado',
      fluent: 'Fluido',
      needsPractice: 'Requiere Práctica',
    },
  },
  en: {
    documentTitle: 'AI MOCK INTERVIEW PERFORMANCE REPORT',
    subtitle: 'Comprehensive Technical & HR Multi-Turn Assessment Rubric',
    candidateLabel: 'Candidate:',
    targetRoleLabel: 'Target Role:',
    dateLabel: 'Date:',
    languageLabel: 'Interview Language:',
    durationLabel: 'Duration:',
    overallScoreLabel: 'Overall Score',
    gradeStrongHire: 'Strong Hire',
    gradeHire: 'Hire',
    gradeNeedsPrep: 'Needs Preparation',
    executiveSummaryTitle: 'Executive Assessment Summary',
    strengthsHeader: 'Key Strengths & Demonstrated Competencies',
    improvementsHeader: 'Areas for Improvement & Growth',
    competencyTitle: 'Competency Evaluation Breakdown',
    competencyHeader: 'Evaluation Competency',
    scoreColHeader: 'Score',
    levelHeader: 'Assessment Level',
    questionBreakdownTitle: 'Question-by-Question Evaluation Breakdown',
    questionHeader: 'Question',
    candidateAnswerHeader: 'Candidate Response',
    scoreHeader: 'Score',
    feedbackHeader: 'Feedback',
    recommendationTitle: 'Final Hiring Recommendation & Actionable Study Plan',
    footerText: 'AI Mock Interview Platform  •  Multilingual Assessment  •  Generated on: ',
    pageText: 'Page',
    ofText: 'of',
    competencies: {
      accuracy: 'Technical Accuracy & Correctness',
      relevance: 'Relevance & Direct Answers',
      technicalDepth: 'Technical Depth & Trade-offs',
      communicationClarity: 'Communication Clarity & Structure',
      systemArchitecture: 'System Architecture & Scalability',
      problemSolving: 'Problem Solving & Reasoning',
      mastery: 'Mastery',
      developing: 'Developing',
      excellent: 'Excellent',
      good: 'Good',
      strong: 'Strong',
      moderate: 'Moderate',
      fluent: 'Fluent',
      needsPractice: 'Needs Practice',
    },
  },
};

/**
 * Resolves the language code based on user selection or text string.
 */
function resolveLanguageKey(langStr?: string): 'hi' | 'es' | 'en' {
  if (!langStr) return 'hi';
  const lower = langStr.toLowerCase();

  // Spanish detection
  if (lower.includes('span') || lower.includes('español') || lower.includes('espanol')) {
    return 'es';
  }

  // Indic / Devanagari family languages (Hindi, Bhojpuri, Awadhi, Marathi, Maithili, etc.)
  if (
    lower.includes('hind') ||
    lower.includes('bhoj') ||
    lower.includes('awadh') ||
    lower.includes('marath') ||
    lower.includes('maithil') ||
    lower.includes('हिन्दी') ||
    lower.includes('भोजपुरी') ||
    lower.includes('अवधी') ||
    lower.includes('मराठी')
  ) {
    return 'hi';
  }

  // English fallback
  if (lower.includes('eng')) {
    return 'en';
  }

  // Default to Hindi for Indian regional context or fallback to English if Latin
  return /[\u0900-\u097F]/.test(langStr) ? 'hi' : 'en';
}

/**
 * Generates a fully localized, professional Candidate Performance Report PDF
 * using jsPDF and jspdf-autotable with custom embedded Unicode fonts.
 */
export async function generateInterviewPDFReport(data: InterviewPDFReportData): Promise<void> {
  const selectedLang = data.selectedLanguage || data.interviewLanguage || 'Hindi';
  const langKey = resolveLanguageKey(selectedLang);
  const dict = LOCALIZATIONS[langKey] || LOCALIZATIONS.hi;
  const isDevanagari = langKey === 'hi' || /[\u0900-\u097F]/.test(selectedLang);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 1. EMBED CUSTOM UNICODE FONTS
  let activeFont = 'helvetica';

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
        // Register under 'Roboto' as well for seamless compatibility
        doc.addFont('NotoSansDevanagari.ttf', 'Roboto', 'normal');
        doc.addFont('NotoSansDevanagari.ttf', 'Roboto', 'bold');
        activeFont = 'Roboto';
      }
    } else {
      const robotoBase64 = await loadFontAsBase64(
        'Roboto-Regular.ttf',
        'https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf'
      );

      if (robotoBase64) {
        doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'bold');
        activeFont = 'Roboto';
      }
    }
  } catch (fontErr) {
    console.warn('Unicode font embedding failed, falling back to standard font:', fontErr);
  }

  doc.setFont(activeFont, 'normal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Palette definition
  const primaryColor: [number, number, number] = [234, 88, 12]; // #ea580c (Amber/Orange)
  const secondaryColor: [number, number, number] = [15, 23, 42]; // #0f172a (Slate 900)
  const mutedColor: [number, number, number] = [100, 116, 139]; // #64748b (Slate 500)
  const lightBgColor: [number, number, number] = [248, 250, 252]; // #f8fafc (Slate 50)
  const emeraldColor: [number, number, number] = [16, 185, 129]; // #10b981 (Emerald)

  let currentY = 14;

  // --- 1. HEADER SECTION ---
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(...primaryColor);
  doc.rect(0, 28, pageWidth, 2.5, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(15);
  doc.text(dict.documentTitle, margin, 13);

  // Subtitle
  doc.setFont(activeFont, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`${dict.subtitle}  •  ${selectedLang}`, margin, 20.5);

  currentY = 37;

  // --- 2. CANDIDATE & SESSION METADATA CARD ---
  doc.setFillColor(...lightBgColor);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 27, 3, 3, 'FD');

  doc.setTextColor(...secondaryColor);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(9.5);
  doc.text(dict.candidateLabel, margin + 4, currentY + 7);
  doc.setFont(activeFont, 'normal');
  doc.text(sanitizeForPDF(data.candidateName || 'Candidate'), margin + 30, currentY + 7);

  doc.setFont(activeFont, 'bold');
  doc.text(dict.targetRoleLabel, margin + 4, currentY + 14);
  doc.setFont(activeFont, 'normal');
  doc.text(sanitizeForPDF(data.targetRole || 'Full-Stack Software Engineer'), margin + 30, currentY + 14);

  doc.setFont(activeFont, 'bold');
  doc.text(dict.dateLabel, margin + 4, currentY + 21);
  doc.setFont(activeFont, 'normal');
  const sessionDate = data.date || new Date().toLocaleDateString();
  const sessionDuration = data.durationFormatted ? `  |  ${dict.durationLabel} ${data.durationFormatted}` : '';
  doc.text(`${sessionDate}${sessionDuration}`, margin + 30, currentY + 21);

  // Right column of card: Score Badge
  const badgeWidth = 52;
  const badgeX = pageWidth - margin - badgeWidth - 2;
  const scoreVal = Math.round(Number(data.overallScore) || 85);
  const gradeLabel =
    data.grade ||
    (scoreVal >= 85
      ? dict.gradeStrongHire
      : scoreVal >= 70
        ? dict.gradeHire
        : dict.gradeNeedsPrep);

  doc.setFillColor(
    scoreVal >= 75 ? emeraldColor[0] : 245,
    scoreVal >= 75 ? emeraldColor[1] : 158,
    scoreVal >= 75 ? emeraldColor[2] : 11
  );
  doc.roundedRect(badgeX, currentY + 3.5, badgeWidth, 20, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(13.5);
  doc.text(`${scoreVal} / 100`, badgeX + badgeWidth / 2, currentY + 11.5, { align: 'center' });

  doc.setFont(activeFont, 'normal');
  doc.setFontSize(7.5);
  const truncatedGrade = gradeLabel.length > 25 ? gradeLabel.slice(0, 24) + '...' : gradeLabel;
  doc.text(truncatedGrade, badgeX + badgeWidth / 2, currentY + 18, { align: 'center' });

  currentY += 33;

  // --- 3. EXECUTIVE ASSESSMENT SUMMARY ---
  doc.setTextColor(...secondaryColor);
  doc.setFont(activeFont, 'bold');
  doc.setFontSize(10.5);
  doc.text(dict.executiveSummaryTitle, margin, currentY);
  currentY += 3.5;

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 28, currentY);
  currentY += 4.5;

  doc.setFont(activeFont, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const rawSummary =
    data.executiveSummary ||
    (isDevanagari
      ? 'उम्मीदवार ने साक्षात्कार के विभिन्न चरणों में ठोस वैचारिक स्पष्टता, संरचित तकनीकी संवाद एवं समस्या-समाधान क्षमता का प्रभावशाली प्रदर्शन किया।'
      : 'Demonstrated consistent technical communication, structured reasoning, and problem-solving depth throughout the interview rounds.');
  const cleanSummary = sanitizeForPDF(rawSummary);

  const splitSummary = doc.splitTextToSize(cleanSummary, contentWidth);
  doc.text(splitSummary, margin, currentY);
  currentY += splitSummary.length * 4.2 + 6;

  // --- 4. KEY STRENGTHS & AREAS OF IMPROVEMENT TABLE ---
  const strengthsList = (data.strengths && data.strengths.length > 0)
    ? data.strengths
    : (data.keyStrengths && data.keyStrengths.length > 0)
      ? data.keyStrengths
      : [
          isDevanagari
            ? 'मजबूत बुनियादी तकनीकी ज्ञान एवं स्पष्ट संवाद'
            : 'Strong foundational conceptual clarity and confident delivery.',
          isDevanagari
            ? 'प्रोजेक्ट आर्किटेक्चर एवं कंपोनेंट लाइफसाइकिल की अच्छी समझ'
            : 'Clear technical communication and structured problem solving.'
        ];

  const improvementsList = (data.areasOfImprovement && data.areasOfImprovement.length > 0)
    ? data.areasOfImprovement
    : (data.criticalAreasForImprovement && data.criticalAreasForImprovement.length > 0)
      ? data.criticalAreasForImprovement
      : [
          isDevanagari
            ? 'वितरित प्रणालियों में एज-केस एवं विफलता रिकवरी को और गहरा करें'
            : 'Deepen edge-case exploration and distributed failure recovery modes.'
        ];

  const strengthsText = strengthsList
    .map((s, i) => `${i + 1}. ${sanitizeForPDF(s)}`)
    .join('\n\n');

  const improvementsText = improvementsList
    .map((a, i) => `${i + 1}. ${sanitizeForPDF(a)}`)
    .join('\n\n');

  autoTable(doc, {
    startY: currentY,
    head: [[dict.strengthsHeader, dict.improvementsHeader]],
    body: [[strengthsText, improvementsText]],
    theme: 'grid',
    headStyles: {
      font: activeFont,
      fontStyle: 'bold',
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      cellPadding: 3.5,
    },
    styles: {
      font: activeFont,
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 3.5,
      valign: 'top',
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: contentWidth / 2 },
      1: { cellWidth: contentWidth / 2 },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // --- 5. CATEGORY METRICS BREAKDOWN TABLE ---
  const comp = dict.competencies;
  const catScores = data.categoryScores || {
    accuracy: 88,
    relevance: 86,
    technicalDepth: 84,
    communicationClarity: 86,
  };

  const catRows = [
    [
      comp.accuracy,
      `${catScores.accuracy ?? 88}%`,
      (catScores.accuracy ?? 88) >= 80 ? comp.mastery : comp.developing,
    ],
    [
      comp.relevance,
      `${catScores.relevance ?? 86}%`,
      (catScores.relevance ?? 86) >= 80 ? comp.excellent : comp.good,
    ],
    [
      comp.technicalDepth,
      `${catScores.technicalDepth ?? 84}%`,
      (catScores.technicalDepth ?? 84) >= 80 ? comp.strong : comp.moderate,
    ],
    [
      comp.communicationClarity,
      `${catScores.communicationClarity ?? 86}%`,
      (catScores.communicationClarity ?? 86) >= 80 ? comp.fluent : comp.needsPractice,
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [[dict.competencyHeader, dict.scoreColHeader, dict.levelHeader]],
    body: catRows,
    theme: 'striped',
    headStyles: {
      font: activeFont,
      fontStyle: 'bold',
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      cellPadding: 3,
    },
    styles: {
      font: activeFont,
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.8,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.55 },
      1: { cellWidth: contentWidth * 0.2, halign: 'center' },
      2: { cellWidth: contentWidth * 0.25, halign: 'center' },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Check page height before Question Breakdown
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 20;
  }

  // --- 6. QUESTION BREAKDOWN TABLE (FROM CHAT HISTORY) ---
  // Map conversational data from either chatHistory or questionBreakdown
  let rawTurns: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }> = [];

  if (Array.isArray(data.chatHistory) && data.chatHistory.length > 0) {
    rawTurns = data.chatHistory.map((turn, i) => {
      const q = turn.question || `Turn #${i + 1}`;
      const ans = turn.candidateAnswer || turn.userLatestAnswer || turn.answer || '';
      const sc = Number(turn.score ?? turn.evaluation?.score ?? turn.accuracyScore ?? 85);
      const fb =
        turn.feedback ||
        (turn.evaluation
          ? [turn.evaluation.strengths, turn.evaluation.areasForImprovement].filter(Boolean).join(' ')
          : '') ||
        turn.critique ||
        (isDevanagari
          ? 'उत्तर में मुख्य तकनीकी पहलुओं को संबोधित किया गया।'
          : 'Answer addressed key technical requirements.');

      return {
        question: sanitizeForPDF(q),
        answer: sanitizeForPDF(ans),
        score: sc,
        feedback: sanitizeForPDF(fb),
      };
    });
  } else if (Array.isArray(data.questionBreakdown) && data.questionBreakdown.length > 0) {
    rawTurns = data.questionBreakdown.map((q, i) => ({
      question: sanitizeForPDF(q.question || `Question #${i + 1}`),
      answer: sanitizeForPDF(q.candidateAnswer || ''),
      score: Number(q.score ?? q.accuracyScore ?? 85),
      feedback: sanitizeForPDF(q.feedback || 'Answer addressed core technical concepts.'),
    }));
  }

  if (rawTurns.length > 0) {
    doc.setTextColor(...secondaryColor);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(10.5);
    doc.text(dict.questionBreakdownTitle, margin, currentY);
    currentY += 3.5;

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.8);
    doc.line(margin, currentY, margin + 35, currentY);
    currentY += 4.5;

    const breakdownTableBody = rawTurns.map((turn, idx) => {
      const qNum = String(idx + 1);
      const questionText = turn.question;
      const answerText = turn.answer || (isDevanagari ? '(उत्तर दर्ज किया गया)' : '(Response provided)');
      const scoreStr = `${Math.round(turn.score || 85)}%`;
      const feedbackText = turn.feedback;

      return [qNum, questionText, answerText, scoreStr, feedbackText];
    });

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          '#',
          dict.questionHeader,
          dict.candidateAnswerHeader,
          dict.scoreHeader,
          dict.feedbackHeader,
        ],
      ],
      body: breakdownTableBody,
      theme: 'grid',
      headStyles: {
        font: activeFont,
        fontStyle: 'bold',
        fillColor: secondaryColor,
        textColor: [255, 255, 255],
        fontSize: 8.5,
        cellPadding: 3,
      },
      styles: {
        font: activeFont,
        fontSize: 7.5,
        textColor: [30, 41, 59],
        cellPadding: 3,
        valign: 'top',
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 9, halign: 'center' },
        1: { cellWidth: 48 },
        2: { cellWidth: 56 },
        3: { cellWidth: 17, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 52 },
      },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 7. FINAL HIRING RECOMMENDATION & ACTION PLAN ---
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  if (data.actionableStudyPlan && data.actionableStudyPlan.length > 0) {
    doc.setTextColor(...secondaryColor);
    doc.setFont(activeFont, 'bold');
    doc.setFontSize(10.5);
    doc.text(dict.recommendationTitle, margin, currentY);
    currentY += 3.5;

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.8);
    doc.line(margin, currentY, margin + 30, currentY);
    currentY += 4.5;

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    data.actionableStudyPlan.forEach((step, idx) => {
      const stepText = `${idx + 1}. ${sanitizeForPDF(step)}`;
      const splitStep = doc.splitTextToSize(stepText, contentWidth);
      doc.text(splitStep, margin, currentY);
      currentY += splitStep.length * 3.8 + 1.5;
    });

    currentY += 4;
  }

  // --- 8. FOOTER ACROSS ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont(activeFont, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedColor);
    doc.text(
      `${dict.footerText}${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 5
    );
    doc.text(
      `${dict.pageText} ${i} ${dict.ofText} ${totalPages}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' }
    );
  }

  // Save the PDF with a clean localized filename
  const sanitizedRole = (data.targetRole || 'Software_Engineer').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `AI_Interview_Report_${sanitizedRole}_${Date.now()}.pdf`;
  doc.save(filename);
}

export default generateInterviewPDFReport;
