import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spin, Alert, App } from 'antd';
import { mockTimeSlots, weekDays } from '../../../mocks/instructorSchedule';
import { getInstructorWeeklySchedule } from '../../../apis/TimeSlot/TimeSlot';
import WeekNavigation from './partials/WeekNavigation';
import ScheduleGrid from './partials/ScheduleGrid';
import StatusLegend from './partials/StatusLegend';
import './InstructorSchedule.css';

export default function InstructorSchedule() {
    const navigate = useNavigate();
    const { message } = App.useApp();

    // State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scheduleData, setScheduleData] = useState([]);

    // Calculate Monday of current week
    const getMondayOfWeek = (date = new Date()) => {
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
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
                const weekStart = currentWeekStart.toISOString().split('T')[0];
                const data = await getInstructorWeeklySchedule({ weekStart });
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

    // Handle class click - navigate to class detail
    const handleClassClick = (classId) => {
        navigate(`/instructor/classes/${classId}`);
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
        <div className="p-2 w-full">
            {/* Header & Navigation */}
            <WeekNavigation
                currentWeekStart={currentWeekStart}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
                onWeekChange={handleWeekChange}
            />

            {/* Error Alert */}
            {/* {error && (
                <Alert
                    type="error"
                    message="Lỗi tải lịch học"
                    description={error}
                    closable
                    onClose={() => setError(null)}
                    className="mb-4"
                />
            )} */}


            {/* Schedule Grid */}
            <ScheduleGrid
                timeSlots={mockTimeSlots}
                weekDates={weekDates}
                scheduleGrid={scheduleGrid}
                onClassClick={handleClassClick}
            />
            
            {/* Status Legend */}
            {/* <StatusLegend /> */}
        </div>
    );
}
