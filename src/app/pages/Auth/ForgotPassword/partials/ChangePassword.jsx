import React, { useState } from 'react';

export default function ChangePassword({ email, onDone, loading: externalLoading }) {
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [show, setShow] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const loading = externalLoading || localLoading;

	const doSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		if (!password) return setError('Password is required');
		if (password.length < 6) return setError('Minimum 6 characters');
		if (password !== confirm) return setError('Passwords do not match');
		setLocalLoading(true);
		try {
			// TODO: call real API: http('/api/auth/reset-password', { method:'POST', body:{ email, password } })
			await new Promise(r => setTimeout(r, 1000));
			setSuccess(true);
			setPassword('');
			setConfirm('');
			setTimeout(() => { onDone && onDone(); }, 1200);
		} catch (err) {
			setError(err.message || 'Failed to change password');
		} finally {
			setLocalLoading(false);
		}
	};

	return (
		<div>
			<h1 className="text-2xl font-semibold text-blue-700 mb-2 text-center">Create new password</h1>
			<p className="text-gray-500 text-sm mb-6 text-center">Set a strong password for <span className="font-medium">{email}</span></p>
			{error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</div>}
			{success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">Password updated! Redirecting…</div>}
			<form onSubmit={doSubmit} className="space-y-5">
				<div>
					<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
					<div className="relative">
						<input
							id="newPassword"
							type={show ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10 px-3 py-2 text-sm outline-none transition"
							placeholder="••••••••"
							autoComplete="new-password"
							required
						/>
						<button
							type="button"
							onClick={() => setShow(s => !s)}
							className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-gray-700"
							aria-label={show ? 'Hide passwords' : 'Show passwords'}
						>
							{show ? (
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0 1 12 18c-5 0-9-4-10-6 .73-1.27 2.06-2.87 3.95-4.26M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 6-.46.8-1.2 1.87-2.27 2.94"/></svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
							)}
						</button>
					</div>
				</div>
				<div>
					<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
					<div className="relative">
						<input
							id="confirmPassword"
							type={show ? 'text' : 'password'}
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10 px-3 py-2 text-sm outline-none transition"
							placeholder="••••••••"
							autoComplete="new-password"
							required
						/>
						<button
							type="button"
							onClick={() => setShow(s => !s)}
							className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-gray-700"
							aria-label={show ? 'Hide passwords' : 'Show passwords'}
						>
							{show ? (
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A10.94 10.94 0 0 1 12 18c-5 0-9-4-10-6 .73-1.27 2.06-2.87 3.95-4.26M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 6-.46.8-1.2 1.87-2.27 2.94"/></svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
							)}
						</button>
					</div>
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
					{loading ? 'Updating…' : 'Update password'}
				</button>
			</form>
			<div className="mt-6 text-center text-xs text-gray-400">After updating you will be redirected to sign in.</div>
		</div>
	);
}
