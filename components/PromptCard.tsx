'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, Edit, Copy } from 'lucide-react';

interface PromptCardProps {
  prompt: {
    _id: string;
    title: string;
    content: string;
    category: string;
    isFavorite: boolean;
    tags: string[];
  };
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onToggleFavorite,
  onDelete,
  onCopy,
}) => {
  return (
    <div className="bg-brand-card rounded-2xl border border-brand-border shadow-lg hover:shadow-indigo-500/5 transition-all p-6 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-input text-indigo-400 border border-brand-border">
          {prompt.category}
        </span>
        <button
          onClick={() => onToggleFavorite(prompt._id, prompt.isFavorite)}
          className={`p-2 rounded-xl transition-all ${
            prompt.isFavorite 
              ? 'text-red-500 bg-red-500/10 border border-red-500/20' 
              : 'text-gray-500 bg-brand-input border border-brand-border hover:text-red-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <Link href={`/prompts/${prompt._id}`}>
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer mb-3 line-clamp-1">
          {prompt.title}
        </h3>
      </Link>

      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
        {prompt.content}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {prompt.tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-input text-gray-500 border border-brand-border"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-5 border-t border-brand-border mt-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => onCopy(prompt.content)}
            className="p-2.5 bg-brand-input text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50 border border-brand-border rounded-xl transition-all"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <Link
            href={`/prompts/${prompt._id}`}
            className="p-2.5 bg-brand-input text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50 border border-brand-border rounded-xl transition-all"
            title="Edit / View Details"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
        <button
          onClick={() => onDelete(prompt._id)}
          className="p-2.5 bg-brand-input text-gray-500 hover:text-red-500 hover:border-red-500/50 border border-brand-border rounded-xl transition-all"
          title="Delete prompt"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
