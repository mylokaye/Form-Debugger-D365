# Version 1.4.0 release audit

Prepared locally on 1 October 2026. The extension package and store materials are ready for the remaining unpacked-browser checks. No browser-store update was submitted or published in this task.

## Release contents

- Manifest and popup version: `1.4.0`. The popup reads the installed manifest version rather than hard-coding it.
- Eleven locale catalogs: aligned message keys, refreshed short descriptions, and the current cache-status messages.
- Existing 16, 48, 128, and 300-pixel logo assets: retained and checked. The 300-pixel asset is used by the popup; 16, 48, and 128-pixel assets are declared in the manifest.
- Store images: replaced with current branding and the 1.4.0 popup. The form and Form ID shown are synthetic examples, not customer data or proof of an installed extension.
- Repository banner: retained; dimensions and README reference checked.
- Descriptions, changelog, privacy, permissions, architecture, and contributor instructions: aligned with the persisted feature toggle and current Marketing-domain scope.
- Historical popup concept: identified as historical in `docs/design/README.md`; excluded from release packages.

| Asset | Dimensions | Result |
| --- | --- | --- |
| `Chrome-Edge/icons/icon16.png` | 16 × 16 | Valid PNG |
| `Chrome-Edge/icons/icon48.png` | 48 × 48 | Valid PNG |
| `Chrome-Edge/icons/icon128.png` | 128 × 128 | Valid PNG |
| `Chrome-Edge/icons/icon300.png` | 300 × 300 | Valid PNG |
| `Screenshots/1280.png` | 1280 × 800 | Refreshed UI screenshot |
| `Screenshots/440.png` | 440 × 280 | Refreshed small promotional tile |
| `Screenshots/1400.png` | 1400 × 560 | Refreshed marquee image |
| `docs/dynamics-365-form-debugger-banner.jpg` | 1280 × 640 | Current repository banner |

## Package audit

The extension ZIP has `manifest.json` at its root and contains 22 files: six runtime entry files, four icons, eleven locale catalogs, and the Apache 2.0 license. It excludes `.DS_Store`, screenshots, docs, design concepts, the unrelated root logo, signing keys, and development fixtures. It remains directly loadable from `Chrome-Edge/` without a build step or dependencies.

A separate store-assets ZIP contains the three store images, the 128-pixel icon, `STORE_LISTING.md`, `PRIVACY_POLICY.md`, and `PUBLISHING.md`.

Both ZIPs are created outside the repository. Integrity checks cover ZIP CRCs, exact file inventories, the packaged manifest version, and byte-for-byte equality with source files.

| Package | Files | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `dynamics-365-form-debugger-1.4.0.zip` | 22 | 99,375 | `fed7bb1c0e3389b364556d3e9ada2d426f1080b6c6b23558a1c231b66bcce4ee` |
| `dynamics-365-form-debugger-1.4.0-store-assets.zip` | 5 | 630,927 | `c5c2f08bc1c179329d0db019b21d6cb4695a6b09522555e5ec4a6178d186fd57` |

## Verification

- Manifest JSON, version format, every packaged file reference, and all four JavaScript syntax checks passed.
- All eleven locale catalogs have matching, non-empty messages. Localized names and descriptions stay within Chrome's manifest limits.
- PNG dimensions, chunk CRCs, and compressed image data passed validation; the banner dimensions passed inspection.
- No permission, host-access, content-script registration, remote-code, or data-collection changes were introduced. Existing broad site access is explained in the README and store copy.
- The background and popup sources passed 44 targeted checks with simulated Chrome APIs, including host boundaries, query/fragment preservation, duplicate-marker avoidance, disabled behavior, navigation, error handling, missing receivers, clipboard outcomes, support destination, and the displayed version.
- The actual popup HTML/CSS and scripts were rendered in Chrome using a local Chrome-API fixture. Keyboard focus, the 400-pixel layout, all eleven localized set-state badges, and current release artwork were checked. The captured fixture console had no warnings or errors.

| Manual test area | Evidence and remaining work |
| --- | --- |
| Supported Dynamics page with a form | Original installed version was diagnosed on a live form. Updated URL logic and popup passed source/fixture checks; the installed 1.4.0 check remains pending. |
| Late form insertion | Not exercised with the updated unpacked extension. Existing observer limitations remain documented. |
| Normal website with no form | URL exclusion and popup state passed simulated checks; unpacked-browser check pending. |
| Third-party embedded form / iframe | Not exercised with the updated unpacked extension. Top-level script embeds and cross-origin iframe limits are documented. |
| Enabled/disabled bypass with query and existing hash | Passed targeted source checks and browser-API fixture transitions; real service-worker check pending. |
| Popup reopening after navigation and browser restart | Navigation passed simulated checks; actual popup reopening and browser restart pending. |
| Missing content-script receiver | Passed simulated checks; actual restricted-page popup check pending. |
| Clipboard success and failure | Passed simulated checks; real extension clipboard check pending. |
| Support and feedback | Configured support destination passed source checks and the public support URL was readable. Real popup-to-support navigation pending. |

Browser-control policy blocked extension-management access. After the user reported loading 1.4.0, the inspected popup in the active Chrome profile still showed **V 1.3.0**, **Cache disabled**, and the store extension ID. The toolbar menu exposed only that Form Debugger instance. A verified 1.4.0 instance is still required for the installed-browser gate. Actual service-worker, extension-popup, and target-page consoles for 1.4.0 remain unverified. Fixture checks do not replace those checks, and the browser was not restarted during this task.

## Documentation and external listings

Context7 was unavailable. Official Chrome documentation was used for [version syntax](https://developer.chrome.com/docs/extensions/reference/manifest/version), [description limits](https://developer.chrome.com/docs/extensions/reference/manifest/description), [icons](https://developer.chrome.com/docs/extensions/reference/manifest/icons), and [store artwork](https://developer.chrome.com/docs/webstore/images). API and permission findings are recorded in `REPOSITORY_REVIEW.md`.

The Chrome listing and support website were readable during the audit and still advertised 1.3.0. The Edge listing URL responded, but its version metadata was not exposed by the text reader. Public listings and the separate support website must be updated as part of publication; this task only prepared the local extension and store materials.

The Chrome listing's current privacy URL points to `mylokaye.info/privacy.html`, which describes an unused `scripting` permission and older user-triggered behavior. The matching 1.4.0 policy is prepared in `PRIVACY_POLICY.md`; publish it at the policy URL used by the store before submission. The current `mylokaye.me/privacy.html` page already describes the local preference and form editing, but its cache-scope wording should be aligned with the new policy.

Prepared store copy and artwork details are in [STORE_LISTING.md](STORE_LISTING.md).
