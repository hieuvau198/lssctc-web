import { PlusOutlined } from "@ant-design/icons";
import { Alert, App, Button, Drawer, Empty, Form, Input, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClass, deleteClass, fetchClasses } from "../../../apis/ProgramManager/ClassApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ClassList from "./partials/ClassList";
import AddClassForm from "./partials/AddClassForm";

const PMClasses = () => {
  const { message } = App.useApp();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = { page, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;

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
  }, [page, pageSize, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteClass(id);
      message.success("Class deleted successfully");
      // Refresh list
      const params = { page, pageSize };
      if (searchTerm) params.searchTerm = searchTerm;
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || "Delete failed");
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
      message.success('Class created successfully');
      // Refresh list
      const params = { page, pageSize };
      if (searchTerm) params.searchTerm = searchTerm;
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
      closeDrawer();
    } catch (err) {
      message.error(err?.message || 'Create failed');
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
        <span className="text-2xl">Class Management</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input.Search
          placeholder="Search classes..."
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          className="w-full md:w-80"
        />
        <div className="flex gap-2">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Class
          </Button>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {classes.length === 0 ? (
        <Empty description="No classes found." className="mt-16" />
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
        title="Create Class"
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