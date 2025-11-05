#!/usr/bin/env node
/**
 * API Connection Test Script
 * Tests actual connections to Gemini AI and Supabase
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('\n🔌 Testing API Connections\n');

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

// Test Gemini API
async function testGemini() {
  return new Promise((resolve) => {
    const apiKey = envVars.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Gemini API connection successful');
          try {
            const parsed = JSON.parse(data);
            if (parsed.models && parsed.models.length > 0) {
              console.log(`   Available models: ${parsed.models.length}`);
              console.log(`   Sample: ${parsed.models[0].name}`);
            }
          } catch (e) {
            console.log('   Response received but parsing failed');
          }
          resolve(true);
        } else {
          console.log(`❌ Gemini API connection failed (Status: ${res.statusCode})`);
          console.log(`   Error: ${data}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log('❌ Gemini API connection error:', err.message);
      resolve(false);
    });
  });
}

// Test Supabase API
async function testSupabase() {
  return new Promise((resolve) => {
    const url = envVars.VITE_SUPABASE_URL;
    const anonKey = envVars.VITE_SUPABASE_ANON_KEY;
    
    https.get(`${url}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        console.log('✅ Supabase API connection successful');
        console.log(`   Project URL: ${url}`);
        console.log(`   Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`❌ Supabase API connection failed (Status: ${res.statusCode})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log('❌ Supabase API connection error:', err.message);
      resolve(false);
    });
  });
}

// Run tests
(async () => {
  console.log('1️⃣  Testing Gemini AI API...\n');
  const geminiOk = await testGemini();
  
  console.log('\n2️⃣  Testing Supabase API...\n');
  const supabaseOk = await testSupabase();
  
  console.log('\n📋 Summary:\n');
  
  if (geminiOk && supabaseOk) {
    console.log('✅ All API connections are working!\n');
    process.exit(0);
  } else {
    console.log('❌ Some API connections failed. Please check your API keys.\n');
    process.exit(1);
  }
})();
