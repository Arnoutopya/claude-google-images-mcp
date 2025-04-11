/**
 * Claude Google Images MCP
 * 
 * Entry point for the MCP that integrates with Claude Desktop
 */

const { initGoogleImagesMCP, searchGoogleImages, downloadImage, config } = require('./google-images');

/**
 * Register the MCP commands with Claude Desktop
 * @param {Object} claudeAPI - The Claude Desktop API object
 */
function register(claudeAPI) {
  // Register the main command
  claudeAPI.registerCommand({
    name: 'google-images',
    description: 'Search for images on Google Images',
    async handler(args) {
      // Extract the search query from arguments
      const query = args.join(' ').trim();
      
      if (!query) {
        return claudeAPI.renderMarkdown('Please provide a search query. Example: `/google-images cute puppies`');
      }
      
      // Create a container for the UI
      const container = document.createElement('div');
      claudeAPI.showUI(container);
      
      // Initialize the Google Images MCP with the query
      initGoogleImagesMCP(query);
      
      return `Searching Google Images for "${query}"...`;
    }
  });
  
  // Register configuration command
  claudeAPI.registerCommand({
    name: 'google-images-config',
    description: 'Configure Google Images search settings',
    async handler(args) {
      // Parse configuration options
      const options = parseConfigArgs(args);
      
      // Update configuration
      if (options.maxResults) {
        config.maxResults = parseInt(options.maxResults, 10);
      }
      
      if (options.safeSearch !== undefined) {
        config.safeSearch = options.safeSearch === 'true' || options.safeSearch === true;
      }
      
      if (options.imageType) {
        const validTypes = ['all', 'photo', 'clipart', 'lineart', 'animated'];
        if (validTypes.includes(options.imageType)) {
          config.imageType = options.imageType;
        }
      }
      
      // Return current configuration
      return claudeAPI.renderMarkdown(`
## Google Images MCP Configuration

Current settings:
- **Max Results:** ${config.maxResults} images per page
- **Safe Search:** ${config.safeSearch ? 'Enabled' : 'Disabled'}
- **Image Type:** ${config.imageType}

To change configuration, use:
\`\`\`
/google-images-config maxResults=20 safeSearch=true imageType=photo
\`\`\`

Valid image types: all, photo, clipart, lineart, animated
      `);
    }
  });
  
  // Register help command
  claudeAPI.registerCommand({
    name: 'google-images-help',
    description: 'Show help for Google Images MCP',
    async handler() {
      return claudeAPI.renderMarkdown(`
# Google Images MCP Help

This Mod Content Pack allows you to search for images on Google Images and download them directly from Claude Desktop.

## Available Commands:

### 1. Search for Images
\`\`\`
/google-images [search query]
\`\`\`
Example: \`/google-images sunset over mountains\`

### 2. Configure Settings
\`\`\`
/google-images-config [options]
\`\`\`
Options:
- \`maxResults=[number]\` - Number of images per page (default: 20)
- \`safeSearch=[true/false]\` - Enable/disable safe search
- \`imageType=[type]\` - Filter by image type (all, photo, clipart, lineart, animated)

Example: \`/google-images-config maxResults=30 safeSearch=true imageType=photo\`

## Features:
- Search Google Images directly from Claude Desktop
- View and download images
- Configure search settings
- Navigate through multiple pages of results

## Note:
Please respect copyright and usage rights for any images you download.
      `);
    }
  });
  
  // Log successful registration
  console.log('Google Images MCP registered successfully!');
}

/**
 * Parse configuration arguments from command input
 * @param {Array} args - Array of argument strings
 * @returns {Object} Configuration options
 */
function parseConfigArgs(args) {
  const options = {};
  
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key && value) {
      options[key.trim()] = value.trim();
    }
  });
  
  return options;
}

// Export the register function
module.exports = { register };
