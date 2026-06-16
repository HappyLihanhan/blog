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

let posts = [];

const selectors = {
  html: document.documentElement,
  body: document.body,
  postList: document.querySelector("[data-post-list]"),
  searchModal: document.querySelector("[data-search-modal]"),
  searchInput: document.querySelector("#site-search"),
  searchResults: document.querySelector("[data-search-results]"),
  postModal: document.querySelector("[data-post-modal]"),
  postTitle: document.querySelector("[data-post-title]"),
  postMeta: document.querySelector("[data-post-meta]"),
  postBody: document.querySelector("[data-post-body]"),
  mobileMenu: document.querySelector("[data-mobile-menu]"),
  tagCloud: document.querySelector("[data-tag-cloud]"),
  statPosts: document.querySelector("[data-stat-posts]")
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
  if (/^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(src)) {
    return src;
  }
  return "";
}

function renderPostBlock(block) {
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

function renderPosts(items = posts) {
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
}

function renderSearchResults(query = "") {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? posts.filter((post) => {
        const source = [post.title, post.summary, ...post.tags].join(" ").toLowerCase();
        return source.includes(normalized);
      })
    : posts;

  selectors.searchResults.innerHTML = results.length
    ? results
        .map(
          (post) => `
            <button class="search-result" type="button" data-post-id="${escapeHtml(post.id)}">
              <strong>${escapeHtml(post.title)}</strong>
              <span>${escapeHtml(post.date)} · ${escapeHtml(post.tags.join(" / "))} · ${escapeHtml(post.summary)}</span>
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

    const tagButton = event.target.closest("[data-tag]");
    if (tagButton) {
      const tag = tagButton.dataset.tag;
      const filtered = posts.filter((post) => post.tags.includes(tag));
      renderPosts(filtered);
      document.querySelector("#latest").scrollIntoView({ behavior: "smooth" });
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
  const sections = links
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
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

  posts = await loadPosts();
  renderPosts();
  renderTags();
  renderStats();
  renderSearchResults();
}

init();
