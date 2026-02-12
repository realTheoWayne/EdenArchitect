import { GoogleGenAI, Type } from '@google/genai';
import { GardenElement } from '../types';

// Extracted from "Practical Botany for Gardeners" PDF
const BOTANY_KNOWLEDGE = `
KEY BOTANY PRINCIPLES FOR THE AI:
1. Roots: Taproots (dandelion) vs Fibrous (rhododendron). Bulbs (scales) vs Tubers (swollen stems).
2. Soil: Loam is ideal. Clay holds water but logs easily. Sandy drains fast but loses nutrients. pH affects nutrient availability (acidic < 7 < alkaline).
3. Photosynthesis: Needs Light + CO2 + Water. Chloroplasts drive this.
4. Reproduction: Sexual (seeds, genetic variation) vs Vegetative (clones, cuttings, runners).
5. Seeds: Dormancy triggers (cold, fire, water). Epigeal (cotyledons above ground) vs Hypogeal (below).
6. Pruning: Removes apical dominance (terminal bud) to encourage bushier lateral growth. Prune dead/diseased first.
7. Senses: Plants sense light (phototropism), gravity (gravitropism), touch (thigmotropism).
8. Pests: Chewing insects vs Sap suckers.
`;

interface GardenContext {
  zone?: string;
  soilType?: string;
  gardenElements?: GardenElement[];
  currentDate?: string;
  averageHumidity?: number;
  soilPh?: number;
}

const GEMINI_MODEL = 'gemini-2.5-flash';

const getApiKey = () => {
  // Vite/browser-first configuration
  const viteKey = (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_GEMINI_API_KEY
    : '';

  // Backward-compatible fallback for non-Vite runtimes
  const processKey = (typeof process !== 'undefined' && process.env)
    ? process.env.API_KEY || process.env.GEMINI_API_KEY
    : '';

  return viteKey || processKey || '';
};

// Lazy initialization to prevent crash on module load if env vars aren't ready
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (aiInstance) return aiInstance;

  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

export const askGardenAssistant = async (question: string, context?: GardenContext): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) {
      return 'AI assistant is not configured yet. Add VITE_GEMINI_API_KEY to your environment to enable live gardening advice.';
    }

    // Process garden elements into a readable summary
    let gardenSummary = 'The user has not added any items to their garden plan yet.';
    if (context?.gardenElements && context.gardenElements.length > 0) {
      const plants = context.gardenElements
        .filter(e => e.type === 'plant')
        .map(e => `- ${e.name} (Planted: ${e.plantingDate || 'Unknown Date'})`);

      const structures = context.gardenElements
        .filter(e => e.type !== 'plant' && e.type !== 'zone')
        .map(e => e.name);

      const zones = context.gardenElements
        .filter(e => e.type === 'zone')
        .map(e => e.sunlight);

      gardenSummary = `
        CURRENT GARDEN PLAN:
        Plants:
        ${plants.length > 0 ? plants.join('\n') : 'None'}

        Structures & Beds:
        ${structures.length > 0 ? Array.from(new Set(structures)).join(', ') : 'None'}

        Sunlight Zones defined: ${zones.length > 0 ? Array.from(new Set(zones)).join(', ') : 'None'}
      `;
    }

    const contextString = context
      ? `
      Garden Profile:
      - Zone: ${context.zone || 'Unknown'}
      - Soil: ${context.soilType || 'Unknown'} (pH: ${context.soilPh || 'Unknown'})
      - Avg. Humidity: ${context.averageHumidity ? context.averageHumidity + '%' : 'Unknown'}
      - Current Simulation Date: ${context.currentDate || 'Today'}

      ${gardenSummary}
      `
      : 'No specific context provided';

    const systemPrompt = `You are a master gardener and botany expert, heavily inspired by the book "Practical Botany for Gardeners".
    Use the following botanical principles from the book: ${BOTANY_KNOWLEDGE}

    User Context: ${contextString}.

    You also have access to "Old Farmer's Almanac" style wisdom.
    When asked about weather or planting dates, simulate the Almanac's long-range forecasting style (e.g., "Expect a wet spring in this zone").

    Your goal is to provide specific advice based on the user's ACTUAL garden plan provided in the context.
    If they ask "how is my garden doing", look at the Current Simulation Date vs the Planting Dates of their crops to estimate growth stages.

    Keep answers practical, concise, warm, and "cottage-core" friendly. Focus on soil health, crop rotation, and efficient space usage tailored to their specific zone, soil type, pH and humidity.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "I couldn't generate a gardening tip right now.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'I\'m taking a short nap in the garden shed. Please try asking again in a moment!';
  }
};

// Simple memory cache to prevent rate limiting
const almanacCache: Record<string, any> = {};

export const getAlmanacPrediction = async (zone: string, date: string): Promise<any> => {
  const cacheKey = `${zone}-${date}`;
  if (almanacCache[cacheKey]) {
    return almanacCache[cacheKey];
  }

  const prompt = `Simulate the Old Farmer's Almanac for Zone ${zone} around the date ${date}.
    Return a JSON object with weatherForecast (string), moonPhase (string), and bestPlantingDays (array of strings).`;

  const almanacSchema = {
    type: Type.OBJECT,
    properties: {
      weatherForecast: {
        type: Type.STRING,
        description: 'A short, folklore-style weather prediction'
      },
      moonPhase: {
        type: Type.STRING,
        description: 'Current moon phase'
      },
      bestPlantingDays: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of 2-3 favorable crops to plant now based on moon phase'
      }
    },
    required: ['weatherForecast', 'moonPhase', 'bestPlantingDays']
  };

  try {
    const ai = getAI();
    if (!ai) {
      throw new Error('Gemini API key not configured');
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: almanacSchema
      }
    });
    const data = JSON.parse(response.text || '{}');
    almanacCache[cacheKey] = data; // Cache the result
    return data;
  } catch {
    // Return pleasant fallback data instead of failing
    return {
      weatherForecast: 'Fair skies with a gentle breeze, perfect for tending the soil.',
      moonPhase: 'Waxing Crescent',
      bestPlantingDays: ['Root vegetables', 'Hardy greens']
    };
  }
};
