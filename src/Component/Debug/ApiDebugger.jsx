import React, { useState, useEffect } from 'react';
import { testCORS, testAuth, checkApiHealth, getDiagnostics, testEndpoint } from '../../utils/apiTester';

const ApiDebugger = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [endpointTest, setEndpointTest] = useState({ method: 'GET', url: '', data: '' });
  const [endpointResult, setEndpointResult] = useState(null);

  // Show only in development or with ?debug=true
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = window.location.search.includes('debug=true');
    setIsVisible(isDev || hasDebugParam);
  }, []);

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await getDiagnostics();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        summary: {
          overall: 'error',
          issues: ['Test execution failed'],
          recommendations: ['Check console for details']
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runCORSOnly = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const corsResults = await testCORS();
      setTestResults({
        cors: corsResults,
        summary: {
          overall: corsResults.errors.length === 0 ? 'healthy' : 'degraded',
          issues: corsResults.errors.map(e => `CORS ${e.type}: ${e.message}`),
          recommendations: corsResults.errors.length > 0 ? [
            'Configure backend CORS headers',
            'Add your domain to Access-Control-Allow-Origin',
            'Check preflight request handling'
          ] : []
        }
      });
    } catch (error) {
      setTestResults({
        summary: {
          overall: 'error',
          issues: ['CORS test failed'],
          recommendations: ['Check console for details']
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runEndpointTest = async () => {
    if (!endpointTest.url.trim()) return;
    
    setIsRunning(true);
    setEndpointResult(null);
    
    try {
      const data = endpointTest.data.trim() ? JSON.parse(endpointTest.data) : null;
      const result = await testEndpoint(endpointTest.method, endpointTest.url, data);
      setEndpointResult(result);
    } catch (error) {
      setEndpointResult({
        success: false,
        error: { message: error.message }
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">🔧 API Debugger</h3>
          <button
            onClick={() => setTestResults(null)}
            className="text-white hover:text-gray-200 text-sm"
          >
            Clear
          </button>
        </div>
        <p className="text-sm opacity-90 mt-1">
          Environment: {process.env.NODE_ENV} | API: {process.env.REACT_APP_API_URL}
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={runComprehensiveTest}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '🔄 Running...' : '🚀 Full Test'}
          </button>
          <button
            onClick={runCORSOnly}
            disabled={isRunning}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '🔄 Testing...' : '🌐 Test CORS'}
          </button>
        </div>

        {/* Manual Endpoint Test */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Manual Endpoint Test</h4>
          <div className="flex gap-2">
            <select
              value={endpointTest.method}
              onChange={(e) => setEndpointTest({ ...endpointTest, method: e.target.value })}
              className="px-3 py-1 border rounded"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              placeholder="Endpoint (e.g., category)"
              value={endpointTest.url}
              onChange={(e) => setEndpointTest({ ...endpointTest, url: e.target.value })}
              className="flex-1 px-3 py-1 border rounded"
            />
            <button
              onClick={runEndpointTest}
              disabled={isRunning || !endpointTest.url.trim()}
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test
            </button>
          </div>
          {(endpointTest.method === 'POST' || endpointTest.method === 'PUT') && (
            <textarea
              placeholder="JSON data (optional)"
              value={endpointTest.data}
              onChange={(e) => setEndpointTest({ ...endpointTest, data: e.target.value })}
              className="w-full px-3 py-1 border rounded text-sm"
              rows={3}
            />
          )}
        </div>
      </div>

      {/* Results */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {endpointResult && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold text-gray-700 mb-2">Endpoint Test Result</h4>
            <div className={`text-sm space-y-1 ${endpointResult.success ? 'text-green-700' : 'text-red-700'}`}>
              <p>Status: {endpointResult.success ? '✅ Success' : '❌ Failed'}</p>
              {endpointResult.status && <p>HTTP Status: {endpointResult.status}</p>}
              {endpointResult.responseTime && <p>Response Time: {endpointResult.responseTime}ms</p>}
              {endpointResult.error && <p>Error: {endpointResult.error.message}</p>}
              {endpointResult.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Response Data</summary>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(endpointResult.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {testResults && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={`p-3 rounded ${
              testResults.summary.overall === 'healthy' ? 'bg-green-50 border border-green-200' :
              testResults.summary.overall === 'degraded' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <h4 className="font-semibold mb-2">
                Overall Status: {testResults.summary.overall?.toUpperCase()}
              </h4>
              
              {testResults.summary.issues?.length > 0 && (
                <div className="mb-2">
                  <h5 className="font-medium text-red-700">Issues:</h5>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {testResults.summary.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {testResults.summary.recommendations?.length > 0 && (
                <div>
                  <h5 className="font-medium text-blue-700">Recommendations:</h5>
                  <ul className="list-disc list-inside text-sm text-blue-600">
                    {testResults.summary.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CORS Results */}
            {testResults.cors && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-gray-700 mb-2">CORS Test Results</h4>
                <div className="text-sm space-y-1">
                  <p>Preflight: {testResults.cors.preflight ? '✅ Pass' : '❌ Fail'}</p>
                  <p>GET Request: {testResults.cors.get ? '✅ Pass' : '❌ Fail'}</p>
                  {testResults.cors.timing && (
                    <div>
                      <p>Preflight Time: {testResults.cors.timing.preflight}ms</p>
                      <p>GET Time: {testResults.cors.timing.get}ms</p>
                    </div>
                  )}
                  {testResults.cors.errors?.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-medium text-red-700">CORS Errors:</h5>
                      {testResults.cors.errors.map((error, i) => (
                        <div key={i} className="text-xs text-red-600 mt-1">
                          <p>Type: {error.type}</p>
                          <p>Message: {error.message}</p>
                          {error.code && <p>Code: {error.code}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auth Results */}
            {testResults.auth && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-gray-700 mb-2">Auth Test Results</h4>
                <div className="text-sm space-y-1">
                  <p>Login: {testResults.auth.login ? '✅ Reachable' : '❌ Failed'}</p>
                  <p>Register: {testResults.auth.register ? '✅ Reachable' : '❌ Failed'}</p>
                  <p>Refresh: {testResults.auth.refresh ? '✅ Reachable' : '❌ Failed'}</p>
                  <p>Profile: {testResults.auth.profile ? '✅ Reachable' : '❌ Failed'}</p>
                  {testResults.auth.timing && (
                    <div>
                      {Object.entries(testResults.auth.timing).map(([endpoint, time]) => (
                        <p key={endpoint}>{endpoint}: {time}ms</p>
                      ))}
                    </div>
                  )}
                  {testResults.auth.errors?.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-medium text-red-700">Auth Errors:</h5>
                      {testResults.auth.errors.map((error, i) => (
                        <div key={i} className="text-xs text-red-600 mt-1">
                          <p>Type: {error.type}</p>
                          <p>Message: {error.message}</p>
                          {error.status && <p>Status: {error.status}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Health Results */}
            {testResults.health && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-semibold text-gray-700 mb-2">Health Check</h4>
                <div className="text-sm space-y-1">
                  <p>Status: {testResults.health.healthy ? '✅ Healthy' : '❌ Unhealthy'}</p>
                  {testResults.health.responseTime && (
                    <p>Response Time: {testResults.health.responseTime}ms</p>
                  )}
                  {testResults.health.status && (
                    <p>HTTP Status: {testResults.health.status}</p>
                  )}
                  {testResults.health.serverInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Server Info</summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                        {JSON.stringify(testResults.health.serverInfo, null, 2)}
                      </pre>
                    </details>
                  )}
                  {testResults.health.errors?.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-medium text-red-700">Health Errors:</h5>
                      {testResults.health.errors.map((error, i) => (
                        <div key={i} className="text-xs text-red-600 mt-1">
                          <p>Message: {error.message}</p>
                          {error.code && <p>Code: {error.code}</p>}
                          {error.timeout && <p>Timeout: Yes</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!testResults && !endpointResult && !isRunning && (
          <div className="text-center text-gray-500 py-8">
            <p>👆 Click a test button above to start debugging</p>
            <p className="text-sm mt-2">This will test API connectivity, CORS, and authentication</p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Running tests...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;
