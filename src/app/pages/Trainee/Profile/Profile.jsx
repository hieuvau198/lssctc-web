// src\app\pages\Trainee\Profile\Profile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Divider, Button, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getTraineeProfileByUserId } from '../../../apis/Trainee/TraineeProfileApi';

const { Title, Text } = Typography;

export default function Profile() {
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
        console.log('� Decoded token:', decoded);
        
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
    return isNaN(d) ? '-' : d.toLocaleDateString();
  };

  const initial = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <PageNav nameMap={{ profile: 'Profile' }} />
      <div className="bg-white border rounded-xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Title level={3} className="!mb-1 text-xl sm:!text-2xl">Profile</Title>
          <Text type="secondary" className="text-sm sm:text-base">Your personal information</Text>
        </div>
        <div>
          <Button 
            type="primary" 
            onClick={() => navigate('/profile/edit')}
            className="w-full sm:w-auto"
          >
            Update info
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-200">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        ) : error ? (
          <Alert
            message="Error Loading Profile"
            description={error}
            type="error"
            showIcon
          />
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex items-center sm:items-start gap-4 sm:gap-6">
              <Avatar
                size={96}
                src={avatarUrl || undefined}
                onError={() => { setImgErr(true); return false; }}
                className="bg-blue-600 select-none"
              >
                {initial}
              </Avatar>
              <div className="sm:hidden">
                <div className="text-lg font-semibold text-slate-800">{fullName}</div>
                <div className="text-slate-600 text-sm">{email}</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="hidden sm:block text-xl font-semibold text-slate-800">{fullName}</div>
                  <div className="hidden sm:block text-slate-600">{email}</div>
                </div>
              </div>

              <Divider className="!my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Full Name</div>
                    <div className="text-slate-800 mt-1">{fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Email</div>
                    <div className="text-slate-800 mt-1">{email}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Phone</div>
                    <div className="text-slate-800 mt-1">{phone}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Student ID</div>
                    <div className="text-slate-800 mt-1">{studentId}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                    <div className="text-slate-800 mt-1">{status}</div>
                  </div>
                </div>
              </div>

              <Divider className="!my-4" />
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Role</div>
                <div className="text-slate-800 mt-1">{userRole}</div>
              </div>

              {/* Driver License Section */}
              {profileData && (
                <>
                  <Divider className="!my-4" />
                  <div className="space-y-4">
                    <Title level={5} className="!mb-0">Driver License Information</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">License Number</div>
                          <div className="text-slate-800 mt-1">{profileData.driverLicenseNumber || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">License Level</div>
                          <div className="text-slate-800 mt-1">{profileData.driverLicenseLevel || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Issued Date</div>
                          <div className="text-slate-800 mt-1">{fmtDate(profileData.driverLicenseIssuedDate)}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Valid Start Date</div>
                          <div className="text-slate-800 mt-1">{fmtDate(profileData.driverLicenseValidStartDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Valid End Date</div>
                          <div className="text-slate-800 mt-1">{fmtDate(profileData.driverLicenseValidEndDate)}</div>
                        </div>
                        {profileData.driverLicenseImageUrl && (
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-500">License Image</div>
                            <img 
                              src={profileData.driverLicenseImageUrl} 
                              alt="Driver License" 
                              className="mt-2 max-w-[200px] rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Education Section */}
                  <Divider className="!my-4" />
                  <div className="space-y-4">
                    <Title level={5} className="!mb-0">Education Information</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500">Education Level</div>
                        <div className="text-slate-800 mt-1">{profileData.educationLevel || '-'}</div>
                      </div>
                      {profileData.educationImageUrl && (
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Education Certificate</div>
                          <img 
                            src={profileData.educationImageUrl} 
                            alt="Education Certificate" 
                            className="mt-2 max-w-[200px] rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Citizen Card Section */}
                  <Divider className="!my-4" />
                  <div className="space-y-4">
                    <Title level={5} className="!mb-0">Citizen Card Information</Title>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Citizen Card ID</div>
                          <div className="text-slate-800 mt-1">{profileData.citizenCardId || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Issued Date</div>
                          <div className="text-slate-800 mt-1">{fmtDate(profileData.citizenCardIssuedDate)}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">Place of Issue</div>
                          <div className="text-slate-800 mt-1">{profileData.citizenCardPlaceOfIssue || '-'}</div>
                        </div>
                        {profileData.citizenCardImageUrl && (
                          <div>
                            <div className="text-xs uppercase tracking-wide text-slate-500">Citizen Card Image</div>
                            <img 
                              src={profileData.citizenCardImageUrl} 
                              alt="Citizen Card" 
                              className="mt-2 max-w-[200px] rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

