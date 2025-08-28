import { select, input, confirm, password } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from './config/manager.js';
import { PROVIDER_INFO, createProvider } from './providers/index.js';
import { BaishConfig } from './types/config.js';

export async function runSetupWizard() {
  console.log(chalk.cyan.bold('\n🚀 Welcome to Baish Setup Wizard!\n'));
  console.log(chalk.gray('This wizard will help you configure your AI shell assistant.\n'));

  const configManager = new ConfigManager();
  await configManager.init();
  
  const currentConfig = configManager.get();
  const config: Partial<BaishConfig> = {};

  // Provider selection
  const provider = await select({
    message: 'Select your AI provider:',
    choices: [
      { name: 'OpenAI (GPT-4, GPT-3.5)', value: 'openai' },
      { name: 'Google AI (Gemini)', value: 'google' },
      { name: 'Anthropic (Claude)', value: 'anthropic' },
      { name: 'Ollama (Local Models)', value: 'ollama' },
      { name: 'OpenRouter (Multiple Providers)', value: 'openrouter' },
    ],
    default: currentConfig.provider,
  });
  
  config.provider = provider as any;
  const providerInfo = PROVIDER_INFO[provider as keyof typeof PROVIDER_INFO];

  // API Key setup
  if (providerInfo.requiresApiKey) {
    const apiKeyPrompt = provider === 'openrouter' 
      ? 'Enter your OpenRouter API key:' 
      : `Enter your ${providerInfo.name} API key:`;
    
    const apiKey = await password({
      message: apiKeyPrompt,
      mask: '*',
      validate: (value) => value.trim().length > 0 || 'API key is required',
    });
    
    if (provider === 'openrouter') {
      config.openrouterApiKey = apiKey;
    } else {
      config.apiKey = apiKey;
    }
  }

  // Ollama host configuration
  if (provider === 'ollama') {
    const customHost = await confirm({
      message: 'Use custom Ollama host? (default: http://localhost:11434)',
      default: false,
    });
    
    if (customHost) {
      config.ollamaHost = await input({
        message: 'Enter Ollama host URL:',
        default: 'http://localhost:11434',
      });
    }
  }

  // Model selection
  const useDefaultModel = await confirm({
    message: `Use default model (${providerInfo.defaultModel})?`,
    default: true,
  });
  
  if (!useDefaultModel) {
    if (providerInfo.models.length > 0) {
      const model = await select({
        message: 'Select a model:',
        choices: providerInfo.models.map(m => ({ name: m, value: m })),
      });
      config.model = model;
    } else {
      config.model = await input({
        message: 'Enter model name:',
        default: providerInfo.defaultModel,
      });
    }
  } else {
    config.model = providerInfo.defaultModel;
  }

  // Advanced settings
  const advancedSettings = await confirm({
    message: 'Configure advanced settings?',
    default: false,
  });
  
  if (advancedSettings) {
    config.confirmBeforeExecute = await confirm({
      message: 'Confirm before executing commands?',
      default: currentConfig.confirmBeforeExecute ?? true,
    });
    
    config.formatOutput = await confirm({
      message: 'Format command output with AI?',
      default: currentConfig.formatOutput ?? false,
    });
    
    config.saveHistory = await confirm({
      message: 'Save command history?',
      default: currentConfig.saveHistory ?? true,
    });
    
    if (config.saveHistory) {
      const historyLimit = await input({
        message: 'History limit:',
        default: String(currentConfig.historyLimit ?? 100),
        validate: (value) => {
          const num = parseInt(value, 10);
          return (!isNaN(num) && num > 0) || 'Please enter a valid number';
        },
      });
      config.historyLimit = parseInt(historyLimit, 10);
    }
    
    const customShell = await confirm({
      message: 'Use custom shell?',
      default: false,
    });
    
    if (customShell) {
      config.defaultShell = await input({
        message: 'Enter shell path:',
        default: currentConfig.defaultShell,
      });
    }
    
    const temperature = await input({
      message: 'Temperature (0.0-1.0, lower = more focused):',
      default: String(currentConfig.temperature ?? 0.3),
      validate: (value) => {
        const num = parseFloat(value);
        return (!isNaN(num) && num >= 0 && num <= 1) || 'Please enter a value between 0 and 1';
      },
    });
    config.temperature = parseFloat(temperature);
    
    const maxTokens = await input({
      message: 'Max tokens for responses:',
      default: String(currentConfig.maxTokens ?? 500),
      validate: (value) => {
        const num = parseInt(value, 10);
        return (!isNaN(num) && num > 0) || 'Please enter a valid number';
      },
    });
    config.maxTokens = parseInt(maxTokens, 10);
  } else {
    config.confirmBeforeExecute = true;
    config.formatOutput = false;
    config.saveHistory = true;
    config.historyLimit = 100;
  }

  // Test configuration
  const testConfig = await confirm({
    message: 'Test configuration with a sample command?',
    default: true,
  });
  
  if (testConfig) {
    const spinner = ora('Testing configuration...').start();
    
    try {
      const testProvider = createProvider({ ...currentConfig, ...config } as BaishConfig);
      
      if (!testProvider.isConfigured()) {
        throw new Error('Provider not properly configured');
      }
      
      const testCommand = await testProvider.generateCommand('list files in current directory');
      spinner.succeed('Configuration test successful!');
      console.log(chalk.gray('Sample command generated:'), chalk.cyan(testCommand));
    } catch (error: any) {
      spinner.fail('Configuration test failed');
      console.log(chalk.red('Error:'), error.message);
      
      const retry = await confirm({
        message: 'Would you like to reconfigure?',
        default: true,
      });
      
      if (retry) {
        return runSetupWizard();
      }
    }
  }

  // Save configuration
  const saveSpinner = ora('Saving configuration...').start();
  
  try {
    await configManager.save(config);
    saveSpinner.succeed('Configuration saved!');
    
    console.log(chalk.green('\n✅ Setup complete!'));
    console.log(chalk.gray(`Configuration saved to: ${configManager.getConfigPath()}`));
    console.log(chalk.cyan('\nYou can now use baishi by running:'));
    console.log(chalk.white('  baishi "your command in natural language"'));
    console.log(chalk.white('  or just type: baishi'));
    console.log(chalk.gray('\nExamples:'));
    console.log(chalk.gray('  baishi "show all python files modified today"'));
    console.log(chalk.gray('  baishi "compress all images in current folder"'));
    console.log(chalk.gray('  baishi "find large files over 100MB"'));
  } catch (error: any) {
    saveSpinner.fail('Failed to save configuration');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}