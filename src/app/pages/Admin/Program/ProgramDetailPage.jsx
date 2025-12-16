import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button, App, Skeleton, Popconfirm, Form, Tag } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
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
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Background Section */}
      <div className="relative w-full h-[300px] bg-slate-200 group">
        {program.backgroundImageUrl ? (
          <img 
            src={program.backgroundImageUrl} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Background Image
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Header Content on Banner */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <BackButton className="text-white hover:text-slate-200" />
                    <Tag color={program.isActive ? 'green' : 'red'} className="border-none">
                        {program.isActive ? t('common.active') : t('common.inactive')}
                    </Tag>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white m-0 shadow-sm">
                    {program.name}
                </h1>
                <div className="text-slate-300 text-sm mt-1 opacity-90">
                    ID: {program.id}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                {isEditing ? (
                    <>
                        <Button 
                            ghost
                            icon={<CloseOutlined />} 
                            onClick={handleCancelEdit} 
                            disabled={submitting}
                            className="text-white border-white hover:text-red-400 hover:border-red-400"
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
                            ghost
                            icon={<EditOutlined />} 
                            onClick={handleEdit}
                            className="text-white border-white hover:text-blue-400 hover:border-blue-400"
                        >
                            {t('common.edit')}
                        </Button>
                        <Popconfirm
                            title={t('admin.programs.deleteConfirmTitle')}
                            description={t('admin.programs.deleteConfirmDesc')}
                            onConfirm={handleDelete}
                            okButtonProps={{ loading: deleting, danger: true }}
                        >
                            <Button 
                                danger 
                                ghost 
                                icon={<DeleteOutlined />} 
                                loading={deleting}
                                className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                                {t('common.delete')}
                            </Button>
                        </Popconfirm>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Main Content Body - No border, no rounding */}
      <div className="max-w-7xl mx-auto px-4 py-8">
         {isEditing ? (
            <div className="max-w-4xl">
                 <ProgramEditForm 
                    form={form}
                    onFinish={handleUpdate}
                    onCancel={handleCancelEdit}
                    submitting={submitting}
                />
            </div>
         ) : (
            <ProgramDetailView program={program} />
         )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;