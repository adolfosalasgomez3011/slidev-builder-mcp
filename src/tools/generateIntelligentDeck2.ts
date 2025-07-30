/**
 * Enhanced Slidev Builder Tool with 4-Layer Architecture
 * Combines Content Intelligence, Layout Optimization, Asset Intelligence, and Style Orchestration
 */

import { z } from 'zod';
import { SlidevBuilderOrchestrator, type SlideGenerationRequest } from '../layers/SlidevOrchestrator.js';
import path from 'path';
import fs from 'fs/promises';

const generateIntelligentDeckSchema = z.object({
  content: z.string().describe('The main content or description for the presentation'),
  title: z.string().describe('Title of the presentation'),
  audience: z.enum(['executive', 'technical', 'general']).describe('Target audience type'),
  presentation_type: z.enum(['business', 'technical', 'creative', 'educational']).describe('Type of presentation'),
  brand_guidelines: z.string().optional().describe('Brand guidelines to follow (e.g., "hatch_corporate")'),
  output_dir: z.string().describe('Output directory for the generated presentation'),
  time_constraint: z.number().optional().describe('Time constraint in minutes'),
  accessibility_requirements: z.array(z.string()).optional().describe('Specific accessibility requirements'),
  enable_ai_enhancement: z.boolean().default(true).describe('Enable AI-powered content enhancement'),
  include_speaker_notes: z.boolean().default(false).describe('Include speaker notes for each slide')
});

export async function generateIntelligentDeck(args: z.infer<typeof generateIntelligentDeckSchema>) {
  try {
    console.log('🚀 Starting Intelligent Slide Deck Generation...');
    
    // Prepare the generation request
    const request: SlideGenerationRequest = {
      content: args.content,
      audience: args.audience,
      presentation_type: args.presentation_type,
      brand_guidelines: args.brand_guidelines || 'hatch_corporate',
      time_constraint: args.time_constraint,
      accessibility_requirements: args.accessibility_requirements || []
    };
    
    // Generate slides using 4-layer orchestrator
    const result = await SlidevBuilderOrchestrator.generateSlideDeck(request);
    
    // Create output directory
    await fs.mkdir(args.output_dir, { recursive: true });
    
    // Generate slides.md file
    const slidesContent = generateSlidesMarkdown(args.title, result);
    await fs.writeFile(path.join(args.output_dir, 'slides.md'), slidesContent);
    
    // Generate package.json
    const packageJson = generatePackageJson(args.title);
    await fs.writeFile(path.join(args.output_dir, 'package.json'), JSON.stringify(packageJson, null, 2));
    
    // Generate theme configuration
    const themeConfig = generateThemeConfig(result.slides[0]?.style);
    await fs.writeFile(path.join(args.output_dir, 'theme.config.ts'), themeConfig);
    
    // Generate custom CSS
    const customCSS = generateCustomCSS(result.slides);
    await fs.writeFile(path.join(args.output_dir, 'style.css'), customCSS);
    
    // Generate speaker notes if requested
    if (args.include_speaker_notes) {
      const speakerNotes = generateSpeakerNotes(result);
      await fs.writeFile(path.join(args.output_dir, 'speaker-notes.md'), speakerNotes);
    }
    
    // Generate presentation analysis report
    const analysisReport = generateAnalysisReport(result);
    await fs.writeFile(path.join(args.output_dir, 'presentation-analysis.json'), JSON.stringify(analysisReport, null, 2));
    
    console.log('✅ Intelligent Slide Deck Generation Complete!');
    
    return {
      success: true,
      output_directory: args.output_dir,
      slides_generated: result.slides.length,
      estimated_duration: `${Math.round(result.presentation_metadata.estimated_duration / 60)} minutes`,
      quality_score: `${Math.round(result.quality_metrics.overall_score * 100)}%`,
      accessibility_score: `${Math.round(result.presentation_metadata.accessibility_score * 100)}%`,
      brand_compliance: `${Math.round(result.presentation_metadata.brand_compliance * 100)}%`,
      optimization_suggestions: result.optimization_suggestions,
      files_created: [
        'slides.md',
        'package.json', 
        'theme.config.ts',
        'style.css',
        ...(args.include_speaker_notes ? ['speaker-notes.md'] : []),
        'presentation-analysis.json'
      ],
      next_steps: [
        'Run `npm install` to install dependencies',
        'Run `npm run dev` to start development server',
        'Run `npm run build` to build for production',
        'Run `npm run export` to export as PDF'
      ]
    };
    
  } catch (error) {
    console.error('❌ Error generating intelligent deck:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      troubleshooting: [
        'Check that the output directory is writable',
        'Ensure all required dependencies are installed',
        'Verify the content input is properly formatted',
        'Check network connectivity for asset downloads'
      ]
    };
  }
}

/**
 * Generate the main slides.md file
 */
function generateSlidesMarkdown(title: string, result: any): string {
  const frontmatter = `---
theme: hatch-corporate
background: false
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## ${title}
  
  Generated with HAIA+ Slidev Builder
  4-Layer Architecture: Content → Layout → Assets → Style
  
drawings:
  persist: false
transition: slide-left
title: ${title}
mdc: true
---

`;
  
  const slidesMarkdown = result.slides
    .map((slide: any) => slide.markdown)
    .join('\n\n---\n\n');
  
  return frontmatter + slidesMarkdown;
}

/**
 * Generate package.json for the presentation
 */
function generatePackageJson(title: string) {
  return {
    "name": title.toLowerCase().replace(/\s+/g, '-'),
    "version": "1.0.0",
    "description": `${title} - Generated with HAIA+ Slidev Builder`,
    "scripts": {
      "dev": "slidev",
      "build": "slidev build",
      "export": "slidev export",
      "export-pdf": "slidev export --format pdf",
      "export-png": "slidev export --format png",
      "preview": "slidev preview"
    },
    "dependencies": {
      "@slidev/cli": "^0.48.0",
      "@slidev/theme-default": "latest"
    },
    "devDependencies": {
      "@slidev/types": "latest"
    }
  };
}

/**
 * Generate theme configuration
 */
function generateThemeConfig(styleRecommendation: any): string {
  return `import { defineTheme } from '@slidev/types'

export default defineTheme({
  name: 'hatch-corporate-enhanced',
  colorSchema: 'auto',
  layouts: {
    default: './layouts/default.vue',
    cover: './layouts/cover.vue',
    center: './layouts/center.vue',
    'two-cols': './layouts/two-cols.vue'
  },
  tokens: {
    // Hatch Corporate Colors
    primary: '#095078',
    secondary: '#ACBCC8', 
    accent: '#E84B37',
    accentAlt: '#E75300',
    gray: '#425563',
    lightGray: '#A0AEC0',
    background: '#f4f4f4',
    white: '#FFFFFF'
  }
})
`;
}

/**
 * Generate custom CSS combining all style recommendations
 */
function generateCustomCSS(slides: any[]): string {
  const baseCSS = slides[0]?.style?.css_framework || '';
  
  return `/* HAIA+ Slidev Builder - Enhanced Styles */
/* Generated with 4-Layer Architecture */

${baseCSS}

/* Additional enhancements */
.slidev-layout {
  background: var(--hatch-background);
  font-family: var(--font-primary);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Print styles */
@media print {
  .slide {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
`;
}

/**
 * Generate speaker notes
 */
function generateSpeakerNotes(result: any): string {
  let notes = `# Speaker Notes\n\n## Presentation Overview\n\n- **Total Slides:** ${result.presentation_metadata.total_slides}\n- **Estimated Duration:** ${Math.round(result.presentation_metadata.estimated_duration / 60)} minutes\n- **Quality Score:** ${Math.round(result.quality_metrics.overall_score * 100)}%\n\n---\n\n`;
  
  result.slides.forEach((slide: any, index: number) => {
    notes += `## Slide ${index + 1}: ${slide.title}\n\n`;
    notes += `**Type:** ${slide.type}\n`;
    notes += `**Estimated Time:** ${slide.estimated_time} seconds\n\n`;
    notes += `**Key Points:**\n${slide.content.split(', ').map((point: string) => `- ${point}`).join('\n')}\n\n`;
    notes += `**Layout Strategy:** ${slide.layout.reason}\n\n`;
    notes += `**Asset Strategy:** ${slide.assets.reasoning}\n\n`;
    notes += `**Style Strategy:** ${slide.style.reasoning}\n\n`;
    notes += `---\n\n`;
  });
  
  return notes;
}

/**
 * Generate analysis report
 */
function generateAnalysisReport(result: any) {
  return {
    generation_timestamp: new Date().toISOString(),
    methodology: "4-Layer Architecture",
    layers: {
      "1_content_intelligence": "Analyzed content structure using proven frameworks",
      "2_layout_optimization": "Applied responsive design patterns and visual hierarchy",
      "3_asset_intelligence": "Curated assets with semantic matching and brand compliance",
      "4_style_orchestration": "Generated cohesive design system with Hatch branding"
    },
    presentation_metadata: result.presentation_metadata,
    quality_metrics: result.quality_metrics,
    optimization_suggestions: result.optimization_suggestions,
    slides_analysis: result.slides.map((slide: any) => ({
      id: slide.id,
      type: slide.type,
      title: slide.title,
      layout_confidence: slide.layout.confidence_score,
      asset_confidence: slide.assets.confidence_score,
      accessibility_score: slide.layout.accessibility_score
    }))
  };
}

export const generateIntelligentDeckTool = {
  name: 'generate_intelligent_deck',
  description: 'Generate a complete Slidev presentation using 4-layer architecture: Content Intelligence, Layout Optimization, Asset Intelligence, and Style Orchestration',
  inputSchema: generateIntelligentDeckSchema
};
