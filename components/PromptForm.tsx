'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, ChevronDown } from 'lucide-react';

interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface PromptFormProps {
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    isFavorite?: boolean;
  };
  onSubmit: (data: PromptFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DEFAULT_FORM_DATA = {
  title: '',
  content: '',
  category: 'General',
  tags: '',
};

const PromptForm: React.FC<PromptFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category,
        tags: initialData.tags.join(', '),
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags string into array
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    onSubmit({
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      tags: tagsArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-brand-card rounded-3xl border border-brand-border shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        <div className="px-8 py-6 border-b border-brand-border flex justify-between items-center bg-brand-input/30">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Prompt' : 'Create New Prompt'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-white hover:bg-brand-input rounded-xl transition-all"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-bold text-gray-400 ml-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="block w-full px-4 py-3 bg-brand-input border border-brand-border rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g., Code Refactor Assistant"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-bold text-gray-400 ml-1">
                Category
              </label>
              <div className="relative group">
                <select
                  id="category"
                  name="category"
                  className="block w-full px-4 py-3 bg-brand-input border border-brand-border rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer pr-10"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="Coding">Coding</option>
                  <option value="Writing">Writing</option>
                  <option value="Creative">Creative</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Education">Education</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 group-hover:text-gray-300 transition-colors">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-bold text-gray-400 ml-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="block w-full px-4 py-3 bg-brand-input border border-brand-border rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g., react, typescript"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-bold text-gray-400 ml-1">
              Prompt Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="block w-full px-4 py-4 bg-brand-input border border-brand-border rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
              placeholder="Write your prompt here..."
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-brand-border text-gray-400 font-bold hover:bg-brand-input hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {initialData ? 'Update Prompt' : 'Create Prompt'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptForm;
