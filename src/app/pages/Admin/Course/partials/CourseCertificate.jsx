// src/app/pages/Admin/Course/partials/CourseCertificate.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Skeleton, message, Empty, Modal, Select, Tag, Space, Typography } from 'antd';
import { SafetyCertificateOutlined, SwapOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fetchCertificateByCourse, fetchCertificateTemplates, assignCertificateToCourse, autoAssignCertificateToCourse } from '../../../../apis/ProgramManager/CertificateApi';

const { Text, Title } = Typography;
const { Option } = Select;

const CourseCertificate = ({ courseId }) => {
  const { t } = useTranslation();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCertificate();
    }
  }, [courseId]);

  const loadCertificate = async () => {
    setLoading(true);
    try {
      const data = await fetchCertificateByCourse(courseId);
      setCertificate(data);
    } catch (error) {
      message.error("Failed to load certificate information.");
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await fetchCertificateTemplates();
      setTemplates(data);
    } catch (error) {
      message.error("Failed to load certificate templates.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleOpenAssignModal = () => {
    setIsModalOpen(true);
    loadTemplates();
  };

  const handleAssign = async () => {
    if (!selectedTemplateId) {
      message.warning("Please select a certificate template.");
      return;
    }

    setAssignLoading(true);
    try {
      await assignCertificateToCourse(courseId, selectedTemplateId);
      message.success("Certificate assigned successfully.");
      setIsModalOpen(false);
      loadCertificate();
    } catch (error) {
      message.error(error?.response?.data || "Failed to assign certificate.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    setAssignLoading(true);
    try {
      await autoAssignCertificateToCourse(courseId);
      message.success("Default certificate auto-assigned successfully.");
      loadCertificate();
    } catch (error) {
      message.error(error?.response?.data || "Failed to auto-assign certificate.");
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 3 }} />;

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-orange-500" /> 
          <span>Course Certificate</span>
        </div>
      }
      className="mt-6 shadow-sm"
      extra={
        !certificate && (
          <Button 
            icon={<ThunderboltOutlined />} 
            onClick={handleAutoAssign} 
            loading={assignLoading}
          >
            Auto Assign
          </Button>
        )
      }
    >
      {certificate ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
               <SafetyCertificateOutlined className="text-3xl text-orange-500" />
            </div>
            <div>
              <Title level={5} className="m-0 mb-1">{certificate.name}</Title>
              <Space direction="vertical" size={0}>
                <Text type="secondary" className="text-xs">Template ID: {certificate.id}</Text>
                <div className="mt-1">
                    <Tag color="green" icon={<CheckCircleOutlined />}>Active</Tag>
                    {certificate.courseName && <Tag>{certificate.courseName}</Tag>}
                </div>
              </Space>
            </div>
          </div>
          
          <Button 
            type="default" 
            icon={<SwapOutlined />} 
            onClick={handleOpenAssignModal}
          >
            Change Template
          </Button>
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">No certificate assigned to this course yet.</Text>}
        >
          <Button type="primary" onClick={handleOpenAssignModal}>
            Assign Certificate
          </Button>
        </Empty>
      )}

      {/* Assign Modal */}
      <Modal
        title="Assign Certificate Template"
        open={isModalOpen}
        onOk={handleAssign}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={assignLoading}
        okText="Assign"
      >
        <div className="py-4">
          <Text className="block mb-2">Select a template from the library:</Text>
          <Select
            className="w-full"
            placeholder="Select a certificate template"
            loading={loadingTemplates}
            onChange={(value) => setSelectedTemplateId(value)}
            optionFilterProp="children"
            showSearch
          >
            {templates.map(tpl => (
              <Option key={tpl.id} value={tpl.id}>
                {tpl.name} (ID: {tpl.id})
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </Card>
  );
};

export default CourseCertificate;