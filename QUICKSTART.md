# Slidev Builder MCP - Quick Start

## 🚀 5-Minute Setup

### Step 1: Install
```bash
npm install -g @hatch/slidev-builder-mcp
```

### Step 2: Configure Claude Desktop
Add to `claude_desktop_config.json`:
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

### Step 3: Create Your First Presentation
```javascript
// Ask Claude: "Create a business presentation about Q4 results"
await mcp.callTool('create_deck', {
  title: 'Q4 Business Review',
  outputPath: './my-presentation',
  theme: 'hatch-corporate'
});
```

### Step 4: Add Content
```javascript
// Add slides with content
await mcp.callTool('create_slide', {
  deckPath: './my-presentation',
  slideType: 'content',
  content: {
    title: 'Executive Summary',
    body: '- Revenue up 15%\n- Cost optimization achieved\n- Market expansion successful'
  }
});
```

### Step 5: Export
```javascript
// Export to PDF
await mcp.callTool('export_deck', {
  deckPath: './my-presentation',
  format: 'pdf',
  outputPath: './presentation.pdf'
});
```

## 🎉 You're Done!

Your professional presentation is ready with:
- ✅ Auto-generated starter slides
- ✅ Hatch corporate branding
- ✅ Professional layouts
- ✅ Export to PDF/PowerPoint

See [API Documentation](./API-DOCUMENTATION.md) for advanced features.