import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Alert, Space, message } from 'antd';
import { fetchCourses } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';
import { updateProgramCourses } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';

const AssignCourse = ({ program, onAssigned }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load all courses when modal opens
    if (!visible) return;
    setLoadingCourses(true);
    fetchCourses({ pageNumber: 1, pageSize: 1000 })
      .then((data) => {
        const items = data.items || [];
        setCourses(items);
        // filter out courses already in program
        const assignedIds = new Set((program?.courses || []).map((c) => c.coursesId || c.id || c.programCourseId));
        const avail = items.filter((it) => !assignedIds.has(it.id));
        setAvailable(avail);
      })
      .catch((err) => {
        console.error('Failed to fetch courses for assign:', err);
        setError(err?.message || 'Failed to load courses');
      })
      .finally(() => setLoadingCourses(false));
  }, [visible, program]);

  const open = () => setVisible(true);
  const close = () => {
    setVisible(false);
    setSelected(null);
    setError(null);
  };

  const handleAssign = async () => {
    if (!selected) return setError('Please choose a course to assign');
    setLoading(true);
    setError(null);
    try {
      // build payload: existing courses + new one
      const existing = (program?.courses || []).map((c, idx) => ({ coursesId: c.coursesId || c.id || c.programCourseId, courseOrder: c.courseOrder || idx + 1 }));
      const nextOrder = existing.length + 1;
      const payload = [...existing, { coursesId: selected, courseOrder: nextOrder }];
      await updateProgramCourses(program.id, payload);
      message.success('Course assigned to program');
      close();
      onAssigned?.();
    } catch (err) {
      console.error('Failed to assign course:', err);
      setError(err?.message || err?.response?.data?.message || 'Assign failed');
    } finally {
      setLoading(false);
    }
  };

  // if no available courses, don't show the Assign button
  const assignedIds = new Set((program?.courses || []).map((c) => c.coursesId || c.id || c.programCourseId));
  const anyAvailable = (courses.length > 0 && courses.some((it) => !assignedIds.has(it.id))) || available.length > 0;

  if (!program) return null;

  return (
    <div className="inline-block">
      {anyAvailable ? (
        <Button type="primary" onClick={open} size="small">
          Assign Course
        </Button>
      ) : null}

      <Modal
        title={`Assign Course to ${program.name}`}
        open={visible}
        onCancel={close}
        onOk={handleAssign}
        okText="Assign"
        confirmLoading={loading}
        destroyOnClose
      >
        {error && <Alert type="error" message={error} className="mb-3" />}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            showSearch
            placeholder="Select a course"
            optionFilterProp="children"
            loading={loadingCourses}
            onChange={(val) => setSelected(val)}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            value={selected}
          >
            {available.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
};

export default AssignCourse;
