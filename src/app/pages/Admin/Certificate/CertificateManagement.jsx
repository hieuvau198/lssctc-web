import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, message, Card, Space, Tag, Modal, Empty } from 'antd';
import { Edit, Plus, Award, Eye, X } from 'lucide-react'; // Added Eye, X
import PageHeader from '../../../components/Common/PageHeader';
import { 
  fetchCertificateTemplates, 
  createCertificateTemplate, 
  updateCertificateTemplate 
} from '../../../apis/ProgramManager/CertificateApi';

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  
  // Preview State
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const data = await fetchCertificateTemplates();
      setCertificates(data);
    } catch (error) {
      message.error('Không thể tải danh sách chứng chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // --- Handlers ---

  const handleOpenDrawer = (cert = null) => {
    setEditingCert(cert);
    if (cert) {
      form.setFieldsValue({
        name: cert.name,
        description: cert.description,
        templateHtml: cert.templateHtml
      });
    } else {
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingCert(null);
    form.resetFields();
  };

  const handlePreview = (cert) => {
    setPreviewCert(cert);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewCert(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingCert) {
        await updateCertificateTemplate(editingCert.id, values);
        message.success('Cập nhật chứng chỉ thành công');
      } else {
        await createCertificateTemplate(values);
        message.success('Tạo chứng chỉ mới thành công');
      }
      handleCloseDrawer();
      loadCertificates();
    } catch (error) {
      message.error(editingCert ? 'Cập nhật thất bại' : 'Tạo mới thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Components ---

  // Reusable Template Preview Component (matches Admin Course logic)
  const TemplatePreview = ({ template, height = 400 }) => {
    if (!template || !template.templateHtml) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-neutral-50 border-2 border-dashed border-neutral-300 p-8">
                <Award className="w-12 h-12 text-neutral-300 mb-2" />
                <span className="text-neutral-400 font-bold uppercase text-xs">Chưa có nội dung HTML</span>
            </div>
        );
    }

    return (
      <div className="w-full overflow-hidden bg-white border border-neutral-200" style={{ height: `${height}px` }}>
        <iframe
          srcDoc={template.templateHtml}
          title={`Certificate Preview - ${template.name}`}
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
          style={{
            transform: 'scale(0.75)',
            transformOrigin: 'top left',
            width: '133.33%', // Compensate for scale (1 / 0.75)
            height: '133.33%',
          }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'Tên chứng chỉ',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
    },
    {
        title: 'Trạng thái',
        key: 'status',
        width: '15%',
        render: (_, record) => (
            <Tag color={record.isActive ? 'green' : 'red'}>
                {record.isActive ? 'Hoạt động' : 'Vô hiệu'}
            </Tag>
        )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<Eye size={18} className="text-green-600" />} 
            onClick={() => handlePreview(record)}
          >
            Xem trước
          </Button>
          <Button 
            type="text" 
            icon={<Edit size={18} className="text-blue-600" />} 
            onClick={() => handleOpenDrawer(record)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý Chứng chỉ"
        subtitle="Quản lý các mẫu chứng chỉ gốc trong hệ thống"
        icon={Award}
        action={
          <Button
            color="default"
            variant="solid"
            icon={<Plus size={18} />}
            onClick={() => handleOpenDrawer()}
            className="flex items-center gap-2"
            style={{ backgroundColor: "#000", color: "#fff" }}
            >
            Tạo mới
        </Button>

        }
      />

      <Card className="mt-6 shadow-sm" bordered={false}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={certificates}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Edit/Create Drawer */}
      <Drawer
        title={editingCert ? "Chỉnh sửa chứng chỉ" : "Tạo chứng chỉ mới"}
        width={720}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={handleCloseDrawer}>Hủy</Button>
            <Button type="primary" onClick={form.submit} loading={submitting}>
              {editingCert ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="Tên chứng chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập tên chứng chỉ' }]}
          >
            <Input placeholder="Ví dụ: Chứng chỉ vận hành xe nâng" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về chứng chỉ này" />
          </Form.Item>

          <Form.Item
            name="templateHtml"
            label="Mẫu HTML"
            rules={[{ required: true, message: 'Vui lòng nhập mã HTML cho mẫu chứng chỉ' }]}
            tooltip="Nhập mã HTML để định dạng hiển thị của chứng chỉ."
          >
            <Input.TextArea 
              rows={15} 
              className="font-mono text-sm"
              placeholder="<html>...</html>" 
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        onCancel={handleClosePreview}
        footer={null}
        closable={false}
        centered
        width={900}
        styles={{
          content: { padding: 0, borderRadius: 0 },
          body: { padding: 0 },
        }}
      >
        {/* Industrial Header for Modal */}
        <div className="bg-black p-3 flex items-center justify-between border-b-4 border-yellow-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
              <Award className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-white font-black uppercase text-base leading-none m-0">
                Xem trước mẫu chứng chỉ
              </h3>
              <p className="text-neutral-400 text-xs font-mono mt-1 m-0">
                {previewCert?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClosePreview}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-100">
          <TemplatePreview template={previewCert} height={500} />
        </div>
      </Modal>
    </div>
  );
};

export default CertificateManagement;