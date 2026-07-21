import assert from "node:assert/strict";
import test from "node:test";

import { isQuestionInScope } from "../lib/question-scope.ts";


test("keeps C++, computer fundamentals, and graphics questions", () => {
  const questions = [
    "C++ 虚函数表在多继承下如何布局？",
    "TCP 三次握手为什么不能改成两次？",
    "延迟渲染中 G-Buffer 通常保存哪些数据？",
    "一个开放世界场景中出现大量透明物体，如何优化渲染？",
    "如何设计一个支持高并发访问的缓存系统？",
  ];

  for (const question of questions) assert.equal(isQuestionInScope(question), true, question);
});

test("removes unrelated and personally framed interview questions", () => {
  const questions = [
    "你能接受项目技术栈调整吗？",
    "请介绍一下你在上一个项目中最有成就感的模块。",
    "你在项目里遇到过最棘手的 Bug 是什么？你是怎么解决的？",
    "为什么选择 Unity，而不是 UE？",
    "最近在玩什么游戏？",
    "你最喜欢的游戏是什么？为什么？",
    "你能接受从 Unity 转向 UE 或 C++ 吗？",
    "你使用过 Unity Profiler 的哪些模块？",
    "项目做过哪些性能测试？",
    "为什么投递我们公司？",
    "如果领导临时要求加班，你会怎么办？",
    "你为什么离开上一家公司？",
    "请做一下自我介绍。",
  ];

  for (const question of questions) assert.equal(isQuestionInScope(question), false, question);
});

test("uses a technical answer to rescue a terse in-scope question", () => {
  assert.equal(
    isQuestionInScope("这个机制为什么能提升性能？", "它减少了 CPU 与 GPU 之间的状态切换，并降低缓存未命中。"),
    true,
  );
});
