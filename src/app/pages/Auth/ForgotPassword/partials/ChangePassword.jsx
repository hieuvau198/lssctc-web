import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export default function ChangePassword({ email, onDone, loading: externalLoading }) {
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
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
			{error && <Alert message={error} type="error" showIcon className="mb-4" />}
			{success && <Alert message="Password updated! Redirecting…" type="success" showIcon className="mb-4" />}
			<form onSubmit={doSubmit} className="space-y-5">
				<div>
					<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
					<Input.Password
						id="newPassword"
						size="large"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
						autoComplete="new-password"
						iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
						required
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
					<Input.Password
						id="confirmPassword"
						size="large"
						placeholder="••••••••"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						disabled={loading}
						autoComplete="new-password"
						iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
					{loading ? 'Updating…' : 'Update password'}
				</Button>
			</form>
			<div className="mt-6 text-center text-xs text-gray-400">After updating you will be redirected to sign in.</div>
		</div>
	);
}
