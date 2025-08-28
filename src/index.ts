#!/usr/bin/env node

import { Command } from 'commander';
import { input, confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { ConfigManager } from './config/manager.js';
import { createProvider, AIProvider } from './providers/index.js';
import { executeCommand, formatCommandDisplay, formatOutput, detectOS } from './utils/shell.js';
import { runSetupWizard } from './setup.js';

const program = new Command();
const configManager = new ConfigManager();

program
  .name('baishi')
  .description('AI-powered shell wrapper - Convert natural language to shell commands')
  .version('1.0.0')
  .option('-n, --no-confirm', 'Execute without confirmation')
  .option('-f, --format', 'Format output with AI')
  .option('-r, --raw', 'Show raw command output')
  .option('-p, --provider <provider>', 'AI provider to use')
  .option('-m, --model <model>', 'Model to use')
  .option('-c, --config', 'Show configuration path')
  .option('-s, --setup', 'Run setup wizard')
  .option('-H, --history', 'Show command history');

program
  .command('setup')
  .description('Run the setup wizard')
  .action(async () => {
    await runSetupWizard();
  });

program
  .command('config')
  .description('Show current configuration')
  .action(async () => {
    await configManager.init();
    const config = configManager.get();
    console.log(chalk.cyan('Current Configuration:'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(`Provider: ${chalk.green(config.provider)}`);
    console.log(`Model: ${chalk.green(config.model || 'default')}`);
    console.log(`Format Output: ${chalk.green(config.formatOutput ? 'Yes' : 'No')}`);
    console.log(`Confirm Execute: ${chalk.green(config.confirmBeforeExecute ? 'Yes' : 'No')}`);
    console.log(`Save History: ${chalk.green(config.saveHistory ? 'Yes' : 'No')}`);
    console.log(`Config Path: ${chalk.gray(configManager.getConfigPath())}`);
  });

program
  .command('history')
  .description('Show command history')
  .option('-l, --limit <n>', 'Number of entries to show', '10')
  .action(async (options) => {
    await configManager.init();
    const history = await configManager.getHistory();
    const limit = parseInt(options.limit, 10);
    const recent = history.slice(-limit);
    
    if (recent.length === 0) {
      console.log(chalk.yellow('No command history found.'));
      return;
    }
    
    console.log(chalk.cyan(`Recent Commands (last ${limit}):`));
    console.log(chalk.gray('─'.repeat(50)));
    
    recent.forEach((entry, index) => {
      const date = new Date(entry.timestamp).toLocaleString();
      console.log(chalk.gray(`[${date}]`));
      console.log(`  Query: ${chalk.white(entry.naturalLanguage)}`);
      console.log(`  Command: ${chalk.cyan(entry.generatedCommand)}`);
      console.log(`  Executed: ${entry.executed ? chalk.green('Yes') : chalk.red('No')}`);
      if (index < recent.length - 1) console.log();
    });
  });

async function main() {
  const options = program.opts();
  const args = program.args;

  if (options.setup) {
    await runSetupWizard();
    process.exit(0);
  }

  if (options.config) {
    await configManager.init();
    console.log(chalk.cyan('Configuration file:'), configManager.getConfigPath());
    process.exit(0);
  }

  if (options.history) {
    program.outputHelp();
    process.exit(0);
  }

  await configManager.init();
  const config = configManager.get();

  if (options.provider) {
    config.provider = options.provider as any;
  }
  if (options.model) {
    config.model = options.model;
  }

  let query: string;
  
  if (args.length > 0) {
    query = args.join(' ');
  } else {
    try {
      query = await input({
        message: 'What would you like to do?',
        validate: (value) => value.trim().length > 0 || 'Please enter a command description',
      });
    } catch (error) {
      console.log(chalk.yellow('\nCancelled.'));
      process.exit(0);
    }
  }

  const spinner = ora('Generating command...').start();
  
  try {
    const provider: AIProvider = createProvider(config);
    
    if (!provider.isConfigured()) {
      spinner.fail('Provider not configured');
      console.log(chalk.red(`\n${config.provider} requires configuration.`));
      console.log(chalk.yellow('Run: baishi setup'));
      process.exit(1);
    }

    const osInfo = `Current OS: ${detectOS()}`;
    const fullPrompt = `${osInfo}\n\n${query}`;
    
    const generatedCommand = await provider.generateCommand(fullPrompt);
    spinner.succeed('Command generated');
    
    console.log('\n' + formatCommandDisplay(generatedCommand));
    
    const shouldExecute = options.confirm === false 
      ? true 
      : config.confirmBeforeExecute 
        ? await confirm({ 
            message: 'Execute this command?',
            default: true 
          })
        : true;
    
    if (config.saveHistory) {
      await configManager.saveToHistory({
        naturalLanguage: query,
        generatedCommand,
        executed: shouldExecute,
      });
    }
    
    if (shouldExecute) {
      console.log(chalk.gray('\nExecuting...\n'));
      
      const result = await executeCommand(
        generatedCommand,
        config.defaultShell,
        config.timeout
      );
      
      if ((options.format || config.formatOutput) && !options.raw && provider.formatOutput) {
        const formattedSpinner = ora('Formatting output...').start();
        try {
          const formatted = await provider.formatOutput(result.stdout + result.stderr, query);
          formattedSpinner.succeed('Output formatted');
          console.log('\n' + chalk.white(formatted));
        } catch (error) {
          formattedSpinner.fail('Failed to format output');
          console.log(formatOutput(result));
        }
      } else {
        console.log(formatOutput(result));
      }
      
      if (!result.success) {
        process.exit(result.code);
      }
    } else {
      console.log(chalk.yellow('\nCommand cancelled.'));
    }
  } catch (error: any) {
    spinner.fail('Failed');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

program.parse();

if (program.args.length === 0 && process.argv.length === 2) {
  main();
} else if (program.args.length > 0 && !program.commands.find(cmd => cmd.name() === program.args[0])) {
  main();
}