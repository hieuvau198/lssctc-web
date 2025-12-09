import { Card, Descriptions, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { getProgramName } from '../../../../mocks/instructorClasses';

const ClassOverview = ({ classData }) => {
  const { t } = useTranslation();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === '1' ? 'green' : 'orange';
  };

  const getStatusText = (status) => {
    return status === '1' ? 'Active' : 'Inactive';
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${t('instructor.classes.overview.days')}`;
  };

  return (
    <div className="mb-6 rounded-2xl shadow-xl">
      <Card className="py-80">
        <Descriptions
          title={
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold leading-tight m-0">{classData.name}</h2>
              </div>
            </div>
          }
          bordered
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          size="default"
          labelStyle={{ fontSize: 14, fontWeight: 600, paddingRight: 16, minWidth: 140 }}
          contentStyle={{ fontSize: 14 }}
        >
          <Descriptions.Item label={t('instructor.classes.overview.classCode')} span={1}>
            <span className="font-mono font-medium text-sm">{classData.classCode}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.capacity')} span={1}>
            <div className="text-sm">{classData.capacity} {t('instructor.classes.overview.students')}</div>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.startDate')} span={1}>
            <div className="text-sm">{formatDate(classData.startDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.endDate')} span={1}>
            <div className="text-sm">{formatDate(classData.endDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.duration')} span={1}>
            <div className="text-sm">{calculateDuration(classData.startDate, classData.endDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.status')} span={1}>
            <Tag color={getStatusColor(classData.status)} style={{ fontSize: 12, padding: '2px 8px' }}>
              {classData.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('instructor.classes.overview.description')} span={2}>
            <div
              className="overflow-y-auto pr-2 text-gray-700 leading-relaxed"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9', maxHeight: '40vh' }}
            >
              {classData.description || t('instructor.classes.overview.noDescription')}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ClassOverview;
