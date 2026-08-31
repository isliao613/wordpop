/* tools/fetch-bopomofo-strokes.mjs — 產生 src/bopomofoStrokes.js
 *
 * 用法：node tools/fetch-bopomofo-strokes.mjs
 *
 * 從 g0v/zh-stroke-data 取得 37 個注音符號的筆順資料(原始來源為教育部
 * 「常用國字標準字體筆順學習網」),轉成本專案用的 0–100 座標系:
 *   strokes  = 每一筆的中心線(track),用來判定筆順與方向
 *   outlines = 每一筆的字形輪廓(SVG path),用來畫出精準的描寫底圖
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://raw.githubusercontent.com/g0v/zh-stroke-data/master/json';
// 教學順序(注音符號表):21 聲符 + 3 介符 + 13 韻符
const ORDER = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ'.split('');

const EM = 2048;                 // 原始座標系(y 向下)
const S = 100 / EM;              // → 0–100
const r1 = (v) => Math.round(v * S * 10) / 10;

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const out = {};
for (const ch of ORDER) {
  const cp = ch.codePointAt(0).toString(16);
  const data = await getJSON(`${BASE}/${cp}.json`);
  out[ch] = {
    strokes: data.map((s) => s.track.map((p) => [r1(p.x), r1(p.y)])),
    outlines: data.map((s) => {
      let d = '';
      for (const p of s.outline) {
        if (p.type === 'M') d += `M${r1(p.x)} ${r1(p.y)}`;
        else if (p.type === 'L') d += `L${r1(p.x)} ${r1(p.y)}`;
        else if (p.type === 'Q') d += `Q${r1(p.begin.x)} ${r1(p.begin.y)} ${r1(p.end.x)} ${r1(p.end.y)}`;
      }
      return d + 'Z';
    }),
  };
  console.log(`✅ ${ch}  ${out[ch].strokes.length} 畫`);
}

const header = `// 注音符號筆順資料(中心線 track + 字形輪廓 outline),座標系 0–100
//
// 資料來源:教育部「常用國字標準字體筆順學習網」
//   http://stroke-order.learningweb.moe.edu.tw
//   經由 g0v/zh-stroke-data 取得:https://github.com/g0v/zh-stroke-data
//
// 著作權:「筆順學習網」著作權為中華民國教育部所有,目的為提供標準楷體字之
// 筆順教學利用,不得用於商業用途。本檔案為非營利教育目的使用,
// 不適用本專案其餘部分的 MIT 授權。
//
// 本檔案由 tools/fetch-bopomofo-strokes.mjs 產生,請勿手動編輯。

`;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(join(root, 'src/bopomofoStrokes.js'), header + `export const BOPO_STROKES = ${JSON.stringify(out)};\n`);
console.log(`\n寫入 src/bopomofoStrokes.js(${ORDER.length} 個符號)`);
