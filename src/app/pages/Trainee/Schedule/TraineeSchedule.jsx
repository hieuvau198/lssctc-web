import { App, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTraineeWeeklySchedule } from '../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../mocks/instructorSchedule';
import ScheduleGrid from '../../Instructor/InstructorSchedule/partials/ScheduleGrid';
import PageNav from '../../../components/PageNav/PageNav';

export default function TraineeSchedule() {
    const navigate = useNavigate();
    const { message } = App.useApp();

    // State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);

    // Calculate Monday of current week (ISO-style: Monday is the first day)
    const getMondayOfWeek = (date = new Date()) => {
        const d = new Date(date);
        const isoDayIndex = (d.getDay() + 6) % 7;
        const monday = new Date(d);
        monday.setDate(d.getDate() - isoDayIndex);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfWeek());

    // Fetch schedule data from API
    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);

            try {
                const pad = (n) => String(n).padStart(2, '0');
                const thursday = new Date(currentWeekStart);
                thursday.setDate(currentWeekStart.getDate() + 3);
                const weekRef = `${thursday.getFullYear()}-${pad(thursday.getMonth() + 1)}-${pad(thursday.getDate())}`;
                const data = await getTraineeWeeklySchedule({ dateInWeek: weekRef });
                setScheduleData(data || []);
            } catch (err) {
                setError(err.message || 'Failed to load schedule');
                message.error('Không thể tải lịch học. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [currentWeekStart, message]);

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

        scheduleData.forEach(item => {
            try {
                const itemDate = new Date(item.startTime);
                const itemDateStr = itemDate.toISOString().split('T')[0];

                const day = weekDays.find(d => {
                    const date = new Date(currentWeekStart);
                    const idx = weekDays.indexOf(d);
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
                        room: item.locationRoom ?? item.locationRoom ?? item.room ?? null,
                        raw: item,
                    };

                    if (!grid[matchedSlotId][dayKey]) {
                        grid[matchedSlotId][dayKey] = mapped;
                    } else {
                        const existing = grid[matchedSlotId][dayKey];
                        if (Array.isArray(existing)) {
                            existing.push(mapped);
                        } else {
                            grid[matchedSlotId][dayKey] = [existing, mapped];
                        }
                    }
                }
            } catch (e) {
                // ignore parsing errors
            }
        });

        return grid;
    }, [scheduleData, currentWeekStart]);

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

    const handleClassClick = (classId) => {
        if (classId) {
            navigate(`/my-classes/${classId}`);
        }
    };

    // Format week range for display
    const weekEndDate = new Date(currentWeekStart);
    weekEndDate.setDate(currentWeekStart.getDate() + 6);
    const formatDate = (d) => `${d.getDate()}/${d.getMonth() + 1}`;
    const weekRangeText = `${formatDate(currentWeekStart)} - ${formatDate(weekEndDate)}`;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Industrial Style */}
            <section className="relative bg-black text-white py-12 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/crane-background.jpg";
                        }}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative max-w-7xl mx-auto px-6">
                    <PageNav
                        nameMap={{ 'schedule': 'Lịch học' }}
                        className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
                    />

                    <div className="mb-4 flex items-center gap-4">
                        <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            LSSCTC ACADEMY
                        </span>
                        <span className="h-1 w-1 rounded-full bg-yellow-400" />
                        <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
                            Lịch học
                        </span>
                    </div>

                    <span className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
                        Lịch học của bạn
                    </span>

                    <p className="text-lg text-white max-w-2xl leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        Xem lịch học hàng tuần và quản lý thời gian học tập hiệu quả
                    </p>
                </div>
            </section>

            {/* Week Navigation - Industrial Style */}
            <section className="bg-neutral-50 border-y border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <span className="text-2xl font-black uppercase tracking-tight text-neutral-900">
                                    Tuần {weekRangeText}
                                </span>
                                <p className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">
                                    {currentWeekStart.getFullYear()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreviousWeek}
                                className="w-10 h-10 border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleToday}
                                className="px-4 h-10 border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 font-bold uppercase tracking-wider text-sm transition-all"
                            >
                                Hôm nay
                            </button>
                            <button
                                onClick={handleNextWeek}
                                className="w-10 h-10 border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule Grid */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <ScheduleGrid
                        timeSlots={mockTimeSlots}
                        weekDates={weekDates}
                        scheduleGrid={scheduleGrid}
                        onClassClick={handleClassClick}
                    />
                </div>
            </section>
        </div>
    );
}
