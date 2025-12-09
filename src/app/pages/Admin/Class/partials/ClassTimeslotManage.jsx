import { App, Button, DatePicker, Form, Input, Modal, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { Edit, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTimeslot, getInstructorClassTimeslots, updateTimeslot } from '../../../../apis/TimeSlot/TimeSlot';

export default function ClassTimeslotManage({ classItem }) {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [timeslots, setTimeslots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [form] = Form.useForm();

    const fetchSlots = async () => {
        if (!classItem?.id) return;
        setLoading(true);
        try {
            const data = await getInstructorClassTimeslots(classItem.id);
            setTimeslots(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch timeslots error:', error);
            message.error('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [classItem?.id]);

    const handleOpenModal = (record = null) => {
        setEditingSlot(record);
        if (record) {
            form.setFieldsValue({
                name: record.name,
                startTime: dayjs(record.startTime),
                endTime: dayjs(record.endTime),
                locationBuilding: record.locationBuilding,
                locationRoom: record.locationRoom,
                locationDetail: record.locationDetail,
            });
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    };

    const handleSave = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                classId: classItem.id, // Ignored for update but needed for create
                name: values.name,
                startTime: values.startTime.toISOString(),
                endTime: values.endTime.toISOString(),
                locationDetail: values.locationDetail,
                locationBuilding: values.locationBuilding,
                locationRoom: values.locationRoom,
            };

            if (editingSlot) {
                await updateTimeslot(editingSlot.id, payload);
                message.success('Timeslot updated successfully');
            } else {
                await createTimeslot(payload);
                message.success('Timeslot created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchSlots();
        } catch (error) {
            console.error('Save timeslot error:', error);
            const apiData = error?.response?.data;
            const msg = (apiData && (apiData.message || apiData.error)) || error?.message || 'Failed to save timeslot';
            message.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: t('common.name') || 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Start Time', // t('admin.classes.form.startTime') || 
            dataIndex: 'startTime',
            key: 'startTime',
            // Format to show Date and Time HH:mm explicitly
            render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
            width: 160,
        },
        {
            title: 'End Time', // t('admin.classes.form.endTime') || 
            dataIndex: 'endTime',
            key: 'endTime',
            render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
            width: 160,
        },
        {
            title: 'Location', // t('admin.classes.form.location') || 
            key: 'location',
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.locationRoom} - {record.locationBuilding}</div>
                    <div className="text-xs text-gray-500">{record.locationDetail}</div>
                </div>
            ),
        },
        {
            title: t('common.status') || 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag>{status || 'Scheduled'}</Tag>
            ),
        },
        {
            title: t('common.action') || 'Action',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="text" 
                        size="small" 
                        icon={<Edit size={16} />} 
                        onClick={() => handleOpenModal(record)} 
                    />
                </Space>
            ),
        }
    ];

    return (
        <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-semibold m-0">{'Class Schedule'}</h3>
                <Button 
                    type="primary" 
                    icon={<Plus size={16} />} 
                    onClick={() => handleOpenModal(null)}
                >
                    {'Add Timeslot'}
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={timeslots}
                loading={loading}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: t('common.noData') }}
            />

            <Modal
                title={editingSlot ? "Edit Timeslot" : "Add New Timeslot"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        label="Slot Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input placeholder="e.g. Session 1: Introduction" />
                    </Form.Item>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Start Time"
                            name="startTime"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="End Time"
                            name="endTime"
                            dependencies={['startTime']}
                            rules={[
                                { required: true, message: 'Required' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('End time must be after start time'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Building"
                            name="locationBuilding"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="e.g. Building A" />
                        </Form.Item>
                        <Form.Item
                            label="Room"
                            name="locationRoom"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="e.g. Room 101" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Location Detail"
                        name="locationDetail"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Detailed instructions..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}