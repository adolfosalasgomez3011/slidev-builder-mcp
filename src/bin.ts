#!/usr/bin/env node

/**
 * Command-line entry point for Slidev Builder MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';

// Enhanced tools imports
import { initializeProject } from './tools/initializeProject.js';
import { createSlide } from './tools/createSlide.js';
import { generateAssets } from './tools/generateAssets.js';
import { listComponents } from './tools/listComponents.js';
import { addComponent } from './tools/addComponent.js';
import { applyTheme } from './tools/applyTheme.js';
import { exportDeck } from './tools/exportDeck.js';
import { createComponent } from './tools/createComponent.js';
import { getCapabilities } from './tools/getCapabilities.js';

class SlidevBuilderMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'slidev-builder-mcp',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupErrorHandling();
  }

  private setupTools(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'initialize_project',
            description: 'Initialize a new Slidev presentation project with complete Enhanced Process workflow - replaces createDeck and generateIntelligentDeck',
            inputSchema: {
              type: 'object',
              properties: {
                projectName: { type: 'string', description: 'Project name' },
                outputPath: { type: 'string', description: 'Output directory path' },
                processMode: { 
                  type: 'string', 
                  enum: ['complete', 'slides-only', 'quick'],
                  description: 'Process mode: complete (full 5-step process), slides-only (skip story architecture), quick (minimal setup)'
                },
                storyArchitecture: {
                  type: 'object',
                  properties: {
                    audience: { type: 'string', description: 'Target audience' },
                    objective: { type: 'string', description: 'Presentation objective' },
                    context: { type: 'string', description: 'Business context' },
                    keyMessage: { type: 'string', description: 'Core message' }
                  }
                },
                slides: { 
                  type: 'array', 
                  items: { type: 'object' },
                  description: 'Slide configurations' 
                },
                assets: {
                  type: 'array',
                  items: { type: 'object' },
                  description: 'Required assets (charts, images, etc.)'
                },
                theme: { type: 'string', description: 'Theme name (default: hatch-corporate)' }
              },
              required: ['projectName', 'outputPath']
            },
          },
          {
            name: 'generate_assets',
            description: 'Universal asset generation - replaces generateChart with support for all asset types',
            inputSchema: {
              type: 'object',
              properties: {
                assetType: { 
                  type: 'string', 
                  enum: ['chart', 'python-script', '3d-visualization', 'interactive-component', 'audio', 'video', 'image'],
                  description: 'Type of asset to generate'
                },
                configuration: { 
                  type: 'object', 
                  description: 'Asset-specific configuration' 
                },
                outputPath: { type: 'string', description: 'Output file path' },
                data: { type: 'object', description: 'Data for the asset' },
                styling: { type: 'object', description: 'Styling options' },
                interactivity: { type: 'object', description: 'Interactive features' }
              },
              required: ['assetType', 'configuration', 'outputPath']
            },
          },
          // ... other tools truncated for brevity
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'initialize_project':
            if (!args) throw new Error('Arguments required for initialize_project');
            const projectResult = await initializeProject(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(projectResult, null, 2) }],
            };
            
          case 'generate_assets':
            if (!args) throw new Error('Arguments required for generate_assets');
            const assetsResult = await generateAssets(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(assetsResult, null, 2) }],
            };
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        console.error(`Error in tool ${name}:`, error);
        throw error;
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error: any) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Slidev Builder MCP Server v2.0 running');
  }
}

const server = new SlidevBuilderMCPServer();
server.run().catch((error: any) => {
  console.error('Failed to start Slidev Builder MCP Server:', error);
  process.exit(1);
});
