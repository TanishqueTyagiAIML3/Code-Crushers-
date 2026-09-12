import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Re-export Type for structured schema definitions
export { Type };

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ [AI Config Warning]: GEMINI_API_KEY is not set in process.env. Ensure your .env file contains GEMINI_API_KEY."
  );
}

// 1. Initialize modern GoogleGenAI client with standard header
export const genAI = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Primary model with active quota and Google Search Grounding support
export const PRIMARY_MODEL = "gemini-2.5-flash";
export const FALLBACK_MODEL = "gemini-2.5-flash-lite";

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundedGenerationResult {
  text: string;
  response: {
    text: () => string;
    candidates?: any[];
    groundingMetadata?: any;
  };
  groundingSources: GroundingSource[];
  searchQueries: string[];
  isGrounded: boolean;
  modelUsed: string;
  candidates?: any[];
}

/**
 * Normalizes user prompts or multimodal part arrays into contents compatible with @google/genai
 */
export function normalizeContents(input: any): any {
  if (typeof input === "string") {
    return input;
  }
  if (Array.isArray(input)) {
    const parts = input.map((item) => {
      if (typeof item === "string") {
        return { text: item };
      }
      return item;
    });
    return { parts };
  }
  return input;
}

/**
 * Executes a Gemini model request with Google Search Grounding.
 * Uses gemini-2.5-flash as the primary grounded model, falling back seamlessly
 * to gemini-2.5-flash-lite or un-grounded generation if tool limits are reached.
 */
export interface GenerateWithSearchOptions {
  systemInstruction?: string;
  temperature?: number;
  topP?: number;
  enableSearch?: boolean;
  preferredModel?: string;
  responseMimeType?: string;
  responseSchema?: any;
}

export async function generateContentWithSearch(
  contentsOrPrompt: any,
  options: GenerateWithSearchOptions = {}
): Promise<GroundedGenerationResult> {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey.trim() === "" || currentKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "❌ Configuration Error: GEMINI_API_KEY is missing or invalid. Please add your Gemini API Key in your .env file."
    );
  }

  const client = new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const normalized = normalizeContents(contentsOrPrompt);

  // Structured Outputs cannot be combined with external tool use (e.g. googleSearch)
  const isStructuredOutput =
    options.responseMimeType === "application/json" || Boolean(options.responseSchema);
  const enableSearch = !isStructuredOutput && options.enableSearch !== false;
  const tools = enableSearch ? [{ googleSearch: {} }] : undefined;

  // Build generation config cleanly
  const baseConfig: any = {
    systemInstruction: options.systemInstruction,
    temperature: options.temperature ?? 0.35,
    topP: options.topP ?? 0.95,
  };

  if (options.responseMimeType) {
    baseConfig.responseMimeType = options.responseMimeType;
  }
  if (options.responseSchema) {
    baseConfig.responseSchema = options.responseSchema;
    baseConfig.responseMimeType = "application/json";
  }
  if (tools) {
    baseConfig.tools = tools;
  }

  // Resolve model preference, preventing deprecated or 429-prone experimental models
  let chosenModel = options.preferredModel || process.env.GEMINI_MODEL || PRIMARY_MODEL;
  if (chosenModel === "gemini-3.5-flash" || chosenModel.includes("preview-02-05")) {
    chosenModel = PRIMARY_MODEL;
  }

  const modelsToTry = [
    chosenModel,
    PRIMARY_MODEL,
    FALLBACK_MODEL,
  ];

  // Remove duplicates
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const modelName of uniqueModels) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: normalized,
        config: baseConfig,
      });

      const text = response.text || "";
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const chunks = groundingMetadata?.groundingChunks || [];
      const searchQueries = groundingMetadata?.webSearchQueries || [];

      const groundingSources: GroundingSource[] = [];
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            uri: chunk.web.uri,
          });
        }
      }

      return {
        text,
        response: {
          text: () => text,
          candidates: response.candidates,
          groundingMetadata,
        },
        groundingSources,
        searchQueries,
        isGrounded: groundingSources.length > 0 || searchQueries.length > 0,
        modelUsed: modelName,
        candidates: response.candidates,
      };
    } catch (err: any) {
      lastError = err;
      const isQuota = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota");
      if (isQuota) {
        console.warn(`[Search Grounding] Model '${modelName}' hit rate/quota limit, trying fallback...`);
      } else {
        console.warn(`[Search Grounding] Model '${modelName}' attempt failed, trying fallback:`, err?.message?.slice(0, 120));
      }
    }
  }

  // If search grounding was enabled and all models failed (e.g. search tool quota), try without tools
  if (enableSearch) {
    try {
      console.log(`[Search Grounding] Retrying on ${PRIMARY_MODEL} without search tool as resilient fallback...`);
      const fallbackResponse = await client.models.generateContent({
        model: PRIMARY_MODEL,
        contents: normalized,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.35,
          topP: options.topP ?? 0.95,
        },
      });
      const text = fallbackResponse.text || "";
      return {
        text,
        response: {
          text: () => text,
          candidates: fallbackResponse.candidates,
        },
        groundingSources: [],
        searchQueries: [],
        isGrounded: false,
        modelUsed: PRIMARY_MODEL,
        candidates: fallbackResponse.candidates,
      };
    } catch (directErr: any) {
      lastError = directErr;
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini Search Grounding.");
}

/**
 * Drop-in backward compatible wrapper for getProModel.
 * Seamlessly integrates Google Search Grounding and gemini-3.5-flash for all callers.
 */
export function getProModel(
  generationConfig: any = {},
  preferredModel: string = PRIMARY_MODEL
) {
  return {
    generateContent: async (promptOrParts: any): Promise<GroundedGenerationResult> => {
      return generateContentWithSearch(promptOrParts, {
        temperature: generationConfig.temperature,
        topP: generationConfig.topP,
        responseMimeType: generationConfig.responseMimeType,
        responseSchema: generationConfig.responseSchema,
        enableSearch:
          generationConfig.responseSchema || generationConfig.responseMimeType === "application/json"
            ? false
            : generationConfig.enableSearch !== false,
        preferredModel: preferredModel || PRIMARY_MODEL,
      });
    },
  };
}

export const proModel = getProModel();

export default {
  genAI,
  proModel,
  getProModel,
  generateContentWithSearch,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};
