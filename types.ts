
export enum InterviewType {
  SCREENING = 'screening',
  PANEL_BEHAVIORAL = 'panel/behavioral',
  TECHNICAL = 'technical',
  MIXED = 'mixed',
}

export enum AnswerMode {
  TYPED = 'typed',
  VOICE = 'voice',
}

export enum AppState {
  WELCOME = 'WELCOME',
  INPUT = 'INPUT',
  PREP = 'PREP',
  PRACTICE = 'PRACTICE',
}

export interface PrepData {
  topTips: string[];
  competencies: string[];
  storiesToPrepare: string[];
}

export interface Scorecard {
  relevance: number;
  clarity: number;
  evidence: number;
  structure: number;
  confidence: number;
}

export interface Feedback {
  whatWorked: string[];
  whatToImprove: string[];
  strongerRewrite: string;
  followUpQuestion: string;
  scorecard: Scorecard;
}

export interface CoachingNotes {
  strengths: string[];
  improvements: string[];
  nextFocus: string;
}

export interface PracticePlan {
    drills: string[];
    suggestedQuestions: string[];
}
