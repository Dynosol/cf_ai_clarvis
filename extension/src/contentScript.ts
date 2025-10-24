/**
 * Content script that extracts page content and metadata
 * Runs on all pages and responds to requests from the extension popup
 */

interface PageContext {
  title: string;
  url: string;
  text: string;
  description: string;
  mainContent: string;
  timestamp: string;
}

/**
 * Extract the main text content from the page
 * Tries to be smart about finding the main content area
 */
function extractMainContent(): string {
  // Try to find main content areas
  const mainSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.main-content',
    '#main-content',
    '.content',
    '#content'
  ];

  for (const selector of mainSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent) {
      return element.textContent.trim();
    }
  }

  // Fallback to body text
  return document.body.innerText.trim();
}

/**
 * Extract clean, readable text from the page
 */
function extractPageText(): string {
  const mainContent = extractMainContent();
  
  // Limit to first 10,000 characters to avoid token limits
  return mainContent.substring(0, 10000);
}

/**
 * Get page metadata
 */
function getPageMetadata(): PageContext {
  // Get meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  const description = metaDescription?.getAttribute('content') || '';

  // Get page title
  const title = document.title || '';

  // Get main text content
  const text = extractPageText();
  const mainContent = extractMainContent().substring(0, 5000);

  return {
    title,
    url: window.location.href,
    text,
    description,
    mainContent,
    timestamp: new Date().toISOString()
  };
}

/**
 * Listen for messages from the popup/background script
 */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getPageContext') {
    try {
      const context = getPageMetadata();
      sendResponse({ success: true, context });
    } catch (error) {
      console.error('Error extracting page context:', error);
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  return true; // Keep the message channel open for async response
});

// Also store the context in chrome.storage for quick access
function updateStoredContext() {
  try {
    const context = getPageMetadata();
    // Check if extension context is still valid before storing
    if (chrome.runtime?.id) {
      chrome.storage.local.set({ pageContext: context }, () => {
        if (chrome.runtime.lastError) {
          console.warn('Storage error (context may be invalidated):', chrome.runtime.lastError.message);
        }
      });
    } else {
      console.warn('Extension context invalidated, skipping storage update');
    }
  } catch (error) {
    console.error('Error storing page context:', error);
  }
}

// Track current URL to detect page changes
let currentUrl = window.location.href;

// Update context on page load and when content changes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateStoredContext);
} else {
  updateStoredContext();
}

// Update context when the page content changes significantly
let contextUpdateTimeout: ReturnType<typeof setTimeout> | undefined;

const observer = new MutationObserver(() => {
  // Debounce updates
  if (contextUpdateTimeout) {
    clearTimeout(contextUpdateTimeout);
  }
  contextUpdateTimeout = setTimeout(updateStoredContext, 1000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Listen for URL changes (for SPAs and navigation)
const checkUrlChange = () => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    console.log('URL changed, updating page context:', currentUrl);
    updateStoredContext();
  }
};

// Check for URL changes periodically and on navigation events
setInterval(checkUrlChange, 1000);

// Listen for navigation events
window.addEventListener('popstate', checkUrlChange);
window.addEventListener('pushstate', checkUrlChange);
window.addEventListener('replacestate', checkUrlChange);

// Override history methods to catch programmatic navigation
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  setTimeout(checkUrlChange, 100);
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  setTimeout(checkUrlChange, 100);
};

console.log('Clarvis content script loaded');

