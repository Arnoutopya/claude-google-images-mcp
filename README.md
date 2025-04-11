# Claude Google Images MCP

A Mod Content Pack for Claude Desktop that helps retrieve images from Google Images search results.

## Features

- Simple and easy-to-use interface for searching Google Images
- Direct download of search results
- Supports saving images in various formats
- Works seamlessly with Claude Desktop
- No API key required

## Installation

1. Clone this repository:
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

4. Load the MCP in Claude Desktop:
   - Open Claude Desktop
   - Go to Settings > Mods
   - Click "Load from Folder"
   - Select the cloned repository folder

## Usage

Once installed, you can use the Google Images MCP in Claude Desktop:

1. Type `/google-images` followed by your search query
2. The MCP will display the search results
3. Click on any image to download it
4. Use the pagination controls to browse more results

## Configuration

You can modify the configuration in the `config.js` file:

- `maxResults`: Maximum number of images to retrieve (default: 20)
- `safeSearch`: Enable or disable safe search (default: true)
- `imageType`: Filter by image type (default: "all", options: "photo", "clipart", "lineart", "animated")

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This MCP is for educational purposes only. Please respect Google's terms of service and copyright laws when using this tool.
