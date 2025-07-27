# Slidev Builder MCP - Troubleshooting Guide

## 🔍 Common Issues & Solutions

### Installation Issues

#### Node.js Version Problems
**Error**: `Unsupported Node.js version`
```bash
# Check current version
node --version

# Install Node.js 18+ using Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify installation
node --version  # Should show v18.x.x or higher
```

#### NPM Permission Errors (Linux/macOS)
**Error**: `EACCES: permission denied`
```bash
# Fix NPM permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Try installation again
npm install -g @hatch/slidev-builder-mcp
```

### MCP Configuration Issues

#### MCP Server Not Detected
**Error**: `MCP server 'slidev-builder' not found`

**Solution**: Check Claude Desktop Configuration
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

### Python Integration Issues

#### Python Not Found
**Error**: `Python executable not found`

**Solution**: Install Python
```bash
# Windows - Download from python.org
# macOS
brew install python3

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip

# Verify installation
python3 --version
```

#### Missing Python Modules
**Error**: `ModuleNotFoundError: No module named 'matplotlib'`

**Solution**:
```bash
# Install required packages
pip3 install matplotlib plotly pandas numpy seaborn

# Verify installation
python3 -c "import matplotlib; print('✓ matplotlib installed')"
```

### Chart Generation Issues

#### Charts Not Displaying
**Error**: `Chart file not found or empty`

**Common Solutions**:
1. **Missing display backend**:
```python
# Add to chart scripts
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
```

2. **Data format issues**:
```javascript
// Ensure proper data structure
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['A', 'B', 'C'],  // Array of strings
    values: [1, 2, 3]         // Array of numbers
  }
});
```

### Performance Issues

#### Slow Export Times
**Problem**: PDF export takes too long

**Solutions**:
1. **Reduce image sizes**:
```bash
# Compress images before adding
magick convert large-image.png -quality 85 -resize 1920x1080> optimized.png
```

2. **Export specific slides**:
```javascript
await mcp.callTool('export_deck', {
  deckPath: './presentation',
  format: 'pdf',
  outputPath: './output.pdf',
  options: {
    range: "1-10"  // Only export first 10 slides
  }
});
```

### Getting Help

#### Enable Debug Mode
```bash
# Set debug environment variable
export SLIDEV_DEBUG=true
slidev-builder-mcp

# Or for Windows
set SLIDEV_DEBUG=true
slidev-builder-mcp
```

#### Collect System Information
```bash
# System info for bug reports
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "Python: $(python3 --version)"
echo "OS: $(uname -a)"
echo "MCP Package: $(npm list -g @hatch/slidev-builder-mcp)"
```

#### Contact Support
1. **GitHub Issues**: [Report bugs](https://github.com/adolfosalasgomez3011/slidev-builder-mcp/issues)
2. **Documentation**: Check [API Documentation](./API-DOCUMENTATION.md)
3. **Community**: Join discussions on GitHub

---

🛟 **Still having issues?** Please open a GitHub issue with:
- Error message (complete stack trace)
- System information (Node.js, OS, Python versions)
- Steps to reproduce
- Expected vs actual behavior