// src\app\pages\Trainee\Profile\EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, message, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Image, GraduationCap, FileText, CreditCard, Car, ArrowLeft, Save, X } from 'lucide-react';
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
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />
          <div className="bg-white border-2 border-neutral-200 p-12">
            <div className="flex flex-col justify-center items-center">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600 font-medium">{t('trainee.editProfile.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />
          <div className="bg-white border-2 border-neutral-200 p-8">
            <Alert message={t('trainee.editProfile.errorLoadingProfile')} description={error} type="error" showIcon />
            <button
              onClick={handleCancel}
              className="mt-4 px-5 py-2.5 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:bg-neutral-200 transition-all"
            >
              {t('trainee.editProfile.backToProfile')}
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
        .trainee-industrial-form .ant-form-item-label > label {
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.05em !important;
          color: #525252 !important;
        }
        .trainee-industrial-form .ant-input {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
        }
        .trainee-industrial-form .ant-input:hover,
        .trainee-industrial-form .ant-input:focus {
          border-color: #10b981 !important;
          box-shadow: none !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <PageNav nameMap={{ profile: t('trainee.profile.title'), edit: t('trainee.editProfile.title') }} />

        {/* Header Card - Industrial Style */}
        <div className="bg-white border-2 border-neutral-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
          <div className="p-6 flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="w-10 h-10 bg-neutral-100 border-2 border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-black uppercase tracking-tight">{t('trainee.editProfile.updateProfile')}</h3>
                <p className="text-sm text-neutral-600">{t('trainee.editProfile.updateProfileDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card - Industrial Style */}
        <div className="bg-white border-2 border-neutral-200 overflow-hidden">
          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" className="p-6 trainee-industrial-form">

            {/* Read-only Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-neutral-400 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-black text-black uppercase tracking-tight">{t('trainee.editProfile.basicInfoReadOnly')}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-neutral-50 border-2 border-neutral-200">
                {[
                  { label: t('trainee.profile.fullName'), value: profileData?.fullname },
                  { label: t('trainee.profile.email'), value: profileData?.email },
                  { label: t('trainee.editProfile.username'), value: profileData?.username },
                  { label: t('trainee.profile.studentId'), value: profileData?.traineeCode },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-neutral-800 font-semibold">{item.value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-black text-black uppercase tracking-tight">{t('trainee.editProfile.editableInfo')}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label={<span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" />{t('trainee.editProfile.phoneNumber')}</span>}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: t('trainee.editProfile.phoneRequired') },
                    { pattern: /^[0-9]{4,15}$/, message: t('trainee.editProfile.phonePattern') }
                  ]}
                >
                  <Input placeholder={t('trainee.editProfile.phonePlaceholder')} className="h-10" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><Image className="w-4 h-4 text-emerald-500" />{t('trainee.editProfile.avatarUrl')}</span>}
                  name="avatarUrl"
                  rules={[{ type: 'url', message: t('trainee.editProfile.urlInvalid') }]}
                >
                  <Input placeholder={t('trainee.editProfile.avatarPlaceholder')} className="h-10" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-emerald-500" />{t('trainee.editProfile.educationLevelLabel')}</span>}
                  name="educationLevel"
                  rules={[{ required: true, message: t('trainee.editProfile.educationRequired') }]}
                >
                  <Input placeholder={t('trainee.editProfile.educationPlaceholder')} className="h-10" />
                </Form.Item>

                <Form.Item
                  label={<span className="flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-500" />{t('trainee.editProfile.educationCertUrl')}</span>}
                  name="educationImageUrl"
                  rules={[{ type: 'url', message: t('trainee.editProfile.urlInvalid') }]}
                >
                  <Input placeholder={t('trainee.editProfile.certPlaceholder')} className="h-10" />
                </Form.Item>
              </div>

              {/* Current Images Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {profileData?.avatarUrl && (
                  <div className="bg-neutral-50 border-2 border-neutral-200 p-4">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{t('trainee.editProfile.currentAvatar')}</div>
                    <img src={profileData.avatarUrl} alt="Avatar" className="w-24 h-24 object-cover border-4 border-emerald-500" />
                  </div>
                )}
                {profileData?.educationImageUrl && (
                  <div className="bg-neutral-50 border-2 border-neutral-200 p-4">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{t('trainee.editProfile.currentEducationCert')}</div>
                    <img src={profileData.educationImageUrl} alt="Education Certificate" className="max-w-full max-h-32 border-2 border-neutral-200" />
                  </div>
                )}
              </div>
            </div>

            {/* Read-only Profile Sections */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-neutral-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-black text-black uppercase tracking-tight">{t('trainee.editProfile.otherInfoReadOnly')}</h4>
              </div>

              {/* Driver License */}
              <div className="mb-4 p-5 bg-amber-50 border-2 border-amber-300">
                <h5 className="font-black mb-3 flex items-center gap-2 text-amber-800 uppercase text-sm tracking-tight">
                  <div className="w-6 h-6 bg-amber-500 border border-amber-700 flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  {t('trainee.profile.driverLicenseInfo')}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.number')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.driverLicenseNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.level')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.driverLicenseLevel || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.issued')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.driverLicenseIssuedDate ? new Date(profileData.driverLicenseIssuedDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                {profileData?.driverLicenseImageUrl && (
                  <img src={profileData.driverLicenseImageUrl} alt="License" className="mt-3 max-w-xs border-2 border-amber-200" />
                )}
              </div>

              {/* Citizen Card */}
              <div className="p-5 bg-violet-50 border-2 border-violet-300">
                <h5 className="font-black mb-3 flex items-center gap-2 text-violet-800 uppercase text-sm tracking-tight">
                  <div className="w-6 h-6 bg-violet-500 border border-violet-700 flex items-center justify-center">
                    <CreditCard className="w-3 h-3 text-white" />
                  </div>
                  {t('trainee.profile.citizenCardInfo')}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.id')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.citizenCardId || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.issued')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.citizenCardIssuedDate || '-'}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">{t('trainee.editProfile.place')}</span>
                    <span className="font-semibold text-neutral-800">{profileData?.citizenCardPlaceOfIssue || '-'}</span>
                  </div>
                </div>
                {profileData?.citizenCardImageUrl && (
                  <img src={profileData.citizenCardImageUrl} alt="Citizen Card" className="mt-3 max-w-xs border-2 border-violet-200" />
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t-2 border-neutral-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-white border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:border-black hover:text-black transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t('trainee.editProfile.cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-500 border-2 border-emerald-700 text-white font-black uppercase text-xs tracking-wider hover:bg-emerald-600 hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <Save className="w-4 h-4" />
                {t('trainee.editProfile.saveChanges')}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
