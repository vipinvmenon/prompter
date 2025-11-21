'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mode, Screen, PromptOptions, HistoryItem } from './types';
import LandingScreen from './components/LandingScreen';
import ModeDetailScreen from './components/ModeDetailScreen';
import ResultScreen from './components/ResultScreen';

const transition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3,
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [selectedMode, setSelectedMode] = useState<Mode>(null);
  const [idea, setIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [modelUsed, setModelUsed] = useState('');
  const [providerUsed, setProviderUsed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<PromptOptions>({
    includeRole: true,
    includeTone: true,
    includeSafetyRules: true,
    includeExamples: true,
  });
  const [copied, setCopied] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const navigateToScreen = (newScreen: Screen, navDirection: 'forward' | 'back' = 'forward') => {
    setDirection(navDirection);
    setCurrentScreen(newScreen);
  };

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
    navigateToScreen('detail', 'forward');
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      alert('Please enter an idea first!');
      return;
    }

    setIsGenerating(true);
    setGeneratedPrompt('');
    setModelUsed('');
    setProviderUsed('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          options,
          mode: selectedMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate prompt: ${response.status}`);
      }

      const data = await response.json();
      const prompt = data.prompt || 'Failed to generate prompt';
      setGeneratedPrompt(prompt);
      setModelUsed(data.model || '');
      setProviderUsed(data.provider || '');
      
      // Add to history
      setHistory(prev => [{
        id: Date.now().toString(),
        mode: selectedMode,
        title: idea.length > 50 ? idea.substring(0, 50) + '...' : idea,
        prompt,
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]);
      
      navigateToScreen('result', 'forward');
    } catch (error) {
      setGeneratedPrompt(`Error: ${error instanceof Error ? error.message : 'Failed to generate prompt'}`);
      navigateToScreen('result', 'forward');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setGeneratedPrompt(item.prompt);
    navigateToScreen('result', 'forward');
    setHistoryOpen(false);
  };

  // Animation variants for different directions
  const slideVariants = {
    initial: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? -300 : 300,
      opacity: 0,
    }),
  };

  // Render appropriate screen with Framer Motion transitions
  return (
    <AnimatePresence custom={direction}>
      {currentScreen === 'landing' && (
        <motion.div
          key="landing"
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <LandingScreen onModeSelect={handleModeSelect} />
        </motion.div>
      )}
      {currentScreen === 'detail' && (
        <motion.div
          key="detail"
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <ModeDetailScreen
            selectedMode={selectedMode}
            idea={idea}
            onIdeaChange={setIdea}
            options={options}
            onOptionsChange={setOptions}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onBack={() => navigateToScreen('landing', 'back')}
          />
        </motion.div>
      )}
      {currentScreen === 'result' && (
        <motion.div
          key="result"
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <ResultScreen
            generatedPrompt={generatedPrompt}
            modelUsed={modelUsed}
            providerUsed={providerUsed}
            copied={copied}
            isGenerating={isGenerating}
            historyOpen={historyOpen}
            history={history}
            onCopy={handleCopy}
            onRegenerate={handleGenerate}
            onBack={() => navigateToScreen('detail', 'back')}
            onHistoryToggle={() => setHistoryOpen(!historyOpen)}
            onHistoryClose={() => setHistoryOpen(false)}
            onHistorySelect={handleHistorySelect}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
