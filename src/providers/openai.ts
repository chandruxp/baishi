import OpenAI from 'openai';
import { BaseAIProvider } from './base.js';

export class OpenAIProvider extends BaseAIProvider {
  name = 'openai';
  private client?: OpenAI;

  constructor(config?: any) {
    super(config);
    if (this.apiKey) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
  }

  async generateCommand(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not configured. Please set your API key.');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}