import React, { useCallback, useEffect, useState } from 'react';
import {
  loadRememberedCredentials,
  persistRememberedCredentials,
  clearRememberedCredentials,
} from '../../../lib/crypto';
import PageNav from '../../../components/PageNav/PageNav';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Restore remembered credentials
  useEffect(() => {
    const creds = loadRememberedCredentials();
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setRemember(true);
    }
  }, []);

  const persistCredentials = useCallback((em, pw) => {
    if (!remember) {
      clearRememberedCredentials();
      return;
    }
    persistRememberedCredentials({ email: em, password: pw, remember });
  }, [remember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: call real login API via http('/api/auth/login')
      await new Promise(r => setTimeout(r, 1000)); // simulate
      persistCredentials(email, password);
      // redirect or set auth context
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <PageNav items={[{ title: 'Login' }]} className="pb-2" />
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur border border-blue-100 shadow-sm rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Sign in</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">Access your LSSCTC training</p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 text-sm outline-none transition"
              placeholder="your-email@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10 px-3 py-2 text-sm outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0 1 12 18c-5 0-9-4-10-6  .73-1.27 2.06-2.87 3.95-4.26M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 6-.46.8-1.2 1.87-2.27 2.94"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={[
              'w-full inline-flex items-center justify-center rounded-md font-medium text-sm h-11 px-4 text-white',
              'text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors',
              loading ? 'opacity-70 cursor-not-allowed' : ''
            ].join(' ')}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {/* Divider */}
        {/* <div className="flex items-center gap-3 my-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
          <span className="text-xs uppercase tracking-wide text-gray-500">or</span>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 h-11 text-sm font-medium text-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path fill="#4285F4" d="M23.52 12.273c0-.815-.073-1.595-.209-2.341H12v4.425h6.479a5.54 5.54 0 0 1-2.404 3.632v3.017h3.89c2.279-2.097 3.555-5.188 3.555-8.733Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.951-1.073 7.935-2.994l-3.89-3.016c-1.073.72-2.444 1.147-4.045 1.147-3.11 0-5.741-2.1-6.676-4.923H1.313v3.086A11.997 11.997 0 0 0 12 24Z"/>
            <path fill="#FBBC05" d="M5.324 14.214a7.19 7.19 0 0 1 0-4.428V6.7H1.313a11.997 11.997 0 0 0 0 10.6l4.011-3.086Z"/>
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.605 4.584 1.794l3.437-3.437C17.945 1.152 15.24 0 12 0 7.313 0 3.248 2.69 1.313 6.7l4.011 3.086C6.26 6.85 8.89 4.75 12 4.75Z"/>
          </svg>
          Continue with Google
        </button> */}
          <p className="mt-8 text-center text-xs text-gray-400">By continuing you agree to our <a href="/terms" className="underline hover:text-blue-600">Terms</a> & <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}
