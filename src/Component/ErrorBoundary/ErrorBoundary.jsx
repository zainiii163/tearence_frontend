import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also send error to logging service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Check if it's a backend API error
      const isBackendError = this.state.error?.message?.includes('500') || 
                          this.state.error?.message?.includes('Network Error') ||
                          this.state.errorInfo?.componentStack?.includes('API');

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <FiAlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isBackendError ? 'Backend Error' : 'Something went wrong'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isBackendError 
                ? 'We\'re experiencing technical difficulties with our servers. Our team has been notified and is working to fix this issue.'
                : 'An unexpected error occurred while loading this page.'
              }
            </p>

            {isBackendError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">What you can do:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Refresh the page in a few moments</li>
                  <li>• Check your internet connection</li>
                  <li>• Try again later if the issue persists</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiHome className="h-4 w-4" />
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-800 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
