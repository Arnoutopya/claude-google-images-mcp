#!/usr/bin/env node

/**
 * Google Images MCP Server
 * 
 * This file serves as the entry point for the MCP server, implementing the Model Context Protocol
 * to enable Claude Desktop to use Google Images search functionality.
 */

const fetch = require('node-fetch');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const { extractImagesFromHtml, getFileExtension, sanitizeInput } = require('./utils');
const { default: config } = require('./config');

// Create an Express application
const app = express();
const port = process.env.PORT || 8033;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send server capabilities on connection
  const capabilities = {
    type: 'capabilities',
    version: '1.0',
    capabilities: {
      tools: [
        {
          name: 'google_images_search',
          description: 'Search for images on Google Images',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query'
              },
              page: {
                type: 'integer',
                description: 'Page number (starting from 1)',
                default: 1
              },
              safeSearch: {
                type: 'boolean',
                description: 'Enable or disable safe search',
                default: true
              },
              imageType: {
                type: 'string',
                description: 'Filter by image type',
                enum: ['all', 'photo', 'clipart', 'lineart', 'animated'],
                default: 'all'
              },
              maxResults: {
                type: 'integer',
                description: 'Maximum number of results to return',
                default: 20
              }
            },
            required: ['query']
          }
        },
        {
          name: 'google_images_download',
          description: 'Download an image from a URL',
          parameters: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL of the image to download'
              },
              filename: {
                type: 'string',
                description: 'Name to save the file as (optional)'
              }
            },
            required: ['url']
          }
        },
        {
          name: 'google_images_config',
          description: 'Configure Google Images search settings',
          parameters: {
            type: 'object',
            properties: {
              safeSearch: {
                type: 'boolean',
                description: 'Enable or disable safe search'
              },
              imageType: {
                type: 'string',
                description: 'Filter by image type',
                enum: ['all', 'photo', 'clipart', 'lineart', 'animated']
              },
              maxResults: {
                type: 'integer',
                description: 'Maximum number of results per page'
              }
            }
          }
        }
      ]
    }
  };
  
  ws.send(JSON.stringify(capabilities));
  
  ws.on('message', async (message) => {
    try {
      const request = JSON.parse(message);
      
      if (request.type === 'invoke') {
        const { id, tool, params } = request;
        let response;
        
        switch (tool) {
          case 'google_images_search':
            response = await handleGoogleImagesSearch(params);
            break;
          case 'google_images_download':
            response = await handleImageDownload(params);
            break;
          case 'google_images_config':
            response = await handleConfigUpdate(params);
            break;
          default:
            response = {
              error: {
                code: 'unsupported_tool',
                message: `Tool '${tool}' is not supported`
              }
            };
        }
        
        ws.send(JSON.stringify({
          type: 'response',
          id,
          result: response
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: {
          code: 'internal_error',
          message: error.message
        }
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/**
 * Handle Google Images search request
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} Search results
 */
async function handleGoogleImagesSearch(params) {
  const { query, page = 1, safeSearch = true, imageType = 'all', maxResults = 20 } = params;
  
  if (!query || typeof query !== 'string') {
    return {
      error: {
        code: 'invalid_params',
        message: 'Search query is required'
      }
    };
  }
  
  const sanitizedQuery = sanitizeInput(query);
  
  try {
    // Construct Google Images search URL
    const startIndex = (page - 1) * maxResults;
    const searchUrl = new URL('https://www.google.com/search');
    searchUrl.searchParams.append('q', sanitizedQuery);
    searchUrl.searchParams.append('tbm', 'isch');
    searchUrl.searchParams.append('start', startIndex);
    searchUrl.searchParams.append('sa', 'N');
    
    // Add filter parameters
    const tbsParams = [];
    if (safeSearch) {
      tbsParams.push('safe:active');
    }
    
    if (imageType !== 'all') {
      switch (imageType) {
        case 'photo':
          tbsParams.push('itp:photo');
          break;
        case 'clipart':
          tbsParams.push('itp:clipart');
          break;
        case 'lineart':
          tbsParams.push('itp:lineart');
          break;
        case 'animated':
          tbsParams.push('itp:animated');
          break;
      }
    }
    
    if (tbsParams.length > 0) {
      searchUrl.searchParams.append('tbs', tbsParams.join(','));
    }
    
    // Fetch search results
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': config.defaults.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const html = await response.text();
    const images = extractImagesFromHtml(html).slice(0, maxResults);
    
    return {
      results: images,
      metadata: {
        query: sanitizedQuery,
        page,
        totalResults: images.length,
        hasMore: images.length === maxResults,
        filters: {
          safeSearch,
          imageType
        }
      }
    };
  } catch (error) {
    console.error('Error searching Google Images:', error);
    return {
      error: {
        code: 'search_error',
        message: `Failed to search Google Images: ${error.message}`
      }
    };
  }
}

/**
 * Handle image download request
 * @param {Object} params - Download parameters
 * @returns {Promise<Object>} Download result
 */
async function handleImageDownload(params) {
  const { url, filename } = params;
  
  if (!url || typeof url !== 'string') {
    return {
      error: {
        code: 'invalid_params',
        message: 'Image URL is required'
      }
    };
  }
  
  try {
    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': config.defaults.userAgent,
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Generate filename if not provided
    const timestamp = Date.now();
    const extension = getFileExtension(url);
    const defaultFilename = `google-image-${timestamp}${extension}`;
    const outputFilename = filename || defaultFilename;
    
    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // Save the image
    const outputPath = path.join(downloadsDir, outputFilename);
    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    
    return {
      success: true,
      filename: outputFilename,
      path: outputPath,
      size: buffer.length,
      metadata: {
        contentType: response.headers.get('content-type'),
        timestamp
      }
    };
  } catch (error) {
    console.error('Error downloading image:', error);
    return {
      error: {
        code: 'download_error',
        message: `Failed to download image: ${error.message}`
      }
    };
  }
}

/**
 * Handle configuration update request
 * @param {Object} params - Configuration parameters
 * @returns {Object} Updated configuration
 */
function handleConfigUpdate(params) {
  const { safeSearch, imageType, maxResults } = params;
  
  if (safeSearch !== undefined) {
    config.defaults.safeSearch = Boolean(safeSearch);
  }
  
  if (imageType && ['all', 'photo', 'clipart', 'lineart', 'animated'].includes(imageType)) {
    config.defaults.imageType = imageType;
  }
  
  if (maxResults !== undefined && Number.isInteger(maxResults) && maxResults > 0) {
    config.defaults.maxResults = maxResults;
  }
  
  return {
    success: true,
    config: {
      safeSearch: config.defaults.safeSearch,
      imageType: config.defaults.imageType,
      maxResults: config.defaults.maxResults
    }
  };
}

// Start the server
server.listen(port, () => {
  console.log(`Google Images MCP server running on port ${port}`);
  console.log('Waiting for Claude Desktop connection...');
});
