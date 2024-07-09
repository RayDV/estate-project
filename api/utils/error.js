export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.stack = statusCode;
    error.message = message;
    return error;
  };
  