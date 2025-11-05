#!/usr/bin/env node
/**
 * Generate and Seed Product Data Script
 * Generates ~1200 fake products and seeds them into Supabase
 */

import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📦 Generating Product Data\n');

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

// Product categories
const categories = [
  'computer',
  'phone',
  'bag',
  'bottle',
  'shoes',
  'watch',
  'laptop',
  'headphone',
  'jacket',
  'sunglasses',
  'keyboard',
  'mouse'
];

// Income brackets for targeting
const incomeBrackets = ['low', 'mid', 'high'];

// Generate a single product
function generateProduct(category) {
  const incomeBracket = faker.helpers.arrayElement(incomeBrackets);
  
  // Price ranges based on income bracket and category
  let minPrice, maxPrice;
  const categoryMultiplier = {
    'computer': 3,
    'phone': 2.5,
    'laptop': 3,
    'watch': 2,
    'headphone': 1.5,
    'keyboard': 1,
    'mouse': 0.8,
    'bag': 1.2,
    'bottle': 0.5,
    'shoes': 1.5,
    'jacket': 2,
    'sunglasses': 1
  };
  
  const baseMultiplier = categoryMultiplier[category] || 1;
  
  switch (incomeBracket) {
    case 'low':
      minPrice = 50000 * baseMultiplier;
      maxPrice = 300000 * baseMultiplier;
      break;
    case 'mid':
      minPrice = 300000 * baseMultiplier;
      maxPrice = 1000000 * baseMultiplier;
      break;
    case 'high':
      minPrice = 1000000 * baseMultiplier;
      maxPrice = 5000000 * baseMultiplier;
      break;
  }
  
  const price = Math.round(faker.number.float({ min: minPrice, max: maxPrice }) / 1000) * 1000;
  const rating = faker.number.float({ min: 2.5, max: 5, fractionDigits: 1 });
  
  // Generate descriptive product name
  const adjectives = ['Pro', 'Elite', 'Premium', 'Ultra', 'Smart', 'Wireless', 'Digital', 'Classic', 'Modern', 'Advanced'];
  const adjective = faker.helpers.arrayElement(adjectives);
  const productName = `${adjective} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  const brand = faker.company.name().split(' ')[0];
  
  // Use Unsplash for images
  const imageUrl = `https://source.unsplash.com/800x600/?${category}`;
  
  return {
    name: `${brand} ${productName}`,
    category: category,
    image_url: imageUrl,
    price: price,
    rating: rating,
    description: faker.commerce.productDescription(),
    income_bracket: incomeBracket
  };
}

// Generate all products
async function generateProducts() {
  const products = [];
  const productsPerCategory = 100; // 100 products per category = 1200 total
  
  for (const category of categories) {
    console.log(`Generating ${productsPerCategory} ${category} products...`);
    for (let i = 0; i < productsPerCategory; i++) {
      products.push(generateProduct(category));
    }
  }
  
  console.log(`\n✅ Generated ${products.length} products\n`);
  return products;
}

// Seed products into Supabase in batches
async function seedProducts(products) {
  console.log('🌱 Seeding products into Supabase...\n');
  
  const batchSize = 100;
  let seeded = 0;
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('products')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error seeding batch ${i / batchSize + 1}:`, error.message);
      process.exit(1);
    }
    
    seeded += batch.length;
    console.log(`✅ Seeded ${seeded}/${products.length} products`);
  }
  
  console.log('\n✅ All products seeded successfully!\n');
}

// Main execution
(async () => {
  try {
    // Check if products already exist
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error checking existing products:', countError.message);
      process.exit(1);
    }
    
    if (count > 0) {
      console.log(`⚠️  Database already contains ${count} products.`);
      console.log('Do you want to continue? This will add more products. (Ctrl+C to cancel)\n');
      // In a real scenario, you might want to prompt for confirmation
      // For now, we'll just add to existing products
    }
    
    const products = await generateProducts();
    await seedProducts(products);
    
    console.log('📊 Database Statistics:\n');
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    console.log(`   Total products: ${totalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
})();
