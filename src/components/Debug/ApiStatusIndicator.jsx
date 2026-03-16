import React from 'react';
import useApiStatus from '../../hooks/useApiStatus';

const ApiStatusIndicator = () => {
  const { 
    status, 
    responseTime, 
    lastCheck, 
    queueStatus, 
    isOnline, 
    isOffline, 
    isDegraded,
    reconnect,
    getAverageResponseTime,
    getStatusHistory
  } = useApiStatus();

  // Only show in development or with ?debug=true
  const isVisible = process.env.NODE_ENV === 'development' || 
                   window.location.search.includes('debug=true');

  if (!isVisible) return null;

  const averageResponseTime = getAverageResponseTime();
  const statusHistory = getStatusHistory();
  const recentChecks = statusHistory.slice(-5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'degraded': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-800">API Status</h3>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Refresh
        </button>
      </div>

      {/* Current Status */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(status)}</span>
          <span className={`font-semibold capitalize ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        {responseTime && (
          <div className="text-xs text-gray-600 mt-1">
            Response: {responseTime}ms
          </div>
        )}
        {averageResponseTime && (
          <div className="text-xs text-gray-600">
            Avg: {averageResponseTime}ms
          </div>
        )}
      </div>

      {/* Queue Status */}
      {queueStatus && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="text-xs font-semibold text-gray-700 mb-1">Request Queue</div>
          <div className="text-xs text-gray-600">
            Queued: {queueStatus.size}
          </div>
          <div className="text-xs text-gray-600">
            Online: {queueStatus.isOnline ? 'Yes' : 'No'}
          </div>
        </div>
      )}

      {/* Recent History */}
      {recentChecks.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-700 mb-1">Recent Checks</div>
          <div className="space-y-1">
            {recentChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span>{getStatusIcon(check.status)}</span>
                  <span className="capitalize">{check.status}</span>
                </div>
                <div className="text-gray-500">
                  {check.responseTime ? `${check.responseTime}ms` : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isOnline && (
          <button
            onClick={reconnect}
            className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Reconnect
          </button>
        )}
        {queueStatus?.size > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all queued requests?')) {
                window.requestQueue?.clearQueue?.();
              }
            }}
            className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Clear Queue
          </button>
        )}
      </div>

      {/* Last Check Time */}
      {lastCheck && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          Last check: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
