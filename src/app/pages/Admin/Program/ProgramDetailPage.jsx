import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { App, Skeleton, Popconfirm, Form } from "antd";
import { Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { fetchProgramDetail, deleteProgram, updateProgramBasic } from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ProgramDetailView from "./partials/ProgramDetailView";
import ProgramEditForm from "./partials/ProgramEditForm";

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
      <div className="relative w-full h-[320px] bg-neutral-900 group border-b-4 border-yellow-400">
        {program.backgroundImageUrl ? (
          <img
            src={program.backgroundImageUrl}
            alt="Background"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900 absolute inset-0">
            <div className="bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] absolute inset-0 opacity-20"></div>
          </div>
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:0_0,0_0] animate-gradient-xy opacity-20" />

        {/* Header Content on Banner */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-end gap-6 z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/admin/programs')}
                className="group flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-white/30 text-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all uppercase text-xs font-bold tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back')}
              </button>
              <div className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${program.isActive ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                {program.isActive ? t('common.active') : t('common.inactive')}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1.5 h-12 bg-yellow-400 self-stretch shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <div>
                <span className="text-4xl md:text-5xl font-black text-white m-0 tracking-tight uppercase shadow-sm">
                  {program.name}
                </span>
                <div className="text-neutral-400 text-sm mt-2 font-mono flex items-center gap-4">

                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Industrial Style */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-white font-semibold text-sm border-2 border-white hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => form.submit()}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold text-sm border-2 border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('common.save')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-white font-semibold text-sm border-2 border-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  {t('common.edit')}
                </button>
                <Popconfirm
                  title={t('admin.programs.deleteConfirmTitle')}
                  description={t('admin.programs.deleteConfirmDesc')}
                  onConfirm={handleDelete}
                  okButtonProps={{ loading: deleting, danger: true }}
                >
                  <button
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-red-400 font-semibold text-sm border-2 border-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                  >
                    {deleting ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {t('common.delete')}
                  </button>
                </Popconfirm>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isEditing ? (
          <div className="max-w-4xl">
            <ProgramEditForm
              form={form}
              onFinish={handleUpdate}
              onCancel={handleCancelEdit}
              submitting={submitting}
              hideButtons={true}
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