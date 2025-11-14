// src\app\pages\Trainee\Profile\EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Upload, message, Spin, Alert, Divider } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PageNav from '../../../components/PageNav/PageNav';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getTraineeProfileByUserId, updateTraineeProfileByUserId } from '../../../apis/Trainee/TraineeProfileApi';

const { TextArea } = Input;

export default function EditProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  
  const { nameid } = useAuthStore();
  const token = getAuthToken();

  // Fetch profile data
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
        
        // Fetch full profile
        const fullProfile = await getTraineeProfileByUserId(userId, token);
        console.log('✅ Loaded profile for editing:', fullProfile);
        setProfileData(fullProfile);
        
        // Fill form with existing data (only editable fields)
        form.setFieldsValue({
          // Editable fields
          phoneNumber: fullProfile.phoneNumber,
          avatarUrl: fullProfile.avatarUrl,
          educationLevel: fullProfile.educationLevel,
          educationImageUrl: fullProfile.educationImageUrl,
        });
        
        setError(null);
      } catch (err) {
        console.error('❌ Error loading profile:', err);
        setError(err.message || 'Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, form]);

  const handleSubmit = async (values) => {
    if (!profileData?.userId) {
      message.error('Không tìm thấy ID người dùng');
      return;
    }

    try {
      setSubmitting(true);
      
      // Format data for API - only editable fields
      const updateData = {
        phoneNumber: values.phoneNumber,
        avatarUrl: values.avatarUrl,
        educationLevel: values.educationLevel,
        educationImageUrl: values.educationImageUrl,
      };
      
      console.log('📤 Submitting update:', updateData);
      
      // Call PUT /api/Profiles/trainee/by-user/{userId}
      await updateTraineeProfileByUserId(profileData.userId, updateData, token);
      
      message.success('Cập nhật hồ sơ thành công!');
      
      // Navigate back to profile page
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      message.error(err.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageNav nameMap={{ profile: 'Profile', edit: 'Edit Profile' }} />
        <Card className="border-slate-200">
          <div className="flex flex-col justify-center items-center py-12">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Loading profile data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageNav nameMap={{ profile: 'Profile', edit: 'Edit Profile' }} />
        <Card className="border-slate-200">
          <Alert
            message="Error Loading Profile"
            description={error}
            type="error"
            showIcon
          />
          <Button className="mt-4" onClick={handleCancel}>
            Back to Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <PageNav nameMap={{ profile: 'Profile', edit: 'Edit Profile' }} />
      
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            className="flex items-center"
          >
            Back
          </Button>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold">Update Profile</h3>
            <p className="text-sm text-slate-600">Update your profile information</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card className="border-slate-200">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Read-only Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Basic Information (Read Only)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 uppercase">Full Name</div>
                <div className="text-slate-800 font-medium">{profileData?.fullname || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Email</div>
                <div className="text-slate-800 font-medium">{profileData?.email || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Username</div>
                <div className="text-slate-800 font-medium">{profileData?.username || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Student ID</div>
                <div className="text-slate-800 font-medium">{profileData?.traineeCode || '-'}</div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Editable Fields */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-blue-600">Editable Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9]{4,15}$/, message: 'Phone must be 4-15 digits' }
                ]}
              >
                <Input placeholder="e.g., 075757568" />
              </Form.Item>

              <Form.Item
                label="Avatar URL"
                name="avatarUrl"
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input placeholder="https://example.com/avatar.jpg" />
              </Form.Item>

              <Form.Item
                label="Education Level"
                name="educationLevel"
                rules={[{ required: true, message: 'Please enter education level' }]}
              >
                <Input placeholder="e.g., High School Diploma, Bachelor's Degree" />
              </Form.Item>

              <Form.Item
                label="Education Certificate URL"
                name="educationImageUrl"
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input placeholder="https://example.com/certificate.jpg" />
              </Form.Item>
            </div>

            {/* Current Images Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {profileData?.avatarUrl && (
                <div>
                  <div className="text-sm text-slate-600 mb-2">Current Avatar:</div>
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 object-cover rounded-full border"
                  />
                </div>
              )}
              {profileData?.educationImageUrl && (
                <div>
                  <div className="text-sm text-slate-600 mb-2">Current Education Certificate:</div>
                  <img
                    src={profileData.educationImageUrl}
                    alt="Education Certificate"
                    className="max-w-xs rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Read-only Profile Sections */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Other Information (Read Only)</h4>
            
            {/* Driver License */}
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <h5 className="font-medium mb-2">Driver License</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Number:</span>
                  <span className="ml-2 font-medium">{profileData?.driverLicenseNumber || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Level:</span>
                  <span className="ml-2 font-medium">{profileData?.driverLicenseLevel || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Issued:</span>
                  <span className="ml-2 font-medium">{profileData?.driverLicenseIssuedDate ? new Date(profileData.driverLicenseIssuedDate).toLocaleDateString() : '-'}</span>
                </div>
              </div>
              {profileData?.driverLicenseImageUrl && (
                <img src={profileData.driverLicenseImageUrl} alt="License" className="mt-2 max-w-xs rounded border" />
              )}
            </div>

            {/* Citizen Card */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h5 className="font-medium mb-2">Citizen Card</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">ID:</span>
                  <span className="ml-2 font-medium">{profileData?.citizenCardId || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Issued:</span>
                  <span className="ml-2 font-medium">{profileData?.citizenCardIssuedDate || '-'}</span>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <span className="text-slate-500">Place:</span>
                  <span className="ml-2 font-medium">{profileData?.citizenCardPlaceOfIssue || '-'}</span>
                </div>
              </div>
              {profileData?.citizenCardImageUrl && (
                <img src={profileData.citizenCardImageUrl} alt="Citizen Card" className="mt-2 max-w-xs rounded border" />
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button size="large" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
