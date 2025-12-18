import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  createPractice,
} from "../../../../apis/SimulationManager/SimulationManagerPracticeApi";
import { ArrowLeft, Save, Clock, Zap, AlertCircle, CheckCircle, BookOpen, FlaskConical } from "lucide-react";

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

        // Handle new API error format
        if (err.response?.data?.error) {
          const error = err.response.data.error;
          if (error.details?.exceptionMessage) {
            errorMsg = error.details.exceptionMessage;
          } else if (error.message) {
            errorMsg = error.message;
          }
        }
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
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100 overflow-hidden">
      {/* Header - Industrial Style */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-400 transition-all hover:scale-105 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('simManager.createPractice.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('simManager.createPractice.subtitle')}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400 font-mono">
              ID: NEW
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="h-1 bg-yellow-400 absolute top-0 left-0 w-full z-10" />
              <div className="p-6 border-b-2 border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-black">{t('simManager.createPractice.basicInfo')}</h2>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Practice Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('simManager.createPractice.practiceNameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-medium placeholder:text-neutral-400"
                    value={form.practiceName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, practiceName: e.target.value }))
                    }
                    placeholder={t('simManager.createPractice.enterPracticeName')}
                    maxLength={200}
                  />
                  <div className="mt-1 text-right text-xs font-mono text-neutral-400">
                    {form.practiceName?.length || 0} / 200
                  </div>
                </div>

                {/* Practice Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('simManager.createPractice.practiceCodeLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-mono font-medium placeholder:text-neutral-400 uppercase"
                    value={form.practiceCode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, practiceCode: e.target.value.toUpperCase() }))
                    }
                    placeholder={t('simManager.createPractice.enterPracticeCode')}
                    maxLength={50}
                  />
                  <div className="mt-1 text-right text-xs font-mono text-neutral-400">
                    {form.practiceCode?.length || 0} / 50
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('simManager.createPractice.descriptionLabel')}
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-medium placeholder:text-neutral-400 resize-none"
                    rows="5"
                    value={form.practiceDescription}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, practiceDescription: e.target.value }))
                    }
                    placeholder={t('simManager.createPractice.enterDescription')}
                    maxLength={1000}
                  />
                  <div className="mt-1 text-right text-xs font-mono text-neutral-400">
                    {form.practiceDescription?.length || 0} / 1000
                  </div>
                </div>

                {/* Duration & Difficulty Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('simManager.createPractice.estimatedDuration')} (Min) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 w-10 bg-neutral-100 border-2 border-r-0 border-neutral-300 flex items-center justify-center group-focus-within:border-black group-focus-within:bg-yellow-400 transition-colors">
                        <Clock className="h-4 w-4 text-neutral-500 group-focus-within:text-black" />
                      </div>
                      <input
                        className="w-full pl-12 pr-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-mono font-medium"
                        type="number"
                        value={form.estimatedDurationMinutes}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            estimatedDurationMinutes: parseInt(e.target.value) || 0,
                          }))
                        }
                        min="1"
                        max="600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('simManager.createPractice.difficultyLevel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-medium appearance-none"
                      value={form.difficultyLevel}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, difficultyLevel: e.target.value }))
                      }
                    >
                      <option value="">-- {t('simManager.createPractice.selectDifficulty')} --</option>
                      <option value="Entry">ENTRY</option>
                      <option value="Intermediate">INTERMEDIATE</option>
                      <option value="Advanced">ADVANCED</option>
                    </select>
                  </div>
                </div>

                {/* Max Attempts & Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('simManager.createPractice.maxAttemptsLabel')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-0 top-0 bottom-0 w-10 bg-neutral-100 border-2 border-r-0 border-neutral-300 flex items-center justify-center group-focus-within:border-black group-focus-within:bg-yellow-400 transition-colors">
                        <Zap className="h-4 w-4 text-neutral-500 group-focus-within:text-black" />
                      </div>
                      <input
                        className="w-full pl-12 pr-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-mono font-medium"
                        type="number"
                        value={form.maxAttempts}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            maxAttempts: parseInt(e.target.value) || 0,
                          }))
                        }
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('simManager.createPractice.statusLabel')}
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border-2 border-neutral-300 bg-neutral-50 rounded-none focus:border-black focus:bg-white focus:outline-none transition-all font-medium appearance-none"
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isActive: e.target.value === "active" }))
                      }
                    >
                      <option value="active">{t('simManager.createPractice.active').toUpperCase()}</option>
                      <option value="inactive">{t('simManager.createPractice.inactive').toUpperCase()}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-neutral-50 border-t-2 border-black flex gap-4">
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black font-black uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {creating ? t('simManager.createPractice.creating') : t('simManager.createPractice.createPractice')}
                </button>
                <button
                  className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-neutral-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => navigate(-1)}
                  disabled={creating}
                >
                  {t('simManager.createPractice.cancel')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Card */}
          <div>
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] sticky top-0">
              <div className="bg-black p-4 text-white flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-black uppercase tracking-wider">{t('simManager.createPractice.summary')}</h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Duration */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neutral-100 border-2 border-black flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{t('simManager.createPractice.durationSummary')}</p>
                    <p className="text-xl font-black text-black">{form.estimatedDurationMinutes} <span className="text-sm text-neutral-500 font-medium">min</span></p>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${form.difficultyLevel === 'Entry' ? 'bg-green-400' :
                    form.difficultyLevel === 'Intermediate' ? 'bg-yellow-400' :
                      form.difficultyLevel === 'Advanced' ? 'bg-red-500 text-white' :
                        'bg-neutral-100'
                    }`}>
                    <Zap className={`h-5 w-5 ${form.difficultyLevel === 'Advanced' ? 'text-white' : 'text-black'}`} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{t('simManager.createPractice.difficultySummary')}</p>
                    <p className="text-xl font-black text-black uppercase">{form.difficultyLevel || "N/A"}</p>
                  </div>
                </div>

                {/* Max Attempts */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neutral-100 border-2 border-black flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{t('simManager.createPractice.maxAttemptsSummary')}</p>
                    <p className="text-xl font-black text-black">{form.maxAttempts}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${form.isActive ? 'bg-green-400' : 'bg-neutral-200'
                    }`}>
                    <CheckCircle className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{t('simManager.createPractice.statusSummary')}</p>
                    <p className="text-xl font-black text-black uppercase">{form.isActive ? t('simManager.createPractice.active') : t('simManager.createPractice.inactive')}</p>
                  </div>
                </div>

                {/* Preview Code */}
                <div className="mt-6 p-4 bg-neutral-900 border-2 border-black">
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-2">PRACTICE CODE</p>
                  <p className="font-mono text-yellow-400 text-lg break-all">{form.practiceCode || "..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {modalType === "success" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] max-w-sm w-full p-8 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-400 border-2 border-black rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">{t('simManager.createPractice.success')}</h3>
              <p className="text-neutral-600 font-medium mb-8">{successMessage}</p>
              <button
                onClick={() => setModalType(null)}
                className="w-full px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                {t('simManager.createPractice.ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {modalType === "error" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-sm w-full p-8 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-400 border-2 border-black rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">{t('simManager.createPractice.error')}</h3>
              <p className="text-neutral-600 font-medium mb-8">{error}</p>
              <button
                onClick={() => setModalType(null)}
                className="w-full px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                {t('simManager.createPractice.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
