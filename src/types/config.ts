export interface BaishConfig {
  provider: 'openai' | 'google' | 'anthropic' | 'openrouter' | 'ollama';
  apiKey?: string;
  model?: string;
  ollamaHost?: string;
  openrouterApiKey?: string;
  formatOutput?: boolean;
  confirmBeforeExecute?: boolean;
  saveHistory?: boolean;
  historyLimit?: number;
  defaultShell?: string;
  timeout?: number;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ProviderConfig {
  name: string;
  requiresApiKey: boolean;
  defaultModel: string;
  models: string[];
}

export interface CommandHistory {
  timestamp: Date;
  naturalLanguage: string;
  generatedCommand: string;
  executed: boolean;
  output?: string;
}

export interface ShellResult {
  stdout: string;
  stderr: string;
  code: number;
  success: boolean;
}