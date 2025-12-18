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
    setPageSize
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
      width: 80,
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
        scrollY={350}
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold uppercase">{t('admin.users.instructorDetail') || "Instructor Detail"}</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {viewLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewingUser ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b-2 border-black pb-4">
              <Avatar
                size={80}
                src={viewingUser.avatarUrl}
                style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold' }}
              >
                {getInitials(viewingUser.fullName)}
              </Avatar>
              <div>
                <h3 className="text-xl font-black uppercase m-0">{viewingUser.fullName}</h3>
                <div className="text-neutral-500">{viewingUser.email}</div>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold uppercase border ${viewingUser.isActive
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
                  }`}>
                  {viewingUser.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: t('admin.users.table.fullName'), value: viewingUser.fullName },
                { label: t('admin.users.table.email'), value: viewingUser.email },
                { label: t('admin.users.table.phone'), value: viewingUser.phoneNumber || '-' },
                { label: 'Role', value: viewingUser.role },
                { label: 'Username', value: viewingUser.username },
              ].map((item, idx) => (
                <div key={idx} className="border-2 border-neutral-200 p-3">
                  <p className="text-xs font-bold uppercase text-neutral-500 mb-1">{item.label}</p>
                  <p className="font-medium text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty description="No Data" />
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
