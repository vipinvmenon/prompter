'use client';

import { useState } from 'react';

export default function Home() {
  const [idea, setIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generationNote, setGenerationNote] = useState('');
  const [modelUsed, setModelUsed] = useState('');
  const [providerUsed, setProviderUsed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeRole, setIncludeRole] = useState(true);
  const [includeTone, setIncludeTone] = useState(true);
  const [includeSafetyRules, setIncludeSafetyRules] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      alert('Please enter an idea first!');
      return;
    }

    setIsGenerating(true);
    setGeneratedPrompt('');
    setGenerationNote('');
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
          options: {
            includeRole,
            includeTone,
            includeSafetyRules,
            includeExamples,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate prompt: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedPrompt(data.prompt || 'Failed to generate prompt');
      setGenerationNote(data.note || '');
      setModelUsed(data.model || '');
      setProviderUsed(data.provider || '');
    } catch (error) {
      setGeneratedPrompt(`Error: ${error instanceof Error ? error.message : 'Failed to generate prompt'}`);
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
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-2xl font-bold">
            PF
          </div>
          <h1 className="text-2xl font-bold">Prompter</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold leading-tight">
            Turn any idea into a powerful AI prompt
          </h2>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label
            htmlFor="idea-input"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            What do you want the AI to do?
          </label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: I want an AI that explains my React code in beginner-friendly language and gives suggestions for improvement."
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            rows={4}
          />
        </div>

        {/* Options */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeRole}
              onChange={(e) => setIncludeRole(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm">Include Role</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeTone}
              onChange={(e) => setIncludeTone(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm">Include Tone</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeSafetyRules}
              onChange={(e) => setIncludeSafetyRules(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm">Include Safety Rules</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeExamples}
              onChange={(e) => setIncludeExamples(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm">Include Examples</span>
          </label>
        </div>

        {/* Generate Button */}
        <div className="mb-12 text-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 text-lg font-semibold text-white transition-all hover:from-purple-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                Generate Prompt
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Generated Prompt Section */}
        {generatedPrompt && (
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Your Generated Prompt</h3>
            </div>
            <div className="relative min-h-[200px] w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3">
              <button
                onClick={handleCopy}
                disabled={!generatedPrompt}
                className="absolute right-10 top-3 z-10 flex items-center justify-center rounded-lg border border-white/20 bg-black/50 p-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                title="Copy prompt"
              >
                {copied ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <pre className="min-h-[200px] max-h-[400px] w-full overflow-auto whitespace-pre-wrap break-words pr-16 text-sm text-white"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4B5563 transparent'
                }}
              >
                {generatedPrompt}
              </pre>
            </div>
            {modelUsed && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span>
                  Generated by <span className="font-semibold text-white">{providerUsed}</span> using{' '}
                  <span className="font-mono text-purple-400">{modelUsed}</span>
                </span>
              </div>
            )}
            {generationNote && (
              <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                <p className="font-medium whitespace-pre-line">{generationNote}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
