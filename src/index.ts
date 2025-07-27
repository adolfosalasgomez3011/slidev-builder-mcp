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
import { createComponent, CreateComponentArgs } from './tools/createComponent.js';
import { listComponents, ListComponentsArgs } from './tools/listComponents.js';
import { addComponent, AddComponentArgs } from './tools/addComponent.js';
import { installComponent, InstallComponentArgs } from './tools/installComponent.js';
import { publishComponent, PublishComponentArgs } from './tools/publishComponent.js';

/**
 * Slidev Builder MCP Server v2.0
 * A comprehensive Model Context Protocol server for creating, customizing, and managing
 * Slidev presentations with advanced theming, interactive components, component library,
 * and Python integration.
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
          {
            name: 'create_component',
            description: 'Create a new reusable component for presentations with Vue.js implementation',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Component name (e.g., "interactive-arrows", "financial-charts")',
                },
                category: {
                  type: 'string',
                  enum: ['charts', 'diagrams', 'interactive', 'layout', 'data-viz', 'frameworks'],
                  description: 'Component category for organization',
                },
                description: {
                  type: 'string',
                  description: 'Description of what the component does',
                },
                scope: {
                  type: 'string',
                  enum: ['hatch', 'public', 'personal'],
                  description: 'Component visibility scope',
                  default: 'hatch',
                },
                parameters: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { type: 'string' },
                      required: { type: 'boolean' },
                      default: {},
                      description: { type: 'string' },
                    },
                    required: ['name', 'type', 'required'],
                  },
                  description: 'Component parameters configuration',
                },
                outputPath: {
                  type: 'string',
                  description: 'Output directory for component files',
                },
              },
              required: ['name', 'category', 'description', 'outputPath'],
            },
          },
          {
            name: 'list_components',
            description: 'List and browse available reusable components with filtering options',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['charts', 'diagrams', 'interactive', 'layout', 'data-viz', 'frameworks'],
                  description: 'Filter by component category',
                },
                scope: {
                  type: 'string',
                  enum: ['hatch', 'public', 'personal'],
                  description: 'Filter by component scope',
                },
                search: {
                  type: 'string',
                  description: 'Search term for component names or descriptions',
                },
                includeDetails: {
                  type: 'boolean',
                  description: 'Include detailed component information and parameters',
                  default: false,
                },
              },
            },
          },
          {
            name: 'add_component',
            description: 'Add a reusable component to a specific slide in a presentation',
            inputSchema: {
              type: 'object',
              properties: {
                deckPath: {
                  type: 'string',
                  description: 'Path to the Slidev presentation directory',
                },
                componentId: {
                  type: 'string',
                  description: 'Component identifier (e.g., "hatch/interactive-arrows")',
                },
                slideNumber: {
                  type: 'number',
                  description: 'Slide number to add component to (1-based)',
                },
                position: {
                  type: 'string',
                  enum: ['top', 'center', 'bottom', 'replace'],
                  description: 'Position on slide to insert component',
                  default: 'center',
                },
                parameters: {
                  type: 'object',
                  description: 'Component-specific parameters and configuration',
                },
              },
              required: ['deckPath', 'componentId', 'slideNumber'],
            },
          },
          {
            name: 'install_component',
            description: 'Install a component from various sources (npm, git, local path, or URL)',
            inputSchema: {
              type: 'object',
              properties: {
                source: {
                  type: 'string',
                  description: 'Component source (URL, npm package, git repo, or local path)',
                },
                targetPath: {
                  type: 'string',
                  description: 'Target directory to install component to',
                },
                componentId: {
                  type: 'string',
                  description: 'Component identifier override (if different from source)',
                },
                options: {
                  type: 'object',
                  properties: {
                    force: {
                      type: 'boolean',
                      description: 'Force overwrite if component already exists',
                      default: false,
                    },
                    dev: {
                      type: 'boolean',
                      description: 'Install as development/testing component',
                      default: false,
                    },
                    scope: {
                      type: 'string',
                      enum: ['hatch', 'public', 'personal'],
                      description: 'Custom scope for the component',
                      default: 'hatch',
                    },
                  },
                },
              },
              required: ['source', 'targetPath'],
            },
          },
          {
            name: 'publish_component',
            description: 'Publish a component to share with colleagues through various distribution methods',
            inputSchema: {
              type: 'object',
              properties: {
                componentId: {
                  type: 'string',
                  description: 'Component identifier to publish',
                },
                componentPath: {
                  type: 'string',
                  description: 'Component directory path',
                },
                targetScope: {
                  type: 'string',
                  enum: ['hatch', 'public'],
                  description: 'Target scope for publishing',
                },
                options: {
                  type: 'object',
                  properties: {
                    version: {
                      type: 'string',
                      description: 'Component version (semantic versioning)',
                      default: '1.0.0',
                    },
                    releaseNotes: {
                      type: 'string',
                      description: 'Release notes or changelog',
                    },
                    featured: {
                      type: 'boolean',
                      description: 'Make component featured/promoted',
                      default: false,
                    },
                    method: {
                      type: 'string',
                      enum: ['registry', 'package', 'git', 'share-link'],
                      description: 'Publishing method',
                      default: 'registry',
                    },
                    metadata: {
                      type: 'object',
                      properties: {
                        author: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        documentation: { type: 'string' },
                        examples: { type: 'array', items: { type: 'string' } },
                      },
                    },
                  },
                },
              },
              required: ['componentId', 'componentPath', 'targetScope'],
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

          case 'create_component':
            return await createComponent(args as unknown as CreateComponentArgs);

          case 'list_components':
            return await listComponents(args as unknown as ListComponentsArgs);

          case 'add_component':
            return await addComponent(args as unknown as AddComponentArgs);

          case 'install_component':
            return await installComponent(args as unknown as InstallComponentArgs);

          case 'publish_component':
            return await publishComponent(args as unknown as PublishComponentArgs);

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
