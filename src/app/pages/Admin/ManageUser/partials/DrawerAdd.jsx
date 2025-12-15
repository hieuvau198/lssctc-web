import { App, Button, Col, Drawer, Form, Image, Input, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

            message.success(t('admin.users.createSuccess'));
            form.resetFields();
            setAvatarPreview(null);
            onCreated(created);
            onClose();
        } catch (err) {
            console.error('Create user failed', err);
            let errorMsg = t('admin.users.createFailed');
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

    return (
        <Drawer
            open={visible}
            onClose={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
            title={getTitle(role)}
            width={520}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="username" label={t('admin.users.form.username')} rules={[{ required: true, message: t('admin.users.form.usernameRequired') }]}>
                            <Input
                                placeholder={t('admin.users.form.username')}
                                showCount
                                maxLength={50}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="fullName" label={t('admin.users.form.fullName')} rules={[{ required: true, message: t('admin.users.form.fullNameRequired') }]}>
                            <Input
                                placeholder={t('admin.users.form.fullName')}
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="email" label={t('admin.users.form.email')} rules={[{ required: true, message: t('admin.users.form.emailRequired') }, { type: 'email', message: t('admin.users.form.emailInvalid') }]}>
                            <Input placeholder="email@example.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label={t('admin.users.form.phoneNumber')}
                            rules={[
                                { required: true, message: t('admin.users.form.phoneRequired') },
                                {
                                    pattern: /^0\d{9}$/, // starts with 0 and 10 digits total
                                    message: t('admin.users.form.phoneInvalid'),
                                },
                            ]}
                        >
                            <Input placeholder="0XXXXXXXXX" showCount maxLength={10} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="password" label={t('admin.users.form.password')} rules={[{ required: true, message: t('admin.users.form.passwordRequired') }, { min: 6, message: t('admin.users.form.passwordMin') }]}>
                            <Input.Password placeholder={t('admin.users.form.password')} showCount minLength={6} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="confirmPassword"
                            label={t('admin.users.form.confirmPassword')}
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
                            <Input.Password placeholder={t('admin.users.form.confirmPassword')} showCount minLength={6} />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <Form.Item name="avatarUrl" label={t('admin.users.form.avatarUrl')}>
                        <Input
                            placeholder="https://example.com/avatar.jpg"
                            allowClear
                            onChange={(e) => {
                                const v = e?.target?.value || '';
                                setAvatarPreview(v.trim() ? v.trim() : null);
                            }}
                        />
                    </Form.Item>

                    <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">{t('admin.users.form.avatarPreview')}</div>
                        <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                            {avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    preview={{ mask: t('common.clickToPreview') }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">{t('common.noImage')}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => { form.resetFields(); onClose(); }} style={{ marginRight: 8 }}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('common.create')}
                    </Button>
                </div>
            </Form>
        </Drawer>
    );
}
