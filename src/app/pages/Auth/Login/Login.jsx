import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { App } from 'antd';
import { 
  GoogleOutlined,
  KeyOutlined,
  MailOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// Make sure you have this CSS file created as per previous instructions
import './Login.css';

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
  
  // --- State for Animation Toggle ---
  // false = Login Form Visible
  // true = Forgot Password Form Visible
  const [isActive, setIsActive] = useState(false);

  // --- States for Forgot Password Logic ---
  const [forgotStep, setForgotStep] = useState(1); // 1: Input Email, 2: Input OTP & New Pass
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  const { handleLoginGoogle, isPendingGoogle } = useLoginGoogle();

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

  // --- Forgot Password Handlers ---
  const handleSendCode = (e) => {
    e.preventDefault();
    if (!resetEmail) {
        message.warning('Please enter your email address');
        return;
    }
    // Simulate API Call
    console.log("Sending code to:", resetEmail);
    message.success(`OTP code sent to ${resetEmail}`);
    setForgotStep(2); 
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
        message.error('Code must be 6 digits');
        return;
    }
    // Simulate API Call
    console.log("Verifying:", otpCode, newPassword);
    message.success('Password reset successfully!');
    
    // Reset states and slide back to login
    setForgotStep(1);
    setResetEmail('');
    setOtpCode('');
    setNewPassword('');
    setIsActive(false); 
  };

  return (
    <div className="login-page-wrapper">
      <div className={`login-container ${isActive ? 'active' : ''}`} id="container">
        
        {/* --- RECOVERY FORM (Takes the place of Sign Up) --- */}
        <div className="form-container sign-up">
          {forgotStep === 1 ? (
            <form onSubmit={handleSendCode}>
              <h1>Recovery Password</h1>
              <div className="social-icons">
                <span className="icon"><MailOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span className="text-center mb-4 text-xs text-gray-500">
                Enter your email address to receive a verification code
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required 
              />
              <button type="submit" style={{marginTop: '15px'}}>Send Code</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h1>Verification</h1>
              <div className="social-icons">
                <span className="icon"><KeyOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span className="text-center mb-4 text-xs text-gray-500">
                Enter the 6-digit code sent to your email
              </span>
              
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required 
                style={{textAlign: 'center', letterSpacing: '5px', fontWeight: 'bold'}}
              />
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
              
              <button type="submit" style={{marginTop: '10px'}}>Reset Password</button>
              
              <div 
                onClick={() => setForgotStep(1)} 
                className="mt-4 text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
              >
                <ArrowLeftOutlined /> Back to Email
              </div>
            </form>
          )}
        </div>

        {/* --- LOGIN FORM --- */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a
                href="#"
                className="icon"
                aria-label="Sign in with Google"
                onClick={(e) => { e.preventDefault(); if (!isPendingGoogle) handleLoginGoogle(); }}
                style={{ cursor: isPendingGoogle ? 'not-allowed' : 'pointer' }}
              >
                <GoogleOutlined style={{ fontSize: '34px' }} />
              </a>
            </div>
            <span>or use your account</span>
            
            <input 
              type="text" 
              placeholder="Email or Username" 
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="flex justify-between w-full px-1 mt-2 text-xs">
                <label className="flex items-center cursor-pointer gap-2">
                  <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-auto m-0"
                  />
                  Remember me
                </label>
                {/* Optional: Text link also triggers the slide */}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(true); }} className="hover:text-blue-600">
                  Forgot Password?
                </a>
            </div>

            <button type="submit" disabled={loading} style={{marginTop: '15px'}}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* --- OVERLAY / TOGGLE PANELS --- */}
        <div className="toggle-container">
          <div className="toggle">
            
            {/* Panel Left: Visible when on Recovery Page */}
            <div className="toggle-panel toggle-left">
              <h1>Remember Password?</h1>
              <p>If you already have an account, just sign in to continue your journey.</p>
              {/* BUTTON SIGN IN: Moves back to Login */}
              <button onClick={() => setIsActive(false)} aria-label="Sign In">
                Sign In
              </button>
            </div>
            
            {/* Panel Right: Visible when on Login Page */}
            <div className="toggle-panel toggle-right">
              <h1>Forgot Password?</h1>
              <p>Don't worry! Enter your email to receive a recovery code and reset your password.</p>
              {/* BUTTON RECOVERY: Moves to Recovery Form */}
              <button onClick={() => setIsActive(true)} aria-label="Recovery">
                Recovery
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

