# Google Images MCP Documentation

This document provides comprehensive documentation for using the Google Images MCP with Claude Desktop.

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
- [Usage Examples](#usage-examples)
- [Configuration Options](#configuration-options)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Installation

### Prerequisites

- Node.js 14.0.0 or higher
- Claude Desktop installed on your system

### Installation Methods

#### Method 1: Using the Installation Script

1. Clone the repository:
```bash
git clone https://github.com/Arnoutopya/claude-google-images-mcp.git
```

2. Navigate to the project directory:
```bash
cd claude-google-images-mcp
```

3. Run the installation script:
```bash
npm run install-mcp
```

The script will automatically detect your Claude Desktop installation and install the MCP.

#### Method 2: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/Arnoutopya/claude-google-images-mcp.git
```

2. Navigate to the project directory:
```bash
cd claude-google-images-mcp
```

3. Install dependencies:
```bash
npm install
```

4. Locate your Claude Desktop mods directory:
   - Windows: `%APPDATA%\Claude Desktop\mods`
   - macOS: `~/Library/Application Support/Claude Desktop/mods`
   - Linux: `~/.config/Claude Desktop/mods`

5. Create a new directory for the MCP:
```bash
mkdir -p "[CLAUDE_DESKTOP_MODS_PATH]/google-images-mcp"
```

6. Copy all files to the new directory:
```bash
cp -r ./* "[CLAUDE_DESKTOP_MODS_PATH]/google-images-mcp/"
```

7. Restart Claude Desktop.

## Commands

The Google Images MCP provides the following commands:

### `/google-images [search query]`

Searches for images on Google Images based on the provided query.

**Example:** `/google-images sunset over mountains`

### `/google-images-config [options]`

Configure the MCP settings. Available options:

- `maxResults=[number]`: Number of images per page (default: 20)
- `safeSearch=[true/false]`: Enable/disable safe search
- `imageType=[type]`: Filter by image type (all, photo, clipart, lineart, animated)

**Example:** `/google-images-config maxResults=30 safeSearch=true imageType=photo`

### `/google-images-help`

Displays help information for the Google Images MCP.

## Usage Examples

### Basic Search

To search for images of puppies:
```
/google-images cute puppies
```

This will display a grid of puppy images that you can browse, download, or view the source of.

### Filtered Search

To search for clipart images with safe search disabled:
```
/google-images-config safeSearch=false imageType=clipart
/google-images cartoon characters
```

This will show cartoon character clipart images with safe search disabled.

### Downloading Images

1. Run a search: `/google-images landscape photography`
2. Browse the results in the displayed grid
3. Click the "Download" button under any image you want to save
4. The image will be downloaded to your computer

### Viewing Image Sources

1. Run a search: `/google-images technology icons`
2. Find an image you're interested in
3. Click the "View Source" button to open the original website in a new browser tab

## Configuration Options

You can customize the MCP's behavior using the `/google-images-config` command with the following options:

### `maxResults`

Controls how many images are displayed per page.

- Default: `20`
- Range: `1-100`
- Example: `/google-images-config maxResults=50`

### `safeSearch`

Enables or disables Google's SafeSearch filtering.

- Default: `true`
- Values: `true` or `false`
- Example: `/google-images-config safeSearch=false`

### `imageType`

Filters images by type.

- Default: `all`
- Values: `all`, `photo`, `clipart`, `lineart`, `animated`
- Example: `/google-images-config imageType=photo`

## Troubleshooting

### MCP Not Appearing in Claude Desktop

1. Verify the MCP is correctly installed in your Claude Desktop mods directory
2. Check if the claude-manifest.json file is correctly formatted
3. Restart Claude Desktop
4. Check the Claude Desktop console for any error messages

### Images Not Loading

1. Verify your internet connection
2. Some images may be protected by their source websites
3. Try a different search query
4. Check if Google has made changes to their HTML structure (may require MCP update)

### Download Not Working

1. Check if your browser is blocking downloads
2. Verify you have write permissions in the download directory
3. Some images may be protected against direct downloading

## FAQ

### Is this MCP official or endorsed by Claude?

No, this is a community-created mod pack and is not officially endorsed by Claude or Anthropic.

### Does this MCP collect any data?

No, the Google Images MCP does not collect or store any user data. All searches are performed directly through your browser.

### Can I modify this MCP for my own use?

Yes! This MCP is released under the MIT License, so you are free to modify, distribute, and use it as you wish, providing you include the original license file.

### How can I contribute to this MCP?

Contributions are welcome! Please feel free to submit pull requests or open issues on the GitHub repository.

### Is this MCP compatible with all versions of Claude Desktop?

This MCP is designed to work with Claude Desktop version 1.0.0 and later. If you encounter compatibility issues, please report them on GitHub.
