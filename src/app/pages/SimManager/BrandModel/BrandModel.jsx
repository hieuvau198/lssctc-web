import React, { useState, useEffect, useCallback } from 'react';
import { Button, Skeleton, Empty, App, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
  const [drawerMode, setDrawerMode] = useState('create'); // 'create', 'edit', 'view'
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

  // Drawer handlers
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
      if (e.errorFields) {
        // Form validation error
        return;
      }
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('simManager.brandModel.title')}</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          {t('simManager.brandModel.createBrandModel')}
        </Button>
      </div>

      {/* Content */}
      {brandModels.length === 0 ? (
        <Empty description={t('simManager.brandModel.noBrandModelsFound')} />
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

      {/* Drawer for Create/Edit/View */}
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
