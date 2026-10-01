# Store listing copy — 1.4.0

Prepared on 1 October 2026 for Chrome Web Store and Microsoft Edge Add-ons. This file is submission-ready copy, not a record of a published store update.

## Name

Dynamics 365 Form Debugger

## Short description

Debug Dynamics 365 Journeys forms: copy Form IDs, edit hidden fields, and bypass form cache.

Localized short descriptions ship in the eleven `Chrome-Edge/_locales/*/messages.json` catalogs. Each stays within the [Chrome manifest description limit](https://developer.chrome.com/docs/extensions/reference/manifest/description).

## Detailed description

Inspect and test Dynamics 365 Customer Insights - Journeys forms in Chrome or Microsoft Edge.

- View and copy the detected Form ID.
- Display editable copies of native hidden inputs and Dynamics designer-hidden fields, with green borders to identify debug controls.
- Synchronize edits to the original form controls for submission testing.
- Automatically add `#d365mkt-nocache` on HTTPS pages at `mkt.dynamics.com` and its subdomains, including numbered regional asset hosts.
- Check whether the bypass marker is set on the current supported URL. The badge reports URL state; it does not measure network cache behavior.
- Pause or resume the extension's features using the popup toggle. The preference is stored locally.
- Use the interface in English, Spanish, German, Japanese, French, Portuguese, Russian, Italian, Dutch, or Polish.

The extension inspects the first detected Dynamics form container in the top-level page. Script-embedded forms on third-party pages can be inspected, but those page URLs are not changed automatically. To inspect a form inside a cross-origin iframe, open its standalone Dynamics URL directly. Browser-internal pages cannot run the content script.

## What's new in 1.4.0

- Cache bypass now supports the complete HTTPS `mkt.dynamics.com` domain family, including `assets1-gbr` and other numbered or nested subdomains.
- Popup cache status reflects the current URL instead of assuming bypass from the feature toggle.
- Query parameters and existing fragment text are preserved when adding or removing the trailing bypass marker.
- Updated short descriptions, current branding, store images, and documentation.

## Privacy and permissions copy

The extension does not collect, store, or transmit form values, browsing history, credentials, or telemetry. Form IDs and hidden-field edits remain in the current page session. Submitting the website's form may transmit edited values through the website's normal submission process.

Only the enabled/disabled preference is persisted in `chrome.storage.local`. Opening support visits the external website at `https://mylokaye.me`.

- `activeTab`: request the current tab's detected Form ID and read its URL when the popup is invoked.
- `storage`: persist the local feature-enabled preference.
- `*://*.dynamics.com/*`: read supported tab URLs and update the bypass marker on the Marketing domain.
- `<all_urls>` content-script matches: inspect script-embedded Dynamics forms on third-party websites. Field inspection is scoped to the detected Dynamics form container.

No additional permissions, remote code, or data collection were introduced for 1.4.0. Broad content-script site access remains an existing store-review consideration.

## Artwork

| File | Purpose | Dimensions |
| --- | --- | --- |
| `Chrome-Edge/icons/icon128.png` | Installation and store icon | 128 × 128 |
| `Screenshots/1280.png` | Current UI screenshot with example form | 1280 × 800 |
| `Screenshots/440.png` | Small promotional tile | 440 × 280 |
| `Screenshots/1400.png` | Marquee promotional image | 1400 × 560 |
| `docs/dynamics-365-form-debugger-banner.jpg` | Repository banner | 1280 × 640 |

The UI example uses the packaged 1.4.0 popup, current logo, and synthetic form metadata. It contains no customer data. Artwork dimensions follow [Chrome Web Store image guidance](https://developer.chrome.com/docs/webstore/images). The 128-pixel icon retains the existing rounded-square branding; Chrome recommends inset artwork for consistent visual weight across listings.

The extension ZIP includes the runtime files, locale catalogs, required icons, and license. Store images, historical design concepts, README material, `.DS_Store`, signing keys, and development files are excluded.

## Support and independence

Support: [mylokaye.me](https://mylokaye.me).

Dynamics 365 Form Debugger is an independent tool by Mylo Kaye. It is not affiliated with, endorsed by, or sponsored by Microsoft Corporation.
