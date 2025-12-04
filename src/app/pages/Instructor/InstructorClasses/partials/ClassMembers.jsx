import React from 'react';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';

const ClassMembers = ({ classId }) => {
  const { t } = useTranslation();
  // This section is under construction.
  return (
    <div className="p-4">
      <Alert
        message={t('instructor.classes.members.underConstruction')}
        description={t('instructor.classes.members.underConstructionDesc')}
        type="info"
        showIcon
      />
    </div>
  );
};

export default ClassMembers;