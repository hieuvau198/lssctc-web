import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router'; // Thêm Link để điều hướng về Home
import { App, Divider, Input } from 'antd';
import { 
  
  FacebookFilled, 
  GithubOutlined, 
  LinkedinFilled,
  KeyOutlined,
  MailOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// Import CSS
import './Login.css';

// Import APIs and Stores
import { loginEmail, loginUsername } from '../../../apis/Auth/LoginApi';
import {
  clearRememberedCredentials,
  loadRememberedCredentials,
  persistRememberedCredentials,
} from '../../../libs/crypto';
import useAuthStore from '../../../store/authStore';
import useLoginGoogle from '../../../hooks/useLoginGoogle';

export default function Login() {
  const { message } = App.useApp();
  const nav = useNavigate();
  const { setToken } = useAuthStore();

  // --- States for Login ---
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // --- State for Animation Toggle ---
  // false = Login Form Visible (Panel Phải)
  // true = Forgot Password Form Visible (Panel Trái)
  const [isActive, setIsActive] = useState(false);

  // --- States for Forgot Password Logic ---
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Pass mới
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // --- Redirect Logic ---
  const redirectByRole = (role) => {
    switch (role) {
      case 'Admin': nav('/admin/dashboard'); break;
      case 'Instructor': nav('/instructor/dashboard'); break;
      case 'Trainee': nav('/'); break;
      case 'SimulationManager': nav('/simulationManager/dashboard'); break;
      case 'ProgramManager': nav('/programManager/dashboard'); break;
      default: nav('/'); break;
    }
  };

  // --- Restore Credentials ---
  useEffect(() => {
    const creds = loadRememberedCredentials();
    if (creds) {
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
    persistRememberedCredentials({ email: id, username: id, password: pw, remember: shouldRemember });
  }, []);

  // --- Handle Login ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
      persistCredentials(identity, password, remember);
      const tokenOptions = remember ? { expires: 7 } : {};
      setToken(accessToken, tokenOptions);

      const authState = useAuthStore.getState();
      redirectByRole(authState.role);
      message.success('Login successful');
    } catch (err) {
      console.error('Login error:', err);
      message.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const { handleLoginGoogle, isPendingGoogle } = useLoginGoogle();

  // --- Forgot Password Handlers ---
  const handleSendCode = (e) => {
    e.preventDefault();
    setSending(true);
    if (!resetEmail) {
        message.warning('Please enter your email address');
        setSending(false);
        return;
    }
    // Simulate API Call here
    message.success(`OTP code sent to ${resetEmail}`);
    setForgotStep(2); 
    setSending(false);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setSending(true);
    if (otpCode.length !== 6) {
        message.error('Code must be 6 digits');
        setSending(false);
        return;
    }
    // Simulate API Call here
    message.success('Password reset successfully!');
    
    // Reset states and slide back to login
    setForgotStep(1);
    setResetEmail('');
    setOtpCode('');
    setNewPassword('');
    setIsActive(false); 
    setSending(false);
  };

  return (
    <div className="login-page-wrapper">
      
      {/* --- HEADER PHONG CÁCH SHOPEE --- */}
        <header className="shopee-header">
        <div className="header-content">
          {/* Click Logo về Home */}
          <Link to="/" className="brand-wrap">
            <img src="/crane-truck.png" alt="LSSCTC Logo" className="header-logo" />
            <span className="brand-name">LSSCTC</span>
          </Link>
          <span className="page-title">Sign In</span>
        </div>
        </header>

      <div className={`login-container ${isActive ? 'active' : ''}`} id="container">
        
        {/* --- FORM QUÊN MẬT KHẨU (Thay thế vị trí Sign Up cũ) --- */}
        <div className="form-container sign-up">
          {forgotStep === 1 ? (
            <form onSubmit={handleSendCode}>
              <h1>Recovery Password</h1>
              <div className="social-icons">
                <span className="icon"><MailOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span className="text-desc">Enter your email to receive verification code</span>
              <Input
                type="email"
                placeholder="Email Address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                disabled={sending}
              />
              <button type="submit" style={{marginTop: '15px'}}>Send Code</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h1>Verification</h1>
              <div className="social-icons">
                <span className="icon"><KeyOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span className="text-desc">Enter the 6-digit code sent to your email</span>
              
              <Input
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                size='small'
                className="otp-input"
                style={{ textAlign: 'center' }}
                disabled={sending}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                size='small'
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={sending}
              />
              
              <button type="submit" style={{marginTop: '10px'}}>Reset Password</button>
              
              <div onClick={() => setForgotStep(1)} className="back-link">
                <ArrowLeftOutlined /> Back to Email
              </div>
            </form>
          )}
        </div>

        {/* --- FORM ĐĂNG NHẬP (Bên phải) --- */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            
            <Input
              placeholder="Email or Username"
              value={identity}
              size="small"
              onChange={(e) => setIdentity(e.target.value)}
              required
              disabled={loading}
            />
            <Input.Password
              placeholder="Password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            <div className="form-actions">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={loading}
                  />
                  Remember me
                </label>
                {/* Link kích hoạt hiệu ứng trượt */}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(true); }}>
                  Forgot Password?
                </a>
            </div>

            <button type="submit" disabled={loading} style={{marginTop: '15px'}}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <Divider style={{ margin: '10px', fontSize: '12px', color: '#94a3b8' }}>OR</Divider>

            <div className="social-icons">
              <a
                href="#"
                className="icon"
                aria-label="Sign in with Google"
                onClick={(e) => { e.preventDefault(); if (!isPendingGoogle && !loading) handleLoginGoogle(); }}
                style={{ cursor: isPendingGoogle || loading ? 'not-allowed' : 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 533.5 544.3" role="img" aria-label="Google logo">
                  <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37-4.7-54.6H272v103.3h146.9c-6.3 34-25.2 62.8-53.9 82.1v68.2h87.1c51-47 80.4-116.2 80.4-198.9z"/>
                  <path fill="#34A853" d="M272 544.3c72.7 0 133.8-24.1 178.5-65.5l-87.1-68.2c-24.2 16.2-55.4 25.9-91.4 25.9-70.3 0-129.8-47.4-151.2-111.2H36.2v69.9C80.7 483.2 169.8 544.3 272 544.3z"/>
                  <path fill="#FBBC05" d="M120.8 325.3c-10.8-32.4-10.8-67.5 0-99.9V155.5H36.2c-39.2 76.4-39.2 166.6 0 243l84.6-72.2z"/>
                  <path fill="#EA4335" d="M272 107.7c39.6 0 75.4 13.6 103.6 40.5l77.8-77.8C403.8 24.9 341.9 0 272 0 169.8 0 80.7 61.1 36.2 155.5l84.6 69.9C142.2 155.1 201.7 107.7 272 107.7z"/>
                </svg>
              </a>
            </div>
          </form>
        </div>

        {/* --- OVERLAY TRƯỢT --- */}
        <div className="toggle-container">
          <div className="toggle">
            
            {/* Panel Trái: Hiện khi đang ở trang Forgot Password */}
            <div className="toggle-panel toggle-left">
              <h1>Remember Password?</h1>
              <p>If you already have an account, just sign in to continue your journey.</p>
              <button onClick={() => setIsActive(false)} aria-label="Go to Sign In">
                Sign In
              </button>
            </div>
            
            {/* Panel Phải: Hiện khi đang ở trang Login */}
            <div className="toggle-panel toggle-right">
              <h1>Forgot Password?</h1>
              <p>Don't worry! Enter your email to receive a recovery code and reset your password.</p>
              <button onClick={() => setIsActive(true)} aria-label="Go to Recovery">
                Recovery Password
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

