# 图片 SEO 与资源待办

本文件记录 ProTrays 网站的图片优化规范、待补拍清单、alt 文字规范，以及视频 SEO 现状。

---

## 一、图片现状

### 1.1 产品图

| 文件 | 真实/复用 | 当前借用源 |
|---|---|---|
| `tray-32.jpg` | ⚠️ **复用** | `tray-50.jpg` |
| `tray-40.jpg` | ⚠️ **复用** | `tray-50.jpg` |
| `tray-50.jpg` | ✅ 真实 | — |
| `tray-72.jpg` | ✅ 真实 | — |
| `tray-98.jpg` | ⚠️ **复用** | `tray-72.jpg` |
| `tray-105.jpg` | ✅ 真实 | — |
| `tray-128.jpg` | ✅ 真实 | — |

### 1.2 工厂图

| 文件 | 状态 |
|---|---|
| `factory-line.jpg` | ✅ |
| `factory-warehouse.jpg` | ✅ |
| `factory-qc.jpg` | ✅ |
| `factory-loading.png` | ✅ |

### 1.3 复用图的影响

| 情况 | 影响 |
|---|---|
| 同一张图跨页面复用（如 `tray-50.jpg` 用在 3 个材质页） | ✅ 无影响。改 alt 后甚至更好 |
| 同一张图冒充不同孔数（如 `tray-98.jpg` 是 `tray-72.jpg` 的复制） | ⚠️ 仅图片搜索受影响，关键词搜索、页面收录不受影响 |

---

## 二、待补拍清单

### 需补拍 3 张真实产品图

- **`tray-32.jpg`**（32 孔）
- **`tray-40.jpg`**（40 孔）
- **`tray-98.jpg`**（98 孔）

### 拍图要求

| 项目 | 要求 | 原因 |
|---|---|---|
| 分辨率 | ≥ 1200 × 800 | Google 图片搜索最低要求 |
| 格式 | WebP（JPG 备用） | WebP 体积小 50%，Google 更喜欢 |
| 背景 | 纯白或浅灰 | 电商/图搜友好 |
| 角度 | 45° 俯视 + 正俯视，各 1 张 | 客户能看清孔位排列 |
| 光线 | 均匀，无阴影 | 图搜识别度更高 |
| 构图 | 单独一张托盘，铺满画面 80% | 突出主体 |

### 存储位置

```
public/assets/images/
├── tray-32.jpg      ← 替换
├── tray-40.jpg      ← 替换
└── tray-98.jpg      ← 替换
```

放进去即可，代码里的路径不用改。

---

## 三、Alt 文字规范

### 3.1 核心原则

- **5–10 个词**，别太长（超过 15 个词 Google 会忽略后半段）
- 包含 4 个核心要素：**孔数 + 材质 + 品类 + 尺寸**
- 可选加场景（greenhouse propagation / automated seeding lines / nursery use 等）
- **不堆砌关键词**（如 `rPET PET PVC tray` 会被判作弊）
- **用英文**（覆盖全球搜索），中文页可另写中文 alt

### 3.2 分页面规则

| 页面类型 | 是否写材质 | 原因 |
|---|---|---|
| 首页 | ❌ 不写 | 首页是全系列总览 |
| 材质页 | ✅ 写 | 页面主题是该材质 |
| 工厂图 / Logo | ❌ 不写 | 跟材质无关 |

### 3.3 首页图片 alt（不写材质）

| 图片 | alt |
|---|---|
| `tray-32.jpg` | `32-hole commercial seedling tray 540x280mm for greenhouse propagation` |
| `tray-40.jpg` | `40-hole commercial seedling tray 540x280mm for automated seeding lines` |
| `tray-50.jpg` | `50-hole commercial seedling tray 540x280mm for nursery use` |
| `tray-72.jpg` | `72-hole commercial seedling tray 540x280mm for vegetable seedlings` |
| `tray-98.jpg` | `98-hole commercial seedling tray 540x280mm for flower propagation` |
| `tray-105.jpg` | `105-hole commercial seedling tray 540x280mm for high-density seeding` |
| `tray-128.jpg` | `128-hole commercial seedling tray 540x280mm for tobacco and vegetable seedlings` |

### 3.4 材质页图片 alt（动态生成）

材质页的 Hero 图根据材质名动态生成 alt：

| 页面 | 实际 alt |
|---|---|
| `/rpet-tray/` | `rPET commercial seedling tray 540x280mm for high-speed automated seeding lines` |
| `/pet-tray/` | `PET commercial seedling tray 540x280mm for high-speed automated seeding lines` |
| `/pvc-tray/` | `PVC commercial seedling tray 540x280mm for high-speed automated seeding lines` |

**同一张 `tray-50.jpg`，3 个材质页 3 个不同 alt。**

### 3.5 工厂图 alt

| 图片 | alt |
|---|---|
| `factory-line.jpg` | `ProTrays automated seedling tray production line in Jining, Shandong China` |
| `factory-warehouse.jpg` | `ProTrays seedling tray warehouse stock ready for export` |
| `factory-qc.jpg` | `ProTrays seedling tray quality control inspection` |
| `factory-loading.png` | `ProTrays seedling tray container loading for international shipping` |

### 3.6 Logo alt

| 图片 | alt |
|---|---|
| `logo.png` | `ProTrays agricultural seedling tray manufacturer logo` |

---

## 四、图片压缩与格式

### 4.1 建议

- 每张图片压缩到 **< 150KB**
- 格式优先用 **WebP**，JPG 作为回退
- 用 [Squoosh](https://squoosh.app/) 或 ImageOptim 压缩

### 4.2 效果

- 页面加载速度提升
- Core Web Vitals（LCP）分数上升
- Google 排名微提升

---

## 五、首屏优化

首屏关键图应用 `loading="eager"` 或省略 `loading` 属性：

| 页面 | 首屏关键图 |
|---|---|
| 首页规格板块右侧图 | `tray-128.jpg` → `loading="eager"` |
| 材质页 Hero 图 | `tray-50.jpg` → `loading="eager"` |
| 关于页工厂图（首图） | `factory-line.jpg` → 保持 `lazy`（不在首屏） |

其他非首屏图片保持 `loading="lazy"`。

---

## 六、视频 SEO 现状

### 6.1 当前状态

| 项目 | 状态 |
|---|---|
| Hero 视频源 | 淘宝 CDN（`cloud.video.taobao.com`） |
| 视频托管位置 | ❌ 不在自己站上 |
| 视频 sitemap | ❌ 没有 |
| VideoObject JSON-LD | ❌ 没有 |
| 视频缩略图（poster） | ⚠️ 未设置 |

### 6.2 结论

**当前 Google 搜不到视频。** 因为：
- 视频在淘宝 CDN，Google 无法建立视频与页面的关联
- 缺少 VideoObject 结构化数据
- 缺少缩略图和字幕

### 6.3 改进方案（待定）

**方案 A（推荐）**：把视频上传到 YouTube
- 优点：Google 秒收录，自带搜索流量
- 缺点：需要 YouTube 频道

**方案 B**：自托管视频 + VideoObject JSON-LD
- 优点：视频属于自己站
- 缺点：需要 CDN 加速、占存储

**方案 C（暂不做）**：把视频放上 GitHub Pages 静态托管
- 缺点：GitHub Pages 不适合大视频（流量和体积限制）

### 6.4 待办

- [ ] 把 Hero 视频上传到 YouTube
- [ ] 或者：视频自托管 + 加 VideoObject JSON-LD
- [ ] 设置视频 `poster` 缩略图

---

## 七、验证方法

### 7.1 图片搜索验证

1. 部署上线并提交 sitemap 到 Google Search Console
2. 等待 1–4 周 Google 收录
3. 在 Google 图片搜索 `site:mcqwy.github.io/protray tray`
4. 或者在 GSC 的 **Performance → Search type: Image** 查看图片曝光

### 7.2 网页图片收录检查

在 GSC **URL Inspection** 里粘贴图片 URL，例如：

```
https://mcqwy.github.io/protray/assets/images/tray-128.jpg
```

看是否显示 "URL is on Google"。

### 7.3 alt 生效验证

构建后打开 `dist/zh/index.html`，搜索 `alt="`，确认所有产品图 alt 已从 `Commercial seedling tray` 改为具体描述。

---

## 八、完整待办清单

### 高优先级

- [ ] 补拍 `tray-32.jpg`
- [ ] 补拍 `tray-40.jpg`
- [ ] 补拍 `tray-98.jpg`
- [ ] 首页、材质页、关于页所有图片 alt 按本文档改完

### 中优先级

- [ ] 图片压缩 < 150KB
- [ ] 图片转 WebP 格式
- [ ] 首屏图 `loading="eager"`

### 低优先级

- [ ] Hero 视频上传到 YouTube
- [ ] 视频加 VideoObject JSON-LD
- [ ] 视频设置 poster 缩略图

---

## 九、参考资料

- Google 图片搜索最佳实践：https://developers.google.com/search/docs/appearance/google-images
- Google 视频 SEO：https://developers.google.com/search/docs/appearance/video
- Schema.org ImageObject：https://schema.org/ImageObject
- Squoosh 在线压缩：https://squoosh.app/