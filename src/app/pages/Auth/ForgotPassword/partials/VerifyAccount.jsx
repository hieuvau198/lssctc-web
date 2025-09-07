import React, { useEffect, useRef, useState } from 'react';

export default function VerifyAccount({ email, loading, error, info, onVerify, onResend, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [localError, setLocalError] = useState('');
  const [remaining, setRemaining] = useState(5 * 60); // seconds

  // Countdown timer
  useEffect(() => {
    if (remaining <= 0) {
      window.location.href = '/login';
      return;
    }
    const id = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  useEffect(() => {
    setLocalError('');
  }, [code.join('')]);

  const handleChange = (i, val) => {
    // Allow any keyboard input (IME friendly). Keep only the last entered character.
    if (!val) {
      const next = [...code];
      next[i] = '';
      setCode(next);
      return;
    }
    const char = val.slice(-1); // take last char in case of paste/composition
    const next = [...code];
    next[i] = char;
    setCode(next);
    if (char && inputsRef.current[i + 1]) {
      inputsRef.current[i + 1].focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && inputsRef.current[i - 1]) {
      const prev = inputsRef.current[i - 1];
      prev.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) {
      next[i] = text[i] || '';
    }
    setCode(next);
    // Focus last filled or first empty
    const lastIndex = text.length >= 6 ? 5 : text.length - 1;
    if (inputsRef.current[lastIndex]) inputsRef.current[lastIndex].focus();
    // Auto submit if full 6 digits
    if (text.length === 6) {
      if (!loading) {
        // small delay to allow state to flush
        setTimeout(() => {
          const joined = next.join('');
          if (/^\d{6}$/.test(joined)) {
            onVerify(joined);
          }
        }, 10);
      }
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length !== 6) {
      setLocalError('Enter the 6-digit code');
      return;
    }
    if (!/^\d{6}$/.test(joined)) {
      setLocalError('Code must contain only digits 0-9');
      return;
    }
    onVerify(joined);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Verify your account</h1>
      <p className="text-gray-500 text-sm mb-3 text-center">Enter the 6-digit code we sent to <span className="font-medium">{email}</span></p>
  <div className="text-center text-lg text-gray-500 mb-4">Time remaining: <span className="font-medium text-gray-700">{String(Math.floor(remaining/60)).padStart(2,'0')}:{String(remaining%60).padStart(2,'0')}</span></div>
      {(error || localError || info) && (
        <div className="mb-4 space-y-2">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>}
          {localError && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{localError}</div>}
          {info && <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded px-3 py-2 text-center">{info}</div>}
        </div>
      )}
      <form onSubmit={submit} className="space-y-6">
        <div className="flex justify-between gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => inputsRef.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-lg font-semibold rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition tracking-wider"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
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
          {loading ? 'Verifying…' : 'Verify code'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600">
        Didn't get a code?{' '}
        <button
          type="button"
          disabled={loading}
          onClick={() => { onResend(); setRemaining(5*60); }}
          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
        >Resend</button>
      </div>
    </div>
  );
}
