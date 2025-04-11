/**
 * Configuration file for Claude Google Images MCP
 * 
 * This file contains default configurations that can be modified by users
 */

module.exports = {
  // Default configuration
  defaults: {
    maxResults: 20,
    safeSearch: true,
    imageType: 'all',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  
  // MCP metadata
  metadata: {
    name: 'Google Images MCP',
    version: '1.0.0',
    description: 'Search and download images from Google Images within Claude Desktop',
    author: 'Arnoutopya',
    repository: 'https://github.com/Arnoutopya/claude-google-images-mcp'
  },
  
  // Command definitions
  commands: {
    search: {
      name: 'google-images',
      description: 'Search for images on Google Images',
      usage: '/google-images [search query]'
    },
    config: {
      name: 'google-images-config',
      description: 'Configure Google Images search settings',
      usage: '/google-images-config [options]'
    },
    help: {
      name: 'google-images-help',
      description: 'Show help for Google Images MCP',
      usage: '/google-images-help'
    }
  },
  
  // Valid image types
  validImageTypes: ['all', 'photo', 'clipart', 'lineart', 'animated'],
  
  // Paths for saved images
  paths: {
    downloads: './downloads',
    temp: './temp'
  },
  
  // Claude Desktop integration settings
  claudeDesktop: {
    apiVersion: '1.0',
    permissions: [
      'showUI',
      'renderMarkdown',
      'fileSystem'
    ]
  },
  
  // Error messages
  errors: {
    noQuery: 'Please provide a search query. Example: `/google-images cute puppies`',
    fetchFailed: 'Failed to fetch images from Google. Please try again later.',
    downloadFailed: 'Failed to download the image. The image might be protected or no longer available.',
    invalidConfig: 'Invalid configuration option. Please check the help for valid options.'
  }
};
