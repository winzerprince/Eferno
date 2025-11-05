#!/usr/bin/env node
/**
 * Update Product Images Script
 * Updates existing product images to use higher quality Unsplash URLs
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🖼️  Updating Product Images\n');

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

// Initialize Supabase client
const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

// Map categories to relevant image keywords for LoremFlickr
const categoryKeywords = {
  computer: 'computer,desktop,pc',
  phone: 'smartphone,mobile,phone',
  bag: 'bag,backpack,luggage',
  bottle: 'bottle,flask,water',
  shoes: 'shoes,sneakers,footwear',
  watch: 'watch,timepiece,wristwatch',
  laptop: 'laptop,notebook,computer',
  headphone: 'headphones,audio,music',
  jacket: 'jacket,coat,clothing',
  sunglasses: 'sunglasses,glasses,eyewear',
  keyboard: 'keyboard,typing,computer',
  mouse: 'mouse,computer,peripheral'
};

// Update product images to higher quality
async function updateImages() {
  try {
    // Fetch all products
    console.log('📦 Fetching products from database...\n');
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, category');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError.message);
      process.exit(1);
    }

    console.log(`Found ${products.length} products to update\n`);

    // Update in batches
    const batchSize = 50;
    let updated = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Update each product in the batch
      for (const product of batch) {
        // Generate category-specific LoremFlickr URL with keywords
        const keywords = categoryKeywords[product.category] || product.category;
        // Add random seed to get different images for same category
        const randomSeed = Math.floor(Math.random() * 10000);
        const newImageUrl = `https://loremflickr.com/800/600/${keywords}?random=${randomSeed}`;

        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: newImageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Error updating product ${product.id}:`, updateError.message);
        } else {
          updated++;
        }
      }

      console.log(`✅ Updated ${Math.min(i + batchSize, products.length)}/${products.length} products`);
    }

    console.log(`\n✅ Successfully updated ${updated} product images!\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Main execution
updateImages();
