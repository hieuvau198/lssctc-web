// src/app/pages/Admin/Class/partials/ClassCertificate.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Tag, Skeleton, Empty, Typography, Button, Tooltip, Badge } from 'antd';
import { 
  SafetyCertificateOutlined, 
  UserOutlined, 
  DownloadOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { fetchCertificateByClass, fetchTraineeCertificatesByClass } from '../../../../apis/ProgramManager/ClassCertificateApi';

const { Title, Text, Paragraph } = Typography;

const ClassCertificate = ({ classId }) => {
  const { t } = useTranslation();
  const [template, setTemplate] = useState(null);
  const [traineeCerts, setTraineeCerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classId) {
      loadData();
    }
  }, [classId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch the Certificate Origin (Template)
      const templateData = await fetchCertificateByClass(classId);
      setTemplate(templateData);

      // 2. Fetch the list of issued certificates for this class
      if (templateData) {
        const certsData = await fetchTraineeCertificatesByClass(classId);
        setTraineeCerts(certsData);
      }
    } catch (error) {
      console.error("Failed to load class certificate data", error);
    } finally {
      setLoading(false);
    }
  };

  // Columns for the Trainee List Table
  const columns = [
    {
      title: 'Trainee',
      dataIndex: 'traineeName',
      key: 'traineeName',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
             <UserOutlined />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-700">{text}</span>
            <span className="text-xs text-slate-400">{record.traineeCode}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Issue Date',
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      render: (date) => date ? dayjs(date).format('DD-MM-YYYY') : '-',
    },
    {
      title: 'Code',
      dataIndex: 'certificateCode',
      key: 'certificateCode',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Tooltip title="View Certificate">
           <Button 
             type="link" 
             icon={<EyeOutlined />} 
             disabled={!record.pdfUrl}
             href={record.pdfUrl}
             target="_blank"
           />
        </Tooltip>
      ),
    },
  ];

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (!template) {
    return (
      <Card className="mt-6 shadow-sm border-slate-200">
        <Empty 
          description={<span className="text-slate-500">No certificate template assigned to this course yet.</span>} 
        />
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
         <SafetyCertificateOutlined className="text-xl text-orange-600" />
         <h3 className="text-lg font-bold text-slate-800 m-0">Class Certificates</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Certificate Origin (Template Info) */}
        <div className="lg:col-span-1">
          <Card 
            title="Certificate Origin" 
            className="shadow-sm border-slate-200 h-full"
            headStyle={{ backgroundColor: '#f8fafc', fontSize: '14px', fontWeight: 600 }}
          >
            <div className="flex flex-col gap-4">
                

                {/* Details */}
                <div className="space-y-3">
                   <div>
                      <Paragraph className="m-0 font-medium text-slate-700">{template.name}</Paragraph>
                   </div>
                   
                   <div>
                      <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Course</Text>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge status="processing" />
                        <Text className="text-slate-700">{template.courseName || "Current Course"}</Text>
                      </div>
                   </div>

                   <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                      <span>Created: {dayjs(template.createdAt).format('YYYY-MM-DD')}</span>
                   </div>
                </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Trainee Certificates List */}
        <div className="lg:col-span-2">
          <Card 
            title={
                <div className="flex justify-between items-center">
                    <span>Issued Certificates</span>
                    <Badge count={traineeCerts.length} overflowCount={999} style={{ backgroundColor: '#e2e8f0', color: '#475569' }} />
                </div>
            }
            className="shadow-sm border-slate-200 h-full"
            headStyle={{ backgroundColor: '#f8fafc', fontSize: '14px', fontWeight: 600 }}
            bodyStyle={{ padding: 0 }}
          >
            <Table 
              dataSource={traineeCerts} 
              columns={columns} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <div className="py-8 text-slate-400">No certificates issued yet.</div> }}
            />
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ClassCertificate;