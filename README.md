# Slidev Builder MCP

A powerful Model Context Protocol (MCP) server for automated slide deck creation using the Slidev framework, featuring professional Hatch branding, interactive components, and seamless asset integration.

## 🚀 Features

### Core Capabilities
- **🎯 Automated Slide Creation**: Generate professional presentations with simple prompts
- **🎨 Hatch Brand Integration**: Built-in corporate themes and styling
- **📊 Dynamic Charts**: Auto-generate charts from data queries
- **🖼️ Asset Integration**: Fetch icons and images from multiple APIs
- **⚡ Interactive Components**: Drag-and-drop arrows, animations, and more
- **📤 Multi-format Export**: PDF, HTML, and PowerPoint output
- **🔄 Live Preview**: Real-time presentation preview server

### Professional Templates
- **Corporate**: Professional business presentations
- **Executive**: C-level summary formats
- **Technical**: Developer and engineering content
- **Client**: Customer-facing presentations
- **Minimal**: Clean, focused layouts
- **Dashboard**: Data-driven visualizations

## 📦 Installation

### Global Installation
```bash
npm install -g @hatch/slidev-builder-mcp
```

### Local Development
```bash
git clone https://github.com/hatch-ltd/slidev-builder-mcp.git
cd slidev-builder-mcp
npm install
npm run build
```

## � Complete Documentation

### Essential Guides
- **[📋 Installation Guide](./INSTALLATION-GUIDE.md)** - Complete setup instructions for all platforms and MCP clients
- **[📖 API Documentation](./API-DOCUMENTATION.md)** - Detailed reference for all tools, parameters, and examples  
- **[⚡ Quick Start](./QUICKSTART.md)** - Get up and running with your first presentation in 5 minutes
- **[🔧 Troubleshooting](./TROUBLESHOOTING.md)** - Solutions for common issues and debugging guides

### Examples and Testing
- **[💼 Business Review Example](./examples/business-review-example.md)** - Complete workflow creating a professional business presentation
- **[🧪 Starter Slides Test](./STARTER-SLIDES-TEST.md)** - Testing the auto-generated starter slides feature
- **[✅ Distribution Checklist](./DISTRIBUTION-CHECKLIST.md)** - Production readiness and publication guide

### Key Features Overview
- **🎬 Auto-Generated Starter Slides** - Every deck automatically includes 3 professional starter slides
- **🧩 Modular Slide Architecture** - Individual `.md` files for each slide enable better collaboration  
- **🎨 Professional Templates** - Executive, technical, and business presentation templates
- **📊 Python Chart Integration** - Dynamic data visualizations with matplotlib/plotly and Hatch styling
- **🎯 Hatch Corporate Branding** - Authentic professional themes with Hatch colors and styling
- **⚡ Interactive Vue Components** - Engaging presentations with modern web components
- **📱 Responsive Design** - Mobile-friendly presentations that work on any device
- **🔄 Live Preview Server** - Real-time editing with instant preview
- **📄 Multiple Export Formats** - PDF, HTML, PowerPoint, and standalone web applications
- **🛠️ Type-Safe Development** - Full TypeScript support with comprehensive type definitions

## �🔧 Configuration

### MCP Client Setup
Add to your MCP client configuration:

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

### Claude Desktop Integration
Add to `claude_desktop_config.json`:

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

## 🛠️ Available Tools

### Core Tools

#### `create_presentation`
Create a new Slidev presentation with Hatch branding.

```typescript
{
  title: string;
  template?: 'hatch-corporate' | 'hatch-executive' | 'hatch-technical';
  data_sources?: string[];
}
```

#### `add_slide` 
Add slides with different layouts and content types.

```typescript
{
  presentation_id: string;
  slide_type: 'title' | 'content' | 'chart' | 'image' | 'two-cols';
  content: {
    title?: string;
    subtitle?: string;
    body?: string;
    image_url?: string;
    chart_type?: string;
    data_query?: string;
  };
  styling?: {
    layout?: string;
    background?: string;
    text_color?: string;
  };
}
```

#### `generate_chart`
Create data visualizations with Hatch styling.

```typescript
{
  chart_type: 'bar' | 'line' | 'pie' | 'scatter';
  data_query: string;
  styling?: {
    title?: string;
    colors?: string[];
    size?: { width: number; height: number; };
  };
}
```

#### `apply_master_slide`
Apply professional templates to presentations.

```typescript
{
  presentation_id: string;
  master_slide_id: 'corporate' | 'executive' | 'technical' | 'client' | 'minimal' | 'dashboard';
  slide_data?: {
    presentation_title?: string;
    presentation_subtitle?: string;
    date?: string;
    project_code?: string;
    client_logo_url?: string;
  };
}
```

### Asset & Integration Tools

#### `fetch_assets`
Get icons and images from configured APIs.

```typescript
{
  type: 'icons' | 'images';
  query: string;
  count?: number;
  style?: 'modern' | 'minimal' | 'corporate';
  color?: string;
}
```

#### `configure_api_service`
Set up third-party integrations on-demand.

```typescript
{
  service: 'freepik' | 'nounproject' | 'unsplash';
  api_key: string;
  temporary?: boolean;
  additional_config?: object;
}
```

#### `generate_ai_content`
Create slide content using AI services.

```typescript
{
  prompt: string;
  content_type: 'title' | 'bullet_points' | 'paragraph' | 'summary';
  tone?: 'professional' | 'casual' | 'technical' | 'executive';
  length?: 'short' | 'medium' | 'long';
  service?: 'openai' | 'anthropic';
}
```

### Export & Preview Tools

#### `export_presentation`
Export to multiple formats.

```typescript
{
  presentation_id: string;
  format?: 'pdf' | 'html' | 'pptx';
  options?: {
    share_link?: boolean;
    email?: string;
  };
}
```

#### `preview_presentation`
Start development server for live preview.

```typescript
{
  presentation_id: string;
}
```

### Configuration Tools

#### `get_brand_config`
Retrieve Hatch brand guidelines and colors.

#### `get_master_slides`
List available templates and their features.

#### `generate_master_slide_theme`
Create custom CSS themes for presentations.

#### `list_available_services`
View configured and available API integrations.

## 🎨 Hatch Brand Integration

### Color Palette
- **Primary**: `#00A651` (Hatch Green)
- **Secondary**: `#004225` (Dark Green)
- **Accent**: `#FFB800` (Hatch Yellow)
- **Background**: `#FFFFFF` (White)
- **Text**: `#333333` (Dark Gray)

### Typography
- **Primary Font**: Inter (Sans-serif)
- **Serif Font**: Georgia
- **Monospace**: Fira Code

### Template Features
- Professional layouts optimized for business use
- Consistent brand application across all slides
- Responsive design for different screen sizes
- Built-in animations and transitions
- Corporate footer with logo and project details

## 📊 Example Usage

### Creating a Business Presentation

```typescript
// 1. Create presentation
await createPresentation({
  title: "Q4 Business Review",
  template: "hatch-corporate"
});

// 2. Add executive summary
await addSlide({
  presentation_id: "abc123",
  slide_type: "content",
  content: {
    title: "Executive Summary",
    body: "- Revenue up 15% YoY\n- Cost optimization achieved\n- Market expansion successful"
  }
});

// 3. Generate data chart
await generateChart({
  chart_type: "bar",
  data_query: "SELECT quarter, revenue FROM financials WHERE year = 2024",
  styling: {
    title: "Quarterly Revenue Performance"
  }
});

// 4. Export to PDF
await exportPresentation({
  presentation_id: "abc123",
  format: "pdf",
  options: { share_link: true }
});
```

### AI-Powered Content Generation

```typescript
// Generate slide content with AI
await generateAiContent({
  prompt: "Create bullet points about renewable energy market trends",
  content_type: "bullet_points",
  tone: "professional",
  length: "medium"
});
```

### Dynamic Asset Integration

```typescript
// Fetch corporate icons
await fetchAssets({
  type: "icons",
  query: "business strategy",
  count: 5,
  style: "corporate",
  color: "primary"
});
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- TypeScript 5+
- Slidev CLI

### Local Setup
```bash
# Clone repository
git clone https://github.com/hatch-ltd/slidev-builder-mcp.git
cd slidev-builder-mcp

# Install dependencies
npm install

# Build project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

### Project Structure
```
slidev-builder-mcp/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   ├── bin.ts            # CLI entry point
│   └── types.ts          # TypeScript definitions
├── templates/            # Slidev presentation templates
│   ├── hatch-corporate.md
│   ├── hatch-executive.md
│   └── hatch-technical.md
├── themes/               # Custom Slidev themes
│   └── hatch-corporate/
│       ├── package.json
│       └── styles/
├── dist/                 # Compiled JavaScript
├── package.json
└── README.md
```

## 🚀 Deployment

### NPM Publishing
```bash
npm run build
npm publish
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new functionality
- Update documentation for API changes
- Maintain consistent code style with ESLint
- Test with multiple MCP clients

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About Hatch

Hatch is a global engineering and consulting company that delivers innovative solutions for the mining, energy, and infrastructure sectors. This MCP server embodies our commitment to engineering excellence and digital transformation.

**Engineering a better world** through innovative presentation technology.

---

For support, contact the Hatch Digital Innovation team or open an issue on GitHub.
