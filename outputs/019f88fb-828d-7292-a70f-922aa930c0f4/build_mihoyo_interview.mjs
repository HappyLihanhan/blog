import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:/Users/李大爷/Documents/Blog/outputs/019f88fb-828d-7292-a70f-922aa930c0f4";
const outputPath = `${outputDir}/米哈游游戏客户端面试题_2025-2026.xlsx`;

const N1 = "https://www.nowcoder.com/feed/main/detail/55c1d633050940a988f025a5d7d78480";
const N2 = "https://www.nowcoder.com/feed/main/detail/0879d35db26b4173b5cba014d1109d2f";
const N3 = "https://www.nowcoder.com/discuss/860341579272212480";
const X1 = "https://www.xiaohongshu.com/explore/69defeb800000000220007f5";
const X2 = "https://www.xiaohongshu.com/explore/6a4fa4090000000007021c62";

const questions = [
  ["请做自我介绍，并深入说明一个 C++/游戏项目；为什么选择游戏客户端方向？", "项目经历", X1, 8],
  ["说明 C++ 中 static 的不同用法、生命周期与初始化时机。", "C++", N2, 8],
  ["指针和引用有什么区别？各自适用于哪些场景？", "C++", `${X1}\n${X2}`, 10],
  ["面向对象的三大特性是什么？", "C++", X1, 8],
  ["重载与重写有什么区别？", "C++", N2, 8],
  ["什么是多态？C++ 多态的实现原理是什么？", "C++", X1, 9],
  ["虚函数的实现机制是什么？请结合 vptr 与虚表说明。", "C++", `${N1}\n${N2}\n${N3}\n${X1}\n${X2}`, 10],
  ["虚函数表何时创建、存放在哪里？", "C++", `${N1}\n${X1}\n${X2}`, 10],
  ["对象如何找到虚函数表，并定位到要调用的具体虚函数？", "C++", X2, 8],
  ["虚函数表里除了虚函数地址，还可能包含什么信息？", "C++", X2, 7],
  ["构造函数和析构函数能否声明为虚函数？为什么？", "C++", `${N1}\n${X1}`, 9],
  ["在构造函数或析构函数中调用派生类重写的虚函数，会发生什么？", "C++", N1, 8],
  ["为什么基类析构函数通常应为虚函数？虚函数会带来哪些开销？", "C++", X1, 9],
  ["虚继承解决了什么问题？菱形继承在内存中如何布局？", "C++", `${N3}\n${X1}`, 9],
  ["左值、右值、将亡值分别是什么？右值引用和移动语义有什么作用？", "C++", `${N3}\n${X1}`, 9],
  ["i++ 与 ++i 哪个是左值、哪个是右值？", "C++", N3, 8],
  ["说明 C++ 的四种 cast 及各自适用场景。", "C++", N3, 8],
  ["模板在什么阶段确定 T 的具体类型？", "C++", N3, 8],
  ["Lambda 表达式的底层实现是什么？", "C++", N1, 9],
  ["Lambda 如何作为函数参数传递？std::function 接收 Lambda 的转换如何实现？", "C++", N1, 8],
  ["介绍常用智能指针及其所有权语义。", "C++", N1, 9],
  ["shared_ptr 退出作用域后，指向同一资源的 weak_ptr 还能否访问？", "C++", N1, 9],
  ["shared_ptr 如何分别管理资源块和引用计数控制块的释放？", "C++", N1, 9],
  ["空类对象占多少内存？为什么？", "C++", N3, 7],
  ["delete/delete[] 如何知道需要释放多少字节或多少个数组元素？", "C++", N3, 8],
  ["介绍常见 STL 容器的底层实现与线程安全性。", "C++", X2, 9],
  ["迭代器是什么？一个最小可用的迭代器需要保存和实现什么？", "C++", N2, 8],
  ["遍历数组和链表哪个更快？请从局部性、缓存命中和 cache line 分析。", "数据结构", N3, 9],
  ["哈希表最坏时间复杂度是多少？如何解决哈希冲突？", "数据结构", `${N3}\n${X2}`, 9],
  ["不依赖库，实现一个最简哈希表，并说明其冲突处理方式。", "数据结构", X2, 9],
  ["在无序数组中寻找前 K 小或第 K 大元素，分别用堆和快速选择实现并分析复杂度。", "算法", `${N2}\n${N3}`, 10],
  ["数组中除一个数外其余都出现两次，找出唯一数；若有两个或三个唯一数如何扩展？", "算法", X1, 9],
  ["删除有序链表中的重复元素。", "算法", X2, 8],
  ["图的带权最短路径还带有选择限制时，如何建模与求解？", "算法", N1, 8],
  ["操作系统如何管理内存？虚拟内存如何实现、依赖什么机制？", "操作系统", X2, 9],
  ["堆和栈有什么区别？哪些情况会造成内存泄漏？", "操作系统", X1, 9],
  ["进程与线程有什么区别？为何线程切换通常更快？哪些资源共享、哪些不共享？", "操作系统", X1, 9],
  ["多进程与多线程各适合什么场景？常见进程间通信方式有哪些？", "操作系统", `${N3}\n${X1}`, 8],
  ["多线程访问共享数据会产生什么问题？可用哪些同步方式解决？", "并发", N1, 10],
  ["原子操作是什么？C++ 内存序有哪些，分别解决什么问题？", "并发", N1, 9],
  ["自旋锁与互斥锁有什么区别？底层实现和适用场景是什么？", "并发", N3, 9],
  ["TCP 与 UDP 有何区别？游戏为何常用 UDP，如何补齐可靠、有序、拥塞和流控能力？", "网络", `${N2}\n${X1}`, 10],
  ["是否负责过完整网络协议或高并发项目？请说明设计与取舍。", "网络", X1, 8],
  ["FPS 中给定射击方向和最大偏移角，如何在锥体内生成散布并得到最终方向？", "游戏场景", `${N1}\n${N3}`, 10],
  ["设计一种结构：大量数据插入、删除、查询均为 O(1)，还可无序遍历。", "游戏场景", N1, 9],
  ["为什么链表方案可能较慢？如何用哈希表+稠密数组，通过末尾换位实现中间 O(1) 删除？", "游戏场景", N1, 9],
  ["高速实体子弹会产生什么碰撞问题？如何避免穿透？", "游戏场景", N1, 9],
  ["多人游戏只在事件发生时向其他客户端发送事件并执行，这种“事件同步”是否可行？", "游戏场景", N1, 9],
  ["网络延迟会给事件同步带来哪些问题？如何兼顾响应速度与状态一致性？", "游戏场景", N1, 10],
  ["你了解哪些设计模式？请说明在游戏客户端中的应用。", "设计模式", N3, 9],
  ["实现线程安全的单例模式，并讨论初始化与销毁问题。", "设计模式", `${N2}\n${N3}`, 9],
  ["C# 中 ref 与 out 的作用和区别是什么？", "C#", N2, 7],
  ["C# 的装箱与拆箱是什么？会带来哪些性能影响？", "C#", N2, 7],
];

const sources = [
  ["N1", "牛客", new Date("2025-10-31"), "2025游戏客户端笔面试经验贴-米哈游", N1, "面试日期 2025-10-30；含 C++、并发、游戏场景与网络同步。"],
  ["N2", "牛客", new Date("2025-07-24"), "26届米哈游秋招提前批面经（游戏客户端）已挂", N2, "26 届提前批；含 C++、C#、网络与 Top-K。"],
  ["N3", "牛客", new Date("2026-01-19"), "游戏客户端面经及经历分享", N3, "包含米哈游 Gameplay 与 UE5 在研方向。"],
  ["X1", "小红书", new Date("2026-04-15"), "米哈游游戏客户端开发实习一面面经", X1, "确认是游戏客户端实习；C++、OS、网络、算法高强度追问。"],
  ["X2", "小红书", new Date("2026-07-09"), "米哈游客户端面经", X2, "C++/客户端方向；含虚表、STL、哈希与虚拟内存。"],
];

const workbook = Workbook.create();
const main = workbook.worksheets.add("面试题汇总");
const sourceSheet = workbook.worksheets.add("来源索引");
const rubric = workbook.worksheets.add("评分说明");

for (const sheet of [main, sourceSheet, rubric]) sheet.showGridLines = false;

main.mergeCells("A1:E1");
main.getRange("A1").values = [["米哈游游戏客户端开发面试题汇总（2025–2026）"]];
main.getRange("A1:E1").format = {
  fill: "#7C3AED",
  font: { bold: true, color: "#FFFFFF", size: 18 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
main.getRange("A1:E1").format.rowHeight = 34;
main.mergeCells("A2:E2");
main.getRange("A2").formulas = [[`="共 "&COUNTA(A5:A${questions.length + 4})&" 道去重题目｜5 个来源｜得分表示复习优先级（满分 10 分）"`]];
main.getRange("A2:E2").format = {
  fill: "#F3E8FF",
  font: { color: "#5B21B6", italic: true },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
main.getRange("A4:E4").values = [["序号", "题目", "分类", "出处", "得分"]];
const rows = questions.map((q, i) => [i + 1, q[0], q[1], q[2], q[3]]);
main.getRangeByIndexes(4, 0, rows.length, 5).values = rows;
main.getRange(`A4:E${questions.length + 4}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#E5E7EB" },
  bottom: { style: "thin", color: "#D1D5DB" },
};
main.getRange("A4:E4").format = {
  fill: "#312E81",
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
main.getRange(`A5:A${questions.length + 4}`).format = { horizontalAlignment: "center", verticalAlignment: "top", numberFormat: "0" };
main.getRange(`B5:B${questions.length + 4}`).format = { wrapText: true, verticalAlignment: "top" };
main.getRange(`C5:C${questions.length + 4}`).format = { horizontalAlignment: "center", verticalAlignment: "top", fill: "#F8FAFC" };
main.getRange(`D5:D${questions.length + 4}`).format = { wrapText: true, verticalAlignment: "top", font: { color: "#1D4ED8", size: 9 } };
main.getRange(`E5:E${questions.length + 4}`).format = { horizontalAlignment: "center", verticalAlignment: "top", numberFormat: "0" };
main.getRange(`A5:E${questions.length + 4}`).format.rowHeight = 46;
main.getRange("A:A").format.columnWidth = 8;
main.getRange("B:B").format.columnWidth = 62;
main.getRange("C:C").format.columnWidth = 15;
main.getRange("D:D").format.columnWidth = 54;
main.getRange("E:E").format.columnWidth = 10;
main.freezePanes.freezeRows(4);
const questionTable = main.tables.add(`A4:E${questions.length + 4}`, true, "MihoyoQuestions");
questionTable.style = "TableStyleMedium2";

const scoreRange = main.getRange(`E5:E${questions.length + 4}`);
scoreRange.conditionalFormats.add("cellIs", { operator: "greaterThanOrEqual", formula: 9, format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } } });
scoreRange.conditionalFormats.add("cellIs", { operator: "between", formula: [8, 8], format: { fill: "#FEF3C7", font: { color: "#92400E" } } });
scoreRange.conditionalFormats.add("cellIs", { operator: "lessThanOrEqual", formula: 7, format: { fill: "#FEE2E2", font: { color: "#991B1B" } } });

sourceSheet.mergeCells("A1:F1");
sourceSheet.getRange("A1").values = [["来源索引与筛选范围"]];
sourceSheet.getRange("A1:F1").format = {
  fill: "#0F766E",
  font: { bold: true, color: "#FFFFFF", size: 17 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sourceSheet.mergeCells("A2:F2");
sourceSheet.getRange("A2").values = [["仅收录正文或评论明确确认属于米哈游游戏客户端/Gameplay/UE5 游戏方向的帖子；普通 Android、米游社社区客户端及纯题库广告已排除。"]];
sourceSheet.getRange("A2:F2").format = { fill: "#CCFBF1", font: { color: "#115E59" }, wrapText: true, verticalAlignment: "center" };
sourceSheet.getRange("A4:F4").values = [["来源ID", "平台", "日期", "帖子标题", "URL", "备注"]];
sourceSheet.getRangeByIndexes(4, 0, sources.length, 6).values = sources;
sourceSheet.getRange("A4:F4").format = { fill: "#115E59", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sourceSheet.getRange("C5:C9").format.numberFormat = "yyyy-mm-dd";
sourceSheet.getRange("A5:C9").format.horizontalAlignment = "center";
sourceSheet.getRange("D5:F9").format.wrapText = true;
sourceSheet.getRange("E5:E9").format.font = { color: "#1D4ED8", size: 9 };
sourceSheet.getRange("A5:F9").format.rowHeight = 46;
sourceSheet.getRange("A:A").format.columnWidth = 10;
sourceSheet.getRange("B:B").format.columnWidth = 12;
sourceSheet.getRange("C:C").format.columnWidth = 14;
sourceSheet.getRange("D:D").format.columnWidth = 42;
sourceSheet.getRange("E:E").format.columnWidth = 58;
sourceSheet.getRange("F:F").format.columnWidth = 42;
sourceSheet.freezePanes.freezeRows(4);
const sourceTable = sourceSheet.tables.add("A4:F9", true, "SourceIndex");
sourceTable.style = "TableStyleMedium4";

rubric.mergeCells("A1:D1");
rubric.getRange("A1").values = [["得分口径（复习优先级，而非面试答题成绩）"]];
rubric.getRange("A1:D1").format = {
  fill: "#B45309",
  font: { bold: true, color: "#FFFFFF", size: 17 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
rubric.getRange("A3:D3").values = [["分数", "优先级", "判定参考", "建议"]];
rubric.getRange("A4:D7").values = [
  [10, "最高", "多来源重复，或与游戏客户端核心场景高度相关", "必须能讲原理、权衡和实现"],
  [9, "高", "核心基础/高频追问，具有明显区分度", "准备完整答案与代码示例"],
  [8, "中高", "单一可靠来源中的常见知识点", "掌握定义、原理和常见坑"],
  [7, "补充", "岗位相关但范围较窄，或更偏语言补充", "基础掌握，按个人技术栈加深"],
];
rubric.getRange("A3:D3").format = { fill: "#92400E", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
rubric.getRange("A4:B7").format.horizontalAlignment = "center";
rubric.getRange("C4:D7").format.wrapText = true;
rubric.getRange("A4:D7").format.rowHeight = 38;
rubric.getRange("A:A").format.columnWidth = 10;
rubric.getRange("B:B").format.columnWidth = 14;
rubric.getRange("C:C").format.columnWidth = 46;
rubric.getRange("D:D").format.columnWidth = 42;
rubric.getRange("A10:D10").values = [["分类", "题目数", "平均分", "说明"]];
const categoryRows = [
  ["C++", "面向对象、内存、模板、Lambda、智能指针与 STL"],
  ["数据结构", "缓存局部性、哈希表与容器设计"],
  ["算法", "Top-K、异或、链表与最短路"],
  ["操作系统", "内存、虚拟内存、进程与线程"],
  ["并发", "同步、原子操作与内存序"],
  ["网络", "TCP/UDP 与协议设计"],
  ["游戏场景", "射击、碰撞、同步与游戏数据结构"],
  ["设计模式", "常用模式及游戏客户端落地"],
  ["项目经历", "项目深挖与岗位动机"],
  ["C#", "Unity 相关语言基础补充"],
];
rubric.getRangeByIndexes(10, 0, categoryRows.length, 1).values = categoryRows.map(r => [r[0]]);
rubric.getRangeByIndexes(10, 3, categoryRows.length, 1).values = categoryRows.map(r => [r[1]]);
for (let i = 0; i < categoryRows.length; i++) {
  const row = 11 + i;
  rubric.getRange(`B${row}`).formulas = [[`=COUNTIF('面试题汇总'!$C$5:$C$${questions.length + 4},A${row})`]];
  rubric.getRange(`C${row}`).formulas = [[`=IFERROR(AVERAGEIF('面试题汇总'!$C$5:$C$${questions.length + 4},A${row},'面试题汇总'!$E$5:$E$${questions.length + 4}),0)`]];
}
rubric.getRange("A10:D10").format = { fill: "#78350F", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
rubric.getRange("A11:C20").format.horizontalAlignment = "center";
rubric.getRange("C11:C20").format.numberFormat = "0.0";
rubric.getRange("D11:D20").format.wrapText = true;
rubric.getRange("A10:D20").format.borders = { insideHorizontal: { style: "thin", color: "#E5E7EB" } };
rubric.freezePanes.freezeRows(3);

await fs.mkdir(outputDir, { recursive: true });

const previews = [
  ["main_top.png", { sheetName: "面试题汇总", range: "A1:E31", scale: 1.1 }],
  ["main_bottom.png", { sheetName: "面试题汇总", range: `A32:E${questions.length + 4}`, scale: 1.1 }],
  ["sources.png", { sheetName: "来源索引", range: "A1:F9", scale: 1.2 }],
  ["rubric.png", { sheetName: "评分说明", range: "A1:D20", scale: 1.2 }],
];
for (const [name, options] of previews) {
  const rendered = await workbook.render({ ...options, format: "png" });
  await fs.writeFile(`${outputDir}/${name}`, new Uint8Array(await rendered.arrayBuffer()));
}

const inspection = await workbook.inspect({
  kind: "table",
  range: `面试题汇总!A1:E${questions.length + 4}`,
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 5,
  maxChars: 5000,
});
console.log(inspection.ndjson);
const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errorScan.ndjson);

const out = await SpreadsheetFile.exportXlsx(workbook);
await out.save(outputPath);
console.log(JSON.stringify({ outputPath, questionCount: questions.length, sourceCount: sources.length }));
