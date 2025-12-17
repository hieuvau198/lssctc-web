import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { App, Divider, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  KeyOutlined,
  MailOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';

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
  const handleSendCode = (e) => {
    e.preventDefault();
    setSending(true);
    if (!resetEmail) {
      message.warning(t('auth.enterEmail'));
      setSending(false);
      return;
    }
    message.success(t('auth.otpSent', { email: resetEmail }));
    setForgotStep(2);
    setSending(false);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setSending(true);
    if (otpCode.length !== 6) {
      message.error(t('auth.otpMustBe6Digits'));
      setSending(false);
      return;
    }
    message.success(t('auth.passwordResetSuccess'));

    setForgotStep(1);
    setResetEmail('');
    setOtpCode('');
    setNewPassword('');
    setShowForgot(false);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Industrial Header */}
      <header className="bg-black text-white">
        <div className="h-1 bg-yellow-400" />
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-xl font-black uppercase tracking-wider text-white group-hover:text-yellow-400 transition-colors">
                LSSCTC
              </span>
            </Link>
            <span className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              {t('auth.signIn')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Industrial Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

          <div className="relative z-10 flex flex-col justify-center p-12 max-w-xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Chào mừng đến với LSSCTC
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Đào tạo vận hành cần cẩu chuyên nghiệp với công nghệ mô phỏng 3D tiên tiến
              </p>
            </div>

            <div className="space-y-4">
              {['Chương trình đào tạo chuyên nghiệp', 'Mô phỏng 3D thực tế', 'Chứng nhận quốc tế'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400" />
                  <span className="text-neutral-300 uppercase tracking-wider text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
          <div className="w-full max-w-md">
            {!showForgot ? (
              /* Login Form */
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">
                    {t('auth.signIn')}
                  </h1>
                  <p className="text-neutral-500">
                    Đăng nhập để tiếp tục
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      {t('auth.username')}
                    </label>
                    <Input
                      prefix={<UserOutlined className="text-neutral-400" />}
                      placeholder={t('auth.username')}
                      value={identity}
                      size="large"
                      onChange={(e) => setIdentity(e.target.value)}
                      required
                      disabled={loading}
                      className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      {t('auth.password')}
                    </label>
                    <Input.Password
                      prefix={<LockOutlined className="text-neutral-400" />}
                      placeholder={t('auth.password')}
                      size="large"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4 accent-yellow-400"
                      />
                      <span className="text-sm text-neutral-600">{t('auth.rememberMe')}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-sm font-semibold text-neutral-600 hover:text-yellow-600 transition-colors"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all disabled:opacity-50"
                  >
                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                  </button>

                  <Divider className="!my-6">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{t('auth.orContinueWith')}</span>
                  </Divider>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); if (!isPendingGoogle && !loading) handleLoginGoogle(); }}
                    disabled={isPendingGoogle || loading}
                    className="w-full h-12 border-2 border-neutral-900 bg-white text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 533.5 544.3">
                      <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37-4.7-54.6H272v103.3h146.9c-6.3 34-25.2 62.8-53.9 82.1v68.2h87.1c51-47 80.4-116.2 80.4-198.9z" />
                      <path fill="#34A853" d="M272 544.3c72.7 0 133.8-24.1 178.5-65.5l-87.1-68.2c-24.2 16.2-55.4 25.9-91.4 25.9-70.3 0-129.8-47.4-151.2-111.2H36.2v69.9C80.7 483.2 169.8 544.3 272 544.3z" />
                      <path fill="#FBBC05" d="M120.8 325.3c-10.8-32.4-10.8-67.5 0-99.9V155.5H36.2c-39.2 76.4-39.2 166.6 0 243l84.6-72.2z" />
                      <path fill="#EA4335" d="M272 107.7c39.6 0 75.4 13.6 103.6 40.5l77.8-77.8C403.8 24.9 341.9 0 272 0 169.8 0 80.7 61.1 36.2 155.5l84.6 69.9C142.2 155.1 201.7 107.7 272 107.7z" />
                    </svg>
                    Google
                  </button>
                </form>
              </div>
            ) : (
              /* Forgot Password Form */
              <div>
                <button
                  onClick={() => { setShowForgot(false); setForgotStep(1); }}
                  className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-yellow-600 transition-colors font-semibold"
                >
                  <ArrowLeftOutlined />
                  <span>{t('common.back')}</span>
                </button>

                {forgotStep === 1 ? (
                  <div>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mx-auto mb-4">
                        <MailOutlined className="text-2xl text-black" />
                      </div>
                      <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">
                        {t('auth.resetPassword')}
                      </h1>
                      <p className="text-neutral-500">
                        {t('auth.forgotPasswordDesc')}
                      </p>
                    </div>

                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          {t('common.email')}
                        </label>
                        <Input
                          type="email"
                          prefix={<MailOutlined className="text-neutral-400" />}
                          placeholder={t('common.email')}
                          value={resetEmail}
                          size="large"
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          disabled={sending}
                          className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full h-12 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all disabled:opacity-50"
                      >
                        {t('auth.sendVerificationCode')}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mx-auto mb-4">
                        <KeyOutlined className="text-2xl text-black" />
                      </div>
                      <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">
                        {t('auth.verifyCode')}
                      </h1>
                      <p className="text-neutral-500">
                        {t('auth.enterVerificationCode', { email: resetEmail })}
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          OTP Code
                        </label>
                        <Input
                          placeholder="000000"
                          maxLength={6}
                          value={otpCode}
                          size="large"
                          onChange={(e) => setOtpCode(e.target.value)}
                          required
                          disabled={sending}
                          className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400 !text-center !text-2xl !tracking-widest !font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          {t('auth.newPassword')}
                        </label>
                        <Input.Password
                          prefix={<LockOutlined className="text-neutral-400" />}
                          placeholder={t('auth.newPassword')}
                          value={newPassword}
                          size="large"
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          disabled={sending}
                          className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full h-12 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all disabled:opacity-50"
                      >
                        {t('auth.resetPassword')}
                      </button>

                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="w-full h-12 border-2 border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeftOutlined />
                        {t('common.back')}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
