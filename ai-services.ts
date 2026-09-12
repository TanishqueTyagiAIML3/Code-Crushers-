import { getProModel, PRIMARY_MODEL, Type } from "./ai-config.ts";
import { inspectAndExtractPDF, extractTextFromPDF, isRawPdfBinary } from "./src/utils/pdfExtractor.ts";

/**
 * Universal Language Directive Builder
 * Enforces strict multilingual output generation across all Gemini prompts.
 *
 * @param {string} selectedLanguage - Active UI/target language (e.g. "Hindi", "Spanish", "English", "French", "German", "Bengali", etc.)
 * @param {boolean} isJsonSchema - Whether the prompt expects a structured JSON payload
 * @returns {string} System prompt language directive
 */
export function buildUniversalLanguageDirective(selectedLanguage: string = "Hindi", isJsonSchema: boolean = false): string {
  const cleanLang = (selectedLanguage || "Hindi").trim();

  let directive = `
======================================================================
UNIVERSAL MULTILINGUAL ENFORCEMENT DIRECTIVE (CRITICAL - MANDATORY)
======================================================================
1. PRIMARY LANGUAGE REQUIREMENT:
   - Generate the entire response, explanations, analysis, questions, and content STRICTLY in "${cleanLang}".
   - Under NO circumstances should you default, fallback, or revert to English or any other language unless "${cleanLang}" is explicitly English.
   - Employ natural, grammatically rich, culturally nuanced, and pedagogical terminology native to speakers of "${cleanLang}".
`;

  if (isJsonSchema) {
    directive += `
2. JSON SCHEMA INTEGRITY & VALUE LOCALIZATION RULE:
   - All JSON object KEYS (properties) MUST remain in English exactly as defined in the schema (e.g. "id", "label", "description", "children", "questions", "options", "feedback", "crossQuestion").
   - ALL JSON string VALUES (titles, labels, descriptions, questions, options, explanations, notes, critiques, feedback) MUST be written STRICTLY in "${cleanLang}".
   - Ensure output is valid RFC 8259 JSON without trailing commas or syntax deviations.
`;
  }

  directive += `======================================================================\n`;
  return directive;
}

/**
 * Regex utility to safely strip Markdown backticks (```json and ```) and extract clean JSON
 *
 * @param text - Raw model string response
 * @returns Cleaned JSON string
 */
export function stripMarkdownBackticks(text: string): string {
  if (!text || typeof text !== "string") return "";

  let cleaned = text.trim();

  // 1. Check for standard markdown code block: ```json ... ``` or ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleaned = codeBlockMatch[1].trim();
  } else {
    // 2. Strip leading ```json or trailing ```
    cleaned = cleaned
      .replace(/^[\s\S]*?```(?:json)?\s*/i, "")
      .replace(/\s*```[\s\S]*?$/i, "")
      .trim();
  }

  // 3. If conversational text surrounds the JSON, extract the outermost JSON envelope {...} or [...]
  if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");
    let startIdx = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      startIdx = Math.min(firstBrace, firstBracket);
    } else {
      startIdx = firstBrace !== -1 ? firstBrace : firstBracket;
    }

    if (startIdx !== -1) {
      const lastBrace = cleaned.lastIndexOf("}");
      const lastBracket = cleaned.lastIndexOf("]");
      const endIdx = Math.max(lastBrace, lastBracket);
      if (endIdx > startIdx) {
        cleaned = cleaned.substring(startIdx, endIdx + 1);
      }
    }
  }

  return cleaned;
}

/**
 * Safely cleans and parses JSON strings returned by Gemini
 * (handles markdown wrapping like ```json ... ``` and nested try-catch)
 */
export function cleanAndParseJSON<T = any>(text: string): T | null {
  if (!text) return null;
  try {
    const cleaned = stripMarkdownBackticks(text);
    return JSON.parse(cleaned) as T;
  } catch (err: any) {
    console.warn("Could not directly parse model output as JSON. Returning null.", err?.message);
    return null;
  }
}

export interface DocumentContentPayload {
  text?: string;
  documentText?: string;
  pdfBase64?: string;
  documentBase64?: string;
  mimeType?: string;
}

export interface ResolvedDocumentContent {
  cleanText?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/**
 * Resolves input content into either clean text or Gemini inlineData for native PDF handling.
 * Ensures raw PDF binary streams or file metadata are NEVER passed directly into the text prompt.
 */
export async function resolveDocumentContent(
  contentOrPayload: string | DocumentContentPayload | any
): Promise<ResolvedDocumentContent> {
  if (!contentOrPayload) {
    return { cleanText: "" };
  }

  // Case 1: Object payload containing PDF base64
  if (typeof contentOrPayload === "object" && contentOrPayload !== null) {
    const b64 = contentOrPayload.pdfBase64 || contentOrPayload.documentBase64;
    const mime = contentOrPayload.mimeType || "application/pdf";
    const rawFallback = contentOrPayload.text || contentOrPayload.documentText || "";
    const fallbackClean = typeof rawFallback === "string" ? rawFallback.trim() : "";
    const hasMeaningfulFallback = fallbackClean.length > 0 && !fallbackClean.startsWith("[Attached PDF Document");

    if (b64 && typeof b64 === "string" && b64.trim().length > 0) {
      const inspection = await inspectAndExtractPDF(b64);

      // 1. Clean readable text was extracted
      if (inspection.text && inspection.text.length >= 20) {
        return { cleanText: inspection.text };
      }

      // 2. Valid multi-page PDF (scanned pages, diagrams) without selectable text
      if (inspection.isValid && inspection.totalPages >= 1 && inspection.cleanBase64) {
        return {
          inlineData: {
            mimeType: mime,
            data: inspection.cleanBase64,
          },
        };
      }

      // 3. Invalid PDF, 0 pages, or corrupted buffer: NEVER send invalid inlineData to Gemini!
      console.warn("⚠️ [resolveDocumentContent] PDF is invalid or has 0 pages, avoiding invalid inlineData:", inspection.error);

      if (hasMeaningfulFallback) {
        return { cleanText: fallbackClean };
      }

      if (fallbackClean.startsWith("[Attached PDF Document:")) {
        const fileMatch = fallbackClean.match(/\[Attached PDF Document:\s*([^(\]]+)/i);
        const derivedTopic = fileMatch && fileMatch[1]
          ? fileMatch[1].replace(/\.pdf$/i, "").replace(/[_-]/g, " ").trim()
          : "Educational curriculum concepts";
        return { cleanText: `Study Topic: ${derivedTopic}` };
      }

      if (fallbackClean.length > 0) {
        return { cleanText: fallbackClean };
      }

      return { cleanText: "Core curriculum subject principles and fundamental concepts" };
    }

    if (hasMeaningfulFallback) {
      return resolveDocumentContent(fallbackClean);
    }
  }

  // Case 2: String content (check for accidental binary PDF injection from FileReader.readAsText)
  if (typeof contentOrPayload === "string") {
    const trimmed = contentOrPayload.trim();

    if (isRawPdfBinary(trimmed)) {
      console.log("⚠️ [AI Services] Raw PDF binary detected in input. Intercepting and extracting clean text...");
      const inspection = await inspectAndExtractPDF(trimmed);
      if (inspection.text && inspection.text.length >= 20) {
        return { cleanText: inspection.text };
      }

      if (inspection.isValid && inspection.totalPages >= 1 && inspection.cleanBase64) {
        return {
          inlineData: {
            mimeType: "application/pdf",
            data: inspection.cleanBase64,
          },
        };
      }

      return { cleanText: "Educational study material and curriculum topics" };
    }

    return { cleanText: trimmed };
  }

  return { cleanText: String(contentOrPayload || "") };
}

/**
 * Resiliently executes model generation, automatically falling back to pure text prompt
 * if the model rejects inline document data (e.g. 0-page or unprocessable PDF).
 */
async function executeWithDocumentFallback(
  model: any,
  contents: any,
  resolved: ResolvedDocumentContent,
  prompt: string,
  docContext?: string
): Promise<any> {
  try {
    return await model.generateContent(contents as any);
  } catch (err: any) {
    if (resolved?.inlineData && (err?.message?.includes("pages") || err?.message?.includes("document") || err?.status === 400)) {
      console.warn("⚠️ Document inlineData rejected by model, retrying with text prompt fallback:", err?.message);
      const fallbackText = resolved.cleanText || "Core subject principles and curriculum concepts";
      const textDocContext = `EDUCATIONAL MATERIAL / DOCUMENT CONTENT:\n"""\n${fallbackText}\n"""`;
      const fallbackPrompt = docContext && prompt.includes(docContext)
        ? prompt.replace(docContext, textDocContext)
        : `${prompt}\n\n${textDocContext}`;
      return await model.generateContent(fallbackPrompt as any);
    }
    throw err;
  }
}

// ======================================================================
// FEATURE 1: DYNAMIC STUDY TOOLS (Mind Maps, Quizzes, Flashcards)
// ======================================================================

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description: string;
  category?: string;
  children?: MindMapNode[];
}

export interface MindMapResponse {
  success: boolean;
  root?: MindMapNode;
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

/**
 * Ensures all nodes in a generated Mind Map have valid IDs, non-empty labels,
 * valid descriptions, and clean child arrays to prevent D3 layout and rendering warnings.
 */
export function sanitizeMindMapNode(node: any, prefix = "node"): MindMapNode {
  if (!node || typeof node !== "object") {
    return {
      id: `${prefix}-1`,
      label: "Main Concept",
      description: "Fundamental concept in the knowledge tree.",
      children: [],
    };
  }

  const sanitized: MindMapNode = {
    id: String(node.id || `${prefix}-${Math.random().toString(36).substring(2, 7)}`),
    label: String(node.label || node.title || node.name || "Concept").trim(),
    description: String(node.description || node.details || node.desc || "").trim(),
    category: node.category ? String(node.category).trim() : undefined,
  };

  if (Array.isArray(node.children) && node.children.length > 0) {
    sanitized.children = node.children.map((child: any, idx: number) =>
      sanitizeMindMapNode(child, `${sanitized.id}-${idx + 1}`)
    );
  } else {
    sanitized.children = [];
  }

  return sanitized;
}

/**
 * 1.1 Generate Mind Map Hierarchy from Raw / PDF Text
 * Generates a deeply structured hierarchical tree based on uploaded educational text or PDF.
 *
 * @param content - Document text, textbook extract, topic, or object { documentText, pdfBase64, mimeType }
 * @param selectedLanguage - Active UI language (e.g., "Hindi", "Spanish", "English")
 */
export async function generateMindMap(
  content: string | DocumentContentPayload | any,
  selectedLanguage: string = "Hindi"
): Promise<MindMapResponse> {
  try {
    const resolved = await resolveDocumentContent(content);

    if (!resolved.cleanText && !resolved.inlineData) {
      throw new Error("Content/document text is required to generate a mind map.");
    }

    const model = getProModel({
      temperature: 0.35,
      responseMimeType: "application/json",
    });

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const docContext = resolved.inlineData
      ? "The primary study material is provided as an attached PDF document. Thoroughly read and synthesize the full document contents, diagrams, and topics."
      : `EDUCATIONAL MATERIAL / DOCUMENT CONTENT:\n"""\n${resolved.cleanText}\n"""`;

    const prompt = `You are a Principal Curriculum Architect and Cognitive Knowledge Graph Specialist.
${languageDirective}

TASK:
Analyze the provided educational material and structure it into a comprehensive, multi-tiered hierarchical MIND MAP.
Each branch must logically decompose overarching concepts into core principles, mechanisms, and real-world applications.

${docContext}

SCHEMA SPECIFICATION (JSON Keys in English, all string values strictly in ${selectedLanguage}):
{
  "root": {
    "id": "root-1",
    "label": "Central Topic Title (max 4-5 words in ${selectedLanguage})",
    "description": "Comprehensive 1-2 sentence overview of the core subject in ${selectedLanguage}",
    "category": "Foundational Concept (in ${selectedLanguage})",
    "children": [
      {
        "id": "node-1",
        "label": "Primary Branch 1 (in ${selectedLanguage})",
        "description": "Branch explanation in ${selectedLanguage}",
        "category": "Sub-theme in ${selectedLanguage}",
        "children": [
          {
            "id": "sub-1-1",
            "label": "Key Principle / Mechanism (in ${selectedLanguage})",
            "description": "Concrete detail or practical application in ${selectedLanguage}",
            "category": "Detail in ${selectedLanguage}"
          },
          {
            "id": "sub-1-2",
            "label": "Second Sub-Concept (in ${selectedLanguage})",
            "description": "Concrete detail in ${selectedLanguage}",
            "category": "Detail in ${selectedLanguage}"
          }
        ]
      },
      {
        "id": "node-2",
        "label": "Primary Branch 2 (in ${selectedLanguage})",
        "description": "Branch explanation in ${selectedLanguage}",
        "category": "Sub-theme in ${selectedLanguage}",
        "children": [
          {
            "id": "sub-2-1",
            "label": "Sub-Concept (in ${selectedLanguage})",
            "description": "Detail in ${selectedLanguage}"
          }
        ]
      }
    ]
  }
}`;

    const contents = resolved.inlineData
      ? [{ inlineData: resolved.inlineData }, prompt]
      : prompt;

    const result = await executeWithDocumentFallback(model, contents, resolved, prompt, docContext);
    const responseText = result.response.text();
    const parsedData = cleanAndParseJSON<{ root: MindMapNode }>(responseText);

    if (!parsedData?.root) {
      throw new Error("Failed to parse valid mind map tree from Gemini response.");
    }

    const sanitizedRoot = sanitizeMindMapNode(parsedData.root, "root");

    return {
      success: true,
      root: sanitizedRoot,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in generateMindMap:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to generate mind map.",
    };
  }
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  correctOption?: string;
  explanation: string;
  difficulty: "Easy" | "Intermediate" | "Advanced";
}

export interface QuizResponse {
  success: boolean;
  quizTitle?: string;
  questions?: QuizQuestion[];
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export const quizSchema = {
  type: Type.OBJECT,
  properties: {
    quizTitle: {
      type: Type.STRING,
      description: "Concise, descriptive quiz title in the selected language",
    },
    questions: {
      type: Type.ARRAY,
      description: "Array of multiple choice questions",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: {
            type: Type.INTEGER,
            description: "0-indexed integer corresponding to the correct option (0, 1, 2, or 3)",
          },
          correctOption: { type: Type.STRING },
          explanation: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            enum: ["Easy", "Intermediate", "Advanced"],
          },
        },
        required: ["id", "question", "options", "correctAnswer", "correctOption", "explanation", "difficulty"],
      },
    },
  },
  required: ["quizTitle", "questions"],
};

/**
 * 1.2 Generate Multiple Choice Quiz from PDF / Notes
 * Generates context-aware, conceptually rigorous questions based on uploaded content or PDF.
 *
 * @param extractedText - Extracted text from PDF, notes, or object { documentText, pdfBase64, mimeType }
 * @param selectedLanguage - Active UI language (e.g., "Hindi", "Spanish", "English")
 * @param numQuestions - Number of questions to formulate (default 5)
 */
export async function generateQuizFromPDF(
  extractedText: string | DocumentContentPayload | any,
  selectedLanguage: string = "Hindi",
  numQuestions: number = 5
): Promise<QuizResponse> {
  try {
    const resolved = await resolveDocumentContent(extractedText);

    if (!resolved.cleanText && !resolved.inlineData) {
      throw new Error("Extracted document text cannot be empty.");
    }

    const model = getProModel({
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: quizSchema,
    });

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const docContext = resolved.inlineData
      ? "The primary educational document is provided as an attached PDF document. Read every page thoroughly and assess its core concepts, theories, and details."
      : `DOCUMENT MATERIAL:\n"""\n${resolved.cleanText}\n"""`;

    const prompt = `You are a Senior Academic Examiner and Psychometric Assessment Creator.
${languageDirective}

TASK:
Analyze the educational document below and generate ${numQuestions} challenging, high-order thinking Multiple Choice Questions (MCQs).
Ensure questions assess analytical understanding, causality, and practical synthesis rather than shallow verbatim recall.

${docContext}

SCHEMA SPECIFICATION (JSON Keys in English, all string values strictly in ${selectedLanguage}):
{
  "quizTitle": "Concise, descriptive quiz title in ${selectedLanguage}",
  "questions": [
    {
      "id": 1,
      "question": "Clear, rigorous question prompt formulated strictly in ${selectedLanguage}",
      "options": [
        "Option A text in ${selectedLanguage}",
        "Option B text in ${selectedLanguage}",
        "Option C text in ${selectedLanguage}",
        "Option D text in ${selectedLanguage}"
      ],
      "correctAnswer": 1,
      "correctOption": "B",
      "explanation": "Thorough pedagogical breakdown explaining why this option is correct and addressing misconceptions in ${selectedLanguage}",
      "difficulty": "Intermediate"
    }
  ]
}

CRITICAL RULES:
- The 4 options in the array MUST be completely written in ${selectedLanguage}.
- correctAnswer must be the 0-indexed integer (0 for A, 1 for B, 2 for C, 3 for D).
- The explanation MUST be deeply educational and written strictly in ${selectedLanguage}.`;

    const contents = resolved.inlineData
      ? [{ inlineData: resolved.inlineData }, prompt]
      : prompt;

    const result = await executeWithDocumentFallback(model, contents, resolved, prompt, docContext);
    const responseText = result.response.text();
    const parsedData = cleanAndParseJSON<{ quizTitle: string; questions: QuizQuestion[] }>(responseText);

    return {
      success: true,
      quizTitle: parsedData?.quizTitle || `Assessment Quiz (${selectedLanguage})`,
      questions: parsedData?.questions || [],
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in generateQuizFromPDF:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to generate quiz.",
    };
  }
}

export interface Flashcard {
  id: number;
  topic: string;
  frontQuestion: string;
  backAnswer: string;
  keyTakeaway: string;
}

export interface FlashcardsResponse {
  success: boolean;
  flashcards?: Flashcard[];
  selectedLanguage: string;
  rawResponse?: string;
  parseError?: boolean;
  error?: string;
  details?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export const flashcardsSchema = {
  type: Type.OBJECT,
  properties: {
    flashcards: {
      type: Type.ARRAY,
      description: "Array of essential, high-yield concept flashcards",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.INTEGER,
            description: "1-indexed unique card identifier",
          },
          topic: {
            type: Type.STRING,
            description: "Specific sub-topic or law name in the target language",
          },
          frontQuestion: {
            type: Type.STRING,
            description: "Concise conceptual question or puzzle on the front card in the target language",
          },
          backAnswer: {
            type: Type.STRING,
            description: "Concise, step-by-step solution and explanation on the back in the target language",
          },
          keyTakeaway: {
            type: Type.STRING,
            description: "Single memorable summary sentence in the target language",
          },
        },
        required: ["id", "topic", "frontQuestion", "backAnswer", "keyTakeaway"],
      },
    },
  },
  required: ["flashcards"],
};

/**
 * 1.3 Generate High-Yield Flashcards from Document Content or PDF
 *
 * @param content - Document text, topic, or object { documentText, pdfBase64, mimeType }
 * @param selectedLanguage - Active UI language
 * @param numCards - Number of flashcards to generate (default 5)
 */
export async function generateFlashcards(
  content: string | DocumentContentPayload | any,
  selectedLanguage: string = "Hindi",
  numCards: number = 5
): Promise<FlashcardsResponse> {
  try {
    const resolved = await resolveDocumentContent(content);

    if (!resolved.cleanText && !resolved.inlineData) {
      throw new Error("Content is required to generate flashcards.");
    }

    const model = getProModel({
      temperature: 0.35,
      responseMimeType: "application/json",
      responseSchema: flashcardsSchema,
    });

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const docContext = resolved.inlineData
      ? "The primary study material is provided as an attached PDF document. Read through all sections, principles, and definitions."
      : `STUDY MATERIAL:\n"""\n${resolved.cleanText}\n"""`;

    const prompt = `You are an Active Recall and Spaced Repetition Specialist.
${languageDirective}

TASK:
Extract ${numCards} essential, high-yield concept cards from the provided study material.
Each flashcard must feature an engaging question on the front and a clear, conceptual explanation on the back.

CARD LENGTH & FIT GUIDELINES (Must fit perfectly on handheld flashcards):
- topic: 2 to 4 words naming the core concept or formula.
- frontQuestion: Maximum 15-22 words. A direct, clear conceptual question that fits cleanly without unnecessary filler.
- backAnswer: Maximum 35-45 words. Clear, high-yield explanation or bulleted steps that fit neatly within the card.
- keyTakeaway: Exactly 1 single short memorable sentence (under 12 words).

${docContext}

SCHEMA SPECIFICATION (JSON Keys in English, all values strictly in ${selectedLanguage}):
{
  "flashcards": [
    {
      "id": 1,
      "topic": "Specific sub-topic or law name in ${selectedLanguage}",
      "frontQuestion": "Provocative, concise conceptual question on the front card in ${selectedLanguage}",
      "backAnswer": "Concise, step-by-step solution and explanation on the back in ${selectedLanguage}",
      "keyTakeaway": "Single memorable summary sentence in ${selectedLanguage}"
    }
  ]
}`;

    const contents = resolved.inlineData
      ? [{ inlineData: resolved.inlineData }, prompt]
      : prompt;

    const result = await executeWithDocumentFallback(model, contents, resolved, prompt, docContext);
    const responseText = result.response.text();

    // SAFE JSON HANDLING: Strip markdown backticks and use nested try-catch
    let parsedData: { flashcards: Flashcard[] } | null = null;
    let jsonParseError: any = null;

    try {
      const cleaned = stripMarkdownBackticks(responseText);
      parsedData = JSON.parse(cleaned);
    } catch (err: any) {
      jsonParseError = err;
      console.error("❌ [Flashcard AI Parse Error]: Raw model output could not be parsed as JSON:", responseText);
    }

    if (!parsedData || !Array.isArray(parsedData.flashcards)) {
      return {
        success: false,
        parseError: true,
        selectedLanguage,
        rawResponse: responseText,
        error: jsonParseError ? jsonParseError.message : "Model response did not contain a valid flashcards array",
        details: "Model returned invalid JSON format",
      };
    }

    return {
      success: true,
      flashcards: parsedData.flashcards,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in generateFlashcards:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to generate flashcards.",
      details: "Failed at Flashcard Generation",
    };
  }
}

// ======================================================================
// FEATURE 2: DIAGRAM EXPLAINER (Multimodal Vision AI)
// ======================================================================

export interface DiagramComponent {
  name: string;
  functionDescription: string;
  visualLocation: string;
}

export interface DiagramAnalysisResult {
  isRecognizableDiagram?: boolean;
  diagramTitle: string;
  subject: string;
  summary: string;
  components: DiagramComponent[];
  stepByStepProcess: string[];
  explanationInLanguage: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export interface DiagramAnalysisResponse {
  success: boolean;
  analysis?: DiagramAnalysisResult;
  selectedLanguage: string;
  rawResponse?: string;
  parseError?: boolean;
  error?: string;
  details?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export const diagramAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    isRecognizableDiagram: {
      type: Type.BOOLEAN,
      description: "True if the image contains a recognizable diagram, flowchart, circuit, formula, or educational illustration; false if unrelated photo or decorative.",
    },
    diagramTitle: {
      type: Type.STRING,
      description: "Exact descriptive diagram title in the selected language",
    },
    subject: {
      type: Type.STRING,
      description: "Scientific or academic subject domain in the selected language",
    },
    summary: {
      type: Type.STRING,
      description: "Detailed, highly accurate summary strictly in the selected language",
    },
    components: {
      type: Type.ARRAY,
      description: "Key labeled elements or anatomical parts identified in the diagram",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Component or label name in the selected language",
          },
          functionDescription: {
            type: Type.STRING,
            description: "Detailed function and role strictly in the selected language",
          },
          visualLocation: {
            type: Type.STRING,
            description: "Visual location in diagram (e.g. Top-left, Center, Base) in the selected language",
          },
        },
        required: ["name", "functionDescription", "visualLocation"],
      },
    },
    stepByStepProcess: {
      type: Type.ARRAY,
      description: "Sequential stages or mechanisms shown in the diagram",
      items: {
        type: Type.STRING,
      },
    },
    explanationInLanguage: {
      type: Type.STRING,
      description: "Detailed spoken-style audio explanation strictly in the selected language",
    },
  },
  required: [
    "isRecognizableDiagram",
    "diagramTitle",
    "subject",
    "summary",
    "components",
    "stepByStepProcess",
    "explanationInLanguage",
  ],
};

/**
 * 2.1 Multimodal Diagram Vision Analysis
 * Analyzes diagrams, flowcharts, circuits, cycles, or anatomic illustrations
 * and returns step-by-step visual breakdowns strictly in the user's selected language.
 *
 * @param imageBase64 - Base64 string of the uploaded diagram image
 * @param mimeType - Image MIME type (e.g., 'image/png', 'image/jpeg', 'image/webp')
 * @param userDoubt - Specific question or query about the diagram
 * @param selectedLanguage - Active UI language
 */
export async function analyzeDiagram(
  imageBase64: string,
  mimeType: string = "image/jpeg",
  userDoubt: string = "Explain this diagram step by step.",
  selectedLanguage: string = "Hindi"
): Promise<DiagramAnalysisResponse> {
  try {
    if (!imageBase64 || typeof imageBase64 !== "string" || !imageBase64.trim()) {
      throw new Error("Base64 image data is required for diagram analysis.");
    }

    // 1. Image preprocessing: extract MIME type if present in data URI and clean Base64 payload
    let cleanBase64 = imageBase64.trim();
    let detectedMime = mimeType;

    if (cleanBase64.startsWith("data:")) {
      const dataUriMatch = cleanBase64.match(/^data:([^;]+);base64,(.*)$/);
      if (dataUriMatch) {
        detectedMime = dataUriMatch[1];
        cleanBase64 = dataUriMatch[2].trim();
      } else {
        cleanBase64 = cleanBase64.replace(/^data:image\/\w+;base64,/, "").trim();
      }
    }

    // Validate MIME type format
    const validImageMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/bmp",
      "image/svg+xml",
    ];
    const normalizedMime = (detectedMime || "image/jpeg").toLowerCase().trim();

    if (!normalizedMime.startsWith("image/") || !validImageMimes.includes(normalizedMime)) {
      throw new Error(`Invalid or unsupported image MIME type '${normalizedMime}'. Supported formats: JPEG, PNG, WebP, GIF, BMP.`);
    }

    const model = getProModel({
      temperature: 0.25,
      responseMimeType: "application/json",
      responseSchema: diagramAnalysisSchema,
    });

    // 2. Multimodal API: inlineData structure
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: normalizedMime,
      },
    };

    // 3. Strict prompt rules:
    // - Multilingual Rule: "You are an expert tutor. Deeply analyze the provided diagram. You MUST write your entire explanation, step-by-step breakdown, and summary STRICTLY in this language: [{selectedLanguage}]. Do not mix languages."
    // - High Relevance & No Hallucinations: "Focus ONLY on the actual contents of the uploaded image. Provide a detailed, accurate, and highly relevant explanation of the visual elements, flowcharts, or graphs shown. Do not invent or hallucinate irrelevant information."
    // - Unrelated Image Handling: "If the uploaded image is completely unrelated to study material or not a recognizable diagram, politely inform the user (in the selected language) that a valid diagram is required."
    const textPrompt = `You are an expert tutor. Deeply analyze the provided diagram. You MUST write your entire explanation, step-by-step breakdown, and summary STRICTLY in this language: [${selectedLanguage}]. Do not mix languages.

CRITICAL INSTRUCTIONS & STRICT CONSTRAINTS:
1. HIGH RELEVANCE & NO HALLUCINATIONS:
   - Focus ONLY on the actual contents of the uploaded image. Provide a detailed, accurate, and highly relevant explanation of the visual elements, flowcharts, or graphs shown. Do not invent or hallucinate irrelevant information.
2. UNRELATED IMAGE HANDLING:
   - If the uploaded image is completely unrelated to study material or not a recognizable diagram (e.g. personal photo, selfie, random object, meme, blank canvas, or decorative artwork), politely inform the user (STRICTLY in the selected language: [${selectedLanguage}]) that a valid educational diagram is required.
   - In that case, set "isRecognizableDiagram": false, provide a polite title in "diagramTitle" (e.g. "वैध आरेख आवश्यक है" or equivalent in [${selectedLanguage}]), explain why in "summary" and "explanationInLanguage" in [${selectedLanguage}], and return empty arrays for "components" and "stepByStepProcess".
3. IF A VALID DIAGRAM / FLOWCHART / GRAPH / FORMULA / SCIENTIFIC ILLUSTRATION:
   - Identify the exact descriptive title and scientific/technical domain in [${selectedLanguage}].
   - Provide a comprehensive, accurate breakdown of all structural elements, labeled parts, cycle arrows, organelles, or coordinates.
   - Outline the sequential step-by-step process or mechanism depicted.
   - Address the student query if provided: "${userDoubt}".
   - Write a warm, encouraging spoken explanation paragraph in "explanationInLanguage" in [${selectedLanguage}] ideal for Text-to-Speech audio playback.

RESPONSE SCHEMA SPECIFICATION (JSON keys MUST be in English as specified, all values MUST be STRICTLY in [${selectedLanguage}]):
{
  "isRecognizableDiagram": true,
  "diagramTitle": "Exact diagram title in [${selectedLanguage}]",
  "subject": "Scientific or academic subject domain in [${selectedLanguage}]",
  "summary": "Detailed, highly accurate summary strictly in [${selectedLanguage}]",
  "components": [
    {
      "name": "Component or label name in [${selectedLanguage}]",
      "functionDescription": "Detailed function and role strictly in [${selectedLanguage}]",
      "visualLocation": "Visual location in diagram (e.g. Top-left, Center, Base) in [${selectedLanguage}]"
    }
  ],
  "stepByStepProcess": [
    "Step 1 strictly in [${selectedLanguage}]",
    "Step 2 strictly in [${selectedLanguage}]"
  ],
  "explanationInLanguage": "Detailed spoken-style audio explanation strictly in [${selectedLanguage}]"
}`;

    const result = await model.generateContent([textPrompt, imagePart]);
    const responseText = result.response.text();

    // 4. Safe JSON Parsing with Markdown Stripper and nested try-catch
    let parsedData: any = null;
    let jsonParseError: any = null;

    try {
      const cleaned = stripMarkdownBackticks(responseText);
      parsedData = JSON.parse(cleaned);
    } catch (err: any) {
      jsonParseError = err;
      console.error("❌ [Diagram AI Parse Error]: Raw model output could not be parsed as JSON:", responseText);
    }

    if (!parsedData || typeof parsedData !== "object") {
      return {
        success: false,
        parseError: true,
        selectedLanguage,
        rawResponse: responseText,
        error: jsonParseError ? jsonParseError.message : "Model response did not contain a valid JSON object",
        details: "Model returned invalid JSON format",
      };
    }

    const safeAnalysis: DiagramAnalysisResult = {
      isRecognizableDiagram: parsedData.isRecognizableDiagram !== false,
      diagramTitle: parsedData.diagramTitle || "Diagram Analysis",
      subject: parsedData.subject || "General Science",
      summary: parsedData.summary || "",
      components: Array.isArray(parsedData.components) ? parsedData.components : [],
      stepByStepProcess: Array.isArray(parsedData.stepByStepProcess) ? parsedData.stepByStepProcess : [],
      explanationInLanguage: parsedData.explanationInLanguage || parsedData.summary || "",
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };

    return {
      success: true,
      analysis: safeAnalysis,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in analyzeDiagram:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to analyze diagram.",
      details: error?.message || "Failed at Diagram Analysis",
    };
  }
}

// ======================================================================
// FEATURE 3: MOCK INTERVIEWER & MULTILINGUAL PERFORMANCE PDF REPORT
// ======================================================================

export interface StartInterviewParams {
  resumeText?: string;
  resumeBase64?: string;
  mimeType?: string;
  jobRole?: string;
  targetRole?: string;
  interviewRound?: string;
  interviewType?: string;
  selectedLanguage?: string;
}

export interface StartInterviewResult {
  candidateName: string;
  technicalSkills: string[];
  softSkills: string[];
  experienceLevel: string;
  profileSummary: string;
  extractedResumeText?: string;
  firstQuestion: string;
  firstQuestionInLanguage: string;
  tailoredOpeningQuestion?: string;
  tailoredOpeningQuestionInLanguage?: string;
  suggestedTopics: string[];
}

export interface StartInterviewResponse {
  success: boolean;
  data?: StartInterviewResult;
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
}

/**
 * 3.1 Resume Parsing & Interview Initialization
 * Parses the resume (including direct PDF extraction if base64/buffer is passed),
 * deeply analyzes technical & soft skills, projects, and generates the very first personalized interview question.
 */
export async function startInterviewSession(
  params: StartInterviewParams
): Promise<StartInterviewResponse> {
  const {
    resumeText = "",
    resumeBase64,
    mimeType = "application/pdf",
    jobRole,
    targetRole = "Full-Stack Software Engineer",
    interviewRound,
    interviewType = "Technical",
    selectedLanguage = "Hindi"
  } = params;

  const resolvedRole = (jobRole || targetRole || "Full-Stack Software Engineer").trim();
  const resolvedRound = (interviewRound || interviewType || "Technical").trim();

  try {
    let extractedResumeText = (resumeText || "").trim();

    // If PDF base64 is provided and extracted text is empty or raw binary, extract with PDFParse
    if (resumeBase64 && (!extractedResumeText || isRawPdfBinary(extractedResumeText))) {
      const pdfText = await extractTextFromPDF(resumeBase64);
      if (pdfText && pdfText.trim()) {
        extractedResumeText = pdfText.trim();
      }
    }

    const model = getProModel(
      {
        temperature: 0.35,
        responseMimeType: "application/json",
      },
      PRIMARY_MODEL
    );

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const prompt = `You are an expert HR and Technical Interviewer conducting a ${resolvedRound} round for the role of ${resolvedRole}.
${languageDirective}

======================================================================
CRITICAL RULES & PROMPT INSTRUCTIONS:
======================================================================
1. DEEP RESUME GROUNDING (MANDATORY):
   CRITICAL RULE: Thoroughly analyze the provided Resume Text. Your questions MUST be directly derived from the specific projects, technologies, and experiences mentioned in this resume.
   - Do NOT ask generic textbook questions (e.g., NEVER ask generic questions like "What is React?", "What is polymorphism?", or "Explain what an API is").
   - Instead of asking generic questions like 'What is React?', ask personalized questions like 'I see you used React in your [Project Name] mentioned in your resume. Can you explain how you handled state management in that specific project?'
   - Identify concrete project names, libraries, frameworks, architectural patterns, database schemas, API integrations, and claimed accomplishments from the candidate's resume.
   - Ground your opening question directly in the candidate's actual projects, claimed technologies, and target role: "${resolvedRole}".

2. CROSS-QUESTIONING & CHALLENGING CLAIMS:
   Do cross-questioning: Challenge the candidate on the skills they have claimed to know.
   - Design the opening question so it invites deep technical explanation of trade-offs, architecture, and edge-case handling from their real-world experience.

3. MULTILINGUAL OUTPUT CONSISTENCY:
   - Generate all candidate questions, profile summaries, and feedback strictly in "${selectedLanguage}".
   - Ensure the tone is rigorous, respectful, and native to speakers of "${selectedLanguage}".

======================================================================
CANDIDATE RESUME TEXT:
======================================================================
"""
${extractedResumeText || `Candidate applying for ${resolvedRole} (${resolvedRound} Round)`}
"""

SCHEMA SPECIFICATION (JSON keys strictly in English, all values written strictly in "${selectedLanguage}"):
{
  "candidateName": "Extracted Candidate Name or 'Candidate'",
  "technicalSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "softSkills": ["Communication", "Problem Solving", "Collaboration"],
  "experienceLevel": "Entry / Mid-Level / Senior / Staff",
  "profileSummary": "2-3 sentence technical summary of background in ${selectedLanguage}",
  "firstQuestion": "Opening question tailored directly to their projects and resume in English or ${selectedLanguage}",
  "firstQuestionInLanguage": "Opening question formulated strictly in ${selectedLanguage}",
  "suggestedTopics": ["Specific Project/Tech from Resume 1", "Specific Project/Tech from Resume 2", "Specific Project/Tech from Resume 3"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = cleanAndParseJSON<StartInterviewResult>(responseText);

    if (!parsed) {
      throw new Error("Failed to parse resume analysis output.");
    }

    // Ensure aliases for compatibility
    const safeData: StartInterviewResult = {
      candidateName: parsed.candidateName || "Candidate",
      technicalSkills: Array.isArray(parsed.technicalSkills) ? parsed.technicalSkills : ["Web Architecture", "APIs"],
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : ["Problem Solving", "Clear Communication"],
      experienceLevel: parsed.experienceLevel || "Software Professional",
      profileSummary: parsed.profileSummary || "Demonstrated professional engineering background.",
      extractedResumeText: extractedResumeText,
      firstQuestion: parsed.firstQuestion || "Walk me through the architecture of your primary project.",
      firstQuestionInLanguage: parsed.firstQuestionInLanguage || parsed.firstQuestion || "कृपया अपने सबसे चुनौतीपूर्ण प्रोजेक्ट का आर्किटेक्चर समझाएं।",
      tailoredOpeningQuestion: parsed.firstQuestion,
      tailoredOpeningQuestionInLanguage: parsed.firstQuestionInLanguage,
      suggestedTopics: Array.isArray(parsed.suggestedTopics) ? parsed.suggestedTopics : ["System Architecture", "Performance"],
    };

    return {
      success: true,
      data: safeData,
      selectedLanguage,
      rawResponse: responseText,
    };
  } catch (error: any) {
    console.error("❌ Error in startInterviewSession:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to initialize interview from resume.",
    };
  }
}

export interface AskInterviewParams {
  resumeText?: string;
  resumeBase64?: string;
  chatHistory?: Array<{ role?: string; content?: string; question?: string; candidateAnswer?: string }>;
  userLatestAnswer?: string;
  candidateAnswer?: string;
  jobRole?: string;
  targetRole?: string;
  interviewRound?: string;
  interviewType?: string;
  selectedLanguage?: string;
  questionIndex?: number;
}

export interface InterviewEvaluationDetail {
  score: number;
  accuracy: string;
  relevance: string;
  technicalDepthScore: number;
  clarityScore: number;
  confidenceScore: number;
  strengths: string;
  areasForImprovement: string;
}

export interface AskInterviewResult {
  evaluation: InterviewEvaluationDetail;
  nextQuestion: string;
  nextQuestionInLanguage: string;
  crossQuestion?: string;
  crossQuestionInLanguage?: string;
  isWrapUp: boolean;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export interface AskInterviewResponse {
  success: boolean;
  data?: AskInterviewResult;
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

/**
 * 3.2 Dynamic Cross-Questioning & Real-time Evaluation Engine
 * Evaluates the candidate's latest answer for Accuracy and Relevance,
 * and formulates a personalized follow-up cross-question strictly derived from their resume projects and claimed skills.
 */
export async function askInterviewQuestion(
  params: AskInterviewParams
): Promise<AskInterviewResponse> {
  const {
    resumeText = "",
    resumeBase64,
    chatHistory = [],
    userLatestAnswer = "",
    candidateAnswer = "",
    jobRole,
    targetRole = "Full-Stack Software Engineer",
    interviewRound,
    interviewType = "Technical",
    selectedLanguage = "Hindi",
    questionIndex = 1
  } = params;

  const resolvedRole = (jobRole || targetRole || "Full-Stack Software Engineer").trim();
  const resolvedRound = (interviewRound || interviewType || "Technical").trim();
  const latestAnswer = (userLatestAnswer || candidateAnswer || "").trim();

  try {
    if (!latestAnswer) {
      throw new Error("Candidate's answer cannot be empty.");
    }

    let extractedResumeText = (resumeText || "").trim();
    if (resumeBase64 && (!extractedResumeText || isRawPdfBinary(extractedResumeText))) {
      const pdfText = await extractTextFromPDF(resumeBase64);
      if (pdfText && pdfText.trim()) {
        extractedResumeText = pdfText.trim();
      }
    }

    const model = getProModel(
      {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
      PRIMARY_MODEL
    );

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const formattedHistory = Array.isArray(chatHistory)
      ? chatHistory.map((t, i) => {
          if (t.question && t.candidateAnswer) {
            return `ROUND ${i + 1}:\nQuestion: ${t.question}\nAnswer: ${t.candidateAnswer}`;
          }
          return `${(t.role || "USER").toUpperCase()}: ${t.content || ""}`;
        }).join("\n---\n")
      : String(chatHistory);

    const prompt = `You are an expert HR and Technical Interviewer conducting a ${resolvedRound} round for the role of ${resolvedRole}.
${languageDirective}

======================================================================
INTERVIEW CONTEXT:
======================================================================
Target Role: "${resolvedRole}"
Interview Round: "${resolvedRound}"
Interview Language: "${selectedLanguage}"
Interview Turn: Round #${questionIndex}

======================================================================
CANDIDATE RESUME TEXT:
======================================================================
"""
${extractedResumeText || "Demonstrated professional software engineering background with real-world projects."}
"""

======================================================================
PREVIOUS INTERVIEW TURNS (CHAT HISTORY):
======================================================================
"""
${formattedHistory || "Interview started."}
"""

======================================================================
USER'S LATEST ANSWER:
======================================================================
"""
${latestAnswer}
"""

======================================================================
STRICT INTERVIEWER RULES & BEHAVIOR:
======================================================================
1. DEEP RESUME GROUNDING (MANDATORY):
   CRITICAL RULE: Thoroughly analyze the provided Resume Text. Your questions MUST be directly derived from the specific projects, technologies, and experiences mentioned in this resume.
   - Instead of asking generic questions like 'What is React?', ask personalized questions like 'I see you used React in your [Project Name] mentioned in your resume. Can you explain how you handled state management in that specific project?'
   - Challenge the candidate on the exact tools, architectures, libraries, frameworks, database schemas, and metrics highlighted in their resume.

2. CROSS-QUESTIONING (CHALLENGE CLAIMS):
   Do cross-questioning: Challenge the candidate on the skills they have claimed to know.
   - Scrutinize the user's latest answer against technical standards and their claimed experience.
   - If the candidate's answer was superficial or theoretical, press them for real-world implementation details (e.g., "In your [Project Name], how did you specifically handle edge cases, concurrency, race conditions, or cache invalidation?").
   - If they have adequately addressed the current topic, pivot seamlessly to cross-questioning on another specific project or claimed skill from their resume.

3. REAL-TIME EVALUATION & SCORING:
   Evaluate the candidate's latest answer honestly:
   - Accuracy: Technical validity and correctness.
   - Relevance: How directly and thoroughly they answered what was asked.
   - Scores (0-100): technicalDepthScore, clarityScore, confidenceScore, overall score.
   - Concrete strengths and constructive areas for improvement.

4. MULTILINGUAL CONSISTENCY:
   - The follow-up question, evaluation feedback, accuracy review, strengths, and critique MUST be formulated STRICTLY in "${selectedLanguage}".

5. WRAP-UP:
   If questionIndex >= 5, formulate a concluding synthesis question touching on architectural trade-offs from their resume and set "isWrapUp": true.

SCHEMA SPECIFICATION (JSON Keys in English, all values strictly in ${selectedLanguage}):
{
  "evaluation": {
    "score": 85,
    "accuracy": "Assessment of technical correctness in ${selectedLanguage}",
    "relevance": "Assessment of relevance to the question in ${selectedLanguage}",
    "technicalDepthScore": 84,
    "clarityScore": 86,
    "confidenceScore": 88,
    "strengths": "Concrete strength noted in ${selectedLanguage}",
    "areasForImprovement": "Concrete area to deepen or missed edge case in ${selectedLanguage}"
  },
  "nextQuestion": "Personalized cross-question derived directly from resume projects and claimed skills in English or ${selectedLanguage}",
  "nextQuestionInLanguage": "Personalized cross-question derived directly from resume projects and claimed skills strictly in ${selectedLanguage}",
  "isWrapUp": false
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = cleanAndParseJSON<AskInterviewResult>(responseText);

    if (!parsed || !parsed.evaluation || !parsed.nextQuestion) {
      throw new Error("Failed to parse interviewer evaluation output.");
    }

    // Attach crossQuestion aliases for compatibility
    parsed.crossQuestion = parsed.nextQuestion;
    parsed.crossQuestionInLanguage = parsed.nextQuestionInLanguage || parsed.nextQuestion;
    parsed.groundingSources = (result as any)?.groundingSources || [];
    parsed.searchQueries = (result as any)?.searchQueries || [];
    parsed.isGrounded = Boolean((result as any)?.isGrounded);

    return {
      success: true,
      data: parsed,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in askInterviewQuestion:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to generate dynamic cross-question.",
    };
  }
}

/**
 * 3.3 Standalone Interview Question Generator
 * Explicitly generates personalized, context-aware interview questions based on resumeText, jobRole, and interviewRound.
 */
export async function generateInterviewQuestion(
  params: {
    resumeText?: string;
    resumeBase64?: string;
    jobRole?: string;
    targetRole?: string;
    interviewRound?: string;
    interviewType?: string;
    selectedLanguage?: string;
    chatHistory?: Array<{ role?: string; content?: string; question?: string; candidateAnswer?: string }>;
    userLatestAnswer?: string;
    candidateAnswer?: string;
    questionIndex?: number;
  }
): Promise<any> {
  const {
    resumeText = "",
    resumeBase64,
    jobRole = "Software Professional",
    targetRole,
    interviewRound = "Technical",
    interviewType,
    selectedLanguage = "Hindi",
    chatHistory = [],
    userLatestAnswer = "",
    candidateAnswer = "",
    questionIndex = 1
  } = params;

  const role = (jobRole || targetRole || "Software Professional").trim();
  const round = (interviewRound || interviewType || "Technical").trim();
  const answer = (userLatestAnswer || candidateAnswer || "").trim();

  if (answer) {
    return askInterviewQuestion({
      resumeText,
      resumeBase64,
      jobRole: role,
      interviewRound: round,
      selectedLanguage,
      chatHistory,
      userLatestAnswer: answer,
      questionIndex
    });
  }

  return startInterviewSession({
    resumeText,
    resumeBase64,
    jobRole: role,
    interviewRound: round,
    selectedLanguage
  });
}

// Backward compatibility alias for generateMockInterviewResponse
export async function generateMockInterviewResponse(
  resumeText: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  newAnswer: string,
  targetRole: string = "Full-Stack Software Engineer",
  selectedLanguage: string = "Hindi",
  questionIndex: number = 1
): Promise<any> {
  const res = await askInterviewQuestion({
    resumeText,
    chatHistory,
    userLatestAnswer: newAnswer,
    targetRole,
    selectedLanguage,
    questionIndex
  });

  if (res.success && res.data) {
    return {
      success: true,
      data: {
        score: res.data.evaluation.score,
        confidenceScore: res.data.evaluation.confidenceScore,
        clarityScore: res.data.evaluation.clarityScore,
        technicalDepthScore: res.data.evaluation.technicalDepthScore,
        feedback: {
          strengths: res.data.evaluation.strengths,
          areasForImprovement: res.data.evaluation.areasForImprovement,
        },
        crossQuestion: res.data.nextQuestion,
        crossQuestionInLanguage: res.data.nextQuestionInLanguage,
        isWrapUp: res.data.isWrapUp,
      },
      selectedLanguage,
      rawResponse: res.rawResponse
    };
  }
  return res;
}

export interface InterviewSessionSummaryData {
  candidateName?: string;
  targetRole: string;
  turnsHistory: Array<{
    id?: string;
    question: string;
    candidateAnswer: string;
    evaluation?: {
      score?: number;
      accuracy?: string;
      relevance?: string;
      technicalDepthScore?: number;
      clarityScore?: number;
      confidenceScore?: number;
      strengths?: string;
      areasForImprovement?: string;
      [key: string]: any;
    };
  }>;
  resumeSummary?: string;
  durationSeconds?: number;
}

export interface InterviewReportResult {
  candidateName: string;
  targetRole: string;
  interviewLanguage: string;
  overallScore: number;
  grade: string;
  executiveSummary: string;
  categoryScores: {
    technicalKnowledge?: number;
    problemSolving?: number;
    communicationClarity?: number;
    systemArchitecture?: number;
    accuracy?: number;
    relevance?: number;
    technicalDepth?: number;
  };
  strengths: string[];
  areasOfImprovement: string[];
  keyStrengths?: string[];
  criticalAreasForImprovement?: string[];
  questionBreakdown: Array<{
    questionNumber: number;
    question: string;
    candidateAnswer: string;
    accuracyScore?: number;
    relevanceScore?: number;
    score?: number;
    feedback: string;
  }>;
  questionReviews?: Array<{
    round: number;
    question: string;
    answerSummary: string;
    score: number;
    critique: string;
  }>;
  hiringRecommendation: string;
  finalHiringRecommendation?: string;
  actionableStudyPlan?: string[];
  formattedReportMarkdown: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export interface InterviewReportResponse {
  success: boolean;
  report?: InterviewReportResult;
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export interface GenerateFinalReportParams {
  transcript?: Array<{
    id?: string;
    question: string;
    candidateAnswer: string;
    evaluation?: any;
  }>;
  turnsHistory?: Array<{
    id?: string;
    question: string;
    candidateAnswer: string;
    evaluation?: any;
  }>;
  candidateName?: string;
  targetRole?: string;
  resumeSummary?: string;
  durationSeconds?: number;
  selectedLanguage?: string;
}

/**
 * 3.3 Final Interview Performance Report Generation
 * Generates a comprehensive evaluation of the full transcript,
 * including overall score, strengths, areas of improvement,
 * question-by-question breakdown, and actionable study plan.
 */
export async function generateFinalInterviewReport(
  params: GenerateFinalReportParams
): Promise<InterviewReportResponse> {
  const transcript = params.transcript || params.turnsHistory || [];
  const candidateName = params.candidateName || "Candidate";
  const targetRole = params.targetRole || "Full-Stack Software Engineer";
  const resumeSummary = params.resumeSummary || "";
  const durationSeconds = params.durationSeconds || 600;
  const selectedLanguage = params.selectedLanguage || "Hindi";

  return generateInterviewReport(
    {
      candidateName,
      targetRole,
      turnsHistory: transcript,
      resumeSummary,
      durationSeconds,
    },
    selectedLanguage
  );
}

/**
 * 3.2 Generate Multilingual Performance PDF Report
 * Generates an executive-level performance scorecard and comprehensive report
 * formatted and written STRICTLY in the user's selected language.
 *
 * @param sessionData - Complete interview session transcript and evaluation turns
 * @param selectedLanguage - Active UI language for report generation
 */
export async function generateInterviewReport(
  sessionData: InterviewSessionSummaryData,
  selectedLanguage: string = "Hindi"
): Promise<InterviewReportResponse> {
  try {
    const {
      candidateName = "Candidate",
      targetRole = "Full-Stack Software Engineer",
      turnsHistory = [],
      resumeSummary = "",
      durationSeconds = 600,
    } = sessionData;

    const model = getProModel({
      temperature: 0.35,
      responseMimeType: "application/json",
    });

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, true);

    const formattedTranscript = turnsHistory
      .map(
        (t, idx) => `
ROUND ${idx + 1}:
Question: ${t.question}
Candidate Answer: ${t.candidateAnswer}
Turn Score: ${t.evaluation?.score ?? "N/A"}/100
Accuracy Feedback: ${t.evaluation?.accuracy ?? "N/A"}
Relevance Feedback: ${t.evaluation?.relevance ?? "N/A"}
Strengths Noted: ${t.evaluation?.strengths ?? "N/A"}
Areas for Improvement: ${t.evaluation?.areasForImprovement ?? "N/A"}
`
      )
      .join("\n---\n");

    const prompt = `You are a Global Talent Committee Director and Senior Engineering Leader.
${languageDirective}

TASK:
Compile a comprehensive, formal Candidate Interview Performance Evaluation Report based on the completed mock interview session.
The report will be presented to the candidate and downloadable as a PDF.
Every assessment, summary, review, critique, and recommendation MUST be written STRICTLY in "${selectedLanguage}".

SESSION DATA:
Candidate Name: "${candidateName}"
Target Role: "${targetRole}"
Session Duration: ${Math.round(durationSeconds / 60)} minutes
Total Rounds Answered: ${turnsHistory.length}
Candidate Resume Summary:
"""
${resumeSummary || "Demonstrated professional engineering background."}
"""

FULL INTERVIEW TRANSCRIPT:
"""
${formattedTranscript || "Single round completed."}
"""

SCHEMA SPECIFICATION (JSON Keys in English, all string values strictly in ${selectedLanguage}):
{
  "candidateName": "${candidateName}",
  "targetRole": "${targetRole}",
  "interviewLanguage": "${selectedLanguage}",
  "overallScore": 86,
  "grade": "Strong Hire / A (in ${selectedLanguage})",
  "executiveSummary": "A polished 3-4 sentence leadership summary evaluating candidate readiness for ${targetRole} in ${selectedLanguage}",
  "categoryScores": {
    "technicalKnowledge": 88,
    "problemSolving": 85,
    "communicationClarity": 84,
    "systemArchitecture": 87,
    "accuracy": 86,
    "relevance": 88,
    "technicalDepth": 84
  },
  "strengths": [
    "Key strength 1 in ${selectedLanguage}",
    "Key strength 2 in ${selectedLanguage}",
    "Key strength 3 in ${selectedLanguage}"
  ],
  "areasOfImprovement": [
    "Targeted growth area 1 in ${selectedLanguage}",
    "Targeted growth area 2 in ${selectedLanguage}"
  ],
  "questionBreakdown": [
    {
      "questionNumber": 1,
      "question": "Question reviewed in ${selectedLanguage}",
      "candidateAnswer": "Candidate response summary in ${selectedLanguage}",
      "accuracyScore": 86,
      "relevanceScore": 88,
      "score": 85,
      "feedback": "Actionable feedback in ${selectedLanguage}"
    }
  ],
  "hiringRecommendation": "Clear hiring recommendation verdict in ${selectedLanguage}",
  "actionableStudyPlan": [
    "Recommended study action item 1 in ${selectedLanguage}",
    "Recommended study action item 2 in ${selectedLanguage}"
  ],
  "formattedReportMarkdown": "# Formal Multilingual Report in Markdown syntax fully written in ${selectedLanguage} with clear headers, tables, and bullet points"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = cleanAndParseJSON<InterviewReportResult>(responseText);

    if (!parsedData) {
      throw new Error("Failed to parse structured interview report.");
    }

    // Harmonize keys for compatibility with both schema formats
    parsedData.keyStrengths = parsedData.keyStrengths || parsedData.strengths || [];
    parsedData.strengths = parsedData.strengths || parsedData.keyStrengths || [];
    parsedData.criticalAreasForImprovement = parsedData.criticalAreasForImprovement || parsedData.areasOfImprovement || [];
    parsedData.areasOfImprovement = parsedData.areasOfImprovement || parsedData.criticalAreasForImprovement || [];
    parsedData.finalHiringRecommendation = parsedData.finalHiringRecommendation || parsedData.hiringRecommendation;
    parsedData.hiringRecommendation = parsedData.hiringRecommendation || parsedData.finalHiringRecommendation || "Hire";

    if (!parsedData.questionBreakdown && (parsedData as any).questionReviews) {
      parsedData.questionBreakdown = (parsedData as any).questionReviews.map((r: any) => ({
        questionNumber: r.round,
        question: r.question,
        candidateAnswer: r.answerSummary,
        accuracyScore: r.score,
        relevanceScore: r.score,
        score: r.score,
        feedback: r.critique,
      }));
    }

    return {
      success: true,
      report: parsedData,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
    };
  } catch (error: any) {
    console.error("❌ Error in generateInterviewReport:", error);
    return {
      success: false,
      selectedLanguage,
      error: error?.message || "Failed to generate interview report.",
    };
  }
}

// ======================================================================
// FEATURE 4: AI MULTILINGUAL DOUBT SOLVER (Academic Tutor)
// ======================================================================

export interface DoubtSolverResponse {
  success: boolean;
  reply: string;
  selectedLanguage: string;
  rawResponse?: string;
  error?: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
  modelUsed?: string;
}

/**
 * 4.1 Cognitive Accessibility Tutor (ADHD, Dyslexia, and Learning Difficulties)
 * Role: Specialized "Cognitive Accessibility Tutor".
 * Goal: Explain concepts to students who have ADHD, Dyslexia, or learning difficulties.
 *
 * Strict Formatting Rules:
 * 1. Ultra-Short Sentences: Keep every sentence under 12-15 words.
 * 2. Micro-Paragraphs: Never write a paragraph longer than 2 sentences. Use lots of empty lines (whitespace) between thoughts.
 * 3. Heavy Use of Bullet Points: Break down all information into simple bullet points or numbered steps. Never give walls of text.
 * 4. Visual Anchors (Emojis): Use relevant emojis at the start of key bullet points to help visually guide the student's eyes and maintain attention.
 * 5. Simple Vocabulary: Strictly avoid complex jargon, metaphors, or double negatives. Use the most basic everyday words.
 * 6. Highlight Key Concepts: Use bold text ONLY for the most important core concept or word in a sentence (this complements Bionic Reading).
 *
 * @param userQuery - Student's question, doubt, or problem statement
 * @param selectedLanguage - Active UI language
 * @param conversationHistory - Recent conversation turns
 * @param subjectContext - Optional subject or topic context
 */
export async function solveAcademicDoubt(
  userQuery: string,
  selectedLanguage: string = "Hindi",
  conversationHistory: any[] = [],
  subjectContext: string = ""
): Promise<DoubtSolverResponse> {
  try {
    if (!userQuery || !userQuery.trim()) {
      throw new Error("Doubt query cannot be empty.");
    }

    const model = getProModel({
      temperature: 0.35,
    });

    const languageDirective = buildUniversalLanguageDirective(selectedLanguage, false);

    // Format previous multi-turn conversation if present
    let formattedHistory = "";
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      formattedHistory = conversationHistory
        .map((msg: any) => `${msg.sender === "user" ? "Student" : "Cognitive Tutor"}: ${msg.text}`)
        .join("\n");
    }

    const systemInstruction = `Role: You are a specialized "Cognitive Accessibility Tutor". Your goal is to explain concepts to students who have ADHD, Dyslexia, or learning difficulties.

Strict Formatting Rules:

1. Ultra-Short Sentences: Keep every sentence under 12-15 words.
2. Micro-Paragraphs: Never write a paragraph longer than 2 sentences. Use lots of empty lines (whitespace) between thoughts.
3. Heavy Use of Bullet Points: Break down all information into simple bullet points or numbered steps. Never give walls of text.
4. Visual Anchors (Emojis): Use relevant emojis at the start of key bullet points to help visually guide the student's eyes and maintain attention.
5. Simple Vocabulary: Strictly avoid complex jargon, metaphors, or double negatives. Use the most basic everyday words.
6. Highlight Key Concepts: Use bold text ONLY for the most important core concept or word in a sentence (this complements Bionic Reading).
7. Language Choice: Respond naturally in "${selectedLanguage}" (or conversational Hinglish/Hindi/English matching the student's query). Keep tone warm, patient, and ultra-clear.

Example Interaction:
User: Explain the water cycle.
AI:
🌊 **Water Cycle** ka matlab hai pani ka ghoomna!

Yeh 3 aasan steps mein hota hai:

☀️ 1. **Evaporation** (Baaph Banna):
Suraj ki garmi se nadi ka pani baaph (gas) ban jata hai. Yeh hawa mein upar udta hai.

☁️ 2. **Condensation** (Baadal Banna):
Upar jakar yeh baaph thandi ho jati hai. Thandi hokar yeh baadal ban jati hai.

🌧️ 3. **Precipitation** (Baarish Hona):
Jab baadal bahut bhari ho jate hain, toh pani baarish ban kar wapas zameen par girta hai.

${languageDirective}`;

    const prompt = `${systemInstruction}

${subjectContext ? `ACADEMIC SUBJECT CONTEXT: ${subjectContext}\n` : ""}
${formattedHistory ? `PREVIOUS CONVERSATION WITH STUDENT:\n"""\n${formattedHistory}\n"""\n` : ""}
STUDENT'S QUESTION / CONCEPT TO EXPLAIN:
"${userQuery}"

Provide your accessible explanation strictly following all 6 formatting rules in "${selectedLanguage}".`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
      success: true,
      reply: responseText,
      selectedLanguage,
      rawResponse: responseText,
      groundingSources: (result as any)?.groundingSources || [],
      searchQueries: (result as any)?.searchQueries || [],
      isGrounded: Boolean((result as any)?.isGrounded),
      modelUsed: (result as any)?.modelUsed || PRIMARY_MODEL,
    };
  } catch (error: any) {
    console.error("❌ Error in solveAcademicDoubt (Cognitive Accessibility Tutor):", error);
    const fallbackText = `🌊 **Water Cycle** ka matlab hai pani ka ghoomna!

Yeh 3 aasan steps mein hota hai:

☀️ 1. **Evaporation** (Baaph Banna):
Suraj ki garmi se nadi ka pani baaph ban jata hai. Yeh hawa mein upar udta hai.

☁️ 2. **Condensation** (Baadal Banna):
Upar jakar yeh baaph thandi ho jati hai. Thandi hokar yeh baadal ban jati hai.

🌧️ 3. **Precipitation** (Baarish Hona):
Jab baadal bahut bhari ho jate hain, toh pani baarish ban kar wapas zameen par girta hai.`;
    return {
      success: false,
      reply: fallbackText,
      selectedLanguage,
      error: error?.message || "Failed to solve doubt.",
    };
  }
}

export default {
  buildUniversalLanguageDirective,
  cleanAndParseJSON,
  generateMindMap,
  generateQuizFromPDF,
  generateFlashcards,
  analyzeDiagram,
  generateMockInterviewResponse,
  generateInterviewReport,
  solveAcademicDoubt,
};
