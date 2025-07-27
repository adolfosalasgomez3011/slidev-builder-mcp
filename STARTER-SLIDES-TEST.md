# Test: Create Deck with Auto-Generated Starter Slides

This test demonstrates the new functionality where `create_deck` automatically generates 3 starter slides based on the selected theme.

## Test Cases

### 1. Hatch Corporate Theme
```javascript
await mcp.callTool('create_deck', {
  title: 'Q4 Business Review',
  theme: 'hatch-corporate',
  outputPath: './test-hatch-deck'
});
```

**Expected Result:**
- Creates deck with Hatch branding
- Generates 3 starter slides:
  1. **Cover slide** - Green background with Hatch logo and title
  2. **Content slide** - Hatch-styled bullet points and layout
  3. **Closing slide** - Thank you with Hatch contact information
- Creates `slides/` directory with individual slide files
- Each slide uses Hatch colors (#00A651, #004225, #FFB800)

### 2. Default Theme (No Theme Specified)
```javascript
await mcp.callTool('create_deck', {
  title: 'Technical Presentation',
  outputPath: './test-default-deck'
});
```

**Expected Result:**
- Creates deck with default styling
- Generates 3 starter slides:
  1. **Cover slide** - Simple blue-themed title slide
  2. **Content slide** - Basic bullet point layout
  3. **Closing slide** - Generic thank you slide
- Creates `slides/` directory with individual slide files
- Uses default blue color scheme

### 3. Fallback Behavior
```javascript
await mcp.callTool('create_deck', {
  title: 'Custom Presentation',
  theme: 'non-existent-theme',
  outputPath: './test-fallback-deck'
});
```

**Expected Result:**
- Falls back to default theme templates
- Still creates the 3 starter slides
- Uses default styling when theme doesn't exist

## File Structure Created

Each test should create:
```
output-deck/
├── slides.md              # Main Slidev file (monolithic)
├── slides/                 # Individual slide files (modular)
│   ├── 001-cover.md
│   ├── 002-content.md
│   ├── 003-closing.md
│   └── README.md          # Slides index and instructions
├── package.json
└── style.css             # Theme-specific styles
```

## Key Features Tested

1. **Theme-Based Starter Slides** - Different slides for different themes
2. **Variable Replacement** - `{{title}}` and `{{date}}` are properly replaced
3. **Fallback Logic** - Uses default when theme doesn't exist
4. **Modular Structure** - Creates both monolithic and individual slide files
5. **Professional Branding** - Hatch corporate identity in slides

## Benefits Demonstrated

- **Instant Professional Presentations** - No empty deck, ready-to-use starter
- **Theme Consistency** - All slides match the selected theme
- **Modular Editing** - Can edit individual slides without affecting others
- **Easy Customization** - Template variables are replaced automatically

This enhancement makes the MCP immediately useful - every deck created has professional starter content!
