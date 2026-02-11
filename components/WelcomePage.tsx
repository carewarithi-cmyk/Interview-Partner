
import React from 'react';
import { LogoIcon } from './icons';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="text-center max-w-2xl mx-auto bg-black bg-opacity-20 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl animate-fade-in-up">
        <LogoIcon className="h-20 w-20 mx-auto mb-6 text-white animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Welcome to Interview Partner
        </h1>
        <p className="text-lg sm:text-xl text-indigo-200 mb-8 max-w-xl mx-auto">
          Your personal AI coach for job interviews. Get tailored practice questions, actionable feedback, and structured coaching based on your resume and the job you want.
        </p>
        <button
          onClick={onStart}
          className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-indigo-100 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Let's Get Started
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
