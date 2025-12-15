// src\app\pages\Trainee\Profile\EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, message, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { User, Phone, Image, GraduationCap, FileText, CreditCard, Car } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { getTraineeProfileByUserId, updateTraineeProfileByUserId } from '../../../apis/Trainee/TraineeProfileApi';

export default function EditProfile() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const { nameid } = useAuthStore();
  const token = getAuthToken();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError(t('trainee.editProfile.tokenNotFound'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { jwtDecode } = await import('jwt-decode');
        const decoded = jwtDecode(token);
        const userId = decoded.nameid || decoded.nameId || decoded.sub;

        if (!userId) {
          throw new Error(t('trainee.editProfile.userIdNotFound'));
        }

        const fullProfile = await getTraineeProfileByUserId(userId, token);
        setProfileData(fullProfile);

        form.setFieldsValue({
          phoneNumber: fullProfile.phoneNumber,
          avatarUrl: fullProfile.avatarUrl,
          educationLevel: fullProfile.educationLevel,
          educationImageUrl: fullProfile.educationImageUrl,
        });

        setError(null);
      } catch (err) {
        setError(err.message || t('trainee.editProfile.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, form]);

  const handleSubmit = async (values) => {
    if (!profileData?.userId) {
      message.error(t('trainee.editProfile.userIdNotFound'));
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        phoneNumber: values.phoneNumber,
        avatarUrl: values.avatarUrl,
        educationLevel: values.educationLevel,
        educationImageUrl: values.educationImageUrl,
      };

      await updateTraineeProfileByUserId(profileData.userId, updateData, token);
      message.success(t('trainee.editProfile.updateSuccess'));

      setTimeout(() => {
        navigate('/profile');
      }, 1000);

    } catch (err) {
      message.error(err.message || t('trainee.editProfile.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-12">
            <div className="flex flex-col justify-center items-center">
              <Spin size="large" />
              <p className="mt-4 text-slate-500">{t('trainee.editProfile.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
            <Alert message={t('trainee.editProfile.errorLoadingProfile')} description={error} type="error" showIcon />
            <Button className="mt-4" onClick={handleCancel}>{t('trainee.editProfile.backToProfile')}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />

        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500" />
          <div className="p-6 flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="!rounded-xl"
            >
              {t('trainee.editProfile.back')}
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t('trainee.editProfile.updateProfile')}</h3>
                <p className="text-sm text-slate-500">{t('trainee.editProfile.updateProfileDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" className="p-6">

            {/* Read-only Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">{t('trainee.editProfile.basicInfoReadOnly')}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
                {[
                  { label: t('trainee.profile.fullName'), value: profileData?.fullname },
                  { label: t('trainee.profile.email'), value: profileData?.email },
                  { label: t('trainee.editProfile.username'), value: profileData?.username },
                  { label: t('trainee.profile.studentId'), value: profileData?.traineeCode },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{item.label}</div>
                    <div className="text-slate-800 font-medium">{item.value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-cyan-700">{t('trainee.editProfile.editableInfo')}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={<span className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-500" />{t('trainee.editProfile.phoneNumber')}</span>}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t('trainee.editProfile.phoneRequired') },
                    { pattern: /^[0-9]{4,15}$/, message: t('trainee.editProfile.phonePattern') }
                  ]}
                >
                  <Input placeholder={t('trainee.editProfile.phonePlaceholder')} className="!rounded-xl !py-2.5" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><Image className="w-4 h-4 text-cyan-500" />{t('trainee.editProfile.avatarUrl')}</span>}
                  name="avatarUrl"
                  rules={[{ type: 'url', message: t('trainee.editProfile.urlInvalid') }]}
                >
                  <Input placeholder={t('trainee.editProfile.avatarPlaceholder')} className="!rounded-xl !py-2.5" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-cyan-500" />{t('trainee.editProfile.educationLevelLabel')}</span>}
                  name="educationLevel"
                  rules={[{ required: true, message: t('trainee.editProfile.educationRequired') }]}
                >
                  <Input placeholder={t('trainee.editProfile.educationPlaceholder')} className="!rounded-xl !py-2.5" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-500" />{t('trainee.editProfile.educationCertUrl')}</span>}
                  name="educationImageUrl"
                  rules={[{ type: 'url', message: t('trainee.editProfile.urlInvalid') }]}
                >
                  <Input placeholder={t('trainee.editProfile.certPlaceholder')} className="!rounded-xl !py-2.5" />
                </Form.Item>
              </div>

              {/* Current Images Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {profileData?.avatarUrl && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                    <div className="text-sm font-medium text-slate-600 mb-3">{t('trainee.editProfile.currentAvatar')}</div>
                    <img src={profileData.avatarUrl} alt="Avatar" className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg" />
                  </div>
                )}
                {profileData?.educationImageUrl && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                    <div className="text-sm font-medium text-slate-600 mb-3">{t('trainee.editProfile.currentEducationCert')}</div>
                    <img src={profileData.educationImageUrl} alt="Education Certificate" className="max-w-full max-h-32 rounded-lg border shadow" />
                  </div>
                )}
              </div>
            </div>

            {/* Read-only Profile Sections */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">{t('trainee.editProfile.otherInfoReadOnly')}</h4>
              </div>

              {/* Driver License */}
              <div className="mb-4 p-5 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-200/60">
                <h5 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
                  <Car className="w-4 h-4" />
                  {t('trainee.profile.driverLicenseInfo')}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">{t('trainee.editProfile.number')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.driverLicenseNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('trainee.editProfile.level')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.driverLicenseLevel || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('trainee.editProfile.issued')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.driverLicenseIssuedDate ? new Date(profileData.driverLicenseIssuedDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                {profileData?.driverLicenseImageUrl && (
                  <img src={profileData.driverLicenseImageUrl} alt="License" className="mt-3 max-w-xs rounded-lg border shadow" />
                )}
              </div>

              {/* Citizen Card */}
              <div className="p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/60">
                <h5 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                  <CreditCard className="w-4 h-4" />
                  {t('trainee.profile.citizenCardInfo')}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">{t('trainee.editProfile.id')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.citizenCardId || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('trainee.editProfile.issued')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.citizenCardIssuedDate || '-'}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-slate-500">{t('trainee.editProfile.place')}:</span>
                    <span className="ml-2 font-medium text-slate-800">{profileData?.citizenCardPlaceOfIssue || '-'}</span>
                  </div>
                </div>
                {profileData?.citizenCardImageUrl && (
                  <img src={profileData.citizenCardImageUrl} alt="Citizen Card" className="mt-3 max-w-xs rounded-lg border shadow" />
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
              <Button
                size="large"
                onClick={handleCancel}
                className="!rounded-xl !h-11 !px-6 !font-medium"
                icon={<CloseOutlined />}
              >
                {t('trainee.editProfile.cancel')}
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submitting}
                className="!rounded-xl !h-11 !px-6 !font-semibold"
                icon={<SaveOutlined />}
              >
                {t('trainee.editProfile.saveChanges')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
