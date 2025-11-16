import { App, Button, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTrainees } from '../../../../apis/Admin/AdminUser';
import { enrollTrainee } from '../../../../apis/ProgramManager/ClassesApi';

// Component: Add/enroll a trainee to a class (similar style to AddInstructor)
export default function AddTrainee({ classItem, onAssigned }) {
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTrainees, setLoadingTrainees] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load trainees only when entering edit mode
  useEffect(() => {
    if (!editing) return;
    if (!classItem?.id) return;
    let active = true;
    setLoadingTrainees(true);
    getTrainees({ page: 1, pageSize: 500 })
      .then((data) => {
        if (!active) return;
        setTrainees(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to fetch trainees:', err);
        message.error('Failed to load trainees');
      })
      .finally(() => active && setLoadingTrainees(false));
    return () => { active = false; };
  }, [editing, classItem?.id, message]);

  const handleSave = async () => {
    if (!selected) {
      message.warning('Please select a trainee');
      return;
    }
    setLoading(true);
    try {
      await enrollTrainee({ classId: classItem.id, traineeId: selected });
      message.success('Trainee enrolled to class');
      setSelected(null);
      setEditing(false);
      onAssigned?.();
    } catch (err) {
      console.error('Failed to enroll trainee:', err);
      const apiData = err?.response?.data;
      const msg = (apiData && (apiData.message || apiData.error || String(apiData))) || err?.message || 'Failed to enroll trainee';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSelected(null);
  };

  if (!classItem) return null;

  return (
    <div className="flex justify-end items-center gap-2">
      {!editing ? (
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<Plus size={20} />}
            onClick={() => { setEditing(true); }}
            size="middle"
          >
            Add Trainee
          </Button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-[350px]">
            <Select
              showSearch
              placeholder="Select a trainee"
              optionFilterProp="children"
              loading={loadingTrainees}
              allowClear
              onChange={(val) => setSelected(val)}
              filterOption={(input, option) =>
                (option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
              value={selected}
              style={{ width: '100%' }}
            >
              {trainees.length === 0 && !loadingTrainees ? (
                <Select.Option disabled value="">
                  No trainees available
                </Select.Option>
              ) : (
                trainees.map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.fullName || t.name || t.email}
                  </Select.Option>
                ))
              )}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="primary" onClick={handleSave} loading={loading} size="middle">
              Save
            </Button>
            <Button onClick={handleCancel} size="middle" disabled={loadingTrainees}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
