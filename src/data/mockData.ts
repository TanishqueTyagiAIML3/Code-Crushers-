import { QuizQuestion, Flashcard } from '../types';

export const SAMPLE_CHAT_MESSAGES = [
  {
    sender: 'user',
    text: 'Quantum mechanics kya hai, saral bhasha mein batao? (क्वांटम मैकेनिक्स का होत है?)',
    dialect: 'Bhojpuri / Hindustani Colloquial',
    audioDuration: '0:04'
  },
  {
    sender: 'ai',
    text: 'अरे भैया, सुनौ! आम ज़िंदगी में जइसे हम क्रिकेट गेंद फेंकते हैं त साफ-साफ दिखत बा कि गेंद कहाँ बा और कतना तेज जा रहल बा।\n\nलेकिन जब हम परमाणु (Atom) के एकदम नन्हे कण (इलेक्ट्रॉन) के दुनिया में जात हैं, त उहाँ नियम बदल जाला! उ कण एक समय पर गेंद भी बन सकत बा और तरंग (Wave) भी! ई नन्हीं दुनिया के जादुई नियमों के ही "क्वांटम मैकेनिक्स" कहल जाला।',
    audioDuration: '0:18',
    translationEn: 'Think of a cricket ball where you clearly see its position and speed. But inside an atom, an electron can act as both a particle and a wave simultaneously! Quantum mechanics is the rulebook of this ultra-tiny reality.'
  }
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    difficulty: 'Easy',
    question: 'Which gas is released by green plants during Photosynthesis (प्रकाश संश्लेषण)?',
    questionDialect: 'पौधा दिन में भोजन बनाते वक्त कौन गैस हवा में छोड़त हैं?',
    options: ['Oxygen (ऑक्सीजन)', 'Carbon Dioxide (कार्बन डाइऑक्साइड)', 'Nitrogen (नाइट्रोजन)', 'Methane (मीथेन)'],
    correctAnswer: 0,
    explanation: 'Plants absorb carbon dioxide and water in the presence of sunlight to produce glucose and release pure Oxygen.',
    explanationDialect: 'एकदम सही! पौधा धूप और कार्बन डाईऑक्साइड से भोजन बनाके हमनी के साँस लेवे खातिर ताज़ा ऑक्सीजन छोड़त हैं।'
  },
  {
    id: 2,
    difficulty: 'Intermediate',
    question: 'Why does a needle sink in water while a massive steel ship floats?',
    questionDialect: 'लोहा की छोटी सुई पानी में डूब जात है, पर विशाल जहाज काहे तैरत रहत है?',
    options: ['Surface Tension (सतही तनाव)', 'Archimedes Principle & Buoyant Force (उत्प्लावन बल)', 'Viscosity of Water (श्यानता)', 'Atmospheric Pressure (वायुमंडलीय दबाव)'],
    correctAnswer: 1,
    explanation: 'Archimedes principle states that the buoyant force on an object equals the weight of fluid displaced. The hollow shape of the ship displaces water heavier than its own total weight.',
    explanationDialect: 'शाबाश! जहाज का आकार ऐसा बनावल जाला कि उ अपने वजन से ज़्यादा पानी हटा देला, जवना से पानी के उत्प्लावन (Buoyant force) ओकरा के तैरले राखत बा।'
  },
  {
    id: 3,
    difficulty: 'Advanced',
    question: 'In Ohms law (V = I * R), what happens to current if resistance is doubled while voltage remains constant?',
    questionDialect: 'अगर वोल्टेज वही रहे और प्रतिरोध (Resistance) दोगुना कर दिया जाए, तो विद्युत धारा (Current) पर क्या असर पड़ेगा?',
    options: ['Current doubles (दोगुनी हो जाएगी)', 'Current is halved (आधी हो जाएगी)', 'Current remains unchanged (समान रहेगी)', 'Current becomes zero (शून्य हो जाएगी)'],
    correctAnswer: 1,
    explanation: 'Since Current (I) = Voltage (V) / Resistance (R), doubling resistance cuts the electric current in half.',
    explanationDialect: 'बिलकुल सही! जब रुकावट (Resistance) दोगुनी होइ, त बिजली के धारा आधी रह जाई।'
  }
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    topic: 'Biology - Photosynthesis',
    frontQuestion: 'Chlorophyll (क्लोरोफिल) का मुख्य काम क्या है?',
    backAnswer: 'Chlorophyll absorbs sunlight energy to convert CO2 and water into glucose.',
    dialectTranslation: 'क्लोरोफिल पत्ती में मौजूद उ हरा रंग के तत्व बा जे सूरज के किरण के पकड़ के भोजन बनावे में मदद करेला।'
  },
  {
    id: 2,
    topic: 'Physics - Newton’s 1st Law',
    frontQuestion: 'Inertia (जड़त्व) का क्या नियम है?',
    backAnswer: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.',
    dialectTranslation: 'जौन वस्तु रुकल बा उ रुकले रही, और जौन चल रहल बा उ चलिते रही, जब तक ओकरा पर कौनों बाहरी बल ना लगावल जाय।'
  },
  {
    id: 3,
    topic: 'Chemistry - Acids & Bases',
    frontQuestion: 'What does litmus paper do when dipped in Lemon Juice (Citric Acid)?',
    backAnswer: 'Blue litmus paper turns red in acidic solutions.',
    dialectTranslation: 'नींबू के रस में एसिड होल, एहसे नीला लिटमस पेपर लाल रंग में बदल जाला।'
  }
];

export const DIAGRAM_STEPS = [
  {
    step: 1,
    title: 'Light Absorption (धूप का अवशोषण)',
    description: 'Chlorophyll pigments inside plant leaf cells capture photons from sunlight.',
    dialectAudio: 'पत्ती के क्लोरोफिल सूरज के किरणों के अवशोषित करत बा।',
    nodeColor: '#f59e0b'
  },
  {
    step: 2,
    title: 'Water Splitting (जल का अपघटन)',
    description: 'Roots absorb groundwater, transporting H2O through xylem to leaves where it splits into hydrogen and oxygen.',
    dialectAudio: 'जड़ से सोखल पानी पत्ती तक पहुँचल, अउर ऑक्सीजन हवा में आज़ाद भयल।',
    nodeColor: '#38bdf8'
  },
  {
    step: 3,
    title: 'Carbon Fixation (ग्लूकोज निर्माण)',
    description: 'Stomata take in atmospheric CO2, combining it with hydrogen to synthesize energy-rich Glucose (C6H12O6).',
    dialectAudio: 'हवा से CO2 लेके पौधा मीठा ग्लूकोज बनावत है, जेसे पूरे पौधे के पोषण मिलत है।',
    nodeColor: '#10b981'
  }
];
