# Quick Start

Get up and running with Baishi in minutes!

## 1. Run Setup Wizard

After installation, run the setup wizard:

```bash
baishi setup
```

The wizard will guide you through:

- Selecting an AI provider
- Configuring API keys
- Choosing models
- Setting preferences

## 2. Basic Configuration

### Choose a Provider

Select from available providers:

- **OpenAI**: Best overall performance (requires API key)
- **Google AI**: Fast and efficient Gemini models (requires API key)
- **Anthropic**: Claude models for nuanced responses (requires API key)
- **Ollama**: Local models for privacy (no API key needed)
- **OpenRouter**: Access multiple providers with one API key

### Get API Keys

- **OpenAI**: [platform.openai.com](https://platform.openai.com/api-keys)
- **Google AI**: [makersuite.google.com](https://makersuite.google.com/app/apikey)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai/keys)

## 3. First Commands

### Interactive Mode

Simply type `baishi` and enter your command:

```bash
$ baishi
What would you like to do? show all jpg files
$ find . -name "*.jpg"
Execute this command? (Y/n) y
```

### Direct Mode

Pass your request as arguments:

```bash
$ baishi "count lines in all python files"
$ find . -name "*.py" -exec wc -l {} +
```

### Skip Confirmation

Use `-n` flag to execute immediately:

```bash
$ baishi -n "show current directory"
$ pwd
/home/user/projects
```

## 4. Common Examples

### File Operations

```bash
# Find large files
baishi "find files larger than 50MB"

# Batch rename
baishi "rename all .txt files to .bak"

# Archive old logs
baishi "compress all log files older than 7 days"
```

### System Information

```bash
# Check system resources
baishi "show memory and CPU usage"

# Network status
baishi "list all network connections"

# Process management
baishi "find process using port 8080"
```

### Development Tasks

```bash
# Git operations
baishi "show git commits from last week"

# Docker management
baishi "remove all stopped docker containers"

# Package management
baishi "update all npm packages to latest"
```

## 5. Tips for Better Results

### Be Specific

```bash
# Good
baishi "find all PDF files modified in the last 24 hours"

# Less specific
baishi "find recent PDFs"
```

### Include Context

```bash
# Good
baishi "in the src folder, find all JavaScript files containing 'TODO'"

# Missing context
baishi "find TODO"
```

### Use Natural Language

```bash
# Natural
baishi "show me which process is using the most memory"

# Technical (also works)
baishi "ps aux sort by memory"
```

## 6. Configuration Check

View your current settings:

```bash
baishi config
```

Output:
```
Current Configuration:
────────────────────────
Provider: openai
Model: gpt-4o-mini
Format Output: No
Confirm Execute: Yes
Save History: Yes
Config Path: /home/user/.baishi/baishi_profile
```

## Next Steps

- Learn about [Configuration Options](configuration.md)
- Explore [Advanced Features](../guide/advanced.md)
- Set up [Different Providers](../guide/providers.md)