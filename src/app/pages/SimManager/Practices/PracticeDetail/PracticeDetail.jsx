// src\app\pages\SimManager\Practices\PracticeDetail\PracticeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPracticeById,
  updatePractice,
  deletePractice
} from "../../../../apis/SimulationManager/SimulationManagerPracticeApi";
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
        alert("Updated!");
        setUpdating(false);
      })
      .catch(() => {
        alert("Update failed");
        setUpdating(false);
      });
  };
  // Practice delete
  const handleDelete = () => {
    if (!window.confirm("Delete this practice?")) return;
    setDeleting(true);
    deletePractice(id)
      .then(() => {
        navigate("/sim-manager/practices");
      })
      .catch(() => {
        alert("Delete failed");
        setDeleting(false);
      });
  };

  

  // general render
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!form) return null;

  return (
    <div className="p-4">
      <div className="bg-white border p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium">Practice Name</label>
          <input
            className="w-full border p-2"
            value={form.practiceName}
            onChange={(e) =>
              setForm((f) => ({ ...f, practiceName: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs font-medium">Description</label>
          <textarea
            className="w-full border p-2"
            value={form.practiceDescription || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, practiceDescription: e.target.value }))
            }
          />
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs font-medium">Duration (min)</label>
            <input
              className="w-full border p-2"
              type="number"
              value={form.estimatedDurationMinutes || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  estimatedDurationMinutes: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium">Difficulty</label>
            <input
              className="w-full border p-2"
              value={form.difficultyLevel || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, difficultyLevel: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs font-medium">Max Attempts</label>
            <input
              className="w-full border p-2"
              type="number"
              value={form.maxAttempts || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxAttempts: e.target.value }))
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium">Status</label>
            <select
              className="w-full border p-2"
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
        <div className="flex space-x-2 mt-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={updating}
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 hover:bg-red-600"
            onClick={handleDelete}
            disabled={deleting}
          >
            Delete
          </button>
        </div>
      </div>
      {/* Steps section */}
      <div className="mt-6">
        <PracticeSteps practiceId={id}/>
      </div>
    </div>
  );
}
