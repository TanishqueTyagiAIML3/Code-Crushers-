import { DialectOption } from '../types';

export const INDIAN_LANGUAGES: DialectOption[] = [
  {
    id: 'hi-bhojpuri',
    name: 'Bhojpuri (Hindi)',
    nativeName: 'भोजपुरी',
    language: 'Hindi',
    region: 'Bihar & Purvanchal (UP)',
    code: 'hi-IN',
    sampleQuery: 'सर जी, गुरुत्वाकर्षण (Gravity) कइसे काम करेला? ई काहे जरूरी बा?',
    sampleResponse: 'अरे बचवा! जब तूं आम के गाछ से आम गिरत देखऽ तारऽ, त ऊ नीचे काहे गिरेला? काहे कि हमनी के धरती में एगो खिंचाव बा, ओकरा के गुरुत्वाकर्षण कहल जाला।',
    audioSampleDescription: 'Energetic Purvanchali dialect with natural relatable analogies',
    accentNote: 'Rhythmic, expressive, familiar village examples'
  },
  {
    id: 'hi-awadhi',
    name: 'Awadhi (Hindi)',
    nativeName: 'अवधी',
    language: 'Hindi',
    region: 'Eastern Uttar Pradesh & Central UP',
    code: 'hi-IN',
    sampleQuery: 'गुरुजी, प्रकाश संश्लेषण (Photosynthesis) का होत है? हमार गँवई भाषा में समझाई देव।',
    sampleResponse: 'अरे भैया, सुनौ! जइसे माई चूल्हा पर खाना बनावति हैं, वइसे ही पेड़-पौधा सूरज के धूप, पानी अउर हवा से आपन भोजन तैयार करत हैं। यही क्रिया प्रकाश संश्लेषण कहात है।',
    audioSampleDescription: 'Warm rural Awadhi conversational cadence with folk idioms',
    accentNote: 'Soft rural cadence, friendly colloquial metaphors'
  },
  {
    id: 'hi-standard',
    name: 'Standard Hindi',
    nativeName: 'मानक हिन्दी',
    language: 'Hindi',
    region: 'North & Central India',
    code: 'hi-IN',
    sampleQuery: 'कृत्रिम बुद्धिमत्ता (Artificial Intelligence) कैसे काम करती है?',
    sampleResponse: 'नमस्ते! जैसे हम अनुभव और पढ़ाई से सीखते हैं, वैसे ही कंप्यूटर विशाल डेटा और गणितीय पैटर्न्स से सीखकर सटीक निर्णय लेता है।',
    audioSampleDescription: 'Clear, polite standard Hindi',
    accentNote: 'Neutral, academic and clear'
  },
  {
    id: 'mr-varhadi',
    name: 'Varhadi (Marathi)',
    nativeName: 'वऱ्हाडी (मराठी)',
    language: 'Marathi',
    region: 'Vidarbha, Maharashtra',
    code: 'mr-IN',
    sampleQuery: 'गुरुजी, विद्युत धारा (Electric Current) म्हणजे काय असतं रे?',
    sampleResponse: 'आरं गड्या! जसं पाईपमधून पाणी जोरात वाहते, तसंच तारेमधून बारीक इलेक्ट्रॉन धावतात. त्या वाहणाऱ्या प्रवाहालेच आपण विद्युत धारा म्हणतो!',
    audioSampleDescription: 'Authentic Vidarbha dialect with warm encouraging tone',
    accentNote: 'Colloquial Vidarbha nuances and conversational warmth'
  },
  {
    id: 'bn-rarh',
    name: 'Bengali (Bangla)',
    nativeName: 'বাংলা',
    language: 'Bengali',
    region: 'West Bengal & Tripura',
    code: 'bn-IN',
    sampleQuery: 'দাদা, সৌরজগতের গ্রহগুলো সূর্যের চারপাশে কীভাবে ঘোরে?',
    sampleResponse: 'শোনো ভাই, যেমন নাটাই দিয়ে লাটিম ঘোরালে দড়ি ধরে রাখে, ঠিক তেমনি সূর্যের তীব্র মহাকর্ষ বল সব গ্রহকে নিজের কক্ষপথে বেঁধে রাখে।',
    audioSampleDescription: 'Melodious standard/regional Bangla conversational explanation',
    accentNote: 'Sweet, engaging pedagogical tone'
  },
  {
    id: 'ta-madurai',
    name: 'Tamil (Madurai/Chennai)',
    nativeName: 'தமிழ்',
    language: 'Tamil',
    region: 'Tamil Nadu',
    code: 'ta-IN',
    sampleQuery: 'சார், ரத்த ஓட்ட மண்டலம் (Circulatory System) எப்படி வேலை செய்யுது?',
    sampleResponse: 'தம்பி, நம்ம வீட்டு வாட்டர் மோட்டார் மாதிரி தான் இதயம்! அது சுத்த ரத்தத்தை உடல் முழுக்க தள்ளி, அழுக்கு ரத்தத்தை நுரையீரலுக்கு அனுப்பி சுத்தம் செய்யுது.',
    audioSampleDescription: 'Vibrant conversational Tamil with real-world motor pump analogy',
    accentNote: 'Direct, clear, practical analogy based'
  },
  {
    id: 'te-telangana',
    name: 'Telugu (Telangana/AP)',
    nativeName: 'తెలుగు',
    language: 'Telugu',
    region: 'Telangana & Andhra Pradesh',
    code: 'te-IN',
    sampleQuery: 'గురువుగారూ, జీర్ణక్రియ (Digestion) ఎలా జరుగుతుందో తేలికగా చెప్పండి?',
    sampleResponse: 'చూడండి బాబు! మనం తిన్న అన్నం చిన్న చిన్న ముక్కలై, కడుపులోని రసాయనాలతో కలిసి శరీరానికి శక్తిగా ఎలా మారుతుందో, అదే జీర్ణక్రియ.',
    audioSampleDescription: 'Friendly, encouraging Telugu explanation',
    accentNote: 'Expressive local idiom'
  },
  {
    id: 'gu-kathiyawadi',
    name: 'Gujarati (Kathiyawadi)',
    nativeName: 'ગુજરાતી',
    language: 'Gujarati',
    region: 'Saurashtra & Gujarat',
    code: 'gu-IN',
    sampleQuery: 'મોટાભાઈ, ઓક્સિજન અને કાર્બન ડાયોક્સાઇડનું ચક્ર કેવું હોય?',
    sampleResponse: 'અરે વાલા! આપણે શ્વાસમાં ઓક્સિજન લઈએ અને કાર્બન ડાયોક્સાઇડ બહાર કાઢીએ, અને ઝાડવા એને લઈને પાછો ચોખ્ખો ઓક્સિજન આપે. આ જ કુદરતની ભાગીદારી!',
    audioSampleDescription: 'Warm Kathiyawadi friendly pedagogical explanation',
    accentNote: 'Affectionate, vivid partnership analogy'
  },
  {
    id: 'es',
    name: 'Spanish (Español)',
    nativeName: 'Español',
    language: 'Spanish',
    region: 'Global / Latin America & Spain',
    code: 'es-ES',
    sampleQuery: '¿Cómo funciona la fotosíntesis y por qué es vital para el planeta?',
    sampleResponse: '¡Hola! Es como una cocina solar: las plantas atrapan la luz solar, agua y dióxido de carbono para producir glucosa y liberar oxígeno puro.',
    audioSampleDescription: 'Warm Spanish conversational explanation',
    accentNote: 'Clear, engaging international Spanish'
  },
  {
    id: 'en',
    name: 'English (Global)',
    nativeName: 'English',
    language: 'English',
    region: 'Global / International',
    code: 'en-US',
    sampleQuery: 'Explain how distributed caching and consensus algorithms work.',
    sampleResponse: 'Think of distributed caching as a local pantry that saves you from driving to the central warehouse every time you need an ingredient.',
    audioSampleDescription: 'Clear, modern professional English',
    accentNote: 'Neutral international standard'
  }
];

export const MAP_REGIONS = [
  { id: 'north', name: 'North India', dialects: ['Awadhi', 'Bhojpuri', 'Braj', 'Maithili', 'Kashmiri'], coords: 'M 140,40 L 190,50 L 210,100 L 160,110 Z', color: '#f59e0b' },
  { id: 'west', name: 'Western India', dialects: ['Varhadi', 'Puneri Marathi', 'Kathiyawadi', 'Konkani'], coords: 'M 90,120 L 140,120 L 130,190 L 80,180 Z', color: '#10b981' },
  { id: 'south', name: 'South India', dialects: ['Madurai Tamil', 'Telangana Telugu', 'Kannada', 'Malayalam'], coords: 'M 110,200 L 170,200 L 140,280 L 110,250 Z', color: '#6366f1' },
  { id: 'east', name: 'East & North-East', dialects: ['Rarh Bangla', 'Odia', 'Assamese', 'Bodo', 'Santali'], coords: 'M 210,90 L 290,90 L 260,160 L 200,150 Z', color: '#ec4899' },
];
