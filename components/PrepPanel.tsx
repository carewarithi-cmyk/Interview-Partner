
import React from 'react';
import { PrepData } from '../types';

interface PrepPanelProps {
  prepData: PrepData;
}

const PrepSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
    <ul className="list-disc list-inside space-y-1 text-slate-600">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);


export const PrepPanel: React.FC<PrepPanelProps> = ({ prepData }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">2. Your Prep Plan</h2>
      <div className="space-y-6">
        <PrepSection title="Top Tips Before You Start" items={prepData.topTips} />
        <PrepSection title="Likely Competencies" items={prepData.competencies} />
        <PrepSection title="Your Best Stories to Prepare" items={prepData.storiesToPrepare} />
      </div>
    </div>
  );
};
