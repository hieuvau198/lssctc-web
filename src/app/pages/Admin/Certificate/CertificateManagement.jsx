import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, message, Card, Space, Tag, Modal, Tooltip } from 'antd';
import { Edit, Plus, Award, Eye, X, FileCode } from 'lucide-react';
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

  // Preview from Table (Existing Record)
  const handlePreview = (cert) => {
    setPreviewCert(cert);
    setPreviewVisible(true);
  };

  // Preview from Drawer Form (Draft Data)
  const handlePreviewFromForm = () => {
    const values = form.getFieldsValue();
    if (!values.templateHtml) {
        message.warning('Vui lòng nhập nội dung HTML để xem trước');
        return;
    }
    
    setPreviewCert({
        name: values.name || 'Bản xem trước (Chưa lưu)',
        templateHtml: values.templateHtml,
        isDraft: true
    });
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
      <div className="w-full overflow-hidden bg-white border border-neutral-200 shadow-sm" style={{ height: `${height}px` }}>
        <iframe
          srcDoc={template.templateHtml}
          title={`Certificate Preview - ${template.name}`}
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
          style={{
            transform: 'scale(0.85)',
            transformOrigin: 'top center',
            width: '117.6%', // 1 / 0.85
            height: '117.6%',
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
          <Tooltip title="Xem trước mẫu">
            <Button 
                type="text" 
                icon={<Eye size={18} className="text-green-600" />} 
                onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
                type="text" 
                icon={<Edit size={18} className="text-blue-600" />} 
                onClick={() => handleOpenDrawer(record)}
            />
          </Tooltip>
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
        action={ /* Changed 'extra' to 'action' here to match PageHeader.jsx definition */
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
        width={800}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button 
                icon={<Eye size={16} />} 
                onClick={handlePreviewFromForm}
                className="hidden sm:flex items-center gap-1"
            >
                Xem trước
            </Button>
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
            <Input placeholder="Ví dụ: Chứng chỉ vận hành xe nâng" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về chứng chỉ này" />
          </Form.Item>

          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Mẫu HTML</label>
            <Button 
                size="small" 
                type="link" 
                icon={<Eye size={14} />} 
                onClick={handlePreviewFromForm}
            >
                Xem trước thiết kế
            </Button>
          </div>
          
          <Form.Item
            name="templateHtml"
            noStyle
            rules={[{ required: true, message: 'Vui lòng nhập mã HTML cho mẫu chứng chỉ' }]}
          >
            <Input.TextArea 
              rows={20} 
              className="font-mono text-sm bg-slate-50 border-slate-300"
              placeholder="<html>...</html>"
              spellCheck={false}
            />
          </Form.Item>
          <div className="mt-2 text-xs text-gray-500 flex gap-1">
            <FileCode size={14} />
            <span>Sử dụng HTML/CSS inline để định dạng. Có thể sử dụng các biến placeholder như {'{{TraineeName}}'}, {'{{CourseName}}'}, {'{{Date}}'}...</span>
          </div>
        </Form>
      </Drawer>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        onCancel={handleClosePreview}
        footer={
            <div className="flex justify-end">
                <Button onClick={handleClosePreview}>Đóng</Button>
            </div>
        }
        closable={false}
        centered
        width={1000}
        styles={{
          content: { padding: 0, borderRadius: '8px', overflow: 'hidden' },
          body: { padding: 0 },
        }}
      >
        {/* Header for Modal */}
        <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <Award className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-none m-0">
                Xem trước mẫu chứng chỉ
              </h3>
              <p className="text-slate-400 text-xs mt-1 m-0">
                {previewCert?.name} {previewCert?.isDraft && <span className="text-yellow-500 ml-1">(Bản nháp)</span>}
              </p>
            </div>
          </div>
          <button
            onClick={handleClosePreview}
            className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 bg-slate-100 min-h-[500px] flex items-center justify-center">
          <TemplatePreview template={previewCert} height={600} />
        </div>
      </Modal>
    </div>
  );
};

export default CertificateManagement;