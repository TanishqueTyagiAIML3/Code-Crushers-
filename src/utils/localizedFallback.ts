/**
 * Pedagogical localized doubt solver fallbacks across all 10 supported regional languages and dialects.
 * Used whenever network is offline or API server is unavailable.
 */

export interface LocalizedFallback {
  headline: string;
  corePrincipleLabel: string;
  corePrincipleText: string;
  stepsLabel: string;
  steps: string[];
  closing: string;
}

export function getLocalizedDoubtExplanation(topic: string, languageIdOrName: string = 'hi-bhojpuri'): string {
  const cleanTopic = topic.trim() || 'Concept';
  const langKey = (languageIdOrName || '').toLowerCase();

  // 1. Spanish
  if (langKey.includes('spanish') || langKey.includes('español') || langKey === 'es' || langKey.includes('es-es')) {
    return `🌱 **${cleanTopic}** explicado de manera sencilla y clara:

Este es un concepto fundamental en el aprendizaje.

💡 **Puntos Clave**:
• 1. **Inicio**: El proceso comienza con una fuente de energía o impulso básico.
• 2. **Transformación**: Los componentes interactúan entre sí y generan un cambio continuo.
• 3. **Equilibrio**: Al completarse el ciclo, el sistema alcanza estabilidad natural.

¡Si tienes alguna otra duda o pregunta, dime con total confianza!`;
  }

  // 2. English
  if (langKey.includes('english') || langKey === 'en' || langKey.includes('en-us') || langKey.includes('global')) {
    return `🌱 Understanding **"${cleanTopic}"** with simple cognitive steps:

This is a core scientific and academic principle.

💡 **Key Takeaways**:
• 1. **Core Trigger**: Everything starts with an input or energy catalyst.
• 2. **Active Interaction**: The underlying elements collaborate and shift states.
• 3. **Natural Balance**: The sequence resolves by sustaining balance and harmony.

Feel free to ask any follow-up questions!`;
  }

  // 3. Marathi (Varhadi / Vidarbha)
  if (langKey.includes('marathi') || langKey.includes('varhadi') || langKey.includes('mr')) {
    return `आरं गड्या! **"${cleanTopic}"** ही संकल्पना एकदम सोप्या आणि रंजक भाषेत समजून घेऊया:

हा एक निसर्गाचा आणि विज्ञानाचा खूप महत्त्वाचा नियम आहे.

💡 **महत्त्वाचे सोपे टप्पे**:
• १. **सुरुवात**: ऊर्जेचा वापर करून ही प्रक्रिया गतीने सुरू होते.
• २. **बदल**: घटक एकमेकांसोबत मिळून स्वरूप बदलतात.
• ३. **समतोल**: शेवटी संपूर्ण चक्राचा समतोल व्यवस्थित राखला जातो.

तुले अजून काही विचारचं असंल तं बेधडक विचार!`;
  }

  // 4. Bengali (Bangla)
  if (langKey.includes('bengali') || langKey.includes('bangla') || langKey.includes('bn') || langKey.includes('rarh')) {
    return `নমস্কার! আসুন **"${cleanTopic}"** বিষয়টি একদম সহজ ও প্রাঞ্জল ভাষায় বুঝে নিই:

এটি একটি অত্যন্ত প্রয়োজনীয় এবং চমকপ্রদ শিক্ষণীয় বিষয়।

💡 **সহজ ধাপসমূহ**:
• ১. **শুরুর কথা**: শক্তির সঠিক সংযোগে মূল প্রক্রিয়াটি শুরু হয়।
• ২. **রূপান্তর**: উপাদানগুলি পরস্পরের সাথে মিলিত হয়ে রূপ পরিবর্তন করে।
• ৩. **ভারসাম্য**: এই চমৎকার চক্রটি প্রকৃতির স্বাভাবিক ভারসাম্য বজায় রাখে।

আপনার মনে আরও কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞাসা করুন!`;
  }

  // 5. Tamil (Madurai / Chennai)
  if (langKey.includes('tamil') || langKey.includes('ta') || langKey.includes('madurai')) {
    return `வணக்கம் தம்பி! **"${cleanTopic}"** என்பதை மிக எளிய நடையில் தெளிவாகப் புரிந்து கொள்வோம்:

இது இயற்கையின் மிக முக்கியமான அறிவியல் கோட்பாடு.

💡 **முக்கிய குறிப்புகள்**:
• 1. **ஆரம்பம்**: ஆற்றல் துணையோடு முழு செயல்முறையும் தொடங்குகிறது.
• 2. **செயல்பாடு**: மூலக்கூறுகள் ஒன்றிணைந்து சீரான மாற்றத்தை உருவாக்குகின்றன.
• 3. **இயற்கை சமநிலை**: சுழற்சி நிறைவடைந்து சரியான சமநிலையை உறுதி செய்கிறது.

வேறு ஏதேனும் சந்தேகம் இருந்தால் தயங்காமல் கேளுங்கள்!`;
  }

  // 6. Telugu (Telangana / AP)
  if (langKey.includes('telugu') || langKey.includes('te') || langKey.includes('telangana')) {
    return `నమస్కారం! **"${cleanTopic}"** గురించి మనసుకు హత్తుకునేలా సులభంగా అర్థం చేసుకుందాం:

ఇది ప్రకృతిలోని అత్యంత ముఖ్యమైన విజ్ఞాన శాస్త్ర సూత్రం.

💡 **ముఖ్యమైన దశలు**:
• 1. **ఆరంభం**: శక్తి సమక్షంలో ప్రక్రియ ఉత్సాహంగా మొదలవుతుంది.
• 2. **మార్పు**: వివిధ భాగాలు కలసికట్టుగా రూపంలో మార్పును తెస్తాయి.
• 3. **సమతుల్యత**: ఈ నిరంతర చలనం ద్వారా ప్రకృతి సమతుల్యత కాపాడబడుతుంది.

ఇంకా ఏమైనా సందేహాలు ఉంటే వెంటనే అడగండి!`;
  }

  // 7. Gujarati (Kathiyawadi)
  if (langKey.includes('gujarat') || langKey.includes('gu') || langKey.includes('kathiyawadi')) {
    return `અરે વાલા મિત્ર! **"${cleanTopic}"** વિશે એકદમ દેશી અને સરળ શબ્દોમાં સમજીએ:

આ કુદરતનો અને વિજ્ઞાનનો એક સુંદર અને પાયાનો નિયમ છે.

💡 **સરળ મુદ્દા**:
• ૧. **શરૂઆત**: યોગ્ય ઊર્જા મળતાં જ આખી પ્રક્રિયા વેગ પકડે છે.
• ૨. **પરિવર્તન**: બધા ઘટકો એકબીજા સાથે જોડાઈને નવું રૂપ આપે છે.
• ૩. **સંતુલન**: છેલ્લે કુદરતનું સંતુલન એકદમ વ્યવસ્થિત જળવાઈ રહે છે.

કંઈ પણ ન સમજાયું હોય તો ખુશીથી ફરી પૂછી લો!`;
  }

  // 8. Bhojpuri (Hindi)
  if (langKey.includes('bhojpuri')) {
    return `अरे बचवा! **"${cleanTopic}"** के एकदम सहज गँवई भाखा में समझल जाव:

ई बहुत जरूरी आ रोचक वैज्ञानिक बात हटे।

💡 **सहज नियम**:
• १. **सुरुआत**: ऊर्जा मिलला पर क्रिया चालू हो जाला।
• २. **बदलाव**: सब घटक मिलजुल के आपन रूप बदल लेलें।
• ३. **संतुलन**: अंत में प्रकृति के संतुलन सुचारू रूप से बनल रहेला।

कवनो अउर शंका मन में होखे त तुरंत पूछीं!`;
  }

  // 9. Awadhi (Hindi)
  if (langKey.includes('awadhi')) {
    return `अरे भैया सुनौ! **"${cleanTopic}"** का एकदम सरल गँवई ढंग से समझत हैं:

ई बहुत नीक अउर जरूरी बात आय।

💡 **खास बातन**:
• १. **सुरुआत**: सूरज अउर ऊर्जा के सहारे प्रक्रिया चलत है।
• २. **फेरबदल**: घटक मिलके नया रूप धरि लेत हैं।
• ३. **संतुलन**: अंत में सब संतुलन बनल रहत है।

कौनो संशय होय त निसंकोच पूछी लेव!`;
  }

  // 10. Standard Hindi / Default
  return `नमस्ते! **"${cleanTopic}"** के बारे में सरल व सहज व्याख्या:

यह एक अत्यंत महत्वपूर्ण शैक्षणिक व वैज्ञानिक अवधारणा है।

💡 **मुख्य बिंदु**:
• १. **प्रारंभ**: प्राकृतिक ऊर्जा व नियमों के आधार पर प्रक्रिया आरंभ होती है।
• २. **क्रिया**: विभिन्न घटक आपस में परस्पर क्रिया करके स्वरूप बदलते हैं।
• ३. **संतुलन**: इस निरंतर चक्र से प्रकृति का संतुलन बना रहता है।

यदि आपके मन में कोई भी अतिरिक्त संशय हो, तो अवश्य पूछें!`;
}
