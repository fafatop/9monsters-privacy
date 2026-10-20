/* Loon Response Script: collect group names, image IDs and timestamps. */
(function () {
  const STORE_KEY = "ninemonsters.album.v2";

  function messageOf(error) {
    if (error && error.message) return error.message;
    try { return String(error); } catch (_) { return "未知错误"; }
  }

  function isDatabase(value) {
    return value && Array.isArray(value.groups);
  }

  try {
    if (!/^https:\/\/api\.ninemonsters\.com\/other\/get\?/.test($request.url)) {
      $done({});
      return;
    }

    const query = $request.url.split("?")[1].split("#")[0];
    const matched = query.split("&").some(function (part) {
      try { return decodeURIComponent(part.split("=")[0]) === "public_key"; }
      catch (_) { return false; }
    });
    if (!matched) { $done({}); return; }

    if (!$response || typeof $response.body !== "string" || !$response.body.trim()) {
      throw new Error("响应 Body 为空或不是文本");
    }

    let root;
    try {
      root = JSON.parse($response.body);
    } catch (error) {
      throw new Error("响应不是有效 JSON：" + messageOf(error));
    }

    const data = root && root.data;
    if (!data || typeof data.name !== "string" || !data.name.trim() ||
        !data.album || !Array.isArray(data.album.images)) {
      console.log("相册采集跳过：接口响应中没有有效的 data.name 或 data.album.images。");
      $done({});
      return;
    }

    const ids = data.album.images.map(function (image) {
      if (!image || typeof image !== "object") return null;
      if (typeof image.file_name === "string" && image.file_name.length > 0) {
        return image.file_name;
      }
      return image.file && typeof image.file.name === "string" ? image.file.name : null;
    }).filter(function (id) { return typeof id === "string" && id.length > 0; });

    if (!ids.length) {
      console.log("相册采集跳过：图片列表中没有可用的文件名。");
      $done({});
      return;
    }

    let db = { version: 2, groups: [] };
    const currentRaw = $persistentStore.read(STORE_KEY);
    if (currentRaw) {
      try {
        const current = JSON.parse(currentRaw);
        if (!isDatabase(current)) throw new Error("groups 字段无效");
        db = current;
        db.version = 2;
      } catch (error) {
        throw new Error("v2 本地数据损坏：" + messageOf(error));
      }
    }

    db.groups = db.groups.filter(function (entry) {
      return entry && typeof entry.name === "string" && Array.isArray(entry.images);
    });

    const now = new Date().toISOString();
    let group = db.groups.find(function (entry) { return entry.name === data.name; });
    if (!group) {
      group = { name: data.name, images: [], createdAt: now, updatedAt: now };
      db.groups.push(group);
    }

    group.images = group.images.filter(function (entry) {
      return entry && typeof entry.id === "string" && entry.id.length > 0;
    });
    const known = new Set(group.images.map(function (entry) { return entry.id; }));
    let added = 0;
    ids.forEach(function (id) {
      if (!known.has(id)) {
        group.images.push({ id: id, capturedAt: now });
        known.add(id);
        added += 1;
      }
    });
    group.updatedAt = now;

    const serialized = JSON.stringify(db);
    if (!$persistentStore.write(serialized, STORE_KEY)) {
      throw new Error("$persistentStore.write 返回 false");
    }

    if (added > 0 && typeof $argument === "object" && $argument && $argument.notify === true) {
      try {
        $notification.post("图片采集成功", "新增 " + added + " 张", "点击查看相册", {
          openUrl: "http://album.loon.invalid/"
        });
      } catch (error) {
        console.log("图片已保存，但通知发送失败：" + messageOf(error));
      }
    }
  } catch (error) {
    console.log("相册保存失败：" + messageOf(error));
  }
  $done({});
})();

