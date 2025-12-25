// hieuvau198/lssctc-web/lssctc-web-dev/src/app/pages/Admin/Material/MaterialManagement.jsx

import React, { useState, useEffect } from 'react';
import { App, Drawer, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Trash2, Edit, FileText, Link as LinkIcon, ExternalLink, X, BookOpen, Download } from 'lucide-react';
import { getMaterialsPaged, deleteMaterial, createMaterial, createMaterialWithFile, updateMaterial, updateMaterialWithFile } from '../../../apis/Instructor/InstructorMaterialsApi';
import IndustrialTable from '../../../components/Common/IndustrialTable';
import MaterialForm from './partials/MaterialForm';

const MaterialManagement = () => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();

  // Data States
  const [materials, setMaterials] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // View/Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer/Edit States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when params change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMaterialsPaged({
        page,
        pageSize,
        searchTerm: debouncedSearch
      });
      setMaterials(res.items || []);
      setTotalCount(res.totalCount || 0);
    } catch (error) {
      message.error(t('material.fetchError'));
      setMaterials([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: t('material.deleteConfirm'),
      content: t('material.deleteWarning'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteMaterial(id);
          message.success(t('material.deleteSuccess'));
          // Refresh current page if possible, or go back to 1
          fetchData();
        } catch (error) {
          message.error(error.message || t('material.deleteError'));
        }
      },
    });
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditingMaterial(null);
    setDrawerOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      const isFile = values.learningMaterialType === 'File';
      const isEdit = !!editingMaterial;

      let apiCall;

      if (isFile) {
        // Prepare FormData for file upload
        const formData = new FormData();
        // Fix: Use camelCase keys to match payload convention and likely API model binding
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('learningMaterialType', values.learningMaterialType);

        if (values.file) {
          formData.append('file', values.file);
        }

        if (isEdit) {
          apiCall = () => updateMaterialWithFile(editingMaterial.id, formData);
        } else {
          apiCall = () => createMaterialWithFile(formData);
        }
      } else {
        // JSON payload for URL
        const payload = {
          name: values.name,
          description: values.description,
          learningMaterialType: values.learningMaterialType,
          materialUrl: values.url
        };

        if (isEdit) {
          apiCall = () => updateMaterial(editingMaterial.id, payload);
        } else {
          apiCall = () => createMaterial(payload);
        }
      }

      await apiCall();
      message.success(isEdit ? t('material.updateSuccess') : t('material.createSuccess'));
      setDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error(error.message || (editingMaterial ? t('material.updateError') : t('material.createError')));
    } finally {
      setSubmitting(false);
    }
  };

  // Columns for IndustrialTable
  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border border-black flex items-center justify-center text-black">
            {record.learningMaterialType === 'File' ? <FileText size={20} /> : <LinkIcon size={20} />}
          </div>
          <div>
            <div className="font-bold text-base">{text}</div>
            <div className="text-xs text-neutral-500 truncate max-w-[200px]">{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: t('common.type'),
      dataIndex: 'learningMaterialType',
      key: 'learningMaterialType',
      width: 120,
      render: (type) => (
        <span className="px-2 py-1 bg-neutral-200 border border-black text-xs font-bold uppercase">
          {type === 'Video' ? t('material.video') : t('material.document')}
        </span>
      )
    },
    {
      title: t('material.access'),
      key: 'link',
      width: 100,
      render: (_, record) => (
        record.url ? (
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline"
          >
            {record.learningMaterialType === 'File' ? <Download size={14} /> : <ExternalLink size={14} />}
            {record.learningMaterialType === 'File' ? t('common.download') : t('material.visit')}
          </a>
        ) : <span className="text-neutral-400 italic">{t('material.noLink')}</span>
      )
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Tooltip title={t('common.edit')}>
            <button
              onClick={() => handleEdit(record)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-black hover:bg-yellow-400 transition-colors"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <button
              onClick={() => handleDelete(record.id)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-black hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col pb-2">
      {/* Header - Industrial Theme */}
      <div className="bg-neutral-800 border-2 border-black px-4 py-3 mb-0 flex-none z-10">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-3 mb-3" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('sidebar.materials')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {totalCount} {t('material.items')}
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('material.addMaterial')}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white flex-1 flex flex-col min-h-0">

        {/* Search Bar */}
        <div className="px-4 py-2 bg-white border-b-2 border-neutral-200 flex-none shadow-sm z-10">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('material.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black font-medium text-sm text-black placeholder-neutral-400 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-2 flex items-center text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 flex-1 overflow-hidden bg-white relative p-0 ">
          <IndustrialTable
            loading={loading}
            dataSource={materials}
            columns={columns}
            rowKey="id"
            pagination={true}
            page={page}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
            scroll={{ y: 'calc(100vh - 345px)' }}
            className="h-full border-none"
          />
        </div>
      </div>

      {/* Edit/Add Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={500}
        title={null}
        closable={false}
        destroyOnClose
        styles={{ header: { display: 'none' }, body: { padding: 0 } }}
      >
        <div className="h-full flex flex-col">
          <div className="bg-black px-6 py-4 flex items-center justify-between flex-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                {editingMaterial ? <Edit className="w-5 h-5 text-black" /> : <Plus className="w-5 h-5 text-black" />}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white m-0">
                  {editingMaterial ? t('material.editMaterial') : t('material.newMaterial')}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="h-1 bg-yellow-400 flex-none" />

          <div className="flex-1 overflow-y-auto p-6">
            <MaterialForm
              initialValues={editingMaterial}
              onFinish={handleFormSubmit}
              loading={submitting}
              onCancel={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MaterialManagement;