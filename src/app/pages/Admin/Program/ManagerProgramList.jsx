import {
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  message,
  Skeleton
} from "antd";
import { useEffect, useState } from "react";
import {
  createProgram,
  deleteProgram,
  fetchProgramDetail,
  fetchPrograms,
  updateProgramBasic,
} from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ProgramCardView from "./partials/ProgramCardView";
import ProgramDrawer from "./partials/ProgramDrawer";
import ProgramTableView from "./partials/ProgramTableView";

// const { Search } = Input;

const ManagerProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null); // 'view' | 'create' | 'edit'
  const [currentProgram, setCurrentProgram] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    fetchPrograms({ pageNumber, pageSize, searchTerm })
      .then((data) => {
        // normalize response: some APIs return an array, others return { items, totalCount }
        const resp = Array.isArray(data) ? { items: data, totalCount: data.length } : (data || {});
        setPrograms(resp.items || []);
        setTotal(resp.totalCount || resp.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, pageSize, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProgram(id);
      message.success("Program deleted successfully");
      // Refresh list (normalize response)
      fetchPrograms({ pageNumber, pageSize, searchTerm }).then((data) => {
        const resp = Array.isArray(data) ? { items: data, totalCount: data.length } : (data || {});
        setPrograms(resp.items || []);
        setTotal(resp.totalCount || resp.total || 0);
      });
      // Close drawer if current program is deleted
      if (currentProgram?.id === id) {
        closeDrawer();
      }
    } catch (err) {
      message.error(
        err?.response?.data?.message || err?.message || "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Drawer handlers
  const openCreate = () => {
    setDrawerMode('create');
    setCurrentProgram(null);
    createForm.resetFields();
    setDrawerOpen(true);
  };

  const openView = async (program) => {
    setDrawerMode('view');
    setCurrentProgram(program);
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchProgramDetail(program.id);
      setCurrentProgram(detail);
    } catch (err) {
      message.error(err.message || 'Failed to load program detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const openEdit = async (program) => {
    setDrawerMode('edit');
    setCurrentProgram(program);
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchProgramDetail(program.id);
      setCurrentProgram(detail);
      editForm.setFieldsValue({
        name: detail.name,
        description: detail.description,
        durationHours: detail.durationHours,
        imageUrl: detail.imageUrl,
        isActive: detail.isActive,
      });
    } catch (err) {
      message.error(err.message || 'Failed to load program detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const switchToEdit = () => {
    setDrawerMode('edit');
    if (currentProgram) {
      editForm.setFieldsValue({
        name: currentProgram.name,
        description: currentProgram.description,
        durationHours: currentProgram.durationHours,
        imageUrl: currentProgram.imageUrl,
        isActive: currentProgram.isActive,
      });
    }
  };

  const switchToView = () => {
    setDrawerMode('view');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setCurrentProgram(null);
    createForm.resetFields();
    editForm.resetFields();
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await createProgram(values);
      message.success('Program created successfully');
  // Refresh list (normalize response)
  const data = await fetchPrograms({ pageNumber, pageSize, searchTerm });
  const resp = Array.isArray(data) ? { items: data, totalCount: data.length } : (data || {});
  setPrograms(resp.items || []);
  setTotal(resp.totalCount || resp.total || 0);
      closeDrawer();
    } catch (err) {
      message.error(err.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values) => {
    if (!currentProgram) return;
    setSubmitting(true);
    try {
      await updateProgramBasic(currentProgram.id, values);
      message.success('Program updated successfully');
  // Refresh list (normalize response)
  const data = await fetchPrograms({ pageNumber, pageSize, searchTerm });
  const resp = Array.isArray(data) ? { items: data, totalCount: data.length } : (data || {});
  setPrograms(resp.items || []);
  setTotal(resp.totalCount || resp.total || 0);
      // Update current program
      const updated = data.items?.find(p => p.id === currentProgram.id);
      setCurrentProgram(updated || null);
      setDrawerMode('view');
    } catch (err) {
      message.error(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 200, height: 32 }} active />
        </div>

        {/* Search and Controls Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton.Input style={{ width: 320, height: 40 }} active />
          <div className="flex gap-2">
            <Skeleton.Button style={{ width: 120, height: 40 }} active />
            <Skeleton.Button style={{ width: 80, height: 40 }} active />
          </div>
        </div>

        {/* Content Skeleton - Default to table view skeleton */}
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl">Program Management</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input.Search
          placeholder="Search programs..."
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          className="w-1/3"
        />
        <div className="flex gap-2">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Program
          </Button>
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Content */}
      {programs.length === 0 ? (
        <Empty description="No programs found." className="mt-16" />
      ) : (
        <>
          {viewMode === "table" ? (
            <ProgramTableView
              programs={programs}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onView={openView}
              onEdit={openEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ) : (
            <ProgramCardView
              programs={programs}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onView={openView}
              onEdit={openEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </>
      )}

      {/* Drawer */}
      <ProgramDrawer
        open={drawerOpen}
        mode={drawerMode}
        currentProgram={currentProgram}
        createForm={createForm}
        editForm={editForm}
        submitting={submitting}
        detailLoading={detailLoading}
        deletingId={deletingId}
        onClose={closeDrawer}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onSwitchToEdit={switchToEdit}
        onSwitchToView={switchToView}
      />
    </div>
  );
};

export default ManagerProgramList;
