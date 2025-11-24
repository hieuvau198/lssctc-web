import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { App } from 'antd';
import { 
  GoogleOutlined, 
  FacebookFilled, 
  GithubOutlined, 
  LinkedinFilled,
  KeyOutlined,
  MailOutlined,
  NumberOutlined
} from '@ant-design/icons';

import './Login.css';

// Import APIs and Stores
import { loginEmail, loginUsername } from '../../../apis/Auth/LoginApi';
import {
  clearRememberedCredentials,
  loadRememberedCredentials,
  persistRememberedCredentials,
} from '../../../libs/crypto';
import useAuthStore from '../../../store/authStore';

export default function Login() {
  const { message } = App.useApp();
  const nav = useNavigate();
  const { setToken } = useAuthStore();

  // --- States for Login ---
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- State for Animation Toggle (True = Hiển thị form Forgot Password) ---
  const [isActive, setIsActive] = useState(false);

  // --- States for Forgot Password Logic ---
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // --- Role Based Redirect ---
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

  // --- Handle Login Submit ---
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

  // --- Handle Forgot Password Flow ---
  
  // Bước 1: Gửi mã OTP về Email
  const handleSendCode = (e) => {
    e.preventDefault();
    if (!resetEmail) {
        message.warning('Please enter your email address');
        return;
    }
    // TODO: Gọi API gửi OTP tại đây
    // await sendOtpApi(resetEmail);
    
    message.success(`OTP code sent to ${resetEmail}`);
    setForgotStep(2); // Chuyển sang bước nhập OTP
  };

  // Bước 2: Xác nhận OTP và đổi mật khẩu
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
        message.error('Code must be 6 digits');
        return;
    }
    // TODO: Gọi API verify OTP và đổi pass tại đây
    // await resetPasswordApi(resetEmail, otpCode, newPassword);

    message.success('Password reset successfully!');
    setForgotStep(1); // Reset form
    setResetEmail('');
    setOtpCode('');
    setNewPassword('');
    setIsActive(false); // Trượt về màn hình Login
  };

  return (
    <div className="login-page-wrapper">
      <div className={`login-container ${isActive ? 'active' : ''}`} id="container">
        
        {/* --- FORGOT PASSWORD PANEL (Thay thế vị trí Sign Up cũ - Bên Trái) --- */}
        <div className="form-container sign-up">
          {forgotStep === 1 ? (
            // Form Bước 1: Nhập Email
            <form onSubmit={handleSendCode}>
              <h1>Recovery Password</h1>
              <div className="social-icons">
                <span className="icon"><MailOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span style={{textAlign: 'center', marginBottom: '10px'}}>
                Enter your email address to receive a verification code
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required 
              />
              <button type="submit">Send Code</button>
            </form>
          ) : (
            // Form Bước 2: Nhập OTP & Pass mới
            <form onSubmit={handleVerifyOtp}>
              <h1>Verification</h1>
              <div className="social-icons">
                <span className="icon"><KeyOutlined style={{fontSize: '20px'}}/></span>
              </div>
              <span>Enter the 6-digit code sent to your email</span>
              
              <input 
                type="text" 
                placeholder="6-Digit Code" 
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
              
              {/* Nút quay lại bước 1 nếu nhập sai email */}
              <a href="#" onClick={(e) => {e.preventDefault(); setForgotStep(1)}} style={{marginTop: '15px', fontSize: '12px'}}>
                Wrong email? Back
              </a>
            </form>
          )}
        </div>

        {/* --- LOGIN FORM (Bên Phải) --- */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><GoogleOutlined /></a>
              <a href="#" className="icon"><FacebookFilled /></a>
              <a href="#" className="icon"><GithubOutlined /></a>
              <a href="#" className="icon"><LinkedinFilled /></a>
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
            
            <div className="flex justify-between w-full px-1 mt-2 text-xs" style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px'}}>
                <label className="flex items-center cursor-pointer" style={{display: 'flex', alignItems: 'center'}}>
                  <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{width: 'auto', margin: '0 5px 0 0'}} 
                  />
                  Remember me
                </label>
                {/* Link nhỏ này cũng kích hoạt hiệu ứng trượt */}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsActive(true); }}>
                  Forgot Password?
                </a>
            </div>

            <button type="submit" disabled={loading} style={{marginTop: '15px'}}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* --- OVERLAY (Phần trượt che chắn) --- */}
        <div className="toggle-container">
          <div className="toggle">
            {/* Panel trái (Hiện khi đang ở trang Forgot Pass -> Bấm để về Login) */}
            <div className="toggle-panel toggle-left">
              <h1>Remember Password?</h1>
              <p>If you already have an account, just sign in to continue your journey.</p>
              <button className="hidden" onClick={() => setIsActive(false)}>
                Sign In
              </button>
            </div>
            
            {/* Panel phải (Hiện khi đang ở trang Login -> Bấm để sang Forgot Pass) */}
            <div className="toggle-panel toggle-right">
              <h1>Forgot Password?</h1>
              <p>Don't worry! Enter your email to receive a recovery code and reset your password.</p>
              <button className="hidden" onClick={() => setIsActive(true)}>
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

