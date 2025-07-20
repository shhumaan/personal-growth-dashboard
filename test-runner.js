#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

class TestRunner {
  constructor() {
    this.devServer = null;
    this.serverPid = null;
  }

  async startDevServer() {
    console.log('🚀 Starting development server...');
    
    return new Promise((resolve, reject) => {
      this.devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        cwd: process.cwd(),
        env: { ...process.env, PORT: '3000' }
      });

      let serverReady = false;

      this.devServer.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('📊 Server:', output.trim());
        
        if ((output.includes('localhost:3000') || output.includes('Ready')) && !serverReady) {
          serverReady = true;
          this.serverPid = this.devServer.pid;
          console.log('✅ Development server is ready!');
          setTimeout(resolve, 2000); // Give extra time for full startup
        }
      });

      this.devServer.stderr.on('data', (data) => {
        console.error('❌ Server error:', data.toString());
      });

      this.devServer.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        reject(error);
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server startup timeout after 60 seconds'));
        }
      }, 60000);
    });
  }

  async stopDevServer() {
    if (this.devServer) {
      console.log('🛑 Stopping development server...');
      this.devServer.kill('SIGTERM');
      
      // Force kill if needed
      setTimeout(() => {
        if (this.devServer && !this.devServer.killed) {
          this.devServer.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  async runE2ETests() {
    console.log('🧪 Running E2E tests...');
    
    return new Promise((resolve, reject) => {
      const testProcess = spawn('npx', ['jest', 'tests/e2e-comprehensive.test.js', '--verbose'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ E2E tests completed successfully!');
          resolve();
        } else {
          console.error('❌ E2E tests failed with code:', code);
          reject(new Error(`Tests failed with exit code ${code}`));
        }
      });

      testProcess.on('error', (error) => {
        console.error('❌ Failed to run tests:', error);
        reject(error);
      });
    });
  }

  async runUnitTests() {
    console.log('🔬 Running unit tests...');
    
    return new Promise((resolve, reject) => {
      const testProcess = spawn('npx', ['jest', 'src/', '--verbose'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Unit tests completed successfully!');
          resolve();
        } else {
          console.error('❌ Unit tests failed with code:', code);
          reject(new Error(`Unit tests failed with exit code ${code}`));
        }
      });

      testProcess.on('error', (error) => {
        console.error('❌ Failed to run unit tests:', error);
        reject(error);
      });
    });
  }

  async checkServerHealth() {
    console.log('🔍 Checking server health...');
    
    try {
      const fetch = require('node-fetch').default || require('node-fetch');
      const response = await fetch('http://localhost:3000');
      
      if (response.status === 200) {
        console.log('✅ Server is healthy!');
        return true;
      } else {
        console.warn('⚠️ Server returned status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      return false;
    }
  }

  async runFullTestSuite() {
    console.log('🎯 Starting comprehensive test suite...');
    console.log('=' .repeat(50));
    
    try {
      // Start the development server
      await this.startDevServer();
      
      // Wait a bit more and check health
      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.checkServerHealth();
      
      // Run E2E tests
      await this.runE2ETests();
      
      console.log('🎉 All tests completed successfully!');
      
    } catch (error) {
      console.error('💥 Test suite failed:', error.message);
      process.exit(1);
    } finally {
      await this.stopDevServer();
    }
  }

  async runQuickTest() {
    console.log('⚡ Running quick test (unit tests only)...');
    
    try {
      await this.runUnitTests();
      console.log('🎉 Quick tests completed!');
    } catch (error) {
      console.error('💥 Quick tests failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const testRunner = new TestRunner();
  const args = process.argv.slice(2);
  
  // Handle cleanup on exit
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received interrupt signal, cleaning up...');
    await testRunner.stopDevServer();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received terminate signal, cleaning up...');
    await testRunner.stopDevServer();
    process.exit(0);
  });

  try {
    if (args.includes('--quick') || args.includes('-q')) {
      await testRunner.runQuickTest();
    } else if (args.includes('--e2e') || args.includes('-e')) {
      await testRunner.startDevServer();
      await new Promise(resolve => setTimeout(resolve, 3000));
      await testRunner.runE2ETests();
      await testRunner.stopDevServer();
    } else if (args.includes('--help') || args.includes('-h')) {
      console.log(`
🧪 Personal Growth Dashboard Test Runner

Usage: node test-runner.js [options]

Options:
  --quick, -q     Run unit tests only (faster)
  --e2e, -e       Run E2E tests only
  --help, -h      Show this help message
  
Default: Run full test suite (unit + E2E)

Examples:
  node test-runner.js              # Full test suite
  node test-runner.js --quick      # Unit tests only
  node test-runner.js --e2e        # E2E tests only
      `);
    } else {
      await testRunner.runFullTestSuite();
    }
  } catch (error) {
    console.error('💥 Test runner failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TestRunner;