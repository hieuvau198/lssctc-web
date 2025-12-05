// src\app\pages\Instructor\InstructorProfile\EditInstructorProfile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Alert, Divider, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../store/authStore';
import { setAvatarUrl } from '../../../store/userAvatar';
import { getAuthToken } from '../../../libs/cookies';
import { getInstructorProfileByUserId, updateInstructorProfileByUserId } from '../../../apis/Instructor/InstructorProfileApi';

const { TextArea } = Input;

export default function EditInstructorProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        setError(err.message || t('instructor.profile.error.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, form, t]);

  const handleSubmit = async (values) => {
    if (!profileData?.userId) {
      message.error(t('instructor.profile.error.userIdNotFound'));
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

      // Cập nhật avatar ngay lập tức vào Signify store để sidebar phản ứng
      if (updateData.avatarUrl) {
        setAvatarUrl(updateData.avatarUrl);
        try {
          // Đồng bộ vào authStore để các nơi khác dùng store.avatarUrl không lệ thuộc chỉ Signify
          const auth = useAuthStore.getState ? useAuthStore.getState() : useAuthStore();
          if (auth && auth.setFromClaims) {
            auth.setFromClaims({ avatarUrl: updateData.avatarUrl, fullName: updateData.fullname, name: updateData.fullname });
          }
        } catch (_) {}
      }
      
      message.success(t('instructor.profile.updateSuccess'));
      
      // Navigate back to profile page
      setTimeout(() => {
        navigate('/instructor/profile');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      message.error(err.message || t('instructor.profile.error.updateFailed'));
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
            <p className="mt-4 text-gray-500">{t('instructor.profile.loadingProfileData')}</p>
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
            message={t('instructor.profile.error.errorLoadingProfile')}
            description={error}
            type="error"
            showIcon
          />
          <Button className="mt-4" onClick={handleCancel}>
            {t('instructor.profile.backToProfile')}
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
            {t('common.back')}
          </Button>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold">{t('instructor.profile.updateProfile')}</h3>
            <p className="text-sm text-slate-600">{t('instructor.profile.updateProfileDescription')}</p>
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
            <h4 className="text-lg font-semibold mb-4 text-blue-600">{t('instructor.profile.basicInformation')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('instructor.profile.fullName')}
                name="fullname"
                rules={[{ required: true, message: t('instructor.profile.validation.fullNameRequired') }]}
              >
                <Input placeholder={t('instructor.profile.placeholder.fullName')} />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.email')}
                name="email"
                rules={[
                  { required: true, message: t('instructor.profile.validation.emailRequired') },
                  { type: 'email', message: t('instructor.profile.validation.emailInvalid') }
                ]}
              >
                <Input placeholder={t('instructor.profile.placeholder.email')} />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.phoneNumber')}
                name="phoneNumber"
                rules={[
                  { required: true, message: t('instructor.profile.validation.phoneRequired') },
                  { pattern: /^[0-9]{4,15}$/, message: t('instructor.profile.validation.phoneInvalid') }
                ]}
              >
                <Input placeholder={t('instructor.profile.placeholder.phoneNumber')} />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.avatarUrl')}
                name="avatarUrl"
                rules={[
                  { type: 'url', message: t('instructor.profile.validation.urlInvalid') }
                ]}
              >
                <Input placeholder={t('instructor.profile.placeholder.avatarUrl')} />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.instructorCode')}
                name="instructorCode"
              >
                <Input placeholder={t('instructor.profile.placeholder.instructorCode')} disabled />
              </Form.Item>
            </div>

            {/* Current Avatar Preview */}
            {profileData?.avatarUrl && (
              <div className="mt-4">
                <div className="text-sm text-slate-600 mb-2">{t('instructor.profile.currentAvatar')}:</div>
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
            <h4 className="text-lg font-semibold mb-4 text-green-600">{t('instructor.profile.professionalInformation')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('instructor.profile.experienceYears')}
                name="experienceYears"
                rules={[
                  { required: true, message: t('instructor.profile.validation.experienceYearsRequired') },
                  { type: 'number', min: 0, max: 50, message: t('instructor.profile.validation.experienceYearsRange') }
                ]}
              >
                <InputNumber 
                  placeholder={t('instructor.profile.placeholder.experienceYears')} 
                  className="w-full"
                  min={0}
                  max={50}
                />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.professionalProfileUrl')}
                name="professionalProfileUrl"
                rules={[
                  { type: 'url', message: t('instructor.profile.validation.urlInvalid') }
                ]}
              >
                <Input placeholder={t('instructor.profile.placeholder.professionalProfileUrl')} />
              </Form.Item>
            </div>

            <Form.Item
              label={t('instructor.profile.specialization')}
              name="specialization"
              rules={[{ required: true, message: t('instructor.profile.validation.specializationRequired') }]}
            >
              <Input placeholder={t('instructor.profile.placeholder.specialization')} />
            </Form.Item>

            <Form.Item
              label={t('instructor.profile.biography')}
              name="biography"
              rules={[{ required: true, message: t('instructor.profile.validation.biographyRequired') }]}
            >
              <TextArea 
                rows={6}
                placeholder={t('instructor.profile.placeholder.biography')}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            {/* Current Professional Profile Preview */}
            {profileData?.professionalProfileUrl && (
              <div className="mt-4">
                <div className="text-sm text-slate-600 mb-2">{t('instructor.profile.currentProfessionalCertificate')}:</div>
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
            <h4 className="text-lg font-semibold mb-4">{t('instructor.profile.readOnlyInformation')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 uppercase">{t('instructor.profile.status')}</div>
                <div className="text-slate-800 font-medium">
                  {profileData?.isInstructorActive ? `🟢 ${t('instructor.profile.active')}` : `🔴 ${t('instructor.profile.inactive')}`}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">{t('instructor.profile.hireDate')}</div>
                <div className="text-slate-800 font-medium">
                  {profileData?.hireDate ? new Date(profileData.hireDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">{t('instructor.profile.userId')}</div>
                <div className="text-slate-800 font-medium">{profileData?.userId || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">{t('instructor.profile.role')}</div>
                <div className="text-slate-800 font-medium">{t('instructor.profile.instructorRole')}</div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button size="large" onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting}
            >
              {t('common.saveChanges')}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
