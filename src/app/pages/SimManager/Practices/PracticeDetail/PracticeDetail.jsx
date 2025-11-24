// src\app\pages\SimManager\Practices\PracticeDetail\PracticeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPracticeById,
  updatePractice,
  deletePractice,
  getTasksByPracticeId
} from "../../../../apis/SimulationManager/SimulationManagerPracticeApi";
import { updateTask, createTask, deleteTaskFromPractice, getAllTasks, addTaskToPractice, deleteTask } from "../../../../apis/SimulationManager/SimulationManagerTaskApi";
import { ArrowLeft, Save, Trash2, Clock, Zap, AlertCircle, CheckCircle, BookOpen, ListTodo, X, Edit, Plus } from "lucide-react";

export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Practice info
  const [form, setForm] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalType, setModalType] = useState(null); // 'success', 'error', or null
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Delete confirmation modal
  
  // Task edit state
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({});
  const [updatingTask, setUpdatingTask] = useState(false);
  const [showTaskEditModal, setShowTaskEditModal] = useState(false);
  const [showTaskCreateModal, setShowTaskCreateModal] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [showChooseTaskModal, setShowChooseTaskModal] = useState(false);
  const [systemTasks, setSystemTasks] = useState([]);
  const [systemTasksLoading, setSystemTasksLoading] = useState(false);
  const [systemTasksPage, setSystemTasksPage] = useState(1);
  const [systemTasksTotalPages, setSystemTasksTotalPages] = useState(1);
  const [selectedSystemTaskId, setSelectedSystemTaskId] = useState(null);
  const [deletingSystemTaskId, setDeletingSystemTaskId] = useState(null);
  const [showDeleteSystemTaskConfirm, setShowDeleteSystemTaskConfirm] = useState(false);

  // Fetch practice details
  useEffect(() => {
    setLoading(true);
    getPracticeById(id)
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch practice");
        setModalType("error");
        setLoading(false);
      });
  }, [id]);

  // Fetch tasks
  useEffect(() => {
    if (!id) return;
    setTasksLoading(true);
    getTasksByPracticeId(id)
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setTasksLoading(false);
      })
      .catch(() => {
        console.error("Could not fetch tasks");
        setTasksLoading(false);
      });
  }, [id]);

  // Practice update
  const handleUpdate = () => {
    // Validation
    if (!form.practiceName?.trim()) {
      setError("Practice name is required");
      setModalType("error");
      return;
    }
    if (form.practiceName.length > 200) {
      setError("Practice name must be less than 200 characters");
      setModalType("error");
      return;
    }
    if (form.practiceDescription && form.practiceDescription.length > 1000) {
      setError("Practice description must be less than 1000 characters");
      setModalType("error");
      return;
    }
    if (!form.practiceCode?.trim()) {
      setError("Practice code is required");
      setModalType("error");
      return;
    }
    if (form.practiceCode.length > 50) {
      setError("Practice code must be less than 50 characters");
      setModalType("error");
      return;
    }
    if (!form.difficultyLevel) {
      setError("Difficulty level is required");
      setModalType("error");
      return;
    }
    if (!form.estimatedDurationMinutes || form.estimatedDurationMinutes < 1) {
      setError("Duration must be greater than 0 minutes");
      setModalType("error");
      return;
    }
    if (form.estimatedDurationMinutes > 600) {
      setError("Duration must be less than 600 minutes");
      setModalType("error");
      return;
    }
    if (!form.maxAttempts || form.maxAttempts < 1) {
      setError("Max attempts must be at least 1");
      setModalType("error");
      return;
    }
    if (form.maxAttempts > 10) {
      setError("Max attempts cannot exceed 10");
      setModalType("error");
      return;
    }

    setUpdating(true);
    setError(null);

    const payload = {
      practiceName: form.practiceName,
      practiceCode: form.practiceCode,
      practiceDescription: form.practiceDescription,
      estimatedDurationMinutes: Math.max(0, parseInt(form.estimatedDurationMinutes) || 0),
      difficultyLevel: form.difficultyLevel,
      maxAttempts: Math.max(1, parseInt(form.maxAttempts) || 1),
      isActive: form.isActive,
    };

    updatePractice(id, payload)
      .then(() => {
        setSuccessMessage("Practice updated successfully!");
        setModalType("success");
        setError(null);
        setUpdating(false);
      })
      .catch((err) => {
        let errorMsg = "Update failed. Please try again.";
        
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
        setUpdating(false);
      });
  };

  // Practice delete
  const handleDelete = () => {
    setDeleting(true);
    deletePractice(id)
      .then(() => {
        setSuccessMessage("Practice deleted successfully!");
        setModalType("success");
        setShowDeleteConfirm(false);
        // Navigate back to practices list after 1.5 seconds
        setTimeout(() => {
          navigate("/simulationManager/practices");
        }, 1500);
      })
      .catch((err) => {
        let errorMsg = "Delete failed. Please try again.";
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        setError(errorMsg);
        setModalType("error");
        setShowDeleteConfirm(false);
        setDeleting(false);
      });
  };

  // Task edit handlers
  const handleOpenTaskEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      taskName: task.taskName || "",
      taskCode: task.taskCode || "",
      taskDescription: task.taskDescription || "",
      expectedResult: task.expectedResult || "",
    });
    setShowTaskEditModal(true);
  };

  const handleTaskUpdate = () => {
    // Validation
    if (!taskForm.taskName?.trim()) {
      setError("Task name is required");
      setModalType("error");
      return;
    }
    if (!taskForm.taskCode?.trim()) {
      setError("Task code is required");
      setModalType("error");
      return;
    }

    setUpdatingTask(true);
    setError(null);

    const payload = {
      taskName: taskForm.taskName,
      taskCode: taskForm.taskCode,
      taskDescription: taskForm.taskDescription || "",
      expectedResult: taskForm.expectedResult || "",
    };

    updateTask(editingTask.id, payload)
      .then(() => {
        // Update task in the list
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === editingTask.id ? { ...t, ...payload } : t
          )
        );
        setSuccessMessage("Task updated successfully!");
        setModalType("success");
        setShowTaskEditModal(false);
        setEditingTask(null);
        setTaskForm({});
        setUpdatingTask(false);
      })
      .catch((err) => {
        let errorMsg = "Update failed. Please try again.";
        
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
        setUpdatingTask(false);
      });
  };

  // Task create handlers
  const handleOpenTaskCreate = () => {
    setTaskForm({
      taskName: "",
      taskCode: "",
      taskDescription: "",
      expectedResult: "",
    });
    setShowTaskCreateModal(true);
  };

  const handleTaskCreate = () => {
    // Validation
    if (!taskForm.taskName?.trim()) {
      setError("Task name is required");
      setModalType("error");
      return;
    }
    if (!taskForm.taskCode?.trim()) {
      setError("Task code is required");
      setModalType("error");
      return;
    }

    setCreatingTask(true);
    setError(null);

    const payload = {
      taskName: taskForm.taskName,
      taskCode: taskForm.taskCode,
      taskDescription: taskForm.taskDescription || "",
      expectedResult: taskForm.expectedResult || "",
    };

    createTask(form.practiceCode, payload)
      .then((newTask) => {
        // Add new task to the list
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setSuccessMessage("Task created successfully!");
        setModalType("success");
        setShowTaskCreateModal(false);
        setTaskForm({});
        setCreatingTask(false);
      })
      .catch((err) => {
        let errorMsg = "Create failed. Please try again.";
        
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
        setCreatingTask(false);
      });
  };

  // Task delete handler
  const handleDeleteTask = () => {
    if (!deletingTaskId) return;

    setDeletingTaskId(null);
    
    deleteTaskFromPractice(id, deletingTaskId)
      .then(() => {
        // Remove task from the list
        setTasks((prevTasks) =>
          prevTasks.filter((t) => t.id !== deletingTaskId)
        );
        setSuccessMessage("Task removed successfully!");
        setModalType("success");
        setShowDeleteTaskConfirm(false);
      })
      .catch((err) => {
        let errorMsg = "Delete failed. Please try again.";
        
        // Handle new API error format
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
        setShowDeleteTaskConfirm(false);
      });
  };

  // Open choose task modal
  const handleOpenChooseTaskModal = () => {
    setSystemTasksPage(1);
    setShowChooseTaskModal(true);
    fetchSystemTasks(1);
  };

  // Fetch system tasks
  const fetchSystemTasks = (page) => {
    setSystemTasksLoading(true);
    getAllTasks(page, 10)
      .then((data) => {
        setSystemTasks(data.items || []);
        setSystemTasksTotalPages(data.totalPages || 1);
        setSystemTasksPage(page);
        setSystemTasksLoading(false);
      })
      .catch(() => {
        console.error("Could not fetch system tasks");
        setSystemTasksLoading(false);
      });
  };

  // Add selected task to practice
  const handleAddSelectedTask = () => {
    if (!selectedSystemTaskId) {
      setError("Please select a task first");
      setModalType("error");
      return;
    }

    const selectedTask = systemTasks.find(t => t.id === selectedSystemTaskId);
    if (!selectedTask) return;

    // Check if task already exists in practice
    if (tasks.some(t => t.id === selectedSystemTaskId)) {
      setError("This task is already added to the practice");
      setModalType("error");
      return;
    }

    // Call API to add task to practice
    addTaskToPractice(id, selectedSystemTaskId)
      .then(() => {
        // Add task to practice list
        setTasks((prevTasks) => [...prevTasks, selectedTask]);
        setSuccessMessage("Task added to practice successfully!");
        setModalType("success");
        setShowChooseTaskModal(false);
        setSelectedSystemTaskId(null);
      })
      .catch((err) => {
        let errorMsg = "Failed to add task. Please try again.";
        
        // Handle new API error format
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
      });
  };

  const handleDeleteSystemTask = () => {
    if (!deletingSystemTaskId) return;

    deleteTask(deletingSystemTaskId)
      .then(() => {
        // Remove task from system tasks list
        setSystemTasks((prevTasks) =>
          prevTasks.filter((t) => t.id !== deletingSystemTaskId)
        );
        setSuccessMessage("Task deleted successfully!");
        setModalType("success");
        setShowDeleteSystemTaskConfirm(false);
        setDeletingSystemTaskId(null);
      })
      .catch((err) => {
        let errorMsg = "Failed to delete task. Please try again.";
        
        // Handle new API error format
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

  if (!form) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Error</p>
            <p>{error || "Practice not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Modal Component
  const Modal = ({ type, message, onClose }) => {
    if (!type) return null;

    const isSuccess = type === "success";

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all ${
          isSuccess ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
        }`}>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>

          {/* Title & Message */}
          <h3 className={`text-lg font-bold text-center mb-2 ${
            isSuccess ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSuccess ? 'Success!' : 'Error!'}
          </h3>
          <p className="text-gray-700 text-center text-sm mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            {isSuccess ? (
              <>
                <button
                  onClick={() => {
                    setModalType(null);
                    navigate(-1);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Back to Practices
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setModalType(null);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{form.practiceName}</h1>
          <p className="text-gray-600 mt-1">{form.practiceCode}</p>
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
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceName?.length || 0} / 200 characters
                </div>
              </div>

              {/* Practice Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Code
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.practiceCode || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, practiceCode: e.target.value }))
                  }
                  placeholder="Enter practice code"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceCode?.length || 0} / 50 characters
                </div>
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
                <div className="mt-1 text-xs text-gray-500">
                  {form.practiceDescription?.length || 0} / 1000 characters
                </div>
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
                  <div className="mt-1 text-xs text-gray-500">
                    1 - 600 minutes
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
                  <div className="mt-1 text-xs text-gray-500">
                    1 - 10 attempts
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
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                onClick={handleUpdate}
                disabled={updating}
              >
                <Save className="h-4 w-4" />
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                onClick={() => setShowDeleteConfirm(true)}
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

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ListTodo className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Practice Tasks</h2>
          <span className="ml-auto text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {tasks.length} tasks
          </span>
          <button
            onClick={handleOpenTaskCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </button>
          <button
            onClick={handleOpenChooseTaskModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Choose Task From System
          </button>
        </div>

        {tasksLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading tasks...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <ListTodo className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No tasks found for this practice</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-150"
              >
                <div className="flex items-start gap-4">
                  {/* Task Number */}
                  <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">{idx + 1}</span>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{task.taskName}</h3>
                      <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                        {task.taskCode}
                      </span>
                    </div>
                    
                    {task.taskDescription && (
                      <p className="text-sm text-gray-600 mb-2">{task.taskDescription}</p>
                    )}

                    {task.expectedResult && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        <p className="font-medium">Expected Result:</p>
                        <p>{task.expectedResult}</p>
                      </div>
                    )}
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={() => handleOpenTaskEdit(task)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setDeletingTaskId(task.id);
                        setShowDeleteTaskConfirm(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Practice</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to delete this practice? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {showDeleteTaskConfirm && deletingTaskId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteTaskConfirm(false);
                      setDeletingTaskId(null);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalType === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success</h3>
                <p className="text-gray-600 text-sm mb-4">{successMessage}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {modalType === "error" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showTaskEditModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Edit Task</h3>
              </div>
              <button
                onClick={() => {
                  setShowTaskEditModal(false);
                  setEditingTask(null);
                  setTaskForm({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={taskForm.taskName}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskName: e.target.value }))
                  }
                  placeholder="Enter task name"
                />
              </div>

              {/* Task Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Code
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={taskForm.taskCode}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskCode: e.target.value }))
                  }
                  placeholder="Enter task code"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  value={taskForm.taskDescription}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskDescription: e.target.value }))
                  }
                  placeholder="Enter task description"
                />
              </div>

              {/* Expected Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Result
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  value={taskForm.expectedResult}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, expectedResult: e.target.value }))
                  }
                  placeholder="Enter expected result"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTaskEditModal(false);
                  setEditingTask(null);
                  setTaskForm({});
                }}
                disabled={updatingTask}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskUpdate}
                disabled={updatingTask}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <Save className="h-4 w-4" />
                {updatingTask ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Create Modal */}
      {showTaskCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Plus className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
              </div>
              <button
                onClick={() => {
                  setShowTaskCreateModal(false);
                  setTaskForm({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={taskForm.taskName || ""}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskName: e.target.value }))
                  }
                  placeholder="Enter task name"
                />
              </div>

              {/* Task Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Code
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={taskForm.taskCode || ""}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskCode: e.target.value }))
                  }
                  placeholder="Enter task code"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  value={taskForm.taskDescription || ""}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, taskDescription: e.target.value }))
                  }
                  placeholder="Enter task description"
                />
              </div>

              {/* Expected Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Result
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  value={taskForm.expectedResult || ""}
                  onChange={(e) =>
                    setTaskForm((f) => ({ ...f, expectedResult: e.target.value }))
                  }
                  placeholder="Enter expected result"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowTaskCreateModal(false);
                  setTaskForm({});
                }}
                disabled={creatingTask}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskCreate}
                disabled={creatingTask}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                {creatingTask ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choose Task From System Modal */}
      {showChooseTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Choose Task From System</h3>
              </div>
              <button
                onClick={() => {
                  setShowChooseTaskModal(false);
                  setSelectedSystemTaskId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {systemTasksLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading tasks...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                  {systemTasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No tasks available in the system
                    </div>
                  ) : (
                    systemTasks.map((task) => {
                      const isAlreadyAdded = tasks.some(t => t.id === task.id);
                      const isSelected = selectedSystemTaskId === task.id;
                      
                      return (
                        <div
                          key={task.id}
                          onClick={() => !isAlreadyAdded && setSelectedSystemTaskId(task.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            isAlreadyAdded
                              ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                            }`}>
                              {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm">{task.taskName}</h4>
                              <p className="text-xs text-gray-600 mt-1">{task.taskCode}</p>
                              {task.taskDescription && (
                                <p className="text-xs text-gray-500 mt-1">{task.taskDescription}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isAlreadyAdded && (
                                <span className="text-xs font-medium text-gray-500">Added</span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingSystemTaskId(task.id);
                                  setShowDeleteSystemTaskConfirm(true);
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {systemTasksTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-6 py-4 border-t border-gray-200">
                    <button
                      onClick={() => fetchSystemTasks(systemTasksPage - 1)}
                      disabled={systemTasksPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {systemTasksPage} of {systemTasksTotalPages}
                    </span>
                    <button
                      onClick={() => fetchSystemTasks(systemTasksPage + 1)}
                      disabled={systemTasksPage === systemTasksTotalPages}
                      className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowChooseTaskModal(false);
                      setSelectedSystemTaskId(null);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSelectedTask}
                    disabled={!selectedSystemTaskId}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Select Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete System Task Confirmation Modal */}
      {showDeleteSystemTaskConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this task from the system? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteSystemTaskConfirm(false);
                  setDeletingSystemTaskId(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSystemTask}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 active:scale-95 transition-all duration-200 font-semibold"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
