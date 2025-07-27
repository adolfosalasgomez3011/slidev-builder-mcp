# Example: Creating a Business Review Presentation

This example demonstrates how to use the Slidev Builder MCP to create a comprehensive business review presentation.

## Step 1: Create the Initial Deck

```javascript
// Create a new executive summary presentation
const deckResult = await mcp.callTool('create_deck', {
  title: 'Q4 2024 Business Review',
  template: 'executive-summary',
  theme: 'hatch-corporate',
  outputPath: './presentations/q4-2024-review',
  options: {
    includeInteractiveComponents: true,
    pythonIntegration: true,
    customCSS: `
      .highlight-metric {
        background: linear-gradient(135deg, #00A651, #FFB800);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 166, 81, 0.3);
      }
    `
  }
});
```

## Step 2: Add Executive Summary Slide

```javascript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'content',
  content: {
    title: 'Executive Summary',
    body: `
<div class="grid grid-cols-2 gap-8">
  <div>
    <h3 class="text-2xl font-bold mb-4 text-hatch-primary">Key Achievements</h3>
    <ul class="space-y-3">
      <li>🚀 Revenue grew <strong>25% YoY</strong> to $125M</li>
      <li>🌍 Expanded to <strong>3 new markets</strong> (APAC, LATAM)</li>
      <li>😊 Customer satisfaction up <strong>15%</strong> to 94%</li>
      <li>⚡ Launched <strong>2 major products</strong> ahead of schedule</li>
      <li>👥 Team grew by <strong>40%</strong> with top talent</li>
    </ul>
  </div>
  <div>
    <h3 class="text-2xl font-bold mb-4 text-hatch-primary">Strategic Priorities</h3>
    <div class="space-y-4">
      <div class="border-l-4 border-hatch-primary pl-4">
        <h4 class="font-bold">Market Expansion</h4>
        <p class="text-sm text-gray-600">Accelerate growth in emerging markets</p>
      </div>
      <div class="border-l-4 border-hatch-secondary pl-4">
        <h4 class="font-bold">Digital Transformation</h4>
        <p class="text-sm text-gray-600">Modernize core systems and processes</p>
      </div>
      <div class="border-l-4 border-hatch-accent pl-4">
        <h4 class="font-bold">Sustainability</h4>
        <p class="text-sm text-gray-600">Achieve carbon neutral operations by 2025</p>
      </div>
    </div>
  </div>
</div>
    `
  }
});
```

## Step 3: Generate Revenue Growth Chart

```javascript
await mcp.callTool('generate_chart', {
  chartType: 'bar',
  data: {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    values: [95, 105, 115, 125],
    datasets: [{
      label: 'Revenue ($M)',
      data: [95, 105, 115, 125],
      backgroundColor: ['#00A651', '#00A651', '#00A651', '#FFB800'],
      borderColor: '#004225',
      borderWidth: 2
    }]
  },
  outputPath: './presentations/q4-2024-review',
  styling: {
    title: 'Quarterly Revenue Growth',
    colorScheme: 'hatch',
    width: 800,
    height: 400,
    theme: 'corporate'
  }
});
```

## Step 4: Add Chart to Slide

```javascript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'chart',
  content: {
    title: 'Revenue Performance',
    chartPath: '/charts/chart_[generated_id].png',
    caption: 'Strong Q4 performance driven by new market expansion'
  }
});
```

## Step 5: Apply Custom Theme

```javascript
await mcp.callTool('apply_theme', {
  deckPath: './presentations/q4-2024-review',
  theme: 'hatch-corporate',
  customizations: {
    primaryColor: '#00A651',
    secondaryColor: '#004225',
    fontFamily: 'Inter',
    customCSS: `
      .metric-card {
        background: rgba(0, 166, 81, 0.1);
        border: 2px solid #00A651;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
      }
      
      .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #00A651;
      }
      
      .growth-indicator {
        color: #FFB800;
        font-weight: bold;
      }
    `
  }
});
```

## Step 6: Export Presentation

```javascript
// Export to multiple formats
await mcp.callTool('export_deck', {
  deckPath: './presentations/q4-2024-review',
  outputFormat: 'pdf',
  exportOptions: {
    includeNotes: true,
    quality: 'high'
  }
});

await mcp.callTool('export_deck', {
  deckPath: './presentations/q4-2024-review',
  outputFormat: 'pptx',
  exportOptions: {
    includeAnimations: false,
    template: 'hatch-corporate'
  }
});
```

## Complete Example Output

The above sequence creates a professional business review presentation with:

### 🎯 **Auto-Generated Starter Slides**
- **Cover Slide**: Q4 2024 Business Review with Hatch branding
- **Content Slide**: Executive summary with key achievements and strategic priorities
- **Closing Slide**: Thank you slide with contact information

### 📊 **Data Visualization**
- Revenue growth chart with Hatch color scheme
- Custom styling for metrics and KPIs
- Interactive components for engagement

### 🎨 **Professional Styling**
- Hatch corporate theme with brand colors
- Custom CSS for enhanced visuals
- Consistent typography and spacing

### 📁 **File Structure**
```
q4-2024-review/
├── slides.md                 # Main presentation file
├── public/
│   └── charts/
│       ├── chart_[id].png    # Generated revenue chart
│       └── chart_[id].svg    # Vector version
├── python/
│   └── generate_chart.py     # Chart generation script
├── style.css                 # Custom theme styles
└── package.json              # Slidev configuration
```

### 🚀 **Usage**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Export to PDF
npm run export
```

## Key Features Demonstrated

1. **Auto-Generated Starter Slides**: Professional 3-slide foundation
2. **Modular Slide Creation**: Individual .md files for collaboration
3. **Data Visualization**: Python-powered chart generation
4. **Custom Theming**: Hatch brand integration
5. **Export Flexibility**: Multiple output formats
6. **Interactive Components**: Enhanced presentation experience

This example shows how the Slidev Builder MCP enables rapid creation of professional presentations with minimal setup while maintaining full customization capabilities.
