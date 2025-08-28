import { exec } from 'child_process';
import { promisify } from 'util';
import { ShellResult } from '../types/config.js';
import chalk from 'chalk';

const execAsync = promisify(exec);

export async function executeCommand(
  command: string, 
  shell?: string,
  timeout: number = 30000
): Promise<ShellResult> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      shell: shell || undefined,
      timeout,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    return {
      stdout,
      stderr,
      code: 0,
      success: true,
    };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      code: error.code || 1,
      success: false,
    };
  }
}

export function formatCommandDisplay(command: string): string {
  const lines = command.split('\n');
  if (lines.length === 1) {
    return chalk.cyan(`$ ${command}`);
  }
  
  return chalk.cyan('$ ') + lines.map((line, index) => 
    index === 0 ? chalk.cyan(line) : chalk.cyan('  ' + line)
  ).join('\n');
}

export function formatOutput(result: ShellResult): string {
  const output = [];
  
  if (result.stdout) {
    output.push(result.stdout);
  }
  
  if (result.stderr) {
    output.push(chalk.red(result.stderr));
  }
  
  if (!result.success && !result.stderr) {
    output.push(chalk.red(`Command failed with exit code ${result.code}`));
  }
  
  return output.join('\n');
}

export function detectOS(): string {
  switch (process.platform) {
    case 'darwin':
      return 'macOS';
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
    default:
      return process.platform;
  }
}

export function getDefaultShell(): string {
  if (process.platform === 'win32') {
    return 'powershell.exe';
  }
  return process.env.SHELL || '/bin/bash';
}