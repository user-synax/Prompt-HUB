'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Filter, Heart, BookOpen, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import PromptCard from '@/components/PromptCard';
import PromptForm from '@/components/PromptForm';

export default function DashboardPage() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', favorite: false });
  const [categories] = useState(['General', 'Coding', 'Writing', 'Creative', 'Productivity', 'Education']);
  const router = useRouter();

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.favorite) queryParams.append('favorite', 'true');

      const res = await fetch(`/api/prompts?${queryParams.toString()}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setPrompts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleCreatePrompt = async (formData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        fetchPrompts();
      }
    } catch (err) {
      console.error('Failed to create prompt:', err);
    }
  };

  const handleToggleFavorite = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !current }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPrompts();
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPrompts();
      }
    } catch (err) {
      console.error('Failed to delete prompt:', err);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleLogout = async () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-100">
      {/* Navigation */}
      <nav className="bg-brand-card border-b border-brand-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center text-indigo-400 font-bold text-xl">
                <BookOpen className="h-8 w-8 mr-2" />
                Prompt-Book
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-500 hover:cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Prompts</h1>
            <p className="text-gray-400 text-sm mt-1">Manage and organize your AI prompt library</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] hover:cursor-pointer"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Prompt
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-brand-card p-6 rounded-2xl border border-brand-border shadow-xl mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="grow">
              <SearchBar onSearch={(q) => setFilters({ ...filters, search: q })} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <select
                  className="pl-10 pr-10 py-2.5 bg-brand-input border border-brand-border rounded-xl text-sm font-medium text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              <button
                onClick={() => setFilters({ ...filters, favorite: !filters.favorite })}
                className={`inline-flex hover:cursor-pointer items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filters.favorite
                    ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                    : 'bg-brand-input text-gray-400 border border-brand-border hover:bg-brand-border'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${filters.favorite ? 'fill-current' : ''}`} />
                Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-brand-card rounded-2xl h-64 border border-brand-border animate-pulse" />
            ))}
          </div>
        ) : prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <PromptCard
                key={(prompt as { _id: string })._id}
                prompt={prompt}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeletePrompt}
                onCopy={handleCopy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-brand-card rounded-3xl border-2 border-dashed border-brand-border">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-brand-input mb-6 text-gray-500">
              <BookOpen className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold text-white">No prompts found</h3>
            <p className="text-gray-400 max-w-xs mx-auto mt-3">
              Try adjusting your search filters or create your first prompt.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-8 inline-flex items-center px-6 py-3 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              <Plus className="h-5 w-5 mr-1" />
              Create your first prompt
            </button>
          </div>
        )}
      </main>

      {/* Create Form Modal */}
      {showForm && (
        <PromptForm
          onSubmit={(data) => handleCreatePrompt(data as unknown as Record<string, unknown>)}
          onCancel={() => setShowForm(false)}
          isLoading={false}
        />
      )}
    </div>
  );
}
