import React, { useState } from 'react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // shared for both password inputs

  // Live confirm password mismatch tracking
  React.useEffect(() => {
    setErrors(prev => {
      const mismatch = !!confirmPassword && confirmPassword !== password;
      const had = !!prev.confirmPassword;
      if (mismatch && !had) return { ...prev, confirmPassword: 'Passwords do not match' };
      if (!mismatch && had) {
        const { confirmPassword: _omit, ...rest } = prev;
        return rest;
      }
      return prev; // no change
    });
  }, [password, confirmPassword]);

  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = 'Full name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Invalid email format';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Minimum 6 characters';
    if (!confirmPassword) next.confirmPassword = 'Confirm your password';
    else if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess(false);
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: implement real API call: http('/api/auth/register', { method: 'POST', body: { fullName, email, password } })
      await new Promise(r => setTimeout(r, 1000)); // simulate
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSubmitError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-blue-100 shadow-sm rounded-lg p-8 relative">
        <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Create account</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">Join the LSSCTC training platform</p>
        {submitError && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{submitError}</div>}
        {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">Registration successful. You can now sign in.</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${errors.fullName ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Jane Doe"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && <p id="fullName-error" className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="your-email@gmail.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
        type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md border pr-10 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
        onClick={() => setShowPassword(p => !p)}
        aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0 1 12 18c-5 0-9-4-10-6  .73-1.27 2.06-2.87 3.95-4.26M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 6-.46.8-1.2 1.87-2.27 2.94"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm password</label>
            <div className="relative">
              <input
                id="confirmPassword"
        type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-md border pr-10 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
        onClick={() => setShowPassword(p => !p)}
        aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-gray-700"
              >
        {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0 1 12 18c-5 0-9-4-10-6  .73-1.27 2.06-2.87 3.95-4.26M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 6-.46.8-1.2 1.87-2.27 2.94"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={[
              'w-full inline-flex items-center justify-center rounded-md font-medium text-sm h-11 px-4',
              'text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors',
              loading ? 'opacity-70 cursor-not-allowed' : ''
            ].join(' ')}
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">By continuing you agree to our <a href="/terms" className="underline hover:text-blue-600">Terms</a> & <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a>.</p>
      </div>
    </div>
  );
}
