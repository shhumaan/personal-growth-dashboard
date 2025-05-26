#!/usr/bin/env node

// Helper script to verify your Notion integration
// Run with: node scripts/verify-integration.js

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function verifyIntegration() {
  try {
    console.log('🔍 Verifying Notion integration...\n');
    
    // Try to get user info (this will work if token is valid)
    const response = await notion.users.me();
    
    console.log('✅ Integration token is valid!');
    console.log(`🤖 Integration Name: ${response.name || 'Unknown'}`);
    console.log(`📧 Integration Type: ${response.type}`);
    console.log(`🆔 Integration ID: ${response.id}\n`);
    
    console.log('✅ Your token is working. Now you need to:');
    console.log('1. Open your Notion database');
    console.log('2. Click "Share" in the top-right');
    console.log('3. Add your integration by name or search for it');
    console.log('4. Give it "Can edit" permissions');
    
  } catch (error) {
    console.error('❌ Error verifying integration:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n🔧 Your token might be invalid. Please check:');
      console.log('1. Copy the token again from Notion integrations page');
      console.log('2. Make sure it starts with "secret_" (not "ntn_")');
      console.log('3. Update your .env.local file');
    }
  }
}

verifyIntegration();
