import * as fs from 'fs-extra';
import * as path from 'path';

export interface ApplyThemeArgs {
  deckPath: string;
  theme: string;
  customizations?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };
}

export async function applyTheme(args: ApplyThemeArgs) {
  const { deckPath, theme, customizations = {} } = args;

  try {
    const slidesPath = path.join(deckPath, 'slides.md');
    
    if (!await fs.pathExists(slidesPath)) {
      throw new Error(`Slides file not found at ${slidesPath}`);
    }

    // Read current slides content
    const content = await fs.readFile(slidesPath, 'utf-8');
    
    // Extract frontmatter and slides
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      throw new Error('Invalid slides.md format - no frontmatter found');
    }

    const [, frontmatterContent, slidesContent] = frontmatterMatch;
    const frontmatter = parseFrontmatter(frontmatterContent);

    // Update theme in frontmatter
    frontmatter.theme = theme;

    // Apply theme-specific configurations
    const themeConfig = getThemeConfiguration(theme, customizations);
    Object.assign(frontmatter, themeConfig);

    // Create custom CSS if customizations provided
    let customCSS = '';
    if (customizations.primaryColor || customizations.secondaryColor || customizations.fontFamily || customizations.customCSS) {
      customCSS = generateCustomCSS(customizations);
      
      // Write custom CSS file
      const cssPath = path.join(deckPath, 'style.css');
      await fs.writeFile(cssPath, customCSS);
    }

    // Copy theme files if it's a Hatch theme
    if (theme.startsWith('hatch-')) {
      await copyHatchThemeFiles(theme, deckPath);
    }

    // Reconstruct slides.md with updated frontmatter
    const updatedFrontmatter = stringifyFrontmatter(frontmatter);
    const updatedContent = `---\n${updatedFrontmatter}\n---\n${slidesContent}`;

    await fs.writeFile(slidesPath, updatedContent);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully applied theme: ${theme}\n\n` +
                `📁 Deck Path: ${deckPath}\n` +
                `🎨 Theme: ${theme}\n` +
                `🎛️ Customizations: ${Object.keys(customizations).length > 0 ? 'Applied' : 'None'}\n` +
                `${customCSS ? '📄 Custom CSS created: style.css\n' : ''}` +
                `${theme.startsWith('hatch-') ? '🏢 Hatch branding applied\n' : ''}\n` +
                `Theme Configuration:\n\`\`\`yaml\n${updatedFrontmatter}\n\`\`\``
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to apply theme: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseFrontmatter(content: string): Record<string, any> {
  const lines = content.split('\n');
  const result: Record<string, any> = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value: any = trimmed.substring(colonIndex + 1).trim();
    
    // Parse value
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (!isNaN(Number(value)) && value !== '') value = Number(value);
    else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    
    result[key] = value;
  }
  
  return result;
}

function stringifyFrontmatter(obj: Record<string, any>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  
  return lines.join('\n');
}

function getThemeConfiguration(theme: string, customizations: any): Record<string, any> {
  const baseConfig: Record<string, any> = {
    background: '#ffffff',
    highlighter: 'shiki',
    lineNumbers: false,
    info: false,
    drawings: {
      enabled: true,
      persist: false,
      presenterOnly: false,
      syncAll: true
    },
    transition: 'slide-left',
    mdc: true,
    colorSchema: 'auto',
    routerMode: 'history',
    aspectRatio: '16/9',
    canvasWidth: 1280
  };

  switch (theme) {
    case 'hatch-corporate':
      return {
        ...baseConfig,
        background: 'linear-gradient(135deg, #00A651, #004225)',
        class: 'text-center',
        fonts: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          serif: ['ui-serif', 'Georgia'],
          mono: ['Fira Code', 'ui-monospace']
        },
        themeConfig: {
          primary: customizations.primaryColor || '#00A651',
          secondary: customizations.secondaryColor || '#004225',
          accent: '#FFB800',
          background: '#FFFFFF',
          text: '#333333'
        }
      };

    case 'hatch-technical':
      return {
        ...baseConfig,
        background: '#f8fafc',
        class: 'text-left',
        lineNumbers: true,
        fonts: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace']
        },
        themeConfig: {
          primary: customizations.primaryColor || '#00A651',
          secondary: customizations.secondaryColor || '#1e293b',
          accent: '#FFB800',
          background: '#f8fafc',
          text: '#1e293b'
        }
      };

    case 'hatch-minimal':
      return {
        ...baseConfig,
        background: '#ffffff',
        class: 'text-center',
        transition: 'fade',
        fonts: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui']
        },
        themeConfig: {
          primary: customizations.primaryColor || '#00A651',
          secondary: customizations.secondaryColor || '#6b7280',
          accent: '#FFB800',
          background: '#ffffff',
          text: '#374151'
        }
      };

    case 'default':
      return baseConfig;

    default:
      return {
        ...baseConfig,
        themeConfig: {
          primary: customizations.primaryColor || '#3b82f6',
          secondary: customizations.secondaryColor || '#1e40af',
          accent: '#f59e0b'
        }
      };
  }
}

function generateCustomCSS(customizations: any): string {
  const { primaryColor, secondaryColor, fontFamily, customCSS } = customizations;
  
  let css = `/* Custom Theme Overrides */\n\n`;
  
  if (primaryColor || secondaryColor || fontFamily) {
    css += `:root {\n`;
    if (primaryColor) css += `  --slidev-theme-primary: ${primaryColor};\n`;
    if (secondaryColor) css += `  --slidev-theme-secondary: ${secondaryColor};\n`;
    if (fontFamily) css += `  --slidev-theme-font-family: ${fontFamily};\n`;
    css += `}\n\n`;
  }

  if (primaryColor) {
    css += `.slidev-layout {\n`;
    css += `  --hatch-primary: ${primaryColor};\n`;
    css += `}\n\n`;
    
    css += `.text-hatch-primary {\n`;
    css += `  color: ${primaryColor} !important;\n`;
    css += `}\n\n`;
    
    css += `.bg-hatch-primary {\n`;
    css += `  background-color: ${primaryColor} !important;\n`;
    css += `}\n\n`;
  }

  if (secondaryColor) {
    css += `.slidev-layout {\n`;
    css += `  --hatch-secondary: ${secondaryColor};\n`;
    css += `}\n\n`;
    
    css += `.text-hatch-secondary {\n`;
    css += `  color: ${secondaryColor} !important;\n`;
    css += `}\n\n`;
    
    css += `.bg-hatch-secondary {\n`;
    css += `  background-color: ${secondaryColor} !important;\n`;
    css += `}\n\n`;
  }

  if (fontFamily) {
    css += `.slidev-layout {\n`;
    css += `  font-family: ${fontFamily}, sans-serif;\n`;
    css += `}\n\n`;
  }

  // Hatch-specific styles
  css += `/* Hatch Brand Styles */\n`;
  css += `.hatch-header {\n`;
  css += `  background: var(--hatch-primary, #00A651);\n`;
  css += `  color: white;\n`;
  css += `  padding: 1rem;\n`;
  css += `  font-weight: bold;\n`;
  css += `}\n\n`;

  css += `.hatch-footer {\n`;
  css += `  background: var(--hatch-secondary, #004225);\n`;
  css += `  color: white;\n`;
  css += `  padding: 0.5rem 1rem;\n`;
  css += `  font-size: 0.875rem;\n`;
  css += `  display: flex;\n`;
  css += `  justify-content: space-between;\n`;
  css += `  align-items: center;\n`;
  css += `}\n\n`;

  css += `.hatch-logo {\n`;
  css += `  height: 2rem;\n`;
  css += `  width: auto;\n`;
  css += `}\n\n`;

  // Add custom CSS if provided
  if (customCSS) {
    css += `/* User Custom CSS */\n`;
    css += customCSS;
    css += `\n\n`;
  }

  return css;
}

async function copyHatchThemeFiles(theme: string, deckPath: string): Promise<void> {
  try {
    const themesDir = path.join(__dirname, '..', 'templates', 'styles');
    const themeSourcePath = path.join(themesDir, theme);
    const themeDestPath = path.join(deckPath, 'themes', theme);

    if (await fs.pathExists(themeSourcePath)) {
      await fs.copy(themeSourcePath, themeDestPath);
    } else {
      // Create basic theme structure
      await fs.ensureDir(themeDestPath);
      
      const themeIndex = `import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname)
    }
  }
})
`;
      
      await fs.writeFile(path.join(themeDestPath, 'index.ts'), themeIndex);
      
      const themePackageJson = {
        name: `@hatch/slidev-theme-${theme.replace('hatch-', '')}`,
        version: '1.0.0',
        keywords: ['slidev-theme', 'hatch'],
        engines: {
          slidev: '>=0.47.0'
        }
      };
      
      await fs.writeFile(
        path.join(themeDestPath, 'package.json'),
        JSON.stringify(themePackageJson, null, 2)
      );
    }
  } catch (error) {
    console.warn(`Warning: Could not copy theme files for ${theme}:`, error);
  }
}
