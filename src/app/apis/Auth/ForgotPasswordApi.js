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
 * Verify the OTP code.
 * POST /Password/verify-otp
 * @param {string} email
 * @param {string} otpCode
 * @returns {Promise<{success: boolean, message: string, email: string, resetToken: string, expiresIn: number}>}
 */
export async function verifyResetCode(email, otpCode) {
    const response = await apiClient.post('/Password/verify-otp', { email, otpCode });
    return response.data;
}

/**
 * Reset the password using the token.
 * POST /Password/reset
 * @param {object} data - { email, resetToken, newPassword, confirmPassword }
 * @returns {Promise<any>}
 */
export async function resetPassword(data) {
    const response = await apiClient.post('/Password/reset', data);
    return response.data;
}

export default {
    sendResetCode,
    verifyResetCode,
    resetPassword,
};
