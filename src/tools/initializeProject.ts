/**
 * Initialize Project Tool - Master orchestrator implementing the Enhanced Slidev Builder Process
 * Replaces createDeck and generateIntelligentDeck with unified, comprehensive approach
 */

import { z } from 'zod';
import { ProcessOrchestrator, type ProjectInitializationRequest } from '../layers/ProcessOrchestrator.js';

export const initializeProjectSchema = z.object({
  projectName: z.string().describe('Name of the project/presentation'),
  initialIdea: z.string().describe('The main concept or idea to be developed'),
  outputDir: z.string().describe('Output directory for the project'),
  processMode: z.enum(['complete', 'slides-only', 'quick']).default('complete').describe(
    'Process mode: complete (all 5 steps), slides-only (jump to slides), quick (AI-enhanced rapid)'
  ),
  enabledSteps: z.array(z.enum(['story', 'idea', 'slides', 'assets'])).optional().describe(
    'Specific steps to enable (overrides processMode)'
  ),
  brandGuidelines: z.string().optional().default('hatch-corporate').describe(
    'Brand guidelines to follow (e.g., hatch-corporate, default)'
  ),
  audience: z.enum(['executive', 'technical', 'general']).optional().default('general').describe(
    'Target audience type'
  ),
  presentationType: z.enum(['business', 'technical', 'creative', 'educational']).optional().default('business').describe(
    'Type of presentation'
  ),
  aiEnhancement: z.boolean().default(true).describe('Enable AI-powered content enhancement'),
  includeTemplates: z.boolean().default(true).describe('Include process templates and examples')
});

export async function initializeProject(args: z.infer<typeof initializeProjectSchema>) {
  try {
    console.log(`🚀 Initializing ${args.processMode} project: ${args.projectName}`);
    
    // Determine enabled steps based on process mode
    let enabledSteps = args.enabledSteps;
    if (!enabledSteps) {
      switch (args.processMode) {
        case 'complete':
          enabledSteps = ['story', 'idea', 'slides', 'assets'];
          break;
        case 'slides-only':
          enabledSteps = ['slides'];
          break;
        case 'quick':
          enabledSteps = ['slides', 'assets'];
          break;
      }
    }
    
    // Prepare the initialization request
    const request: ProjectInitializationRequest = {
      projectName: args.projectName,
      initialIdea: args.initialIdea,
      outputDir: args.outputDir,
      processMode: args.processMode,
      enabledSteps: enabledSteps,
      brandGuidelines: args.brandGuidelines,
      audience: args.audience,
      presentationType: args.presentationType
    };
    
    // Execute the project initialization
    const result = await ProcessOrchestrator.initializeProject(request);
    
    if (result.success) {
      console.log(`✅ Project initialized successfully at: ${result.projectPath}`);
      console.log(`📁 Steps completed: ${result.stepsCompleted.join(', ')}`);
      
      return {
        success: true,
        projectPath: result.projectPath,
        stepsCompleted: result.stepsCompleted,
        message: result.message,
        nextSteps: generateNextStepsGuide(args.processMode, result.stepsCompleted),
        commands: generateDevelopmentCommands(result.projectPath)
      };
    } else {
      console.error(`❌ Project initialization failed: ${result.message}`);
      return {
        success: false,
        error: result.message,
        projectPath: result.projectPath,
        stepsCompleted: result.stepsCompleted
      };
    }
    
  } catch (error) {
    console.error('Error in initializeProject:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      projectPath: '',
      stepsCompleted: []
    };
  }
}

/**
 * Generate next steps guide based on process mode and completed steps
 */
function generateNextStepsGuide(processMode: string, stepsCompleted: string[]): string[] {
  const nextSteps: string[] = [];
  
  if (processMode === 'complete') {
    if (stepsCompleted.includes('Story Architecture')) {
      nextSteps.push('Review and refine narrative arc in 0-story-architecture/narrative-arc.md');
      nextSteps.push('Complete audience journey mapping in 0-story-architecture/audience-journey.md');
    }
    
    if (stepsCompleted.includes('Main Idea')) {
      nextSteps.push('Expand the initial idea with detailed analysis in 1-main-idea/');
    }
    
    if (stepsCompleted.includes('Idea Development')) {
      nextSteps.push('Develop comprehensive documentation in 2-idea-development/powerful-document.txt');
      nextSteps.push('Generate DOCX with charts and branded formatting');
    }
  }
  
  if (stepsCompleted.includes('Slides Deck')) {
    nextSteps.push('Navigate to 3-slides-deck/ and run "npm install"');
    nextSteps.push('Start development with "npm run dev"');
    nextSteps.push('Create individual slides in slides/ folder');
    nextSteps.push('Design layouts in slides-layouts/ folder');
  }
  
  if (stepsCompleted.includes('Assets Deck')) {
    nextSteps.push('Generate images using the generateAssets tool');
    nextSteps.push('Create Python visualizations in 4-assets-deck/python/');
    nextSteps.push('Add interactive elements and 3D visualizations');
  }
  
  nextSteps.push('Use optimizeContent tool for AI-enhanced content improvement');
  nextSteps.push('Use analyzePresentation tool for feedback and analytics');
  
  return nextSteps;
}

/**
 * Generate development commands for the project
 */
function generateDevelopmentCommands(projectPath: string): {
  setup: string[];
  development: string[];
  production: string[];
} {
  return {
    setup: [
      `cd "${projectPath}/3-slides-deck"`,
      'npm install',
      'cd ../4-assets-deck/python',
      'python -m venv venv',
      'source venv/bin/activate',  // Linux/Mac
      'pip install -r requirements.txt'
    ],
    development: [
      `cd "${projectPath}/3-slides-deck"`,
      'npm run dev  # Start Slidev development server',
      'npm run build  # Build for production',
      'npm run export  # Export to PDF'
    ],
    production: [
      `cd "${projectPath}/3-slides-deck"`,
      'npm run build',
      'npm run export',
      'slidev export --format pptx  # Export to PowerPoint (if available)'
    ]
  };
}
