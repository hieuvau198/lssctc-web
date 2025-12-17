import { useTranslation } from 'react-i18next';
import { Calendar, Users, Clock, Hash, FileText, CheckCircle } from 'lucide-react';

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

  // Status styling for Light Wire theme
  const getStatusStyle = (status) => {
    const statusMap = {
      'Draft': { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300' },
      'Open': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' },
      'Inprogress': { bg: 'bg-yellow-400', text: 'text-black', border: 'border-black' },
      'Completed': { bg: 'bg-black', text: 'text-yellow-400', border: 'border-black' },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' },
    };
    return statusMap[status] || statusMap['Draft'];
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${t('instructor.classes.overview.days')}`;
  };

  const statusStyle = getStatusStyle(classData.status);

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400" />

      {/* Header */}
      <div className="p-6 border-b-2 border-neutral-200">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight m-0">
          {classData.name}
        </h2>
      </div>

      {/* Info Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Code */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Hash className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.classCode')}
              </span>
              <p className="text-lg font-mono font-black text-yellow-600 mt-1">{classData.classCode}</p>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.capacity')}
              </span>
              <p className="text-lg font-black text-black mt-1">{classData.capacity} {t('instructor.classes.overview.students')}</p>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.startDate')}
              </span>
              <p className="text-base font-bold text-black mt-1">{formatDate(classData.startDate)}</p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.endDate')}
              </span>
              <p className="text-base font-bold text-black mt-1">{formatDate(classData.endDate)}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.duration')}
              </span>
              <p className="text-lg font-black text-yellow-600 mt-1">{calculateDuration(classData.startDate, classData.endDate)}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.status')}
              </span>
              <div className="mt-2">
                <span className={`px-3 py-1 text-sm font-bold uppercase border-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                  {classData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="mt-4 p-4 bg-neutral-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                {t('instructor.classes.overview.description')}
              </span>
              <p className="text-base text-neutral-700 leading-relaxed mt-2">
                {classData.description || t('instructor.classes.overview.noDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
