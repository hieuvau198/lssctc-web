// src\app\pages\Trainee\Profile\Profile.jsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, IdCard, GraduationCap, Car, Calendar, MapPin, Shield, Edit } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getTraineeProfileByUserId } from '../../../apis/Trainee/TraineeProfileApi';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all auth data
  const authStore = useAuthStore();
  const { nameid, role } = authStore;

  // Get token from cookie (more reliable)
  const token = getAuthToken();

  // Fetch user and profile data
  useEffect(() => {
    const fetchData = async () => {
      console.log('=== Profile Fetch Debug ===');
      console.log('Token from cookie:', token ? 'exists' : 'missing');

      if (!token) {
        console.warn('❌ Missing token');
        setLoading(false);
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      try {
        setLoading(true);

        // Decode token to get user ID directly
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(token);
        console.log('🔓 Decoded token:', decoded);

        const userId = decoded.nameid || decoded.nameId || decoded.sub;
        const userRole = decoded.role;
        const userName = decoded.name || decoded.unique_name;

        console.log('User ID from token:', userId);
        console.log('Role from token:', userRole);

        if (!userId) {
          throw new Error('Không tìm thấy ID người dùng trong token');
        }

        // Fetch full profile (user + trainee profile) using new endpoint
        console.log('📡 Fetching complete profile for userId:', userId);
        const fullProfile = await getTraineeProfileByUserId(userId, token);
        console.log('✅ Full profile data received:', fullProfile);

        // Map response to userData (user info part)
        setUserData({
          id: fullProfile.userId,
          username: fullProfile.username,
          email: fullProfile.email,
          fullname: fullProfile.fullname,
          phoneNumber: fullProfile.phoneNumber,
          avatarUrl: fullProfile.avatarUrl,
          role: fullProfile.role,
          isActive: fullProfile.isTraineeActive,
          traineeCode: fullProfile.traineeCode,
        });

        // Map response to profileData (profile info part)
        setProfileData({
          driverLicenseNumber: fullProfile.driverLicenseNumber,
          driverLicenseLevel: fullProfile.driverLicenseLevel,
          driverLicenseIssuedDate: fullProfile.driverLicenseIssuedDate,
          driverLicenseValidStartDate: fullProfile.driverLicenseValidStartDate,
          driverLicenseValidEndDate: fullProfile.driverLicenseValidEndDate,
          driverLicenseImageUrl: fullProfile.driverLicenseImageUrl,
          educationLevel: fullProfile.educationLevel,
          educationImageUrl: fullProfile.educationImageUrl,
          citizenCardId: fullProfile.citizenCardId,
          citizenCardIssuedDate: fullProfile.citizenCardIssuedDate,
          citizenCardPlaceOfIssue: fullProfile.citizenCardPlaceOfIssue,
          citizenCardImageUrl: fullProfile.citizenCardImageUrl,
        });

        setError(null);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError(err.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Use userData from API
  const fullName = userData?.fullname || userData?.fullName || userData?.username || 'Learner';
  const email = userData?.email || '-';
  // Map role number to string (4 = Trainee based on API response)
  const roleMap = { 1: 'Admin', 2: 'Instructor', 3: 'SimulationManager', 4: 'Trainee', 5: 'ProgramManager' };
  const userRole = typeof userData?.role === 'number' ? roleMap[userData.role] : (userData?.role || role || 'Learner');

  // Generate default avatar URL
  const getAvatarUrl = () => {
    if (imgErr) return null;
    const userAvatar = userData?.avatarUrl || userData?.avatar;
    if (userAvatar) return userAvatar;
    const defaultAvatarBase = import.meta.env.VITE_API_DEFAULT_AVATAR_URL;
    return `${defaultAvatarBase}${encodeURIComponent(fullName)}`;
  };

  const avatarUrl = getAvatarUrl();
  const phone = userData?.phoneNumber || userData?.phone || '-';
  const studentId = userData?.traineeCode || userData?.id || userData?.studentId || '-';
  const status = userData?.isActive ? 'Active' : 'Inactive';

  const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    return isNaN(d) ? '-' : d.toLocaleDateString('vi-VN');
  };

  const initial = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'U';

  // Info Item Component - Industrial Style with Emerald accent
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</div>
        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{value || '-'}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <PageNav nameMap={{ profile: t('trainee.profile.title') }} />

        {/* Loading State */}
        {loading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-600 font-medium">Đang tải thông tin...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-6">
            <Alert
              message="Lỗi tải hồ sơ"
              description={error}
              type="error"
              showIcon
            />
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && (
          <div className="mt-6 space-y-6">
            {/* Hero Card - Industrial Style */}
            <div className="relative bg-white border-2 border-neutral-200 overflow-hidden">
              {/* Industrial Top Bar */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />

              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar with Industrial Ring */}
                  <div className="relative">
                    <div className="w-28 h-28 border-4 border-emerald-600 p-1 bg-emerald-500">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          className="w-full h-full object-cover bg-white"
                          onError={() => setImgErr(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-700 flex items-center justify-center">
                          <span className="text-3xl font-black text-white">{initial}</span>
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
                    <p className="text-neutral-600 mt-1 font-medium">{email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                      <span className="px-3 py-1 bg-emerald-500 border-2 border-emerald-700 text-white text-sm font-bold uppercase">
                        {userRole}
                      </span>
                      <span className="px-3 py-1 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 text-sm font-mono font-bold">
                        ID: {studentId}
                      </span>
                    </div>
                  </div>

                  {/* Edit Button - Industrial Style */}
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="px-5 py-2.5 bg-emerald-500 border-2 border-emerald-700 text-white font-black uppercase text-xs tracking-wider hover:bg-emerald-600 hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] transition-all flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {t('trainee.profile.editProfile')}
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information - Industrial Style */}
            <div className="bg-white border-2 border-neutral-200 overflow-hidden">
              <div className="h-1 bg-emerald-500" />
              <div className="p-6">
                <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-8 h-8 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {t('trainee.profile.title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoItem icon={User} label={t('trainee.profile.fullName')} value={fullName} />
                  <InfoItem icon={Mail} label={t('trainee.profile.email')} value={email} />
                  <InfoItem icon={Phone} label={t('trainee.profile.phone')} value={phone} />
                  <InfoItem icon={Shield} label={t('trainee.profile.role')} value={userRole} />
                </div>
              </div>
            </div>

            {/* Driver License Section - Industrial Style */}
            {profileData && (
              <div className="bg-white border-2 border-neutral-200 overflow-hidden">
                <div className="h-1 bg-amber-500" />
                <div className="p-6">
                  <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                    <div className="w-8 h-8 bg-amber-500 border-2 border-amber-700 flex items-center justify-center">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                    {t('trainee.profile.driverLicense')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-500 border-2 border-amber-700 flex items-center justify-center flex-shrink-0">
                        <IdCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.licenseNumber')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{profileData.driverLicenseNumber || '-'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-500 border-2 border-amber-700 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.licenseLevel')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{profileData.driverLicenseLevel || '-'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-500 border-2 border-amber-700 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.issuedDate')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{fmtDate(profileData.driverLicenseIssuedDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-500 border-2 border-amber-700 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.validFrom')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{fmtDate(profileData.driverLicenseValidStartDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-500 border-2 border-red-700 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.validTo')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{fmtDate(profileData.driverLicenseValidEndDate)}</div>
                      </div>
                    </div>
                  </div>
                  {profileData.driverLicenseImageUrl && (
                    <div className="mt-5 pt-5 border-t-2 border-neutral-100">
                      <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Ảnh bằng lái</div>
                      <img
                        src={profileData.driverLicenseImageUrl}
                        alt="Driver License"
                        className="max-w-[250px] border-2 border-neutral-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Section - Industrial Style */}
            {profileData && (
              <div className="bg-white border-2 border-neutral-200 overflow-hidden">
                <div className="h-1 bg-sky-500" />
                <div className="p-6">
                  <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                    <div className="w-8 h-8 bg-sky-500 border-2 border-sky-700 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    {t('trainee.profile.education')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-sky-500 border-2 border-sky-700 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.educationLevel')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{profileData.educationLevel || '-'}</div>
                      </div>
                    </div>
                  </div>
                  {profileData.educationImageUrl && (
                    <div className="mt-5 pt-5 border-t-2 border-neutral-100">
                      <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Chứng chỉ học vấn</div>
                      <img
                        src={profileData.educationImageUrl}
                        alt="Education Certificate"
                        className="max-w-[250px] border-2 border-neutral-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Citizen ID Section - Industrial Style */}
            {profileData && (
              <div className="bg-white border-2 border-neutral-200 overflow-hidden">
                <div className="h-1 bg-violet-500" />
                <div className="p-6">
                  <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                    <div className="w-8 h-8 bg-violet-500 border-2 border-violet-700 flex items-center justify-center">
                      <IdCard className="w-4 h-4 text-white" />
                    </div>
                    {t('trainee.profile.citizenId')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-violet-500 border-2 border-violet-700 flex items-center justify-center flex-shrink-0">
                        <IdCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.citizenCardId')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{profileData.citizenCardId || '-'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-violet-500 border-2 border-violet-700 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.issuedDate')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{fmtDate(profileData.citizenCardIssuedDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-violet-500 border-2 border-violet-700 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('trainee.profile.placeOfIssue')}</div>
                        <div className="text-neutral-800 font-semibold mt-0.5 truncate">{profileData.citizenCardPlaceOfIssue || '-'}</div>
                      </div>
                    </div>
                  </div>
                  {profileData.citizenCardImageUrl && (
                    <div className="mt-5 pt-5 border-t-2 border-neutral-100">
                      <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Ảnh CCCD</div>
                      <img
                        src={profileData.citizenCardImageUrl}
                        alt="Citizen Card"
                        className="max-w-[250px] border-2 border-neutral-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
