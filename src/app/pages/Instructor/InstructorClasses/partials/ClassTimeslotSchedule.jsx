import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tooltip, Spin, Empty, App } from 'antd';
import { Clock, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstructorClassTimeslots } from '../../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../../mocks/instructorSchedule';

/**
 * ClassTimeslotSchedule - Light Wire Theme
 */
export default function ClassTimeslotSchedule({ classId, className }) {
    const { t, i18n } = useTranslation();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const isVietnamese = i18n.language?.startsWith('vi');

    const [loading, setLoading] = useState(false);
    const [timeslots, setTimeslots] = useState([]);
    const [error, setError] = useState(null);

    const getMondayOfWeek = (date = new Date()) => {
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfWeek());

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

    const scheduleGrid = useMemo(() => {
        const grid = {};
        mockTimeSlots.forEach(slot => {
            grid[slot.id] = {};
            weekDays.forEach(day => {
                grid[slot.id][day.key] = null;
            });
        });

        const timeToMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const isoToMinutes = (iso) => {
            const d = new Date(iso);
            return d.getHours() * 60 + d.getMinutes();
        };

        timeslots.forEach(item => {
            try {
                const itemDate = new Date(item.startTime);
                const itemDateStr = itemDate.toISOString().split('T')[0];

                const day = weekDays.find((d, idx) => {
                    const date = new Date(currentWeekStart);
                    date.setDate(currentWeekStart.getDate() + idx);
                    return date.toISOString().split('T')[0] === itemDateStr;
                });

                if (!day) return;

                const dayKey = day.key;
                const itemStartMin = isoToMinutes(item.startTime);
                const itemEndMin = item.endTime ? isoToMinutes(item.endTime) : itemStartMin + 60;

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

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

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

    const getWeekRangeText = () => {
        const endDate = new Date(currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        const startStr = `${currentWeekStart.getDate()}/${currentWeekStart.getMonth() + 1}`;
        const endStr = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
        return `${startStr} - ${endStr}`;
    };

    // Status styling for Light Wire theme
    const getStatusStyle = (status) => {
        const statusMap = {
            'NotStarted': { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300', label: 'Chưa bắt đầu' },
            'Ongoing': { bg: 'bg-yellow-400', text: 'text-black', border: 'border-black', label: 'Đang diễn ra' },
            'Completed': { bg: 'bg-black', text: 'text-yellow-400', border: 'border-black', label: 'Hoàn thành' },
            'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400', label: 'Đã hủy' },
        };
        return statusMap[status] || { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300', label: status || '-' };
    };

    const columns = useMemo(() => {
        const cols = [
            {
                title: (
                    <div className="flex items-center gap-2 py-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-black uppercase">{t('instructor.schedule.slot') || 'Slot'}</span>
                    </div>
                ),
                dataIndex: 'slot',
                key: 'slot',
                width: '100px',
                fixed: 'left',
                render: (slot) => (
                    <div className="flex flex-col p-2 bg-neutral-50">
                        <span className="font-black text-black text-xs uppercase">{slot.name}</span>
                        <span className="text-xs text-neutral-500 font-medium">
                            {slot.startTime} - {slot.endTime}
                        </span>
                    </div>
                ),
            },
        ];

        weekDates.forEach((day) => {
            const isTodayColumn = isToday(day.date);
            cols.push({
                title: (
                    <div className={`flex flex-col items-center py-2 ${isTodayColumn ? 'bg-yellow-400' : ''}`}>
                        <span className={`text-xs font-bold uppercase ${isTodayColumn ? 'text-black' : 'text-neutral-500'}`}>
                            {isVietnamese ? day.label : day.labelEn}
                        </span>
                        <span className={`text-sm font-black ${isTodayColumn ? 'text-black' : 'text-neutral-800'}`}>
                            {day.dayNum}/{day.monthNum}
                        </span>
                        {isTodayColumn && (
                            <span className="px-2 py-0.5 bg-black text-yellow-400 text-xs font-bold uppercase mt-1">
                                {t('instructor.schedule.today') || 'Today'}
                            </span>
                        )}
                    </div>
                ),
                dataIndex: day.key,
                key: day.key,
                ellipsis: true,
                align: 'center',
                className: isTodayColumn ? 'bg-yellow-50' : '',
                render: (scheduleItem, record) => {
                    if (!scheduleItem) {
                        return (
                            <div className="h-16 flex items-center justify-center">
                                <span className="w-8 h-0.5 bg-neutral-200"></span>
                            </div>
                        );
                    }
                    const statusStyle = getStatusStyle(scheduleItem.status);

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
                                <div className="p-1">
                                    <p className="font-bold text-white">{scheduleItem.name}</p>
                                    <p className="text-neutral-300">{t('instructor.schedule.room') || 'Room'}: {scheduleItem.room || '-'}</p>
                                    <p className="text-xs mt-1 text-yellow-400">{t('attendance.clickToMark', 'Click to mark attendance')}</p>
                                </div>
                            }
                            color="#171717"
                        >
                            <div
                                onClick={handleSlotClick}
                                className="cursor-pointer p-2 border-2 border-neutral-200 hover:border-yellow-400 bg-white transition-all"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-black text-xs truncate">
                                        {scheduleItem.name}
                                    </span>
                                    <span className={`px-1 py-0.5 text-xs font-bold uppercase border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} w-fit`}>
                                        {statusStyle.label}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <MapPin className="w-3 h-3 text-yellow-600" />
                                        <span className="truncate">{scheduleItem.room || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </Tooltip>
                    );
                },
            });
        });

        return cols;
    }, [weekDates, isVietnamese, t, classId, className, message, navigate]);

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
            <div className="bg-white border-2 border-black p-12 flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border-2 border-black p-6">
                <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-6" />
                <Empty description={<span className="font-bold text-red-600 uppercase">{error}</span>} />
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-black overflow-hidden">
            <div className="h-1 bg-yellow-400" />

            {/* Header with week navigation */}
            <div className="p-4 border-b-2 border-neutral-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-black uppercase tracking-tight">
                            {t('attendance.classSchedule') || 'Class Schedule'}
                        </span>
                        <span className="text-neutral-500 text-sm font-medium">
                            {t('instructor.schedule.week') || 'Week'}: {getWeekRangeText()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePreviousWeek}
                        className="w-10 h-10 flex items-center justify-center bg-neutral-100 border-2 border-neutral-300 hover:border-yellow-400 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <button
                        onClick={handleToday}
                        className="h-10 px-4 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all"
                    >
                        {t('instructor.schedule.today') || 'Today'}
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="w-10 h-10 flex items-center justify-center bg-neutral-100 border-2 border-neutral-300 hover:border-yellow-400 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>
            </div>

            {/* Status Legend */}
            <div className="p-4 border-b-2 border-neutral-100 flex flex-wrap gap-3 items-center bg-neutral-50">
                <span className="text-sm text-neutral-600 font-bold uppercase">{t('instructor.schedule.legend') || 'Legend'}:</span>
                <span className="px-2 py-1 text-xs font-bold uppercase bg-neutral-100 text-neutral-600 border border-neutral-300">Chưa bắt đầu</span>
                <span className="px-2 py-1 text-xs font-bold uppercase bg-yellow-400 text-black border border-black">Đang diễn ra</span>
                <span className="px-2 py-1 text-xs font-bold uppercase bg-black text-yellow-400 border border-black">Hoàn thành</span>
                <span className="px-2 py-1 text-xs font-bold uppercase bg-red-100 text-red-700 border border-red-400">Đã hủy</span>
            </div>

            {/* Schedule Grid */}
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                scroll={{ x: false }}
                size="small"
                tableLayout="fixed"
                className="[&_.ant-table-thead>tr>th]:bg-neutral-100 [&_.ant-table-thead>tr>th]:border-neutral-300 [&_.ant-table-tbody>tr>td]:border-neutral-200 [&_.ant-table-thead>tr>th]:p-0"
                locale={{
                    emptyText: (
                        <Empty
                            description={<span className="font-bold uppercase text-neutral-500">Chưa có lịch học nào</span>}
                        />
                    ),
                }}
            />
        </div>
    );
}
