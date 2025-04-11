/**
 * Configuration file for Google Images MCP Server
 */

const config = {
  // Default configuration
  defaults: {
    maxResults: 20,
    safeSearch: true,
    imageType: 'all',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  
  // MCP server metadata
  metadata: {
    name: 'Google Images MCP',
    version: '1.0.0',
    description: 'Search and download images from Google Images within Claude Desktop',
    author: 'Arnoutopya',
    repository: 'https://github.com/Arnoutopya/claude-google-images-mcp'
  },
  
  // Server configuration
  server: {
    port: 8033,
    host: 'localhost'
  },
  
  // Valid image types
  validImageTypes: ['all', 'photo', 'clipart', 'lineart', 'animated'],
  
  // Paths for saved images
  paths: {
    downloads: './downloads',
    temp: './temp'
  },
  
  // Error messages
  errors: {
    noQuery: 'Please provide a search query.',
    fetchFailed: 'Failed to fetch images from Google. Please try again later.',
    downloadFailed: 'Failed to download the image. The image might be protected or no longer available.',
    invalidConfig: 'Invalid configuration option. Please check the help for valid options.'
  }
};

// Export as default
module.exports = { default: config };
