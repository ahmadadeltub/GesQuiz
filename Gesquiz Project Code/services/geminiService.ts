import { GoogleGenAI, Type } from "@google/genai";
import { Gesture, NewQuestion, QuestionType } from "../types";

// Initialize the Google Gemini API client.
// The API key is sourced from the environment variable `process.env.API_KEY`.
// This setup assumes the environment is configured to provide this variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A helper function to parse potentially malformed JSON responses from the AI.
const parseJsonResponse = <T>(jsonString: string): T | null => {
    try {
        // The model might wrap the JSON in markdown backticks.
        const cleanedString = jsonString.replace(/^```json\n?/, '').replace(/```$/, '');
        return JSON.parse(cleanedString) as T;
    } catch (error) {
        console.error("Failed to parse JSON response from AI:", error);
        console.error("Original string:", jsonString);
        return null;
    }
};

// Helper to convert the array mapping from schema to the object mapping in the type
const convertMapping = (mappingArray: {itemIndex: number, targetIndex: number}[]) : { [key: number]: number } => {
    if (!mappingArray) return {};
    return mappingArray.reduce((acc, curr) => {
        acc[curr.itemIndex] = curr.targetIndex;
        return acc;
    }, {} as { [key: number]: number });
};

export const geminiService = {
  /**
   * Analyzes a single image frame to detect a specific hand gesture.
   * @param base64ImageData The base64-encoded image data string.
   * @returns A promise that resolves to a Gesture enum value.
   */
  analyzeGesture: async (base64ImageData: string): Promise<Gesture> => {
    try {
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64ImageData,
        },
      };

      const textPart = {
        text: 'Analyze the hand gesture in the image. Respond with only one of the following words: THUMBS_UP, OPEN_PALM, PEACE_SIGN, FIST, UNKNOWN.',
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        // Use thinkingBudget: 0 for low-latency responses needed for real-time gesture detection.
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });

      const gestureString = response.text.trim().toUpperCase();
      
      if (Object.values(Gesture).includes(gestureString as Gesture)) {
        return gestureString as Gesture;
      }
      
      console.warn(`Unknown gesture string received: "${gestureString}"`);
      return Gesture.UNKNOWN;

    } catch (error) {
      console.error('Error analyzing gesture:', error);
      // Fallback to UNKNOWN in case of an API error.
      return Gesture.UNKNOWN;
    }
  },
  
  /**
   * Analyzes multiple image frames to determine which labeled element is being pointed at.
   * @param base64ImageDatas An array of base64-encoded image data strings.
   * @param prompt The text prompt describing the task and labels.
   * @returns A promise that resolves to the string label of the pointed element, or "NONE".
   */
  analyzePointingGesture: async (base64ImageDatas: string[], prompt: string): Promise<string> => {
     try {
       const imageParts = base64ImageDatas.map(data => ({
         inlineData: {
           mimeType: 'image/jpeg',
           data,
         }
       }));

       const textPart = { text: prompt };

       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: { parts: [...imageParts, textPart] },
         config: { thinkingConfig: { thinkingBudget: 0 } } // Low-latency for real-time pointing
       });
       
       return response.text.trim();

     } catch (error) {
        console.error('Error analyzing pointing gesture:', error);
        return "NONE"; // Return a safe default on error
     }
  },

  /**
   * Generates a set of quiz questions on a given topic using AI.
   * @param topic The subject of the quiz.
   * @param numQuestions The number of questions to generate.
   * @param gradeLevel The target academic level for the questions.
   * @returns A promise that resolves to an array of NewQuestion objects.
   */
  generateQuizQuestions: async (topic: string, numQuestions: number, gradeLevel: string): Promise<NewQuestion[]> => {
    
    const prompt = `
      Create a quiz with exactly ${numQuestions} questions about "${topic}" suitable for a ${gradeLevel} level.
      
      Please provide a mix of question types: 'multiple_choice', 'true_false', and 'drag_and_drop'.
      
      For 'multiple_choice', provide 4 options.
      For 'true_false', provide 'True' and 'False' as options.
      For 'drag_and_drop', provide an equal number of 'items' and 'targets' (between 2 and 4). Ensure the mapping is correct.

      Strictly follow the JSON schema provided.
    `;

    const quizSchema = {
      type: Type.ARRAY,
      description: `A list of ${numQuestions} quiz questions.`,
      items: {
        type: Type.OBJECT,
        properties: {
            questionText: { type: Type.STRING, description: 'The text of the question.' },
            type: { type: Type.STRING, enum: [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.DRAG_AND_DROP] },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'For multiple_choice or true_false types.' },
            correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct answer in options. For multiple_choice/true_false.' },
            items: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Draggable items for drag_and_drop questions.' },
            targets: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Drop targets for drag_and_drop questions.' },
            correctMapping: {
                type: Type.ARRAY,
                description: 'Correct mapping for drag_and_drop. Array of {itemIndex, targetIndex} objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        itemIndex: { type: Type.INTEGER },
                        targetIndex: { type: Type.INTEGER }
                    },
                    required: ['itemIndex', 'targetIndex']
                }
            }
        },
        required: ['questionText', 'type']
      }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const rawQuestions = parseJsonResponse<any[]>(response.text);

        if (!rawQuestions) {
            throw new Error("AI returned a non-JSON or malformed response.");
        }
        
        // Sanitize and format the questions to match the NewQuestion type
        const generatedQuestions: NewQuestion[] = rawQuestions.map(q => {
            const question: NewQuestion = {
                questionText: q.questionText,
                type: q.type,
            };
            if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE) {
                question.options = q.options || [];
                question.correctAnswerIndex = q.correctAnswerIndex;
            } else if (q.type === QuestionType.DRAG_AND_DROP) {
                question.items = q.items || [];
                question.targets = q.targets || [];
                question.correctMapping = q.correctMapping ? convertMapping(q.correctMapping) : {};
            }
            return question;
        });
        
        return generatedQuestions;

    } catch (error) {
        console.error("Error generating quiz questions:", error);
        // Throw the error to be handled by the calling component (e.g., show a message to the user).
        throw new Error("Failed to generate quiz questions. The AI may be unavailable or the request could not be processed.");
    }
  },
};
