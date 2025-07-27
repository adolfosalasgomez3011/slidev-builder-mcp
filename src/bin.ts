#!/usr/bin/env node

/**
 * Command-line entry point for Slidev Builder MCP Server
 */

// Import and start the main server
import('./index.js').catch((error) => {
  console.error('Failed to start Slidev Builder MCP Server:', error);
  process.exit(1);
});