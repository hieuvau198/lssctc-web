import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Alert, Button, Checkbox, Input, App } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loginEmail, loginUsername } from '../../../apis/Auth/LoginApi';
import PageNav from '../../../components/PageNav/PageNav';
import {
  clearRememberedCredentials,
  loadRememberedCredentials,
  persistRememberedCredentials,
} from '../../../libs/crypto';
import useAuthStore from '../../../store/authStore';

export default function Login() {
  const { message } = App.useApp();
  const [identity, setIdentity] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { setToken } = useAuthStore();

  // Role-based redirect function
  const redirectByRole = (role) => {
    switch (role) {
      case 'Admin':
        nav('/admin/dashboard');
        break;
      case 'Instructor':
        nav('/instructor/dashboard');
        break;
      case 'Trainee':
        nav('/');
        break;
      case 'SimulationManager':
        nav('/simulationManager/dashboard');
        break;
      case 'ProgramManager':
        nav('/programManager/dashboard');
        break;
      default:
        // Default redirect if role is unknown or not set
        nav('/');
        break;
    }
  };

  // Restore remembered credentials
  useEffect(() => {
    const creds = loadRememberedCredentials();
    if (creds) {
      // previous stored object used `email` field — map to identity
      setIdentity(creds.email || creds.username || '');
      setPassword(creds.password);
      setRemember(true);
    }
  }, []);

  const persistCredentials = useCallback((id, pw, shouldRemember) => {
    if (!shouldRemember) {
      clearRememberedCredentials();
      return;
    }
    // keep legacy `email` key for backward compatibility
    persistRememberedCredentials({ email: id, username: id, password: pw, remember: shouldRemember });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Decide whether identity is email or username (simple heuristic)
      const isEmail = identity.includes('@');
      let response;
      if (isEmail) {
        response = await loginEmail(identity.trim(), password);
      } else {
        response = await loginUsername(identity.trim(), password);
      }

      if (!response || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      const { accessToken } = response;

      // Save credentials if remember me is checked (pass remember state explicitly)
      persistCredentials(identity, password, remember);

      // Set token options based on remember me checkbox
      const tokenOptions = remember ? { expires: 7 } : {}; // 7 days if remember me, session cookie otherwise

      // Set token in authStore (this will also save to cookies automatically)
      setToken(accessToken, tokenOptions);

      // Get role from authStore after token is set and decoded
      const authState = useAuthStore.getState();
      const userRole = authState.role;
      
      console.log('User role after login:', userRole);

      // Redirect based on user role
      redirectByRole(userRole);
      message.success('Login successful');
    } catch (err) {
      // show notification and error block
      // use message.error from Ant Design message API
      try {
        message.error(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
      } catch (e) {
        // ignore if message api not available
      }
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="identity">Email or Username</label>
            <Input
              id="identity"
              type="text"
              size="large"
              placeholder="you@example.com or username"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              disabled={loading}
              autoComplete="username email"
              required
            />
            <p className="text-xs text-gray-400 mt-1">You can sign in with your email address or username.</p>
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
