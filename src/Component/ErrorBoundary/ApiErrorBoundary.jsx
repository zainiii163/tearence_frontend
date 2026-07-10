import React from 'react';
import { toast } from 'react-toastify';

class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('API Error Boundary caught an error:', error, errorInfo);
    
    // Store error details
    this.setState({
      error,
      errorInfo
    });

    // Show toast notification
    toast.error('Something went wrong with the API. Please try again.', {
      position: 'top-right',
      autoClose: 5000,
    });

    // Log to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // You could integrate with error tracking services here
      // like Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Example: Send error to monitoring service
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {
        // Silently fail if error logging fails
      });
    } catch (e) {
      // Silently fail if error logging fails
    }
  };

  handleRetry = () => {
    const { retryCount } = this.state;
    
    // Limit retries to prevent infinite loops
    if (retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      toast.error('Maximum retry attempts reached. Please refresh the page.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  handleRefresh = () => {
    window.location.reload();
  };

  isCORSError = (error) => {
    return error?.message?.includes('CORS') || 
           error?.message?.includes('Network Error') ||
           error?.code === 'ERR_NETWORK' ||
           error?.code === 'ERR_CONNECTION_REFUSED';
  };

  getErrorType = (error) => {
    if (this.isCORSError(error)) return 'cors';
    if (error?.message?.includes('timeout')) return 'timeout';
    if (error?.response?.status >= 500) return 'server';
    if (error?.response?.status === 401) return 'auth';
    return 'general';
  };

  getErrorSolution = (errorType) => {
    switch (errorType) {
      case 'cors':
        return {
          title: 'CORS Configuration Issue',
          description: 'The backend server is not configured to accept requests from this domain.',
          solutions: [
            'Configure backend CORS headers to allow your domain',
            'Add Access-Control-Allow-Origin header',
            'Ensure preflight requests (OPTIONS) are handled',
            'Check if backend is running and accessible'
          ]
        };
      case 'timeout':
        return {
          title: 'Request Timeout',
          description: 'The server took too long to respond.',
          solutions: [
            'Check your internet connection',
            'Try again in a moment',
            'Contact support if the issue persists'
          ]
        };
      case 'server':
        return {
          title: 'Server Error',
          description: 'The server encountered an internal error.',
          solutions: [
            'Try again in a few minutes',
            'Contact support if the issue continues',
            'Check server status page if available'
          ]
        };
      case 'auth':
        return {
          title: 'Authentication Error',
          description: 'You need to log in to access this resource.',
          solutions: [
            'Log in to your account',
            'Check if your session has expired',
            'Try refreshing the page and logging in again'
          ]
        };
      default:
        return {
          title: 'API Error',
          description: 'An unexpected error occurred while communicating with the server.',
          solutions: [
            'Try again',
            'Refresh the page',
            'Contact support if the issue persists'
          ]
        };
    }
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const errorType = this.getErrorType(error);
      const errorSolution = this.getErrorSolution(errorType);
      const { retryCount } = this.state;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              {errorSolution.title}
            </h2>

            {/* Error Description */}
            <p className="text-gray-600 text-center mb-4">
              {errorSolution.description}
            </p>

            {/* Solutions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">What you can try:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {errorSolution.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retry Count */}
            {retryCount > 0 && (
              <div className="mb-4 text-center">
                <span className="text-sm text-gray-500">
                  Retry attempts: {retryCount}/3
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={retryCount >= 3}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
              </button>
              
              <button
                onClick={this.handleRefresh}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">Debug Information</summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  <p className="font-semibold">Error Type: {errorType}</p>
                  <p className="font-semibold mt-1">Error Message:</p>
                  <p className="text-red-600 break-words">{error.message}</p>
                  {error.code && (
                    <p className="font-semibold mt-1">Error Code: {error.code}</p>
                  )}
                  {error.response?.status && (
                    <p className="font-semibold mt-1">HTTP Status: {error.response.status}</p>
                  )}
                </div>
              </details>
            )}

            {/* Support Link */}
            <div className="mt-4 text-center">
              <a
                href="/support"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Need help? Contact Support
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
