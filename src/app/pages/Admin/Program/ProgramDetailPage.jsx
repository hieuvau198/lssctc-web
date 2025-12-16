import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button, App, Spin, Skeleton, Breadcrumb, Popconfirm, Card, Form } from "antd";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { fetchProgramDetail, deleteProgram, updateProgramBasic } from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ProgramDetailView from "./partials/ProgramDetailView";
import ProgramEditForm from "./partials/ProgramEditForm";
import BackButton from "../../../components/BackButton/BackButton";

const ProgramDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProgramDetail(id);
      setProgram(data);
    } catch (err) {
      message.error(err.message || "Failed to load program");
      navigate("/admin/programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleEdit = () => {
    form.setFieldsValue({
      name: program.name,
      description: program.description,
      durationHours: program.durationHours,
      imageUrl: program.imageUrl,
      isActive: program.isActive,
      backgroundImageUrl: program.backgroundImageUrl,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    setSubmitting(true);
    try {
      await updateProgramBasic(program.id, values);
      message.success(t('admin.programs.updateSuccess'));
      await loadData();
      setIsEditing(false);
    } catch (err) {
      message.error(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProgram(program.id);
      message.success(t('admin.programs.deleteSuccess'));
      navigate("/admin/programs");
    } catch (err) {
      message.error(err?.response?.data || err?.message || "Delete failed");
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8"><Skeleton active paragraph={{ rows: 10 }} /></div>;
  if (!program) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <BackButton />
            <div>
                <h1 className="text-2xl font-bold text-slate-800 m-0">
                    {isEditing ? t('admin.programs.editProgram') : program.name}
                </h1>
                <div className="text-sm text-slate-500">
                    ID: {program.id}
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            {isEditing ? (
                <>
                     <Button 
                        icon={<CloseOutlined />} 
                        onClick={handleCancelEdit} 
                        disabled={submitting}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={() => form.submit()} 
                        loading={submitting}
                    >
                        {t('common.save')}
                    </Button>
                </>
            ) : (
                <>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={handleEdit}
                    >
                        {t('common.edit')}
                    </Button>
                    <Popconfirm
                        title={t('admin.programs.deleteConfirmTitle')}
                        description={t('admin.programs.deleteConfirmDesc')}
                        onConfirm={handleDelete}
                        okButtonProps={{ loading: deleting, danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} loading={deleting}>
                            {t('common.delete')}
                        </Button>
                    </Popconfirm>
                </>
            )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
         {isEditing ? (
            <ProgramEditForm 
                form={form}
                onFinish={handleUpdate}
                onCancel={handleCancelEdit}
                submitting={submitting}
            />
         ) : (
            <ProgramDetailView program={program} />
         )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;