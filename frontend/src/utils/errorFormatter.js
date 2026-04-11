// frontend/src/utils/errorFormatter.js
const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    // If it's an array of error messages, join them
    if (Array.isArray(error)) {
      return error.join(', ');
    }
    // If it's a validation error object like { user: "...", dateOfAppointment: "..." }
    // Extract all error messages and join them
    const messages = Object.values(error).filter(msg => typeof msg === 'string');
    return messages.length > 0 ? messages.join(', ') : 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

export default formatError;