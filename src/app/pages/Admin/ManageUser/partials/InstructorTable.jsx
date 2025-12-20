import { Avatar, Empty, Modal, Tooltip, message } from 'antd';
import { User, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { getUserById } from '../../../../apis/Admin/AdminUser';
import { IndustrialTable } from '../../../../components/Industrial';
import DrawerEdit from './DrawerEdit';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
};

export default function InstructorTable() {
  const { t } = useTranslation();
  const {
    instructorData,
    loadingInstructors,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableScroll
  } = useOutletContext() || {};

  const [data, setData] = useState([]);
  const [viewingUser, setViewingUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const handleEditUser = (e, id) => {
    e.stopPropagation();
    setEditingUserId(id);
    setIsEditDrawerOpen(true);
  };

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  const handleViewUser = async (id) => {
    setIsViewModalOpen(true);
    setViewLoading(true);
    try {
      const user = await getUserById(id);
      setViewingUser(user);
    } catch (error) {
      console.error(error);
      message.error(t('common.error'));
      setIsViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const COLUMNS = [
    {
      title: '#',
      dataIndex: 'idx',
      width: 60,
      align: 'center',
      render: (v) => <span className="font-bold text-neutral-500">{v}</span>
    },
    {
      title: t('admin.users.table.avatar'),
      dataIndex: 'avatar',
      width: 90,
      render: (src, record) => (
        <Avatar
          src={src}
          alt={record.fullName}
          size={40}
          style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold' }}
        >
          {!src && getInitials(record.fullName)}
        </Avatar>
      ),
    },
    {
      title: t('admin.users.table.fullName'),
      dataIndex: 'fullName',
      render: (text, record) => (
        <span
          onClick={() => handleViewUser(record.key)}
          className="font-bold text-black cursor-pointer hover:text-yellow-600 transition-colors"
        >
          {text}
        </span>
      )
    },
    {
      title: t('admin.users.table.email'),
      dataIndex: 'email',
      render: (text) => <span className="text-neutral-600">{text}</span>
    },
    {
      title: t('admin.users.table.phone'),
      dataIndex: 'phoneNumber',
      width: 160,
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: t('admin.users.table.status'),
      dataIndex: 'status',
      render: (s) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase border ${s === 'active'
          ? 'bg-green-100 text-green-800 border-green-300'
          : 'bg-red-100 text-red-800 border-red-300'
          }`}>
          {s === 'active' ? t('common.active') : t('common.inactive')}
        </span>
      ),
      width: 150,
    },
    {
      title: t('common.action') || "Action",
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('common.edit') || "Edit"}>
          <button
            onClick={(e) => handleEditUser(e, record.key)}
            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all mx-auto"
          >
            <Pencil className="w-4 h-4 text-black" />
          </button>
        </Tooltip>
      )
    }
  ];

  useEffect(() => {
    if (instructorData?.items) {
      const items = Array.isArray(instructorData.items) ? instructorData.items : [];
      const rows = items.map((it, idx) => ({
        key: it.id,
        idx: (page - 1) * pageSize + idx + 1,
        fullName: it.fullName || it.fullname || it.username || '',
        email: it.email || '',
        phoneNumber: it.phoneNumber || it.phone || it.phone_number || '-',
        avatar: it.avatarUrl || it.avatar || it.avatar_url || '',
        status: it.isActive ? 'active' : 'inactive',
      }));
      setData(rows);
    }
  }, [instructorData, page, pageSize]);

  const emptyContent = (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
        <User className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-neutral-800 font-bold uppercase">{t('admin.users.noInstructors')}</p>
    </div>
  );

  return (
    <div>
      <IndustrialTable
        columns={COLUMNS}
        dataSource={data}
        rowKey="key"
        loading={loadingInstructors}
        emptyContent={emptyContent}
        scroll={tableScroll}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: instructorData?.totalCount || 0,
          onChange: (p, ps) => {
            if (ps !== pageSize) {
              setPageSize(ps);
            } else {
              setPage(p);
            }
          },
          label: 'users',
        }}
      />

      {/* Industrial Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 border border-black flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold uppercase text-sm">{t('admin.users.instructorDetail') || "Instructor Detail"}</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={500}
        centered
        className="industrial-modal"
      >
        {viewLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewingUser ? (
          <div>
            {/* Header Profile Section */}
            <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 mb-4">
              <div className="relative">
                <Avatar
                  size={64}
                  src={viewingUser.avatarUrl}
                  style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold', border: '2px solid #000' }}
                >
                  {getInitials(viewingUser.fullName)}
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${viewingUser.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black uppercase truncate m-0 leading-tight">{viewingUser.fullName}</h3>
                <p className="text-sm text-neutral-500 truncate mb-1">{viewingUser.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase border ${viewingUser.isActive
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                  {viewingUser.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>
            </div>

            {/* Compact Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 bg-neutral-50 p-4 border border-neutral-200">
              {[
                { label: t('admin.users.table.fullName'), value: viewingUser.fullName, full: true },
                { label: t('admin.users.table.email'), value: viewingUser.email, full: true },
                { label: t('admin.users.table.phone'), value: viewingUser.phoneNumber || '-' },
                { label: 'Role', value: viewingUser.role },
                { label: 'Username', value: viewingUser.username },
              ].map((item, idx) => (
                <div key={idx} className={`${item.full ? 'col-span-2' : 'col-span-1'}`}>
                  <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5 tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-black break-all" title={item.value}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Modal>

      <DrawerEdit
        visible={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        userId={editingUserId}
        onUpdated={handleUpdateSuccess}
      />
    </div>
  );
}
