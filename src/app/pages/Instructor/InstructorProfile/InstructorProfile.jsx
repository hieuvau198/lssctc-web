import { User, Mail, Phone, Calendar, IdCard, Award, Briefcase, Shield, Edit } from 'lucide-react';
import { Avatar, Button, Skeleton, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getInstructorProfileByUserId } from '../../../apis/Instructor/InstructorProfileApi';

export default function InstructorProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgErr, setImgErr] = useState(false);

  const { nameid } = useAuthStore();
  const token = getAuthToken();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError(t('instructor.profile.error.tokenNotFound'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Decode token to get user ID
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(token);
        const userId = decoded.nameid || decoded.nameId || decoded.sub;

        if (!userId) {
          throw new Error(t('instructor.profile.error.userIdNotFound'));
        }

        console.log('=== Instructor Profile Fetch Debug ===');
        console.log('📡 Fetching profile for userId:', userId);

        // Fetch instructor profile
        const fullProfile = await getInstructorProfileByUserId(userId, token);
        console.log('✅ Success:', fullProfile);

        setProfileData(fullProfile);
        setError(null);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message || t('instructor.profile.error.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, t]);

  // Map role number to string
  const getRoleName = (roleNumber) => {
    const roles = {
      1: t('instructor.profile.roles.admin'),
      2: t('instructor.profile.roles.instructor'),
      3: t('instructor.profile.roles.simulationManager'),
      4: t('instructor.profile.roles.trainee')
    };
    return roles[roleNumber] || t('instructor.profile.roles.unknown');
  };

  const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    return isNaN(d) ? '-' : d.toLocaleDateString('vi-VN');
  };

  // Info Item Component
  const InfoItem = ({ icon: Icon, label, value, iconColor = "text-blue-500" }) => (
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-slate-700 font-semibold mt-0.5 truncate">{value || '-'}</div>
      </div>
    </div>
  );

  const fullName = profileData?.fullname || 'Instructor';
  const initial = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'I';
  const status = profileData?.isInstructorActive ? 'Active' : 'Inactive';

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <Skeleton avatar active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <Alert
              message={t('instructor.profile.error.errorLoadingProfile')}
              description={error}
              type="error"
              showIcon
            />
            <Button className="mt-4" onClick={() => navigate(-1)}>
              {t('common.back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <div className="text-center text-slate-500">{t('instructor.profile.instructorNotFound')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Hero Card */}
          <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
            {/* Gradient Top Bar */}
            <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar with Ring */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 p-1 shadow-lg shadow-blue-500/25">
                    {profileData?.avatarUrl && !imgErr ? (
                      <img
                        src={profileData.avatarUrl}
                        alt={fullName}
                        className="w-full h-full rounded-full object-cover bg-white"
                        onError={() => setImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{initial}</span>
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className={`absolute -bottom-1 -right-1 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {status}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                    {fullName}
                  </h1>
                  <p className="text-slate-500 mt-1">{profileData?.email || '-'}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                      {getRoleName(profileData?.role)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                      {profileData?.instructorCode || 'N/A'}
                    </span>
                    {profileData?.experienceYears && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {profileData.experienceYears} năm KN
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  type="primary"
                  size="large"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => navigate('/instructor/profile/edit')}
                  className="!rounded-xl !font-semibold !flex !items-center !gap-2"
                >
                  {t('instructor.profile.editProfile')}
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                {t('instructor.profile.personalInformation')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem icon={User} label={t('instructor.profile.form.fullName')} value={profileData?.fullname} iconColor="text-blue-500" />
                <InfoItem icon={Mail} label={t('instructor.profile.form.email')} value={profileData?.email} iconColor="text-indigo-500" />
                <InfoItem icon={Phone} label={t('instructor.profile.form.phone')} value={profileData?.phoneNumber} iconColor="text-purple-500" />
                <InfoItem icon={Shield} label={t('instructor.profile.form.role')} value={getRoleName(profileData?.role)} iconColor="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-indigo-500" />
                {t('instructor.profile.professionalDetails')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem icon={IdCard} label={t('instructor.profile.form.instructorCode')} value={profileData?.instructorCode} iconColor="text-indigo-500" />
                <InfoItem icon={Award} label={t('instructor.profile.form.experienceYears')} value={`${profileData?.experienceYears || 0} năm`} iconColor="text-purple-500" />
                <InfoItem icon={Calendar} label={t('instructor.profile.form.hireDate')} value={fmtDate(profileData?.hireDate)} iconColor="text-blue-500" />
                <InfoItem
                  icon={Shield}
                  label={t('instructor.profile.form.status')}
                  value={
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${profileData?.isInstructorActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {profileData?.isInstructorActive ? t('common.active') : t('common.inactive')}
                    </span>
                  }
                  iconColor="text-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Biography Section */}
          {profileData?.biography && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                  {t('instructor.profile.biography')}
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {profileData.biography}
                </p>
              </div>
            </div>
          )}

          {/* Specialization Section */}
          {profileData?.specialization && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  {t('instructor.profile.specialization')}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {profileData.specialization}
                </p>
              </div>
            </div>
          )}

          {/* Professional Certificate */}
          {profileData?.professionalProfileUrl && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  {t('instructor.profile.professionalCertificate')}
                </h2>
                <img
                  src={profileData.professionalProfileUrl}
                  alt={t('instructor.profile.professionalCertificate')}
                  className="max-w-2xl w-full rounded-xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}