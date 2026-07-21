import assert from "node:assert/strict";
import test from "node:test";

import { gradeLocally, gradeWithOpenAI } from "../lib/ai-grader.ts";

const tcpQuestion = {
  id: "tcp-handshake",
  sourceId: "test",
  question: "TCP 为什么需要三次握手？",
  answer: "三次握手用于同步双方的初始序列号，并确认客户端和服务端都具备发送与接收能力，同时避免历史连接请求造成错误建连。",
};

test("the local estimator is not presented as semantic AI grading", () => {
  const result = gradeLocally(
    tcpQuestion,
    "客户端先发 SYN，服务端返回 SYN-ACK，客户端再回复 ACK。这样双方都能确认对方可以正常收发数据，也能防止旧的连接请求误建立连接。",
  );

  assert.equal(result.mode, "local");
  assert.equal(result.referenceAnswer, tcpQuestion.answer);
});

test("a fluent but unrelated answer should receive a low score", () => {
  const result = gradeLocally(
    tcpQuestion,
    "首先要分析材质和光照，然后减少 Draw Call，使用实例化渲染和遮挡剔除，最后通过 GPU Profiler 验证渲染性能是否得到提升。",
  );

  assert.ok(result.score <= 2, `expected a low score, received ${result.score}`);
  assert.equal(result.referenceAnswer, tcpQuestion.answer);
});

test("AI grading preserves the question-bank owner's reference answer", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    assert.match(request.input, new RegExp(tcpQuestion.answer));
    assert.equal("referenceAnswer" in request.text.format.schema.properties, false);
    return Response.json({
      output: [{
        content: [{
          type: "output_text",
          text: JSON.stringify({
            score: 8.8,
            summary: "核心过程和目的正确。",
            strengths: ["说明了三次报文交换和双向收发确认。"],
            improvements: ["可以补充初始序列号同步。"],
          }),
        }],
      }],
    });
  };

  const result = await gradeWithOpenAI({
    question: tcpQuestion,
    userAnswer: "客户端发 SYN，服务端回 SYN-ACK，客户端再回复 ACK。",
    apiKey: "test-key",
    model: "test-model",
    safetyIdentifier: "test-user",
  });

  assert.equal(result.mode, "ai");
  assert.equal(result.score, 8.8);
  assert.equal(result.referenceAnswer, tcpQuestion.answer);
});
