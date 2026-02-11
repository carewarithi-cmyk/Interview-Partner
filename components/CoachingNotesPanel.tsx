
import React, { useState } from 'react';
import { CoachingNotes, PracticePlan } from '../types';
import { ClipboardIcon, DownloadIcon, LoaderIcon } from './icons';

interface CoachingNotesPanelProps {
  notes: CoachingNotes;
  plan: PracticePlan | null;
  onGetPlan: () => void;
  isLoading: boolean;
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

const downloadAsTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const CoachingNotesPanel: React.FC<CoachingNotesPanelProps> = ({ notes, plan, onGetPlan, isLoading }) => {
    const [copied, setCopied] = useState(false);

    const getNotesAsText = () => {
        let text = "--- COACHING NOTES ---\n\n";
        text += "Strengths to Keep:\n";
        notes.strengths.forEach(s => text += `- ${s}\n`);
        text += "\nRecurring Improvements:\n";
        notes.improvements.forEach(i => text += `- ${i}\n`);
        text += `\nNext Practice Focus: ${notes.nextFocus}\n\n`;

        if (plan) {
            text += "--- NEXT PRACTICE PLAN ---\n\n";
            text += "Drills:\n";
            plan.drills.forEach(d => text += `- ${d}\n`);
            text += "\nSuggested Questions:\n";
            plan.suggestedQuestions.forEach(q => text += `- ${q}\n`);
        }
        return text;
    };
    
    const handleCopy = () => {
        copyToClipboard(getNotesAsText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        downloadAsTextFile(getNotesAsText(), 'Interview_Partner_Notes.txt');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">4. Coaching Notes</h2>
                    <p className="text-sm text-slate-500">This summary updates after each answer.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCopy} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Copy to Clipboard">
                        {copied ? <span className="text-sm text-green-600">Copied!</span> : <ClipboardIcon className="h-5 w-5" />}
                    </button>
                    <button onClick={handleDownload} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Download Notes">
                        <DownloadIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-4 bg-slate-100 p-4 rounded-lg border border-slate-200">
                 <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Strengths to Keep</h3>
                    <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                        {notes.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-red-700 mb-1">Recurring Improvements</h3>
                    <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                         {notes.improvements.length > 0 ? notes.improvements.map((s, i) => <li key={i}>{s}</li>) : <li>No improvement themes yet.</li>}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Next Practice Focus</h3>
                    <p className="text-slate-600 text-sm">{notes.nextFocus}</p>
                </div>
            </div>

            {plan && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Your Next Practice Plan</h3>
                    <div className="space-y-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div>
                            <h4 className="font-semibold text-indigo-800 mb-1">Drills</h4>
                            <ul className="list-disc list-inside text-indigo-700 text-sm space-y-1">
                                {plan.drills.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-indigo-800 mb-1">Suggested Questions</h4>
                             <ul className="list-disc list-inside text-indigo-700 text-sm space-y-1">
                                {plan.suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!plan && (
                <button 
                  onClick={onGetPlan}
                  disabled={isLoading}
                  className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center gap-2"
                >
                    {isLoading ? <><LoaderIcon className="h-5 w-5"/> Generating...</> : 'End Session & Create My Practice Plan'}
                </button>
            )}

        </div>
    )
}
