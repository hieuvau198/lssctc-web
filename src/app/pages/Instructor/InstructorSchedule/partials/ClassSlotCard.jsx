import { Card, Tag, Tooltip } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getClassStatus } from '../../../../utils/classStatus';

/**
 * ClassSlotCard - Component hiển thị thông tin một slot lớp học
 * @param {Object} scheduleItem - Thông tin lớp học
 * @param {Object} slot - Thông tin slot thời gian
 * @param {Function} onClick - Handler khi click vào card
 */
export default function ClassSlotCard({ scheduleItem, slot, onClick }) {
  const { t } = useTranslation();
  const statusInfo = getClassStatus(scheduleItem.status);

  const tooltipContent = (
    <div>
      <p><strong>{scheduleItem.className}</strong></p>
      <p>{t('instructor.schedule.room')}: {scheduleItem.room}</p>
      <p>{t('instructor.schedule.time')}: {slot.startTime} - {slot.endTime}</p>
    </div>
  );

  return (
    <Tooltip title={tooltipContent}>
      <Card
        size="small"
        hoverable
        onClick={onClick}
        className="cursor-pointer h-full"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold items-left text-blue-600 text-xs">
            {scheduleItem.classCode}
          </span>
          <span className="text-xs text-gray-700 truncate">
            {scheduleItem.name}
          </span>
          <Tag color={statusInfo?.color || 'default'} className="w-fit text-xs">
            {scheduleItem.status}
          </Tag>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <EnvironmentOutlined style={{ fontSize: '10px' }} />
            <span className="truncate">{scheduleItem.room}</span>
          </div>
        </div>
      </Card>
    </Tooltip>
  );
}
