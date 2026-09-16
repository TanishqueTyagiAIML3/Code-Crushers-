export type LearningToolId = 
  | 'ai-chat' 
  | 'mock-interview'
  | 'mind-maps'
  | 'flashcards'
  | 'adaptive-quiz' 
  | 'diagram-explainer' 
  | 'pdf-summarizer' 
  | 'history';

export interface DialectOption {
  id: string;
  name: string;
  nativeName: string;
  language: string;
  region: string;
  code?: string;
  sampleQuery: string;
  sampleResponse: string;
  audioSampleDescription: string;
  accentNote: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionDialect?: string;
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced' | string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  explanationDialect?: string;
}

export interface Flashcard {
  id: number;
  topic: string;
  frontQuestion: string;
  backAnswer: string;
  dialectTranslation?: string;
  keyTakeaway?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  category?: string;
  children?: MindMapNode[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface DiagramAnalysis {
  diagramTitle: string;
  subject: string;
  summary: string;
  components: {
    name: string;
    functionDescription: string;
    visualLocation?: string;
  }[];
  stepByStepProcess: string[];
  explanationInLanguage: string;
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
}

export interface HistoryItem {
  id: string;
  userId: string;
  category: 'interview' | 'quiz' | 'mindmap' | 'flashcards' | 'diagram' | 'chat';
  title: string;
  summary: string;
  createdAt: string;
  data: any;
}

export interface AccessibilitySettings {
  openDyslexic: boolean;
  bionicReading: boolean;
  highContrast: boolean;
  customCursor?: boolean; // Unique fluid AI learner reticle & interactive cursor
  speechSpeed: number; // 0.75 to 1.5
  fontSize: 'normal' | 'large' | 'extra-large';
}
