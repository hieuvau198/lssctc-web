import { App, Button, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstructors } from '../../../../apis/Admin/AdminUser';
import { addInstructorToClass } from '../../../../apis/ProgramManager/ClassesApi';

// Component: Add/assign an instructor to a class (similar style to AssignCourse)
export default function AddInstructor({ classItem, onAssigned }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  // Load instructors only when entering edit mode
  useEffect(() => {
    if (!editing) return;
    if (!classItem?.id) return;
    let active = true;
    setLoadingInstructors(true);
    // setError(null);
    getInstructors({ page: 1, pageSize: 500 })
      .then((data) => {
        if (!active) return;
        setInstructors(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to fetch instructors:', err);
        // setError(err?.message || 'Failed to load instructors');
        message.error(t('admin.classes.messages.loadInstructorsFailed'));
      })
      .finally(() => active && setLoadingInstructors(false));
    return () => { active = false; };
  }, [editing, classItem?.id, message]);

  const handleSave = async () => {
    if (!selected) {
      // setError('Please select an instructor');
      message.warning(t('admin.classes.messages.selectInstructor'));
      return;
    }
    setLoading(true);
    // setError(null);
    try {
      await addInstructorToClass(classItem.id, { instructorId: selected });
      message.success(t('admin.classes.messages.assignInstructorSuccess'));
      setSelected(null);
      setEditing(false);
      onAssigned?.();
    } catch (err) {
      console.error('Failed to assign instructor:', err);
      const apiData = err?.response?.data;
      const msg = (apiData && (apiData.message || apiData.error || String(apiData))) || err?.message || t('admin.classes.messages.assignInstructorFailed');
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSelected(null);
    setError(null);
  };

  if (!classItem) return null;

  return (
    <div className="flex justify-end items-center gap-2">
      {!editing ? (
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<Plus size={20} />}
            onClick={() => { setEditing(true); setError(null); }}
            size="middle"
          >
            {t('admin.classes.buttons.assignInstructor')}
          </Button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-[350px]">
            <Select
              showSearch
              placeholder={t('admin.classes.placeholders.selectInstructor')}
              optionFilterProp="children"
              loading={loadingInstructors}
              allowClear
              onChange={(val) => setSelected(val)}
              filterOption={(input, option) =>
                (option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
              value={selected}
              style={{ width: '100%' }}
            >
              {instructors.length === 0 && !loadingInstructors ? (
                <Select.Option disabled value="">
                  {t('admin.classes.messages.noInstructorsAvailable')}
                </Select.Option>
              ) : (
                instructors.map((i) => (
                  <Select.Option key={i.id} value={i.id}>
                    {i.fullName || i.name || i.email}
                  </Select.Option>
                ))
              )}
            </Select>
            {error && (
              <div className="text-xs text-red-600 mt-1">{error}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="primary" onClick={handleSave} loading={loading} size="middle">
              {t('common.save')}
            </Button>
            <Button onClick={handleCancel} size="middle" disabled={loadingInstructors}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
