<p align="center">
  <a href="README.md">简体中文</a> · <strong>English</strong> · <a href="README_JA.md">日本語</a>
</p>

<p align="center">
  <img src="./icon.png" width="128" alt="9monsters Privacy Album icon">
</p>

<h1 align="center">9monsters Privacy Album</h1>

<p align="center">Automatically collects private albums already accessible to the current account and generates a local album page in Loon.</p>

## Features

- Automatically records album group names, image IDs, and capture timestamps.
- Deduplicates images by ID, so viewing the same content again does not create duplicate entries.
- Displays images by group, with group-name search, lazy loading, image preview, and links to the original images.
- Can send a Loon notification when new images are found.
- Provides a dedicated local album page at `http://album.loon.invalid/`.

> [!IMPORTANT]
> This plugin only creates a local index for albums that the current account is already authorized to access and can open normally in 9monsters. It does not crack, unlock, or bypass any access controls.

## Requirements

- iOS only.
- Loon `3.5.1 (983)` or later.
- Script, Rewrite, and MitM enabled in Loon.
- A Loon MitM certificate installed and trusted on the device.
- Notifications for Loon enabled in iOS Settings.

## Installation

### One-click import

[**One-click Import**](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Ffafatop%2F9monsters-privacy%2Fmain%2Fmain.plugin)

If Loon does not open automatically, add the URL below manually.

### Manual installation

Add the following URL in Loon's Plugins section:

```text
https://raw.githubusercontent.com/fafatop/9monsters-privacy/main/main.plugin
```

Enable the plugin and make sure HTTPS decryption works for `api.ninemonsters.com`.

## Usage

1. Keep Loon and this plugin enabled.
2. Open 9monsters and go directly to the profile of a person whose private album is already unlocked for your account. Wait briefly for the notification to appear and for the image list to load.
3. Open `http://album.loon.invalid/` in a browser.
4. Select the `刷新` (“Refresh”) button to view the latest collected groups and images.

The plugin option `新增图片通知` (Notify on New Images) is enabled by default and can be turned off in Loon's plugin settings.

## Data and Privacy

The plugin stores only the following information in Loon's `$persistentStore`:

- Album group names;
- Image file IDs;
- Group creation and update times, and image capture timestamps.

The plugin does not store the original image files in `$persistentStore`, and it does not save the `public_key` from the API request. When the local album displays an image, the browser still loads it from the original CDN URL.

“Saved to a local album in Loon” means that Loon stores an album index locally and generates a page for viewing it. It does not save images to the iOS Photos app.

## Files

| File | Purpose |
| --- | --- |
| `main.plugin` | Loon plugin entry point and rule configuration |
| `collect.fixed.js` | Collects group names, image IDs, and timestamps |
| `gallery.fixed.js` | Generates the local album page in Loon |
| `icon.png` | Plugin icon |

## Versioning

Current version: `v1.0`

Future releases will use sequential version numbers such as `v1.1`, `v1.2`, and `v1.3`. The version number in the plugin name identifies the public release. Query parameters appended to script URLs are cache identifiers and are managed separately.

## Source

This project is independently organized and maintained based on the following Loon plugin:

```text
https://loon.h.o1.hk/9m_prive_get/main.plugin
```

This repository is not an official 9monsters project and is not affiliated or partnered with 9monsters. Users are responsible for complying with the applicable terms of service and must only process content they are authorized to access.

