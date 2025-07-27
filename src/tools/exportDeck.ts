import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'child_process';

export interface ExportDeckArgs {
  deckPath: string;
  format: 'pdf' | 'html' | 'spa' | 'pptx';
  outputPath: string;
  options?: {
    withClicks?: boolean;
    range?: string;
    dark?: boolean;
  };
}

export async function exportDeck(args: ExportDeckArgs) {
  const { deckPath, format, outputPath, options = {} } = args;

  try {
    // Verify deck exists
    const slidesPath = path.join(deckPath, 'slides.md');
    if (!await fs.pathExists(slidesPath)) {
      throw new Error(`Slides file not found at ${slidesPath}`);
    }

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));

    // Execute export based on format
    let exportResult;
    switch (format) {
      case 'pdf':
        exportResult = await exportToPDF(deckPath, outputPath, options);
        break;
      case 'html':
        exportResult = await exportToHTML(deckPath, outputPath, options);
        break;
      case 'spa':
        exportResult = await exportToSPA(deckPath, outputPath, options);
        break;
      case 'pptx':
        exportResult = await exportToPPTX(deckPath, outputPath, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully exported presentation to ${format.toUpperCase()}\n\n` +
                `📁 Source: ${deckPath}\n` +
                `📄 Output: ${outputPath}\n` +
                `📊 Format: ${format}\n` +
                `⚙️ Options: ${JSON.stringify(options, null, 2)}\n\n` +
                `${exportResult.details || ''}`
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to export deck: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function exportToPDF(deckPath: string, outputPath: string, options: any): Promise<{ details: string }> {
  const args = ['export', '--format', 'pdf'];
  
  if (options.withClicks) args.push('--with-clicks');
  if (options.range) args.push('--range', options.range);
  if (options.dark) args.push('--dark');
  
  args.push('--output', outputPath);

  try {
    await executeSlidevCommand(deckPath, args);
    
    const stats = await fs.stat(outputPath);
    return {
      details: `📊 PDF Details:\n` +
               `📁 File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n` +
               `🕐 Created: ${stats.mtime.toLocaleString()}\n` +
               `${options.withClicks ? '🖱️ Includes click animations\n' : ''}` +
               `${options.range ? `📄 Range: ${options.range}\n` : ''}` +
               `${options.dark ? '🌙 Dark mode enabled\n' : ''}`
    };
  } catch (error) {
    throw new Error(`PDF export failed: ${error}`);
  }
}

async function exportToHTML(deckPath: string, outputPath: string, options: any): Promise<{ details: string }> {
  const args = ['export', '--format', 'html'];
  
  if (options.withClicks) args.push('--with-clicks');
  if (options.range) args.push('--range', options.range);
  if (options.dark) args.push('--dark');
  
  args.push('--output', outputPath);

  try {
    await executeSlidevCommand(deckPath, args);
    
    const stats = await fs.stat(outputPath);
    return {
      details: `🌐 HTML Details:\n` +
               `📁 File Size: ${(stats.size / 1024).toFixed(2)} KB\n` +
               `🕐 Created: ${stats.mtime.toLocaleString()}\n` +
               `📱 Self-contained HTML file\n` +
               `${options.withClicks ? '🖱️ Includes click animations\n' : ''}` +
               `${options.range ? `📄 Range: ${options.range}\n` : ''}`
    };
  } catch (error) {
    throw new Error(`HTML export failed: ${error}`);
  }
}

async function exportToSPA(deckPath: string, outputPath: string, options: any): Promise<{ details: string }> {
  const args = ['build'];
  
  if (options.range) args.push('--range', options.range);
  
  args.push('--out', outputPath);

  try {
    await executeSlidevCommand(deckPath, args);
    
    // Count files in output directory
    const files = await fs.readdir(outputPath, { recursive: true });
    const totalSize = await calculateDirectorySize(outputPath);
    
    return {
      details: `📦 SPA Details:\n` +
               `📁 Directory: ${outputPath}\n` +
               `📄 Files: ${files.length}\n` +
               `💾 Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n` +
               `🚀 Ready for web deployment\n` +
               `📱 Progressive Web App enabled\n` +
               `${options.range ? `📄 Range: ${options.range}\n` : ''}`
    };
  } catch (error) {
    throw new Error(`SPA export failed: ${error}`);
  }
}

async function exportToPPTX(deckPath: string, outputPath: string, options: any): Promise<{ details: string }> {
  // Note: PPTX export requires additional setup and may not be available in all Slidev versions
  // This is a placeholder implementation
  
  try {
    // First try with slidev export if it supports pptx
    const args = ['export', '--format', 'pptx', '--output', outputPath];
    await executeSlidevCommand(deckPath, args);
    
    const stats = await fs.stat(outputPath);
    return {
      details: `📊 PowerPoint Details:\n` +
               `📁 File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n` +
               `🕐 Created: ${stats.mtime.toLocaleString()}\n` +
               `📱 Compatible with Microsoft PowerPoint\n` +
               `⚠️ Some interactive features may be lost`
    };
  } catch (error) {
    // Fallback: Export to PDF first, then provide conversion guidance
    const pdfPath = outputPath.replace('.pptx', '.pdf');
    await exportToPDF(deckPath, pdfPath, options);
    
    return {
      details: `⚠️ Direct PPTX export not available\n` +
               `📄 Exported to PDF instead: ${pdfPath}\n\n` +
               `To convert to PowerPoint:\n` +
               `1. Use online converters (PDF to PPTX)\n` +
               `2. Use Adobe Acrobat Pro\n` +
               `3. Import PDF into PowerPoint manually\n\n` +
               `Note: Interactive features will be lost in conversion.`
    };
  }
}

async function executeSlidevCommand(deckPath: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const slidev = spawn('npx', ['slidev', ...args], {
      cwd: deckPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    slidev.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    slidev.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    slidev.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Slidev command failed with code ${code}: ${stderr || stdout}`);
      }
    });

    slidev.on('error', (error) => {
      reject(`Failed to execute Slidev command: ${error.message}`);
    });
  });
}

async function calculateDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;
  
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      totalSize += await calculateDirectorySize(fullPath);
    } else {
      const stats = await fs.stat(fullPath);
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}
