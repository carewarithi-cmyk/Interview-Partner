
import React, { useState, useEffect, useRef } from 'react';
import { AppState, AnswerMode, Feedback } from '../types';
import { LoaderIcon, MicIcon, SendIcon } from './icons';
import { AnswerBuilder } from './AnswerBuilder';

interface PracticePanelProps {
  appState: AppState;
  isLoading: boolean;
  answerMode: AnswerMode;
  currentQuestion: string | null;
  feedback: Feedback | null;
  onGetQuestion: (redo?: boolean) => void;
  onGetFeedback: (answer: string) => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const PracticePanel: React.FC<PracticePanelProps> = ({
  appState, isLoading, answerMode, currentQuestion, feedback, onGetQuestion, onGetFeedback
}) => {
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showAnswerBuilder, setShowAnswerBuilder] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setAnswer(prev => prev + finalTranscript);
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const handleToggleListening = () => {
    if (!isSpeechRecognitionSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setAnswer(''); 
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  const handleSubmit = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    onGetFeedback(answer);
    setShowAnswerBuilder(false);
  };
  
  const handleNewQuestion = () => {
      setAnswer('');
      setShowAnswerBuilder(false);
      onGetQuestion();
  }
  
  const handleRedoQuestion = () => {
      setAnswer('');
      setShowAnswerBuilder(false);
      onGetQuestion(true);
  }

  const handleBuildAnswer = (builtAnswer: string) => {
    setAnswer(builtAnswer);
    setShowAnswerBuilder(false);
  };

  const renderScorecard = (scorecard: Feedback['scorecard']) => (
    <div>
      <h4 className="font-semibold text-md text-slate-700 mb-2">E) Scorecard</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
        {Object.entries(scorecard).map(([key, value]) => (
          <div key={key} className="bg-slate-100 p-2 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{value}/5</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider capitalize">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">3. Practice Interview</h2>
      
      {!currentQuestion && appState === AppState.PREP && (
        <button
          onClick={() => onGetQuestion()}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 flex items-center justify-center"
        >
          {isLoading ? <LoaderIcon className="h-5 w-5" /> : "Ask Me a Question"}
        </button>
      )}

      {currentQuestion && (
        <div className="space-y-4">
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-500 font-medium text-sm mb-1">Interviewer:</p>
            <p className="text-slate-800 font-semibold">{currentQuestion}</p>
          </div>

          {!feedback && (
            <>
              <div className="relative">
                <textarea
                  rows={5}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                  placeholder={isListening ? "Listening..." : (answerMode === 'voice' ? 'Click the mic to start speaking or use the Answer Builder...' : 'Type your answer here or use the Answer Builder...')}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                    {answerMode === 'voice' && isSpeechRecognitionSupported && (
                        <button onClick={handleToggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 hover:bg-slate-300'}`} title="Record Answer">
                            <MicIcon className="h-5 w-5"/>
                        </button>
                    )}
                    <button onClick={handleSubmit} disabled={isLoading || !answer} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300" title="Get Feedback">
                        {isLoading ? <LoaderIcon className="h-5 w-5" /> : <SendIcon className="h-5 w-5"/>}
                    </button>
                </div>
              </div>

              <div>
                <button 
                  onClick={() => setShowAnswerBuilder(!showAnswerBuilder)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showAnswerBuilder ? 'Hide' : 'Show'} Answer Builder (STAR+L Method)
                </button>
              </div>

              {showAnswerBuilder && <AnswerBuilder onBuildAnswer={handleBuildAnswer} />}
            </>
          )}
          
          {feedback && (
             <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="font-medium text-sm text-slate-500 mb-1">Your Answer:</p>
                <p className="text-slate-700 italic">{answer}</p>
             </div>
          )}

          {isLoading && !feedback && (
            <div className="flex items-center justify-center gap-2 text-slate-500">
                <LoaderIcon className="h-5 w-5" />
                <span>Getting feedback...</span>
            </div>
          )}

          {feedback && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Your Feedback</h3>
              <div>
                <h4 className="font-semibold text-md text-slate-700 mb-2">A) What Worked</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {feedback.whatWorked.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <div>
                <h4 className="font-semibold text-md text-red-700 mb-2">B) What to Improve</h4>
                <ul className="list-disc list-inside space-y-1 text-red-600">
                    {feedback.whatToImprove.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <div>
                <h4 className="font-semibold text-md text-slate-700 mb-2">C) Stronger Rewrite</h4>
                <p className="text-slate-600 bg-slate-100 p-3 rounded-md italic">{feedback.strongerRewrite}</p>
              </div>
               <div>
                <h4 className="font-semibold text-md text-slate-700 mb-2">D) Follow-up Question</h4>
                <p className="text-slate-600">{feedback.followUpQuestion}</p>
              </div>
              {renderScorecard(feedback.scorecard)}
              <div className="flex gap-4 pt-4">
                  <button onClick={handleRedoQuestion} disabled={isLoading} className="flex-1 bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-100">Redo This One</button>
                  <button onClick={handleNewQuestion} disabled={isLoading} className="flex-1 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">Next Question</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
