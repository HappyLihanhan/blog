const contentTypes = {
  posts: {
    api: "/api/admin/posts",
    collection: "posts",
    label: "文章",
    countUnit: "篇",
    title: "文章管理",
    listTitle: "文章列表",
    newTitle: "新建文章",
    editTitle: "编辑文章",
    newButton: "新建文章",
    saveButton: "保存文章",
    deleteButton: "删除当前文章",
    emptyText: "还没有文章。",
    titleLabel: "标题",
    idLabel: "文章 ID",
    dateLabel: "发布日期",
    categoryLabel: "栏目",
    tagsLabel: "标签",
    summaryLabel: "摘要",
    bodyLabel: "正文",
    idPlaceholder: "graphics-matrix",
    titlePlaceholder: "例如：从坐标系理解 MVP 矩阵",
    tagsPlaceholder: "C++, 图形学, OpenGL",
    summaryPlaceholder: "文章的核心观点或问题",
    bodyPlaceholder:
      "写作背景：这篇文章解决什么问题\n\n```cpp\nint main() {\n  return 0;\n}\n```\n\n![图片说明](./assets/uploads/example.png)\n\n| 概念 | 说明 |\n| --- | --- |\n| 内容 | 内容 |\n\n结论：可以复用的经验或下一步问题"
  },
  projects: {
    api: "/api/admin/projects",
    collection: "projects",
    label: "项目复盘",
    countUnit: "项",
    title: "项目复盘管理",
    listTitle: "项目复盘列表",
    newTitle: "新建项目复盘",
    editTitle: "编辑项目复盘",
    newButton: "新建项目复盘",
    saveButton: "保存项目复盘",
    deleteButton: "删除当前项目复盘",
    emptyText: "还没有项目复盘。",
    titleLabel: "复盘标题",
    idLabel: "项目 ID",
    dateLabel: "复盘日期",
    tagsLabel: "关联标签",
    summaryLabel: "卡片摘要",
    bodyLabel: "复盘正文",
    typeLabel: "项目名称",
    idPlaceholder: "renderer",
    titlePlaceholder: "例如：渲染管线渐进式实现复盘",
    tagsPlaceholder: "图形学, OpenGL",
    typePlaceholder: "例如：小型实时渲染器",
    summaryPlaceholder: "用于项目卡片的一句话复盘",
    bodyPlaceholder:
      "项目背景：为什么做这个项目，目标是什么\n\n| 阶段 | 问题 | 处理 | 结果 |\n| --- | --- | --- | --- |\n| 模型加载 | 资源路径混乱 | 统一导入流程 | 减少重复配置 |\n\n复盘结论：保留哪些做法，下一步改什么",
    defaultType: ""
  },
  portfolio: {
    api: "/api/admin/portfolio",
    collection: "items",
    label: "作品集",
    countUnit: "项",
    title: "作品集管理",
    newButton: "新建作品"
  },
  questionBank: {
    api: "/api/admin/question-banks",
    label: "题库",
    title: "随机题库管理",
    newButton: "",
    saveButton: "",
    deleteButton: ""
  },
  resume: {
    api: "/api/admin/resume",
    label: "关于博主",
    title: "关于博主管理",
    newButton: "",
    saveButton: "",
    deleteButton: ""
  },
  music: {
    api: "/api/admin/music",
    collection: "tracks",
    label: "音乐",
    title: "音乐管理",
    newButton: "",
    saveButton: "",
    deleteButton: "",
    countUnit: "首"
  }
};

const state = {
  contentType: "posts",
  activeId: null,
  loaded: {
    posts: false,
    projects: false,
    portfolio: false,
    questionBank: false,
    music: false
  },
  resumeLoaded: false,
  resume: null,
  questionBank: { sources: [], categories: [], questionCount: 0, referenceCount: 0, categorySummary: [] },
  items: {
    posts: [],
    projects: [],
    portfolio: [],
    music: []
  }
};

let bodySelection = null;

const defaultPostCategories = ["C++", "计算机图形学", "Hot100", "计算机基础", "Unity3D"];
const NEW_CATEGORY_VALUE = "__new_category__";
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

const els = {
  logout: document.querySelector("[data-logout]"),
  tabs: document.querySelectorAll("[data-content-type]"),
  dashboardTitle: document.querySelector("[data-dashboard-title]"),
  managerTitle: document.querySelector("[data-manager-title]"),
  entryList: document.querySelector("[data-admin-entry-list]"),
  entryCount: document.querySelector("[data-entry-count]"),
  adminLayout: document.querySelector(".admin-layout"),
  editorForm: document.querySelector("[data-editor-form]"),
  editorTitle: document.querySelector("[data-editor-title]"),
  editorMessage: document.querySelector("[data-editor-message]"),
  deleteButton: document.querySelector("[data-delete-entry]"),
  saveButton: document.querySelector("[data-save-entry]"),
  newEntry: document.querySelector("[data-new-entry]"),
  clearForm: document.querySelector("[data-clear-form]"),
  categoryField: document.querySelector("[data-category-field]"),
  newCategoryField: document.querySelector("[data-new-category-field]"),
  pinnedField: document.querySelector("[data-pinned-field]"),
  categorySelect: document.querySelector("[data-category-select]"),
  newCategoryInput: document.querySelector("[data-new-category-input]"),
  projectTypeField: document.querySelector("[data-project-type-field]"),
  imageUpload: document.querySelector("[data-image-upload]"),
  insertCodeBlock: document.querySelector("[data-insert-code-block]"),
  insertImageUrl: document.querySelector("[data-insert-image-url]"),
  fontSize: document.querySelector("[data-font-size]"),
  formatBold: document.querySelector("[data-format-bold]"),
  formatItalic: document.querySelector("[data-format-italic]"),
  formatUnderline: document.querySelector("[data-format-underline]"),
  formatInlineCode: document.querySelector("[data-format-inline-code]"),
  uploadMessage: document.querySelector("[data-upload-message]"),
  resumeForm: document.querySelector("[data-resume-form]"),
  resumeMessage: document.querySelector("[data-resume-message]"),
  musicAdmin: document.querySelector("[data-music-admin]"),
  musicForm: document.querySelector("[data-music-form]"),
  musicList: document.querySelector("[data-music-admin-list]"),
  musicMessage: document.querySelector("[data-music-message]"),
  portfolioAdmin: document.querySelector("[data-portfolio-admin]"),
  portfolioForm: document.querySelector("[data-portfolio-form]"),
  portfolioList: document.querySelector("[data-portfolio-admin-list]"),
  portfolioCount: document.querySelector("[data-portfolio-count]"),
  portfolioTitle: document.querySelector("[data-portfolio-editor-title]"),
  portfolioMessage: document.querySelector("[data-portfolio-message]"),
  portfolioUploadMessage: document.querySelector("[data-portfolio-upload-message]"),
  portfolioCoverUpload: document.querySelector("[data-portfolio-cover-upload]"),
  portfolioDemoUpload: document.querySelector("[data-portfolio-demo-upload]"),
  portfolioDelete: document.querySelector("[data-delete-portfolio]"),
  portfolioClear: document.querySelector("[data-clear-portfolio]"),
  questionBankAdmin: document.querySelector("[data-question-bank-admin]"),
  questionBankForm: document.querySelector("[data-question-bank-form]"),
  questionBankFiles: document.querySelector("[data-question-bank-files]"),
  questionBankTargetMode: document.querySelector("[data-question-bank-target-mode]"),
  questionBankExistingCategory: document.querySelector("[data-question-bank-existing-category]"),
  questionBankExistingCategoryField: document.querySelector("[data-question-bank-existing-category-field]"),
  questionBankNewCategory: document.querySelector("[data-question-bank-new-category]"),
  questionBankNewCategoryField: document.querySelector("[data-question-bank-new-category-field]"),
  questionBankList: document.querySelector("[data-question-bank-source-list]"),
  questionBankTotal: document.querySelector("[data-question-bank-total]"),
  questionBankReferences: document.querySelector("[data-question-bank-references]"),
  questionBankCategoryStats: document.querySelector("[data-question-bank-category-stats]"),
  questionBankMessage: document.querySelector("[data-question-bank-message]"),
  labels: {
    title: document.querySelector("[data-title-label]"),
    id: document.querySelector("[data-id-label]"),
    date: document.querySelector("[data-date-label]"),
    category: document.querySelector("[data-category-label]"),
    projectType: document.querySelector("[data-project-type-label]"),
    tags: document.querySelector("[data-tags-label]"),
    summary: document.querySelector("[data-summary-label]"),
    body: document.querySelector("[data-body-label]")
  }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentConfig() {
  return contentTypes[state.contentType];
}

function currentItems() {
  return state.items[state.contentType];
}

function setMessage(element, text, type = "") {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("is-error", type === "error");
  element.classList.toggle("is-success", type === "success");
}

function setText(element, text) {
  if (element) element.textContent = text;
}

function normalizeCategoryName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function inferPostCategory(entry) {
  const explicit = normalizeCategoryName(entry?.category);
  if (explicit) return categoryAliases.get(explicit) || explicit;

  const tags = Array.isArray(entry?.tags) ? entry.tags.map(normalizeCategoryName) : [];
  for (const tag of tags) {
    if (defaultPostCategories.includes(tag)) return tag;
    if (categoryAliases.has(tag)) return categoryAliases.get(tag);
  }
  return defaultPostCategories[0];
}

function getPostCategoryOptions() {
  const categories = new Set(defaultPostCategories);
  state.items.posts.forEach((entry) => {
    const category = inferPostCategory(entry);
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

function updateNewCategoryField() {
  if (!els.newCategoryField || !els.newCategoryInput || !els.categorySelect) return;
  const isNewCategory = els.categorySelect.value === NEW_CATEGORY_VALUE;
  els.newCategoryField.hidden = !isNewCategory;
  els.newCategoryInput.required = isNewCategory;
  els.newCategoryInput.disabled = !isNewCategory;
  if (!isNewCategory) {
    els.newCategoryInput.value = "";
  }
}

function renderCategoryOptions(selectedCategory = els.categorySelect?.value || "") {
  if (!els.categorySelect) return;
  const normalizedSelected = normalizeCategoryName(selectedCategory);
  const categories = getPostCategoryOptions();
  if (normalizedSelected && normalizedSelected !== NEW_CATEGORY_VALUE && !categories.includes(normalizedSelected)) {
    categories.push(normalizedSelected);
  }

  els.categorySelect.innerHTML = [
    '<option value="" disabled hidden>请选择栏目</option>',
    `<option value="${NEW_CATEGORY_VALUE}">新增栏目</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
  els.categorySelect.value = normalizedSelected || "";
  updateNewCategoryField();
}

async function api(path, options = {}) {
  const headers =
    options.body instanceof FormData
      ? options.headers || {}
      : {
          "Content-Type": "application/json",
          ...(options.headers || {})
        };

  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers
  });

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }
  if (!response.ok) {
    const portfolioApiMissing = response.status === 404 && path.startsWith("/api/admin/portfolio");
    throw new Error(
      portfolioApiMissing
        ? "当前运行的后台版本未包含作品集接口，请重启本地后台或发布最新 Sites 版本。"
        : data.error || `请求失败（${response.status}）`
    );
  }
  return data;
}

function redirectToLogin() {
  const next = encodeURIComponent("admin.html");
  window.location.href = `./login.html?next=${next}`;
}

function splitParagraphs(value) {
  const blocks = [];
  let current = [];
  let inCodeFence = false;

  String(value || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line) => {
      const isFence = line.trim().startsWith("```");
      if (isFence) {
        inCodeFence = !inCodeFence;
      }

      if (!inCodeFence && !isFence && !line.trim()) {
        if (current.length) {
          blocks.push(current.join("\n").trim());
          current = [];
        }
        return;
      }

      current.push(line);
    });

  if (current.length) {
    blocks.push(current.join("\n").trim());
  }

  return blocks.filter(Boolean);
}

function slugify(value) {
  const prefix = state.contentType === "projects" ? "project" : state.contentType === "portfolio" ? "work" : "post";
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || `${prefix}-${Date.now()}`;
}

function formToEntry() {
  const form = new FormData(els.editorForm);
  const entry = {
    id: String(form.get("id") || "").trim(),
    title: String(form.get("title") || "").trim(),
    date: String(form.get("date") || "").trim(),
    tags: String(form.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    summary: String(form.get("summary") || "").trim(),
    body: splitParagraphs(String(form.get("body") || ""))
  };

  if (state.contentType === "projects") {
    entry.type = String(form.get("type") || "").trim() || entry.title;
  }

  if (state.contentType === "posts") {
    const selectedCategory = normalizeCategoryName(form.get("category"));
    entry.category =
      selectedCategory === NEW_CATEGORY_VALUE
        ? normalizeCategoryName(form.get("newCategory"))
        : selectedCategory;
    entry.pinned = form.get("pinned") === "on";
  }

  return entry;
}

function updateModeUI() {
  const config = currentConfig();
  const isResume = state.contentType === "resume";
  const isMusic = state.contentType === "music";
  const isPortfolio = state.contentType === "portfolio";
  const isQuestionBank = state.contentType === "questionBank";

  els.adminLayout.hidden = isResume || isMusic || isPortfolio || isQuestionBank;
  els.resumeForm.hidden = !isResume;
  if (els.musicAdmin) els.musicAdmin.hidden = !isMusic;
  if (els.portfolioAdmin) els.portfolioAdmin.hidden = !isPortfolio;
  if (els.questionBankAdmin) els.questionBankAdmin.hidden = !isQuestionBank;
  els.newEntry.hidden = isResume || isMusic || isPortfolio || isQuestionBank;
  els.editorForm.contentType.value = state.contentType;
  els.dashboardTitle.textContent = config.title;

  if (isResume || isMusic || isPortfolio || isQuestionBank) {
    els.tabs.forEach((tab) => {
      const active = tab.dataset.contentType === state.contentType;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    return;
  }

  els.managerTitle.textContent = config.listTitle;
  els.newEntry.textContent = config.newButton;
  els.saveButton.textContent = config.saveButton;
  els.deleteButton.textContent = config.deleteButton;
  setText(els.labels.title, config.titleLabel);
  setText(els.labels.id, config.idLabel);
  setText(els.labels.date, config.dateLabel);
  setText(els.labels.category, config.categoryLabel || "栏目");
  setText(els.labels.projectType, config.typeLabel || "项目名称");
  setText(els.labels.tags, config.tagsLabel);
  setText(els.labels.summary, config.summaryLabel);
  setText(els.labels.body, config.bodyLabel);
  els.editorForm.id.placeholder = config.idPlaceholder;
  els.editorForm.title.placeholder = config.titlePlaceholder;
  els.editorForm.tags.placeholder = config.tagsPlaceholder;
  els.editorForm.summary.placeholder = config.summaryPlaceholder;
  els.editorForm.body.placeholder = config.bodyPlaceholder;
  els.editorForm.type.placeholder = config.typePlaceholder || "";

  const isProject = state.contentType === "projects";
  const isPost = state.contentType === "posts";
  els.categoryField.hidden = !isPost;
  els.categorySelect.required = isPost;
  els.categorySelect.disabled = !isPost;
  els.pinnedField.hidden = !isPost;
  els.editorForm.pinned.disabled = !isPost;
  els.projectTypeField.hidden = !isProject;
  els.editorForm.type.required = false;
  renderCategoryOptions();
  updateNewCategoryField();

  els.tabs.forEach((tab) => {
    const active = tab.dataset.contentType === state.contentType;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function fillForm(entry) {
  const config = currentConfig();
  els.editorForm.originalId.value = entry?.id || "";
  els.editorForm.id.value = entry?.id || "";
  els.editorForm.title.value = entry?.title || "";
  els.editorForm.date.value = entry?.date || new Date().toISOString().slice(0, 10);
  const category = state.contentType === "posts" && entry ? inferPostCategory(entry) : "";
  renderCategoryOptions(category);
  els.categorySelect.value = category;
  updateNewCategoryField();
  els.editorForm.pinned.checked = state.contentType === "posts" && Boolean(entry?.pinned);
  els.editorForm.tags.value = entry?.tags?.join(", ") || "";
  els.editorForm.summary.value = entry?.summary || "";
  els.editorForm.body.value = entry?.body?.join("\n\n") || "";
  bodySelection = {
    start: els.editorForm.body.value.length,
    end: els.editorForm.body.value.length
  };
  els.editorForm.type.value = entry?.type || config.defaultType || "";
  state.activeId = entry?.id || null;
  els.editorTitle.textContent = entry ? config.editTitle : config.newTitle;
  els.deleteButton.hidden = !entry;
  setMessage(els.editorMessage, "");
  setMessage(els.uploadMessage, "");
}

function renderManagerItem(entry, config, isProject = false) {
  const tags = Array.isArray(entry.tags) ? entry.tags.join(" / ") : "";
  const isPinnedPost = !isProject && Boolean(entry.pinned);
  const badge = isProject ? entry.type || entry.title : isPinnedPost ? "置顶" : config.label;
  const metaParts = isProject ? [entry.summary] : [entry.date, tags];
  return `
    <button class="manager-item ${isProject ? "is-project" : "is-post"} ${isPinnedPost ? "is-pinned" : ""} ${entry.id === state.activeId ? "is-active" : ""}" type="button" data-edit-id="${escapeHtml(entry.id)}">
      <span class="manager-item-head">
        <strong>${escapeHtml(entry.title)}</strong>
        <span class="manager-badge ${isPinnedPost ? "is-pinned" : ""}">${escapeHtml(badge)}</span>
      </span>
      <span class="manager-meta">${escapeHtml(metaParts.filter(Boolean).join(" · "))}</span>
    </button>
  `;
}

function sortEntriesByPinned(entries) {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => Number(Boolean(b.entry.pinned)) - Number(Boolean(a.entry.pinned)) || a.index - b.index)
    .map(({ entry }) => entry);
}

function renderGroupedPostList(items, config) {
  const groups = new Map();
  items.forEach((entry) => {
    const category = inferPostCategory(entry);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push({ ...entry, category });
  });

  const orderedGroups = Array.from(groups.entries()).sort(([a], [b]) => {
    const aIndex = defaultPostCategories.indexOf(a);
    const bIndex = defaultPostCategories.indexOf(b);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.localeCompare(b, "zh-CN");
  });

  return orderedGroups
    .map(([category, entries], index) => {
      const isOpen = entries.some((entry) => entry.id === state.activeId) || (!state.activeId && index === 0);
      return `
        <details class="manager-group" ${isOpen ? "open" : ""}>
          <summary>
            <span>${escapeHtml(category)}</span>
            <strong>${entries.length} ${config.countUnit}</strong>
          </summary>
          <div class="manager-group-list">
            ${sortEntriesByPinned(entries).map((entry) => renderManagerItem(entry, config)).join("")}
          </div>
        </details>
      `;
    })
    .join("");
}

function renderList() {
  const config = currentConfig();
  const items = currentItems();
  els.entryCount.textContent = `${items.length} ${config.countUnit}`;
  els.entryList.dataset.contentType = state.contentType;
  if (!items.length) {
    els.entryList.innerHTML = `<p class="manager-empty">${config.emptyText}</p>`;
    return;
  }
  els.entryList.innerHTML =
    state.contentType === "posts"
      ? renderGroupedPostList(items, config)
      : items.map((entry) => renderManagerItem(entry, config, true)).join("");
}

async function loadEntries(type = state.contentType) {
  const config = contentTypes[type];
  const data = await api(config.api);
  const items = data[config.collection] || [];
  state.items[type] = type === "posts" ? items.map((entry) => ({ ...entry, category: inferPostCategory(entry) })) : items;
  state.loaded[type] = true;
  if (type === "posts") {
    renderCategoryOptions();
  }

  if (type === state.contentType) {
    renderList();
    if (!state.activeId) {
      fillForm(null);
    }
  }
}

async function loadResumeForAdmin() {
  const data = await api(contentTypes.resume.api);
  state.resume = data;
  state.resumeLoaded = true;
  els.resumeForm.resumeJson.value = JSON.stringify(data, null, 2);
  setMessage(els.resumeMessage, "");
}

function renderMusicAdmin() {
  if (!els.musicList) return;
  const tracks = state.items.music || [];
  if (!tracks.length) {
    els.musicList.innerHTML = '<p class="manager-empty">还没有歌曲。</p>';
    return;
  }

  els.musicList.innerHTML = tracks
    .map(
      (track, index) => `
        <article class="music-admin-item">
          <span>
            <strong>${escapeHtml(track.title)}</strong>
            <small>${escapeHtml([track.artist, track.url].filter(Boolean).join(" · "))}</small>
          </span>
          <button class="admin-danger" type="button" data-delete-music="${escapeHtml(track.id)}" ${index === 0 ? "disabled" : ""}>
            ${index === 0 ? "默认曲目" : "删除"}
          </button>
        </article>
      `
    )
    .join("");
}

async function loadMusicForAdmin() {
  const data = await api(contentTypes.music.api);
  state.items.music = data.tracks || [];
  state.loaded.music = true;
  renderMusicAdmin();
  setMessage(els.musicMessage, "");
}

function fillPortfolioForm(item = null) {
  const form = els.portfolioForm;
  form.originalId.value = item?.id || "";
  form.id.value = item?.id || "";
  form.title.value = item?.title || "";
  form.category.value = item?.category || "";
  form.badge.value = item?.badge || "";
  form.summary.value = item?.summary || "";
  form.tags.value = item?.tags?.join(", ") || "";
  form.coverType.value = item?.cover?.type === "video" ? "video" : "image";
  form.coverSrc.value = item?.cover?.src || "";
  form.demoType.value = item?.demo?.type === "iframe" ? "iframe" : "video";
  form.demoSrc.value = item?.demo?.src || "";
  els.portfolioTitle.textContent = item ? "编辑作品" : "新建作品";
  els.portfolioDelete.hidden = !item;
  setMessage(els.portfolioMessage, "");
  setMessage(els.portfolioUploadMessage, "");
}

function renderPortfolioAdmin() {
  const items = state.items.portfolio || [];
  els.portfolioCount.textContent = `${items.length} 项`;
  els.portfolioList.innerHTML = items.length
    ? items.map((item) => `<button class="manager-item" type="button" data-edit-portfolio="${escapeHtml(item.id)}"><span class="manager-item-head"><strong>${escapeHtml(item.title)}</strong><span class="manager-badge">${escapeHtml(item.badge || item.category)}</span></span><span class="manager-meta">${escapeHtml([item.category, item.tags?.join(" / ")].filter(Boolean).join(" · "))}</span></button>`).join("")
    : '<p class="manager-empty">还没有作品。</p>';
}

async function loadPortfolioForAdmin() {
  const data = await api(contentTypes.portfolio.api);
  state.items.portfolio = data.items || [];
  state.loaded.portfolio = true;
  renderPortfolioAdmin();
  if (!els.portfolioForm.originalId.value) fillPortfolioForm();
}

function renderQuestionBankAdmin() {
  const library = state.questionBank;
  const categories = Array.isArray(library.categories) && library.categories.length
    ? library.categories
    : (library.categorySummary || []);
  if (els.questionBankExistingCategory) {
    const selected = els.questionBankExistingCategory.value;
    els.questionBankExistingCategory.innerHTML = categories.length
      ? categories.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join("")
      : '<option value="">暂无子题库</option>';
    if (categories.some((item) => item.id === selected)) els.questionBankExistingCategory.value = selected;
  }
  setText(els.questionBankTotal, String(library.questionCount || 0));
  setText(els.questionBankReferences, String(library.referenceCount || 0));
  if (els.questionBankCategoryStats) {
    els.questionBankCategoryStats.innerHTML = (library.categorySummary || []).length
      ? library.categorySummary
          .map((item) => `
            <article>
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(String(item.count || 0))} 道题</span>
            </article>`)
          .join("")
      : '<p class="manager-empty">暂无可汇总的题目。</p>';
  }
  if (!els.questionBankList) return;
  els.questionBankList.innerHTML = library.sources.length
    ? library.sources
        .map((source) => {
          const categoryLabel = categories.find((item) => item.id === source.categoryId)?.label || "自动分类";
          return `
            <article class="question-bank-source-item">
              <span>
                <strong>${escapeHtml(source.filename)}</strong>
                <small>${escapeHtml(`${source.questionCount} 道题 · ${source.answerCount} 份答案 · ${categoryLabel} · ${new Date(source.importedAt).toLocaleDateString("zh-CN")}`)}</small>
              </span>
              ${
                source.preset
                  ? '<span class="manager-badge">预置题库</span>'
                  : `<button class="admin-danger" type="button" data-delete-question-bank="${escapeHtml(source.id)}">删除</button>`
              }
            </article>`;
        })
        .join("")
    : '<p class="manager-empty">还没有题库文件。</p>';
}

function updateQuestionBankTargetFields() {
  const mode = els.questionBankTargetMode?.value || "auto";
  if (els.questionBankExistingCategoryField) els.questionBankExistingCategoryField.hidden = mode !== "existing";
  if (els.questionBankNewCategoryField) els.questionBankNewCategoryField.hidden = mode !== "new";
  if (els.questionBankExistingCategory) els.questionBankExistingCategory.required = mode === "existing";
  if (els.questionBankNewCategory) els.questionBankNewCategory.required = mode === "new";
}

async function loadQuestionBankForAdmin() {
  state.questionBank = await api(contentTypes.questionBank.api);
  state.loaded.questionBank = true;
  renderQuestionBankAdmin();
  setMessage(els.questionBankMessage, "");
}

function portfolioFormToItem() {
  const form = new FormData(els.portfolioForm);
  const demoSrc = String(form.get("demoSrc") || "").trim();
  const item = {
    id: String(form.get("id") || "").trim(),
    title: String(form.get("title") || "").trim(),
    category: String(form.get("category") || "").trim(),
    badge: String(form.get("badge") || "").trim(),
    summary: String(form.get("summary") || "").trim(),
    tags: String(form.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    cover: { type: String(form.get("coverType") || "image"), src: String(form.get("coverSrc") || "").trim(), alt: `${String(form.get("title") || "").trim()}封面` }
  };
  if (demoSrc) item.demo = { type: String(form.get("demoType") || "video"), src: demoSrc, title: `${item.title}演示视频` };
  return item;
}

async function uploadPortfolioFile(file, targetInput, requiredType = "") {
  if (!file) return;
  if (requiredType && !file.type.startsWith(`${requiredType}/`)) throw new Error(`请选择${requiredType === "video" ? "视频" : "图片"}文件。`);
  const form = new FormData(); form.append("file", file);
  setMessage(els.portfolioUploadMessage, "正在上传，请稍候...");
  const result = await api("/api/admin/portfolio/media", { method: "POST", body: form });
  targetInput.value = result.url;
  setMessage(els.portfolioUploadMessage, `已上传：${result.url}`, "success");
}

async function switchContentType(type) {
  if (!contentTypes[type] || type === state.contentType) return;
  state.contentType = type;
  state.activeId = null;
  updateModeUI();

  if (type === "resume") {
    if (!state.resumeLoaded) {
      await loadResumeForAdmin();
    }
    return;
  }

  if (type === "music") {
    if (!state.loaded.music) {
      await loadMusicForAdmin();
    } else {
      renderMusicAdmin();
    }
    return;
  }

  if (type === "portfolio") {
    if (!state.loaded.portfolio) await loadPortfolioForAdmin();
    else renderPortfolioAdmin();
    return;
  }

  if (type === "questionBank") {
    if (!state.loaded.questionBank) await loadQuestionBankForAdmin();
    else renderQuestionBankAdmin();
    return;
  }

  fillForm(null);
  renderList();

  if (!state.loaded[type]) {
    await loadEntries(type);
  } else {
    renderList();
    fillForm(null);
  }
}

function rememberBodySelection(textarea = els.editorForm.body) {
  bodySelection = {
    start: textarea.selectionStart ?? textarea.value.length,
    end: textarea.selectionEnd ?? textarea.value.length
  };
}

function getBodySelection(textarea) {
  const max = textarea.value.length;
  if (document.activeElement === textarea || !bodySelection) {
    return {
      start: textarea.selectionStart ?? max,
      end: textarea.selectionEnd ?? max
    };
  }
  return {
    start: Math.min(bodySelection.start, max),
    end: Math.min(bodySelection.end, max)
  };
}

function insertAtCursor(textarea, text) {
  const { start, end } = getBodySelection(textarea);
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const prefix = before && !before.endsWith("\n\n") ? "\n\n" : "";
  const suffix = after && !after.startsWith("\n\n") ? "\n\n" : "";
  textarea.value = `${before}${prefix}${text}${suffix}${after}`;
  const nextCursor = before.length + prefix.length + text.length;
  textarea.focus();
  textarea.setSelectionRange(nextCursor, nextCursor);
  rememberBodySelection(textarea);
}

function wrapSelection(textarea, prefix, suffix, placeholder = "文字") {
  const { start, end } = getBodySelection(textarea);
  const selected = textarea.value.slice(start, end);
  const content = selected || placeholder;
  const replacement = `${prefix}${content}${suffix}`;

  textarea.setRangeText(replacement, start, end, "end");
  textarea.focus();
  textarea.setSelectionRange(start + prefix.length, start + prefix.length + content.length);
  rememberBodySelection(textarea);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyInlineFormat(prefix, suffix, placeholder) {
  wrapSelection(els.editorForm.body, prefix, suffix, placeholder);
}

function sanitizeTableCell(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function rowsToMarkdownTable(rows) {
  const cleanRows = rows
    .map((row) => row.map(sanitizeTableCell))
    .filter((row) => row.some(Boolean));
  const columnCount = Math.max(0, ...cleanRows.map((row) => row.length));
  if (cleanRows.length < 1 || columnCount < 2) return "";

  const normalizedRows = cleanRows.map((row) => {
    const copy = row.slice(0, columnCount);
    while (copy.length < columnCount) copy.push("");
    return copy;
  });
  const bodyRows = normalizedRows.length > 1 ? normalizedRows.slice(1) : [Array(columnCount).fill("")];

  return [
    `| ${normalizedRows[0].join(" | ")} |`,
    `| ${Array(columnCount).fill("---").join(" | ")} |`,
    ...bodyRows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function markdownFromHtmlTables(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const tables = Array.from(doc.querySelectorAll("table"))
    .map((table) => {
      const rows = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => cell.textContent || ""));
      return rowsToMarkdownTable(rows);
    })
    .filter(Boolean);
  return tables.join("\n\n");
}

function markdownImagesFromHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"))
    .map((image) => {
      const src = image.getAttribute("src") || "";
      const safeSrc = /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(src) ? src : "";
      if (!safeSrc) return "";
      const alt = image.getAttribute("alt") || "图片";
      return `![${alt}](${safeSrc})`;
    })
    .filter(Boolean);
  return images.join("\n\n");
}

function markdownFromPlainTable(text) {
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized || !normalized.includes("\t")) return "";
  const rows = normalized
    .split("\n")
    .map((line) => line.split("\t"))
    .filter((row) => row.some((cell) => cell.trim()));
  if (rows.length < 1) return "";
  return rowsToMarkdownTable(rows);
}

function pastedImageName(file, index) {
  if (file.name) {
    return file.name.replace(/\.[^.]+$/, "") || `粘贴图片${index + 1}`;
  }
  return `粘贴图片${index + 1}`;
}

async function uploadImageFile(file, index = 0) {
  const form = new FormData();
  const fallbackName = `pasted-image-${Date.now()}-${index + 1}.png`;
  form.append("image", file, file.name || fallbackName);
  const result = await api("/api/admin/upload", {
    method: "POST",
    body: form
  });
  return result.url;
}

async function handleBodyPaste(event) {
  const clipboard = event.clipboardData;
  if (!clipboard) return;

  const textarea = els.editorForm.body;
  const imageFiles = Array.from(clipboard.files || []).filter((file) => file.type.startsWith("image/"));
  if (imageFiles.length) {
    event.preventDefault();
    setMessage(els.uploadMessage, `正在上传 ${imageFiles.length} 张粘贴图片...`);

    try {
      const snippets = [];
      for (const [index, file] of imageFiles.entries()) {
        const url = await uploadImageFile(file, index);
        snippets.push(`![${pastedImageName(file, index)}](${url})`);
      }
      insertAtCursor(textarea, snippets.join("\n\n"));
      setMessage(els.uploadMessage, "已上传并插入粘贴图片。", "success");
    } catch (error) {
      setMessage(els.uploadMessage, error.message, "error");
    }
    return;
  }

  const html = clipboard.getData("text/html");
  const tableMarkdown = markdownFromHtmlTables(html);
  if (tableMarkdown) {
    event.preventDefault();
    insertAtCursor(textarea, tableMarkdown);
    setMessage(els.uploadMessage, "已插入表格。", "success");
    return;
  }

  const imageMarkdown = markdownImagesFromHtml(html);
  if (imageMarkdown) {
    event.preventDefault();
    insertAtCursor(textarea, imageMarkdown);
    setMessage(els.uploadMessage, "已插入图片链接。", "success");
    return;
  }

  const plainTable = markdownFromPlainTable(clipboard.getData("text/plain"));
  if (plainTable) {
    event.preventDefault();
    insertAtCursor(textarea, plainTable);
    setMessage(els.uploadMessage, "已插入表格。", "success");
  }
}

async function checkSession() {
  try {
    await api("/api/session");
    updateModeUI();
    await loadEntries();
  } catch {
    redirectToLogin();
  }
}

els.logout.addEventListener("click", async () => {
  const isLocalAdmin = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  if (isLocalAdmin) {
    try {
      await api("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "./login.html?next=admin.html";
    }
    return;
  }
  window.location.href = "/signout-with-chatgpt?return_to=%2Findex.html";
});

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchContentType(tab.dataset.contentType).catch((error) => {
      const messageTarget =
        tab.dataset.contentType === "portfolio"
          ? els.portfolioMessage
          : tab.dataset.contentType === "questionBank"
            ? els.questionBankMessage
            : els.editorMessage;
      setMessage(messageTarget, error.message, "error");
    });
  });
});

els.entryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-id]");
  if (!button) return;

  const entry = currentItems().find((item) => item.id === button.dataset.editId);
  if (entry) {
    fillForm(entry);
    renderList();
  }
});

els.newEntry.addEventListener("click", () => {
  fillForm(null);
  renderList();
});

els.clearForm.addEventListener("click", () => {
  fillForm(null);
  renderList();
});

els.editorForm.title.addEventListener("input", () => {
  if (!els.editorForm.originalId.value && !els.editorForm.id.value.trim()) {
    els.editorForm.id.value = slugify(els.editorForm.title.value);
  }
});

els.categorySelect.addEventListener("change", updateNewCategoryField);

els.editorForm.body.addEventListener("paste", (event) => {
  handleBodyPaste(event).catch((error) => {
    setMessage(els.uploadMessage, error.message, "error");
  });
});

["focus", "input", "keyup", "mouseup", "select"].forEach((eventName) => {
  els.editorForm.body.addEventListener(eventName, () => rememberBodySelection());
});

els.editorForm.body.addEventListener("keydown", (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

  const key = event.key.toLowerCase();
  const formats = {
    b: ["**", "**", "加粗文字"],
    i: ["*", "*", "斜体文字"],
    u: ["[u]", "[/u]", "下划线文字"]
  };
  const format = formats[key];
  if (!format) return;

  event.preventDefault();
  applyInlineFormat(...format);
});

els.fontSize?.addEventListener("change", () => {
  const size = els.fontSize.value;
  if (!size) return;
  applyInlineFormat(`[size=${size}]`, "[/size]", "设置字号的文字");
  els.fontSize.value = "";
});

els.formatBold?.addEventListener("click", () => {
  applyInlineFormat("**", "**", "加粗文字");
});

els.formatItalic?.addEventListener("click", () => {
  applyInlineFormat("*", "*", "斜体文字");
});

els.formatUnderline?.addEventListener("click", () => {
  applyInlineFormat("[u]", "[/u]", "下划线文字");
});

els.formatInlineCode?.addEventListener("click", () => {
  applyInlineFormat("`", "`", "code");
});

els.editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const config = currentConfig();
  const originalId = els.editorForm.originalId.value;
  const entry = formToEntry();
  setMessage(els.editorMessage, "正在保存...");

  try {
    if (originalId) {
      await api(`${config.api}/${encodeURIComponent(originalId)}`, {
        method: "PUT",
        body: JSON.stringify(entry)
      });
    } else {
      await api(config.api, {
        method: "POST",
        body: JSON.stringify(entry)
      });
    }
    state.activeId = entry.id;
    await loadEntries();
    const saved = currentItems().find((item) => item.id === entry.id);
    fillForm(saved || null);
    renderList();
    setMessage(els.editorMessage, state.contentType === "projects" ? "已保存。刷新项目复盘页面即可看到更新。" : "已保存。刷新文章页面即可看到更新。", "success");
  } catch (error) {
    setMessage(els.editorMessage, error.message, "error");
  }
});

els.resumeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(els.resumeMessage, "正在保存...");

  try {
    const payload = JSON.parse(els.resumeForm.resumeJson.value || "{}");
    const saved = await api(contentTypes.resume.api, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    state.resume = saved;
    state.resumeLoaded = true;
    els.resumeForm.resumeJson.value = JSON.stringify(saved, null, 2);
    setMessage(els.resumeMessage, "已保存。刷新关于博主页面即可看到更新。", "success");
  } catch (error) {
    setMessage(els.resumeMessage, error.message, "error");
  }
});

els.musicForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(els.musicForm);
  const file = form.get("audio");
  if (!file || !file.size) {
    setMessage(els.musicMessage, "请选择音频文件。", "error");
    return;
  }

  setMessage(els.musicMessage, "正在上传歌曲...");
  try {
    await api(contentTypes.music.api, {
      method: "POST",
      body: form
    });
    els.musicForm.reset();
    await loadMusicForAdmin();
    setMessage(els.musicMessage, "已上传。刷新前台后可播放。", "success");
  } catch (error) {
    setMessage(els.musicMessage, error.message, "error");
  }
});

els.musicList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-music]");
  if (!button || button.disabled) return;
  const track = state.items.music.find((item) => item.id === button.dataset.deleteMusic);
  if (!track) return;
  if (!window.confirm(`确认删除「${track.title}」？`)) return;

  setMessage(els.musicMessage, "正在删除...");
  try {
    await api(`${contentTypes.music.api}/${encodeURIComponent(track.id)}`, { method: "DELETE" });
    await loadMusicForAdmin();
    setMessage(els.musicMessage, "已删除。", "success");
  } catch (error) {
    setMessage(els.musicMessage, error.message, "error");
  }
});

els.questionBankForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const files = Array.from(els.questionBankFiles?.files || []);
  if (!files.length) {
    setMessage(els.questionBankMessage, "请选择至少一份 CSV 或 XLSX 文件。", "error");
    return;
  }

  const selectedMode = els.questionBankTargetMode?.value || "auto";
  let uploadMode = selectedMode;
  let categoryId = els.questionBankExistingCategory?.value || "";
  const categoryName = els.questionBankNewCategory?.value.trim() || "";
  if (selectedMode === "existing" && !categoryId) {
    setMessage(els.questionBankMessage, "请选择一个已有子题库。", "error");
    return;
  }
  if (selectedMode === "new" && !categoryName) {
    setMessage(els.questionBankMessage, "请填写新子题库名称。", "error");
    return;
  }

  setMessage(els.questionBankMessage, `正在上传 0 / ${files.length}…`);
  try {
    for (const [index, file] of files.entries()) {
      const form = new FormData();
      form.append("file", file);
      form.append("targetMode", uploadMode);
      if (uploadMode === "existing") form.append("categoryId", categoryId);
      if (uploadMode === "new") form.append("categoryName", categoryName);
      const result = await api(contentTypes.questionBank.api, { method: "POST", body: form });
      if (uploadMode === "new") {
        categoryId = result.source.categoryId;
        uploadMode = "existing";
      }
      setMessage(els.questionBankMessage, `正在上传 ${index + 1} / ${files.length}…`);
    }
    els.questionBankForm.reset();
    updateQuestionBankTargetFields();
    await loadQuestionBankForAdmin();
    setMessage(els.questionBankMessage, `已整合 ${files.length} 份题库文件。`, "success");
  } catch (error) {
    await loadQuestionBankForAdmin().catch(() => {});
    setMessage(els.questionBankMessage, error.message, "error");
  }
});

els.questionBankTargetMode?.addEventListener("change", updateQuestionBankTargetFields);
updateQuestionBankTargetFields();

els.questionBankList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-question-bank]");
  if (!button || button.disabled) return;
  const source = state.questionBank.sources.find((item) => item.id === button.dataset.deleteQuestionBank);
  if (!source || !window.confirm(`确认删除题库「${source.filename}」？`)) return;
  button.disabled = true;
  setMessage(els.questionBankMessage, "正在删除题库…");
  try {
    await api(`${contentTypes.questionBank.api}/${encodeURIComponent(source.id)}`, { method: "DELETE" });
    await loadQuestionBankForAdmin();
    setMessage(els.questionBankMessage, "已删除并重新整合题库。", "success");
  } catch (error) {
    button.disabled = false;
    setMessage(els.questionBankMessage, error.message, "error");
  }
});

els.deleteButton.addEventListener("click", async () => {
  const config = currentConfig();
  const originalId = els.editorForm.originalId.value;
  const title = els.editorForm.title.value || originalId;
  if (!originalId) return;
  if (!window.confirm(`确认删除「${title}」？`)) return;

  setMessage(els.editorMessage, "正在删除...");
  try {
    await api(`${config.api}/${encodeURIComponent(originalId)}`, { method: "DELETE" });
    state.activeId = null;
    await loadEntries();
    fillForm(null);
    setMessage(els.editorMessage, "已删除。", "success");
  } catch (error) {
    setMessage(els.editorMessage, error.message, "error");
  }
});

els.imageUpload.addEventListener("change", async () => {
  const file = els.imageUpload.files?.[0];
  if (!file) return;

  setMessage(els.uploadMessage, "正在上传图片...");

  try {
    const url = await uploadImageFile(file);
    insertAtCursor(els.editorForm.body, `![${file.name.replace(/\.[^.]+$/, "")}](${url})`);
    setMessage(els.uploadMessage, `已插入图片：${url}`, "success");
  } catch (error) {
    setMessage(els.uploadMessage, error.message, "error");
  } finally {
    els.imageUpload.value = "";
  }
});

els.insertCodeBlock.addEventListener("click", () => {
  insertAtCursor(els.editorForm.body, "```cpp\n// 在这里粘贴代码\nint main() {\n  return 0;\n}\n```");
});

els.insertImageUrl.addEventListener("click", () => {
  const url = window.prompt("输入图片地址，例如 ./assets/uploads/example.png 或 https://example.com/image.png");
  if (!url) return;
  const alt = window.prompt("图片说明", "图片") || "图片";
  insertAtCursor(els.editorForm.body, `![${alt}](${url.trim()})`);
});

els.portfolioList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-portfolio]");
  if (!button) return;
  const item = state.items.portfolio.find((entry) => entry.id === button.dataset.editPortfolio);
  if (item) fillPortfolioForm(item);
});

els.portfolioClear?.addEventListener("click", () => fillPortfolioForm());

els.portfolioForm?.title.addEventListener("input", () => {
  if (!els.portfolioForm.originalId.value && !els.portfolioForm.id.value.trim()) {
    els.portfolioForm.id.value = slugify(els.portfolioForm.title.value);
  }
});

els.portfolioForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const originalId = els.portfolioForm.originalId.value;
  const item = portfolioFormToItem();
  setMessage(els.portfolioMessage, "正在保存...");
  try {
    await api(originalId ? `${contentTypes.portfolio.api}/${encodeURIComponent(originalId)}` : contentTypes.portfolio.api, {
      method: originalId ? "PUT" : "POST",
      body: JSON.stringify(item)
    });
    await loadPortfolioForAdmin();
    fillPortfolioForm(state.items.portfolio.find((entry) => entry.id === item.id) || null);
    setMessage(els.portfolioMessage, "已保存。刷新作品集页面即可看到更新。", "success");
  } catch (error) { setMessage(els.portfolioMessage, error.message, "error"); }
});

els.portfolioDelete?.addEventListener("click", async () => {
  const id = els.portfolioForm.originalId.value;
  if (!id || !window.confirm(`确认删除「${els.portfolioForm.title.value || id}」？`)) return;
  try {
    await api(`${contentTypes.portfolio.api}/${encodeURIComponent(id)}`, { method: "DELETE" });
    fillPortfolioForm();
    await loadPortfolioForAdmin();
    setMessage(els.portfolioMessage, "已删除。", "success");
  } catch (error) { setMessage(els.portfolioMessage, error.message, "error"); }
});

els.portfolioCoverUpload?.addEventListener("change", async () => {
  const file = els.portfolioCoverUpload.files?.[0];
  try {
    await uploadPortfolioFile(file, els.portfolioForm.coverSrc);
    if (file?.type.startsWith("video/")) els.portfolioForm.coverType.value = "video";
  } catch (error) { setMessage(els.portfolioUploadMessage, error.message, "error"); }
  finally { els.portfolioCoverUpload.value = ""; }
});

els.portfolioDemoUpload?.addEventListener("change", async () => {
  const file = els.portfolioDemoUpload.files?.[0];
  try {
    await uploadPortfolioFile(file, els.portfolioForm.demoSrc, "video");
    els.portfolioForm.demoType.value = "video";
  } catch (error) { setMessage(els.portfolioUploadMessage, error.message, "error"); }
  finally { els.portfolioDemoUpload.value = ""; }
});

checkSession();
