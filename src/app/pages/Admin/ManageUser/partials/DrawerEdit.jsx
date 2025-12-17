import { Form, Image, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, X, Save, User, Phone, Image as ImageIcon } from 'lucide-react';
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

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={() => { form.resetFields(); setAvatarPreview(null); onClose(); }}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl transform transition-transform">
                {/* Header - Industrial Theme */}
                <div className="bg-black p-4 border-b-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                                <Pencil className="w-5 h-5 text-black" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {t('admin.users.editUser') || "Edit User"}
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
                    {fetching ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-neutral-500 font-medium">{t('common.loading')}</p>
                        </div>
                    ) : (
                        <Form form={form} layout="vertical" onFinish={handleFinish}>
                            {/* Personal Information */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center">
                                        <User className="w-3 h-3 text-black" />
                                    </div>
                                    <span className="font-bold uppercase text-sm tracking-wider">Personal Info</span>
                                </div>

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
                            </div>

                            {/* Contact */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-black flex items-center justify-center">
                                        <Phone className="w-3 h-3 text-yellow-400" />
                                    </div>
                                    <span className="font-bold uppercase text-sm tracking-wider">Contact</span>
                                </div>

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
                            </div>

                            {/* Avatar */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center">
                                        <ImageIcon className="w-3 h-3 text-black" />
                                    </div>
                                    <span className="font-bold uppercase text-sm tracking-wider">Avatar</span>
                                </div>

                                <Form.Item
                                    name="avatarUrl"
                                    label={<span className="font-bold text-xs uppercase tracking-wider">{t('admin.users.form.avatarUrl')}</span>}
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
                                    <div className="w-28 h-28 border-2 border-black flex items-center justify-center bg-neutral-100">
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
                        </Form>
                    )}
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
                            disabled={loading || fetching}
                            className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-colors disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2">
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {t('common.save') || "Save"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
