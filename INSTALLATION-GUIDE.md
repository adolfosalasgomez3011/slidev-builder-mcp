<<<<<<< HEAD
# Slidev Builder MCP - Installation & Setup Guide
=======
# Slidev Builder MCP - Installation Guide
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
<<<<<<< HEAD
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Python**: Version 3.8+ (for chart generation features)
- **Git**: For version control and cloning repositories

### Verify Prerequisites
```bash
node --version    # Should show v18.0.0+
npm --version     # Should show 8.0.0+
python --version  # Should show 3.8+
git --version     # Any recent version
```

---
=======
- **NPM**: Version 8.0.0 or higher
- **TypeScript**: Version 5.0.0 or higher (for development)
- **Git**: For version control and collaboration

### Optional Dependencies
- **Python**: Version 3.8+ (for chart generation)
- **Chromium**: For PDF export (installed automatically with Slidev)
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872

## 🚀 Installation Methods

### Method 1: Global NPM Installation (Recommended)

```bash
<<<<<<< HEAD
# Install globally for system-wide access
=======
# Install globally
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
npm install -g @hatch/slidev-builder-mcp

# Verify installation
slidev-builder-mcp --version
<<<<<<< HEAD

# Test basic functionality
slidev-builder-mcp --help
```

### Method 2: Local Project Installation

```bash
# Create new project directory
mkdir my-presentations
cd my-presentations

# Install locally
npm init -y
npm install @hatch/slidev-builder-mcp

# Use via npx
npx slidev-builder-mcp --help
```

### Method 3: Development Installation

```bash
# Clone the repository
git clone https://github.com/hatch-ltd/slidev-builder-mcp.git
=======
```

### Method 2: Local Development Setup

```bash
# Clone the repository
git clone https://github.com/adolfosalasgomez3011/slidev-builder-mcp.git
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
cd slidev-builder-mcp

# Install dependencies
npm install

# Build the project
npm run build

<<<<<<< HEAD
# Link for global development use
npm link

# Test the development version
slidev-builder-mcp --version
```

---

## ⚙️ MCP Client Configuration

### Claude Desktop Integration

1. **Locate Configuration File**
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add MCP Server Configuration**
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

3. **For Local Installation**
=======
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

>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
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

<<<<<<< HEAD
4. **Restart Claude Desktop**
   - Close Claude Desktop completely
   - Restart the application
   - Verify the MCP server appears in tools

### VS Code MCP Extension Integration

1. **Install MCP Extension**
```bash
code --install-extension modelcontextprotocol.mcp
```

2. **Configure in VS Code Settings**
```json
{
  "mcp.servers": {
=======
### VS Code with MCP Extension

Add to your MCP configuration:

```json
{
  "mcpServers": {
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": []
    }
  }
}
```

<<<<<<< HEAD
### Generic MCP Client Configuration

For other MCP clients, use this standard configuration:

```json
{
  "name": "slidev-builder",
  "command": "slidev-builder-mcp",
  "args": [],
  "capabilities": {
    "tools": true,
    "resources": true
  }
}
```

---

## 🐍 Python Setup (Optional but Recommended)

### Install Python Dependencies

The MCP can automatically set up Python environments, but manual setup ensures reliability:

```bash
# Create virtual environment (recommended)
python -m venv slidev-env

# Activate virtual environment
# Windows:
slidev-env\Scripts\activate
# macOS/Linux:
source slidev-env/bin/activate

# Install required packages
pip install matplotlib plotly pandas numpy seaborn jupyter

# Verify installation
python -c "import matplotlib; print('✓ matplotlib')"
python -c "import plotly; print('✓ plotly')"
python -c "import pandas; print('✓ pandas')"
=======
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
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
```

### Configure Python Path

<<<<<<< HEAD
If using a virtual environment, configure the MCP to use it:

```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": [],
      "env": {
        "PYTHON_PATH": "/path/to/slidev-env/bin/python"
      }
    }
  }
}
```

---

## 🎨 Theme Setup

### Install Additional Themes

```bash
# Install official Hatch themes
npm install -g @hatch/slidev-theme-corporate
npm install -g @hatch/slidev-theme-executive
npm install -g @hatch/slidev-theme-technical

# Install community themes
npm install -g @slidev/theme-default
npm install -g @slidev/theme-seriph
```

### Verify Theme Installation

```bash
# List available themes
slidev-builder-mcp list-themes

# Test theme application
slidev-builder-mcp test-theme hatch-corporate
```

---

## 🔧 Development Environment Setup

### IDE Configuration

#### VS Code (Recommended)
1. **Install Extensions**
```bash
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension vue.volar
code --install-extension ms-python.python
```

2. **Configure Workspace Settings**
```json
{
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.md": "markdown"
  }
}
```

#### IntelliJ/WebStorm
1. Enable TypeScript support
2. Install Vue.js plugin
3. Configure ESLint and Prettier
4. Set up Markdown preview

### Git Configuration

```bash
# Configure Git for development
git config --global user.name "Your Name"
git config --global user.email "your.email@hatch.com"

# Set up Git hooks (if contributing)
cd slidev-builder-mcp
npm run prepare
```

---

## 🧪 Testing Installation

### Basic Functionality Test

```bash
# Create test directory
mkdir slidev-test
cd slidev-test

# Test basic MCP functionality (if using development setup)
node -e "
const { SlidevBuilderMCP } = require('@hatch/slidev-builder-mcp');
const mcp = new SlidevBuilderMCP();
console.log('✓ MCP loaded successfully');
"
```

### Full Integration Test

Create a test script to verify all features:

```javascript
// test-installation.js
async function testInstallation() {
  try {
    // Test 1: Create a simple deck
    console.log('🧪 Testing deck creation...');
    await mcp.callTool('create_deck', {
      title: 'Installation Test',
      outputPath: './test-deck',
      theme: 'hatch-corporate'
    });
    console.log('✓ Deck creation successful');

    // Test 2: Add a slide
    console.log('🧪 Testing slide addition...');
    await mcp.callTool('create_slide', {
      deckPath: './test-deck',
      slideType: 'content',
      content: {
        title: 'Test Slide',
        body: '- Test point 1\n- Test point 2'
      }
    });
    console.log('✓ Slide addition successful');

    // Test 3: Generate a simple chart
    console.log('🧪 Testing chart generation...');
    await mcp.callTool('generate_chart', {
      chartType: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        values: [1, 2, 3]
      },
      outputPath: './test-deck',
      styling: { title: 'Test Chart' }
    });
    console.log('✓ Chart generation successful');

    // Test 4: Export to PDF
    console.log('🧪 Testing PDF export...');
    await mcp.callTool('export_deck', {
      deckPath: './test-deck',
      format: 'pdf',
      outputPath: './test-deck.pdf'
    });
    console.log('✓ PDF export successful');

    console.log('\n🎉 All tests passed! Installation is complete.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Verify all prerequisites are installed');
    console.log('2. Check MCP client configuration');
    console.log('3. Ensure Python dependencies are available');
    console.log('4. Review error logs for specific issues');
  }
}

// Run tests
testInstallation();
```

---

## 🔍 Troubleshooting

### Common Installation Issues

#### 1. Node.js Version Incompatibility
```bash
# Error: Unsupported Node.js version
# Solution: Update Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use Node Version Manager
nvm install 18
nvm use 18
```

#### 2. NPM Permission Issues (Linux/macOS)
```bash
# Error: EACCES permission denied
# Solution: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### 3. Python Module Not Found
```bash
# Error: ModuleNotFoundError: No module named 'matplotlib'
# Solution: Install in correct environment
which python  # Verify Python path
pip install matplotlib plotly pandas numpy

# Or use conda
conda install matplotlib plotly pandas numpy
```

#### 4. MCP Server Not Found
```json
// Error: MCP server 'slidev-builder' not found
// Solution: Check Claude config path and syntax
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": []
    }
  }
}
```

#### 5. Port Already in Use
```bash
# Error: Port 3030 already in use
# Solution: Use different port
SLIDEV_PORT=3031 slidev-builder-mcp

# Or kill existing process
lsof -ti:3030 | xargs kill -9
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set debug environment variables
export DEBUG=slidev-builder:*
export SLIDEV_DEBUG=true

# Run with debug output
slidev-builder-mcp --verbose

# Check logs
tail -f ~/.slidev-builder/logs/debug.log
```

### Getting Help

1. **Check Documentation**
   - [README.md](./README.md) - Overview and basic usage
   - [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - Complete API reference
   - [QUICKSTART.md](./QUICKSTART.md) - 5-minute getting started

2. **Community Support**
   - GitHub Issues: Bug reports and feature requests
   - Discussions: Questions and community help
   - Wiki: Community-maintained guides

3. **Hatch Internal Support**
   - Slack: #digital-innovation channel
   - Email: digital-innovation@hatch.com
   - Teams: Weekly office hours

---

## 🔄 Keeping Updated

### Automatic Updates

```bash
# Check for updates
npm outdated -g @hatch/slidev-builder-mcp

# Update to latest version
npm update -g @hatch/slidev-builder-mcp

# Verify update
slidev-builder-mcp --version
```

### Manual Updates

```bash
# Uninstall old version
npm uninstall -g @hatch/slidev-builder-mcp

# Install latest version
npm install -g @hatch/slidev-builder-mcp@latest

# Clear cache if needed
npm cache clean --force
```

### Development Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild
npm run build

# Test changes
npm test
```

---

## 📊 Performance Optimization

### System Optimization

```bash
# Increase Node.js memory limit for large presentations
export NODE_OPTIONS="--max-old-space-size=4096"

# Optimize npm registry
npm config set registry https://registry.npmjs.org/

# Clear npm cache
npm cache clean --force
```

### MCP Configuration Optimization

```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": ["--memory-limit", "2048", "--timeout", "30000"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## ✅ Installation Checklist

- [ ] Node.js 18+ installed and verified
- [ ] NPM working correctly
- [ ] Python 3.8+ available (optional)
- [ ] Slidev Builder MCP installed globally
- [ ] MCP client configured (Claude Desktop, VS Code, etc.)
- [ ] Python dependencies installed (if using charts)
- [ ] Basic functionality tested
- [ ] Themes accessible
- [ ] Export functionality working
- [ ] Debug mode accessible if needed

---

**🎉 Congratulations! Your Slidev Builder MCP is now ready for creating professional presentations.**

For next steps, see the [Quick Start Guide](./QUICKSTART.md) or dive into the [Complete API Documentation](./API-DOCUMENTATION.md).
=======
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
>>>>>>> 4b901da2b8e4bbb10dd10e20f9875a7c2344f872
