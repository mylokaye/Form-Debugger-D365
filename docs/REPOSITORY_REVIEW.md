# Repository Review

Reviewed on 7 August 2026; cache-bypass behavior and release materials reviewed again on 1 October 2026. This document describes the repository as found; it is not a promise that every current behavior is intentional.

## Executive Summary

The repository contains a small, readable, dependency-free Manifest V3 extension for Chrome and Edge. Its source is directly loadable from `Chrome-Edge/`; there is no compilation or packaging step. The implementation is split sensibly between a service worker, a content script, a popup, and shared constants.

The extension automatically renders editable hidden-field copies and applies cache bypass while its persisted feature toggle is enabled. Form detection and permissions still need deliberate review because the extension supports forms embedded on arbitrary sites while its background URL handling is limited to HTTPS pages at `mkt.dynamics.com` and its subdomains.

## Current Structure

```text
.
├── AGENTS.md
├── Chrome-Edge/
│   ├── background.js
│   ├── config.js
│   ├── content-script.js
│   ├── _locales/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   ├── icon128.png
│   │   └── icon300.png
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── docs/
│   └── REPOSITORY_REVIEW.md
├── LICENSE
└── README.md
```

The manifest and README use version `1.4.0`. The declared action icons are 16, 48, and 128 pixels. The popup also uses the packaged 300-pixel icon for its centered brand mark. Store images under `Screenshots/` show the current branding and 1.4.0 interface; historical concept artwork under `docs/design/` is excluded from the extension package.

## Architecture

### Manifest

`Chrome-Edge/manifest.json` declares:

- Manifest V3.
- The `activeTab` permission.
- The `storage` permission for the locally persisted feature-enabled preference.
- English as the default locale, with ten supported languages across eleven packaged locale catalogs under `_locales/`.
- `*://*.dynamics.com/*` host permission.
- A classic background service worker at `background.js`.
- A popup action at `popup.html`.
- `config.js` and `content-script.js` as content scripts on `<all_urls>` at `document_start`.

Although `host_permissions` is limited to Dynamics domains, the `<all_urls>` content-script match is broad site access and should be treated as such during permission and store review.

### Shared Configuration

`config.js` defines the global `CONFIG` object. It contains DOM IDs, logging styles, support URLs, the Marketing domain and URL helpers, the no-cache hash, localized cache-status states, selectors, message types, the feature state storage key, and its enabled-by-default value.

Unused overlay-era IDs, timeout/style constants, and comments were removed during the 1.4.0 release pass. The CommonJS export branch supports local validation and is not used by the extension. Runtime message types are shared through `CONFIG.MESSAGE_TYPES`.

### Background Service Worker

`background.js` imports `config.js` with `importScripts`, listens to `chrome.tabs.onUpdated`, reads the persisted feature state, and parses changed or refreshed tab URLs with the Web `URL` API. It accepts HTTPS URLs whose hostname is exactly `mkt.dynamics.com` or ends in `.mkt.dynamics.com`. Numbered and nested subdomains are supported; lookalike domains and other Dynamics domains are excluded.

For a matching URL, it appends `#d365mkt-nocache` to the fragment when the Dynamics marker is absent and the extension is enabled. Query parameters and any earlier fragment text are preserved. While disabled, it removes only a trailing bypass marker.

Tab-update callback errors are handled.

### Content Script

`content-script.js` starts at `document_start`, resolves the persisted feature state, and when enabled:

- Observes resource performance entries containing `landingpageforms` and logs them.
- Checks the first element matching `[data-form-id]` for Form ID metadata independently of field detection.
- Reads `data-form-id`, `data-form-api-url`, and `data-cached-form-url` when present.
- Counts descendant `input`, `select`, and `textarea` controls inside the Form ID container or a standalone `form.marketingForm`.
- Attaches a `MutationObserver` to the field container after DOM readiness and observes nested control changes.
- Responds to `GET_FORM_INFO` with the detected Form ID state.
- Automatically renders editable, non-submitting visual copies of native hidden inputs and Dynamics form-designer hidden field blocks.
- Synchronizes edits from those visual copies to source controls for the current page session.

It does not transmit detected data. When disabled, it does not start the resource or mutation observers and removes the debug labels and stylesheet it created. Detection can succeed when the popup asks later, but mutation monitoring is not attached if the form container is inserted after the one initialization attempt.

### Popup

`popup.html` contains all popup markup and CSS. `popup.js`:

- Queries the active tab and requests form information from its content script.
- Shows the feature toggle, Form ID, cache-bypass status, and installed version in a compact branded panel. Cache status checks the supported active-tab URL and updates when that tab navigates; it does not infer cache bypass from the toggle or claim to measure network caching.
- Persists the feature toggle in `chrome.storage.local` and refreshes the active tab after a successful change when possible.
- Copies the Form ID to the clipboard.
- Opens the support page from the popup information button.
- Localizes visible popup text with `chrome.i18n.getMessage()` and displays the closest supported browser UI language.

The information button opens the centralized `CONFIG.URLS.SUPPORT` destination at `mylokaye.me`.

## State Model Found

The extension persists one local boolean preference, `extensionEnabled`, defaulting to `true` when no value exists. The background worker and content script both honor that preference. Form names and values are not stored or transmitted by the extension. Editing a shown field updates its source control, which the host page may transmit through its normal form submission.

## Findings and Risks

### Medium priority

1. **No-form and unavailable-content-script states are conflated.** A restricted URL, injection failure, or extension-update mismatch is displayed as though a normal page had no form.
2. **Broad page access needs confirmation.** `<all_urls>` supports embedded forms on arbitrary sites, but it is a substantial permission surface. Confirm whether optional host access, user-triggered injection, or narrower matching can preserve the intended flow.
3. **Embedded-page bypass is manual.** The popup reports automatic bypass as not applicable on third-party hosts. Inspection and hidden-field rendering still work there, but automatic URL changes remain limited to the Marketing domain.

### Maintenance and documentation

1. The field-count observer attaches only when a form container exists at its DOM-ready initialization; hidden-field rendering has its own document-level observer and does handle late insertion.
2. There is no committed automated validation, test suite, linting, or release packaging script; release checks currently run without adding runtime tooling.
3. `.gitignore` ignores common package-manager lockfiles. If Node tooling is introduced, its chosen lockfile should be committed for reproducibility.

## What Is Already Good

- The codebase is small and approachable.
- Manifest V3 is already in use.
- Shared constants reduce duplicated selectors, message types, URLs, logging styles, and URL patterns.
- The service worker registers its listener at top level and does not depend on durable in-memory state.
- The feature toggle has a small persisted state model, while form names and values remain outside extension storage.
- The background worker avoids a tab update when the URL does not change.
- The extension has no third-party runtime dependencies, remote code, analytics, or telemetry.
- Popup scripts are external files, consistent with extension CSP requirements.
- Tab query, messaging, tab creation, clipboard, and tab-update failure paths are handled.
- The content script uses `PerformanceObserver` rather than monkey-patching page network APIs.

## Recommended Development Order

1. **Define detection semantics.** Specify supported embed patterns and an exact definition of a detected field.
2. **Add minimal automated checks.** Start with manifest parsing, JavaScript syntax checks, URL/hash unit tests, and pure form-state helpers. Introduce tooling only after choosing it deliberately.
3. **Harden dynamic detection.** Handle late iframe/container insertion and observer cleanup without continuous broad DOM scans.
4. **Review permissions.** Verify current APIs and the narrowest workable access model against current Chrome documentation.
5. **Refine unavailable states.** Separate restricted-page, missing-receiver, and no-form states where the distinction helps users.

## Suggested Future Structure

Do not reorganize solely for aesthetics. If the extension grows or adopts a build step, a useful target would be:

```text
extension/
├── manifest.json
├── src/
│   ├── background/
│   ├── content/
│   ├── popup/
│   └── shared/
├── assets/
└── tests/
```

Until then, the current flat `Chrome-Edge/` structure is proportionate. A premature framework migration would add more maintenance than value.

## API findings for the cache-bypass fix

Context7 was unavailable in the session. Official [Chrome Tabs API documentation](https://developer.chrome.com/docs/extensions/reference/api/tabs) confirms that existing host permissions expose matching tab URLs, `activeTab` permits reading the invoked tab, and tab URL changes and refreshes use `tabs.update` and `tabs.reload` without an added `tabs` permission. [Match-pattern documentation](https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns) confirms that the existing Dynamics wildcard covers Marketing subdomains. No manifest permission or content-script match changes were required.

Microsoft documents the marker in [Deploy pages that contain Customer Insights - Journeys forms](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/real-time-marketing-deploy-pages). The live page's [Dynamics form loader](https://formui-usa1.mkt.dynamics.com/gbr/FormLoader/FormLoader.bundle.js), inspected on 1 October 2026, checks whether `window.location.hash` contains `d365mkt-nocache`. The shared marker check follows that behavior and ignores a similarly named query parameter.

## Current Validation Baseline

With no project test runner, the minimum non-browser validation is:

```sh
node -e 'JSON.parse(require("fs").readFileSync("Chrome-Edge/manifest.json", "utf8"))'
node --check Chrome-Edge/config.js
node --check Chrome-Edge/background.js
node --check Chrome-Edge/content-script.js
node --check Chrome-Edge/popup.js
```

These checks catch only parse and syntax errors. Behavioral changes still require loading `Chrome-Edge/` as an unpacked extension and testing the service worker, content script, and popup together.

### Cache-bypass verification on 1 October 2026

- Passed manifest parsing, all four runtime JavaScript syntax checks, all eleven locale catalogs and required status messages, and packaged-file reference checks.
- Passed 44 targeted checks against the actual background and popup sources with simulated Chrome APIs: supported and excluded hosts, fragment/query handling, duplicate-marker avoidance, enabled/disabled state, tab navigation, missing receivers, storage and tab-update failures, clipboard success/failure, the unchanged support destination, and the popup's manifest-derived 1.4.0 version.
- In Chrome, verified the actual popup HTML/CSS and runtime scripts using a local browser-API fixture. The badge changed from inactive to set when the background source handled a simulated page load, followed ordinary/restricted/unavailable page states, and changed with the feature toggle. Keyboard focus was visible on the toggle and Form ID button. The 400-pixel popup and all eleven localized set-state badges fit without panel overflow or overlap. No warnings or errors were captured in the fixture page console.
- The updated source has not yet been loaded as an unpacked extension: browser-control policy blocked access to extension management. Actual service-worker and extension-popup consoles, updated live-form behavior, popup reopening after browser restart, late form insertion, embedded/iframe forms, real clipboard operations, and the external support page still need the unpacked-extension check. Fixture verification is not a substitute for that check.
