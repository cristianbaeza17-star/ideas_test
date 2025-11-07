import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Idea } from '../types';
import type { Session } from '@supabase/supabase-js';

interface DashboardProps {
  session: Session;
}

const IdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <p className="text-gray-200">{idea.content}</p>
      <p className="text-right text-xs text-gray-500 mt-2">
        {new Date(idea.created_at).toLocaleString()}
      </p>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error.message);
      setError(`Could not fetch your ideas: ${error.message}`);
    } else if (data) {
      setIdeas(data as Idea[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleAddIdea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newIdea.trim() === '') return;

    setError(null); // Clear previous errors on a new submission attempt

    const { data, error } = await supabase
      .from('ideas')
      .insert([{ content: newIdea.trim(), user_id: session.user.id }])
      .select();

    if (error) {
      console.error('Error adding idea:', error.message);
      setError(`Failed to save your idea: ${error.message}`);
    } else if (data) {
      setIdeas([data[0] as Idea, ...ideas]);
      setNewIdea('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Ideas</h1>
          <p className="text-gray-400">Welcome, {session.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span>Logout</span>
        </button>
      </header>

      <div className="bg-brand-secondary p-6 rounded-lg shadow-xl mb-8">
        <form onSubmit={handleAddIdea}>
          <textarea
            value={newIdea}
            onChange={(e) => {
              setNewIdea(e.target.value);
              if (error) setError(null); // Clear error when user starts typing
            }}
            placeholder="What's your next big idea?"
            className="w-full h-28 p-3 bg-brand-accent text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            aria-label="New idea text area"
            aria-describedby={error ? "idea-error" : undefined}
          ></textarea>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex-grow pr-4">
              {error && <p id="idea-error" className="text-red-400 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-300 disabled:opacity-50 flex-shrink-0"
              disabled={!newIdea.trim()}
            >
              Save Idea
            </button>
          </div>
        </form>
      </div>

      <main>
        {loading ? (
          <p className="text-center text-gray-400">Loading your brilliant ideas...</p>
        ) : ideas.length === 0 ? (
          <p className="text-center text-gray-500">You haven't saved any ideas yet. Let's get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;