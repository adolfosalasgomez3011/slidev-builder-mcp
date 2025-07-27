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

## Step 4: Add Chart Slide

```javascript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'chart',
  content: {
    title: 'Revenue Performance',
    body: `
<div class="text-center">
  <img src="/charts/chart_${Date.now()}.png" alt="Revenue Growth Chart" class="mx-auto mb-6" />
  
  <div class="grid grid-cols-3 gap-6 mt-8">
    <div class="highlight-metric">
      <div class="text-3xl font-bold">25%</div>
      <div class="text-sm opacity-90">YoY Growth</div>
    </div>
    <div class="highlight-metric">
      <div class="text-3xl font-bold">$125M</div>
      <div class="text-sm opacity-90">Q4 Revenue</div>
    </div>
    <div class="highlight-metric">
      <div class="text-3xl font-bold">$440M</div>
      <div class="text-sm opacity-90">Annual Total</div>
    </div>
  </div>
</div>
    `
  }
});
```

## Step 5: Add Market Analysis with Interactive Components

```javascript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'interactive',
  content: {
    title: 'Market Analysis & Strategic Framework',
    body: `
<div class="grid grid-cols-2 gap-8">
  <div>
    <h3 class="text-xl font-bold mb-4">Market Position</h3>
    <div class="space-y-4">
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="font-medium">Market Share</span>
          <span class="text-2xl font-bold text-hatch-primary">18%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-hatch-primary h-2 rounded-full" style="width: 18%"></div>
        </div>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="font-medium">Customer Retention</span>
          <span class="text-2xl font-bold text-hatch-primary">94%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-hatch-primary h-2 rounded-full" style="width: 94%"></div>
        </div>
      </div>
    </div>
  </div>
  
  <div>
    <h3 class="text-xl font-bold mb-4">Strategic Framework</h3>
    <InteractiveArrows />
  </div>
</div>
    `
  }
});
```

## Step 6: Add Financial Projections

```javascript
// Generate financial projections chart
await mcp.callTool('generate_chart', {
  chartType: 'line',
  data: {
    x: [2023, 2024, 2025, 2026, 2027],
    y: [350, 440, 570, 720, 900],
    datasets: [{
      label: 'Projected Revenue ($M)',
      data: [350, 440, 570, 720, 900],
      borderColor: '#00A651',
      backgroundColor: 'rgba(0, 166, 81, 0.1)',
      tension: 0.4,
      fill: true
    }]
  },
  outputPath: './presentations/q4-2024-review',
  styling: {
    title: '5-Year Revenue Projection',
    width: 900,
    height: 500
  }
});

// Add projections slide
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'content',
  content: {
    title: 'Financial Projections (2025-2027)',
    body: `
<div class="text-center mb-8">
  <img src="/charts/chart_projections.png" alt="5-Year Projections" class="mx-auto" />
</div>

<div class="grid grid-cols-4 gap-4">
  <div class="text-center p-4 bg-gray-50 rounded-lg">
    <div class="text-2xl font-bold text-hatch-primary">$570M</div>
    <div class="text-sm text-gray-600">2025 Target</div>
  </div>
  <div class="text-center p-4 bg-gray-50 rounded-lg">
    <div class="text-2xl font-bold text-hatch-primary">30%</div>
    <div class="text-sm text-gray-600">CAGR 2024-2027</div>
  </div>
  <div class="text-center p-4 bg-gray-50 rounded-lg">
    <div class="text-2xl font-bold text-hatch-primary">$900M</div>
    <div class="text-sm text-gray-600">2027 Projection</div>
  </div>
  <div class="text-center p-4 bg-gray-50 rounded-lg">
    <div class="text-2xl font-bold text-hatch-primary">25%</div>
    <div class="text-sm text-gray-600">Target Margin</div>
  </div>
</div>
    `
  }
});
```

## Step 7: Add Strategic Recommendations

```javascript
await mcp.callTool('create_slide', {
  deckPath: './presentations/q4-2024-review',
  slideType: 'content',
  content: {
    title: 'Strategic Recommendations',
    body: `
<div class="space-y-6">
  <div class="border-l-4 border-hatch-primary pl-6 py-4">
    <h3 class="text-xl font-bold mb-2">1. Accelerate International Expansion</h3>
    <p class="text-gray-700 mb-3">
      Leverage Q4 momentum to establish operations in 5 additional markets by Q3 2025
    </p>
    <ul class="text-sm space-y-1">
      <li>• Priority markets: Southeast Asia, Brazil, Eastern Europe</li>
      <li>• Investment required: $25M over 18 months</li>
      <li>• Expected ROI: 35% by year 3</li>
    </ul>
  </div>
  
  <div class="border-l-4 border-hatch-secondary pl-6 py-4">
    <h3 class="text-xl font-bold mb-2">2. Digital Infrastructure Modernization</h3>
    <p class="text-gray-700 mb-3">
      Upgrade core systems to support 5x scale and improve operational efficiency
    </p>
    <ul class="text-sm space-y-1">
      <li>• Cloud migration completion by Q2 2025</li>
      <li>• AI/ML implementation for predictive analytics</li>
      <li>• Expected cost savings: $15M annually</li>
    </ul>
  </div>
  
  <div class="border-l-4 border-hatch-accent pl-6 py-4">
    <h3 class="text-xl font-bold mb-2">3. Sustainability Initiative</h3>
    <p class="text-gray-700 mb-3">
      Position as industry leader in environmental responsibility
    </p>
    <ul class="text-sm space-y-1">
      <li>• Carbon neutral operations by end of 2025</li>
      <li>• Renewable energy for 80% of facilities</li>
      <li>• Sustainable product line launch Q1 2025</li>
    </ul>
  </div>
</div>
    `
  }
});
```

## Step 8: Apply Hatch Corporate Theme

```javascript
await mcp.callTool('apply_theme', {
  deckPath: './presentations/q4-2024-review',
  theme: 'hatch-corporate',
  customizations: {
    primaryColor: '#00A651',
    secondaryColor: '#004225',
    fontFamily: 'Inter, sans-serif'
  }
});
```

## Step 9: Export the Presentation

```javascript
// Export to PDF for distribution
await mcp.callTool('export_deck', {
  deckPath: './presentations/q4-2024-review',
  format: 'pdf',
  outputPath: './exports/Q4-2024-Business-Review.pdf',
  options: {
    withClicks: true,
    dark: false
  }
});

// Export as web app for interactive viewing
await mcp.callTool('export_deck', {
  deckPath: './presentations/q4-2024-review',
  format: 'spa',
  outputPath: './exports/q4-review-webapp'
});
```

## Final Result

This example creates a professional business review presentation with:

- **Cover slide** with Hatch branding
- **Executive summary** with key achievements and priorities
- **Interactive charts** showing revenue growth
- **Market analysis** with interactive strategic framework
- **Financial projections** with 5-year outlook
- **Strategic recommendations** with actionable insights
- **Professional styling** with Hatch corporate theme

The presentation includes:
- 🎨 Consistent Hatch branding and colors
- 📊 Data visualizations with Python-generated charts
- ⚡ Interactive components for engagement
- 📱 Responsive design for various devices
- 📄 Multiple export formats (PDF, web app)

## Development Commands

```bash
cd ./presentations/q4-2024-review
npm install
npm run dev     # Start development server
npm run build   # Build for production
npm run export  # Export to PDF
```

The presentation will be available at `http://localhost:3030` for live editing and preview.
