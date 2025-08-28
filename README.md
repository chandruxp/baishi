# Baishi - AI-Powered Shell Wrapper

Convert natural language to shell commands using AI. Support for multiple providers including OpenAI, Google AI, Anthropic, Ollama (local), and OpenRouter.

## Features

- 🤖 **Multiple AI Providers** - OpenAI, Google, Anthropic, Ollama, OpenRouter
- 💬 **Natural Language Input** - Describe what you want in plain English  
- ✨ **Smart Output Formatting** - AI-powered output formatting
- 🔒 **Safety First** - Confirmation prompts before execution
- 📝 **Command History** - Track all generated commands
- 🎯 **Cross-Platform** - Works on macOS, Linux, and Windows
- 🚀 **Easy Setup** - Interactive configuration wizard

## Quick Start

### Install

```bash
npm install -g baishi
```

### Setup

```bash
baishi setup
```

### Use

```bash
# Interactive mode
baishi

# Direct command
baishi "find all large files over 100MB"

# Skip confirmation
baishi -n "list docker containers"

# Format output
baishi -f "check disk usage"
```

## Examples

```bash
# File operations
baishi "find all PDF files modified today"
baishi "compress all images in current folder"
baishi "delete empty directories"

# System tasks  
baishi "show which process is using port 8080"
baishi "monitor CPU temperature"
baishi "list all running services"

# Development
baishi "create a new git branch called feature/auth"
baishi "find TODO comments in JavaScript files"
baishi "kill all node processes"

# Network
baishi "test connection to google.com"
baishi "show all devices on local network"
baishi "check what's listening on port 3000"
```

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### From npm

```bash
npm install -g baishi
```

### From Source

```bash
git clone https://github.com/yourusername/baishi.git
cd baishi
npm install
npm run build
npm link
```

### Verify Installation

```bash
baishi --version
```

## Configuration

Run the setup wizard:

```bash
baishi setup
```

Or manually edit `~/.baishi/baishi_profile`:

```bash
BAISH_PROVIDER=openai
BAISH_API_KEY=your-api-key
BAISH_MODEL=gpt-4o-mini
BAISH_CONFIRM=true
BAISH_FORMAT_OUTPUT=false
```

## Supported Providers

### OpenAI
- Models: GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo
- Get API key: [platform.openai.com](https://platform.openai.com)

### Google AI  
- Models: Gemini 2.0 Flash, Gemini 1.5 Pro/Flash
- Get API key: [makersuite.google.com](https://makersuite.google.com)

### Anthropic
- Models: Claude 3 Opus, Sonnet, Haiku
- Get API key: [console.anthropic.com](https://console.anthropic.com)

### Ollama (Local)
- Models: Llama 3.2, Mistral, CodeLlama, Phi3, Qwen2.5
- No API key needed - runs locally
- Install: [ollama.ai](https://ollama.ai)

### OpenRouter
- Access multiple providers with one API key
- Free tier available
- Get API key: [openrouter.ai](https://openrouter.ai)

## Usage

### Basic Commands

```bash
# Interactive mode
baishi

# Direct execution
baishi "your command in natural language"

# Show help
baishi --help

# Show configuration
baishi config

# Show history
baishi history
```

### Options

```bash
-n, --no-confirm       Execute without confirmation
-f, --format          Format output with AI
-r, --raw             Show raw output
-p, --provider        Use specific provider
-m, --model           Use specific model
-c, --config          Show config path
-s, --setup           Run setup wizard
-H, --history         Show command history
```

### Environment Variables

Override configuration with environment variables:

```bash
BAISH_PROVIDER=ollama baishi "list files"
BAISH_MODEL=llama3.2 baishi "check weather"
```

## Command History

View your command history:

```bash
# Show last 10 commands
baishi history

# Show last 20 commands  
baishi history -l 20
```

## Safety

- Commands require confirmation by default
- Review commands before execution
- Set appropriate timeouts
- Never store API keys in code

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/baishi.git
cd baishi

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## Documentation

- [Online Documentation](https://baishi.readthedocs.io)
- Man page: `man baishi`
- Help: `baishi --help`

## Troubleshooting

### Command not found

Add npm global bin to PATH:

```bash
export PATH=$(npm bin -g):$PATH
```

### Permission denied

Use npm prefix:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### API key issues

1. Check for extra spaces/quotes
2. Verify key is active
3. Run `baishi setup` to reconfigure

### Ollama connection failed

Ensure Ollama is running:

```bash
ollama serve
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/baishi/issues)
- Documentation: [baishi.readthedocs.io](https://baishi.readthedocs.io)
- Discussions: [GitHub Discussions](https://github.com/yourusername/baishi/discussions)

## Acknowledgments

Built with:
- Commander.js for CLI
- Inquirer for prompts
- OpenAI, Google AI, Anthropic SDKs
- Ollama for local AI
- TypeScript

---

Made with ❤️ by the Baish contributors