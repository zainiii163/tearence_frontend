import Api from "../api";

const UserValidationService = {
  /**
   * Check if a user with the given email is already registered
   * @param {string} email - The email to check
   * @returns {Promise<{exists: boolean, user?: object, message?: string}>}
   */
  checkUserExists: async (email) => {
    try {
      const response = await Api.post(`v1/auth/check-user`, { email });
      return {
        exists: true,
        user: response.data?.data?.user,
        message: "User found"
      };
    } catch (error) {
      // If 404, user doesn't exist
      if (error.response?.status === 404) {
        return {
          exists: false,
          message: "User not found"
        };
      }
      
      // For other errors, return the error message
      return {
        exists: false,
        message: error.message || "Unable to verify user"
      };
    }
  },

  /**
   * Generate signup invitation link for unregistered users
   * @param {string} email - The email to generate invitation for
   * @param {string} businessName - Business name (optional)
   * @param {string} storeName - Store name (optional)
   * @returns {string} - Invitation message with signup link
   */
  generateInvitationMessage: (email, businessName = null, storeName = null) => {
    const baseUrl = window.location.origin;
    const signupUrl = `${baseUrl}/register?email=${encodeURIComponent(email)}`;
    
    let message = `The user ${email} is not registered on WWA.\n\n`;
    message += `Please ask them to sign up first:\n${signupUrl}\n\n`;
    
    if (businessName) {
      message += `After registration, you can add them to your business "${businessName}".`;
    } else if (storeName) {
      message += `After registration, you can add them to your store "${storeName}".`;
    } else {
      message += `After registration, you can add them to your team.`;
    }
    
    return message;
  }
};

export default UserValidationService;
