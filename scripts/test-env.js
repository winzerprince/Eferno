#!/usr/bin/env node
/**
 * Environment Variables Test Script
 * Tests all required environment variables and their connections
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Testing Environment Variables\n');

// Read .env file from project root
const envPath = path.join(__dirname, '..', '.env');
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        envVars[key] = value;
      }
    }
  });
} catch (err) {
  console.error('❌ Could not read .env file:', err.message);
  process.exit(1);
}

// Required environment variables
const requiredVars = {
  VITE_GEMINI_API_KEY: 'Gemini AI API Key',
  VITE_SUPABASE_URL: 'Supabase Project URL',
  VITE_SUPABASE_ANON_KEY: 'Supabase Anonymous Key',
  VITE_SUPABASE_PROJECT_REF: 'Supabase Project Reference'
};

let allValid = true;

// Check each required variable
Object.entries(requiredVars).forEach(([key, description]) => {
  const value = envVars[key];
  
  if (!value) {
    console.log(`❌ ${description} (${key}) is missing!`);
    allValid = false;
  } else {
    console.log(`✅ ${description} is set`);
    console.log(`   Value: ${value.substring(0, 20)}...`);
    
    // Validate format
    if (key === 'VITE_SUPABASE_URL' && !value.includes('supabase.co')) {
      console.log(`⚠️  ${key} doesn't look like a valid Supabase URL`);
      allValid = false;
    }
    
    if (key === 'VITE_GEMINI_API_KEY' && !value.startsWith('AIza')) {
      console.log(`⚠️  ${key} doesn't look like a valid Gemini API key`);
      allValid = false;
    }
  }
});

console.log('\n📋 Summary:\n');

if (allValid) {
  console.log('✅ All environment variables are properly configured!');
  console.log('\nℹ️  You can now run: npm start\n');
  process.exit(0);
} else {
  console.log('❌ Some environment variables are missing or invalid.');
  console.log('\nℹ️  Please check your .env file and compare with .env.example\n');
  process.exit(1);
}
