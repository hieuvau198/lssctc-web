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
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100 overflow-hidden">
      {/* Header - Industrial Style */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <FlaskConical className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('simManager.practices.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('simManager.practices.subtitle', 'Manage simulation practices')}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('./create')}
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <PlusOutlined className="group-hover:scale-110 transition-transform" />
            {t('simManager.practices.createPractice')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {practices.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 flex-1 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
            <div className="h-1 bg-yellow-400 w-full absolute top-0 left-0" />
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
    </div>
  );
}
