/**
 * Process Orchestrator - Implements the Enhanced Slidev Builder Process
 * Coordinates the 5-step process: Story Architecture → Main Idea → Idea Development → Slides Deck → Assets Deck
 */

import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';

// Process Step Schemas
export const StoryArchitectureSchema = z.object({
  narrativeArc: z.string().describe('Story spine with emotional beats and engagement points'),
  audienceJourney: z.string().describe('Viewer experience and key message progression'),
  messageHierarchy: z.object({
    primary: z.string(),
    secondary: z.array(z.string()),
    supporting: z.array(z.string())
  })
});

export const IdeaDevelopmentSchema = z.object({
  powerfulTxt: z.string().describe('Well-structured, readable text document'),
  comprehensiveDocx: z.string().describe('DOCX with index, summary, charts, appendices'),
  condensedMd: z.string().describe('Markdown document for presentation basis')
});

export const SlidesDeckSchema = z.object({
  slidesFile: z.string().describe('Main slides.md orchestration file'),
  individualSlides: z.array(z.string()).describe('Individual slide MD files'),
  slideLayouts: z.array(z.string()).describe('DrawIO layout files')
});

export const AssetsDeckSchema = z.object({
  images: z.array(z.string()).describe('Generated/sourced images'),
  videos: z.array(z.string()).describe('Video assets'),
  pythonFiles: z.array(z.string()).describe('Python-generated assets'),
  threeElements: z.array(z.string()).describe('3D visualizations'),
  interactiveElements: z.array(z.string()).describe('Interactive simulations'),
  audioAssets: z.array(z.string()).describe('Audio integration files')
});

export interface ProjectInitializationRequest {
  projectName: string;
  initialIdea: string;
  outputDir: string;
  processMode: 'complete' | 'slides-only' | 'quick';
  enabledSteps: Array<'story' | 'idea' | 'slides' | 'assets'>;
  brandGuidelines?: string;
  audience?: 'executive' | 'technical' | 'general';
  presentationType?: 'business' | 'technical' | 'creative' | 'educational';
}

export class ProcessOrchestrator {
  
  /**
   * Initialize the complete project structure with all process steps
   */
  static async initializeProject(request: ProjectInitializationRequest): Promise<{
    success: boolean;
    projectPath: string;
    stepsCompleted: string[];
    message: string;
  }> {
    console.log('🚀 Initializing Enhanced Slidev Builder Project...');
    
    const projectPath = path.join(request.outputDir, request.projectName);
    const stepsCompleted: string[] = [];
    
    try {
      // Create main project directory
      await fs.mkdir(projectPath, { recursive: true });
      
      // Execute steps based on process mode and enabled steps
      if (request.processMode === 'complete' || request.enabledSteps.includes('story')) {
        await this.createStoryArchitecture(projectPath, request.initialIdea);
        stepsCompleted.push('Story Architecture');
      }
      
      // Always create main idea (entry point)
      await this.createMainIdea(projectPath, request.initialIdea);
      stepsCompleted.push('Main Idea');
      
      if (request.processMode === 'complete' || request.enabledSteps.includes('idea')) {
        await this.createIdeaDevelopment(projectPath, request.initialIdea);
        stepsCompleted.push('Idea Development');
      }
      
      if (request.processMode !== 'quick' || request.enabledSteps.includes('slides')) {
        await this.createSlidesDeck(projectPath, request);
        stepsCompleted.push('Slides Deck');
      }
      
      if (request.processMode === 'complete' || request.enabledSteps.includes('assets')) {
        await this.createAssetsDeck(projectPath);
        stepsCompleted.push('Assets Deck');
      }
      
      // Create project configuration
      await this.createProjectConfig(projectPath, request);
      
      return {
        success: true,
        projectPath,
        stepsCompleted,
        message: `Project '${request.projectName}' initialized successfully with ${stepsCompleted.length} steps completed.`
      };
      
    } catch (error) {
      return {
        success: false,
        projectPath,
        stepsCompleted,
        message: `Error initializing project: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  /**
   * Step 0: Create Story Architecture structure
   */
  private static async createStoryArchitecture(projectPath: string, initialIdea: string): Promise<void> {
    const storyPath = path.join(projectPath, '0-story-architecture');
    await fs.mkdir(storyPath, { recursive: true });
    
    // Create narrative arc template
    const narrativeArc = `# Narrative Arc Design
    
## Story Spine
Based on initial idea: "${initialIdea}"

### Structure:
- **Once upon a time...** (Context/Current State)
- **Every day...** (Normal operations/status quo)
- **Until one day...** (Problem/Challenge emerges)
- **Because of that...** (Consequences and implications)
- **Finally...** (Solution and transformation)

### Emotional Beats:
1. **Opening Hook** - Capture attention
2. **Building Tension** - Establish stakes
3. **Climax** - Present solution
4. **Resolution** - Show outcomes
5. **Call to Action** - Next steps

## Engagement Points:
- Interactive elements
- Audience participation moments
- Visual reveals
- Data-driven insights
`;
    
    await fs.writeFile(path.join(storyPath, 'narrative-arc.md'), narrativeArc);
    
    // Create audience journey template
    const audienceJourney = `# Audience Journey Mapping

## Target Audience Analysis
- Primary audience: [To be defined]
- Secondary audience: [To be defined]
- Decision makers: [To be defined]

## Journey Stages:
1. **Awareness** - Introduction to the topic
2. **Interest** - Building engagement
3. **Consideration** - Evaluating options
4. **Decision** - Call to action
5. **Action** - Next steps

## Key Message Progression:
- Slide 1-3: Context and problem
- Slide 4-6: Solution overview
- Slide 7-9: Implementation details
- Slide 10+: Benefits and next steps
`;
    
    await fs.writeFile(path.join(storyPath, 'audience-journey.md'), audienceJourney);
    
    // Create message hierarchy template
    const messageHierarchy = `# Message Hierarchy

## Primary Message:
Main takeaway from "${initialIdea}"

## Secondary Messages:
1. Supporting point 1
2. Supporting point 2
3. Supporting point 3

## Supporting Messages:
- Evidence and data points
- Case studies and examples
- Technical details
- Implementation considerations
`;
    
    await fs.writeFile(path.join(storyPath, 'message-hierarchy.md'), messageHierarchy);
  }
  
  /**
   * Step 1: Create Main Idea structure
   */
  private static async createMainIdea(projectPath: string, initialIdea: string): Promise<void> {
    const ideaPath = path.join(projectPath, '1-main-idea');
    await fs.mkdir(ideaPath, { recursive: true });
    
    const ideaContent = `# Main Idea

## Initial Concept:
${initialIdea}

## Development Notes:
- Created: ${new Date().toISOString()}
- Status: Initial
- Next Steps: Develop into comprehensive documentation

## Key Questions to Address:
1. What problem does this solve?
2. Who is the target audience?
3. What are the expected outcomes?
4. How will success be measured?

## Related Concepts:
- [To be expanded during idea development]
`;
    
    await fs.writeFile(path.join(ideaPath, 'initial-idea.txt'), ideaContent);
  }
  
  /**
   * Step 2: Create Idea Development structure
   */
  private static async createIdeaDevelopment(projectPath: string, initialIdea: string): Promise<void> {
    const developmentPath = path.join(projectPath, '2-idea-development');
    await fs.mkdir(developmentPath, { recursive: true });
    
    // Create powerful TXT document template
    const powerfulTxt = `# Comprehensive Idea Development

## Executive Summary
${initialIdea}

## Problem Statement
[Detailed analysis of the problem or opportunity]

## Solution Overview
[Comprehensive solution description]

## Implementation Strategy
[Step-by-step implementation approach]

## Expected Outcomes
[Measurable results and benefits]

## Risk Assessment
[Potential challenges and mitigation strategies]

## Conclusion
[Summary and next steps]

---
Document Status: Template - Requires development through iterative LLM collaboration
Created: ${new Date().toISOString()}
`;
    
    await fs.writeFile(path.join(developmentPath, 'powerful-document.txt'), powerfulTxt);
    
    // Create DOCX template placeholder
    const docxInfo = `# DOCX Document Information

This file should contain:
- Content Index
- Executive Summary
- Graphs and Charts
- Appendices
- Pagination
- Branded header and footer

Status: To be generated from powerful-document.txt
`;
    
    await fs.writeFile(path.join(developmentPath, 'comprehensive-document-info.md'), docxInfo);
    
    // Create condensed MD template
    const condensedMd = `# ${initialIdea} - Presentation Content

## Slide Structure Overview

### Introduction
- Hook and context
- Problem statement

### Solution
- Core approach
- Key benefits

### Implementation
- Strategy overview
- Timeline

### Conclusion
- Expected outcomes
- Call to action

---
*This document serves as the basis for slide deck creation*
`;
    
    await fs.writeFile(path.join(developmentPath, 'condensed-document.md'), condensedMd);
  }
  
  /**
   * Step 3: Create Slides Deck structure
   */
  private static async createSlidesDeck(projectPath: string, request: ProjectInitializationRequest): Promise<void> {
    const slidesPath = path.join(projectPath, '3-slides-deck');
    await fs.mkdir(slidesPath, { recursive: true });
    
    // Create slides folder
    const slidesFolder = path.join(slidesPath, 'slides');
    await fs.mkdir(slidesFolder, { recursive: true });
    
    // Create layouts folder
    const layoutsFolder = path.join(slidesPath, 'slides-layouts');
    await fs.mkdir(layoutsFolder, { recursive: true });
    
    // Create main slides.md orchestration file
    const slidesContent = `---
theme: ${request.brandGuidelines || 'hatch-corporate'}
title: ${request.projectName}
info: |
  ## ${request.projectName}
  ${request.initialIdea}
transition: slide-left
mdc: true
layout: cover
class: text-center
---

# ${request.projectName}

${request.initialIdea}

---
layout: default
---

# Agenda

1. Introduction
2. Problem Overview
3. Solution Approach
4. Implementation
5. Expected Outcomes

---
src: ./slides/001-introduction.md
---

---
src: ./slides/002-problem.md
---

---
src: ./slides/003-solution.md
---

---
layout: end
---

# Thank You

Questions & Discussion
`;
    
    await fs.writeFile(path.join(slidesPath, 'slides.md'), slidesContent);
    
    // Create sample individual slides
    const introSlide = `---
layout: default
---

# Introduction

## Welcome to ${request.projectName}

### Overview
${request.initialIdea}

### Objectives
- Understand the current situation
- Explore potential solutions
- Define implementation approach
- Establish success metrics
`;
    
    await fs.writeFile(path.join(slidesFolder, '001-introduction.md'), introSlide);
    
    // Create package.json for the slides
    const packageJson = {
      name: request.projectName.toLowerCase().replace(/\s+/g, '-'),
      type: "module",
      scripts: {
        build: "slidev build",
        dev: "slidev --open",
        export: "slidev export"
      },
      dependencies: {
        "@slidev/cli": "^0.48.0",
        "@slidev/theme-default": "latest"
      }
    };
    
    await fs.writeFile(path.join(slidesPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  }
  
  /**
   * Step 4: Create Assets Deck structure
   */
  private static async createAssetsDeck(projectPath: string): Promise<void> {
    const assetsPath = path.join(projectPath, '4-assets-deck');
    await fs.mkdir(assetsPath, { recursive: true });
    
    // Create asset folders
    const folders = [
      'images',
      'videos',
      'python',
      '3d-elements',
      'interactive-simulations',
      'audio'
    ];
    
    for (const folder of folders) {
      const folderPath = path.join(assetsPath, folder);
      await fs.mkdir(folderPath, { recursive: true });
      
      // Create README for each folder
      const readmeContent = `# ${folder.charAt(0).toUpperCase() + folder.slice(1)} Assets

This folder contains ${folder} assets for the presentation.

## Usage Guidelines:
- Keep files organized and named consistently
- Include source information for external assets
- Optimize file sizes for presentation performance
- Document any special requirements or dependencies

## Generated Assets:
[List of assets will be populated as they are created]
`;
      
      await fs.writeFile(path.join(folderPath, 'README.md'), readmeContent);
    }
    
    // Create Python environment setup
    const pythonSetup = `# Python Assets Setup

## Dependencies
Create a virtual environment and install required packages:

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

## Common Libraries for Presentations:
- matplotlib (charts and graphs)
- plotly (interactive visualizations)
- pandas (data manipulation)
- numpy (numerical computations)
- seaborn (statistical visualizations)
- bokeh (web-based visualizations)

## Asset Generation Scripts:
[Python scripts for generating presentation assets will be placed here]
`;
    
    await fs.writeFile(path.join(assetsPath, 'python', 'setup.md'), pythonSetup);
    
    // Create requirements.txt
    const requirements = `matplotlib>=3.7.0
plotly>=5.15.0
pandas>=2.0.0
numpy>=1.24.0
seaborn>=0.12.0
bokeh>=3.2.0
jupyter>=1.0.0
`;
    
    await fs.writeFile(path.join(assetsPath, 'python', 'requirements.txt'), requirements);
  }
  
  /**
   * Create project configuration file
   */
  private static async createProjectConfig(projectPath: string, request: ProjectInitializationRequest): Promise<void> {
    const config = {
      project: {
        name: request.projectName,
        initialIdea: request.initialIdea,
        created: new Date().toISOString(),
        processMode: request.processMode,
        enabledSteps: request.enabledSteps
      },
      settings: {
        brandGuidelines: request.brandGuidelines || 'hatch-corporate',
        audience: request.audience || 'general',
        presentationType: request.presentationType || 'business'
      },
      structure: {
        storyArchitecture: '0-story-architecture/',
        mainIdea: '1-main-idea/',
        ideaDevelopment: '2-idea-development/',
        slidesDeck: '3-slides-deck/',
        assetsDeck: '4-assets-deck/'
      }
    };
    
    await fs.writeFile(
      path.join(projectPath, 'project-config.json'), 
      JSON.stringify(config, null, 2)
    );
    
    // Create main README
    const readme = `# ${request.projectName}

${request.initialIdea}

## Project Structure

This project follows the Enhanced Slidev Builder Process with the following structure:

- **0-story-architecture/**: Narrative framework and audience journey mapping
- **1-main-idea/**: Initial concept and development notes
- **2-idea-development/**: Comprehensive documentation (TXT, DOCX, MD)
- **3-slides-deck/**: Slidev presentation files and layouts
- **4-assets-deck/**: All presentation assets (images, videos, Python, 3D, interactive, audio)

## Getting Started

1. Review and develop the story architecture in \`0-story-architecture/\`
2. Expand the main idea in \`1-main-idea/\`
3. Create comprehensive documentation in \`2-idea-development/\`
4. Build the slide deck in \`3-slides-deck/\`
5. Generate assets in \`4-assets-deck/\`

## Development Commands

From the \`3-slides-deck/\` directory:

\`\`\`bash
npm install
npm run dev    # Start development server
npm run build  # Build for production
npm run export # Export to PDF
\`\`\`

## Process Mode: ${request.processMode}
## Enabled Steps: ${request.enabledSteps.join(', ')}

Created: ${new Date().toISOString()}
`;
    
    await fs.writeFile(path.join(projectPath, 'README.md'), readme);
  }
}
