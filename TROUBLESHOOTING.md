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

#### Package Installation Failures
**Error**: `Failed to install dependencies`
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try alternative registry
npm install --registry https://registry.npmjs.org/
```

---

### MCP Configuration Issues

#### MCP Server Not Detected
**Error**: `MCP server 'slidev-builder' not found`

**Solution 1**: Check Claude Desktop Configuration
```json
// Correct configuration in claude_desktop_config.json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": []
    }
  }
}
```

**Solution 2**: Verify Installation Path
```bash
# Check if command exists
which slidev-builder-mcp

# If not found, verify global installation
npm list -g @hatch/slidev-builder-mcp

# Reinstall if necessary
npm install -g @hatch/slidev-builder-mcp
```

**Solution 3**: Use Full Path (Windows)
```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "C:\\Users\\USERNAME\\AppData\\Roaming\\npm\\slidev-builder-mcp.cmd",
      "args": []
    }
  }
}
```

#### MCP Server Crashes on Start
**Error**: `Server process exited with code 1`

**Debug Steps**:
```bash
# Test command directly
slidev-builder-mcp --version

# Enable debug mode
DEBUG=* slidev-builder-mcp

# Check logs
cat ~/.slidev-builder/logs/error.log
```

#### Connection Timeout
**Error**: `MCP server connection timeout`

**Solution**:
```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": ["--timeout", "60000"],
      "timeout": 30000
    }
  }
}
```

---

### Python Integration Issues

#### Python Not Found
**Error**: `Python executable not found`

**Solution 1**: Install Python
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

**Solution 2**: Configure Python Path
```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": [],
      "env": {
        "PYTHON_PATH": "/usr/bin/python3",
        "PYTHONPATH": "/path/to/your/python/libs"
      }
    }
  }
}
```

#### Missing Python Modules
**Error**: `ModuleNotFoundError: No module named 'matplotlib'`

**Solution**:
```bash
# Install required packages
pip3 install matplotlib plotly pandas numpy seaborn

# Or install all at once
pip3 install -r requirements.txt

# For conda users
conda install matplotlib plotly pandas numpy seaborn

# Verify installation
python3 -c "import matplotlib; print('✓ matplotlib installed')"
```

#### Virtual Environment Issues
**Error**: `Charts not generating in virtual environment`

**Solution**:
```bash
# Activate virtual environment
source your-env/bin/activate  # macOS/Linux
# or
your-env\Scripts\activate     # Windows

# Install packages in virtual environment
pip install matplotlib plotly pandas numpy

# Configure MCP to use virtual environment Python
which python  # Get path to virtual environment Python
```

```json
{
  "mcpServers": {
    "slidev-builder": {
      "command": "slidev-builder-mcp",
      "args": [],
      "env": {
        "PYTHON_PATH": "/path/to/venv/bin/python"
      }
    }
  }
}
```

---

### Chart Generation Issues

#### Charts Not Displaying
**Error**: `Chart file not found or empty`

**Diagnostic Steps**:
```bash
# Check if Python script executed
ls -la /path/to/presentation/charts/

# Test Python chart generation manually
cd /path/to/presentation/python
python3 chart_generator.py

# Check Python output
python3 -c "
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [1, 4, 2])
plt.savefig('test.png')
print('Chart saved successfully')
"
```

**Common Solutions**:
1. **Missing display backend**:
```python
# Add to chart scripts
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
```

2. **Permission issues**:
```bash
# Check directory permissions
ls -la /path/to/presentation/
chmod 755 /path/to/presentation/charts/
```

3. **Data format issues**:
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

#### Chart Quality Issues
**Problem**: `Charts appear blurry or low quality`

**Solution**:
```javascript
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: { /* your data */ },
  styling: {
    width: 1200,      // Increase resolution
    height: 800,
    dpi: 300          // High DPI for crisp images
  }
});
```

---

### Slidev Framework Issues

#### Slidev Not Starting
**Error**: `Failed to start Slidev development server`

**Solution 1**: Check Port Availability
```bash
# Check if port 3030 is in use
lsof -i :3030

# Kill process using port
kill -9 $(lsof -t -i:3030)

# Or use different port
SLIDEV_PORT=3031 npm run dev
```

**Solution 2**: Clear Slidev Cache
```bash
# Clear Slidev cache
rm -rf node_modules/.slidev
rm -rf .slidev

# Restart development server
npm run dev
```

#### Build Failures
**Error**: `Build failed with TypeScript errors`

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update dependencies
npm update

# Clear build cache
rm -rf dist/
npm run build
```

#### Theme Not Applied
**Error**: `Theme styles not loading`

**Diagnostic Steps**:
```bash
# Check theme installation
npm list @slidev/theme-default

# Verify theme in slides.md frontmatter
head -20 slides.md

# Check theme CSS files
ls -la node_modules/@slidev/theme-*/
```

**Solution**:
```markdown
---
theme: hatch-corporate
# Ensure theme name matches installed theme
---
```

---

### Export Issues

#### PDF Export Failures
**Error**: `Failed to export PDF`

**Solution 1**: Install Missing Dependencies
```bash
# Install Puppeteer dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or use system Chrome
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

**Solution 2**: Memory Issues
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Export with options
await mcp.callTool('export_deck', {
  deckPath: './presentation',
  format: 'pdf',
  outputPath: './output.pdf',
  options: {
    timeout: 60000,  // Increase timeout
    scale: 1         // Reduce scale if needed
  }
});
```

#### PowerPoint Export Issues
**Error**: `PPTX export not working`

**Solution**:
```bash
# Install additional dependencies
npm install -g @slidev/cli@latest

# Use HTML export as alternative
await mcp.callTool('export_deck', {
  deckPath: './presentation',
  format: 'html',
  outputPath: './presentation.html'
});
```

#### Large File Size Issues
**Problem**: `Exported files are too large`

**Solution**:
```javascript
// Optimize images before including
// Reduce chart resolution
await mcp.callTool('generate_chart', {
  styling: {
    width: 800,      // Smaller dimensions
    height: 400,
    dpi: 150         // Lower DPI
  }
});

// Export specific slide range
await mcp.callTool('export_deck', {
  options: {
    range: "1-10"    // Export only needed slides
  }
});
```

---

### Performance Issues

#### Slow Chart Generation
**Problem**: `Chart generation takes too long`

**Solution 1**: Optimize Python Environment
```bash
# Use faster Python implementation
pip install numpy[fast]

# Or use PyPy for better performance
pypy3 -m pip install matplotlib plotly
```

**Solution 2**: Reduce Data Complexity
```javascript
// Limit data points
const limitedData = {
  labels: data.labels.slice(0, 50),  // Max 50 points
  values: data.values.slice(0, 50)
};
```

#### Memory Usage Issues
**Error**: `Out of memory during build`

**Solution**:
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Use streaming for large datasets
# Split large presentations into smaller parts
```

#### Slow Export Performance
**Problem**: `PDF export is very slow`

**Solution**:
```javascript
// Optimize export settings
await mcp.callTool('export_deck', {
  format: 'pdf',
  options: {
    withClicks: false,    // Disable animations
    scale: 1,             // Use default scale
    timeout: 30000        // Set reasonable timeout
  }
});
```

---

### File System Issues

#### Permission Denied Errors
**Error**: `EACCES: permission denied, mkdir`

**Solution**:
```bash
# Fix directory permissions
sudo chown -R $USER:$USER /path/to/presentation
chmod -R 755 /path/to/presentation

# Or use different output directory
mkdir ~/presentations
chmod 755 ~/presentations
```

#### Path Length Issues (Windows)
**Error**: `Path too long`

**Solution**:
```bash
# Enable long paths in Windows
# Run as Administrator in PowerShell:
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Or use shorter paths
cd C:\
mkdir slides
cd slides
```

#### File Locking Issues
**Error**: `File in use by another process`

**Solution**:
```bash
# Close all applications using the file
# Use Process Explorer on Windows
# Or use lsof on Linux/macOS
lsof /path/to/file

# Kill processes using the file
kill -9 $(lsof -t /path/to/file)
```

---

### Theme and Styling Issues

#### CSS Not Loading
**Problem**: `Custom styles not applied`

**Diagnostic**:
```bash
# Check CSS file exists
ls -la /path/to/presentation/style.css

# Verify CSS syntax
npx stylelint style.css

# Check browser console for CSS errors
```

**Solution**:
```css
/* Ensure CSS is valid */
.my-class {
    color: #00A651;
    /* Remove any syntax errors */
}
```

#### Font Loading Issues
**Problem**: `Custom fonts not displaying`

**Solution**:
```css
/* Add font imports at top of CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

/* Or use web-safe fallbacks */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### Color Inconsistency
**Problem**: `Hatch colors not applied correctly`

**Solution**:
```css
/* Define CSS variables for consistency */
:root {
    --hatch-primary: #00A651;
    --hatch-secondary: #004225;
    --hatch-accent: #FFB800;
}

.hatch-primary {
    color: var(--hatch-primary);
}
```

---

### Network and Connectivity Issues

#### Asset Loading Failures
**Error**: `Failed to load external assets`

**Solution**:
```javascript
// Use local assets instead of external URLs
// Download and include assets in presentation directory
await mcp.callTool('create_slide', {
  content: {
    imageUrl: './assets/local-image.png'  // Local instead of URL
  }
});
```

#### Proxy Issues
**Error**: `Network requests failing behind proxy`

**Solution**:
```bash
# Configure npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Set environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

---

## 🔧 Debug Tools and Commands

### Enable Debug Mode
```bash
# Environment variables
export DEBUG=slidev-builder:*
export SLIDEV_DEBUG=true
export NODE_ENV=development

# Run with debug output
slidev-builder-mcp --debug --verbose
```

### Diagnostic Commands
```bash
# System information
node --version
npm --version
python3 --version
which slidev-builder-mcp

# Check installation
npm list -g @hatch/slidev-builder-mcp
npm outdated -g

# Test basic functionality
echo '{"title": "Test"}' | slidev-builder-mcp test-create

# Validate configuration
slidev-builder-mcp validate-config
```

### Log Analysis
```bash
# Find log files
find ~ -name "*slidev*" -name "*.log" 2>/dev/null

# Monitor logs in real-time
tail -f ~/.slidev-builder/logs/debug.log

# Search for specific errors
grep -i "error\|fail\|exception" ~/.slidev-builder/logs/debug.log
```

---

## 📞 Getting Help

### Self-Help Resources
1. **Documentation Review**
   - [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md)
   - [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
   - [QUICKSTART.md](./QUICKSTART.md)

2. **Online Resources**
   - GitHub Issues: Known issues and solutions
   - Slidev Documentation: Framework-specific help
   - Stack Overflow: Community solutions

### Community Support
1. **GitHub**
   - Issues: Report bugs with detailed information
   - Discussions: Ask questions and get community help
   - Wiki: Community-maintained guides

2. **Hatch Internal**
   - Slack: #digital-innovation channel
   - Teams: Weekly office hours
   - Email: digital-innovation@hatch.com

### Reporting Bugs

When reporting issues, include:

```bash
# System information
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Python: $(python3 --version)"

# MCP information
echo "MCP Version: $(slidev-builder-mcp --version)"
npm list -g @hatch/slidev-builder-mcp

# Error logs
tail -50 ~/.slidev-builder/logs/error.log

# Configuration
cat ~/.config/Claude/claude_desktop_config.json
```

**Provide**:
- Detailed error messages
- Steps to reproduce
- Expected vs actual behavior
- System configuration
- Sample code that fails

---

## ✅ Prevention Checklist

- [ ] Keep Node.js and npm updated
- [ ] Regularly update the MCP package
- [ ] Maintain Python environment dependencies
- [ ] Monitor system disk space
- [ ] Backup presentation projects
- [ ] Test exports before important presentations
- [ ] Keep themes and templates updated
- [ ] Review logs periodically
- [ ] Validate configurations after changes
- [ ] Document custom modifications

---

**Remember**: Most issues can be resolved by ensuring prerequisites are correctly installed and configured. When in doubt, start with a fresh installation in a clean environment.
