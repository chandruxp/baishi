import { AIProvider } from './base.js';
import { OpenAIProvider } from './openai.js';
import { GoogleProvider } from './google.js';
import { AnthropicProvider } from './anthropic.js';
import { OllamaProvider } from './ollama.js';
import { OpenRouterProvider } from './openrouter.js';
import { BaishConfig } from '../types/config.js';

export function createProvider(config: BaishConfig): AIProvider {
  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'google':
      return new GoogleProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    case 'ollama':
      return new OllamaProvider(config);
    case 'openrouter':
      return new OpenRouterProvider(config);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI',
    requiresApiKey: true,
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  google: {
    name: 'Google AI',
    requiresApiKey: true,
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp']
  },
  anthropic: {
    name: 'Anthropic',
    requiresApiKey: true,
    defaultModel: 'claude-3-haiku-20240307',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
  },
  ollama: {
    name: 'Ollama (Local)',
    requiresApiKey: false,
    defaultModel: 'llama3.2',
    models: ['llama3.2', 'mistral', 'codellama', 'phi3', 'qwen2.5-coder']
  },
  openrouter: {
    name: 'OpenRouter',
    requiresApiKey: true,
    defaultModel: 'meta-llama/llama-3.2-3b-instruct:free',
    models: [
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemini-2.0-flash-exp:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'openai/gpt-4o-mini',
      'anthropic/claude-3-haiku'
    ]
  }
};

export { AIProvider, BaseAIProvider };