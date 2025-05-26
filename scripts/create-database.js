#!/usr/bin/env node

// Helper script to create a properly configured Notion database
// Run with: node scripts/create-database.js

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function createDatabase() {
  try {
    console.log('🚀 Creating Personal Growth Dashboard database...\n');
    
    const response = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: process.env.NOTION_PARENT_PAGE_ID, // You'll need to provide this
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Personal Growth Dashboard',
          },
        },
      ],
      properties: {
        'Title': {
          title: {}
        },
        'Date': {
          date: {}
        },
        'Session': {
          select: {
            options: [
              {
                name: 'Morning',
                color: 'yellow'
              },
              {
                name: 'Midday', 
                color: 'orange'
              },
              {
                name: 'Evening',
                color: 'red'
              },
              {
                name: 'Bedtime',
                color: 'purple'
              }
            ]
          }
        },
        'Data': {
          rich_text: {}
        }
      }
    });

    console.log('✅ Database created successfully!');
    console.log(`📊 Database ID: ${response.id}`);
    console.log(`🔗 Database URL: https://notion.so/${response.id.replace(/-/g, '')}`);
    console.log('\n📝 Add this to your .env.local:');
    console.log(`NOTION_DATABASE_ID=${response.id}`);
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    
    if (error.code === 'validation_error') {
      console.log('\n💡 You need to provide a parent page ID.');
      console.log('1. Create a page in Notion where you want the database');
      console.log('2. Get the page ID from the URL');
      console.log('3. Add NOTION_PARENT_PAGE_ID to your .env.local');
      console.log('4. Run this script again');
    }
  }
}

// Check if we have required environment variables
if (!process.env.NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN not found in .env.local');
  process.exit(1);
}

if (!process.env.NOTION_PARENT_PAGE_ID) {
  console.log('💡 To create a database automatically, you need a parent page ID.');
  console.log('\nAlternatively, create the database manually:');
  console.log('1. Go to Notion and create a new database');
  console.log('2. Add these properties:');
  console.log('   - Title (Title type)');
  console.log('   - Date (Date type)');
  console.log('   - Session (Select type with options: Morning, Midday, Evening, Bedtime)');
  console.log('   - Data (Rich Text type)');
  console.log('3. Share the database with your integration');
  console.log('4. Copy the database ID from the URL');
  console.log('5. Add it to your .env.local as NOTION_DATABASE_ID');
  process.exit(0);
}

createDatabase();
