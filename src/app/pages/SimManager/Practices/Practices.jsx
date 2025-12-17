// src\app\pages\SimManager\Practices\Practices.jsx
import React, { useEffect, useState } from 'react';
import { Empty, App, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PracticeTable from './partials/PracticeTable';
import { getPractices, deletePractice } from '../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Practices() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async (p = pageNumber, ps = pageSize) => {
    setLoading(true);
    try {
      const data = await getPractices(p, ps);
      setPractices(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      message.error(t('simManager.practices.failedToLoad'));
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: t('simManager.practices.confirmDelete'),
      content: t('simManager.practices.confirmDeleteDesc', { name: record.practiceName }),
      okText: t('common.delete'),
      okType: 'danger',
      onOk: async () => {
        setDeleting(record.id);
        try {
          await deletePractice(record.id);
          message.success(t('simManager.practices.deleteSuccess'));
          await load(pageNumber, pageSize);
        } catch (err) {
          let errorMsg = t('simManager.practices.deleteFailed');
          if (err.response?.data?.error?.details?.exceptionMessage) {
            errorMsg = err.response.data.error.details.exceptionMessage;
          } else if (err.response?.data?.error?.message) {
            errorMsg = err.response.data.error.message;
          } else if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
          } else if (err.message) {
            errorMsg = err.message;
          }
          message.error(errorMsg);
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Industrial Style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-2xl font-black uppercase tracking-tight text-neutral-900">
              {t('simManager.practices.title')}
            </span>
            <p className="text-sm text-neutral-500">
              {t('simManager.practices.subtitle', 'Manage simulation practices')}
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate('./create')}
          className="h-12 px-6 bg-yellow-400 text-black font-bold uppercase tracking-wider cursor-pointer hover:bg-black hover:text-yellow-400 transition-all flex items-center gap-2"
        >
          <PlusOutlined />
          {t('simManager.practices.createPractice')}
        </div>
      </div>

      {/* Content */}
      {practices.length === 0 ? (
        <div className="border-2 border-neutral-200 bg-white p-12">
          <Empty description={t('simManager.practices.noPractices')} />
        </div>
      ) : (
        <PracticeTable
          data={practices}
          loading={loading}
          deleting={deleting}
          onView={(record) => navigate(`../practices/${record.id}`)}
          onDelete={handleDelete}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
              setSearchParams({ page: page.toString(), pageSize: size.toString() });
              load(page, size);
            },
          }}
        />
      )}
    </div>
  );
}
