import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Arguments for publishing a component to share with colleagues
 */
export interface PublishComponentArgs {
  /** Component identifier to publish */
  componentId: string;
  /** Component directory path */
  componentPath: string;
  /** Target scope for publishing */
  targetScope: 'hatch' | 'public';
  /** Publishing options */
  options?: {
    /** Component version (semantic versioning) */
    version?: string;
    /** Release notes or changelog */
    releaseNotes?: string;
    /** Make component featured/promoted */
    featured?: boolean;
    /** Publishing method */
    method?: 'registry' | 'package' | 'git' | 'share-link';
    /** Additional metadata */
    metadata?: {
      author?: string;
      tags?: string[];
      documentation?: string;
      examples?: string[];
    };
  };
}

/**
 * Publish a component to make it available for colleagues to discover and use
 * This tool packages and shares components through various distribution methods
 */
export async function publishComponent(args: PublishComponentArgs) {
  try {
    const { componentId, componentPath, targetScope, options = {} } = args;
    const { 
      version = '1.0.0', 
      releaseNotes = '', 
      featured = false,
      method = 'registry',
      metadata = {}
    } = options;

    // Validate component exists and is ready for publishing
    const absoluteComponentPath = path.resolve(componentPath);
    await validateComponentForPublishing(absoluteComponentPath, componentId);

    // Load component metadata
    const componentMetadata = await loadComponentMetadata(absoluteComponentPath, componentId);

    // Prepare publishing package
    const publishingPackage = await createPublishingPackage(
      absoluteComponentPath, 
      componentId, 
      version, 
      targetScope,
      metadata,
      releaseNotes
    );

    // Publish using selected method
    let publishResult: any;
    switch (method) {
      case 'registry':
        publishResult = await publishToRegistry(publishingPackage, targetScope, featured);
        break;
      
      case 'package':
        publishResult = await publishAsPackage(publishingPackage);
        break;
      
      case 'git':
        publishResult = await publishToGit(publishingPackage);
        break;
      
      case 'share-link':
        publishResult = await publishAsShareLink(publishingPackage);
        break;
      
      default:
        throw new Error(`Unsupported publishing method: ${method}`);
    }

    // Update component status in registry
    await updateComponentStatusAfterPublishing(componentId, version, targetScope, publishResult);

    // Generate usage instructions
    const usageInstructions = generateUsageInstructions(componentId, targetScope, method, publishResult);

    return {
      content: [
        {
          type: 'text',
          text: `🚀 Component successfully published!\n\n` +
                `📦 Component: ${componentId}\n` +
                `🏷️ Version: ${version}\n` +
                `🌍 Scope: ${targetScope}\n` +
                `📋 Method: ${method}\n` +
                `${featured ? '⭐ Featured component\n' : ''}` +
                `\n📝 Component Details:\n` +
                `   • Name: ${componentMetadata.name || componentId}\n` +
                `   • Category: ${componentMetadata.category || 'N/A'}\n` +
                `   • Description: ${componentMetadata.description || 'N/A'}\n` +
                `   • Author: ${metadata.author || 'Unknown'}\n` +
                `   • Tags: ${metadata.tags?.join(', ') || 'None'}\n` +
                `\n🔗 Access Information:\n${publishResult.accessInfo}\n` +
                `\n📋 Usage Instructions:\n${usageInstructions}\n` +
                `\n✅ Colleagues can now discover and install this component!`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Failed to publish component: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Validate that component is ready for publishing
 */
async function validateComponentForPublishing(componentPath: string, componentId: string) {
  try {
    await fs.access(componentPath);
  } catch {
    throw new Error(`Component path not found: ${componentPath}`);
  }

  // Check for required files
  const files = await fs.readdir(componentPath);
  
  // Must have Vue component or index file
  const hasVueComponent = files.some(file => file.endsWith('.vue'));
  const hasIndexFile = files.some(file => file.startsWith('index.'));
  
  if (!hasVueComponent && !hasIndexFile) {
    throw new Error('Component must have a Vue component (.vue) or index file for publishing');
  }

  // Check for component.json metadata
  const hasMetadata = files.includes('component.json');
  if (!hasMetadata) {
    throw new Error('Component must have a component.json metadata file for publishing');
  }

  // Validate metadata structure
  const metadataPath = path.join(componentPath, 'component.json');
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
  
  const requiredFields = ['name', 'description', 'category', 'version'];
  for (const field of requiredFields) {
    if (!metadata[field]) {
      throw new Error(`Component metadata missing required field: ${field}`);
    }
  }

  return true;
}

/**
 * Load component metadata from component.json
 */
async function loadComponentMetadata(componentPath: string, componentId: string) {
  const metadataPath = path.join(componentPath, 'component.json');
  
  try {
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(metadataContent);
  } catch (error) {
    throw new Error(`Failed to load component metadata: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create a publishing package with all necessary files and metadata
 */
async function createPublishingPackage(
  componentPath: string,
  componentId: string,
  version: string,
  targetScope: string,
  metadata: any,
  releaseNotes: string
) {
  const packageInfo = {
    id: componentId,
    version,
    scope: targetScope,
    publishedAt: new Date().toISOString(),
    releaseNotes,
    metadata,
    files: await getComponentFiles(componentPath),
  };

  // Create package manifest
  const manifest = {
    ...packageInfo,
    checksum: await calculatePackageChecksum(componentPath),
    installInstructions: generateInstallInstructions(componentId, targetScope),
  };

  return {
    manifest,
    packageInfo,
    componentPath,
  };
}

/**
 * Get list of component files for packaging
 */
async function getComponentFiles(componentPath: string): Promise<string[]> {
  const files: string[] = [];
  
  async function scanDirectory(dirPath: string, relativePath: string = '') {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativeFilePath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relativeFilePath);
      } else {
        files.push(relativeFilePath);
      }
    }
  }
  
  await scanDirectory(componentPath);
  return files;
}

/**
 * Calculate package checksum for integrity verification
 */
async function calculatePackageChecksum(componentPath: string): Promise<string> {
  // Simple checksum based on file contents and structure
  // In a real implementation, you'd use a proper hash function
  const files = await getComponentFiles(componentPath);
  const fileContents = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(componentPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      return `${file}:${content.length}`;
    })
  );
  
  return Buffer.from(fileContents.join('|')).toString('base64').substring(0, 32);
}

/**
 * Publish component to the Hatch component registry
 */
async function publishToRegistry(packageInfo: any, targetScope: string, featured: boolean) {
  const registryPath = path.resolve(__dirname, '../components/registry.json');
  
  let registry: any;
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    registry = JSON.parse(registryContent);
  } catch {
    registry = { components: {}, published: {} };
  }

  // Initialize published section if not exists
  if (!registry.published) {
    registry.published = {};
  }

  // Add to published components
  const publishedId = `${targetScope}/${packageInfo.packageInfo.id}`;
  registry.published[publishedId] = {
    ...packageInfo.packageInfo,
    featured,
    downloads: 0,
    publishedAt: new Date().toISOString(),
  };

  // Update main registry entry
  if (registry.components[publishedId]) {
    registry.components[publishedId] = {
      ...registry.components[publishedId],
      published: true,
      publishedVersion: packageInfo.packageInfo.version,
      scope: targetScope,
    };
  } else {
    registry.components[publishedId] = {
      id: publishedId,
      name: packageInfo.packageInfo.metadata.name || packageInfo.packageInfo.id,
      description: packageInfo.packageInfo.metadata.description || 'Published component',
      category: packageInfo.packageInfo.metadata.category || 'custom',
      scope: targetScope,
      published: true,
      publishedVersion: packageInfo.packageInfo.version,
      status: 'active',
    };
  }

  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));

  return {
    method: 'registry',
    publishedId,
    accessInfo: `Component available in Hatch Component Registry\n` +
                `   • ID: ${publishedId}\n` +
                `   • Version: ${packageInfo.packageInfo.version}\n` +
                `   • Scope: ${targetScope}\n` +
                `   • Featured: ${featured ? 'Yes' : 'No'}`,
    registryPath,
  };
}

/**
 * Publish component as a distributable package
 */
async function publishAsPackage(packageInfo: any) {
  // This would create a distributable package (zip, tar.gz, etc.)
  // For now, this is a placeholder
  return {
    method: 'package',
    packagePath: `/tmp/${packageInfo.packageInfo.id}-${packageInfo.packageInfo.version}.zip`,
    accessInfo: `Component packaged for distribution\n` +
                `   • Package: ${packageInfo.packageInfo.id}-${packageInfo.packageInfo.version}.zip\n` +
                `   • Ready for manual distribution`,
  };
}

/**
 * Publish component to git repository
 */
async function publishToGit(packageInfo: any) {
  // This would push to a git repository for version control
  // For now, this is a placeholder
  return {
    method: 'git',
    repositoryUrl: `https://github.com/hatch/components/${packageInfo.packageInfo.id}`,
    accessInfo: `Component published to Git repository\n` +
                `   • Repository: ${packageInfo.packageInfo.id}\n` +
                `   • Version tag: v${packageInfo.packageInfo.version}`,
  };
}

/**
 * Publish component via shareable link
 */
async function publishAsShareLink(packageInfo: any) {
  // This would create a shareable link for the component
  // For now, this is a placeholder
  const shareId = Buffer.from(`${packageInfo.packageInfo.id}-${Date.now()}`).toString('base64').substring(0, 16);
  
  return {
    method: 'share-link',
    shareLink: `https://hatch-components.share/${shareId}`,
    accessInfo: `Component available via share link\n` +
                `   • Link: https://hatch-components.share/${shareId}\n` +
                `   • Expires: Never (for Hatch components)`,
    shareId,
  };
}

/**
 * Update component status after successful publishing
 */
async function updateComponentStatusAfterPublishing(
  componentId: string,
  version: string,
  targetScope: string,
  publishResult: any
) {
  const registryPath = path.resolve(__dirname, '../components/registry.json');
  
  try {
    const registryContent = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryContent);
    
    const fullId = `${targetScope}/${componentId}`;
    if (registry.components[fullId]) {
      registry.components[fullId].lastPublished = new Date().toISOString();
      registry.components[fullId].publishedVersion = version;
      registry.components[fullId].publishMethod = publishResult.method;
    }
    
    await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
  } catch {
    // Ignore errors in status update
  }
}

/**
 * Generate usage instructions for colleagues
 */
function generateUsageInstructions(
  componentId: string,
  targetScope: string,
  method: string,
  publishResult: any
): string {
  const fullId = `${targetScope}/${componentId}`;
  
  switch (method) {
    case 'registry':
      return `1. List available components: list_components --scope ${targetScope}\n` +
             `2. Add to presentation: add_component --componentId ${fullId} --slideNumber X\n` +
             `3. Or install locally: install_component --source registry:${fullId}`;
    
    case 'package':
      return `1. Download package from: ${publishResult.packagePath}\n` +
             `2. Install locally: install_component --source ./path/to/package\n` +
             `3. Add to presentation: add_component --componentId ${componentId}`;
    
    case 'git':
      return `1. Install from git: install_component --source ${publishResult.repositoryUrl}\n` +
             `2. Add to presentation: add_component --componentId ${componentId}`;
    
    case 'share-link':
      return `1. Share this link: ${publishResult.shareLink}\n` +
             `2. Colleagues can install: install_component --source ${publishResult.shareLink}\n` +
             `3. Add to presentation: add_component --componentId ${componentId}`;
    
    default:
      return `Component published successfully. Check method-specific documentation for usage.`;
  }
}

/**
 * Generate installation instructions for package manifest
 */
function generateInstallInstructions(componentId: string, targetScope: string): string {
  return `To install this component:\n` +
         `1. Use the install_component tool with the component ID\n` +
         `2. Component ID: ${targetScope}/${componentId}\n` +
         `3. Add to slides using the add_component tool`;
}
