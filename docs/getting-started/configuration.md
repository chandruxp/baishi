# Configuration

Baishi stores its configuration in `~/.baishi/baishi_profile`. You can edit this file manually or use the setup wizard.

## Configuration File Location

- **macOS/Linux**: `~/.baishi/baishi_profile`
- **Windows**: `%USERPROFILE%\.baishi\baishi_profile`

## Configuration Options

### Basic Settings

```bash
# AI Provider (openai, google, anthropic, ollama, openrouter)
BAISH_PROVIDER=openai

# API Key for the provider
BAISH_API_KEY=your-api-key-here

# AI Model to use
BAISH_MODEL=gpt-4o-mini

# Format output with AI (true/false)
BAISH_FORMAT_OUTPUT=false

# Confirm before executing commands (true/false)
BAISH_CONFIRM=true
```

### Advanced Settings

```bash
# Save command history (true/false)
BAISH_SAVE_HISTORY=true

# Maximum history entries
BAISH_HISTORY_LIMIT=100

# Default shell to use
BAISH_DEFAULT_SHELL=/bin/bash

# Command timeout in milliseconds
BAISH_TIMEOUT=30000

# AI temperature (0.0-1.0)
BAISH_TEMPERATURE=0.3

# Maximum tokens for AI responses
BAISH_MAX_TOKENS=500
```

### Provider-Specific Settings

#### Ollama

```bash
# Ollama host URL
BAISH_OLLAMA_HOST=http://localhost:11434
```

#### OpenRouter

```bash
# OpenRouter API key
BAISH_OPENROUTER_API_KEY=your-openrouter-key
```

## Environment Variables

You can override configuration using environment variables:

```bash
# Temporary override
BAISH_PROVIDER=ollama baishi "list files"

# Export for session
export BAISH_API_KEY="new-api-key"
export BAISH_MODEL="gpt-4"
```

## Command-Line Overrides

Override settings for a single command:

```bash
# Use different provider
baishi -p google "search for large files"

# Use different model
baishi -m gemini-pro "explain this error"

# Disable confirmation
baishi -n "quick command"

# Enable formatting
baishi -f "show system stats"
```

## Model Selection

### OpenAI Models

- `gpt-4o` - Most capable, highest quality
- `gpt-4o-mini` - Faster, more affordable
- `gpt-4-turbo` - Previous generation
- `gpt-3.5-turbo` - Legacy, fastest

### Google AI Models

- `gemini-2.0-flash-exp` - Latest experimental
- `gemini-1.5-pro` - Most capable
- `gemini-1.5-flash` - Fast and efficient

### Anthropic Models

- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced
- `claude-3-haiku-20240307` - Fast and efficient

### Ollama Models

- `llama3.2` - Latest Llama model
- `mistral` - Fast and efficient
- `codellama` - Optimized for code
- `phi3` - Small but capable
- `qwen2.5-coder` - Specialized for coding

### OpenRouter Models

- `meta-llama/llama-3.2-3b-instruct:free` - Free tier
- `google/gemini-2.0-flash-exp:free` - Free Gemini
- `openai/gpt-4o-mini` - OpenAI via OpenRouter
- `anthropic/claude-3-haiku` - Claude via OpenRouter

## Security Best Practices

### API Key Storage

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Restrict file permissions**:
   ```bash
   chmod 600 ~/.baishi/baishi_profile
   ```

### Safe Execution

1. **Keep confirmation enabled** for production systems
2. **Review commands** before execution
3. **Set appropriate timeouts** to prevent hanging
4. **Use read-only operations** when testing

## Multiple Configurations

### Profile Management

Create different profiles for different use cases:

```bash
# Development profile
cp ~/.baishi/baishi_profile ~/.baishi/baishi_profile.dev

# Production profile
cp ~/.baishi/baishi_profile ~/.baishi/baishi_profile.prod
```

Load specific profile:

```bash
# Use environment variable
BAISH_PROFILE=dev baishi "command"

# Or create aliases
alias baishi-dev="BAISH_PROFILE=dev baishi"
alias baishi-prod="BAISH_PROFILE=prod baishi"
```

## Troubleshooting Configuration

### Check Current Configuration

```bash
baishi config
```

### Validate Configuration

```bash
# Test with a simple command
baishi "echo test"
```

### Reset Configuration

```bash
# Backup current config
cp ~/.baishi/baishi_profile ~/.baishi/baishi_profile.backup

# Run setup wizard again
baishi setup
```

### Common Issues

1. **API Key Not Working**
   - Check for extra spaces or quotes
   - Verify key is active on provider's dashboard
   - Ensure correct provider is selected

2. **Model Not Found**
   - Verify model name spelling
   - Check if model is available for your API tier
   - Use default model if unsure

3. **Connection Errors**
   - Check internet connection
   - Verify firewall settings
   - For Ollama, ensure service is running

## Next Steps

- Learn about [AI Providers](../guide/providers.md)
- Explore [Advanced Features](../guide/advanced.md)
- View [Command Reference](../api/commands.md)