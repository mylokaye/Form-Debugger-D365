/**
 * popup.js — Renders extension status and detected Form ID.
 * Config is loaded from config.js before this file.
 */

const formIdButton = document.getElementById("form-id");
const formIdValue = document.getElementById("form-id-value");
const formIdLabel = document.getElementById("form-id-label");
const cacheStatus = document.getElementById("cache-status");
const extensionDetails = document.getElementById("extension-details");
const versionElement = document.getElementById("extension-version");
const extensionInfoButton = document.getElementById("extension-info");
const extensionToggle = document.getElementById("extension-toggle");
const extensionToggleLabel = document.getElementById("extension-toggle-label");
const extensionToggleState = document.getElementById("extension-toggle-state");
let extensionEnabled = CONFIG.DEFAULTS.EXTENSION_ENABLED;

/**
 * Returns a localized message with a stable English fallback.
 *
 * @param {string} name - Message key from _locales
 * @param {string} fallback - English fallback used if a locale entry is missing
 * @returns {string}
 */
function getMessage(name, fallback) {
  return chrome.i18n.getMessage(name) || fallback;
}

document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = getMessage("extensionName", "Dynamics 365 Form Debugger");
extensionToggleLabel.textContent = getMessage("extensionToggleLabel", "Extension features");
formIdLabel.textContent = getMessage("formIdLabel", "Form ID:");
formIdButton.title = getMessage("copyFormId", "Copy Form ID");
extensionDetails.setAttribute("aria-label", getMessage("extensionDetails", "Extension details"));
extensionInfoButton.title = getMessage("openSupport", "Open support");
extensionInfoButton.setAttribute("aria-label", getMessage("openSupport", "Open support"));
versionElement.textContent = `V ${chrome.runtime.getManifest().version}`;

/**
 * Returns a validated extension state from a storage result.
 *
 * @param {Object} data - Storage result
 * @returns {boolean}
 */
function getStoredExtensionEnabled(data) {
  const storedValue = data[CONFIG.STORAGE_KEYS.EXTENSION_ENABLED];
  return typeof storedValue === "boolean"
    ? storedValue
    : CONFIG.DEFAULTS.EXTENSION_ENABLED;
}

/**
 * Updates the toggle, state text, and cache status for the extension state.
 *
 * @param {boolean} enabled - Whether extension features are enabled
 * @returns {void}
 */
function updateExtensionStateUI(enabled) {
  extensionEnabled = enabled;
  extensionToggle.checked = enabled;
  extensionToggleState.textContent = enabled
    ? getMessage("enabled", "Enabled")
    : getMessage("disabled", "Disabled");
  extensionToggle.title = enabled
    ? getMessage("disableFeatures", "Disable extension features")
    : getMessage("enableFeatures", "Enable extension features");
  cacheStatus.textContent = enabled
    ? getMessage("cacheDisabled", "Cache disabled")
    : getMessage("extensionDisabled", "Extension disabled");
  cacheStatus.classList.toggle("is-disabled", !enabled);
}

/**
 * Reads the persisted extension state.
 *
 * @param {(enabled: boolean) => void} callback - State callback
 * @returns {void}
 */
function readExtensionState(callback) {
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

    callback(getStoredExtensionEnabled(data));
  });
}

/**
 * Updates the detected Form ID without changing the row structure.
 *
 * @param {string|null} formId - Detected Dynamics Form ID
 */
function updateFormId(formId) {
  formIdValue.textContent = formId || "---";
  formIdButton.disabled = !formId;
}

/**
 * Queries the active tab for its detected Dynamics Form ID.
 */
function queryFormInfo(enabled = extensionEnabled) {
  if (!enabled) {
    updateFormId(null);
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError || !tabs[0] || typeof tabs[0].id !== "number") {
      updateFormId(null);
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { type: CONFIG.MESSAGE_TYPES.GET_FORM_INFO }, (response) => {
      if (chrome.runtime.lastError || !response || response.extensionEnabled === false || response.formIdDetected !== true) {
        updateFormId(null);
        return;
      }

      updateFormId(response.formId || getMessage("unknown", "Unknown"));
    });
  });
}

/**
 * Refreshes the active tab after a successful feature-state change.
 * Restricted browser pages may reject the reload, which is safe to ignore.
 *
 * @returns {void}
 */
function refreshActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError || !tabs[0] || typeof tabs[0].id !== "number") return;

    chrome.tabs.reload(tabs[0].id, {}, () => {
      if (chrome.runtime.lastError) {
        console.error(
          `%c${CONFIG.LOGGING.PREFIX}%c ${getMessage("reloadError", "The current page could not be refreshed.")} ${chrome.runtime.lastError.message}`,
          CONFIG.LOGGING.PREFIX_STYLE,
          CONFIG.LOGGING.MESSAGE_STYLE
        );
      }
    });
  });
}

formIdButton.addEventListener("click", () => {
  const formId = formIdValue.textContent;
  if (!formId || formId === "---" || formIdButton.classList.contains("is-copied")) return;

  navigator.clipboard.writeText(formId).then(() => {
    const originalFormId = formId;
    formIdValue.textContent = getMessage("copied", "Copied");
    formIdButton.classList.add("is-copied");

    setTimeout(() => {
      formIdValue.textContent = originalFormId;
      formIdButton.classList.remove("is-copied");
    }, 1000);
  }).catch((error) => {
    console.error(
      `%c${CONFIG.LOGGING.PREFIX}%c ${getMessage("formIdCopyError", "Form ID could not be copied.")} ${error.message || String(error)}`,
      CONFIG.LOGGING.PREFIX_STYLE,
      CONFIG.LOGGING.MESSAGE_STYLE
    );
  });
});

extensionInfoButton.addEventListener("click", () => {
  chrome.tabs.create({ url: CONFIG.URLS.SUPPORT }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `%c${CONFIG.LOGGING.PREFIX}%c ${getMessage("supportOpenError", "Support page could not be opened.")} ${chrome.runtime.lastError.message}`,
        CONFIG.LOGGING.PREFIX_STYLE,
        CONFIG.LOGGING.MESSAGE_STYLE
      );
    }
  });
});

extensionToggle.disabled = true;

readExtensionState((enabled) => {
  updateExtensionStateUI(enabled);
  extensionToggle.disabled = false;
  queryFormInfo(enabled);
});

extensionToggle.addEventListener("change", () => {
  const nextEnabled = extensionToggle.checked;
  const previousEnabled = extensionEnabled;
  extensionToggle.disabled = true;

  chrome.storage.local.set({
    [CONFIG.STORAGE_KEYS.EXTENSION_ENABLED]: nextEnabled
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `%c${CONFIG.LOGGING.PREFIX}%c ${getMessage("toggleSaveError", "Extension setting could not be saved.")} ${chrome.runtime.lastError.message}`,
        CONFIG.LOGGING.PREFIX_STYLE,
        CONFIG.LOGGING.MESSAGE_STYLE
      );
      updateExtensionStateUI(previousEnabled);
      extensionToggle.disabled = false;
      return;
    }

    updateExtensionStateUI(nextEnabled);
    extensionToggle.disabled = false;
    queryFormInfo(nextEnabled);
    refreshActiveTab();
  });
});
