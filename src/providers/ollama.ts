import { Ollama } from 'ollama';
import { BaseAIProvider } from './base.js';

export class OllamaProvider extends BaseAIProvider {
  name = 'ollama';
  private client: Ollama;
  private host: string;

  constructor(config?: any) {
    super(config);
    this.host = config?.ollamaHost || 'http://localhost:11434';
    this.client = new Ollama({ host: this.host });
  }

  async generateCommand(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat({
        model: this.model || 'llama3.2',
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: this.temperature,
          num_predict: this.maxTokens,
        }
      });

      return response.message.content.trim();
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}. Make sure Ollama is running at ${this.host}`);
    }
  }

  isConfigured(): boolean {
    return true;
  }
}