/**
 * Google Images MCP for Claude Desktop
 * 
 * This script provides functionality to scrape and download images from Google Images
 * in a way that's compatible with Claude Desktop.
 */

// Configuration options
const config = {
  maxResults: 20,
  safeSearch: true,
  imageType: 'all',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

/**
 * Search Google Images for a specific query
 * @param {string} query - The search query
 * @param {number} page - Page number (starts at 1)
 * @returns {Promise<Array>} Array of image objects with url, title, and thumbnail
 */
async function searchGoogleImages(query, page = 1) {
  const startIndex = (page - 1) * config.maxResults;
  const searchUrl = new URL('https://www.google.com/search');
  searchUrl.searchParams.append('q', query);
  searchUrl.searchParams.append('tbm', 'isch');
  searchUrl.searchParams.append('start', startIndex);
  searchUrl.searchParams.append('sa', 'N');
  searchUrl.searchParams.append('tbs', getFilterParams());
  
  try {
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const html = await response.text();
    return extractImagesFromHtml(html);
  } catch (error) {
    console.error('Error fetching Google Images:', error);
    return [];
  }
}

/**
 * Extract image data from Google search results HTML
 * @param {string} html - HTML string of Google Images search results page
 * @returns {Array} Array of image objects
 */
function extractImagesFromHtml(html) {
  const images = [];
  const imgRegex = /"ou":"(.*?)".*?"pt":"(.*?)".*?"ru":"(.*?)"/g;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null && images.length < config.maxResults) {
    try {
      // Decode URLs
      const imageUrl = match[1].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
      const title = match[2].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
      const sourceUrl = match[3].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
      
      images.push({
        url: imageUrl,
        title: title,
        source: sourceUrl,
        thumbnail: imageUrl // In some cases, we might want to generate or extract thumbnails
      });
    } catch (error) {
      console.error('Error processing image data:', error);
    }
  }
  
  return images;
}

/**
 * Download an image to the local filesystem
 * @param {string} url - URL of the image to download
 * @param {string} filename - Desired filename
 * @returns {Promise<string>} Path to the downloaded file
 */
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': config.userAgent,
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    URL.revokeObjectURL(blobUrl);
    return filename;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

/**
 * Generate filter parameter string based on configuration
 * @returns {string} Filter parameters for Google Images
 */
function getFilterParams() {
  const params = [];
  
  // Safe search
  if (config.safeSearch) {
    params.push('safe:active');
  }
  
  // Image type
  if (config.imageType !== 'all') {
    switch (config.imageType) {
      case 'photo':
        params.push('itp:photo');
        break;
      case 'clipart':
        params.push('itp:clipart');
        break;
      case 'lineart':
        params.push('itp:lineart');
        break;
      case 'animated':
        params.push('itp:animated');
        break;
    }
  }
  
  return params.join(',');
}

/**
 * Create and render the UI for the Google Images MCP
 * @param {HTMLElement} container - Container element to render the UI
 * @param {string} query - Search query
 */
function renderUI(container, query) {
  container.innerHTML = `
    <div class="google-images-mcp">
      <h2>Google Images Search: "${query}"</h2>
      <div class="search-form">
        <input type="text" id="search-query" value="${query}" placeholder="Enter search query...">
        <button id="search-button">Search</button>
      </div>
      <div class="filter-options">
        <label>
          <input type="checkbox" id="safe-search" ${config.safeSearch ? 'checked' : ''}>
          Safe Search
        </label>
        <select id="image-type">
          <option value="all" ${config.imageType === 'all' ? 'selected' : ''}>All Images</option>
          <option value="photo" ${config.imageType === 'photo' ? 'selected' : ''}>Photos</option>
          <option value="clipart" ${config.imageType === 'clipart' ? 'selected' : ''}>Clipart</option>
          <option value="lineart" ${config.imageType === 'lineart' ? 'selected' : ''}>Line Art</option>
          <option value="animated" ${config.imageType === 'animated' ? 'selected' : ''}>Animated</option>
        </select>
      </div>
      <div id="results-container" class="results-container">
        <div class="loading">Loading results...</div>
      </div>
      <div class="pagination">
        <button id="prev-page" disabled>Previous</button>
        <span id="page-info">Page 1</span>
        <button id="next-page">Next</button>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .google-images-mcp {
      font-family: Arial, sans-serif;
      max-width: 100%;
      padding: 16px;
    }
    
    .search-form {
      display: flex;
      margin-bottom: 16px;
    }
    
    .search-form input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
    }
    
    .search-form button {
      padding: 8px 16px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    
    .filter-options {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .filter-options label {
      margin-right: 16px;
    }
    
    .filter-options select {
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    
    .results-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .image-item {
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    
    .image-item:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .image-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .image-item .title {
      padding: 8px;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .image-item .actions {
      padding: 8px;
      display: flex;
      justify-content: space-between;
    }
    
    .image-item button {
      padding: 4px 8px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .pagination button {
      padding: 8px 16px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 0 8px;
    }
    
    .pagination button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .loading {
      grid-column: 1 / -1;
      text-align: center;
      padding: 20px;
    }
  `;
  document.head.appendChild(style);
  
  // Set up event listeners and load initial results
  initEventListeners(container, query);
  loadResults(container, query, 1);
}

/**
 * Initialize event listeners for the UI
 * @param {HTMLElement} container - Container element with the UI
 * @param {string} initialQuery - Initial search query
 */
function initEventListeners(container, initialQuery) {
  let currentPage = 1;
  let currentQuery = initialQuery;
  
  // Search button
  const searchButton = container.querySelector('#search-button');
  const searchInput = container.querySelector('#search-query');
  
  searchButton.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadResults(container, currentQuery, currentPage);
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentQuery = searchInput.value.trim();
      currentPage = 1;
      loadResults(container, currentQuery, currentPage);
    }
  });
  
  // Filter changes
  const safeSearchCheckbox = container.querySelector('#safe-search');
  const imageTypeSelect = container.querySelector('#image-type');
  
  safeSearchCheckbox.addEventListener('change', () => {
    config.safeSearch = safeSearchCheckbox.checked;
    loadResults(container, currentQuery, currentPage);
  });
  
  imageTypeSelect.addEventListener('change', () => {
    config.imageType = imageTypeSelect.value;
    loadResults(container, currentQuery, currentPage);
  });
  
  // Pagination
  const prevButton = container.querySelector('#prev-page');
  const nextButton = container.querySelector('#next-page');
  const pageInfo = container.querySelector('#page-info');
  
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadResults(container, currentQuery, currentPage);
    }
  });
  
  nextButton.addEventListener('click', () => {
    currentPage++;
    loadResults(container, currentQuery, currentPage);
  });
}

/**
 * Load and display search results
 * @param {HTMLElement} container - Container element with the UI
 * @param {string} query - Search query
 * @param {number} page - Page number
 */
async function loadResults(container, query, page) {
  const resultsContainer = container.querySelector('#results-container');
  const prevButton = container.querySelector('#prev-page');
  const pageInfo = container.querySelector('#page-info');
  
  // Update UI
  resultsContainer.innerHTML = '<div class="loading">Loading results...</div>';
  prevButton.disabled = page <= 1;
  pageInfo.textContent = `Page ${page}`;
  
  // Fetch results
  const images = await searchGoogleImages(query, page);
  
  // Display results
  if (images.length === 0) {
    resultsContainer.innerHTML = '<div class="loading">No results found.</div>';
    return;
  }
  
  resultsContainer.innerHTML = '';
  images.forEach((image, index) => {
    const imageElement = document.createElement('div');
    imageElement.className = 'image-item';
    imageElement.innerHTML = `
      <img src="${image.url}" alt="${image.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%23f1f1f1\\' /%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'%23999\\'%3EImage not available%3C/text%3E%3C/svg%3E'">
      <div class="title">${image.title}</div>
      <div class="actions">
        <button class="download-btn">Download</button>
        <button class="view-btn">View Source</button>
      </div>
    `;
    
    // Download button
    const downloadBtn = imageElement.querySelector('.download-btn');
    downloadBtn.addEventListener('click', async () => {
      try {
        const filename = `google-image-${index + 1}.jpg`;
        await downloadImage(image.url, filename);
        
        // Show success indicator
        downloadBtn.textContent = 'Downloaded!';
        setTimeout(() => {
          downloadBtn.textContent = 'Download';
        }, 2000);
      } catch (error) {
        // Show error indicator
        downloadBtn.textContent = 'Failed';
        setTimeout(() => {
          downloadBtn.textContent = 'Download';
        }, 2000);
      }
    });
    
    // View source button
    const viewBtn = imageElement.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
      window.open(image.source, '_blank');
    });
    
    resultsContainer.appendChild(imageElement);
  });
}

/**
 * Initialize the Google Images MCP
 * @param {string} query - Initial search query
 */
function initGoogleImagesMCP(query = '') {
  // Create container
  const container = document.createElement('div');
  container.id = 'google-images-mcp-container';
  document.body.appendChild(container);
  
  // Render UI
  renderUI(container, query);
}

// Export functions for Claude Desktop MCP
module.exports = {
  initGoogleImagesMCP,
  searchGoogleImages,
  downloadImage,
  config
};
