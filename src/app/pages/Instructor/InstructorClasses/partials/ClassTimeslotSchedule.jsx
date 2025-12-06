import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Spin, Empty, Tooltip, Button, Space, App } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getInstructorClassTimeslots } from '../../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../../mocks/instructorSchedule';

/**
 * ClassTimeslotSchedule - Hiển thị lịch lớp học dạng lưới tuần
 * Dùng API GET /api/Timeslots/class/{classId}/instructor-view
 */
export default function ClassTimeslotSchedule({ classId, className }) {
    const { t, i18n } = useTranslation();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const isVietnamese = i18n.language?.startsWith('vi');

    const [loading, setLoading] = useState(false);
    const [timeslots, setTimeslots] = useState([]);
    const [error, setError] = useState(null);

    // Current week state
    const getMondayOfWeek = (date = new Date()) => {
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfWeek());

    // Fetch timeslots for this class
    useEffect(() => {
        if (!classId) return;

        const fetchTimeslots = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getInstructorClassTimeslots(classId);
                setTimeslots(data || []);
            } catch (err) {
                setError(err.message || 'Failed to load timeslots');
                message.error('Không thể tải lịch lớp học.');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeslots();
    }, [classId, message]);

    // Get dates for the current week
    const weekDates = useMemo(() => {
        return weekDays.map((day, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + index);
            return {
                ...day,
                date,
                dateStr: date.toISOString().split('T')[0],
                dayNum: date.getDate(),
                monthNum: date.getMonth() + 1,
            };
        });
    }, [currentWeekStart]);

    // Build schedule grid from API data
    const scheduleGrid = useMemo(() => {
        const grid = {};

        // Initialize empty grid
        mockTimeSlots.forEach(slot => {
            grid[slot.id] = {};
            weekDays.forEach(day => {
                grid[slot.id][day.key] = null;
            });
        });

        // Helper: convert HH:MM -> minutes
        const timeToMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        // Helper: get minutes from ISO datetime
        const isoToMinutes = (iso) => {
            const d = new Date(iso);
            return d.getHours() * 60 + d.getMinutes();
        };

        // Map each API item into grid
        timeslots.forEach(item => {
            try {
                const itemDate = new Date(item.startTime);
                const itemDateStr = itemDate.toISOString().split('T')[0];

                // find day key in this week
                const day = weekDays.find((d, idx) => {
                    const date = new Date(currentWeekStart);
                    date.setDate(currentWeekStart.getDate() + idx);
                    return date.toISOString().split('T')[0] === itemDateStr;
                });

                if (!day) return; // item not in this week

                const dayKey = day.key;
                const itemStartMin = isoToMinutes(item.startTime);
                const itemEndMin = item.endTime ? isoToMinutes(item.endTime) : itemStartMin + 60;

                // Find first slot that overlaps with the item's time range
                let matchedSlotId = null;
                for (const slot of mockTimeSlots) {
                    const slotStartMin = timeToMinutes(slot.startTime);
                    const slotEndMin = timeToMinutes(slot.endTime);
                    const overlaps = itemStartMin < slotEndMin && itemEndMin > slotStartMin;
                    if (overlaps) {
                        matchedSlotId = slot.id;
                        break;
                    }
                }

                // Fallback: match nearest slot by start time
                if (!matchedSlotId) {
                    let best = null;
                    let bestDiff = Infinity;
                    for (const slot of mockTimeSlots) {
                        const slotStartMin = timeToMinutes(slot.startTime);
                        const diff = Math.abs(itemStartMin - slotStartMin);
                        if (diff < bestDiff) {
                            bestDiff = diff;
                            best = slot.id;
                        }
                    }
                    matchedSlotId = best;
                }

                if (matchedSlotId && grid[matchedSlotId]) {
                    // normalize mapped item fields for UI
                    const mapped = {
                        ...item,
                        classCode: item.classCode ?? item.name ?? item.className,
                        room: item.locationRoom ?? item.locationBuilding ?? item.locationDetail ?? null,
                        raw: item,
                    };

                    if (!grid[matchedSlotId][dayKey]) {
                        grid[matchedSlotId][dayKey] = mapped;
                    }
                }
            } catch {
                // ignore parsing errors
            }
        });

        return grid;
    }, [timeslots, currentWeekStart]);

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Navigation handlers
    const handlePreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    const handleToday = () => {
        setCurrentWeekStart(getMondayOfWeek());
    };

    // Format week range for display
    const getWeekRangeText = () => {
        const endDate = new Date(currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        const startStr = `${currentWeekStart.getDate()}/${currentWeekStart.getMonth() + 1}`;
        const endStr = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
        return `${startStr} - ${endStr}`;
    };

    // Get status info
    const getStatusInfo = (status) => {
        const statusMap = {
            'NotStarted': { color: 'default', label: 'Chưa bắt đầu' },
            'Ongoing': { color: 'processing', label: 'Đang diễn ra' },
            'Completed': { color: 'success', label: 'Hoàn thành' },
            'Cancelled': { color: 'error', label: 'Đã hủy' },
        };
        return statusMap[status] || { color: 'default', label: status || '-' };
    };

    // Build columns for Table
    const columns = useMemo(() => {
        const cols = [
            {
                title: (
                    <div className="flex items-center gap-1">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span className="text-xs font-medium">{t('instructor.schedule.slot') || 'Slot'}</span>
                    </div>
                ),
                dataIndex: 'slot',
                key: 'slot',
                width: '100px',
                fixed: 'left',
                render: (slot) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-xs">{slot.name}</span>
                        <span className="text-xs text-gray-500">
                            {slot.startTime} - {slot.endTime}
                        </span>
                    </div>
                ),
            },
        ];

        // Add columns for each day of week
        weekDates.forEach((day) => {
            cols.push({
                title: (
                    <div className="flex flex-col items-center">
                        <span className={`text-xs font-medium ${isToday(day.date) ? 'text-blue-600' : 'text-gray-600'}`}>
                            {isVietnamese ? day.label : day.labelEn}
                        </span>
                        <span className={`text-sm font-bold ${isToday(day.date) ? 'text-blue-600' : 'text-gray-800'}`}>
                            {day.dayNum}/{day.monthNum}
                        </span>
                        {isToday(day.date) && (
                            <Tag color="blue" className="text-xs">
                                {t('instructor.schedule.today') || 'Hôm nay'}
                            </Tag>
                        )}
                    </div>
                ),
                dataIndex: day.key,
                key: day.key,
                ellipsis: true,
                align: 'center',
                className: isToday(day.date) ? 'bg-blue-50' : '',
                render: (scheduleItem, record) => {
                    if (!scheduleItem) {
                        return (
                            <div className="h-12 flex items-center justify-center">
                                <span className="text-gray-300">-</span>
                            </div>
                        );
                    }
                    const statusInfo = getStatusInfo(scheduleItem.status);

                    // Handle click to navigate to attendance page
                    const handleSlotClick = () => {
                        if (!scheduleItem.raw?.timeslotId && !scheduleItem.raw?.id) {
                            message.warning('Không tìm thấy thông tin buổi học.');
                            return;
                        }
                        const timeslotId = scheduleItem.raw?.timeslotId || scheduleItem.raw?.id;
                        const dateStr = day.dateStr;
                        const startTime = scheduleItem.raw?.startTime
                            ? new Date(scheduleItem.raw.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : record.slot?.startTime || '';
                        const endTime = scheduleItem.raw?.endTime
                            ? new Date(scheduleItem.raw.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : record.slot?.endTime || '';

                        const params = new URLSearchParams({
                            className: className || scheduleItem.name || '',
                            date: dateStr,
                            startTime,
                            endTime,
                            room: scheduleItem.room || '',
                        });

                        navigate(`/instructor/classes/${classId}/attendance/${timeslotId}?${params.toString()}`);
                    };

                    return (
                        <Tooltip
                            title={
                                <div>
                                    <p><strong>{scheduleItem.name}</strong></p>
                                    <p>{t('instructor.schedule.room') || 'Phòng'}: {scheduleItem.room || '-'}</p>
                                    <p className="text-xs mt-1 text-blue-200">{t('attendance.clickToMark', 'Nhấn để điểm danh')}</p>
                                </div>
                            }
                        >
                            <Card
                                size="small"
                                className="cursor-pointer hover:shadow-md hover:border-blue-400 transition-all"
                                onClick={handleSlotClick}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-blue-600 text-xs truncate">
                                        {scheduleItem.name}
                                    </span>
                                    <Tag color={statusInfo.color} className="w-fit text-xs">
                                        {statusInfo.label}
                                    </Tag>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <EnvironmentOutlined style={{ fontSize: '10px' }} />
                                        <span className="truncate">{scheduleItem.room}</span>
                                    </div>
                                </div>
                            </Card>
                        </Tooltip>
                    );
                },
            });
        });

        return cols;
    }, [weekDates, isVietnamese, t, classId, className, message, navigate]);

    // Build data source for Table
    const dataSource = useMemo(() => {
        return mockTimeSlots.map((slot) => {
            const row = {
                key: slot.id,
                slot,
            };
            weekDays.forEach((day) => {
                row[day.key] = scheduleGrid[slot.id]?.[day.key] || null;
            });
            return row;
        });
    }, [scheduleGrid]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spin size="large" tip="Đang tải lịch lớp học..." />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="shadow-sm">
                <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
        );
    }

    return (
        <div className="w-full">
            {/* Header with week navigation */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <CalendarOutlined className="text-2xl text-blue-600" />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800">
                            {t('attendance.classSchedule') || 'Lịch lớp học'}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {t('instructor.schedule.week') || 'Tuần'}: {getWeekRangeText()}
                        </span>
                    </div>
                </div>

                <Space size="small">
                    <Button icon={<LeftOutlined />} onClick={handlePreviousWeek} />
                    <Button onClick={handleToday} type="primary">
                        {t('instructor.schedule.today') || 'Hôm nay'}
                    </Button>
                    <Button icon={<RightOutlined />} onClick={handleNextWeek} />
                </Space>
            </div>

            {/* Status Legend */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">{t('instructor.schedule.legend') || 'Chú thích'}:</span>
                <Tag color="default">Chưa bắt đầu</Tag>
                <Tag color="processing">Đang diễn ra</Tag>
                <Tag color="success">Hoàn thành</Tag>
                <Tag color="error">Đã hủy</Tag>
            </div>

            {/* Schedule Grid */}
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                scroll={{ x: false }}
                size="small"
                className="schedule-table"
                tableLayout="fixed"
                locale={{
                    emptyText: (
                        <Empty
                            description="Chưa có lịch học nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
            />
        </div>
    );
}
