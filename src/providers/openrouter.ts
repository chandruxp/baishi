import fetch from 'node-fetch';
import { BaseAIProvider } from './base.js';

export class OpenRouterProvider extends BaseAIProvider {
  name = 'openrouter';
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(config?: any) {
    super(config);
    this.apiKey = config?.openrouterApiKey || config?.apiKey;
  }

  async generateCommand(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured.');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/baishi',
          'X-Title': 'Baishi AI Shell'
        },
        body: JSON.stringify({
          model: this.model || 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: prompt }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
      }

      const data: any = await response.json();
      return data.choices[0]?.message?.content?.trim() || '';
    } catch (error: any) {
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
  }
}