import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';

const getCapabilitiesSchema = z.object({
  detail: z.enum(['basic', 'full']).optional().default('basic')
});

export async function getCapabilities(args: z.infer<typeof getCapabilitiesSchema>) {
  const { detail } = getCapabilitiesSchema.parse(args);

  const basicCapabilities = {
    server: {
      name: 'Slidev Builder MCP Server',
      version: '2.0.0',
      description: 'Enhanced Slidev presentation builder with comprehensive process workflow'
    },
    tools: {
      count: 9,
      names: [
        'initialize_project',
        'create_slide', 
        'generate_assets',
        'list_components',
        'create_component',
        'add_component',
        'apply_theme',
        'export_deck',
        'get_capabilities'
      ]
    },
    enhancements: {
      processWorkflow: '5-step Enhanced Slidev Builder Process',
      orchestration: 'ProcessOrchestrator layer for complete workflow management',
      assetGeneration: 'Universal asset creation with Python, 3D, interactive support',
      storyArchitecture: 'Strategic presentation planning and narrative design'
    }
  };

  if (detail === 'basic') {
    return {
      success: true,
      capabilities: basicCapabilities
    };
  }

  // Full detail mode
  const fullCapabilities = {
    ...basicCapabilities,
    process: {
      workflow: {
        step1: 'Story Architecture - Audience analysis and narrative design',
        step2: 'Main Idea - Core message and value proposition definition',
        step3: 'Idea Development - Content structure and flow planning',
        step4: 'Slides Deck - Presentation creation with theme and layout',
        step5: 'Assets Deck - Multi-modal asset generation and integration'
      },
      modes: {
        complete: 'Full 5-step process with story architecture',
        'slides-only': 'Skip story architecture, focus on slides and assets',
        quick: 'Minimal setup for rapid prototyping'
      }
    },
    assets: {
      types: [
        'chart - Interactive charts and data visualizations',
        'python-script - Custom Python analysis and visualization',
        '3d-visualization - Three.js 3D components',
        'interactive-component - Vue.js interactive elements',
        'audio - Audio content integration',
        'video - Video content embedding',
        'image - Image generation and processing'
      ],
      frameworks: ['Chart.js', 'D3.js', 'Three.js', 'Vue.js', 'Python/Matplotlib']
    },
    themes: {
      default: 'hatch-corporate',
      features: ['Corporate branding', 'Color schemes', 'Typography', 'Layout templates']
    },
    exports: ['pdf', 'png', 'html', 'pptx'],
    documentation: {
      processGuide: 'docs/SLIDEV-BUILDER-PROCESS.md included',
      apiReference: 'Complete tool schemas and usage examples',
      workflow: 'Step-by-step process documentation'
    }
  };

  return {
    success: true,
    capabilities: fullCapabilities,
    usage: {
      quickStart: 'Use initialize_project with processMode="quick" for rapid setup',
      complete: 'Use initialize_project with processMode="complete" for full workflow',
      assets: 'Use generate_assets for any visualization or interactive element needs'
    }
  };
}
