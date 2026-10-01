![Dynamics 365 Form Debugger — browser extension by Mylo Kaye](docs/dynamics-365-form-debugger-banner.jpg)

# Dynamics 365 Form Debugger

A dependency-free Chrome and Microsoft Edge extension for debugging **Dynamics 365 Customer Insights - Journeys forms**.

It automatically applies the `#d365mkt-nocache` cache-bypass hash on HTTPS pages at `mkt.dynamics.com` and any of its subdomains, identifies the active Form ID, and exposes hidden form fields for submission testing.

## Installation

Install the extension from your browser's store:

- **Chrome Web Store:** [Dynamics 365 Form Debugger](https://chromewebstore.google.com/detail/dynamics-365-form-debugge/kdhnliicfgopcijgepghgohnhafphohf)
- **Microsoft Edge Add-ons:** [Dynamics 365 Form Debugger](https://microsoftedge.microsoft.com/addons/detail/dynamics-365-form-debugge/ceoaoafhphcpdokfdfkiilmndbepbbec)

For local development:

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the repository's `Chrome-Edge/` directory.

## Features

- **Automatic cache bypass** — Adds `#d365mkt-nocache` on HTTPS pages at `mkt.dynamics.com` and every subdomain, including numbered hosts such as `assets1-gbr.mkt.dynamics.com`.
- **Accurate cache status** — The popup reports whether the current supported page has the bypass marker, whether bypass is inactive, or whether the page is outside the automatic bypass scope.
- **Form ID detection** — Displays the detected Dynamics Form ID in the popup and copies it on click.
- **Editable hidden fields** — Renders hidden fields in their original form layout with a green debug border.
- **Hidden field support** — Handles native hidden inputs and designer-hidden `input`, `select`, and `textarea` controls in the detected Dynamics form.
- **Submission testing** — Synchronizes edits to the original source controls and dispatches normal `input` and `change` events.
- **Dynamic form support** — Labels newly inserted hidden fields without creating duplicates.
- **Feature toggle** — Enables or disables the extension's page features, stores that preference locally, and refreshes the active page when possible after a change.
- **Compact popup** — Uses a 400 × 260px layout with the extension logo, feature toggle, cache status, Form ID, installed version, and support link.
- **Consistent diagnostics** — Uses the **Dynamics 365 Form Debugger** console prefix with blue branding and clear black message text.
- **Localized interface** — Supports ten languages through eleven native Chrome locale catalogs.
- **No runtime dependencies or telemetry** — Uses browser APIs and plain HTML, CSS, and JavaScript only.

## How It Works

1. Open a supported Dynamics standalone form or a page with a Dynamics form embedded by script.
2. The extension detects the form and automatically displays editable copies of its hidden fields.
3. Hidden-field copies use the form's existing styles and a green border so they are easy to distinguish.
4. Editing a displayed copy updates the corresponding original control used by the form submission.
5. On HTTPS pages at `mkt.dynamics.com` or any subdomain, cache bypass is applied automatically while the extension is enabled. Query parameters are preserved. If a fragment already exists, the marker is appended to it; disabling the extension removes a trailing bypass marker and preserves the earlier fragment.
6. Use the popup's **Extension features** toggle to pause or resume cache bypass, form detection, field rendering, and diagnostics. The active page is refreshed when the browser allows it.
7. Open the extension popup to view or copy the Form ID, confirm cache status, view the installed version, or open support.

Reload the extension and refresh existing form tabs after installing a local update so the latest content script is injected.

The popup's **Cache bypass set** badge confirms the marker is present in the current supported URL. It does not measure network cache behavior. The Dynamics form loader uses this marker to request an uncached form; it does not disable all browser caching. Third-party pages can still be inspected for embedded forms, but their URLs are not changed automatically.

Inspection uses the first detected Dynamics form container in the top-level page. Cross-origin iframe forms are not inspected through their host page; open the form's standalone Dynamics URL to inspect it directly. Browser-internal pages cannot run the content script. A missing Form ID is shown as `---` and can also mean that the content script is unavailable.

## Hidden-Field Editing

The rendered controls are debug copies. Their `id`, `name`, `required`, `form`, and list bindings are removed so the copies cannot submit duplicate values.

When you edit a debug copy, the extension updates the original hidden control and dispatches the same `input` or `change` event. If you then submit the form, the website receives the edited value through its normal submission process.

Turning a native `input[type="hidden"]` into a visible debug control affects only the copy; the original input remains hidden.

## Privacy & Data

The extension does not collect, store, or transmit form values, browsing history, credentials, or telemetry.

- Form IDs are read from the current page and shown only in the popup.
- Hidden-field values and edits remain in the current page session.
- Edited values may be transmitted by the host website only when you submit its form.
- The extension stores only the enabled/disabled preference locally through `chrome.storage.local`; it does not persist form data.
- Selecting the popup's information button opens the external [support website](https://mylokaye.me).

## Permissions and Site Access

- **`activeTab`** — Allows the popup to request the detected Form ID from the current tab.
- **`storage`** — Stores the user's enabled/disabled preference locally so the toggle applies across page reloads and browser sessions.
- **`*://*.dynamics.com/*` host access** — Allows the service worker to read supported tab URLs and apply cache bypass. Automatic URL changes are limited to HTTPS pages at `mkt.dynamics.com` and its subdomains; other Dynamics domains and third-party sites are left untouched.
- **`<all_urls>` content-script access** — Allows detection when Dynamics forms are embedded on third-party websites. The content script limits field inspection to detected Dynamics form containers.

The extension does not collect or transmit the locally stored preference.

## Supported Languages

The manifest and popup support these ten languages:

- English
- Spanish
- German
- Japanese
- French
- Portuguese (Brazil and Portugal)
- Russian
- Italian
- Dutch
- Polish

Chrome selects the closest supported locale from the browser UI language and falls back to English.
Portuguese is packaged as both `pt_BR` and `pt_PT`; the ten languages therefore use eleven locale catalogs.

## Development

The unpacked extension is loaded directly from `Chrome-Edge/`; there is no build step or package manager.

Minimum static validation:

```sh
node -e 'JSON.parse(require("fs").readFileSync("Chrome-Edge/manifest.json", "utf8"))'
node --check Chrome-Edge/config.js
node --check Chrome-Edge/background.js
node --check Chrome-Edge/content-script.js
node --check Chrome-Edge/popup.js
```

Behavior changes should also be tested by loading `Chrome-Edge/` as an unpacked extension and exercising standalone, embedded, dynamically inserted, normal, and restricted pages.

## Release Materials

Version 1.4.0 metadata, store descriptions, and artwork are prepared locally. See [store listing copy](docs/STORE_LISTING.md), the [release audit](docs/RELEASE_1.4.0.md), and the [publication handoff](docs/PUBLISHING.md) for package contents, verification, and remaining browser checks. The [prepared privacy policy](docs/PRIVACY_POLICY.md) must also match the public policy used by the stores. Preparing these files does not publish an update to either browser store.

## Changelog

### [1.4.0] - 2026-10-01

- Support automatic cache bypass on `mkt.dynamics.com` and all HTTPS subdomains, including numbered regional asset hosts.
- Report the current URL's bypass marker in the popup instead of assuming cache bypass from the feature toggle.
- Preserve query parameters and existing fragment text when adding or removing the trailing bypass marker.
- Refresh localized descriptions, store artwork, screenshots, and release documentation for version 1.4.0.
- Document top-level form inspection, iframe limitations, and the meaning of the cache-status badge.

### [1.3.0] - 2026-08-07

- Added a persisted Extension features toggle that pauses page inspection, hidden-field rendering, diagnostics, and cache bypass.
- The toggle now enables and disables editable hidden-field rendering together with the other extension features.
- Refreshes the active page after a toggle change when the browser permits it.

### [1.2.1] - 2026-06-22

- Added automatic editable rendering for native and Dynamics designer-hidden fields.
- Added support for hidden text inputs, option sets, lookup controls, and textareas using their user-facing labels.
- Preserved the original form layout and styling while adding green debug borders.
- Synchronized debug edits to original submitted controls through `input` and `change` events.
- Added dynamic hidden-field refresh and duplicate-label prevention.
- Kept cache bypass always active on supported Dynamics asset URLs.
- Removed activation, cache, hidden-field display, and edit toggles.
- Removed persisted state and the `storage` permission.
- Redesigned the popup to a compact 400 × 218px layout with centered branding, cache status, Form ID, runtime version, and support access.
- Removed the popup field-count and separate form-detection status rows.
- Updated console branding to **Dynamics 365 Form Debugger**, with a blue plugin name and black diagnostic text.
- Improved Chrome API error handling and centralized message types, selectors, URLs, and logging styles.
- Updated privacy and permissions documentation to match current behavior.
- Added native Chrome localization for English, Spanish, German, Japanese, French, Portuguese, Russian, Italian, Dutch, and Polish.

### [1.0.0] - Initial release

- Added Dynamics Form ID and field-count detection.
- Added click-to-copy form details.
- Added cache bypass using `#d365mkt-nocache`.
- Added the original activation toggle, popup status indicators, resource observation, and mutation monitoring.
- Shipped as a dependency-free Manifest V3 extension for Chrome and Edge.

## Support

Visit [mylokaye.me](https://mylokaye.me) for support and feedback.

## Legal Notice

**Dynamics 365** and **Microsoft Edge** are registered trademarks of **Microsoft Corporation**. Dynamics 365 Form Debugger is an independent tool created by **Mylo Kaye** and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation.

- **Author:** Mylo Kaye
- **License:** Apache 2.0
- **Version:** 1.4.0
