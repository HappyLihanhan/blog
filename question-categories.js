(() => {
  const definitions = Object.freeze([
    Object.freeze({ id: "cpp", label: "C++" }),
    Object.freeze({ id: "computer-fundamentals", label: "计算机基础" }),
    Object.freeze({ id: "graphics", label: "图形学" })
  ]);

  const graphicsPattern = /图形学|渲染|渲染管线|shader|shading|opengl|directx|vulkan|metal|pbr|brdf|光栅化|光线追踪|ray\s*tracing|g-?buffer|framebuffer|帧缓冲|深度缓冲|模板缓冲|顶点|像素|片元|材质|纹理|贴图|采样器|mipmap|各向异性过滤|光照|阴影|法线|切线空间|透明物体|alpha|混合|抗锯齿|msaa|taa|fxaa|环境光遮蔽|ssao|剔除|遮挡查询|lod|矩阵变换|齐次坐标|坐标系|四元数|欧拉角|投影矩阵|视图矩阵|透视投影|正交投影|骨骼动画|蒙皮|mesh|网格(?:模型|渲染|顶点|索引|简化|细分)|gpu|显存|draw\s*call|compute\s*shader|计算着色器|实例化渲染|延迟渲染|前向渲染|路径追踪/iu;
  const cppPattern = /c\+\+|std::|stl|raii|constexpr|consteval|constinit|decltype|lambda|concept|coroutine|shared_ptr|unique_ptr|weak_ptr|dynamic_cast|static_cast|reinterpret_cast|const_cast|vtable|rtti|\b(?:vector|deque|list|map|unordered_map|set|unordered_set|priority_queue|string)\b|指针|引用|虚函数|虚表|多态|继承|析构|构造函数|模板|泛型|重载|重写|对象模型|内存布局|智能指针|左值|右值|移动语义|完美转发|拷贝|异常安全|内存泄漏|野指针|悬空指针|内存对齐|迭代器|分配器|空类|成员函数|友元|运算符重载|new\b|delete\b|malloc|free\b|placement new|rule of (?:three|five|zero)|sizeof/iu;

  function classify(item, answer = "") {
    const question = typeof item === "object" && item ? item.question : item;
    const prompt = String(question || "").trim();
    if (graphicsPattern.test(prompt)) return "graphics";
    if (cppPattern.test(prompt)) return "cpp";
    return "computer-fundamentals";
  }

  function summarize(items) {
    const counts = new Map(definitions.map((item) => [item.id, 0]));
    for (const item of items || []) {
      const id = classify(item);
      counts.set(id, (counts.get(id) || 0) + 1);
    }
    return definitions.map((item) => ({ ...item, count: counts.get(item.id) || 0 }));
  }

  function filter(items, selectedIds) {
    const selected = new Set(selectedIds || []);
    return (items || []).filter((item) => selected.has(item.category || classify(item)));
  }

  globalThis.QuestionCategories = Object.freeze({ definitions, classify, summarize, filter });
})();
