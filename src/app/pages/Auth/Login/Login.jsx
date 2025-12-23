import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

// Import APIs and Stores
import { loginEmail, loginUsername } from '../../../apis/Auth/LoginApi';
import { sendResetCode, verifyResetCode, resetPassword } from '../../../apis/Auth/ForgotPasswordApi';
import {
  clearRememberedCredentials,
  loadRememberedCredentials,
  persistRememberedCredentials,
} from '../../../libs/crypto';
import useAuthStore from '../../../store/authStore';
import useLoginGoogle from '../../../hooks/useLoginGoogle';

// Import Components
import LoginHeader from './partials/LoginHeader';
import LoginBranding from './partials/LoginBranding';
import LoginForm from './partials/LoginForm';
import ForgotPasswordForm from './partials/ForgotPasswordForm';

export default function Login() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const nav = useNavigate();
  const { setToken } = useAuthStore();

  // --- States for Login ---
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // --- State for View Toggle ---
  const [showForgot, setShowForgot] = useState(false);

  // --- States for Forgot Password Logic ---
  const [forgotStep, setForgotStep] = useState(1);
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
    } catch (err) {
      console.error('Login error:', err);
      message.error(err.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const { handleLoginGoogle, isPendingGoogle } = useLoginGoogle();

  // --- Forgot Password Handlers ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setSending(true);
    if (!resetEmail) {
      message.warning(t('auth.enterEmail'));
      setSending(false);
      return;
    }
    try {
      await sendResetCode(resetEmail);
      message.success(t('auth.otpSent', { email: resetEmail }));
      setForgotStep(2);
    } catch (err) {
      message.error(err?.response?.data?.message || err.message || t('auth.failedToRequestReset'));
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSending(true);
    if (otpCode.length !== 6) {
      message.error(t('auth.otpMustBe6Digits'));
      setSending(false);
      return;
    }
    try {
      // First verify the code
      await verifyResetCode(resetEmail, otpCode);
      // If successful, reset the password
      await resetPassword(resetEmail, newPassword);

      message.success(t('auth.passwordResetSuccess'));

      setForgotStep(1);
      setResetEmail('');
      setOtpCode('');
      setNewPassword('');
      setShowForgot(false);
    } catch (err) {
      message.error(err?.response?.data?.message || err.message || t('auth.failedToChangePassword'));
    } finally {
      setSending(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    if (!isPendingGoogle && !loading) {
      handleLoginGoogle();
    }
  };

  const handleBackFromForgot = () => {
    setShowForgot(false);
    setForgotStep(1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Industrial Header */}
      <LoginHeader />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Industrial Branding */}
        <LoginBranding />

        {/* Right Panel - Login/Forgot Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
          <div className="w-full max-w-md">
            {!showForgot ? (
              <LoginForm
                identity={identity}
                setIdentity={setIdentity}
                password={password}
                setPassword={setPassword}
                remember={remember}
                setRemember={setRemember}
                loading={loading}
                isPendingGoogle={isPendingGoogle}
                onSubmit={handleLoginSubmit}
                onForgotPassword={() => setShowForgot(true)}
                onGoogleLogin={handleGoogleLogin}
              />
            ) : (
              <ForgotPasswordForm
                step={forgotStep}
                setStep={setForgotStep}
                email={resetEmail}
                setEmail={setResetEmail}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                sending={sending}
                onSendCode={handleSendCode}
                onVerifyOtp={handleVerifyOtp}
                onBack={handleBackFromForgot}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
