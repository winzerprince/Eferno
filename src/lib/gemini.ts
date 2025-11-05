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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a helpful shopping assistant. A user is looking for products with this query: "${userQuery}"

Here are available products:
${JSON.stringify(products.slice(0, 50), null, 2)}

Based on the user's query, recommend the top 3 best products from the list above. Consider:
- Price/value ratio (price vs rating)
- Relevance to the user's needs
- Quality (rating)
- Budget indicators in the query (e.g., "cheap", "affordable", "premium", "low income", "mid income", "high income")

Return your response in this exact JSON format:
{
  "recommendations": [
    {
      "id": "product-uuid",
      "name": "Product Name",
      "price": 100000,
      "rating": 4.5,
      "reason": "Brief explanation why this is recommended"
    }
  ],
  "message": "A friendly message explaining the recommendations"
}

Important: Return ONLY valid JSON, no markdown formatting or additional text.`;

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
