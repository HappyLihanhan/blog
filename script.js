const fallbackPosts = [
  {
    id: "cpp-raii",
    title: "RAII 为什么能降低异常路径的复杂度",
    date: "2026-06-12",
    readTime: "8 min",
    category: "C++",
    tags: ["C++", "工程习惯"],
    summary: "用资源所有权视角解释构造、析构、异常传播和智能指针的边界。",
    body: [
      "RAII 的核心不是把释放操作藏起来，而是让资源生命周期和对象生命周期绑定。这样一来，异常路径和正常路径都走同一套析构规则。",
      "写接口时优先表达所有权：独占资源用 `std::unique_ptr`，共享资源要先证明共享关系确实存在，借用关系用引用或裸指针表达。",
      "检查一段代码是否可靠，可以先问两个问题：资源在哪个对象里取得，最早在哪个析构点释放。"
    ]
  },
  {
    id: "graphics-matrix",
    title: "从坐标系理解 MVP 矩阵",
    date: "2026-06-04",
    readTime: "10 min",
    category: "计算机图形学",
    tags: ["图形学", "OpenGL"],
    summary: "把模型、观察、投影三个矩阵拆开，减少凭公式记忆带来的混乱。",
    body: [
      "MVP 可以理解为一条坐标系迁移路线：局部空间进入世界空间，再进入相机空间，最后进入裁剪空间。",
      "模型矩阵描述物体如何摆到世界里，观察矩阵描述世界如何转到相机视角，投影矩阵负责把可见体映射到裁剪空间。",
      "调试时不要一次检查最终画面，先输出每个阶段的关键坐标，确认 w 分量和深度范围符合预期。"
    ]
  },
  {
    id: "ds-hashmap",
    title: "哈希表复杂度的真实前提",
    date: "2026-05-28",
    readTime: "6 min",
    category: "计算机基础",
    tags: ["数据结构", "算法"],
    summary: "记录负载因子、冲突处理和扩容策略对实际性能的影响。",
    body: [
      "哈希表的平均 O(1) 建立在散列函数足够均匀、负载因子受控、扩容成本可摊还的前提上。",
      "在工程里，键的分布比课本例子复杂得多。遇到性能异常时，先观察桶分布和冲突链长度，再谈替换容器。",
      "稳定接口需要明确迭代器失效规则，尤其是插入触发 rehash 的场景。"
    ]
  },
  {
    id: "tooling-cmake",
    title: "CMake 项目从能编译到可维护",
    date: "2026-05-17",
    readTime: "7 min",
    category: "计算机基础",
    tags: ["工具链", "CMake"],
    summary: "从 target、include 边界和构建选项三个角度整理 CMake 结构。",
    body: [
      "现代 CMake 的重点是围绕 target 建模，而不是堆全局变量。每个库都应该声明自己的 include、compile definitions 和链接依赖。",
      "把第三方依赖、编译选项和安装规则拆清楚，后续迁移 CI 或交叉编译时会少很多隐性状态。",
      "当配置文件开始变长，优先按模块边界拆分，而不是用宏隐藏复杂度。"
    ]
  }
];

const fallbackProjects = [
  {
    id: "renderer",
    title: "渲染管线渐进式实现复盘",
    date: "2026-06-01",
    readTime: "6 min",
    type: "小型实时渲染器",
    tags: ["图形学", "OpenGL"],
    summary: "从模型加载到 PBR 材质的渐进式实现记录。",
    body: [
      "这个复盘记录一个小型实时渲染器从基础模型加载、相机控制、材质组织到光照模型扩展的实现过程。",
      "| 阶段 | 重点 | 产出 |\n| --- | --- | --- |\n| 模型加载 | 网格、材质、纹理路径 | 可复用资源导入流程 |\n| 渲染管线 | Shader、光照、相机 | 基础实时预览 |\n| 工程整理 | 模块拆分、参数配置 | 便于后续扩展 |",
      "后续重点会放在渲染调试工具、材质参数可视化和更稳定的资源管理边界。"
    ]
  },
  {
    id: "blog-admin-workflow",
    title: "内容管理流程复盘",
    date: "2026-06-16",
    readTime: "5 min",
    type: "后台管理工作流",
    tags: ["博客", "后台"],
    summary: "文章元数据、登录权限、搜索索引和写作规范。",
    body: [
      "这个复盘整理博客后台从静态内容到可维护内容管理的演进过程，重点关注数据结构、登录保护、图片上传和发布后的前台读取。",
      "目前文章与项目复盘都采用 JSON 存储，后台提交时做基础校验，保存前会写入备份，降低误删和格式错误造成的数据风险。",
      "后续可以继续补充草稿状态、预览模式、正文块级编辑和更细粒度的资源管理。"
    ]
  },
  {
    id: "notes-cli",
    title: "Markdown 整理流程复盘",
    date: "2026-05-20",
    readTime: "4 min",
    type: "学习笔记整理器",
    tags: ["工具链", "CLI"],
    summary: "用命令行把零散 Markdown 整理成可发布目录。",
    body: [
      "这个项目的目标是把本地零散 Markdown 笔记整理成稳定的发布目录，减少手工移动文件、补元数据和维护索引的重复工作。",
      "核心思路是先统一标题、标签、日期等元数据，再按主题输出目录和索引，最后交给静态站点读取。",
      "项目复盘的主要收获是：工具链代码不一定复杂，但要把输入约束、失败提示和可恢复流程设计清楚。"
    ]
  }
];

const fallbackResume = {
  name: "李圣杰",
  headline: "计算机技术硕士在读 · Unity3D / 游戏开发方向",
  lead: "计算机技术硕士在读，研究方向为深度学习与计算机视觉。具备 Unity3D 游戏开发、C# / C++ 编程、图形学基础和 AI 辅助开发经验。",
  pdfUrl: "./assets/li-shengjie-resume.pdf",
  tags: ["Unity3D", "C#", "C++", "游戏开发", "计算机视觉"],
  contact: ["24 岁 · 男 · 汉族", "共青团员", "福建省泉州市", "19730562396", "242050272@hdu.edu.cn"],
  education: [
    {
      period: "2024-09 至今",
      title: "杭州电子科技大学 · 计算机技术 · 硕士",
      details: ["研究方向：深度学习、计算机视觉", "主修课程：人工智能、机器学习、应用数学、数字几何处理、高级算法设计等。"]
    },
    {
      period: "2019-09 至 2023-06",
      title: "华北水利水电大学 · 计算机科学与技术 · 本科",
      details: ["主修课程：数据结构、计算机组成原理、操作系统、计算机网络、计算机图形学、高等数学、线性代数、数据库等。"]
    }
  ],
  projects: [],
  levels: [
    { label: "计算机", value: "擅长" },
    { label: "英语", value: "良好" }
  ],
  skills: ["熟悉 C++、C#，有过 Python、Java、MySQL 应用经历；具有较多 Unity3D 游戏开发经验。"],
  certificates: ["英语六级，听说读写能力良好。"],
  selfEvaluation: "本人有计算机学科基础技能和较强的自学能力，乐于团队合作完成项目。"
};

const defaultPostCategories = ["C++", "计算机图形学", "Hot100", "计算机基础", "Unity3D"];
const categoryAliases = new Map([
  ["图形学", "计算机图形学"],
  ["OpenGL", "计算机图形学"],
  ["Unity", "Unity3D"],
  ["Unity 3D", "Unity3D"],
  ["Unity3D", "Unity3D"],
  ["Hot100", "Hot100"],
  ["LeetCode", "Hot100"],
  ["算法", "Hot100"],
  ["数据结构", "计算机基础"],
  ["操作系统", "计算机基础"],
  ["计算机网络", "计算机基础"],
  ["数据库", "计算机基础"],
  ["CMake", "计算机基础"],
  ["工具链", "计算机基础"]
]);

let posts = [];
let projects = [];
let resume = null;
let activeProjectName = "";
let activePostCategory = "";
let activePostTag = "";
let musicObjectUrl = "";

const selectors = {
  html: document.documentElement,
  body: document.body,
  postList: document.querySelector("[data-post-list]"),
  projectList: document.querySelector("[data-project-list]"),
  projectDetail: document.querySelector("[data-project-detail]"),
  searchModal: document.querySelector("[data-search-modal]"),
  searchInput: document.querySelector("#site-search"),
  searchResults: document.querySelector("[data-search-results]"),
  postModal: document.querySelector("[data-post-modal]"),
  postTitle: document.querySelector("[data-post-title]"),
  postMeta: document.querySelector("[data-post-meta]"),
  postBody: document.querySelector("[data-post-body]"),
  mobileMenu: document.querySelector("[data-mobile-menu]"),
  categoryTabs: document.querySelector("[data-category-tabs]"),
  tagCloud: document.querySelector("[data-tag-cloud]"),
  resumeRoot: document.querySelector("[data-resume-root]"),
  statPosts: document.querySelector("[data-stat-posts]"),
  statProjects: document.querySelector("[data-stat-projects]")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatInline(value) {
  const codeTokens = [];
  let formatted = escapeHtml(value).replace(/`([^`\n]+)`/g, (_, code) => {
    const index = codeTokens.push(`<code>${code}</code>`) - 1;
    return `\u0000CODE${index}\u0000`;
  });

  formatted = formatted
    .replace(
      /\[size=(small|medium|large|xlarge)\]([\s\S]*?)\[\/size\]/g,
      '<span class="post-text-size post-text-size-$1">$2</span>'
    )
    .replace(/\[u\]([\s\S]*?)\[\/u\]/g, "<u>$1</u>")
    .replace(/\*\*\*([^*\n]+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");

  return formatted.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeTokens[Number(index)] || "");
}

function normalizeCodeLanguage(value) {
  return String(value || "")
    .trim()
    .replace(/[^\w+#.-]/g, "")
    .slice(0, 24);
}

function renderCodeBlock(block) {
  const match = String(block).match(/^```([^\r\n`]*)\r?\n([\s\S]*?)\r?\n```$/);
  if (!match) return "";

  const language = normalizeCodeLanguage(match[1]) || "code";
  const code = match[2].replace(/\s+$/g, "");
  return `
    <figure class="post-code-block">
      <figcaption>${escapeHtml(language)}</figcaption>
      <pre><code>${escapeHtml(code)}</code></pre>
    </figure>
  `;
}

function normalizeCategoryName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function inferPostCategory(category, tags = []) {
  const explicit = normalizeCategoryName(category);
  if (explicit) {
    return categoryAliases.get(explicit) || explicit;
  }

  for (const tag of tags) {
    const normalized = normalizeCategoryName(tag);
    if (defaultPostCategories.includes(normalized)) return normalized;
    if (categoryAliases.has(normalized)) return categoryAliases.get(normalized);
  }

  return defaultPostCategories[0];
}

function getPostCategories() {
  const categories = new Set(defaultPostCategories);
  posts.forEach((post) => {
    const category = normalizeCategoryName(post.category);
    if (category) categories.add(category);
  });
  return Array.from(categories).sort((a, b) => {
    const aIndex = defaultPostCategories.indexOf(a);
    const bIndex = defaultPostCategories.indexOf(b);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.localeCompare(b, "zh-CN");
  });
}

function categoryMatches(post, category = activePostCategory) {
  return !category || post.category === category;
}

function getVisiblePosts() {
  return posts.filter((post) => {
    if (!categoryMatches(post)) return false;
    return !activePostTag || post.tags.includes(activePostTag);
  });
}

function safeImageSrc(value) {
  const src = String(value || "").trim();
  if (/^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(src)) {
    return src;
  }
  return "";
}

function splitTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderMarkdownTable(block) {
  const lines = String(block)
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2 || !lines[0].includes("|") || !lines[1].includes("|")) {
    return "";
  }

  const headers = splitTableRow(lines[0]);
  const separators = splitTableRow(lines[1]);
  if (headers.length < 2 || separators.length !== headers.length) {
    return "";
  }
  if (!separators.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")))) {
    return "";
  }

  const alignments = separators.map((cell) => {
    const normalized = cell.replace(/\s+/g, "");
    if (normalized.startsWith(":") && normalized.endsWith(":")) return "center";
    if (normalized.endsWith(":")) return "right";
    return "";
  });
  const rows = lines.slice(2).map(splitTableRow).filter((row) => row.length);

  const renderCell = (cell, tag, index) => {
    const align = alignments[index] ? ` style="text-align: ${alignments[index]}"` : "";
    return `<${tag}${align}>${formatInline(cell || "")}</${tag}>`;
  };

  return `
    <div class="post-table-wrap">
      <table>
        <thead>
          <tr>${headers.map((cell, index) => renderCell(cell, "th", index)).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => `<tr>${headers.map((_, index) => renderCell(row[index] || "", "td", index)).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPostBlock(block) {
  const codeHtml = renderCodeBlock(block);
  if (codeHtml) {
    return codeHtml;
  }

  const tableHtml = renderMarkdownTable(block);
  if (tableHtml) {
    return tableHtml;
  }

  const imageMatch = String(block).trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
  if (imageMatch) {
    const alt = imageMatch[1].trim();
    const src = safeImageSrc(imageMatch[2]);
    if (!src) {
      return `<p>${formatInline(block)}</p>`;
    }
    return `
      <figure class="post-image">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
        ${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ""}
      </figure>
    `;
  }

  return `<p>${formatInline(block)}</p>`;
}

function normalizePosts(items) {
  return Array.isArray(items)
    ? items
        .filter((post) => post && post.id && post.title)
        .map((post) => {
          const tags = Array.isArray(post.tags) ? post.tags.map(String).filter(Boolean) : [];
          return {
            id: String(post.id),
            title: String(post.title),
            date: String(post.date || ""),
            readTime: String(post.readTime || "5 min"),
            category: inferPostCategory(post.category, tags),
            tags,
            summary: String(post.summary || ""),
            body: Array.isArray(post.body) ? post.body.map(String) : []
          };
        })
    : [];
}

function normalizeProjects(items) {
  return Array.isArray(items)
    ? items
        .filter((project) => project && project.id && project.title)
        .map((project) => ({
          id: String(project.id),
          title: String(project.title),
          date: String(project.date || ""),
          readTime: String(project.readTime || "5 min"),
          type: String(project.type || project.title || ""),
          tags: Array.isArray(project.tags) ? project.tags.map(String).filter(Boolean) : [],
          summary: String(project.summary || ""),
          body:
            Array.isArray(project.body) && project.body.length
              ? project.body.map(String)
              : [String(project.summary || "暂无正文。")]
        }))
    : [];
}

function normalizeStringList(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function normalizeResume(value) {
  const raw = value && typeof value === "object" ? value : fallbackResume;
  return {
    name: String(raw.name || fallbackResume.name),
    headline: String(raw.headline || ""),
    lead: String(raw.lead || ""),
    pdfUrl: String(raw.pdfUrl || ""),
    tags: normalizeStringList(raw.tags),
    contact: normalizeStringList(raw.contact),
    education: Array.isArray(raw.education)
      ? raw.education.map((item) => ({
          period: String(item?.period || ""),
          title: String(item?.title || ""),
          details: normalizeStringList(item?.details)
        }))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((item) => ({
          period: String(item?.period || ""),
          title: String(item?.title || ""),
          summary: String(item?.summary || ""),
          tech: normalizeStringList(item?.tech),
          body: normalizeStringList(item?.body)
        }))
      : [],
    levels: Array.isArray(raw.levels)
      ? raw.levels.map((item) => ({
          label: String(item?.label || ""),
          value: String(item?.value || "")
        }))
      : [],
    skills: normalizeStringList(raw.skills),
    certificates: normalizeStringList(raw.certificates),
    selfEvaluation: String(raw.selfEvaluation || "")
  };
}

async function loadPosts() {
  const sources = ["./data/posts.json", "/api/posts"];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        const loaded = normalizePosts(data.posts || data);
        if (loaded.length) return loaded;
      }
    } catch {
      // Try the next source, then fall back to built-in starter content.
    }
  }

  return normalizePosts(fallbackPosts);
}

async function loadProjects() {
  const sources = ["/api/projects", "./data/projects.json"];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        const loaded = normalizeProjects(data.projects || data);
        return loaded;
      }
    } catch {
      // Try the next source, then fall back to built-in starter content.
    }
  }

  return normalizeProjects(fallbackProjects);
}

async function loadResume() {
  const sources = ["./data/resume.json", "/api/resume"];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (response.ok) {
        return normalizeResume(await response.json());
      }
    } catch {
      // Try the next source, then fall back to built-in starter content.
    }
  }

  return normalizeResume(fallbackResume);
}

function renderPostCategories() {
  if (!selectors.categoryTabs) return;

  const categories = getPostCategories();
  if (!categories.includes(activePostCategory)) {
    activePostCategory = categories[0] || "";
  }

  selectors.categoryTabs.innerHTML = categories
    .map((category) => {
      const count = posts.filter((post) => post.category === category).length;
      return `
        <button class="${category === activePostCategory ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activePostCategory ? "true" : "false"}">
          <span>${escapeHtml(category)}</span>
          <strong>${count}</strong>
        </button>
      `;
    })
    .join("");
}

function renderPosts(items = getVisiblePosts()) {
  if (!selectors.postList) return;

  if (!items.length) {
    const filterText = [activePostCategory, activePostTag ? `标签：${activePostTag}` : ""].filter(Boolean).join(" · ");
    selectors.postList.innerHTML = `<p class="empty-state">${filterText ? `「${escapeHtml(filterText)}」暂无文章。` : "还没有文章。登录后台后可以创建第一篇。"}</p>`;
    return;
  }

  selectors.postList.innerHTML = items
    .map(
      (post) => `
        <button class="article-card" type="button" data-post-id="${escapeHtml(post.id)}">
          <span class="date">${escapeHtml(post.date)}</span>
          <span>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary)}</p>
            <span class="tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</span>
          </span>
          <span class="article-side">
            <span class="article-category">${escapeHtml(post.category)}</span>
            <span class="read-time">${escapeHtml(post.readTime)}</span>
          </span>
        </button>
      `
    )
    .join("");
}

function renderProjects(items = projects) {
  if (!selectors.projectList) return;

  if (!items.length) {
    selectors.projectList.innerHTML = '<p class="empty-state">还没有项目复盘。</p>';
    if (selectors.projectDetail) {
      selectors.projectDetail.innerHTML = '<p class="empty-state">还没有可展示的复盘内容。</p>';
    }
    return;
  }

  if (selectors.projectDetail) {
    const projectGroups = groupProjectsByName(items);
    if (!activeProjectName || !projectGroups.some((group) => group.name === activeProjectName)) {
      activeProjectName = projectGroups[0].name;
    }
    const activeGroup = projectGroups.find((group) => group.name === activeProjectName) || projectGroups[0];

    selectors.projectList.innerHTML = projectGroups
      .map(
        (group) => `
          <button class="project-nav-item ${group.name === activeProjectName ? "is-active" : ""}" type="button" data-project-name="${escapeHtml(group.name)}">
            <strong>${escapeHtml(group.name)}</strong>
          </button>
        `
      )
      .join("");
    renderProjectDetail(activeGroup);
    return;
  }

  selectors.projectList.innerHTML = items
    .map(
      (project) => `
        <button class="project-card" type="button" data-project-id="${escapeHtml(project.id)}">
          <span>${escapeHtml(project.type)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
        </button>
      `
    )
    .join("");
}

function groupProjectsByName(items) {
  const groups = new Map();
  items.forEach((project) => {
    const name = project.type || project.title || "未命名项目";
    if (!groups.has(name)) {
      groups.set(name, { name, posts: [] });
    }
    groups.get(name).posts.push(project);
  });
  return Array.from(groups.values());
}

function renderProjectDetail(group) {
  if (!selectors.projectDetail || !group) return;
  selectors.projectDetail.innerHTML = `
    <div class="project-post-list" aria-label="${escapeHtml(group.name)}的复盘帖子">
      ${group.posts
        .map(
          (item) => `
            <button class="project-post-item" type="button" data-project-id="${escapeHtml(item.id)}">
              <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.summary)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function contactToHtml(item) {
  const value = String(item || "");
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `<a href="mailto:${escapeHtml(value)}">${escapeHtml(value)}</a>`;
  }
  if (/^[+\d][\d\s-]{6,}$/.test(value)) {
    return `<a href="tel:${escapeHtml(value.replace(/\s+/g, ""))}">${escapeHtml(value)}</a>`;
  }
  return `<span>${escapeHtml(value)}</span>`;
}

function renderResume(data = resume) {
  if (!selectors.resumeRoot || !data) return;

  selectors.resumeRoot.innerHTML = `
    <div class="resume-header">
      <div>
        <p class="eyebrow">About</p>
        <h1 id="resume-title">${escapeHtml(data.name)}</h1>
        ${data.headline ? `<p class="resume-headline">${escapeHtml(data.headline)}</p>` : ""}
        ${data.lead ? `<p class="resume-lead">${escapeHtml(data.lead)}</p>` : ""}
        <div class="resume-tags" aria-label="核心关键词">
          ${data.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <address class="resume-contact" aria-label="联系方式">
        ${data.contact.map(contactToHtml).join("")}
      </address>
    </div>

    <div class="resume-grid">
      <article class="resume-panel wide">
        <h2>教育背景</h2>
        <ol class="resume-timeline">
          ${data.education
            .map(
              (item) => `
                <li>
                  <time>${escapeHtml(item.period)}</time>
                  <div>
                    <h3>${escapeHtml(item.title)}</h3>
                    ${item.details.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
                  </div>
                </li>
              `
            )
            .join("")}
        </ol>
      </article>

      <article class="resume-panel wide">
        <h2>项目经验</h2>
        <div class="resume-project-list">
          ${data.projects
            .map(
              (project) => `
                <section class="resume-project">
                  <div class="resume-project-head">
                    <div>
                      <h3>${escapeHtml(project.title)}</h3>
                      ${project.summary ? `<p>${escapeHtml(project.summary)}</p>` : ""}
                    </div>
                    <time>${escapeHtml(project.period)}</time>
                  </div>
                  ${
                    project.tech.length
                      ? `<dl class="resume-tech">${project.tech
                          .map((tech) => {
                            const [label, ...rest] = tech.split(/[:：]/);
                            const value = rest.join("：") || tech;
                            return `<div><dt>${escapeHtml(rest.length ? label : "说明")}</dt><dd>${formatInline(value.trim())}</dd></div>`;
                          })
                          .join("")}</dl>`
                      : ""
                  }
                  ${project.body.length ? `<ul class="resume-list">${project.body.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
                </section>
              `
            )
            .join("")}
        </div>
      </article>

      <article class="resume-panel">
        <h2>技能特长</h2>
        <div class="resume-levels">
          ${data.levels
            .map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`)
            .join("")}
        </div>
        <ul class="resume-list">
          ${data.skills.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>

      <article class="resume-panel">
        <h2>荣誉证书</h2>
        <ul class="resume-list">
          ${data.certificates.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <h2 class="resume-subtitle">自我评价</h2>
        <p>${escapeHtml(data.selfEvaluation)}</p>
      </article>
    </div>
  `;
}

function renderTags() {
  if (!selectors.tagCloud) return;

  const scopedPosts = posts.filter((post) => categoryMatches(post));
  const tags = Array.from(new Set(scopedPosts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
  selectors.tagCloud.innerHTML = [
    `<button class="${activePostTag ? "" : "is-active"}" type="button" data-tag="">全部标签</button>`,
    ...tags.map((tag) => `<button class="${tag === activePostTag ? "is-active" : ""}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
  ].join("");
}

function renderNotesView() {
  renderPostCategories();
  renderTags();
  renderPosts();
}

function renderStats() {
  if (selectors.statPosts) {
    selectors.statPosts.textContent = String(posts.length);
  }
  if (selectors.statProjects) {
    selectors.statProjects.textContent = String(projects.length);
  }
}

function renderSearchResults(query = "") {
  if (!selectors.searchResults) return;

  const normalized = query.trim().toLowerCase();
  const postResults = posts
    .filter((post) => {
      if (!normalized) return true;
      const source = [post.category, post.title, post.summary, ...post.tags, ...post.body].join(" ").toLowerCase();
      return source.includes(normalized);
    })
    .map((post) => ({ kind: "文章", item: post }));
  const projectResults = projects
    .filter((project) => {
      if (!normalized) return true;
      const source = [project.type, project.title, project.summary, ...project.tags, ...project.body].join(" ").toLowerCase();
      return source.includes(normalized);
    })
    .map((project) => ({ kind: "项目复盘", item: project }));
  const results = [...postResults, ...projectResults];

  selectors.searchResults.innerHTML = results.length
    ? results
        .map(
          ({ kind, item }) => `
            <button class="search-result" type="button" ${kind === "文章" ? `data-post-id="${escapeHtml(item.id)}"` : `data-project-id="${escapeHtml(item.id)}"`}>
              <span class="search-kind">${escapeHtml(kind)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml([item.date, kind === "项目复盘" ? item.type : item.category, item.tags.join(" / "), item.summary].filter(Boolean).join(" · "))}</span>
            </button>
          `
        )
        .join("")
    : '<p class="search-result" aria-live="polite">没有找到匹配内容。</p>';
}

function openSearch() {
  selectors.searchModal.hidden = false;
  selectors.body.classList.add("modal-open");
  renderSearchResults(selectors.searchInput.value);
  window.setTimeout(() => selectors.searchInput.focus(), 0);
}

function closeSearch() {
  selectors.searchModal.hidden = true;
  selectors.body.classList.remove("modal-open");
}

function initMusicPlayer() {
  const actions = document.querySelector(".header-actions");
  const searchTrigger = actions?.querySelector("[data-open-search]");
  if (!actions || !searchTrigger || actions.querySelector("[data-music-player]")) return;

  searchTrigger.insertAdjacentHTML(
    "beforebegin",
    `
      <div class="music-player" data-music-player>
        <button class="music-toggle" type="button" data-music-toggle aria-expanded="false" aria-label="打开音乐盒">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18V5l10-2v13M9 9l10-2M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />
          </svg>
          <span data-music-now>音乐</span>
        </button>
        <section class="music-panel" data-music-panel hidden>
          <form class="music-search" data-music-search-form>
            <input type="search" data-music-query placeholder="筛选曲目" autocomplete="off" />
            <button type="submit">清</button>
          </form>
          <div class="music-controls">
            <button class="music-play" type="button" data-music-prev aria-label="上一首">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 18-7-6 7-6v12Zm9 0-7-6 7-6v12Z" /></svg>
            </button>
            <button class="music-play" type="button" data-music-play aria-label="播放">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg>
            </button>
            <div class="music-track">
              <strong data-music-title>未选择</strong>
              <span data-music-artist>正在加载音乐库</span>
            </div>
            <button class="music-play" type="button" data-music-next aria-label="下一首">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 6 7 6-7 6V6Zm9 0 7 6-7 6V6Z" /></svg>
            </button>
          </div>
          <div class="music-progress">
            <div class="music-progress-track" data-music-progress role="slider" tabindex="0" aria-label="播放进度" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0">
              <span data-music-progress-fill></span>
            </div>
            <span data-music-time>0:00 / 0:00</span>
          </div>
          <div class="music-volume">
            <button class="music-volume-toggle" type="button" data-music-mute aria-label="静音"></button>
            <input type="range" data-music-volume min="0" max="100" step="1" value="70" aria-label="音量" />
            <span data-music-volume-value>70%</span>
          </div>
          <button class="music-mode" type="button" data-music-mode>列表循环</button>
          <p class="music-status" data-music-status>默认自动播放。</p>
          <div class="music-results" data-music-results></div>
          <audio data-music-audio preload="auto"></audio>
        </section>
      </div>
    `
  );

  const root = actions.querySelector("[data-music-player]");
  const toggle = root.querySelector("[data-music-toggle]");
  const panel = root.querySelector("[data-music-panel]");
  const form = root.querySelector("[data-music-search-form]");
  const queryInput = root.querySelector("[data-music-query]");
  const prevButton = root.querySelector("[data-music-prev]");
  const playButton = root.querySelector("[data-music-play]");
  const nextButton = root.querySelector("[data-music-next]");
  const modeButton = root.querySelector("[data-music-mode]");
  const progress = root.querySelector("[data-music-progress]");
  const progressFill = root.querySelector("[data-music-progress-fill]");
  const timeLabel = root.querySelector("[data-music-time]");
  const muteButton = root.querySelector("[data-music-mute]");
  const volumeInput = root.querySelector("[data-music-volume]");
  const volumeValue = root.querySelector("[data-music-volume-value]");
  const status = root.querySelector("[data-music-status]");
  const resultsRoot = root.querySelector("[data-music-results]");
  const audio = root.querySelector("[data-music-audio]");
  const title = root.querySelector("[data-music-title]");
  const artist = root.querySelector("[data-music-artist]");
  const now = root.querySelector("[data-music-now]");
  let tracks = [];
  let currentIndex = 0;
  let isSeeking = false;
  let pendingTime = 0;
  let lastKnownTime = 0;
  let lastStateSave = 0;
  let desiredPlaying = true;
  let userPaused = false;
  let unlockPlaybackBound = false;

  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg>';
  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>';
  const volumeHighIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" /></svg>';
  const volumeLowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a4 4 0 0 1 0 6" /></svg>';
  const volumeMutedIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6" /></svg>';
  const stateKey = "ianBlogMusicState";
  const modes = ["list", "single", "random"];
  const modeLabels = {
    list: "列表循环",
    single: "单曲循环",
    random: "随机播放"
  };
  const defaultVolume = 0.7;
  const defaultTrackId = "daniel-rosenfeld-c418";
  const defaultTrackRevision = 2;
  audio.autoplay = true;
  audio.setAttribute("autoplay", "");
  const bundledDefaultTrack = {
    id: "daniel-rosenfeld-c418",
    title: "C418",
    artist: "Daniel Rosenfeld",
    url: "./assets/music/20260618-150523-314526-daniel-rosenfeld-c418-6548c239.mp3"
  };
  let playerState = readPlayerState();
  const savedVolume = Number(playerState.volume);
  let currentVolume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : defaultVolume;
  let lastAudibleVolume = currentVolume > 0 ? currentVolume : defaultVolume;
  audio.volume = currentVolume;
  lastKnownTime = Math.max(0, Number(playerState.currentTime) || 0);
  userPaused = playerState.userPaused === true;
  desiredPlaying = !userPaused;

  function setPanelOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) window.setTimeout(() => queryInput.focus(), 0);
  }

  function updatePlayState() {
    playButton.innerHTML = audio.paused ? playIcon : pauseIcon;
    playButton.setAttribute("aria-label", audio.paused ? "播放" : "暂停");
    toggle.classList.toggle("is-playing", !audio.paused);
  }

  function updateVolumeUi() {
    const percent = Math.round(currentVolume * 100);
    volumeInput.value = String(percent);
    volumeInput.style.setProperty("--music-volume", `${percent}%`);
    volumeInput.setAttribute("aria-valuetext", `${percent}%`);
    volumeValue.textContent = `${percent}%`;
    muteButton.innerHTML = currentVolume === 0 ? volumeMutedIcon : currentVolume < 0.5 ? volumeLowIcon : volumeHighIcon;
    muteButton.setAttribute("aria-label", currentVolume === 0 ? "恢复音量" : "静音");
    muteButton.classList.toggle("is-muted", currentVolume === 0);
  }

  function setVolume(value, { persist = true } = {}) {
    const normalized = Math.min(1, Math.max(0, Number(value) || 0));
    currentVolume = normalized;
    if (normalized > 0) lastAudibleVolume = normalized;
    audio.volume = normalized;
    updateVolumeUi();
    if (persist) savePlayerState({ force: true });
  }

  function readPlayerState() {
    try {
      return JSON.parse(localStorage.getItem(stateKey) || "{}");
    } catch {
      return {};
    }
  }

  function updateLastKnownTime(value, { allowZero = false } = {}) {
    const nextTime = Number(value);
    if (!Number.isFinite(nextTime) || nextTime < 0) return lastKnownTime;
    if (nextTime > 0.25 || allowZero) lastKnownTime = nextTime;
    return lastKnownTime;
  }

  function resolveMusicUrl(value) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (/^(https?:\/\/|blob:|data:audio\/)/i.test(url)) return url;

    const basePath = new URL("./", window.location.href).pathname;
    if (url.startsWith("/") && basePath !== "/" && !url.startsWith(basePath)) {
      return `${basePath.replace(/\/$/, "")}${url}`;
    }
    return url;
  }

  function getStableCurrentTime() {
    if (pendingTime > 0) return pendingTime;
    if (Number.isFinite(audio.currentTime) && audio.currentTime > 0.25) {
      return updateLastKnownTime(audio.currentTime);
    }
    return lastKnownTime || 0;
  }

  function savePlayerState({ force = false, playing = null, currentTime = null, allowZeroTime = false } = {}) {
    const nowMs = Date.now();
    if (!force && nowMs - lastStateSave < 800) return;
    lastStateSave = nowMs;
    const track = tracks[currentIndex];
    const hasExplicitTime = currentTime !== null && currentTime !== undefined;
    const explicitTime = Number(currentTime);
    const savedTime = hasExplicitTime && Number.isFinite(explicitTime)
      ? updateLastKnownTime(explicitTime, { allowZero: allowZeroTime || explicitTime === 0 })
      : getStableCurrentTime();
    playerState = {
      ...playerState,
      trackId: track?.id || "",
      currentTime: savedTime,
      mode: playerState.mode || "list",
      playing: typeof playing === "boolean" ? playing : desiredPlaying,
      userPaused,
      volume: currentVolume,
      defaultTrackRevision,
      updatedAt: nowMs
    };
    localStorage.setItem(stateKey, JSON.stringify(playerState));
  }

  function normalizeTrack(track, index = 0) {
    return {
      id: String(track.id || `track-${index}`),
      title: String(track.title || "未命名歌曲"),
      artist: String(track.artist || ""),
      url: resolveMusicUrl(track.url),
      filename: String(track.filename || "")
    };
  }

  async function loadMusicTracks() {
    const sources = ["/api/music", "./data/music.json"];
    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) continue;
        const data = await response.json();
        const loaded = (data.tracks || []).map(normalizeTrack).filter((track) => track.url);
        if (loaded.length) return loaded;
      } catch {
        // Try the next source.
      }
    }
    return [normalizeTrack(bundledDefaultTrack)];
  }

  function formatTime(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const rest = Math.floor(safeSeconds % 60);
    return `${minutes}:${String(rest).padStart(2, "0")}`;
  }

  function getProgressValue() {
    return Number(progress.dataset.value || progress.getAttribute("aria-valuenow") || 0);
  }

  function setProgressValue(value) {
    const normalized = Math.min(1000, Math.max(0, Math.round(Number(value) || 0)));
    progress.dataset.value = String(normalized);
    progress.setAttribute("aria-valuenow", String(normalized));
    progressFill.style.width = `${normalized / 10}%`;
  }

  function syncProgress() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const rawCurrentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const currentTime = rawCurrentTime > 0.25 || !lastKnownTime ? rawCurrentTime : lastKnownTime;
    if (rawCurrentTime > 0.25) updateLastKnownTime(rawCurrentTime);
    if (!isSeeking) {
      setProgressValue(duration ? (currentTime / duration) * 1000 : 0);
    }
    timeLabel.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  function seekToProgressValue() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (!duration) {
      setProgressValue(0);
      return;
    }
    const ratio = Math.min(1, Math.max(0, getProgressValue() / 1000));
    const nextTime = ratio * duration;
    audio.currentTime = nextTime;
    updateLastKnownTime(nextTime, { allowZero: true });
    timeLabel.textContent = `${formatTime(nextTime)} / ${formatTime(duration)}`;
    savePlayerState({ force: true, playing: desiredPlaying, currentTime: nextTime, allowZeroTime: true });
  }

  function seekFromClientX(clientX) {
    const rect = progress.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgressValue(ratio * 1000);
    seekToProgressValue();
  }

  function seekFromPointer(event) {
    seekFromClientX(event.clientX);
  }

  function seekFromTouch(event) {
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    if (touch) seekFromClientX(touch.clientX);
  }

  function applyMode() {
    const mode = modes.includes(playerState.mode) ? playerState.mode : "list";
    playerState.mode = mode;
    audio.loop = mode === "single";
    modeButton.textContent = modeLabels[mode];
    modeButton.setAttribute("aria-label", `播放模式：${modeLabels[mode]}`);
  }

  function renderPlaylist(filter = queryInput.value) {
    const keyword = String(filter || "").trim().toLowerCase();
    const visibleTracks = tracks.filter((track) => {
      if (!keyword) return true;
      return `${track.title} ${track.artist}`.toLowerCase().includes(keyword);
    });

    resultsRoot.innerHTML = visibleTracks.length
      ? visibleTracks
          .map((track) => {
            const active = track.id === tracks[currentIndex]?.id;
            return `
              <button class="music-result ${active ? "is-active" : ""}" type="button" data-track-id="${escapeHtml(track.id)}">
                <span class="music-art" aria-hidden="true">♪</span>
                <span>
                  <strong>${escapeHtml(track.title)}</strong>
                  <small>${escapeHtml(track.artist || "未知歌手")}</small>
                </span>
              </button>
            `;
          })
          .join("")
      : '<p class="music-status">没有匹配曲目。</p>';
  }

  function removePlaybackUnlock() {
    if (!unlockPlaybackBound) return;
    unlockPlaybackBound = false;
    document.removeEventListener("click", resumeAfterInteraction, true);
    document.removeEventListener("keydown", resumeAfterInteraction, true);
    document.removeEventListener("pointerdown", resumeAfterInteraction, true);
    document.removeEventListener("touchstart", resumeAfterInteraction, true);
    window.removeEventListener("scroll", resumeAfterInteraction, true);
  }

  function addPlaybackUnlock() {
    if (unlockPlaybackBound || userPaused || !desiredPlaying) return;
    unlockPlaybackBound = true;
    document.addEventListener("click", resumeAfterInteraction, true);
    document.addEventListener("keydown", resumeAfterInteraction, true);
    document.addEventListener("pointerdown", resumeAfterInteraction, true);
    document.addEventListener("touchstart", resumeAfterInteraction, true);
    window.addEventListener("scroll", resumeAfterInteraction, true);
  }

  function resumeAfterInteraction() {
    if (userPaused || !desiredPlaying || !audio.src || !audio.paused) {
      removePlaybackUnlock();
      return;
    }
    audio.play().then(() => {
      status.textContent = "正在播放。";
      removePlaybackUnlock();
      updatePlayState();
      savePlayerState({ force: true, playing: true });
    }).catch(() => {
      addPlaybackUnlock();
    });
  }

  function playAudio() {
    desiredPlaying = true;
    audio.play().then(() => {
      status.textContent = "正在播放。";
      removePlaybackUnlock();
      updatePlayState();
      savePlayerState({ force: true, playing: true });
    }).catch(() => {
      status.textContent = "任意点击页面后继续播放。";
      addPlaybackUnlock();
      updatePlayState();
      savePlayerState({ force: true, playing: true });
    });
  }

  function applyPendingTime() {
    if (!pendingTime || !Number.isFinite(audio.duration)) return;
    const nextTime = Math.min(Math.max(0, pendingTime), Math.max(0, audio.duration - 0.25));
    audio.currentTime = nextTime;
    updateLastKnownTime(nextTime, { allowZero: true });
    pendingTime = 0;
    syncProgress();
    savePlayerState({ force: true, playing: desiredPlaying, currentTime: nextTime, allowZeroTime: true });
  }

  function setTrack(track, { autoplay = true, currentTime = 0 } = {}) {
    const index = tracks.findIndex((item) => item.id === track.id);
    if (index >= 0) currentIndex = index;
    title.textContent = track.title;
    artist.textContent = track.artist || "未知歌手";
    now.textContent = track.title;
    const startTime = Math.max(0, Number(currentTime) || 0);
    pendingTime = startTime;
    updateLastKnownTime(startTime, { allowZero: true });
    if (audio.getAttribute("src") !== track.url) {
      audio.src = track.url;
      audio.load();
    } else {
      applyPendingTime();
    }
    applyMode();
    renderPlaylist();
    updatePlayState();
    userPaused = !autoplay;
    desiredPlaying = autoplay;
    if (autoplay) playAudio();
    savePlayerState({ force: true, playing: autoplay, currentTime: startTime, allowZeroTime: true });
  }

  function selectTrackByIndex(index, options = {}) {
    if (!tracks.length) return;
    const normalizedIndex = (index + tracks.length) % tracks.length;
    setTrack(tracks[normalizedIndex], { autoplay: true, currentTime: 0, ...options });
  }

  function nextIndex() {
    if (playerState.mode === "random" && tracks.length > 1) {
      let index = currentIndex;
      while (index === currentIndex) {
        index = Math.floor(Math.random() * tracks.length);
      }
      return index;
    }
    return currentIndex + 1;
  }

  async function bootMusicPlayer() {
    tracks = await loadMusicTracks();
    setVolume(currentVolume, { persist: false });
    const defaultTrackIndex = tracks.findIndex((track) => track.id === defaultTrackId);
    const savedTrackIndex =
      playerState.defaultTrackRevision === defaultTrackRevision
        ? tracks.findIndex((track) => track.id === playerState.trackId)
        : -1;
    currentIndex = savedTrackIndex >= 0 ? savedTrackIndex : Math.max(0, defaultTrackIndex);
    applyMode();
    renderPlaylist();
    userPaused = playerState.userPaused === true;
    const shouldAutoplay = !userPaused;
    desiredPlaying = shouldAutoplay;
    setTrack(tracks[currentIndex], {
      autoplay: shouldAutoplay,
      currentTime: savedTrackIndex >= 0 ? Number(playerState.currentTime || 0) : 0
    });
    if (!shouldAutoplay) {
      status.textContent = "已恢复上次曲目。";
    }
  }

  toggle.addEventListener("click", () => setPanelOpen(panel.hidden));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    queryInput.value = "";
    renderPlaylist("");
  });
  queryInput.addEventListener("input", () => renderPlaylist(queryInput.value));
  playButton.addEventListener("click", () => {
    if (!audio.src) {
      status.textContent = "先选歌或上传。";
      return;
    }
    if (audio.paused) {
      userPaused = false;
      desiredPlaying = true;
      audio.play().catch(() => {
        status.textContent = "任意点击页面后继续播放。";
        addPlaybackUnlock();
      });
    } else {
      userPaused = true;
      desiredPlaying = false;
      removePlaybackUnlock();
      audio.pause();
    }
  });
  prevButton.addEventListener("click", () => selectTrackByIndex(currentIndex - 1));
  nextButton.addEventListener("click", () => selectTrackByIndex(nextIndex()));
  modeButton.addEventListener("click", () => {
    const currentModeIndex = modes.indexOf(playerState.mode);
    playerState.mode = modes[(currentModeIndex + 1) % modes.length];
    applyMode();
    savePlayerState({ force: true });
    status.textContent = `已切换为${modeLabels[playerState.mode]}。`;
  });
  muteButton.addEventListener("click", () => {
    setVolume(currentVolume === 0 ? lastAudibleVolume : 0);
  });
  volumeInput.addEventListener("input", () => {
    setVolume(Number(volumeInput.value) / 100, { persist: false });
  });
  volumeInput.addEventListener("change", () => {
    setVolume(Number(volumeInput.value) / 100);
  });
  progress.addEventListener("pointerdown", (event) => {
    isSeeking = true;
    progress.setPointerCapture?.(event.pointerId);
    seekFromPointer(event);
  });
  progress.addEventListener("pointermove", (event) => {
    if (!isSeeking) return;
    seekFromPointer(event);
  });
  progress.addEventListener("pointerup", (event) => {
    seekFromPointer(event);
    progress.releasePointerCapture?.(event.pointerId);
    isSeeking = false;
  });
  progress.addEventListener("pointercancel", () => {
    isSeeking = false;
  });
  progress.addEventListener("click", (event) => {
    seekFromPointer(event);
    isSeeking = false;
  });
  progress.addEventListener("mousedown", (event) => {
    isSeeking = true;
    seekFromPointer(event);
  });
  document.addEventListener("mousemove", (event) => {
    if (isSeeking) seekFromPointer(event);
  });
  document.addEventListener("mouseup", (event) => {
    if (!isSeeking) return;
    seekFromPointer(event);
    isSeeking = false;
  });
  progress.addEventListener("touchstart", (event) => {
    isSeeking = true;
    seekFromTouch(event);
  });
  progress.addEventListener("touchmove", (event) => {
    if (!isSeeking) return;
    event.preventDefault();
    seekFromTouch(event);
  }, { passive: false });
  progress.addEventListener("touchend", (event) => {
    seekFromTouch(event);
    isSeeking = false;
  });
  progress.addEventListener("keydown", (event) => {
    const keySteps = {
      ArrowLeft: -25,
      ArrowDown: -25,
      ArrowRight: 25,
      ArrowUp: 25,
      PageDown: -100,
      PageUp: 100,
      Home: -1000,
      End: 1000
    };
    if (!(event.key in keySteps)) return;
    event.preventDefault();
    isSeeking = true;
    const nextValue = event.key === "Home" ? 0 : event.key === "End" ? 1000 : getProgressValue() + keySteps[event.key];
    setProgressValue(nextValue);
    seekToProgressValue();
    isSeeking = false;
  });
  resultsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-track-id]");
    if (!button) return;
    const track = tracks.find((item) => item.id === button.dataset.trackId);
    if (track) setTrack(track, { autoplay: true, currentTime: 0 });
  });
  audio.addEventListener("loadedmetadata", () => {
    applyPendingTime();
    syncProgress();
  });
  audio.addEventListener("timeupdate", () => {
    syncProgress();
    savePlayerState();
  });
  audio.addEventListener("play", () => {
    desiredPlaying = true;
    removePlaybackUnlock();
    updatePlayState();
    savePlayerState({ force: true, playing: true });
  });
  audio.addEventListener("pause", () => {
    updatePlayState();
    savePlayerState({ force: true, playing: desiredPlaying });
  });
  audio.addEventListener("ended", () => {
    updatePlayState();
    if (playerState.mode !== "single") {
      selectTrackByIndex(nextIndex());
    }
  });
  document.addEventListener("click", (event) => {
    const clickPath = typeof event.composedPath === "function" ? event.composedPath() : [];
    const clickedInsidePlayer = clickPath.length ? clickPath.includes(root) : root.contains(event.target);
    if (!clickedInsidePlayer) setPanelOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setPanelOpen(false);
  });
  window.addEventListener("pagehide", () => savePlayerState({ force: true, playing: desiredPlaying, currentTime: getStableCurrentTime() }));
  window.addEventListener("beforeunload", () => savePlayerState({ force: true, playing: desiredPlaying, currentTime: getStableCurrentTime() }));
  bootMusicPlayer().catch(() => {
    tracks = [normalizeTrack(bundledDefaultTrack)];
    setTrack(tracks[0], { autoplay: true });
    status.textContent = "音乐库加载失败，播放默认曲目。";
  });
}

function openPost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;

  selectors.postTitle.textContent = post.title;
  selectors.postMeta.textContent = `${post.date} · ${post.category} · ${post.tags.join(" / ")} · ${post.readTime}`;
  selectors.postBody.innerHTML = post.body.map(renderPostBlock).join("");
  selectors.postModal.hidden = false;
  selectors.body.classList.add("modal-open");
}

function openProject(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;

  selectors.postTitle.textContent = project.title;
  selectors.postMeta.textContent = project.date;
  selectors.postBody.innerHTML = project.body.map(renderPostBlock).join("");
  selectors.postModal.hidden = false;
  selectors.body.classList.add("modal-open");
}

function closePost() {
  selectors.postModal.hidden = true;
  selectors.body.classList.remove("modal-open");
}

function setTheme(theme) {
  selectors.html.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initVillagerScene() {
  const scene = document.querySelector("[data-villager-scene]");
  if (!scene) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particleRoot = scene.querySelector("[data-magic-particles]");

  if (particleRoot && !reducedMotion) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 18; index += 1) {
      const particle = document.createElement("span");
      const duration = 2.3 + Math.random() * 2.2;
      particle.className = "magic-particle";
      particle.style.setProperty("--particle-left", `${18 + Math.random() * 64}%`);
      particle.style.setProperty("--particle-size", `${2 + Math.round(Math.random() * 3)}px`);
      particle.style.setProperty("--particle-drift", `${-22 + Math.random() * 44}px`);
      particle.style.setProperty("--particle-rise", `${78 + Math.random() * 38}px`);
      particle.style.setProperty("--particle-duration", `${duration.toFixed(2)}s`);
      particle.style.setProperty("--particle-delay", `${(-Math.random() * duration).toFixed(2)}s`);
      fragment.appendChild(particle);
    }
    particleRoot.appendChild(fragment);
  }

  if (reducedMotion) return;

  let pointerPosition = null;
  let animationFrame = 0;

  function resetLook() {
    scene.style.setProperty("--look-x", "0px");
    scene.style.setProperty("--look-y", "0px");
  }

  function updateLook() {
    animationFrame = 0;
    if (!pointerPosition) {
      resetLook();
      return;
    }

    const rect = scene.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width * 0.505;
    const eyeCenterY = rect.top + rect.height * 0.421;
    const deltaX = pointerPosition.x - eyeCenterX;
    const deltaY = pointerPosition.y - eyeCenterY;
    const distance = Math.hypot(deltaX, deltaY);
    const strength = Math.min(1, distance / Math.max(80, rect.width * 0.52));
    const directionX = distance ? deltaX / distance : 0;
    const directionY = distance ? deltaY / distance : 0;
    const maxX = Math.max(1.4, rect.width * 0.0062);
    const maxY = Math.max(0.8, rect.width * 0.0032);

    scene.style.setProperty("--look-x", `${(directionX * strength * maxX).toFixed(2)}px`);
    scene.style.setProperty("--look-y", `${(directionY * strength * maxY).toFixed(2)}px`);
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      pointerPosition = { x: event.clientX, y: event.clientY };
      if (!animationFrame) animationFrame = requestAnimationFrame(updateLook);
    },
    { passive: true }
  );

  document.documentElement.addEventListener("mouseleave", () => {
    pointerPosition = null;
    resetLook();
  });
  window.addEventListener("blur", resetLook);
}

function bindEvents() {
  document.querySelectorAll("[data-open-search]").forEach((button) => {
    button.addEventListener("click", openSearch);
  });

  document.querySelector("[data-close-search]").addEventListener("click", closeSearch);
  document.querySelector("[data-close-post]").addEventListener("click", closePost);

  document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
    setTheme(selectors.html.classList.contains("dark") ? "light" : "dark");
  });

  document.querySelector("[data-menu-toggle]").addEventListener("click", () => {
    selectors.mobileMenu.classList.toggle("is-open");
  });

  selectors.searchInput.addEventListener("input", (event) => {
    renderSearchResults(event.target.value);
  });

  document.addEventListener("click", (event) => {
    const postButton = event.target.closest("[data-post-id]");
    if (postButton) {
      closeSearch();
      openPost(postButton.dataset.postId);
    }

    const projectNameButton = event.target.closest("[data-project-name]");
    if (projectNameButton) {
      activeProjectName = projectNameButton.dataset.projectName;
      renderProjects(projects);
      return;
    }

    const projectButton = event.target.closest("[data-project-id]");
    if (projectButton) {
      closeSearch();
      openProject(projectButton.dataset.projectId);
    }

    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      activePostCategory = categoryButton.dataset.category;
      activePostTag = "";
      renderNotesView();
      document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const tagButton = event.target.closest("[data-tag]");
    if (tagButton) {
      activePostTag = tagButton.dataset.tag || "";
      renderNotesView();
      document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (event.target.matches(".modal-backdrop")) {
      closeSearch();
      closePost();
    }

    if (event.target.closest(".mobile-menu a")) {
      selectors.mobileMenu.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") {
      closeSearch();
      closePost();
    }
  });

}

function bindActiveNav() {
  const links = Array.from(document.querySelectorAll(".desktop-nav a, .mobile-menu a"));
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#")) return;
    const linkPath = href.split("#")[0].split("?")[0].replace("./", "") || "index.html";
    link.classList.toggle("is-active", linkPath === currentPath);
  });
}

function revealLocalAdminLinks() {
  const hostname = window.location.hostname;
  const isLocalHost = ["", "localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(hostname);
  const isPrivateNetwork =
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

  if (isLocalHost || isPrivateNetwork) {
    document.querySelectorAll("[data-local-admin]").forEach((link) => {
      link.hidden = false;
    });
  }
}

function applyInitialPostFilters() {
  if (!selectors.postList) return;

  const params = new URLSearchParams(window.location.search);
  const requested = normalizeCategoryName(params.get("category") || params.get("topic"));
  const categories = getPostCategories();
  if (!requested) {
    activePostCategory = categories[0] || "";
    activePostTag = "";
    return;
  }

  const aliased = categoryAliases.get(requested) || requested;
  const category = categories.find((item) => item === aliased);
  if (category) {
    activePostCategory = category;
    activePostTag = "";
    return;
  }

  const taggedPost = posts.find((post) => post.tags.includes(requested));
  activePostCategory = taggedPost?.category || categories[0] || "";
  activePostTag = taggedPost ? requested : "";
}

async function init() {
  setTheme(getInitialTheme());
  revealLocalAdminLinks();
  initVillagerScene();
  initMusicPlayer();
  bindEvents();
  bindActiveNav();

  const needsPosts = Boolean(selectors.postList || selectors.searchResults || selectors.statPosts || selectors.tagCloud);
  const needsProjects = Boolean(selectors.projectList || selectors.searchResults || selectors.statProjects);
  const tasks = [];

  if (needsPosts) {
    tasks.push(loadPosts().then((items) => (posts = items)));
  }
  if (needsProjects) {
    tasks.push(loadProjects().then((items) => (projects = items)));
  }
  if (selectors.resumeRoot) {
    tasks.push(loadResume().then((data) => (resume = data)));
  }

  await Promise.all(tasks);

  applyInitialPostFilters();
  renderNotesView();
  renderProjects();
  renderResume();
  renderStats();
  renderSearchResults();
}

init();
