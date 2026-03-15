'use client';

import React, { useState } from 'react';
import { Copy, Check, Edit2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PromptEditorProps {
  prompt: {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
  };
  onEdit: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-400 hover:text-indigo-400 transition-all group font-bold"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>
        <button
          onClick={onEdit}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Prompt
        </button>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-border shadow-2xl overflow-hidden">
        <div className="px-10 py-8 bg-brand-input/30 border-b border-brand-border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-input text-indigo-400 border border-brand-border">
              {prompt.category}
            </span>
            {prompt.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-input text-gray-500 border border-brand-border uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            {prompt.title}
          </h1>
        </div>

        <div className="p-10 relative">
          <div className="absolute top-8 right-10">
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center space-x-2 font-bold text-sm ${
                copied
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-brand-input border-brand-border text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-brand-input rounded-2xl p-8 min-h-[400px] text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30 border border-brand-border shadow-inner">
            {prompt.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
