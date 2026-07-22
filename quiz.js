(() => {
  const els = {
    quizCount: document.querySelector("[data-quiz-count]"),
    sourceCount: document.querySelector("[data-source-count]"),
    referenceCount: document.querySelector("[data-reference-count]"),
    categoryOptions: document.querySelector("[data-quiz-category-options]"),
    categorySummary: document.querySelector("[data-quiz-category-summary]"),
    size: document.querySelector("[data-quiz-size]"),
    start: document.querySelector("[data-start-quiz]"),
    status: document.querySelector("[data-quiz-status]"),
    setup: document.querySelector(".quiz-setup-card"),
    modal: document.querySelector("[data-quiz-modal]"),
    close: document.querySelector("[data-close-quiz]"),
    stage: document.querySelector("[data-quiz-stage]"),
    finish: document.querySelector("[data-quiz-finish]"),
    progress: document.querySelector("[data-quiz-progress]"),
    progressBar: document.querySelector("[data-progress-bar]"),
    runningScore: document.querySelector("[data-running-score]"),
    questionCategory: document.querySelector("[data-question-category]"),
    question: document.querySelector("[data-question-text]"),
    referenceBadge: document.querySelector("[data-reference-badge]"),
    answer: document.querySelector("[data-answer-input]"),
    answerCount: document.querySelector("[data-answer-count]"),
    grade: document.querySelector("[data-grade-answer]"),
    result: document.querySelector("[data-grade-result]"),
    gradeScore: document.querySelector("[data-grade-score]"),
    gradeMode: document.querySelector("[data-grade-mode]"),
    gradeSummary: document.querySelector("[data-grade-summary]"),
    strengths: document.querySelector("[data-grade-strengths]"),
    improvements: document.querySelector("[data-grade-improvements]"),
    referenceAnswer: document.querySelector("[data-reference-answer]"),
    next: document.querySelector("[data-next-question]"),
    finalScore: document.querySelector("[data-final-score]"),
    finalSummary: document.querySelector("[data-final-summary]"),
    roundList: document.querySelector("[data-round-list]"),
    restart: document.querySelector("[data-restart-quiz]")
  };

  const categoryTools = globalThis.QuestionCategories;
  const state = {
    library: [],
    categorySummary: [],
    selectedCategories: new Set(),
    round: [],
    index: 0,
    results: [],
    apiAvailable: false
  };

  const personalQuestionPatterns = [
    /自我介绍|职业规划|期望薪资|薪资期望|离职原因|为什么离职|为什么跳槽|为什么选择我们|为什么应聘/iu,
    /你的(?:优点|缺点|优势|劣势|性格|期望|规划)/u,
    /你(?:在|曾经|曾|做过|负责|参与|遇到).{0,20}(?:项目|工作|公司|团队|模块|业务|bug|问题|困难)/iu,
    /(?:上一|上一个|之前的).{0,8}(?:项目|工作|公司|团队)/u,
    /(?:最有成就感|最困难|最棘手|最失败|印象最深).{0,20}(?:项目|经历|问题|bug|事情|模块)/iu,
    /你(?:能否|能不能|能|是否|会不会|会|愿不愿意|愿意|接受).{0,16}(?:加班|出差|调岗|技术栈|岗位|薪资|压力|调整|变动|转向|切换)/u,
    /为什么(?:选择|想进入|想从事|更喜欢|倾向|不选择).{0,20}(?:unity|ue|引擎|游戏行业|岗位|客户端|公司|项目组|后端|算法)/iu,
    /(?:unity|ue|引擎|游戏|岗位|客户端).{0,16}你(?:更)?(?:喜欢|倾向|选择|关注)/iu,
    /(?:最近|目前)(?:在)?(?:玩|学习|学到|关注|投递|面试)|你最(?:喜欢|关注|擅长)|对工作城市.{0,8}(?:要求|期望)/u,
    /你(?:了解我们|希望进入|如何使用\s*ai)|(?:offer|面试流程|项目组).{0,12}(?:哪些|哪个|情况)/iu,
    /你(?:使用过|熟悉|掌握|做过|独立完成|如何定位|如何修复).{0,20}(?:unity|ue|profiler|项目|模块|bug|工具|技术)/iu,
    /项目(?:中|当前)?(?:做过|出现过|最大|最难|哪一部分).{0,16}(?:性能|测试|瓶颈|bug|问题|困难|完成)/iu,
    /为什么.{0,12}(?:塔防|射击|游戏|个人)项目(?:使用|选择|采用)|为什么(?:投递|选择|加入)我们/iu,
    /如何处理.{0,12}(?:同事|领导|团队|沟通|冲突|分歧|压力)/u,
    /(?:同事|领导|团队成员).{0,12}(?:冲突|分歧|不配合|沟通)/u,
    /介绍一下.{0,12}(?:你的|个人|项目经历|工作经历)/u
  ];

  const technicalQuestionPatterns = [
    /c\+\+|std::|stl|raii|constexpr|consteval|constinit|decltype|lambda|concept|coroutine|shared_ptr|unique_ptr|weak_ptr|dynamic_cast|static_cast|reinterpret_cast|vtable|rtti/iu,
    /指针|引用|虚函数|虚表|多态|继承|析构|构造函数|模板|泛型|重载|重写|对象模型|内存布局|智能指针|左值|右值|移动语义|完美转发|拷贝|异常安全|内存泄漏|野指针|悬空指针|内存对齐|迭代器|分配器/u,
    /操作系统|进程|线程|协程|调度|上下文切换|互斥|信号量|自旋锁|读写锁|死锁|并发|原子操作|内存模型|虚拟内存|分页|页表|页面置换|堆栈|调用栈/u,
    /cpu|cache|缓存|缓存行|伪共享|汇编|指令集|字节序|编译|链接|装载|动态库|静态库/iu,
    /tcp|udp|http|https|socket|websocket|dns|网络协议|三次握手|四次挥手|拥塞控制|滑动窗口|粘包|拆包/iu,
    /数据结构|算法|时间复杂度|空间复杂度|哈希|红黑树|二叉树|b\+?树|图算法|动态规划|排序算法|查找算法|链表|队列|优先队列/iu,
    /数据库|sql|索引|事务|隔离级别|mvcc|锁表|锁行|查询优化|主从复制/iu,
    /高并发|分布式|负载均衡|一致性哈希|消息队列|序列化|反序列化|cap定理|缓存系统/iu,
    /图形学|渲染|渲染管线|shader|shading|opengl|directx|vulkan|metal|pbr|brdf|光栅化|光线追踪|ray\s*tracing/iu,
    /g-?buffer|framebuffer|帧缓冲|深度缓冲|模板缓冲|顶点|像素|片元|材质|纹理|贴图|采样器|mipmap|各向异性过滤/iu,
    /光照|阴影|法线|切线空间|透明物体|alpha|混合|抗锯齿|msaa|taa|fxaa|环境光遮蔽|ssao|剔除|遮挡查询|lod/iu,
    /矩阵变换|齐次坐标|坐标系|四元数|欧拉角|投影矩阵|视图矩阵|透视投影|正交投影|骨骼动画|蒙皮|mesh|网格/iu,
    /gpu|显存|draw\s*call|compute\s*shader|计算着色器|批处理|实例化渲染|延迟渲染|前向渲染|路径追踪/iu
  ];

  function isQuestionInScope(question, answer = "") {
    const prompt = String(question || "").trim();
    if (!prompt || personalQuestionPatterns.some((pattern) => pattern.test(prompt))) return false;
    const technicalContext = `${prompt}\n${String(answer || "").trim()}`;
    return technicalQuestionPatterns.some((pattern) => pattern.test(technicalContext));
  }

  function normalized(value) {
    return String(value || "").toLocaleLowerCase("zh-CN").replace(/[\s\p{P}\p{S}]+/gu, "");
  }

  function bigrams(value) {
    const text = normalized(value);
    const tokens = new Set();
    for (let index = 0; index < text.length - 1; index += 1) tokens.add(text.slice(index, index + 2));
    return tokens;
  }

  function localGrade(question, userAnswer) {
    const answer = userAnswer.trim();
    const reference = String(question.answer || "").trim();
    const signals = ["因为", "因此", "首先", "其次", "例如", "优点", "缺点", "底层", "实现", "场景"];
    const structure = signals.filter((signal) => answer.includes(signal)).length;
    const strengths = [];
    const improvements = [];
    let score;
    let summary;
    if (reference) {
      const expected = bigrams(reference);
      const actual = bigrams(answer);
      const coverage = expected.size ? [...expected].filter((token) => actual.has(token)).length / expected.size : 0;
      const depth = Math.min(1, answer.length / Math.max(60, reference.length * 0.7));
      score = 1 + coverage * 6.5 + depth * 1.5 + Math.min(1, structure / 3);
      if (coverage < 0.08) score = Math.min(score, 2);
      if (coverage >= 0.45) strengths.push("覆盖了参考答案中的多数核心概念。");
      else if (coverage >= 0.2) strengths.push("提到了部分关键概念。");
      if (coverage < 0.45) improvements.push("补充参考答案中的关键原理和必要条件。");
      summary = "已根据题库参考答案进行要点匹配。";
    } else {
      score = 1.5 + Math.min(4.5, answer.length / 45) + Math.min(2, structure * 0.45);
      if (answer.length >= 80) strengths.push("回答有一定展开，不只是给出结论。");
      improvements.push("该题尚无参考答案，本次分数依据完整度与表达结构估算。");
      summary = "已完成浏览器本地分析。";
    }
    if (answer.length < 35) improvements.push("回答偏短，建议补充定义、工作原理和实际例子。");
    if (!structure) improvements.push("增加因果关系、实现过程或优缺点分析。");
    if (!strengths.length) strengths.push("已经针对题目给出了有效作答。");
    return {
      score: Math.round(Math.max(0, Math.min(10, score)) * 10) / 10,
      maxScore: 10,
      summary,
      strengths,
      improvements,
      referenceAnswer: reference || "该题暂未提供参考答案。",
      mode: "local"
    };
  }

  function staticLibrary(payload) {
    const sources = (payload.sources || []).filter((source) => !source.preset);
    const sourceIds = new Set(sources.map((source) => source.id));
    const merged = new Map();
    (payload.questions || []).forEach((item) => {
      if (!item?.id || !item?.question || !sourceIds.has(item.sourceId)) return;
      if (!item.category && !isQuestionInScope(item.question, item.answer)) return;
      const key = normalized(item.question);
      const current = merged.get(key);
      if (!current) merged.set(key, {
        ...item,
        category: item.category || categoryTools.classify(item),
        hasReference: Boolean(item.answer)
      });
      else if (!current.answer && item.answer) {
        current.answer = item.answer;
        current.hasReference = true;
      }
    });
    const questions = [...merged.values()];
    return {
      questions,
      categories: payload.categories || [],
      categorySummary: categoryTools.summarize(questions, payload.categories || []),
      sourceCount: sources.length,
      referenceCount: questions.filter((item) => item.answer).length
    };
  }

  async function loadStaticLibrary() {
    const response = await fetch("./data/question-banks.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`静态题库读取失败（${response.status}）`);
    return staticLibrary(await response.json());
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function list(element, items, emptyText) {
    element.innerHTML = "";
    const values = items.length ? items : [emptyText];
    values.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      element.append(item);
    });
  }

  async function request(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `请求失败（${response.status}）`);
    return data;
  }

  function currentQuestion() {
    return state.round[state.index];
  }

  function categoryLabel(categoryId) {
    return state.categorySummary.find((item) => item.id === categoryId)?.label
      || categoryTools.definitions.find((item) => item.id === categoryId)?.label
      || "计算机基础";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[character]);
  }

  function selectedLibrary() {
    return categoryTools.filter(state.library, [...state.selectedCategories]);
  }

  function updateCategorySelection() {
    const pool = selectedLibrary();
    const selectedLabels = state.categorySummary
      .filter((item) => state.selectedCategories.has(item.id))
      .map((item) => item.label);
    els.categorySummary.textContent = selectedLabels.length
      ? `已选择 ${selectedLabels.join("、")} · 共 ${pool.length} 道题`
      : "请至少选择一个子题库。";
    els.quizCount.textContent = String(pool.length);
    els.size.max = String(Math.max(1, Math.min(30, pool.length)));
    if (Number(els.size.value) > pool.length && pool.length) {
      els.size.value = String(Math.min(5, pool.length));
    }
    els.start.disabled = !pool.length;
    els.status.textContent = pool.length ? "所选子题库已就绪。" : "请至少选择一个子题库。";
    els.status.classList.toggle("is-error", !pool.length);
  }

  function renderCategoryOptions(summary) {
    state.categorySummary = summary;
    state.selectedCategories = new Set(summary.filter((item) => item.count > 0).map((item) => item.id));
    els.categoryOptions.innerHTML = summary
      .map((item) => `
        <label class="quiz-category-option">
          <input type="checkbox" value="${escapeHtml(item.id)}" data-quiz-category ${item.count ? "checked" : "disabled"} />
          <span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.count)} 道题</small></span>
        </label>
      `)
      .join("");
    updateCategorySelection();
  }

  function runningAverage() {
    if (!state.results.length) return 0;
    return state.results.reduce((sum, item) => sum + item.score, 0) / state.results.length;
  }

  function renderQuestion() {
    const item = currentQuestion();
    els.progress.textContent = `第 ${state.index + 1} / ${state.round.length} 题`;
    els.progressBar.style.width = `${((state.index + 1) / state.round.length) * 100}%`;
    els.runningScore.textContent = state.results.length ? `当前均分 ${runningAverage().toFixed(1)}` : "尚未评分";
    els.questionCategory.textContent = categoryLabel(item.category).toUpperCase();
    els.question.textContent = item.question;
    els.referenceBadge.textContent = item.hasReference ? "题库含参考答案" : state.apiAvailable ? "AI 补充参考答案" : "暂无参考答案";
    els.answer.value = "";
    els.answer.disabled = false;
    els.answerCount.textContent = "0 / 6000";
    els.grade.disabled = false;
    els.grade.textContent = "提交并智能评分";
    els.result.hidden = true;
    els.next.textContent = state.index === state.round.length - 1 ? "查看本轮成绩" : "下一题";
    els.answer.focus();
  }

  function openQuizModal() {
    els.modal.hidden = false;
    document.body.classList.add("quiz-modal-open");
  }

  function closeQuizModal() {
    els.modal.hidden = true;
    els.stage.hidden = true;
    els.finish.hidden = true;
    els.setup.hidden = false;
    document.body.classList.remove("quiz-modal-open");
  }

  function startRound() {
    const pool = selectedLibrary();
    if (!pool.length) {
      updateCategorySelection();
      return;
    }
    const requested = Math.max(1, Math.min(30, Number.parseInt(els.size.value, 10) || 5));
    const count = Math.min(requested, pool.length);
    els.size.value = String(count);
    state.round = shuffle(pool).slice(0, count);
    state.index = 0;
    state.results = [];
    openQuizModal();
    els.finish.hidden = true;
    els.stage.hidden = false;
    renderQuestion();
  }

  function showGrade(result) {
    const labels = {
      ai: "AI 内容级评分",
      local: "本地关键词估算（非 AI）",
      "local-fallback": "AI 暂不可用 · 本地关键词估算"
    };
    els.gradeScore.textContent = Number(result.score).toFixed(1);
    els.gradeMode.textContent = labels[result.mode] || "智能评分";
    els.gradeSummary.textContent = result.summary;
    list(els.strengths, result.strengths || [], "已经完成了有效作答。");
    list(els.improvements, result.improvements || [], "继续保持当前表达结构。");
    els.referenceAnswer.textContent = result.referenceAnswer;
    els.result.hidden = false;
    els.result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function gradeAnswer() {
    const answer = els.answer.value.trim();
    if (!answer) {
      els.answer.focus();
      els.answer.setCustomValidity("请先输入你的答案");
      els.answer.reportValidity();
      els.answer.setCustomValidity("");
      return;
    }
    els.grade.disabled = true;
    els.grade.textContent = "正在分析答案…";
    try {
      let grade;
      if (state.apiAvailable) {
        try {
          grade = await request("/api/question-bank/grade", {
            method: "POST",
            body: JSON.stringify({ questionId: currentQuestion().id, answer })
          });
        } catch {
          grade = localGrade(currentQuestion(), answer);
        }
      } else grade = localGrade(currentQuestion(), answer);
      state.results.push({ question: currentQuestion().question, answer, ...grade });
      els.answer.disabled = true;
      els.grade.textContent = "已完成评分";
      els.runningScore.textContent = `当前均分 ${runningAverage().toFixed(1)}`;
      showGrade(grade);
    } catch (error) {
      els.grade.disabled = false;
      els.grade.textContent = "重新提交评分";
      els.status.textContent = error.message;
      els.status.classList.add("is-error");
    }
  }

  function finishRound() {
    const average = runningAverage();
    els.stage.hidden = true;
    els.finish.hidden = false;
    els.finalScore.textContent = average.toFixed(1);
    els.finalSummary.textContent = average >= 8 ? "整体表达扎实，可以继续挑战更深的连续追问。" : average >= 6 ? "基础要点已经覆盖，下一轮重点补齐原理、边界和工程场景。" : "建议先用参考答案整理知识骨架，再尝试脱稿口述。";
    els.roundList.innerHTML = "";
    state.results.forEach((result, index) => {
      const item = document.createElement("article");
      const title = document.createElement("span");
      const score = document.createElement("strong");
      title.textContent = `${index + 1}. ${result.question}`;
      score.textContent = `${Number(result.score).toFixed(1)} / 10`;
      item.append(title, score);
      els.roundList.append(item);
    });
    els.finish.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function loadLibrary() {
    try {
      let data;
      const githubPages = location.hostname.endsWith(".github.io");
      if (githubPages) data = await loadStaticLibrary();
      else {
        try {
          data = await request("/api/question-bank");
          state.apiAvailable = true;
        } catch {
          data = await loadStaticLibrary();
          state.apiAvailable = false;
        }
      }
      state.library = (data.questions || []).map((item) => ({
        ...item,
        category: item.category || categoryTools.classify(item)
      }));
      els.sourceCount.textContent = String(data.sourceCount || 0);
      els.referenceCount.textContent = String(data.referenceCount || 0);
      renderCategoryOptions(data.categorySummary || categoryTools.summarize(state.library));
      if (!state.library.length) {
        els.status.textContent = githubPages
          ? "题库暂时为空，请先在本地导入 CSV / XLSX 并提交静态题库。"
          : "题库暂时为空，请先在后台上传 CSV / XLSX。";
      }
    } catch (error) {
      els.status.textContent = error.message;
      els.status.classList.add("is-error");
    }
  }

  els.answer.addEventListener("input", () => {
    els.answerCount.textContent = `${els.answer.value.length} / 6000`;
  });
  els.categoryOptions.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.matches("[data-quiz-category]")) return;
    if (input.checked) state.selectedCategories.add(input.value);
    else state.selectedCategories.delete(input.value);
    updateCategorySelection();
  });
  els.start.addEventListener("click", startRound);
  els.grade.addEventListener("click", gradeAnswer);
  els.next.addEventListener("click", () => {
    if (state.index >= state.round.length - 1) finishRound();
    else {
      state.index += 1;
      renderQuestion();
      els.stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  els.restart.addEventListener("click", () => {
    closeQuizModal();
    els.setup.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  els.close.addEventListener("click", closeQuizModal);
  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeQuizModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.modal.hidden) closeQuizModal();
  });

  loadLibrary();
})();
