import { App, Button, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addCourseToProgram, fetchCourses } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';

const AssignCourse = ({ program, onAssigned }) => {
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
        fetchCourses({ pageNumber: 1, pageSize: 1000 })
            .then((data) => {
                const items = data.items || [];
                setCourses(items);
                const assignedIds = new Set((program?.courses || []).map((c) => c.coursesId || c.id || c.programCourseId));
                const avail = items.filter((it) => !assignedIds.has(it.id));
                if (!avail || avail.length === 0) {
                    // no available courses: inform user and close editing mode
                    setAvailable([]);
                    message.info('All courses are already assigned to this program');
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
    }, [program, editing]);

    const handleAssign = async () => {
        if (!selected) return setError('Please choose a course to assign');
        setLoading(true);
        setError(null);
        try {
            await addCourseToProgram(program.id, selected);
            message.success('Course assigned to program');
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
                        Assign Course
                    </Button>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-[350px]">
                        <Select
                            showSearch
                            placeholder="Select a course"
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
                                    No available courses
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
                            Save
                        </Button>
                        <Button onClick={() => { setEditing(false); setSelected(null); setError(null); }} size="middle">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignCourse;
