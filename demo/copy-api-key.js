#!/usr/bin/env node

/**
 * Script to copy API.txt to demo public directory
 * This ensures the API key is available for the demo application
 */

const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '..', 'API.txt');
const targetFile = path.join(__dirname, 'public', 'API.txt');

try {
  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.warn('⚠️  API.txt not found in root directory');
    console.log('📝 Please create API.txt in the root directory with your NREL API key');
    process.exit(0);
  }

  // Create public directory if it doesn't exist
  const publicDir = path.dirname(targetFile);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy the file
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ API.txt copied to demo public directory');
  
  // Read and validate the API key
  const apiKey = fs.readFileSync(targetFile, 'utf8').trim();
  if (!apiKey || apiKey === 'your_nrel_api_key_here') {
    console.warn('⚠️  Please update API.txt with your actual NREL API key');
  } else {
    console.log('✅ API key appears to be valid');
  }
  
} catch (error) {
  console.error('❌ Error copying API.txt:', error.message);
  process.exit(1);
}
