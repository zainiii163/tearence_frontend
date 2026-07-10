/** True when a failed request is an expected "no data yet" or missing optional route. */
export const isOptionalEndpointError = (error) => {
  const status = error?.status ?? error?.response?.status;
  return status === 404 || status === 403;
};

/** Log only unexpected dashboard fetch failures. */
export const logDashboardFetchError = (label, error) => {
  if (isOptionalEndpointError(error)) return;
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Dashboard] ${label}:`, error?.message || error);
  }
};
