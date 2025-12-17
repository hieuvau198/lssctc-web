import { Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar } from 'lucide-react';
import { getInstructorWeeklySchedule } from '../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../mocks/instructorSchedule';
import ScheduleGrid from './partials/ScheduleGrid';
import WeekNavigation from './partials/WeekNavigation';

export default function InstructorSchedule() {
    const navigate = useNavigate();

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
                const dateInWeek = `${thursday.getFullYear()}-${pad(thursday.getMonth() + 1)}-${pad(thursday.getDate())}`;
                const data = await getInstructorWeeklySchedule({ dateInWeek });
                setScheduleData(data || []);

            } catch (err) {
                setError(err.message || 'Failed to load schedule');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [currentWeekStart]);

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

        // Map each API item into grid by finding matching day and overlapping slot
        scheduleData.forEach(item => {
            try {
                const itemDate = new Date(item.startTime);
                const itemDateStr = itemDate.toISOString().split('T')[0];

                // find day key in this week
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

                // Fallback: if no overlap, match nearest slot by start time
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
                // ignore parsing errors for individual items
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

    const handleWeekChange = (newWeekStart) => {
        setCurrentWeekStart(newWeekStart);
    };

    // Handle class click - navigate to class detail
    const handleClassClick = (classId) => {
        navigate(`/instructor/classes/${classId}`);
    };

    // Show loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
                <div className="bg-black border-2 border-black p-6 mb-6">
                    <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-black" />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">Teaching Schedule</span>
                            <p className="text-yellow-400 text-sm mt-1 font-medium">Loading...</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border-2 border-black p-12 flex items-center justify-center">
                    <div className="h-1 bg-yellow-400 absolute top-0 left-0 right-0" />
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
            {/* Navigation Card */}
            <WeekNavigation
                currentWeekStart={currentWeekStart}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
                onWeekChange={handleWeekChange}
            />

            {/* Schedule Grid Card */}
            <ScheduleGrid
                timeSlots={mockTimeSlots}
                weekDates={weekDates}
                scheduleGrid={scheduleGrid}
                onClassClick={handleClassClick}
            />
        </div>
    );
}
