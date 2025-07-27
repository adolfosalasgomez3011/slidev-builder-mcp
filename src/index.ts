import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  CallToolRequest,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createDeck, CreateDeckArgs } from './tools/createDeck.js';
import { createSlide, CreateSlideArgs } from './tools/createSlide.js';
import { generateChart, GenerateChartArgs } from './tools/generateChart.js';
import { applyTheme, ApplyThemeArgs } from './tools/applyTheme.js';
import { exportDeck, ExportDeckArgs } from './tools/exportDeck.js';

/**
 * Slidev Builder MCP Server
 * A comprehensive Model Context Protocol server for creating, customizing, and managing
 * Slidev presentations with advanced theming, interactive components, and Python integration.
 */

class SlidevBuilderServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'slidev-builder-mcp',
        version: '1.0.0',
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
            description: 'Create a new Slidev presentation deck with theme and template selection',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the presentation deck',
                },
                template: {
                  type: 'string',
                  enum: ['executive-summary', 'technical-review', 'business-proposal', 'minimal', 'custom'],
                  description: 'Template type for the presentation',
                  default: 'executive-summary',
                },
                theme: {
                  type: 'string',
                  enum: ['hatch-corporate', 'hatch-technical', 'hatch-minimal', 'default'],
                  description: 'Theme to apply to the presentation',
                  default: 'hatch-corporate',
                },
                outputPath: {
                  type: 'string',
                  description: 'Output directory path for the presentation',
                },
                options: {
                  type: 'object',
                  properties: {
                    includeInteractiveComponents: {
                      type: 'boolean',
                      description: 'Include interactive Vue components like draggable arrows',
                      default: true,
                    },
                    pythonIntegration: {
                      type: 'boolean',
                      description: 'Enable Python chart generation and simulations',
                      default: false,
                    },
                    customCSS: {
                      type: 'string',
                      description: 'Custom CSS to include in the presentation',
                    },
                  },
                },
              },
              required: ['title', 'outputPath'],
            },
          },
          {
            name: 'create_slide',
            description: 'Add a new slide to an existing presentation with content and layout options',
            inputSchema: {
              type: 'object',
              properties: {
                deckPath: {
                  type: 'string',
                  description: 'Path to the Slidev presentation directory',
                },
                slideType: {
                  type: 'string',
                  enum: ['title', 'content', 'two-column', 'image', 'chart', 'interactive', 'custom'],
                  description: 'Type of slide to create',
                },
                content: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    subtitle: { type: 'string' },
                    body: { type: 'string' },
                    leftColumn: { type: 'string' },
                    rightColumn: { type: 'string' },
                    image: { type: 'string' },
                    chart: { type: 'string' },
                  },
                },
                layout: {
                  type: 'string',
                  description: 'Specific layout for the slide',
                },
                position: {
                  type: 'number',
                  description: 'Position to insert the slide (0-based index)',
                },
              },
              required: ['deckPath', 'slideType', 'content'],
            },
          },
          {
            name: 'generate_chart',
            description: 'Generate charts and visualizations using Python integration',
            inputSchema: {
              type: 'object',
              properties: {
                chartType: {
                  type: 'string',
                  enum: ['bar', 'line', 'scatter', 'pie', 'heatmap', 'custom'],
                  description: 'Type of chart to generate',
                },
                data: {
                  type: 'object',
                  description: 'Chart data and configuration',
                },
                pythonScript: {
                  type: 'string',
                  description: 'Custom Python script for chart generation',
                },
                outputPath: {
                  type: 'string',
                  description: 'Output path for the generated chart',
                },
                styling: {
                  type: 'object',
                  properties: {
                    colorScheme: { type: 'string' },
                    width: { type: 'number' },
                    height: { type: 'number' },
                    theme: { type: 'string' },
                  },
                },
              },
              required: ['chartType', 'data', 'outputPath'],
            },
          },
          {
            name: 'apply_theme',
            description: 'Apply or customize themes for existing presentations',
            inputSchema: {
              type: 'object',
              properties: {
                deckPath: {
                  type: 'string',
                  description: 'Path to the Slidev presentation directory',
                },
                theme: {
                  type: 'string',
                  description: 'Theme to apply',
                },
                customizations: {
                  type: 'object',
                  properties: {
                    primaryColor: { type: 'string' },
                    secondaryColor: { type: 'string' },
                    fontFamily: { type: 'string' },
                    customCSS: { type: 'string' },
                  },
                },
              },
              required: ['deckPath', 'theme'],
            },
          },
          {
            name: 'export_deck',
            description: 'Export presentation to various formats (PDF, HTML, SPA)',
            inputSchema: {
              type: 'object',
              properties: {
                deckPath: {
                  type: 'string',
                  description: 'Path to the Slidev presentation directory',
                },
                format: {
                  type: 'string',
                  enum: ['pdf', 'html', 'spa', 'pptx'],
                  description: 'Export format',
                },
                outputPath: {
                  type: 'string',
                  description: 'Output path for exported file',
                },
                options: {
                  type: 'object',
                  properties: {
                    withClicks: { type: 'boolean' },
                    range: { type: 'string' },
                    dark: { type: 'boolean' },
                  },
                },
              },
              required: ['deckPath', 'format', 'outputPath'],
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
            return await createDeck(args as unknown as CreateDeckArgs);

          case 'create_slide':
            return await createSlide(args as unknown as CreateSlideArgs);

          case 'generate_chart':
            return await generateChart(args as unknown as GenerateChartArgs);

          case 'apply_theme':
            return await applyTheme(args as unknown as ApplyThemeArgs);

          case 'export_deck':
            return await exportDeck(args as unknown as ExportDeckArgs);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${errorMessage}`,
            },
          ],
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
    console.error('Slidev Builder MCP server running on stdio');
  }
}

const server = new SlidevBuilderServer();
server.run().catch(console.error);