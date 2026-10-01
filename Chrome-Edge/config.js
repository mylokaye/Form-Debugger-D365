/**
 * config.js — Central configuration file for the Dynamics 365 Form Debugger extension
 *
 * This file contains all constants, magic numbers, and configuration values used
 * throughout the extension. Centralizing these values makes the code more maintainable
 * and easier to modify.
 *
 * The content script, popup, and classic service worker share this configuration
 * through a classic script; there is no module build step.
 */

// Define all configuration in a global CONFIG object
const CONFIG = {};

/**
 * DOM element IDs used throughout the extension
 * @const {Object}
 */
CONFIG.ELEMENT_IDS = {
  HIDDEN_FIELDS_STYLE: "d365-debug-hidden-fields-style"
};

/**
 * Console logging configuration
 * @const {Object}
 */
CONFIG.LOGGING = {
  /** Prefix for all console log messages */
  PREFIX: "[Dynamics 365 Form Debugger]",
  /** Blue brand treatment for the plugin name */
  PREFIX_STYLE: "color: #3360C5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600;",
  /** Matching typography with black diagnostic text */
  MESSAGE_STYLE: "color: #171717; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600;"
};

/**
 * Cache bypass configuration
 * @const {Object}
 */
CONFIG.CACHE_BYPASS = {
  /** Exact Marketing domain and all of its subdomains */
  DOMAIN: "mkt.dynamics.com",
  /** URL hash used to disable Dynamics 365 form caching */
  URL_HASH: "#d365mkt-nocache"
};

/** Returns whether a URL belongs to the supported HTTPS Marketing domain. */
CONFIG.isDynamicsMarketingUrl = function (url) {
  if (typeof url !== "string") return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:"
      && (parsedUrl.hostname === CONFIG.CACHE_BYPASS.DOMAIN
        || parsedUrl.hostname.endsWith(`.${CONFIG.CACHE_BYPASS.DOMAIN}`));
  } catch {
    return false;
  }
};

/** Mirrors the Dynamics form loader's check of the fragment, not the query. */
CONFIG.hasCacheBypass = function (url) {
  if (typeof url !== "string") return false;

  try {
    return new URL(url).hash.includes(CONFIG.CACHE_BYPASS.URL_HASH.slice(1));
  } catch {
    return false;
  }
};

CONFIG.CACHE_STATUS = {
  CHECKING: { message: "cacheChecking", fallback: "Checking cache…" },
  SET: { message: "cacheBypassSet", fallback: "Cache bypass set" },
  INACTIVE: { message: "cacheBypassInactive", fallback: "Bypass inactive" },
  NOT_APPLICABLE: { message: "cacheNotApplicable", fallback: "Not applicable" },
  UNAVAILABLE: { message: "cacheStatusUnavailable", fallback: "Status unavailable" },
  DISABLED: { message: "extensionDisabled", fallback: "Extension disabled" }
};

CONFIG.URLS = {
  SUPPORT: "https://mylokaye.me"
};

/**
 * Persisted extension state
 * @const {Object}
 */
CONFIG.STORAGE_KEYS = {
  EXTENSION_ENABLED: "extensionEnabled"
};

/**
 * Default persisted values used for first-run and storage-error recovery
 * @const {Object}
 */
CONFIG.DEFAULTS = {
  EXTENSION_ENABLED: true
};

/**
 * DOM selectors used for form detection
 * @const {Object}
 */
CONFIG.SELECTORS = {
  /** Attribute selector used only for Dynamics 365 form ID detection */
  FORM_ID_CONTAINER: "[data-form-id]",
  /** Dynamics 365 form element used for field detection when no form ID exists */
  MARKETING_FORM: "form.marketingForm",
  /** Data-entry controls counted as fields; submit and other action controls are excluded */
  FIELD_CONTROLS: "input:not([type='submit']):not([type='button']):not([type='reset']), select, textarea",
  /** Native hidden inputs and controls inside Dynamics field-block wrappers */
  HIDDEN_FIELD_CANDIDATES: "input[type='hidden'], [class*='FormFieldBlock'] input, [class*='FormFieldBlock'] select, [class*='FormFieldBlock'] textarea",
  /** Dynamics wraps form-designer hidden fields in a non-rendered field block */
  DYNAMICS_FIELD_BLOCK: "[class*='FormFieldBlock']"
};

/**
 * Message types for inter-component communication
 * @const {Object}
 */
CONFIG.MESSAGE_TYPES = {
  GET_FORM_INFO: "GET_FORM_INFO"
};

CONFIG.HIDDEN_FIELD_DEBUG = {
  CLASS_NAME: "d365-debug-hidden-field",
  MARKER_ATTRIBUTE: "data-d365-debug-hidden-field"
};

// Allow dependency-free local validation to read the same configuration.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// Expose the shared configuration to extension-page scripts.
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
