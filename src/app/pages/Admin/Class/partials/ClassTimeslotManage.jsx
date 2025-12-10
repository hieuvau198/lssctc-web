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
            message.error(t('class.timeslot.loadFailed'));
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
                message.success(t('class.timeslot.updated'));
            } else {
                await createTimeslot(payload);
                message.success(t('class.timeslot.created'));
            }
            setModalVisible(false);
            form.resetFields();
            fetchSlots();
        } catch (error) {
            console.error('Save timeslot error:', error);
            const apiData = error?.response?.data;
            const msg = (apiData && (apiData.message || apiData.error)) || error?.message || t('class.timeslot.saveFailed');
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
            title: t('class.timeslot.startTime'),
            dataIndex: 'startTime',
            key: 'startTime',
            // Format to show Date and Time HH:mm explicitly
            render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
            width: 160,
        },
        {
            title: t('class.timeslot.endTime'),
            dataIndex: 'endTime',
            key: 'endTime',
            render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
            width: 160,
        },
        {
            title: t('class.timeslot.location'),
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
                <Tag>{status || t('class.timeslot.scheduled')}</Tag>
            ),
        },
        {
            title: t('common.action') || 'Action',
            key: 'action',
            width: 150,
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
                <span className="text-lg font-semibold m-0">{t('class.timeslot.title')}</span>
                <Button 
                    type="primary" 
                    icon={<Plus size={16} />} 
                    onClick={() => handleOpenModal(null)}
                >
                    {t('class.timeslot.add')}
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
                title={editingSlot ? t('class.timeslot.edit') : t('class.timeslot.addNew')}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                width={600}
                // destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        label={t('class.timeslot.slotName')}
                        name="name"
                        rules={[{ required: true, message: t('class.timeslot.pleaseEnterName') }]}
                    >
                        <Input placeholder={t('class.timeslot.slotNamePlaceholder')} />
                    </Form.Item>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={t('class.timeslot.startTime')}
                            name="startTime"
                            rules={[{ required: true, message: t('class.timeslot.required') }]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label={t('class.timeslot.endTime')}
                            name="endTime"
                            dependencies={['startTime']}
                            rules={[
                                { required: true, message: t('class.timeslot.required') },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t('class.timeslot.endAfterStart')));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={t('class.timeslot.building')}
                            name="locationBuilding"
                            rules={[{ required: true, message: t('class.timeslot.required') }]}
                        >
                            <Input placeholder={t('class.timeslot.buildingPlaceholder')} />
                        </Form.Item>
                        <Form.Item
                            label={t('class.timeslot.room')}
                            name="locationRoom"
                            rules={[{ required: true, message: t('class.timeslot.required') }]}
                        >
                            <Input placeholder={t('class.timeslot.roomPlaceholder')} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={t('class.timeslot.locationDetail')}
                        name="locationDetail"
                        rules={[{ required: true, message: t('class.timeslot.required') }]}
                    >
                        <Input.TextArea rows={2} placeholder={t('class.timeslot.locationDetailPlaceholder')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}