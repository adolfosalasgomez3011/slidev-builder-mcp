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

    // Create initial slide content using individual slide templates
    const slidesContent = await createStarterSlides(title, theme);

    // Create the slides.md file
    const fullContent = `---
${yaml.stringify(frontmatter)}---

${slidesContent}`;

    const slidesPath = path.join(outputPath, 'slides.md');
    await fs.writeFile(slidesPath, fullContent);

    // Create individual slides directory for modular editing
    const slidesDir = path.join(outputPath, 'slides');
    await fs.ensureDir(slidesDir);
    
    // Create individual slide files
    await createIndividualSlideFiles(title, theme, slidesDir);

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
  
  // Create basic chart generation script
  const chartScript = `#!/usr/bin/env python3
"""
Chart generation utilities for Slidev presentations
"""
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from pathlib import Path

class SlidevChartGenerator:
    def __init__(self, output_dir="./public/charts"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Set Hatch brand colors
        self.hatch_colors = {
            'primary': '#00A651',
            'secondary': '#004225',
            'accent': '#FFB800'
        }
    
    def generate_bar_chart(self, data, title, filename):
        """Generate a bar chart with Hatch styling"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        bars = ax.bar(data['labels'], data['values'], 
                     color=self.hatch_colors['primary'])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_ylabel('Values')
        
        plt.tight_layout()
        plt.savefig(self.output_dir / f"{filename}.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        return f"/charts/{filename}.png"

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
    
    print(f"Chart generated: {chart_path}")`;
  
  await fs.writeFile(path.join(pythonDir, 'chart_generator.py'), chartScript);
}