# ProTrays — 农业育苗盘多语言官网

ProTrays 是基于 **Astro + Tailwind CSS v4** 构建的多语言静态站点，用于展示和推广商用农业育苗盘（rPET / PET / PVC 三种材质），支持 5 种语言、材质详情页、规格折叠、询盘表单与 SEO 结构化数据。

- 线上地址：https://mcqwy.github.io/protray
- 部署平台：GitHub Pages
- 默认语言：英文（`/`），其余语言走 `/zh/`、`/es/`、`/th/`、`/vi/`

---

## 目录结构

```
protray/
├── astro.config.mjs              Astro 配置（site / base / sitemap / tailwind）
├── generate-pages.bat            Windows 脚本：批量生成 zh/es/th/vi 页面入口
├── public/
│   ├── assets/images/            静态图片（logo、托盘图、工厂图）
│   ├── js/main.js                客户端交互脚本
│   └── robots.txt                SEO 爬虫协议
└── src/
├── styles/global.css         Tailwind 入口 + 自定义组件样式
├── data/
│   ├── ui-translations.json  UI 文案（5 语言，含 meta 与 whyUs）
│   └── materials.json        材质详情数据（3 材质 × 5 语言）
├── components/
│   ├── Nav.astro             全站导航 + 语言切换
│   ├── Footer.astro          页脚
│   ├── Seo.astro             canonical + hreflang 生成器
│   ├── HomePage.astro        首页
│   ├── AboutPage.astro       关于我们
│   └── MaterialPage.astro    材质详情页
└── pages/
├── index.astro           /                   英文首页
├── about.astro           /about/             英文关于页
├── [material].astro      /rpet-tray/ 等      英文材质页
├── zh/{index,about,[material]}.astro
├── es/{index,about,[material]}.astro
├── th/{index,about,[material]}.astro
└── vi/{index,about,[material]}.astro
```

---

## 路由表

| URL | 页面 | 语言 |
|---|---|---|
| `/protray/` | 首页 | en |
| `/protray/about/` | 关于我们 | en |
| `/protray/rpet-tray/` | rPET 材质详情 | en |
| `/protray/pet-tray/` | PET 材质详情 | en |
| `/protray/pvc-tray/` | PVC 材质详情 | en |
| `/protray/zh/` | 首页 | zh |
| `/protray/zh/about/` | 关于我们 | zh |
| `/protray/zh/rpet-tray/` | rPET 材质详情 | zh |
| … | es / th / vi 结构同上 | |

共 **5 语言 × 5 页面 = 25 个可索引页面**。

---

## 技术栈

- **Astro 5** — 静态站点生成（SSG），零客户端 JS 框架
- **Tailwind CSS v4** — 通过 `@tailwindcss/vite` 插件接入
- **@astrojs/sitemap** — sitemap 生成（含 i18n 支持）
- **Font Awesome 6** — 图标（CDN 引入）
- **Formcarry** — 询盘表单后端
- **Google Analytics 4** — 统计
- **Microsoft Clarity** — 行为分析

---

## 开发与构建

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:4321/protray/）
npm run dev

# 构建生产版本到 dist/
npm run build

# 本地预览构建产物
npm run preview
```

部署到 GitHub Pages 时，将 `dist/` 推送到 `gh-pages` 分支，或通过 GitHub Actions 自动部署。

---

## 国际化（i18n）方案

站点采用**构建时静态多语言**方案，而非运行时 JS 切换：

1. 所有文案集中在 `src/data/` 下两个 JSON：
   - `ui-translations.json`：导航、Hero、规格字段名、FAQ、表单标签、页脚、meta、whyUs
   - `materials.json`：三种材质的详情页内容（标题、描述、优势、FAQ），每种材质内嵌 5 语言
2. 每种语言一套页面文件，通过 `Astro.props.lang` 把对应语言的文案注入 HTML。
3. 页面的 `<html lang>` 随语言变化。

### 多语言 SEO 三件套

- **hreflang**：由 `src/components/Seo.astro` 生成，5 语言互指 + x-default
- **canonical**：每页指向自己
- **sitemap**：由 `@astrojs/sitemap` 自动生成（含 `<xhtml:link>` 互指标签）

### 新增一种语言

1. 在 `ui-translations.json` 和 `materials.json` 的每个 `translations` 下添加该语言键。
2. 复制 `src/pages/zh/` 为 `src/pages/{新语言}/`，或修改 `generate-pages.bat` 中的 `$langs` 数组后重新运行。
3. 在 `src/components/Nav.astro` 的 `langOptions` 数组中加入新语言条目。
4. 在 `astro.config.mjs` 的 `LOCALES` 和 `Seo.astro` 的 `locales` 中加入新语言。

---

## 材质数据说明

`materials.json` 是材质详情页的唯一数据源：

```json
{
"slug": "rpet-tray",
"shortName": "rPET",
"material": "Heavy-Duty rPET",
"translations": {
"en": { "title": "…", "description": "…", "heroTitle": "…", "advantages": [ … ], "faq": [ … ] },
"zh": { … }, "es": { … }, "th": { … }, "vi": { … }
}
}
```

新增材质时：

1. 往 `materials.json` 追加一条（必须有 5 语言）。
2. 无需改代码——`[material].astro` 的 `getStaticPaths()` 会自动为它生成页面。
3. 如需在首页材质区展示入口卡片，在 `HomePage.astro` 手动加一个 `<a>` 卡片。

---

## 客户端交互（public/js/main.js）

`main.js` 不处理翻译，只负责纯 DOM 行为：

- 语言下拉菜单展开 / 收起
- FAQ 手风琴折叠
- 平滑滚动到表单并聚焦
- 表单提交（含蜜罐字段 `website_url` 防机器人）
- WhatsApp 气泡提示与悬浮按钮
- Hero 视频懒加载

Astro 页面在 `<body>` 末尾通过 `is:inline` 注入运行时常量：

```html
<script is:inline>
  window.__FORM_SUCCESS__ = "Thank you! Our team will contact you within 24 hours.";
</script>
<script is:inline src="/protray/js/main.js"></script>
```

---

## 结构化数据（JSON-LD）

| 页面 | Schema 类型 |
|---|---|
| 首页 | Organization + Product + FAQPage |
| 材质页 | Product（含 7 条 additionalProperty）+ FAQPage |
| 关于页 | AboutPage |

所有 Schema 的语言随页面变化，`faqSchema` 的问答取自对应语言的 `faq` 数据。

---

## 图片资源

| 类型 | 文件 |
|---|---|
| Logo | `logo.png` |
| 托盘图 | `tray-32.jpg` ~ `tray-128.jpg`（共 7 张） |
| 工厂图 | `factory-line.jpg` / `factory-warehouse.jpg` / `factory-qc.jpg` / `factory-loading.png` |

图片路径当前硬编码为 `/protray/assets/images/...`，与 `astro.config.mjs` 中的 `base: '/protray'` 对应。

**待办**：32 / 40 / 98 孔图片当前为复用，需补拍真实图。详见 `IMAGE-SEO.md`。

---

## 部署注意事项

1. **GitHub Pages 子路径**：`base: '/protray'` 决定所有静态资源前缀。若部署到根域名，需改为 `/`。
2. **表单后端**：Formcarry 的 endpoint 在 `HomePage.astro` 与 `MaterialPage.astro` 的 `<form action>` 里，更换服务商时需同步替换。
3. **统计脚本**：GA4 与 Clarity 的 ID 分布在三个页面组件里，如需更换记得三处都改。
4. **robots.txt**：指向 `https://mcqwy.github.io/protray/sitemap-index.xml`，若 base 改变需同步更新。

---

## 常见任务速查

| 任务 | 需要改动 |
|---|---|
| 修改首页标语 | `ui-translations.json` → `hero.title`（5 语言都改） |
| 修改某材质介绍 | `materials.json` → 对应 `slug` 的 `translations` |
| 修改多语言 title/description | `ui-translations.json` → 每语言的 `meta` |
| 修改 MOQ | `ui-translations.json` → `specs.moq`（5 语言）+ 表单 `min` 属性 |
| 新增材质 | `materials.json` 加一条 + 首页加卡片 |
| 新增语言 | 见「国际化 → 新增一种语言」 |
| 更换产品主图 | 替换 `public/assets/images/tray-*.jpg` |
| 更换 Hero 视频 | `main.js` 里的 `videoUrl` 变量 |

---

## 许可

© 2023 ProTrays. All rights reserved.