# Quick Start Guide - Slidev Builder MCP

Get up and running with the Slidev Builder MCP in under 5 minutes!

## Installation

```bash
npm install -g slidev-builder-mcp
# or
npm install slidev-builder-mcp
```

## Basic Usage

### 1. Create Your First Presentation (30 seconds)

```javascript
const { SlidevBuilderMCP } = require('slidev-builder-mcp');
const mcp = new SlidevBuilderMCP();

// Create a new presentation with automatic starter slides
await mcp.callTool('create_deck', {
  title: 'My First Presentation',
  template: 'executive-summary',
  theme: 'hatch-corporate',
  outputPath: './my-first-deck'
});

// This automatically creates:
// 1. Cover slide with theme branding
// 2. Content slide with theme styling
// 3. Closing slide with contact info
```

### 2. Add a Simple Slide (15 seconds)

```javascript
await mcp.callTool('create_slide', {
  deckPath: './my-first-deck',
  slideType: 'content',
  content: {
    title: 'Welcome to Slidev',
    body: `
      # This is my first slide!
      
      - Easy to create
      - Professional themes
      - Interactive components
      - Python chart integration
    `
  }
});
```

### 3. Generate a Chart (30 seconds)

```javascript
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [10, 20, 30, 40]
  },
  outputPath: './my-first-deck',
  styling: {
    title: 'Quarterly Growth',
    colorScheme: 'hatch'
  }
});
```

### 4. Preview Your Presentation (10 seconds)

```bash
cd my-first-deck
npm run dev
```

Visit `http://localhost:3030` to see your presentation with **3 professional starter slides**:
1. **Cover slide** - Theme-branded title slide
2. **Content slide** - Ready-to-edit content template  
3. **Closing slide** - Professional thank you slide

All slides automatically match your selected theme!

## Pre-built Templates

Choose from professional templates:

### Executive Summary
```javascript
template: 'executive-summary'
```
Perfect for: Board meetings, quarterly reviews, strategic updates

### Technical Review
```javascript
template: 'technical-review'
```
Perfect for: Engineering updates, architecture reviews, tech demos

### Business Proposal
```javascript
template: 'business-proposal'
```
Perfect for: Sales pitches, partnership proposals, funding requests

## Available Themes

### Hatch Corporate (Default)
```javascript
theme: 'hatch-corporate'
```
- Professional green color scheme
- Clean, modern design
- Optimized for business use

### Hatch Technical
```javascript
theme: 'hatch-technical'
```
- Technical blue color scheme
- Code-friendly styling
- Monospace font support

### Hatch Minimal
```javascript
theme: 'hatch-minimal'
```
- Clean, minimal design
- Maximum content focus
- High contrast

## Quick Chart Types

### Bar Chart
```javascript
chartType: 'bar'
data: {
  labels: ['A', 'B', 'C'],
  values: [1, 2, 3]
}
```

### Line Chart
```javascript
chartType: 'line'
data: {
  x: [1, 2, 3, 4],
  y: [10, 20, 15, 25]
}
```

### Pie Chart
```javascript
chartType: 'pie'
data: {
  labels: ['Red', 'Blue', 'Green'],
  values: [30, 40, 30]
}
```

### Scatter Plot
```javascript
chartType: 'scatter'
data: {
  x: [1, 2, 3, 4, 5],
  y: [2, 4, 1, 5, 3]
}
```

## Export Options

### PDF Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-deck',
  format: 'pdf',
  outputPath: './my-presentation.pdf'
});
```

### Web App Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-deck',
  format: 'spa',
  outputPath: './web-app'
});
```

### PowerPoint Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-deck',
  format: 'pptx',
  outputPath: './my-presentation.pptx'
});
```

## Common Slide Types

### Title Slide
```javascript
slideType: 'title'
content: {
  title: 'Presentation Title',
  subtitle: 'Subtitle or Date'
}
```

### Content Slide
```javascript
slideType: 'content'
content: {
  title: 'Slide Title',
  body: 'Your content here...'
}
```

### Two Column Layout
```javascript
slideType: 'two-column'
content: {
  title: 'Slide Title',
  leftColumn: 'Left content...',
  rightColumn: 'Right content...'
}
```

### Image Slide
```javascript
slideType: 'image'
content: {
  title: 'Image Title',
  imageUrl: './path/to/image.png',
  caption: 'Image description'
}
```

## Customization Tips

### Custom Colors
```javascript
theme: 'hatch-corporate',
customizations: {
  primaryColor: '#FF6B6B',
  secondaryColor: '#4ECDC4',
  backgroundColor: '#F7F9FC'
}
```

### Custom Fonts
```javascript
customizations: {
  fontFamily: 'Roboto, sans-serif',
  headingFont: 'Montserrat, sans-serif'
}
```

### Custom CSS
```javascript
options: {
  customCSS: `
    .my-custom-class {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 2rem;
      border-radius: 8px;
    }
  `
}
```

## Interactive Components

Add interactive elements to engage your audience:

```javascript
content: {
  title: 'Interactive Slide',
  body: `
    <InteractiveChart data="sales-data.json" />
    <ClickableCard title="Learn More" />
    <AnimatedCounter target="1000" />
  `
}
```

## Python Integration

### Custom Chart Scripts
```javascript
options: {
  pythonIntegration: true,
  customPythonScript: `
import matplotlib.pyplot as plt
import numpy as np

# Your custom chart logic
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.title('Custom Chart')
plt.savefig('output.png')
  `
}
```

## Tips for Success

1. **Start Simple**: Begin with a template and basic slides
2. **Consistent Branding**: Use the same theme throughout
3. **Readable Charts**: Keep charts simple and well-labeled
4. **Test Early**: Preview frequently during development
5. **Export Options**: Choose the right format for your audience

## Common Use Cases

### Business Meetings
- Use `executive-summary` template
- Focus on key metrics and charts
- Export to PDF for sharing

### Technical Presentations
- Use `technical-review` template
- Include code examples and architecture diagrams
- Use interactive components for demos

### Sales Pitches
- Use `business-proposal` template
- Emphasize value propositions
- Include customer testimonials and case studies

## Next Steps

1. Check out the [Full Example](./business-review-example.md)
2. Explore the [Advanced Features Guide](./advanced-features.md)
3. Browse the [Template Gallery](./template-gallery.md)
4. Join our [Community](https://github.com/your-org/slidev-builder-mcp)

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/your-org/slidev-builder-mcp/issues)
- 💬 [Community Discussions](https://github.com/your-org/slidev-builder-mcp/discussions)
- 📧 [Contact Support](mailto:support@yourorg.com)

Happy presenting! 🎉
