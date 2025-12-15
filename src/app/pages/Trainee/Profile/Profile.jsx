// src\app\pages\Trainee\Profile\Profile.jsx
import React, { useState, useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, IdCard, GraduationCap, Car, Calendar, MapPin, Shield, Edit3 } from 'lucide-react';
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

  // Info Item Component
  const InfoItem = ({ icon: Icon, label, value, iconColor = "text-cyan-500" }) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <PageNav nameMap={{ profile: t('trainee.profile.title') }} />

        {/* Loading State */}
        {loading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Đang tải thông tin...</p>
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
            {/* Hero Card */}
            <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
              {/* Gradient Top Bar */}
              <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar with Ring */}
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 p-1 shadow-lg shadow-cyan-500/25">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          className="w-full h-full rounded-full object-cover bg-white"
                          onError={() => setImgErr(true)}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
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
                    <p className="text-slate-500 mt-1">{email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                      <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                        {userRole}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        ID: {studentId}
                      </span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t('trainee.profile.editProfile')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-500" />
                  {t('trainee.profile.title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoItem icon={User} label={t('trainee.profile.fullName')} value={fullName} iconColor="text-cyan-500" />
                  <InfoItem icon={Mail} label={t('trainee.profile.email')} value={email} iconColor="text-blue-500" />
                  <InfoItem icon={Phone} label={t('trainee.profile.phone')} value={phone} iconColor="text-indigo-500" />
                  <InfoItem icon={Shield} label={t('trainee.profile.role')} value={userRole} iconColor="text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Driver License Section */}
            {profileData && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <Car className="w-5 h-5 text-amber-500" />
                    {t('trainee.profile.driverLicense')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoItem icon={IdCard} label={t('trainee.profile.licenseNumber')} value={profileData.driverLicenseNumber} iconColor="text-amber-500" />
                    <InfoItem icon={Shield} label={t('trainee.profile.licenseLevel')} value={profileData.driverLicenseLevel} iconColor="text-orange-500" />
                    <InfoItem icon={Calendar} label={t('trainee.profile.issuedDate')} value={fmtDate(profileData.driverLicenseIssuedDate)} iconColor="text-amber-500" />
                    <InfoItem icon={Calendar} label={t('trainee.profile.validFrom')} value={fmtDate(profileData.driverLicenseValidStartDate)} iconColor="text-orange-500" />
                    <InfoItem icon={Calendar} label={t('trainee.profile.validTo')} value={fmtDate(profileData.driverLicenseValidEndDate)} iconColor="text-red-500" />
                  </div>
                  {profileData.driverLicenseImageUrl && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Ảnh bằng lái</div>
                      <img
                        src={profileData.driverLicenseImageUrl}
                        alt="Driver License"
                        className="max-w-[250px] rounded-xl border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Section */}
            {profileData && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                    {t('trainee.profile.education')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoItem icon={GraduationCap} label={t('trainee.profile.educationLevel')} value={profileData.educationLevel} iconColor="text-emerald-500" />
                  </div>
                  {profileData.educationImageUrl && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Chứng chỉ học vấn</div>
                      <img
                        src={profileData.educationImageUrl}
                        alt="Education Certificate"
                        className="max-w-[250px] rounded-xl border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Citizen ID Section */}
            {profileData && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-violet-500" />
                    {t('trainee.profile.citizenId')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoItem icon={IdCard} label={t('trainee.profile.citizenCardId')} value={profileData.citizenCardId} iconColor="text-violet-500" />
                    <InfoItem icon={Calendar} label={t('trainee.profile.issuedDate')} value={fmtDate(profileData.citizenCardIssuedDate)} iconColor="text-purple-500" />
                    <InfoItem icon={MapPin} label={t('trainee.profile.placeOfIssue')} value={profileData.citizenCardPlaceOfIssue} iconColor="text-violet-500" />
                  </div>
                  {profileData.citizenCardImageUrl && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Ảnh CCCD</div>
                      <img
                        src={profileData.citizenCardImageUrl}
                        alt="Citizen Card"
                        className="max-w-[250px] rounded-xl border border-slate-200 shadow-sm"
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


