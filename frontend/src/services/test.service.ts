/**
 * API Connection Test
 * 
 * Simple test to verify backend connectivity.
 * Run this to ensure the API service layer is working.
 */

import api from './api';

export const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    console.log(`📍 API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    
    // Test health endpoint
    const response = await api.get('/../health'); // Go up one level since we're in /api
    
    console.log('✅ Backend connection successful!');
    console.log('📦 Response:', response.data);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ Backend connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('⚠️  Network error - Is the backend running on port 5000?');
    }
    
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export helper to test specific endpoints
export const testEndpoint = async (endpoint: string) => {
  try {
    console.log(`🧪 Testing endpoint: ${endpoint}`);
    const response = await api.get(endpoint);
    console.log('✅ Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed:`, error.response?.data || error.message);
    throw error;
  }
};
