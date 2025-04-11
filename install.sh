#!/bin/bash

# Colors for prettier output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo -e "${CYAN}=== Google Images MCP Installer ===${RESET}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 14.0.0 or higher.${RESET}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f2 | cut -d '.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}Error: Node.js version 14 or higher is required. You have version $NODE_VERSION.${RESET}"
    exit 1
fi

echo -e "${GREEN}Node.js check passed!${RESET}"

# Install the MCP from GitHub using npx
echo -e "${CYAN}Installing Google Images MCP from GitHub...${RESET}"

# Clone the repository to a temporary directory
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}Cloning repository to temporary directory: $TEMP_DIR${RESET}"

git clone https://github.com/Arnoutopya/claude-google-images-mcp.git "$TEMP_DIR" &> /dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to clone the repository. Please check your internet connection.${RESET}"
    exit 1
fi

# Navigate to the cloned repository
cd "$TEMP_DIR"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${RESET}"
npm install &> /dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies.${RESET}"
    exit 1
fi

# Run the installer
echo -e "${BLUE}Running installer...${RESET}"
node install.js

# Clean up
cd -
rm -rf "$TEMP_DIR"

echo -e "\n${GREEN}Installation process completed!${RESET}"
echo -e "${YELLOW}To use Google Images MCP, restart Claude Desktop and use the /google_images_search command.${RESET}"
