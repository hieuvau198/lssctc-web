import { ArrowLeft, User, Mail, Phone, Calendar, IdCard, CheckCircle, Award, Briefcase } from 'lucide-react';
import { Avatar, Button, Card, Descriptions, Skeleton, Tag, Divider, Row, Col, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getInstructorProfileByUserId } from '../../../apis/Instructor/InstructorProfileApi';

export default function InstructorProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { nameid } = useAuthStore();
  const token = getAuthToken();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
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
          throw new Error('Không tìm thấy ID người dùng trong token');
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
        setError(err.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Skeleton avatar active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Alert
              message="Error Loading Profile"
              description={error}
              type="error"
              showIcon
            />
            <Button className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center text-gray-500">Instructor not found</div>
          </div>
        </div>
      </div>
    );
  }

  // Map role number to string
  const getRoleName = (roleNumber) => {
    const roles = {
      1: 'Admin',
      2: 'Instructor',
      3: 'Simulation Manager',
      4: 'Trainee'
    };
    return roles[roleNumber] || 'Unknown';
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={8} className="text-center md:text-left">
                <div className="relative inline-block">
                  <Avatar 
                    size={128} 
                    src={profileData?.avatarUrl}
                    className="ring-4 ring-white/30 shadow-2xl"
                  >
                    {profileData?.fullname?.charAt(0) || 'I'}
                  </Avatar>
                  {profileData?.isInstructorActive && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={16}>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold mb-2">{profileData?.fullname || 'Unknown'}</h2>
                  <div className="flex flex-wrap gap-3">
                    <Tag color="gold" className="px-3 py-1 flex items-center">
                      <IdCard className="mr-1 w-4 h-4" />
                      {profileData?.instructorCode || 'N/A'}
                    </Tag>
                    <Tag color={profileData?.isInstructorActive ? 'green' : 'red'} className="px-3 py-1">
                      {profileData?.isInstructorActive ? 'Active' : 'Inactive'}
                    </Tag>
                    <Tag color="blue" className="px-3 py-1">
                      {getRoleName(profileData?.role)}
                    </Tag>
                    {profileData?.experienceYears && (
                      <Tag color="purple" className="px-3 py-1 flex items-center">
                        <Award className="mr-1 w-4 h-4" />
                        {profileData.experienceYears} years exp.
                      </Tag>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-blue-100">
                    {profileData?.hireDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(profileData.hireDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <Row gutter={[32, 32]}>
              {/* Personal Information */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center gap-2">
                      <User className="text-blue-600" />
                      <span>Personal Information</span>
                    </div>
                  }
                  className="h-full shadow-md border-l-4 border-l-blue-500"
                  bodyStyle={{ padding: '24px' }}
                >
                  <Descriptions column={1} size="small" className="custom-descriptions">
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Full Name</span>}
                      labelStyle={{ width: '120px' }}
                    >
                      <span className="text-gray-900">{profileData?.fullname || 'N/A'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Email</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-500 w-4 h-4" />
                        <span className="text-blue-600">{profileData?.email || 'N/A'}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Phone</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-900">{profileData?.phoneNumber || 'N/A'}</span>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Professional Information */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center gap-2">
                      <IdCard className="text-indigo-600" />
                      <span>Professional Details</span>
                    </div>
                  }
                  className="h-full shadow-md border-l-4 border-l-indigo-500"
                  bodyStyle={{ padding: '24px' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Role</span>}
                    >
                      <Tag color="blue" className="px-3 py-1">
                        {getRoleName(profileData?.role)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Instructor Code</span>}
                    >
                      <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {profileData?.instructorCode || 'N/A'}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Experience Years</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Award className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-900">{profileData?.experienceYears || 0} years</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Hire Date</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-900">
                          {profileData?.hireDate ? new Date(profileData.hireDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Status</span>}
                    >
                      <Tag 
                        color={profileData?.isInstructorActive ? 'green' : 'red'} 
                        className="px-3 py-1"
                      >
                        {profileData?.isInstructorActive ? 'Active' : 'Inactive'}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Divider className="my-8" />

            {/* Biography and Specialization */}
            <Row gutter={[32, 32]}>
              {/* Biography */}
              {profileData?.biography && (
                <Col xs={24}>
                  <Card 
                    title={
                      <div className="flex items-center gap-2">
                        <Briefcase className="text-green-600" />
                        <span>Biography</span>
                      </div>
                    }
                    className="shadow-md border-l-4 border-l-green-500"
                  >
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData.biography}
                    </p>
                  </Card>
                </Col>
              )}

              {/* Specialization */}
              {profileData?.specialization && (
                <Col xs={24}>
                  <Card 
                    title={
                      <div className="flex items-center gap-2">
                        <Award className="text-purple-600" />
                        <span>Specialization</span>
                      </div>
                    }
                    className="shadow-md border-l-4 border-l-purple-500"
                  >
                    <p className="text-gray-700">
                      {profileData.specialization}
                    </p>
                  </Card>
                </Col>
              )}

              {/* Professional Profile Certificate */}
              {profileData?.professionalProfileUrl && (
                <Col xs={24}>
                  <Card 
                    title={
                      <div className="flex items-center gap-2">
                        <Award className="text-orange-600" />
                        <span>Professional Certificate</span>
                      </div>
                    }
                    className="shadow-md border-l-4 border-l-orange-500"
                  >
                    <img
                      src={profileData.professionalProfileUrl}
                      alt="Professional Certificate"
                      className="max-w-2xl w-full rounded-lg shadow-md"
                    />
                  </Card>
                </Col>
              )}
            </Row>

            <Divider className="my-8" />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                type="primary" 
                size="large"
                className="px-8 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => navigate('/instructor/profile/edit')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}