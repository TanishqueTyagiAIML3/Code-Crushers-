export interface ShortcutTranslationData {
  title: string;
  headerBtnLabel?: string;
  badge: string;
  subtitle: string;
  noticeTitle: string;
  noticeBody: string;
  popularBadge: string;
  footerEsc: string;
  gotItBtn: string;
  categories: {
    voiceTitle: string;
    toolsTitle: string;
    navTitle: string;
    accessTitle: string;
    inToolTitle: string;
  };
  shortcuts: {
    voiceToggle: { title: string; desc: string };
    voiceForce: { title: string; desc: string };
    speechStop: { title: string; desc: string };
    speechReplay: { title: string; desc: string };
    esc: { title: string; desc: string };
    tool1: { title: string; desc: string };
    tool2: { title: string; desc: string };
    tool3: { title: string; desc: string };
    tool4: { title: string; desc: string };
    tool5: { title: string; desc: string };
    tool6: { title: string; desc: string };
    tool7: { title: string; desc: string };
    tab: { title: string; desc: string };
    shiftTab: { title: string; desc: string };
    enter: { title: string; desc: string };
    slash: { title: string; desc: string };
    question: { title: string; desc: string };
    theme: { title: string; desc: string };
    lang: { title: string; desc: string };
    access: { title: string; desc: string };
    fullscreen: { title: string; desc: string };
    quizKeys: { title: string; desc: string };
    flashcardFlip: { title: string; desc: string };
    flashcardNav: { title: string; desc: string };
    audioListen: { title: string; desc: string };
  };
}

export const SHORTCUTS_TRANSLATIONS: Record<string, ShortcutTranslationData> = {
  // 1. Bhojpuri (Hindi)
  'hi-bhojpuri': {
    title: 'कीबोर्ड नेविगेशन अउर शॉर्टकट्स',
    headerBtnLabel: 'शॉर्टकट्स',
    badge: 'पूरा सुलभता',
    subtitle: 'कीबोर्ड शॉर्टकट्स गाइड • बिना माउस या टच स्क्रीन के सहज रूप से चलावल जा सकेला',
    noticeTitle: 'बिना हाथ के अउर कीबोर्ड से पूरा संचालन:',
    noticeBody: 'हर बटन प जाए खातिर Tab, माइक चालू करे खातिर Space भा Alt+V, अउर टूल्स बदले खातिर 1 से 7 नंबर दबाईं।',
    popularBadge: 'सबसे लोकप्रिय',
    footerEsc: 'ई संवाद बंद करे खातिर कभी भी Esc दबाईं',
    gotItBtn: 'समझ गइली (Got It)',
    categories: {
      voiceTitle: 'आवाज़ अउर ऑडियो नियंत्रण',
      toolsTitle: 'सीधे टूल बदले के नंबर',
      navTitle: 'नेविगेशन अउर फोकस नियंत्रण',
      accessTitle: 'सुलभता अउर डिस्प्ले सेटिंग्स',
      inToolTitle: 'टूल्स के अंदर काम करे वाला शॉर्टकट्स'
    },
    shortcuts: {
      voiceToggle: {
        title: 'माइक चालू या बंद करीं (Voice Input Toggle)',
        desc: 'जब टाइप ना करत होखीं त स्पेस दबा के बोलल शुरू करीं'
      },
      voiceForce: {
        title: 'कहूँ से भी तुरंत माइक चालू/बंद करीं',
        desc: 'आवाज़ पहचान तुरंत सक्रिय या बंद करीं'
      },
      speechStop: {
        title: 'चलत आवाज़ (ऑडियो) के तुरंत रोकीं',
        desc: 'AI के बोलल आवाज के म्यूट करीं'
      },
      speechReplay: {
        title: 'पिछिला AI उत्तर के दोबारा सुनीं',
        desc: 'पुरनका जवाब के आवाज़ फेर से बजाईं'
      },
      esc: {
        title: 'माइक/ऑडियो रोकीं भा पॉपअप मेनू बंद करीं',
        desc: 'कौनो भी खुलल खिड़की या मेनू के तुरंत बंद करीं'
      },
      tool1: {
        title: 'वॉइस AI ट्यूटर अउर डाउट सॉल्वर',
        desc: 'बोल के आपन सवाल पूछीं अउर सीखल शुरू करीं'
      },
      tool2: {
        title: 'मॉक इंटरव्यूअर स्टेज',
        desc: 'कैमरा अउर माइक से नौकरी इंटरव्यू के अभ्यास'
      },
      tool3: {
        title: 'इंटरएक्टिव D3 माइंड मैप स्टूडियो',
        desc: 'पढ़ाई के पाठ के नक्शा अउर आरेख रूप में देखीं'
      },
      tool4: {
        title: 'अडैप्टिव क्विज अउर अभ्यास',
        desc: 'परीक्षा के तैयारी खातिर सवाल-जवाब'
      },
      tool5: {
        title: 'इंटरएक्टिव 3D कॉन्सेप्ट फ्लैशकार्ड्स',
        desc: 'जल्दी दोहरावे अउर याद रखे खातिर कार्ड'
      },
      tool6: {
        title: 'डायग्राम विज़न AI विश्लेषक',
        desc: 'चित्र अउर डायग्राम देख के समझल'
      },
      tool7: {
        title: 'अध्ययन इतिहास अउर लॉग्स',
        desc: 'पुरनका सवाल, टेस्ट अउर परिणाम देखीं'
      },
      tab: {
        title: 'अगिला इंटरएक्टिव बटन या इनपुट पर जाईं',
        desc: 'बारी-बारी से स्क्रीन के हर बटन पर आगे बढ़ीं'
      },
      shiftTab: {
        title: 'पिछिला बटन या इनपुट पर वापस आईं',
        desc: 'पाछे के विकल्प पर वापस आईं'
      },
      enter: {
        title: 'चुनल बटन दबाईं भा फॉर्म सबमिट करीं',
        desc: 'मनचाहा काम चालू या पक्का करीं'
      },
      slash: {
        title: 'सवाल पूछे वाला बॉक्स पर सीधा जाईं',
        desc: 'झटपट आपन प्रश्न टाइप करे खातिर'
      },
      question: {
        title: 'ई कीबोर्ड शॉर्टकट गाइड खोलीं भा बंद करीं',
        desc: 'सभ शॉर्टकट के सूची देखे खातिर'
      },
      theme: {
        title: 'डार्क / लाइट मोड थीम बदलीं',
        desc: 'आंख के आराम खातिर रंग अउर रौशनी बदलीं'
      },
      lang: {
        title: 'क्षेत्रीय भाषा अउर बोली चयन मेनू खोलीं',
        desc: '10 भाषा में से आपन पसंदीदा बोली चुनीं'
      },
      access: {
        title: 'न्यूरोडायवर्जेंट सुलभता मेनू खोलीं',
        desc: 'बायोनिक रीडिंग, फॉन्ट अउर आकार बदले खातिर'
      },
      fullscreen: {
        title: 'फुल स्क्रीन मोड चालू भा बंद करीं',
        desc: 'पूरा स्क्रीन पर बिना डिस्टर्बेंस के पढ़ीं'
      },
      quizKeys: {
        title: 'क्विज विकल्प चुनना (A, B, C, D)',
        desc: 'उत्तर देवे खातिर 1-4 या A-D दबाईं, अगिला खातिर Enter'
      },
      flashcardFlip: {
        title: 'फ्लैशकार्ड उलटना (Flip Card)',
        desc: 'सवाल अउर जवाब देखे खातिर Space या Enter दबाईं'
      },
      flashcardNav: {
        title: 'फ्लैशकार्ड आगे या पीछे करना',
        desc: 'अगिला कार्ड खातिर → अउर पिछिला खातिर ← दबाईं'
      },
      audioListen: {
        title: 'कार्ड या प्रश्न के क्षेत्रीय आवाज़ सुनल',
        desc: 'उच्चारण अउर व्याख्या सुने खातिर L दबाईं'
      }
    }
  },

  // 2. Awadhi (Hindi)
  'hi-awadhi': {
    title: 'कीबोर्ड नेविगेशन अउर शॉर्टकट्स',
    headerBtnLabel: 'शॉर्टकट्स',
    badge: 'संपूर्ण सुगमता',
    subtitle: 'कीबोर्ड शॉर्टकट्स निर्देशिका • बिना माउस अथवा स्क्रीन छुए पूरी तरह संचालित',
    noticeTitle: 'सहज कीबोर्ड अउर बोल के इस्तेमाल:',
    noticeBody: 'अगले बटन पर जाय खातिर Tab, बोलिके खातिर Space या Alt+V, अउर टूल्स बदले खातिर 1 से 7 दबावैं।',
    popularBadge: 'सबसे प्रसिद्ध',
    footerEsc: 'संवाद बंद करै खातिर कभी भी Esc दबावैं',
    gotItBtn: 'समझ गयेन (Got It)',
    categories: {
      voiceTitle: 'आवाज़ अउर ऑडियो नियंत्रण',
      toolsTitle: 'सीधे टूल बदले के नंबर',
      navTitle: 'नेविगेशन अउर फोकस नियंत्रण',
      accessTitle: 'सुलभता अउर डिस्प्ले सेटिंग्स',
      inToolTitle: 'टूल्स के अंदर काम आवै वाले शॉर्टकट्स'
    },
    shortcuts: {
      voiceToggle: {
        title: 'माइक चालू या बंद करौ (Voice Input Toggle)',
        desc: 'जब टाइप न करत हौ त स्पेस दबाई के बोलौ'
      },
      voiceForce: {
        title: 'कतहूँ से भी तुरंत माइक चालू/बंद करौ',
        desc: 'आवाज़ से बोले का तुरंत शुरू या बंद करौ'
      },
      speechStop: {
        title: 'चलत आवाज़ का तुरंत रोकौ',
        desc: 'AI की बोलत आवाज़ बंद करौ'
      },
      speechReplay: {
        title: 'पुरान AI उत्तर का फिर से सुनौ',
        desc: 'पिछले जवाब की आवाज़ दोबारा सुनौ'
      },
      esc: {
        title: 'माइक/ऑडियो रोकौ या मेनू बंद करौ',
        desc: 'कौनो भी खुलल विंडो या मेनू बंद करौ'
      },
      tool1: {
        title: 'वॉइस AI ट्यूटर अउर शंका समाधान',
        desc: 'बोलिके आपन पढ़ाई के सवाल पूछौ'
      },
      tool2: {
        title: 'मॉक इंटरव्यूअर स्टेज',
        desc: 'कैमरा व माइक से इंटरव्यू का अभ्यास करौ'
      },
      tool3: {
        title: 'इंटरएक्टिव D3 माइंड मैप स्टूडियो',
        desc: 'पाठ का विषय नक्शा के रूप मा देखौ'
      },
      tool4: {
        title: 'अडैप्टिव क्विज अउर अभ्यास',
        desc: 'परीक्षा की तैयारी खातिर सवाल-जवाब'
      },
      tool5: {
        title: 'इंटरएक्टिव 3D कॉन्सेप्ट फ्लैशकार्ड्स',
        desc: 'जल्दी-जल्दी दोहरावै अउर याद रखै खातिर'
      },
      tool6: {
        title: 'डायग्राम विज़न AI विश्लेषक',
        desc: 'चित्र अउर रेखाचित्र के समझ'
      },
      tool7: {
        title: 'अध्ययन इतिहास अउर लॉग्स',
        desc: 'पिछला सवाल, टेस्ट अउर रिकॉर्ड देखौ'
      },
      tab: {
        title: 'अगले बटन या इनपुट पर जाव',
        desc: 'क्रम से हर विकल्प पर आगे बढ़ौ'
      },
      shiftTab: {
        title: 'पिछले बटन या इनपुट पर वापस आव',
        desc: 'पीछे के विकल्प पर आव'
      },
      enter: {
        title: 'चुनल बटन दबावैं या फॉर्म सबमिट करौ',
        desc: 'आपन चुनाव पक्का करौ'
      },
      slash: {
        title: 'सवाल पूछै वाले बॉक्स पर सीधा जाव',
        desc: 'तुरंत आपन सवाल लिखै खातिर'
      },
      question: {
        title: 'ई कीबोर्ड शॉर्टकट गाइड खोलौ या बंद करौ',
        desc: 'शॉर्टकट सूची देखै खातिर'
      },
      theme: {
        title: 'डार्क / लाइट मोड थीम बदलो',
        desc: 'आंखिन के आराम खातिर रंग बदलो'
      },
      lang: {
        title: 'क्षेत्रीय भाषा अउर बोली चयन मेनू खोलौ',
        desc: '10 भाषा में से आपन पसंद की बोली चुनौ'
      },
      access: {
        title: 'सुगमता अउर पढ़ाई सेटिंग मेनू खोलौ',
        desc: 'बायोनिक रीडिंग अउर फॉन्ट बदलै खातिर'
      },
      fullscreen: {
        title: 'फुल स्क्रीन मोड चालू या बंद करौ',
        desc: 'पूरा स्क्रीन पर मन लगाय के पढ़ौ'
      },
      quizKeys: {
        title: 'क्विज उत्तर चुनव (A, B, C, D)',
        desc: 'उत्तर देवे खातिर 1-4 या A-D, अगले खातिर Enter दबावैं'
      },
      flashcardFlip: {
        title: 'फ्लैशकार्ड पलटव (Flip Card)',
        desc: 'सवाली या जवाबी पन्ना देखै खातिर Space या Enter'
      },
      flashcardNav: {
        title: 'फ्लैशकार्ड आगे या पीछे करव',
        desc: 'अगले कार्ड खातिर → अउर पिछले खातिर ← दबावैं'
      },
      audioListen: {
        title: 'कार्ड की अवधी आवाज़ सुनव',
        desc: 'व्याख्या सुने खातिर L दबावैं'
      }
    }
  },

  // 3. Standard Hindi
  'hi-standard': {
    title: 'कीबोर्ड नेविगेशन और शॉर्टकट्स',
    headerBtnLabel: 'शॉर्टकट्स',
    badge: 'पूर्ण सुलभता',
    subtitle: 'कीबोर्ड शॉर्टकट्स गाइड • बिना माउस या टच स्क्रीन के पूरी तरह संचालित',
    noticeTitle: 'पूर्ण हैंड्स-फ्री एवं कीबोर्ड एक्सेस:',
    noticeBody: 'प्रत्येक बटन पर जाने के लिए Tab, आवाज़ इनपुट के लिए Space या Alt+V, और टूल्स बदलने के लिए 1 से 7 दबाएं।',
    popularBadge: 'सर्वाधिक लोकप्रिय',
    footerEsc: 'यह विंडो बंद करने के लिए किसी भी समय Esc दबाएं',
    gotItBtn: 'समझ गए (Got It)',
    categories: {
      voiceTitle: 'आवाज़ और ऑडियो नियंत्रण',
      toolsTitle: 'सीधे टूल बदलने के नंबर',
      navTitle: 'नेविगेशन और फ़ोकस नियंत्रण',
      accessTitle: 'सुलभता और डिस्प्ले सेटिंग्स',
      inToolTitle: 'टूल्स के अंदर उपयोगी शॉर्टकट्स'
    },
    shortcuts: {
      voiceToggle: {
        title: 'माइक चालू या बंद करें (Voice Input Toggle)',
        desc: 'जब टाइप न कर रहे हों तब स्पेस दबाकर बोलना शुरू करें'
      },
      voiceForce: {
        title: 'किसी भी समय माइक तुरंत शुरू/बंद करें',
        desc: 'सीधे आवाज़ पहचान सक्रिय या बंद करें'
      },
      speechStop: {
        title: 'चल रही ऑडियो आवाज़ को तुरंत रोकें',
        desc: 'AI के वाचन को तुरंत म्यूट करें'
      },
      speechReplay: {
        title: 'पिछले AI ट्यूटर उत्तर को दोबारा सुनें',
        desc: 'अंतिम उत्तर का ऑडियो पुनः बजाएं'
      },
      esc: {
        title: 'माइक/ऑडियो रोकें या पॉपअप मेनू बंद करें',
        desc: 'खुले हुए संवाद या मेनू को तुरंत बंद करें'
      },
      tool1: {
        title: 'वॉइस AI ट्यूटर और डाउट सॉल्वर',
        desc: 'सुकराती पद्धति से शैक्षणिक शंका समाधान'
      },
      tool2: {
        title: 'वेबRTC मॉक इंटरव्यूअर स्टेज',
        desc: 'कैमरा और माइक के साथ वास्तविक इंटरव्यू अभ्यास'
      },
      tool3: {
        title: 'इंटरएक्टिव D3 माइंड मैप स्टूडियो',
        desc: 'अवधारणाओं का विज़ुअल मानचित्र और संरचना'
      },
      tool4: {
        title: 'अडैप्टिव क्विज़ जनरेटर एवं अभ्यास',
        desc: 'परीक्षा तैयारी हेतु बहुविकल्पीय प्रश्नोत्तरी'
      },
      tool5: {
        title: 'इंटरएक्टिव 3D कॉन्सेप्ट फ्लैशकार्ड्स',
        desc: 'त्वरित पुनरावृत्ति और याद रखने के लिए'
      },
      tool6: {
        title: 'डायग्राम विज़न AI विश्लेषक',
        desc: 'विज्ञान व गणितीय चित्रों का चरणबद्ध विश्लेषण'
      },
      tool7: {
        title: 'अध्ययन इतिहास एवं डेटाबेस लॉग्स',
        desc: 'पिछले सभी सवाल, क्विज़ और रिकॉर्ड्स देखें'
      },
      tab: {
        title: 'अगले इंटरएक्टिव बटन या इनपुट पर जाएं',
        desc: 'क्रमबद्ध रूप से अगले नियंत्रण पर फ़ोकस करें'
      },
      shiftTab: {
        title: 'पिछले इंटरएक्टिव बटन या इनपुट पर वापस आएं',
        desc: 'विपरीत दिशा में पिछले नियंत्रण पर जाएं'
      },
      enter: {
        title: 'फ़ोकस किए गए बटन को दबाएं या फ़ॉर्म सबमिट करें',
        desc: 'चयनित क्रिया को निष्पादित या सक्रिय करें'
      },
      slash: {
        title: 'सवाल पूछने वाले टेक्स्ट बॉक्स पर सीधा जाएं',
        desc: 'तुरंत अपना प्रश्न टाइप करना शुरू करें'
      },
      question: {
        title: 'यह कीबोर्ड शॉर्टकट्स गाइड खोलें या बंद करें',
        desc: 'सुलभता एवं शॉर्टकट संदर्भ सूची देखें'
      },
      theme: {
        title: 'डार्क / लाइट मोड थीम बदलें',
        desc: 'आंखों के आराम हेतु दृश्य कंट्रास्ट बदलें'
      },
      lang: {
        title: 'क्षेत्रीय भाषा और बोली चयन मेनू खोलें',
        desc: '10 भारतीय एवं वैश्विक भाषाओं में से चुनें'
      },
      access: {
        title: 'न्यूरोडायवर्जेंट सुलभता मेनू खोलें',
        desc: 'बायोनिक रीडिंग, डिस्लेक्सिया फ़ॉन्ट और आकार'
      },
      fullscreen: {
        title: 'फुल स्क्रीन मोड चालू या बंद करें',
        desc: 'बिना ध्यान भटकाव के पूर्ण स्क्रीन पर अध्ययन करें'
      },
      quizKeys: {
        title: 'क्विज़ विकल्प चयन (A, B, C, D या 1-4)',
        desc: 'उत्तर चुनने के लिए A-D, अगले प्रश्न के लिए Enter दबाएं'
      },
      flashcardFlip: {
        title: 'फ्लैशकार्ड पलटना (Flip Card)',
        desc: 'प्रश्न व उत्तर पक्ष देखने के लिए Space या Enter'
      },
      flashcardNav: {
        title: 'कार्ड आगे या पीछे बदलना',
        desc: 'अगले कार्ड के लिए → और पिछले के लिए ← दबाएं'
      },
      audioListen: {
        title: 'कार्ड या प्रश्न की व्याख्या सुनना',
        desc: 'प्राकृतिक आवाज़ में सुनने के लिए L दबाएं'
      }
    }
  },

  // 4. Varhadi (Marathi)
  'mr-varhadi': {
    title: 'कीबोर्ड नेव्हिगेशन आणि शॉर्टकट्स',
    headerBtnLabel: 'शॉर्टकट्स',
    badge: 'संपूर्ण सुलभता',
    subtitle: 'कीबोर्ड शॉर्टकट्स मार्गदर्शक • माउस किंवा टच स्क्रीनशिवाय पूर्णपणे कार्यक्षम',
    noticeTitle: 'हँड्स-फ्री आणि कीबोर्ड वापर:',
    noticeBody: 'पुढील बटणावर जाण्यासाठी Tab, व्हॉइस इनपुटसाठी Space किंवा Alt+V, आणि टूल्स बदलण्यासाठी 1 ते 7 दाबा.',
    popularBadge: 'सर्वाधिक लोकप्रिय',
    footerEsc: 'हा डायलॉग बंद करण्यासाठी केव्हाही Esc दाबा',
    gotItBtn: 'समजले (Got It)',
    categories: {
      voiceTitle: 'आवाज आणि ऑडिओ नियंत्रणे',
      toolsTitle: 'थेट टूल बदलण्यासाठी आकडे',
      navTitle: 'नेव्हिगेशन आणि फोकस नियंत्रणे',
      accessTitle: 'सुलभता आणि डिस्प्ले सेटिंग्ज',
      inToolTitle: 'टूल्समधील उपयुक्त शॉर्टकट्स'
    },
    shortcuts: {
      voiceToggle: {
        title: 'माइक सुरू किंवा बंद करा (Voice Toggle)',
        desc: 'टाइप करत नसताना स्पेस दाबून बोलणे सुरू करा'
      },
      voiceForce: {
        title: 'कुठूनही माइक त्वरित सुरू/बंद करा',
        desc: 'थेट व्हॉइस रेकॉर्डिंग सुरू किंवा बंद करा'
      },
      speechStop: {
        title: 'सुरू असलेला ऑडिओ त्वरित थांबवा',
        desc: 'AI चा बोलणारा आवाज लगेच म्यूट करा'
      },
      speechReplay: {
        title: 'मागील AI उत्तर पुन्हा ऐका',
        desc: 'मागील उत्तराचा आवाज पुन्हा प्ले करा'
      },
      esc: {
        title: 'माइक/ऑडिओ थांबवा किंवा पॉपअप बंद करा',
        desc: 'उघडलेला कोणताही मेनू त्वरित बंद करा'
      },
      tool1: {
        title: 'व्हॉइस AI ट्यूटर आणि शंका निरसन',
        desc: 'बोलून आपल्या शैक्षणिक शंका विचारा व शिका'
      },
      tool2: {
        title: 'मॉक इंटरव्ह्यू स्टेज',
        desc: 'कॅमेरा व माइकसह प्रत्यक्ष मुलाखतीचा सराव'
      },
      tool3: {
        title: 'इंटरअॅक्टिव्ह D3 माइंड मॅप स्टुडिओ',
        desc: 'संकल्पनांचे परस्परसंवादी दृश्य नकाशे'
      },
      tool4: {
        title: 'अडॅप्टिव्ह क्विझ आणि सराव',
        desc: 'परीक्षेच्या तयारीसाठी बहुपर्यायी सराव प्रश्न'
      },
      tool5: {
        title: '3D कॉन्सेप्ट फ्लॅशकार्ड्स',
        desc: 'जलद उजळणी आणि स्मरणशक्ती वाढवण्यासाठी'
      },
      tool6: {
        title: 'आकृती व रेखाचित्र AI विश्लेषक',
        desc: 'विज्ञान व गणिताच्या आकृत्यांचे सुलभ स्पष्टीकरण'
      },
      tool7: {
        title: 'अभ्यास इतिहास आणि नोंदी',
        desc: 'पूर्वी विचारलेल्या सर्व शंका व निकाल पहा'
      },
      tab: {
        title: 'पुढील बटण किंवा इनपुटवर जा',
        desc: 'क्रमाने प्रत्येक घटकावर पुढे जा'
      },
      shiftTab: {
        title: 'मागील बटण किंवा इनपुटवर परत जा',
        desc: 'मागच्या घटकांवर परत जा'
      },
      enter: {
        title: 'निवडलेले बटण दाबा किंवा फॉर्म सबमिट करा',
        desc: 'कृती सुरू किंवा निश्चित करा'
      },
      slash: {
        title: 'प्रश्न विचारण्याच्या बॉक्सवर थेट जा',
        desc: 'त्वरित आपला प्रश्न टाइप करा'
      },
      question: {
        title: 'हे कीबोर्ड शॉर्टकट मार्गदर्शक उघडा किंवा बंद करा',
        desc: 'शॉर्टकट संदर्भ पाहण्यासाठी'
      },
      theme: {
        title: 'डार्क / लाइट मोड बदला',
        desc: 'डोळ्यांच्या आरामासाठी थीम बदला'
      },
      lang: {
        title: 'प्रादेशिक भाषा आणि बोली निवडीचे मेनू उघडा',
        desc: 'आपल्या पसंतीची स्थानिक भाषा निवडा'
      },
      access: {
        title: 'विशेष सुलभता व वाचन मेनू उघडा',
        desc: 'बायोनिक रीडिंग व डिस्लेक्सिया फॉन्ट सेटिंग्ज'
      },
      fullscreen: {
        title: 'फुल स्क्रीन मोड सुरू किंवा बंद करा',
        desc: 'एकाग्रतेसाठी पूर्ण स्क्रीनवर अभ्यास करा'
      },
      quizKeys: {
        title: 'क्विझ पर्याय निवडणे (A, B, C, D)',
        desc: 'उत्तर देण्यासाठी 1-4 किंवा A-D, पुढे जाण्यासाठी Enter'
      },
      flashcardFlip: {
        title: 'फ्लॅशकार्ड उलटा (Flip Card)',
        desc: 'प्रश्न व उत्तर पाहण्यासाठी Space किंवा Enter दाबा'
      },
      flashcardNav: {
        title: 'कार्ड पुढे किंवा मागे करा',
        desc: 'पुढील कार्डसाठी → आणि मागीलसाठी ← दाबा'
      },
      audioListen: {
        title: 'कार्ड किंवा प्रश्नाचा आवाज ऐका',
        desc: 'स्पष्टीकरण ऐकण्यासाठी L दाबा'
      }
    }
  },

  // 5. Bengali (Bangla)
  'bn-rarh': {
    title: 'কীবোর্ড নেভিগেশন ও শর্টকাট',
    headerBtnLabel: 'শর্টকাট',
    badge: 'সম্পূর্ণ অ্যাক্সেসিবিলিটি',
    subtitle: 'কীবোর্ড শর্টকাট গাইড • মাউস বা টাচ স্ক্রিন ছাড়াই সম্পূর্ণ কার্যকর',
    noticeTitle: 'হ্যান্ডস-ফ্রি ও কীবোর্ড অ্যাক্সেস:',
    noticeBody: 'প্রতিটি বিকল্পে যেতে Tab, মুখে কথা বলে ইনপুটের জন্য Space বা Alt+V, এবং টুল পরিবর্তন করতে 1 থেকে 7 চাপুন।',
    popularBadge: 'সবচেয়ে জনপ্রিয়',
    footerEsc: 'এই উইন্ডোটি বন্ধ করতে যেকোনো সময় Esc চাপুন',
    gotItBtn: 'বুঝেছি (Got It)',
    categories: {
      voiceTitle: 'ভয়েস ও অডিও নিয়ন্ত্রণ',
      toolsTitle: 'টুল পরিবর্তনের নম্বরসমূহ',
      navTitle: 'নেভিগেশন ও ফোকাস নিয়ন্ত্রণ',
      accessTitle: 'অ্যাক্সেসিবিলিটি ও ডিসপ্লে সেটিংস',
      inToolTitle: 'টুলের ভেতরের সুবিধাজনক শর্টকাট'
    },
    shortcuts: {
      voiceToggle: {
        title: 'মাইক্রোফোন চালু বা বন্ধ করুন (Voice Toggle)',
        desc: 'টাইপ না করার সময় স্পেস চেপে মুখে কথা বলা শুরু করুন'
      },
      voiceForce: {
        title: 'সরাসরি মাইক্রোফোন শুরু/বন্ধ করুন',
        desc: 'যেকোনো জায়গা থেকে ভয়েস ইনপুট সক্রিয় করুন'
      },
      speechStop: {
        title: 'চলমান অডিও সাথে সাথে থামান',
        desc: 'AI-এর কথা বলা অবিলম্বে বন্ধ করুন'
      },
      speechReplay: {
        title: 'পূর্ববর্তী AI উত্তর আবার শুনুন',
        desc: 'AI গৃহশিক্ষকের ব্যাখ্যা পুনরায় শুনুন'
      },
      esc: {
        title: 'মাইক/অডিও থামান বা পপআপ বন্ধ করুন',
        desc: 'খোলা মেনু বা উইন্ডো বন্ধ করুন'
      },
      tool1: {
        title: 'ভয়েস AI গৃহশিক্ষক ও সংশয় সমাধান',
        desc: 'মুখের কথায় প্রশ্ন করে সহজে শিখুন'
      },
      tool2: {
        title: 'মক ইন্টারভিউ স্টেজ',
        desc: 'ক্যামেরা ও মাইক দিয়ে চাকরির ইন্টারভিউ অনুশীলন'
      },
      tool3: {
        title: 'ইন্টারেক্টিভ D3 মাইন্ড ম্যাপ স্টুডিও',
        desc: 'পাঠ্য বিষয়ের চাক্ষুষ ধারণা মানচিত্র'
      },
      tool4: {
        title: 'অভিযোজিত কুইজ ও অনুশীলন',
        desc: 'পরীক্ষার প্রস্তুতির জন্য প্রশ্ন-উত্তর অনুশীলন'
      },
      tool5: {
        title: 'ইন্টারেক্টিভ 3D ফ্ল্যাশকার্ড',
        desc: 'দ্রুত পুনরাবৃত্তি এবং স্মৃতিতে রাখার জন্য'
      },
      tool6: {
        title: 'ডায়াগ্রাম ভিশন AI বিশ্লেষক',
        desc: 'চিত্র ও রেখাচিত্রের বিশদ ধাপভিত্তিক ব্যাখ্যা'
      },
      tool7: {
        title: 'অধ্যয়নের ইতিহাস ও লগ',
        desc: 'আগের সব সংশয়, কুইজ ও রিপোর্ট দেখুন'
      },
      tab: {
        title: 'পরবর্তী বোতাম বা ইনপুটে যান',
        desc: 'ধারাবাহিকভাবে পরের বিকল্পে ফোকাস করুন'
      },
      shiftTab: {
        title: 'পূর্ববর্তী বোতাম বা ইনপুটে ফিরে যান',
        desc: 'পেছনের বিকল্পে ফিরে আসুন'
      },
      enter: {
        title: 'নির্বাচিত বোতামে চাপ দিন বা জমা দিন',
        desc: 'নির্দিষ্ট কাজটি নিশ্চিত বা সক্রিয় করুন'
      },
      slash: {
        title: 'প্রশ্ন টাইপ করার বক্সে সরাসরি যান',
        desc: 'তৎক্ষণাৎ আপনার প্রশ্ন লেখা শুরু করুন'
      },
      question: {
        title: 'এই কীবোর্ড শর্টকাট গাইডটি খুলুন বা বন্ধ করুন',
        desc: 'শর্টকাটের তালিকা দেখতে'
      },
      theme: {
        title: 'ডার্ক / লাইট মোড পরিবর্তন করুন',
        desc: 'চোখের স্বস্তির জন্য ডিসপ্লে থিম বদলান'
      },
      lang: {
        title: 'আঞ্চলিক ভাষা ও উপভাষা নির্বাচক মেনু খুলুন',
        desc: '১০টি ভাষার মধ্য থেকে নিজের ভাষা বেছে নিন'
      },
      access: {
        title: 'বিশেষ পাঠ ও অ্যাক্সেসিবিলিটি মেনু খুলুন',
        desc: 'বায়োনিক রিডিং ও ডিসলেক্সিয়া ফন্ট সেটিংস'
      },
      fullscreen: {
        title: 'ফুল স্ক্রিন মোড চালু বা বন্ধ করুন',
        desc: 'মনোযোগ সহকারে সম্পূর্ণ স্ক্রিনে পড়ুন'
      },
      quizKeys: {
        title: 'কুইজ উত্তর নির্বাচন (A, B, C, D)',
        desc: 'উত্তর দিতে 1-4 বা A-D, পরের প্রশ্নে যেতে Enter'
      },
      flashcardFlip: {
        title: 'ফ্ল্যাশকার্ড ওল্টান (Flip Card)',
        desc: 'প্রশ্ন ও উত্তর দেখতে Space বা Enter চাপুন'
      },
      flashcardNav: {
        title: 'কার্ড পরিবর্তন করুন',
        desc: 'পরের কার্ডে যেতে → এবং আগের কার্ডে যেতে ← চাপুন'
      },
      audioListen: {
        title: 'কার্ডের আঞ্চলিক অডিও শুনুন',
        desc: 'উচ্চারণ ও ব্যাখ্যা শুনতে L চাপুন'
      }
    }
  },

  // 6. Tamil
  'ta-madurai': {
    title: 'விசைப்பலகை வழிசெலுத்தல் & குறுக்குவழிகள்',
    headerBtnLabel: 'குறுக்குவழிகள்',
    badge: 'முழு அணுகல் வசதி',
    subtitle: 'விசைப்பலகை குறுக்குவழி வழிகாட்டி • மவுஸ் இன்றி முழுமையாக இயங்கக்கூடியது',
    noticeTitle: 'ஹேண்ட்ஸ்-ஃப்ரீ விசைப்பலகை அணுகல்:',
    noticeBody: 'ஒவ்வொரு பட்டனுக்கும் செல்ல Tab, குரல் உள்ளீட்டிற்கு Space அல்லது Alt+V, கருவிகளை மாற்ற 1 முதல் 7 ஐ அழுத்தவும்.',
    popularBadge: 'மிகவும் பிரபலம்',
    footerEsc: 'இதை மூட எந்த நேரத்திலும் Esc ஐ அழுத்தவும்',
    gotItBtn: 'புரிந்தது (Got It)',
    categories: {
      voiceTitle: 'குரல் மற்றும் ஆடியோ கட்டுப்பாடுகள்',
      toolsTitle: 'கருவிகளை மாற்றும் எண்கள்',
      navTitle: 'வழிசெலுத்தல் மற்றும் கவனம்',
      accessTitle: 'அணுகல்தன்மை & காட்சி அமைப்புகள்',
      inToolTitle: 'கருவிகளின் உள்ளேயான குறுக்குவழிகள்'
    },
    shortcuts: {
      voiceToggle: {
        title: 'குரல் உள்ளீட்டை மாற்றவும் (Voice Toggle)',
        desc: 'தட்டச்சு செய்யாத போது Space அழுத்தி பேசத் தொடங்குங்கள்'
      },
      voiceForce: {
        title: 'மைக்கை உடனடியாக ஆன்/ஆஃப் செய்க',
        desc: 'எங்கிருந்தும் குரல் உள்ளீட்டைத் தொடங்குக'
      },
      speechStop: {
        title: 'இயங்கும் ஆடியோவை உடனடியாக நிறுத்துங்கள்',
        desc: 'AI பேச்சை உடனே முடக்குக'
      },
      speechReplay: {
        title: 'முந்தைய AI விளக்கத்தை மீண்டும் கேளுங்கள்',
        desc: 'முந்தைய பதிலை மீண்டும் ஒலிக்கச் செய்க'
      },
      esc: {
        title: 'மைக்/ஆடியோவை நிறுத்து அல்லது மெனுவை மூடு',
        desc: 'உரையாடல் அல்லது மெனுக்களை மூடுக'
      },
      tool1: {
        title: 'குரல் AI ஆசிரியர் & சந்தேக தீர்வு',
        desc: 'பேசி சந்தேகங்களைத் தீர்க்கும் AI ஆசிரியர்'
      },
      tool2: {
        title: 'மாதிரி நேர்காணல் அரங்கு',
        desc: 'கேமரா & மைக்குடன் நேரடி நேர்காணல் பயிற்சி'
      },
      tool3: {
        title: 'ஊடாடும் மன வரைபட அரங்கு (Mind Maps)',
        desc: 'பாடக் கருத்துகளின் காட்சி வரைபடம்'
      },
      tool4: {
        title: 'வினாடி வினா & பயிற்சி அரங்கு',
        desc: 'தேர்வு தயாரிப்புக்கான பயிற்சி வினாக்கள்'
      },
      tool5: {
        title: '3D கருத்து அட்டைகள் (Flashcards)',
        desc: 'விரைவான மீள்பார்வை மற்றும் நினைவாற்றலுக்கு'
      },
      tool6: {
        title: 'வரைபட பார்வை AI விளக்கம்',
        desc: 'அறிவியல் வரைபடங்களை ஆராய்ந்து புரிந்துகொள்க'
      },
      tool7: {
        title: 'படிப்பு வரலாறு & பதிவுகள்',
        desc: 'முந்தைய சந்தேகங்கள் மற்றும் குறிப்புகளைக் காண்க'
      },
      tab: {
        title: 'அடுத்த பட்டன் அல்லது உள்ளீட்டிற்குச் செல்க',
        desc: 'ஒவ்வொன்றாக அடுத்த கட்டுப்பாட்டிற்கு நகர்க'
      },
      shiftTab: {
        title: 'முந்தைய பட்டன் அல்லது உள்ளீட்டிற்குத் திரும்புக',
        desc: 'பின்னோக்கி முந்தைய கட்டுப்பாட்டிற்கு நகர்க'
      },
      enter: {
        title: 'தேர்ந்தெடுக்கப்பட்ட பட்டனை அழுத்து அல்லது சமர்ப்பி',
        desc: 'செயலை உறுதி செய்து தொடங்குக'
      },
      slash: {
        title: 'கேள்வி கேட்கும் பெட்டிக்கு நேரடியாகச் செல்க',
        desc: 'உடனே உங்கள் கேள்வியை தட்டச்சு செய்க'
      },
      question: {
        title: 'இந்த குறுக்குவழி வழிகாட்டியைத் திற அல்லது மூடு',
        desc: 'குறுக்குவழிகளைப் பார்வையிட'
      },
      theme: {
        title: 'டார்க் / லைட் பயன்முறையை மாற்றுக',
        desc: 'கண்களுக்கு இதமான வண்ணத் திரையை மாற்றுக'
      },
      lang: {
        title: 'பிராந்திய மொழி & வட்டார வழக்கு தேர்வை திறக்குக',
        desc: 'உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்'
      },
      access: {
        title: 'சிறப்பு வாசிப்பு வசதி மெனுவைத் திறக்குக',
        desc: 'பயோனிக் வாசிப்பு & எழுத்துரு அமைப்புகள்'
      },
      fullscreen: {
        title: 'முழுத்திரை பயன்முறையை ஆன்/ஆஃப் செய்க',
        desc: 'கவனச்சிதறல் இன்றி முழுத்திரையில் கற்க'
      },
      quizKeys: {
        title: 'வினாடி வினா விடை தேர்வு (A, B, C, D)',
        desc: 'விடையளிக்க 1-4 அல்லது A-D, அடுத்த வினாவிற்கு Enter'
      },
      flashcardFlip: {
        title: 'அட்டையைத் திருப்புதல் (Flip Card)',
        desc: 'கேள்வி/விடையைப் பார்க்க Space அல்லது Enter'
      },
      flashcardNav: {
        title: 'அட்டைகளை மாற்றுதல்',
        desc: 'அடுத்த அட்டைக்கு → மற்றும் முந்தைய அட்டைக்கு ←'
      },
      audioListen: {
        title: 'அட்டையின் தமிழ் விளக்கத்தைக் கேளுங்கள்',
        desc: 'விளக்கத்தைக் கேட்க L அழுத்தவும்'
      }
    }
  },

  // 7. Telugu
  'te-telangana': {
    title: 'కీబోర్డ్ నావిగేషన్ & షార్ట్‌కట్స్',
    headerBtnLabel: 'షార్ట్‌కట్స్',
    badge: 'పూర్తి సౌలభ్యం',
    subtitle: 'కీబోర్డ్ షార్ట్‌కట్ గైడ్ • మౌస్ లేదా టచ్ స్క్రీన్ లేకుండా పూర్తిగా ఉపయోగించవచ్చు',
    noticeTitle: 'హ్యాండ్స్-ఫ్రీ కీబోర్డ్ యాక్సెస్:',
    noticeBody: 'ప్రతి బటన్‌కు వెళ్లడానికి Tab, వాయిస్ ఇన్‌పుట్ కోసం Space లేదా Alt+V, టూల్స్ మార్చడానికి 1 నుండి 7 నొక్కండి.',
    popularBadge: 'అత్యంత ప్రజాదరణ పొందినది',
    footerEsc: 'ఈ విండో మూసివేయడానికి ఎప్పుడైనా Esc నొక్కండి',
    gotItBtn: 'అర్థమైంది (Got It)',
    categories: {
      voiceTitle: 'వాయిస్ & ఆడియో నియంత్రణలు',
      toolsTitle: 'టూల్స్ మార్చే నంబర్లు',
      navTitle: 'నావిగేషన్ & ఫోకస్ నియంత్రణలు',
      accessTitle: 'సౌలభ్యం & డిస్‌ప్లే సెట్టింగ్‌లు',
      inToolTitle: 'టూల్స్‌లో ఉపయోగపడే షార్ట్‌కట్స్'
    },
    shortcuts: {
      voiceToggle: {
        title: 'వాయిస్ ఇన్‌పుట్ మార్చండి (Voice Toggle)',
        desc: 'టైప్ చేయనప్పుడు స్పేస్ నొక్కి మాట్లాడటం ప్రారంభించండి'
      },
      voiceForce: {
        title: 'మైక్రోఫోన్ వెంటనే ఆన్/ఆఫ్ చేయండి',
        desc: 'ఎక్కడి నుండైనా తక్షణమే వాయిస్ ఇన్పుట్ పొందండి'
      },
      speechStop: {
        title: 'ప్లే అవుతున్న ఆడియోను వెంటనే ఆపండి',
        desc: 'AI వాయిస్ రీడింగ్‌ను మ్యూట్ చేయండి'
      },
      speechReplay: {
        title: 'మునుపటి AI వివరణను మళ్ళీ వినండి',
        desc: 'చివరి సమాధానాన్ని పునఃప్లే చేయండి'
      },
      esc: {
        title: 'మైక్/ఆడియో ఆపండి లేదా పాపప్‌ను మూసివేయండి',
        desc: 'తెరవబడిన మెనూలను వెంటనే మూసివేయండి'
      },
      tool1: {
        title: 'వాయిస్ AI ట్యూటర్ & సందేహ నివారణ',
        desc: 'మాట్లాడి మీ చదువుల సందేహాలను తీర్చుకోండి'
      },
      tool2: {
        title: 'మాక్ ఇంటర్వ్యూయర్ స్టేజ్',
        desc: 'కెమెరా & మైక్‌తో నిజమైన ఇంటర్వ్యూ ప్రాక్టీస్'
      },
      tool3: {
        title: 'ఇంటరాక్టివ్ D3 మైండ్ మ్యాప్ స్టూడియో',
        desc: 'కాన్సెప్ట్‌ల దృశ్య మైండ్ మ్యాప్‌లు'
      },
      tool4: {
        title: 'అడాప్టివ్ క్విజ్ & ప్రాక్టీస్',
        desc: 'పరీక్షల తయారీ కోసం బహుళైచ్ఛిక ప్రశ్నలు'
      },
      tool5: {
        title: 'ఇంటరాక్టివ్ 3D ఫ్లాష్‌కార్డ్‌లు',
        desc: 'వేగవంతమైన పునశ్చరణ మరియు గుర్తుంచుకోవడానికి'
      },
      tool6: {
        title: 'రేఖాచిత్ర విజన్ AI విశ్లేషణ',
        desc: 'బొమ్మలు మరియు డయాగ్రమ్‌ల సులభ వివరణ'
      },
      tool7: {
        title: 'అధ్యయన చరిత్ర & రికార్డులు',
        desc: 'మునుపటి ప్రశ్నలు, క్విజ్‌లు మరియు ఫలితాలను చూడండి'
      },
      tab: {
        title: 'తదుపరి బటన్ లేదా ఇన్‌పుట్‌కు వెళ్లండి',
        desc: 'క్రమంగా తదుపరి ఆప్షన్‌పై ఫోకస్ చేయండి'
      },
      shiftTab: {
        title: 'మునుపటి బటన్ లేదా ఇన్‌పుట్‌కు తిరిగి వెళ్లండి',
        desc: 'వెనుకకు మునుపటి ఆప్షన్‌కు వెళ్లండి'
      },
      enter: {
        title: 'ఎంచుకున్న బటన్‌ను నొక్కండి లేదా సమర్పించండి',
        desc: 'చర్యను నిర్ధారించి సక్రియం చేయండి'
      },
      slash: {
        title: 'ప్రశ్న అడిగే బాక్స్‌పై నేరుగా ఫోకస్ చేయండి',
        desc: 'వెంటనే మీ ప్రశ్నను టైప్ చేయడం ప్రారంభించండి'
      },
      question: {
        title: 'ఈ కీబోర్డ్ షార్ట్‌కట్‌ల గైడ్‌ని తెరవండి లేదా మూసివేయండి',
        desc: 'షార్ట్‌కట్ సూచనలను చూడటానికి'
      },
      theme: {
        title: 'డార్క్ / లైట్ మోడ్ థీమ్‌ను మార్చండి',
        desc: 'కంటికి అనుకూలమైన రంగులు'
      },
      lang: {
        title: 'ప్రాంతీయ భాష & యాసల ఎంపిక మెనూని తెరవండి',
        desc: 'మీకు కావలసిన స్థానిక భాషను ఎంచుకోండి'
      },
      access: {
        title: 'ప్రత్యేక పఠన సౌలభ్యాల మెనూని తెరవండి',
        desc: 'బయోనిక్ రీడింగ్ మరియు ఫాంట్ సెట్టింగ్‌లు'
      },
      fullscreen: {
        title: 'పూర్తి స్క్రీన్ మోడ్‌ను ఆన్ లేదా ఆఫ్ చేయండి',
        desc: 'ఏకాగ్రతతో చదువుకోవడానికి పూర్తి స్క్రీన్'
      },
      quizKeys: {
        title: 'క్విజ్ సమాధానం ఎంపిక (A, B, C, D)',
        desc: 'సమాధానం కోసం 1-4 లేదా A-D, తర్వాత ప్రశ్న కోసం Enter'
      },
      flashcardFlip: {
        title: 'కార్డును తిప్పండి (Flip Card)',
        desc: 'ప్రశ్న/జవాబు చూడటానికి Space లేదా Enter'
      },
      flashcardNav: {
        title: 'కార్డులను మార్చండి',
        desc: 'తర్వాతి కార్డు కోసం → మరియు మునుపటి కార్డు కోసం ←'
      },
      audioListen: {
        title: 'కార్డు యొక్క తెలుగు ఆడియోను వినండి',
        desc: 'వివరణ వినడానికి L నొక్కండి'
      }
    }
  },

  // 8. Gujarati
  'gu-kathiyawadi': {
    title: 'કીબોર્ડ નેવિગેશન અને શોર્ટકટ્સ',
    headerBtnLabel: 'શોર્ટકટ્સ',
    badge: 'સંપૂર્ણ સુલભતા',
    subtitle: 'કીબોર્ડ શોર્ટકટ્સ માર્ગદર્શિકા • માઉસ કે ટચ સ્ક્રીન વગર સંપૂર્ણ કાર્યરત',
    noticeTitle: 'હેન્ડ્સ-ફ્રી અને કીબોર્ડ ઍક્સેસ:',
    noticeBody: 'દરેક બટન પર જવા માટે Tab, બોલીને ઇનપુટ આપવા Space અથવા Alt+V, અને ટૂલ્સ બદલવા 1 થી 7 દબાવો.',
    popularBadge: 'સૌથી લોકપ્રિય',
    footerEsc: 'આ વિન્ડો બંધ કરવા ગમે ત્યારે Esc દબાવો',
    gotItBtn: 'સમજાઈ ગયું (Got It)',
    categories: {
      voiceTitle: 'અવાજ અને ઑડિયો નિયંત્રણો',
      toolsTitle: 'ટૂલ્સ બદલવા માટેના નંબરો',
      navTitle: 'નેવિગેશન અને ફોકસ નિયંત્રણો',
      accessTitle: 'સુલભતા અને ડિસ્પ્લે સેટિંગ્સ',
      inToolTitle: 'ટૂલ્સની અંદરના ઉપયોગી શોર્ટકટ્સ'
    },
    shortcuts: {
      voiceToggle: {
        title: 'માઇક્રોફોન ચાલુ અથવા બંધ કરો (Voice Toggle)',
        desc: 'ટાઇપ ન કરતા હોવ ત્યારે સ્પેસ દબાવીને બોલવાનું શરૂ કરો'
      },
      voiceForce: {
        title: 'ગમે ત્યાંથી માઇક્રોફોન તાત્કાલિક શરૂ/બંધ કરો',
        desc: 'સીધું વૉઇસ ઇનપુટ મેળવો'
      },
      speechStop: {
        title: 'ચાલુ ઑડિયો તરત જ રોકો',
        desc: 'AI નો અવાજ તરત જ મ્યૂટ કરો'
      },
      speechReplay: {
        title: 'પાછલો AI ઉત્તર ફરીથી સાંભળો',
        desc: 'AI ટ્યુટરનું સમજૂતી ફરીથી વગાડો'
      },
      esc: {
        title: 'માઇક/ઑડિયો રોકો અથવા પૉપઅપ બંધ કરો',
        desc: 'ખૂલેલું મેનૂ કે વિન્ડો તરત જ બંધ કરો'
      },
      tool1: {
        title: 'વૉઇસ AI ટ્યુટર અને શંકા નિવારણ',
        desc: 'બોલીને અભ્યાસના પ્રશ્નો ઉકેલો અને શીખો'
      },
      tool2: {
        title: 'મૉક ઇન્ટરવ્યુઅર સ્ટેજ',
        desc: 'કૅમેરા અને માઇક સાથે ઇન્ટરવ્યુની તૈયારી'
      },
      tool3: {
        title: 'ઇન્ટરેક્ટિવ D3 માઇન્ડ મેપ સ્ટુડિયો',
        desc: 'વિષયોનું વિઝ્યુઅલ કન્સેપ્ટ મેપિંગ'
      },
      tool4: {
        title: 'એડેપ્ટિવ ક્વિઝ અને પ્રેક્ટિસ',
        desc: 'પરીક્ષાની તૈયારી માટે પ્રશ્નોત્તરી'
      },
      tool5: {
        title: '3D કન્સેપ્ટ ફ્લેશકાર્ડ્સ',
        desc: 'ઝડપી પુનરાવર્તન અને યાદ રાખવા માટે'
      },
      tool6: {
        title: 'ડાયાગ્રામ વિઝન AI વિશ્લેષક',
        desc: 'ચિત્રો અને આકૃતિઓનું વિગતવાર વિશ્લેષણ'
      },
      tool7: {
        title: 'અભ્યાસ ઇતિહાસ અને રેકોર્ડ્સ',
        desc: 'અગાઉના તમામ પ્રશ્નો અને પરિણામો જુઓ'
      },
      tab: {
        title: 'આગળના બટન અથવા ઇનપુટ પર જાઓ',
        desc: 'ક્રમશઃ આગળના વિકલ્પ પર જાઓ'
      },
      shiftTab: {
        title: 'પાછલા બટન અથવા ઇનપુટ પર પાછા જાઓ',
        desc: 'પાછળના ઘટક પર પાછા ફરો'
      },
      enter: {
        title: 'પસંદ કરેલું બટન દબાવો અથવા સબમિટ કરો',
        desc: 'ક્રિયા શરૂ કરો અથવા પુષ્ટિ કરો'
      },
      slash: {
        title: 'પ્રશ્ન પૂછવાના બોક્સ પર સીધા જાઓ',
        desc: 'તરત જ પ્રશ્ન લખવાનું શરૂ કરો'
      },
      question: {
        title: 'આ કીબોર્ડ શોર્ટકટ્સ ગાઇડ ખોલો અથવા બંધ કરો',
        desc: 'સહાયતા જોવા માટે'
      },
      theme: {
        title: 'ડાર્ક / લાઈટ મોડ બદલો',
        desc: 'આંખોના આરામ માટે થીમ બદલો'
      },
      lang: {
        title: 'પ્રાદેશિક ભાષા અને બોલી પસંદગીનું મેનૂ ખોલો',
        desc: 'તમારી ભાષા પસંદ કરો'
      },
      access: {
        title: 'વિશેષ સુલભતા અને વાંચન સેટિંગ્સ ખોલો',
        desc: 'બાયોનિક રીડિંગ અને ફોન્ટ સેટિંગ્સ'
      },
      fullscreen: {
        title: 'ફુલ સ્ક્રીન મોડ ચાલુ અથવા બંધ કરો',
        desc: 'એકાગ્રતાપૂર્વક અભ્યાસ કરવા માટે'
      },
      quizKeys: {
        title: 'ક્વિઝ વિકલ્પ પસંદગી (A, B, C, D)',
        desc: 'જવાબ આપવા 1-4 અથવા A-D, આગળ વધવા Enter'
      },
      flashcardFlip: {
        title: 'ફ્લેશકાર્ડ ઉલટાવો (Flip Card)',
        desc: 'પ્રશ્ન/જવાબ જોવા Space અથવા Enter'
      },
      flashcardNav: {
        title: 'કાર્ડ આગળ-પાછળ કરો',
        desc: 'આગળના કાર્ડ માટે → અને પાછળ માટે ←'
      },
      audioListen: {
        title: 'કાર્ડનો ગુજરાતી ઑડિયો સાંભળો',
        desc: 'સમજૂતી સાંભળવા L દબાવો'
      }
    }
  },

  // 9. Spanish
  'es': {
    title: 'Navegación por Teclado y Atajos',
    headerBtnLabel: 'Atajos',
    badge: 'Accesibilidad Total',
    subtitle: 'Guía de atajos de teclado • Completamente operativo sin ratón ni pantalla táctil',
    noticeTitle: 'Acceso completo manos libres y por teclado:',
    noticeBody: 'Usa Tab para navegar entre controles, Barra espaciadora o Alt+V para entrada de voz, y los números 1 al 7 para cambiar de herramienta.',
    popularBadge: 'Más popular',
    footerEsc: 'Presiona Esc en cualquier momento para cerrar este diálogo',
    gotItBtn: 'Entendido (Got It)',
    categories: {
      voiceTitle: 'Controles de Voz y Audio',
      toolsTitle: 'Cambio Directo de Herramienta (Números)',
      navTitle: 'Navegación y Controles de Enfoque',
      accessTitle: 'Accesibilidad y Pantalla',
      inToolTitle: 'Atajos dentro de las Herramientas'
    },
    shortcuts: {
      voiceToggle: {
        title: 'Alternar entrada de voz (Micrófono On/Off)',
        desc: 'Activa o desactiva el micrófono cuando no estés escribiendo'
      },
      voiceForce: {
        title: 'Iniciar/detener micrófono forzosamente',
        desc: 'Activa el reconocimiento de voz desde cualquier lugar'
      },
      speechStop: {
        title: 'Detener reproducción de voz de inmediato',
        desc: 'Silencia la explicación hablada activa de la IA'
      },
      speechReplay: {
        title: 'Reproducir última explicación de voz',
        desc: 'Escucha de nuevo la respuesta anterior de la IA'
      },
      esc: {
        title: 'Detener voz, cancelar audio o cerrar diálogos',
        desc: 'Cierra menús emergentes y cancela el habla'
      },
      tool1: {
        title: 'Tutor de Voz con IA y Solucionador de Dudas',
        desc: 'Resuelve tus dudas académicas hablando con la IA'
      },
      tool2: {
        title: 'Simulador de Entrevistas de Trabajo',
        desc: 'Práctica de entrevistas en tiempo real con cámara y micrófono'
      },
      tool3: {
        title: 'Estudio de Mapas Conceptuales D3',
        desc: 'Visualización jerárquica de conceptos clave'
      },
      tool4: {
        title: 'Generador de Cuestionarios y Práctica',
        desc: 'Evaluaciones dinámicas basadas en documentos'
      },
      tool5: {
        title: 'Tarjetas Didácticas 3D (Flashcards)',
        desc: 'Tarjetas giratorias para memorización y repaso'
      },
      tool6: {
        title: 'Explicador Visual de Diagramas con IA',
        desc: 'Análisis detallado de imágenes y esquemas'
      },
      tool7: {
        title: 'Historial de Estudio y Registros',
        desc: 'Consulta tus dudas, exámenes y resúmenes anteriores'
      },
      tab: {
        title: 'Avanzar al siguiente elemento interactivo',
        desc: 'Enfoca botones, campos de texto y enlaces en orden'
      },
      shiftTab: {
        title: 'Retroceder al elemento interactivo anterior',
        desc: 'Enfoca controles en orden inverso'
      },
      enter: {
        title: 'Activar botón enfocado o enviar formulario',
        desc: 'Ejecuta la acción seleccionada o confirma'
      },
      slash: {
        title: 'Enfocar caja de texto de dudas al instante',
        desc: 'Empieza a escribir tu pregunta académica de inmediato'
      },
      question: {
        title: 'Abrir o cerrar esta guía de atajos',
        desc: 'Muestra u oculta esta ventana de ayuda'
      },
      theme: {
        title: 'Alternar tema Oscuro / Claro',
        desc: 'Cambia el modo visual de alto contraste'
      },
      lang: {
        title: 'Abrir selector de idioma y dialecto regional',
        desc: 'Elige entre 10 idiomas regionales y globales'
      },
      access: {
        title: 'Abrir menú de accesibilidad neurodivergente',
        desc: 'Lectura biónica, tipografía para dislexia y tamaño'
      },
      fullscreen: {
        title: 'Activar o desactivar pantalla completa',
        desc: 'Maximiza el espacio para estudiar sin distracciones'
      },
      quizKeys: {
        title: 'Seleccionar opción en cuestionario (A, B, C, D)',
        desc: 'Presiona 1-4 o A-D para responder, y Enter para continuar'
      },
      flashcardFlip: {
        title: 'Girar tarjeta didáctica (Flip Card)',
        desc: 'Presiona Espacio o Enter para ver pregunta/respuesta'
      },
      flashcardNav: {
        title: 'Navegar entre tarjetas',
        desc: 'Presiona → para la siguiente tarjeta y ← para la anterior'
      },
      audioListen: {
        title: 'Escuchar el audio de la tarjeta o pregunta',
        desc: 'Presiona L para escuchar la explicación en voz alta'
      }
    }
  },

  // 10. English (Global)
  'en': {
    title: 'Keyboard Navigation & Shortcuts',
    headerBtnLabel: 'Shortcuts',
    badge: 'Full Accessibility',
    subtitle: 'Keyboard shortcuts guide • Fully operational without mouse or touch screen',
    noticeTitle: 'Complete Hands-Free & Keyboard Access:',
    noticeBody: 'Use Tab to sequentially explore every control, Space or Alt+V to activate voice input, and number keys 1 through 7 to instantly jump between learning tools.',
    popularBadge: 'Most Popular',
    footerEsc: 'Press Esc anytime to close this dialog',
    gotItBtn: 'Got It',
    categories: {
      voiceTitle: 'Voice & Audio Controls',
      toolsTitle: 'Direct Tool Switching (Numbers)',
      navTitle: 'Navigation & Focus Controls',
      accessTitle: 'Accessibility & Display',
      inToolTitle: 'In-Tool Interactive Shortcuts'
    },
    shortcuts: {
      voiceToggle: {
        title: 'Toggle Voice Input (Microphone on/off)',
        desc: 'Turn microphone on or off (when not typing)'
      },
      voiceForce: {
        title: 'Force start/stop microphone voice input',
        desc: 'Activate voice input instantly from anywhere'
      },
      speechStop: {
        title: 'Stop audio speech synthesis immediately',
        desc: 'Mute active speech playback immediately'
      },
      speechReplay: {
        title: 'Replay last AI Tutor voice explanation',
        desc: 'Listen to the previous answer audio again'
      },
      esc: {
        title: 'Stop voice, cancel audio, or close popups',
        desc: 'Dismiss active overlays, menus, or stop speaking'
      },
      tool1: {
        title: 'Voice AI Tutor & Problem Solver',
        desc: 'Socratic conversational voice doubt solver'
      },
      tool2: {
        title: 'WebRTC Mock Interviewer Stage',
        desc: 'Real-time interview simulation with camera & mic'
      },
      tool3: {
        title: 'Interactive D3 Mind Map Studio',
        desc: 'Visual hierarchical concept maps'
      },
      tool4: {
        title: 'Adaptive Quiz Generator & Practice',
        desc: 'PDF-based dynamic assessments'
      },
      tool5: {
        title: 'Interactive 3D Concept Flashcards',
        desc: 'Flip cards for revision and memory retention'
      },
      tool6: {
        title: 'Diagram Vision AI Explainer',
        desc: 'Visual diagram upload & step-by-step breakdown'
      },
      tool7: {
        title: 'Study Activity & Database History',
        desc: 'View all past doubts, quizzes, and notes'
      },
      tab: {
        title: 'Move forward to next interactive element',
        desc: 'Sequentially focus buttons, inputs, links'
      },
      shiftTab: {
        title: 'Move backward to previous interactive element',
        desc: 'Sequentially focus backward'
      },
      enter: {
        title: 'Activate focused button or submit form',
        desc: 'Trigger selected action or confirm input'
      },
      slash: {
        title: 'Focus doubt text input box immediately',
        desc: 'Start typing your academic query instantly'
      },
      question: {
        title: 'Toggle this Keyboard Shortcuts cheat-sheet',
        desc: 'Open or close this accessibility guide'
      },
      theme: {
        title: 'Toggle Dark Mode / Light Mode theme',
        desc: 'Switch high-contrast visual display mode'
      },
      lang: {
        title: 'Open Regional Language & Dialect Selector',
        desc: 'Choose from 10 Indian and global languages'
      },
      access: {
        title: 'Open Neurodivergent Accessibility Menu',
        desc: 'Bionic Reading, OpenDyslexic & font settings'
      },
      fullscreen: {
        title: 'Toggle Full Screen Mode on or off',
        desc: 'Maximize workspace for distraction-free focus'
      },
      quizKeys: {
        title: 'Select Quiz Option (A, B, C, D or 1-4)',
        desc: 'Press 1-4 or A-D to select option, Enter for next'
      },
      flashcardFlip: {
        title: 'Flip Concept Flashcard (Space / Enter)',
        desc: 'Press Space or Enter to reveal answer'
      },
      flashcardNav: {
        title: 'Card Navigation (Next / Prev)',
        desc: 'Press → for Next card and ← for Previous'
      },
      audioListen: {
        title: 'Listen to Question or Card Audio',
        desc: 'Press L to hear native dialect pronunciation'
      }
    }
  }
};

/**
 * Returns localized shortcut translations for the given language id.
 * Handles dialect fallback gracefully.
 */
export function getShortcutsTranslation(languageId?: string): ShortcutTranslationData {
  if (!languageId) return SHORTCUTS_TRANSLATIONS['en'];
  
  if (SHORTCUTS_TRANSLATIONS[languageId]) {
    return SHORTCUTS_TRANSLATIONS[languageId];
  }

  // Fallback by prefix (e.g. 'hi' -> 'hi-standard', 'mr' -> 'mr-varhadi', 'es' -> 'es')
  const base = languageId.split('-')[0];
  const matchedKey = Object.keys(SHORTCUTS_TRANSLATIONS).find(k => k.startsWith(base));
  if (matchedKey && SHORTCUTS_TRANSLATIONS[matchedKey]) {
    return SHORTCUTS_TRANSLATIONS[matchedKey];
  }

  return SHORTCUTS_TRANSLATIONS['en'];
}
