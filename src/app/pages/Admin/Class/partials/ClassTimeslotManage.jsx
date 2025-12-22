import { App, Button, DatePicker, Form, Input, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';
import { Edit, Plus, Calendar, MapPin, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTimeslot, getInstructorClassTimeslots, updateTimeslot } from '../../../../apis/TimeSlot/TimeSlot';

export default function ClassTimeslotManage({ classItem, onTimeSlotsChange, readOnly }) {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [timeslots, setTimeslots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [form] = Form.useForm();

    // Watch startTime to update endTime constraints in real-time
    const startTime = Form.useWatch('startTime', form);

    useEffect(() => {
        if (onTimeSlotsChange) {
            onTimeSlotsChange(timeslots.length > 0);
        }
    }, [timeslots, onTimeSlotsChange]);

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
            // Set Default Values for New Slot
            form.setFieldsValue({
                locationBuilding: 'Trung Tâm Dạy Xe Cẩu Quận 9',
                locationRoom: 'P.218',
                locationDetail: '487A Đ. Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh, Vietnam'
            });
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

    // --- Constraints Logic ---

    // 1. Start Time Date Constraints
    const disabledStartDate = (current) => {
        if (!classItem?.startDate || !classItem?.endDate) return false;
        // Restrict to Class Duration
        return current && (
            current < dayjs(classItem.startDate).startOf('day') || 
            current > dayjs(classItem.endDate).endOf('day')
        );
    };

    // 2. Start Time Time Constraints
    const disabledStartTime = (current) => {
        if (!current || !classItem?.startDate || !classItem?.endDate) return {};
        
        const clsStart = dayjs(classItem.startDate);
        const clsEnd = dayjs(classItem.endDate);
        const isClassStartDay = current.isSame(clsStart, 'day');
        const isClassEndDay = current.isSame(clsEnd, 'day');

        return {
            disabledHours: () => {
                const hours = [];
                if (isClassStartDay) for (let i = 0; i < clsStart.hour(); i++) hours.push(i);
                if (isClassEndDay) for (let i = clsEnd.hour() + 1; i < 24; i++) hours.push(i);
                return hours;
            },
            disabledMinutes: (h) => {
                const minutes = [];
                if (isClassStartDay && h === clsStart.hour()) for (let i = 0; i < clsStart.minute(); i++) minutes.push(i);
                if (isClassEndDay && h === clsEnd.hour()) for (let i = clsEnd.minute() + 1; i < 60; i++) minutes.push(i);
                return minutes;
            }
        };
    };

    // 3. End Time Date Constraints (Dependent on Selected Start Time)
    const disabledEndDate = (current) => {
        // Basic class range check
        if (disabledStartDate(current)) return true;
        
        // Dependency Check: Cannot be before the "Min End Time" day
        if (startTime) {
            const minEndTime = startTime.add(15, 'minute');
            if (current < minEndTime.startOf('day')) return true;
        }
        return false;
    };

    // 4. End Time Time Constraints (Dependent on Selected Start Time + 15m)
    const disabledEndTime = (current) => {
        if (!current) return {};

        // Calculate Boundaries
        const minEnd = startTime ? startTime.add(15, 'minute') : null;
        const clsEnd = classItem?.endDate ? dayjs(classItem.endDate) : null;

        const isMinEndDay = minEnd && current.isSame(minEnd, 'day');
        const isClassEndDay = clsEnd && current.isSame(clsEnd, 'day');

        return {
            disabledHours: () => {
                const hours = [];
                // Block hours before (Start + 15m)
                if (isMinEndDay) {
                    for (let i = 0; i < minEnd.hour(); i++) hours.push(i);
                }
                // Block hours after Class End
                if (isClassEndDay) {
                    for (let i = clsEnd.hour() + 1; i < 24; i++) hours.push(i);
                }
                return hours;
            },
            disabledMinutes: (h) => {
                const minutes = [];
                // Block minutes before (Start + 15m)
                if (isMinEndDay && h === minEnd.hour()) {
                    for (let i = 0; i < minEnd.minute(); i++) minutes.push(i);
                }
                // Block minutes after Class End
                if (isClassEndDay && h === clsEnd.hour()) {
                    for (let i = clsEnd.minute() + 1; i < 60; i++) minutes.push(i);
                }
                return minutes;
            }
        };
    };
    


    // --- Columns Definition (Respects readOnly) ---
    const getColumns = () => {
        const cols = [
            {
                title: t('common.name') || 'NAME',
                dataIndex: 'name',
                key: 'name',
                width: 280, // Increased width
                render: (text) => <span className="font-bold text-slate-800">{text}</span>
            },
            {
                title: t('class.timeslot.startTime') || 'START TIME',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (val) => val ? (
                    <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
                        <Calendar size={14} className="text-yellow-600" />
                        <DayTimeFormat value={val} showTime={true} />
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
                        <DayTimeFormat value={val} showTime={true} />
                    </div>
                ) : '-',
                width: 180,
            },
            {
                title: t('class.timeslot.location') || 'LOCATION',
                key: 'location',
                render: (_, record) => (
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-neutral-400 shrink-0" />
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-xs">
                            {record.locationRoom}
                        </span>
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
            }
        ];

        // ONLY add the action/edit column if readOnly is FALSE
        if (!readOnly) {
            cols.push({
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
            });
        }

        return cols;
    };

    return (
        <div className="">
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
                
                /* Improved Rounded Modal Styles */
                .rounded-modal .ant-modal-content {
                    border-radius: 16px !important;
                    padding: 0 !important; /* Full bleed */
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    overflow: hidden;
                }
                .rounded-modal .ant-modal-header {
                    background: #facc15 !important;
                    padding: 24px 24px 20px !important;
                    border-bottom: 1px solid #eab308;
                    border-radius: 0 !important; /* Managed by content overflow */
                    margin-bottom: 0 !important;
                }
                .rounded-modal .ant-modal-title {
                    font-weight: 800 !important;
                    font-size: 18px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #000 !important;
                }
                .rounded-modal .ant-modal-body {
                    padding: 32px 32px 24px !important;
                }
                .rounded-modal .ant-modal-footer {
                    margin: 0 !important;
                    padding: 16px 32px 24px !important;
                    border-top: 1px solid #f1f5f9;
                    background: #fafaf9;
                }
                .rounded-modal .ant-modal-close {
                    top: 24px;
                    right: 24px;
                    color: rgba(0,0,0,0.5);
                }
                .rounded-modal .ant-modal-close:hover {
                    color: #000;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                }
                
                /* Input Styles */
                .rounded-modal .ant-form-item-label > label {
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    color: #64748b !important;
                }
                .rounded-modal .ant-input, 
                .rounded-modal .ant-picker,
                .rounded-modal .ant-input-textarea {
                    border-radius: 8px !important;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 8px 12px;
                    transition: all 0.2s;
                }
                .rounded-modal .ant-input:hover, 
                .rounded-modal .ant-picker:hover,
                .rounded-modal .ant-input-textarea:hover {
                    background-color: #fff;
                    border-color: #cbd5e1;
                }
                .rounded-modal .ant-input:focus, 
                .rounded-modal .ant-picker-focused,
                .rounded-modal .ant-input-textarea:focus {
                    background-color: #fff;
                    border-color: #facc15 !important;
                    box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.15) !important;
                }
                /* Force Button Style Overrides */
                .ant-btn.bg-yellow-400 {
                    background-color: #facc15 !important;
                    color: #000 !important;
                    border-color: #eab308 !important;
                }
                .ant-btn.bg-yellow-400:hover {
                    background-color: #fbbf24 !important;
                    color: #000 !important;
                    border-color: #d97706 !important;
                }
            `}</style>

            <div className="flex justify-between items-end mb-4  pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
                        <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold uppercase tracking-wide text-slate-900">{t('class.timeslot.title')}</span>
                </div>
                
                {/* Hide Add button if readOnly is true */}
                {!readOnly && (
                    <Button
                        icon={<Plus size={16} strokeWidth={3} />}
                        onClick={() => handleOpenModal(null)}
                        className="bg-yellow-400 text-black border border-yellow-500 font-bold h-10 px-6 rounded-md hover:bg-yellow-500 hover:text-black shadow-sm transition-all"
                        style={{ backgroundColor: '#facc15', color: '#000', borderColor: '#eab308' }}
                    >
                        {t('class.timeslot.add')}
                    </Button>
                )}
            </div>

            <Table
                rowKey="id"
                columns={getColumns()}
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
                width={650}
                className="rounded-modal"
                centered
                okButtonProps={{
                    className: "bg-black text-white rounded-lg border-none font-bold hover:bg-slate-800 h-10 px-8 shadow-sm transition-all"
                }}
                cancelButtonProps={{
                    className: "rounded-lg border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50 h-10 px-6 transition-all"
                }}
                maskStyle={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }}
            >
                <div className="mt-2">
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Form.Item
                            label={t('class.timeslot.slotName')}
                            name="name"
                            rules={[{ required: true, message: t('class.timeslot.pleaseEnterName') }]}
                            className="mb-5"
                        >
                            <Input placeholder="e.g. Session 1: Safety Introduction" className="h-11 font-medium text-slate-700" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-5">
                            <Form.Item
                                label={t('class.timeslot.startTime')}
                                name="startTime"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                                className="mb-5"
                            >
                                <DatePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                    className="h-11 w-full font-medium"
                                    placeholder="Select start time"
                                    popupClassName="rounded-lg"
                                    disabledDate={disabledStartDate}
                                    disabledTime={disabledStartTime}
                                />
                            </Form.Item>
                            <Form.Item
                                label={t('class.timeslot.endTime')}
                                name="endTime"
                                dependencies={['startTime']}
                                rules={[
                                    { required: true, message: t('class.timeslot.required') },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const start = getFieldValue('startTime');
                                            // 1. Basic check
                                            if (!value || !start) {
                                                return Promise.resolve();
                                            }
                                            // 2. Strict check: End time must be at least 15 minutes AFTER start time
                                            if (value.isBefore(start.add(15, 'minute'))) {
                                                return Promise.reject(new Error(t('class.timeslot.minDurationError', 'End time must be at least 15 minutes after start time')));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                                className="mb-5"
                            >
                                <DatePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                    className="h-11 w-full font-medium"
                                    placeholder="Select end time"
                                    popupClassName="rounded-lg"
                                    disabledDate={disabledEndDate}
                                    disabledTime={disabledEndTime}
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <Form.Item
                                label={t('class.timeslot.building')}
                                name="locationBuilding"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                                className="mb-5"
                            >
                                <Input placeholder="e.g. Building A" className="h-11 font-medium" />
                            </Form.Item>
                            <Form.Item
                                label={t('class.timeslot.room')}
                                name="locationRoom"
                                rules={[{ required: true, message: t('class.timeslot.required') }]}
                                className="mb-5"
                            >
                                <Input placeholder="e.g. Room 101" className="h-11 font-medium" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={t('class.timeslot.locationDetail')}
                            name="locationDetail"
                            rules={[{ required: true, message: t('class.timeslot.required') }]}
                            className="mb-0"
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Detailed navigation instructions or notes..."
                                className="font-medium resize-none leading-relaxed"
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}