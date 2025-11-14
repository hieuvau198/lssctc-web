import { App, Button, Col, Drawer, Form, Image, Input, Row } from 'antd';
import { useState } from 'react';
import { createInstructor, createSimulationManager, createTrainee } from '../../../../apis/Admin/AdminUser';

export default function DrawerAdd({ visible = false, onClose = () => { }, role = 'trainee', onCreated = () => { } }) {
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const titleMap = {
        trainee: 'Add Trainee',
        instructor: 'Add Instructor',
        simulationmanager: 'Add Simulation Manager',
        'simulation-manager': 'Add Simulation Manager',
    };

    const getTitle = (r) => {
        const key = String(r || '').toLowerCase();
        // try exact, then normalized (remove non-alphanumeric)
        if (titleMap[key]) return titleMap[key];
        const norm = key.replace(/[^a-z0-9]/g, '');
        return titleMap[norm] || 'User';
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

            message.success(`${getTitle(role)} successfully`);
            form.resetFields();
            setAvatarPreview(null);
            onCreated(created);
            onClose();
        } catch (err) {
            console.error('Create user failed', err);
            message.error(err || 'Create failed');
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
                        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}>
                            <Input
                                placeholder="Username"
                                showCount
                                maxLength={50}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="fullName" label="Full name" rules={[{ required: true, message: 'Please enter full name' }]}>
                            <Input
                                placeholder="Full name"
                                showCount
                                maxLength={100}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Invalid email' }]}>
                            <Input placeholder="email@example.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Phone number"
                            rules={[
                                { required: true, message: 'Please enter phone number' },
                                {
                                    pattern: /^0\d{9}$/, // starts with 0 and 10 digits total
                                    message: 'Phone number must be 10 digits and start with 0',
                                },
                            ]}
                        >
                            <Input placeholder="0XXXXXXXXX" showCount maxLength={10} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please set a password' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
                            <Input.Password placeholder="Password" showCount minLength={6} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm password"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: 'Please confirm the password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm password" showCount minLength={6} />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <Form.Item name="avatarUrl" label="Avatar URL">
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
                        <div className="text-sm text-gray-600 mb-2">Avatar preview</div>
                        <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
                            {avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    preview={{ mask: 'Click to preview' }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => { form.resetFields(); onClose(); }} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create
                    </Button>
                </div>
            </Form>
        </Drawer>
    );
}
