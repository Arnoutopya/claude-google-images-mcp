#!/usr/bin/env node

/**
 * Installation script for Claude Google Images MCP
 * 
 * This script helps users install the MCP in their Claude Desktop environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get potential Claude Desktop directories based on OS
function getClaudeDesktopDirs() {
  const platform = os.platform();
  const homeDir = os.homedir();
  
  if (platform === 'win32') {
    return [
      path.join(homeDir, 'AppData', 'Roaming', 'Claude Desktop', 'mods'),
      path.join(homeDir, 'Claude Desktop', 'mods')
    ];
  } else if (platform === 'darwin') {
    return [
      path.join(homeDir, 'Library', 'Application Support', 'Claude Desktop', 'mods'),
      path.join(homeDir, 'Claude Desktop', 'mods')
    ];
  } else {
    return [
      path.join(homeDir, '.config', 'Claude Desktop', 'mods'),
      path.join(homeDir, 'Claude Desktop', 'mods')
    ];
  }
}

// Check if a directory exists
function directoryExists(dir) {
  try {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch (err) {
    return false;
  }
}

// Install dependencies
function installDependencies() {
  console.log('Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    return false;
  }
}

// Copy files to Claude Desktop mods directory
function copyToClaudeDesktop(targetDir) {
  console.log(`Copying files to ${targetDir}...`);
  
  try {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Create directory for this specific MCP
    const mcpDir = path.join(targetDir, 'google-images-mcp');
    if (!fs.existsSync(mcpDir)) {
      fs.mkdirSync(mcpDir, { recursive: true });
    }
    
    // Files to copy
    const filesToCopy = [
      'index.js',
      'google-images.js',
      'config.js',
      'utils.js',
      'styles.css',
      'claude-manifest.json',
      'package.json',
      'README.md',
      'LICENSE'
    ];
    
    // Copy each file
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        const targetPath = path.join(mcpDir, file);
        fs.copyFileSync(file, targetPath);
        console.log(`Copied ${file} to ${targetPath}`);
      } else {
        console.warn(`Warning: File ${file} not found. Skipping.`);
      }
    });
    
    // Install dependencies in the target directory
    console.log('Installing dependencies in target directory...');
    execSync('npm install', { cwd: mcpDir, stdio: 'inherit' });
    
    return true;
  } catch (error) {
    console.error('Error copying files:', error.message);
    return false;
  }
}

// Main installation process
async function installMCP() {
  console.log('=== Claude Google Images MCP Installer ===');
  
  // Install local dependencies first
  if (!installDependencies()) {
    console.error('Failed to install dependencies. Aborting installation.');
    process.exit(1);
  }
  
  // Try to find Claude Desktop mods directory
  const potentialDirs = getClaudeDesktopDirs();
  let claudeDir = null;
  
  for (const dir of potentialDirs) {
    if (directoryExists(dir)) {
      claudeDir = dir;
      break;
    }
  }
  
  if (claudeDir) {
    console.log(`Found Claude Desktop mods directory at: ${claudeDir}`);
    
    rl.question(`Do you want to install Google Images MCP to ${claudeDir}? (y/n): `, answer => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        if (copyToClaudeDesktop(claudeDir)) {
          console.log('\n✅ Installation completed successfully!');
          console.log('\nYou can now use the Google Images MCP in Claude Desktop:');
          console.log('1. Restart Claude Desktop if it\'s currently running');
          console.log('2. Type "/google-images" followed by your search query');
          console.log('3. For help, type "/google-images-help"');
        } else {
          console.error('\n❌ Installation failed. Please try installing manually.');
        }
      } else {
        customPathInstall();
      }
    });
  } else {
    console.log('Could not find Claude Desktop mods directory automatically.');
    customPathInstall();
  }
}

// Ask for custom installation path
function customPathInstall() {
  rl.question('Please enter the path to your Claude Desktop mods directory: ', customPath => {
    if (!customPath) {
      console.log('No path provided. Aborting installation.');
      rl.close();
      return;
    }
    
    const expandedPath = customPath.replace(/^~/, os.homedir());
    
    if (directoryExists(expandedPath)) {
      if (copyToClaudeDesktop(expandedPath)) {
        console.log('\n✅ Installation completed successfully!');
        console.log('\nYou can now use the Google Images MCP in Claude Desktop:');
        console.log('1. Restart Claude Desktop if it\'s currently running');
        console.log('2. Type "/google-images" followed by your search query');
        console.log('3. For help, type "/google-images-help"');
      } else {
        console.error('\n❌ Installation failed. Please try installing manually.');
      }
    } else {
      console.log(`The directory ${expandedPath} does not exist or is not accessible.`);
      rl.question('Do you want to create this directory? (y/n): ', answer => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          try {
            fs.mkdirSync(expandedPath, { recursive: true });
            console.log(`Created directory: ${expandedPath}`);
            
            if (copyToClaudeDesktop(expandedPath)) {
              console.log('\n✅ Installation completed successfully!');
              console.log('\nYou can now use the Google Images MCP in Claude Desktop:');
              console.log('1. Restart Claude Desktop if it\'s currently running');
              console.log('2. Type "/google-images" followed by your search query');
              console.log('3. For help, type "/google-images-help"');
            } else {
              console.error('\n❌ Installation failed. Please try installing manually.');
            }
          } catch (error) {
            console.error(`Error creating directory: ${error.message}`);
            console.error('\n❌ Installation failed. Please try installing manually.');
          }
        } else {
          console.log('Aborting installation.');
        }
        rl.close();
      });
    }
  });
}

// Start installation
installMCP().catch(error => {
  console.error('Unexpected error during installation:', error);
  process.exit(1);
});
