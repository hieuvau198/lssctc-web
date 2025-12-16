// src/app/apis/SimulationManager/SimulationManagerDashbard.js

import apiClient from '../../libs/axios';

/**
 * Get simulation manager overview summary with total counts
 * @returns {Promise<Object>} Summary data with total counts
 */
export const getSimulationManagerSummary = async () => {
    try {
        const response = await apiClient.get('/simulation-manager/dashboard/summary');
        return response.data?.data || null;
    } catch (error) {
        console.error('Error fetching simulation manager summary:', error);
        throw error;
    }
};

/**
 * Get monthly practice completion distribution (Completed vs NotCompleted) for a specific year
 * @param {number} year - The year to get completion distribution for (optional, defaults to current year)
 * @returns {Promise<Array>} Monthly completion distribution data
 */
export const getMonthlyCompletionDistribution = async (year) => {
    try {
        const params = year ? { year } : {};
        const response = await apiClient.get('/simulation-manager/dashboard/practices/completion-distribution/monthly', {
            params,
        });
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching monthly completion distribution:', error);
        throw error;
    }
};

/**
 * Get practice duration distribution grouped by time ranges
 * @returns {Promise<Array>} Duration distribution data grouped by time ranges
 */
export const getPracticeDurationDistribution = async () => {
    try {
        const response = await apiClient.get('/simulation-manager/dashboard/practices/duration-distribution');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching practice duration distribution:', error);
        throw error;
    }
};
