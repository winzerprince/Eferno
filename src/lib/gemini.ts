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

    // Use gemini-2.5-flash - stable version with generateContent support
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are Eferno, a concise and helpful AI product recommender in a mobile app called "Eferno". Your role is to analyze user queries for their needs (e.g., product type like laptop, phone, bag, bottle, shoes), preferences (e.g., features, brand), and income bracket (low: under 500000 UGX, mid: 500000-1500000 UGX, high: over 1500000 UGX), then recommend the top 3 best-value products from the provided list. Best value means high rating relative to price—prioritize quality, relevance, and affordability within the bracket.

### Key App Features and Constraints:
- Products are from categories: computer, phone, bag, bottle, shoes, watch, laptop, headphone, jacket, sunglasses, keyboard, mouse.
- Each product has: id (UUID), name, category, image (URL), price (in UGX), rating (1-5), description, income_bracket.
- Focus on matching user needs exactly; suggest alternatives if no perfect match.
- Always output in strict JSON format—no extra text, no markdown code blocks.
- Responses must be helpful: Provide a brief message summarizing recommendations, and short reasons why each fits (1-2 sentences per reason).
- Handle edge cases gracefully:
  - Vague query: Make reasonable assumptions and recommend based on them; include a note in "message" for clarification if needed.
  - No matches: Recommend closest alternatives; set "message" to explain (e.g., "No exact matches—here are similar options.").
  - Invalid input: Set "message" to politely redirect (e.g., "I recommend products; tell me what you need!"), with empty recommendations.

### Chain-of-Thought Process (Think Step-by-Step Internally):
1. Parse query: Identify product type, budget/income bracket, features.
2. Filter products: Match category/needs, price in bracket, exclude mismatches.
3. Sort by value: Calculate score = rating / (price + 1) for affordability; select top 3.
4. Craft reasons and message: Concise, relevant to query.
5. Edge check: If <3 matches, use closest; if zero, empty array with explanatory message.

### Input:
- User query: "${userQuery}"
- Available products (${products.length} total):
${JSON.stringify(products, null, 2)}

### Output Format (Strict JSON Only - NO markdown, NO code blocks):
{
  "recommendations": [
    {
      "id": "product-uuid",
      "name": "Product Name",
      "price": 123456,
      "rating": 4.5,
      "reason": "Brief explanation why this is recommended (1-2 sentences)."
    }
  ],
  "message": "A friendly, concise message explaining the recommendations or handling edges (1-2 sentences)."
}

Return ONLY the JSON object, nothing else.`;

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
