import { App, Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { openClass, startClass, completeClass, cancelClass } from '../../apis/ProgramManager/ClassesApi';
import { getClassStatus } from '../../utils/classStatus';

const EditClassStatus = ({ classId, status, onSuccess }) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleStatusAction = async (action, actionName) => {
    setLoading(true);
    try {
      await action(classId);
      message.success(`Class ${actionName} successfully`);
      onSuccess?.(); // refresh parent data
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || `Failed to ${actionName} class`;
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = getClassStatus(status);

  switch (statusInfo.key) {
    case 'Draft':
      return (
        <>
          <Popconfirm
            title={t('class.publishConfirm')}
            description={t('class.publishConfirmDesc')}
            onConfirm={() => handleStatusAction(openClass, 'published')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button type="primary" loading={loading}>{t('class.publishClass')}</Button>
          </Popconfirm>
          <Popconfirm
            title={t('class.cancelConfirm')}
            description={t('class.cancelConfirmDesc')}
            onConfirm={() => handleStatusAction(cancelClass, 'cancelled')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger loading={loading}>{t('class.cancelClass')}</Button>
          </Popconfirm>
        </>
      );
    case 'Open':
      return (
        <Popconfirm
          title={t('class.startConfirm')}
          description={t('class.startConfirmDesc')}
          onConfirm={() => handleStatusAction(startClass, 'started')}
          okText={t('common.yes')}
          cancelText={t('common.no')}
        >
          <Button type="primary" loading={loading}>{t('class.startClass')}</Button>
        </Popconfirm>
      );
    case 'Inprogress':
      return (
        <Popconfirm
          title={t('class.completeConfirm')}
          description={t('class.completeConfirmDesc')}
          onConfirm={() => handleStatusAction(completeClass, 'completed')}
          okText={t('common.yes')}
          cancelText={t('common.no')}
        >
          <Button type="primary" loading={loading}>{t('class.completeClass')}</Button>
        </Popconfirm>
      );
    case 'Cancelled':
    case 'Completed':
      return null;
    default:
      return null;
  }
};

export default EditClassStatus;
