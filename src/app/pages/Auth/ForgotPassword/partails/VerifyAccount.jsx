import React, { useEffect, useRef, useState } from 'react';

/**
 * VerifyAccount partial component
 * Props:
 *  - email: string (for display)
 *  - loading: boolean
 *  - error: string
 *  - info: string (informational message)
 *  - onVerify: (code: string) => void
 *  - onResend: () => void
 *  - onBack: () => void
 */
export default function VerifyAccount({ email, loading, error, info, onVerify, onResend, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  useEffect(() => {
    setLocalError('');
  }, [code.join('')]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return; // accept only single digit
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && inputsRef.current[i + 1]) {
      inputsRef.current[i + 1].focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && inputsRef.current[i - 1]) {
      const prev = inputsRef.current[i - 1];
      prev.focus();
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length !== 6) {
      setLocalError('Enter the 6-digit code');
      return;
    }
    onVerify(joined);
  };

  return (
    <div>
      <button onClick={onBack} className="mb-6 text-sm text-gray-500 hover:text-gray-700 inline-flex items-center group" type="button">
        <span className="mr-1 group-hover:-translate-x-0.5 transition-transform">←</span> Back
      </button>
      <h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Verify your account</h1>
      <p className="text-gray-500 text-sm mb-6 text-center">Enter the 6-digit code we sent to <span className="font-medium">{email}</span></p>
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
          onClick={onResend}
          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
        >Resend</button>
      </div>
    </div>
  );
}
