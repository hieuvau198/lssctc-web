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

  // Info Item Component - Industrial Style
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</div>
        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{value || '-'}</div>
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
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <Skeleton avatar active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <Alert
              message={t('instructor.profile.error.errorLoadingProfile')}
              description={error}
              type="error"
              showIcon
            />
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-5 py-2.5 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:bg-neutral-200 transition-all"
            >
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <div className="text-center text-neutral-500">{t('instructor.profile.instructorNotFound')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Hero Card - Industrial Style */}
          <div className="relative bg-white border-2 border-neutral-200 overflow-hidden">
            {/* Industrial Top Bar */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar with Industrial Ring */}
                <div className="relative">
                  <div className="w-28 h-28 border-4 border-black p-1 bg-yellow-400">
                    {profileData?.avatarUrl && !imgErr ? (
                      <img
                        src={profileData.avatarUrl}
                        alt={fullName}
                        className="w-full h-full object-cover bg-white"
                        onError={() => setImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <span className="text-3xl font-black text-yellow-400">{initial}</span>
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 ${status === 'Active'
                      ? 'bg-emerald-400 border-emerald-600 text-emerald-900'
                      : 'bg-neutral-200 border-neutral-400 text-neutral-700'
                    }`}>
                    {status}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                    {fullName}
                  </h1>
                  <p className="text-neutral-600 mt-1 font-medium">{profileData?.email || '-'}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                    <span className="px-3 py-1 bg-yellow-400 border-2 border-black text-black text-sm font-bold uppercase">
                      {getRoleName(profileData?.role)}
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 text-sm font-mono font-bold">
                      {profileData?.instructorCode || 'N/A'}
                    </span>
                    {profileData?.experienceYears && (
                      <span className="px-3 py-1 bg-black text-yellow-400 text-sm font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {profileData.experienceYears} năm KN
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Button - Industrial Style */}
                <button
                  onClick={() => navigate('/instructor/profile/edit')}
                  className="px-5 py-2.5 bg-yellow-400 border-2 border-black text-black font-black uppercase text-xs tracking-wider hover:bg-yellow-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {t('instructor.profile.editProfile')}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information - Industrial Style */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="h-1 bg-yellow-400" />
            <div className="p-6">
              <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                {t('instructor.profile.personalInformation')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem icon={User} label={t('instructor.profile.form.fullName')} value={profileData?.fullname} />
                <InfoItem icon={Mail} label={t('instructor.profile.form.email')} value={profileData?.email} />
                <InfoItem icon={Phone} label={t('instructor.profile.form.phone')} value={profileData?.phoneNumber} />
                <InfoItem icon={Shield} label={t('instructor.profile.form.role')} value={getRoleName(profileData?.role)} />
              </div>
            </div>
          </div>

          {/* Professional Information - Industrial Style */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="p-6">
              <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <IdCard className="w-4 h-4 text-yellow-400" />
                </div>
                {t('instructor.profile.professionalDetails')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem icon={IdCard} label={t('instructor.profile.form.instructorCode')} value={profileData?.instructorCode} />
                <InfoItem icon={Award} label={t('instructor.profile.form.experienceYears')} value={`${profileData?.experienceYears || 0} năm`} />
                <InfoItem icon={Calendar} label={t('instructor.profile.form.hireDate')} value={fmtDate(profileData?.hireDate)} />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('instructor.profile.form.status')}</div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 text-xs font-black uppercase ${profileData?.isInstructorActive
                          ? 'bg-emerald-400 text-emerald-900'
                          : 'bg-red-400 text-red-900'
                        }`}>
                        {profileData?.isInstructorActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biography Section - Industrial Style */}
          {profileData?.biography && (
            <div className="bg-white border-2 border-neutral-200 overflow-hidden">
              <div className="h-1 bg-yellow-400" />
              <div className="p-6">
                <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-black" />
                  </div>
                  {t('instructor.profile.biography')}
                </h2>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line font-medium">
                  {profileData.biography}
                </p>
              </div>
            </div>
          )}

          {/* Specialization Section - Industrial Style */}
          {profileData?.specialization && (
            <div className="bg-white border-2 border-neutral-200 overflow-hidden">
              <div className="h-1 bg-black" />
              <div className="p-6">
                <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  {t('instructor.profile.specialization')}
                </h2>
                <p className="text-neutral-700 leading-relaxed font-medium">
                  {profileData.specialization}
                </p>
              </div>
            </div>
          )}

          {/* Professional Certificate - Industrial Style */}
          {profileData?.professionalProfileUrl && (
            <div className="bg-white border-2 border-neutral-200 overflow-hidden">
              <div className="h-1 bg-yellow-400" />
              <div className="p-6">
                <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
                    <Award className="w-4 h-4 text-black" />
                  </div>
                  {t('instructor.profile.professionalCertificate')}
                </h2>
                <img
                  src={profileData.professionalProfileUrl}
                  alt={t('instructor.profile.professionalCertificate')}
                  className="max-w-2xl w-full border-2 border-neutral-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
