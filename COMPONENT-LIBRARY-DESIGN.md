# Component Library System Design

## 🚀 New MCP Tools

### 1. `create_component` - Component Scaffolding
```typescript
interface CreateComponentArgs {
  name: string;                    // 'interactive-arrows'
  category: 'charts' | 'shapes' | 'layouts' | 'interactions';
  author: string;                  // 'Adolfo Salas'
  description: string;
  parameters: ComponentParameter[];
  scope: 'hatch' | 'community';   // Internal vs public
}
```

### 2. `add_component` - Add Component to Slide
```typescript
interface AddComponentArgs {
  deckPath: string;
  slideNumber: number;
  componentName: string;           // 'hatch/interactive-arrows'
  parameters: {
    from: string;                  // 'Market Analysis'
    to: string;                    // 'Strategic Recommendations'
    confidence: number;            // 0.85
    style: 'corporate' | 'minimal';
    data?: any;                    // Dynamic data binding
  };
  position: { x: number, y: number };
}
```

### 3. `list_components` - Browse Component Library
```typescript
interface ListComponentsArgs {
  category?: string;               // Filter by category
  scope?: 'hatch' | 'community' | 'all';
  search?: string;                 // Search by keyword
  author?: string;                 // Filter by creator
}
```

### 4. `install_component` - Install from Registry
```typescript
interface InstallComponentArgs {
  componentName: string;           // 'hatch/financial-charts'
  version?: string;                // '1.2.0' or 'latest'
  scope: 'global' | 'project';    // Install globally or per-project
}
```

### 5. `publish_component` - Share with Team
```typescript
interface PublishComponentArgs {
  componentPath: string;
  scope: 'hatch' | 'community';
  version: string;
  releaseNotes?: string;
}
```

## 📋 Component Registry Structure

```json
{
  "components": {
    "hatch/interactive-arrows": {
      "version": "1.2.0",
      "author": "Adolfo Salas",
      "description": "Interactive consulting arrows with confidence indicators",
      "category": "interactions",
      "tags": ["consulting", "flow", "decision"],
      "parameters": {
        "from": { "type": "string", "required": true },
        "to": { "type": "string", "required": true },
        "confidence": { "type": "number", "min": 0, "max": 1, "default": 0.8 },
        "style": { "type": "enum", "options": ["corporate", "minimal", "technical"] }
      },
      "dependencies": ["vue-3", "d3"],
      "examples": ["basic-arrow.md", "multi-step-flow.md"],
      "downloads": 156,
      "rating": 4.8
    },
    "hatch/financial-charts": {
      "version": "2.1.0",
      "author": "Hatch Analytics Team",
      "description": "Professional financial charts with Hatch branding",
      "category": "charts",
      "tags": ["finance", "data", "visualization"],
      "parameters": {
        "data": { "type": "array", "required": true },
        "chartType": { "type": "enum", "options": ["waterfall", "variance", "trend"] },
        "currency": { "type": "string", "default": "USD" },
        "showProjections": { "type": "boolean", "default": false }
      }
    }
  }
}
```

## 🏢 Hatch Internal Component Categories

### 📊 **Data & Analytics**
- `hatch/financial-charts` - Revenue, EBITDA, cash flow
- `hatch/kpi-dashboard` - Key metrics displays
- `hatch/variance-analysis` - Budget vs actual
- `hatch/scenario-modeling` - Multiple scenario views

### 🎯 **Strategic Frameworks**
- `hatch/2x2-matrix` - BCG-style matrices
- `hatch/value-chain` - Porter's value chain
- `hatch/pestle-analysis` - PESTLE framework
- `hatch/swot-analysis` - SWOT analysis grid

### 🔄 **Process & Flow**
- `hatch/interactive-arrows` - Decision flows
- `hatch/process-steps` - Step-by-step processes
- `hatch/timeline` - Project timelines
- `hatch/org-chart` - Organizational structures

### 💼 **Consulting Layouts**
- `hatch/executive-summary` - Standard exec summary
- `hatch/recommendation-slide` - Recommendation format
- `hatch/appendix-layout` - Supporting data layout
- `hatch/contact-closer` - Professional closing slide

## 🔄 Component Development Workflow

### For Component Creators:
1. **Scaffold**: `create_component --name=my-component`
2. **Develop**: Build Vue component with parameters
3. **Test**: `test_component --component=my-component`
4. **Publish**: `publish_component --scope=hatch`

### For Component Users:
1. **Discover**: `list_components --category=charts`
2. **Install**: `install_component hatch/financial-charts`
3. **Use**: `add_component --name=financial-charts --data=revenue.json`
4. **Update**: `update_components` (gets latest versions)

## 🌐 Sharing Mechanisms

### Internal Hatch Registry
- Private npm registry for Hatch-specific components
- Version control and approval workflow
- Usage analytics and popularity metrics
- Team collaboration features

### Community Registry
- Public components for open source community
- Contribution guidelines and review process
- Component marketplace with ratings/reviews
- Integration with GitHub for source code

## 💡 Advanced Features

### Component Composition
```typescript
// Combine multiple components
await mcp.callTool('create_composite_slide', {
  components: [
    { name: 'hatch/kpi-dashboard', position: 'top' },
    { name: 'hatch/interactive-arrows', position: 'middle' },
    { name: 'hatch/financial-charts', position: 'bottom' }
  ]
});
```

### Dynamic Data Binding
```typescript
// Components that update with live data
await mcp.callTool('add_component', {
  componentName: 'hatch/revenue-tracker',
  dataSource: 'supabase://quarterly_results',
  refreshInterval: '1h'
});
```

### Real-time Collaboration
- Multiple team members can contribute components
- Version history and rollback capabilities
- Component usage tracking across teams
- Automated testing and quality assurance

## 🎯 Implementation Phases

### Phase 1: Infrastructure (Week 1)
- Component registry system
- Basic component loading
- `create_component` and `add_component` tools

### Phase 2: Core Components (Week 2)
- Extract your interactive arrows
- Create financial chart library
- Build strategic framework components

### Phase 3: Sharing System (Week 3)
- Hatch internal registry
- Component installation/publishing
- Team collaboration features

### Phase 4: Advanced Features (Week 4)
- Component marketplace
- Dynamic data binding
- Real-time collaboration
- Analytics and insights

## 🏗️ Integration with Existing MCP

### Updated Slidev Builder MCP Structure
```
slidev-builder-mcp/
├── src/
│   ├── index.ts                    # Main MCP server (EXISTING)
│   ├── tools/
│   │   ├── createDeck.ts          # ✅ Auto-starter slides
│   │   ├── createSlide.ts         # ✅ Individual slides  
│   │   ├── exportDeck.ts          # ✅ Multi-format export
│   │   ├── applyTheme.ts          # ✅ Theme customization
│   │   ├── generateChart.ts       # ✅ Python charts
│   │   ├── createComponent.ts     # 🆕 Component scaffolding
│   │   ├── addComponent.ts        # 🆕 Add to slides
│   │   ├── listComponents.ts      # 🆕 Browse library
│   │   ├── installComponent.ts    # 🆕 Install shared
│   │   └── publishComponent.ts    # 🆕 Team sharing
│   ├── components/                # 🆕 Component Registry
│   │   ├── registry.json          # Component catalog
│   │   ├── hatch/                 # Internal components
│   │   │   ├── interactive-arrows/
│   │   │   ├── financial-charts/
│   │   │   ├── strategic-frameworks/
│   │   │   └── consulting-layouts/
│   │   └── community/             # Public components
│   └── schemas/                   # Component validation
├── templates/                     # ✅ Slide templates
├── themes/                        # ✅ Theme system
└── examples/                      # ✅ Usage examples
```

### Enhanced MCP Server Registration
```typescript
// src/index.ts - Updated tool registration
const server = new Server(
  {
    name: 'slidev-builder-mcp',
    version: '2.0.0'  // Version 2.0 with components!
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Existing tools (already implemented)
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ✅ Phase 1 Tools (Already Built)
    { name: 'create_deck', description: 'Create presentation with auto-starter slides' },
    { name: 'create_slide', description: 'Add individual slides to presentation' },
    { name: 'export_deck', description: 'Export to PDF, PPTX, HTML formats' },
    { name: 'apply_theme', description: 'Apply and customize presentation themes' },
    { name: 'generate_chart', description: 'Generate charts with Python integration' },
    
    // 🆕 Phase 2 Tools (Component System)
    { name: 'create_component', description: 'Scaffold new reusable component' },
    { name: 'add_component', description: 'Add component to slide' },
    { name: 'list_components', description: 'Browse available components' },
    { name: 'install_component', description: 'Install component from registry' },
    { name: 'publish_component', description: 'Share component with team' },
  ],
}));
```

### Unified User Experience
Users get **both** basic slide creation AND advanced component features in one MCP:

```bash
# Install the enhanced MCP (includes everything)
npm install -g @hatch/slidev-builder-mcp

# Use basic features
mcp-call create_deck --title="My Presentation"

# Use component features  
mcp-call list_components --scope=hatch
mcp-call add_component --name=hatch/interactive-arrows
```

This creates a **unified, powerful presentation platform** that grows with user needs - from basic slides to sophisticated component-based presentations!

**Benefits of Integration:**
- 🎯 **Single Tool** - Everything in one MCP
- 🔄 **Seamless Workflow** - Components work with existing slides
- 📈 **Progressive Enhancement** - Start simple, add complexity
- 🏢 **Team Adoption** - One tool for all presentation needs
- 🚀 **Competitive Advantage** - Unique component ecosystem

This would create a **competitive advantage** for Hatch - a proprietary library of consulting components that improves productivity and maintains consistency across all presentations!
