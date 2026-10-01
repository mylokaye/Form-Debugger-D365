# Publish version 1.4.0

This is the publication handoff for the existing Chrome Web Store and Microsoft Edge Add-ons items. Uploading or publishing is a separate step from preparing these files.

## Upload materials

- Extension: `dynamics-365-form-debugger-1.4.0.zip`, containing the complete extension at the ZIP root.
- Listing materials: `dynamics-365-form-debugger-1.4.0-store-assets.zip`, containing store artwork, copy, privacy-policy source, and these publication instructions.
- Audit and checksums: [RELEASE_1.4.0.md](RELEASE_1.4.0.md).
- Descriptions and dashboard fields: [STORE_LISTING.md](STORE_LISTING.md).
- Public privacy text: [PRIVACY_POLICY.md](PRIVACY_POLICY.md).

Use the extension ZIP for the package upload. The store-assets ZIP is a handoff bundle: extract it and upload each image to its matching store field.

## Final browser gate

Load `Chrome-Edge/` as an unpacked extension in Chrome, with the store copy disabled to avoid testing the wrong version. Confirm the popup displays **V 1.4.0** before recording results. Refresh existing form tabs after loading or reloading the extension.

Use a test form with no unsaved entries. The checks below do not require submitting a form or creating a Dynamics record.

1. Open a standalone HTTPS form on a numbered Marketing host such as `assets1-gbr.mkt.dynamics.com`. Confirm automatic `#d365mkt-nocache`, the popup's **Cache bypass set** badge, the correct Form ID, and visible hidden-field debug copies.
2. Disable features. Confirm the trailing marker is removed and debug copies disappear. Re-enable features and confirm they return. Repeat with a query string and existing fragment, checking that both survive the toggle.
3. Edit a hidden debug copy using a synthetic test value and check that its source control is updated. Do not submit the form; refresh the test page afterwards.
4. Test late insertion and a script-embedded form on a third-party page. Confirm unrelated controls remain untouched. Cross-origin iframe inspection through the host page is outside the current supported flow.
5. Open an ordinary website and a browser-internal page. The cache badge should be **Not applicable**, with no automatic URL modification. The Form ID row should be unavailable without errors.
6. Reopen the popup after navigation and after a browser restart. Check enabled/disabled preference persistence, copy-to-clipboard, keyboard focus, and the support link.
7. Inspect actual service-worker, popup, and target-page consoles for extension errors. Repeat the key standalone, toggle, and popup checks in Edge.

Record actual results in the release audit. Keep source/fixture evidence separate from installed-extension evidence.

## Store update

1. Update the public privacy page with the prepared text and use the matching policy URL in both stores. The current Chrome listing links to a legacy policy that mentions an unused `scripting` permission; that mismatch must be corrected for the update.
2. Open the existing publisher item, preserving its extension identity: Chrome `kdhnliicfgopcijgepghgohnhafphohf`; Edge `ceoaoafhphcpdokfdfkiilmndbepbbec`.
3. Upload the extension ZIP as the new package and confirm the dashboard recognizes version **1.4.0**.
4. Replace the description, screenshot, small promotional tile, marquee image, icon, support link, and privacy fields using the prepared materials. Keep distribution settings unless the publisher deliberately changes them.
5. Supply the single-purpose statement and permission justifications. Declare that no remote code is executed. Complete data-use disclosures consistently with local form processing, the stored preference, and the public policy.
6. Once the final browser gate passes, submit the existing items for review. For Chrome, use deferred publishing if review approval should be held for a coordinated release.
7. After publication, verify the public version, current images and descriptions, privacy URL, and the updated installed extension. Align the separate support website's version and feature description with the released package.

Chrome's current [update workflow](https://developer.chrome.com/docs/webstore/update) and [privacy-field guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy) were checked during preparation. Store review remains the publisher's and platform's decision.
