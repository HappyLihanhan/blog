import { strFromU8, unzipSync } from "fflate";


const MAX_XML_BYTES = 16 * 1024 * 1024;

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function textNodes(xml: string): string {
  return Array.from(
    xml.matchAll(/<(?:[A-Za-z_][\w.-]*:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z_][\w.-]*:)?t>/g),
    (match) => decodeXml(match[1]),
  ).join("");
}

function columnIndex(reference: string): number {
  const letters = reference.match(/^[A-Z]+/i)?.[0]?.toUpperCase() || "A";
  let value = 0;
  for (const letter of letters) value = value * 26 + letter.charCodeAt(0) - 64;
  return Math.max(0, value - 1);
}

function sharedStrings(xml: string): string[] {
  return Array.from(
    xml.matchAll(/<(?:[A-Za-z_][\w.-]*:)?si\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z_][\w.-]*:)?si>/g),
    (match) => textNodes(match[1]),
  );
}

function worksheetRows(xml: string, strings: string[]): string[][] {
  return Array.from(xml.matchAll(/<(?:[A-Za-z_][\w.-]*:)?row\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z_][\w.-]*:)?row>/g), (rowMatch) => {
    const row: string[] = [];
    for (const cellMatch of rowMatch[1].matchAll(/<(?:[A-Za-z_][\w.-]*:)?c\b([^>]*)>([\s\S]*?)<\/(?:[A-Za-z_][\w.-]*:)?c>/g)) {
      const attributes = cellMatch[1];
      const content = cellMatch[2];
      const reference = attributes.match(/\br="([^"]+)"/)?.[1] || "A1";
      const type = attributes.match(/\bt="([^"]+)"/)?.[1] || "n";
      const raw = content.match(/<(?:[A-Za-z_][\w.-]*:)?v\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z_][\w.-]*:)?v>/)?.[1] || "";
      let value = "";
      if (type === "s") value = strings[Number(raw)] || "";
      else if (type === "inlineStr") value = textNodes(content);
      else if (type === "b") value = raw === "1" ? "TRUE" : "FALSE";
      else value = decodeXml(raw);
      row[columnIndex(reference)] = value;
    }
    return Array.from({ length: row.length }, (_, index) => row[index] || "");
  }).filter((row) => row.some((cell) => cell.trim()));
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const source = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell.replace(/\r$/, ""));
  if (row.some((value) => value.trim())) rows.push(row);
  if (quoted) throw new Error("CSV 中存在未闭合的引号");
  return rows;
}

export async function readQuestionSheets(file: File): Promise<string[][][]> {
  const filename = file.name.toLocaleLowerCase("zh-CN");
  if (filename.endsWith(".csv")) return [parseCsv(await file.text())];
  if (!filename.endsWith(".xlsx")) throw new Error("只支持 CSV 和 XLSX 文件");

  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter(entry) {
      const wanted = entry.name === "xl/sharedStrings.xml" || /^xl\/worksheets\/sheet\d+\.xml$/.test(entry.name);
      return wanted && entry.originalSize <= MAX_XML_BYTES;
    },
  });
  const strings = archive["xl/sharedStrings.xml"]
    ? sharedStrings(strFromU8(archive["xl/sharedStrings.xml"]))
    : [];
  const worksheetNames = Object.keys(archive)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
  if (!worksheetNames.length) throw new Error("XLSX 中没有可读取的工作表");
  return worksheetNames
    .map((name) => worksheetRows(strFromU8(archive[name]), strings))
    .filter((rows) => rows.length);
}
