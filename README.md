<p align="center">
  <strong>简体中文</strong> · <a href="README_EN.md">English</a> · <a href="README_JA.md">日本語</a>
</p>

<p align="center">
  <img src="./icon.png" width="128" alt="9monsters Privacy Album 图标">
</p>

<h1 align="center">9monsters Privacy Album</h1>

<p align="center">自动采集当前账号已可访问的隐私相册，并在 Loon 中生成本地相册页面。</p>

## 功能

- 自动记录相册分组名称、图片 ID 和采集时间。
- 按图片 ID 去重，重复浏览不会重复添加相同图片。
- 按分组展示图片，并支持组名搜索、懒加载、图片预览和打开原图。
- 可在发现新图片时发送 Loon 通知。
- 提供独立的本地相册入口：`http://album.loon.invalid/`。

> [!IMPORTANT]
> 本插件仅为当前账号已经获得访问权限、并能在9monsters中正常打开的相册建立本地索引，不提供破解、解锁或绕过访问权限的功能。

## 系统要求

- 仅限 iOS 系统
- 需在系统设置中允许 Loon 发送通知
- Loon 3.5.1 (983) 或更高版本
- 需打开“脚本”、“复写”和“MITM”
- 已在 Loon 中安装并信任 MITM 证书

## 安装

### 一键导入

[**一键导入**](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Ffafatop%2F9monsters-privacy%2Fmain%2Fmain.plugin)

如果没有自动打开 Loon，请使用下面的地址手动添加。

### 手动添加

在 Loon 的插件管理中添加以下地址：

```text
https://raw.githubusercontent.com/fafatop/9monsters-privacy/main/main.plugin
```

添加后启用插件，并确认 `api.ninemonsters.com` 的 HTTPS 解密能够正常工作。

## 使用方法

1. 保持 Loon 和本插件处于启用状态。
2. 打开9monsters，直接进入已解锁相册的人的主页，稍等片刻，待消息通知弹出并加载图片列表
3. 使用浏览器访问 `http://album.loon.invalid/`。
4. 点击页面中的“刷新”，即可查看最新采集的分组和图片。

插件参数中的“新增图片通知”默认开启，可在 Loon 的插件设置中关闭。

## 数据与隐私

插件写入 Loon `$persistentStore` 的内容仅包括：

- 相册分组名称；
- 图片文件 ID；
- 分组创建、更新和图片采集时间。

插件不会把原始图片文件写入 `$persistentStore`，也不会保存接口中的 `public_key`。相册页面展示图片时，仍由浏览器从原 CDN 地址加载图片。

“保存至 Loon 本地相册”指在 Loon 本地保存相册索引并生成查看页面，不代表将图片保存到 iOS 系统照片 App。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `main.plugin` | Loon 插件入口与规则配置 |
| `collect.fixed.js` | 采集分组、图片 ID 和时间信息 |
| `gallery.fixed.js` | 生成 Loon 本地相册页面 |
| `icon.png` | 插件图标 |

## 版本规则

当前版本：`v1.0`

后续正式更新依次使用 `v1.1`、`v1.2`、`v1.3` 等版本号。插件名称中的版本号表示公开发布版本；脚本 URL 后的查询参数仅用于刷新缓存，两者分别管理。

## 来源说明

本项目基于以下 Loon 插件进行独立整理与维护：

```text
https://loon.h.o1.hk/9m_prive_get/main.plugin
```

本仓库并非 9monsters 官方项目，与 9monsters 官方无隶属或合作关系。使用者应自行遵守相关服务条款，并仅处理本人有权访问的内容。

