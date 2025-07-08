"use client";

import { useState, useEffect, useCallback } from "react";
import { Keyboard, Trophy, Timer, Camera, Share2 } from "lucide-react";

const CODE_SNIPPETS = [
  "const experience = [];",
  "function buildSkills() {",
  "return skills.map(skill =>",
  "export default Profile;",
  "import React from 'react';",
  "const [state, setState] =",
  "await api.getData();",
  "skills.filter(s => s.active)",
  "console.log('Hello World');",
  "const handleSubmit = (e) =>",
  "type Props = {",
  "interface User {",
  "npm install react",
  "git commit -m 'feat:'",
  "const isValid = true;",
  "array.reduce((acc, curr)",
  "onClick={() => setShow(true)}",
  "className='text-primary'",
  "useState(false);",
  "useEffect(() => {",
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  timeLeft: number;
}

interface FinalResults {
  wpm: number;
  accuracy: number;
  snippetsCompleted: number;
  timestamp: number;
}

interface CodeTypingGameProps {
  onResultsUpdate?: (results: FinalResults | null) => void;
}

export const CodeTypingGame = ({ onResultsUpdate }: CodeTypingGameProps = {}) => {
  const [currentSnippet, setCurrentSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({ wpm: 0, accuracy: 100, timeLeft: 60 });
  const [gameActive, setGameActive] = useState(false);
  const [completedSnippets, setCompletedSnippets] = useState(0);
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);

  const getRandomSnippet = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * CODE_SNIPPETS.length);
    return CODE_SNIPPETS[randomIndex] || "const example = 'hello';";
  }, []);

  const startGame = useCallback(() => {
    setGameActive(true);
    setStartTime(Date.now());
    setCurrentSnippet(getRandomSnippet());
    setUserInput("");
    setCompletedSnippets(0);
    setFinalResults(null);
    onResultsUpdate?.(null);
  }, [getRandomSnippet, onResultsUpdate]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    
    const correctChars = userInput.split('').reduce((acc, char, index) => {
      return acc + (char === currentSnippet[index] ? 1 : 0);
    }, 0);
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

    const timeLeft = Math.max(0, 60 - Math.floor((Date.now() - startTime) / 1000));

    setStats({ wpm, accuracy, timeLeft });

    if (timeLeft === 0) {
      setGameActive(false);
      const results = {
        wpm,
        accuracy,
        snippetsCompleted: completedSnippets,
        timestamp: Date.now()
      };
      setFinalResults(results);
      onResultsUpdate?.(results);
    }
      }, [startTime, userInput, currentSnippet, completedSnippets, onResultsUpdate]);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(calculateStats, 100);
      return () => clearInterval(interval);
    }
  }, [gameActive, calculateStats]);

  useEffect(() => {
    if (userInput === currentSnippet && gameActive) {
      setCompletedSnippets(prev => prev + 1);
      setCurrentSnippet(getRandomSnippet());
      setUserInput("");
    }
  }, [userInput, currentSnippet, gameActive, getRandomSnippet]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!gameActive) return;
    
    if (e.key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setUserInput(prev => prev + e.key);
    }
  };

  const renderText = () => {
    return currentSnippet.split('').map((char, index) => {
      let className = "transition-colors duration-75 ";
      
      if (index < userInput.length) {
        className += userInput[index] === char ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
      } else if (index === userInput.length) {
        className += "text-gray-900 bg-blue-100 border-l-2 border-blue-500";
      } else {
        className += "text-gray-400";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  if (!gameActive && stats.timeLeft === 60) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <Keyboard className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            While we analyze your CV...
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Test your coding speed! Type code snippets to improve your skills.
          </p>
        </div>
        <button
          onClick={startGame}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start Typing Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Keyboard className="w-4 h-4 text-primary" />
            <span className="font-medium">{stats.wpm} WPM</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="font-medium">{stats.accuracy}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{stats.timeLeft}s</span>
          </div>
        </div>
        <span className="text-gray-600">Completed: {completedSnippets}</span>
      </div>

      <div 
        className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-lg leading-relaxed focus-within:ring-2 focus-within:ring-primary/20 cursor-text min-h-[80px] flex items-center"
        onClick={() => document.getElementById('typing-input')?.focus()}
      >
        <div className="w-full">
          {renderText()}
        </div>
      </div>

      <input
        id="typing-input"
        type="text"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyPress}
        className="sr-only"
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />

      {finalResults && (
        <div className="border-t bg-slate-50 p-4 rounded-b-lg">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-slate-600" />
              Challenge Complete!
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{finalResults.wpm}</div>
                <div className="text-xs text-slate-600">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{finalResults.accuracy}%</div>
                <div className="text-xs text-slate-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{finalResults.snippetsCompleted}</div>
                <div className="text-xs text-slate-600">Snippets</div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 p-2 bg-slate-900 text-white rounded-lg animate-pulse">
              <Camera className="w-4 h-4 text-white" />
              <span className="text-sm font-medium">
                Screenshot this and invite your friends!
              </span>
            </div>
            
            <p className="text-xs text-slate-600">
              Join the coding community where skills matter more than words 💻
            </p>
            
            <button
              onClick={startGame}
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Play Again & Improve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 