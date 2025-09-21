import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
}

export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ProductListing {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
  seo_suggestion: string;
  pricing_tips?: string[];
}

export interface BusinessTip {
  id: string;
  title: string;
  description: string;
  category: 'pricing' | 'marketing' | 'packaging' | 'platform' | 'general';
  priority: 'high' | 'medium' | 'low';
}

export interface CustomerReply {
  question: string;
  answer: string;
  category: 'availability' | 'customization' | 'delivery' | 'general';
}

export class GeminiService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

  async generateProductListing(
    title: string,
    description: string,
    price: string,
    category: string
  ): Promise<ProductListing> {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please add your API key to .env file.');
    }

    const prompt = `
You are an AI assistant helping local artisans create better product listings for online marketplaces.

Product Details:
- Title: ${title}
- Description: ${description}
- Price: ${price}
- Category: ${category}

Please generate a comprehensive product listing in JSON format with the following structure:
{
  "title": "Improved, SEO-friendly title (max 60 chars)",
  "description": "Enhanced, compelling product description highlighting unique features and craftsmanship",
  "keywords": ["relevant", "search", "keywords"],
  "hashtags": ["#relevant", "#hashtags", "#for", "#social", "#media"],
  "seo_suggestion": "Brief SEO improvement suggestion",
  "pricing_tips": ["tip1", "tip2", "tip3"]
}

Focus on:
- Highlighting traditional craftsmanship
- Using keywords buyers search for
- Emphasizing unique cultural value
- Making it marketplace-friendly
- Including emotional appeal

Return only valid JSON without any markdown formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating product listing:', error);
      throw new Error('Failed to generate product listing. Please try again.');
    }
  }

  async generateBusinessTips(
    productCategory: string,
    userGoals: string[] = []
  ): Promise<BusinessTip[]> {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please add your API key to .env file.');
    }

    const prompt = `
You are a business advisor for local artisans. Generate 5 practical business tips for an artisan selling ${productCategory} products.

User goals: ${userGoals.join(', ')}

Return a JSON array with this structure:
[
  {
    "id": "unique_id",
    "title": "Brief tip title",
    "description": "Detailed actionable advice",
    "category": "pricing|marketing|packaging|platform|general",
    "priority": "high|medium|low"
  }
]

Focus on:
- Practical, actionable advice
- Local market insights
- Online selling strategies
- Cost-effective solutions
- Cultural value preservation

Return only valid JSON array without markdown formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating business tips:', error);
      throw new Error('Failed to generate business tips. Please try again.');
    }
  }

  async generateCustomerReplies(
    productType: string,
    commonQuestions: string[] = []
  ): Promise<CustomerReply[]> {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please add your API key to .env file.');
    }

    const questions = commonQuestions.length > 0 
      ? commonQuestions 
      : [
          'Is this available for immediate delivery?',
          'Can you customize this product?',
          'What materials are used?',
          'Do you ship internationally?',
          'What is your return policy?'
        ];

    const prompt = `
Generate professional customer service replies for an artisan selling ${productType} products.

Questions to answer: ${questions.join(', ')}

Return a JSON array with this structure:
[
  {
    "question": "customer question",
    "answer": "professional, friendly response",
    "category": "availability|customization|delivery|general"
  }
]

Make responses:
- Professional but warm
- Informative about artisan processes
- Emphasizing quality and craftsmanship
- Including typical timelines
- Culturally appropriate

Return only valid JSON array without markdown formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating customer replies:', error);
      throw new Error('Failed to generate customer replies. Please try again.');
    }
  }

  async chatAssistant(
    message: string,
    context: { products: any[], previousMessages: string[] } = { products: [], previousMessages: [] }
  ): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API not configured. Please add your API key to .env file.');
    }

    const prompt = `
You are Karigar.AI, a helpful assistant for local artisans selling their products online.

Context:
- User's products: ${JSON.stringify(context.products.slice(0, 3))}
- Previous conversation: ${context.previousMessages.slice(-5).join('\n')}

User message: ${message}

Provide helpful, specific advice about:
- Product optimization
- Marketing strategies
- Pricing guidance
- Platform recommendations
- Customer service
- Cultural preservation in business

Keep responses:
- Friendly and supportive
- Specific and actionable
- Under 200 words
- Focused on local artisan needs

Response:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in chat assistant:', error);
      throw new Error('Failed to get chat response. Please try again.');
    }
  }
}

export const geminiService = new GeminiService();