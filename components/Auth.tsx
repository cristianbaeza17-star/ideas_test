import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const AuthComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Sign-in failed. Let's try to sign up. This also handles resending confirmation emails for unconfirmed users.
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        // The sign-up attempt failed. This error is more specific and useful.
        setError(signUpError.message);
      } else if (signUpData.user) {
        // The sign-up or confirmation resend was successful.
        setMessage('Check your email (and spam folder) for the confirmation link!');
      } else {
        // Fallback to the original sign-in error if sign-up doesn't return a user or an error.
        setError(signInError.message);
      }
    }
    // If signInError is null, the login was successful and the onAuthStateChange listener will handle it.
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-accent p-4">
      <div className="w-full max-w-md">
        <div className="bg-brand-secondary shadow-2xl rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Idea Board</h1>
            <p className="text-gray-400 mt-2">Sign in or create an account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <input
                className="w-full px-4 py-3 bg-brand-accent text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                type="email"
                placeholder="Your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full px-4 py-3 bg-brand-accent text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                type="password"
                placeholder="Your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-500"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Sign In / Sign Up'}
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;