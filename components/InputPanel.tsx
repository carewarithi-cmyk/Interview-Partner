
import React from 'react';
import { InterviewType, AnswerMode } from '../types';
import { TrashIcon, LoaderIcon, InfoIcon } from './icons';
import { COMPETENCIES } from '../constants';

interface InputPanelProps {
  resume: string;
  setResume: (value: string) => void;
  jobPosting: string;
  setJobPosting: (value: string) => void;
  interviewType: InterviewType;
  setInterviewType: (value: InterviewType) => void;
  answerMode: AnswerMode;
  setAnswerMode: (value: AnswerMode) => void;
  selectedCompetencies: string[];
  setSelectedCompetencies: (value: string[]) => void;
  onGeneratePrep: () => void;
  onClear: () => void;
  isLoading: boolean;
  isPrepGenerated: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  resume, setResume, jobPosting, setJobPosting,
  interviewType, setInterviewType, answerMode, setAnswerMode,
  selectedCompetencies, setSelectedCompetencies,
  onGeneratePrep, onClear, isLoading, isPrepGenerated
}) => {
  const handleCompetencyToggle = (competency: string) => {
    const currentIndex = selectedCompetencies.indexOf(competency);
    const newCompetencies = [...selectedCompetencies];
    if (currentIndex === -1) {
      newCompetencies.push(competency);
    } else {
      newCompetencies.splice(currentIndex, 1);
    }
    setSelectedCompetencies(newCompetencies);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">1. Your Details</h2>
        {isPrepGenerated && (
          <button onClick={onClear} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors">
            <TrashIcon className="h-4 w-4" />
            Start Over
          </button>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-slate-700 mb-1">Your Resume</label>
          <textarea
            id="resume"
            rows={6}
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            placeholder="Paste your resume text here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            disabled={isPrepGenerated}
          />
           <div className="mt-2 flex items-start gap-2 text-xs text-yellow-800 bg-yellow-100 p-2 rounded-md border border-yellow-200">
            <InfoIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>For your privacy, please remove sensitive info like your full address or phone number before pasting.</span>
          </div>
        </div>
        <div>
          <label htmlFor="job-posting" className="block text-sm font-medium text-slate-700 mb-1">The Job Posting</label>
          <textarea
            id="job-posting"
            rows={6}
            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            placeholder="Paste the job posting details here..."
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            disabled={isPrepGenerated}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="interview-type" className="block text-sm font-medium text-slate-700 mb-1">Interview Type</label>
            <select
              id="interview-type"
              className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as InterviewType)}
              disabled={isPrepGenerated}
            >
              {Object.values(InterviewType).map(type => (
                <option key={type} value={type} className="capitalize">{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Answer Mode</label>
            <div className="flex gap-2 mt-2">
              {(Object.values(AnswerMode) as AnswerMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAnswerMode(mode)}
                  disabled={isPrepGenerated}
                  className={`px-3 py-1.5 text-sm rounded-md transition capitalize w-full ${answerMode === mode ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Focus on Competencies (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {COMPETENCIES.map(comp => (
              <button
                key={comp}
                onClick={() => handleCompetencyToggle(comp)}
                disabled={isPrepGenerated}
                className={`px-3 py-1 text-xs rounded-full transition ${selectedCompetencies.includes(comp) ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300'}`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
        {!isPrepGenerated && (
          <button
            onClick={onGeneratePrep}
            disabled={isLoading || !resume || !jobPosting}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <><LoaderIcon className="h-5 w-5"/> Generating...</> : 'Generate My Prep'}
          </button>
        )}
      </div>
    </div>
  );
};
