// background.js — apply cache bypass only while the extension is enabled

// Import config.js into the service worker
importScripts('config.js');

/**
 * Listens for tab URL updates and applies cache bypass on the Marketing domain
 * while the extension is enabled. The loading event also covers a normal refresh
 * where Chrome does not provide a new URL in changeInfo.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || (changeInfo.status === 'loading' ? tab?.url : null);
  if (!CONFIG.isDynamicsMarketingUrl(url)) return;

  readExtensionEnabled((enabled) => {
    if (enabled) {
      applyNoCache(tabId, url);
    } else {
      removeNoCache(tabId, url);
    }
  });
});

/**
 * Reads the persisted extension state and falls back to enabled if storage is
 * unavailable so an existing installation keeps its prior behavior.
 *
 * @param {(enabled: boolean) => void} callback - State callback
 * @returns {void}
 */
function readExtensionEnabled(callback) {
  chrome.storage.local.get([CONFIG.STORAGE_KEYS.EXTENSION_ENABLED], (data) => {
    if (chrome.runtime.lastError) {
      console.error(
        `%c${CONFIG.LOGGING.PREFIX}%c Extension state could not be read. ${chrome.runtime.lastError.message}`,
        CONFIG.LOGGING.PREFIX_STYLE,
        CONFIG.LOGGING.MESSAGE_STYLE
      );
      callback(CONFIG.DEFAULTS.EXTENSION_ENABLED);
      return;
    }

    const storedValue = data[CONFIG.STORAGE_KEYS.EXTENSION_ENABLED];
    callback(typeof storedValue === 'boolean' ? storedValue : CONFIG.DEFAULTS.EXTENSION_ENABLED);
  });
}

/**
 * Applies the #d365mkt-nocache hash to a tab's URL.
 * Only updates the tab if the URL actually needs to change.
 *
 * @param {number} tabId - The ID of the tab to modify
 * @param {string} url - The current URL of the tab
 * @returns {void}
 */
function applyNoCache(tabId, url) {
  if (CONFIG.hasCacheBypass(url)) {
    return;
  }

  const targetUrl = new URL(url);
  targetUrl.hash += CONFIG.CACHE_BYPASS.URL_HASH;
  chrome.tabs.update(tabId, { url: targetUrl.href }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `%c${CONFIG.LOGGING.PREFIX}%c Cache bypass could not be applied. ${chrome.runtime.lastError.message}`,
        CONFIG.LOGGING.PREFIX_STYLE,
        CONFIG.LOGGING.MESSAGE_STYLE
      );
      return;
    }

    console.log(
      `%c${CONFIG.LOGGING.PREFIX}%c Cache bypass applied.`,
      CONFIG.LOGGING.PREFIX_STYLE,
      CONFIG.LOGGING.MESSAGE_STYLE
    );
  });
}

/**
 * Removes the cache-bypass marker previously added by this extension.
 *
 * @param {number} tabId - The ID of the tab to modify
 * @param {string} url - The current URL of the tab
 * @returns {void}
 */
function removeNoCache(tabId, url) {
  const targetUrl = new URL(url);
  if (!targetUrl.hash.endsWith(CONFIG.CACHE_BYPASS.URL_HASH)) return;

  targetUrl.hash = targetUrl.hash.slice(0, -CONFIG.CACHE_BYPASS.URL_HASH.length);
  chrome.tabs.update(tabId, { url: targetUrl.href }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `%c${CONFIG.LOGGING.PREFIX}%c Cache bypass could not be removed. ${chrome.runtime.lastError.message}`,
        CONFIG.LOGGING.PREFIX_STYLE,
        CONFIG.LOGGING.MESSAGE_STYLE
      );
      return;
    }

    console.log(
      `%c${CONFIG.LOGGING.PREFIX}%c Cache bypass removed because the extension is disabled.`,
      CONFIG.LOGGING.PREFIX_STYLE,
      CONFIG.LOGGING.MESSAGE_STYLE
    );
  });
}
