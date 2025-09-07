// Jest setup file to handle cleanup of HTTP connections
const axios = require('axios');

// Clean up axios instances after each test
afterEach(async () => {
    // Force garbage collection of any pending requests
    if (global.gc) {
        global.gc();
    }
});

// Global teardown to ensure all HTTP connections are closed
afterAll(async () => {
    // Close any remaining HTTP agents
    if (axios.defaults.adapter) {
        // Wait a bit for any pending connections to close
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Force close any remaining HTTP agents
    const http = require('http');
    const https = require('https');
    
    // Destroy any global agents
    if (http.globalAgent) {
        http.globalAgent.destroy();
    }
    if (https.globalAgent) {
        https.globalAgent.destroy();
    }
});
