const fallbackPosts = [
  {
    id: "cpp-raii",
    title: "RAII 为什么能降低异常路径的复杂度",
    date: "2026-06-12",
    readTime: "8 min",
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

let posts = [];
let projects = [];
let resume = null;
let activeProjectName = "";

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
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
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
        .map((post) => ({
          id: String(post.id),
          title: String(post.title),
          date: String(post.date || ""),
          readTime: String(post.readTime || "5 min"),
          tags: Array.isArray(post.tags) ? post.tags.map(String).filter(Boolean) : [],
          summary: String(post.summary || ""),
          body: Array.isArray(post.body) ? post.body.map(String) : []
        }))
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

function renderPosts(items = posts) {
  if (!selectors.postList) return;

  if (!items.length) {
    selectors.postList.innerHTML = '<p class="empty-state">还没有文章。登录后台后可以创建第一篇。</p>';
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
          <span class="read-time">${escapeHtml(post.readTime)}</span>
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

  const pdfLink = data.pdfUrl ? `<a href="${escapeHtml(data.pdfUrl)}" download>下载 PDF 简历</a>` : "";
  selectors.resumeRoot.innerHTML = `
    <div class="resume-header">
      <div>
        <p class="eyebrow">Resume</p>
        <h1 id="resume-title">${escapeHtml(data.name)}</h1>
        ${data.headline ? `<p class="resume-headline">${escapeHtml(data.headline)}</p>` : ""}
        ${data.lead ? `<p class="resume-lead">${escapeHtml(data.lead)}</p>` : ""}
        <div class="resume-tags" aria-label="核心关键词">
          ${data.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <address class="resume-contact" aria-label="联系方式">
        ${data.contact.map(contactToHtml).join("")}
        ${pdfLink}
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

  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
  selectors.tagCloud.innerHTML = tags
    .map((tag) => `<button type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
    .join("");
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
      const source = [post.title, post.summary, ...post.tags, ...post.body].join(" ").toLowerCase();
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
              <span>${escapeHtml([item.date, kind === "项目复盘" ? item.type : "", item.tags.join(" / "), item.summary].filter(Boolean).join(" · "))}</span>
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

function openPost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;

  selectors.postTitle.textContent = post.title;
  selectors.postMeta.textContent = `${post.date} · ${post.tags.join(" / ")} · ${post.readTime}`;
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

    const tagButton = event.target.closest("[data-tag]");
    if (tagButton) {
      const tag = tagButton.dataset.tag;
      const filtered = posts.filter((post) => post.tags.includes(tag));
      renderPosts(filtered);
      document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
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

  document.querySelectorAll("[data-topic]").forEach((card) => {
    card.addEventListener("click", () => {
      const topic = card.dataset.topic;
      renderPosts(posts.filter((post) => post.tags.includes(topic)));
    });
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

async function init() {
  setTheme(getInitialTheme());
  revealLocalAdminLinks();
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

  const topic = new URLSearchParams(window.location.search).get("topic");
  renderPosts(topic ? posts.filter((post) => post.tags.includes(topic)) : posts);
  renderProjects();
  renderResume();
  renderTags();
  renderStats();
  renderSearchResults();
}

init();
