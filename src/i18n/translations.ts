export interface TranslationStrings {
  appName: string;
  learningTools: string;
  voiceAiChat: string;
  mockInterviewer: string;
  pdfSummarizer: string;
  flashcards: string;
  adaptiveQuiz: string;
  diagramExplainer: string;
  mindMaps: string;
  historyLogs: string;
  languageLabel: string;
  readingErgonomics: string;
  bionicReading: string;
  bionicSub: string;
  openDyslexic: string;
  openDyslexicSub: string;
  speechRate: string;
  greetingPrompt: string;
  micSubtitle: string;
  tapToSpeak: string;
  listening: string;
  processingVoice: string;
  speaking: string;
  bionicActiveTag: string;
  rewordTag: string;
  diagramTitle: string;
  diagramAnalysis: string;
  mockInterviewTitle: string;
  mockPrompt: string;
  mockUserReply: string;
  feedbackLabel: string;
  onlineLearning: string;
  languagesSupported: string;
  poweredBy: string;

  // Mock Interview Dedicated Page strings
  interviewHeading: string;
  interviewSubheading: string;
  resumeUploadTitle: string;
  resumeUploadPrompt: string;
  resumeUploadSub: string;
  targetRoleLabel: string;
  interviewTypeLabel: string;
  startInterviewBtn: string;
  stopInterviewBtn: string;
  camOn: string;
  camOff: string;
  micOn: string;
  micMute: string;
  yourAnswerLabel: string;
  speakOrTypeAnswer: string;
  submitAnswerBtn: string;
  crossQuestionBadge: string;
  evaluatingAnswer: string;
  overallScore: string;
  technicalScore: string;
  confidenceScore: string;
  clarityScore: string;
  strengthsLabel: string;
  areasToImproveLabel: string;
  nextQuestionBtn: string;
  finishInterviewBtn: string;
  signInWithGoogle: string;
  signOut: string;
  voiceCommands: string;
  cloudSync: string;
  typewriterPrompts?: string[];
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  "en": {
    appName: "ShikshaSathi AI",
    learningTools: "LEARNING TOOLS",
    voiceAiChat: "Voice AI Chat",
    mockInterviewer: "Mock Interviewer",
    pdfSummarizer: "PDF Summarizer",
    flashcards: "Flashcards",
    adaptiveQuiz: "Adaptive Quiz",
    diagramExplainer: "Diagram Explainer",
    mindMaps: "D3 Mind Maps",
    historyLogs: "Activity History",
    languageLabel: "LANGUAGE",
    readingErgonomics: "Reading Ergonomics",
    bionicReading: "Bionic Reading",
    bionicSub: "Bolds artificial eye fixation letters",
    openDyslexic: "OpenDyslexic Font",
    openDyslexicSub: "Weighted letter gravity base",
    speechRate: "Audio Speech Rate",
    greetingPrompt: '"Hello! What shall we learn today?"',
    micSubtitle: "Tap to speak. I can explain complex science concepts or history stories in your own language.",
    tapToSpeak: "TAP MIC TO SPEAK...",
    listening: "LISTENING...",
    processingVoice: "PROCESSING VOICE...",
    speaking: "PLAYING AUDIO...",
    bionicActiveTag: "BIONIC READING ACTIVE",
    rewordTag: "RE-WORDING",
    diagramTitle: "Diagram Explainer",
    diagramAnalysis: "Analysis: This diagram shows the Water Cycle. Tap parts to hear audio explanation.",
    mockInterviewTitle: "Mock Interview",
    mockPrompt: "Tell me about yourself and your technical background.",
    mockUserReply: "My name is Rahul and I build full-stack web applications...",
    feedbackLabel: "FEEDBACK",
    onlineLearning: "Online Learning",
    languagesSupported: "10 Languages Supported",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI Mock Interviewer & Viva Studio",
    interviewSubheading: "Live WebRTC Camera & Mic, Resume-Tailored Questions, and Real-Time Deep Cross-Questioning",
    resumeUploadTitle: "Candidate Resume Analysis",
    resumeUploadPrompt: "Upload your Resume (PDF, Word, or TXT)",
    resumeUploadSub: "Gemini will inspect your projects, skills, and generate tailored questions",
    targetRoleLabel: "Target Job Role",
    interviewTypeLabel: "Interview Round",
    startInterviewBtn: "Start Live Video Interview",
    stopInterviewBtn: "End Interview Session",
    camOn: "Camera On",
    camOff: "Camera Off",
    micOn: "Mic Unmuted",
    micMute: "Mic Muted",
    yourAnswerLabel: "Candidate Spoken / Typed Response",
    speakOrTypeAnswer: "Speak into your microphone or refine your answer here...",
    submitAnswerBtn: "Submit Answer & Get Feedback",
    crossQuestionBadge: "INTERVIEWER CROSS-QUESTION",
    evaluatingAnswer: "Analyzing answer & formulating cross-question...",
    overallScore: "Overall Score",
    technicalScore: "Technical Depth",
    confidenceScore: "Confidence & Pace",
    clarityScore: "Communication Clarity",
    strengthsLabel: "Observed Strengths",
    areasToImproveLabel: "Areas for Improvement",
    nextQuestionBtn: "Answer Next Cross-Question",
    finishInterviewBtn: "Complete Interview & Download Report",
    signInWithGoogle: "Sign In with Google",
    signOut: "Sign Out",
    voiceCommands: "Voice Commands",
    cloudSync: "Cloud Sync"
  },

  "hi-bhojpuri": {
    appName: "शिक्षासाथी AI",
    learningTools: "सिखे के औजार",
    voiceAiChat: "आवाज़ से AI बातचीत",
    mockInterviewer: "मॉक इंटरव्यू (Viva)",
    pdfSummarizer: "PDF सार संक्षेप",
    flashcards: "फ्लैशकार्ड्स",
    adaptiveQuiz: "अनुकूली क्विज",
    diagramExplainer: "चित्र समझावे वाला",
    mindMaps: "D3 माइंड मैप्स",
    historyLogs: "गतिविधि इतिहास",
    languageLabel: "भाषा",
    readingErgonomics: "पढ़े के सुगमता",
    bionicReading: "बायोनिक रीडिंग",
    bionicSub: "आंखिन के ध्यान टिकावे खातिर अक्षर बोल्ड करेला",
    openDyslexic: "ओपन-डिस्लेक्सिक फॉन्ट",
    openDyslexicSub: "डिस्लेक्सिया खातिर संतुलित फॉन्ट",
    speechRate: "बोले के रफ़्तार",
    greetingPrompt: '"नमस्ते! आज हम सब का सीखब?"',
    micSubtitle: "माइक छू के बोलल जाव। हम कवनो कठिन विज्ञान भा इतिहास के बात राउर आपन भाषा में समझा देब।",
    tapToSpeak: "माइक दबाके बोलीं...",
    listening: "सुनत बानी...",
    processingVoice: "आवाज़ समझल जा रहल बा...",
    speaking: "बोलत बानी...",
    bionicActiveTag: "बायोनिक रीडिंग चालू बा",
    rewordTag: "सरल शब्द में",
    diagramTitle: "चित्र व्याख्याकार",
    diagramAnalysis: "जांच: ई चित्र जल चक्र देखावेला। कवनो हिस्सा छू के आवाज़ में व्याख्या सुनीं।",
    mockInterviewTitle: "मॉक इंटरव्यू",
    mockPrompt: "आपन परिचय दीं आ बताईं कि रउआ कवन प्रोजेक्ट बनवले बानी।",
    mockUserReply: "हमार नाम राहुल बा, हम फुल-स्टैक सॉफ्टवेयर बनावेनी...",
    feedbackLabel: "मूल्यांकन",
    onlineLearning: "ऑनलाइन शिक्षा",
    languagesSupported: "10 भारतीय बोलियन में उपलब्ध",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI मॉक इंटरव्यू आ मौखिक परीक्षा (Viva)",
    interviewSubheading: "लाइव वेबकैम, माइक, रिज्यूमे विश्लेषण आ गहराई से क्रॉस-प्रश्न पूछे वाला AI",
    resumeUploadTitle: "रिज्यूमे अपलोड करीं",
    resumeUploadPrompt: "आपन रिज्यूमे (PDF, Word भा Text) अपलोड करीं",
    resumeUploadSub: "जेमिनी राउर प्रोजेक्ट आ स्किल देखके सीधे सवाल बनाई",
    targetRoleLabel: "टारगेट पद / नौकरी",
    interviewTypeLabel: "इंटरव्यू प्रकार",
    startInterviewBtn: "लाइव इंटरव्यू शुरू करीं",
    stopInterviewBtn: "इंटरव्यू समाप्त करीं",
    camOn: "कैमरा चालू",
    camOff: "कैमरा बंद",
    micOn: "माइक चालू",
    micMute: "माइक बंद",
    yourAnswerLabel: "उम्मीदवार के जवाब",
    speakOrTypeAnswer: "माइक में बोलीं भा आपन जवाब इहाँ लिखीं...",
    submitAnswerBtn: "जवाब सबमिट करीं आ फीडबैक लीं",
    crossQuestionBadge: "गहराई से क्रॉस-प्रश्न",
    evaluatingAnswer: "जवाब के जांच हो रहल बा आ क्रॉस-प्रश्न बनत बा...",
    overallScore: "कुल स्कोर",
    technicalScore: "तकनीकी गहराई",
    confidenceScore: "आत्मविश्वास आ प्रवाह",
    clarityScore: "बातचीत के स्पष्टता",
    strengthsLabel: "मजबूत पहलू",
    areasToImproveLabel: "सुधार के सलाह",
    nextQuestionBtn: "अगिला क्रॉस-प्रश्न के जवाब दीं",
    finishInterviewBtn: "इंटरव्यू रिपोर्ट पूरा करीं",
    signInWithGoogle: "गूगल से साइन इन करीं",
    signOut: "साइन आउट करीं",
    voiceCommands: "आवाज़ कमांड",
    cloudSync: "क्लाउड सिंक"
  },

  "hi-standard": {
    appName: "शिक्षासाथी AI",
    learningTools: "लर्निंग टूल्स",
    voiceAiChat: "वॉइस AI चैट",
    mockInterviewer: "मॉक इंटरव्यूअर",
    pdfSummarizer: "PDF सारांश",
    flashcards: "फ्लैशकार्ड्स",
    adaptiveQuiz: "अडैप्टिव क्विज",
    diagramExplainer: "डायग्राम व्याख्या",
    mindMaps: "D3 माइंड मैप्स",
    historyLogs: "गतिविधि इतिहास",
    languageLabel: "भाषा",
    readingErgonomics: "पठन सुगमता",
    bionicReading: "बायोनिक रीडिंग",
    bionicSub: "अक्षरों के शुरुआती हिस्सों को गहरा करता है",
    openDyslexic: "ओपन-डिस्लेक्सिक फॉन्ट",
    openDyslexicSub: "डिस्लेक्सिया अनुकूल फॉन्ट",
    speechRate: "ध्वनि गति",
    greetingPrompt: '"नमस्ते! आज हम क्या सीखेंगे?"',
    micSubtitle: "बोलने के लिए माइक दबाएं। मैं विज्ञान व इतिहास की जटिल बातें आपकी भाषा में समझाऊंगा।",
    tapToSpeak: "माइक दबाकर बोलें...",
    listening: "सुन रहे हैं...",
    processingVoice: "प्रोसेसिंग...",
    speaking: "ऑडियो चालू...",
    bionicActiveTag: "बायोनिक रीडिंग सक्रिय",
    rewordTag: "सरल शब्द",
    diagramTitle: "डायग्राम व्याख्या",
    diagramAnalysis: "विश्लेषण: यह डायग्राम जल चक्र दर्शाता है। ऑडियो सुनने के लिए टैप करें।",
    mockInterviewTitle: "मॉक इंटरव्यू",
    mockPrompt: "कृपया अपना परिचय दें और अपने तकनीकी अनुभवों के बारे में बताएं।",
    mockUserReply: "मेरा नाम राहुल है और मैं फुल-स्टैक वेब ऐप्लिकेशन्स बनाता हूँ...",
    feedbackLabel: "फीडबैक",
    onlineLearning: "सक्रिय शिक्षा",
    languagesSupported: "10 भाषाएं समर्थित",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI मॉक इंटरव्यू एवं मौखिक परीक्षा स्टूडियो",
    interviewSubheading: "लाइव वेबकैम, माइक्रोफोन, रिज्यूमे विश्लेषण और गहन क्रॉस-क्वेश्चनिंग",
    resumeUploadTitle: "रिज्यूमे विश्लेषण",
    resumeUploadPrompt: "अपना रिज्यूमे अपलोड करें (PDF, Word या Text)",
    resumeUploadSub: "जेमिनी आपके कौशल व प्रोजेक्ट्स के आधार पर प्रश्न तैयार करेगा",
    targetRoleLabel: "लक्षित पद",
    interviewTypeLabel: "इंटरव्यू का प्रकार",
    startInterviewBtn: "लाइव इंटरव्यू शुरू करें",
    stopInterviewBtn: "इंटरव्यू समाप्त करें",
    camOn: "कैमरा चालू",
    camOff: "कैमरा बंद",
    micOn: "माइक चालू",
    micMute: "माइक म्यूट",
    yourAnswerLabel: "आपका उत्तर",
    speakOrTypeAnswer: "माइक में बोलें या यहाँ टाइप करें...",
    submitAnswerBtn: "उत्तर सबमिट करें व क्रॉस-क्वेश्चन पाएं",
    crossQuestionBadge: "इंटरव्यूअर का क्रॉस-क्वेश्चन",
    evaluatingAnswer: "उत्तर का विश्लेषण हो रहा है...",
    overallScore: "कुल स्कोर",
    technicalScore: "तकनीकी गहराई",
    confidenceScore: "आत्मविश्वास",
    clarityScore: "स्पष्टता",
    strengthsLabel: "प्रमुख खूबियां",
    areasToImproveLabel: "सुधार के क्षेत्र",
    nextQuestionBtn: "अगले प्रश्न का उत्तर दें",
    finishInterviewBtn: "साक्षात्कार समाप्त करें",
    signInWithGoogle: "गूगल से साइन इन करें",
    signOut: "साइन आउट करें",
    voiceCommands: "वॉइस कमांड",
    cloudSync: "क्लाउड सिंक"
  },

  "mr-varhadi": {
    appName: "शिक्षासाथी AI",
    learningTools: "अभ्यास साधने",
    voiceAiChat: "व्हॉइस AI संवाद",
    mockInterviewer: "मॉक मुलाखत (Interview)",
    pdfSummarizer: "PDF सारांश",
    flashcards: "फ्लॅशकार्ड्स",
    adaptiveQuiz: "अडॅप्टिव्ह क्विझ",
    diagramExplainer: "आकृती स्पष्टीकरण",
    mindMaps: "D3 माइंड मॅप्स",
    historyLogs: "सक्रियता इतिहास",
    languageLabel: "भाषा",
    readingErgonomics: "वाचन सुलभता",
    bionicReading: "बायोनिक वाचन",
    bionicSub: "डोळ्यांच्या एकाग्रतेसाठी अक्षरे ठळक करते",
    openDyslexic: "ओपन-डिस्लेक्सिक फॉन्ट",
    openDyslexicSub: "डिस्लेक्सिया अनुकूल फॉन्ट",
    speechRate: "बोलण्याचा वेग",
    greetingPrompt: '"नमस्कार! आज आपण काय शिकणार?"',
    micSubtitle: "बोलण्यासाठी माइक टॅप करा. मी अवघड विज्ञान व गणित आपल्या भाषेत समजावून सांगेल.",
    tapToSpeak: "माइक दाबून बोला...",
    listening: "ऐकत आहे...",
    processingVoice: "विचार करत आहे...",
    speaking: "ऑडिओ वाजत आहे...",
    bionicActiveTag: "बायोनिक वाचन चालू",
    rewordTag: "सोप्या भाषेत",
    diagramTitle: "आकृती स्पष्टीकरण",
    diagramAnalysis: "विश्लेषण: ही आकृती जलचक्र दर्शवते. ऐकण्यासाठी टॅप करा.",
    mockInterviewTitle: "मॉक मुलाखत",
    mockPrompt: "तुमचा परिचय द्या आणि केलेल्या प्रोजेक्ट्सबद्दल सांगा.",
    mockUserReply: "माझं नाव राहुल आहे, मी सॉफ्टवेअर डेव्हलपर आहे...",
    feedbackLabel: "अभिप्राय",
    onlineLearning: "ऑनलाइन शिक्षण",
    languagesSupported: "१० भारतीय भाषा",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI मॉक मुलाखत स्टुडिओ",
    interviewSubheading: "लाइव्ह वेबकॅम, माइक, रेझ्युमे विश्लेषण आणि सखोल उलटतपासणी (Cross-Questions)",
    resumeUploadTitle: "रेझ्युमे अपलोड करा",
    resumeUploadPrompt: "तुमचा रेझ्युमे अपलोड करा (PDF / Word)",
    resumeUploadSub: "जेमिनी तुमच्या प्रोजेक्ट्सवरून थेट प्रश्न तयार करेल",
    targetRoleLabel: "लक्ष्यित पद",
    interviewTypeLabel: "मुलाखतीचा प्रकार",
    startInterviewBtn: "लाइव्ह मुलाखत सुरू करा",
    stopInterviewBtn: "मुलाखत संपवा",
    camOn: "कॅमेरा चालू",
    camOff: "कॅमेरा बंद",
    micOn: "माइक चालू",
    micMute: "माइक म्यूट",
    yourAnswerLabel: "तुमचे उत्तर",
    speakOrTypeAnswer: "माइकवर बोला किंवा येथे टाईप करा...",
    submitAnswerBtn: "उत्तर पाठवा आणि अभिप्राय मिळवा",
    crossQuestionBadge: "उलटतपासणी प्रश्न (Cross-Question)",
    evaluatingAnswer: "उत्तराचे परीक्षण होत आहे...",
    overallScore: "एकूण गुण",
    technicalScore: "तांत्रिक खोली",
    confidenceScore: "आत्मविश्वास",
    clarityScore: "स्पष्टता",
    strengthsLabel: "चांगल्या बाजू",
    areasToImproveLabel: "सुधारणेसाठी जागा",
    nextQuestionBtn: "पुढील प्रश्नाचे उत्तर द्या",
    finishInterviewBtn: "मुलाखत पूर्ण करा",
    signInWithGoogle: "गुगलने साइन इन करा",
    signOut: "साइन आउट करा",
    voiceCommands: "व्हॉइस कमांड",
    cloudSync: "क्लाउड सिंक"
  },

  "es": {
    appName: "ShikshaSathi AI",
    learningTools: "HERRAMIENTAS DE APRENDIZAJE",
    voiceAiChat: "Chat de Voz con IA",
    mockInterviewer: "Entrevistador Simulado",
    pdfSummarizer: "Resumen de PDF",
    flashcards: "Tarjetas de Memoria",
    adaptiveQuiz: "Cuestionario Adaptativo",
    diagramExplainer: "Explicador de Diagramas",
    mindMaps: "Mapas Mentales D3",
    historyLogs: "Historial de Actividad",
    languageLabel: "IDIOMA",
    readingErgonomics: "Ergonomía de Lectura",
    bionicReading: "Lectura Biónica",
    bionicSub: "Resalta letras de fijación ocular",
    openDyslexic: "Fuente OpenDyslexic",
    openDyslexicSub: "Base ponderada para dislexia",
    speechRate: "Velocidad de Voz",
    greetingPrompt: '"¡Hola! ¿Qué aprenderemos hoy?"',
    micSubtitle: "Toca para hablar. Puedo explicar conceptos científicos complejos en tu propio idioma.",
    tapToSpeak: "TOCA EL MICRÓFONO PARA HABLAR...",
    listening: "ESCUCHANDO...",
    processingVoice: "PROCESANDO VOZ...",
    speaking: "REPRODUCIENDO AUDIO...",
    bionicActiveTag: "LECTURA BIÓNICA ACTIVA",
    rewordTag: "EN PALABRAS SENCILLAS",
    diagramTitle: "Explicador de Diagramas",
    diagramAnalysis: "Análisis: Este diagrama muestra el Ciclo del Agua. Toca para escuchar.",
    mockInterviewTitle: "Entrevista Simulada",
    mockPrompt: "Cuéntame sobre ti y tus proyectos técnicos destacados.",
    mockUserReply: "Mi nombre es Rahul y desarrollo aplicaciones web completas...",
    feedbackLabel: "RETROALIMENTACIÓN",
    onlineLearning: "Aprendizaje en Línea",
    languagesSupported: "10 Idiomas Compatibles",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "Estudio de Entrevista Simulada con IA",
    interviewSubheading: "Cámara y Micrófono WebRTC en Vivo, Análisis de CV y Repreguntas Dinámicas",
    resumeUploadTitle: "Análisis del Currículum",
    resumeUploadPrompt: "Sube tu CV (PDF, Word o Texto)",
    resumeUploadSub: "Gemini examinará tus habilidades y formulará preguntas a medida",
    targetRoleLabel: "Puesto Objetivo",
    interviewTypeLabel: "Tipo de Entrevista",
    startInterviewBtn: "Iniciar Entrevista en Vivo",
    stopInterviewBtn: "Finalizar Entrevista",
    camOn: "Cámara Activa",
    camOff: "Cámara Apagada",
    micOn: "Micrófono Activo",
    micMute: "Micrófono Silenciado",
    yourAnswerLabel: "Respuesta del Candidato",
    speakOrTypeAnswer: "Habla por el micrófono o escribe tu respuesta aquí...",
    submitAnswerBtn: "Enviar Respuesta y Recibir Feedback",
    crossQuestionBadge: "REPREGUNTA DEL ENTREVISTADOR",
    evaluatingAnswer: "Analizando respuesta y formulando repregunta...",
    overallScore: "Puntuación General",
    technicalScore: "Profundidad Técnica",
    confidenceScore: "Confianza y Fluidez",
    clarityScore: "Claridad de Comunicación",
    strengthsLabel: "Puntos Fuertes",
    areasToImproveLabel: "Áreas de Mejora",
    nextQuestionBtn: "Responder Siguiente Repregunta",
    finishInterviewBtn: "Completar Entrevista",
    signInWithGoogle: "Iniciar sesión con Google",
    signOut: "Cerrar sesión",
    voiceCommands: "Comandos de voz",
    cloudSync: "Sincronización en la nube"
  },

  "bn-rarh": {
    appName: "শিক্ষা-সাথী AI",
    learningTools: "শেখার উপকরণ",
    voiceAiChat: "ভয়েস AI আড্ডা",
    mockInterviewer: "মক ইন্টারভিউয়ার",
    pdfSummarizer: "PDF সারসংক্ষেপ",
    flashcards: "ফ্ল্যাশকার্ডস",
    adaptiveQuiz: "অ্যাডাপ্টিভ কুইজ",
    diagramExplainer: "চিত্র বিশদকারক",
    mindMaps: "D3 মাইন্ড ম্যাপস",
    historyLogs: "কাজের ইতিহাস",
    languageLabel: "ভাষা",
    readingErgonomics: "পড়ার সুবিধা",
    bionicReading: "বায়োনিক রিডিং",
    bionicSub: "চোখের দৃষ্টি ধরে রাখতে অক্ষর গাঢ় করে",
    openDyslexic: "ওপেন-ডিসলেক্সিক ফন্ট",
    openDyslexicSub: "ডিসলেক্সিয়া-বান্ধব ফন্ট",
    speechRate: "কথা বলার গতি",
    greetingPrompt: '"নমস্কার! আজ আমরা কী শিখব?"',
    micSubtitle: "কথা বলতে মাইক স্পর্শ করুন। আমি আপনার নিজের ভাষায় বিজ্ঞান বা ইতিহাসের জটিল তথ্য বুঝিয়ে দেব।",
    tapToSpeak: "কথা বলতে মাইকে চাপ দিন...",
    listening: "শুনছি...",
    processingVoice: "প্রক্রিয়াকরণ হচ্ছে...",
    speaking: "অডিও বাজছে...",
    bionicActiveTag: "বায়োনিক রিডিং সক্রিয়",
    rewordTag: "সহজ কথায়",
    diagramTitle: "চিত্র বিশদকারক",
    diagramAnalysis: "বিশ্লেষণ: এই চিত্রে জলচক্র দেখানো হয়েছে। অডিও শুনতে স্পর্শ করুন।",
    mockInterviewTitle: "মক ইন্টারভিউ",
    mockPrompt: "আপনার পরিচয় দিন এবং আপনার কারিগরি অভিজ্ঞতা সম্পর্কে বলুন।",
    mockUserReply: "আমার নাম রাহুল এবং আমি ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি করি...",
    feedbackLabel: "প্রতিক্রিয়া",
    onlineLearning: "অনলাইন শিক্ষা",
    languagesSupported: "১০ ভারতীয় ভাষায় সমর্থিত",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI মক ইন্টারভিউ ও ভাইভা স্টুডিও",
    interviewSubheading: "লাইভ ওয়েবক্যাম, মাইক, রেজ্যুমে বিশ্লেষণ এবং গভীর ক্রস-প্রশ্ন",
    resumeUploadTitle: "প্রার্থীর রেজ্যুমে বিশ্লেষণ",
    resumeUploadPrompt: "আপনার রেজ্যুমে (PDF, Word বা Text) আপলোড করুন",
    resumeUploadSub: "জেমিনাই আপনার প্রোফাইল বিশ্লেষণ করে উপযুক্ত প্রশ্ন তৈরি করবে",
    targetRoleLabel: "লক্ষ্য পদ",
    interviewTypeLabel: "ইন্টারভিউ রাউন্ড",
    startInterviewBtn: "লাইভ ইন্টারভিউ শুরু করুন",
    stopInterviewBtn: "ইন্টারভিউ শেষ করুন",
    camOn: "ক্যামেরা চালু",
    camOff: "ক্যামেরা বন্ধ",
    micOn: "মাইক চালু",
    micMute: "মাইক বন্ধ",
    yourAnswerLabel: "প্রার্থীর উত্তর",
    speakOrTypeAnswer: "মাইকে কথা বলুন অথবা এখানে উত্তর টাইপ করুন...",
    submitAnswerBtn: "উত্তর জমা দিন ও মূল্যায়ন পান",
    crossQuestionBadge: "ইন্টারভিউয়ারের পাল্টা প্রশ্ন",
    evaluatingAnswer: "উত্তর বিশ্লেষণ করা হচ্ছে ও পাল্টা প্রশ্ন তৈরি হচ্ছে...",
    overallScore: "মোট স্কোর",
    technicalScore: "প্রযুক্তিগত গভীরতা",
    confidenceScore: "আত্মবিশ্বাস ও গতি",
    clarityScore: "যোগাযোগের স্পষ্টতা",
    strengthsLabel: "ভালো দিকসমূহ",
    areasToImproveLabel: "উন্নতির ক্ষেত্র",
    nextQuestionBtn: "পরবর্তী প্রশ্নের উত্তর দিন",
    finishInterviewBtn: "ইন্টারভিউ সমাপ্ত করুন",
    signInWithGoogle: "গুগল দিয়ে সাইন ইন করুন",
    signOut: "সাইন আউট করুন",
    voiceCommands: "ভয়েস কমান্ড",
    cloudSync: "ক্লাউড সিঙ্ক"
  },

  "ta-madurai": {
    appName: "சிக்ஷாசாதி AI",
    learningTools: "கற்றல் கருவிகள்",
    voiceAiChat: "குரல் வழி AI உரையாடல்",
    mockInterviewer: "மாதிரி நேர்காணல் (Mock Interview)",
    pdfSummarizer: "PDF சுருக்கம்",
    flashcards: "ஃபிளாஷ்கார்டுகள்",
    adaptiveQuiz: "தகவமைப்பு வினாடி வினா",
    diagramExplainer: "வரைபட விளக்கவுரை",
    mindMaps: "D3 மன வரைபடம்",
    historyLogs: "செயல்பாட்டு வரலாறு",
    languageLabel: "மொழி",
    readingErgonomics: "வாசிப்பு எளிமை",
    bionicReading: "பயோனிக் வாசிப்பு",
    bionicSub: "கவனத்தை ஈர்க்க எழுத்துக்களை தடிமனாக்குகிறது",
    openDyslexic: "ஓபன்-டிஸ்லெக்ஸிக் எழுத்துரு",
    openDyslexicSub: "டிஸ்லெக்ஸியா நட்பு எழுத்துரு",
    speechRate: "பேச்சு வேகம்",
    greetingPrompt: '"வணக்கம்! இன்று நாம் என்ன கற்கலாம்?"',
    micSubtitle: "பேச மைக்-ஐ தட்டவும். கடினமான அறிவியல் மற்றும் கணிதத்தை உங்கள் தாய்மொழியில் விளக்குகிறேன்.",
    tapToSpeak: "பேச மைக்கை அழுத்தவும்...",
    listening: "கேட்கிறது...",
    processingVoice: "செயலாக்குகிறது...",
    speaking: "ஆடியோ இயங்குகிறது...",
    bionicActiveTag: "பயோனிக் வாசிப்பு செயலில் உள்ளது",
    rewordTag: "எளிய முறையில்",
    diagramTitle: "வரைபட விளக்கம்",
    diagramAnalysis: "பகுப்பாய்வு: இந்த வரைபடம் நீர் சுழற்சியைக் காட்டுகிறது. விளக்கத்தைக் கேட்க தட்டவும்.",
    mockInterviewTitle: "மாதிரி நேர்காணல்",
    mockPrompt: "உங்களைப் பற்றியும் உங்கள் தொழில்நுட்ப அனுபவம் பற்றியும் கூறுங்கள்.",
    mockUserReply: "என் பெயர் ராகுல், நான் முழு-அடுக்கு வலைப் பயன்பாடுகளை உருவாக்குகிறேன்...",
    feedbackLabel: "கருத்துரை",
    onlineLearning: "ஆன்லைன் கற்றல்",
    languagesSupported: "10 இந்திய மொழிகளில் கிடைக்கிறது",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI மாதிரி நேர்காணல் அரங்கம்",
    interviewSubheading: "நேரலை வெப்கேம், மைக்ரோஃபோன், ரெஸ்யூம் பகுப்பாய்வு மற்றும் குறுக்குக் கேள்விகள்",
    resumeUploadTitle: "விண்ணப்பதாரர் ரெஸ்யூம் பகுப்பாய்வு",
    resumeUploadPrompt: "உங்கள் ரெஸ்யூமை (PDF / Word) பதிவேற்றவும்",
    resumeUploadSub: "ஜெமினி உங்கள் திறன்களை ஆராய்ந்து பொருத்தமான கேள்விகளை உருவாக்கும்",
    targetRoleLabel: "இலக்கு பதவி",
    interviewTypeLabel: "நேர்காணல் வகை",
    startInterviewBtn: "நேரலை நேர்காணலைத் தொடங்கு",
    stopInterviewBtn: "நேர்காணலை முடி",
    camOn: "கேமரா ஆன்",
    camOff: "கேமரா ஆஃப்",
    micOn: "மைக் ஆன்",
    micMute: "மைக் மியூட்",
    yourAnswerLabel: "உங்கள் பதில்",
    speakOrTypeAnswer: "மைக்கில் பேசவும் அல்லது பதிலை தட்டச்சு செய்யவும்...",
    submitAnswerBtn: "பதிலை சமர்ப்பித்து கருத்து பெறவும்",
    crossQuestionBadge: "நேர்காணலாளரின் குறுக்குக் கேள்வி",
    evaluatingAnswer: "பதில் பகுப்பாய்வு செய்யப்பட்டு குறுக்குக் கேள்வி தயாராகிறது...",
    overallScore: "ஒட்டுமொத்த மதிப்பெண்",
    technicalScore: "தொழில்நுட்ப ஆழம்",
    confidenceScore: "தன்னம்பிக்கை",
    clarityScore: "தெளிவு",
    strengthsLabel: "சிறப்புகள்",
    areasToImproveLabel: "மேம்படுத்த வேண்டியவை",
    nextQuestionBtn: "அடுத்த கேள்விக்கு பதிலளி",
    finishInterviewBtn: "நேர்காணலை நிறைவுசெய்",
    signInWithGoogle: "கூகிள் மூலம் உள்நுழைக",
    signOut: "வெளியேறு",
    voiceCommands: "குரல் கட்டளைகள்",
    cloudSync: "கிளவுட் ஒத்திசைவு"
  },

  "te-telangana": {
    appName: "శిక్షాసాథి AI",
    learningTools: "నేర్చుకునే సాధనాలు",
    voiceAiChat: "వాయిస్ AI సంభాషణ",
    mockInterviewer: "మాక్ ఇంటర్వ్యూ",
    pdfSummarizer: "PDF సారాంశం",
    flashcards: "ఫ్లాష్‌కార్డులు",
    adaptiveQuiz: "అడాప్టివ్ క్విజ్",
    diagramExplainer: "డయాగ్రమ్ వివరణ",
    mindMaps: "D3 మైండ్ మ్యాప్స్",
    historyLogs: "కార్యాచరణ చరిత్ర",
    languageLabel: "భాష",
    readingErgonomics: "పఠన సౌలభ్యం",
    bionicReading: "బయోనిక్ రీడింగ్",
    bionicSub: "చదవడానికి అనుకూలంగా అక్షరాలను బోల్డ్ చేస్తుంది",
    openDyslexic: "ఓపెన్-డిస్లెక్సిక్ ఫాంట్",
    openDyslexicSub: "డిస్లెక్సియా అనుకూల ఫాంట్",
    speechRate: "వాయిస్ వేగం",
    greetingPrompt: '"నమస్కారం! ఈరోజు మనం ఏమి నేర్చుకుందాం?"',
    micSubtitle: "మాట్లాడటానికి మైక్ నొక్కండి. కష్టమైన శాస్త్రాలను మీ సొంత భాషలో సులభంగా వివరిస్తాను.",
    tapToSpeak: "మాట్లాడటానికి మైక్ నొక్కండి...",
    listening: "వింటోంది...",
    processingVoice: "ప్రాసెస్ చేస్తోంది...",
    speaking: "ఆడియో ప్లే అవుతోంది...",
    bionicActiveTag: "బయోనిక్ రీడింగ్ ఆన్‌లో ఉంది",
    rewordTag: "సులభమైన మాటల్లో",
    diagramTitle: "డయాగ్రమ్ వివరణ",
    diagramAnalysis: "విశ్లేషణ: ఈ బొమ్మ జలచక్రాన్ని చూపిస్తుంది. వివరణ వినడానికి నొక్కండి.",
    mockInterviewTitle: "మాక్ ఇంటర్వ్యూ",
    mockPrompt: "మీ గురించి మరియు మీ సాంకేతిక ప్రాజెక్టుల గురించి చెప్పండి.",
    mockUserReply: "నా పేరు రాహుల్, నేను సాఫ్ట్‌వేర్ వెబ్ అప్లికేషన్లు రూపొందిస్తాను...",
    feedbackLabel: "ఫీడ్‌బ్యాక్",
    onlineLearning: "ఆన్‌లైన్ విద్య",
    languagesSupported: "10 భారతీయ భాషలకు మద్దతు",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI మాక్ ఇంటర్వ్యూ స్టూడియో",
    interviewSubheading: "లైవ్ వెబ్‌క్యామ్, మైక్, రెజ్యూమ్ విశ్లేషణ మరియు లోతైన ప్రశ్నలు",
    resumeUploadTitle: "రెజ్యూమ్ విశ్లేషణ",
    resumeUploadPrompt: "మీ రెజ్యూమ్‌ను (PDF / Word) అప్‌లోడ్ చేయండి",
    resumeUploadSub: "జెమిని మీ నైపుణ్యాలను పరిశీలించి అనుకూలమైన ప్రశ్నలను రూపొందిస్తుంది",
    targetRoleLabel: "లక్ష్య ఉద్యోగం",
    interviewTypeLabel: "రౌండ్ రకం",
    startInterviewBtn: "లైవ్ ఇంటర్వ్యూ ప్రారంభించండి",
    stopInterviewBtn: "ఇంటర్వ్యూ ముగించండి",
    camOn: "కెమెరా ఆన్",
    camOff: "కెమెరా ఆఫ్",
    micOn: "మైక్ ఆన్",
    micMute: "మైక్ మ్యూట్",
    yourAnswerLabel: "అభ్యర్థి సమాధానం",
    speakOrTypeAnswer: "మైక్‌లో మాట్లాడండి లేదా సమాధానం టైప్ చేయండి...",
    submitAnswerBtn: "సమాధానం పంపి ఫీడ్‌బ్యాక్ పొందండి",
    crossQuestionBadge: "ఇంటర్వ్యూయర్ క్రాస్-క్వశ్చన్",
    evaluatingAnswer: "సమాధానాన్ని విశ్లేషిస్తోంది...",
    overallScore: "మొత్తం స్కోరు",
    technicalScore: "సాంకేతిక లోతు",
    confidenceScore: "ఆత్మవిశ్వాసం",
    clarityScore: "స్పష్టత",
    strengthsLabel: "బలాలు",
    areasToImproveLabel: "మెరుగుపరచుకోవాల్సిన అంశాలు",
    nextQuestionBtn: "తదుపరి ప్రశ్నకు సమాధానం ఇవ్వండి",
    finishInterviewBtn: "ఇంటర్వ్యూ పూర్తి చేయండి",
    signInWithGoogle: "గూగుల్ ద్వారా సైన్ ఇన్ చేయండి",
    signOut: "సైన్ అవుట్ చేయండి",
    voiceCommands: "వాయిస్ కమాండ్స్",
    cloudSync: "క్లౌడ్ సింక్"
  },

  "gu-kathiyawadi": {
    appName: "શિક્ષાસાથી AI",
    learningTools: "શીખવાના સાધનો",
    voiceAiChat: "વોઇસ AI સંવાદ",
    mockInterviewer: "મોક ઇન્ટરવ્યુઅર",
    pdfSummarizer: "PDF સારાંશ",
    flashcards: "ફ્લેશકાર્ડ્સ",
    adaptiveQuiz: "અડેપ્ટિવ ક્વિઝ",
    diagramExplainer: "ડાયાગ્રામ સમજૂતી",
    mindMaps: "D3 માઇન્ડ મેપ્સ",
    historyLogs: "પ્રવૃત્તિ ઇતિહાસ",
    languageLabel: "ભાષા",
    readingErgonomics: "વાંચન સુગમતા",
    bionicReading: "બાયોનિક રીડિંગ",
    bionicSub: "ધ્યાન કેન્દ્રિત કરવા અક્ષરો બોલ્ડ કરે છે",
    openDyslexic: "ઓપન-ડિસ્લેક્સિક ફોન્ટ",
    openDyslexicSub: "ડિસ્લેક્સિયા અનુકૂળ ફોન્ટ",
    speechRate: "અવાજની ગતિ",
    greetingPrompt: '"નમસ્તે! આજે આપણે શું શીખીશું?"',
    micSubtitle: "બોલવા માટે માઇક દબાવો. વિજ્ઞાન કે ઇતિહાસના અઘરા વિષયો તમારી દેશી ભાષામાં સમજાવીશ.",
    tapToSpeak: "બોલવા માટે માઇક દબાવો...",
    listening: "સાંભળી રહ્યો છું...",
    processingVoice: "પ્રોસેસિંગ ચાલુ છે...",
    speaking: "ઑડિયો પ્લે થાય છે...",
    bionicActiveTag: "બાયોનિક રીડિંગ ચાલુ",
    rewordTag: "સરળ શબ્દોમાં",
    diagramTitle: "ડાયાગ્રામ સમજૂતી",
    diagramAnalysis: "વિશ્લેષણ: આ આકૃતિ જળચક્ર દર્શાવે છે. ઑડિયો સાંભળવા ટૅપ કરો.",
    mockInterviewTitle: "મોક ઇન્ટરવ્યુ",
    mockPrompt: "તમારો પરિચય આપો અને તમારા પ્રોજેક્ટ્સ વિશે જણાવો.",
    mockUserReply: "મારું નામ રાહુલ છે અને હું સોફ્ટવેર ડેવલપર છું...",
    feedbackLabel: "પ્રતિસાદ",
    onlineLearning: "ઑનલાઇન શિક્ષણ",
    languagesSupported: "10 ભારતીય ભાષાઓમાં ઉપલબ્ધ",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI મોક ઇન્ટરવ્યુ સ્ટુડિયો",
    interviewSubheading: "લાઇવ વેબકેમ, માઇક, રિઝ્યુમ વિશ્લેષણ અને ક્રોસ-ક્વેશ્ચનિંગ",
    resumeUploadTitle: "ઉમેદવાર રિઝ્યુમ વિશ્લેષણ",
    resumeUploadPrompt: "તમારું રિઝ્યુમ (PDF / Word) અપલોડ કરો",
    resumeUploadSub: "જેમિની તમારી કુશળતા ચકાસીને ખાસ પ્રશ્નો તૈયાર કરશે",
    targetRoleLabel: "લક્ષ્ય પદ",
    interviewTypeLabel: "ઇન્ટરવ્યુ પ્રકાર",
    startInterviewBtn: "લાઇવ ઇન્ટરવ્યુ શરૂ કરો",
    stopInterviewBtn: "ઇન્ટરવ્યુ સમાપ્ત કરો",
    camOn: "કેમેરા ચાલુ",
    camOff: "કેમેરા બંધ",
    micOn: "માઇક ચાલુ",
    micMute: "માઇક બંધ",
    yourAnswerLabel: "તમારો જવાબ",
    speakOrTypeAnswer: "માઇકમાં બોલો અથવા અહીં જવાબ લખો...",
    submitAnswerBtn: "જવાબ સબમિટ કરો અને ફીડબેક મેળવો",
    crossQuestionBadge: "ઇન્ટરવ્યુઅરનો ક્રોસ-ક્વેશ્ચન",
    evaluatingAnswer: "જવાબનું વિશ્લેષણ થઈ રહ્યું છે...",
    overallScore: "કુલ સ્કોર",
    technicalScore: "તકનીકી ઊંડાણ",
    confidenceScore: "આત્મવિશ્વાસ",
    clarityScore: "સ્પષ્ટતા",
    strengthsLabel: "મજબૂત પાસાં",
    areasToImproveLabel: "સુધારવાના ક્ષેત્રો",
    nextQuestionBtn: "આગલા પ્રશ્નનો ઉત્તર આપો",
    finishInterviewBtn: "ઇન્ટરવ્યુ પૂર્ણ કરો",
    signInWithGoogle: "ગૂગલથી સાઇન ઇન કરો",
    signOut: "સાઇન આઉટ કરો",
    voiceCommands: "વોઇસ કમાન્ડ",
    cloudSync: "ક્લાઉડ સિંક"
  },

  "hi-awadhi": {
    appName: "शिक्षासाथी AI",
    learningTools: "सीखै के औजार",
    voiceAiChat: "आवाज से AI बातચીત",
    mockInterviewer: "मॉक इंटरव्यू (Viva)",
    pdfSummarizer: "PDF सार संक्षेप",
    flashcards: "फ्लैशकार्ड्स",
    adaptiveQuiz: "अडैप्टिव क्विज",
    diagramExplainer: "चित्र समझइया",
    mindMaps: "D3 माइंड मैप्स",
    historyLogs: "कामकाज इतिहास",
    languageLabel: "भाषा",
    readingErgonomics: "पढ़े के सुगमता",
    bionicReading: "बायोनिक रीडिंग",
    bionicSub: "आंखिन के ध्यान टिकावै खातिर अच्छर गाढ़ा करैला",
    openDyslexic: "ओपन-डिस्लेक्सिक फॉन्ट",
    openDyslexicSub: "डिस्लेक्सिया अनुकूल फॉन्ट",
    speechRate: "ध्वनि गति",
    greetingPrompt: '"प्रणाम! आज का सीखब?"',
    micSubtitle: "बोलै खातिर माइक छुवौ। हम कउनो कठिन बात राउर आपन अवधी में समझाए देब।",
    tapToSpeak: "माइक दबाके बोलौ...",
    listening: "सुनत हन...",
    processingVoice: "सोचत हन...",
    speaking: "ऑडियो बोलत बा...",
    bionicActiveTag: "बायोनिक रीडिंग चालू बा",
    rewordTag: "सीधे साधे शब्द में",
    diagramTitle: "चित्र समझइया",
    diagramAnalysis: "जांच: ई चित्र जल चक्र देखावत है। बोले खातिर छूईं।",
    mockInterviewTitle: "मॉक इंटरव्यू",
    mockPrompt: "आपन परिचय देव अउर प्रोजेक्ट्स के बारे में बताव।",
    mockUserReply: "हमार नाम राहुल आय, हम सॉफ्टवेयर बनाइत हन...",
    feedbackLabel: "फीडबैक",
    onlineLearning: "ऑनलाइन शिक्षा",
    languagesSupported: "10 भारतीय भाषन में",
    poweredBy: "Powered by Code Crushers",

    interviewHeading: "AI मॉक इंटरव्यू अउर मौखिक परीक्षा",
    interviewSubheading: "लाइव वेबकैम, माइक, रिज्यूमे जांच अउर गहरा सवाल",
    resumeUploadTitle: "रिज्यूमे अपलोड करौ",
    resumeUploadPrompt: "आपन रिज्यूमे (PDF / Word) अपलोड करौ",
    resumeUploadSub: "जेमिनी राउर प्रोजेक्ट देखके सीधे सवाल पूछिहै",
    targetRoleLabel: "टारगेट पद",
    interviewTypeLabel: "इंटरव्यू प्रकार",
    startInterviewBtn: "लाइव इंटरव्यू शुरू करौ",
    stopInterviewBtn: "इंटरव्यू समाप्त करौ",
    camOn: "कैमरा चालू",
    camOff: "कैमरा बंद",
    micOn: "माइक चालू",
    micMute: "माइक बंद",
    yourAnswerLabel: "राउर उत्तर",
    speakOrTypeAnswer: "माइक में बोलौ या इहाँ टाइप करौ...",
    submitAnswerBtn: "उत्तर भेजौ अउर फीडबैक पाव",
    crossQuestionBadge: "गहराई से क्रॉस-प्रश्न",
    evaluatingAnswer: "उत्तर जांचल जात बा...",
    overallScore: "कुल स्कोर",
    technicalScore: "तकनीकी गहराई",
    confidenceScore: "आत्मविश्वास",
    clarityScore: "स्पष्टता",
    strengthsLabel: "मजबूत पक्ष",
    areasToImproveLabel: "सुधार के सलाह",
    nextQuestionBtn: "अगिला सवाल के जवाब देव",
    finishInterviewBtn: "इंटरव्यू पूरा करौ",
    signInWithGoogle: "गूगल से साइन इन करौ",
    signOut: "साइन आउट करौ",
    voiceCommands: "आवाज़ आदेश",
    cloudSync: "क्लाउड सिंक"
  }
};

export function getTranslations(langCode: string): TranslationStrings {
  if (!langCode) return TRANSLATIONS["en"];

  // Exact match
  if (TRANSLATIONS[langCode]) {
    return TRANSLATIONS[langCode];
  }

  // Dialect / Language prefix matching
  const normalized = langCode.toLowerCase();
  if (normalized.startsWith("hi-awadhi")) return TRANSLATIONS["hi-awadhi"];
  if (normalized.startsWith("hi-standard")) return TRANSLATIONS["hi-standard"];
  if (normalized.startsWith("hi")) return TRANSLATIONS["hi-bhojpuri"];
  if (normalized.startsWith("mr")) return TRANSLATIONS["mr-varhadi"];
  if (normalized.startsWith("bn")) return TRANSLATIONS["bn-rarh"];
  if (normalized.startsWith("ta")) return TRANSLATIONS["ta-madurai"];
  if (normalized.startsWith("te")) return TRANSLATIONS["te-telangana"];
  if (normalized.startsWith("gu")) return TRANSLATIONS["gu-kathiyawadi"];
  if (normalized.startsWith("es")) return TRANSLATIONS["es"];

  return TRANSLATIONS["en"];
}

export function getTypewriterPrompts(langCodeOrId?: string): string[] {
  const norm = (langCodeOrId || '').toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return [
      "माइक छुईं आ बोलल शुरू करीं। हम रउआ के अपनी गँवई भाखा में समझाइब।",
      "हमरा से कवनो कठिन विज्ञान, गणित भा इतिहास के सवाल पूछल जा सकेला।",
      "मॉक इंटरव्यू के तैयारी खातिर आपन रिज्यूमे अपलोड करीं आ सवाल पूछीं।",
      "चित्र या पीडीएफ अपलोड करीं, हम एक-एक बात खोल के समझाइब।"
    ];
  }

  if (norm.startsWith('hi-awadhi')) {
    return [
      "माइक दबाई के बोलौ। हम अवधी मा सारा पाठ समझा देब।",
      "कठिन से कठिन सवाल पूछीं, हम सरल उदाहरण से बतावब।",
      "मॉक इंटरव्यू अउर रिज्यूमे के तैयारी करै खातिर हमसे बात करौ।",
      "कवनो चित्र या पीडीएफ देव, हम पूरा सारांश निकाल देब।"
    ];
  }

  if (norm.startsWith('hi-standard') || norm.startsWith('hi')) {
    return [
      "बोलने के लिए माइक टैप करें। मैं आपकी भाषा में कठिन विषय समझाऊंगा।",
      "मुझसे विज्ञान, गणित या किसी भी विषय पर अपने प्रश्न पूछें।",
      "मॉक इंटरव्यू का अभ्यास करें और अपने रिज्यूमे पर क्रॉस-क्वेश्चन पाएं।",
      "कोई भी चित्र या पीडीएफ अपलोड करें, मैं विस्तार से समझाऊंगा।"
    ];
  }

  if (norm.startsWith('mr')) {
    return [
      "माइकवर टॅप करा आणि बोला. मी तुमच्या भाषेत सर्व समजवून सांगेन.",
      "विज्ञान आणि गणितातील कठीण संकल्पना मला विचारा.",
      "मॉक इंटरव्यूचा सराव करा आणि तुमच्या कौशल्यांची चाचणी घ्या.",
      "कोणतीही आकृती किंवा पीडीएफ अपलोड करा, मी सोप्या भाषेत सांगेन."
    ];
  }

  if (norm.startsWith('bn')) {
    return [
      "কথা বলতে মাইকে চাপ দিন। আমি আপনার নিজের ভাষায় জটিল বিষয় বোঝাব।",
      "বিজ্ঞান বা অঙ্কের যেকোনো কঠিন প্রশ্ন আমাকে স্বচ্ছন্দে জিজ্ঞাসা করুন।",
      "মক ইন্টারভিউ অনুশীলন করুন এবং আপনার রেজ্যুমে অনুসারে প্রশ্ন পান।",
      "যেকোনো ছবি বা পিডিএফ আপলোড করুন, আমি বিশ্লেষণ করে দেব।"
    ];
  }

  if (norm.startsWith('ta')) {
    return [
      "பேச மைக் பட்டனை அழுத்தவும். உங்கள் சொந்த மொழியில் விளக்குகிறேன்.",
      "கடினமான அறிவியல் மற்றும் கணிதக் கருத்துக்களை என்னிடம் கேளுங்கள்.",
      "போலி நேர்காணல் பயிற்சி செய்து உங்கள் திறமைகளை சோதிக்கவும்.",
      "வரைபடம் அல்லது பிடிஎஃப் பதிவேற்றி தெளிவான விளக்கம் பெறுங்கள்."
    ];
  }

  if (norm.startsWith('te')) {
    return [
      "మాట్లాడటానికి మైక్ నొక్కండి. మీ స్వంత భాషలో వివరిస్తాను.",
      "కష్టమైన సైన్స్ మరియు గణిత భావనలను నన్ను అడగండి.",
      "మాక్ ఇంటర్వ్యూ ప్రాక్టీస్ చేయండి మరియు ప్రశ్నలను ఎదుర్కోండి.",
      "రేఖాచిత్రం లేదా పిడిఎఫ్ అప్‌లోడ్ చేయండి, వివరంగా వివరిస్తాను."
    ];
  }

  if (norm.startsWith('gu')) {
    return [
      "બોલવા માટે માઇક દબાવો. હું તમારી ભાષામાં સરળતાથી સમજાવીશ.",
      "વિજ્ઞાન અને ગણિતના અઘરા સવાલો મને પૂછો.",
      "મોક ઇન્ટરવ્યુની તૈયારી કરો અને તમારા રેઝ્યૂમે પર સવાલ મેળવો.",
      "કોઈપણ આકૃતિ અથવા પીડીએફ અપલોડ કરો, હું સમજાવીશ."
    ];
  }

  if (norm.startsWith('es')) {
    return [
      "Toca el micrófono para hablar. Puedo explicar conceptos en tu idioma.",
      "Pregúntame cualquier duda sobre ciencia, matemáticas o historia.",
      "Practica entrevistas simuladas basadas en tu currículum.",
      "Sube un diagrama o PDF y te lo explicaré paso a paso."
    ];
  }

  return [
    "Tap to speak. I can explain complex science concepts in your language.",
    "Tap to speak. Let's practice cross-questioning for your mock interview.",
    "Tap to speak. Upload a diagram and I will break it down for you.",
    "Tap to speak. Summarize any PDF or generate interactive flashcards."
  ];
}

export function getSidebarTypewriterPrompts(langCodeOrId?: string): string[] {
  const norm = (langCodeOrId || '').toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return [
      '"प्रकाश संश्लेषण कइसे काम करेला समझाईं..."',
      '"माइटोसिस आ मियोसिस में का अंतर बा?"',
      '"हमार रिएक्ट रिज्यूमे देख के इंटरव्यू सवाल पूछीं..."',
      '"ई पीडीएफ के मुख्य बात हमनी के समझाईं..."'
    ];
  }

  if (norm.startsWith('hi-awadhi')) {
    return [
      '"प्रकाश संश्लेषण का होत है, विस्तार से बताव..."',
      '"माइटोसिस अउर मियोसिस मा का भेद है?"',
      '"हमार रिज्यूमे देख के साक्षात्कार के सवाल पूछीं..."',
      '"पीडीएफ फाइल मा लिखल मुख्य बात बताव..."'
    ];
  }

  if (norm.startsWith('hi-standard') || norm.startsWith('hi')) {
    return [
      '"डिस्ट्रिब्यूटेड कैशिंग कैसे काम करता है समझाइए..."',
      '"माइटोसिस और मियोसिस में क्या अंतर है?"',
      '"मेरे रिएक्ट रिज्यूमे के आधार पर साक्षात्कार प्रश्न पूछें..."',
      '"अपलोड किए गए पीडीएफ के मुख्य बिंदुओं का सारांश दें..."'
    ];
  }

  if (norm.startsWith('mr')) {
    return [
      '"डिस्ट्रिब्युटेड कॅशिंग कसे कार्य करते ते सांगा..."',
      '"माइटोसिस आणि मियोसिस मधील फरक काय आहे?"',
      '"माझ्या रिझ्युमेवर आधारित मुलाखतीचे प्रश्न विचारा..."',
      '"अपलोड केलेल्या पीडीएफचा सारांश द्या..."'
    ];
  }

  if (norm.startsWith('bn')) {
    return [
      '"ডিস্ট্রিবিউটেড ক্যাশিং কীভাবে কাজ করে বুঝিয়ে বলুন..."',
      '"মাইটোসিস এবং মিয়োসিসের মধ্যে পার্থক্য কী?"',
      '"আমার রিঅ্যাক্ট রেজ্যুমে দেখে ইন্টারভিউ প্রশ্ন জিজ্ঞাসা করুন..."',
      '"আপলোড করা পিডিএফ-এর মূল বিষয়বস্তু সংক্ষেপ করুন..."'
    ];
  }

  if (norm.startsWith('ta')) {
    return [
      '"விநியோகிக்கப்பட்ட கேச்சிங் எவ்வாறு செயல்படுகிறது என விளக்கவும்..."',
      '"மைட்டோசிஸ் மற்றும் மியோசிஸ் இடையே உள்ள வேறுபாடு என்ன?"',
      '"எனது ரெஸ்யூம் அடிப்படையில் நேர்காணல் கேள்விகளைக் கேளுங்கள்..."',
      '"பதிவேற்றிய பிடிஎஃப் கோப்பின் முக்கிய கருத்துக்களை சுருக்கவும்..."'
    ];
  }

  if (norm.startsWith('te')) {
    return [
      '"డిస్ట్రిబ్యూటెడ్ కాషింగ్ ఎలా పనిచేస్తుందో వివరించండి..."',
      '"మైటోసిస్ మరియు మియోసిస్ మధ్య తేడా ఏమిటి?"',
      '"నా రెజ్యూమ్ ఆధారంగా ఇంటర్వ్యూ ప్రశ్నలు అడగండి..."',
      '"అప్‌లోడ్ చేసిన పిడిఎఫ్ సారాంశాన్ని అందించండి..."'
    ];
  }

  if (norm.startsWith('gu')) {
    return [
      '"ડિસ્ટ્રિબ્યુટેડ કેશિંગ કેવી રીતે કામ કરે છે તે સમજાવો..."',
      '"માઇટોસિસ અને મિઓસિસ વચ્ચે શું તફાવત છે?"',
      '"મારા રેઝ્યૂમે આધારિત ઇન્ટરવ્યુના સવાલો પૂછો..."',
      '"અપલોડ કરેલી પીડીએફના મુખ્ય મુદ્દાઓનો સારાંશ આપો..."'
    ];
  }

  if (norm.startsWith('es')) {
    return [
      '"Explica cómo funciona el almacenamiento en caché distribuido..."',
      '"¿Cuál es la diferencia entre mitosis y meiosis?"',
      '"Hazme preguntas de entrevista basadas en mi currículum de React..."',
      '"Resume los puntos clave del PDF subido..."'
    ];
  }

  return [
    '"Explain how distributed caching works..."',
    '"What is the difference between mitosis and meiosis?"',
    '"Ask me interview questions based on my React resume..."',
    '"Summarize the key points of the uploaded PDF..."'
  ];
}
