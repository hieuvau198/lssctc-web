import { App, Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { openClass, startClass, completeClass, cancelClass } from '../../apis/ProgramManager/ClassesApi';
import { getClassStatus } from '../../utils/classStatus';

const EditClassStatus = ({ classId, status, onSuccess }) => {
  const { message } = App.useApp();
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
            title="Publish this class?"
            description="Are you sure you want to publish this class?"
            onConfirm={() => handleStatusAction(openClass, 'published')}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" loading={loading}>Publish Class</Button>
          </Popconfirm>
          <Popconfirm
            title="Cancel this class?"
            description="Are you sure you want to cancel this class?"
            onConfirm={() => handleStatusAction(cancelClass, 'cancelled')}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={loading}>Cancel Class</Button>
          </Popconfirm>
        </>
      );
    case 'Open':
      return (
        <Popconfirm
          title="Start this class?"
          description="Are you sure you want to start this class?"
          onConfirm={() => handleStatusAction(startClass, 'started')}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={loading}>Start Class</Button>
        </Popconfirm>
      );
    case 'Inprogress':
      return (
        <Popconfirm
          title="Complete this class?"
          description="Are you sure you want to complete this class?"
          onConfirm={() => handleStatusAction(completeClass, 'completed')}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={loading}>Complete Class</Button>
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
