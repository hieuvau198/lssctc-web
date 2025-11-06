import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Alert, Button, Checkbox, Input } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import PageNav from '../../../components/PageNav/PageNav';
import {
  clearRememberedCredentials,
  loadRememberedCredentials,
  persistRememberedCredentials,
} from '../../../libs/crypto';
import { useNavigate } from 'react-router';
import { loginEmail, loginUsername } from '../../../apis/Auth/LoginApi';
import { decodeAndStore } from '../../../libs/jwtDecode';
import { setAuthToken } from '../../../libs/cookies';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

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
      // Call real login API: decide email vs username
      const isEmail = String(email).includes('@');
      const res = isEmail
        ? await loginEmail(email, password)
        : await loginUsername(email, password);
      const token = res?.accessToken || res?.access_token || res?.token;
      if (!token) throw new Error('No access token returned');

      // Persist remembered credentials if needed
      persistCredentials(email, password);

      // Decode and store token in auth store (also writes cookie via store.setToken)
      decodeAndStore(token);

      // Ensure cookie expiration respects "remember"
      try {
        setAuthToken(token, remember ? { expires: 7 } : {});
      } catch {}

      // Redirect to home
      nav('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
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
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="identifier">Email or Username</label>
            <Input
              id="identifier"
              type="text"
              size="large"
              placeholder="email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <Input.Password
              id="password"
              size="large"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            >
              Remember me
            </Checkbox>
            <div onClick={() => nav('/auth/forgot-password')} className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">Forgot password?</div>
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
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
          <p className="pt-4 text-center text-xs text-gray-400">By continuing you agree to our <a href="#" className="underline hover:text-blue-600">Terms</a> & <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}
