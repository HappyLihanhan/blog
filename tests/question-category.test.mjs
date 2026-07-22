import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import { classifyQuestion, summarizeQuestionCategories } from "../lib/question-category.ts";

test("GitHub Pages classifies and filters selectable sub-banks", async () => {
  const script = await readFile(new URL("../question-categories.js", import.meta.url), "utf8");
  const context = {};
  vm.runInNewContext(script, context);
  const categories = context.QuestionCategories;

  const questions = [
    { id: "cpp", question: "C++ 虚函数表如何实现动态多态？", answer: "对象通过虚表指针访问虚函数表。" },
    { id: "base", question: "TCP 为什么需要三次握手？", answer: "同步初始序列号并确认双方收发能力。" },
    { id: "graphics", question: "延迟渲染的 G-Buffer 保存哪些数据？", answer: "保存法线、材质和深度等信息。" },
    { id: "graphics-cpp", question: "如何用 C++ 优化 GPU 延迟渲染管线？", answer: "减少 Draw Call。" },
  ];

  assert.equal(categories.classify(questions[0]), "cpp");
  assert.equal(categories.classify(questions[1]), "computer-fundamentals");
  assert.equal(categories.classify(questions[2]), "graphics");
  assert.equal(categories.classify(questions[3]), "graphics");
  assert.deepEqual(
    JSON.parse(JSON.stringify(categories.summarize(questions))),
    [
      { id: "cpp", label: "C++", count: 1 },
      { id: "computer-fundamentals", label: "计算机基础", count: 1 },
      { id: "graphics", label: "图形学", count: 2 },
      { id: "game-engine", label: "游戏引擎", count: 0 },
    ],
  );
  assert.deepEqual(
    categories.filter(questions, ["cpp", "graphics"]).map((item) => item.id),
    ["cpp", "graphics", "graphics-cpp"],
  );
});

test("backend exposes the same category summary", () => {
  const questions = [
    { question: "C++ 智能指针如何管理所有权？", answer: "使用 RAII。" },
    { question: "进程和线程有什么区别？", answer: "进程拥有独立地址空间。" },
    { question: "PBR 中 BRDF 表示什么？", answer: "描述入射光与出射光的关系。" },
  ];

  assert.deepEqual(
    questions.map((item) => classifyQuestion(item.question, item.answer)),
    ["cpp", "computer-fundamentals", "graphics"],
  );
  assert.deepEqual(
    summarizeQuestionCategories(questions),
    [
      { id: "cpp", label: "C++", count: 1 },
      { id: "computer-fundamentals", label: "计算机基础", count: 1 },
      { id: "graphics", label: "图形学", count: 1 },
      { id: "game-engine", label: "游戏引擎", count: 0 },
    ],
  );
});

test("explicit and custom sub-banks override automatic classification", async () => {
  const questions = [
    { id: "forced", question: "C++ 虚函数如何实现？", answer: "通过虚表。", category: "graphics" },
    { id: "custom", question: "TCP 为什么需要三次握手？", answer: "同步序列号。", category: "mihoyo-client" },
  ];
  const customCategories = [{ id: "mihoyo-client", label: "米哈游客户端" }];
  const script = await readFile(new URL("../question-categories.js", import.meta.url), "utf8");
  const context = {};
  vm.runInNewContext(script, context);

  assert.deepEqual(
    JSON.parse(JSON.stringify(context.QuestionCategories.summarize(questions, customCategories))),
    [
      { id: "cpp", label: "C++", count: 0 },
      { id: "computer-fundamentals", label: "计算机基础", count: 0 },
      { id: "graphics", label: "图形学", count: 1 },
      { id: "game-engine", label: "游戏引擎", count: 0 },
      { id: "mihoyo-client", label: "米哈游客户端", count: 1 },
    ],
  );
  assert.deepEqual(
    summarizeQuestionCategories(questions, customCategories),
    [
      { id: "cpp", label: "C++", count: 0 },
      { id: "computer-fundamentals", label: "计算机基础", count: 0 },
      { id: "graphics", label: "图形学", count: 1 },
      { id: "game-engine", label: "游戏引擎", count: 0 },
      { id: "mihoyo-client", label: "米哈游客户端", count: 1 },
    ],
  );
});

test("classification follows the question topic instead of incidental answer words", () => {
  assert.equal(
    classifyQuestion("vector、deque、list 分别适用于什么场景？", "它们是常用容器。"),
    "cpp",
  );
  assert.equal(
    classifyQuestion("解决网格类 BFS/DFS 问题。", "输入也可以来自 mesh 网格数据。"),
    "computer-fundamentals",
  );
});

test("game-engine architecture questions stay out of computer fundamentals", async () => {
  const questions = [
    "是否可以使用统一空间索引替代每座塔的碰撞器？",
    "大量物体如何进行快速碰撞初筛？",
    "NavMeshAgent 和 Rigidbody 同时使用有什么问题？",
    "ECS 相比面向对象组件架构有什么优势？",
  ];
  const script = await readFile(new URL("../question-categories.js", import.meta.url), "utf8");
  const context = {};
  vm.runInNewContext(script, context);

  for (const question of questions) {
    assert.equal(context.QuestionCategories.classify({ question }), "game-engine");
    assert.equal(classifyQuestion(question), "game-engine");
  }
  assert.equal(classifyQuestion("虚拟地址如何转换为物理地址？"), "computer-fundamentals");
  assert.equal(classifyQuestion("四叉树、八叉树和 BVH 如何用于剔除？"), "graphics");
});
