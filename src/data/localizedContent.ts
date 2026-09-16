import { MindMapNode, QuizQuestion, Flashcard, DiagramAnalysis } from '../types';

/**
 * ============================================================================
 * 1. LOCALIZED MIND MAPS (Hierarchy & Nodes)
 * ============================================================================
 */
const MINDMAPS: Record<string, MindMapNode> = {
  'hi-bhojpuri': {
    id: 'root-bhojpuri',
    label: 'प्रकाश संश्लेषण क्रिया (Photosynthesis)',
    description: 'सूरज के घाम से पौधा कइसे आपन भोजन आ ऑक्सीजन बनावेला ओकर पूरा चक्र।',
    category: 'मुख्य प्रणाली',
    children: [
      {
        id: 'light-dep',
        label: 'प्रकाश-निर्भर चरण (घाम वाला हिस्सा)',
        description: 'क्लोरोप्लास्ट के थाइलाकॉइड में सूरज के रोशनी से ऊर्जा बनेला।',
        category: 'चरण १',
        children: [
          { id: 'ps2', label: 'फोटोसिस्टम २ (P680)', description: '६८० एनएम रोशनी सोख के पानी के तोड़ेला।' },
          { id: 'photolysis', label: 'पानी के टूटन (Photolysis)', description: 'पानी टूट के हाइड्रोजन, इलेक्ट्रॉन आ ऑक्सीजन छोड़ेला।' },
          { id: 'etc', label: 'इलेक्ट्रॉन परिवहन शृंखला (ETC)', description: 'इलेक्ट्रॉन के बहाव से ATP ऊर्जा बनेला।' },
          { id: 'ps1', label: 'फोटोसिस्टम १ (P700)', description: 'NADP+ के NADPH में बदल के ऊर्जा जमा करेला।' }
        ]
      },
      {
        id: 'calvin',
        label: 'केल्विन चक्र (अप्रकाशिक चरण)',
        description: 'स्ट्रोमा द्रव में कार्बन सोख के चीनी (ग्लूकोज) बनावे के क्रिया।',
        category: 'चरण २',
        children: [
          { id: 'fixation', label: 'कार्बन स्थिरीकरण (RuBisCO)', description: 'रूबिस्को एंजाइम हवा के CO2 के बाँधेला।' },
          { id: 'reduction', label: '3-PGA अपचयन', description: 'ATP आ NADPH मिलके ऊर्जा से भोजन तैयार करेला।' },
          { id: 'glucose', label: 'ग्लूकोज आ स्टार्च निर्माण', description: 'पौधा आपन खाए वाला भोजन जमा करेला।' },
          { id: 'regen', label: 'RuBP चक्र पुनर्जनन', description: 'अगिला चक्र खातिर RuBP फेर से तैयार होला।' }
        ]
      },
      {
        id: 'factors',
        label: 'वातावरणीय सीमाकारी कारक',
        description: 'कवन-कवन चीज से भोजन बनावे के रफ़्तार रुके भा बढ़ेला।',
        category: 'नियंत्रण',
        children: [
          { id: 'light-intensity', label: 'धूप के तीव्रता', description: 'दुपहरिया में धूप ढेर भइला पर सेचुरेशन आवेला।' },
          { id: 'co2-conc', label: 'कार्बन डाइऑक्साइड मात्रा', description: 'हवा में CO2 कम भइला पर गति रुक जाला।' },
          { id: 'temp', label: 'तापमान संतुलन', description: '४० डिग्री से बेसी गरमी में एंजाइम खराब हो जाला।' }
        ]
      }
    ]
  },

  'hi-awadhi': {
    id: 'root-awadhi',
    label: 'प्रकाश संश्लेषण प्रक्रिया (Photosynthesis)',
    description: 'पेड़-पौधा सूरज के धूप, पानी अउर हवा से आपन भोजन कइसे तैयार करत हैं।',
    category: 'मुख्य प्रणाली',
    children: [
      {
        id: 'light-dep',
        label: 'धूप वाला प्रकाश चरण',
        description: 'थाइलाकॉइड झिल्ली में सूरज के रोशनी से ऊर्जा बनेला।',
        category: 'पहिला चरण',
        children: [
          { id: 'ps2', label: 'फोटोसिस्टम २', description: 'धूप के रोशनी सोख के पानी के तोड़ेला।' },
          { id: 'photolysis', label: 'पानी के विखंडन', description: 'पानी टूट के सांस लेवे खातिर ऑक्सीजन गैस छोड़ेला।' },
          { id: 'etc', label: 'इलेक्ट्रॉन प्रवाह शृंखला', description: 'ऊर्जावान इलेक्ट्रॉन से ATP ऊर्जा बनेला।' },
          { id: 'ps1', label: 'फोटोसिस्टम १', description: 'NADPH ऊर्जा संचय करेला।' }
        ]
      },
      {
        id: 'calvin',
        label: 'केल्विन चक्र (खाना बनावे के दौर)',
        description: 'स्ट्रोमा में बिना धूप के कार्बन सोख के मीठो ग्लूकोज बनावै के काम।',
        category: 'दूसर चरण',
        children: [
          { id: 'fixation', label: 'कार्बन जुड़ाव (RuBisCO)', description: 'रूबिस्को एंजाइम हवा के कार्बन डाइऑक्साइड बाँधत है।' },
          { id: 'reduction', label: 'ऊर्जा अपचयन', description: 'ATP ऊर्जा से खाद्य कण बनावत है।' },
          { id: 'glucose', label: 'ग्लूकोज संचय', description: 'पौधा आपन पोषण सुरक्षित राखत है।' }
        ]
      },
      {
        id: 'factors',
        label: 'मौसम अउर वातावरण के कारक',
        description: 'धूप, पानी अउर तापमान से गति कइसे प्रभावित होत है।',
        category: 'नियंत्रक',
        children: [
          { id: 'light-intensity', label: 'धूप के तेजी', description: 'उचित धूप से क्रिया तेज होत है।' },
          { id: 'co2-conc', label: 'हवा में CO2 के मात्रा', description: 'कार्बन के बिना भोजन ना बन पाई।' }
        ]
      }
    ]
  },

  'hi-standard': {
    id: 'root-hindi',
    label: 'प्रकाश संश्लेषण की क्रियाविधि (Photosynthesis)',
    description: 'सौर विकिरण ऊर्जा का रासायनिक शर्करा और ऑक्सीजन में जैविक रूपांतरण।',
    category: 'मूल तंत्र',
    children: [
      {
        id: 'light-dep',
        label: 'प्रकाश-निर्भर अभिक्रियाएं',
        description: 'क्लोरोप्लास्ट के थाइलाकॉइड झिल्लियों में सौर ऊर्जा का अवशोषण।',
        category: 'चरण १',
        children: [
          { id: 'ps2', label: 'फोटोसिस्टम II (P680)', description: 'जल का प्रकाशिक अपघटन एवं इलेक्ट्रॉन उत्सर्जन।' },
          { id: 'photolysis', label: 'जल का प्रकाश अपघटन (Photolysis)', description: 'जल अणु टूटकर ऑक्सीजन और प्रोटॉन मुक्त करते हैं।' },
          { id: 'etc', label: 'इलेक्ट्रॉन परिवहन तंत्र (ETC)', description: 'प्रोटॉन प्रवणता द्वारा ATP ऊर्जा का निर्माण।' },
          { id: 'ps1', label: 'फोटोसिस्टम I (P700)', description: 'इलेक्ट्रॉनों द्वारा NADP+ का NADPH में अपचयन।' }
        ]
      },
      {
        id: 'calvin',
        label: 'केल्विन चक्र (अप्रकाशिक अभिक्रियाएं)',
        description: 'स्ट्रोमा द्रव में CO2 का कार्बनिक शर्करा में एंजाइमी स्थिरीकरण।',
        category: 'चरण २',
        children: [
          { id: 'fixation', label: 'कार्बन स्थिरीकरण (RuBisCO)', description: 'रूबिस्को द्वारा RuBP के साथ CO2 का संयोजन।' },
          { id: 'reduction', label: '3-PGA का अपचयन', description: 'ATP व NADPH की सहायता से ट्राइओज फॉस्फेट का निर्माण।' },
          { id: 'glucose', label: 'ग्लूकोज एवं स्टार्च संश्लेषण', description: 'पौधों में संचित पोषक ऊर्जा का उत्पादन।' },
          { id: 'regen', label: 'RuBP का पुनरुत्पादन', description: 'पुनः चक्र आरंभ करने हेतु स्वीकर्ता अणु का निर्माण।' }
        ]
      },
      {
        id: 'factors',
        label: 'सीमाकारी पर्यावरणीय कारक',
        description: 'प्रकाश तीव्रता, CO2 सांद्रता और इष्टतम तापमान सीमाएं।',
        category: 'विनियमन',
        children: [
          { id: 'light-intensity', label: 'प्रकाश तीव्रता', description: 'संतृप्ति बिंदु तक अभिक्रिया की दर बढ़ती है।' },
          { id: 'co2-conc', label: 'CO2 सांद्रता', description: 'वायुमंडलीय सीमा पर मुख्य दर-नियंत्रक घटक।' },
          { id: 'temp', label: 'इष्टतम तापमान (25°-35°C)', description: 'अत्यधिक ताप पर एंजाइमों का विकृतीकरण।' }
        ]
      }
    ]
  },

  'mr-varhadi': {
    id: 'root-marathi',
    label: 'प्रकाशसंश्लेषण प्रक्रिया (Photosynthesis)',
    description: 'सूर्यप्रकाशाच्या मदतीने वनस्पती स्वतःचे अन्न आणि ऑक्सिजन कसे तयार करतात.',
    category: 'मुख्य प्रणाली',
    children: [
      {
        id: 'light-dep',
        label: 'प्रकाश-निर्भर टप्पा (उजेडात होणारा)',
        description: 'हरितलवकांच्या थायलाकॉइडमध्ये सूर्यप्रकाशातून ऊर्जा निर्मिती.',
        category: 'टप्पा १',
        children: [
          { id: 'ps2', label: 'फोटोसिस्टिम २ (P680)', description: '६८० एनएम प्रकाश शोषून पाण्याचे विघटन करते.' },
          { id: 'photolysis', label: 'पाण्याचे प्रकाश विघटन', description: 'पाणी तुटून ऑक्सिजन वायू हवेत सोडला जातो.' },
          { id: 'etc', label: 'इलेक्ट्रॉन वहन साखळी', description: 'इलेक्ट्रॉनच्या प्रवाहातून पेशीसाठी ATP ऊर्जा बनते.' }
        ]
      },
      {
        id: 'calvin',
        label: 'केल्व्हिन चक्र (अप्रकाशिक टप्पा)',
        description: 'स्ट्रोमामध्ये कार्बन डायऑक्साइड शोषून ग्लुकोज साखर बनवण्याची क्रिया.',
        category: 'टप्पा २',
        children: [
          { id: 'fixation', label: 'कार्बन स्थिरीकरण (RuBisCO)', description: 'रूबिस्को एंझाइम हवेतील CO2 पकडून ठेवतो.' },
          { id: 'glucose', label: 'ग्लुकोज व पिष्टमय अन्न निर्मिती', description: 'झाडाच्या पोषणासाठी तयार झालेले अन्न.' }
        ]
      },
      {
        id: 'factors',
        label: 'पर्यावरणीय नियंत्रक घटक',
        description: 'उन्हाची तीव्रता, हवेतील CO2 चे प्रमाण आणि तापमान.',
        category: 'नियमन'
      }
    ]
  },

  'bn-rarh': {
    id: 'root-bengali',
    label: 'সালোকসংশ্লেষ প্রক্রিয়া (Photosynthesis)',
    description: 'সৌরশক্তিকে রাসায়নিক খাদ্য শক্তিতে রূপান্তর এবং অক্সিজেন নির্গমনের সম্পূর্ণ প্রবাহ।',
    category: 'মূল জৈব প্রক্রিয়া',
    children: [
      {
        id: 'light-dep',
        label: 'আলোক-নির্ভর পর্যায় (Light Stage)',
        description: 'ক্লোরোপ্লাস্টের থাইলাকয়েডে সূর্যালোকের সহায়তায় শক্তি উৎপাদন।',
        category: 'পর্যায় ১',
        children: [
          { id: 'ps2', label: 'ফটোসিস্টেম ২ (P680)', description: 'সূর্যালোক শোষণ করে জলের অণু বিভাজন শুরু করে।' },
          { id: 'photolysis', label: 'জলের আলোক-বিশ্লেষণ (Photolysis)', description: 'জল ভেঙে অক্সিজেন গ্যাস ও প্রোটন উৎপন্ন হয়।' },
          { id: 'etc', label: 'ইলেকট্রন পরিবহন শৃঙ্খল', description: 'উচ্চ শক্তির ইলেকট্রন দ্বারা ATP শক্তি সঞ্চিত হয়।' }
        ]
      },
      {
        id: 'calvin',
        label: 'কেলভিন চক্র (আলোক-নিরপেক্ষ পর্যায়)',
        description: 'ক্লোরোপ্লাস্টের স্ট্রোমাতে কার্বন ডাই অক্সাইড আবদ্ধ করে গ্লুকোজ শর্করা তৈরি।',
        category: 'পর্যায় ২',
        children: [
          { id: 'fixation', label: 'কার্বন সংবন্ধন (RuBisCO)', description: 'রুবিসকো উৎসেচক বাতাসের CO2 যুক্ত করে।' },
          { id: 'glucose', label: 'গ্লুকোজ ও শ্বেতসার তৈরি', description: 'উদ্ভিদের সঞ্চিত খাদ্য প্রস্তুত হয়।' }
        ]
      },
      {
        id: 'factors',
        label: 'নিয়ন্ত্রক পরিবেশগত প্রভাবক',
        description: 'সূর্যালোকের তীব্রতা, কার্বন ডাই অক্সাইডের ঘনত্ব ও তাপমাত্রা।',
        category: 'নিয়ন্ত্রণ'
      }
    ]
  },

  'ta-madurai': {
    id: 'root-tamil',
    label: 'ஒளிச்சேர்க்கை செயல்முறை (Photosynthesis)',
    description: 'சூரிய ஒளி, நீர் மற்றும் காற்று கொண்டு தாவரங்கள் உணவு தயாரிக்கும் உயிர் வேதியியல் நிகழ்வு.',
    category: 'முக்கிய அமைப்பு',
    children: [
      {
        id: 'light-dep',
        label: 'ஒளி சார்ந்த நிலை (பகல் நேரம்)',
        description: 'தைலகாய்டு சவ்வுகளில் சூரிய ஒளி ஆற்றலாக மாற்றப்படுகிறது.',
        category: 'நிலை 1',
        children: [
          { id: 'ps2', label: 'ஒளித்தொகுதி II (P680)', description: 'ஒளியை உறிஞ்சி நீர் மூலக்கூறுகளை உடைக்கிறது.' },
          { id: 'photolysis', label: 'நீர் ஒளிச்சிதைவு (Photolysis)', description: 'நீர் மூலக்கூறு உடைந்து ஆக்சிஜன் வாயு வெளியாகிறது.' },
          { id: 'etc', label: 'எலக்ட்ரான் கடத்து சங்கிலி', description: 'ATP மற்றும் NADPH ஆற்றல் சேமிக்கப்படுகிறது.' }
        ]
      },
      {
        id: 'calvin',
        label: 'கால்வின் சுழற்சி (இருள் நிலை)',
        description: 'ஸ்ட்ரோமாவில் கார்பன் டை ஆக்சைடை குளுக்கோஸ் உணவாக மாற்றுதல்.',
        category: 'நிலை 2',
        children: [
          { id: 'fixation', label: 'கார்பன் நிலைநிறுத்தம் (RuBisCO)', description: 'ரூபிஸ்கோ நொதி CO2 ஐ பிணைக்கிறது.' },
          { id: 'glucose', label: 'குளுக்கோஸ் & சர்க்கரை உற்பத்தி', description: 'தாவரத்தின் வாழ்வாதார சேமிப்பு உணவு.' }
        ]
      },
      {
        id: 'factors',
        label: 'சுற்றுச்சூழல் வரம்பு காரணிகள்',
        description: 'ஒளிச்செறிவு, CO2 அளவு மற்றும் தட்பவெப்பநிலை வரம்புகள்.',
        category: 'கட்டுப்பாடு'
      }
    ]
  },

  'te-telangana': {
    id: 'root-telugu',
    label: 'కిరణజన్య సంయోగక్రియ (Photosynthesis)',
    description: 'సూర్యకాంతి మరియు నీటి సహాయంతో మొక్కలు ఆహారం మరియు ప్రాణవాయువును తయారుచేసే విధానం.',
    category: 'ప్రధాన వ్యవస్థ',
    children: [
      {
        id: 'light-dep',
        label: 'కాంతి చర్యల దశ (థైలకాయిడ్)',
        description: 'క్లోరోప్లాస్ట్‌లో సూర్యకాంతి శోషణ మరియు శక్తి ఉత్పత్తి.',
        category: 'దశ 1',
        children: [
          { id: 'ps2', label: 'ఫోటోసిస్టమ్ 2 (P680)', description: 'నీటి అణువును విచ్ఛిన్నం చేసి ఎలక్ట్రాన్లను విడుదల చేస్తుంది.' },
          { id: 'photolysis', label: 'నీటి కాంతి విశ్లేషణ', description: 'ఆక్సిజన్ వాయువు మరియు ప్రోటాన్లు విడుదలవుతాయి.' },
          { id: 'etc', label: 'ఎలక్ట్రాన్ రవాణా శ్రేణి', description: 'మొక్కలకు అవసరమైన ATP శక్తి లభిస్తుంది.' }
        ]
      },
      {
        id: 'calvin',
        label: 'కాల్విన్ వలయం (నిష్కాంతి చర్య)',
        description: 'స్ట్రోమా ద్రవంలో కార్బన్ డై ఆక్సైడ్ గ్లూకోజ్ ఆహారంగా మారుతుంది.',
        category: 'దశ 2',
        children: [
          { id: 'fixation', label: 'కార్బన్ స్థాపన (RuBisCO)', description: 'రుబిస్కో ఎంజైమ్ CO2ను బంధిస్తుంది.' },
          { id: 'glucose', label: 'గ్లూకోజ్ చక్కెరల ఉత్పత్తి', description: 'మొక్కల ఎదుగుదలకు ఉపయోగపడే పిండి పదార్థం.' }
        ]
      },
      {
        id: 'factors',
        label: 'ప్రభావితం చేసే పర్యావరణ కారకాలు',
        description: 'కాంతి తీవ్రత, ఉష్ణోగ్రత మరియు CO2 లభ్యత.',
        category: 'నియంత్రణ'
      }
    ]
  },

  'gu-kathiyawadi': {
    id: 'root-gujarati',
    label: 'પ્રકાશસંશ્લેષણ પ્રક્રિયા (Photosynthesis)',
    description: 'સૂર્યપ્રકાશ, પાણી અને હવામાંથી વનસ્પતિ પોતાનો ખોરાક અને ઓક્સિજન કેવી રીતે બનાવે છે.',
    category: 'મુખ્ય પ્રક્રિયા',
    children: [
      {
        id: 'light-dep',
        label: 'પ્રકાશ-આધારિત તબક્કો',
        description: 'થાઇલેકોઇડમાં સૂર્યપ્રકાશ શોષીને રાસાયણિક ઊર્જા બને છે.',
        category: 'તબક્કો ૧',
        children: [
          { id: 'ps2', label: 'ફોટોસિસ્ટમ ૨ (P680)', description: 'પ્રકાશ શોષીને પાણીનું વિભાજન શરૂ કરે છે.' },
          { id: 'photolysis', label: 'પાણીનું વિઘટન (Photolysis)', description: 'પાણી તૂટીને ઓક્સિજન વાયુ મુક્ત થાય છે.' },
          { id: 'etc', label: 'ઇલેક્ટ્રોન પરિવહન શૃંખલા', description: 'ATP ઊર્જાનું નિર્માણ થાય છે.' }
        ]
      },
      {
        id: 'calvin',
        label: 'કેલ્વિન ચક્ર (અંધકાર તબક્કો)',
        description: 'સ્ટ્રોમામાં કાર્બન ડાયોક્સાઇડ જોડીને ગ્લુકોઝ શર્કરા તૈયાર થાય છે.',
        category: 'તબક્કો ૨',
        children: [
          { id: 'fixation', label: 'કાર્બન સ્થાપન (RuBisCO)', description: 'રુબિસ્કો ઉત્સેચક વાતાવરણનો CO2 પકડી રાખે છે.' },
          { id: 'glucose', label: 'ગ્લુકોઝ અને સ્ટાર્ચ નિર્માણ', description: 'છોડનો સંગ્રહિત પૌષ્ટિક ખોરાક.' }
        ]
      },
      {
        id: 'factors',
        label: 'પર્યાવરણીય નિયંત્રક પરિબળો',
        description: 'તડકાની માત્રા, હવામાં CO2 નું પ્રમાણ અને યોગ્ય તાપમાન.',
        category: 'નિયંત્રણ'
      }
    ]
  },

  'es': {
    id: 'root-spanish',
    label: 'Mecanismo de Fotosíntesis',
    description: 'Conversión biológica de energía solar radiante en azúcares bioquímicos y oxígeno puro.',
    category: 'Sistema Central',
    children: [
      {
        id: 'light-dep',
        label: 'Fase Luminosa (Dependiente de Luz)',
        description: 'Ocurre en las membranas tilacoides del cloroplasto con luz solar activa.',
        category: 'Etapa 1',
        children: [
          { id: 'ps2', label: 'Fotosistema II (P680)', description: 'Absorbe fotones y desencadena la fotólisis del agua.' },
          { id: 'photolysis', label: 'Fotólisis del Agua (H2O)', description: 'Libera gas oxígeno (O2), electrones y protones.' },
          { id: 'etc', label: 'Cadena de Transporte de Electrones', description: 'Bombea protones para sintetizar energía ATP.' }
        ]
      },
      {
        id: 'calvin',
        label: 'Ciclo de Calvin (Fase Oscura)',
        description: 'Fijación enzimática de carbono en el estroma sin requerir luz directa.',
        category: 'Etapa 2',
        children: [
          { id: 'fixation', label: 'Fijación de Carbono (RuBisCO)', description: 'El CO2 se une a la ribulosa 1,5-bisfosfato.' },
          { id: 'glucose', label: 'Síntesis de Glucosa', description: 'Azúcares almacenados como almidón en la planta.' }
        ]
      },
      {
        id: 'factors',
        label: 'Factores Limitantes Ambientales',
        description: 'Intensidad lumínica, concentración de CO2 y temperatura óptima.',
        category: 'Regulación'
      }
    ]
  },

  'en': {
    id: 'root-english',
    label: 'Photosynthesis Mechanism',
    description: 'Biological conversion of radiant solar energy into storable biochemical sugars and oxygen.',
    category: 'Core System',
    children: [
      {
        id: 'light-dep',
        label: 'Light-Dependent Stage',
        description: 'Takes place in chloroplast thylakoid membranes in the presence of sunlight.',
        category: 'Stage 1',
        children: [
          { id: 'ps2', label: 'Photosystem II (P680)', description: 'Absorbs 680nm photons, initiates photolysis of water.' },
          { id: 'photolysis', label: 'Photolysis (H2O Splitting)', description: 'Yields 2H+, 2e-, and releases O2 gas into atmosphere.' },
          { id: 'etc', label: 'Electron Transport Chain', description: 'Transfers high-energy electrons, pumping protons to make ATP.' },
          { id: 'ps1', label: 'Photosystem I (P700)', description: 'Re-energizes electrons to reduce NADP+ into NADPH.' }
        ]
      },
      {
        id: 'calvin',
        label: 'Calvin Cycle (Dark Phase)',
        description: 'Enzymatic carbon fixation in the stroma, independent of direct illumination.',
        category: 'Stage 2',
        children: [
          { id: 'fixation', label: 'Carbon Fixation (RuBisCO)', description: 'CO2 attaches to Ribulose 1,5-bisphosphate.' },
          { id: 'reduction', label: '3-PGA Reduction', description: 'ATP and NADPH convert 3-PGA into triose G3P.' },
          { id: 'glucose', label: 'Glucose & Sucrose Synthesis', description: 'Hexose sugars stored as starch in plant tissue.' },
          { id: 'regen', label: 'RuBP Regeneration', description: 'Reconstructs RuBP acceptor molecules using ATP.' }
        ]
      },
      {
        id: 'factors',
        label: 'Environmental Limiting Factors',
        description: 'Key ecological variables that regulate photochemical reaction rate.',
        category: 'Regulation',
        children: [
          { id: 'light-intensity', label: 'Light Irradiance', description: 'Reaches saturation point under midday sun.' },
          { id: 'co2-conc', label: 'CO2 Concentration', description: 'Atmospheric partial pressure bottleneck.' },
          { id: 'temp', label: 'Temperature Optimum', description: 'Enzyme denaturation occurs above 40°C.' }
        ]
      }
    ]
  }
};

export function getLocalizedMindMap(langId: string): MindMapNode {
  if (MINDMAPS[langId]) return MINDMAPS[langId];
  if (langId.startsWith('hi-awadhi')) return MINDMAPS['hi-awadhi'];
  if (langId.startsWith('hi-standard')) return MINDMAPS['hi-standard'];
  if (langId.startsWith('hi')) return MINDMAPS['hi-bhojpuri'];
  if (langId.startsWith('mr')) return MINDMAPS['mr-varhadi'];
  if (langId.startsWith('bn')) return MINDMAPS['bn-rarh'];
  if (langId.startsWith('ta')) return MINDMAPS['ta-madurai'];
  if (langId.startsWith('te')) return MINDMAPS['te-telangana'];
  if (langId.startsWith('gu')) return MINDMAPS['gu-kathiyawadi'];
  if (langId.startsWith('es')) return MINDMAPS['es'];
  return MINDMAPS['en'];
}

/**
 * ============================================================================
 * 2. LOCALIZED ADAPTIVE QUIZ QUESTIONS
 * ============================================================================
 */
export function getLocalizedQuiz(langId: string): QuizQuestion[] {
  const norm = langId.toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return [
      {
        id: 1,
        question: "प्रकाश संश्लेषण के प्रकाश-निर्भर चरण में पानी के अणु के मुख्य काम का होला?",
        questionDialect: "प्रकाश संश्लेषण के क्रिया में पानी के अणु के मुख्य काम का होला?",
        difficulty: "मध्यम (Intermediate)",
        options: [
          "सीधे हरियर रोशनी के सोखे खातिर",
          "इलेक्ट्रॉन आपूर्ति करे आ फोटोलाइसिस से ऑक्सीजन गैस छोड़े खातिर",
          "स्ट्रोमा में सीधे कार्बन डाइऑक्साइड बाँधे खातिर",
          "ग्लूकोज के स्टार्च में बदले खातिर"
        ],
        correctAnswer: 1,
        explanation: "पानी टूट के इलेक्ट्रॉन आ ऑक्सीजन गैस छोड़ेला, जेकरा से फोटोसिस्टम २ चलेला आ सांस लेवे खातिर ऑक्सीजन मिलेला।",
        explanationDialect: "पानी टूट के इलेक्ट्रॉन आ ऑक्सीजन गैस छोड़ेला, जेकरा से फोटोसिस्टम चलेला।"
      },
      {
        id: 2,
        question: "क्लोरोप्लास्ट के कवने भाग में केल्विन चक्र (Calvin Cycle) संपन्न होला?",
        questionDialect: "क्लोरोप्लास्ट में केल्विन चक्र के क्रिया कहाँ संपन्न होला?",
        difficulty: "सरल (Easy)",
        options: [
          "थाइलाकॉइड ल्यूमेन में",
          "बाहरी झिल्ली में",
          "क्लोरोप्लास्ट के स्ट्रोमा द्रव में",
          "माइटोकॉन्ड्रिया में"
        ],
        correctAnswer: 2,
        explanation: "केल्विन चक्र स्ट्रोमा द्रव में होला जहाँ रूबिस्को एंजाइम कार्बन बाँध के चीनी बनावेला।",
        explanationDialect: "केल्विन चक्र स्ट्रोमा द्रव में होला।"
      },
      {
        id: 3,
        question: "कड़ाके के घाम में प्रकाश संश्लेषण खातिर मुख्य सीमाकारी कारक का होला?",
        questionDialect: "कड़ाके के घाम में प्रकाश संश्लेषण खातिर मुख्य सीमाकारी कारक का होला?",
        difficulty: "कठिन (Advanced)",
        options: [
          "सूरज के धूप के तीव्रता",
          "हवा में कार्बन डाइऑक्साइड (CO2) के कमी",
          "माटी के नमी",
          "हवा में नाइट्रोजन गैस"
        ],
        correctAnswer: 1,
        explanation: "धूप भरपूर भइला पर भी हवा में केवल ०.०४% CO2 होखे के चलते ई गति रोके वाला मुख्य कारक बन जाला।",
        explanationDialect: "धूप ढेर भइला पर कार्बन डाइऑक्साइड के कमी गति रोक देवेले।"
      }
    ];
  }

  if (norm.startsWith('hi-awadhi')) {
    return [
      {
        id: 1,
        question: "प्रकाश संश्लेषण में पानी के अणु कवन मुख्य काम करत हैं?",
        questionDialect: "प्रकाश संश्लेषण में पानी के अणु का काम करत हैं भैया?",
        difficulty: "मध्यम",
        options: [
          "हरियर प्रकाश सीधे सोखै खातिर",
          "पानी टूट के इलेक्ट्रॉन देत है अउर ऑक्सीजन छोड़त है",
          "हवा के कार्बन सीधे बाँधै खातिर",
          "ग्लूकोज के स्टार्च बनावै खातिर"
        ],
        correctAnswer: 1,
        explanation: "पानी टूटला पर ऑक्सीजन गैस निकलत है जेकरा से हम सब सांस लेत हैं।",
        explanationDialect: "पानी टूट के ऑक्सीजन गैस छोड़त है।"
      },
      {
        id: 2,
        question: "पौधा के क्लोरोप्लास्ट में केल्विन चक्र कहाँ सम्पन्न होत है?",
        questionDialect: "केल्विन चक्र पौधा के कोशिका में कहाँ होत है?",
        difficulty: "सरल",
        options: [
          "थाइलाकॉइड झिल्ली में",
          "बाहरी छिलका में",
          "क्लोरोप्लास्ट के स्ट्रोमा द्रव में",
          "माइटोकॉन्ड्रिया में"
        ],
        correctAnswer: 2,
        explanation: "केल्विन चक्र स्ट्रोमा द्रव में सम्पन्न होत है जहाँ भोजन बनत है।",
        explanationDialect: "केल्विन चक्र स्ट्रोमा द्रव में संपन्न होत है।"
      },
      {
        id: 3,
        question: "कड़ाके के घाम में भोजन बनावै के गति काहे रुक जात है?",
        questionDialect: "तेज धूप में सीमाकारी कारक का होत है?",
        difficulty: "कठिन",
        options: [
          "धूप के कमी",
          "हवा में कार्बन डाइऑक्साइड (CO2) के कमी",
          "माटी में खाद के कमी",
          "नाइट्रोजन गैस"
        ],
        correctAnswer: 1,
        explanation: "हवा में कार्बन डाइऑक्साइड कम होवै से पौधा तेज गति से भोजन नाही बना पावत हैं।",
        explanationDialect: "हवा में CO2 कम होवै से गति रुकत है।"
      }
    ];
  }

  if (norm.startsWith('hi')) {
    return [
      {
        id: 1,
        question: "प्रकाश संश्लेषण की प्रकाश अभिक्रिया में जल के अणुओं की मुख्य भूमिका क्या है?",
        questionDialect: "प्रकाश संश्लेषण में जल अणुओं का मुख्य कार्य क्या होता है?",
        difficulty: "मध्यम (Intermediate)",
        options: [
          "सीधे हरे प्रकाश के फोटॉनों को अवशोषित करना",
          "फोटोलाइसिस द्वारा इलेक्ट्रॉन प्रदान करना और ऑक्सीजन गैस मुक्त करना",
          "स्ट्रोमा में CO2 का सीधा स्थिरीकरण करना",
          "ग्लूकोज को स्टार्च कणिकाओं में परिवर्तित करना"
        ],
        correctAnswer: 1,
        explanation: "फोटोसिस्टम II में जल का प्रकाशिक अपघटन होता है, जिससे ऑक्सीजन गैस और प्रोटॉन उत्पन्न होते हैं।",
        explanationDialect: "जल के अपघटन से ऑक्सीजन मुक्त होती है जो जीवनदायिनी है।"
      },
      {
        id: 2,
        question: "पादप कोशिका के अंदर केल्विन चक्र की एंजाइमी अभिक्रियाएं कहां संपन्न होती हैं?",
        questionDialect: "केल्विन चक्र पादप कोशिका में किस स्थान पर होता है?",
        difficulty: "सरल (Easy)",
        options: [
          "थाइलाकॉइड ल्यूमेन",
          "बाहरी झिल्ली आवरण",
          "क्लोरोप्लास्ट स्ट्रोमा द्रव",
          "माइटोकॉन्ड्रियल मैट्रिक्स"
        ],
        correctAnswer: 2,
        explanation: "क्लोरोप्लास्ट के स्ट्रोमा में RuBisCO सहित सभी आवश्यक एंजाइम पाए जाते हैं जो CO2 को शर्करा में बदलते हैं।",
        explanationDialect: "स्ट्रोमा द्रव में सभी एंजाइमी क्रियाएं संपन्न होती हैं।"
      },
      {
        id: 3,
        question: "तेज धूप वाले दोपहर के समय प्रकाश संश्लेषण की दर के लिए मुख्य सीमाकारी कारक क्या होता है?",
        questionDialect: "प्रचुर धूप में प्रकाश संश्लेषण की दर किस कारक पर निर्भर करती है?",
        difficulty: "कठिन (Advanced)",
        options: [
          "सूर्य के प्रकाश की तीव्रता",
          "वायुमंडलीय कार्बन डाइऑक्साइड (CO2) की सांद्रता",
          "मृदा की नमी",
          "हवा में नाइट्रोजन की मात्रा"
        ],
        correctAnswer: 1,
        explanation: "प्रचुर प्रकाश होने पर भी वायुमंडल में CO2 की अल्प मात्रा (लगभग 0.04%) दर-नियंत्रक अवरोध बन जाती है।",
        explanationDialect: "वायुमंडल में CO2 की सीमित सांद्रता मुख्य अवरोधक होती है।"
      }
    ];
  }

  if (norm.startsWith('bn')) {
    return [
      {
        id: 1,
        question: "সালোকসংশ্লেষের আলোক-নির্ভর পর্যায়ে জলের প্রধান ভূমিকা কী?",
        questionDialect: "সালোকসংশ্লেষে জলের অণুর প্রধান কাজ কী ভাই?",
        difficulty: "মধ্যম (Intermediate)",
        options: [
          "সরাসরি সবুজ আলো শোষণ করা",
          "আলোক বিশ্লেষণের মাধ্যমে ইলেকট্রন সরবরাহ ও অক্সিজেন গ্যাস মুক্ত করা",
          "স্ট্রোমাতে কার্বন ডাই অক্সাইড সংবন্ধন করা",
          "গ্লুকোজকে শ্বেতসারে রূপান্তর করা"
        ],
        correctAnswer: 1,
        explanation: "ফটোসিস্টেম ২-এ জলের ফোটোলাইসিস ঘটে, যার ফলে অক্সিজেন ও ইলেকট্রন নির্গত হয়।",
        explanationDialect: "জল বিশ্লিষ্ট হয়ে অক্সিজেন উৎপন্ন করে যা আমরা শ্বাস নিই।"
      },
      {
        id: 2,
        question: "উদ্ভিদ কোষে কেলভিন চক্রের বিক্রিয়াগুলি কোথায় সংঘটিত হয়?",
        questionDialect: "কেলভিন চক্র ক্লোরোপ্লাস্টের কোথায় ঘটে?",
        difficulty: "সহজ (Easy)",
        options: [
          "থাইলাকয়েড গহ্বরে",
          "বহিঃপর্দায়",
          "ক্লোরোপ্লাস্টের স্ট্রোমা তরলে",
          "মাইটোকন্ড্রিয়ায়"
        ],
        correctAnswer: 2,
        explanation: "স্ট্রোমাতে রুবিসকো উৎসেচকের উপস্থিতিতে কার্বন সংবন্ধন ও গ্লুকোজ তৈরি হয়।",
        explanationDialect: "স্ট্রোমা তরলেই এই শর্করা তৈরির বিক্রিয়া ঘটে।"
      },
      {
        id: 3,
        question: "প্রখর রোদের সময় সালোকসংশ্লেষের প্রধান সীমাবদ্ধকারী উপাদান কোনটি?",
        questionDialect: "দুপুরের কড়া রোদে সালোকসংশ্লেষের গতি কিসে আটকে যায়?",
        difficulty: "উন্নত (Advanced)",
        options: [
          "সূর্যালোকের তীব্রতা",
          "বাতাসে কার্বন ডাই অক্সাইডের ঘনত্ব",
          "মাটির আর্দ্রতা",
          "বাতাসে নাইট্রোজেন গ্যাস"
        ],
        correctAnswer: 1,
        explanation: "যথেষ্ট আলো থাকলেও বায়ুমণ্ডলে CO2-এর স্বল্পতা সালোকসংশ্লেষের গতিসীমা নির্ধারণ করে।",
        explanationDialect: "বাতাসে CO2-এর অভাবই এখানে প্রধান বাধা হয়ে দাঁড়ায়।"
      }
    ];
  }

  if (norm.startsWith('ta')) {
    return [
      {
        id: 1,
        question: "ஒளிச்சேர்க்கையின் ஒளி சார்ந்த வினைகளில் நீரின் முதன்மைப் பங்கு என்ன?",
        questionDialect: "ஒளிச்சேர்க்கையில் நீர் மூலக்கூறின் முக்கிய வேலை என்ன தம்பி?",
        difficulty: "நடுத்தரம் (Intermediate)",
        options: [
          "பச்சை ஒளியை நேரடியாக உறிஞ்சுதல்",
          "நீரின் ஒளிச்சிதைவு மூலம் எலக்ட்ரான்களை வழங்கி ஆக்சிஜன் வாயுவை வெளியிடுதல்",
          "ஸ்ட்ரோமாவில் CO2 வை நேரடியாக நிலைநிறுத்துதல்",
          "குளுக்கோஸை ஸ்டார்ச்சாக மாற்றுதல்"
        ],
        correctAnswer: 1,
        explanation: "ஒளித்தொகுதி II-ல் நீர் மூலக்கூறு உடைக்கப்பட்டு புரோட்டான்கள், எலக்ட்ரான்கள் மற்றும் ஆக்சிஜன் வெளியாகிறது.",
        explanationDialect: "நீர் உடைந்து தான் நமக்கு தேவையான ஆக்சிஜன் வாயு கிடைக்கிறது."
      },
      {
        id: 2,
        question: "தாவர செல்லில் கால்வின் சுழற்சியின் என்சைம் வினைகள் எங்கு நடைபெறுகின்றன?",
        questionDialect: "கால்வின் சுழற்சி தாவர செல்லில் எங்கு நடக்குது?",
        difficulty: "எளிது (Easy)",
        options: [
          "தைலகாய்டு இடைவெளி",
          "வெளிப்புற சவ்வு",
          "பசுங்கணிகத்தின் ஸ்ட்ரோமா திரவம்",
          "மைட்டோகாண்ட்ரியா"
        ],
        correctAnswer: 2,
        explanation: "ஸ்ட்ரோமா திரவத்தில் ரூபிஸ்கோ நொதி உள்ளதால் அங்கு கார்பன் சர்க்கரையாக மாறுகிறது.",
        explanationDialect: "ஸ்ட்ரோமா திரவத்தில் தான் இந்த சுழற்சி நடைபெறுகிறது."
      },
      {
        id: 3,
        question: "நண்பகல் வெயிலில் ஒளிச்சேர்க்கையின் வேகத்தை கட்டுப்படுத்தும் முக்கிய காரணி எது?",
        questionDialect: "கடும் வெயிலில் ஒளிச்சேர்க்கைக்கு எது தடையாக மாறும்?",
        difficulty: "கடினம் (Advanced)",
        options: [
          "சூரிய ஒளியின் செறிவு",
          "வளிமண்டல கார்பன் டை ஆக்சைடு (CO2) அளவு",
          "மண்ணின் ஈரப்பதம் மட்டும்",
          "காற்றில் உள்ள நைட்ரஜன்"
        ],
        correctAnswer: 1,
        explanation: "அதிக ஒளி இருந்தாலும் வளிமண்டலத்தில் குறைந்த CO2 (சுமார் 0.04%) மட்டுமே இருப்பதால் அதுவே வேகத்தை கட்டுப்படுத்துகிறது.",
        explanationDialect: "காற்றில் உள்ள CO2 பற்றாக்குறை தான் முதன்மை கட்டுப்பாட்டு காரணி."
      }
    ];
  }

  if (norm.startsWith('te')) {
    return [
      {
        id: 1,
        question: "కిరణజన్య సంయోగక్రియ కాంతి దశలో నీటి అణువుల ప్రధాన పాత్ర ఏమిటి?",
        questionDialect: "కిరణజన్య సంయోగక్రియలో నీటి అణువుల ముఖ్య పని ఏమిటి బాబు?",
        difficulty: "మధ్యస్థం (Intermediate)",
        options: [
          "ఆకుపచ్చ కాంతిని నేరుగా గ్రహించడం",
          "కాంతి విశ్లేషణ ద్వారా ఎలక్ట్రాన్లను అందించడం మరియు ఆక్సిజన్ విడుదల చేయడం",
          "స్ట్రోమాలో కార్బన్ డై ఆక్సైడ్‌ను స్థాపించడం",
          "గ్లూకోజ్‌ను స్టార్చ్‌గా మార్చడం"
        ],
        correctAnswer: 1,
        explanation: "ఫోటోసిస్టమ్ II లో నీరు విచ్ఛిన్నమై జీవులకు అవసరమైన ఆక్సిజన్ వాయువును విడుదల చేస్తుంది.",
        explanationDialect: "నీరు విచ్ఛిన్నం కావడం వల్లనే ఆక్సిజన్ గాలిలోకి విడుదలవుతుంది."
      },
      {
        id: 2,
        question: "మొక్కల కణంలో కాల్విన్ వలయం చర్యలు ఎక్కడ జరుగుతాయి?",
        questionDialect: "కాల్విన్ వలయం క్లోరోప్లాస్ట్‌లో ఎక్కడ జరుగుతుంది?",
        difficulty: "సులభం (Easy)",
        options: [
          "థైలకాయిడ్ ల్యూమన్",
          "బాహ్య త్వచం",
          "క్లోరోప్లాస్ట్ స్ట్రోమా ద్రవం",
          "మైటోకాండ్రియా"
        ],
        correctAnswer: 2,
        explanation: "స్ట్రోమా ద్రవంలో రుబిస్కో ఎంజైమ్ సహాయంతో పిండి పదార్థాలు తయారవుతాయి.",
        explanationDialect: "స్ట్రోమా ద్రవంలోనే ఆహార తయారీ చర్యలు జరుగుతాయి."
      },
      {
        id: 3,
        question: "మధ్యాహ్నం తీవ్రమైన ఎండలో కిరణజన్య సంయోగక్రియ రేటును పరిమితం చేసే కారకం ఏది?",
        questionDialect: "తీవ్రమైన ఎండలో ప్రక్రియ వేగాన్ని ఆపే కారకం ఏది?",
        difficulty: "కఠినం (Advanced)",
        options: [
          "సూర్యకాంతి తీవ్రత",
          "గాలిలోని కార్బన్ డై ఆక్సైడ్ (CO2) సాంద్రత",
          "నేలలో తేమ",
          "నైట్రోజన్ వాయువు"
        ],
        correctAnswer: 1,
        explanation: "కాంతి పుష్కలంగా ఉన్నప్పటికీ గాలిలో CO2 కేవలం 0.04% ఉండటం వల్ల అదే రేటును నియంత్రిస్తుంది.",
        explanationDialect: "గాలిలో CO2 పరిమితంగా ఉండటమే ప్రధాన అవరోధం."
      }
    ];
  }

  if (norm.startsWith('mr')) {
    return [
      {
        id: 1,
        question: "प्रकाशसंश्लेषणाच्या प्रकाश टप्प्यात पाण्याच्या रेणूंचे मुख्य कार्य काय असते?",
        questionDialect: "पाण्याचे रेणू तुटून काय तयार होते गड्या?",
        difficulty: "मध्यम",
        options: [
          "हिरवा प्रकाश थेट शोषून घेणे",
          "प्रकाश विघटनाने इलेक्ट्रॉन देणे आणि ऑक्सिजन वायू हवेत सोडणे",
          "कार्बन डायऑक्साइड बांधून ठेवणे",
          "ग्लुकोज साखरेचे स्टार्चमध्ये रूपांतर करणे"
        ],
        correctAnswer: 1,
        explanation: "पाण्याचे विघटन होऊन ऑक्सिजन वायू मुक्त होतो जो सर्व सजीवांना श्वासासाठी मिळतो.",
        explanationDialect: "पाणी तुटल्यामुळेच ऑक्सिजन वायू तयार होतो."
      },
      {
        id: 2,
        question: "केल्व्हिन चक्राच्या प्रक्रिया हरितलवकात नेमक्या कोठे घडतात?",
        questionDialect: "केल्व्हिन चक्र कोठे घडते?",
        difficulty: "सोपे",
        options: [
          "थायलाकॉइडमध्ये",
          "बाहेरील आवरणात",
          "हरितलवकाच्या स्ट्रोमा द्रवामध्ये",
          "मायटोकॉन्ड्रियात"
        ],
        correctAnswer: 2,
        explanation: "स्ट्रोमामध्ये रूबिस्को एंझाइमच्या साहाय्याने ग्लुकोज साखर तयार होते.",
        explanationDialect: "स्ट्रोमा द्रवात अन्न तयार करण्याची क्रिया चालते."
      },
      {
        id: 3,
        question: "दुपारच्या कडक उन्हात प्रकाशसंश्लेषणावर मर्यादा आणणारा मुख्य घटक कोणता?",
        questionDialect: "कडक उन्हात प्रक्रियेचा वेग कशामुळे नियंत्रित होतो?",
        difficulty: "कठीण",
        options: [
          "सूर्यप्रकाशाची तीव्रता",
          "हवेतील कार्बन डायऑक्साइडचे (CO2) प्रमाण",
          "जमिनीतील ओलावा",
          "हवेतील नायट्रोजन"
        ],
        correctAnswer: 1,
        explanation: "प्रकाश भरपूर असला तरी हवेत CO2 कमी असल्याने प्रक्रियेचा वेग मर्यादित राहतो.",
        explanationDialect: "हवेतील CO2 चे प्रमाण हा मुख्य मर्यादा घालणारा घटक आहे."
      }
    ];
  }

  if (norm.startsWith('gu')) {
    return [
      {
        id: 1,
        question: "પ્રકાશસંશ્લેષણના પ્રકાશ તબક્કામાં પાણીના અણુઓનું મુખ્ય કાર્ય શું છે?",
        questionDialect: "પાણીના અણુઓનું મુખ્ય કામ શું હોય વાલા?",
        difficulty: "મધ્યમ",
        options: [
          "લીલો પ્રકાશ સીધો શોષવો",
          "ઇલેક્ટ્રોન પૂરા પાડવા અને ઓક્સિજન વાયુ મુક્ત કરવો",
          "CO2 નું સીધું સ્થાપન કરવું",
          "ગ્લુકોઝનું સ્ટાર્ચમાં રૂપાંતર કરવું"
        ],
        correctAnswer: 1,
        explanation: "પાણીના વિઘટનથી શ્વાસ લેવા માટેનો ઓક્સિજન વાયુ બહાર નીકળે છે.",
        explanationDialect: "પાણી તૂટવાથી પ્રાણવાયુ ઓક્સિજન મળે છે."
      },
      {
        id: 2,
        question: "કેલ્વિન ચક્રની પ્રક્રિયાઓ વનસ્પતિ કોષમાં ક્યાં થાય છે?",
        questionDialect: "કેલ્વિન ચક્ર ક્યાં સંપન્ન થાય છે?",
        difficulty: "સરળ",
        options: [
          "થાઇલેકોઇડ લ્યુમેન",
          "બહારની કલા",
          "હરિતકણના સ્ટ્રોમા પ્રવાહીમાં",
          "કણાભસૂત્રમાં"
        ],
        correctAnswer: 2,
        explanation: "સ્ટ્રોમા પ્રવાહીમાં રુબિસ્કો ઉત્સેચકથી કાર્બન જોડાઈને ખોરાક બને છે.",
        explanationDialect: "સ્ટ્રોમા પ્રવાહીમાં જ ખોરાક બનાવવાની પ્રક્રિયા થાય છે."
      },
      {
        id: 3,
        question: "બપોરના કડકડતા તડકામાં પ્રકાશસંશ્લેષણ માટે મુખ્ય સીમાકારી પરિબળ કયું છે?",
        questionDialect: "ભરપૂર તડકામાં કયું પરિબળ ગતિ ધીમી પાડે છે?",
        difficulty: "અઘરું",
        options: [
          "સૂર્યપ્રકાશની તીવ્રતા",
          "હવામાં કાર્બન ડાયોક્સાઇડ (CO2) નું પ્રમાણ",
          "માટીનો ભેજ",
          "હવામાં નાઇટ્રોજન વાયુ"
        ],
        correctAnswer: 1,
        explanation: "તડકો વધુ હોય ત્યારે હવામાં રહેલો ઓછો CO2 ગતિ નિયંત્રિત કરે છે.",
        explanationDialect: "હવામાં CO2 ની અછત જ મુખ્ય નિયંત્રક પરિબળ બને છે."
      }
    ];
  }

  if (norm.startsWith('es')) {
    return [
      {
        id: 1,
        question: "¿Cuál es el papel principal de las moléculas de agua en la fase luminosa?",
        questionDialect: "¿Para qué sirve el agua en la fotosíntesis?",
        difficulty: "Intermedio",
        options: [
          "Absorber fotones verdes directamente",
          "Suministrar electrones y liberar gas oxígeno mediante fotólisis",
          "Fijar dióxido de carbono en el estroma",
          "Convertir glucosa en almidón"
        ],
        correctAnswer: 1,
        explanation: "El agua se escinde en el fotosistema II, liberando electrones, protones y gas oxígeno puro vital.",
        explanationDialect: "La ruptura del agua genera el oxígeno vital que respiramos."
      },
      {
        id: 2,
        question: "¿En qué compartimento ocurren las reacciones del ciclo de Calvin?",
        questionDialect: "¿Dónde se realiza el ciclo de Calvin?",
        difficulty: "Fácil",
        options: [
          "Lumen tilacoidal",
          "Membrana externa",
          "Estroma del cloroplasto",
          "Matriz mitocondrial"
        ],
        correctAnswer: 2,
        explanation: "El estroma contiene la enzima RuBisCO para fijar el carbono en glucosa.",
        explanationDialect: "Ocurre en el fluido del estroma del cloroplasto."
      },
      {
        id: 3,
        question: "¿Cuál es el principal factor limitante en una tarde soleada?",
        questionDialect: "¿Qué limita la fotosíntesis con mucho sol?",
        difficulty: "Avanzado",
        options: [
          "Intensidad de la luz solar",
          "Concentración de dióxido de carbono (CO2) atmosférico",
          "Humedad del suelo únicamente",
          "Gas nitrógeno en el aire"
        ],
        correctAnswer: 1,
        explanation: "Con luz abundante, la disponibilidad de CO2 (~0.04% en el aire) se vuelve el cuello de botella.",
        explanationDialect: "La baja concentración de CO2 en el aire limita la velocidad."
      }
    ];
  }

  // Fallback: English
  return [
    {
      id: 1,
      question: "What is the primary role of water molecules during the light reactions of photosynthesis?",
      questionDialect: "What is the primary role of water molecules during photosynthesis?",
      difficulty: "Intermediate",
      options: [
        "To directly absorb green light photons",
        "To supply replacement electrons and release oxygen gas via photolysis",
        "To fix carbon dioxide directly in the stroma",
        "To convert glucose into starch granules"
      ],
      correctAnswer: 1,
      explanation: "Water is split via photolysis in photosystem II, generating protons and electrons while releasing oxygen gas.",
      explanationDialect: "Water splitting releases vital oxygen gas and powers photosystems."
    },
    {
      id: 2,
      question: "Where do the enzymatic reactions of the Calvin cycle occur inside the plant cell?",
      questionDialect: "Where does the Calvin cycle take place inside the chloroplast?",
      difficulty: "Easy",
      options: [
        "Thylakoid lumen",
        "Outer membrane envelope",
        "Chloroplast stroma fluid",
        "Mitochondrial matrix"
      ],
      correctAnswer: 2,
      explanation: "The stroma contains the enzymes (including RuBisCO) required to fix CO2 into sugars.",
      explanationDialect: "The stroma fluid houses the enzymes that synthesize sugars."
    },
    {
      id: 3,
      question: "What is the key limiting factor of photosynthesis on a bright sunny afternoon?",
      questionDialect: "What limits the rate of photosynthesis when sunlight is abundant?",
      difficulty: "Advanced",
      options: [
        "Sunlight intensity",
        "Atmospheric Carbon Dioxide concentration",
        "Soil moisture alone",
        "Nitrogen gas in air"
      ],
      correctAnswer: 1,
      explanation: "Even with abundant light, CO2 availability (around 0.04% in air) becomes the rate-limiting bottleneck.",
      explanationDialect: "Atmospheric CO2 concentration acts as the rate-limiting bottleneck."
    }
  ];
}

/**
 * ============================================================================
 * 3. LOCALIZED SMART FLASHCARDS
 * ============================================================================
 */
export function getLocalizedFlashcards(langId: string): Flashcard[] {
  const norm = langId.toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return [
      {
        id: 1,
        topic: "क्लोरोप्लास्ट जीवविज्ञान",
        frontQuestion: "पौधा के कोशिका में कवन अंग भोजन बनावे के काम करेला?",
        backAnswer: "क्लोरोप्लास्ट (हरितलवक), जेकरा अंदर थाइलाकॉइड आ क्लोरोफिल रंजक होला।",
        dialectTranslation: "पौधा के कोशिका में क्लोरोप्लास्ट खाना बनावे के काम करेला।"
      },
      {
        id: 2,
        topic: "फोटोलाइसिस क्रिया (Photolysis)",
        frontQuestion: "सूरज के रोशनी से जब पानी टूटेला त कवन गैस बाहर निकले ले?",
        backAnswer: "ऑक्सीजन गैस (O2), जेकरा से धरती के सब जीव सांस लेवे लें।",
        dialectTranslation: "पानी टूटला पर ऑक्सीजन गैस निकले ले जेकरा से सब जीव सांस लेवे लें।"
      },
      {
        id: 3,
        topic: "रूबिस्को एंजाइम (RuBisCO)",
        frontQuestion: "दुनिया में सबसे ढेर पावल जाए वाला एंजाइम कवन ह जे कार्बन सोखेला?",
        backAnswer: "रूबिस्को (Ribulose-1,5-bisphosphate carboxylase-oxygenase)।",
        dialectTranslation: "रूबिस्को एंजाइम दुनिया में सबसे ढेर पावल जाला आ ई कार्बन सोखेला।"
      }
    ];
  }

  if (norm.startsWith('hi-awadhi')) {
    return [
      {
        id: 1,
        topic: "क्लोरोप्लास्ट संरचना",
        frontQuestion: "पेड़-पौधा के कोशिका में भोजन बनावै वाला अंग कवन है?",
        backAnswer: "क्लोरोप्लास्ट, जहाँ क्लोरोफिल सूरज के रोशनी सोखत है।",
        dialectTranslation: "क्लोरोप्लास्ट रसोई घर जइसन पेड़ खातिर भोजन बनावत है।"
      },
      {
        id: 2,
        topic: "जल विखंडन",
        frontQuestion: "पानी टूटै पर कवन गैस बाहर निकलत है?",
        backAnswer: "ऑक्सीजन गैस, जेकरा से हम सब जिंदा अहित।",
        dialectTranslation: "पानी टूटै पर ऑक्सीजन गैस निकलत है।"
      },
      {
        id: 3,
        topic: "रूबिस्को एंजाइम",
        frontQuestion: "कार्बन सोखै वाला मुख्य एंजाइम कवन कहात है?",
        backAnswer: "रूबिस्को (RuBisCO) एंजाइम।",
        dialectTranslation: "रूबिस्को एंजाइम हवा के कार्बन बाँधै के काम करत है।"
      }
    ];
  }

  if (norm.startsWith('hi')) {
    return [
      {
        id: 1,
        topic: "क्लोरोप्लास्ट जीवविज्ञान",
        frontQuestion: "हरे पौधों में प्रकाश संश्लेषण किस कोशिकीय अंगक में संपन्न होता है?",
        backAnswer: "क्लोरोप्लास्ट (हरितलवक), जिसमें थाइलाकॉइड और क्लोरोफिल वर्णक उपस्थित होते हैं।",
        dialectTranslation: "क्लोरोप्लास्ट पादप कोशिका का रसोईघर है जहाँ सौर ऊर्जा से भोजन बनता है।"
      },
      {
        id: 2,
        topic: "जल का प्रकाश अपघटन",
        frontQuestion: "जल के प्रकाश अपघटन (Photolysis) के दौरान कौन सी सह-उत्पाद गैस मुक्त होती है?",
        backAnswer: "ऑक्सीजन गैस (O2), जो स्थलीय और जलीय जीवों के श्वसन को बनाए रखती है।",
        dialectTranslation: "जल के टूटने से ऑक्सीजन गैस मुक्त होती है जो प्राणवायु है।"
      },
      {
        id: 3,
        topic: "रूबिस्को एंजाइम (RuBisCO)",
        frontQuestion: "कार्बन स्थिरीकरण में भाग लेने वाला पृथ्वी पर सर्वाधिक प्रचुर प्रोटीन कौन सा है?",
        backAnswer: "RuBisCO (राइबुलोज-1,5-बिसफॉस्फेट कार्बोक्सिलेज-ऑक्सीजिनेज)।",
        dialectTranslation: "रूबिस्को एंजाइम वायुमंडलीय CO2 को शर्करा में परिवर्तित करने का मुख्य वाहक है।"
      }
    ];
  }

  if (norm.startsWith('bn')) {
    return [
      {
        id: 1,
        topic: "ক্লোরোপ্লাস্ট জীববিজ্ঞান",
        frontQuestion: "সবুজ উদ্ভিদে সালোকসংশ্লেষ কোন কোষীয় অঙ্গাণুতে ঘটে?",
        backAnswer: "ক্লোরোপ্লাস্ট, যার মধ্যে থাইলাকয়েড ও ক্লোরোফিল রঞ্জক থাকে।",
        dialectTranslation: "ক্লোরোপ্লাস্টেই উদ্ভিদের সমস্ত খাদ্য তৈরি হয়।"
      },
      {
        id: 2,
        topic: "জলের আলোক বিশ্লেষণ",
        frontQuestion: "জলের অণু ভাঙলে কোন প্রয়োজনীয় গ্যাস বাতাসে মুক্ত হয়?",
        backAnswer: "অক্সিজেন গ্যাস (O2), যা পৃথিবীর সমস্ত প্রাণীর শ্বাসকার্যে লাগে।",
        dialectTranslation: "জল ভেঙে জীবনদায়ী অক্সিজেন গ্যাস বাতাসে ছড়ায়।"
      },
      {
        id: 3,
        topic: "রুবিসকো উৎসেচক",
        frontQuestion: "কার্বন সংবন্ধনে যুক্ত পৃথিবীর সবচেয়ে প্রাচুর্যময় প্রোটিন কোনটি?",
        backAnswer: "RuBisCO (রাইবুলোজ-১,৫-বিসফসফেট কার্বক্সিলেজ)।",
        dialectTranslation: "রুবিসকো হলো বাতাসের কার্বন বাঁধার সবচেয়ে প্রধান উৎসেচক।"
      }
    ];
  }

  if (norm.startsWith('ta')) {
    return [
      {
        id: 1,
        topic: "பசுங்கணிக உயிரியல்",
        frontQuestion: "பச்சைத் தாவரங்களில் ஒளிச்சேர்க்கை நடைபெறும் செல்லுறுப்பு எது?",
        backAnswer: "பசுங்கணிகம் (Chloroplast), தைலகாய்டுகள் மற்றும் பச்சைய நிறமிகளைக் கொண்டது.",
        dialectTranslation: "பசுங்கணிகத்தில் தான் தாவரத்திற்கான முழு உணவும் சமைக்கப்படுகிறது."
      },
      {
        id: 2,
        topic: "நீர் ஒளிச்சிதைவு",
        frontQuestion: "நீர் மூலக்கூறுகள் உடையும் போது வெளிவரும் துணை வாயு எது?",
        backAnswer: "ஆக்சிஜன் வாயு (O2), இது நாம் சுவாசிக்க உதவுகிறது.",
        dialectTranslation: "நீர் மூலக்கூறு சிதைந்து தான் நமக்கு தேவையான ஆக்சிஜன் கிடைக்கிறது."
      },
      {
        id: 3,
        topic: "ரூபிஸ்கோ நொதி",
        frontQuestion: "பூமியில் அதிகளவில் காணப்படும் கார்பன் நிலைநிறுத்தும் புரதம் எது?",
        backAnswer: "RuBisCO (ரிபுலோஸ்-1,5-பிஸ்பாஸ்பேட் கார்பாக்சிலேஸ்).",
        dialectTranslation: "ரூபிஸ்கோ நொதி காற்றில் உள்ள கார்பனை நிலைநிறுத்துகிறது."
      }
    ];
  }

  if (norm.startsWith('te')) {
    return [
      {
        id: 1,
        topic: "హరితరేణువు జీవశాస్త్రం",
        frontQuestion: "మొక్కల కణాలలో కిరణజన్య సంయోగక్రియ ఏ అవయవంలో జరుగుతుంది?",
        backAnswer: "హరితరేణువు (Chloroplast), ఇందులో క్లోరోఫిల్ వర్ణద్రవ్యం ఉంటుంది.",
        dialectTranslation: "హరితరేణువులోనే మొక్కలకు కావలసిన ఆహారం తయారవుతుంది."
      },
      {
        id: 2,
        topic: "నీటి కాంతి విశ్లేషణ",
        frontQuestion: "నీరు విచ్ఛిన్నమైనప్పుడు విడుదలయ్యే జీవవాయువు ఏది?",
        backAnswer: "ఆక్సిజన్ వాయువు (O2), ఇది జీవుల శ్వాసక్రియకు ఆధారం.",
        dialectTranslation: "నీటి విశ్లేషణ ద్వారానే మనకు ప్రాణవాయువు ఆక్సిజన్ లభిస్తుంది."
      },
      {
        id: 3,
        topic: "రుబిస్కో ఎంజైమ్",
        frontQuestion: "భూమిపై అత్యధికంగా లభించే కార్బన్ స్థాపక ప్రోటీన్ ఏది?",
        backAnswer: "రుబిస్కో (RuBisCO) ఎంజైమ్.",
        dialectTranslation: "రుబిస్కో ఎంజైమ్ వాతావరణంలోని కార్బన్‌ను బంధిస్తుంది."
      }
    ];
  }

  if (norm.startsWith('mr')) {
    return [
      {
        id: 1,
        topic: "हरितलवक रचना",
        frontQuestion: "वनस्पतींमध्ये प्रकाशसंश्लेषण नेमके कोणत्या पेशीअंगकात घडते?",
        backAnswer: "हरितलवक (Chloroplast), ज्यामध्ये क्लोरोफिल रंगद्रव्य असते.",
        dialectTranslation: "हरितलवकात झाडांचे अन्न तयार होते."
      },
      {
        id: 2,
        topic: "पाण्याचे प्रकाश विघटन",
        frontQuestion: "पाणी तुटल्यावर कोणता जीवनदायी वायू बाहेर पडतो?",
        backAnswer: "ऑक्सिजन वायू (O2), जो सजीवांच्या श्वासासाठी आवश्यक आहे.",
        dialectTranslation: "पाणी तुटल्यामुळे हवेत ऑक्सिजन वायू येतो."
      },
      {
        id: 3,
        topic: "रूबिस्को एंझाइम",
        frontQuestion: "पृथ्वीवर सर्वाधिक प्रमाणात आढळणारे कार्बन जोडणारे प्रथिन कोणते?",
        backAnswer: "RuBisCO (रूबिस्को) एंझाइम.",
        dialectTranslation: "रूबिस्को एंझाइम हवेतील कार्बन डायऑक्साइड शोषून घेतो."
      }
    ];
  }

  if (norm.startsWith('gu')) {
    return [
      {
        id: 1,
        topic: "હરિતકણ રચના",
        frontQuestion: "વનસ્પતિ કોષમાં પ્રકાશસંશ્લેષણ કઈ અંગિકામાં થાય છે?",
        backAnswer: "હરિતકણ (Chloroplast), જેમાં ક્લોરોફિલ દ્રવ્ય હોય છે.",
        dialectTranslation: "હરિતકણમાં જ છોડનો ખોરાક તૈયાર થાય છે."
      },
      {
        id: 2,
        topic: "પાણીનું પ્રકાશ વિઘટન",
        frontQuestion: "પાણી તૂટવાથી કયો પ્રાણવાયુ વાતાવરણમાં મુક્ત થાય છે?",
        backAnswer: "ઓક્સિજન વાયુ (O2), જે જીવોને શ્વાસ લેવા માટે મળે છે.",
        dialectTranslation: "પાણીનું વિઘટન થવાથી આપણને પ્રાણવાયુ ઓક્સિજન મળે છે."
      },
      {
        id: 3,
        topic: "રુબિસ્કો ઉત્સેચક",
        frontQuestion: "પૃથ્વી પર સૌથી વધુ મળતું કાર્બન સ્થાપન કરતું પ્રોટીન કયું છે?",
        backAnswer: "RuBisCO (રુબિસ્કો ઉત્સેચક).",
        dialectTranslation: "રુબિસ્કો ઉત્સેચક વાતાવરણનો કાર્બન જોડવાનું કામ કરે છે."
      }
    ];
  }

  if (norm.startsWith('es')) {
    return [
      {
        id: 1,
        topic: "Biología del Cloroplasto",
        frontQuestion: "¿Qué orgánulo celular realiza la fotosíntesis en las plantas?",
        backAnswer: "El Cloroplasto, que contiene tilacoides y pigmento clorofila.",
        dialectTranslation: "El cloroplasto es la fábrica celular donde se genera el alimento vegetal."
      },
      {
        id: 2,
        topic: "Fotólisis del Agua",
        frontQuestion: "¿Qué gas vital se libera cuando la luz rompe las moléculas de agua?",
        backAnswer: "Gas oxígeno (O2), que sustenta la respiración aeróbica en la Tierra.",
        dialectTranslation: "La ruptura del agua genera el oxígeno puro que respiramos."
      },
      {
        id: 3,
        topic: "Enzima RuBisCO",
        frontQuestion: "¿Cuál es la proteína más abundante en la Tierra para fijar carbono?",
        backAnswer: "RuBisCO (Ribuiosa-1,5-bisfosfato carboxilasa-oxigenasa).",
        dialectTranslation: "RuBisCO captura el CO2 atmosférico para sintetizar azúcares."
      }
    ];
  }

  // Fallback: English
  return [
    {
      id: 1,
      topic: "Chloroplast Biology",
      frontQuestion: "Which cellular organelle conducts photosynthesis in green plants?",
      backAnswer: "The Chloroplast, containing thylakoids and chlorophyll pigment.",
      dialectTranslation: "Chloroplast is the cellular powerhouse that synthesizes organic food from sunlight."
    },
    {
      id: 2,
      topic: "Photolysis Reaction",
      frontQuestion: "What byproduct gas is released when water molecules are split by light?",
      backAnswer: "Oxygen gas (O2), which sustains aerobic terrestrial life.",
      dialectTranslation: "Water splitting directly generates the oxygen gas required for aerobic life."
    },
    {
      id: 3,
      topic: "RuBisCO Enzyme",
      frontQuestion: "What is the most abundant protein on Earth involved in carbon fixation?",
      backAnswer: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).",
      dialectTranslation: "RuBisCO is the primary enzyme responsible for fixing inorganic CO2 into organic sugars."
    }
  ];
}

/**
 * ============================================================================
 * 4. LOCALIZED DIAGRAM VISION ANALYSES
 * ============================================================================
 */
export function getLocalizedDiagram(langId: string): DiagramAnalysis {
  const norm = langId.toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return {
      diagramTitle: "जल चक्र एवं वर्षा प्रणाली (Water Cycle)",
      subject: "जल विज्ञान एवं पर्यावरण",
      summary: "सूरज के गरमी से पानी के वाष्पीकरण, बादर बने के संघनन, बारिश आ भूजल रिसाव के पूरा सचित्र चक्र।",
      components: [
        {
          name: "सौर वाष्पीकरण (Evaporation)",
          functionDescription: "सूरज के गरमी से नदी आ समुंदर के पानी भाप बन के आसमान में उड़ेला।",
          visualLocation: "निचला बायाँ हिस्सा - समुंदर व जलाशय"
        },
        {
          name: "पेड़-पौधा के वाष्पोत्सर्जन (Transpiration)",
          functionDescription: "जंगल के पेड़ आपन पतई से पानी भाप बना के हवा में छोड़ेलें।",
          visualLocation: "बीच वाला हिस्सा - जंगल आ पहाड़"
        },
        {
          name: "आसमान में संघनन (Condensation)",
          functionDescription: "ऊपर जाके भाप ठंडा हो जाला आ छोट-छोट बूंद जुड़ के बादर बनावेला।",
          visualLocation: "ऊपरी मध्य - नीला आ सफेद बादर"
        },
        {
          name: "वर्षा एवं हिमपात (Precipitation)",
          functionDescription: "जब बादर भारी हो जाला त पानी भा बर्फ बन के धरती पर गिरेला।",
          visualLocation: "पहाड़ के ढलान पर बरसती बूंदें"
        },
        {
          name: "भूजल रिसाव एवं सतही बहाव (Runoff)",
          functionDescription: "बारिश के पानी नदी से हो के समुंदर में जाला आ कुछ जमीन में सोख लेवेला।",
          visualLocation: "निचला हिस्सा - नदी आ भूमिगत जल"
        }
      ],
      stepByStepProcess: [
        "१. सूरज के घाम से समुंदर आ पोखरा के पानी भाप बन के ऊपर उड़ेला।",
        "२. आसमान के ऊंचाई पर तापमान कम होखला से भाप ठंडा हो के बादर बन जाला।",
        "३. बादर जब बहुत घन आ भारी हो जाला त झमाझम बारिश होके गिरेला।",
        "४. पानी फिर से नदी-नालों से हो के समुंदर में चल जाला आ चक्र चलत रहेला।"
      ],
      explanationInLanguage: "ई चित्र जल चक्र (Water Cycle) देखावेला। सूरज के गरमी से नदी-पोखरा के पानी भाप बन के ऊपर उड़ेला, फिर आसमान में ठंडा हो के बादर बनेला, आ बादर से बारिश बन के फिर धरती पर लवटेला।"
    };
  }

  if (norm.startsWith('hi-awadhi')) {
    return {
      diagramTitle: "जल चक्र अउर बारिश के प्रक्रिया (Water Cycle)",
      subject: "पर्यावरण अउर भूगोल",
      summary: "सूरज के धूप से पानी के भाप बनै, आसमान में बादर बनै अउर अमृत समान बारिश गिरै के चित्र।",
      components: [
        {
          name: "सूरज से वाष्पीकरण",
          functionDescription: "धूप से नदी, तालाब अउर समुंदर के पानी भाप बन के ऊपर उठत है।",
          visualLocation: "बायाँ कोना - तालाब अउर समुंदर"
        },
        {
          name: "पौधा के वाष्पोत्सर्जन",
          functionDescription: "पेड़-पौधा आपन पत्ता से नमी हवा में छोड़त हैं।",
          visualLocation: "बीच के पेड़-पौधा"
        },
        {
          name: "आसमान में बादर बनब (संघनन)",
          functionDescription: "भाप ऊपर जाके ठंडा होत है अउर बादर बन जात है।",
          visualLocation: "ऊपर आसमान में बादर"
        },
        {
          name: "झमाझम बारिश (Precipitation)",
          functionDescription: "बादर भारी होवै पर पानी जमीन पर बरस पड़त है।",
          visualLocation: "बरसात के बूँदें"
        },
        {
          name: "जमीन में रिसाव",
          functionDescription: "पानी नदी से समुंदर जात है अउर कुआँ-पाताल भरत है।",
          visualLocation: "धरती के निचला तल"
        }
      ],
      stepByStepProcess: [
        "१. सूरज के धूप से जल भाप बन के आसमान जात है।",
        "२. आसमान में ठंडा होवै से बड़े-बड़े बादर बनत हैं।",
        "३. बादर से धरती पर बारिश होत है।",
        "४. पानी फिर नदी से समुंदर में लवट जात है।"
      ],
      explanationInLanguage: "ई चित्र जल चक्र देखावत है। सूरज के धूप से नदी-तालाब के पानी भाप बन के ऊपर उड़त है, फिर आसमान में ठंडा हो के बादर बनत है, अउर बादर से बारिश बन के फेर धरती पर बरस पड़त है।"
    };
  }

  if (norm.startsWith('hi')) {
    return {
      diagramTitle: "वायुमंडलीय जल चक्र एवं वर्षण गतिशीलता",
      subject: "जल विज्ञान एवं पृथ्वी विज्ञान",
      summary: "सौर तापीय वाष्पीकरण, बादलों का संघनन, वर्षण चक्र तथा भूजल पुनर्भरण की वैज्ञानिक रूपरेखा।",
      components: [
        {
          name: "सौर तापीय वाष्पीकरण (Evaporation)",
          functionDescription: "सौर ऊर्जा जल निकायों के तरल अणुओं को गैसीय वाष्प में परिवर्तित करती है।",
          visualLocation: "निचला बायाँ भाग - महासागर एवं जलाशय"
        },
        {
          name: "पादप वाष्पोत्सर्जन (Transpiration)",
          functionDescription: "पादपों के रंध्रों द्वारा मृदा की नमी वायुमंडल में वाष्प के रूप में मुक्त होती है।",
          visualLocation: "मध्य भाग - स्थलीय वनस्पति"
        },
        {
          name: "ऊपरी क्षोભमंडल में संघनन (Condensation)",
          functionDescription: "तापमान में गिरावट से जलवाष्प संघनित होकर मेघों का निर्माण करती है।",
          visualLocation: "ऊपरी मध्य ऊंचाई - सघन बादल"
        },
        {
          name: "वर्षण एवं हिमपात (Precipitation)",
          functionDescription: "गुरुत्वाकर्षण के प्रभाव में संघनित जल वर्षा या हिम के रूप में धरातल पर गिरता है।",
          visualLocation: "पर्वतीय ढलान एवं वर्षा की बूंदें"
        },
        {
          name: "जलभृत अंतःस्यंदन एवं सतही अपवाह (Runoff)",
          functionDescription: "वर्षा जल नदियों के माध्यम से सागर में लौटता है और भूजल स्तर को रिचार्ज करता है।",
          visualLocation: "उपसतही चट्टानी परत एवं नदियां"
        }
      ],
      stepByStepProcess: [
        "१. सौर विकिरण से जल निकायों का तापमान बढ़ता है और वाष्पीकरण होता है।",
        "२. ऊपर उठती जलवाष्प ठंडी होकर सघन बादलों का रूप धारण करती है।",
        "३. गुरुत्वाकर्षण के प्रभाव से बूंदें वर्षा के रूप में धरातल पर गिरती हैं।",
        "४. सतही जल नदियों द्वारा पुनः महासागरों में लौट जाता है।"
      ],
      explanationInLanguage: "यह चित्र जल चक्र को स्पष्ट करता है। सूर्य की ऊष्मा से नदियों और समुद्र का पानी वाष्प बनकर ऊपर उठता है, आकाश में ठंडा होकर बादल बनता है, और वर्षा बनकर पुनः पृथ्वी पर लौटता है।"
    };
  }

  if (norm.startsWith('bn')) {
    return {
      diagramTitle: "বায়ুমণ্ডলীয় জলচক্র ও বৃষ্টিপাত গতিপ্রকৃতি",
      subject: "হাইড্রোলজি ও পরিবেশ বিজ্ঞান",
      summary: "সৌর বাষ্পীভবন, মেঘের ঘনীভবন, বৃষ্টিপাত এবং ভূগর্ভস্থ জল পুনর্ভরণের সচিত্র প্রাকৃতিক রূপরেখা।",
      components: [
        {
          name: "সৌর বাষ্পীভবন (Evaporation)",
          functionDescription: "সূর্যের উত্তাপে নদী ও সমুদ্রের জল বাষ্পীভূত হয়ে আকাশে ওঠে।",
          visualLocation: "নীচের বাঁদিক - সমুদ্র ও জলাশয়"
        },
        {
          name: "উদ্ভিদের প্রস্বেদন (Transpiration)",
          functionDescription: "গাছপালার পাতার মাধ্যমে অতিরিক্ত জল বাষ্প হিসেবে বায়ুমণ্ডলে ছড়ায়।",
          visualLocation: "মাঝের অরণ্য ও বনভূমি"
        },
        {
          name: "বায়ুমণ্ডলে ঘনীভবন (Condensation)",
          functionDescription: "উপরে উঠে জলীয় বাষ্প ঠান্ডা হয়ে মেঘ সৃষ্টি করে।",
          visualLocation: "উপরের মেঘমালা"
        },
        {
          name: "বৃষ্টিপাত (Precipitation)",
          functionDescription: "মেঘ ভারী হলে মাধ্যাকর্ষণের টানে বৃষ্টি বা তুষার রূপে মাটিতে ঝরে পড়ে।",
          visualLocation: "পাহাড়ের ঢাল ও বৃষ্টির ফোঁটা"
        },
        {
          name: "ভূগর্ভস্থ অনুপ্রবেশ ও জলপ্রবাহ (Runoff)",
          functionDescription: "বৃষ্টির জল নদীর মাধ্যমে সমুদ্রে মেশে এবং মাটির তলার জলস্তর বাড়ায়।",
          visualLocation: "ভূগর্ভস্থ শিলাস্তর ও নদী"
        }
      ],
      stepByStepProcess: [
        "১. সূর্যের তাপে সমুদ্র ও জলাশয়ের জল বাষ্পীভূত হয়।",
        "২. জলীয় বাষ্প উপরে উঠে শীতল হয়ে মেঘ গঠন করে।",
        "৩. ঘনীভূত ফোঁটাগুলি বৃষ্টির আকারে মাটিতে নেমে আসে।",
        "৪. নদীর জল আবার সমুদ্রে ফিরে যায় এবং প্রাকৃতিক চক্র পূর্ণ হয়।"
      ],
      explanationInLanguage: "এই চিত্রটি পৃথিবীর জলচক্র (Water Cycle) প্রদর্শন করে। সূর্যের তাপে নদী-সমুদ্রের জল বাষ্প হয়ে আকাশে ওঠে, ঘনীভূত হয়ে মেঘ তৈরি করে এবং বৃষ্টির মাধ্যমে আবার পৃথিবীতে ফিরে আসে।"
    };
  }

  if (norm.startsWith('ta')) {
    return {
      diagramTitle: "வளிமண்டல நீர் சுழற்சி மற்றும் மழைப்பொழிவு இயல்பு",
      subject: "நீரியல் மற்றும் புவி அறிவியல்",
      summary: "சூரிய வெப்ப ஆவியாதல், மேகங்களின் ஒடுக்கம், மழைப்பொழிவு மற்றும் நிலத்தடி நீர் செறிவூட்டல் வரைபடம்.",
      components: [
        {
          name: "சூரிய வெப்ப ஆவியாதல் (Evaporation)",
          functionDescription: "சூரிய வெப்பத்தால் கடல் மற்றும் நீர்நிலைகளில் உள்ள நீர் நீராவியாக மேலே எழுகிறது.",
          visualLocation: "கீழ் இடதுபுறம் - கடல் மற்றும் நீர்த்தேக்கம்"
        },
        {
          name: "தாவர நீராவிப்போக்கு (Transpiration)",
          functionDescription: "மரங்கள் மற்றும் தாவரங்கள் இலைத்துளைகள் வழியாக ஈரப்பதத்தை காற்றில் வெளியிடுகின்றன.",
          visualLocation: "நடுப்பகுதி - காடுகள்"
        },
        {
          name: "மேக ஒடுக்கம் (Condensation)",
          functionDescription: "உயரே செல்லும் நீராவி குளிர்ந்து அடர்த்தியான மேகங்களாக மாறுகிறது.",
          visualLocation: "மேல் பகுதி - குளிர்ந்த மேகங்கள்"
        },
        {
          name: "மழைப்பொழிவு (Precipitation)",
          functionDescription: "மேகங்கள் குளிர்ந்து நீர்த்துளிகளாக நிலத்தில் மழையாகப் பொழிகிறது.",
          visualLocation: "மலைச்சரிவு மற்றும் மழைத்துளிகள்"
        },
        {
          name: "நிலத்தடி நீர் ஊடுருவல் (Runoff)",
          functionDescription: "மழைநீர் ஆறுகள் வழியாக கடலுக்குச் சென்று நிலத்தடி நீரை புதுப்பிக்கிறது.",
          visualLocation: "நிலத்தடி அடுக்கு மற்றும் ஆறுகள்"
        }
      ],
      stepByStepProcess: [
        "1. சூரிய வெப்பத்தால் நீர்நிலைகளின் நீர் நீராவியாக மாறுகிறது.",
        "2. குளிர்ந்த வளிமண்டலத்தில் நீராவி மேகங்களாக மாறுகிறது.",
        "3. ஈர்ப்பு விசையால் மேகங்கள் மழையாக பொழிகிறது.",
        "4. ஆறுகள் வழியாக நீர் மீண்டும் கடலை சென்றடைகிறது."
      ],
      explanationInLanguage: "இந்த படம் நீர் சுழற்சியை (Water Cycle) விளக்குகிறது. சூரிய வெப்பத்தால் ஏரி, கடல் நீர் ஆவியாகி மேலே சென்று, குளிர்ந்து மேகமாகி, மீண்டும் மழையாக பூமிக்கு திரும்பி வருகிறது."
    };
  }

  if (norm.startsWith('te')) {
    return {
      diagramTitle: "వాతావరణ నీటి చక్రం మరియు వర్షపాతం",
      subject: "జల విజ్ఞానం మరియు భూగోళ శాస్త్రం",
      summary: "సౌర బాష్పీభవనం, మేఘాల సాంద్రీకరణ, వర్షపాతం మరియు భూగర్భ జలాల పునరుద్ధరణ చక్రం.",
      components: [
        {
          name: "సౌర బాష్పీభవనం (Evaporation)",
          functionDescription: "సూర్యరశ్మి వేడికి సముద్రాలు, నదుల నీరు ఆవిరిగా మారి పైకి లేస్తుంది.",
          visualLocation: "ఎడమ దిగువ - సముద్రాలు"
        },
        {
          name: "మొక్కల భాష్పోత్సేకం (Transpiration)",
          functionDescription: "చెట్లు తమ ఆకుల ద్వారా నీటిని ఆవిరి రూపంలో వాతావరణంలోకి వదులుతాయి.",
          visualLocation: "మధ్య ప్రాంతం - అడవులు"
        },
        {
          name: "సాంద్రీకరణం (Condensation)",
          functionDescription: "పైకి వెళ్ళిన ఆవిరి చల్లబడి మేఘాలుగా మారుతుంది.",
          visualLocation: "ఎగువ ఆకాశం - మేఘాలు"
        },
        {
          name: "వర్షపాతం (Precipitation)",
          functionDescription: "మేఘాలు బరువెక్కి వర్షం లేదా మంచు రూపంలో భూమిపై పడతాయి.",
          visualLocation: "వర్షపు బిందువులు"
        },
        {
          name: "భూగర్భ జలాలు మరియు ప్రవాహం",
          functionDescription: "వర్షపు నీరు నదుల ద్వారా సముద్రంలో చేరి భూగర్భ జలాలను పెంచుతుంది.",
          visualLocation: "భూగర్భ పొర మరియు నదులు"
        }
      ],
      stepByStepProcess: [
        "1. సూర్యకాంతి వేడి వల్ల నీరు ఆవిరిగా మారుతుంది.",
        "2. ఆకాశంలో నీటి ఆవిరి చల్లబడి దట్టమైన మేఘాలుగా మారుతుంది.",
        "3. మేఘాల నుండి వర్షం భూమిపై కురుస్తుంది.",
        "4. నదుల ద్వారా నీరు తిరిగి సముద్రాలకు చేరుతుంది."
      ],
      explanationInLanguage: "ఈ చిత్రం నీటి చక్రాన్ని (Water Cycle) వివరిస్తుంది. సూర్యుని వేడి వల్ల నదులు, సముద్రాల నీరు ఆవిరై పైకి వెళ్లి, చల్లబడి మేఘాలుగా మారి, తిరిగి వర్షంగా భూమిపైకి వస్తుంది."
    };
  }

  if (norm.startsWith('mr')) {
    return {
      diagramTitle: "जलचक्र आणि पर्जन्य प्रणाली (Water Cycle)",
      subject: "पर्यावरण आणि जलविज्ञान",
      summary: "सूर्याच्या उष्णतेने पाण्याचे बाष्पीभवन, ढगांचे संघनन, पाऊस आणि भूजल संचय.",
      components: [
        {
          name: "सौर बाष्पीभवन (Evaporation)",
          functionDescription: "सूर्याच्या उन्हाने नद्या व समुद्राचे पाणी वाफ होऊन आकाशात जाते.",
          visualLocation: "खाली डावीकडे - समुद्र आणि तलाव"
        },
        {
          name: "वनस्पतींचे बाष्पोत्सर्जन",
          functionDescription: "झाडे पानांमधून अतिरिक्त पाणी वाफेच्या रूपात हवेत सोडतात.",
          visualLocation: "मध्यभागी - झाडे आणि जंगल"
        },
        {
          name: "ढगांचे संघनन (Condensation)",
          functionDescription: "वर गेलेली वाफ थंड होऊन पाण्याचे थेंब आणि ढग तयार होतात.",
          visualLocation: "वर आकाशात - ढग"
        },
        {
          name: "पर्जन्यवृष्टी (Precipitation)",
          functionDescription: "ढग जड झाल्यावर पावसाच्या थेंबांच्या रूपात पाणी जमिनीवर पडते.",
          visualLocation: "पावसाच्या धारा"
        },
        {
          name: "भूजल पुनर्भरण आणि प्रवाह",
          functionDescription: "पावसाचे पाणी नद्यांमधून समुद्राला मिळते आणि जमिनीत मुरते.",
          visualLocation: "जमिनीखालचा पाण्याचा साठा"
        }
      ],
      stepByStepProcess: [
        "१. सूर्याच्या उष्णतेने पाण्याचे बाष्पीभवन होते.",
        "२. वाफ वर जाऊन थंड होते आणि ढग तयार होतात.",
        "३. ढगांमधून जमिनीवर पाऊस पडतो.",
        "४. पाणी परत नद्यांद्वारे समुद्रात वाहून जाते."
      ],
      explanationInLanguage: "हे चित्र जलचक्र (Water Cycle) स्पष्ट करते. सूर्याच्या उष्णतेने नद्या-समुद्राचे पाणी वाफ होऊन वर जाते, ढग बनतात आणि पावसाच्या रूपात पुन्हा जमिनीवर परत येते."
    };
  }

  if (norm.startsWith('gu')) {
    return {
      diagramTitle: "જળચક્ર અને વરસાદી પ્રક્રિયા (Water Cycle)",
      subject: "પર્યાવરણ અને ભૂગોળ",
      summary: "સૂર્યની ગરમીથી બાષ્પીભવન, વાદળોનું સંઘનન, વરસાદ અને ભૂગર્ભ જળ રિચાર્જ.",
      components: [
        {
          name: "સૂર્યથી બાષ્પીભવન (Evaporation)",
          functionDescription: "તડકાથી નદી-સમુદ્રનું પાણી વરાળ બનીને આકાશમાં ચડે છે.",
          visualLocation: "નીચે ડાબી બાજુ - સમુદ્ર"
        },
        {
          name: "વનસ્પતિઓનું બાષ્પોત્સર્જન",
          functionDescription: "ઝાડવાં પોતાના પાંદડામાંથી પાણીની વરાળ હવામાં મુક્ત કરે છે.",
          visualLocation: "વચ્ચે - વનસ્પતિ અને જંગલ"
        },
        {
          name: "વાદળોનું સંઘનન (Condensation)",
          functionDescription: "ઊંચે જઈ વરાળ ઠંડી પડે છે અને ઘેરા વાદળો રચાય છે.",
          visualLocation: "ઉપર આકાશમાં વાદળ"
        },
        {
          name: "વરસાદ (Precipitation)",
          functionDescription: "વાદળ ભારે થાય ત્યારે જમીન પર વરસાદ રૂપે વરસે છે.",
          visualLocation: "વરસાદના ટીપાં"
        },
        {
          name: "જમીનમાં ઉતરાણ અને નદી પ્રવાહ",
          functionDescription: "વરસાદી પાણી નદીઓ દ્વારા પાછું દરિયામાં જાય છે અને જમીનમાં ઉતરે છે.",
          visualLocation: "ભૂગર્ભ જળસ્તર અને નદી"
        }
      ],
      stepByStepProcess: [
        "૧. સૂર્યની ગરમીથી પાણીની વરાળ બને છે.",
        "૨. વરાળ આકાશમાં ઠંડી પડી વાદળ બને છે.",
        "૩. વાદળમાંથી પૃથ્વી પર વરસાદ વરસે છે.",
        "૪. નદી દ્વારા પાણી પાછું દરિયામાં પહોંચી ચક્ર પૂરું કરે છે."
      ],
      explanationInLanguage: "આ ચિત્ર જળચક્ર (Water Cycle) દર્શાવે છે. સૂર્યની ગરમીથી પાણી વરાળ બનીને ઊંચે જાય છે, ઠંડુ પડી વાદળ બને છે અને વરસાદ બનીને પાછું ધરતી પર આવે છે."
    };
  }

  if (norm.startsWith('es')) {
    return {
      diagramTitle: "Ciclo Atmosférico del Agua y Dinámica de Precipitación",
      subject: "Hidrología y Ciencias de la Tierra",
      summary: "Esquema integral que ilustra la evaporación solar, condensación de nubes, precipitación e infiltración.",
      components: [
        {
          name: "Evaporación Térmica Solar",
          functionDescription: "La energía térmica convierte el agua líquida en vapor suspendido.",
          visualLocation: "Océano y embalse inferior izquierdo"
        },
        {
          name: "Transpiración Biológica",
          functionDescription: "Las plantas liberan humedad del suelo hacia la atmósfera por sus estomas.",
          visualLocation: "Bosque terrestre de nivel medio"
        },
        {
          name: "Condensación Troposférica",
          functionDescription: "El enfriamiento del vapor genera nubes densas.",
          visualLocation: "Altitud media superior"
        },
        {
          name: "Precipitación y Lluvia",
          functionDescription: "La humedad saturada cae por gravedad como lluvia o nieve.",
          visualLocation: "Laderas y gotas de lluvia"
        },
        {
          name: "Infiltración y Escorrentía",
          functionDescription: "El agua fluye por los ríos hacia el océano y nutre los acuíferos subterráneos.",
          visualLocation: "Capa rocosa subterránea y cuencas"
        }
      ],
      stepByStepProcess: [
        "1. La radiación solar evapora el agua líquida de mares y ríos.",
        "2. El vapor ascendente se enfría y forma nubes condensadas.",
        "3. La gravedad hace caer las gotas en forma de lluvia.",
        "4. Los ríos devuelven el agua dulce al océano para reiniciar el ciclo."
      ],
      explanationInLanguage: "Este diagrama muestra el Ciclo del Agua. La energía del Sol evapora el agua de mares y ríos, asciende al cielo formando nubes, y luego regresa en forma de lluvia."
    };
  }

  // Fallback: English
  return {
    diagramTitle: "Atmospheric Water Cycle & Precipitation Dynamics",
    subject: "Hydrology & Earth Science",
    summary: "Comprehensive schematic diagram mapping solar thermal evaporation, condensation cloud development, atmospheric precipitation, and soil infiltration loops.",
    components: [
      {
        name: "Solar Thermal Evaporation",
        functionDescription: "Thermal radiative energy converts liquid water molecules into airborne gaseous moisture.",
        visualLocation: "Lower left ocean and surface reservoir"
      },
      {
        name: "Biological Transpiration",
        functionDescription: "Plant vascular xylem channels soil moisture through leaf stomata into the atmosphere.",
        visualLocation: "Mid-level terrestrial forest"
      },
      {
        name: "Upper Tropospheric Condensation",
        functionDescription: "Temperature drop forces vapor molecules to coalesce around airborne particulates, generating cumulus clouds.",
        visualLocation: "Upper central altitude"
      },
      {
        name: "Orographic Precipitation",
        functionDescription: "Saturated moisture falls under gravitational acceleration as rainfall or snowfall.",
        visualLocation: "Mountain peak downwind slopes"
      },
      {
        name: "Aquifer Infiltration & Surface Runoff",
        functionDescription: "Gravity guides freshwater runoff into river drainage basins, replenishing groundwater tables.",
        visualLocation: "Subsurface bedrock layer"
      }
    ],
    stepByStepProcess: [
      "Solar radiation transfers heat energy to water bodies and vegetation.",
      "Ascending water vapor cools rapidly at higher altitudes.",
      "Condensed droplets coalesce into dense storm clouds.",
      "Precipitation returns liquid freshwater back to continental aquifers and oceans."
    ],
    explanationInLanguage: "This diagram shows the Water Cycle. Heat from the sun evaporates water from rivers and oceans into vapor, which cools into clouds and returns to earth as fresh precipitation."
  };
}

/**
 * ============================================================================
 * 5. LOCALIZED QUICK DOUBT CHIPS (For Voice AI Chat in MainDashboard)
 * ============================================================================
 */
export function getLocalizedQuickDoubts(langId: string): { label: string; query: string }[] {
  const norm = langId.toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return [
      { label: "प्रकाश संश्लेषण", query: "सर जी, प्रकाश संश्लेषण (Photosynthesis) कइसे काम करेला? हमनी के गँवई भाषा में समझाईं।" },
      { label: "गुरुत्वाकर्षण नियम", query: "न्यूटन के गुरुत्वाकर्षण (Gravity) कइसे काम करेला? ई काहे जरूरी बा?" },
      { label: "विद्युत धारा", query: "तार में बिजली (Electric Current) कइसे दौड़ेला? आसान भाखा में बताईं।" },
      { label: "हमार शरीर के दिल", query: "हमनी के दिल (Human Heart) २४ घंटा खून कइसे पम्प करेला?" }
    ];
  }

  if (norm.startsWith('hi-awadhi')) {
    return [
      { label: "प्रकाश संश्लेषण", query: "गुरुजी, प्रकाश संश्लेषण (Photosynthesis) का होत है? हमार अवधी भाषा में समझाई देव।" },
      { label: "न्यूटन के गति नियम", query: "न्यूटन के गति के नियम का होत हैं? आसान उदाहरण से बताव।" },
      { label: "सौरमंडल के ग्रह", query: "सौरमंडल के ग्रह सूरज के चारों ओर कइसे घूमत हैं?" },
      { label: "मानव पाचन तंत्र", query: "हम जो खाना खात हैं, वो पेट में कइसे पचत है?" }
    ];
  }

  if (norm.startsWith('hi')) {
    return [
      { label: "प्रकाश संश्लेषण", query: "प्रकाश संश्लेषण (Photosynthesis) की पूरी क्रियाविधि आसान शब्दों में समझाइए।" },
      { label: "न्यूटन के नियम", query: "न्यूटन के गति के तीनों नियम और दैनिक जीवन में उनके उदाहरण समझाइए।" },
      { label: "विद्युत धारा व परिपथ", query: "विद्युत धारा (Electric Current) और प्रतिरोध (Resistance) कैसे काम करते हैं?" },
      { label: "मानव हृदय की संरचना", query: "मानव हृदय का रक्त परिसंचरण तंत्र कैसे कार्य करता है?" }
    ];
  }

  if (norm.startsWith('bn')) {
    return [
      { label: "সালোকসংশ্লেষ", query: "দাদা, উদ্ভিদের সালোকসংশ্লেষ (Photosynthesis) প্রক্রিয়াটি সহজ বাংলায় বুঝিয়ে বলুন।" },
      { label: "নিউটনের গতিসূত্র", query: "নিউটনের তিনটি গতিসূত্র দৈনন্দিন জীবনের উদাহরণ দিয়ে বোঝান।" },
      { label: "রক্ত সংবহন তন্ত্র", query: "মানুষের হৃৎপিণ্ড কীভাবে অবিরাম রক্ত পাম্প করে শরীর সচল রাখে?" },
      { label: "সৌরজগতের গ্রহমণ্ডলী", query: "সূর্যের মহাকর্ষ বলে গ্রহগুলো কীভাবে নিজ কক্ষপথে ঘোরে?" }
    ];
  }

  if (norm.startsWith('ta')) {
    return [
      { label: "ஒளிச்சேர்க்கை", query: "சார், தாவரங்களின் ஒளிச்சேர்க்கை (Photosynthesis) முறையை எளிய தமிழில் விளக்குங்கள்." },
      { label: "நியூட்டனின் விதிகள்", query: "நியூட்டனின் இயக்க விதிகளை அன்றாட வாழ்க்கையின் உதாரணங்களோடு விளக்குங்கள்." },
      { label: "ரத்த ஓட்ட மண்டலம்", query: "நமது இதயம் எவ்வாறு உடலின் அனைத்துப் பகுதிக்கும் ரத்தத்தை உந்தித் தள்ளுகிறது?" },
      { label: "மின்சாரம் மற்றும் மின்னோட்டம்", query: "மின்சாரம் (Electric Current) கம்பிகளில் எவ்வாறு பாய்கிறது?" }
    ];
  }

  if (norm.startsWith('te')) {
    return [
      { label: "కిరణజన్య సంయోగక్రియ", query: "గురువుగారూ, కిరణజన్య సంయోగక్రియ (Photosynthesis) ఎలా జరుగుతుందో తేలికగా చెప్పండి." },
      { label: "న్యూటన్ గమన నియమాలు", query: "న్యూటన్ గమన నియమాలను నిత్యజీవిత ఉదాహరణలతో వివరించండి." },
      { label: "మానవ గుండె పనితీరు", query: "మానవ గుండె రక్తాన్ని శరీరమంతా ఎలా సరఫరా చేస్తుందో చెప్పండి." },
      { label: "విద్యుత్ ప్రవాహం", query: "విద్యుత్ ప్రవాహం (Electric Current) వైర్లలో ఎలా ప్రవహిస్తుంది?" }
    ];
  }

  if (norm.startsWith('mr')) {
    return [
      { label: "प्रकाशसंश्लेषण", query: "गुरुजी, वनस्पतींचे प्रकाशसंश्लेषण (Photosynthesis) सोप्या भाषेत समजावून सांगा." },
      { label: "न्यूटनचे गतीचे नियम", query: "न्यूटनचे तीन गतीविषयक नियम दैनंदिन उदाहरणांसह स्पष्ट करा." },
      { label: "हृदयाची कार्यप्रणाली", query: "आपले हृदय २४ तास अविरतपणे रक्त कसे पंप करते?" },
      { label: "विद्युत धारा आणि रोध", query: "तारेतून विद्युत धारा (Electric Current) कशी वाहते?" }
    ];
  }

  if (norm.startsWith('gu')) {
    return [
      { label: "પ્રકાશસંશ્લેષણ", query: "મોટાભાઈ, વનસ્પતિનું પ્રકાશસંશ્લેષણ (Photosynthesis) સરળ ગુજરાતીમાં સમજાવો." },
      { label: "ન્યૂટનના ગતિના નિયમો", query: "ન્યૂટનના ગતિના નિયમો રોજિંદા જીવનના દાખલા આપીને સમજાવો." },
      { label: "માનવ હૃદયની કાર્યપ્રણાલી", query: "માનવ હૃદય શરીરમાં શુદ્ધ અને અશુદ્ધ લોહીનું પરિભ્રમણ કેવી રીતે કરે છે?" },
      { label: "વીજપ્રવાહનું વહન", query: "તારમાંથી વીજળી (Electric Current) કેવી રીતે વહે છે?" }
    ];
  }

  if (norm.startsWith('es')) {
    return [
      { label: "Fotosíntesis", query: "Explica cómo funciona la fotosíntesis y por qué es vital para el planeta." },
      { label: "Leyes de Newton", query: "Explica las tres leyes del movimiento de Newton con ejemplos prácticos." },
      { label: "Sistema Circulatorio", query: "¿Cómo bombea sangre el corazón humano a todo el cuerpo?" },
      { label: "Corriente Eléctrica", query: "¿Cómo viajan los electrones a través de un circuito eléctrico?" }
    ];
  }

  // Fallback: English
  return [
    { label: "Photosynthesis", query: "Explain how photosynthesis converts sunlight, water, and CO2 into sugars and oxygen." },
    { label: "Newton's Laws", query: "Explain Newton's three laws of motion with real-world everyday analogies." },
    { label: "Human Heart", query: "Walk me through how the human heart pumps oxygenated and deoxygenated blood." },
    { label: "Electric Circuits", query: "How does electrical potential difference drive current through conductors?" }
  ];
}

export interface SectionUILabels {
  // Mind Map
  mindMapStudio: string;
  mindMapTitle: string;
  mindMapDesc: string;
  uploadDoc: string;
  enterTopicPlaceholder: string;
  generateMindMapBtn: string;
  synthesizingAi: string;
  noMindMapTitle: string;
  noMindMapDesc: string;
  loadSampleDemo: string;
  nodeInspector: string;
  clickNodePrompt: string;
  savedInHistory: string;
  resetBtn: string;
  presetTopic1: string;
  presetTopic2: string;

  // Study Tools (Quiz & Flashcards)
  studyToolsStudio: string;
  studyToolsTitle: string;
  studyToolsDesc: string;
  adaptiveQuizTab: string;
  flashcardsTab: string;
  enterStudyTopicPlaceholder: string;
  generateQuizBtn: string;
  generateCardsBtn: string;
  questionNumber: string;
  ofTotal: string;
  difficultyLabel: string;
  dialectPromptLabel: string;
  explanationDialectLabel: string;
  scoreLabel: string;
  nextQuestionBtn: string;
  restartQuizBtn: string;
  flipCardPrompt: string;
  cardFrontLabel: string;
  cardBackLabel: string;
  prevCardBtn: string;
  nextCardBtn: string;
  noQuizTitle: string;
  noQuizDesc: string;

  // Diagram Explainer
  diagramStudio: string;
  diagramTitle: string;
  diagramDesc: string;
  uploadDiagramBtn: string;
  diagramQuestionPlaceholder: string;
  analyzeVisionBtn: string;
  analyzingDiagram: string;
  componentsHeader: string;
  stepByStepHeader: string;
  audioExplanationHeader: string;
  listenAudioBtn: string;
  stopAudioBtn: string;
  noDiagramTitle: string;
  noDiagramDesc: string;

  // History Logs
  historyStudio: string;
  historyTitle: string;
  historyDesc: string;
  allFilter: string;
  interviewFilter: string;
  quizFilter: string;
  mindMapFilter: string;
  diagramFilter: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  clearHistoryBtn: string;
  exportJsonBtn: string;
  viewDetailsBtn: string;
}

export function getSectionLabels(langId: string): SectionUILabels {
  const norm = (langId || '').toLowerCase();

  if (norm.startsWith('hi-bhojpuri')) {
    return {
      mindMapStudio: "इंटरएक्टिव D3 माइंड मैप स्टूडियो",
      mindMapTitle: "ज्ञान माइंड मैप आ संकल्पना पदानुक्रम",
      mindMapDesc: "नोट्स भा किताब के पाठ्य सामग्री अपलोड करीं। AI आपन भाषा में पूरा पेड़ तैयार कर देई।",
      uploadDoc: "दस्तावेज़ अपलोड करीं",
      enterTopicPlaceholder: "कवनो विषय लिखीं (जइसे: प्रकाश संश्लेषण, कोशिका विभाजन)...",
      generateMindMapBtn: "AI माइंड मैप बनाईं",
      synthesizingAi: "AI माइंड मैप तैयार करत बा...",
      noMindMapTitle: "अभी कवनो माइंड मैप नइखे बनल",
      noMindMapDesc: "उपर दिहल बक्सा में विषय लिखीं भा फाइल अपलोड करीं, फिर 'AI माइंड मैप बनाईं' पर क्लिक करीं।",
      loadSampleDemo: "नमूना माइंड मैप देखीं (प्रकाश संश्लेषण)",
      nodeInspector: "संकल्पना जांचकर्ता (Node Inspector)",
      clickNodePrompt: "कवनो बिंदु पर क्लिक कइला से ओकर पूरा अर्थ आ जानकारी इहाँ लउकी",
      savedInHistory: "इतिहास में सहेजल माइंड मैप",
      resetBtn: "नया / रीसेट",
      presetTopic1: "तंत्रिका तंत्र आ न्यूरॉन",
      presetTopic2: "डेटाबेस शेयरिंग आ सर्वसम्मति",

      studyToolsStudio: "अनुकूली क्विज आ फ्लैशकार्ड्स स्टूडियो",
      studyToolsTitle: "परीक्षा क्विज आ स्मार्ट फ्लैशकार्ड्स",
      studyToolsDesc: "आपन भाषा आ बोली में बहुविकल्पीय प्रश्न आ याद करे वाला फ्लैशकार्ड्स बनाईं।",
      adaptiveQuizTab: "अनुकूली क्विज (Quiz)",
      flashcardsTab: "स्मार्ट फ्लैशकार्ड्स",
      enterStudyTopicPlaceholder: "पढ़े के विषय लिखीं भा किताब के नोट्स...",
      generateQuizBtn: "क्विज तैयार करीं",
      generateCardsBtn: "फ्लैशकार्ड्स बनाईं",
      questionNumber: "सवाल",
      ofTotal: "कुल",
      difficultyLabel: "कठिनाई स्तर",
      dialectPromptLabel: "भोजपुरी में सवाल आ आवाज़",
      explanationDialectLabel: "विस्तृत व्याख्या आ बोली में समझाई",
      scoreLabel: "राउर स्कोर",
      nextQuestionBtn: "अगिला सवाल देखीं",
      restartQuizBtn: "क्विज फेर से शुरू करीं",
      flipCardPrompt: "कार्ड पलटे खातिर क्लिक करीं",
      cardFrontLabel: "आगे के सवाल",
      cardBackLabel: "पीछे के उत्तर आ बोली में अर्थ",
      prevCardBtn: "पिछला कार्ड",
      nextCardBtn: "अगिला कार्ड",
      noQuizTitle: "कवनो क्विज सक्रिय नइखे",
      noQuizDesc: "ऊपर विषय लिखीं भा 'नमूना क्विज देखीं' दबाईं।",

      diagramStudio: "मल्टीमॉडल चित्र व्याख्याकार (Vision AI)",
      diagramTitle: "विज्ञान चित्र आ आरेख व्याख्याकार",
      diagramDesc: "किताब के कवनो चित्र, आरेख या चार्ट अपलोड करीं। AI ओकरा हर हिस्सा के आपन भाषा में समझाई।",
      uploadDiagramBtn: "चित्र अपलोड करीं",
      diagramQuestionPlaceholder: "चित्र के बारे में का समझल चाहत बानी? लिखीं...",
      analyzeVisionBtn: "चित्र के जांच करीं",
      analyzingDiagram: "चित्र के विश्लेषण कइल जा रहल बा...",
      componentsHeader: "चित्र के मुख्य अंग आ हिस्सा",
      stepByStepHeader: "कदम-दर-कदम पूरा क्रिया",
      audioExplanationHeader: "बोली में ऑडियो व्याख्या",
      listenAudioBtn: "भोजपुरी में सुनीं",
      stopAudioBtn: "ऑडियो बंद करीं",
      noDiagramTitle: "कवनो चित्र अपलोड नइखे भइल",
      noDiagramDesc: "ऊपर से चित्र अपलोड करीं भा 'जल चक्र' के नमूना व्याख्या देखीं।",

      historyStudio: "सिखे के इतिहास आ ऑडिट लॉग",
      historyTitle: "सतत गतिविधि इतिहास",
      historyDesc: "राउर इंटरव्यू, माइंड मैप, क्विज आ चित्र विश्लेषण के सुरक्षित रिकॉर्ड।",
      allFilter: "सब गतिविधि",
      interviewFilter: "मॉक इंटरव्यू",
      quizFilter: "क्विज आ फ्लैशकार्ड",
      mindMapFilter: "माइंड मैप्स",
      diagramFilter: "चित्र विश्लेषण",
      noHistoryTitle: "अभी कवनो इतिहास दर्ज नइखे",
      noHistoryDesc: "जब रउआ कवनो टूल उपयोग करब, ओकर सारांश इहाँ अपने-आप सहेज लीहल जाई।",
      clearHistoryBtn: "इतिहास साफ करीं",
      exportJsonBtn: "डाउनलोड JSON",
      viewDetailsBtn: "विस्तार से देखीं"
    };
  }

  if (norm.startsWith('hi-awadhi')) {
    return {
      mindMapStudio: "इंटरएक्टिव D3 माइंड मैप स्टूडियो",
      mindMapTitle: "ज्ञान माइंड मैप अउर संकल्पना वृक्ष",
      mindMapDesc: "नोट्स या किताब के पन्ना अपलोड करौ। AI आपन भाषा में पूरो नक्शा बनाई।",
      uploadDoc: "दस्तावेज़ अपलोड करौ",
      enterTopicPlaceholder: "कवनो विषय लिखौ (जइसे: प्रकाश संश्लेषण)...",
      generateMindMapBtn: "AI माइंड मैप बनाव",
      synthesizingAi: "AI माइंड मैप बनावत है...",
      noMindMapTitle: "कवनो माइंड मैप नाहीं बनल है",
      noMindMapDesc: "विषय लिखौ या 'नमूना माइंड मैप' पर क्लिक करौ।",
      loadSampleDemo: "नमूना माइंड मैप देखौ (प्रकाश संश्लेषण)",
      nodeInspector: "संकल्पना जांचकर्ता (Node Inspector)",
      clickNodePrompt: "कवनो बिंदु पर क्लिक करै से ओकर पूरो अर्थ इहाँ लउकी",
      savedInHistory: "सहेजल माइंड मैप",
      resetBtn: "नवा / रीसेट",
      presetTopic1: "तंत्रिका तंत्र",
      presetTopic2: "डेटाबेस शेयरिंग",

      studyToolsStudio: "अनुकूली क्विज अउर फ्लैशकार्ड्स",
      studyToolsTitle: "परीक्षा क्विज अउर स्मार्ट फ्लैशकार्ड्स",
      studyToolsDesc: "आपन अवधी भाषा में क्विज अउर याद रखै वाले फ्लैशकार्ड्स बनाव।",
      adaptiveQuizTab: "अनुकूली क्विज",
      flashcardsTab: "स्मार्ट फ्लैशकार्ड्स",
      enterStudyTopicPlaceholder: "पढ़े के विषय लिखौ...",
      generateQuizBtn: "क्विज तैयार करौ",
      generateCardsBtn: "फ्लैशकार्ड्स बनाव",
      questionNumber: "सवाल",
      ofTotal: "कुल",
      difficultyLabel: "कठिनाई स्तर",
      dialectPromptLabel: "अवधी में सवाल अउर आवाज़",
      explanationDialectLabel: "विस्तृत समझाइश",
      scoreLabel: "राउर स्कोर",
      nextQuestionBtn: "अगिला सवाल",
      restartQuizBtn: "फेर से शुरू करौ",
      flipCardPrompt: "कार्ड उलटै खातिर दबावैं",
      cardFrontLabel: "आगे के सवाल",
      cardBackLabel: "पीछे के उत्तर",
      prevCardBtn: "पिछला",
      nextCardBtn: "अगिला",
      noQuizTitle: "कवनो क्विज नाहीं है",
      noQuizDesc: "ऊपर विषय लिखौ या नमूना देखौ।",

      diagramStudio: "चित्र व्याख्याकार (Vision AI)",
      diagramTitle: "चित्र अउर आरेख व्याख्याकार",
      diagramDesc: "किताब के चित्र अपलोड करौ, AI अवधी में समझाई।",
      uploadDiagramBtn: "चित्र अपलोड करौ",
      diagramQuestionPlaceholder: "का समझब चाहत अहौ? लिखौ...",
      analyzeVisionBtn: "चित्र जाँचव",
      analyzingDiagram: "चित्र जाँचल जात है...",
      componentsHeader: "चित्र के मुख्य हिस्सा",
      stepByStepHeader: "कदम-दर-कदम प्रक्रिया",
      audioExplanationHeader: "ऑडियो व्याख्या",
      listenAudioBtn: "अवधी में सुनौ",
      stopAudioBtn: "बंद करौ",
      noDiagramTitle: "कवनो चित्र नाहीं है",
      noDiagramDesc: "ऊपर से चित्र अपलोड करौ।",

      historyStudio: "सिखै के इतिहास",
      historyTitle: "सतत गतिविधि इतिहास",
      historyDesc: "राउर सब गतिविधि इहाँ सुरक्षित है।",
      allFilter: "सब गतिविधि",
      interviewFilter: "इंटरव्यू",
      quizFilter: "क्विज",
      mindMapFilter: "माइंड मैप्स",
      diagramFilter: "चित्र",
      noHistoryTitle: "कवनो इतिहास नाहीं है",
      noHistoryDesc: "काम करै पर इहाँ सब रिकार्ड लउकी।",
      clearHistoryBtn: "साफ करौ",
      exportJsonBtn: "डाउनलोड JSON",
      viewDetailsBtn: "देखौ"
    };
  }

  if (norm.startsWith('hi')) {
    return {
      mindMapStudio: "इंटरएक्टिव D3 माइंड मैप स्टूडियो",
      mindMapTitle: "ज्ञान माइंड मैप एवं संकल्पना पदानुक्रम",
      mindMapDesc: "पाठ्यपुस्तक या नोट्स अपलोड करें। AI मूल संबंधों का एक दृश्य संवादात्मक वृक्ष तैयार करता है।",
      uploadDoc: "दस्तावेज़ अपलोड करें",
      enterTopicPlaceholder: "कोई विषय दर्ज करें (उदा. प्रकाश संश्लेषण, कोशिका विभाजन)...",
      generateMindMapBtn: "AI माइंड मैप बनाएं",
      synthesizingAi: "AI माइंड मैप तैयार कर रहा है...",
      noMindMapTitle: "अभी कोई माइंड मैप उत्पन्न नहीं हुआ है",
      noMindMapDesc: "ऊपर विषय दर्ज करें या 'नमूना डेमो लोड करें' पर क्लिक करें।",
      loadSampleDemo: "नमूना माइंड मैप लोड करें (प्रकाश संश्लेषण)",
      nodeInspector: "संकल्पना विश्लेषक (Node Inspector)",
      clickNodePrompt: "विस्तृत सारांश व अवधारणाओं को देखने के लिए किसी भी नोड पर क्लिक करें",
      savedInHistory: "इतिहास में सुरक्षित माइंड मैप",
      resetBtn: "नया / रीसेट",
      presetTopic1: "मानव तंत्रिका तंत्र एवं न्यूरॉन्स",
      presetTopic2: "डिस्ट्रिब्यूटेड डेटाबेस शेडिंग",

      studyToolsStudio: "अनुकूली क्विज व फ्लैशकार्ड स्टूडियो",
      studyToolsTitle: "अनुकूली क्विज एवं स्मार्ट फ्लैशकार्ड्स",
      studyToolsDesc: "अपनी मातृभाषा में अभ्यास प्रश्न एवं दोहराव हेतु फ्लैशकार्ड्स उत्पन्न करें।",
      adaptiveQuizTab: "अनुकूली क्विज (Adaptive Quiz)",
      flashcardsTab: "स्मार्ट फ्लैशकार्ड्स (Flashcards)",
      enterStudyTopicPlaceholder: "अध्ययन का विषय दर्ज करें...",
      generateQuizBtn: "क्विज तैयार करें",
      generateCardsBtn: "फ्लैशकार्ड्स बनाएं",
      questionNumber: "प्रश्न",
      ofTotal: "कुल",
      difficultyLabel: "कठिनाई स्तर",
      dialectPromptLabel: "मातृभाषा में प्रश्न एवं उच्चारण",
      explanationDialectLabel: "विस्तृत व्याख्या एवं संकल्पना",
      scoreLabel: "आपका स्कोर",
      nextQuestionBtn: "अगला प्रश्न",
      restartQuizBtn: "पुनः आरंभ करें",
      flipCardPrompt: "कार्ड पलटने के लिए क्लिक करें",
      cardFrontLabel: "प्रश्न (आगे)",
      cardBackLabel: "उत्तर एवं मूल अर्थ (पीछे)",
      prevCardBtn: "पिछला कार्ड",
      nextCardBtn: "अगला कार्ड",
      noQuizTitle: "कोई क्विज सक्रिय नहीं है",
      noQuizDesc: "विषय दर्ज करें या 'नमूना डेटा लोड करें' पर क्लिक करें।",

      diagramStudio: "मल्टीमॉडल विजुअल डायग्राम व्याख्याकार",
      diagramTitle: "वैज्ञानिक चित्र एवं आरेख व्याख्याकार",
      diagramDesc: "किताब का चित्र या चार्ट अपलोड करें। AI प्रत्येक घटक को आपकी भाषा में विश्लेषित करेगा।",
      uploadDiagramBtn: "चित्र अपलोड करें",
      diagramQuestionPlaceholder: "चित्र के संबंध में आप क्या समझना चाहते हैं? दर्ज करें...",
      analyzeVisionBtn: "चित्र का विश्लेषण करें",
      analyzingDiagram: "जेमिनी विजन द्वारा विश्लेषण जारी है...",
      componentsHeader: "चित्र के प्रमुख संरचनात्मक घटक",
      stepByStepHeader: "क्रमवार प्राकृतिक प्रक्रिया",
      audioExplanationHeader: "मातृभाषा में ऑडियो व्याख्या",
      listenAudioBtn: "हिन्दी में सुनें",
      stopAudioBtn: "ऑडियो रोकें",
      noDiagramTitle: "कोई चित्र अपलोड नहीं किया गया",
      noDiagramDesc: "चित्र अपलोड करें या नमूना जल चक्र विश्लेषण देखें।",

      historyStudio: "लर्निंग लॉग एवं गतिविधि इतिहास",
      historyTitle: "सतत अध्ययन लॉग एवं ऑडिट ट्रेल",
      historyDesc: "आपके सभी इंटरव्यू, माइंड मैप, क्विज एवं चित्र विश्लेषण का सुरक्षित डेटाबेस।",
      allFilter: "सभी गतिविधियां",
      interviewFilter: "मॉक इंटरव्यू",
      quizFilter: "क्विज एवं कार्ड्स",
      mindMapFilter: "माइंड मैप्स",
      diagramFilter: "चित्र विश्लेषण",
      noHistoryTitle: "अभी कोई गतिविधि दर्ज नहीं है",
      noHistoryDesc: "आपके द्वारा उपयोग किए गए टूल्स का रिकॉर्ड यहां स्वचालित रूप से दिखाई देगा।",
      clearHistoryBtn: "इतिहास हटाएं",
      exportJsonBtn: "JSON निर्यात करें",
      viewDetailsBtn: "विवरण देखें"
    };
  }

  if (norm.startsWith('bn')) {
    return {
      mindMapStudio: "ইন্টারেক্টিভ D3 মাইন্ড ম্যাপ স্টুডিও",
      mindMapTitle: "জ্ঞান মাইন্ড ম্যাপ এবং ধারণার শ্রেণিবিন্যাস",
      mindMapDesc: "নোট বা বই আপলোড করুন। AI সম্পর্কের একটি ভিজ্যুয়াল বৃক্ষ তৈরি করে।",
      uploadDoc: "নথি আপলোড করুন",
      enterTopicPlaceholder: "বিষয় লিখুন (যেমন: সালোকসংশ্লেষ, কোষ বিভাজন)...",
      generateMindMapBtn: "AI মাইন্ড ম্যাপ তৈরি করুন",
      synthesizingAi: "AI মাইন্ড ম্যাপ তৈরি করছে...",
      noMindMapTitle: "এখনও কোনো মাইন্ড ম্যাপ তৈরি হয়নি",
      noMindMapDesc: "উপরে বিষয় লিখুন বা 'নমুনা ডেমো লোড করুন' ক্লিক করুন।",
      loadSampleDemo: "নমুনা ডেমো লোড করুন (সালোকসংশ্লেষ)",
      nodeInspector: "ধারণা পরিদর্শক (Node Inspector)",
      clickNodePrompt: "বিস্তারিত বিবরণ দেখতে যেকোনো নোডে ক্লিক করুন",
      savedInHistory: "সংরক্ষিত মাইন্ড ম্যাপ",
      resetBtn: "নতুন / রিসেট",
      presetTopic1: "মানব স্নায়ুতন্ত্র ও নিউরন",
      presetTopic2: "ডাটাবেস শার্ডিং",

      studyToolsStudio: "অ্যাডাপ্টিভ কুইজ ও ফ্ল্যাশকার্ড স্টুডিও",
      studyToolsTitle: "অ্যাডাপ্টিভ কুইজ এবং স্মার্ট ফ্ল্যাশকার্ড",
      studyToolsDesc: "আপনার মাতৃভাষায় এমসিকিউ প্রশ্ন এবং অনুশীলনের ফ্ল্যাশকার্ড তৈরি করুন।",
      adaptiveQuizTab: "অ্যাডাপ্টিভ কুইজ (Quiz)",
      flashcardsTab: "স্মার্ট ফ্ল্যাশকার্ড (Cards)",
      enterStudyTopicPlaceholder: "পড়ার বিষয় লিখুন...",
      generateQuizBtn: "কুইজ তৈরি করুন",
      generateCardsBtn: "ফ্ল্যাশকার্ড তৈরি করুন",
      questionNumber: "প্রশ্ন",
      ofTotal: "মোট",
      difficultyLabel: "কঠিনতার মাত্রা",
      dialectPromptLabel: "বাংলায় প্রশ্ন ও উচ্চারণ",
      explanationDialectLabel: "বিস্তারিত ব্যাখ্যা ও ধারণা",
      scoreLabel: "আপনার স্কোর",
      nextQuestionBtn: "পরবর্তী প্রশ্ন",
      restartQuizBtn: "আবার শুরু করুন",
      flipCardPrompt: "কার্ড উল্টাতে ক্লিক করুন",
      cardFrontLabel: "সামনের প্রশ্ন",
      cardBackLabel: "পেছনের উত্তর ও অর্থ",
      prevCardBtn: "পূর্ববর্তী",
      nextCardBtn: "পরবর্তী",
      noQuizTitle: "কোনো কুইজ সক্রিয় নেই",
      noQuizDesc: "বিষয় লিখুন অথবা নমুনা কুইজ লোড করুন।",

      diagramStudio: "মাল্টিমোডাল চিত্র ব্যাখ্যাকারক (Vision AI)",
      diagramTitle: "বৈজ্ঞানিক চিত্র ও ডায়াগ্রাম ব্যাখ্যাকারক",
      diagramDesc: "বইয়ের ছবি আপলোড করুন। AI প্রতিটি অংশ বাংলায় ব্যাখ্যা করবে।",
      uploadDiagramBtn: "ছবি আপলোড করুন",
      diagramQuestionPlaceholder: "ছবির বিষয়ে কী বুঝতে চান? লিখুন...",
      analyzeVisionBtn: "ছবি বিশ্লেষণ করুন",
      analyzingDiagram: "বিশ্লেষণ করা হচ্ছে...",
      componentsHeader: "ছবির প্রধান অংশসমূহ",
      stepByStepHeader: "ধাপে ধাপে প্রাকৃতিক প্রক্রিয়া",
      audioExplanationHeader: "বাংলায় অডিও ব্যাখ্যা",
      listenAudioBtn: "বাংলায় শুনুন",
      stopAudioBtn: "অডিও বন্ধ করুন",
      noDiagramTitle: "কোনো ছবি আপলোড করা হয়নি",
      noDiagramDesc: "ছবি আপলোড করুন বা নমুনা জলচক্র বিশ্লেষণ দেখুন।",

      historyStudio: "শেখার ইতিহাস ও লগ",
      historyTitle: "অবিচ্ছিন্ন শেখার ইতিহাস",
      historyDesc: "আপনার সমস্ত মক ইন্টারভিউ, কুইজ ও মাইন্ড ম্যাপের সংরক্ষিত তালিকা।",
      allFilter: "সমস্ত কার্যকলাপ",
      interviewFilter: "ইন্টারভিউ",
      quizFilter: "কুইজ ও কার্ড",
      mindMapFilter: "মাইন্ড ম্যাপ",
      diagramFilter: "চিত্র বিশ্লেষণ",
      noHistoryTitle: "এখনও কোনো ইতিহাস নেই",
      noHistoryDesc: "আপনি যেকোনো টুল ব্যবহার করলে এখানে সংগৃহীত হবে।",
      clearHistoryBtn: "ইতিহাস মুছুন",
      exportJsonBtn: "JSON ডাউনলোড",
      viewDetailsBtn: "বিস্তারিত দেখুন"
    };
  }

  if (norm.startsWith('ta')) {
    return {
      mindMapStudio: "D3 மன வரைபட ஸ்டுடியோ",
      mindMapTitle: "அறிவு மன வரைபடம் மற்றும் கருத்து படிநிலை",
      mindMapDesc: "பாடக் குறிப்புகளை பதிவேற்றவும். AI உறவுகளின் காட்சி மரத்தை உருவாக்குகிறது.",
      uploadDoc: "ஆவணத்தை பதிவேற்றவும்",
      enterTopicPlaceholder: "தலைப்பை உள்ளிடவும் (எ.கா: ஒளிச்சேர்க்கை)...",
      generateMindMapBtn: "AI மன வரைபடம் உருவாக்கு",
      synthesizingAi: "AI வரைபடம் உருவாக்குகிறது...",
      noMindMapTitle: "வரைபடம் இன்னும் உருவாக்கப்படவில்லை",
      noMindMapDesc: "தலைப்பை உள்ளிடவும் அல்லது மாதிரி டெமோவை ஏற்றவும்.",
      loadSampleDemo: "மாதிரி வரைபடம் ஏற்று (ஒளிச்சேர்க்கை)",
      nodeInspector: "கருத்து ஆய்வாளர் (Node Inspector)",
      clickNodePrompt: "விளக்கத்தைக் காண எந்த முனையையும் கிளிக் செய்யவும்",
      savedInHistory: "சேமிக்கப்பட்ட வரைபடங்கள்",
      resetBtn: "புதியது / மீட்டமை",
      presetTopic1: "மனித நரம்பு மண்டலம்",
      presetTopic2: "தரவுத்தள பகிர்வு",

      studyToolsStudio: "பயிற்சி வினாடி வினா & அட்டைகள்",
      studyToolsTitle: "பொருந்தக்கூடிய வினாடி வினா & ஃபிளாஷ்கார்டுகள்",
      studyToolsDesc: "உங்கள் தாய்மொழியில் வினாடி வினா மற்றும் கற்றல் அட்டைகளை உருவாக்குங்கள்.",
      adaptiveQuizTab: "வினாடி வினா (Quiz)",
      flashcardsTab: "ஃபிளாஷ்கார்டுகள் (Cards)",
      enterStudyTopicPlaceholder: "படிக்கும் தலைப்பை உள்ளிடவும்...",
      generateQuizBtn: "வினாடி வினா உருவாக்கு",
      generateCardsBtn: "அட்டைகளை உருவாக்கு",
      questionNumber: "கேள்வி",
      ofTotal: "மொத்தம்",
      difficultyLabel: "சிரம நிலை",
      dialectPromptLabel: "தமிழில் கேள்வி மற்றும் குரல்",
      explanationDialectLabel: "விரிவான விளக்கம்",
      scoreLabel: "உங்கள் மதிப்பெண்",
      nextQuestionBtn: "அடுத்த கேள்வி",
      restartQuizBtn: "மீண்டும் தொடங்கு",
      flipCardPrompt: "அட்டையை திருப்ப கிளிக் செய்யவும்",
      cardFrontLabel: "முன்பக்க கேள்வி",
      cardBackLabel: "பின்பக்க பதில்",
      prevCardBtn: "முந்தையது",
      nextCardBtn: "அடுத்தது",
      noQuizTitle: "வினாடி வினா எதுவும் இல்லை",
      noQuizDesc: "தலைப்பை உள்ளிடவும் அல்லது மாதிரியை ஏற்றவும்.",

      diagramStudio: "வரைபட விளக்கக் கருவி (Vision AI)",
      diagramTitle: "அறிவியல் வரைபட விளக்கக் கருவி",
      diagramDesc: "புத்தகப் படங்களை பதிவேற்றுங்கள். AI தமிழில் விளக்கும்.",
      uploadDiagramBtn: "படத்தை பதிவேற்றவும்",
      diagramQuestionPlaceholder: "படத்தைப் பற்றி என்ன புரிந்து கொள்ள விரும்புகிறீர்கள்? உள்ளிடவும்...",
      analyzeVisionBtn: "படத்தை ஆராய்க",
      analyzingDiagram: "படம் ஆராயப்படுகிறது...",
      componentsHeader: "முக்கிய பாகங்கள்",
      stepByStepHeader: "படி படியான செயல்முறை",
      audioExplanationHeader: "தமிழில் ஆடியோ விளக்கம்",
      listenAudioBtn: "தமிழில் கேட்கவும்",
      stopAudioBtn: "ஆடியோவை நிறுத்து",
      noDiagramTitle: "படம் எதுவும் பதிவேற்றப்படவில்லை",
      noDiagramDesc: "படத்தை பதிவேற்றவும் அல்லது நீர் சுழற்சி மாதிரியைப் பார்க்கவும்.",

      historyStudio: "கற்றல் வரலாறு",
      historyTitle: "தொடர்ச்சியான செயல்பாட்டு வரலாறு",
      historyDesc: "உங்கள் அனைத்து நேர்காணல்கள் மற்றும் வரைபடங்களின் பதிவு.",
      allFilter: "அனைத்து செயல்பாடுகள்",
      interviewFilter: "நேர்காணல்",
      quizFilter: "வினாடி வினா",
      mindMapFilter: "மன வரைபடம்",
      diagramFilter: "வரைபடம்",
      noHistoryTitle: "வரலாறு இன்னும் இல்லை",
      noHistoryDesc: "நீங்கள் பயன்படுத்தும் போது தானாகவே இங்கு தோன்றும்.",
      clearHistoryBtn: "வரலாற்றை அழி",
      exportJsonBtn: "JSON பதிவிறக்கம்",
      viewDetailsBtn: "விவரங்களைப் பார்க்கவும்"
    };
  }

  if (norm.startsWith('te')) {
    return {
      mindMapStudio: "ఇంటరాక్టివ్ D3 మైండ్ మ్యాప్ స్టూడియో",
      mindMapTitle: "జ్ఞాన మైండ్ మ్యాప్ & కాన్సెప్ట్ క్రమానుగత నిర్మాణం",
      mindMapDesc: "నోట్స్ లేదా పుస్తక పాఠాలను అప్‌లోడ్ చేయండి. AI మీ భాషలో విజువల్ మైండ్ మ్యాప్‌ను రూపొందిస్తుంది.",
      uploadDoc: "పత్రాన్ని అప్‌లోడ్ చేయండి",
      enterTopicPlaceholder: "అంశాన్ని నమోదు చేయండి (ఉదా: కిరణజన్య సంయోగక్రియ, కణ విభజన)...",
      generateMindMapBtn: "AI మైండ్ మ్యాప్ సృష్టించండి",
      synthesizingAi: "AI మైండ్ మ్యాప్ తయారవుతోంది...",
      noMindMapTitle: "ఇంకా మైండ్ మ్యాప్ రూపొందించబడలేదు",
      noMindMapDesc: "పైన అంశాన్ని నమోదు చేయండి లేదా నమూనా మైండ్ మ్యాప్‌ను లోడ్ చేయండి.",
      loadSampleDemo: "నమూనా మైండ్ మ్యాప్ చూడండి (కిరణజన్య సంయోగక్రియ)",
      nodeInspector: "కాన్సెప్ట్ ఇన్‌స్పెక్టర్ (Node Inspector)",
      clickNodePrompt: "వివరణను చూడటానికి ఏదైనా భాగాన్ని క్లిక్ చేయండి",
      savedInHistory: "సేవ్ చేయబడిన మైండ్ మ్యాప్‌లు",
      resetBtn: "కొత్తది / రీసెట్",
      presetTopic1: "మానవ నాడీ వ్యవస్థ",
      presetTopic2: "డేటాబేస్ షార్డింగ్",

      studyToolsStudio: "అడాప్టివ్ క్విజ్ & ఫ్లాష్‌కార్డుల స్టూడియో",
      studyToolsTitle: "పరీక్షా క్విజ్ & స్మార్ట్ ఫ్లాష్‌కార్డులు",
      studyToolsDesc: "మీ స్వంత భాషలో బహుళైచ్ఛిక ప్రశ్నలు మరియు అభ్యాస కార్డులను సృష్టించండి.",
      adaptiveQuizTab: "అడాప్టివ్ క్విజ్ (Quiz)",
      flashcardsTab: "స్మార్ట్ ఫ్లాష్‌కార్డులు (Cards)",
      enterStudyTopicPlaceholder: "అధ్యయన అంశాన్ని నమోదు చేయండి...",
      generateQuizBtn: "క్విజ్ సృష్టించండి",
      generateCardsBtn: "ఫ్లాష్‌కార్డులు రూపొందించండి",
      questionNumber: "ప్రశ్న",
      ofTotal: "మొత్తం",
      difficultyLabel: "కఠినత స్థాయి",
      dialectPromptLabel: "తెలుగులో ప్రశ్న మరియు వాయిస్",
      explanationDialectLabel: "సవివరమైన వివరణ",
      scoreLabel: "మీ స్కోరు",
      nextQuestionBtn: "తదుపరి ప్రశ్న",
      restartQuizBtn: "మళ్లీ ప్రారంభించండి",
      flipCardPrompt: "సమాధానం చూడటానికి కార్డును క్లిక్ చేయండి",
      cardFrontLabel: "ముందు ప్రశ్న",
      cardBackLabel: "వెనుక సమాధానం మరియు అర్థం",
      prevCardBtn: "మునుపటిది",
      nextCardBtn: "తదుపరిది",
      noQuizTitle: "ఎలాంటి క్విజ్ ప్రస్తుతం అందుబాటులో లేదు",
      noQuizDesc: "పైన అంశాన్ని నమోదు చేయండి లేదా నమూనా క్విజ్‌ని ప్రారంభించండి.",

      diagramStudio: "మల్టీమోడల్ రేఖాచిత్ర వివరణకర్త (Vision AI)",
      diagramTitle: "శాస్త్రీయ రేఖాచిత్రం & ఫార్ములా వివరణకర్త",
      diagramDesc: "పుస్తకంలోని బొమ్మలను అప్‌లోడ్ చేయండి. AI తెలుగులో ప్రతి భాగాన్ని వివరిస్తుంది.",
      uploadDiagramBtn: "బొమ్మను అప్‌లోడ్ చేయండి",
      diagramQuestionPlaceholder: "బొమ్మ గురించి మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు? నమోదు చేయండి...",
      analyzeVisionBtn: "బొమ్మను విశ్లేషించండి",
      analyzingDiagram: "జెమిని విజన్ విశ్లేషిస్తోంది...",
      componentsHeader: "ముఖ్యమైన భాగాలు",
      stepByStepHeader: "దశల వారీ ప్రక్రియ",
      audioExplanationHeader: "తెలుగులో ఆడియో వివరణ",
      listenAudioBtn: "తెలుగులో వినండి",
      stopAudioBtn: "ఆడియో ఆపండి",
      noDiagramTitle: "ఏ బొమ్మ అప్‌లోడ్ చేయబడలేదు",
      noDiagramDesc: "చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా నమూనా జలచక్ర విశ్లేషణను చూడండి.",

      historyStudio: "అభ్యాస లాగ్ & చరిత్ర",
      historyTitle: "నిరంతర అభ్యాస చరిత్ర",
      historyDesc: "మీ మాక్ ఇంటర్వ్యూలు, క్విజ్‌లు మరియు మైండ్ మ్యాప్‌ల సమగ్ర రికార్డు.",
      allFilter: "అన్ని కార్యకలాపాలు",
      interviewFilter: "ఇంటర్వ్యూలు",
      quizFilter: "క్విజ్ & కార్డులు",
      mindMapFilter: "మైండ్ మ్యాప్‌లు",
      diagramFilter: "చిత్ర విశ్లేషణ",
      noHistoryTitle: "ఇంకా చరిత్ర ఏదీ నమోదు కాలేదు",
      noHistoryDesc: "మీరు టూల్స్ ఉపయోగించినప్పుడు స్వయంచాలకంగా ఇక్కడ కనిపిస్తాయి.",
      clearHistoryBtn: "చరిత్రను తొలగించండి",
      exportJsonBtn: "JSON డౌన్‌లోడ్",
      viewDetailsBtn: "వివరాలను వీక్షించండి"
    };
  }

  if (norm.startsWith('mr')) {
    return {
      mindMapStudio: "इंटरएक्टिव्ह D3 माइंड मॅप स्टुडिओ",
      mindMapTitle: "ज्ञान माइंड मॅप आणि संकल्पना रचना",
      mindMapDesc: "अभ्यास नोट्स किंवा पुस्तकातील प्रकरणे अपलोड करा. AI तुमच्या भाषेत दृश्यमान झाड तयार करेल.",
      uploadDoc: "दस्तऐवज अपलोड करा",
      enterTopicPlaceholder: "विषय प्रविष्ट करा (उदा: प्रकाशसंश्लेषण, पेशी विभाजन)...",
      generateMindMapBtn: "AI माइंड मॅप तयार करा",
      synthesizingAi: "AI माइंड मॅप तयार करत आहे...",
      noMindMapTitle: "अद्याप माइंड मॅप तयार झालेला नाही",
      noMindMapDesc: "वर विषय प्रविष्ट करा किंवा नमुना माइंड मॅप लोड करा.",
      loadSampleDemo: "नमुना माइंड मॅप पहा (प्रकाशसंश्लेषण)",
      nodeInspector: "संकल्पना तपासक (Node Inspector)",
      clickNodePrompt: "सविस्तर माहिती पाहण्यासाठी कोणत्याही घटकावर क्लिक करा",
      savedInHistory: "जतन केलेले माइंड मॅप्स",
      resetBtn: "नवीन / रीसेट",
      presetTopic1: "मानवी मज्जासंस्था",
      presetTopic2: "डेटाबेस शार्डिंग",

      studyToolsStudio: "अनुकूली चाचणी आणि फ्लॅशकार्ड्स स्टुडिओ",
      studyToolsTitle: "परीक्षा सराव चाचणी आणि फ्लॅशकार्ड्स",
      studyToolsDesc: "तुमच्या स्वतःच्या भाषेत बहुपर्यायी प्रश्न आणि अभ्यास कार्ड्स तयार करा.",
      adaptiveQuizTab: "अनुकूली चाचणी (Quiz)",
      flashcardsTab: "स्मार्ट फ्लॅशकार्ड्स (Cards)",
      enterStudyTopicPlaceholder: "अभ्यास विषय किंवा नोट्स प्रविष्ट करा...",
      generateQuizBtn: "चाचणी तयार करा",
      generateCardsBtn: "फ्लॅशकार्ड्स बनवा",
      questionNumber: "प्रश्न",
      ofTotal: "पैकी",
      difficultyLabel: "काठिण्य पातळी",
      dialectPromptLabel: "मराठीत प्रश्न आणि आवाज",
      explanationDialectLabel: "सविस्तर स्पष्टीकरण",
      scoreLabel: "तुमचे एकूण गुण",
      nextQuestionBtn: "पुढील प्रश्न",
      restartQuizBtn: "पुन्हा सुरू करा",
      flipCardPrompt: "उत्तर पाहण्यासाठी कार्डवर टॅप करा",
      cardFrontLabel: "पुढील प्रश्न",
      cardBackLabel: "मागील उत्तर आणि अर्थ",
      prevCardBtn: "मागील",
      nextCardBtn: "पुढील कार्ड",
      noQuizTitle: "कोणतीही चाचणी सुरू नाही",
      noQuizDesc: "वर विषय प्रविष्ट करा किंवा नमुना चाचणी सुरू करा.",

      diagramStudio: "वैज्ञानिक आकृती स्पष्टीकरण (Vision AI)",
      diagramTitle: "वैज्ञानिक आकृती आणि सूत्र स्पष्टीकरण",
      diagramDesc: "पुस्तकातील आकृती अपलोड करा. AI मराठीत प्रत्येक भागाचे सोप्या भाषेत स्पष्टीकरण देईल.",
      uploadDiagramBtn: "आकृती अपलोड करा",
      diagramQuestionPlaceholder: "आकृतीबद्दल काय समजून घ्यायचे आहे? प्रविष्ट करा...",
      analyzeVisionBtn: "आकृतीचे विश्लेषण करा",
      analyzingDiagram: "आकृतीचे विश्लेषण सुरू आहे...",
      componentsHeader: "आकृतीचे प्रमुख घटक",
      stepByStepHeader: "टप्प्याटप्प्याने प्रक्रिया",
      audioExplanationHeader: "मराठीत ऑडिओ स्पष्टीकरण",
      listenAudioBtn: "मराठीत ऐका",
      stopAudioBtn: "ऑडिओ थांबवा",
      noDiagramTitle: "कोणतीही आकृती अपलोड केलेली नाही",
      noDiagramDesc: "चित्र अपलोड करा किंवा नमुना जलचक्र विश्लेषण पहा.",

      historyStudio: "अध्ययन नोंद आणि इतिहास",
      historyTitle: "अखंड अध्ययन इतिहास व नोंदी",
      historyDesc: "तुमच्या सर्व मुलाखती, चाचण्या आणि माइंड मॅप्सची जतन केलेली यादी.",
      allFilter: "सर्व क्रिया",
      interviewFilter: "मुलाखती",
      quizFilter: "चाचणी व कार्ड्स",
      mindMapFilter: "माइंड मॅप्स",
      diagramFilter: "आकृती विश्लेषण",
      noHistoryTitle: "अद्याप कोणतीही नोंद नाही",
      noHistoryDesc: "तुम्ही टूल्स वापरताच येथे आपोआप नोंदी दिसतील.",
      clearHistoryBtn: "इतिहास साफ करा",
      exportJsonBtn: "JSON डाउनलोड",
      viewDetailsBtn: "तपशील पहा"
    };
  }

  if (norm.startsWith('gu')) {
    return {
      mindMapStudio: "ઇન્ટરેક્ટિવ D3 માઇન્ડ મેપ સ્ટુડિયો",
      mindMapTitle: "જ્ઞાન માઇન્ડ મેપ અને વિભાવના રચના",
      mindMapDesc: "અભ્યાસ નોંધો અથવા પુસ્તકના પ્રકરણો અપલોડ કરો. AI તમારી ભાષામાં દ્રશ્ય ઝાડ તૈયાર કરશે.",
      uploadDoc: "દસ્તાવેજ અપલોડ કરો",
      enterTopicPlaceholder: "વિષય દાખલ કરો (દા.ત: પ્રકાશસંશ્લેષણ, કોષ વિભાજન)...",
      generateMindMapBtn: "AI માઇન્ડ મેપ બનાવો",
      synthesizingAi: "AI માઇન્ડ મેપ તૈયાર કરી રહ્યું છે...",
      noMindMapTitle: "હજી સુધી કોઈ માઇન્ડ મેપ બન્યો નથી",
      noMindMapDesc: "ઉપર વિષય દાખલ કરો અથવા નમૂનાનો માઇન્ડ મેપ લોડ કરો.",
      loadSampleDemo: "નમૂનાનો માઇન્ડ મેપ જુઓ (પ્રકાશસંશ્લેષણ)",
      nodeInspector: "વિભાવના તપાસકર્તા (Node Inspector)",
      clickNodePrompt: "વિગતવાર સમજૂતી જોવા માટે કોઈપણ બિંદુ પર ક્લિક કરો",
      savedInHistory: "સાચવેલા માઇન્ડ મેપ્સ",
      resetBtn: "નવું / રીસેટ",
      presetTopic1: "માનવ ચેતાતંત્ર",
      presetTopic2: "ડેટાબેઝ શાર્ડિંગ",

      studyToolsStudio: "અનુકૂલનશીલ ક્વિઝ અને ફ્લેશકાર્ડ્સ સ્ટુડિયો",
      studyToolsTitle: "પરીક્ષા પ્રેક્ટિસ ક્વિઝ અને ફ્લેશકાર્ડ્સ",
      studyToolsDesc: "તમારી માતૃભાષામાં બહુવિકલ્પી પ્રશ્નો અને અધ્યયન કાર્ડ્સ બનાવો.",
      adaptiveQuizTab: "અનુકૂલનશીલ ક્વિઝ (Quiz)",
      flashcardsTab: "સ્માર્ટ ફ્લેશકાર્ડ્સ (Cards)",
      enterStudyTopicPlaceholder: "અભ્યાસનો વિષય દાખલ કરો...",
      generateQuizBtn: "ક્વિઝ બનાવો",
      generateCardsBtn: "ફ્લેશકાર્ડ્સ બનાવો",
      questionNumber: "પ્રશ્ન",
      ofTotal: "કુલ",
      difficultyLabel: "મુશ્કેલી સ્તર",
      dialectPromptLabel: "ગુજરાતીમાં પ્રશ્ન અને અવાજ",
      explanationDialectLabel: "વિગતવાર સમજૂતી",
      scoreLabel: "તમારો સ્કોર",
      nextQuestionBtn: "આગળનો પ્રશ્ન",
      restartQuizBtn: "ફરી શરૂ કરો",
      flipCardPrompt: "જવાબ જોવા માટે કાર્ડ પર ક્લિક કરો",
      cardFrontLabel: "આગળનો પ્રશ્ન",
      cardBackLabel: "પાછળનો જવાબ અને અર્થ",
      prevCardBtn: "પાછલું કાર્ડ",
      nextCardBtn: "આગળનું કાર્ડ",
      noQuizTitle: "કોઈ ક્વિઝ સક્રિય નથી",
      noQuizDesc: "ઉપર વિષય દાખલ કરો અથવા નમૂના ક્વિઝ શરૂ કરો.",

      diagramStudio: "વૈજ્ઞાનિક આકૃતિ સમજાવનાર (Vision AI)",
      diagramTitle: "વૈજ્ઞાનિક આકૃતિ અને ફોર્મ્યુલા સમજૂતી",
      diagramDesc: "પુસ્તકની આકૃતિ અપલોડ કરો. AI ગુજરાતીમાં દરેક ભાગ સરળતાથી સમજાવશે.",
      uploadDiagramBtn: "આકૃતિ અપલોડ કરો",
      diagramQuestionPlaceholder: "આકૃતિ વિશે તમે શું સમજવા માંગો છો? લખો...",
      analyzeVisionBtn: "આકૃતિનું વિશ્લેષણ કરો",
      analyzingDiagram: "આકૃતિનું વિશ્લેષણ થઈ રહ્યું છે...",
      componentsHeader: "આકૃતિના મુખ્ય ભાગો",
      stepByStepHeader: "તબક્કાવાર પ્રક્રિયા",
      audioExplanationHeader: "ગુજરાતીમાં ઓડિયો સમજૂતી",
      listenAudioBtn: "ગુજરાતીમાં સાંભળો",
      stopAudioBtn: "ઓડિયો બંધ કરો",
      noDiagramTitle: "કોઈ આકૃતિ અપલોડ કરેલી નથી",
      noDiagramDesc: "ઇમેજ અપલોડ કરો અથવા નમૂના જળચક્રનું વિશ્લેષણ જુઓ.",

      historyStudio: "અધ્યયન નોંધ અને ઇતિહાસ",
      historyTitle: "સતત અધ્યયન ઇતિહાસ અને લોગ",
      historyDesc: "તમારા તમામ ઇન્ટરવ્યુ, ક્વિઝ અને માઇન્ડ મેપ્સની સાચવેલી યાદી.",
      allFilter: "તમામ પ્રવૃત્તિઓ",
      interviewFilter: "ઇન્ટરવ્યુ",
      quizFilter: "ક્વિઝ અને કાર્ડ્સ",
      mindMapFilter: "માઇન્ડ મેપ્સ",
      diagramFilter: "આકૃતિ વિશ્લેષણ",
      noHistoryTitle: "હજી સુધી કોઈ પ્રવૃત્તિ નથી",
      noHistoryDesc: "તમે ટૂલ્સનો ઉપયોગ કરશો ત્યારે આપમેળે અહીં દેખાશે.",
      clearHistoryBtn: "ઇતિહાસ સાફ કરો",
      exportJsonBtn: "JSON ડાઉનલોડ",
      viewDetailsBtn: "વિગતો જુઓ"
    };
  }

  if (norm.startsWith('es')) {
    return {
      mindMapStudio: "Estudio Interactivo de Mapas Mentales D3",
      mindMapTitle: "Mapa Mental de Conocimiento y Jerarquía de Conceptos",
      mindMapDesc: "Sube notas o capítulos de libros. La IA sintetiza las relaciones clave en un árbol visual navegable.",
      uploadDoc: "Subir Documento",
      enterTopicPlaceholder: "Ingresa un tema (ej: Fotosíntesis, División Celular)...",
      generateMindMapBtn: "Generar Mapa Mental con IA",
      synthesizingAi: "Sintetizando con IA...",
      noMindMapTitle: "Aún no hay mapas mentales generados",
      noMindMapDesc: "Sube un archivo o escribe un tema arriba y haz clic en 'Generar Mapa Mental con IA'.",
      loadSampleDemo: "Cargar Demo de Muestra (Fotosíntesis)",
      nodeInspector: "Inspector de Conceptos (Node Inspector)",
      clickNodePrompt: "Haz clic en cualquier nodo para inspeccionar el resumen detallado",
      savedInHistory: "Mapas Mentales Guardados",
      resetBtn: "Nuevo / Reiniciar",
      presetTopic1: "Sistema Nervioso Humano",
      presetTopic2: "Fragmentación de Base de Datos",

      studyToolsStudio: "Estudio de Cuestionarios Adaptativos y Tarjetas",
      studyToolsTitle: "Cuestionarios Adaptativos y Tarjetas Didácticas",
      studyToolsDesc: "Genera preguntas de opción múltiple y tarjetas de repetición espaciada en tu idioma.",
      adaptiveQuizTab: "Cuestionario Adaptativo (Quiz)",
      flashcardsTab: "Tarjetas Didácticas (Cards)",
      enterStudyTopicPlaceholder: "Ingresa el tema de estudio o notas...",
      generateQuizBtn: "Generar Cuestionario",
      generateCardsBtn: "Generar Tarjetas",
      questionNumber: "Pregunta",
      ofTotal: "de",
      difficultyLabel: "Dificultad",
      dialectPromptLabel: "Pregunta y Voz en tu Idioma",
      explanationDialectLabel: "Explicación Pedagógica Detallada",
      scoreLabel: "Tu Puntuación Total",
      nextQuestionBtn: "Siguiente Pregunta",
      restartQuizBtn: "Reiniciar Cuestionario",
      flipCardPrompt: "Toca la tarjeta para ver la respuesta",
      cardFrontLabel: "Pregunta Frontal",
      cardBackLabel: "Respuesta y Explicación Posterior",
      prevCardBtn: "Anterior",
      nextCardBtn: "Siguiente Tarjeta",
      noQuizTitle: "Ningún cuestionario activo",
      noQuizDesc: "Ingresa un tema arriba o carga preguntas de muestra.",

      diagramStudio: "Explicador Multimodal de Diagramas (Vision AI)",
      diagramTitle: "Explicador Científico de Diagramas y Fórmulas",
      diagramDesc: "Sube cualquier diagrama o fórmula de libro de texto. La IA descompone sus componentes en tu idioma.",
      uploadDiagramBtn: "Subir Diagrama",
      diagramQuestionPlaceholder: "¿Qué deseas comprender de este diagrama? Escribe aquí...",
      analyzeVisionBtn: "Analizar con Gemini Vision",
      analyzingDiagram: "Analizando con Gemini Vision...",
      componentsHeader: "Componentes Estructurales del Diagrama",
      stepByStepHeader: "Flujo Paso a Paso",
      audioExplanationHeader: "Explicación en Audio",
      listenAudioBtn: "Escuchar en Audio",
      stopAudioBtn: "Detener Audio",
      noDiagramTitle: "Aún no se ha subido ningún diagrama",
      noDiagramDesc: "Sube una imagen o explora el diagrama de muestra del Ciclo del Agua.",

      historyStudio: "Registro de Aprendizaje e Historial",
      historyTitle: "Historial Continuo de Aprendizaje",
      historyDesc: "Registro en tiempo real de entrevistas con IA, mapas mentales, cuestionarios y análisis de diagramas.",
      allFilter: "Todas las Actividades",
      interviewFilter: "Entrevistas",
      quizFilter: "Cuestionarios y Tarjetas",
      mindMapFilter: "Mapas Mentales",
      diagramFilter: "Visión de Diagramas",
      noHistoryTitle: "Aún no hay actividades registradas",
      noHistoryDesc: "Tus entrevistas, cuestionarios y análisis guardados aparecerán aquí automáticamente.",
      clearHistoryBtn: "Borrar Historial",
      exportJsonBtn: "Exportar JSON",
      viewDetailsBtn: "Ver Detalles"
    };
  }

  // Fallback / Standard English
  return {
    mindMapStudio: "Interactive D3 Mind Map Studio",
    mindMapTitle: "Knowledge Mind Map & Concept Hierarchy",
    mindMapDesc: "Upload text, notes or book chapters. AI synthesizes core relationships into a navigable visual tree.",
    uploadDoc: "Upload Document",
    enterTopicPlaceholder: "Enter topic (e.g. Quantum Computing, Cell Division)...",
    generateMindMapBtn: "Generate AI Mind Map",
    synthesizingAi: "Synthesizing with AI...",
    noMindMapTitle: "No Mind Map Generated Yet",
    noMindMapDesc: "Upload a syllabus file (PDF, TXT, DOCX) or enter a subject topic in the box above, then click 'Generate AI Mind Map'.",
    loadSampleDemo: "Load Sample Demo (Photosynthesis)",
    nodeInspector: "Node Inspector",
    clickNodePrompt: "Click any node pill to inspect detailed summary and concepts",
    savedInHistory: "Saved Mind Maps in History",
    resetBtn: "Reset / New",
    presetTopic1: "Human Nervous System",
    presetTopic2: "Distributed Database Sharding",

    studyToolsStudio: "Adaptive Quiz Studio & Flashcards",
    studyToolsTitle: "Adaptive Quiz Studio & Spaced Flashcards",
    studyToolsDesc: "Generate tailored MCQs and spaced-repetition flashcards in your native dialect.",
    adaptiveQuizTab: "Adaptive Quiz",
    flashcardsTab: "Smart Flashcards",
    enterStudyTopicPlaceholder: "Enter study topic or upload document...",
    generateQuizBtn: "Generate Quiz",
    generateCardsBtn: "Generate Flashcards",
    questionNumber: "Question",
    ofTotal: "of",
    difficultyLabel: "Difficulty",
    dialectPromptLabel: "Native Dialect Prompt & Audio",
    explanationDialectLabel: "Pedagogical Explanation in Dialect",
    scoreLabel: "Your Total Score",
    nextQuestionBtn: "Next Question",
    restartQuizBtn: "Restart Quiz",
    flipCardPrompt: "Tap card to flip answer",
    cardFrontLabel: "Front Question",
    cardBackLabel: "Back Answer & Dialect Translation",
    prevCardBtn: "Previous",
    nextCardBtn: "Next Card",
    noQuizTitle: "No Quiz Active Yet",
    noQuizDesc: "Enter a topic above or load sample demo questions.",

    diagramStudio: "Multimodal Visual Diagram Explainer",
    diagramTitle: "Scientific Diagram & Formula Explainer",
    diagramDesc: "Upload any textbook diagram, formula sheet, or flow chart. AI decomposes structural components in your native dialect.",
    uploadDiagramBtn: "Upload Diagram",
    diagramQuestionPlaceholder: "Describe what you want to understand in this diagram...",
    analyzeVisionBtn: "Analyze with Gemini Vision",
    analyzingDiagram: "Decomposing with Gemini Vision...",
    componentsHeader: "Structural Diagram Components",
    stepByStepHeader: "Step-by-Step Flow",
    audioExplanationHeader: "Native Dialect Audio Explanation",
    listenAudioBtn: "Listen in Dialect",
    stopAudioBtn: "Stop Audio",
    noDiagramTitle: "No Diagram Analyzed Yet",
    noDiagramDesc: "Upload an image or explore the sample Water Cycle diagram.",

    historyStudio: "Learning Log & Activity History",
    historyTitle: "Continuous Learning Log & Audit Trail",
    historyDesc: "Real-time records of AI interviews, mind maps, quizzes, and multimodal diagram analyses.",
    allFilter: "All Activities",
    interviewFilter: "Interviews",
    quizFilter: "Quizzes & Cards",
    mindMapFilter: "Mind Maps",
    diagramFilter: "Diagram Vision",
    noHistoryTitle: "No Activity Recorded Yet",
    noHistoryDesc: "Your saved interviews, quizzes, mind maps, and diagram analyses will appear here automatically.",
    clearHistoryBtn: "Clear History",
    exportJsonBtn: "Export JSON",
    viewDetailsBtn: "View Details"
  };
}

