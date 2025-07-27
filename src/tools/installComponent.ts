import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Arguments for installing a component from a remote source or package
 */
export interface InstallComponentArgs {
  /** Component source (URL, npm package, or local path) */
  source: string;
  /** Target directory to install component to */
  targetPath: string;
  /** Component identifier override (if different from source) */
  componentId?: string;
  /** Installation options */
  options?: {
    /** Force overwrite if component already exists */
    force?: boolean;
    /** Install as development/testing component */
    dev?: boolean;
    /** Custom scope for the component */
    scope?: 'hatch' | 'public' | 'personal';
  };
}

/**
 * Install a component from various sources (npm, git, local path, or URL)
 * Supports installing components into the local component library
 */
export async function installComponent(args: InstallComponentArgs) {
  try {
    const { source, targetPath, componentId, options = {} } = args;
    const { force = false, dev = false, scope = 'hatch' } = options;

    // Validate target path
    const absoluteTargetPath = path.resolve(targetPath);
    await fs.mkdir(absoluteTargetPath, { recursive: true });

    // Determine installation type based on source
    const installationType = detectSourceType(source);
    
    console.log(`Installing component from ${installationType} source: ${source}`);

    let installedComponentId: string;
    let componentMetadata: any;

    switch (installationType) {
      case 'npm':
        try {
          const result = await installFromNpm(source, absoluteTargetPath, componentId, force);
          installedComponentId = result.componentId;
          componentMetadata = result.metadata;
        } catch (error) {
          throw error;
        }
        break;
      
      case 'git':
        try {
          const result = await installFromGit(source, absoluteTargetPath, componentId, force);
          installedComponentId = result.componentId;
          componentMetadata = result.metadata;
        } catch (error) {
          throw error;
        }
        break;
      
      case 'url':
        try {
          const result = await installFromUrl(source, absoluteTargetPath, componentId, force);
          installedComponentId = result.componentId;
          componentMetadata = result.metadata;
        } catch (error) {
          throw error;
        }
        break;
      
      case 'local':
        try {
          const result = await installFromLocal(source, absoluteTargetPath, componentId, force);
          installedComponentId = result.componentId;
          componentMetadata = result.metadata;
        } catch (error) {
          throw error;
        }
        break;
      
      default:
        throw new Error(`Unsupported source type: ${source}`);
    }

    // Update component registry
    await updateRegistryAfterInstall(installedComponentId, componentMetadata, scope, dev);

    // Validate installed component
    await validateInstalledComponent(path.join(absoluteTargetPath, installedComponentId));

    const result = {
      success: true,
      componentId: installedComponentId,
      installedPath: path.join(absoluteTargetPath, installedComponentId),
      source,
      installationType,
      metadata: componentMetadata,
    };

    return {
      content: [
        {
          type: 'text',
          text: `✅ Component successfully installed!\n\n` +
                `📦 Component ID: ${installedComponentId}\n` +
                `📍 Installed to: ${result.installedPath}\n` +
                `🔗 Source: ${source}\n` +
                `📋 Type: ${installationType}\n` +
                `🏷️ Scope: ${scope}\n` +
                `${dev ? '🚧 Development mode enabled\n' : ''}` +
                `\n📝 Component Details:\n` +
                `   • Name: ${componentMetadata.name || 'N/A'}\n` +
                `   • Version: ${componentMetadata.version || 'N/A'}\n` +
                `   • Description: ${componentMetadata.description || 'N/A'}\n` +
                `   • Category: ${componentMetadata.category || 'N/A'}\n` +
                `\n🎯 Ready to use with: add_component tool`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Failed to install component: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Detect the type of source (npm, git, url, local)
 */
function detectSourceType(source: string): 'npm' | 'git' | 'url' | 'local' {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    if (source.includes('github.com') || source.includes('gitlab.com') || source.endsWith('.git')) {
      return 'git';
    }
    return 'url';
  }
  
  if (source.startsWith('./') || source.startsWith('../') || path.isAbsolute(source)) {
    return 'local';
  }
  
  // Assume npm package if none of the above
  return 'npm';
}

/**
 * Install component from npm package
 */
async function installFromNpm(
  packageName: string, 
  targetPath: string, 
  componentId?: string, 
  force: boolean = false
): Promise<{ componentId: string; metadata: any }> {
  // For now, this would be a placeholder that could integrate with npm
  // In a real implementation, you'd use npm/yarn APIs or child_process to install
  throw new Error('NPM installation not yet implemented. Please use local or URL sources for now.');
}

/**
 * Install component from git repository
 */
async function installFromGit(
  gitUrl: string, 
  targetPath: string, 
  componentId?: string, 
  force: boolean = false
): Promise<{ componentId: string; metadata: any }> {
  // For now, this would be a placeholder that could integrate with git
  // In a real implementation, you'd use git clone or similar
  throw new Error('Git installation not yet implemented. Please use local or URL sources for now.');
}

/**
 * Install component from URL (zip file or direct component)
 */
async function installFromUrl(
  url: string, 
  targetPath: string, 
  componentId?: string, 
  force: boolean = false
): Promise<{ componentId: string; metadata: any }> {
  // For now, this would be a placeholder for HTTP download
  // In a real implementation, you'd download and extract the component
  throw new Error('URL installation not yet implemented. Please use local sources for now.');
}

/**
 * Install component from local path
 */
async function installFromLocal(
  sourcePath: string, 
  targetPath: string, 
  componentId?: string, 
  force: boolean = false
): Promise<{ componentId: string; metadata: any }> {
  const absoluteSourcePath = path.resolve(sourcePath);
  
  // Check if source exists
  try {
    await fs.access(absoluteSourcePath);
  } catch {
    throw new Error(`Source path not found: ${absoluteSourcePath}`);
  }

  // Load component metadata
  const metadataPath = path.join(absoluteSourcePath, 'component.json');
  let metadata: any = {};
  
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    metadata = JSON.parse(metadataContent);
  } catch {
    // If no metadata file, try to infer from directory structure
    metadata = await inferComponentMetadata(absoluteSourcePath);
  }

  const finalComponentId = componentId || metadata.id || path.basename(absoluteSourcePath);
  const componentTargetPath = path.join(targetPath, finalComponentId);

  // Check if component already exists
  try {
    await fs.access(componentTargetPath);
    if (!force) {
      throw new Error(`Component already exists at ${componentTargetPath}. Use force: true to overwrite.`);
    }
    await fs.rm(componentTargetPath, { recursive: true });
  } catch (error) {
    // Component doesn't exist, which is fine
    if (error instanceof Error && !error.message.includes('ENOENT')) {
      throw error;
    }
  }

  // Copy component files
  await copyDirectory(absoluteSourcePath, componentTargetPath);

  return {
    componentId: finalComponentId,
    metadata: {
      ...metadata,
      id: finalComponentId,
      installedAt: new Date().toISOString(),
      source: sourcePath,
    },
  };
}

/**
 * Copy directory recursively
 */
async function copyDirectory(source: string, destination: string) {
  await fs.mkdir(destination, { recursive: true });
  
  const entries = await fs.readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

/**
 * Infer component metadata from directory structure
 */
async function inferComponentMetadata(componentPath: string) {
  const metadata: any = {
    id: path.basename(componentPath),
    name: path.basename(componentPath),
    version: '1.0.0',
    category: 'custom',
    scope: 'personal',
    description: 'Imported component',
  };

  // Try to find Vue component file
  const files = await fs.readdir(componentPath);
  const vueFile = files.find(file => file.endsWith('.vue'));
  
  if (vueFile) {
    metadata.component = vueFile;
    
    // Try to extract info from Vue file
    try {
      const vueContent = await fs.readFile(path.join(componentPath, vueFile), 'utf-8');
      
      // Extract component name from Vue file
      const nameMatch = vueContent.match(/name:\s*['"`]([^'"`]+)['"`]/);
      if (nameMatch) {
        metadata.name = nameMatch[1];
      }
      
      // Look for props to infer parameters
      const propsMatch = vueContent.match(/props:\s*{([^}]+)}/s);
      if (propsMatch) {
        metadata.parameters = extractPropsFromVue(propsMatch[1]);
      }
    } catch {
      // Ignore errors in parsing Vue file
    }
  }

  return metadata;
}

/**
 * Extract props from Vue component props definition
 */
function extractPropsFromVue(propsString: string) {
  const parameters = [];
  
  // Simple regex to find prop definitions
  const propMatches = propsString.match(/(\w+):\s*{[^}]*}/g) || [];
  
  for (const propMatch of propMatches) {
    const nameMatch = propMatch.match(/(\w+):/);
    if (nameMatch) {
      parameters.push({
        name: nameMatch[1],
        type: 'string', // Default type
        required: false,
        description: `Auto-detected parameter: ${nameMatch[1]}`,
      });
    }
  }
  
  return parameters;
}

/**
 * Update component registry after successful installation
 */
async function updateRegistryAfterInstall(
  componentId: string, 
  metadata: any, 
  scope: string, 
  dev: boolean
) {
  const registryPath = path.resolve(__dirname, '../components/registry.json');
  
  let registry: any;
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    registry = JSON.parse(registryContent);
  } catch {
    registry = { components: {} };
  }

  // Add component to registry
  registry.components[componentId] = {
    ...metadata,
    scope,
    development: dev,
    installedAt: new Date().toISOString(),
    status: 'active',
  };

  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
}

/**
 * Validate that the installed component has required files
 */
async function validateInstalledComponent(componentPath: string) {
  try {
    await fs.access(componentPath);
    
    // Check for essential files
    const files = await fs.readdir(componentPath);
    
    // Should have at least a Vue component or index file
    const hasVueComponent = files.some(file => file.endsWith('.vue'));
    const hasIndexFile = files.some(file => file.startsWith('index.'));
    
    if (!hasVueComponent && !hasIndexFile) {
      throw new Error('Invalid component: missing Vue component or index file');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Component validation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
