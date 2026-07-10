import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import requestQueue from '../services/requestQueue';

const API_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  DEGRADED: 'degraded',
  UNKNOWN: 'unknown'
};

const useApiStatus = () => {
  const [status, setStatus] = useState(API_STATUS.UNKNOWN);
  const [responseTime, setResponseTime] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const intervalRef = useRef(null);
  const statusHistoryRef = useRef([]);

  // Check API health
  const checkApiHealth = useCallback(async () => {
    const startTime = Date.now();

    try {
      const response = await api.get('/auth/web-check', {
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500 // Accept 4xx as valid
      });
      
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setResponseTime(responseTimeMs);
      setLastCheck(new Date());
      setErrorDetails(null);
      
      // Determine status based on response
      if (response.status >= 200 && response.status < 300) {
        setStatus(API_STATUS.ONLINE);
      } else if (response.status >= 400 && response.status < 500) {
        setStatus(API_STATUS.DEGRADED);
        setErrorDetails({
          type: 'client_error',
          status: response.status,
          message: response.data?.message || 'Client error'
        });
      }
      
      // Update status history
      statusHistoryRef.current.push({
        status: API_STATUS.ONLINE,
        timestamp: new Date(),
        responseTime: responseTimeMs
      });
      
      // Keep only last 10 entries
      if (statusHistoryRef.current.length > 10) {
        statusHistoryRef.current = statusHistoryRef.current.slice(-10);
      }
      
      return { success: true, status: response.status, responseTime: responseTimeMs };
      
    } catch (error) {
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setResponseTime(responseTimeMs);
      setLastCheck(new Date());
      
      // Determine error type — no mock fallbacks; report real status only
      let errorType = 'unknown';
      const errMsg = error?.message || '';
      if (error?.isCORSError || error?.status === 0 || error?.code === 'ERR_NETWORK' || errMsg.includes('Network Error')) {
        errorType = 'network';
        setStatus(API_STATUS.OFFLINE);
      } else if (error?.code === 'ECONNABORTED') {
        errorType = 'timeout';
        setStatus(API_STATUS.DEGRADED);
      } else if (error.response?.status >= 500) {
        errorType = 'server';
        setStatus(API_STATUS.DEGRADED);
      } else {
        setStatus(API_STATUS.DEGRADED);
      }
      
      setErrorDetails({
        type: errorType,
        message: error.message,
        code: error.code,
        status: error.response?.status
      });
      
      // Update status history
      statusHistoryRef.current.push({
        status: API_STATUS.OFFLINE,
        timestamp: new Date(),
        error: errorType,
        responseTime: responseTimeMs
      });
      
      // Keep only last 10 entries
      if (statusHistoryRef.current.length > 10) {
        statusHistoryRef.current = statusHistoryRef.current.slice(-10);
      }
      
      return { success: false, error, errorType };
    }
  }, []);

  // Manual reconnect function
  const reconnect = useCallback(async () => {
    toast.info('Attempting to reconnect to API...', {
      position: 'top-right',
      autoClose: 3000,
    });
    
    const result = await checkApiHealth();
    
    if (result.success) {
      toast.success('Successfully reconnected to API!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.error('Failed to reconnect to API', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    
    return result;
  }, [checkApiHealth]);

  // Get status history
  const getStatusHistory = useCallback(() => {
    return statusHistoryRef.current;
  }, []);

  // Get average response time
  const getAverageResponseTime = useCallback(() => {
    const recentChecks = statusHistoryRef.current
      .filter(check => check.responseTime)
      .slice(-5); // Last 5 checks
    
    if (recentChecks.length === 0) return null;
    
    const sum = recentChecks.reduce((acc, check) => acc + check.responseTime, 0);
    return Math.round(sum / recentChecks.length);
  }, []);

  // Monitor queue status
  useEffect(() => {
    const unsubscribe = requestQueue.addListener((event, data) => {
      setQueueStatus(requestQueue.getStatus());
      
      // Show notifications for queue events
      switch (event) {
        case 'queued':
          if (data.queueSize === 1) {
            toast.info('Request queued - will retry when connection is restored', {
              position: 'bottom-right',
              autoClose: 3000,
            });
          }
          break;
        case 'completed':
          if (data.queueSize === 0) {
            toast.success('All queued requests completed!', {
              position: 'bottom-right',
              autoClose: 3000,
            });
          }
          break;
        case 'failed':
          toast.error(`Request failed: ${data.request.method.toUpperCase()} ${data.request.url}`, {
            position: 'bottom-right',
            autoClose: 5000,
          });
          break;
      }
    });
    
    // Set initial queue status
    setQueueStatus(requestQueue.getStatus());
    
    return unsubscribe;
  }, []);

  // Set up periodic health checks
  useEffect(() => {
    const startHealthChecks = () => {
      // Check immediately
      checkApiHealth();
      
      // Then check every 30 seconds
      intervalRef.current = setInterval(checkApiHealth, 30000);
    };

    startHealthChecks();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkApiHealth]);

  // Show toast notifications on status change
  useEffect(() => {
    const previousStatus = statusHistoryRef.current[statusHistoryRef.current.length - 2]?.status;
    
    if (previousStatus && previousStatus !== status) {
      switch (status) {
        case API_STATUS.ONLINE:
          if (previousStatus === API_STATUS.OFFLINE) {
            toast.success('API connection restored!', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
          break;
        case API_STATUS.OFFLINE:
          toast.error('API connection lost!', {
            position: 'top-right',
            autoClose: 5000,
          });
          break;
        case API_STATUS.DEGRADED:
          toast.warning('API performance degraded', {
            position: 'top-right',
            autoClose: 3000,
          });
          break;
      }
    }
  }, [status]);

  return {
    status,
    responseTime,
    lastCheck,
    queueStatus,
    errorDetails,
    isOnline: status === API_STATUS.ONLINE,
    isOffline: status === API_STATUS.OFFLINE,
    isDegraded: status === API_STATUS.DEGRADED,
    reconnect,
    checkHealth: checkApiHealth,
    getStatusHistory,
    getAverageResponseTime,
    clearQueue: () => requestQueue.clearQueue(),
  };
};

export default useApiStatus;
