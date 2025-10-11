import React from 'react';
import { Card } from 'antd';
import TraineeTable from './TraineeTable';

const ClassMembers = ({ classData }) => {
  return (
    <div className="mb-6 rounded-2xl shadow-xl">
      <Card title="Class Trainees" className="py-2">
        <TraineeTable classId={classData.id} />
      </Card>
    </div>
  );
};

export default ClassMembers;
