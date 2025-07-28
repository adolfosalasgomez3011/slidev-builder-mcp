import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  CallToolRequest,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Import all your amazing component tools
import { createDeck } from './tools/createDeck.js';
import { createSlide } from './tools/createSlide.js';
import { listComponents } from './tools/listComponents.js';
import { createComponent } from './tools/createComponent.js';
import { addComponent } from './tools/addComponent.js';
import { installComponent } from './tools/installComponent.js';
import { publishComponent } from './tools/publishComponent.js';
import { applyTheme } from './tools/applyTheme.js';
import { generateChart } from './tools/generateChart.js';
import { exportDeck } from './tools/exportDeck.js';

class SlidevBuilderServer {
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

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_deck',
            description: 'Create a new Slidev presentation deck with Hatch corporate theme',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Presentation title' },
                template: { type: 'string', description: 'Template type (executive-summary, technical, proposal)' },
                theme: { type: 'string', description: 'Theme name (default: hatch-corporate)' },
                outputPath: { type: 'string', description: 'Output directory path' },
                options: { 
                  type: 'object',
                  properties: {
                    includeInteractiveComponents: { type: 'boolean' },
                    pythonIntegration: { type: 'boolean' },
                    customCSS: { type: 'string' }
                  }
                }
              },
              required: ['title', 'outputPath']
            },
          },
          {
            name: 'create_slide',
            description: 'Create individual slides with layouts and components',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string', description: 'Slide type (title, content, chart, comparison, etc.)' },
                content: { type: 'object', description: 'Slide content configuration' },
                layout: { type: 'string', description: 'Slide layout template' },
                theme: { type: 'string', description: 'Theme to apply' }
              },
              required: ['type', 'content']
            },
          },
          {
            name: 'list_components',
            description: 'List available presentation components',
            inputSchema: {
              type: 'object',
              properties: {
                category: { type: 'string', enum: ['charts', 'shapes', 'layouts', 'interactions', 'frameworks'] },
                scope: { type: 'string', enum: ['hatch', 'community', 'all'] },
                search: { type: 'string', description: 'Search term' },
                author: { type: 'string', description: 'Component author' }
              },
            },
          },
          {
            name: 'create_component',
            description: 'Create new Vue.js presentation components',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Component name' },
                type: { type: 'string', enum: ['chart', 'shape', 'layout', 'interaction', 'framework'] },
                template: { type: 'string', description: 'Component template' },
                props: { type: 'object', description: 'Component properties' },
                styling: { type: 'object', description: 'Component styling options' }
              },
              required: ['name', 'type']
            },
          },
          {
            name: 'add_component',
            description: 'Add components to existing presentations',
            inputSchema: {
              type: 'object',
              properties: {
                presentationPath: { type: 'string', description: 'Path to presentation' },
                componentName: { type: 'string', description: 'Component to add' },
                slideIndex: { type: 'number', description: 'Slide index to add component to' },
                configuration: { type: 'object', description: 'Component configuration' }
              },
              required: ['presentationPath', 'componentName']
            },
          },
          {
            name: 'generate_chart',
            description: 'Generate charts and visualizations',
            inputSchema: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['bar', 'line', 'pie', 'scatter', 'area', 'donut'] },
                data: { type: 'object', description: 'Chart data' },
                options: { type: 'object', description: 'Chart configuration options' },
                theme: { type: 'string', description: 'Chart theme' }
              },
              required: ['type', 'data']
            },
          },
          {
            name: 'apply_theme',
            description: 'Apply Hatch corporate theme to presentations',
            inputSchema: {
              type: 'object',
              properties: {
                presentationPath: { type: 'string', description: 'Path to presentation' },
                themeName: { type: 'string', description: 'Theme name (default: hatch-corporate)' },
                customizations: { type: 'object', description: 'Theme customizations' }
              },
              required: ['presentationPath']
            },
          },
          {
            name: 'export_deck',
            description: 'Export presentations to various formats',
            inputSchema: {
              type: 'object',
              properties: {
                inputPath: { type: 'string', description: 'Input presentation path' },
                format: { type: 'string', enum: ['pdf', 'png', 'html', 'pptx'] },
                outputPath: { type: 'string', description: 'Output file path' },
                options: { type: 'object', description: 'Export options' }
              },
              required: ['inputPath', 'format', 'outputPath']
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'create_deck':
            if (!args) throw new Error('Arguments required for create_deck');
            const deckResult = await createDeck(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(deckResult, null, 2) }],
            };
            
          case 'create_slide':
            if (!args) throw new Error('Arguments required for create_slide');
            const slideResult = await createSlide(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(slideResult, null, 2) }],
            };
            
          case 'list_components':
            const componentsResult = await listComponents(args as any || {});
            return {
              content: [{ type: 'text', text: JSON.stringify(componentsResult, null, 2) }],
            };
            
          case 'create_component':
            if (!args) throw new Error('Arguments required for create_component');
            const componentResult = await createComponent(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(componentResult, null, 2) }],
            };
            
          case 'add_component':
            if (!args) throw new Error('Arguments required for add_component');
            const addResult = await addComponent(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(addResult, null, 2) }],
            };
            
          case 'generate_chart':
            if (!args) throw new Error('Arguments required for generate_chart');
            const chartResult = await generateChart(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(chartResult, null, 2) }],
            };
            
          case 'apply_theme':
            if (!args) throw new Error('Arguments required for apply_theme');
            const themeResult = await applyTheme(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(themeResult, null, 2) }],
            };
            
          case 'export_deck':
            if (!args) throw new Error('Arguments required for export_deck');
            const exportResult = await exportDeck(args as any);
            return {
              content: [{ type: 'text', text: JSON.stringify(exportResult, null, 2) }],
            };
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error}` }],
          isError: true,
        };
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

const server = new SlidevBuilderServer();
server.run().catch(console.error);
