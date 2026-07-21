const PERSONAL_PATTERNS = [
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
  /介绍一下.{0,12}(?:你的|个人|项目经历|工作经历)/u,
];

const TECHNICAL_PATTERNS = [
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
  /gpu|显存|draw\s*call|compute\s*shader|计算着色器|批处理|实例化渲染|延迟渲染|前向渲染|路径追踪/iu,
];

export function isQuestionInScope(question: unknown, answer: unknown = ""): boolean {
  const prompt = String(question ?? "").trim();
  if (!prompt) return false;
  if (PERSONAL_PATTERNS.some((pattern) => pattern.test(prompt))) return false;
  const technicalContext = `${prompt}\n${String(answer ?? "").trim()}`;
  return TECHNICAL_PATTERNS.some((pattern) => pattern.test(technicalContext));
}
