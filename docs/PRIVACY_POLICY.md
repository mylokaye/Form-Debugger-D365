# Dynamics 365 Form Debugger privacy policy

Prepared for version 1.4.0 on 1 October 2026. This source is ready to publish at the extension's public privacy-policy URL; preparing it here does not change that website.

Dynamics 365 Form Debugger is an independent Chrome and Microsoft Edge extension by Mylo Kaye for inspecting and testing Dynamics 365 Customer Insights - Journeys forms.

## Local form inspection

The extension reads the detected Dynamics Form ID and displays it in its popup. It inspects controls within the first detected Dynamics form container and creates editable debug copies of hidden controls. These operations happen in the current page session. It does not collect or transmit form data to a developer-operated service, retain form IDs or values, or record browsing history, credentials, or telemetry.

Editing a debug copy updates the original form control. If you submit the website's form, that website may transmit the edited value through its normal submission process. The website controls that submission and applies its own privacy terms.

## Cache bypass and page URLs

While enabled, the extension automatically adds the `#d365mkt-nocache` marker on HTTPS pages at `mkt.dynamics.com` and its subdomains. It reads the relevant tab URL to manage this marker and show its state in the popup. URLs and browsing history are not retained or transmitted by the extension. The marker tells the Dynamics form loader to bypass its form cache; it does not disable all browser caching.

## Local storage

The extension stores one enabled/disabled preference through `chrome.storage.local`. The preference stays in the browser's local extension storage and is not sent to a server. Form values, page content, Form IDs, and submission data are not persisted. Uninstalling the extension removes its local extension storage.

## Permissions

- `activeTab` lets the invoked popup read the active tab URL and request the detected Form ID.
- `storage` remembers whether extension features are enabled.
- `*://*.dynamics.com/*` host access lets the service worker read supported tab URLs and manage the cache-bypass marker. Automatic URL changes are limited to the HTTPS Marketing-domain family.
- `<all_urls>` content-script access supports Dynamics forms embedded by script on third-party websites. Field inspection is limited to a detected Dynamics form container, rather than unrelated controls throughout a page. Cross-origin iframe forms are not inspected through their host page.

## External sites

The extension has no analytics, advertising, remote executable code, or developer-operated data-collection endpoint. Selecting the popup's support button opens `https://mylokaye.me` in a browser tab. The website then receives an ordinary browser visit under its own privacy policy; the extension does not attach form values or Form IDs to that link.

## Contact and changes

For privacy questions, contact Mylo Kaye at `mylo@mylokaye.com` or through the public Form-Debugger-D365 GitHub repository. The public policy will be updated if the extension's data handling materially changes.

Dynamics 365 Form Debugger is not affiliated with, endorsed by, or sponsored by Microsoft Corporation or Google.
