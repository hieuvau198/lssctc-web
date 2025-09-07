import React, { useState } from 'react';
import VerifyAccount from './partials/VerifyAccount';
import ChangePassword from './partials/ChangePassword';

export default function ForgotPassword() {
  const [stage, setStage] = useState('request'); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    setLoading(true);
    try {
      // TODO: call real API: http('/api/auth/forgot-password', { method:'POST', body:{ email } })
      await new Promise(r => setTimeout(r, 1000));
      setInfo('A verification code has been sent to your email.');
      setStage('verify');
    } catch (err) {
      setError(err.message || 'Failed to request reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code) => {
    setError('');
    setLoading(true);
    try {
      // TODO: call real API: http('/api/auth/verify-reset-code', { method:'POST', body:{ email, code } })
      await new Promise(r => setTimeout(r, 1000));
      setStage('success');
    } catch (err) {
      setError(err.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      // TODO: call real API: http('/api/auth/resend-reset-code', { method:'POST', body:{ email } })
      await new Promise(r => setTimeout(r, 800));
      setInfo('Code resent. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-blue-100 shadow-sm rounded-lg p-8">
        {stage === 'request' && (
          <>
            <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Forgot password</h1>
            <p className="text-gray-500 text-sm mb-6 text-center">Enter your email to receive a verification code</p>
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>}
            <form onSubmit={handleRequest} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 text-sm outline-none transition"
                  placeholder="your-email@gmail.com"
                />
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
                {loading ? 'Sending code…' : 'Send verification code'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Remembered your password? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
            </div>
          </>
        )}

        {stage === 'verify' && (
          <VerifyAccount
            email={email}
            loading={loading}
            error={error}
            info={info}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={() => setStage('request')}
          />
        )}

        {stage === 'success' && (
          <ChangePassword
            email={email}
            onDone={() => window.location.href = '/login'}
          />
        )}
      </div>
    </div>
  );
}
