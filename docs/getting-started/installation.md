# Installation

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js (or use yarn)
- **Git**: For cloning the repository

## Install via npm (Recommended)

```bash
npm install -g baishi
```

## Install from Source

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/baishi.git
cd baishi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Link Globally

```bash
npm link
```

## Verify Installation

```bash
baishi --version
```

## Platform-Specific Notes

### macOS

If you're using Homebrew:

```bash
# Install Node.js if not already installed
brew install node

# Then install baishi
npm install -g baishi
```

### Linux

For Ubuntu/Debian:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install baishi
npm install -g baishi
```

For Arch Linux:

```bash
# Install Node.js
sudo pacman -S nodejs npm

# Install baishi
npm install -g baishi
```

### Windows

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open PowerShell as Administrator
3. Run:

```powershell
npm install -g baishi
```

## Using with Docker

```dockerfile
FROM node:18-alpine
RUN npm install -g baishi
CMD ["baishi"]
```

## Troubleshooting

### Permission Errors

If you encounter permission errors during global installation:

```bash
# Option 1: Use npx (no global install needed)
npx baishi

# Option 2: Change npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g baishi

# Option 3: Use sudo (not recommended)
sudo npm install -g baishi
```

### Command Not Found

If `baishi` command is not found after installation:

1. Check npm bin directory:
   ```bash
   npm bin -g
   ```

2. Add to PATH:
   ```bash
   export PATH=$(npm bin -g):$PATH
   ```

3. For permanent fix, add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.)

## Next Steps

Once installed, proceed to [Quick Start](quickstart.md) to configure baishi.