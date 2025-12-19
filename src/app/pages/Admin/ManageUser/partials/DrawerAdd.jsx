import { App, Col, Form, Image, Input, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, X, Save, User, Mail, Phone, Lock, Image as ImageIcon } from 'lucide-react';
import { createInstructor, createSimulationManager, createTrainee } from '../../../../apis/Admin/AdminUser';

export default function DrawerAdd({ visible = false, onClose = () => { }, role = 'trainee', onCreated = () => { } }) {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [form] = Form.useForm();

    const getTitle = (r) => {
        const key = String(r || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (key === 'trainee') return t('admin.users.addTrainee');
        if (key === 'instructor') return t('admin.users.addInstructor');
        if (key === 'simulationmanager') return t('admin.users.addSimulationManager');
        return t('admin.users.user');
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            let created = null;
            const payload = {
                username: values.username,
                email: values.email,
                fullname: values.fullName,
                password: values.password,
                phoneNumber: values.phoneNumber,
                avatarUrl: values.avatarUrl || null,
            };

            if (role === 'trainee') {
                created = await createTrainee(payload);
            } else if (role === 'instructor') {
                created = await createInstructor(payload);
            } else {
                created = await createSimulationManager(payload);
            }

            message.success(t('admin.users.messages.createSuccess'));
            form.resetFields();
            setAvatarPreview(null);
            onCreated(created);
            onClose();
        } catch (err) {
            console.error('Create user failed', err);
            let errorMsg = t('admin.users.messages.createFailed');
            if (err?.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err?.response?.data?.title) {
                errorMsg = err.response.data.title;
            } else if (typeof err?.response?.data === 'string') {
                errorMsg = err.response.data;
            } else if (err?.message) {
                errorMsg = err.message;
            }
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl transform transition-transform">
                {/* Header - Industrial Theme */}
                <div className="bg-black p-4 border-b-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-black" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {getTitle(role)}
                            </h2>
                        </div>
                        <button
                            onClick={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        {/* Account Information */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center">
                                    <User className="w-3 h-3 text-black" />
                                </div>
                                <span className="font-bold uppercase text-sm tracking-wider">Account Info</span>
                            </div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="username"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.username')}</span>}
                                        rules={[{ required: true, message: t('admin.users.form.usernameRequired') }]}
                                    >
                                        <Input
                                            placeholder={t('admin.users.form.username')}
                                            showCount
                                            maxLength={50}
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="fullName"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.fullName')}</span>}
                                        rules={[{ required: true, message: t('admin.users.form.fullNameRequired') }]}
                                    >
                                        <Input
                                            placeholder={t('admin.users.form.fullName')}
                                            showCount
                                            maxLength={100}
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-black flex items-center justify-center">
                                    <Mail className="w-3 h-3 text-yellow-400" />
                                </div>
                                <span className="font-bold uppercase text-sm tracking-wider">Contact Info</span>
                            </div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.email')}</span>}
                                        rules={[
                                            { required: true, message: t('admin.users.form.emailRequired') },
                                            { type: 'email', message: t('admin.users.form.emailInvalid') }
                                        ]}
                                    >
                                        <Input
                                            placeholder="email@example.com"
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.phoneNumber')}</span>}
                                        rules={[
                                            { required: true, message: t('admin.users.form.phoneRequired') },
                                            { pattern: /^0\d{9}$/, message: t('admin.users.form.phoneInvalid') },
                                        ]}
                                    >
                                        <Input
                                            placeholder="0XXXXXXXXX"
                                            showCount
                                            maxLength={10}
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Security */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-black" />
                                </div>
                                <span className="font-bold uppercase text-sm tracking-wider">Security</span>
                            </div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.password')}</span>}
                                        rules={[
                                            { required: true, message: t('admin.users.form.passwordRequired') },
                                            { min: 6, message: t('admin.users.form.passwordMin') }
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder={t('admin.users.form.password')}
                                            showCount
                                            minLength={6}
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="confirmPassword"
                                        label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.confirmPassword')}</span>}
                                        dependencies={["password"]}
                                        rules={[
                                            { required: true, message: t('admin.users.form.confirmPasswordRequired') },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t('admin.users.form.passwordMismatch')));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder={t('admin.users.form.confirmPassword')}
                                            showCount
                                            minLength={6}
                                            className="h-10 border-2 border-neutral-300 focus:border-black"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Avatar */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-black flex items-center justify-center">
                                    <ImageIcon className="w-3 h-3 text-yellow-400" />
                                </div>
                                <span className="font-bold uppercase text-sm tracking-wider">Avatar</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <Form.Item
                                    name="avatarUrl"
                                    label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.avatarUrl')}</span>}
                                    className="mb-0"
                                >
                                    <Input
                                        placeholder="https://example.com/avatar.jpg"
                                        allowClear
                                        className="h-10 border-2 border-neutral-300 focus:border-black"
                                        onChange={(e) => {
                                            const v = e?.target?.value || '';
                                            setAvatarPreview(v.trim() ? v.trim() : null);
                                        }}
                                    />
                                </Form.Item>

                                <div>
                                    <div className="font-bold text-xs uppercase tracking-wider mb-2">{t('admin.users.form.avatarPreview')}</div>
                                    <div className="w-24 h-24 border-2 border-black flex items-center justify-center bg-neutral-100">
                                        {avatarPreview ? (
                                            <Image
                                                src={avatarPreview}
                                                preview={{ mask: t('common.clickToPreview') }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-neutral-400 text-xs text-center">{t('common.noImage')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

                {/* Footer - Industrial Theme */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-neutral-50 border-t-2 border-neutral-200">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
                            className="px-6 py-2.5 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                {t('common.cancel')}
                            </span>
                        </button>
                        <button
                            onClick={() => form.submit()}
                            disabled={loading}
                            className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-colors disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2">
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {t('common.create')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
