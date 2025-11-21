// src\app\pages\SimManager\Practices\PracticeDetail\PracticeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPracticeById,
  updatePractice,
  deletePractice
} from "../../../../apis/SimulationManager/SimulationManagerPracticeApi";
import { ArrowLeft, Save, Trash2, Clock, Zap, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import PracticeSteps from "./PracticeStep/PracticeSteps";

export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Practice info
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getPracticeById(id)
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch practice");
        setLoading(false);
      });
  }, [id]);

  // Practice update
  const handleUpdate = () => {
    setUpdating(true);
    updatePractice(id, form)
      .then(() => {
        setSuccessMessage("Practice updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setUpdating(false);
      })
      .catch(() => {
        setError("Update failed");
        setUpdating(false);
      });
  };

  // Practice delete
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this practice?")) return;
    setDeleting(true);
    deletePractice(id)
      .then(() => {
        navigate("/sim-manager/practices");
      })
      .catch(() => {
        setError("Delete failed");
        setDeleting(false);
      });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{form.practiceName}</h1>
          <p className="text-gray-600 mt-1">{form.practiceCode}</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

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
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-4">
              {/* Practice Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Name
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.practiceName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceName: e.target.value }))
                  }
                  placeholder="Enter practice name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="4"
                  value={form.practiceDescription || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceDescription: e.target.value }))
                  }
                  placeholder="Enter practice description"
                />
              </div>

              {/* Duration & Difficulty Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="number"
                      value={form.estimatedDurationMinutes || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          estimatedDurationMinutes: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={form.difficultyLevel || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, difficultyLevel: e.target.value }))
                    }
                  >
                    <option value="">Select difficulty...</option>
                    <option value="Entry">Entry</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Max Attempts & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="number"
                      value={form.maxAttempts || ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          maxAttempts: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={form.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.value === "true" }))
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                onClick={handleUpdate}
                disabled={updating}
              >
                <Save className="h-4 w-4" />
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Info Card */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Summary</h3>
            
            <div className="space-y-4">
              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Duration</p>
                  <p className="text-lg font-bold text-blue-900">{form.estimatedDurationMinutes} min</p>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  form.difficultyLevel === 'Entry' ? 'bg-green-200' :
                  form.difficultyLevel === 'Intermediate' ? 'bg-yellow-200' :
                  'bg-red-200'
                }`}>
                  <Zap className={`h-5 w-5 ${
                    form.difficultyLevel === 'Entry' ? 'text-green-700' :
                    form.difficultyLevel === 'Intermediate' ? 'text-yellow-700' :
                    'text-red-700'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Difficulty</p>
                  <p className="text-lg font-bold text-gray-900">{form.difficultyLevel || 'N/A'}</p>
                </div>
              </div>

              {/* Max Attempts */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Max Attempts</p>
                  <p className="text-lg font-bold text-gray-900">{form.maxAttempts}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.isActive ? 'bg-green-200' : 'bg-gray-200'}`}>
                  <CheckCircle className={`h-5 w-5 ${form.isActive ? 'text-green-700' : 'text-gray-700'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-bold text-gray-900">{form.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps section */}
      <div>
        <PracticeSteps practiceId={id} />
      </div>
    </div>
  );
}
