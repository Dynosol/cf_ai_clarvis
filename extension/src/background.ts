/**
 * Background service worker for the Clarvis extension
 * Manages state and communication between content scripts and popup
 */

console.log('Clarvis background service worker started');

// Listen for extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default configuration
    chrome.storage.local.set({
      agentUrl: 'http://localhost:8787', // Default to local dev, user can change in settings
      theme: 'dark'
    });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getActiveTabContext') {
    // Get context from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      
      if (!tab?.id) {
        sendResponse({ success: false, error: 'No active tab found' });
        return;
      }

      // Check if the page is a restricted page (chrome://, chrome-extension://, etc.)
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
        sendResponse({ 
          success: false, 
          error: 'Cannot access this page type',
          context: {
            title: tab.title || 'Restricted Page',
            url: tab.url || 'about:blank',
            text: '',
            description: 'This page type does not allow content script access.',
            mainContent: 'Content cannot be extracted from this page.',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      // Try to communicate with content script with retry logic
      const tryGetContext = (retries = 3) => {
        if (!tab.id) {
          sendResponse({ success: false, error: 'No tab ID available' });
          return;
        }
        
        chrome.tabs.sendMessage(
          tab.id,
          { action: 'getPageContext' },
          (response) => {
            if (chrome.runtime.lastError) {
              if (retries > 0) {
                // Retry after a short delay
                console.warn(`Content script not responding, retrying... (${retries} attempts left)`);
                setTimeout(() => tryGetContext(retries - 1), 500);
                return;
              }
              
              // Content script might not be loaded yet, provide fallback
              console.warn('Content script not responding after retries:', chrome.runtime.lastError.message);
              sendResponse({ 
                success: true, 
                context: {
                  title: tab.title || 'Unknown Page',
                  url: tab.url || 'about:blank',
                  text: '',
                  description: 'Page is loading or content script not yet available.',
                  mainContent: 'Clarvis is taking a second to process the page... Please be patient.',
                  timestamp: new Date().toISOString()
                }
              });
            } else {
              sendResponse(response);
            }
          }
        );
      };
      
      tryGetContext();
    });
    return true; // Keep message channel open
  }

  if (request.action === 'updateAgentUrl') {
    chrome.storage.local.set({ agentUrl: request.url }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});

export {};

