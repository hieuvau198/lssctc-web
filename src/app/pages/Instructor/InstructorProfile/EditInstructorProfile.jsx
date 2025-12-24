// src\app\pages\Instructor\InstructorProfile\EditInstructorProfile.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, message, Alert, InputNumber } from 'antd';
import { ArrowLeft, User, Briefcase, Shield } from 'lucide-react';
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
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <div className="flex flex-col justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600 font-medium">{t('instructor.profile.loadingProfile')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-2 border-neutral-200 p-8">
            <Alert
              message={t('instructor.profile.error.errorLoadingProfile')}
              description={error}
              type="error"
              showIcon
            />
            <button
              onClick={handleCancel}
              className="mt-4 px-5 py-2.5 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:bg-neutral-200 transition-all"
            >
              {t('instructor.profile.backToProfile')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Industrial Form Styles */}
      <style>{`
        .industrial-form .ant-form-item-label > label {
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.05em !important;
          color: #525252 !important;
        }
        .industrial-form .ant-input,
        .industrial-form .ant-input-number,
        .industrial-form .ant-input-affix-wrapper,
        .industrial-form textarea.ant-input {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
        }
        .industrial-form .ant-input:hover,
        .industrial-form .ant-input:focus,
        .industrial-form .ant-input-number:hover,
        .industrial-form .ant-input-number-focused,
        .industrial-form .ant-input-affix-wrapper:hover,
        .industrial-form .ant-input-affix-wrapper-focused,
        .industrial-form textarea.ant-input:hover,
        .industrial-form textarea.ant-input:focus {
          border-color: #facc15 !important;
          box-shadow: none !important;
        }
        .industrial-form .ant-input-number {
          width: 100% !important;
        }
        .industrial-form .ant-input-number-handler-wrap {
          display: none;
        }
        .industrial-form .ant-input-disabled,
        .industrial-form .ant-input[disabled] {
          background: #f5f5f5 !important;
          color: #737373 !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Card - Industrial Style */}
        <div className="bg-white border-2 border-neutral-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="w-10 h-10 bg-neutral-100 border-2 border-neutral-300 hover:border-black hover:bg-yellow-400 flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-700" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
                  {t('instructor.profile.updateProfile')}
                </h1>
                <p className="text-sm text-neutral-600 mt-1">{t('instructor.profile.updateDescription')}</p>
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
          className="space-y-6 industrial-form"
        >
          {/* Basic Information Section */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="h-1 bg-yellow-400" />
            <div className="p-6">
              <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                {t('instructor.profile.basicInformation')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={t('instructor.profile.form.fullName')}
                  name="fullname"
                  rules={[{ required: true, message: t('instructor.profile.form.fullNameRequired') }]}
                >
                  <Input
                    placeholder={t('instructor.profile.form.fullNamePlaceholder')}
                    className="h-10"
                  />
                </Form.Item>

                <Form.Item
                  label={t('instructor.profile.form.email')}
                  name="email"
                  rules={[
                    { required: true, message: t('instructor.profile.form.emailRequired') },
                    { type: 'email', message: t('instructor.profile.form.emailInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.form.emailPlaceholder')}
                    className="h-10"
                  />
                </Form.Item>

                <Form.Item
                  label={t('instructor.profile.form.phone')}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t('instructor.profile.form.phoneRequired') },
                    { pattern: /^[0-9]{4,15}$/, message: t('instructor.profile.form.phoneInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.form.phonePlaceholder')}
                    className="h-10"
                  />
                </Form.Item>

                <Form.Item
                  label={t('instructor.profile.form.instructorCode')}
                  name="instructorCode"
                >
                  <Input
                    placeholder={t('instructor.profile.form.instructorCodePlaceholder')}
                    disabled
                    className="h-10"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t('instructor.profile.form.avatarUrl')}
                name="avatarUrl"
                rules={[
                  { type: 'url', message: t('instructor.profile.form.avatarUrlInvalid') }
                ]}
              >
                <Input
                  placeholder={t('instructor.profile.form.avatarUrlPlaceholder')}
                  className="h-10"
                />
              </Form.Item>

              {/* Current Avatar Preview */}
              {profileData?.avatarUrl && (
                <div className="mt-4 p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{t('instructor.profile.currentAvatar')}</div>
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 object-cover border-4 border-black"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="h-1 bg-black" />
            <div className="p-6">
              <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-yellow-400" />
                </div>
                {t('instructor.profile.professionalInformation')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={t('instructor.profile.form.experienceYears')}
                  name="experienceYears"
                  rules={[
                    { required: true, message: t('instructor.profile.form.experienceYearsRequired') },
                    { type: 'number', min: 0, max: 50, message: t('instructor.profile.form.experienceYearsRange') }
                  ]}
                >
                  <InputNumber
                    placeholder={t('instructor.profile.form.experienceYearsPlaceholder')}
                    className="h-10"
                    min={0}
                    max={50}
                  />
                </Form.Item>

                <Form.Item
                  label={t('instructor.profile.form.professionalProfileUrl')}
                  name="professionalProfileUrl"
                  rules={[
                    { type: 'url', message: t('instructor.profile.form.professionalProfileUrlInvalid') }
                  ]}
                >
                  <Input
                    placeholder={t('instructor.profile.form.professionalProfileUrlPlaceholder')}
                    className="h-10"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t('instructor.profile.form.specialization')}
                name="specialization"
                rules={[{ required: true, message: t('instructor.profile.form.specializationRequired') }]}
              >
                <Input
                  placeholder={t('instructor.profile.form.specializationPlaceholder')}
                  className="h-10"
                />
              </Form.Item>

              <Form.Item
                label={t('instructor.profile.form.biography')}
                name="biography"
                rules={[{ required: true, message: t('instructor.profile.form.biographyRequired') }]}
              >
                <TextArea
                  rows={5}
                  placeholder={t('instructor.profile.form.biographyPlaceholder')}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              {/* Current Professional Profile Preview */}
              {profileData?.professionalProfileUrl && (
                <div className="mt-4 p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{t('instructor.profile.currentProfessionalCertificate')}</div>
                  <img
                    src={profileData.professionalProfileUrl}
                    alt="Professional Certificate"
                    className="max-w-md border-2 border-neutral-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Read-only Information Section */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="h-1 bg-neutral-400" />
            <div className="p-6">
              <h2 className="text-lg font-black text-black mb-5 flex items-center gap-2 uppercase tracking-tight">
                <div className="w-8 h-8 bg-neutral-400 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                {t('instructor.profile.readOnlyInformation')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('instructor.profile.form.status')}</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-black uppercase ${profileData?.isInstructorActive ? 'bg-emerald-400 text-emerald-900' : 'bg-red-400 text-red-900'}`}>
                      {profileData?.isInstructorActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('instructor.profile.form.hireDate')}</div>
                  <div className="text-neutral-800 font-semibold">
                    {profileData?.hireDate ? new Date(profileData.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                </div>
                <div className="p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('instructor.profile.form.userId')}</div>
                  <div className="text-neutral-800 font-semibold font-mono text-sm">{profileData?.userId || 'N/A'}</div>
                </div>
                <div className="p-4 bg-neutral-50 border-2 border-neutral-200">
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{t('instructor.profile.form.role')}</div>
                  <div className="text-neutral-800 font-semibold">{t('instructor.profile.roles.instructor')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white border-2 border-neutral-200 overflow-hidden">
            <div className="p-6 flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-white border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:border-black hover:text-black transition-all"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-yellow-400 border-2 border-black text-black font-black uppercase text-xs tracking-wider hover:bg-yellow-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                {t('common.saveChanges')}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
