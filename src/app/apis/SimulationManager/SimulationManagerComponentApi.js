// src\app\apis\SimulationManager\SimulationManagerComponentApi.js

const API_BASE = import.meta.env.VITE_API_Simulation_Service_URL;

// get components
export async function getComponents(page = 1, pageSize = 10) {
  const API_BASE = import.meta.env.VITE_API_Simulation_Service_URL;
  const response = await fetch(`${API_BASE}/Components?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error('Failed to fetch components');
  return response.json();
}


// get components by component id
export async function getComponentById(id) {
  const response = await fetch(`${API_BASE}/Components/${id}`);
  if (!response.ok) throw new Error('Failed to fetch component');
  return response.json();
}

// update component by id and dto data
export async function updateComponent(id, data) {
  const API_BASE = import.meta.env.VITE_API_Simulation_Service_URL;
  const response = await fetch(`${API_BASE}/Components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update component');
  return response.json();
}
