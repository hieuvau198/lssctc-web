import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginForm({
    identity,
    setIdentity,
    password,
    setPassword,
    remember,
    setRemember,
    loading,
    isPendingGoogle,
    onSubmit,
    onForgotPassword,
    onGoogleLogin,
}) {
    const { t } = useTranslation();

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">
                    {t('auth.signIn')}
                </h1>
                <p className="text-neutral-500">
                    Đăng nhập để tiếp tục
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
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
                        onClick={onForgotPassword}
                        className="text-sm font-semibold text-neutral-600 hover:text-yellow-400 cursor-pointer transition-colors"
                    >
                        {t('auth.forgotPassword')}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-yellow-400 text-black font-bold cursor-pointer uppercase tracking-wider hover:border-black hover:border-3 transition-all disabled:opacity-50"
                >
                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                </button>

                <Divider className="!my-6">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{t('auth.orContinueWith')}</span>
                </Divider>

                <button
                    type="button"
                    onClick={onGoogleLogin}
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
    );
}
