import * as fs from 'fs-extra';
import * as path from 'path';

export interface CreateComponentArgs {
  name: string;
  category: 'charts' | 'shapes' | 'layouts' | 'interactions' | 'frameworks';
  author: string;
  description: string;
  scope: 'hatch' | 'community';
  parameters?: ComponentParameter[];
}

export interface ComponentParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object';
  required: boolean;
  default?: any;
  options?: string[];  // For enum type
  description?: string;
}

export async function createComponent(args: CreateComponentArgs) {
  const { name, category, author, description, scope, parameters = [] } = args;

  try {
    // Create component directory structure
    const componentDir = path.join(__dirname, '..', 'components', scope, name);
    await fs.ensureDir(componentDir);

    // Generate component.vue file
    const vueComponent = generateVueComponent(name, parameters);
    await fs.writeFile(path.join(componentDir, 'component.vue'), vueComponent);

    // Generate config.json
    const config = {
      name: `${scope}/${name}`,
      version: '1.0.0',
      author,
      description,
      category,
      tags: [category, scope],
      parameters: parameters.reduce((acc, param) => {
        acc[param.name] = {
          type: param.type,
          required: param.required,
          default: param.default,
          options: param.options,
          description: param.description
        };
        return acc;
      }, {} as Record<string, any>),
      dependencies: ['vue-3'],
      created: new Date().toISOString(),
      examples: [`${name}-basic.md`]
    };

    await fs.writeFile(
      path.join(componentDir, 'config.json'), 
      JSON.stringify(config, null, 2)
    );

    // Generate styles.css
    const styles = generateComponentStyles(name, scope);
    await fs.writeFile(path.join(componentDir, 'styles.css'), styles);

    // Generate example file
    const example = generateExampleFile(name, parameters, scope);
    await fs.writeFile(path.join(componentDir, `${name}-basic.md`), example);

    // Generate package.json
    const packageJson = {
      name: `@${scope}/slidev-component-${name}`,
      version: '1.0.0',
      description,
      author,
      keywords: ['slidev', 'component', scope, category],
      peerDependencies: {
        'vue': '^3.0.0',
        '@slidev/client': '^0.47.0'
      }
    };

    await fs.writeFile(
      path.join(componentDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Update component registry
    await updateComponentRegistry(scope, name, config);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully created component: ${scope}/${name}\n\n` +
                `📁 Component Directory: ${componentDir}\n` +
                `📂 Category: ${category}\n` +
                `👤 Author: ${author}\n` +
                `🔧 Parameters: ${parameters.length}\n` +
                `📄 Files Created:\n` +
                `  • component.vue - Vue component\n` +
                `  • config.json - Component metadata\n` +
                `  • styles.css - Component styles\n` +
                `  • ${name}-basic.md - Usage example\n` +
                `  • package.json - Package configuration\n\n` +
                `🚀 Next Steps:\n` +
                `1. Edit component.vue to implement your component\n` +
                `2. Customize styles.css for visual design\n` +
                `3. Test with: add_component --name=${scope}/${name}\n` +
                `4. Publish with: publish_component --path=${componentDir}`
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to create component: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function generateVueComponent(name: string, parameters: ComponentParameter[]): string {
  const props = parameters.map(param => {
    let propDef = `${param.name}: {\n      type: ${getVueType(param.type)},\n      required: ${param.required}`;
    if (param.default !== undefined) {
      propDef += `,\n      default: ${JSON.stringify(param.default)}`;
    }
    propDef += '\n    }';
    return propDef;
  }).join(',\n    ');

  const paramBindings = parameters.map(p => p.name).join(', ');

  return `<template>
  <div class="${name}-component">
    <div class="component-header">
      <h3 class="component-title">{{ title || '${name.charAt(0).toUpperCase() + name.slice(1)} Component' }}</h3>
    </div>
    
    <div class="component-content">
      <!-- TODO: Implement your component logic here -->
      <div class="component-placeholder">
        <p>🚧 Component Implementation Needed</p>
        ${parameters.length > 0 ? `<div class="component-params">
          <h4>Available Parameters:</h4>
          <ul>
${parameters.map(p => `            <li><strong>${p.name}</strong>: {{ ${p.name} }}</li>`).join('\n')}
          </ul>
        </div>` : ''}
      </div>
    </div>
    
    <div class="component-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Component props based on parameters
const props = defineProps({
  title: {
    type: String,
    required: false
  },${props ? '\n  ' + props : ''}
})

// TODO: Add your component logic here
// Example:
// const computedValue = computed(() => {
//   return someCalculation(${paramBindings})
// })
</script>

<style scoped>
.${name}-component {
  /* Import component-specific styles */
  @import './styles.css';
}

.component-header {
  margin-bottom: 1rem;
}

.component-title {
  color: var(--hatch-primary, #00A651);
  font-weight: 600;
  margin: 0;
}

.component-content {
  flex: 1;
}

.component-placeholder {
  padding: 2rem;
  text-align: center;
  border: 2px dashed var(--hatch-gray, #CCCCCC);
  border-radius: 8px;
  background-color: var(--hatch-gray-light, #F5F5F5);
}

.component-params {
  margin-top: 1rem;
  text-align: left;
}

.component-params h4 {
  color: var(--hatch-secondary, #004225);
  margin-bottom: 0.5rem;
}

.component-params ul {
  list-style: none;
  padding: 0;
}

.component-params li {
  margin-bottom: 0.25rem;
  font-family: monospace;
  font-size: 0.9rem;
}
</style>`;
}

function generateComponentStyles(name: string, scope: string): string {
  return `/* ${scope}/${name} Component Styles */

.${name}-component {
  /* Base component styling */
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  
  /* Hatch brand integration */
  border: 1px solid var(--hatch-gray, #CCCCCC);
  background: var(--hatch-bg, #FFFFFF);
  color: var(--hatch-text, #333333);
  
  /* Animation */
  transition: all 0.2s ease;
}

.${name}-component:hover {
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.1);
  border-color: var(--hatch-primary, #00A651);
}

/* Component-specific styles - customize these */
.${name}-content {
  padding: 1rem;
}

.${name}-interactive {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.${name}-interactive:hover {
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .${name}-component {
    margin: 0.5rem 0;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .${name}-component {
    background: var(--hatch-dark-bg, #1a1a1a);
    color: var(--hatch-dark-text, #e5e5e5);
  }
}`;
}

function generateExampleFile(name: string, parameters: ComponentParameter[], scope: string): string {
  const exampleParams = parameters.map(param => {
    let value;
    switch (param.type) {
      case 'string':
        value = param.options ? `"${param.options[0]}"` : `"Example ${param.name}"`;
        break;
      case 'number':
        value = param.default || 42;
        break;
      case 'boolean':
        value = param.default || true;
        break;
      case 'enum':
        value = param.options ? `"${param.options[0]}"` : '"option1"';
        break;
      case 'array':
        value = '[1, 2, 3]';
        break;
      default:
        value = '{}';
    }
    return `    ${param.name}: ${value}`;
  }).join(',\n');

  return `# ${name} Component Example

This example shows how to use the \`${scope}/${name}\` component in your presentations.

## Basic Usage

\`\`\`javascript
// Add the component to a slide
await mcp.callTool('add_component', {
  deckPath: './my-presentation',
  slideNumber: 2,
  componentName: '${scope}/${name}',
  parameters: {
${exampleParams}
  },
  position: { x: 100, y: 100 }
});
\`\`\`

## Component Parameters

${parameters.map(param => 
  `- **${param.name}** (${param.type}${param.required ? ', required' : ', optional'}): ${param.description || 'Parameter description'}`
).join('\n')}

## Advanced Usage

\`\`\`javascript
// Using with dynamic data
await mcp.callTool('add_component', {
  componentName: '${scope}/${name}',
  parameters: {
${exampleParams},
    // Add any additional customization
  },
  styling: {
    width: 800,
    height: 400
  }
});
\`\`\`

## Tips

- This component integrates seamlessly with Hatch themes
- Use \`list_components --search="${name}"\` to find related components
- Combine with other components for complex layouts

## Next Steps

1. Customize the component parameters for your use case
2. Try different styling options
3. Combine with other ${scope} components
4. Share feedback with the component author
`;
}

function getVueType(paramType: string): string {
  switch (paramType) {
    case 'string': return 'String';
    case 'number': return 'Number';
    case 'boolean': return 'Boolean';
    case 'array': return 'Array';
    case 'object': return 'Object';
    default: return 'String';
  }
}

async function updateComponentRegistry(scope: string, name: string, config: any): Promise<void> {
  const registryPath = path.join(__dirname, '..', 'components', 'registry.json');
  
  let registry;
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    registry = JSON.parse(registryContent);
  } catch (error) {
    // Create new registry if it doesn't exist
    registry = { components: {} };
  }

  registry.components[`${scope}/${name}`] = config;
  
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
}
