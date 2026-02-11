
import React, { useState } from 'react';

interface AnswerBuilderProps {
  onBuildAnswer: (answer: string) => void;
}

const BuilderInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; }> = 
({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea
            rows={2}
            className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export const AnswerBuilder: React.FC<AnswerBuilderProps> = ({ onBuildAnswer }) => {
  const [situation, setSituation] = useState('');
  const [role, setRole] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [learning, setLearning] = useState('');

  const handleCombine = () => {
    const combinedAnswer = [
      situation,
      `In my role as a ${role}, I was responsible for this task.`,
      `The action I took was to ${action}.`,
      `As a result, ${result}.`,
      `From this experience, I learned that ${learning}.`
    ]
      .filter(part => part.trim() !== '' && !part.endsWith('.') && !part.endsWith('this task.') && !part.endsWith('to .') && !part.endsWith(', .') && !part.endsWith('that .')  )
      .map(part => part.trim())
      .join(' ');
      
    onBuildAnswer(combinedAnswer);
  };

  const allFieldsEmpty = !situation && !role && !action && !result && !learning;

  return (
    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 space-y-4">
      <h3 className="text-md font-semibold text-slate-800">Answer Builder</h3>
      <BuilderInput label="What was the situation?" placeholder="e.g., The team was facing a tight deadline for Project X..." value={situation} onChange={e => setSituation(e.target.value)} />
      <BuilderInput label="What was your specific role?" placeholder="e.g., project lead / developer / analyst..." value={role} onChange={e => setRole(e.target.value)} />
      <BuilderInput label="What action did you take?" placeholder="e.g., I organized a series of focused workshops..." value={action} onChange={e => setAction(e.target.value)} />
      <BuilderInput label="What was the result (include numbers if possible)?" placeholder="e.g., we delivered the project 2 days early, improving efficiency by 15%..." value={result} onChange={e => setResult(e.target.value)} />
      <BuilderInput label="What did you learn / what would you do differently?" placeholder="e.g., the importance of early stakeholder communication..." value={learning} onChange={e => setLearning(e.target.value)} />
      <button
        onClick={handleCombine}
        disabled={allFieldsEmpty}
        className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-indigo-300"
      >
        Combine & Use Answer
      </button>
    </div>
  );
};
