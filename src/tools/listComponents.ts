import * as fs from 'fs-extra';
import * as path from 'path';

export interface ListComponentsArgs {
  category?: 'charts' | 'shapes' | 'layouts' | 'interactions' | 'frameworks';
  scope?: 'hatch' | 'community' | 'all';
  search?: string;
  author?: string;
}

export async function listComponents(args: ListComponentsArgs = {}) {
  const { category, scope = 'all', search, author } = args;

  try {
    // Read component registry
    const registryPath = path.join(__dirname, '..', 'components', 'registry.json');
    
    let registry;
    try {
      const registryContent = await fs.readFile(registryPath, 'utf-8');
      registry = JSON.parse(registryContent);
    } catch (error) {
      // Create empty registry if it doesn't exist
      registry = { components: {} };
      await fs.ensureDir(path.dirname(registryPath));
      await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
    }

    // Filter components based on criteria
    let components = Object.entries(registry.components);

    if (scope !== 'all') {
      components = components.filter(([name]) => name.startsWith(`${scope}/`));
    }

    if (category) {
      components = components.filter(([_, config]: [string, any]) => 
        config.category === category
      );
    }

    if (author) {
      components = components.filter(([_, config]: [string, any]) => 
        config.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (search) {
      components = components.filter(([name, config]: [string, any]) => 
        name.toLowerCase().includes(search.toLowerCase()) ||
        config.description.toLowerCase().includes(search.toLowerCase()) ||
        config.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Sort by popularity (downloads) and name
    components.sort(([nameA, configA]: [string, any], [nameB, configB]: [string, any]) => {
      const downloadsA = configA.downloads || 0;
      const downloadsB = configB.downloads || 0;
      if (downloadsA !== downloadsB) {
        return downloadsB - downloadsA; // Sort by downloads desc
      }
      return nameA.localeCompare(nameB); // Then by name
    });

    // Format output
    if (components.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `📭 No components found matching your criteria.\n\n` +
                  `🔍 Search criteria:\n` +
                  `${category ? `  • Category: ${category}\n` : ''}` +
                  `${scope !== 'all' ? `  • Scope: ${scope}\n` : ''}` +
                  `${search ? `  • Search: "${search}"\n` : ''}` +
                  `${author ? `  • Author: "${author}"\n` : ''}` +
                  `\n💡 Try:\n` +
                  `  • Broadening your search criteria\n` +
                  `  • Using list_components without filters\n` +
                  `  • Creating a new component with create_component`
          }
        ]
      };
    }

    // Generate component list
    const componentList = components.map(([name, config]: [string, any]) => {
      const scope = name.split('/')[0];
      const componentName = name.split('/')[1];
      const downloads = config.downloads || 0;
      const rating = config.rating || 0;
      const version = config.version || '1.0.0';
      
      return `## 📦 **${name}** (v${version})\n` +
             `${config.description}\n\n` +
             `**Details:**\n` +
             `- 👤 **Author:** ${config.author}\n` +
             `- 📂 **Category:** ${config.category}\n` +
             `- 🏷️ **Tags:** ${config.tags.join(', ')}\n` +
             `- 📊 **Downloads:** ${downloads.toLocaleString()}\n` +
             `${rating > 0 ? `- ⭐ **Rating:** ${rating}/5\n` : ''}` +
             `\n**Parameters:**\n` +
             `${Object.entries(config.parameters || {}).map(([paramName, paramConfig]: [string, any]) => 
               `- \`${paramName}\` (${paramConfig.type}${paramConfig.required ? ', required' : ''}): ${paramConfig.description || 'No description'}`
             ).join('\n')}\n` +
             `\n**Usage:**\n` +
             `\`\`\`javascript\n` +
             `await mcp.callTool('add_component', {\n` +
             `  componentName: '${name}',\n` +
             `  parameters: {\n` +
             `${Object.entries(config.parameters || {}).map(([paramName, paramConfig]: [string, any]) => 
               `    ${paramName}: ${getExampleValue(paramConfig)}`
             ).join(',\n')}\n` +
             `  }\n` +
             `});\n` +
             `\`\`\`\n`;
    }).join('\n---\n\n');

    const summary = `📋 **Component Library** (${components.length} component${components.length !== 1 ? 's' : ''} found)\n\n` +
                   `🔍 **Filters Applied:**\n` +
                   `${category ? `  • Category: ${category}\n` : ''}` +
                   `${scope !== 'all' ? `  • Scope: ${scope}\n` : ''}` +
                   `${search ? `  • Search: "${search}"\n` : ''}` +
                   `${author ? `  • Author: "${author}"\n` : ''}` +
                   `\n📊 **Categories Available:**\n` +
                   `${getAvailableCategories(registry.components)}\n` +
                   `\n🏷️ **Scopes Available:**\n` +
                   `${getAvailableScopes(registry.components)}\n\n` +
                   `---\n\n`;

    return {
      content: [
        {
          type: 'text',
          text: summary + componentList + 
                `\n---\n\n💡 **Quick Commands:**\n` +
                `- Install: \`install_component <component-name>\`\n` +
                `- Use: \`add_component --name=<component-name>\`\n` +
                `- Create: \`create_component --name=<new-name>\`\n` +
                `- Search: \`list_components --search="<keyword>"\``
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to list components: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function getExampleValue(paramConfig: any): string {
  const { type, default: defaultValue, options } = paramConfig;
  
  if (defaultValue !== undefined) {
    return JSON.stringify(defaultValue);
  }
  
  switch (type) {
    case 'string':
      return options ? `"${options[0]}"` : '"example"';
    case 'number':
      return '42';
    case 'boolean':
      return 'true';
    case 'enum':
      return options ? `"${options[0]}"` : '"option1"';
    case 'array':
      return '[1, 2, 3]';
    case 'object':
      return '{}';
    default:
      return '"value"';
  }
}

function getAvailableCategories(components: Record<string, any>): string {
  const categories = new Set<string>();
  Object.values(components).forEach((config: any) => {
    if (config.category) categories.add(config.category);
  });
  
  const categoryList = Array.from(categories).sort();
  return categoryList.map(cat => `  • ${cat}`).join('\n') || '  • No categories available';
}

function getAvailableScopes(components: Record<string, any>): string {
  const scopes = new Set<string>();
  Object.keys(components).forEach(name => {
    const scope = name.split('/')[0];
    scopes.add(scope);
  });
  
  const scopeList = Array.from(scopes).sort();
  return scopeList.map(scope => `  • ${scope}`).join('\n') || '  • No scopes available';
}
