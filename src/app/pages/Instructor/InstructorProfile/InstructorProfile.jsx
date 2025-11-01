import { ArrowLeft, User, Mail, Phone, Calendar, IdCard, CheckCircle } from 'lucide-react';
import { Avatar, Button, Card, Descriptions, Skeleton, Tag, Divider, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getInstructorById } from '../../../mock/instructors';

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      // simulate small delay
      await new Promise((r) => setTimeout(r, 200));
      if (cancelled) return;
      const p = getInstructorById(id || 1);
      setProfile(p);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

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

  if (!profile) {
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

  const { user } = profile;

  // Generate default avatar URL
  const getAvatarUrl = (avatarUrl, name) => {
    if (avatarUrl) return avatarUrl;
    const defaultAvatarBase = import.meta.env.VITE_API_DEFAULT_AVATAR_URL;
    const userName = name || 'User';
    return `${defaultAvatarBase}${encodeURIComponent(userName)}`;
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
                    src={getAvatarUrl(user?.avatar_url, user?.fullname)}
                    className="ring-4 ring-white/30 shadow-2xl"
                  >
                    {user?.fullname?.charAt(0) || 'I'}
                  </Avatar>
                  {profile?.is_active && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={16}>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold mb-2">{user?.fullname || 'Unknown'}</h2>
                  <div className="flex flex-wrap gap-3">
                    <Tag color="gold" className="px-3 py-1">
                      <IdCard className="mr-1" />
                      {profile?.instructor_code || 'N/A'}
                    </Tag>
                    <Tag color={profile?.is_active ? 'green' : 'red'} className="px-3 py-1">
                      {profile?.is_active ? 'Active' : 'Inactive'}
                    </Tag>
                    <Tag color="blue" className="px-3 py-1">
                      {user?.role || 'Instructor'}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-blue-100">
                    <div className="flex items-center gap-1">
                      <Calendar />
                      <span>Joined {profile?.hire_date || 'Unknown'}</span>
                    </div>
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
                      <span className="text-gray-900">{user?.fullname || 'N/A'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Username</span>}
                    >
                      <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {user?.username || 'N/A'}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Email</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-500" />
                        <span className="text-blue-600">{user?.email || 'N/A'}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Phone</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="text-gray-500" />
                        <span className="text-gray-900">{user?.phone_number || 'N/A'}</span>
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
                        {user?.role || 'Instructor'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Instructor Code</span>}
                    >
                      <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {profile?.instructor_code || 'N/A'}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Hire Date</span>}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-500" />
                        <span className="text-gray-900">{profile?.hire_date || 'N/A'}</span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<span className="font-medium text-gray-700">Status</span>}
                    >
                      <Tag 
                        color={profile?.is_active ? 'green' : 'red'} 
                        className="px-3 py-1"
                        icon={profile?.is_active ? <CheckCircle /> : null}
                      >
                        {profile?.is_active ? 'Active' : 'Inactive'}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Divider className="my-8" />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                type="primary" 
                size="large"
                className="px-8 shadow-md hover:shadow-lg transition-shadow"
              >
                Edit Profile
              </Button>
              <Button 
                size="large"
                className="px-8 shadow-md hover:shadow-lg transition-shadow"
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}