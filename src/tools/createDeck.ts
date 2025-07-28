import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CreateDeckArgs {
  title: string;
  template?: string;
  theme?: string;
  outputPath: string;
  options?: {
    includeInteractiveComponents?: boolean;
    pythonIntegration?: boolean;
    customCSS?: string;
  };
}

export async function createDeck(args: CreateDeckArgs) {
  const { 
    title, 
    template = 'executive-summary', 
    theme = 'hatch-corporate', 
    outputPath,
    options = {}
  } = args;

  try {
    // Ensure output directory exists
    await fs.ensureDir(outputPath);

    // Load template configuration
    const templatePath = path.join(__dirname, '..', 'templates', 'decks', `${template}.json`);
    let templateConfig = {};
    
    if (await fs.pathExists(templatePath)) {
      templateConfig = await fs.readJson(templatePath);
    }

    // Create base frontmatter
    const frontmatter = {
      theme: theme,
      background: '#ffffff',
      class: 'text-center',
      highlighter: 'shiki',
      lineNumbers: false,
      info: false,
      drawings: {
        enabled: true,
        persist: false,
        presenterOnly: false,
        syncAll: true
      },
      transition: 'slide-left',
      title: title,
      mdc: true,
      colorSchema: 'auto',
      routerMode: 'history',
      aspectRatio: '16/9',
      canvasWidth: 1280,
      fonts: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
        mono: ['Fira Code', 'ui-monospace']
      },
      ...templateConfig
    };

    // Create initial slide content using modular slide imports
    const slidesContent = await createModularSlideContent(title, theme, outputPath);

    // Create the slides.md file
    const fullContent = `---
${yaml.stringify(frontmatter)}---

${slidesContent}`;

    const slidesPath = path.join(outputPath, 'slides.md');
    await fs.writeFile(slidesPath, fullContent);

    // Individual slide files are created within createModularSlideContent function

    // Create package.json
    const packageJson = {
      name: `slidev-${title.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'module',
      scripts: {
        build: 'slidev build',
        dev: 'slidev --open',
        export: 'slidev export'
      },
      devDependencies: {
        '@slidev/cli': '^0.49.0',
        '@slidev/theme-default': 'latest'
      }
    };

    await fs.writeFile(
      path.join(outputPath, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );

    // Copy theme files if custom theme
    if (theme.startsWith('hatch-')) {
      await copyThemeFiles(theme, outputPath);
    }

    // Create Python integration setup if requested
    if (options.pythonIntegration) {
      await setupPythonIntegration(outputPath);
    }

    // Create custom CSS file if provided
    if (options.customCSS) {
      const cssPath = path.join(outputPath, 'style.css');
      await fs.writeFile(cssPath, options.customCSS);
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully created Slidev presentation: "${title}"\n\n` +
                `📁 Output Directory: ${outputPath}\n` +
                `📋 Template: ${template}\n` +
                `🎨 Theme: ${theme}\n` +
                `⚡ Interactive Components: ${options.includeInteractiveComponents ? 'Enabled' : 'Disabled'}\n` +
                `🐍 Python Integration: ${options.pythonIntegration ? 'Enabled' : 'Disabled'}\n\n` +
                `🚀 To start development:\n` +
                `   cd "${outputPath}"\n` +
                `   npm install\n` +
                `   npm run dev`
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to create deck: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function createExecutiveSummarySlides(title: string): Promise<string> {
  return `---
layout: default
---

# Executive Summary

<div class="grid grid-cols-2 gap-8 mt-8">
  <div>
    <h2 class="text-2xl font-bold mb-4">Key Highlights</h2>
    <ul class="space-y-2">
      <li>• Strategic initiative overview</li>
      <li>• Market opportunity assessment</li>
      <li>• Financial projections</li>
      <li>• Implementation roadmap</li>
    </ul>
  </div>
  <div>
    <h2 class="text-2xl font-bold mb-4">Success Metrics</h2>
    <ul class="space-y-2">
      <li>• Revenue growth targets</li>
      <li>• Cost optimization goals</li>
      <li>• Risk mitigation measures</li>
      <li>• Timeline milestones</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Market Analysis

<div class="text-center">
  <div class="mb-8">
    <h2 class="text-3xl font-bold mb-4">Market Size</h2>
    <div class="text-6xl font-bold text-hatch-primary">$XX.XB</div>
    <div class="text-lg text-gray-600">Total Addressable Market</div>
  </div>
  
  <div class="grid grid-cols-3 gap-4 mt-8">
    <div class="bg-gray-100 p-4 rounded">
      <div class="text-2xl font-bold text-hatch-primary">XX%</div>
      <div class="text-sm">Growth Rate</div>
    </div>
    <div class="bg-gray-100 p-4 rounded">
      <div class="text-2xl font-bold text-hatch-primary">XX%</div>
      <div class="text-sm">Market Share</div>
    </div>
    <div class="bg-gray-100 p-4 rounded">
      <div class="text-2xl font-bold text-hatch-primary">XX</div>
      <div class="text-sm">Competitors</div>
    </div>
  </div>
</div>

---
layout: default
---

# Recommendations

<div class="space-y-6">
  <div class="border-l-4 border-hatch-primary pl-4">
    <h3 class="text-xl font-bold">1. Immediate Actions</h3>
    <p class="text-gray-600">Critical steps to initiate within the next 30 days</p>
  </div>
  
  <div class="border-l-4 border-hatch-secondary pl-4">
    <h3 class="text-xl font-bold">2. Short-term Strategy</h3>
    <p class="text-gray-600">Strategic initiatives for the next 3-6 months</p>
  </div>
  
  <div class="border-l-4 border-hatch-accent pl-4">
    <h3 class="text-xl font-bold">3. Long-term Vision</h3>
    <p class="text-gray-600">Sustainable growth plans for 12+ months</p>
  </div>
</div>

---

`;
}

async function createTechnicalReviewSlides(title: string): Promise<string> {
  return `---
layout: default
---

# Technical Architecture

<div class="grid grid-cols-2 gap-8">
  <div>
    <h2 class="text-2xl font-bold mb-4">System Components</h2>
    <ul class="space-y-2">
      <li>• Frontend Applications</li>
      <li>• Backend Services</li>
      <li>• Database Layer</li>
      <li>• Integration Points</li>
    </ul>
  </div>
  <div>
    <h2 class="text-2xl font-bold mb-4">Technology Stack</h2>
    <ul class="space-y-2">
      <li>• Programming Languages</li>
      <li>• Frameworks & Libraries</li>
      <li>• Infrastructure & DevOps</li>
      <li>• Security & Monitoring</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Performance Metrics

<div class="grid grid-cols-2 gap-8">
  <div class="text-center">
    <div class="text-4xl font-bold text-hatch-primary mb-2">99.9%</div>
    <div class="text-lg">System Uptime</div>
  </div>
  <div class="text-center">
    <div class="text-4xl font-bold text-hatch-primary mb-2">&lt;100ms</div>
    <div class="text-lg">Response Time</div>
  </div>
</div>

---

`;
}

async function createBusinessProposalSlides(title: string): Promise<string> {
  return `---
layout: default
---

# Business Opportunity

<div class="space-y-6">
  <div class="bg-hatch-primary/10 p-6 rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Problem Statement</h2>
    <p class="text-gray-700">Current challenges and market gaps that need addressing</p>
  </div>
  
  <div class="bg-hatch-secondary/10 p-6 rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Proposed Solution</h2>
    <p class="text-gray-700">Our comprehensive approach to solving these challenges</p>
  </div>
</div>

---
layout: center
---

# Financial Projections

<div class="grid grid-cols-3 gap-6">
  <div class="text-center">
    <div class="text-3xl font-bold text-hatch-primary mb-2">Year 1</div>
    <div class="text-xl">$X.XM</div>
    <div class="text-sm text-gray-600">Revenue</div>
  </div>
  <div class="text-center">
    <div class="text-3xl font-bold text-hatch-primary mb-2">Year 2</div>
    <div class="text-xl">$X.XM</div>
    <div class="text-sm text-gray-600">Revenue</div>
  </div>
  <div class="text-center">
    <div class="text-3xl font-bold text-hatch-primary mb-2">Year 3</div>
    <div class="text-xl">$X.XM</div>
    <div class="text-sm text-gray-600">Revenue</div>
  </div>
</div>

---

`;
}

async function addInteractiveComponents(): Promise<string> {
  return `---
layout: default
---

# Interactive Elements

<InteractiveArrows />

<script setup>
import { ref, onMounted } from 'vue'

// Interactive Arrows Component
const InteractiveArrows = {
  template: \`
    <div class="interactive-arrows-container" style="position: relative; height: 400px; background: #f9f9f9; border-radius: 8px;">
      <div 
        v-for="(arrow, index) in arrows" 
        :key="index"
        :style="getArrowStyle(arrow)"
        class="interactive-arrow"
        @mousedown="startDrag($event, index)"
      >
        <svg width="100" height="20" viewBox="0 0 100 20">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#00A651" />
            </marker>
          </defs>
          <line x1="0" y1="10" x2="90" y2="10" stroke="#00A651" stroke-width="2" marker-end="url(#arrowhead)" />
        </svg>
        <div class="arrow-controls">
          <button @click="rotateArrow(index, -15)">⟲</button>
          <button @click="rotateArrow(index, 15)">⟳</button>
          <button @click="removeArrow(index)">✕</button>
        </div>
      </div>
      <button @click="addArrow" class="add-arrow-btn">+ Add Arrow</button>
    </div>
  \`,
  setup() {
    const arrows = ref([
      { x: 50, y: 50, rotation: 0, width: 100, height: 20 }
    ])
    
    const dragging = ref(null)
    
    onMounted(() => {
      // Load saved arrows from localStorage
      const saved = localStorage.getItem('slidev-arrows')
      if (saved) {
        arrows.value = JSON.parse(saved)
      }
    })
    
    const saveArrows = () => {
      localStorage.setItem('slidev-arrows', JSON.stringify(arrows.value))
    }
    
    const getArrowStyle = (arrow) => ({
      position: 'absolute',
      left: arrow.x + 'px',
      top: arrow.y + 'px',
      transform: \`rotate(\${arrow.rotation}deg)\`,
      cursor: 'move',
      zIndex: 10
    })
    
    const startDrag = (event, index) => {
      dragging.value = { index, offsetX: event.offsetX, offsetY: event.offsetY }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    
    const onMouseMove = (event) => {
      if (!dragging.value) return
      const rect = event.target.closest('.interactive-arrows-container').getBoundingClientRect()
      arrows.value[dragging.value.index].x = event.clientX - rect.left - dragging.value.offsetX
      arrows.value[dragging.value.index].y = event.clientY - rect.top - dragging.value.offsetY
    }
    
    const onMouseUp = () => {
      dragging.value = null
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      saveArrows()
    }
    
    const rotateArrow = (index, degrees) => {
      arrows.value[index].rotation += degrees
      saveArrows()
    }
    
    const addArrow = () => {
      arrows.value.push({
        x: Math.random() * 300 + 50,
        y: Math.random() * 200 + 50,
        rotation: 0,
        width: 100,
        height: 20
      })
      saveArrows()
    }
    
    const removeArrow = (index) => {
      arrows.value.splice(index, 1)
      saveArrows()
    }
    
    return {
      arrows,
      getArrowStyle,
      startDrag,
      rotateArrow,
      addArrow,
      removeArrow
    }
  }
}
</script>

<style>
.interactive-arrow {
  user-select: none;
}

.arrow-controls {
  position: absolute;
  top: -30px;
  left: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.interactive-arrow:hover .arrow-controls {
  opacity: 1;
}

.arrow-controls button {
  background: #00A651;
  color: white;
  border: none;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.add-arrow-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #00A651;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>

---

`;
}

async function copyThemeFiles(theme: string, outputPath: string): Promise<void> {
  const themePath = path.join(__dirname, '..', 'templates', 'styles', theme);
  const outputThemePath = path.join(outputPath, 'themes', theme);
  
  if (await fs.pathExists(themePath)) {
    await fs.copy(themePath, outputThemePath);
  }
}

async function setupPythonIntegration(outputPath: string): Promise<void> {
  // Create Python directory structure
  const pythonDir = path.join(outputPath, 'python');
  await fs.ensureDir(pythonDir);
  
  // Create requirements.txt
  const requirements = `matplotlib==3.7.2
pandas==2.0.3
numpy==1.24.3
seaborn==0.12.2
plotly==5.15.0
jupyter==1.0.0`;
  
  await fs.writeFile(path.join(pythonDir, 'requirements.txt'), requirements);
  
  // Create chart generation script
  const chartScript = `#!/usr/bin/env python3
"""
Chart generation utilities for Slidev presentations
"""
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from pathlib import Path
import json

class SlidevChartGenerator:
    def __init__(self, output_dir="./public/charts"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Set Hatch brand colors
        self.hatch_colors = {
            'primary': '#00A651',
            'secondary': '#004225',
            'accent': '#FFB800',
            'gray': '#6B7280'
        }
        
        # Configure matplotlib style
        plt.style.use('seaborn-v0_8')
        sns.set_palette([self.hatch_colors['primary'], 
                        self.hatch_colors['secondary'], 
                        self.hatch_colors['accent']])
    
    def generate_bar_chart(self, data, title, filename):
        """Generate a bar chart with Hatch styling"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        bars = ax.bar(data['labels'], data['values'], 
                     color=self.hatch_colors['primary'])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_ylabel('Values')
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.1f}', ha='center', va='bottom')
        
        plt.tight_layout()
        plt.savefig(self.output_dir / f"{filename}.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        return f"/charts/{filename}.png"
    
    def generate_line_chart(self, data, title, filename):
        """Generate a line chart with Hatch styling"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        ax.plot(data['x'], data['y'], 
               color=self.hatch_colors['primary'], 
               linewidth=3, marker='o', markersize=8)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('X Values')
        ax.set_ylabel('Y Values')
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(self.output_dir / f"{filename}.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        return f"/charts/{filename}.png"
    
    def generate_plotly_chart(self, chart_type, data, title, filename):
        """Generate interactive Plotly charts"""
        if chart_type == 'bar':
            fig = go.Figure(data=[
                go.Bar(x=data['labels'], y=data['values'],
                      marker_color=self.hatch_colors['primary'])
            ])
        elif chart_type == 'line':
            fig = go.Figure(data=[
                go.Scatter(x=data['x'], y=data['y'],
                          mode='lines+markers',
                          line=dict(color=self.hatch_colors['primary'], width=3),
                          marker=dict(size=8))
            ])
        
        fig.update_layout(
            title=title,
            title_font_size=16,
            template='plotly_white'
        )
        
        fig.write_html(self.output_dir / f"{filename}.html")
        return f"/charts/{filename}.html"

if __name__ == "__main__":
    generator = SlidevChartGenerator()
    
    # Example usage
    sample_data = {
        'labels': ['Q1', 'Q2', 'Q3', 'Q4'],
        'values': [100, 120, 140, 160]
    }
    
    chart_path = generator.generate_bar_chart(
        sample_data, 
        'Quarterly Revenue Growth', 
        'revenue_growth'
    )
    
    print(f"Chart generated: {chart_path}")
`;
  
  await fs.writeFile(path.join(pythonDir, 'chart_generator.py'), chartScript);
  
  // Create a simple example notebook
  const notebookContent = {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: ["# Slidev Chart Generation Example\n\nThis notebook demonstrates how to generate charts for your Slidev presentation."]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["from chart_generator import SlidevChartGenerator\nimport pandas as pd\n\n# Initialize chart generator\ngenerator = SlidevChartGenerator()"]
      }
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      }
    },
    nbformat: 4,
    nbformat_minor: 4
  };
  
  await fs.writeFile(
    path.join(pythonDir, 'chart_examples.ipynb'), 
    JSON.stringify(notebookContent, null, 2)
  );
}

/**
 * Create starter slides content based on theme
 */
async function createStarterSlides(title: string, theme: string): Promise<string> {
  const slideTheme = theme || 'default';
  const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'slides', slideTheme);
  
  // Check if theme-specific templates exist, fallback to default
  const themeDir = await fs.pathExists(templatesDir) ? templatesDir : 
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'slides', 'default');

  let slidesContent = '';
  const currentDate = new Date().toLocaleDateString();

  // Read and process each starter slide
  const slideFiles = ['001-cover.md', '002-content.md', '003-closing.md'];
  
  for (const slideFile of slideFiles) {
    const slidePath = path.join(themeDir, slideFile);
    if (await fs.pathExists(slidePath)) {
      let slideContent = await fs.readFile(slidePath, 'utf-8');
      
      // Replace template variables
      slideContent = slideContent
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{date\}\}/g, currentDate)
        .replace(/\{\{subtitle\|\|([^}]+)\}\}/g, '$1');
        
      slidesContent += slideContent + '\n\n---\n\n';
    }
  }

  return slidesContent;
}

/**
 * Create individual slide files for modular editing
 */
async function createIndividualSlideFiles(title: string, theme: string, slidesDir: string): Promise<void> {
  const slideTheme = theme || 'default';
  const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'slides', slideTheme);
  
  // Check if theme-specific templates exist, fallback to default
  const themeDir = await fs.pathExists(templatesDir) ? templatesDir : 
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'slides', 'default');

  const currentDate = new Date().toLocaleDateString();
  const slideFiles = ['001-cover.md', '002-content.md', '003-closing.md'];
  
  for (const slideFile of slideFiles) {
    const sourcePath = path.join(themeDir, slideFile);
    const targetPath = path.join(slidesDir, slideFile);
    
    if (await fs.pathExists(sourcePath)) {
      let slideContent = await fs.readFile(sourcePath, 'utf-8');
      
      // Replace template variables
      slideContent = slideContent
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{date\}\}/g, currentDate)
        .replace(/\{\{subtitle\|\|([^}]+)\}\}/g, '$1');
        
      await fs.writeFile(targetPath, slideContent);
    }
  }

  // Create a slides index file for managing the slide order
  const indexContent = `# Slides Index

This directory contains individual slide files for modular editing.

## Current Slides:
1. **001-cover.md** - Title/Cover slide
2. **002-content.md** - Main content slide
3. **003-closing.md** - Thank you/Closing slide

## Adding New Slides:
- Create new .md files with numbering (e.g., 004-new-slide.md)
- Update this index file
- Rebuild the main slides.md file if needed

## Theme: ${theme || 'default'}
## Created: ${new Date().toLocaleDateString()}
`;

  await fs.writeFile(path.join(slidesDir, 'README.md'), indexContent);
}

/**
 * Create modular slide content by reading individual slide files and combining them
 */
async function createModularSlideContent(title: string, theme: string, outputPath: string): Promise<string> {
  const slidesDir = path.join(outputPath, 'slides');
  await fs.ensureDir(slidesDir);
  
  const currentDate = new Date().toLocaleDateString();
  
  // Create individual slide files first
  await createIndividualSlideFiles(title, theme, slidesDir);
  
  // Read the content from individual slide files and combine them
  const slideFiles = ['001-cover.md', '002-content.md', '003-closing.md'];
  let combinedContent = `<!-- 
  MODULAR SLIDE ARCHITECTURE
  This presentation demonstrates the original vision of Slidev Builder MCP v2.0:
  Each slide is stored in a separate .md file for modular editing
  
  Individual slides are located in the /slides/ directory:
  - slides/001-cover.md     (Cover slide)
  - slides/002-content.md   (Content slide) 
  - slides/003-closing.md   (Closing slide)
  
  Note: Slidev requires content to be in the main file, but individual files
  are maintained for modular editing and can be copied here when needed.
-->

`;

  for (let i = 0; i < slideFiles.length; i++) {
    const slideFile = slideFiles[i];
    const slidePath = path.join(slidesDir, slideFile);
    
    if (await fs.pathExists(slidePath)) {
      let slideContent = await fs.readFile(slidePath, 'utf-8');
      
      // Remove the frontmatter from individual slides (except the first one)
      if (i > 0) {
        slideContent = slideContent.replace(/^---[\s\S]*?---\n/, '---\n');
      }
      
      combinedContent += `<!-- Slide ${i + 1}: ${slideFile.replace(/^\d+-/, '').replace('.md', '')} (from slides/${slideFile}) -->\n`;
      combinedContent += slideContent;
      
      if (i < slideFiles.length - 1) {
        combinedContent += '\n\n';
      }
    }
  }
  
  return combinedContent;
}
