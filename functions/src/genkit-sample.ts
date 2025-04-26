// Import the Genkit core libraries and plugins.
import {genkit, z} from "genkit";
import {vertexAI, gemini15Flash} from "@genkit-ai/vertexai";

// Cloud Functions for Firebase supports Genkit natively.
// The onCallGenkit function creates a callable function from a Genkit action.
// It automatically implements streaming if your flow does.
import {onCallGenkit} from "firebase-functions/https";

// Genkit models generally depend on an API key.
// APIs should be stored in Cloud Secret Manager.
// If you are using Google generative AI you can get an API key at:
// https://aistudio.google.com/app/apikey
import {defineSecret} from "firebase-functions/params";
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [
    // Load the Vertex AI plugin with location config
    vertexAI({location: "us-central1"}),
  ],
});

interface SendChunk {
  (chunk: string): void;
}

// Define a simple flow that prompts an LLM to generate menu suggestions.
const menuSuggestionFlow = ai.defineFlow({
  name: "menuSuggestionFlow",
  inputSchema: z.string().describe("A restaurant theme").default("seafood"),
  outputSchema: z.string(),
  streamSchema: z.string(),
}, async (subject: string, {sendChunk}: {sendChunk: SendChunk}) => {
  // Construct a request and send it to the model API.
  const prompt =
    `Suggest an item for the menu of a ${subject} themed restaurant`;
  const {response, stream} = ai.generateStream({
    model: gemini15Flash,
    prompt: prompt,
    config: {
      temperature: 1,
    },
  });

  for await (const chunk of stream) {
    sendChunk(chunk.text);
  }

  // Handle the response from the model API.
  return (await response).text;
});

export const menuSuggestion = onCallGenkit({
  // Uncomment to enable AppCheck to reduce costs
  // enforceAppCheck: true,

  // Grant access to the API key to this function:
  secrets: [apiKey],
}, menuSuggestionFlow);
