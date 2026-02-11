/**
 * Comprehensive API Error Handler
 * 
 * Provides a centralized way to handle API errors with user-friendly messages.
 * This utility converts technical error responses into readable messages.
 */

/**
 * Handle API error and return user-friendly error message
 * @param {Error|Object} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        // Unauthorized - token should already be cleared by interceptor
        return "Session expired. Please login again.";

      case 403:
        return "You do not have permission to access this resource.";

      case 404:
        return "Resource not found.";

      case 422:
        // Validation errors
        const errors = data?.errors || {};
        const errorMessages = Object.values(errors).flat();
        return errorMessages.length > 0
          ? errorMessages.join(", ")
          : data?.message || "Validation error. Please check your input.";

      case 429:
        return "Too many requests. Please try again later.";

      case 500:
        return "Server error. Please try again later.";

      case 503:
        return "Service temporarily unavailable. Please try again later.";

      default:
        return data?.message || "An error occurred. Please try again.";
    }
  } else if (error.request) {
    // Request made but no response received
    return "Network error. Please check your connection.";
  } else {
    // Error in request setup
    return error.message || "An unexpected error occurred.";
  }
}

/**
 * Get error status code from error object
 * @param {Error|Object} error - Error object from API call
 * @returns {number} HTTP status code or 0 if unavailable
 */
export function getErrorStatus(error) {
  if (error.response) {
    return error.response.status || error.status || 0;
  }
  if (error.status) {
    return error.status;
  }
  return 0;
}

/**
 * Check if error is a specific status code
 * @param {Error|Object} error - Error object from API call
 * @param {number} statusCode - HTTP status code to check
 * @returns {boolean} True if error matches the status code
 */
export function isErrorStatus(error, statusCode) {
  return getErrorStatus(error) === statusCode;
}

/**
 * Check if error is a network error
 * @param {Error|Object} error - Error object from API call
 * @returns {boolean} True if it's a network error
 */
export function isNetworkError(error) {
  return !error.response && error.request;
}

/**
 * Check if error is a validation error (422)
 * @param {Error|Object} error - Error object from API call
 * @returns {boolean} True if it's a validation error
 */
export function isValidationError(error) {
  return isErrorStatus(error, 422);
}

/**
 * Get validation errors as an object
 * @param {Error|Object} error - Error object from API call
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function getValidationErrors(error) {
  if (isValidationError(error) && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return {};
}

const errorHandler = {
  handleApiError,
  getErrorStatus,
  isErrorStatus,
  isNetworkError,
  isValidationError,
  getValidationErrors,
};

export default errorHandler;

