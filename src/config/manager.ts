import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { BaishConfig, CommandHistory } from '../types/config.js';

const CONFIG_DIR = path.join(os.homedir(), '.baishi');
const CONFIG_FILE = path.join(CONFIG_DIR, 'baishi_profile');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');

const DEFAULT_CONFIG: BaishConfig = {
  provider: 'openai',
  formatOutput: false,
  confirmBeforeExecute: true,
  saveHistory: true,
  historyLimit: 100,
  defaultShell: process.platform === 'win32' ? 'powershell' : '/bin/bash',
  timeout: 30000,
  temperature: 0.3,
  maxTokens: 500,
};

export class ConfigManager {
  private config: BaishConfig;

  constructor() {
    this.config = DEFAULT_CONFIG;
  }

  async init(): Promise<void> {
    await this.ensureConfigDir();
    await this.load();
  }

  private async ensureConfigDir(): Promise<void> {
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true });
    } catch (error) {
      console.error('Failed to create config directory:', error);
    }
  }

  async load(): Promise<BaishConfig> {
    try {
      const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
      const lines = configData.split('\n');
      const loadedConfig: Partial<BaishConfig> = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            const cleanKey = key.trim().replace(/^export\s+/, '');
            
            switch (cleanKey) {
              case 'BAISH_PROVIDER':
                loadedConfig.provider = value as any;
                break;
              case 'BAISH_API_KEY':
                loadedConfig.apiKey = value;
                break;
              case 'BAISH_MODEL':
                loadedConfig.model = value;
                break;
              case 'BAISH_FORMAT_OUTPUT':
                loadedConfig.formatOutput = value.toLowerCase() === 'true';
                break;
              case 'BAISH_CONFIRM':
                loadedConfig.confirmBeforeExecute = value.toLowerCase() === 'true';
                break;
              case 'BAISH_SAVE_HISTORY':
                loadedConfig.saveHistory = value.toLowerCase() === 'true';
                break;
              case 'BAISH_HISTORY_LIMIT':
                loadedConfig.historyLimit = parseInt(value, 10);
                break;
              case 'BAISH_DEFAULT_SHELL':
                loadedConfig.defaultShell = value;
                break;
              case 'BAISH_TIMEOUT':
                loadedConfig.timeout = parseInt(value, 10);
                break;
              case 'BAISH_TEMPERATURE':
                loadedConfig.temperature = parseFloat(value);
                break;
              case 'BAISH_MAX_TOKENS':
                loadedConfig.maxTokens = parseInt(value, 10);
                break;
              case 'BAISH_OLLAMA_HOST':
                loadedConfig.ollamaHost = value;
                break;
              case 'BAISH_OPENROUTER_API_KEY':
                loadedConfig.openrouterApiKey = value;
                break;
              case 'BAISH_SYSTEM_PROMPT':
                loadedConfig.systemPrompt = value.replace(/^["']|["']$/g, '');
                break;
            }
          }
        }
      }

      this.config = { ...DEFAULT_CONFIG, ...loadedConfig };
      
      if (process.env.BAISH_API_KEY) {
        this.config.apiKey = process.env.BAISH_API_KEY;
      }
      
      return this.config;
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading config:', error);
      }
      return this.config;
    }
  }

  async save(config: Partial<BaishConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    
    const configLines = [
      '# Baish Configuration File',
      '# This file is loaded on startup',
      '',
      `BAISH_PROVIDER=${this.config.provider}`,
    ];

    if (this.config.apiKey) {
      configLines.push(`BAISH_API_KEY=${this.config.apiKey}`);
    }
    if (this.config.model) {
      configLines.push(`BAISH_MODEL=${this.config.model}`);
    }
    if (this.config.ollamaHost) {
      configLines.push(`BAISH_OLLAMA_HOST=${this.config.ollamaHost}`);
    }
    if (this.config.openrouterApiKey) {
      configLines.push(`BAISH_OPENROUTER_API_KEY=${this.config.openrouterApiKey}`);
    }
    
    configLines.push(
      `BAISH_FORMAT_OUTPUT=${this.config.formatOutput}`,
      `BAISH_CONFIRM=${this.config.confirmBeforeExecute}`,
      `BAISH_SAVE_HISTORY=${this.config.saveHistory}`,
      `BAISH_HISTORY_LIMIT=${this.config.historyLimit}`,
      `BAISH_DEFAULT_SHELL=${this.config.defaultShell}`,
      `BAISH_TIMEOUT=${this.config.timeout}`,
      `BAISH_TEMPERATURE=${this.config.temperature}`,
      `BAISH_MAX_TOKENS=${this.config.maxTokens}`
    );

    if (this.config.systemPrompt) {
      configLines.push(`BAISH_SYSTEM_PROMPT="${this.config.systemPrompt}"`);
    }

    await fs.writeFile(CONFIG_FILE, configLines.join('\n') + '\n');
  }

  get(): BaishConfig {
    return this.config;
  }

  async saveToHistory(entry: Omit<CommandHistory, 'timestamp'>): Promise<void> {
    if (!this.config.saveHistory) return;

    try {
      let history: CommandHistory[] = [];
      try {
        const data = await fs.readFile(HISTORY_FILE, 'utf-8');
        history = JSON.parse(data);
      } catch {}

      history.push({ ...entry, timestamp: new Date() });
      
      if (history.length > (this.config.historyLimit || 100)) {
        history = history.slice(-this.config.historyLimit!);
      }

      await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  async getHistory(): Promise<CommandHistory[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  getConfigPath(): string {
    return CONFIG_FILE;
  }
}