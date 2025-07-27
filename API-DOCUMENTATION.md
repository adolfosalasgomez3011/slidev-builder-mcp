# Slidev Builder MCP - Complete API Documentation

## 📖 Overview

The Slidev Builder MCP provides a comprehensive set of tools for creating, managing, and exporting professional presentations using the Slidev framework. This document provides detailed instructions for every available tool and feature.

## 🛠️ Core Tools Reference

### 1. `create_deck`

Creates a new Slidev presentation deck with automatic starter slides.

#### Parameters
```typescript
{
  title: string;                    // Required: Presentation title
  outputPath: string;              // Required: Directory to create the deck
  template?: string;               // Optional: Template type
  theme?: string;                  // Optional: Theme name (default: 'default')
  options?: {
    includeInteractiveComponents?: boolean;  // Add Vue components
    pythonIntegration?: boolean;             // Enable Python charts
    customCSS?: string;                      // Custom styling
  }
}
```

#### Example Usage
```javascript
await mcp.callTool('create_deck', {
  title: 'Q4 Business Review',
  outputPath: './my-presentation',
  theme: 'hatch-corporate',
  options: {
    includeInteractiveComponents: true,
    pythonIntegration: true
  }
});
```

#### Output Structure
```
my-presentation/
├── slides.md              # Main Slidev file
├── slides/                # Individual slide files (NEW!)
│   ├── 001-cover.md      # Auto-generated cover slide
│   ├── 002-content.md    # Auto-generated content slide
│   ├── 003-closing.md    # Auto-generated closing slide
│   └── README.md         # Slide management instructions
├── package.json          # NPM configuration
├── style.css            # Theme-specific styles
└── python/              # Python integration (if enabled)
    ├── requirements.txt
    └── chart_generator.py
```

#### Automatic Starter Slides
Every deck automatically includes:
1. **Cover Slide** - Theme-branded title slide with date
2. **Content Slide** - Professional template with bullet points
3. **Closing Slide** - Thank you slide with contact information

#### Available Themes
- `hatch-corporate` - Professional green Hatch branding
- `hatch-executive` - Executive-level presentations
- `hatch-technical` - Technical documentation style
- `default` - Clean, minimal theme

---

### 2. `create_slide`

Adds a new slide to an existing presentation.

#### Parameters
```typescript
{
  deckPath: string;                // Required: Path to presentation deck
  slideType: 'title' | 'content' | 'chart' | 'image' | 'two-column';
  content: {
    title?: string;
    subtitle?: string;
    body?: string;                 // Markdown content
    imageUrl?: string;
    leftColumn?: string;           // For two-column layout
    rightColumn?: string;          // For two-column layout
  };
  position?: number;               // Slide position (default: append)
  styling?: {
    layout?: string;
    background?: string;
    textColor?: string;
  }
}
```

#### Slide Types

##### Title Slide
```javascript
await mcp.callTool('create_slide', {
  deckPath: './my-presentation',
  slideType: 'title',
  content: {
    title: 'Section Title',
    subtitle: 'Section Overview'
  }
});
```

##### Content Slide
```javascript
await mcp.callTool('create_slide', {
  deckPath: './my-presentation',
  slideType: 'content',
  content: {
    title: 'Key Points',
    body: `
      ## Main Topics
      - First key insight
      - Second important point
      - Third critical element
      
      > **Note**: This content supports full Markdown formatting
    `
  }
});
```

##### Two-Column Layout
```javascript
await mcp.callTool('create_slide', {
  deckPath: './my-presentation',
  slideType: 'two-column',
  content: {
    title: 'Comparison',
    leftColumn: `
      ## Advantages
      - Benefit 1
      - Benefit 2
      - Benefit 3
    `,
    rightColumn: `
      ## Challenges
      - Challenge 1
      - Challenge 2
      - Challenge 3
    `
  }
});
```

##### Image Slide
```javascript
await mcp.callTool('create_slide', {
  deckPath: './my-presentation',
  slideType: 'image',
  content: {
    title: 'Architecture Overview',
    imageUrl: './images/architecture.png',
    body: 'System architecture showing key components and data flow.'
  }
});
```

---

### 3. `generate_chart`

Creates data visualizations using Python with theme-consistent styling.

#### Parameters
```typescript
{
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'histogram' | 'heatmap';
  data: {
    labels?: string[];             // For bar/line charts
    values?: number[];             // For bar/pie charts
    x?: number[];                  // For scatter/line charts
    y?: number[];                  // For scatter/line charts
    datasets?: ChartDataset[];     // Multiple data series
  };
  outputPath: string;              // Where to save the chart
  styling?: {
    title?: string;
    width?: number;                // Default: 800px
    height?: number;               // Default: 400px
    colorScheme?: 'hatch' | 'blue' | 'green' | 'custom';
    colors?: string[];             // Custom color palette
    theme?: 'light' | 'dark';
    showLegend?: boolean;
    showGrid?: boolean;
  };
  pythonScript?: string;           // Custom Python code
}
```

#### Chart Types Examples

##### Bar Chart
```javascript
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [95, 105, 115, 125],
    datasets: [{
      label: 'Revenue ($M)',
      data: [95, 105, 115, 125],
      backgroundColor: '#00A651'
    }]
  },
  outputPath: './my-presentation',
  styling: {
    title: 'Quarterly Revenue Growth',
    colorScheme: 'hatch',
    width: 900,
    height: 500
  }
});
```

##### Line Chart with Multiple Series
```javascript
await mcp.callTool('generate_chart', {
  chartType: 'line',
  data: {
    x: [2020, 2021, 2022, 2023, 2024],
    datasets: [
      {
        label: 'Revenue',
        data: [100, 120, 140, 160, 180],
        borderColor: '#00A651',
        backgroundColor: 'rgba(0, 166, 81, 0.1)'
      },
      {
        label: 'Profit',
        data: [20, 25, 30, 38, 45],
        borderColor: '#FFB800',
        backgroundColor: 'rgba(255, 184, 0, 0.1)'
      }
    ]
  },
  outputPath: './my-presentation',
  styling: {
    title: 'Financial Performance Trend',
    showGrid: true,
    showLegend: true
  }
});
```

##### Custom Python Chart
```javascript
await mcp.callTool('generate_chart', {
  chartType: 'custom',
  outputPath: './my-presentation',
  pythonScript: `
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Create the plot with Hatch colors
plt.figure(figsize=(10, 6))
plt.plot(x, y1, color='#00A651', linewidth=2, label='Sin(x)')
plt.plot(x, y2, color='#FFB800', linewidth=2, label='Cos(x)')

plt.title('Trigonometric Functions', fontsize=16, fontweight='bold')
plt.xlabel('X Value')
plt.ylabel('Y Value')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()

# Save with Hatch styling
plt.savefig('custom_chart.png', dpi=300, bbox_inches='tight')
  `
});
```

---

### 4. `apply_theme`

Applies or changes the theme of an existing presentation.

#### Parameters
```typescript
{
  deckPath: string;                // Required: Path to presentation
  theme: string;                   // Required: Theme name
  customizations?: {
    primaryColor?: string;         // Override theme colors
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };
  preserveContent?: boolean;       // Keep existing slides (default: true)
}
```

#### Example Usage
```javascript
// Apply Hatch corporate theme
await mcp.callTool('apply_theme', {
  deckPath: './my-presentation',
  theme: 'hatch-corporate',
  customizations: {
    primaryColor: '#00A651',
    fontFamily: 'Inter, sans-serif'
  }
});

// Create custom theme variant
await mcp.callTool('apply_theme', {
  deckPath: './client-presentation',
  theme: 'hatch-corporate',
  customizations: {
    primaryColor: '#1E40AF',      // Client's blue
    secondaryColor: '#1E293B',
    customCSS: `
      .client-logo {
        position: absolute;
        top: 20px;
        right: 20px;
        height: 60px;
      }
    `
  }
});
```

---

### 5. `export_deck`

Exports presentations to various formats.

#### Parameters
```typescript
{
  deckPath: string;                // Required: Path to presentation
  format: 'pdf' | 'html' | 'pptx' | 'spa';  // Required: Export format
  outputPath: string;              // Required: Output file/directory
  options?: {
    withClicks?: boolean;          // Include slide transitions
    dark?: boolean;                // Dark mode export
    range?: string;                // Slide range (e.g., "1-5,8")
    scale?: number;                // Export scale (default: 1)
    timeout?: number;              // Rendering timeout (ms)
  }
}
```

#### Export Examples

##### PDF Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-presentation',
  format: 'pdf',
  outputPath: './exports/presentation.pdf',
  options: {
    withClicks: true,              // Include build animations
    scale: 1.5                     // Higher resolution
  }
});
```

##### Web Application Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-presentation',
  format: 'spa',
  outputPath: './exports/web-app',
  options: {
    withClicks: true
  }
});
// Creates a standalone web application
```

##### PowerPoint Export
```javascript
await mcp.callTool('export_deck', {
  deckPath: './my-presentation',
  format: 'pptx',
  outputPath: './exports/presentation.pptx',
  options: {
    range: "1-10"                  // Export only first 10 slides
  }
});
```

---

## 🎨 Theme System

### Available Themes

#### Hatch Corporate
- **Primary Color**: #00A651 (Hatch Green)
- **Secondary Color**: #004225 (Dark Green)
- **Accent Color**: #FFB800 (Gold)
- **Use Case**: Client presentations, board meetings, executive summaries

#### Hatch Executive
- **Primary Color**: #1E293B (Dark Blue)
- **Secondary Color**: #475569 (Slate)
- **Accent Color**: #3B82F6 (Blue)
- **Use Case**: C-level presentations, strategic planning

#### Hatch Technical
- **Primary Color**: #1F2937 (Dark Gray)
- **Secondary Color**: #4B5563 (Gray)
- **Accent Color**: #10B981 (Emerald)
- **Use Case**: Technical documentation, engineering presentations

#### Default
- **Primary Color**: #2563EB (Blue)
- **Secondary Color**: #1E293B (Dark)
- **Accent Color**: #F59E0B (Amber)
- **Use Case**: General presentations, prototyping

### Custom Theme Creation

You can create custom themes by providing theme configurations:

```javascript
const customTheme = {
  name: 'client-brand',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#F7F9FC',
    text: '#2C3E50'
  },
  fonts: {
    heading: 'Montserrat, sans-serif',
    body: 'Open Sans, sans-serif',
    mono: 'Fira Code, monospace'
  },
  layouts: {
    default: 'centered',
    title: 'cover',
    closing: 'center'
  }
};
```

---

## 🔧 Advanced Features

### Python Integration

When `pythonIntegration: true` is enabled, each deck includes:

#### Chart Generator
```python
# python/chart_generator.py
from slidev_charts import SlidevChart

chart = SlidevChart(theme='hatch')
chart.bar(['Q1', 'Q2', 'Q3'], [100, 120, 140])
chart.save('revenue_chart.png')
```

#### Requirements Management
```txt
# python/requirements.txt
matplotlib>=3.5.0
plotly>=5.0.0
pandas>=1.3.0
numpy>=1.21.0
seaborn>=0.11.0
```

### Interactive Components

Add Vue 3 components to slides:

```markdown
---
layout: default
---

# Interactive Dashboard

<InteractiveChart :data="chartData" />
<ClickableCard title="Revenue" value="$1.2M" trend="+15%" />
<AnimatedCounter :target="1250" duration="2000" />
```

### Slide Management

#### Individual Slide Files
Each presentation creates individual slide files for modular editing:

```
slides/
├── 001-cover.md          # Title slide
├── 002-agenda.md         # Table of contents
├── 003-executive.md      # Executive summary
├── 004-revenue.md        # Revenue slide with chart
├── 005-market.md         # Market analysis
└── README.md             # Slide index
```

#### Slide Ordering
Control slide order by renaming files:
```bash
# Reorder slides
mv 004-revenue.md 006-revenue.md
mv 005-market.md 004-market.md
```

#### Conditional Slides
Include/exclude slides for different audiences:
```javascript
// Only include slides 1-5 and 8-10 for client version
await mcp.callTool('export_deck', {
  deckPath: './presentation',
  format: 'pdf',
  outputPath: './client-version.pdf',
  options: {
    range: "1-5,8-10"
  }
});
```

---

## 🚀 Workflow Examples

### Complete Business Presentation Workflow

```javascript
// 1. Create the deck
await mcp.callTool('create_deck', {
  title: 'Q4 2024 Business Review',
  theme: 'hatch-corporate',
  outputPath: './q4-review',
  options: {
    pythonIntegration: true,
    includeInteractiveComponents: true
  }
});

// 2. Add executive summary slide
await mcp.callTool('create_slide', {
  deckPath: './q4-review',
  slideType: 'content',
  content: {
    title: 'Executive Summary',
    body: `
      ## Key Achievements
      - Revenue grew 25% YoY to $125M
      - Expanded to 3 new markets
      - Customer satisfaction up 15%
      
      ## Strategic Priorities
      - Market expansion
      - Digital transformation
      - Sustainability initiatives
    `
  }
});

// 3. Generate revenue chart
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [95, 105, 115, 125]
  },
  outputPath: './q4-review',
  styling: {
    title: 'Quarterly Revenue Growth',
    colorScheme: 'hatch'
  }
});

// 4. Add chart slide
await mcp.callTool('create_slide', {
  deckPath: './q4-review',
  slideType: 'chart',
  content: {
    title: 'Revenue Performance',
    body: '![Revenue Chart](./charts/revenue_chart.png)'
  }
});

// 5. Export to multiple formats
await mcp.callTool('export_deck', {
  deckPath: './q4-review',
  format: 'pdf',
  outputPath: './exports/q4-review.pdf'
});

await mcp.callTool('export_deck', {
  deckPath: './q4-review',
  format: 'spa',
  outputPath: './exports/q4-review-web'
});
```

### Technical Documentation Workflow

```javascript
// 1. Create technical presentation
await mcp.callTool('create_deck', {
  title: 'System Architecture Review',
  theme: 'hatch-technical',
  outputPath: './tech-review'
});

// 2. Add architecture diagram
await mcp.callTool('create_slide', {
  deckPath: './tech-review',
  slideType: 'image',
  content: {
    title: 'System Architecture',
    imageUrl: './diagrams/architecture.png',
    body: 'Microservices architecture with event-driven communication'
  }
});

// 3. Add two-column comparison
await mcp.callTool('create_slide', {
  deckPath: './tech-review',
  slideType: 'two-column',
  content: {
    title: 'Current vs. Proposed',
    leftColumn: `
      ## Current System
      - Monolithic architecture
      - Single database
      - Manual deployments
    `,
    rightColumn: `
      ## Proposed System
      - Microservices
      - Database per service
      - CI/CD pipeline
    `
  }
});
```

---

## 📊 Error Handling

### Common Errors and Solutions

#### Theme Not Found
```javascript
// Error: Theme 'custom-theme' not found
// Solution: Use available theme or create custom theme
await mcp.callTool('apply_theme', {
  deckPath: './presentation',
  theme: 'hatch-corporate'  // Use existing theme
});
```

#### Python Dependencies Missing
```bash
# Error: ModuleNotFoundError: No module named 'matplotlib'
# Solution: Install Python dependencies
cd presentation/python
pip install -r requirements.txt
```

#### Invalid Chart Data
```javascript
// Error: Chart data format invalid
// Solution: Ensure data structure matches chart type
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['A', 'B', 'C'],  // Required for bar charts
    values: [1, 2, 3]         // Required for bar charts
  }
});
```

### Debug Mode

Enable verbose logging:
```javascript
// Set debug mode in MCP client
process.env.SLIDEV_DEBUG = 'true';
```

---

## 🔄 Best Practices

### 1. Presentation Structure
- Start with cover slide (auto-generated)
- Include agenda/outline slide
- Use consistent slide types within sections
- End with closing slide (auto-generated)

### 2. Content Guidelines
- Keep slide titles concise (< 8 words)
- Use bullet points for key information
- Limit to 6-8 bullet points per slide
- Include visual elements (charts, images)

### 3. Theme Consistency
- Choose one theme per presentation
- Use theme colors for charts and graphics
- Maintain consistent font usage
- Follow brand guidelines

### 4. Performance Optimization
- Optimize images (< 1MB per image)
- Use efficient chart types for data
- Minimize custom CSS
- Test export performance

### 5. Collaboration
- Use individual slide files for team editing
- Version control with Git
- Document slide purposes in README
- Use consistent naming conventions

---

## 📞 Support

### Documentation
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Examples**: [examples/](./examples/)
- **API Reference**: This document

### Community
- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
- **Wiki**: Community-maintained documentation

### Hatch Support
- **Internal Teams**: Contact Digital Innovation team
- **External Users**: GitHub issues or documentation

---

*This documentation covers all available tools and features in the Slidev Builder MCP. For the latest updates, see the [GitHub repository](https://github.com/hatch-ltd/slidev-builder-mcp).*
