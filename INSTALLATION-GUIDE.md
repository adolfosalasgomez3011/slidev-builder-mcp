# Slidev Builder MCP - Installation Guide

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 8.0.0 or higher
- **TypeScript**: Version 5.0.0 or higher (for development)
- **Git**: For version control and collaboration

### Optional Dependencies
- **Python**: Version 3.8+ (for chart generation)
- **Chromium**: For PDF export (installed automatically with Slidev)

## 🚀 Installation Methods

### Method 1: Global NPM Installation (Recommended)

```bash
# Install globally
npm install -g @hatch/slidev-builder-mcp

# Verify installation
slidev-builder-mcp --version
```

### Method 2: Local Development Setup

```bash
# Clone the repository
git clone https://github.com/adolfosalasgomez3011/slidev-builder-mcp.git
cd slidev-builder-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Test the installation
npm test
```

### Method 3: NPX (No Installation)

```bash
# Run directly with NPX
npx @hatch/slidev-builder-mcp
```

## 🔧 MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "npx",
      "args": ["@hatch/slidev-builder-mcp"]
    }
  }
}
```

### VS Code with MCP Extension

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": []
    }
  }
}
```

### Custom MCP Client

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'slidev-builder-mcp',
  args: []
});

const client = new Client({
  name: 'slidev-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);
```

## 🐍 Python Integration Setup (Optional)

### Install Python Dependencies

```bash
# Create virtual environment
python -m venv slidev-env
source slidev-env/bin/activate  # On Windows: slidev-env\Scripts\activate

# Install required packages
pip install matplotlib plotly pandas numpy seaborn
```

### Configure Python Path

```bash
# Set environment variable
export SLIDEV_PYTHON_PATH="/path/to/your/python"

# Or in Windows
set SLIDEV_PYTHON_PATH="C:\\path\\to\\your\\python.exe"
```

## ✅ Verification

### Test Basic Functionality

```bash
# Create a test presentation
mkdir test-presentation
cd test-presentation

# Initialize with MCP (if using Claude Desktop)
# Or use the API directly
```

### Test with MCP Client

```javascript
// Test the create_deck tool
const result = await mcp.callTool('create_deck', {
  title: 'Test Presentation',
  outputPath: './test-deck',
  theme: 'default'
});

console.log(result);
```

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Error
```bash
# Check Node.js version
node --version

# Update Node.js if needed
npm install -g n
n latest
```

#### Permission Errors
```bash
# Fix NPM permissions (Linux/Mac)
sudo chown -R $(whoami) ~/.npm

# Or use NPM prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Python Path Issues
```bash
# Find Python path
which python3
# or
where python

# Set in environment
export SLIDEV_PYTHON_PATH="$(which python3)"
```

### Support

For installation issues:
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Open an issue on [GitHub](https://github.com/adolfosalasgomez3011/slidev-builder-mcp/issues)
3. Contact the development team

---

🎉 **Installation Complete!** You're ready to create professional presentations with Slidev Builder MCP.