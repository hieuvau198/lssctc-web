import { App, Button, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addCourseToProgram, fetchCourses } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';
import { fetchCoursesByProgram } from '../../../../apis/ProgramManager/CourseApi';

const AssignCourse = ({ program, onAssigned }) => {
    const { t } = useTranslation();
    const {message} = App.useApp();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);

    // load available courses when entering editing mode
    useEffect(() => {
        if (!program || !editing) return;
        setLoadingCourses(true);
        
        // Fetch both all courses and assigned courses in parallel
        Promise.all([
            fetchCourses({ pageNumber: 1, pageSize: 1000 }),
            fetchCoursesByProgram(program.id)
        ])
            .then(([allCoursesData, assignedCoursesData]) => {
                const allCourses = allCoursesData.items || [];
                const assignedCourses = assignedCoursesData.items || [];
                
                setCourses(allCourses);
                
                // Create set of assigned course IDs
                const assignedIds = new Set(assignedCourses.map((c) => c.id));
                
                // Filter out assigned courses
                const avail = allCourses.filter((course) => !assignedIds.has(course.id));
                
                if (!avail || avail.length === 0) {
                    // no available courses: inform user and close editing mode
                    setAvailable([]);
                    message.info(t('admin.programs.assignCourse.allAssigned'));
                    setEditing(false);
                    return;
                }
                setAvailable(avail);
            })
            .catch((err) => {
                console.error('Failed to fetch courses for assign:', err);
                setError(err?.message || 'Failed to load courses');
            })
            .finally(() => setLoadingCourses(false));
    }, [program, editing, message]);

    const handleAssign = async () => {
        if (!selected) return setError(t('admin.programs.assignCourse.selectWarning'));
        setLoading(true);
        setError(null);
        try {
            await addCourseToProgram(program.id, selected);
            message.success(t('admin.programs.assignCourse.assignSuccessSingle'));
            setSelected(null);
            setEditing(false);
            onAssigned?.();
            setAvailable((prev) => prev.filter((c) => c.id !== selected));
        } catch (err) {
            // console.error('Failed to assign course:', err);
            message.error(err?.response?.data || 'Assign failed');
        } finally {
            setLoading(false);
        }
    };

    if (!program) return null;

    return (
        <div className="flex justify-end items-center gap-2">
            {!editing ? (
                <div className="flex justify-end mb-4">
                    <Button type="primary" icon={<Plus size={20} />} onClick={() => { setEditing(true); setError(null); }} size="middle">
                        {t('admin.programs.assignCourse.button')}
                    </Button>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-[350px]">
                        <Select
                            showSearch
                            placeholder={t('admin.programs.assignCourse.selectPlaceholder')}
                            optionFilterProp="children"
                            loading={loadingCourses}
                            allowClear
                            onChange={(val) => setSelected(val)}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            value={selected}
                            style={{ width: '100%' }}
                        >
                            {available.length === 0 && !loadingCourses ? (
                                <Select.Option disabled value="">
                                    {t('admin.programs.assignCourse.noAvailableShort')}
                                </Select.Option>
                            ) : (
                                available.map((c) => (
                                    <Select.Option key={c.id} value={c.id}>
                                        {c.name}
                                    </Select.Option>
                                ))
                            )}
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button type="primary" onClick={handleAssign} loading={loading} size="middle">
                            {t('common.save')}
                        </Button>
                        <Button onClick={() => { setEditing(false); setSelected(null); setError(null); }} size="middle">
                            {t('common.cancel')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignCourse;
