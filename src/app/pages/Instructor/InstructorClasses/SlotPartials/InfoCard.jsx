import { Button, Card, Divider, Tag } from 'antd';
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, Save, Users, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InfoCard({ slotInfo, timeslotId, summary, handleMarkAll, handleBack, handleSubmit, submitting }) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-4 z-40">
      <Card className="shadow-sm">
        <div className="space-y-4">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">{t('attendance.takeAttendance', 'Điểm danh')}</h2>
            {slotInfo.className && <p className="text-gray-600 font-medium">{slotInfo.className}</p>}
          </div>

          <Divider className="my-2" />

          {(slotInfo.date || slotInfo.startTime) && (
            <>
              <div className="grid grid-cols-2 gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">{slotInfo.date}</div>
                    <div className="text-xs text-gray-500">{t('attendance.date', 'Ngày')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">{slotInfo.startTime} - {slotInfo.endTime}</div>
                    <div className="text-xs text-gray-500">{t('attendance.time', 'Giờ')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">{slotInfo.room}</div>
                    <div className="text-xs text-gray-500">{t('attendance.location', 'Phòng')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 flex items-center justify-center text-blue-600">#</div>
                  <div>
                    <div className="text-sm font-medium">Học tập trung</div>
                  </div>
                </div>
              </div>
              <Divider className="my-2" />
            </>
          )}

          <div>
            <span className="text-base font-semibold text-gray-900">{t('attendance.summary', 'Tổng kết')}</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{t('attendance.totalStudents', 'Tổng học viên của lớp:')}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 px-3 py-1">{summary.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">{t('attendance.present', 'Có mặt')}</span>
                </div>
                <Tag color="success" className="text-base px-3 py-1">{summary.present}</Tag>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-gray-700">{t('attendance.absent', 'Vắng')}</span>
                </div>
                <Tag color="error" className="text-base px-3 py-1">{summary.absent}</Tag>
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">{t('attendance.quickActions', 'Thao tác nhanh')}</h3>
            <div className="flex items-center gap-x-2">
              <Button
                block
                size="large"
                onClick={() => handleMarkAll('present')}
                icon={<CheckCircle className="w-4 h-4" />}
                className="flex items-center justify-center gap-2"
              >
                {t('attendance.markAllPresent', 'Đánh dấu tất cả có mặt')}
              </Button>
              <Button
                block
                size="large"
                onClick={() => handleMarkAll('absent')}
                icon={<XCircle className="w-4 h-4" />}
                className="flex items-center justify-center gap-2"
              >
                {t('attendance.markAllAbsent', 'Đánh dấu tất cả vắng')}
              </Button>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="flex items-center gap-x-2 ">
            <Button block size="large" onClick={handleBack} className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              {t('common.cancel', 'Hủy')}
            </Button>
            <Button block type="primary" size="large" onClick={handleSubmit} loading={submitting} className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {t('attendance.submitAttendance', 'Lưu điểm danh')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
