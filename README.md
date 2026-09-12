# 🎓 ShikshaSathi AI

**India's Voice-Driven, Regionally-Aware Smart Learning Assistant**

ShikshaSathi AI is an advanced, AI-backed education ecosystem crafted to uplift students from rural backgrounds, as well as those who are neurodivergent or visually impaired. Created as a robust hackathon solution, the platform utilizes state-of-the-art multimodal AI capabilities to eliminate geographical, linguistic, and cognitive hurdles in modern learning.

## ✨ Core Highlights

*   **🧠 Comprehensive Accessibility Hub:** Features specialized reading tools like the OpenDyslexic typeface, Bionic Reading styles, WCAG AAA-compliant high-contrast modes, and fluid cursor settings for tailored usability.
*   **🗣️ Native Multilingual Voice Engine:** Delivers seamless ASR (speech recognition) and TTS (text-to-speech) capabilities across more than 14 Indian languages and localized dialects such as Tamil, Marathi, Bhojpuri, and Bengali.
*   **👁️ Smart Diagram Decoder:** Driven by Gemini's Multimodal AI, this feature dissects intricate flowcharts and scientific diagrams, offering sequential, audio-guided explanations to the user.
*   **📈 Dynamic Flashcards & Quizzes:** Automatically adjusts the complexity of assessments based on real-time user progress, accompanied by instant voice feedback in the student's native tongue.
*   **🎙️ Conversational Mock Interviews:** Simulates live interview environments using AI to ask contextual cross-questions, concluding with detailed, multi-language performance evaluations.
*   **🗺️ Document Compression & D3 Mind Mapping:** Converts heavy textbook chapters and PDFs into interactive hierarchical graphs and easy-to-consume audio summaries.

## 🛠️ Technology Stack

*   **Client-Side:** React 19, Vite, TypeScript, Tailwind CSS v4, and Framer Motion.
*   **Server & AI Integrations:** Node.js paired with Express.js, powered by the Google Gemini API (`@google/genai`).
*   **Data Parsing & Visuals:** D3.js for visual networks, alongside PDF-Parse, HTML2Canvas, and jsPDF.
*   **System Architecture:** Engineered as a Progressive Web App (PWA) focusing on offline resilience and ultra-low latency scenarios.

## 🚀 Quick Start Guide

### System Requirements
* Node.js (Version 18 or higher)
* A valid Google Gemini API Key

### Setup Instructions

1. **Get the Codebase:**
   \`\`\`bash
   git clone https://github.com/your-username/shikshasathi-ai.git
   cd shikshasathi-ai
   \`\`\`

2. **Install Required Packages:**
   \`\`\`bash
   npm install
   # alternatively, use bun
   bun install
   \`\`\`

3. **Configure Environment Secrets:**
   Create a new `.env` file at the root level of your project and insert your API credentials:
   \`\`\`env
   GEMINI_API_KEY="your_api_key_here"
   PORT=3000
   \`\`\`

4. **Launch the Application:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The application will boot up and be accessible at `http://localhost:3000`.

## 🤝 Hackathon Submission
*Insert your team name, selected hackathon track, and project submission links in this section.*
