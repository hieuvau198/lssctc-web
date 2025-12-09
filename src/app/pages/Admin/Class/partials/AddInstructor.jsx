import { App, Button, Select } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstructors } from '../../../../apis/Admin/AdminUser';
import { addInstructorToClass, fetchAvailableInstructors } from '../../../../apis/ProgramManager/ClassesApi';

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
    // Prefer available-instructors endpoint using class start/end dates
    (async () => {
      try {
        const start = classItem.startDate ? new Date(classItem.startDate).toISOString().slice(0, 10) : null;
        const end = classItem.endDate ? new Date(classItem.endDate).toISOString().slice(0, 10) : null;
        let data;
        if (start && end) {
          data = await fetchAvailableInstructors({ startDate: start, endDate: end, classId: classItem.id });
        } else {
          // fallback to fetching all instructors
          data = await getInstructors({ page: 1, pageSize: 500 });
        }

        if (!active) return;
        // API may return paged object or plain array
        const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        setInstructors(items);
      } catch (err) {
        if (!active) return;
        console.error('Failed to fetch instructors:', err);
        message.error(t('admin.classes.messages.loadInstructorsFailed'));
      } finally {
        active && setLoadingInstructors(false);
      }
    })();
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
              optionFilterProp="label"
              loading={loadingInstructors}
              allowClear
              size="large"
              onChange={(val) => setSelected(val)}
              filterOption={(input, option) => {
                const search = (option?.props?.['data-search'] || '').toString().toLowerCase();
                return search.includes(input.toLowerCase());
              }}
              value={selected}
              style={{ width: '100%' }}
            >
              {instructors.length === 0 && !loadingInstructors ? (
                <Select.Option disabled value="">
                  {t('admin.classes.messages.noInstructorsAvailable')}
                </Select.Option>
              ) : (
                instructors.map((i) => {
                  const avatar = i.avatarUrl || i.avatar || i.imageUrl || '';
                  const deriveNameFromEmail = (email) => {
                    if (!email) return '';
                    const local = email.split('@')[0] || email;
                    return local
                      .replace(/[._\-]+/g, ' ')
                      .split(' ')
                      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(' ');
                  };
                  const fullName = i.fullname || i.fullName || i.name || deriveNameFromEmail(i.email) || '';
                  const code = i.instructorCode || i.code || i.id || '';
                  const search = `${fullName} ${code} ${i.email || ''} ${i.phoneNumber || i.phone || ''}`;
                  return (
                    <Select.Option key={i.id} value={i.id} data-search={search} label={fullName}>
                      <div className="flex items-center gap-2">
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                        />
                        <div className="truncate">
                          <div className="font-medium text-sm text-slate-800 truncate">{fullName}</div>
                          <div className="text-xs text-slate-500">{code}</div>
                        </div>
                      </div>
                    </Select.Option>
                  );
                })
              )}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="primary" onClick={handleSave} loading={loading} size="large">
              {t('common.save')}
            </Button>
            <Button onClick={handleCancel} size="large" disabled={loadingInstructors}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
