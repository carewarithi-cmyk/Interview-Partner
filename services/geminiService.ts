
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { InterviewType, PrepData, Feedback, CoachingNotes, PracticePlan } from '../types';

let ai: GoogleGenAI;

// Function to safely initialize the AI client
const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};


const parseJsonResponse = <T,>(text: string | undefined): T => {
    if (!text) {
        throw new Error("API returned an empty response.");
    }
    try {
        // Clean the response from potential markdown backticks
        const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return JSON.parse(cleanedText) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", text);
        throw new Error("The response from the AI was not valid JSON.");
    }
};

const chat = async (history: any[], newMessage: string) => {
    const genAI = getAI();
    const chatSession = genAI.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: SYSTEM_PROMPT },
        history,
    });
    const result = await chatSession.sendMessage({ message: newMessage });
    return { response: result, updatedHistory: await chatSession.getHistory() };
};


export const generatePrep = async (resume: string, jobPosting: string, interviewType: InterviewType) => {
    const prompt = `
        Here is the user's resume:
        ---
        ${resume}
        ---
        Here is the job posting:
        ---
        ${jobPosting}
        ---
        The interview type is: ${interviewType}.

        Generate the initial preparation materials. The JSON object should have two keys: "prep" and "notes".
        "prep" should contain:
        - topTips: An array of 5-8 strings.
        - competencies: An array of 5-8 strings based on the job posting.
        - storiesToPrepare: An array of 3-6 strings.
        "notes" should contain initial coaching notes with:
        - strengths: An array of strings identifying initial strengths from the resume.
        - improvements: An empty array.
        - nextFocus: A string suggesting an initial focus area.
    `;
    const { response, updatedHistory } = await chat([], prompt);
    const data = parseJsonResponse<{ prep: PrepData, notes: CoachingNotes }>(response.text);
    return { ...data, history: updatedHistory };
};

export const getQuestion = async (history: any[], redo: boolean, competencies: string[]) => {
    const competencyInstruction = competencies.length > 0 
        ? `The user wants to focus on these competencies: ${competencies.join(', ')}. Please tailor the question to one of these.`
        : '';
    
    let prompt = redo 
        ? "The user wants to redo the last question. Please ask it again, perhaps phrased slightly differently."
        : `Now, ask me the first tailored interview question based on our prep. ${competencyInstruction} Just the question, no preamble.`;
    
    if (!redo && history.length > 2) {
         prompt = `Great, now ask me another tailored question. ${competencyInstruction} Just the question itself.`
    }

    const { response, updatedHistory } = await chat(history, prompt);
    return { question: response.text ?? "Sorry, I couldn't think of a question. Try again?", history: updatedHistory };
};

export const getFeedback = async (history: any[], answer: string, currentNotes: CoachingNotes | null) => {
    const prompt = `
        My answer is: "${answer}".
        
        Based on my answer, provide feedback and update the coaching notes. Adhere strictly to the feedback rules in the system prompt, especially regarding vague answers, missing results, unclear personal contributions, and overly long responses.
        The response should be a JSON object with two keys: "feedbackData" and "notes".
        
        "feedbackData" must contain:
        - whatWorked: An array of 2-4 strings.
        - whatToImprove: An array of 2-4 strings, explicitly flagging any detected issues (vagueness, length, missing impact, etc.).
        - strongerRewrite: A string with a model answer that addresses the improvement points.
        - followUpQuestion: A single string for a potential follow-up.
        - scorecard: An object with ratings from 1-5 for relevance, clarity, evidence, structure, and confidence.

        "notes" must contain updated coaching notes based on this answer and the previous notes:
        - strengths: An updated array of strings.
        - improvements: An updated array of strings, identifying recurring themes.
        - nextFocus: An updated string for the next practice focus.

        Here are the current coaching notes for context:
        ${JSON.stringify(currentNotes)}
    `;

    const { response, updatedHistory } = await chat(history, prompt);
    const data = parseJsonResponse<{ feedbackData: Feedback, notes: CoachingNotes }>(response.text);
    return { ...data, history: updatedHistory };
};


export const getPracticePlan = async (history: any[]) => {
    const prompt = `
      Based on our entire session and the final coaching notes, generate a final "Next Practice Plan".
      The response must be a JSON object with one key: "plan".

      "plan" must contain:
      - drills: An array of 3-5 concrete drill strings.
      - suggestedQuestions: An array of 3-5 question strings to practice next.
    `;
    const { response, updatedHistory } = await chat(history, prompt);
    const data = parseJsonResponse<{ plan: PracticePlan }>(response.text);
    return { ...data, history: updatedHistory };
};
