import { App, Button, Select, Tooltip, ConfigProvider } from 'antd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstructors } from '../../../../apis/Admin/AdminUser';
import { addInstructorToClass, fetchAvailableInstructors } from '../../../../apis/ProgramManager/ClassesApi';

// Component: Add/assign an instructor to a class
export default function AddInstructor({ classItem, onAssigned, allowAssign = true }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load instructors only when entering edit mode
  useEffect(() => {
    if (!editing) return;
    if (!classItem?.id) return;
    let active = true;
    setLoadingInstructors(true);
    
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
      message.warning(t('admin.classes.messages.selectInstructor'));
      return;
    }
    setLoading(true);
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
  };

  if (!classItem) return null;

  const industrialTheme = {
    token: {
      borderRadius: 0,
      colorPrimary: '#000000',
    },
    components: {
      Button: {
        borderRadius: 0,
        controlHeightLG: 42,
      },
      Select: {
        borderRadius: 0,
        controlHeightLG: 42,
        colorBorder: '#000000',
      },
    },
  };

  return (
    <ConfigProvider theme={industrialTheme}>
      <div className="w-full flex justify-center">
        {!editing ? (
          <Tooltip title={!allowAssign ? "Please add schedule timeslots first" : ""}>
            <Button
              icon={<Plus size={16} strokeWidth={2.5} />}
              onClick={() => { setEditing(true); }}
              disabled={!allowAssign}
              size="large"
              className="bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:border-black font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
            >
              {t('admin.classes.buttons.assignInstructor')}
            </Button>
          </Tooltip>
        ) : (
          <div className="w-full flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full">
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
                className="w-full"
                popupClassName="industrial-dropdown"
                dropdownStyle={{ 
                  borderRadius: 0, 
                  border: '2px solid #000', 
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' 
                }}
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
                        <div className="flex items-center gap-3 py-1">
                          <img
                            src={avatar}
                            alt={fullName}
                            className="w-8 h-8 object-cover border border-slate-200"
                            style={{ borderRadius: 0 }}
                            onError={(e) => { e.currentTarget.src = '/favicon.ico'; }}
                          />
                          <div className="truncate flex-1">
                            <div className="font-bold text-sm text-slate-900 truncate uppercase tracking-tight">{fullName}</div>
                            <div className="text-xs text-slate-500 font-mono">{code}</div>
                          </div>
                        </div>
                      </Select.Option>
                    );
                  })
                )}
              </Select>
            </div>
            <div className="flex gap-2 justify-end shrink-0">
              <Button 
                onClick={handleCancel} 
                size="large" 
                disabled={loadingInstructors}
                className="bg-white text-slate-500 border-2 border-slate-200 hover:border-black hover:text-black font-bold uppercase tracking-wider"
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="primary" 
                onClick={handleSave} 
                loading={loading} 
                size="large"
                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold uppercase tracking-wider shadow-none"
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}