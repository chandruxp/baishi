import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider } from './base.js';

export class GoogleProvider extends BaseAIProvider {
  name = 'google';
  private client?: GoogleGenerativeAI;

  constructor(config?: any) {
    super(config);
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateCommand(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error('Google AI client not configured. Please set your API key.');
    }

    try {
      const model = this.client.getGenerativeModel({ 
        model: this.model || 'gemini-1.5-flash' 
      });

      const fullPrompt = `${this.getSystemPrompt()}\n\nUser request: ${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      throw new Error(`Google AI API error: ${error.message}`);
    }
  }
}