# Version 1.4.0 release audit

Prepared locally on 1 October 2026. The extension package and store materials are ready for upload. Installed Chrome checks passed for the main workflows; the remaining verification limits and public-policy update are listed below. No browser-store update was submitted or published in this task.

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

A separate store-assets ZIP contains the three store images, the 128-pixel icon, `STORE_LISTING.md`, `PRIVACY_POLICY.md`, `PUBLISHING.md`, and this release audit.

Both ZIPs are created outside the repository. Integrity checks cover ZIP CRCs, exact file inventories, the packaged manifest version, and byte-for-byte equality with source files.

| Package | Files | SHA-256 |
| --- | --- | --- |
| `dynamics-365-form-debugger-1.4.0.zip` | 22 | `fed7bb1c0e3389b364556d3e9ada2d426f1080b6c6b23558a1c231b66bcce4ee` |
| `dynamics-365-form-debugger-1.4.0-store-assets.zip` | 8 | Recorded in the separate `form-debugger-1.4.0-audit.json` beside the packages |

The extension ZIP is 99,375 bytes. The store bundle includes this document, so its checksum is recorded separately to avoid a self-referential checksum.

## Verification

- Manifest JSON, version format, every packaged file reference, and all four JavaScript syntax checks passed.
- All eleven locale catalogs have matching, non-empty messages. Localized names and descriptions stay within Chrome's manifest limits.
- PNG dimensions, chunk CRCs, and compressed image data passed validation; the banner dimensions passed inspection.
- No permission, host-access, content-script registration, remote-code, or data-collection changes were introduced. Existing broad site access is explained in the README and store copy.
- The background and popup sources passed 44 targeted checks with simulated Chrome APIs, including host boundaries, query/fragment preservation, duplicate-marker avoidance, disabled behavior, navigation, error handling, missing receivers, clipboard outcomes, support destination, and the displayed version.
- The actual popup HTML/CSS and scripts were rendered in Chrome using a local Chrome-API fixture. Keyboard focus, the 400-pixel layout, all eleven localized set-state badges, and current release artwork were checked. The captured fixture console had no warnings or errors.
- After the user loaded the unpacked extension, the real popup showed **V 1.4.0**, the correct live Form ID, **Cache bypass set**, and the current logo. Automatic bypass added the marker on the numbered regional Marketing host. A URL containing a query and existing fragment preserved both when the marker was added.
- A conflicting installed 1.3.0 copy was identified and removed by the user. With the sole 1.4.0 instance, a local third-party test page passed late form insertion, scoped hidden-field rendering, source-value synchronization, non-submitting debug-copy bindings, and isolation of unrelated visible and hidden controls.
- Real popup copy-to-clipboard and native paste passed using the synthetic Form ID. Disabling removed debug copies; popup reopening preserved the disabled preference. Re-enabling restored the enabled state. A page with no receiver showed **Status unavailable**, a disabled Form ID button, and no crash. The real support button opened `https://mylokaye.me/`.

| Manual test area | Evidence and remaining work |
| --- | --- |
| Supported Dynamics page with a form | Passed with the real 1.4.0 popup, marker, Form ID, and hidden-field rendering. |
| Late form insertion | Passed with the real installed content script on a synthetic local third-party page. The separate field-count observer limitation remains documented. |
| Normal website with no form | Passed on the local test page before insertion and after reload: unchanged URL, no debug copies, **Not applicable**, and no Form ID. |
| Third-party embedded form / iframe | A top-level script-inserted form passed on a non-Dynamics local host. Cross-origin iframe behavior was not exercised and remains outside supported host-page inspection. |
| Enabled/disabled bypass with query and existing hash | Actual marker addition/removal passed on the live Dynamics URL; query/fragment preservation was observed during navigation and covered by targeted source checks. |
| Popup reopening after navigation and browser restart | Actual popup reopening, navigation state, and preference persistence after reload passed. Browser restart was not performed. |
| Missing content-script receiver | Passed on `about:blank`: **Status unavailable**, Form ID `---`, and no crash. |
| Clipboard success and failure | Real copy and native paste passed. Failure handling passed simulated source checks; a real clipboard failure was not forced. |
| Support and feedback | The real support button opened the configured public support website. |

Browser-control policy blocked extension-management access, so the user performed the unpacked installation and removed the old store copy. The installed 1.4.0 instance was then verified through the real toolbar popup and pages. No warnings or errors were captured in the live test tab or the synthetic third-party page. Actual service-worker and popup consoles were not inspected. Browser restart, Edge installation, and cross-origin iframe tests were not performed.

The first query-string test navigation returned a page labelled **CDS Timeout**. The preserved query and fragment were visible in the resulting URL. The standard standalone URL subsequently loaded normally. This server response was not treated as an extension error or a successful rendered-form test.

The extension was left enabled on the original live form. Temporary test/support tabs were closed and local verification servers were stopped. No Dynamics form was submitted.

## Documentation and external listings

Context7 was unavailable. Official Chrome documentation was used for [version syntax](https://developer.chrome.com/docs/extensions/reference/manifest/version), [description limits](https://developer.chrome.com/docs/extensions/reference/manifest/description), [icons](https://developer.chrome.com/docs/extensions/reference/manifest/icons), and [store artwork](https://developer.chrome.com/docs/webstore/images). API and permission findings are recorded in `REPOSITORY_REVIEW.md`.

The Chrome listing and support website were readable during the audit and still advertised 1.3.0. The Edge listing URL responded, but its version metadata was not exposed by the text reader. Public listings and the separate support website must be updated as part of publication; this task only prepared the local extension and store materials.

The Chrome listing's current privacy URL points to `mylokaye.info/privacy.html`, which describes an unused `scripting` permission and older user-triggered behavior. The matching 1.4.0 policy is prepared in `PRIVACY_POLICY.md`; publish it at the policy URL used by the store before submission. The current `mylokaye.me/privacy.html` page already describes the local preference and form editing, but its cache-scope wording should be aligned with the new policy.

Prepared store copy and artwork details are in [STORE_LISTING.md](STORE_LISTING.md).
