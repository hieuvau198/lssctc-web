import React, { useEffect, useState } from "react";
import {
  Input,
  Spin,
  Alert,
  Empty,
  Button,
  message,
  Form,
} from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  fetchPrograms,
  deleteProgram,
  fetchProgramDetail,
  createProgram,
  updateProgramBasic,
} from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ProgramTableView from "./partials/ProgramTableView";
import ProgramCardView from "./partials/ProgramCardView";
import ProgramDrawer from "./partials/ProgramDrawer";

const { Search } = Input;

const ManagerProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
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
        setPrograms(data.items);
        setTotal(data.totalCount || 0);
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
      // Refresh list
      fetchPrograms({ pageNumber, pageSize, searchTerm }).then((data) => {
        setPrograms(data.items);
        setTotal(data.totalCount || 0);
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
      // Refresh list
      const data = await fetchPrograms({ pageNumber, pageSize, searchTerm });
      setPrograms(data.items);
      setTotal(data.totalCount || 0);
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
      // Refresh list
      const data = await fetchPrograms({ pageNumber, pageSize, searchTerm });
      setPrograms(data.items);
      setTotal(data.totalCount || 0);
      // Update current program
      const updated = data.items.find(p => p.id === currentProgram.id);
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
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading programs..." />
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
        <h2 className="text-2xl font-bold">Program Management</h2>
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
          <Button.Group>
            <Button
              type={viewMode === "table" ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode("table")}
            />
            <Button
              type={viewMode === "card" ? "primary" : "default"}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode("card")}
            />
          </Button.Group>
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
