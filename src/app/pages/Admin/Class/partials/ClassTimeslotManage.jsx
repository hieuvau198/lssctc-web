import { App, Button, DatePicker, Form, Input, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { Edit, Plus, Calendar, MapPin, Clock } from 'lucide-react';
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
            title: t('common.name') || 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-bold text-slate-800">{text}</span>
        },
        {
            title: t('class.timeslot.startTime') || 'START TIME',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (val) => val ? (
                <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
                    <Calendar size={14} className="text-yellow-600" />
                    {dayjs(val).format('YYYY-MM-DD HH:mm')}
                </div>
            ) : '-',
            width: 180,
        },
        {
            title: t('class.timeslot.endTime') || 'END TIME',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (val) => val ? (
                <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
                    <Clock size={14} className="text-yellow-600" />
                    {dayjs(val).format('YYYY-MM-DD HH:mm')}
                </div>
            ) : '-',
            width: 180,
        },
        {
            title: t('class.timeslot.location') || 'LOCATION',
            key: 'location',
            render: (_, record) => (
                <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-neutral-400 mt-1 shrink-0" />
                    <div>
                        <div className="font-bold text-slate-800 uppercase tracking-wide text-xs">{record.locationRoom} - {record.locationBuilding}</div>
                        <div className="text-xs text-slate-500">{record.locationDetail}</div>
                    </div>
                </div>
            ),
        },
        {
            title: t('common.status') || 'STATUS',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <span className="inline-flex items-center px-2 py-0.5 border border-slate-300 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">
                    {status || t('class.timeslot.scheduled')}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 100,
            align: 'right',
            render: (_, record) => (
                <Button
                    type="text"
                    size="small"
                    icon={<Edit size={16} />}
                    className="text-slate-400 hover:text-black hover:bg-yellow-400 rounded-none transition-colors"
                    onClick={() => handleOpenModal(record)}
                />
            ),
        }
    ];

    return (
        <div className="mt-12">
            <style>{`
                .industrial-table .ant-table-thead > tr > th {
                    background: #000 !important;
                    color: #fff !important;
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 12px;
                    letter-spacing: 0.05em;
                    border-radius: 0 !important;
                    padding: 12px 16px;
                }
                .industrial-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #e5e5e5;
                    padding: 16px;
                }
                .industrial-table .ant-table-container {
                    border: 2px solid #000;
                    border-radius: 0;
                }
                .industrial-modal .ant-modal-content {
                    border: 2px solid #000 !important;
                    border-radius: 0 !important;
                    padding: 0;
                }
                .industrial-modal .ant-modal-header {
                    border-bottom: 2px solid #000;
                    margin-bottom: 0;
                    padding: 16px 24px;
                    background: #facc15;
                }
                .industrial-modal .ant-modal-title {
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .industrial-input .ant-input,
                .industrial-input .ant-picker, 
                .industrial-input .ant-input-textarea {
                    border-radius: 0;
                    border: 2px solid #e5e5e5;
                }
                .industrial-input .ant-input:focus,
                .industrial-input .ant-picker-focused,
                .industrial-input .ant-input-textarea:focus {
                    border-color: #facc15 !important;
                    box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.2);
                }
            `}</style>

            <div className="flex justify-between items-end mb-4 border-b-2 border-slate-200 pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
                        <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold uppercase tracking-wide text-slate-900">{t('class.timeslot.title')}</span>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={16} strokeWidth={3} />}
                    onClick={() => handleOpenModal(null)}
                    className="bg-yellow-400 text-black border-2 border-black font-bold h-10 px-6 rounded-none hover:bg-yellow-500 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
                locale={{ emptyText: <div className="py-8 font-mono text-slate-400 uppercase">No timeslots scheduled</div> }}
                className="industrial-table"
            />

            <Modal
                title={editingSlot ? t('class.timeslot.edit') : t('class.timeslot.addNew')}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                width={600}
                className="industrial-modal"
                okButtonProps={{
                    className: "bg-black text-white rounded-none border-none font-bold hover:bg-slate-800 h-9 px-6"
                }}
                cancelButtonProps={{
                    className: "rounded-none border-2 border-slate-300 text-slate-600 font-bold hover:border-black hover:text-black h-9 px-6"
                }}
            >
                <div className="p-6">
                    <Form form={form} layout="vertical" onFinish={handleSave} className="industrial-input">
                        <Form.Item
                            label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.slotName')}</span>}
                            name="name"
                            rules={[{ required: true, message: t('class.timeslot.pleaseEnterName') }]}
                        >
                            <Input placeholder={t('class.timeslot.slotNamePlaceholder')} />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.startTime')}</span>}
                                name="startTime"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.endTime')}</span>}
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
                                label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.building')}</span>}
                                name="locationBuilding"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                            >
                                <Input placeholder={t('class.timeslot.buildingPlaceholder')} />
                            </Form.Item>
                            <Form.Item
                                label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.room')}</span>}
                                name="locationRoom"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                            >
                                <Input placeholder={t('class.timeslot.roomPlaceholder')} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={<span className="font-bold uppercase text-xs tracking-wider">{t('class.timeslot.locationDetail')}</span>}
                            name="locationDetail"
                            rules={[{ required: true, message: t('class.timeslot.required') }]}
                        >
                            <Input.TextArea rows={2} placeholder={t('class.timeslot.locationDetailPlaceholder')} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}