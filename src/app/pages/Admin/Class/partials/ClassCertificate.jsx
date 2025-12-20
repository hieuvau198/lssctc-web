import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Skeleton, Button } from 'antd';
import {
  FileBadge,
  User,
  Eye,
  Award,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';
import { fetchCertificateByClass, fetchTraineeCertificatesByClass } from '../../../../apis/ProgramManager/ClassCertificateApi';

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
      title: t('admin.classes.certificate.trainee'),
      dataIndex: 'traineeName',
      key: 'traineeName',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-black bg-neutral-100 flex items-center justify-center text-neutral-600">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 uppercase text-xs">{text}</span>
            <span className="text-[10px] text-slate-500 font-mono">{record.traineeCode}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('admin.classes.certificate.issueDate'),
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      render: (date) => date ? (
        <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
          <Calendar size={14} className="text-yellow-600" />
          {dayjs(date).format('YYYY-MM-DD')}
        </div>
      ) : '-',
    },
    {
      title: t('admin.classes.certificate.certCode'),
      dataIndex: 'certificateCode',
      key: 'certificateCode',
      render: (text) => <span className="font-mono text-xs font-bold text-slate-700 bg-yellow-100 px-1 border border-yellow-200">{text}</span>
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<Eye size={18} />}
          disabled={!record.pdfUrl}
          href={record.pdfUrl}
          target="_blank"
          className="text-slate-400 hover:text-black hover:bg-yellow-400 rounded-none w-8 h-8 flex items-center justify-center p-0 transition-all border border-transparent hover:border-black"
        />
      ),
    },
  ];

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (!template) {
    return (
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
            <FileBadge size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900 m-0">{t('admin.classes.certificate.title')}</h3>
        </div>
        <div className="border-2 border-dashed border-slate-300 bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white border-2 border-slate-200 flex items-center justify-center rounded-full mb-4">
            <FileBadge size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">{t('admin.classes.certificate.noTemplate')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <style>{`
         .cert-table .ant-table-thead > tr > th {
            background: #fff;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
         }
         .cert-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid #f1f5f9;
            padding: 12px 16px;
         }
         .cert-table .ant-table-row:hover > td {
            background: #fffbeb !important;
         }
      `}</style>

      <div className="flex items-center gap-3 mb-4 border-b-2 border-slate-200 pb-2">
        <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
          <Award size={18} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900 m-0">{t('admin.classes.certificate.title')}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* LEFT COLUMN: Certificate Origin (Template Info) */}
        <div className="lg:col-span-1">
          <div className="border-2 border-black bg-neutral-900 text-white p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-10 -mr-10 -mt-10 pointer-events-none"></div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 border-b border-neutral-700 pb-2">{t('admin.classes.certificate.template')}</h4>

            <div className="text-2xl font-bold text-white mb-2 leading-tight">
              {template.name}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">{t('admin.classes.certificate.sourceCourse')}</div>
                <div className="flex items-center gap-2 text-yellow-400 font-bold">
                  <BookOpenIcon className="w-4 h-4" />
                  {template.courseName || t('admin.classes.certificate.currentCourse')}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500 font-mono">
                ID: {template.id} <br />
                Created: {dayjs(template.createdAt).format('YYYY-MM-DD')}
              </div>
            </div>

            <div className="absolute bottom-2 right-2 opacity-5">
              <FileBadge size={120} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Trainee Certificates List */}
        <div className="lg:col-span-2">
          <div className="border-2 border-slate-200 bg-white">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="font-bold text-slate-700 uppercase text-xs tracking-wider">{t('admin.classes.certificate.issuedCertificates')}</span>
              <span className="px-2 py-0.5 bg-black text-white text-xs font-bold rounded-full">
                {traineeCerts.length}
              </span>
            </div>
            <Table
              dataSource={traineeCerts}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <div className="py-8 text-slate-400 text-center italic">{t('admin.classes.certificate.noCertificates')}</div> }}
              className="cert-table"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for icon since I missed importing BookOpen in the main import destructuring (avoid conflict if any)
const BookOpenIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
)

export default ClassCertificate;