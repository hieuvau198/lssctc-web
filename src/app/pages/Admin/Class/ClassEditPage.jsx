import React, { useEffect, useState } from 'react';
import { App, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchClassDetail, updateClass } from '../../../apis/ProgramManager/ClassApi';
import EditDeleteClassForm from './partials/EditDeleteClassForm';

const ClassEditPage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchClassDetail(id)
      .then((d) => setClassItem(d))
      .catch((err) => message.error(err?.message || t('admin.classes.messages.loadFailed')))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (values) => {
    setSubmitting(true);
    try {
      await updateClass(id, values);
      message.success(t('admin.classes.messages.updateSuccess'));
      navigate(`/admin/class/${id}`);
    } catch (err) {
      message.error(err?.message || t('admin.classes.messages.updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!classItem) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <span className="text-xl font-semibold mb-4">{t('admin.classes.editTitle')}</span>
      <EditDeleteClassForm
        embedded
        classItem={classItem}
        onUpdate={handleUpdate}
        confirmLoading={submitting}
      />
    </div>
  );
};

export default ClassEditPage;
