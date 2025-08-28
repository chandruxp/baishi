export interface AIProvider {
  name: string;
  generateCommand(prompt: string): Promise<string>;
  formatOutput?(output: string, query: string): Promise<string>;
  isConfigured(): boolean;
}

export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  protected apiKey?: string;
  protected model?: string;
  protected temperature: number = 0.3;
  protected maxTokens: number = 500;

  constructor(config?: any) {
    if (config) {
      this.apiKey = config.apiKey;
      this.model = config.model;
      this.temperature = config.temperature ?? 0.3;
      this.maxTokens = config.maxTokens ?? 500;
    }
  }

  abstract generateCommand(prompt: string): Promise<string>;

  async formatOutput(output: string, query: string): Promise<string> {
    const formatPrompt = `Given this shell command output and the user's original query, provide a clean, formatted summary of the relevant information.

User Query: ${query}
Command Output:
${output}

Provide a concise, well-formatted response:`;

    return this.generateCommand(formatPrompt);
  }

  isConfigured(): boolean {
    return !!this.apiKey || this.name === 'ollama';
  }

  protected getSystemPrompt(): string {
    return `You are a shell command generator. Convert natural language descriptions into executable shell commands.
Rules:
1. Output ONLY the command, no explanations or markdown
2. Use appropriate flags and options
3. Ensure commands are safe and valid for the current OS
4. If the request is unclear, provide the most likely command
5. Never include dangerous operations without proper safeguards`;
  }
}