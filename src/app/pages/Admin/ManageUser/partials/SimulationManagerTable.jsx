import { Avatar, Empty, Pagination, Table, Tag, Modal, Descriptions, Spin, message, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { getUserById } from '../../../../apis/Admin/AdminUser';
import DrawerEdit from './DrawerEdit';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
};

export default function SimulationManagerTable() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    simManagerData,
    loadingSimManagers,
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
    { title: '#', dataIndex: 'idx', width: 60, align: 'center' },
    {
      title: t('admin.users.table.avatar'),
      dataIndex: 'avatar',
      width: 80,
      render: (src, record) => (
        <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
          {!src && getInitials(record.fullName)}
        </Avatar>
      ),
    },
    {
      title: t('admin.users.table.fullName'),
      dataIndex: 'fullName',
      render: (text, record) => (
        <a
          onClick={() => handleViewUser(record.key)}
          className="text-primary hover:underline font-medium cursor-pointer"
        >
          {text}
        </a>
      )
    },
    { title: t('admin.users.table.email'), dataIndex: 'email' },
    { title: t('admin.users.table.phone'), dataIndex: 'phoneNumber', width: 160 },
    {
      title: t('admin.users.table.status'),
      dataIndex: 'status',
      render: (s) => (
        <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? t('common.active') : t('common.inactive')}</Tag>
      ),
      width: 120,
    },
    {
      title: t('common.action') || "Action",
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('common.edit') || "Edit"}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => handleEditUser(e, record.key)}
          />
        </Tooltip>
      )
    }
  ];

  useEffect(() => {
    if (simManagerData?.items) {
      const items = Array.isArray(simManagerData.items) ? simManagerData.items : [];
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
  }, [simManagerData, page, pageSize]);

  return (
    <div>
      <div className="min-h-[380px] overflow-auto">
        {(!data.length && !loadingSimManagers) ? (
          <Empty description={t('admin.users.noSimulationManagers')} />
        ) : (
          <Table
            columns={COLUMNS}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loadingSimManagers}
            scroll={{ y: 360 }}
          />
        )}
      </div>
      <div className="py-3 border-t border-t-slate-300 bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={simManagerData?.totalCount || 0}
          onChange={(p, s) => {
            setPage(p);
            setPageSize(s);
          }}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('admin.users.pagination', { start: range[0], end: range[1], total })}
        />
      </div>

      <Modal
        title={t('admin.users.simManagerDetail') || "Simulation Manager Detail"}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {viewLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : viewingUser ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <Avatar
                size={80}
                src={viewingUser.avatarUrl}
                style={{ backgroundColor: '#f3f4f6' }}
              >
                {getInitials(viewingUser.fullName)}
              </Avatar>
              <div>
                <h3 className="text-xl font-bold m-0">{viewingUser.fullName}</h3>
                <div className="text-gray-500">{viewingUser.email}</div>
                <Tag color={viewingUser.isActive ? 'green' : 'red'} className="mt-2">
                  {viewingUser.isActive ? t('common.active') : t('common.inactive')}
                </Tag>
              </div>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label={t('admin.users.table.fullName')}>{viewingUser.fullName}</Descriptions.Item>
              <Descriptions.Item label={t('admin.users.table.email')}>{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label={t('admin.users.table.phone')}>{viewingUser.phoneNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="Role">{viewingUser.role}</Descriptions.Item>
              <Descriptions.Item label="Username">{viewingUser.username}</Descriptions.Item>
            </Descriptions>
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
};