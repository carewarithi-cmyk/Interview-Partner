
import React, { useState, useCallback, useRef } from 'react';
import { AppState, InterviewType, AnswerMode, PrepData, Feedback, CoachingNotes, PracticePlan } from './types';
import { generatePrep, getQuestion, getFeedback, getPracticePlan } from './services/geminiService';
import { InputPanel } from './components/InputPanel';
import { PrepPanel } from './components/PrepPanel';
import { PracticePanel } from './components/PracticePanel';
import { CoachingNotesPanel } from './components/CoachingNotesPanel';
import { LogoIcon } from './components/icons';
import { WelcomePage } from './components/WelcomePage';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User Inputs
  const [resume, setResume] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<string>('');
  const [interviewType, setInterviewType] = useState<InterviewType>(InterviewType.PANEL_BEHAVIORAL);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.TYPED);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  
  // AI Generated Content
  const [prepData, setPrepData] = useState<PrepData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [coachingNotes, setCoachingNotes] = useState<CoachingNotes | null>(null);
  const [practicePlan, setPracticePlan] = useState<PracticePlan | null>(null);

  // Using useRef for chat history to avoid re-renders on every update
  const chatHistoryRef = useRef<any[]>([]);

  const handleStartApp = () => {
    setAppState(AppState.INPUT);
  };

  const handleClear = () => {
    setAppState(AppState.INPUT);
    setResume('');
    setJobPosting('');
    setInterviewType(InterviewType.PANEL_BEHAVIORAL);
    setAnswerMode(AnswerMode.TYPED);
    setSelectedCompetencies([]);
    setPrepData(null);
    setCurrentQuestion(null);
    setFeedback(null);
    setCoachingNotes(null);
    setPracticePlan(null);
    setError(null);
    chatHistoryRef.current = [];
  };

  const handleGeneratePrep = useCallback(async () => {
    if (!resume || !jobPosting) {
      setError("Please provide both your resume and the job posting.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { prep, notes, history } = await generatePrep(resume, jobPosting, interviewType);
      setPrepData(prep);
      setCoachingNotes(notes);
      chatHistoryRef.current = history;
      setAppState(AppState.PREP);
    } catch (e) {
      console.error(e);
      setError("Failed to generate prep. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [resume, jobPosting, interviewType]);

  const handleGetQuestion = useCallback(async (redo = false) => {
    setIsLoading(true);
    setError(null);
    setFeedback(null); 
    try {
      const { question, history } = await getQuestion(chatHistoryRef.current, redo, selectedCompetencies);
      setCurrentQuestion(question);
      chatHistoryRef.current = history;
      setAppState(AppState.PRACTICE);
    } catch (e) {
      console.error(e);
      setError("Failed to get a question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompetencies]);
  
  const handleGetFeedback = useCallback(async (answer: string) => {
    if (!answer) {
      setError("Please provide an answer.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { feedbackData, notes, history } = await getFeedback(chatHistoryRef.current, answer, coachingNotes);
      setFeedback(feedbackData);
      setCoachingNotes(notes);
      chatHistoryRef.current = history;
    } catch (e) {
      console.error(e);
      setError("Failed to get feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [coachingNotes]);

  const handleGetPracticePlan = useCallback(async () => {
    if (!coachingNotes) return;
    setIsLoading(true);
    setError(null);
    try {
      const { plan, history } = await getPracticePlan(chatHistoryRef.current);
      setPracticePlan(plan);
       chatHistoryRef.current = history;
    } catch (e) {
      console.error(e);
      setError("Failed to generate a practice plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [coachingNotes]);

  if (appState === AppState.WELCOME) {
    return <WelcomePage onStart={handleStartApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <LogoIcon className="h-10 w-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900">Interview Partner</h1>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <InputPanel
              resume={resume}
              setResume={setResume}
              jobPosting={jobPosting}
              setJobPosting={setJobPosting}
              interviewType={interviewType}
              setInterviewType={setInterviewType}
              answerMode={answerMode}
              setAnswerMode={setAnswerMode}
              selectedCompetencies={selectedCompetencies}
              setSelectedCompetencies={setSelectedCompetencies}
              onGeneratePrep={handleGeneratePrep}
              onClear={handleClear}
              isLoading={isLoading}
              isPrepGenerated={appState !== AppState.INPUT}
            />
            {appState !== AppState.INPUT && prepData && (
              <PrepPanel prepData={prepData} />
            )}
          </div>
          <div className="flex flex-col gap-8">
            {appState !== AppState.INPUT && (
              <PracticePanel
                appState={appState}
                isLoading={isLoading}
                answerMode={answerMode}
                currentQuestion={currentQuestion}
                feedback={feedback}
                onGetQuestion={handleGetQuestion}
                onGetFeedback={handleGetFeedback}
              />
            )}
            {appState !== AppState.INPUT && coachingNotes && (
               <CoachingNotesPanel
                 notes={coachingNotes}
                 plan={practicePlan}
                 onGetPlan={handleGetPracticePlan}
                 isLoading={isLoading}
               />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
