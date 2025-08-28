# Baishi - AI-Powered Shell Wrapper

Welcome to Baishi, an intelligent shell wrapper that converts natural language descriptions into executable shell commands using AI.

## Features

- 🤖 **Multiple AI Providers**: Support for OpenAI, Google AI, Anthropic, Ollama, and OpenRouter
- 💬 **Natural Language Input**: Describe what you want to do in plain English
- ✨ **Smart Output Formatting**: AI-powered output formatting for better readability
- 🔒 **Safety First**: Confirmation prompts before executing commands
- 📝 **Command History**: Keep track of all your generated commands
- 🎯 **Cross-Platform**: Works on macOS, Linux, and Windows
- 🚀 **Easy Setup**: Interactive wizard for quick configuration

## Quick Example

```bash
# Interactive mode
$ baishi
What would you like to do? find all large files over 100MB
$ find . -type f -size +100M

# Direct command
$ baishi "show network connections"
$ netstat -an

# Without confirmation
$ baishi -n "list docker containers"
$ docker ps -a

# With formatted output
$ baishi -f "check disk usage"
```

## Why Baishi?

- **Save Time**: No need to remember complex command syntax
- **Learn Commands**: See the actual commands generated for your requests
- **Reduce Errors**: AI helps generate correct command syntax
- **Flexible**: Choose from multiple AI providers based on your needs
- **Privacy**: Use local models with Ollama for complete privacy

## Getting Started

1. [Install Baishi](getting-started/installation.md)
2. [Run the setup wizard](getting-started/quickstart.md)
3. [Start using natural language commands](guide/basic-usage.md)

## Supported Platforms

- macOS (10.15+)
- Linux (Ubuntu, Debian, CentOS, Arch, etc.)
- Windows 10/11 (with PowerShell or WSL)

## Requirements

- Node.js 18 or higher
- npm or yarn
- API key for your chosen AI provider (except Ollama)