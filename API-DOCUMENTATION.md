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

---

## 🎨 Theme System

### Available Themes

#### Hatch Corporate
- **Primary Color**: #00A651 (Hatch Green)
- **Secondary Color**: #004225 (Dark Green)
- **Accent Color**: #FFB800 (Gold)
- **Use Case**: Client presentations, board meetings, executive summaries

---

## 🔧 Advanced Features

### Auto-Generated Starter Slides
Every presentation automatically includes 3 professional starter slides:

1. **Cover Slide** - Theme-specific title slide with branding
2. **Content Slide** - Template slide ready for customization
3. **Closing Slide** - Professional thank you slide

### Modular Slide Architecture
Slides are created as individual `.md` files for:
- Better collaboration
- Version control
- Selective editing
- Easier maintenance

---

*For complete documentation, examples, and troubleshooting, see the full API reference.*