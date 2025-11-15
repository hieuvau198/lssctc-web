// src\app\pages\Instructor\InstructorProfile\EditInstructorProfile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Alert, Divider, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getInstructorProfileByUserId, updateInstructorProfileByUserId } from '../../../apis/Instructor/InstructorProfileApi';

const { TextArea } = Input;

export default function EditInstructorProfile() {
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
        const fullProfile = await getInstructorProfileByUserId(userId, token);
        console.log('✅ Loaded profile for editing:', fullProfile);
        setProfileData(fullProfile);
        
        // Fill form with existing data
        form.setFieldsValue({
          email: fullProfile.email,
          fullname: fullProfile.fullname,
          phoneNumber: fullProfile.phoneNumber,
          avatarUrl: fullProfile.avatarUrl,
          instructorCode: fullProfile.instructorCode,
          experienceYears: fullProfile.experienceYears,
          biography: fullProfile.biography,
          professionalProfileUrl: fullProfile.professionalProfileUrl,
          specialization: fullProfile.specialization,
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
      
      // Format data for API
      const updateData = {
        username: profileData.username, // Keep existing username (not editable)
        email: values.email,
        fullname: values.fullname,
        phoneNumber: values.phoneNumber,
        avatarUrl: values.avatarUrl,
        instructorCode: values.instructorCode,
        hireDate: profileData.hireDate, // Keep existing hireDate
        isInstructorActive: profileData.isInstructorActive, // Keep existing status
        experienceYears: values.experienceYears,
        biography: values.biography,
        professionalProfileUrl: values.professionalProfileUrl,
        specialization: values.specialization,
      };
      
      console.log('📤 Submitting update:', updateData);
      
      await updateInstructorProfileByUserId(profileData.userId, updateData, token);
      
      message.success('Cập nhật hồ sơ thành công!');
      
      // Navigate back to profile page
      setTimeout(() => {
        navigate('/instructor/profile');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      message.error(err.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/instructor/profile');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
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
            <h3 className="text-xl sm:text-2xl font-semibold">Update Instructor Profile</h3>
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
          {/* Basic Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-blue-600">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Full Name"
                name="fullname"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="e.g., Nguyen Van A" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="e.g., instructor@example.com" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9]{4,15}$/, message: 'Phone must be 4-15 digits' }
                ]}
              >
                <Input placeholder="e.g., 0909123456" />
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
                label="Instructor Code"
                name="instructorCode"
              >
                <Input placeholder="e.g., INS2QDY7V" disabled />
              </Form.Item>
            </div>

            {/* Current Avatar Preview */}
            {profileData?.avatarUrl && (
              <div className="mt-4">
                <div className="text-sm text-slate-600 mb-2">Current Avatar:</div>
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          <Divider />

          {/* Professional Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-green-600">Professional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Experience Years"
                name="experienceYears"
                rules={[
                  { required: true, message: 'Please enter experience years' },
                  { type: 'number', min: 0, max: 50, message: 'Must be 0-50 years' }
                ]}
              >
                <InputNumber 
                  placeholder="e.g., 12" 
                  className="w-full"
                  min={0}
                  max={50}
                />
              </Form.Item>

              <Form.Item
                label="Professional Profile URL"
                name="professionalProfileUrl"
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input placeholder="https://example.com/certificate.jpg" />
              </Form.Item>
            </div>

            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[{ required: true, message: 'Please enter specialization' }]}
            >
              <Input placeholder="e.g., Truck-mounted Crane Operation, Load Chart Analysis" />
            </Form.Item>

            <Form.Item
              label="Biography"
              name="biography"
              rules={[{ required: true, message: 'Please enter biography' }]}
            >
              <TextArea 
                rows={6}
                placeholder="Write a detailed biography about your experience, certifications, and expertise..."
                maxLength={1000}
                showCount
              />
            </Form.Item>

            {/* Current Professional Profile Preview */}
            {profileData?.professionalProfileUrl && (
              <div className="mt-4">
                <div className="text-sm text-slate-600 mb-2">Current Professional Certificate:</div>
                <img
                  src={profileData.professionalProfileUrl}
                  alt="Professional Certificate"
                  className="max-w-md rounded border"
                />
              </div>
            )}
          </div>

          <Divider />

          {/* Read-only Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Read-Only Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 uppercase">Status</div>
                <div className="text-slate-800 font-medium">
                  {profileData?.isInstructorActive ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Hire Date</div>
                <div className="text-slate-800 font-medium">
                  {profileData?.hireDate ? new Date(profileData.hireDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">User ID</div>
                <div className="text-slate-800 font-medium">{profileData?.userId || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">Role</div>
                <div className="text-slate-800 font-medium">Instructor</div>
              </div>
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
