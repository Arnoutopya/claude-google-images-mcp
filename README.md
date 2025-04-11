# Claude Google Images MCP

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A Mod Content Pack for Claude Desktop that helps retrieve images from Google Images search results. This MCP enables you to search, browse, and download images directly from your Claude Desktop interface.

## 🌟 Features

- **Simple Interface**: Clean, intuitive interface for searching Google Images
- **Dynamic Search**: Get real-time search results for any query
- **Configurable Settings**: Customize your search with filters and options
- **Direct Downloads**: Save images with a single click
- **Responsive Design**: Works on any screen size
- **Dark Mode Support**: Automatic theme detection based on system preferences
- **No API Key Required**: Works without requiring any Google API credentials

## 📋 Prerequisites

- Node.js 14.0.0 or higher
- Claude Desktop application

## 🚀 Installation

### Automatic Installation (Recommended)

1. Clone this repository:
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

### Manual Installation

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

4. Copy the files to your Claude Desktop mods directory:
   - Windows: `%APPDATA%\Claude Desktop\mods\google-images-mcp`
   - macOS: `~/Library/Application Support/Claude Desktop/mods/google-images-mcp`
   - Linux: `~/.config/Claude Desktop/mods/google-images-mcp`

5. Restart Claude Desktop if it's already running

## 🔍 Usage

Once installed, you can use the Google Images MCP with these commands:

### Search for Images

```
/google-images [search query]
```

Example: `/google-images nature landscapes`

### Configure Settings

```
/google-images-config [options]
```

Options:
- `maxResults=[number]`: Number of images per page (default: 20)
- `safeSearch=[true/false]`: Enable/disable safe search
- `imageType=[type]`: Filter by image type (all, photo, clipart, lineart, animated)

Example: `/google-images-config maxResults=30 safeSearch=true imageType=photo`

### Get Help

```
/google-images-help
```

Shows detailed help information for using the MCP.

## ⚙️ Configuration

You can customize the MCP by modifying the `config.js` file:

```javascript
module.exports = {
  defaults: {
    maxResults: 20,
    safeSearch: true,
    imageType: 'all',
    // ... other options
  },
  // ... other configurations
};
```

## 📚 Documentation

For detailed information about all features and options, please check the [DOCUMENTATION.md](DOCUMENTATION.md) file.

## 🛠️ Development

To set up the development environment:

1. Clone the repository
2. Install dependencies with `npm install`
3. Make your changes
4. Test the MCP by loading it into Claude Desktop

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This MCP is for educational purposes only. Please respect Google's terms of service and copyright laws when using this tool. The creators of this MCP are not responsible for any misuse or violation of terms.

## 🙏 Acknowledgements

This project was inspired by several open-source projects:

- [Google Images Scraper](https://github.com/talleyhoe/google-image-scraper)
- [image_search](https://github.com/rushilsrivastava/image_search)
- Other community contributions to web scraping and image search tools

---

Made with ❤️ for the Claude Desktop community
