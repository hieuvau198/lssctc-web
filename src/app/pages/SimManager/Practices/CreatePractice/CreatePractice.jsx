// src\app\pages\SimManager\Practices\CreatePractice\CreatePractice.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createPractice,
} from "../../../../apis/SimulationManager/SimulationManagerPracticeApi";
import { ArrowLeft, Save, Clock, Zap, AlertCircle, CheckCircle, BookOpen } from "lucide-react";

export default function CreatePractice() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    practiceName: "",
    practiceCode: "",
    practiceDescription: "",
    estimatedDurationMinutes: 1,
    difficultyLevel: "",
    maxAttempts: 1,
    isActive: true,
  });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalType, setModalType] = useState(null); // 'success', 'error', or null

  const handleCreate = () => {
    // Validation
    if (!form.practiceName?.trim()) {
      setError(t('simManager.createPractice.practiceNameRequired'));
      setModalType("error");
      return;
    }
    if (form.practiceName.length > 200) {
      setError(t('simManager.createPractice.practiceNameMaxLength'));
      setModalType("error");
      return;
    }
    if (form.practiceDescription && form.practiceDescription.length > 1000) {
      setError(t('simManager.createPractice.practiceDescMaxLength'));
      setModalType("error");
      return;
    }
    if (!form.practiceCode?.trim()) {
      setError(t('simManager.createPractice.practiceCodeRequired'));
      setModalType("error");
      return;
    }
    if (form.practiceCode.length > 50) {
      setError(t('simManager.createPractice.practiceCodeMaxLength'));
      setModalType("error");
      return;
    }
    if (!form.difficultyLevel) {
      setError(t('simManager.createPractice.difficultyRequired'));
      setModalType("error");
      return;
    }
    if (!form.estimatedDurationMinutes || form.estimatedDurationMinutes < 1) {
      setError(t('simManager.createPractice.durationMin'));
      setModalType("error");
      return;
    }
    if (form.estimatedDurationMinutes > 600) {
      setError(t('simManager.createPractice.durationMax'));
      setModalType("error");
      return;
    }
    if (!form.maxAttempts || form.maxAttempts < 1) {
      setError(t('simManager.createPractice.maxAttemptsMin'));
      setModalType("error");
      return;
    }
    if (form.maxAttempts > 10) {
      setError(t('simManager.createPractice.maxAttemptsMax'));
      setModalType("error");
      return;
    }

    setCreating(true);
    setError(null);

    const payload = {
      practiceName: form.practiceName,
      practiceCode: form.practiceCode,
      practiceDescription: form.practiceDescription,
      estimatedDurationMinutes: Math.max(1, parseInt(form.estimatedDurationMinutes) || 1),
      difficultyLevel: form.difficultyLevel,
      maxAttempts: Math.max(1, parseInt(form.maxAttempts) || 1),
      isActive: form.isActive,
    };

    createPractice(payload)
      .then((data) => {
        setSuccessMessage(t('simManager.createPractice.createSuccess'));
        setModalType("success");
        setError(null);
        setCreating(false);
        setTimeout(() => {
          navigate("/simulationManager/practices");
        }, 1500);
      })
      .catch((err) => {
        let errorMsg = t('simManager.createPractice.createFailed');
        
        // Handle new API error format: { success: false, error: { code, message, details } }
        if (err.response?.data?.error) {
          const error = err.response.data.error;
          if (error.details?.exceptionMessage) {
            errorMsg = error.details.exceptionMessage;
          } else if (error.message) {
            errorMsg = error.message;
          }
        }
        // Handle validation errors from API (old format)
        else if (err.response?.data?.errors) {
          const errors = err.response.data.errors;
          const errorMessages = [];
          
          Object.values(errors).forEach((error) => {
            if (Array.isArray(error)) {
              errorMessages.push(...error);
            } else {
              errorMessages.push(error);
            }
          });
          
          if (errorMessages.length > 0) {
            errorMsg = errorMessages[0];
          }
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        setError(errorMsg);
        setModalType("error");
        setCreating(false);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('simManager.createPractice.back')}
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('simManager.createPractice.title')}</h1>
          <p className="text-gray-600 mt-1">{t('simManager.createPractice.subtitle')}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{t('simManager.createPractice.basicInfo')}</h2>
            </div>

            <div className="space-y-4">
              {/* Practice Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('simManager.createPractice.practiceNameLabel')}
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.practiceName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceName: e.target.value }))
                  }
                  placeholder={t('simManager.createPractice.enterPracticeName')}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceName?.length || 0} / 200 {t('simManager.createPractice.characters')}
                </div>
              </div>

              {/* Practice Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('simManager.createPractice.practiceCodeLabel')}
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.practiceCode}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceCode: e.target.value }))
                  }
                  placeholder={t('simManager.createPractice.enterPracticeCode')}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceCode?.length || 0} / 50 {t('simManager.createPractice.characters')}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('simManager.createPractice.descriptionLabel')}
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="4"
                  value={form.practiceDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceDescription: e.target.value }))
                  }
                  placeholder={t('simManager.createPractice.enterDescription')}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceDescription?.length || 0} / 1000 {t('simManager.createPractice.characters')}
                </div>
              </div>

              {/* Duration & Difficulty Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('simManager.createPractice.estimatedDuration')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="number"
                      value={form.estimatedDurationMinutes}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          estimatedDurationMinutes: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {t('simManager.createPractice.minutes')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('simManager.createPractice.difficultyLevel')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={form.difficultyLevel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, difficultyLevel: e.target.value }))
                    }
                  >
                    <option value="">{t('simManager.createPractice.selectDifficulty')}</option>
                    <option value="Entry">{t('simManager.createPractice.entry')}</option>
                    <option value="Intermediate">{t('simManager.createPractice.intermediate')}</option>
                    <option value="Advanced">{t('simManager.createPractice.advanced')}</option>
                  </select>
                </div>
              </div>

              {/* Max Attempts & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('simManager.createPractice.maxAttemptsLabel')}
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="number"
                      value={form.maxAttempts}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          maxAttempts: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {t('simManager.createPractice.attempts')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('simManager.createPractice.statusLabel')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={form.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.value === "active" }))
                    }
                  >
                    <option value="active">{t('simManager.createPractice.active')}</option>
                    <option value="inactive">{t('simManager.createPractice.inactive')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                onClick={handleCreate}
                disabled={creating}
              >
                <Save className="h-4 w-4" />
                {creating ? t('simManager.createPractice.creating') : t('simManager.createPractice.createPractice')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Summary Card */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('simManager.createPractice.summary')}</h3>
            
            <div className="space-y-4">
              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">{t('simManager.createPractice.durationSummary')}</p>
                  <p className="text-lg font-bold text-blue-900">{form.estimatedDurationMinutes} min</p>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  form.difficultyLevel === 'Entry' ? 'bg-green-200' :
                  form.difficultyLevel === 'Intermediate' ? 'bg-yellow-200' :
                  form.difficultyLevel === 'Advanced' ? 'bg-red-200' :
                  'bg-gray-200'
                }`}>
                  <Zap className={`h-5 w-5 ${
                    form.difficultyLevel === 'Entry' ? 'text-green-700' :
                    form.difficultyLevel === 'Intermediate' ? 'text-yellow-700' :
                    form.difficultyLevel === 'Advanced' ? 'text-red-700' :
                    'text-gray-700'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">{t('simManager.createPractice.difficultySummary')}</p>
                  <p className="text-lg font-bold text-gray-900">{form.difficultyLevel || t('simManager.createPractice.na')}</p>
                </div>
              </div>

              {/* Max Attempts */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">{t('simManager.createPractice.maxAttemptsSummary')}</p>
                  <p className="text-lg font-bold text-gray-900">{form.maxAttempts}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.isActive ? 'bg-green-200' : 'bg-gray-200'}`}>
                  <CheckCircle className={`h-5 w-5 ${form.isActive ? 'text-green-700' : 'text-gray-700'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">{t('simManager.createPractice.statusSummary')}</p>
                  <p className="text-lg font-bold text-gray-900">{form.isActive ? t('simManager.createPractice.active') : t('simManager.createPractice.inactive')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {modalType === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('simManager.createPractice.success')}</h3>
                <p className="text-gray-600 text-sm mb-4">{successMessage}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                >
                  {t('simManager.createPractice.ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {modalType === "error" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('simManager.createPractice.error')}</h3>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  {t('simManager.createPractice.ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
