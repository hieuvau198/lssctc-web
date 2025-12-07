import { App, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getTraineeWeeklySchedule } from '../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../mocks/instructorSchedule';
import ScheduleGrid from '../../Instructor/InstructorSchedule/partials/ScheduleGrid';
import WeekNavigation from '../../Instructor/InstructorSchedule/partials/WeekNavigation';

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
        // convert JS getDay() -> ISO day index where Monday=0, Sunday=6
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
                // The trainee weekly API expects a single reference date under `dateInWeek` (YYYY-MM-DD).
                // Backend returns entire week (Mon-Sun) containing that date.
                // Use the Monday of the currently selected week as reference.
                // Format date in local timezone to avoid UTC offset issues.
                const pad = (n) => String(n).padStart(2, '0');
                // Use Thursday of the selected week as the reference date (Monday + 3 days)
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
                    // Keep API data as-is (do not translate). Provide some display fallbacks but preserve raw.
                    const mapped = {
                        ...item,
                        // display helpers (no translation) - prefer exact API fields when present
                        classCode: item.classCode ?? item.name ?? item.className,
                        room: item.locationRoom ?? item.locationRoom ?? item.room ?? null,
                        raw: item,
                    };

                    // put item into first free slot for that day
                    if (!grid[matchedSlotId][dayKey]) {
                        grid[matchedSlotId][dayKey] = mapped;
                    } else {
                        // if already occupied, push into array (optional)
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

    // Handle class click - navigate to trainee class detail
    const handleClassClick = (classId) => {
        if (classId) {
            navigate(`/my-classes/${classId}`);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" tip="Đang tải lịch học..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 w-full max-w-7xl mx-auto">
            {/* Header & Navigation */}
            <WeekNavigation
                currentWeekStart={currentWeekStart}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
                onWeekChange={handleWeekChange}
            />

            {/* Schedule Grid */}
            <ScheduleGrid
                timeSlots={mockTimeSlots}
                weekDates={weekDates}
                scheduleGrid={scheduleGrid}
                onClassClick={handleClassClick}
            />
        </div>
    );
}
