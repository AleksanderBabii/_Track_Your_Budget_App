import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "An error occurred",
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const responseData = error.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.title) {
    return responseData.title;
  }

  const firstValidationError = responseData?.errors
    ? Object.values(responseData.errors).flat()[0]
    : undefined;

  return firstValidationError ?? fallback;
}
