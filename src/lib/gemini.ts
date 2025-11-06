import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Product } from './supabase';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export type ProductRecommendation = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reason: string;
};

export async function getProductRecommendations(
  userQuery: string,
  products: Product[]
): Promise<{ recommendations: ProductRecommendation[]; message: string }> {
  try {
    console.log('Starting AI recommendation...', { 
      query: userQuery, 
      productCount: products.length 
    });

    // Use gemini-2.0-flash-lite for fastest responses with temperature optimization
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024, // Limit output for speed
      }
    });

    // Pre-process: Send only essential fields to reduce token count
    const compactProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      income_bracket: p.income_bracket
    }));

    // Optimized prompt - concise and direct
    const prompt = `You are Eferno AI. Analyze the user query and recommend exactly 3 products with detailed reasoning.

USER QUERY: "${userQuery}"

PRODUCTS (${compactProducts.length} items):
${JSON.stringify(compactProducts)}

ANALYSIS STEPS:
1. Parse query for: product type, budget (low <500k, mid 500k-1.5M, high >1.5M UGX), preferences
2. Filter products: match category, fit budget range
3. Calculate value score: rating ÷ (price / 100000) - prefer high rating at reasonable price
4. Select top 3 with diverse reasoning

REASONING REQUIREMENTS:
- Explain WHY each product fits the user's specific need
- Mention key strengths: value, rating, price point, suitability
- Be specific and actionable (e.g., "Best value: 4.5★ rating at mid-range price")
- Keep each reason 15-25 words

OUTPUT (JSON only, no markdown):
{
  "recommendations": [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 123456,
      "rating": 4.5,
      "reason": "Specific reason explaining value + fit for user need"
    }
  ],
  "message": "1-sentence summary guiding user's decision"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI raw response:', text);

    // Try to extract JSON from the response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    console.log('Cleaned JSON text:', jsonText);

    const parsed = JSON.parse(jsonText);
    
    console.log('Parsed response:', parsed);
    
    return {
      recommendations: parsed.recommendations || [],
      message: parsed.message || 'Here are some products I found for you!'
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    throw error;
  }
}
