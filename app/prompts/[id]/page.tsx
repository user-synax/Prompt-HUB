'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PromptEditor from '@/components/PromptEditor';
import PromptForm from '@/components/PromptForm';
import { BookOpen, LogOut } from 'lucide-react';

export default function PromptDetailPage() {
  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const fetchPrompt = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${id}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setPrompt(data.data);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Failed to fetch prompt:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchPrompt();
  }, [fetchPrompt]);

  const handleUpdatePrompt = async (formData: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditForm(false);
        fetchPrompt();
      }
    } catch (err) {
      console.error('Failed to update prompt:', err);
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Navigation */}
      <nav className="bg-brand-card border-b border-brand-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div
                onClick={() => router.push('/dashboard')}
                className="flex-shrink-0 flex items-center text-indigo-400 font-bold text-xl cursor-pointer"
              >
                <BookOpen className="h-8 w-8 mr-2" />
                PromptBook
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <PromptEditor prompt={prompt} onEdit={() => setShowEditForm(true)} />

      {showEditForm && (
        <PromptForm
          initialData={prompt}
          onSubmit={(data: PromptFormData) => handleUpdatePrompt(data as Record<string, unknown>)}
          onCancel={() => setShowEditForm(false)}
          isLoading={false}
        />
      )}
    </div>
  );
}
