import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './base.js';

export class AnthropicProvider extends BaseAIProvider {
  name = 'anthropic';
  private client?: Anthropic;

  constructor(config?: any) {
    super(config);
    if (this.apiKey) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }
  }

  async generateCommand(prompt: string): Promise<string> {
    if (!this.client) {
      throw new Error('Anthropic client not configured. Please set your API key.');
    }

    try {
      const response = await this.client.messages.create({
        model: this.model || 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: prompt }],
        system: this.getSystemPrompt(),
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const textContent = response.content.find(c => c.type === 'text');
      return textContent?.text?.trim() || '';
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}