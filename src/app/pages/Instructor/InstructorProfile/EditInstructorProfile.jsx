// src\app\pages\Instructor\InstructorProfile\EditInstructorProfile.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Alert, InputNumber } from 'antd';
import { ArrowLeft, User, Briefcase, Shield, Image } from 'lucide-react';
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
        } catch (_) { }
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
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <div className="flex flex-col justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">{t('instructor.profile.loadingProfileData')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/50">
            <Alert
              message={t('instructor.profile.error.errorLoadingProfile')}
              description={error}
              type="error"
              showIcon
            />
            <Button className="mt-4" onClick={handleCancel}>
              {t('instructor.profile.backToProfile')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
          <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 flex items-center justify-center transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  {t('instructor.profile.updateProfile')}
                </h1>
                <p className="text-sm text-slate-500 mt-1">{t('instructor.profile.updateProfileDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className="space-y-6"
        >
          {/* Basic Information Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                {t('instructor.profile.basicInformation')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.fullName')}</span>}
                  name="fullname"
                  rules={[{ required: true, message: t('instructor.profile.validation.fullNameRequired') }]}
                >
                  <Input
                    placeholder={t('instructor.profile.placeholder.fullName')}
                    className="!rounded-xl !py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.email')}</span>}
                  name="email"
                  rules={[
                    { required: true, message: t('instructor.profile.validation.emailRequired') },
                    { type: 'email', message: t('instructor.profile.validation.emailInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.placeholder.email')}
                    className="!rounded-xl !py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.phoneNumber')}</span>}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t('instructor.profile.validation.phoneRequired') },
                    { pattern: /^[0-9]{4,15}$/, message: t('instructor.profile.validation.phoneInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.placeholder.phoneNumber')}
                    className="!rounded-xl !py-2.5"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.instructorCode')}</span>}
                  name="instructorCode"
                >
                  <Input
                    placeholder={t('instructor.profile.placeholder.instructorCode')}
                    disabled
                    className="!rounded-xl !py-2.5 !bg-slate-50"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-slate-700 font-medium">{t('instructor.profile.avatarUrl')}</span>}
                name="avatarUrl"
                rules={[
                  { type: 'url', message: t('instructor.profile.validation.urlInvalid') }
                ]}
              >
                <Input
                  placeholder={t('instructor.profile.placeholder.avatarUrl')}
                  className="!rounded-xl !py-2.5"
                />
              </Form.Item>

              {/* Current Avatar Preview */}
              {profileData?.avatarUrl && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">{t('instructor.profile.currentAvatar')}</div>
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 object-cover rounded-full border-2 border-blue-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                {t('instructor.profile.professionalInformation')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.experienceYears')}</span>}
                  name="experienceYears"
                  rules={[
                    { required: true, message: t('instructor.profile.validation.experienceYearsRequired') },
                    { type: 'number', min: 0, max: 50, message: t('instructor.profile.validation.experienceYearsRange') }
                  ]}
                >
                  <InputNumber
                    placeholder={t('instructor.profile.placeholder.experienceYears')}
                    className="!w-full !rounded-xl"
                    min={0}
                    max={50}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-slate-700 font-medium">{t('instructor.profile.professionalProfileUrl')}</span>}
                  name="professionalProfileUrl"
                  rules={[
                    { type: 'url', message: t('instructor.profile.validation.urlInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.placeholder.professionalProfileUrl')}
                    className="!rounded-xl !py-2.5"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-slate-700 font-medium">{t('instructor.profile.specialization')}</span>}
                name="specialization"
                rules={[{ required: true, message: t('instructor.profile.validation.specializationRequired') }]}
              >
                <Input
                  placeholder={t('instructor.profile.placeholder.specialization')}
                  className="!rounded-xl !py-2.5"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-slate-700 font-medium">{t('instructor.profile.biography')}</span>}
                name="biography"
                rules={[{ required: true, message: t('instructor.profile.validation.biographyRequired') }]}
              >
                <TextArea
                  rows={5}
                  placeholder={t('instructor.profile.placeholder.biography')}
                  maxLength={1000}
                  showCount
                  className="!rounded-xl"
                />
              </Form.Item>

              {/* Current Professional Profile Preview */}
              {profileData?.professionalProfileUrl && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">{t('instructor.profile.currentProfessionalCertificate')}</div>
                  <img
                    src={profileData.professionalProfileUrl}
                    alt="Professional Certificate"
                    className="max-w-md rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Read-only Information Section */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-slate-300 to-slate-400" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-500" />
                {t('instructor.profile.readOnlyInformation')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t('instructor.profile.status')}</div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${profileData?.isInstructorActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className="text-slate-800 font-semibold">
                      {profileData?.isInstructorActive ? t('instructor.profile.active') : t('instructor.profile.inactive')}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t('instructor.profile.hireDate')}</div>
                  <div className="text-slate-800 font-semibold">
                    {profileData?.hireDate ? new Date(profileData.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t('instructor.profile.userId')}</div>
                  <div className="text-slate-800 font-semibold font-mono text-sm">{profileData?.userId || 'N/A'}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{t('instructor.profile.role')}</div>
                  <div className="text-slate-800 font-semibold">{t('instructor.profile.instructorRole')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="p-6 flex gap-4 justify-end">
              <Button
                size="large"
                onClick={handleCancel}
                className="!rounded-xl !px-6"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submitting}
                className="!rounded-xl !px-6 !font-semibold"
              >
                {t('common.saveChanges')}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
