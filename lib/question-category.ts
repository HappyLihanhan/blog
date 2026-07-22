export const QUESTION_CATEGORIES = [
  { id: "cpp", label: "C++" },
  { id: "computer-fundamentals", label: "计算机基础" },
  { id: "graphics", label: "图形学" },
  { id: "game-engine", label: "游戏引擎" },
] as const;

export type QuestionCategoryId = (typeof QUESTION_CATEGORIES)[number]["id"];
export type QuestionCategoryDefinition = { id: string; label: string };

const GRAPHICS_PATTERN = /图形学|渲染|渲染管线|shader|shading|opengl|directx|vulkan|metal|pbr|brdf|光栅化|光线追踪|ray\s*tracing|g-?buffer|framebuffer|帧缓冲|深度缓冲|模板缓冲|顶点|像素|片元|材质|纹理|贴图|采样器|mipmap|各向异性过滤|光照|阴影|法线|切线空间|透明物体|alpha|混合|抗锯齿|msaa|taa|fxaa|环境光遮蔽|ssao|剔除|遮挡查询|lod|矩阵变换|齐次坐标|坐标系|四元数|欧拉角|投影矩阵|视图矩阵|透视投影|正交投影|骨骼动画|蒙皮|\bmesh\b|网格(?:模型|渲染|顶点|索引|简化|细分)|gpu|显存|draw\s*call|compute\s*shader|计算着色器|实例化渲染|延迟渲染|前向渲染|路径追踪/iu;
const GAME_ENGINE_PATTERN = /游戏引擎|unity|unreal|ue[45]|gameobject|monobehaviour|fixedupdate|rigidbody|collider|navmesh|\becs\b|entity[ -]component[ -]system|实体组件系统|碰撞器|碰撞检测|碰撞回调|连续碰撞|碰撞初筛|空间索引|空间哈希|四叉树|八叉树|\bbvh\b|k-?d[ -]?tree|场景树|场景图|游戏循环|固定时间步|逻辑帧|对象池|寻路|行为树|动画状态机|assetbundle|addressables|资源热更新|lua\s*热更|帧同步/iu;
const CPP_PATTERN = /c\+\+|std::|stl|raii|constexpr|consteval|constinit|decltype|lambda|concept|coroutine|shared_ptr|unique_ptr|weak_ptr|dynamic_cast|static_cast|reinterpret_cast|const_cast|vtable|rtti|\b(?:vector|deque|list|map|unordered_map|set|unordered_set|priority_queue|string)\b|指针|引用|虚函数|虚表|多态|继承|析构|构造函数|模板|泛型|重载|重写|对象模型|内存布局|智能指针|左值|右值|移动语义|完美转发|拷贝|异常安全|内存泄漏|野指针|悬空指针|内存对齐|迭代器|分配器|空类|成员函数|友元|运算符重载|new\b|delete\b|malloc|free\b|placement new|rule of (?:three|five|zero)|sizeof/iu;

export function classifyQuestion(question: unknown, answer: unknown = ""): QuestionCategoryId {
  const prompt = String(question ?? "").trim();
  if (GRAPHICS_PATTERN.test(prompt)) return "graphics";
  if (GAME_ENGINE_PATTERN.test(prompt)) return "game-engine";
  if (CPP_PATTERN.test(prompt)) return "cpp";
  return "computer-fundamentals";
}

export function questionCategoryDefinitions(
  extra: QuestionCategoryDefinition[] = [],
): QuestionCategoryDefinition[] {
  const definitions: QuestionCategoryDefinition[] = [...QUESTION_CATEGORIES];
  const ids = new Set(definitions.map((item) => item.id));
  for (const item of extra) {
    const id = String(item?.id ?? "").trim();
    const label = String(item?.label ?? "").trim();
    if (!id || !label || ids.has(id)) continue;
    definitions.push({ id, label });
    ids.add(id);
  }
  return definitions;
}

export function resolveQuestionCategory(item: {
  question?: unknown;
  answer?: unknown;
  category?: unknown;
}): string {
  const explicit = String(item?.category ?? "").trim();
  return explicit || classifyQuestion(item?.question, item?.answer);
}

export function summarizeQuestionCategories(
  questions: Array<{ question?: unknown; answer?: unknown; category?: unknown }>,
  extra: QuestionCategoryDefinition[] = [],
): Array<{ id: string; label: string; count: number }> {
  const definitions = questionCategoryDefinitions(extra);
  const counts = new Map<string, number>(definitions.map((item) => [item.id, 0]));
  for (const item of questions) {
    const id = resolveQuestionCategory(item);
    if (counts.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return definitions.map((item) => ({ ...item, count: counts.get(item.id) ?? 0 }));
}
