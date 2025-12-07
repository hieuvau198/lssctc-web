import { PlusOutlined } from "@ant-design/icons";
import { Alert, App, Button, Drawer, Empty, Form, Input, Skeleton, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClass, deleteClass, fetchClasses } from "../../../apis/ProgramManager/ClassesApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ClassList from "./partials/ClassList";
import AddClassForm from "./partials/AddClassForm";
const { Option } = Select;

const PMClasses = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
  const [status, setStatus] = useState(searchParams.get('status') || undefined);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'startDate');
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: page,
      pageSize,
      searchTerm,
      status,
      sortBy,
      sortDirection
    };

    // Clean undefined params
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    fetchClasses(params)
      .then((data) => {
        setClasses(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch classes");
        setLoading(false);
      });
  }, [page, pageSize, searchTerm, status, sortBy, sortDirection]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    updateSearchParams({ searchTerm: value, page: '1' });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
    updateSearchParams({ status: value, page: '1' });
  };

  const handleSortChange = (value) => {
    const [field, direction] = value.split('_');
    setSortBy(field);
    setSortDirection(direction);
    setPage(1);
    updateSearchParams({ sortBy: field, sortDirection: direction, page: '1' });
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
    updateSearchParams({ page: newPage.toString(), pageSize: newPageSize.toString() });
  };

  const updateSearchParams = (newParams) => {
    const currentParams = {};
    searchParams.forEach((value, key) => { currentParams[key] = value; });

    const updatedParams = { ...currentParams, ...newParams };

    // Remove undefined/empty values
    Object.keys(updatedParams).forEach(key => {
      if (updatedParams[key] === undefined || updatedParams[key] === null || updatedParams[key] === "") {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteClass(id);
      message.success(t('admin.classes.deleteSuccess'));
      // Refresh list
      // Refresh list
      const params = {
        pageNumber: page,
        pageSize,
        searchTerm,
        status,
        sortBy,
        sortDirection
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || t('admin.classes.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    createForm.resetFields();
    setDrawerOpen(true);
  };
  const openView = (classItem) => navigate(`/admin/class/${classItem.id}`);
  const openEdit = (classItem) => navigate(`/admin/class/${classItem.id}/edit`);

  const closeDrawer = () => {
    setDrawerOpen(false);
    createForm.resetFields();
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await createClass(values);
      message.success(t('admin.classes.createSuccess'));
      // Refresh list
      // Refresh list
      const params = {
        pageNumber: page,
        pageSize,
        searchTerm,
        status,
        sortBy,
        sortDirection
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
      closeDrawer();
    } catch (err) {
      message.error(err?.message || t('admin.classes.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 200, height: 32 }} active />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton.Input style={{ width: 320, height: 40 }} active />
          <div className="flex gap-2">
            <Skeleton.Button style={{ width: 120, height: 40 }} active />
            <Skeleton.Button style={{ width: 80, height: 40 }} active />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-b-0">
              <Skeleton.Avatar size={48} shape="square" active />
              <div className="flex-1">
                <Skeleton.Input style={{ width: '60%', height: 20, marginBottom: 8 }} active />
                <Skeleton.Input style={{ width: '40%', height: 16 }} active />
              </div>
              <div className="flex gap-2">
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl">{t('admin.classes.title')}</span>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto items-center flex-1">
          {/* Search */}
          <Input.Search
            placeholder={t('admin.classes.searchPlaceholder') || "Search classes..."}
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ width: '100%', maxWidth: 600 }}
            className="md:w-[600px]"
          />

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto">
            <Select
              placeholder={t('admin.classes.filters.status') || "Status"}
              allowClear
              value={status}
              onChange={handleStatusChange}
              style={{ width: 150 }}
            >
              <Option value="Draft">{t('common.classStatus.Draft') || "Draft"}</Option>
              <Option value="Open">{t('common.classStatus.Open') || "Open"}</Option>
              <Option value="Inprogress">{t('common.classStatus.Inprogress') || "In Progress"}</Option>
              <Option value="Completed">{t('common.classStatus.Completed') || "Completed"}</Option>
              <Option value="Cancelled">{t('common.classStatus.Cancelled') || "Cancelled"}</Option>
            </Select>
            <Select
              placeholder={t('admin.classes.filters.sortByDate') || "Sort Date"}
              value={`${sortBy}_${sortDirection}`}
              onChange={handleSortChange}
              style={{ width: 280 }}
            >
              <Option value="startDate_desc">{t('admin.classes.filters.startDateNewest') || "Latest Start Date"}</Option>
              <Option value="startDate_asc">{t('admin.classes.filters.startDateOldest') || "Earliest Start Date"}</Option>
              <Option value="endDate_desc">{t('admin.classes.filters.endDateNewest') || "Latest End Date"}</Option>
              <Option value="endDate_asc">{t('admin.classes.filters.endDateOldest') || "Earliest End Date"}</Option>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('admin.classes.addClass')}
          </Button>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {classes.length === 0 ? (
        <Empty description={t('admin.classes.noClasses')} className="mt-16" />
      ) : (
        <ClassList
          classes={classes}
          viewMode={viewMode}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {/* Drawer for Add Class */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={t('admin.classes.createClass')}
        destroyOnClose
      >
        <AddClassForm
          embedded
          open={drawerOpen}
          onCancel={closeDrawer}
          onCreate={handleCreate}
          confirmLoading={submitting}
        />
      </Drawer>
    </div>
  );
};

export default PMClasses;