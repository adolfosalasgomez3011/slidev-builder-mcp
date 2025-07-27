import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'child_process';

export interface GenerateChartArgs {
  chartType: 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap' | 'custom';
  data: {
    labels?: string[];
    values?: number[];
    x?: number[];
    y?: number[];
    datasets?: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>;
  };
  pythonScript?: string;
  outputPath: string;
  styling?: {
    colorScheme?: string;
    width?: number;
    height?: number;
    theme?: string;
    title?: string;
  };
}

export async function generateChart(args: GenerateChartArgs) {
  const { chartType, data, pythonScript, outputPath, styling = {} } = args;

  try {
    // Ensure output directory exists
    const chartDir = path.join(outputPath, 'public', 'charts');
    await fs.ensureDir(chartDir);

    // Hatch brand colors
    const hatchColors = {
      primary: '#00A651',
      secondary: '#004225',
      accent: '#FFB800',
      gray: '#6B7280'
    };

    let chartConfig: any = {
      type: chartType,
      data: data,
      styling: {
        colors: [hatchColors.primary, hatchColors.secondary, hatchColors.accent],
        width: styling.width || 800,
        height: styling.height || 400,
        title: styling.title || 'Chart',
        theme: styling.theme || 'hatch',
        ...styling
      }
    };

    if (pythonScript) {
      // Use custom Python script
      return await executeCustomPythonScript(pythonScript, chartConfig, outputPath);
    } else {
      // Use built-in chart generation
      return await generateBuiltInChart(chartType, chartConfig, outputPath);
    }

  } catch (error) {
    throw new Error(`Failed to generate chart: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function generateBuiltInChart(chartType: string, config: any, outputPath: string): Promise<any> {
  const chartId = `chart_${Date.now()}`;
  const chartPath = path.join(outputPath, 'public', 'charts', `${chartId}.json`);
  
  // Save chart configuration
  await fs.writeFile(chartPath, JSON.stringify(config, null, 2));

  // Generate Python script for chart creation
  const pythonScript = generatePythonChartScript(chartType, config, chartId);
  const scriptPath = path.join(outputPath, 'python', `generate_${chartId}.py`);
  
  await fs.writeFile(scriptPath, pythonScript);

  // Execute Python script if Python is available
  try {
    await executePythonScript(scriptPath);
    
    return {
      content: [
        {
          type: 'text',
          text: `📊 Successfully generated ${chartType} chart\n\n` +
                `📁 Chart ID: ${chartId}\n` +
                `📐 Size: ${config.styling.width}x${config.styling.height}\n` +
                `🎨 Theme: ${config.styling.theme}\n` +
                `📄 Config saved: /public/charts/${chartId}.json\n` +
                `🐍 Python script: /python/generate_${chartId}.py\n\n` +
                `To use in slides, add:\n\`\`\`html\n<img src="/charts/${chartId}.png" alt="${config.styling.title}" />\n\`\`\``
        }
      ]
    };
  } catch (pythonError) {
    // Python execution failed, return configuration for manual generation
    return {
      content: [
        {
          type: 'text',
          text: `📊 Chart configuration generated (Python execution failed)\n\n` +
                `📁 Chart ID: ${chartId}\n` +
                `📄 Config saved: /public/charts/${chartId}.json\n` +
                `🐍 Python script generated: /python/generate_${chartId}.py\n\n` +
                `To generate chart manually:\n` +
                `1. Install requirements: pip install -r python/requirements.txt\n` +
                `2. Run: python python/generate_${chartId}.py\n\n` +
                `Chart Configuration:\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\``
        }
      ]
    };
  }
}

async function executeCustomPythonScript(script: string, config: any, outputPath: string): Promise<any> {
  const scriptId = `custom_${Date.now()}`;
  const scriptPath = path.join(outputPath, 'python', `${scriptId}.py`);
  
  // Write custom script
  await fs.writeFile(scriptPath, script);
  
  // Write config file for script to use
  const configPath = path.join(outputPath, 'python', `${scriptId}_config.json`);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  try {
    await executePythonScript(scriptPath);
    
    return {
      content: [
        {
          type: 'text',
          text: `🐍 Successfully executed custom Python script\n\n` +
                `📁 Script ID: ${scriptId}\n` +
                `📄 Script: /python/${scriptId}.py\n` +
                `⚙️ Config: /python/${scriptId}_config.json\n\n` +
                `Check the /public/charts/ directory for generated files.`
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Custom Python script execution failed\n\n` +
                `📁 Script ID: ${scriptId}\n` +
                `📄 Script saved: /python/${scriptId}.py\n` +
                `⚙️ Config saved: /python/${scriptId}_config.json\n` +
                `❗ Error: ${error}\n\n` +
                `To run manually: python python/${scriptId}.py`
        }
      ]
    };
  }
}

function generatePythonChartScript(chartType: string, config: any, chartId: string): string {
  return `#!/usr/bin/env python3
"""
Auto-generated chart script for Slidev presentation
Chart ID: ${chartId}
Chart Type: ${chartType}
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
from pathlib import Path

# Hatch brand colors
HATCH_COLORS = {
    'primary': '#00A651',
    'secondary': '#004225', 
    'accent': '#FFB800',
    'gray': '#6B7280'
}

def generate_${chartType}_chart():
    """Generate ${chartType} chart with Hatch styling"""
    
    # Set up the plot
    plt.style.use('seaborn-v0_8')
    fig, ax = plt.subplots(figsize=(${config.styling.width/100}, ${config.styling.height/100}))
    
    # Chart data
    ${generateChartDataCode(chartType, config.data)}
    
    # Styling
    ax.set_title('${config.styling.title}', fontsize=16, fontweight='bold', color=HATCH_COLORS['secondary'])
    
    # Apply Hatch color scheme
    ${generateChartStylingCode(chartType)}
    
    # Save chart
    output_dir = Path("./public/charts")
    output_dir.mkdir(exist_ok=True)
    
    plt.tight_layout()
    plt.savefig(output_dir / "${chartId}.png", dpi=300, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    plt.savefig(output_dir / "${chartId}.svg", format='svg', bbox_inches='tight',
                facecolor='white', edgecolor='none')
    
    print(f"Chart saved: {chartId}.png and {chartId}.svg")
    plt.close()

if __name__ == "__main__":
    generate_${chartType}_chart()
`;
}

function generateChartDataCode(chartType: string, data: any): string {
  switch (chartType) {
    case 'bar':
      return `
    labels = ${JSON.stringify(data.labels || ['A', 'B', 'C', 'D'])}
    values = ${JSON.stringify(data.values || [10, 20, 15, 25])}
    bars = ax.bar(labels, values, color=HATCH_COLORS['primary'])
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
               f'{height:.1f}', ha='center', va='bottom')`;

    case 'line':
      return `
    x_data = ${JSON.stringify(data.x || [1, 2, 3, 4, 5])}
    y_data = ${JSON.stringify(data.y || [10, 15, 13, 17, 20])}
    ax.plot(x_data, y_data, color=HATCH_COLORS['primary'], 
           linewidth=3, marker='o', markersize=8)
    ax.grid(True, alpha=0.3)`;

    case 'scatter':
      return `
    x_data = ${JSON.stringify(data.x || [1, 2, 3, 4, 5])}
    y_data = ${JSON.stringify(data.y || [10, 15, 13, 17, 20])}
    ax.scatter(x_data, y_data, color=HATCH_COLORS['primary'], s=100, alpha=0.7)`;

    case 'pie':
      return `
    labels = ${JSON.stringify(data.labels || ['A', 'B', 'C', 'D'])}
    values = ${JSON.stringify(data.values || [30, 25, 20, 25])}
    colors = [HATCH_COLORS['primary'], HATCH_COLORS['secondary'], 
             HATCH_COLORS['accent'], HATCH_COLORS['gray']]
    ax.pie(values, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)`;

    default:
      return `
    # Default chart data
    labels = ['Category 1', 'Category 2', 'Category 3']
    values = [10, 20, 15]
    ax.bar(labels, values, color=HATCH_COLORS['primary'])`;
  }
}

function generateChartStylingCode(chartType: string): string {
  if (chartType === 'pie') {
    return `ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle`;
  }
  
  return `
    ax.set_xlabel('X Axis', fontweight='bold')
    ax.set_ylabel('Y Axis', fontweight='bold')
    ax.tick_params(colors=HATCH_COLORS['gray'])
    
    # Style the spines
    for spine in ax.spines.values():
        spine.set_color(HATCH_COLORS['gray'])
        spine.set_linewidth(0.5)`;
}

async function executePythonScript(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Python script failed with code ${code}: ${stderr}`);
      }
    });

    python.on('error', (error) => {
      reject(`Failed to execute Python script: ${error.message}`);
    });
  });
}
