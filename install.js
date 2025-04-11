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

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

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
      try {
        config = JSON.parse(configContent);
      } catch (parseError) {
        console.log(`${colors.yellow}Warning: Claude config exists but is not valid JSON. Creating new config.${colors.reset}`);
        return { config: {}, configPath };
      }
    } else {
      console.log(`${colors.yellow}Claude config not found at: ${configPath}. Will create a new one.${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Error reading Claude config: ${error.message}${colors.reset}`);
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
    console.log(`${colors.green}Claude config updated at: ${configPath}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error writing Claude config: ${error.message}${colors.reset}`);
    return false;
  }
}

function getScriptPath() {
  // Get the absolute path to the server.js file in the same directory as this script
  return path.join(__dirname, 'server.js');
}

function updateClaudeConfig() {
  const { config, configPath } = readClaudeConfig();
  
  // Initialize mcpServers if it doesn't exist
  if (!config.mcpServers) {
    config.mcpServers = {};
  }
  
  // For direct installs from GitHub or local, use the actual script path
  const scriptPath = getScriptPath();
  
  // Add our server to the config
  config.mcpServers['google-images-mcp'] = {
    command: 'node',
    args: [scriptPath]
  };
  
  console.log(`${colors.cyan}Configuring to use script at: ${scriptPath}${colors.reset}`);
  
  return writeClaudeConfig(config, configPath);
}

function checkPrerequisites() {
  try {
    // Check Node.js version
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    const versionMatch = nodeVersion.match(/v(\d+)\./);
    
    console.log(`${colors.cyan}Detected Node.js version: ${nodeVersion.trim()}${colors.reset}`);
    
    if (versionMatch && parseInt(versionMatch[1]) < 14) {
      console.error(`${colors.red}Error: Node.js version 14 or higher is required${colors.reset}`);
      return false;
    }
    
    // Check if Claude Desktop config directory exists
    const configPath = getClaudeConfigPath();
    const configDir = path.dirname(configPath);
    
    if (!fs.existsSync(configDir)) {
      console.warn(`${colors.yellow}Warning: Claude Desktop config directory not found at ${configDir}${colors.reset}`);
      console.warn(`${colors.yellow}Make sure Claude Desktop is installed on your system${colors.reset}`);
      
      // Try to create the directory
      fs.mkdirSync(configDir, { recursive: true });
      console.log(`${colors.green}Created config directory: ${configDir}${colors.reset}`);
    } else {
      console.log(`${colors.green}Found Claude Desktop config directory at: ${configDir}${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error checking prerequisites: ${error.message}${colors.reset}`);
    return false;
  }
}

function installMCP() {
  console.log(`${colors.bright}${colors.cyan}=== Google Images MCP Installer ===${colors.reset}\n`);
  
  if (!checkPrerequisites()) {
    console.error(`${colors.red}Failed to verify prerequisites. Please ensure Node.js 14+ is installed.${colors.reset}`);
    rl.close();
    process.exit(1);
  }
  
  console.log(`${colors.cyan}Configuring Google Images MCP for Claude Desktop...${colors.reset}`);
  
  if (updateClaudeConfig()) {
    console.log(`\n${colors.green}${colors.bright}✅ Installation completed successfully!${colors.reset}`);
    console.log(`\n${colors.bright}To use Google Images MCP in Claude Desktop:${colors.reset}`);
    console.log(`${colors.cyan}1. Restart Claude Desktop if it's currently running${colors.reset}`);
    console.log(`${colors.cyan}2. In Claude Desktop, type: "/google_images_search" followed by your search query${colors.reset}`);
    console.log(`${colors.cyan}3. For example: "/google_images_search cute puppies"${colors.reset}`);
    console.log(`\n${colors.yellow}Note: The first time you use the command, it may take a moment to load the MCP server.${colors.reset}`);
  } else {
    console.error(`\n${colors.red}❌ Installation failed. Please try the manual installation method:${colors.reset}`);
    console.log(`\n${colors.yellow}1. Edit your Claude Desktop config file at:${colors.reset}`);
    console.log(`   ${colors.cyan}${getClaudeConfigPath()}${colors.reset}`);
    console.log(`\n${colors.yellow}2. Add the following to the JSON configuration:${colors.reset}`);
    console.log(`${colors.cyan}
{
  "mcpServers": {
    "google-images-mcp": {
      "command": "node",
      "args": [
        "${getScriptPath().replace(/\\/g, '\\\\')}"
      ]
    }
  }
}
${colors.reset}`);
    console.log(`${colors.yellow}3. Make sure to merge it with any existing configuration.${colors.reset}`);
    console.log(`${colors.yellow}4. Restart Claude Desktop${colors.reset}`);
  }
  
  rl.close();
}

// Check if this script is being run directly
if (require.main === module) {
  // Start installation process
  installMCP();
}

module.exports = { installMCP };
