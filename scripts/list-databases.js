#!/usr/bin/env node

// Helper script to list all Notion databases accessible to your integration
// Run with: node scripts/list-databases.js

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function listDatabases() {
  try {
    console.log('🔍 Searching for databases...\n');
    
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });

    if (response.results.length === 0) {
      console.log('❌ No databases found. Make sure:');
      console.log('1. Your integration token is correct');
      console.log('2. You have shared databases with your integration');
      console.log('3. The integration has the right permissions\n');
      return;
    }

    console.log(`✅ Found ${response.results.length} database(s):\n`);
    
    response.results.forEach((db, index) => {
      console.log(`${index + 1}. ${db.title?.[0]?.plain_text || 'Untitled'}`);
      console.log(`   ID: ${db.id}`);
      console.log(`   URL: https://notion.so/${db.id.replace(/-/g, '')}`);
      console.log('');
    });

    console.log('💡 Copy the ID of the database you want to use and add it to your .env.local file');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your NOTION_TOKEN in .env.local');
      console.log('2. Make sure your integration has access to the database');
      console.log('3. Share your database with the integration');
    }
  }
}

listDatabases();
