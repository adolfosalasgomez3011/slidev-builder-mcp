# Slidev Builder MCP v2.1 Ìª°Ô∏è

## **Never Lose Your Presentation Work Again!**

A revolutionary Model Context Protocol (MCP) server for creating professional Slidev presentations with **built-in Git Guardian protection**. Experience automatic backup, smart recovery, and bulletproof data protection.

## Ìª°Ô∏è **NEW: Git Guardian Protection System**

### **Automatic Protection Features**
- ‚úÖ **Real-time Auto-Backup**: Every edit automatically saved
- ‚úÖ **Git Integration**: Automatic commits and version history  
- ‚úÖ **Smart Recovery**: AI-powered restoration suggestions
- ‚úÖ **File Monitoring**: Instant detection of changes and deletions
- ‚úÖ **Emergency Restore**: One-click recovery from any backup point
- ‚úÖ **Zero Configuration**: Protection works automatically

### **Protection Philosophy**
```
OLD WAY: Create ‚Üí Lose Work ‚Üí Panic ‚Üí Try to Recover
NEW WAY: Create ‚Üí Auto-Protect ‚Üí Continue Confidently
```

## Ì∫Ä **Core Features**

### **Professional Presentation Creation**
- ÌæØ **Automated Slide Generation**: Create presentations with simple prompts
- Ìæ® **Hatch Brand Integration**: Professional corporate themes and styling  
- Ì≥ä **Dynamic Charts**: Auto-generate interactive visualizations
- Ì∂ºÔ∏è **Asset Integration**: Fetch icons and images from multiple APIs
- ‚ö° **Interactive Components**: Animations, diagrams, and data visualizations
- Ì≥§ **Multi-format Export**: PDF, HTML, PowerPoint, and web applications

### **Advanced Capabilities** 
- Ì∑© **Component Library**: Reusable presentation elements
- Ì±• **Team Collaboration**: Share and sync presentations
- Ì¥Ñ **Live Preview**: Real-time presentation development
- Ì¥ñ **AI-Powered**: Smart content suggestions and optimization

## Ì≥¶ **Installation**

### **Global Installation (Recommended)**
```bash
npm install -g @hatch/slidev-builder-mcp-v2
```

### **MCP Client Configuration**
Add to your MCP client (Claude Desktop, VS Code, etc.):

```json
{
  "mcpServers": {
    "slidev-builder-v2": {
      "command": "npx",
      "args": ["-y", "@hatch/slidev-builder-mcp-v2"]
    }
  }
}
```

## Ìª°Ô∏è **Protection in Action**

### **Automatic Protection (No Setup Required)**
```bash
# Every operation is automatically protected:
"Create a presentation about AI strategy"
# ‚Üí Auto-backup created, presentation built, success committed

"Add a slide with financial projections" 
# ‚Üí Pre-operation backup, slide created, changes saved

"Apply the Hatch corporate theme"
# ‚Üí Checkpoint created, theme applied, verified and committed
```

### **Smart Recovery** 
```bash
# If something goes wrong:
"I think I lost some content, can you help?"
# ‚Üí AI analyzes backups: "Found 3 versions with that content:
#    1. 5 minutes ago (most recent)
#    2. 30 minutes ago (before theme change)  
#    3. 1 hour ago (complete version)"
```

## ÌæØ **Available Tools**

### **Protected Creation Tools**
- `create_deck_protected` - Create presentations with automatic protection
- `create_slide` - Add slides with auto-backup
- `apply_theme` - Apply themes with rollback capability
- `generate_chart` - Create charts with version control

### **Protection Management**
- `backup_presentation` - Manual backup creation
- `restore_presentation` - Emergency recovery from backups
- `backup_status` - Check protection health
- `enable_protection` - Activate protection for existing projects

### **Component Library**
- `create_component` - Build reusable presentation elements
- `list_components` - Browse available components  
- `add_component` - Insert components into slides
- `publish_component` - Share components with team

## Ìæ® **Professional Themes**

- **Hatch Corporate**: Professional business presentations
- **Hatch Executive**: C-level summary formats  
- **Hatch Technical**: Developer and engineering content
- **Hatch Client**: Customer-facing presentations

## Ì≥ä **Example Usage**

### **Create Protected Presentation**
```typescript
await mcp.callTool('create_deck_protected', {
  title: 'Q4 Strategic Review',
  template: 'hatch-corporate',
  outputPath: './presentations/q4-review',
  protection: {
    autoBackup: true,     // ‚úÖ Automatic (default)
    gitIntegration: true, // ‚úÖ Automatic (default)  
    fileWatching: true    // ‚úÖ Automatic (default)
  }
});
```

### **Add Interactive Content**
```typescript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-review',
  slideType: 'chart',
  content: {
    title: 'Revenue Growth',
    chartType: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      values: [100, 120, 140, 180]
    }
  }
});
// ‚úÖ Auto-protected: backup ‚Üí create ‚Üí verify ‚Üí commit
```

## Ì¥ß **Development**

### **Local Setup**
```bash
git clone https://github.com/adolfosalasgomez3011/slidev-builder-mcp.git
cd slidev-builder-mcp
npm install
npm run build
npm link
```

### **Testing Protection**
```bash
# Test backup functionality
npm run protection:backup

# Test restore functionality  
npm run protection:restore

# Check protection status
npm run protection:status
```

## Ìºç **Why Slidev Builder MCP v2?**

### **For Professionals**
- ‚úÖ **Zero Data Loss**: Never lose presentation work again
- ‚úÖ **Enterprise Quality**: Hatch consulting-grade templates
- ‚úÖ **Rapid Development**: Create presentations 10x faster
- ‚úÖ **Team Ready**: Built for collaboration and sharing

### **For Developers**
- ‚úÖ **MCP Standard**: Future-proof protocol compliance
- ‚úÖ **TypeScript**: Full type safety and IntelliSense
- ‚úÖ **Open Source**: MIT license for customization
- ‚úÖ **Extensible**: Plugin architecture for custom features

## Ì≥Ñ **License**

MIT License - see [LICENSE](LICENSE) file for details.

## Ìø¢ **About Hatch**

Built by [Hatch Ltd](https://hatch.com), a leading engineering and consulting firm with 70+ years of expertise in mining, energy, and infrastructure. Our AI-Native Advisory Practice brings cutting-edge technology to traditional industries.

---

**Ìª°Ô∏è Your presentations are now bulletproof. Create with confidence!**
