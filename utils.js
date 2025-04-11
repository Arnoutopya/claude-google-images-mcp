/**
 * Utility functions for the Google Images MCP
 */

const fs = require('fs');
const path = require('path');
const { defaults } = require('./config');

/**
 * Ensure a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<boolean>} True if successful
 */
async function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
}

/**
 * Generate a unique filename for downloaded images
 * @param {string} url - URL of the image
 * @param {string} query - Search query used
 * @returns {string} Unique filename
 */
function generateUniqueFilename(url, query) {
  const timestamp = Date.now();
  const urlHash = hashString(url).substr(0, 8);
  const cleanQuery = query.replace(/[^a-z0-9]/gi, '_').toLowerCase().substr(0, 30);
  const extension = getFileExtension(url);
  
  return `${cleanQuery}-${timestamp}-${urlHash}${extension}`;
}

/**
 * Extract file extension from URL
 * @param {string} url - URL of the image
 * @returns {string} File extension with dot (e.g., '.jpg')
 */
function getFileExtension(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = path.extname(pathname);
    
    // If no extension or extension is too long, default to .jpg
    if (!extension || extension.length > 5) {
      return '.jpg';
    }
    
    return extension;
  } catch (error) {
    return '.jpg'; // Default to .jpg on error
  }
}

/**
 * Simple string hashing function
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Format file size in a human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate image URL to ensure it's a supported image format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is likely a valid image
 */
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    
    // Check if URL has a valid image extension
    if (validExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    
    // Check URL patterns commonly used for images
    if (pathname.includes('/image/') || 
        pathname.includes('/images/') || 
        pathname.includes('/img/') ||
        urlObj.hostname.includes('img')) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Clean up HTML tags from a string
 * @param {string} html - HTML string to clean
 * @returns {string} Text without HTML tags
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

module.exports = {
  ensureDirectoryExists,
  generateUniqueFilename,
  getFileExtension,
  sanitizeInput,
  formatFileSize,
  isValidImageUrl,
  stripHtml
};
