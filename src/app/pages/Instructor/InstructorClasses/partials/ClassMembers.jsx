import React, { useEffect, useState, useMemo } from 'react';
import { Table, Pagination, Avatar, Input, Empty, Spin } from 'antd';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchClassTrainees } from '../../../../apis/ProgramManager/ClassesApi';

const ClassMembers = ({ classId }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const load = async (p = pageNumber, ps = pageSize) => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchClassTrainees(classId, { page: p, pageSize: ps });
      // res may be paged { items, totalCount } or plain array
      if (res && Array.isArray(res.items)) {
        setTrainees(res.items);
        setTotal(Number(res.totalCount) || res.items.length || 0);
      } else if (Array.isArray(res)) {
        setTrainees(res);
        setTotal(res.length || 0);
      } else if (res && Array.isArray(res.items) === false && res.items) {
        // fallback
        setTrainees(res.items || []);
        setTotal(Number(res.totalCount) || 0);
      } else {
        setTrainees([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load trainees');
      setTrainees([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const filtered = useMemo(() => {
    if (!searchText) return trainees;
    const lower = searchText.toLowerCase();
    return trainees.filter(t =>
      (t.traineeName || t.fullName || '').toLowerCase().includes(lower) ||
      (t.traineeCode || t.code || '').toLowerCase().includes(lower) ||
      (t.email || '').toLowerCase().includes(lower)
    );
  }, [trainees, searchText]);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, idx) => (pageNumber - 1) * pageSize + idx + 1,
    },
    {
      title: t('common.fullName', 'Họ và tên'),
      dataIndex: 'traineeName',
      key: 'traineeName',
      width: 300,
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {record.avatarUrl ? (
              <img src={record.avatarUrl} alt={name} className="w-10 h-10 object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <div className="font-medium">{name || record.fullName || '-'}</div>
            <div className="text-sm text-gray-500">{record.email || ''}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('common.phone', 'Phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 140,
      render: (p) => p || '-',
    },
    {
      title: t('instructor.classes.members.enrollDate', 'Enroll Date'),
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      width: 180,
        render: (d) => {
          if (!d) return '-';
          try {
            const dt = new Date(d);
            const locale = (i18n && i18n.language) || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
            return dt.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
          } catch (e) {
            return d;
          }
        },
    },
    {
      title: t('instructor.classes.members.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (s) => {
        if (!s) return '-';
        const key = `common.classStatus.${s}`;
        const translated = t(key);
        if (translated && translated !== key) return translated;
        // fallback to generic status key or raw value
        const alt = t(`status.${s}`);
        if (alt && alt !== `status.${s}`) return alt;
        return s;
      },
    },
  ];

  if (loading) return <div className="p-6 flex h-screen items-center justify-center"><Spin /></div>;

  if (!classId) return <div className="p-4">{t('instructor.classes.members.noClassSelected', 'No class selected')}</div>;

  return (
    <div className="p-2">
      <div className="mb-2 flex items-center gap-3">
        <Input.Search placeholder={t('attendance.searchStudent', 'Tìm học viên...')} allowClear onSearch={(v) => setSearchText(v)} style={{ width: 320 }} />
      </div>

      {filtered.length === 0 ? (
        <Empty description={t('instructor.classes.members.noMembers', 'No members found')} />
      ) : (
        <div className="rounded-lg bg-white shadow">
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={(r) => r.enrollmentId || r.traineeId || r.id}
            pagination={false}
            size="middle"
            scroll={{ y: 350 }}
          />

          <div className="p-4 border-t border-t-slate-200 bg-white flex justify-center">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={total}
              onChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              showTotal={(t, r) => `${r[0]}-${r[1]} / ${t}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassMembers;