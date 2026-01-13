/**
 * Integration Test Helper
 * Quick test to verify frontend-backend connection
 */

import { api } from './lib/api';

export async function testBackendConnection() {
    console.log('🧪 Testing Backend Connection...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing health endpoint...');
        const health = await api.healthCheck();
        console.log('✅ Health check passed:', health);

        // Test 2: Send a test message
        console.log('\n2️⃣ Testing chat endpoint...');
        const testSessionId = `test-${Date.now()}`;
        const response = await api.sendMessage(testSessionId, 'Hi');
        console.log('✅ Chat response received:');
        console.log('   Reply:', response.reply.substring(0, 50) + '...');
        console.log('   Intent:', response.intent);
        console.log('   State:', response.state);

        // Test 3: Get session
        console.log('\n3️⃣ Testing session retrieval...');
        const session = await api.getSession(testSessionId);
        console.log('✅ Session retrieved:');
        console.log('   Session ID:', session.session_id);
        console.log('   Turn count:', session.turn_count);

        // Test 4: Get stats
        console.log('\n4️⃣ Testing stats endpoint...');
        const stats = await api.getStats();
        console.log('✅ Stats retrieved:', stats);

        console.log('\n🎉 All tests passed! Backend integration is working.\n');
        return true;

    } catch (error) {
        console.error('\n❌ Backend connection failed:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Make sure backend is running: npm run dev (in autostream-backend)');
        console.error('2. Check if backend is on http://localhost:8000');
        console.error('3. Verify GEMINI_API_KEY is set in backend/.env');
        return false;
    }
}

// Auto-run test in development
if (import.meta.env.DEV) {
    console.log('🔍 Running integration test...\n');
    testBackendConnection();
}
