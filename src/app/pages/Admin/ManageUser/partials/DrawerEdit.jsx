import { Button, Col, Drawer, Form, Image, Input, Row, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserById, updateUser } from '../../../../apis/Admin/AdminUser';

export default function DrawerEdit({ visible = false, onClose = () => { }, userId = null, onUpdated = () => { } }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && userId) {
            fetchUser(userId);
        } else {
            form.resetFields();
            setAvatarPreview(null);
        }
    }, [visible, userId]);

    const fetchUser = async (id) => {
        setFetching(true);
        try {
            const user = await getUserById(id);
            form.setFieldsValue({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                avatarUrl: user.avatarUrl || '',
            });
            setAvatarPreview(user.avatarUrl || null);
        } catch (error) {
            console.error(error);
            message.error(t('common.error'));
            onClose();
        } finally {
            setFetching(false);
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                fullname: values.fullName,
                phoneNumber: values.phoneNumber,
                avatarUrl: values.avatarUrl,
            };

            await updateUser(userId, payload);
            message.success(t('admin.users.updateSuccess') || "Update success");
            form.resetFields();
            onUpdated();
            onClose();
        } catch (err) {
            console.error('Update user failed', err);
            message.error(err?.response?.data?.message || err?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            open={visible}
            onClose={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
            title={t('admin.users.editUser') || "Edit User"}
            width={520}
            destroyOnClose
        >
            {fetching ? (
                <div className="flex justify-center p-10"><Spin /></div>
            ) : (
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="fullName" label={t('admin.users.form.fullName')} rules={[{ required: true, message: t('admin.users.form.fullNameRequired') }]}>
                        <Input
                            placeholder={t('admin.users.form.fullName')}
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label={t('admin.users.form.phoneNumber')}
                        rules={[
                            { required: true, message: t('admin.users.form.phoneRequired') },
                            {
                                pattern: /^0\d{9}$/,
                                message: t('admin.users.form.phoneInvalid'),
                            },
                        ]}
                    >
                        <Input placeholder="0XXXXXXXXX" showCount maxLength={10} />
                    </Form.Item>

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

                    <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-2">{t('admin.users.form.avatarPreview')}</div>
                        <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 border">
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

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => { form.resetFields(); onClose(); }} style={{ marginRight: 8 }}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('common.save') || "Save"}
                        </Button>
                    </div>
                </Form>
            )}
        </Drawer>
    );
}
