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
    <div className="w-full">
      {/* Explicit Extra Content from Header if needed can go here, but logic suggests handling per state */}

      {certificate ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 border-2 border-neutral-200 bg-neutral-50 hover:border-black transition-colors">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SafetyCertificateOutlined className="text-3xl text-black" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase text-neutral-900 m-0 leading-tight">{certificate.name}</h4>
              <Space direction="vertical" size={2} className="mt-1">
                <Text type="secondary" className="text-xs font-mono uppercase tracking-wider">Template ID: {certificate.id}</Text>
                <div className="mt-1 flex gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold uppercase border border-green-200">Active</span>
                  {certificate.courseName && <span className="px-2 py-0.5 bg-neutral-200 text-neutral-600 text-xs font-bold uppercase border border-neutral-300">{certificate.courseName}</span>}
                </div>
              </Space>
            </div>
          </div>

          <Button
            onClick={handleOpenAssignModal}
            className="h-10 px-4 rounded-none border-2 border-black text-black font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black hover:border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
            icon={<SwapOutlined />}
          >
            Change Template
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-white hover:border-neutral-400 transition-all gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mb-2">
            <SafetyCertificateOutlined className="text-3xl text-neutral-400" />
          </div>
          <div>
            <h4 className="text-neutral-900 font-bold uppercase m-0">No Certificate Assigned</h4>
            <p className="text-neutral-500 text-sm mt-1 mb-4">Assign a certificate template to this course for automated issuance.</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleAutoAssign}
                loading={assignLoading}
                className="h-10 px-4 rounded-none border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all"
                icon={<ThunderboltOutlined />}
              >
                Auto Assign
              </Button>
              <Button
                type="primary"
                onClick={handleOpenAssignModal}
                className="h-10 px-4 rounded-none bg-yellow-400 border-2 border-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:text-black shadow-sm"
              >
                Select Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      <Modal
        title={<span className="font-bold uppercase">Assign Certificate Template</span>}
        open={isModalOpen}
        onOk={handleAssign}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={assignLoading}
        okText="Assign"
        width={500}
      >
        <div className="py-6">
          <Text className="block mb-2 font-medium">Select a template from the library:</Text>
          <Select
            className="w-full h-10"
            placeholder="Select a certificate template"
            loading={loadingTemplates}
            onChange={(value) => setSelectedTemplateId(value)}
            optionFilterProp="children"
            showSearch
            listHeight={200}
          >
            {templates.map(tpl => (
              <Option key={tpl.id} value={tpl.id}>
                {tpl.name} (ID: {tpl.id})
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default CourseCertificate;