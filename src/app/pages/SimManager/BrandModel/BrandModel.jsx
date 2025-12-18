import React, { useState, useEffect, useCallback } from 'react';
import { Button, Empty, App, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Truck } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getBrandModels,
  createBrandModel,
  updateBrandModel,
  deleteBrandModel,
  getBrandModelById,
} from '../../../apis/SimulationManager/SimulationManagerBrandModel';
import BrandModelTable from './partials/BrandModelTable';
import BrandModelDrawerForm from './partials/BrandModelDrawerForm';

export default function BrandModel() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [brandModels, setBrandModels] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create');
  const [currentBrand, setCurrentBrand] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form] = Form.useForm();

  const loadBrandModels = useCallback(async (page = pageNumber, size = pageSize) => {
    setLoading(true);
    try {
      const data = await getBrandModels({ page, pageSize: size });
      setBrandModels(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error('Failed to load brand models', e);
      message.error(t('simManager.brandModel.failedToLoad'));
      setBrandModels([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, message, t]);

  useEffect(() => {
    loadBrandModels();
  }, [loadBrandModels]);

  const handleCreate = () => {
    setDrawerMode('create');
    setCurrentBrand(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleView = async (record) => {
    setDrawerMode('view');
    setDrawerLoading(true);
    setDrawerVisible(true);
    try {
      const data = await getBrandModelById(record.id);
      setCurrentBrand(data);
      form.setFieldsValue(data);
    } catch (e) {
      console.error('Failed to load brand model details', e);
      message.error(t('simManager.brandModel.failedToLoadDetails'));
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleEdit = async (record) => {
    setDrawerMode('edit');
    setDrawerLoading(true);
    setDrawerVisible(true);
    try {
      const data = await getBrandModelById(record.id);
      setCurrentBrand(data);
      form.setFieldsValue(data);
    } catch (e) {
      console.error('Failed to load brand model details', e);
      message.error(t('simManager.brandModel.failedToLoadDetails'));
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: t('simManager.brandModel.confirmDelete'),
      content: t('simManager.brandModel.deleteContent', { name: record.name }),
      okText: t('simManager.brandModel.delete'),
      okType: 'danger',
      onOk: async () => {
        setDeleting(record.id);
        try {
          await deleteBrandModel(record.id);
          message.success(t('simManager.brandModel.deleteSuccess'));
          await loadBrandModels(pageNumber, pageSize);
        } catch (e) {
          console.error('Failed to delete brand model', e);
          let errorMsg = t('simManager.brandModel.failedToDelete');
          if (e.response?.data?.error?.details?.exceptionMessage) {
            errorMsg = e.response.data.error.details.exceptionMessage;
          } else if (e.response?.data?.error?.message) {
            errorMsg = e.response.data.error.message;
          } else if (e.response?.data?.message) {
            errorMsg = e.response.data.message;
          } else if (e.message) {
            errorMsg = e.message;
          }
          message.error(errorMsg);
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setCurrentBrand(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setDrawerLoading(true);

      if (drawerMode === 'create') {
        await createBrandModel(values);
        message.success(t('simManager.brandModel.createSuccess'));
      } else if (drawerMode === 'edit') {
        await updateBrandModel(currentBrand.id, values);
        message.success(t('simManager.brandModel.updateSuccess'));
      }

      await loadBrandModels(pageNumber, pageSize);
      handleDrawerClose();
    } catch (e) {
      if (e.errorFields) return;
      console.error('Failed to save brand model', e);
      let errorMsg = t('simManager.brandModel.failedToSave');
      if (e.response?.data?.error?.details?.exceptionMessage) {
        errorMsg = e.response.data.error.details.exceptionMessage;
      } else if (e.response?.data?.error?.message) {
        errorMsg = e.response.data.error.message;
      } else if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      } else if (e.message) {
        errorMsg = e.message;
      }
      message.error(errorMsg);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleSwitchToEdit = () => {
    setDrawerMode('edit');
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header - Industrial Style */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <Truck className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('simManager.brandModel.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('simManager.brandModel.subtitle', 'Manage crane brands and models')}
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <PlusOutlined className="group-hover:scale-110 transition-transform" />
            {t('simManager.brandModel.createBrandModel')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {brandModels.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 flex-1 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
            <div className="h-1 bg-yellow-400 w-full absolute top-0 left-0" />
            <Empty description={t('simManager.brandModel.noBrandModelsFound')} />
          </div>
        ) : (
          <BrandModelTable
            data={brandModels}
            loading={loading}
            deleting={deleting}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              current: pageNumber,
              pageSize: pageSize,
              total: total,
              onChange: (page, size) => {
                setPageNumber(page);
                setPageSize(size);
                setSearchParams({ page: page.toString(), pageSize: size.toString() });
                loadBrandModels(page, size);
              },
            }}
          />
        )}
      </div>

      {/* Drawer */}
      <BrandModelDrawerForm
        visible={drawerVisible}
        mode={drawerMode}
        loading={drawerLoading}
        form={form}
        onClose={handleDrawerClose}
        onSubmit={handleSubmit}
        onSwitchToEdit={handleSwitchToEdit}
      />
    </div>
  );
}
