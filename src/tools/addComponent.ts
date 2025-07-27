import * as fs from 'fs-extra';
import * as path from 'path';

export interface AddComponentArgs {
  deckPath: string;
  slideNumber?: number;
  componentName: string;
  parameters: Record<string, any>;
  position?: { x: number; y: number };
  styling?: {
    width?: number;
    height?: number;
    className?: string;
  };
}

export async function addComponent(args: AddComponentArgs) {
  const { deckPath, slideNumber, componentName, parameters, position, styling } = args;

  try {
    // Validate component exists
    const component = await getComponentConfig(componentName);
    if (!component) {
      throw new Error(`Component '${componentName}' not found. Use 'list_components' to see available components.`);
    }

    // Validate parameters
    await validateComponentParameters(component, parameters);

    // Determine target slide
    let targetSlide: string;
    if (slideNumber) {
      targetSlide = path.join(deckPath, 'slides', `${String(slideNumber).padStart(3, '0')}.md`);
    } else {
      // Add to main slides.md file
      targetSlide = path.join(deckPath, 'slides.md');
    }

    if (!await fs.pathExists(targetSlide)) {
      throw new Error(`Target slide not found: ${targetSlide}`);
    }

    // Read current slide content
    const slideContent = await fs.readFile(targetSlide, 'utf-8');

    // Generate component markup
    const componentMarkup = await generateComponentMarkup(
      componentName, 
      parameters, 
      position, 
      styling
    );

    // Insert component into slide
    const updatedContent = await insertComponentIntoSlide(slideContent, componentMarkup);

    // Write updated slide
    await fs.writeFile(targetSlide, updatedContent);

    // Copy component files to presentation
    await copyComponentToDeck(componentName, deckPath);

    // Update component usage statistics
    await updateComponentStats(componentName);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully added component: ${componentName}\n\n` +
                `📁 Target: ${targetSlide}\n` +
                `📦 Component: ${component.description}\n` +
                `👤 Author: ${component.author}\n` +
                `📐 Position: ${position ? `(${position.x}, ${position.y})` : 'Default'}\n` +
                `🎛️ Parameters: ${Object.keys(parameters).length}\n` +
                `${styling ? `🎨 Custom Styling: Applied\n` : ''}` +
                `\n📊 Component Details:\n` +
                `${Object.entries(parameters).map(([key, value]) => 
                  `  • ${key}: ${JSON.stringify(value)}`
                ).join('\n')}\n` +
                `\n🚀 Next Steps:\n` +
                `1. Preview your presentation with: npm run dev\n` +
                `2. Export when ready with: export_deck\n` +
                `3. Share component feedback with the author`
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to add component: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function getComponentConfig(componentName: string): Promise<any> {
  const registryPath = path.join(__dirname, '..', 'components', 'registry.json');
  
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryContent);
    return registry.components[componentName];
  } catch (error) {
    return null;
  }
}

async function validateComponentParameters(component: any, parameters: Record<string, any>): Promise<void> {
  const componentParams = component.parameters || {};
  
  // Check required parameters
  for (const [paramName, paramConfig] of Object.entries(componentParams)) {
    const config = paramConfig as any;
    if (config.required && !(paramName in parameters)) {
      throw new Error(`Required parameter '${paramName}' is missing`);
    }
  }
  
  // Validate parameter types and values
  for (const [paramName, value] of Object.entries(parameters)) {
    const paramConfig = componentParams[paramName] as any;
    if (!paramConfig) {
      console.warn(`Unknown parameter '${paramName}' for component. Proceeding anyway.`);
      continue;
    }
    
    // Type validation
    const expectedType = paramConfig.type;
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (expectedType === 'enum') {
      if (!paramConfig.options?.includes(value)) {
        throw new Error(`Parameter '${paramName}' must be one of: ${paramConfig.options?.join(', ')}`);
      }
    } else if (expectedType !== actualType && !(expectedType === 'number' && actualType === 'string' && !isNaN(Number(value)))) {
      throw new Error(`Parameter '${paramName}' should be of type '${expectedType}', got '${actualType}'`);
    }
    
    // Range validation for numbers
    if (expectedType === 'number') {
      const numValue = typeof value === 'string' ? Number(value) : value;
      if (paramConfig.min !== undefined && numValue < paramConfig.min) {
        throw new Error(`Parameter '${paramName}' must be >= ${paramConfig.min}`);
      }
      if (paramConfig.max !== undefined && numValue > paramConfig.max) {
        throw new Error(`Parameter '${paramName}' must be <= ${paramConfig.max}`);
      }
    }
  }
}

async function generateComponentMarkup(
  componentName: string, 
  parameters: Record<string, any>, 
  position?: { x: number; y: number },
  styling?: { width?: number; height?: number; className?: string }
): Promise<string> {
  const [scope, name] = componentName.split('/');
  
  // Generate Vue component usage
  const props = Object.entries(parameters)
    .map(([key, value]) => `:${key}="${JSON.stringify(value).replace(/"/g, '&quot;')}"`)
    .join('\n    ');
  
  const styleProps = [];
  if (styling?.width) styleProps.push(`width: ${styling.width}px`);
  if (styling?.height) styleProps.push(`height: ${styling.height}px`);
  if (position) {
    styleProps.push(`position: absolute`);
    styleProps.push(`left: ${position.x}px`);
    styleProps.push(`top: ${position.y}px`);
  }
  
  const styleAttr = styleProps.length > 0 ? ` style="${styleProps.join('; ')}"` : '';
  const classAttr = styling?.className ? ` class="${styling.className}"` : '';
  
  return `\n<!-- ${componentName} Component -->\n` +
         `<div class="component-wrapper"${styleAttr}${classAttr}>\n` +
         `  <${name.charAt(0).toUpperCase() + name.slice(1)}Component\n` +
         `    ${props}\n` +
         `  />\n` +
         `</div>\n\n`;
}

async function insertComponentIntoSlide(slideContent: string, componentMarkup: string): Promise<string> {
  // Parse slide content to find the best insertion point
  const lines = slideContent.split('\n');
  
  // Find the end of frontmatter
  let frontmatterEnd = -1;
  let inFrontmatter = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }
  
  // Insert after frontmatter or at the end
  let insertIndex = frontmatterEnd >= 0 ? frontmatterEnd + 1 : 0;
  
  // Look for existing content and insert before closing
  const contentEnd = lines.findIndex(line => line.trim().startsWith('---') && frontmatterEnd < 0);
  if (contentEnd > 0) {
    insertIndex = contentEnd;
  } else {
    insertIndex = lines.length;
  }
  
  // Insert component markup
  lines.splice(insertIndex, 0, componentMarkup);
  
  return lines.join('\n');
}

async function copyComponentToDeck(componentName: string, deckPath: string): Promise<void> {
  const [scope, name] = componentName.split('/');
  const componentDir = path.join(__dirname, '..', 'components', scope, name);
  const deckComponentsDir = path.join(deckPath, 'components', scope);
  
  await fs.ensureDir(deckComponentsDir);
  
  // Copy component files
  const componentFiles = ['component.vue', 'styles.css', 'config.json'];
  for (const file of componentFiles) {
    const sourcePath = path.join(componentDir, file);
    const destPath = path.join(deckComponentsDir, name, file);
    
    if (await fs.pathExists(sourcePath)) {
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(sourcePath, destPath);
    }
  }
  
  // Update deck's component imports
  await updateDeckComponentImports(deckPath, componentName);
}

async function updateDeckComponentImports(deckPath: string, componentName: string): Promise<void> {
  const [scope, name] = componentName.split('/');
  const setupPath = path.join(deckPath, 'setup', 'main.ts');
  
  await fs.ensureDir(path.dirname(setupPath));
  
  let setupContent = '';
  if (await fs.pathExists(setupPath)) {
    setupContent = await fs.readFile(setupPath, 'utf-8');
  }
  
  // Add component import if not already present
  const importStatement = `import ${name.charAt(0).toUpperCase() + name.slice(1)}Component from '../components/${scope}/${name}/component.vue'`;
  const registerStatement = `app.component('${name.charAt(0).toUpperCase() + name.slice(1)}Component', ${name.charAt(0).toUpperCase() + name.slice(1)}Component)`;
  
  if (!setupContent.includes(importStatement)) {
    setupContent += `\n${importStatement}\n`;
  }
  
  if (!setupContent.includes(registerStatement)) {
    // Add to setup function or create one
    if (setupContent.includes('export default')) {
      setupContent = setupContent.replace(
        'export default',
        `${registerStatement}\n\nexport default`
      );
    } else {
      setupContent += `\nimport { defineAppSetup } from '@slidev/types'\n\nexport default defineAppSetup(({ app, router }) => {\n  ${registerStatement}\n})\n`;
    }
  }
  
  await fs.writeFile(setupPath, setupContent);
}

async function updateComponentStats(componentName: string): Promise<void> {
  const registryPath = path.join(__dirname, '..', 'components', 'registry.json');
  
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryContent);
    
    if (registry.components[componentName]) {
      registry.components[componentName].downloads = (registry.components[componentName].downloads || 0) + 1;
      registry.components[componentName].lastUsed = new Date().toISOString();
      
      await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
    }
  } catch (error) {
    // Silently fail if can't update stats
    console.warn('Could not update component statistics:', error);
  }
}
