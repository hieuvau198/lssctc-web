import apiClient from '../../libs/axios';

/**
 * Request a password reset code to be sent to the email.
 * POST /Password/forgot
 * @param {string} email
 * @returns {Promise<any>}
 */
export async function sendResetCode(email) {
    const response = await apiClient.post('/Password/forgot', { email });
    return response.data;
}

/**
 * Verify the reset code sent to the email.
 * POST /Authens/verify-reset-code (Presumed, waiting for confirmation if incorrect)
 * @param {string} email
 * @param {string} code
 * @returns {Promise<any>}
 */
export async function verifyResetCode(email, code) {
    // Use existing path until user provides new one, or leave as mock if unknown.
    // Using /Authens/verify-reset-code for now as placeholder or if it still works.
    // If user complains about verify specifically, I will ask.
    // But likely, if forgot is under `/Password/forgot`, verify might be `/Password/verify`.
    // I'll try /Password/verify-otp as a guess or stick to Previous one?
    // Let's stick to the PREVIOUS one for verify/reset because the user ONLY corrected the 'forgot' endpoint.
    // However, I will comment that it might need update.
    const response = await apiClient.post('/Authens/verify-reset-code', { email, code });
    return response.data;
}

/**
 * Reset the password using the new password.
 * POST /Authens/reset-password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
export async function resetPassword(email, password) {
    const response = await apiClient.post('/Authens/reset-password', { email, password });
    return response.data;
}

export default {
    sendResetCode,
    verifyResetCode,
    resetPassword,
};
