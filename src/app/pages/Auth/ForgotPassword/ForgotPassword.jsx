import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import VerifyAccount from './partials/VerifyAccount';
import ChangePassword from './partials/ChangePassword';
import PageNav from '../../../components/PageNav/PageNav';
import { useNavigate } from 'react-router';

export default function ForgotPassword() {
  const [stage, setStage] = useState('request'); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const nav = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <PageNav items={[{ title: 'Login', href: '/login' }, { title: 'Forgot Password' }]} className="pb-2" />
      </div>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur border border-blue-100 shadow-sm rounded-lg p-8">
        {stage === 'request' && (
          <>
            <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Forgot password</h1>
            <p className="text-gray-500 text-sm mb-6 text-center">Enter your email to receive a verification code</p>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className="mb-4"
              />
            )}
            <form onSubmit={handleRequest} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  size="large"
                  placeholder="your-email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={loading}
                className="w-full h-11"
                style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
              >
                {loading ? 'Sending code…' : 'Send verification code'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Remembered your password? <span onClick={() => nav('/auth/login')} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Sign in</span>
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
    </div>
  );
}
