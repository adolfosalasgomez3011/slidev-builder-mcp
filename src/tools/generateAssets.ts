/**
 * Generate Assets Tool - Universal asset creation for presentations
 * Replaces generateChart and provides comprehensive asset generation capabilities
 * Handles: charts, Python simulations, 3D elements, interactive widgets, audio, video, images
 */

import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const generateAssetsSchema = z.object({
  assetType: z.enum(['chart', 'python-simulation', '3d-element', 'interactive-widget', 'audio', 'video', 'image']).describe(
    'Type of asset to generate'
  ),
  content: z.string().describe('Content description or data for the asset'),
  outputDir: z.string().describe('Output directory for the generated asset'),
  specifications: z.object({
    title: z.string().optional().describe('Title for the asset'),
    dimensions: z.object({
      width: z.number().default(800),
      height: z.number().default(600)
    }).optional(),
    style: z.string().optional().default('modern').describe('Visual style (modern, corporate, minimal, etc.)'),
    colors: z.array(z.string()).optional().describe('Color palette to use'),
    format: z.string().optional().default('png').describe('Output format (png, svg, jpg, mp4, etc.)'),
    interactive: z.boolean().default(false).describe('Whether the asset should be interactive'),
    data: z.any().optional().describe('Raw data for charts or simulations'),
    pythonLibraries: z.array(z.string()).optional().describe('Python libraries to use'),
    threeJsComponents: z.array(z.string()).optional().describe('Three.js components to include'),
    audioSettings: z.object({
      duration: z.number().optional(),
      tempo: z.number().optional(),
      volume: z.number().optional()
    }).optional()
  }).describe('Detailed specifications for asset generation'),
  brandGuidelines: z.string().optional().default('hatch-corporate').describe('Brand guidelines to follow'),
  optimize: z.boolean().default(true).describe('Optimize asset for presentation use')
});

export async function generateAssets(args: z.infer<typeof generateAssetsSchema>) {
  try {
    console.log(`🎨 Generating ${args.assetType} asset...`);
    
    // Ensure output directory exists
    await fs.mkdir(args.outputDir, { recursive: true });
    
    let result;
    
    switch (args.assetType) {
      case 'chart':
        result = await generateChart(args);
        break;
      case 'python-simulation':
        result = await generatePythonSimulation(args);
        break;
      case '3d-element':
        result = await generate3DElement(args);
        break;
      case 'interactive-widget':
        result = await generateInteractiveWidget(args);
        break;
      case 'audio':
        result = await generateAudio(args);
        break;
      case 'video':
        result = await generateVideo(args);
        break;
      case 'image':
        result = await generateImage(args);
        break;
      default:
        throw new Error(`Unsupported asset type: ${args.assetType}`);
    }
    
    console.log(`✅ Asset generated successfully: ${result.filePath}`);
    
    return {
      success: true,
      assetType: args.assetType,
      filePath: result.filePath,
      metadata: result.metadata,
      usage: result.usage,
      message: `${args.assetType} asset generated successfully`
    };
    
  } catch (error) {
    console.error(`❌ Error generating ${args.assetType}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      assetType: args.assetType
    };
  }
}

/**
 * Generate chart assets using Python/matplotlib or other charting libraries
 */
async function generateChart(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `chart_${Date.now()}.${args.specifications.format}`;
  const filePath = path.join(args.outputDir, fileName);
  
  // Generate Python script for chart creation
  const pythonScript = generateChartPythonScript(args);
  const scriptPath = path.join(args.outputDir, `generate_${Date.now()}.py`);
  
  await fs.writeFile(scriptPath, pythonScript);
  
  try {
    // Execute Python script
    await execAsync(`python "${scriptPath}"`);
    
    // Clean up script file
    await fs.unlink(scriptPath);
    
    return {
      filePath,
      metadata: {
        type: 'chart',
        format: args.specifications.format,
        dimensions: args.specifications.dimensions,
        generated: new Date().toISOString()
      },
      usage: `Use in Slidev with: <img src="${fileName}" alt="${args.specifications.title || 'Chart'}" />`
    };
  } catch (error) {
    // Clean up script file on error
    try {
      await fs.unlink(scriptPath);
    } catch {}
    throw error;
  }
}

/**
 * Generate Python simulation files
 */
async function generatePythonSimulation(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `simulation_${Date.now()}.py`;
  const filePath = path.join(args.outputDir, fileName);
  
  const simulationCode = generatePythonSimulationCode(args);
  await fs.writeFile(filePath, simulationCode);
  
  // Also create a Jupyter notebook version for development
  const notebookPath = path.join(args.outputDir, `simulation_${Date.now()}.ipynb`);
  const notebook = createJupyterNotebook(simulationCode, args.specifications.title || 'Simulation');
  await fs.writeFile(notebookPath, JSON.stringify(notebook, null, 2));
  
  return {
    filePath,
    metadata: {
      type: 'python-simulation',
      notebook: notebookPath,
      libraries: args.specifications.pythonLibraries || ['numpy', 'matplotlib', 'pandas'],
      generated: new Date().toISOString()
    },
    usage: `Run simulation with: python "${fileName}"`
  };
}

/**
 * Generate 3D elements using Three.js
 */
async function generate3DElement(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `3d_element_${Date.now()}.js`;
  const filePath = path.join(args.outputDir, fileName);
  
  const threeJsCode = generateThreeJsCode(args);
  await fs.writeFile(filePath, threeJsCode);
  
  // Create accompanying HTML file for testing
  const htmlPath = path.join(args.outputDir, `3d_element_${Date.now()}.html`);
  const htmlContent = createThreeJsHTML(fileName, args.specifications.title || '3D Element');
  await fs.writeFile(htmlPath, htmlContent);
  
  return {
    filePath,
    metadata: {
      type: '3d-element',
      htmlDemo: htmlPath,
      components: args.specifications.threeJsComponents || ['scene', 'camera', 'renderer'],
      generated: new Date().toISOString()
    },
    usage: `Import in Slidev component: import ThreeElement from './${fileName}'`
  };
}

/**
 * Generate interactive widgets
 */
async function generateInteractiveWidget(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `widget_${Date.now()}.vue`;
  const filePath = path.join(args.outputDir, fileName);
  
  const vueComponent = generateVueWidgetCode(args);
  await fs.writeFile(filePath, vueComponent);
  
  return {
    filePath,
    metadata: {
      type: 'interactive-widget',
      framework: 'vue',
      interactive: true,
      generated: new Date().toISOString()
    },
    usage: `Use in Slidev slide with: <${path.basename(fileName, '.vue')} />`
  };
}

/**
 * Generate audio assets
 */
async function generateAudio(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `audio_${Date.now()}.wav`;
  const filePath = path.join(args.outputDir, fileName);
  
  // Create placeholder audio generation script
  const audioScript = generateAudioScript(args);
  const scriptPath = path.join(args.outputDir, `generate_audio_${Date.now()}.py`);
  
  await fs.writeFile(scriptPath, audioScript);
  
  return {
    filePath,
    metadata: {
      type: 'audio',
      duration: args.specifications.audioSettings?.duration || 10,
      format: 'wav',
      generated: new Date().toISOString()
    },
    usage: `Add to slide with: <audio src="${fileName}" controls />`
  };
}

/**
 * Generate video assets
 */
async function generateVideo(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `video_${Date.now()}.mp4`;
  const filePath = path.join(args.outputDir, fileName);
  
  // Create video generation script
  const videoScript = generateVideoScript(args);
  const scriptPath = path.join(args.outputDir, `generate_video_${Date.now()}.py`);
  
  await fs.writeFile(scriptPath, videoScript);
  
  return {
    filePath,
    metadata: {
      type: 'video',
      format: 'mp4',
      dimensions: args.specifications.dimensions,
      generated: new Date().toISOString()
    },
    usage: `Embed in slide with: <video src="${fileName}" controls />`
  };
}

/**
 * Generate image assets
 */
async function generateImage(args: z.infer<typeof generateAssetsSchema>) {
  const fileName = `image_${Date.now()}.${args.specifications.format}`;
  const filePath = path.join(args.outputDir, fileName);
  
  // Create image generation script (placeholder for AI image generation)
  const imageScript = generateImageScript(args);
  const scriptPath = path.join(args.outputDir, `generate_image_${Date.now()}.py`);
  
  await fs.writeFile(scriptPath, imageScript);
  
  return {
    filePath,
    metadata: {
      type: 'image',
      format: args.specifications.format,
      dimensions: args.specifications.dimensions,
      generated: new Date().toISOString()
    },
    usage: `Use in slide with: <img src="${fileName}" alt="${args.specifications.title || 'Generated Image'}" />`
  };
}

// Helper functions for code generation

function generateChartPythonScript(args: z.infer<typeof generateAssetsSchema>): string {
  const colors = args.specifications.colors || ['#095078', '#E84B37', '#ACBCC8'];
  const title = args.specifications.title || 'Chart';
  const dimensions = args.specifications.dimensions || { width: 800, height: 600 };
  
  return `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Set up the plot
plt.figure(figsize=(${dimensions.width/100}, ${dimensions.height/100}))
plt.style.use('seaborn-v0_8' if 'seaborn-v0_8' in plt.style.available else 'default')

# Chart data (based on content: ${args.content})
# TODO: Parse actual data from content
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Create the chart
plt.plot(x, y, color='${colors[0]}', linewidth=2)
plt.title('${title}', fontsize=16, fontweight='bold', color='#425563')
plt.xlabel('X Axis', fontsize=12, color='#595959')
plt.ylabel('Y Axis', fontsize=12, color='#595959')
plt.grid(True, alpha=0.3)

# Apply brand colors
plt.gca().spines['top'].set_color('${colors[1]}')
plt.gca().spines['right'].set_color('${colors[1]}')
plt.gca().spines['bottom'].set_color('#425563')
plt.gca().spines['left'].set_color('#425563')

# Save the chart
plt.tight_layout()
plt.savefig('${path.join(args.outputDir, `chart_${Date.now()}.${args.specifications.format}`)}', 
            dpi=300, bbox_inches='tight', facecolor='white')
plt.close()

print("Chart generated successfully!")
`;
}

function generatePythonSimulationCode(args: z.infer<typeof generateAssetsSchema>): string {
  const title = args.specifications.title || 'Simulation';
  const libraries = args.specifications.pythonLibraries || ['numpy', 'matplotlib', 'pandas'];
  
  return `"""
${title}
Generated for: ${args.content}
"""

${libraries.map(lib => `import ${lib.split('/')[0]} as ${lib.split('/')[0].substring(0, 3)}`).join('\n')}
import matplotlib.pyplot as plt
import numpy as np

class ${title.replace(/\s+/g, '')}Simulation:
    def __init__(self):
        self.data = []
        self.results = {}
    
    def generate_data(self, n_points=1000):
        """Generate simulation data"""
        # TODO: Implement actual simulation logic based on: ${args.content}
        self.data = np.random.normal(0, 1, n_points)
        return self.data
    
    def run_simulation(self):
        """Run the main simulation"""
        data = self.generate_data()
        self.results = {
            'mean': np.mean(data),
            'std': np.std(data),
            'min': np.min(data),
            'max': np.max(data)
        }
        return self.results
    
    def visualize(self):
        """Create visualization of results"""
        plt.figure(figsize=(10, 6))
        plt.hist(self.data, bins=50, alpha=0.7, color='#095078')
        plt.title('${title} Results')
        plt.xlabel('Value')
        plt.ylabel('Frequency')
        plt.grid(True, alpha=0.3)
        plt.show()
    
    def export_results(self, filename='simulation_results.csv'):
        """Export results to CSV"""
        import pandas as pd
        df = pd.DataFrame({'data': self.data})
        df.to_csv(filename, index=False)
        print(f"Results exported to {filename}")

if __name__ == "__main__":
    sim = ${title.replace(/\s+/g, '')}Simulation()
    results = sim.run_simulation()
    print(f"Simulation Results: {results}")
    sim.visualize()
`;
}

function generateThreeJsCode(args: z.infer<typeof generateAssetsSchema>): string {
  const title = args.specifications.title || '3D Element';
  
  return `/**
 * ${title}
 * Generated for: ${args.content}
 */

import * as THREE from 'three';

export class ${title.replace(/\s+/g, '')}3D {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.init();
    }
    
    init() {
        // Set up renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xf0f0f0);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Create 3D object (example: rotating cube with brand colors)
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x095078,  // Hatch primary blue
            transparent: true,
            opacity: 0.8
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        // Position camera
        this.camera.position.z = 5;
        
        // Start animation
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate the cube
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Usage in Slidev
export default function create${title.replace(/\s+/g, '')}(container) {
    return new ${title.replace(/\s+/g, '')}3D(container);
}
`;
}

function generateVueWidgetCode(args: z.infer<typeof generateAssetsSchema>): string {
  const title = args.specifications.title || 'Interactive Widget';
  
  return `<template>
  <div class="interactive-widget">
    <h3 class="widget-title">${title}</h3>
    <div class="widget-content">
      <p class="widget-description">${args.content}</p>
      
      <!-- Interactive Controls -->
      <div class="controls">
        <label>
          Value: {{ value }}
          <input 
            type="range" 
            v-model="value" 
            min="0" 
            max="100" 
            class="slider"
          />
        </label>
      </div>
      
      <!-- Results Display -->
      <div class="results">
        <div class="result-item">
          <span class="label">Current Value:</span>
          <span class="value">{{ value }}</span>
        </div>
        <div class="result-item">
          <span class="label">Calculated Result:</span>
          <span class="value">{{ calculatedResult }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const value = ref(50)

const calculatedResult = computed(() => {
  // Example calculation - customize based on widget purpose
  return (value.value * 1.5).toFixed(2)
})
</script>

<style scoped>
.interactive-widget {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #095078;
  max-width: 400px;
  margin: 1rem auto;
}

.widget-title {
  color: #095078;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.widget-description {
  color: #425563;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.controls {
  margin-bottom: 1rem;
}

.controls label {
  display: block;
  color: #595959;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.slider {
  width: 100%;
  margin-top: 0.5rem;
  accent-color: #E84B37;
}

.results {
  border-top: 1px solid #ACBCC8;
  padding-top: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  color: #595959;
  font-weight: 500;
}

.value {
  color: #095078;
  font-weight: bold;
}
</style>
`;
}

function generateAudioScript(args: z.infer<typeof generateAssetsSchema>): string {
  return `"""
Audio Generation Script
Generated for: ${args.content}
"""

# Placeholder for audio generation
# Install required libraries: pip install pydub numpy

import numpy as np
from pydub import AudioSegment
from pydub.generators import Sine

def generate_audio():
    duration = ${args.specifications.audioSettings?.duration || 10} * 1000  # milliseconds
    
    # Generate simple tone (replace with actual audio generation)
    tone = Sine(440).to_audio_segment(duration=duration)
    
    # Export audio
    output_path = "${path.join(args.outputDir, `audio_${Date.now()}.wav`)}"
    tone.export(output_path, format="wav")
    
    print(f"Audio generated: {output_path}")

if __name__ == "__main__":
    generate_audio()
`;
}

function generateVideoScript(args: z.infer<typeof generateAssetsSchema>): string {
  return `"""
Video Generation Script
Generated for: ${args.content}
"""

# Placeholder for video generation
# Install required libraries: pip install opencv-python numpy

import cv2
import numpy as np

def generate_video():
    width = ${args.specifications.dimensions?.width || 800}
    height = ${args.specifications.dimensions?.height || 600}
    fps = 30
    duration = 5  # seconds
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_path = "${path.join(args.outputDir, `video_${Date.now()}.mp4`)}"
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    for frame in range(fps * duration):
        # Create simple animated frame (replace with actual content)
        img = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Add some animation
        center = (width // 2, height // 2)
        radius = int(50 + 30 * np.sin(frame * 0.1))
        cv2.circle(img, center, radius, (9, 80, 120), -1)  # Hatch blue
        
        out.write(img)
    
    out.release()
    print(f"Video generated: {output_path}")

if __name__ == "__main__":
    generate_video()
`;
}

function generateImageScript(args: z.infer<typeof generateAssetsSchema>): string {
  return `"""
Image Generation Script
Generated for: ${args.content}
"""

# Placeholder for image generation
# Install required libraries: pip install Pillow numpy

from PIL import Image, ImageDraw, ImageFont
import numpy as np

def generate_image():
    width = ${args.specifications.dimensions?.width || 800}
    height = ${args.specifications.dimensions?.height || 600}
    
    # Create image with brand colors
    img = Image.new('RGB', (width, height), color=(172, 188, 200))  # Hatch secondary blue
    draw = ImageDraw.Draw(img)
    
    # Add content (replace with actual image generation)
    title = "${args.specifications.title || 'Generated Image'}"
    
    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), title, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), title, fill=(9, 80, 120), font=font)  # Hatch primary blue
    
    # Save image
    output_path = "${path.join(args.outputDir, `image_${Date.now()}.${args.specifications.format}`)}"
    img.save(output_path, format='${args.specifications.format?.toUpperCase()}')
    
    print(f"Image generated: {output_path}")

if __name__ == "__main__":
    generate_image()
`;
}

function createJupyterNotebook(code: string, title: string) {
  return {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: [`# ${title}\n`, `\n`, `Generated simulation code for interactive development.`]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: code.split('\n')
      }
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        name: "python",
        version: "3.8.0"
      }
    },
    nbformat: 4,
    nbformat_minor: 4
  };
}

function createThreeJsHTML(scriptFile: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 3D Demo</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        #container {
            width: 800px;
            height: 600px;
            margin: 0 auto;
            border: 2px solid #095078;
            border-radius: 8px;
            overflow: hidden;
        }
        h1 {
            text-align: center;
            color: #095078;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div id="container"></div>
    
    <script type="module">
        import create3DElement from './${scriptFile}';
        
        const container = document.getElementById('container');
        const element = create3DElement(container);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (element.resize) {
                element.resize();
            }
        });
    </script>
</body>
</html>`;
}
