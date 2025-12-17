import React, { useEffect, useState, useMemo } from 'react';
import { Table, Pagination, Input, Empty, Spin } from 'antd';
import { User, Search, Users } from 'lucide-react';
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
      if (res && Array.isArray(res.items)) {
        setTrainees(res.items);
        setTotal(Number(res.totalCount) || res.items.length || 0);
      } else if (Array.isArray(res)) {
        setTrainees(res);
        setTotal(res.length || 0);
      } else if (res && Array.isArray(res.items) === false && res.items) {
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

  // Status styling for Light Wire theme
  const getStatusStyle = (status) => {
    const statusMap = {
      'InProgress': 'bg-yellow-400 text-black border-black',
      'Inprogress': 'bg-yellow-400 text-black border-black',
      'Completed': 'bg-black text-yellow-400 border-black',
      'Pending': 'bg-neutral-100 text-neutral-600 border-neutral-300',
      'Cancelled': 'bg-red-100 text-red-700 border-red-400',
    };
    return statusMap[status] || 'bg-neutral-100 text-neutral-600 border-neutral-300';
  };

  const columns = [
    {
      title: <span className="font-black uppercase text-xs">#</span>,
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, idx) => <span className="font-bold text-neutral-600">{(pageNumber - 1) * pageSize + idx + 1}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('common.fullName', 'Full Name')}</span>,
      dataIndex: 'traineeName',
      key: 'traineeName',
      width: 300,
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden bg-yellow-100 border-2 border-black flex items-center justify-center">
            {record.avatarUrl ? (
              <img src={record.avatarUrl} alt={name} className="w-10 h-10 object-cover" />
            ) : (
              <User className="w-5 h-5 text-yellow-700" />
            )}
          </div>
          <div>
            <div className="font-bold text-black">{name || record.fullName || '-'}</div>
            <div className="text-sm text-neutral-500">{record.email || ''}</div>
          </div>
        </div>
      ),
    },
    {
      title: <span className="font-black uppercase text-xs">{t('common.phone', 'Phone')}</span>,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 140,
      render: (p) => <span className="text-neutral-600 font-medium">{p || '-'}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.members.enrollDate', 'Enroll Date')}</span>,
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      width: 180,
      render: (d) => {
        if (!d) return '-';
        try {
          const dt = new Date(d);
          const locale = (i18n && i18n.language) || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
          return <span className="text-neutral-600 font-medium">{dt.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>;
        } catch (e) {
          return d;
        }
      },
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.members.status', 'Status')}</span>,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (s) => {
        if (!s) return '-';
        const key = `common.classStatus.${s}`;
        const translated = t(key);
        let displayText = s;
        if (translated && translated !== key) {
          displayText = translated;
        } else {
          const alt = t(`status.${s}`);
          if (alt && alt !== `status.${s}`) displayText = alt;
        }
        return (
          <span className={`px-2 py-1 text-xs font-bold uppercase border-2 ${getStatusStyle(s)}`}>
            {displayText}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="bg-white border-2 border-black p-12 flex items-center justify-center">
        <div className="h-1 bg-yellow-400 absolute top-0 left-0 right-0" />
        <Spin size="large" />
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
        <span className="font-bold uppercase text-neutral-600">{t('instructor.classes.members.noClassSelected', 'No class selected')}</span>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      <div className="h-1 bg-yellow-400" />

      {/* Search Header */}
      <div className="p-4 border-b-2 border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={t('attendance.searchStudent', 'Search student...')}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border-2 border-neutral-300 focus:border-yellow-400 outline-none transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12">
          <Empty
            description={<span className="font-bold uppercase text-neutral-500">{t('instructor.classes.members.noMembers', 'No members found')}</span>}
            image={<Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />}
          />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={(r) => r.enrollmentId || r.traineeId || r.id}
            pagination={false}
            size="middle"
            scroll={{ y: 400 }}
            className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-neutral-700 [&_.ant-table-tbody>tr>td]:border-neutral-200 [&_.ant-table-tbody>tr:hover>td]:bg-yellow-50"
          />

          <div className="p-4 border-t-2 border-black bg-neutral-50 flex justify-center">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={total}
              onChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              showTotal={(t, r) => <span className="font-bold text-neutral-600">{r[0]}-{r[1]} / {t}</span>}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClassMembers;