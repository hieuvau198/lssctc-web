import { Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * StatusLegend - Component hiển thị chú thích trạng thái lớp học
 */
export default function StatusLegend() {
  const { t } = useTranslation();

  const statuses = [
    { key: 'Draft', color: 'default' },
    { key: 'Open', color: 'blue' },
    { key: 'Inprogress', color: 'orange' },
    { key: 'Completed', color: 'green' },
    { key: 'Cancelled', color: 'red' },
  ];

  return (
    <div className="mt-4">
      <Space size="middle" wrap>
        <span className="text-sm text-gray-600 font-medium">
          {t('instructor.schedule.legend')}:
        </span>
        {statuses.map((status) => (
          <Tag key={status.key} color={status.color}>
            {t(`common.classStatus.${status.key}`)}
          </Tag>
        ))}
      </Space>
    </div>
  );
}
