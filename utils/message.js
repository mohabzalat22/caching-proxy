export const successMessage = (
  statusCode = 200,
  success = true,
  message = "success message",
  data = []
) => {
  return {
    success,
    statusCode,
    message,
    data,
  };
};

export const errorMessage = (
  statusCode = 400,
  success = false,
  message = "error message",
  errors = []
) => {
  return {
    success,
    statusCode,
    message,
    errors,
  };
};
