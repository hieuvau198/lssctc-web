import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Tag, Space, Popconfirm, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getBrandModels,
  createBrandModel,
  updateBrandModel,
  deleteBrandModel,
} from '../../../apis/SimulationManager/SimulationManagerBrandModel';

export default function BrandModel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getBrandModels({ page: 1, pageSize: 100 });
      setData(res.items || []);
    } catch (err) {
      console.error(err);
      message.error('Không tải được danh sách Brand');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name, description: record.description, isActive: record.isActive });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrandModel(id);
      message.success('Xóa thành công');
      fetch();
    } catch (err) {
      console.error(err);
      message.error('Xóa thất bại');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateBrandModel(editing.id, values);
        message.success('Cập nhật thành công');
      } else {
        await createBrandModel(values);
        message.success('Tạo mới thành công');
      }
      setModalVisible(false);
      fetch();
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Lưu thất bại');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (v) => (v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>) },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this brand?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Brand Models</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Create Brand</Button>
      </div>

      <Table
        rowKey={(r) => r.id}
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editing ? 'Edit Brand' : 'Create Brand'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
