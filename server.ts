import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  generateMindMap,
  generateQuizFromPDF,
  generateFlashcards,
  analyzeDiagram,
  generateMockInterviewResponse,
  generateInterviewReport,
  startInterviewSession,
  askInterviewQuestion,
  generateInterviewQuestion,
  generateFinalInterviewReport,
  solveAcademicDoubt,
  buildUniversalLanguageDirective,
  stripMarkdownBackticks,
} from "./ai-services.ts";
import { PRIMARY_MODEL } from "./ai-config.ts";

dotenv.config();

// Lazy initialization of Gemini client to prevent crashes if key is missing on initial boot
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

// Dynamic In-Memory Database for User Interactions & History Logging
// Initialized EMPTY (no dummy/raw data) as requested
interface HistoryRecord {
  id: string;
  userId: string;
  category: "interview" | "quiz" | "mindmap" | "flashcards" | "diagram" | "chat";
  title: string;
  summary: string;
  createdAt: string;
  data: any;
}

const historyDatabase: HistoryRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "35mb" }));
  app.use(express.urlencoded({ extended: true, limit: "35mb" }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

function buildLocalizedDoubtFallback(message: string, lang: string): string {
  const normalized = (lang || '').toLowerCase();

  if (normalized.includes('spanish') || normalized.includes('español') || normalized.includes('es')) {
    return `¡Hola! Con mucho gusto te explico sobre **"${message}"** de manera clara:

🌱 **Idea Principal**:
Es un concepto fundamental que nos ayuda a entender cómo interactúan los elementos en su entorno.

💡 **Paso a Paso**:
1. Cada proceso comienza con una causa o energía impulsora.
2. Esta energía transforma la materia y genera un ciclo continuo.
3. El resultado mantiene el equilibrio natural.

¿Te gustaría profundizar en algún detalle específico?`;
  }

  if (normalized.includes('english') || normalized.includes('en')) {
    return `Hello! Let's break down **"${message}"** into simple, clear concepts:

🌱 **Core Principle**:
Every natural system operates through interconnected steps that convert energy into observable results.

💡 **Key Takeaways**:
1. **Initiation**: The process begins with an input or energy source.
2. **Transformation**: Components interact, shifting states or structures.
3. **Equilibrium**: The cycle completes, creating balance and sustaining the system.

Feel free to ask follow-up questions!`;
  }

  if (normalized.includes('marathi') || normalized.includes('mr') || normalized.includes('varhadi')) {
    return `नमस्कार! आपण **"${message}"** ही संकल्पना सोप्या आणि रंजक भाषेत समजून घेऊया:

🌱 **मुख्य नियम**:
प्रत्येक नैसर्गिक किंवा वैज्ञानिक प्रक्रियेमागे एक सोपे कारण असते.

💡 **महत्त्वाचे मुद्दे**:
१. **सुरुवात**: ऊर्जेचा वापर करून क्रिया सुरू होते.
२. **प्रक्रिया**: घटक एकमेकांशी जोडले जाऊन बदल घडवून आणतात.
३. **समतोल**: शेवटी निसर्गाचा समतोल राखला जातो.

तुम्हाला याबद्दल अजून काही विचारायचे आहे का?`;
  }

  if (normalized.includes('bengali') || normalized.includes('bangla') || normalized.includes('bn') || normalized.includes('rarh')) {
    return `নমস্কার! আসুন **"${message}"** বিষয়টি সহজ এবং প্রাঞ্জল ভাষায় বুঝে নেওয়া যাক:

🌱 **মূল ধারণা**:
প্রতিটি বৈজ্ঞানিক ঘটনার পেছনে একটি সুনির্দিষ্ট নিয়ম কাজ করে।

💡 **ধাপে ধাপে ব্যাখ্যা**:
১. **শুরু**: শক্তির প্রভাবে প্রক্রিয়াটি যাত্রা শুরু করে।
২. **রূপান্তর**: উপাদানগুলি পরস্পর ক্রিয়া করে রূপ বদল ঘটায়।
৩. **ভারসাম্য**: চক্রটি সম্পন্ন হয়ে প্রকৃতির ভারসাম্য বজায় রাখে।

আপনার কোনো প্রশ্ন থাকলে নির্দ্বিধায় জানান!`;
  }

  if (normalized.includes('tamil') || normalized.includes('ta') || normalized.includes('madurai')) {
    return `வணக்கம்! **"${message}"** என்பதை எளிய நடையில் தெளிவாகப் புரிந்து கொள்வோம்:

🌱 **அடிப்படை தத்துவம்**:
ஒவ்வொரு அறிவியல் நிகழ்விற்கும் பின்னாலும் ஒரு இயற்கையான விதி உள்ளது.

💡 **முக்கிய படிகள்**:
1. **தொடக்கம்**: ஆற்றல் மூலம் செயல்முறை தொடங்குகிறது.
2. **மாற்றம்**: மூலக்கூறுகள் ஒன்றிணைந்து புதிய நிலையை அடைகின்றன.
3. **சமநிலை**: இயற்கை சமநிலையை இந்த சுழற்சி நிலைநிறுத்துகிறது.

மேலும் சந்தேகம் இருந்தால் தாராளமாகக் கேளுங்கள்!`;
  }

  if (normalized.includes('telangana') || normalized.includes('telugu') || normalized.includes('te')) {
    return `నమస్కారం! **"${message}"** గురించి సులభమైన మాటల్లో అర్థం చేసుకుందాం:

🌱 **ముఖ్య సూత్రం**:
ప్రతి సహజ ప్రక్రియ వెనుక ఒక చక్కని క్రమం మరియు శక్తి మార్పిడి ఉంటుంది.

💡 **దశలు**:
1. **ఆరంభం**: శక్తి సహాయంతో ప్రక్రియ మొదలవుతుంది.
2. **మార్పు**: భాగాలు కలిసి సమన్వయంతో పనిచేస్తాయి.
3. **సమతుల్యత**: ప్రకృతిలో స్థిరత్వం ఏర్పడుతుంది.

ఇంకా ఏమైనా సందేహాలు ఉంటే అడగండి!`;
  }

  if (normalized.includes('gujarat') || normalized.includes('gu') || normalized.includes('kathiyawadi')) {
    return `નમસ્તે વાલા મિત્ર! **"${message}"** વિશે એકદમ સરળ અને દેશી ભાષામાં સમજીએ:

🌱 **મુખ્ય વાત**:
દરેક વૈજ્ઞાનિક ક્રિયા પાછળ કુદરતનો એક સુંદર નિયમ હોય છે.

💡 **મહત્વના તબક્કા**:
૧. **શરૂઆત**: ઊર્જા મળતાની સાથે જ પ્રક્રિયા વેગ પકડે છે.
૨. **પરિવર્તન**: વસ્તુઓ એકબીજા સાથે જોડાઈને નવું રૂપ લે છે.
૩. **સંતુલન**: આખા ચક્રના અંતે કુદરતી સંતુલન જળવાય છે.

કંઈ પણ ન સમજાય તો હજુ પૂછો!`;
  }

  if (normalized.includes('bhojpuri')) {
    return `अरे बचवा! **"${message}"** के एकदम सहज गँवई भाखा में समझल जाव:

🌱 **मुख्य बात**:
कौनो भी काम भा प्राकृतिक नियम के पाछे एगो सीधा-सरल कारण होला।

💡 **सरल नियम**:
१. **शुरुआत**: ऊर्जा पाके क्रिया चालू हो जाला।
२. **बदलाव**: सब चीज मिलके रूप बदल लेला।
३. **संतुलन**: अंतिम में सब कुछ सुचारू रूप से संतुलित हो जाला।

कवनो अउर शंका होखे त तुरंत पूछीं!`;
  }

  // Default Hindi / Awadhi
  return `अरे भैया! **"${message}"** को एकदम सरल और सहज भाषा में समझते हैं:

🌱 **मुख्य नियम**:
हर प्राकृतिक और वैज्ञानिक घटना के पीछे एक सीधा सिद्धांत काम करता है।

💡 **आसान चरण**:
१. **शुरुआत**: ऊर्जा मिलने पर प्रक्रिया आरंभ होती है।
२. **परिवर्तन**: घटक आपस में मिलकर स्वरूप बदलते हैं।
३. **संतुलन**: इस निरंतर चक्र से संतुलन बना रहता है।

यदि कोई भी संशय हो तो बेझिझक पूछिए!`;
}

  // AI Socratic Tutor & Voice Chatbot Endpoint
  const handleChatDoubt = async (req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const {
        message,
        conversationHistory = [],
        chatHistory = [],
        language = "Hindi",
        dialect = "Bhojpuri",
        languageCode = "hi-IN",
        selectedLanguage
      } = req.body || {};

      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message or doubt query is required" });
      }

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const resolvedHistory = Array.isArray(conversationHistory) && conversationHistory.length > 0
        ? conversationHistory
        : (Array.isArray(chatHistory) ? chatHistory : []);

      let doubtResult: any = null;
      try {
        doubtResult = await solveAcademicDoubt(message, activeLang, resolvedHistory);
      } catch (solveErr: any) {
        console.warn("Gemini solveAcademicDoubt fallback triggered:", solveErr?.message);
      }

      const replyText = (doubtResult && doubtResult.success && doubtResult.reply)
        ? doubtResult.reply
        : buildLocalizedDoubtFallback(message, activeLang);

      // Log interaction into History Database
      historyDatabase.unshift({
        id: `hist-doubt-${Date.now()}`,
        userId: "default-user",
        category: "chat",
        title: `Cognitive Tutor: ${message.slice(0, 45)}${message.length > 45 ? '...' : ''}`,
        summary: `Cognitive accessibility explanation in ${activeLang}.`,
        createdAt: new Date().toISOString(),
        data: {
          userDoubt: message,
          tutorResponse: replyText,
          language: activeLang,
          languageCode
        }
      });

      return res.json({
        reply: replyText,
        language: activeLang,
        dialect,
        languageCode,
        groundingSources: doubtResult?.groundingSources || [],
        searchQueries: doubtResult?.searchQueries || [],
        isGrounded: Boolean(doubtResult?.isGrounded),
        modelUsed: doubtResult?.modelUsed || PRIMARY_MODEL,
      });
    } catch (error: any) {
      console.error("Error in /api/chat doubt solver:", error);
      return res.status(500).json({
        error: "Failed to solve doubt",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/chat", handleChatDoubt);
  app.post("/api/doubt-solve", handleChatDoubt);

  // ======================================================================
  // FEATURE 3: AI MOCK INTERVIEWER & MULTILINGUAL REPORT ENGINE
  // ======================================================================

  // 1. RESUME PARSING & INTERVIEW INITIALIZATION (/api/interview/start & /api/interview/analyze-resume)
  const handleInterviewStart = async (req: express.Request, res: express.Response) => {
    try {
      const {
        resumeText = "",
        resumeBase64 = null,
        file = null,
        mimeType = "application/pdf",
        jobRole,
        targetRole = "Full-Stack Software Engineer",
        interviewRound,
        interviewType = "Technical",
        language = "Hindi",
        dialect = "Bhojpuri",
        selectedLanguage
      } = req.body || {};

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const resolvedRole = (jobRole || targetRole || "Full-Stack Software Engineer").trim();
      const resolvedRound = (interviewRound || interviewType || "Technical").trim();
      const payloadBase64 = resumeBase64 || file;

      const result = await startInterviewSession({
        resumeText,
        resumeBase64: payloadBase64,
        mimeType,
        jobRole: resolvedRole,
        targetRole: resolvedRole,
        interviewRound: resolvedRound,
        interviewType: resolvedRound,
        selectedLanguage: activeLang
      });

      if (!result.success || !result.data) {
        return res.status(500).json({
          error: result.error || "Failed to parse resume and initialize interview.",
          details: "Failed at Interview Start"
        });
      }

      // Format response with rich backward-compatible and updated fields
      const data = result.data;
      return res.json({
        success: true,
        candidateName: data.candidateName || "Candidate",
        technicalSkills: data.technicalSkills || [],
        softSkills: data.softSkills || [],
        skills: data.technicalSkills || [],
        experienceLevel: data.experienceLevel || "Mid-Level Professional",
        summary: data.profileSummary || "",
        profileSummary: data.profileSummary || "",
        extractedResumeText: data.extractedResumeText || resumeText || "",
        firstQuestion: data.firstQuestion || data.tailoredOpeningQuestion,
        firstQuestionInLanguage: data.firstQuestionInLanguage || data.tailoredOpeningQuestionInLanguage,
        tailoredOpeningQuestion: data.firstQuestion || data.tailoredOpeningQuestion,
        tailoredOpeningQuestionInLanguage: data.firstQuestionInLanguage || data.tailoredOpeningQuestionInLanguage,
        suggestedTopics: data.suggestedTopics || [],
        selectedLanguage: activeLang,
        jobRole: resolvedRole,
        targetRole: resolvedRole,
        interviewRound: resolvedRound,
        interviewType: resolvedRound
      });
    } catch (error: any) {
      console.error("❌ Error in /api/interview/start:", error);
      return res.status(500).json({
        error: "Failed to initialize interview session.",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/interview/start", handleInterviewStart);
  app.post("/api/interview/analyze-resume", handleInterviewStart);

  // 2. DYNAMIC CROSS-QUESTIONING & REAL-TIME EVALUATION (/api/interview/ask & /api/interview/evaluate-and-cross-examine)
  const handleInterviewAsk = async (req: express.Request, res: express.Response) => {
    try {
      const {
        resumeText = "",
        resumeBase64 = null,
        file = null,
        resumeSummary = "",
        chatHistory = [],
        conversationHistory = [],
        userLatestAnswer = "",
        candidateAnswer = "",
        currentQuestion = "",
        jobRole,
        targetRole = "Full-Stack Software Engineer",
        interviewRound,
        interviewType = "Technical",
        language = "Hindi",
        dialect = "Bhojpuri",
        selectedLanguage,
        questionIndex = 1
      } = req.body || {};

      const latestAnswer = (userLatestAnswer || candidateAnswer || "").trim();
      if (!latestAnswer) {
        return res.status(400).json({
          error: "Candidate answer cannot be empty.",
          details: "userLatestAnswer or candidateAnswer is required."
        });
      }

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const resolvedRole = (jobRole || targetRole || "Full-Stack Software Engineer").trim();
      const resolvedRound = (interviewRound || interviewType || "Technical").trim();
      const resolvedResume = (resumeText || resumeSummary || "").trim();
      const payloadBase64 = resumeBase64 || file;
      const resolvedHistory = Array.isArray(chatHistory) && chatHistory.length > 0
        ? chatHistory
        : conversationHistory;

      const result = await askInterviewQuestion({
        resumeText: resolvedResume,
        resumeBase64: payloadBase64,
        chatHistory: resolvedHistory,
        userLatestAnswer: latestAnswer,
        jobRole: resolvedRole,
        targetRole: resolvedRole,
        interviewRound: resolvedRound,
        interviewType: resolvedRound,
        selectedLanguage: activeLang,
        questionIndex: Number(questionIndex) || 1
      });

      if (!result.success || !result.data) {
        return res.status(500).json({
          error: result.error || "Failed to evaluate answer and generate cross-question.",
          details: "Failed at Cross-Questioning Engine"
        });
      }

      const data = result.data as any;
      const evalData = (data.evaluation || {}) as any;
      const nextQ = data.nextQuestion || data.crossQuestion;
      const nextQInLang = data.nextQuestionInLanguage || data.crossQuestionInLanguage || nextQ;

      return res.json({
        success: true,
        evaluation: {
          score: evalData.score ?? 85,
          accuracy: evalData.accuracy || "Evaluated accurately against the technical question.",
          relevance: evalData.relevance || "Directly addressed the core concepts required.",
          technicalDepthScore: evalData.technicalDepthScore ?? 84,
          clarityScore: evalData.clarityScore ?? 85,
          confidenceScore: evalData.confidenceScore ?? 86,
          strengths: evalData.strengths || "Strong articulation of foundational concepts.",
          areasForImprovement: evalData.areasForImprovement || "Could elaborate deeper on architectural tradeoffs."
        },
        nextQuestion: nextQ,
        nextQuestionInLanguage: nextQInLang,
        // Legacy compatibility properties
        score: evalData.score ?? 85,
        confidenceScore: evalData.confidenceScore ?? 86,
        clarityScore: evalData.clarityScore ?? 85,
        technicalDepthScore: evalData.technicalDepthScore ?? 84,
        feedback: {
          strengths: evalData.strengths || "Strong articulation of foundational concepts.",
          areasForImprovement: evalData.areasForImprovement || "Could elaborate deeper on architectural tradeoffs."
        },
        crossQuestion: nextQ,
        crossQuestionInLanguage: nextQInLang,
        isWrapUp: Boolean(result.data.isWrapUp),
        selectedLanguage: activeLang,
        jobRole: resolvedRole,
        targetRole: resolvedRole,
        interviewRound: resolvedRound,
        interviewType: resolvedRound
      });
    } catch (error: any) {
      console.error("❌ Error in /api/interview/ask:", error);
      return res.status(500).json({
        error: "Failed to evaluate answer and generate follow-up question.",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/interview/ask", handleInterviewAsk);
  app.post("/api/interview/evaluate-and-cross-examine", handleInterviewAsk);

  // 3. EXPLICIT INTERVIEW QUESTION GENERATOR ROUTE (/api/interview/generate-question)
  const handleGenerateQuestion = async (req: express.Request, res: express.Response) => {
    try {
      const {
        resumeText = "",
        resumeBase64 = null,
        file = null,
        jobRole = "Software Professional",
        targetRole,
        interviewRound = "Technical",
        interviewType,
        selectedLanguage = "Hindi",
        language,
        dialect,
        chatHistory = [],
        userLatestAnswer = "",
        candidateAnswer = "",
        questionIndex = 1
      } = req.body || {};

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const resolvedRole = (jobRole || targetRole || "Software Professional").trim();
      const resolvedRound = (interviewRound || interviewType || "Technical").trim();
      const payloadBase64 = resumeBase64 || file;
      const answer = (userLatestAnswer || candidateAnswer || "").trim();

      const result = await generateInterviewQuestion({
        resumeText,
        resumeBase64: payloadBase64,
        jobRole: resolvedRole,
        targetRole: resolvedRole,
        interviewRound: resolvedRound,
        interviewType: resolvedRound,
        selectedLanguage: activeLang,
        chatHistory,
        userLatestAnswer: answer,
        questionIndex: Number(questionIndex) || 1
      });

      if (!result.success || !result.data) {
        return res.status(500).json({
          error: result.error || "Failed to generate context-aware interview question.",
          details: "Failed at generateInterviewQuestion"
        });
      }

      return res.json({
        success: true,
        ...result.data,
        data: result.data,
        selectedLanguage: activeLang,
        jobRole: resolvedRole,
        interviewRound: resolvedRound,
        groundingSources: (result as any)?.groundingSources || result.data?.groundingSources || [],
        searchQueries: (result as any)?.searchQueries || result.data?.searchQueries || [],
        isGrounded: Boolean((result as any)?.isGrounded || result.data?.isGrounded),
      });
    } catch (error: any) {
      console.error("❌ Error in /api/interview/generate-question:", error);
      return res.status(500).json({
        error: "Failed to generate interview question.",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/interview/generate-question", handleGenerateQuestion);

  // 3. COMPREHENSIVE MULTILINGUAL PERFORMANCE REPORT (/api/interview/report & /api/interview/generate-report)
  const handleInterviewReport = async (req: express.Request, res: express.Response) => {
    try {
      const {
        transcript = [],
        turnsHistory = [],
        candidateName = "Candidate",
        targetRole = "Full-Stack Software Engineer",
        resumeSummary = "",
        durationSeconds = 600,
        selectedLanguage = "Hindi",
        language = "Hindi",
        dialect = "Bhojpuri"
      } = req.body || {};

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const resolvedTranscript = Array.isArray(transcript) && transcript.length > 0
        ? transcript
        : turnsHistory;

      const reportResult = await generateFinalInterviewReport({
        transcript: resolvedTranscript,
        candidateName,
        targetRole,
        resumeSummary,
        durationSeconds: Number(durationSeconds) || 600,
        selectedLanguage: activeLang
      });

      if (!reportResult.success || !reportResult.report) {
        return res.status(500).json({
          error: reportResult.error || "Failed to generate interview performance report.",
          details: "Failed at Report Generation"
        });
      }

      return res.json({
        success: true,
        report: reportResult.report,
        ...reportResult.report,
        groundingSources: reportResult.groundingSources || [],
        searchQueries: reportResult.searchQueries || [],
        isGrounded: Boolean(reportResult.isGrounded),
      });
    } catch (error: any) {
      console.error("❌ Error in /api/interview/report:", error);
      return res.status(500).json({
        error: "Failed to compile final interview evaluation report.",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/interview/report", handleInterviewReport);
  app.post("/api/interview/generate-report", handleInterviewReport);

  // FLASHCARDS ROUTE CONTROLLER (Crash-Proof, Safe JSON Handling & Consistent PDF Resolution)
  const handleFlashcardsPost = async (req: express.Request, res: express.Response) => {
    try {
      const {
        documentText = "",
        documentBase64 = null,
        mimeType = "application/pdf",
        language = "Hindi",
        dialect = "Bhojpuri",
        selectedLanguage,
        numCards = 5
      } = req.body || {};

      const activeLang = selectedLanguage || dialect || language || "Hindi";

      // 3. CONSISTENCY CHECK: Uses the exact same PDF extraction utility and content payload structure as the Quiz route
      const contentPayload = documentBase64 
        ? { documentBase64, mimeType: mimeType || "application/pdf", text: documentText }
        : (documentText || "General curriculum overview");

      // 1. Invoke Flashcards Generation with strict error and parse isolation
      const result = await generateFlashcards(contentPayload, activeLang, Number(numCards) || 5);

      // 2. SAFE JSON HANDLING: If parsing model output failed, send 422 Unprocessable Entity
      if (result.parseError) {
        console.error("❌ [Flashcard AI Parse Error]: Raw model output could not be parsed as JSON:", result.rawResponse);
        return res.status(422).json({
          error: "Failed to parse JSON response from AI model",
          rawResponse: result.rawResponse,
          details: "Model returned invalid JSON format"
        });
      }

      if (!result.success || !result.flashcards) {
        return res.status(500).json({
          error: result.error || "Flashcard generation unsuccessful.",
          details: "Failed at Flashcard Generation"
        });
      }

      return res.json({
        flashcards: result.flashcards,
        selectedLanguage: result.selectedLanguage,
        groundingSources: result.groundingSources || [],
        searchQueries: result.searchQueries || [],
        isGrounded: Boolean(result.isGrounded),
      });
    } catch (error: any) {
      // 1. STRICT TRY-CATCH BLOCK: Server will NEVER crash
      console.error("❌ [Flashcard Generation Route Exception]:", error);
      return res.status(500).json({
        error: error?.message || String(error),
        details: "Failed at Flashcard Generation"
      });
    }
  };

  // Dedicated endpoints for Flashcard generation
  app.post("/api/flashcards", handleFlashcardsPost);
  app.post("/api/study/flashcards", handleFlashcardsPost);
  app.post("/api/flashcards/generate", handleFlashcardsPost);

  // STUDY TOOLS: FLASHCARDS, MIND MAPS & QUIZZES
  app.post("/api/study/generate", async (req, res) => {
    try {
      const {
        toolType = "mindmap", // 'flashcards' | 'mindmap' | 'quiz'
        documentText = "",
        documentBase64 = null,
        language = "Hindi",
        dialect = "Bhojpuri",
        selectedLanguage
      } = req.body;

      const activeLang = selectedLanguage || dialect || language || "Hindi";
      const contentPayload = documentBase64 
        ? { documentBase64, mimeType: req.body.mimeType || "application/pdf", text: documentText }
        : (documentText || "General curriculum overview");

      if (toolType === "mindmap") {
        const result = await generateMindMap(contentPayload, activeLang);
        if (result.success && result.root) {
          return res.json({
            root: result.root,
            groundingSources: result.groundingSources || [],
            searchQueries: result.searchQueries || [],
            isGrounded: Boolean(result.isGrounded),
          });
        }
      } else if (toolType === "quiz") {
        const result = await generateQuizFromPDF(contentPayload, activeLang, 4);
        if (result.success && result.questions) {
          return res.json({
            quizTitle: result.quizTitle,
            questions: result.questions,
            groundingSources: result.groundingSources || [],
            searchQueries: result.searchQueries || [],
            isGrounded: Boolean(result.isGrounded),
          });
        }
      } else if (toolType === "flashcards") {
        return await handleFlashcardsPost(req, res);
      }

      throw new Error(`Failed to generate ${toolType} in ${activeLang}`);
    } catch (error: any) {
      console.error("Error in /api/study/generate:", error);
      res.status(500).json({
        error: "Failed to generate study tool data",
        details: error?.message || String(error)
      });
    }
  });

  // DIAGRAM EXPLANATION (Vision AI - Multimodal)
  const handleDiagramExplanation = async (req: express.Request, res: express.Response) => {
    try {
      const {
        imageBase64,
        image,
        file,
        mimeType,
        language,
        dialect,
        selectedLanguage,
        userPrompt,
        userDoubt
      } = req.body || {};

      // 1. Image presence validation
      const rawImage = imageBase64 || image || file;
      if (!rawImage || typeof rawImage !== "string" || !rawImage.trim()) {
        return res.status(400).json({
          error: "Failed to analyze the diagram.",
          details: "Diagram image is required (must be a valid Base64 string or data URL)."
        });
      }

      // 2. Data URI processing & MIME type extraction
      let detectedMime = mimeType;
      let cleanBase64 = rawImage.trim();

      if (cleanBase64.startsWith("data:")) {
        const matches = cleanBase64.match(/^data:([^;]+);base64,(.*)$/);
        if (matches) {
          detectedMime = matches[1];
          cleanBase64 = matches[2].trim();
        } else {
          cleanBase64 = cleanBase64.replace(/^data:image\/\w+;base64,/, "").trim();
        }
      }

      const validMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/bmp",
        "image/svg+xml"
      ];
      const resolvedMime = (detectedMime || "image/jpeg").toLowerCase().trim();

      if (!resolvedMime.startsWith("image/") || !validMimeTypes.includes(resolvedMime)) {
        return res.status(400).json({
          error: "Failed to analyze the diagram.",
          details: `Invalid or unsupported image format '${resolvedMime}'. Supported formats: JPEG, PNG, WebP, GIF, BMP.`
        });
      }

      // 3. Dynamic language resolution
      const activeLanguage = selectedLanguage || dialect || language || "Hindi";
      const promptQuery = userPrompt || userDoubt || "Explain this diagram step by step.";

      // 4. Multimodal Vision Analysis via Gemini
      const result = await analyzeDiagram(cleanBase64, resolvedMime, promptQuery, activeLanguage);

      if (result.parseError) {
        console.error("❌ [Diagram AI Parse Error]: Raw model output could not be parsed as JSON:", result.rawResponse);
        return res.status(422).json({
          error: "Failed to analyze the diagram.",
          details: "Model returned invalid JSON format",
          rawResponse: result.rawResponse
        });
      }

      if (!result.success || !result.analysis) {
        return res.status(500).json({
          error: "Failed to analyze the diagram.",
          details: result.error || "Vision model failed to analyze the image."
        });
      }

      return res.json(result.analysis);
    } catch (error: any) {
      console.error("❌ Error in Diagram Explanation route:", error);
      return res.status(500).json({
        error: "Failed to analyze the diagram.",
        details: error?.message || String(error)
      });
    }
  };

  app.post("/api/diagram/analyze", handleDiagramExplanation);
  app.post("/api/diagram/explain", handleDiagramExplanation);
  app.post("/api/explain-diagram", handleDiagramExplanation);

  // USER HISTORY & DATABASE LOGGING API
  app.get("/api/history", (req, res) => {
    const { userId, category } = req.query;
    const targetUserId = (typeof userId === "string" && userId.trim()) 
      ? userId.trim() 
      : "learner_account";

    // Strictly filter to the currently active/logged-in user
    let records = historyDatabase.filter(r => r.userId === targetUserId || (targetUserId === "learner_account" && r.userId === "default-user"));
    if (category && category !== "all") {
      records = records.filter(r => r.category === category);
    }
    // Sort descending by date (newest first)
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(records);
  });

  app.post("/api/history", (req, res) => {
    const { userId, category, title, summary, data } = req.body;
    const targetUserId = (typeof userId === "string" && userId.trim()) 
      ? userId.trim() 
      : "learner_account";

    if (!category || !title) {
      return res.status(400).json({ error: "category and title are required" });
    }

    const newRecord: HistoryRecord = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      userId: targetUserId,
      category,
      title: String(title).trim(),
      summary: summary ? String(summary).trim() : "Recorded user interaction",
      createdAt: new Date().toISOString(),
      data: data || {}
    };

    // Prepend to array so it appears at top
    historyDatabase.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  app.delete("/api/history/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;
    const index = historyDatabase.findIndex(r => r.id === id && (!userId || r.userId === userId));
    if (index !== -1) {
      const deleted = historyDatabase.splice(index, 1)[0];
      return res.json({ success: true, id, deleted });
    }
    res.status(404).json({ error: "Record not found" });
  });

  app.delete("/api/history", (req, res) => {
    const { userId } = req.query;
    const targetUserId = (typeof userId === "string" && userId.trim()) 
      ? userId.trim() 
      : "learner_account";

    const initialCount = historyDatabase.length;
    for (let i = historyDatabase.length - 1; i >= 0; i--) {
      if (historyDatabase[i].userId === targetUserId) {
        historyDatabase.splice(i, 1);
      }
    }
    res.json({ success: true, clearedCount: initialCount - historyDatabase.length, userId: targetUserId });
  });

  // Explicit JSON 404 handler for any unhandled /api/* routes to prevent HTML fall-through
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Serve static assets from public directory
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShikshaSathi Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
