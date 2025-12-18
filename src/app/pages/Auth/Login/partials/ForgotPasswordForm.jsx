import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import {
    KeyOutlined,
    MailOutlined,
    ArrowLeftOutlined,
    LockOutlined
} from '@ant-design/icons';

export default function ForgotPasswordForm({
    step,
    setStep,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    newPassword,
    setNewPassword,
    sending,
    onSendCode,
    onVerifyOtp,
    onBack,
}) {
    const { t } = useTranslation();

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 cursor-pointer text-neutral-600 hover:text-yellow-600 transition-colors font-semibold"
            >
                <ArrowLeftOutlined />
                <span>{t('common.back')}</span>
            </button>

            {step === 1 ? (
                /* Step 1: Enter Email */
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

                    <form onSubmit={onSendCode} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                                {t('common.email')}
                            </label>
                            <Input
                                type="email"
                                prefix={<MailOutlined className="text-neutral-400" />}
                                placeholder={t('common.email')}
                                value={email}
                                size="large"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={sending}
                                className="!border-2 !border-neutral-900 !rounded-none hover:!border-yellow-400 focus:!border-yellow-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full h-12 bg-yellow-400 text-black font-bold cursor-pointer uppercase tracking-wider hover:border-black hover:border-3 transition-all disabled:opacity-50"
                        >
                            {t('auth.sendVerificationCode')}
                        </button>
                    </form>
                </div>
            ) : (
                /* Step 2: Enter OTP and New Password */
                <div>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mx-auto mb-4">
                            <KeyOutlined className="text-2xl text-black" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">
                            {t('auth.verifyCode')}
                        </h1>
                        <p className="text-neutral-500">
                            {t('auth.enterVerificationCode', { email })}
                        </p>
                    </div>

                    <form onSubmit={onVerifyOtp} className="space-y-4">
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
                            className="w-full h-12 bg-yellow-400 text-black font-bold cursor-pointer mb-4 uppercase tracking-wider hover:border-yellow-400 hover:border-3 transition-all disabled:opacity-50"
                        >
                            {t('auth.resetPassword')}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full h-12 border-2 border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:text-yellow-400 hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeftOutlined />
                            {t('common.back')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
