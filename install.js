#!/usr/bin/env node

/**
 * Installation script for Google Images MCP
 * 
 * This script helps users install the Google Images MCP in their Claude Desktop environment
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getClaudeConfigPath() {
  const homeDir = os.homedir();
  const platform = os.platform();
  
  let configPath;
  if (platform === 'win32') {
    configPath = path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'darwin') {
    configPath = path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    configPath = path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
  }
  
  return configPath;
}

function readClaudeConfig() {
  const configPath = getClaudeConfigPath();
  let config = {};
  
  try {
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(configContent);
    }
  } catch (error) {
    console.error(`Error reading Claude config: ${error.message}`);
  }
  
  return { config, configPath };
}

function writeClaudeConfig(config, configPath) {
  try {
    const configDir = path.dirname(configPath);
    
    // Ensure the directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`Claude config updated at: ${configPath}`);
    return true;
  } catch (error) {
    console.error(`Error writing Claude config: ${error.message}`);
    return false;
  }
}

function updateClaudeConfig() {
  const { config, configPath } = readClaudeConfig();
  
  // Initialize mcpServers if it doesn't exist
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  // Add our server to the config
  config.mcpServers['google-images-mcp'] = {
    command: 'npx',
    args: [
      '-y',
      '@arnoutopya/claude-google-images-mcp'
    ]
  };
  
  return writeClaudeConfig(config, configPath);
}

function checkPrerequisites() {
  try {
    // Check Node.js version
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    const versionMatch = nodeVersion.match(/v(\d+)\./);
    if (versionMatch && parseInt(versionMatch[1]) < 14) {
      console.error('Error: Node.js version 14 or higher is required');
      return false;
    }
    
    // Check if Claude Desktop is installed
    const configPath = getClaudeConfigPath();
    const configDir = path.dirname(configPath);
    
    if (!fs.existsSync(configDir)) {
      console.warn(`Warning: Claude Desktop config directory not found at ${configDir}`);
      console.warn('Make sure Claude Desktop is installed on your system');
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking prerequisites: ${error.message}`);
    return false;
  }
}

function installMCP() {
  console.log('=== Google Images MCP Installer ===\n');
  
  if (!checkPrerequisites()) {
    console.error('Failed to verify prerequisites. Please ensure Node.js 14+ is installed.');
    process.exit(1);
  }
  
  console.log('Configuring Google Images MCP for Claude Desktop...');
  
  if (updateClaudeConfig()) {
    console.log('\n✅ Installation completed successfully!');
    console.log('\nTo use Google Images MCP in Claude Desktop:');
    console.log('1. Restart Claude Desktop if it\'s currently running');
    console.log('2. In Claude Desktop, type: "/google_images_search" followed by your search query');
    console.log('3. For example: "/google_images_search cute puppies"');
    console.log('\nNote: The first time you use the command, it may take a moment to load the MCP server.');
  } else {
    console.error('\n❌ Installation failed. Please try the manual installation method:');
    console.log('\n1. Edit your Claude Desktop config file at:');
    console.log(`   ${getClaudeConfigPath()}`);
    console.log('\n2. Add the following to the JSON configuration:');
    console.log(`
{
  "mcpServers": {
    "google-images-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@arnoutopya/claude-google-images-mcp"
      ]
    }
  }
}
`);
    console.log('3. Make sure to merge it with any existing configuration.');
    console.log('4. Restart Claude Desktop');
  }
  
  rl.close();
}

// Start installation process
installMCP();
