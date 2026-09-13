import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BOPO_STROKES } from "./bopomofoStrokes.js";
import { t, tf, LANG, setLang } from "./i18n.js";

// ---------- 單字庫(大班程度・約 200 字)----------
const WORD_BANK = {
  "動物 Animals": [
    { en: "cat", zh: "貓", emoji: "🐱" },
    { en: "dog", zh: "狗", emoji: "🐶" },
    { en: "elephant", zh: "大象", emoji: "🐘" },
    { en: "penguin", zh: "企鵝", emoji: "🐧" },
    { en: "butterfly", zh: "蝴蝶", emoji: "🦋" },
    { en: "turtle", zh: "烏龜", emoji: "🐢" },
    { en: "lion", zh: "獅子", emoji: "🦁" },
    { en: "rabbit", zh: "兔子", emoji: "🐰" },
    { en: "monkey", zh: "猴子", emoji: "🐵" },
    { en: "bear", zh: "熊", emoji: "🐻" },
    { en: "fish", zh: "魚", emoji: "🐟" },
    { en: "bird", zh: "鳥", emoji: "🐦" },
    { en: "horse", zh: "馬", emoji: "🐴" },
    { en: "tiger", zh: "老虎", emoji: "🐯" },
    { en: "panda", zh: "貓熊", emoji: "🐼" },
    { en: "sheep", zh: "綿羊", emoji: "🐑" },
    { en: "duck", zh: "鴨子", emoji: "🦆" },
    { en: "chicken", zh: "雞", emoji: "🐔" },
    { en: "cow", zh: "牛", emoji: "🐮" },
    { en: "pig", zh: "豬", emoji: "🐷" },
    { en: "frog", zh: "青蛙", emoji: "🐸" },
    { en: "bee", zh: "蜜蜂", emoji: "🐝" },
    { en: "ant", zh: "螞蟻", emoji: "🐜" },
    { en: "snake", zh: "蛇", emoji: "🐍" },
    { en: "whale", zh: "鯨魚", emoji: "🐳" },
    { en: "dolphin", zh: "海豚", emoji: "🐬" },
    { en: "shark", zh: "鯊魚", emoji: "🦈" },
    { en: "octopus", zh: "章魚", emoji: "🐙" },
    { en: "owl", zh: "貓頭鷹", emoji: "🦉" },
    { en: "fox", zh: "狐狸", emoji: "🦊" },
    { en: "zebra", zh: "斑馬", emoji: "🦓" },
    { en: "giraffe", zh: "長頸鹿", emoji: "🦒" },
  ],
  "水果 Fruits": [
    { en: "apple", zh: "蘋果", emoji: "🍎" },
    { en: "banana", zh: "香蕉", emoji: "🍌" },
    { en: "strawberry", zh: "草莓", emoji: "🍓" },
    { en: "watermelon", zh: "西瓜", emoji: "🍉" },
    { en: "grapes", zh: "葡萄", emoji: "🍇" },
    { en: "orange", zh: "柳橙", emoji: "🍊" },
    { en: "peach", zh: "桃子", emoji: "🍑" },
    { en: "pear", zh: "梨子", emoji: "🍐" },
    { en: "lemon", zh: "檸檬", emoji: "🍋" },
    { en: "mango", zh: "芒果", emoji: "🥭" },
    { en: "pineapple", zh: "鳳梨", emoji: "🍍" },
    { en: "cherry", zh: "櫻桃", emoji: "🍒" },
  ],
  "食物 Food": [
    { en: "pizza", zh: "披薩", emoji: "🍕" },
    { en: "hamburger", zh: "漢堡", emoji: "🍔" },
    { en: "cookie", zh: "餅乾", emoji: "🍪" },
    { en: "noodles", zh: "麵條", emoji: "🍜" },
    { en: "egg", zh: "蛋", emoji: "🥚" },
    { en: "bread", zh: "麵包", emoji: "🍞" },
    { en: "rice", zh: "米飯", emoji: "🍚" },
    { en: "cake", zh: "蛋糕", emoji: "🎂" },
    { en: "milk", zh: "牛奶", emoji: "🥛" },
    { en: "ice cream", zh: "冰淇淋", emoji: "🍦" },
    { en: "candy", zh: "糖果", emoji: "🍬" },
    { en: "chocolate", zh: "巧克力", emoji: "🍫" },
    { en: "juice", zh: "果汁", emoji: "🧃" },
    { en: "water", zh: "水", emoji: "💧" },
    { en: "cheese", zh: "起司", emoji: "🧀" },
    { en: "hot dog", zh: "熱狗", emoji: "🌭" },
  ],
  "顏色 Colors": [
    { en: "red", zh: "紅色", emoji: "🔴" },
    { en: "blue", zh: "藍色", emoji: "🔵" },
    { en: "yellow", zh: "黃色", emoji: "🟡" },
    { en: "green", zh: "綠色", emoji: "🟢" },
    { en: "purple", zh: "紫色", emoji: "🟣" },
    { en: "orange color", zh: "橘色", emoji: "🟠" },
    { en: "black", zh: "黑色", emoji: "⚫" },
    { en: "white", zh: "白色", emoji: "⚪" },
    { en: "pink", zh: "粉紅色", emoji: "🎀" },
    { en: "brown", zh: "棕色", emoji: "🟤" },
  ],
  "數字 Numbers": [
    { en: "one", zh: "一", emoji: "1️⃣" },
    { en: "two", zh: "二", emoji: "2️⃣" },
    { en: "three", zh: "三", emoji: "3️⃣" },
    { en: "four", zh: "四", emoji: "4️⃣" },
    { en: "five", zh: "五", emoji: "5️⃣" },
    { en: "six", zh: "六", emoji: "6️⃣" },
    { en: "seven", zh: "七", emoji: "7️⃣" },
    { en: "eight", zh: "八", emoji: "8️⃣" },
    { en: "nine", zh: "九", emoji: "9️⃣" },
    { en: "ten", zh: "十", emoji: "🔟" },
  ],
  "形狀 Shapes": [
    { en: "circle", zh: "圓形", emoji: "⭕" },
    { en: "square", zh: "正方形", emoji: "🟦" },
    { en: "triangle", zh: "三角形", emoji: "🔺" },
    { en: "heart", zh: "愛心", emoji: "❤️" },
    { en: "diamond", zh: "菱形", emoji: "🔷" },
    { en: "rectangle", zh: "長方形", emoji: "▬" },
  ],
  "身體 Body": [
    { en: "eye", zh: "眼睛", emoji: "👁️" },
    { en: "ear", zh: "耳朵", emoji: "👂" },
    { en: "nose", zh: "鼻子", emoji: "👃" },
    { en: "mouth", zh: "嘴巴", emoji: "👄" },
    { en: "hand", zh: "手", emoji: "✋" },
    { en: "foot", zh: "腳", emoji: "🦶" },
    { en: "teeth", zh: "牙齒", emoji: "🦷" },
    { en: "leg", zh: "腿", emoji: "🦵" },
    { en: "arm", zh: "手臂", emoji: "💪" },
    { en: "head", zh: "頭", emoji: "🙂" },
    { en: "hair", zh: "頭髮", emoji: "💇" },
    { en: "finger", zh: "手指", emoji: "☝️" },
    { en: "knee", zh: "膝蓋", emoji: "🧎" },
    { en: "face", zh: "臉", emoji: "😊" },
  ],
  "家人與朋友 People": [
    { en: "mom", zh: "媽媽", emoji: "👩" },
    { en: "dad", zh: "爸爸", emoji: "👨" },
    { en: "brother", zh: "兄弟", emoji: "👦" },
    { en: "sister", zh: "姊妹", emoji: "👧" },
    { en: "baby", zh: "寶寶", emoji: "👶" },
    { en: "grandma", zh: "奶奶", emoji: "👵" },
    { en: "grandpa", zh: "爺爺", emoji: "👴" },
    { en: "family", zh: "家庭", emoji: "👨‍👩‍👧‍👦" },
    { en: "boy", zh: "男孩", emoji: "🧒" },
    { en: "girl", zh: "女孩", emoji: "👧" },
    { en: "friend", zh: "朋友", emoji: "🤝" },
    { en: "teacher", zh: "老師", emoji: "🧑‍🏫" },
  ],
  "衣服 Clothes": [
    { en: "shirt", zh: "上衣", emoji: "👕" },
    { en: "pants", zh: "褲子", emoji: "👖" },
    { en: "dress", zh: "洋裝", emoji: "👗" },
    { en: "shoes", zh: "鞋子", emoji: "👟" },
    { en: "socks", zh: "襪子", emoji: "🧦" },
    { en: "hat", zh: "帽子", emoji: "🧢" },
    { en: "jacket", zh: "外套", emoji: "🧥" },
    { en: "skirt", zh: "裙子", emoji: "🩳" },
    { en: "gloves", zh: "手套", emoji: "🧤" },
    { en: "scarf", zh: "圍巾", emoji: "🧣" },
  ],
  "交通 Transport": [
    { en: "car", zh: "汽車", emoji: "🚗" },
    { en: "bus", zh: "公車", emoji: "🚌" },
    { en: "train", zh: "火車", emoji: "🚆" },
    { en: "airplane", zh: "飛機", emoji: "✈️" },
    { en: "bicycle", zh: "腳踏車", emoji: "🚲" },
    { en: "boat", zh: "船", emoji: "⛵" },
    { en: "truck", zh: "卡車", emoji: "🚚" },
    { en: "taxi", zh: "計程車", emoji: "🚕" },
    { en: "motorcycle", zh: "機車", emoji: "🏍️" },
    { en: "helicopter", zh: "直升機", emoji: "🚁" },
    { en: "rocket", zh: "火箭", emoji: "🚀" },
    { en: "ship", zh: "大船", emoji: "🚢" },
  ],
  "學校 School": [
    { en: "school", zh: "學校", emoji: "🏫" },
    { en: "book", zh: "書", emoji: "📖" },
    { en: "pencil", zh: "鉛筆", emoji: "✏️" },
    { en: "pen", zh: "原子筆", emoji: "🖊️" },
    { en: "crayon", zh: "蠟筆", emoji: "🖍️" },
    { en: "bag", zh: "書包", emoji: "🎒" },
    { en: "scissors", zh: "剪刀", emoji: "✂️" },
    { en: "paper", zh: "紙", emoji: "📄" },
    { en: "glue", zh: "膠水", emoji: "🧴" },
    { en: "ruler", zh: "尺", emoji: "📏" },
    { en: "eraser", zh: "橡皮擦", emoji: "🩹" },
    { en: "desk", zh: "書桌", emoji: "🪵" },
  ],
  "居家 Home": [
    { en: "chair", zh: "椅子", emoji: "🪑" },
    { en: "table", zh: "桌子", emoji: "🛋️" },
    { en: "bed", zh: "床", emoji: "🛏️" },
    { en: "door", zh: "門", emoji: "🚪" },
    { en: "window", zh: "窗戶", emoji: "🪟" },
    { en: "cup", zh: "杯子", emoji: "🥤" },
    { en: "box", zh: "盒子", emoji: "📦" },
    { en: "clock", zh: "時鐘", emoji: "⏰" },
    { en: "key", zh: "鑰匙", emoji: "🔑" },
    { en: "phone", zh: "電話", emoji: "📱" },
    { en: "umbrella", zh: "雨傘", emoji: "☂️" },
    { en: "lamp", zh: "檯燈", emoji: "💡" },
  ],
  "自然 Nature": [
    { en: "sun", zh: "太陽", emoji: "☀️" },
    { en: "moon", zh: "月亮", emoji: "🌙" },
    { en: "star", zh: "星星", emoji: "⭐" },
    { en: "tree", zh: "樹", emoji: "🌳" },
    { en: "flower", zh: "花", emoji: "🌸" },
    { en: "rainbow", zh: "彩虹", emoji: "🌈" },
    { en: "cloud", zh: "雲", emoji: "☁️" },
    { en: "mountain", zh: "山", emoji: "⛰️" },
    { en: "sea", zh: "海", emoji: "🌊" },
    { en: "fire", zh: "火", emoji: "🔥" },
    { en: "leaf", zh: "葉子", emoji: "🍃" },
    { en: "grass", zh: "草", emoji: "🌱" },
    { en: "sky", zh: "天空", emoji: "🌤️" },
    { en: "beach", zh: "海灘", emoji: "🏖️" },
  ],
  "天氣 Weather": [
    { en: "sunny", zh: "晴天", emoji: "😎" },
    { en: "rainy", zh: "下雨", emoji: "🌧️" },
    { en: "cloudy", zh: "多雲", emoji: "⛅" },
    { en: "windy", zh: "颳風", emoji: "🌬️" },
    { en: "snowy", zh: "下雪", emoji: "❄️" },
    { en: "hot", zh: "熱", emoji: "🥵" },
    { en: "cold", zh: "冷", emoji: "🥶" },
    { en: "rain", zh: "雨", emoji: "☔" },
  ],
  "動作 Actions": [
    { en: "run", zh: "跑", emoji: "🏃" },
    { en: "jump", zh: "跳", emoji: "🦘" },
    { en: "walk", zh: "走路", emoji: "🚶" },
    { en: "swim", zh: "游泳", emoji: "🏊" },
    { en: "dance", zh: "跳舞", emoji: "💃" },
    { en: "sing", zh: "唱歌", emoji: "🎤" },
    { en: "eat", zh: "吃", emoji: "🍽️" },
    { en: "drink", zh: "喝", emoji: "🥤" },
    { en: "sleep", zh: "睡覺", emoji: "😴" },
    { en: "read", zh: "閱讀", emoji: "📚" },
    { en: "write", zh: "寫字", emoji: "✍️" },
    { en: "draw", zh: "畫畫", emoji: "🎨" },
    { en: "play", zh: "玩", emoji: "🤸" },
    { en: "clap", zh: "拍手", emoji: "👏" },
    { en: "smile", zh: "微笑", emoji: "😄" },
    { en: "cry", zh: "哭", emoji: "😢" },
    { en: "fly", zh: "飛", emoji: "🕊️" },
    { en: "climb", zh: "爬", emoji: "🧗" },
    { en: "throw", zh: "丟", emoji: "🤾" },
    { en: "catch", zh: "接住", emoji: "🧤" },
  ],
  "生活動詞 Daily Verbs": [
    { en: "open", zh: "打開", emoji: "📭" },
    { en: "close", zh: "關上", emoji: "📪" },
    { en: "sit", zh: "坐下", emoji: "💺" },
    { en: "stand", zh: "站立", emoji: "🧍" },
    { en: "wash", zh: "洗", emoji: "🧼" },
    { en: "brush", zh: "刷(牙)", emoji: "🪥" },
    { en: "look", zh: "看", emoji: "👀" },
    { en: "listen", zh: "聽", emoji: "🎧" },
    { en: "go", zh: "走/出發", emoji: "🚦" },
    { en: "stop", zh: "停", emoji: "🛑" },
    { en: "come", zh: "過來", emoji: "🫱" },
    { en: "give", zh: "給", emoji: "🎁" },
    { en: "push", zh: "推", emoji: "🛒" },
    { en: "pull", zh: "拉", emoji: "🪢" },
    { en: "ride", zh: "騎", emoji: "🏇" },
    { en: "hug", zh: "擁抱", emoji: "🤗" },
    { en: "wave", zh: "揮手", emoji: "👋" },
    { en: "count", zh: "數數", emoji: "🔢" },
    { en: "cut", zh: "剪/切", emoji: "🔪" },
    { en: "wear", zh: "穿", emoji: "🥼" },
  ],
  "方位介詞 Prepositions": [
    { en: "in", zh: "在裡面", emoji: "📥" },
    { en: "out", zh: "在外面", emoji: "📤" },
    { en: "on", zh: "在上面", emoji: "🔝" },
    { en: "under", zh: "在下面", emoji: "⤵️" },
    { en: "up", zh: "向上", emoji: "⬆️" },
    { en: "down", zh: "向下", emoji: "⬇️" },
    { en: "in front of", zh: "在前面", emoji: "▶️" },
    { en: "behind", zh: "在後面", emoji: "◀️" },
    { en: "next to", zh: "在旁邊", emoji: "↔️" },
    { en: "between", zh: "在中間", emoji: "⏸️" },
    { en: "here", zh: "這裡", emoji: "📍" },
    { en: "there", zh: "那裡", emoji: "🗺️" },
  ],
  "心情 Feelings": [
    { en: "happy", zh: "開心", emoji: "😀" },
    { en: "sad", zh: "難過", emoji: "😞" },
    { en: "angry", zh: "生氣", emoji: "😠" },
    { en: "tired", zh: "累", emoji: "🥱" },
    { en: "hungry", zh: "餓", emoji: "😋" },
    { en: "thirsty", zh: "渴", emoji: "🚰" },
    { en: "scared", zh: "害怕", emoji: "😱" },
    { en: "excited", zh: "興奮", emoji: "🤩" },
  ],
  "玩具 Toys": [
    { en: "toy", zh: "玩具", emoji: "🧸" },
    { en: "doll", zh: "娃娃", emoji: "🪆" },
    { en: "robot", zh: "機器人", emoji: "🤖" },
    { en: "kite", zh: "風箏", emoji: "🪁" },
    { en: "balloon", zh: "氣球", emoji: "🎈" },
    { en: "blocks", zh: "積木", emoji: "🧱" },
    { en: "puzzle", zh: "拼圖", emoji: "🧩" },
    { en: "ball", zh: "球", emoji: "⚽" },
    { en: "guitar", zh: "吉他", emoji: "🎸" },
    { en: "drum", zh: "鼓", emoji: "🥁" },
  ],
};

const CATEGORIES = Object.keys(WORD_BANK);
const ALL_WORDS = CATEGORIES.flatMap((c) => WORD_BANK[c]);

// ---------- 字節庫(Word Families / Phonics)----------
const PHONICS = {
  "a 短母音": [
    { s: "ab", ex: ["cab", "lab", "tab"] },
    { s: "ack", ex: ["back", "pack", "snack"] },
    { s: "ad", ex: ["dad", "sad", "mad"] },
    { s: "ag", ex: ["bag", "flag", "tag"] },
    { s: "am", ex: ["ham", "jam", "swam"] },
    { s: "an", ex: ["can", "fan", "man"] },
    { s: "ank", ex: ["bank", "thank", "drank"] },
    { s: "ap", ex: ["cap", "map", "clap"] },
    { s: "ash", ex: ["cash", "flash", "trash"] },
    { s: "at", ex: ["cat", "hat", "bat"] },
  ],
  "e 短母音": [
    { s: "ed", ex: ["bed", "red", "fed"] },
    { s: "eg", ex: ["leg", "beg", "peg"] },
    { s: "ell", ex: ["bell", "tell", "shell"] },
    { s: "en", ex: ["ten", "hen", "pen"] },
    { s: "est", ex: ["best", "nest", "rest"] },
    { s: "et", ex: ["net", "pet", "wet"] },
  ],
  "i 短母音": [
    { s: "ib", ex: ["bib", "rib", "crib"] },
    { s: "ick", ex: ["kick", "pick", "stick"] },
    { s: "id", ex: ["kid", "lid", "hid"] },
    { s: "ig", ex: ["big", "pig", "dig"] },
    { s: "ill", ex: ["hill", "will", "still"] },
    { s: "im", ex: ["him", "swim", "slim"] },
    { s: "in", ex: ["pin", "win", "thin"] },
    { s: "ing", ex: ["king", "ring", "sing"] },
    { s: "ink", ex: ["pink", "drink", "think"] },
    { s: "ip", ex: ["lip", "ship", "trip"] },
    { s: "it", ex: ["sit", "hit", "fit"] },
  ],
  "o 短母音": [
    { s: "ob", ex: ["job", "rob", "sob"] },
    { s: "ock", ex: ["rock", "sock", "clock"] },
    { s: "og", ex: ["dog", "log", "frog"] },
    { s: "op", ex: ["top", "hop", "stop"] },
    { s: "ot", ex: ["hot", "pot", "not"] },
  ],
  "u 短母音": [
    { s: "ub", ex: ["cub", "tub", "club"] },
    { s: "uck", ex: ["duck", "luck", "truck"] },
    { s: "ug", ex: ["bug", "hug", "rug"] },
    { s: "um", ex: ["gum", "drum", "sum"] },
    { s: "un", ex: ["sun", "run", "fun"] },
    { s: "up", ex: ["up", "cup", "pup"] },
    { s: "ut", ex: ["cut", "nut", "shut"] },
  ],
};
const PHONICS_GROUPS = Object.keys(PHONICS);

// ---------- Sight Words(Dolch 常見字・大班必讀)----------
const SIGHT_WORDS = [
  "I", "a", "the", "to", "and", "see", "like", "can", "go", "we",
  "my", "you", "it", "is", "in", "said", "me", "look", "up", "down",
  "big", "little", "red", "blue", "one", "two", "come", "here", "play", "run",
  "funny", "jump", "find", "for", "make", "not", "where", "yes", "no", "she",
  "he", "at", "am", "do", "did", "get", "good", "have", "this", "want",
];

// 版號:每次更新往上跳(顯示在首頁底部,方便確認手機拿到最新版)
// 日期由 Vite 建置時自動戳上(見 vite.config.js 的 __BUILD_DATE__)
const APP_VERSION = "v1.34";
const BUILD_DATE = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : "";

// ---------- 設計 tokens ----------
const T = {
  bg: "#F3F0FF",
  card: "#FFFFFF",
  ink: "#3D3A5C",
  sub: "#8B87AD",
  purple: "#6C5CE7",
  purpleDark: "#4B3DBF",
  yellow: "#FFD93D",
  yellowDark: "#E0B400",
  pink: "#FF6B9D",
  green: "#4ECB71",
  greenDark: "#2FA353",
  red: "#FF7675",
};

// ---------- 發音(真人優先,合成備援)----------
const SPEAKABLE_RE = /^[a-z]+(?:[ -][a-z]+){0,2}$/i; // 單字或 2~3 字的複合詞

// iOS(含 iPhone 上的 Chrome,底層都是 WebKit):
// Web Audio 會被實體靜音鍵消音,但 <audio> 媒體播放不會,
// 所以 iOS 上真人音檔一律改用祝福過的 Audio 元件播
const IS_IOS =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

// 把「修剪 + 音量正規化 + 淡入淡出」直接烘進 16-bit WAV(blob URL)
// iOS 用祝福元件播這個乾淨檔案:無即時音訊管線 → 無毛刺,且不受靜音鍵影響
function encodeNormalizedWav(buf, gain, start, dur) {
  const sr = buf.sampleRate;
  const s0 = Math.max(0, Math.floor(start * sr));
  const n = Math.max(1, Math.min(buf.length - s0, Math.floor(dur * sr)));
  const chs = [];
  for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
  const out = new Int16Array(n);
  const fi = Math.floor(0.015 * sr);
  const fo = Math.floor(0.045 * sr);
  for (let i = 0; i < n; i++) {
    let v = 0;
    for (const ch of chs) v += ch[s0 + i] || 0;
    v = (v / chs.length) * gain;
    if (i < fi) v *= i / fi;
    if (i > n - fo) v *= Math.max(0, (n - i) / fo);
    out[i] = Math.round(Math.max(-1, Math.min(1, v)) * 32767);
  }
  const bytes = new Uint8Array(44 + n * 2);
  const dv = new DataView(bytes.buffer);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) bytes[o + i] = s.charCodeAt(i); };
  w(0, "RIFF"); dv.setUint32(4, 36 + n * 2, true); w(8, "WAVE");
  w(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true);
  dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  w(36, "data"); dv.setUint32(40, n * 2, true);
  new Uint8Array(bytes.buffer, 44).set(new Uint8Array(out.buffer));
  return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
}

// 產生一小段靜音 WAV(data URI),用來在手勢當下「祝福」Audio 元件
// (iOS 規定:元件要在手勢裡播過一次,之後才能由程式播放)
function makeSilentWavURI() {
  const n = 256, sr = 22050;
  const b = new Uint8Array(44 + n * 2);
  const dv = new DataView(b.buffer);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) b[o + i] = s.charCodeAt(i); };
  w(0, "RIFF"); dv.setUint32(4, 36 + n * 2, true); w(8, "WAVE");
  w(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true);
  dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  w(36, "data"); dv.setUint32(40, n * 2, true);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return "data:audio/wav;base64," + btoa(s);
}

const AUDIO_CACHE_KEY = "wordpop-audio-cache";
function loadAudioCache() {
  try {
    const o = JSON.parse(localStorage.getItem(AUDIO_CACHE_KEY) || "{}");
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function useSpeech() {
  const voiceRef = useRef(null);
  const zhVoiceRef = useRef(null); // 中文(台灣)語音,注音遊戲用
  // word -> 音檔 URL 或 null(查過但沒有);從 localStorage 載入,跨造訪重用免重打 API
  const cacheRef = useRef(null);
  if (cacheRef.current === null) cacheRef.current = loadAudioCache();
  const saveTimerRef = useRef(0);
  const pendingRef = useRef({});   // word -> 查詢中的 Promise(避免重複查)
  const buffersRef = useRef({});   // url -> { buf, gain } 解碼後音訊 + 正規化增益
  const bufPendingRef = useRef({}); // url -> 下載解碼中的 Promise
  const ctxRef = useRef(null);     // AudioContext(懶建立,解碼與非 iOS 播放用)
  const srcRef = useRef(null);     // 正在播的 BufferSource
  const blessedRef = useRef(null); // 手勢裡祝福過的共用 Audio 元件(iOS 播放用)
  const audioRef = useRef(null);

  useEffect(() => {
    const pick = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      const en = vs.filter((v) => v.lang && v.lang.startsWith("en"));
      // 句子只能合成,盡量挑裝置上最自然的聲音
      voiceRef.current =
        en.find((v) => v.lang === "en-US" && /natural|neural|premium|enhanced/i.test(v.name)) ||
        en.find((v) => /natural|neural|premium|enhanced/i.test(v.name)) ||
        en.find((v) => v.name === "Google US English") ||
        en.find((v) => /samantha|aria|jenny/i.test(v.name)) ||
        en.find((v) => v.lang === "en-US" && v.localService) ||
        en.find((v) => v.lang === "en-US") ||
        en[0] ||
        null;
      // 注音遊戲用中文(台灣)語音;找不到 zh-TW 就退而求其次用其他中文
      const zh = vs.filter((v) => v.lang && /^zh/i.test(v.lang.replace("_", "-")));
      const isTW = (v) => /zh[-_]TW|Hant|Taiwan/i.test(v.lang + " " + v.name);
      zhVoiceRef.current =
        zh.find((v) => isTW(v) && /natural|neural|premium|enhanced/i.test(v.name)) ||
        zh.find((v) => isTW(v)) ||
        zh.find((v) => /natural|neural|premium|enhanced/i.test(v.name)) ||
        zh[0] ||
        null;
    };
    pick();
    window.speechSynthesis?.addEventListener("voiceschanged", pick);
    // 頁面切走/關閉前把音檔快取補存一次
    const flush = () => {
      if (document.visibilityState === "hidden") {
        try { localStorage.setItem(AUDIO_CACHE_KEY, JSON.stringify(cacheRef.current)); } catch { /* ignore */ }
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", pick);
      document.removeEventListener("visibilitychange", flush);
    };
  }, []);

  const ttsSpeak = useCallback((text, { rate = 0.85, onEnd, lang } = {}) => {
    const ss = window.speechSynthesis;
    if (!ss) return;
    if (ss.speaking || ss.pending) ss.cancel();
    const zh = lang && /^zh/i.test(lang);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = zh ? (zhVoiceRef.current?.lang || "zh-TW") : "en-US";
    u.rate = rate;
    u.volume = 1;
    const v = zh ? zhVoiceRef.current : voiceRef.current;
    if (v) u.voice = v;
    if (onEnd) u.onend = onEnd;
    ss.speak(u);
    try { ss.resume(); } catch { /* 部分瀏覽器 cancel 後會卡 paused */ }
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  // iOS/行動瀏覽器要在「手勢當下」同步解鎖 AudioContext,
  // 之後經過網路查詢的 async 播放才不會被擋
  useEffect(() => {
    const unlock = () => {
      const ctx = getCtx();
      if (ctx && ctx.state !== "running") {
        ctx.resume().catch(() => { /* 解不開就算了,播放時會走備援 */ });
        try {
          // 播一格靜音徹底解鎖
          const b = ctx.createBuffer(1, 1, 22050);
          const s = ctx.createBufferSource();
          s.buffer = b;
          s.connect(ctx.destination);
          s.start(0);
        } catch { /* ignore */ }
      }
      // 手勢裡祝福一個共用 Audio 元件:播一小段靜音,
      // 之後就算經過網路 async,iOS 也允許它由程式播放
      if (!blessedRef.current) {
        try {
          const a = new Audio(makeSilentWavURI());
          a.play().then(() => a.pause()).catch(() => {});
          blessedRef.current = a;
        } catch { /* ignore */ }
      }
      // 部分瀏覽器 cancel 後合成引擎會卡在 paused
      try { window.speechSynthesis?.resume?.(); } catch { /* ignore */ }
    };
    window.addEventListener("pointerdown", unlock, { capture: true });
    return () => window.removeEventListener("pointerdown", unlock, { capture: true });
  }, [getCtx]);

  // 下載 + 解碼音檔,量測響度並算出正規化增益(讓真人音檔和合成音一樣大聲)
  // 下載限時 2 秒,超時回 null(播放層會走備援),同網址不重複下載
  const loadBuffer = useCallback((url) => {
    if (buffersRef.current[url]) return Promise.resolve(buffersRef.current[url]);
    if (bufPendingRef.current[url]) return bufPendingRef.current[url];
    const p = (async () => {
      const ctx = getCtx();
      if (!ctx) return null;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) return null;
        const raw = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(raw);
        const data = buf.getChannelData(0);
        const sr = buf.sampleRate;
        // 剪掉頭尾的靜音/底噪(正規化會放大尾巴雜訊,不剪會有電子音)
        const thr = 0.012;
        let si = 0;
        while (si < data.length && Math.abs(data[si]) < thr) si++;
        let ei = data.length - 1;
        while (ei > si && Math.abs(data[ei]) < thr) ei--;
        const start = Math.max(0, si - 0.012 * sr) / sr;
        const end = Math.min(data.length, ei + 0.05 * sr) / sr;
        const dur = Math.max(0.05, end - start);
        // RMS 響度只算有聲音的區段
        let sum = 0;
        const step = Math.max(1, Math.floor((ei - si) / 20000));
        let n = 0;
        for (let i = si; i <= ei; i += step) { sum += data[i] * data[i]; n++; }
        const rms = Math.sqrt(sum / Math.max(1, n));
        // 目標響度 ~ -18dBFS;增益限制在 0.5~3 倍避免放大底噪
        const gain = Math.min(3, Math.max(0.5, 0.125 / Math.max(0.005, rms)));
        const entry = { buf, gain, start, dur };
        // iOS:預先烘焙成乾淨的正規化 WAV
        if (IS_IOS) {
          try { entry.blobUrl = encodeNormalizedWav(buf, gain, start, dur); } catch { /* 烘不出來就播原檔 */ }
        }
        buffersRef.current[url] = entry;
        return entry;
      } catch {
        return null;
      } finally {
        clearTimeout(timer);
        delete bufPendingRef.current[url];
      }
    })();
    bufPendingRef.current[url] = p;
    return p;
  }, [getCtx]);

  // 查 Free Dictionary API 取得 Wiktionary 真人錄音(1.5 秒逾時,查到就預載音檔)
  const findHumanAudio = useCallback((word) => {
    const key = word.toLowerCase().trim();
    if (key in cacheRef.current) return Promise.resolve(cacheRef.current[key]);
    if (key in pendingRef.current) return pendingRef.current[key];
    const p = (async () => {
      let url = null;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      try {
        const res = await fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            encodeURIComponent(key),
          { signal: ctrl.signal }
        );
        if (res.ok) {
          const data = await res.json();
          outer: for (const entry of Array.isArray(data) ? data : []) {
            for (const p2 of entry.phonetics || []) {
              if (p2.audio) {
                // 優先美式發音
                if (p2.audio.includes("-us.")) { url = p2.audio; break outer; }
                if (!url) url = p2.audio;
              }
            }
          }
        }
      } catch {
        url = null;
      } finally {
        clearTimeout(timer);
      }
      cacheRef.current[key] = url;
      delete pendingRef.current[key];
      // 把查詢結果(含「沒有音檔」)存起來,隔天再玩免重打 API。
      // 首次變更後固定延遲存檔一次(不隨連續查詢一直往後推,否則永遠存不到)
      if (!saveTimerRef.current) {
        saveTimerRef.current = setTimeout(() => {
          saveTimerRef.current = 0;
          try { localStorage.setItem(AUDIO_CACHE_KEY, JSON.stringify(cacheRef.current)); } catch { /* 無痕模式忽略 */ }
        }, 1500);
      }
      // 先把音檔載好、解碼、算好音量,之後點了立刻能播
      if (url) loadBuffer(url);
      return url;
    })();
    pendingRef.current[key] = p;
    return p;
  }, [loadBuffer]);

  const speak = useCallback(
    async (text, { rate = 0.85, onEnd, lang } = {}) => {
      // 停掉正在播的(增益快速滑到 0 再停,避免「喀」一聲)
      const ss = window.speechSynthesis;
      if (ss && (ss.speaking || ss.pending)) ss.cancel();
      if (srcRef.current) {
        const { src: oldSrc, g: oldG } = srcRef.current;
        try {
          oldSrc.onended = null;
          const ctx0 = ctxRef.current;
          if (oldG && ctx0) {
            oldG.gain.cancelScheduledValues(ctx0.currentTime);
            oldG.gain.setValueAtTime(oldG.gain.value, ctx0.currentTime);
            oldG.gain.linearRampToValueAtTime(0.0001, ctx0.currentTime + 0.015);
            oldSrc.stop(ctx0.currentTime + 0.02);
          } else {
            oldSrc.stop();
          }
        } catch { /* 已停 */ }
        srcRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
      }
      // 中文(注音遊戲)直接走中文合成語音,不查英文字典
      if (lang && /^zh/i.test(lang)) {
        ttsSpeak(text, { rate, onEnd, lang });
        return "tts";
      }
      if (SPEAKABLE_RE.test(text.trim())) {
        // 整條真人路徑限時 2.5 秒:一定會出聲,最壞情況退合成
        const attempt = { cancelled: false };
        const tryHuman = async () => {
          const url = await findHumanAudio(text);
          if (!url || attempt.cancelled) return false;
          const entry = await loadBuffer(url);
          if (attempt.cancelled) return false;
          // iOS:用祝福元件播「烘焙好的正規化 WAV」——無即時管線、無毛刺、不受靜音鍵影響
          if (IS_IOS) {
            try {
              const a = blessedRef.current || new Audio();
              blessedRef.current = a;
              audioRef.current = a;
              a.src = (entry && entry.blobUrl) || url;
              a.volume = 1;
              a.playbackRate = rate < 0.8 ? 0.85 : 1;
              a.onended = onEnd || null;
              await a.play();
              return !attempt.cancelled;
            } catch {
              return false;
            }
          }
          // 桌機/Android:Web Audio 播放(音量已正規化,和合成音一致)
          const ctx = getCtx();
          if (entry && ctx && !attempt.cancelled) {
            try {
              if (ctx.state !== "running") {
                // resume 在部分瀏覽器會永遠不 resolve,用 250ms 競速保底
                await Promise.race([
                  ctx.resume().catch(() => {}),
                  new Promise((r) => setTimeout(r, 250)),
                ]);
              }
              if (ctx.state === "running" && !attempt.cancelled) {
                const src = ctx.createBufferSource();
                src.buffer = entry.buf;
                const pr = rate < 0.8 ? 0.85 : 1;
                src.playbackRate.value = pr;
                const g = ctx.createGain();
                src.connect(g).connect(ctx.destination);
                // 淡入淡出包絡:頭尾平滑歸零,不會有突兀的電子音
                const t0 = ctx.currentTime;
                const durS = (entry.dur ?? entry.buf.duration) / pr;
                g.gain.setValueAtTime(0.0001, t0);
                g.gain.exponentialRampToValueAtTime(entry.gain, t0 + 0.015);
                const fadeAt = Math.max(t0 + 0.02, t0 + durS - 0.045);
                g.gain.setValueAtTime(entry.gain, fadeAt);
                g.gain.linearRampToValueAtTime(0.0001, t0 + durS);
                if (onEnd) src.onended = onEnd;
                srcRef.current = { src, g };
                src.start(0, entry.start ?? 0, entry.dur ?? undefined);
                return true;
              }
            } catch {
              /* Web Audio 失敗 → 試祝福過的 Audio 元件 */
            }
          }
          if (attempt.cancelled) return false;
          // 備援:手勢裡祝福過的共用 Audio 元件(iOS 允許它由程式播放)
          try {
            const a = blessedRef.current || new Audio();
            blessedRef.current = a;
            audioRef.current = a;
            a.src = url;
            a.volume = 1;
            a.playbackRate = rate < 0.8 ? 0.85 : 1;
            a.onended = onEnd || null;
            await a.play();
            return !attempt.cancelled;
          } catch {
            return false;
          }
        };
        const ok = await Promise.race([
          tryHuman().catch(() => false),
          new Promise((r) => setTimeout(() => r("timeout"), 2500)),
        ]);
        if (ok === true) return "human";
        attempt.cancelled = true; // 超時後就算晚到也不要突然出聲
      }
      ttsSpeak(text, { rate, onEnd });
      return "tts";
    },
    [findHumanAudio, ttsSpeak, loadBuffer, getCtx]
  );

  // speak.prefetch / speak.prefetchMany:題目出現時先在背景查好音檔
  return useMemo(() => {
    const fn = (text, opts) => speak(text, opts);
    fn.prefetch = (w) => {
      if (typeof w === "string" && SPEAKABLE_RE.test(w.trim())) findHumanAudio(w);
    };
    fn.prefetchMany = (words) => {
      // 錯開發送,避免一次打太多請求
      (words || []).forEach((w, i) => setTimeout(() => fn.prefetch(w), i * 120));
    };
    return fn;
  }, [speak, findHumanAudio]);
}

// ---------- 3D 按鈕 ----------
function ChunkyButton({ color, dark, children, onClick, style, disabled }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: color,
        color: "#fff",
        border: "none",
        borderRadius: 18,
        padding: "14px 24px",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: disabled ? "default" : "pointer",
        boxShadow: pressed ? `0 2px 0 ${dark}` : `0 6px 0 ${dark}`,
        transform: pressed ? "translateY(4px)" : "translateY(0)",
        transition: "transform .08s, box-shadow .08s",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ---------- 學習模式:單字卡 ----------
function WordCard({ word, speak }) {
  const [speaking, setSpeaking] = useState(false);
  const tap = () => {
    setSpeaking(true);
    speak(word.en, { onEnd: () => setSpeaking(false) });
    setTimeout(() => setSpeaking(false), 1800); // 保險
  };
  return (
    <button
      onClick={tap}
      style={{
        background: T.card,
        border: `3px solid ${speaking ? T.purple : "#E8E4FA"}`,
        borderRadius: 22,
        padding: "18px 8px 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: speaking
          ? `0 0 0 6px ${T.purple}33, 0 6px 0 #E0DBF7`
          : "0 6px 0 #E0DBF7",
        transform: speaking ? "scale(1.05)" : "scale(1)",
        transition: "all .15s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 44,
          lineHeight: 1,
          transform: speaking ? "scale(1.2) rotate(-6deg)" : "none",
          transition: "transform .15s",
        }}
      >
        {word.emoji}
      </span>
      <span style={{ fontSize: 20, fontWeight: 700, color: T.ink }}>
        {word.en}
      </span>
      <span style={{ fontSize: 13, color: T.sub }}>{word.zh}</span>
      <span style={{ fontSize: 12, color: speaking ? T.purple : "#C9C4E8" }}>{speaking ? t("🔊 播放中…") : t("🔈 點我聽")}</span>
    </button>
  );
}

function LearnMode({ speak }) {
  const [cat, setCat] = useState(CATEGORIES[0]);
  // 換分類就先把整類的音檔查好,點卡片立刻出聲
  useEffect(() => {
    speak.prefetchMany?.(WORD_BANK[cat].map((w) => w.en));
  }, [cat, speak]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: c === cat ? T.purple : "#E8E4FA",
              color: c === cat ? "#fff" : T.sub,
              transition: "all .15s",
            }}
          >
            {t(c)}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 12,
        }}
      >
        {WORD_BANK[cat].map((w) => (
          <WordCard key={w.en} word={w} speak={speak} />
        ))}
      </div>
    </div>
  );
}

// ---------- 發音練習模式(字節)----------
function PhonicsCard({ item, speak }) {
  const [active, setActive] = useState(null); // 正在唸的字串
  const say = (text, rate) => {
    setActive(text);
    speak(text, { rate, onEnd: () => setActive(null) });
    setTimeout(() => setActive(null), 1800);
  };
  return (
    <div
      style={{
        background: T.card,
        border: `3px solid ${active === item.s ? T.purple : "#E8E4FA"}`,
        borderRadius: 20,
        padding: "14px 12px",
        boxShadow: "0 5px 0 #E0DBF7",
        transition: "all .15s",
      }}
    >
      <button
        onClick={() => say(item.s, 0.7)}
        style={{
          background: active === item.s ? T.purple : "#F3F0FF",
          color: active === item.s ? "#fff" : T.purple,
          border: "none",
          borderRadius: 14,
          width: "100%",
          padding: "10px 0",
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: "pointer",
          letterSpacing: 2,
          transition: "all .15s",
        }}
      >
        -{item.s} 🔈
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        {item.ex.map((w) => (
          <button
            key={w}
            onClick={() => say(w, 0.8)}
            style={{
              background: active === w ? T.yellow : "#FFF7DA",
              color: T.ink,
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhonicsMode({ speak }) {
  const [group, setGroup] = useState(PHONICS_GROUPS[0]);
  const total = PHONICS_GROUPS.reduce((n, g) => n + PHONICS[g].length, 0);
  useEffect(() => {
    speak.prefetchMany?.(PHONICS[group].flatMap((i) => [i.s, ...i.ex]));
  }, [group, speak]);
  return (
    <div>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("共 {0} 個常見字節。點大按鈕聽字節發音,點小字聽例字 👂", total)}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {PHONICS_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            style={{
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: g === group ? T.pink : "#E8E4FA",
              color: g === group ? "#fff" : T.sub,
              transition: "all .15s",
            }}
          >
            {t(g)}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {PHONICS[group].map((item) => (
          <PhonicsCard key={item.s} item={item} speak={speak} />
        ))}
      </div>
    </div>
  );
}

// ---------- 挑戰模式 ----------
const ROUNDS = 8;
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeQuestion(usedWords) {
  const pool = ALL_WORDS.filter((w) => !usedWords.includes(w.en));
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const others = shuffle(ALL_WORDS.filter((w) => w.en !== answer.en)).slice(0, 3);
  return { answer, options: shuffle([answer, ...others]) };
}

function QuizMode({ speak, addStars, onExit }) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [used, setUsed] = useState([]);
  const [q, setQ] = useState(() => makeQuestion([]));
  const [picked, setPicked] = useState(null); // en 字串
  const [done, setDone] = useState(false);

  const playQ = useCallback(() => speak(q.answer.en), [q, speak]);
  useEffect(() => {
    speak.prefetch?.(q.answer.en); // 先查音檔,400ms 後播就不用等
    const t = setTimeout(playQ, 400);
    return () => clearTimeout(t);
  }, [q, playQ, speak]);

  const pick = (w) => {
    if (picked) return;
    setPicked(w.en);
    const right = w.en === q.answer.en;
    if (right) {
      setScore((s) => s + 10 + streak * 2);
      if (addStars) addStars(1);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
      speak("Great job!", { rate: 1 });
    } else {
      setStreak(0);
      speak(q.answer.en, { rate: 0.75 });
    }
    setTimeout(() => {
      if (round >= ROUNDS) {
        setDone(true);
      } else {
        const nu = [...used, q.answer.en];
        setUsed(nu);
        setQ(makeQuestion(nu));
        setRound((r) => r + 1);
        setPicked(null);
      }
    }, 1400);
  };

  if (done) {
    const stars = score >= 90 ? 3 : score >= 55 ? 2 : 1;
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{"⭐".repeat(stars)}</div>
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0" }}>{t("完成挑戰!")}</h2>
        <p style={{ color: T.sub, fontSize: 16, margin: "4px 0 20px" }}>{t("得分")}<b style={{ color: T.purple }}>{score}</b>{tf("・最長連對{0}", " ")}<b style={{ color: T.pink }}>{best}</b>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={onExit}>{t("回主選單")}</ChunkyButton>
          <ChunkyButton
            color={T.green}
            dark={T.greenDark}
            onClick={() => {
              setRound(1); setScore(0); setStreak(0); setBest(0);
              setUsed([]); setQ(makeQuestion([])); setPicked(null); setDone(false);
            }}
          >{t("再玩一次")}</ChunkyButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 16, color: T.sub, fontWeight: 700, fontSize: 14,
        }}
      >
        <span>{tf("第 {0} / {1} 題", round, ROUNDS)}</span>
        <span>{tf("🔥 連對 {0}", streak)}<span style={{ color: T.purple }}>{tf("分數 {0}", score)}</span>
        </span>
      </div>

      <div
        style={{
          background: T.card, borderRadius: 24, padding: "26px 16px",
          textAlign: "center", marginBottom: 16, boxShadow: "0 6px 0 #E0DBF7",
        }}
      >
        <p style={{ color: T.sub, margin: "0 0 12px", fontSize: 15 }}>{t("仔細聽,選出正確的單字 👂")}</p>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={playQ}
          style={{ color: T.ink, fontSize: 20 }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {q.options.map((w) => {
          const isAnswer = w.en === q.answer.en;
          const isPicked = picked === w.en;
          let bg = T.card, border = "#E8E4FA";
          if (picked) {
            if (isAnswer) { bg = "#E9FBEF"; border = T.green; }
            else if (isPicked) { bg = "#FFEDED"; border = T.red; }
          }
          return (
            <button
              key={w.en}
              onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${border}`, borderRadius: 20,
                padding: "16px 8px", cursor: picked ? "default" : "pointer",
                fontFamily: "inherit", boxShadow: "0 5px 0 #E0DBF7",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 4, transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 40 }}>{w.emoji}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>
                {w.en}
              </span>
              {picked && isAnswer && (
                <span style={{ fontSize: 13, color: T.greenDark, fontWeight: 700 }}>
                  ✓ {w.zh}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 認字快手(Sight Words 闖關版)----------
// 一關只有 5 個字:先聽熟 → 2~3 選 1 挑戰 → 答錯的字稍後再出現,
// 直到全部答對,所以永遠會過關,只差拿幾顆星(全對拿皇冠)。
const SIGHT_LEVEL_SIZE = 5;
const SIGHT_LEVELS = [];
for (let i = 0; i < SIGHT_WORDS.length; i += SIGHT_LEVEL_SIZE)
  SIGHT_LEVELS.push(SIGHT_WORDS.slice(i, i + SIGHT_LEVEL_SIZE));
const SIGHT_KEY = "wordpop-sight-progress";

function loadProgress(key) {
  try {
    const o = JSON.parse(localStorage.getItem(key) || "{}");
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function saveProgress(key, np) {
  try {
    localStorage.setItem(key, JSON.stringify(np));
  } catch { /* 寫入失敗就不保存 */ }
}

function SightMode({ speak, addStars }) {
  const [view, setView] = useState("map"); // map | learn | quiz | clear
  const [lv, setLv] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress(SIGHT_KEY)); // 關卡 -> 最佳星數
  const [heard, setHeard] = useState(() => new Set());
  const [queue, setQueue] = useState([]);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [mastered, setMastered] = useState(() => new Set());
  const [wrongSet, setWrongSet] = useState(() => new Set()); // 這關曾答錯的字
  const [encourage, setEncourage] = useState("");
  const [gotStars, setGotStars] = useState(1);

  const words = SIGHT_LEVELS[lv];
  const nChoices = lv < 5 ? 2 : 3; // 前 5 關二選一,之後三選一
  const target = queue[0];

  const makeOptions = (word, lvWords, n) => {
    const others = shuffle(lvWords.filter((w) => w !== word)).slice(0, n - 1);
    return shuffle([word, ...others]);
  };

  const openLevel = (i) => {
    setLv(i);
    setHeard(new Set());
    setView("learn");
    speak.prefetchMany?.(SIGHT_LEVELS[i]);
  };

  const startQuiz = () => {
    const q = shuffle(words);
    setQueue(q);
    setMastered(new Set());
    setWrongSet(new Set());
    setPicked(null);
    setEncourage("");
    setOptions(makeOptions(q[0], words, nChoices));
    setView("quiz");
  };

  useEffect(() => {
    if (view === "quiz" && target) {
      const t = setTimeout(() => speak(target), 400);
      return () => clearTimeout(t);
    }
  }, [view, target, speak]);

  const pick = (w) => {
    if (picked || !target) return;
    setPicked(w);
    if (w === target) {
      addStars(1);
      speak("Great job!", { rate: 1 });
      const nm = new Set(mastered).add(target);
      setTimeout(() => {
        setMastered(nm);
        const rest = queue.slice(1);
        if (rest.length === 0) {
          // 過關!全對 👑3 星、只錯 1 個字 2 星、其他 1 星
          const perfect = words.length - wrongSet.size;
          const starsGot =
            perfect >= words.length ? 3 : perfect >= words.length - 1 ? 2 : 1;
          setGotStars(starsGot);
          addStars(starsGot);
          setProgress((p) => {
            const np = { ...p, [lv]: Math.max(p[lv] || 0, starsGot) };
            saveProgress(SIGHT_KEY, np);
            return np;
          });
          setView("clear");
        } else {
          setQueue(rest);
          setPicked(null);
          setEncourage("");
          setOptions(makeOptions(rest[0], words, nChoices));
        }
      }, 1100);
    } else {
      setWrongSet((s) => new Set(s).add(target));
      setEncourage(t("沒關係!仔細聽,它等一下還會再出現 💪"));
      speak(target, { rate: 0.7 });
      setTimeout(() => {
        // 答錯的字排到最後,等一下再考一次
        const rest = [...queue.slice(1), queue[0]];
        setQueue(rest);
        setPicked(null);
        setOptions(makeOptions(rest[0], words, nChoices));
      }, 1600);
    }
  };

  // ----- 關卡地圖 -----
  if (view === "map") {
    const crowns = Object.values(progress).filter((s) => s >= 3).length;
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 4px" }}>{t("Sight words 是「看到就要唸得出來」的常見字。")}</p>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>{tf("一關 5 個字,收集皇冠吧!👑 {0} / {1}", crowns, SIGHT_LEVELS.length)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {SIGHT_LEVELS.map((lvWords, i) => {
            const unlocked = i === 0 || (progress[i - 1] || 0) >= 1;
            const best = progress[i] || 0;
            return (
              <button
                key={i}
                onClick={() => unlocked && openLevel(i)}
                style={{
                  fontFamily: "inherit", fontWeight: 700, border: "none",
                  borderRadius: 18, padding: "12px 0 10px",
                  cursor: unlocked ? "pointer" : "default",
                  background: unlocked ? (best >= 3 ? "#FFF7DA" : T.card) : "#ECEAF6",
                  color: unlocked ? T.ink : "#C0BBDE",
                  boxShadow: unlocked ? "0 5px 0 #E0DBF7" : "none",
                  transition: "all .15s",
                }}
              >
                <div style={{ fontSize: 22 }}>
                  {unlocked ? (best >= 3 ? "👑" : i + 1) : "🔒"}
                </div>
                <div style={{ fontSize: 12, height: 16, color: T.yellowDark }}>
                  {best > 0 ? "⭐".repeat(best) : ""}
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 16 }}>{t("每一關都一定會過,答錯的字會再出現,答對就好 💜")}</p>
      </div>
    );
  }

  // ----- 過關畫面 -----
  if (view === "clear") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{gotStars >= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0 4px" }}>{tf("第 {0} 關完成!", lv + 1)}</h2>
        <div style={{ fontSize: 34 }}>{"⭐".repeat(gotStars)}</div>
        <p style={{ color: T.sub, fontSize: 15, margin: "6px 0 18px" }}>
          {gotStars >= 3
            ? t("全部一次答對,拿到皇冠!")
            : t("這 5 個字全部學會了,太厲害!")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setView("map")}>{t("回關卡地圖")}</ChunkyButton>
          {lv + 1 < SIGHT_LEVELS.length && (
            <ChunkyButton color={T.green} dark={T.greenDark} onClick={() => openLevel(lv + 1)}>{t("下一關 →")}</ChunkyButton>
          )}
        </div>
      </div>
    );
  }

  // ----- 先聽熟這一關的 5 個新朋友 -----
  if (view === "learn") {
    const allHeard = heard.size >= words.length;
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{tf("第 {0} 關的 5 個新朋友 👋", lv + 1)}</p>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 14px" }}>{t("每張卡都點一下聽聽看,全部聽過就可以開始挑戰!")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10, marginBottom: 16 }}>
          {words.map((w) => {
            const ok = heard.has(w);
            return (
              <button
                key={w}
                onClick={() => {
                  speak(w);
                  setHeard((s) => new Set(s).add(w));
                }}
                style={{
                  background: ok ? "#E9FBEF" : T.card,
                  border: `3px solid ${ok ? T.green : "#E8E4FA"}`,
                  borderRadius: 18, padding: "20px 4px 14px",
                  fontFamily: "inherit", fontSize: 24, fontWeight: 700,
                  color: T.ink, cursor: "pointer",
                  boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
                }}
              >
                {w}
                <div style={{ fontSize: 12, marginTop: 6, color: ok ? T.greenDark : "#C9C4E8" }}>{ok ? t("✓ 聽過了") : t("🔈 點我")}</div>
              </button>
            );
          })}
        </div>
        <ChunkyButton
          color={T.pink} dark="#D14B7D" onClick={startQuiz} disabled={!allHeard}
          style={{ width: "100%" }}
        >{allHeard ? t("🎈 開始挑戰!") : tf("再聽 {0} 張卡就能挑戰", words.length - heard.size)}</ChunkyButton>
        <button
          onClick={() => setView("map")}
          style={{
            marginTop: 12, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            background: "none", border: "none", color: T.sub, cursor: "pointer",
          }}
        >{t("← 回關卡地圖")}</button>
      </div>
    );
  }

  // ----- 挑戰:答對氣球變星星 -----
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 26, letterSpacing: 4, marginBottom: 10 }}>
        {words.map((w) => (
          <span key={w}>{mastered.has(w) ? "⭐" : "🎈"}</span>
        ))}
      </div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        textAlign: "center", marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <p style={{ color: T.sub, margin: "0 0 10px", fontSize: 15 }}>{t("仔細聽,點出正確的字,氣球就會變星星!")}</p>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(target)}
          style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: nChoices === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
        {options.map((w) => {
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (w === target) { bg = "#E9FBEF"; bd = T.green; }
            else if (w === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "26px 8px", fontFamily: "inherit", fontSize: 30,
                fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {w}
            </button>
          );
        })}
      </div>
      {encourage && (
        <div style={{ marginTop: 14, fontSize: 15, color: T.sub, fontWeight: 700 }}>
          {encourage}
        </div>
      )}
    </div>
  );
}

// ---------- 學校單字表(High Frequency Words・大班上下學期)----------
// 完全照學校發的自我檢核表:點單字聽發音,自己覺得會了就打勾。
// 每一欄的順序和紙本一樣(由上往下、左欄到右欄)。
const SCHOOL_WORDS = [
  {
    key: "s1", label: "上學期",
    cols: [
      ["I", "am", "the", "a", "to", "like", "he", "is", "have", "my", "we", "make", "me", "for", "with"],
      ["she", "see", "look", "of", "are", "that", "do", "you", "they", "one", "two", "three", "four", "five", "here"],
      ["go", "from", "yellow", "blue", "what", "green", "was", "said", "where", "any", "come", "play", "her", "how", "down"],
    ],
  },
  {
    key: "s2", label: "下學期",
    cols: [
      ["away", "give", "little", "were", "some", "funny", "live", "know", "going", "find", "over", "again", "all", "now", "pretty"],
      ["black", "brown", "white", "good", "open", "could", "want", "every", "please", "may", "this", "round", "be", "saw", "our"],
      ["eat", "soon", "walk", "who", "into", "there", "so", "out", "then", "new", "too", "when", "no", "say", "under"],
    ],
  },
];
// 顏色字在單字表裡附一個小色點(只在表格出現,挑戰時不給提示)
const SCHOOL_SWATCH = {
  yellow: "#F1C40F", blue: "#3498DB", green: "#2ECC71",
  black: "#2C3E50", brown: "#8D6E63", white: "#FFFFFF",
};
const SCHOOL_KEY = "wordpop-school-words";
const schoolList = (sem) => sem.cols.flat();
function loadSchoolKnown() {
  try {
    const arr = JSON.parse(localStorage.getItem(SCHOOL_KEY) || "[]");
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function SchoolWordsMode({ speak, addStars }) {
  const QUIZ_TOTAL = 10;
  const [semIdx, setSemIdx] = useState(0);
  const [known, setKnown] = useState(loadSchoolKnown);
  const [view, setView] = useState("list"); // list | quiz | result
  const [queue, setQueue] = useState([]);
  const [options, setOptions] = useState([]);
  const [qNo, setQNo] = useState(1);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [gotRight, setGotRight] = useState(() => new Set());
  const [confirmReset, setConfirmReset] = useState(false);

  const sem = SCHOOL_WORDS[semIdx];
  const words = useMemo(() => schoolList(sem), [sem]);
  const knownCount = words.filter((w) => known.has(w)).length;
  const allDone = knownCount === words.length;
  const target = view === "quiz" ? queue[qNo - 1] : null;

  // 這學期的字先在背景查好真人音檔,點下去就出聲(查過會存起來,只會查這一次)
  useEffect(() => {
    if (view === "list") speak.prefetchMany?.(words);
  }, [words, view, speak]);

  useEffect(() => {
    if (view === "quiz" && target) {
      const t = setTimeout(() => speak(target), 400);
      return () => clearTimeout(t);
    }
  }, [view, target, speak]);

  const persist = (next) => {
    try { localStorage.setItem(SCHOOL_KEY, JSON.stringify([...next])); } catch { /* 寫不進去就不保存 */ }
  };

  // 打勾是「自我檢核」不給星星,免得來回點就能刷星
  const toggle = (w) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      persist(next);
      return next;
    });
  };

  const makeOptions = (w) =>
    shuffle([w, ...shuffle(words.filter((x) => x !== w)).slice(0, 2)]);

  const startQuiz = () => {
    // 優先考還沒打勾的字;不夠 10 個再從會的字裡補
    const todo = shuffle(words.filter((w) => !known.has(w)));
    const rest = shuffle(words.filter((w) => known.has(w)));
    const q = [...todo, ...rest].slice(0, QUIZ_TOTAL);
    setQueue(q); setQNo(1); setRight(0); setGotRight(new Set());
    setOptions(makeOptions(q[0])); setPicked(null); setView("quiz");
    speak.prefetchMany?.(q);
  };

  const pick = (w) => {
    if (picked || !target) return;
    setPicked(w);
    if (w === target) {
      setRight((r) => r + 1);
      addStars(1);
      setGotRight((s) => new Set(s).add(target));
      speak(target, { rate: 0.95, onEnd: () => speak("Great job!", { rate: 1 }) });
    } else {
      speak(target, { rate: 0.7 });
    }
    setTimeout(() => {
      if (qNo >= QUIZ_TOTAL) setView("result");
      else {
        const n = qNo + 1;
        setQNo(n); setOptions(makeOptions(queue[n - 1])); setPicked(null);
      }
    }, 1700);
  };

  const tickCorrect = () => {
    setKnown((prev) => {
      const next = new Set(prev);
      gotRight.forEach((w) => next.add(w));
      persist(next);
      return next;
    });
    setView("list");
  };

  const clearSemester = () => {
    setKnown((prev) => {
      const next = new Set(prev);
      words.forEach((w) => next.delete(w));
      persist(next);
      return next;
    });
    setConfirmReset(false);
  };

  // ----- 挑戰 -----
  if (view === "quiz")
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・{2}・聽聽看是哪個字?", qNo, QUIZ_TOTAL, t(sem.label))}</div>
        <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
          marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
          <div style={{ fontSize: 52 }}>👂</div>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} style={{ color: T.ink, marginTop: 6 }}
            onClick={() => speak(target)}>{t("🔊 再聽一次")}</ChunkyButton>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {options.map((w) => {
            const isAns = w === target;
            let bg = T.card, bd = "#E8E4FA";
            if (picked) {
              if (isAns) { bg = "#E9FBEF"; bd = T.green; }
              else if (w === picked) { bg = "#FFF7DA"; bd = T.yellow; }
            }
            return (
              <button key={w} onClick={() => pick(w)}
                style={{
                  background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                  padding: "20px 8px", fontFamily: "inherit", fontSize: 30,
                  fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                  boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
                }}>
                {w}
              </button>
            );
          })}
        </div>
        <button onClick={() => setView("list")}
          style={{ marginTop: 14, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            background: "none", border: "none", color: T.sub, cursor: "pointer" }}>{t("← 回單字表")}</button>
      </div>
    );

  // ----- 挑戰結果 -----
  if (view === "result")
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 60 }}>{right >= QUIZ_TOTAL - 1 ? "🏆" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 26, margin: "8px 0 4px" }}>{tf("答對 {0} / {1} 個字!", right, QUIZ_TOTAL)}</h2>
        <p style={{ color: T.sub, fontSize: 15, margin: "4px 0 18px" }}>
          {gotRight.size > 0
            ? tf("要把這 {0} 個字在單字表上打勾嗎?", gotRight.size)
            : t("沒關係,再聽一次就會記得了 💪")}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {gotRight.size > 0 && (
            <ChunkyButton color={T.green} dark={T.greenDark} onClick={tickCorrect}>{t("✓ 幫我打勾")}</ChunkyButton>
          )}
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setView("list")}>{t("回單字表")}</ChunkyButton>
        </div>
      </div>
    );

  // ----- 單字表(自我檢核)-----
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{t("學校的 High Frequency Words 檢核表。")}<b style={{ color: T.purple }}>{t("點單字")}</b>{t("聽發音,")}<b style={{ color: T.purple }}>{t("唸得出來就自己打勾")}</b> ✓
      </p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {SCHOOL_WORDS.map((s, i) => {
          const on = i === semIdx;
          const n = schoolList(s).filter((w) => known.has(w)).length;
          return (
            <button key={s.key} onClick={() => { setSemIdx(i); setConfirmReset(false); }}
              style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                padding: "8px 16px", borderRadius: 999, cursor: "pointer",
                border: `3px solid ${on ? T.purpleDark : "#E8E4FA"}`,
                background: on ? T.purple : T.card,
                color: on ? "#fff" : T.ink,
              }}>
              {t(s.label)} {n}/{schoolList(s).length}
            </button>
          );
        })}
      </div>

      <div style={{ background: T.card, borderRadius: 18, padding: "12px 14px",
        boxShadow: "0 5px 0 #E0DBF7", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, color: T.ink, fontSize: 17 }}>{tf("我會 {0} / {1} 個字", knownCount, words.length)}</span>
          <span style={{ fontSize: 13, color: T.sub, fontWeight: 700 }}>
            {Math.round((knownCount / words.length) * 100)}%
          </span>
        </div>
        <div style={{ height: 12, background: "#EFECFB", borderRadius: 999,
          marginTop: 8, overflow: "hidden" }}>
          <div style={{
            width: `${(knownCount / words.length) * 100}%`, height: "100%",
            background: allDone ? T.yellow : T.green, borderRadius: 999,
            transition: "width .3s",
          }} />
        </div>
        {allDone && (
          <div style={{ marginTop: 8, fontSize: 16, fontWeight: 800, color: T.greenDark }}>{tf("🎉 {0}的字全部都會了!", t(sem.label))}</div>
        )}
      </div>

      <ChunkyButton color={T.pink} dark="#D14B7D" onClick={startQuiz} style={{ width: "100%" }}>{tf("🎯 來考考我({0} 題)", QUIZ_TOTAL)}</ChunkyButton>
      <p style={{ color: "#B7B2D8", fontSize: 12, margin: "8px 0 12px" }}>{t("考試會先挑")}<b>{t("還沒打勾")}</b>{t("的字")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {words.map((w) => {
          const ok = known.has(w);
          const swatch = SCHOOL_SWATCH[w];
          return (
            <div key={w}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: ok ? "#E9FBEF" : T.card,
                border: `3px solid ${ok ? T.green : "#E8E4FA"}`,
                borderRadius: 14, padding: "4px 4px 4px 9px",
                boxShadow: "0 4px 0 #E0DBF7", transition: "all .15s",
              }}>
              <button onClick={() => speak(w)}
                style={{
                  flex: 1, minWidth: 0, textAlign: "left", background: "none",
                  border: "none", fontFamily: "inherit", fontSize: 19, fontWeight: 700,
                  color: T.ink, cursor: "pointer", padding: "9px 0",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                {swatch && (
                  <span style={{
                    width: 13, height: 13, borderRadius: "50%", flex: "0 0 auto",
                    background: swatch, border: "1.5px solid #C9C4E8",
                  }} />
                )}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{w}</span>
              </button>
              <button onClick={() => toggle(w)} aria-label={tf("{0}:我會了", w)}
                style={{
                  width: 34, height: 34, flex: "0 0 auto", borderRadius: 10,
                  background: ok ? T.green : "#F6F4FE",
                  border: `2px solid ${ok ? T.greenDark : "#E0DBF7"}`,
                  color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1,
                  fontFamily: "inherit", cursor: "pointer",
                }}>
                {ok ? "✓" : ""}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        {confirmReset ? (
          <div>
            <div style={{ color: T.sub, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{tf("要清掉{0}的勾勾,重新檢查一次嗎?", t(sem.label))}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={clearSemester}
                style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, background: T.red,
                  color: "#fff", border: "none", borderRadius: 999, padding: "9px 18px",
                  cursor: "pointer", boxShadow: "0 3px 0 #C94F4E" }}>{t("確定清掉")}</button>
              <button onClick={() => setConfirmReset(false)}
                style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, background: "#E8E4FA",
                  color: T.sub, border: "none", borderRadius: 999, padding: "9px 18px", cursor: "pointer" }}>{t("取消")}</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)}
            style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 13, background: "none",
              border: "none", color: "#B7B2D8", cursor: "pointer", textDecoration: "underline" }}>{tf("🔄 重新檢查{0}(清掉勾勾)", t(sem.label))}</button>
        )}
      </div>
    </div>
  );
}

// ---------- 學校單字表:唸出來答題(語音辨識)----------
// 用「唸得出來」當通過條件——這比三選一更接近老師在課堂上的檢核方式。
// 語音辨識對這種短的功能字常常聽成同音字,所以放寬到真正分不出來的同音詞。
const SAY_HOMOPHONES = {
  I: ["i", "eye", "aye"],
  a: ["a", "ay", "eh", "uh"],
  to: ["to", "too", "two"], two: ["two", "to", "too"], too: ["too", "to", "two"],
  for: ["for", "four", "fore"], four: ["four", "for", "fore"],
  be: ["be", "bee", "b"], see: ["see", "sea", "c"],
  here: ["here", "hear"], no: ["no", "know"], know: ["know", "no"],
  our: ["our", "hour", "are"], one: ["one", "won"], some: ["some", "sum"],
  there: ["there", "their", "theyre"], so: ["so", "sew", "sow"],
  by: ["by", "buy", "bye"], new: ["new", "knew"], eat: ["eat", "eight"],
  way: ["way", "weigh"], made: ["made", "maid"], its: ["its", "it's"],
};
const sayTargets = (w) => SAY_HOMOPHONES[w] || [w.toLowerCase()];

function SchoolSayMode({ speak, addStars }) {
  const [semIdx, setSemIdx] = useState(0);
  const [known, setKnown] = useState(loadSchoolKnown);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | listening | correct | tryagain
  const [heard, setHeard] = useState("");
  const [wins, setWins] = useState(0);
  const recRef = useRef(null);
  const timerRef = useRef(0);

  const sem = SCHOOL_WORDS[semIdx];
  const words = useMemo(() => schoolList(sem), [sem]);
  // 還沒打勾的排前面,先練不會的
  const queue = useMemo(
    () => [...words.filter((w) => !known.has(w)), ...words.filter((w) => known.has(w))],
    // 只在換學期時重排,免得打勾後題目跳掉
    [words] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const word = queue[idx] || queue[0];

  const SR = typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => { speak.prefetch?.(word); }, [word, speak]);

  const stopListening = useCallback(() => {
    clearTimeout(timerRef.current);
    try { recRef.current?.abort(); } catch { /* 已停止就算了 */ }
    recRef.current = null;
  }, []);
  useEffect(() => stopListening, [stopListening]); // 離開頁面關麥克風

  const persist = (next) => {
    try { localStorage.setItem(SCHOOL_KEY, JSON.stringify([...next])); } catch { /* 寫不進去就算了 */ }
  };
  // 唸對了就直接在單字表上打勾(和「學校單字表」共用同一份紀錄)
  const markKnown = (w) => {
    setKnown((prev) => {
      if (prev.has(w)) return prev;
      const next = new Set(prev).add(w);
      persist(next);
      return next;
    });
  };

  const goto = (i) => {
    stopListening();
    setIdx(((i % queue.length) + queue.length) % queue.length);
    setStatus("idle"); setHeard("");
  };

  const listen = () => {
    if (!SR || status === "listening") return;
    window.speechSynthesis?.cancel(); // 不要讓麥克風收到喇叭的示範音
    stopListening();
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = "en-US";
      rec.interimResults = true;   // 唸對立刻過關,不等瀏覽器判定講完
      rec.maxAlternatives = 5;
      rec.continuous = false;
      setStatus("listening"); setHeard("");
      const accepts = sayTargets(word);
      let settled = false;
      const succeed = () => {
        if (settled) return;
        settled = true;
        stopListening();
        setStatus("correct");
        setWins((n) => n + 1);
        addStars(2);
        markKnown(word);
        speak("Great job!", { rate: 1 });
      };
      const giveUp = () => {
        if (settled) return;
        settled = true;
        stopListening();
        setStatus("tryagain");
      };
      // 逐字比對:把聽到的句子切成單字,要有一個「完全等於」目標字(或其同音字)
      const hit = (transcript) => {
        const toks = transcript.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
        return toks.some((tk) => accepts.includes(tk.replace(/'/g, "")));
      };
      rec.onresult = (e) => {
        const alts = [];
        for (const res of e.results)
          for (const alt of res) alts.push(alt.transcript.trim());
        if (alts[0]) setHeard(alts[0]);
        if (alts.some(hit)) succeed();
        else if (e.results[e.results.length - 1].isFinal) giveUp();
      };
      rec.onerror = giveUp;
      rec.onend = () => {
        clearTimeout(timerRef.current);
        setStatus((s) => (s === "listening" ? "tryagain" : s));
      };
      timerRef.current = setTimeout(() => {
        try { rec.stop(); } catch { giveUp(); }
      }, 6000);
      rec.start();
    } catch {
      setStatus("tryagain");
    }
  };

  const knownCount = words.filter((w) => known.has(w)).length;
  const swatch = SCHOOL_SWATCH[word];

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{t("看著字")}<b style={{ color: T.purple }}>{t("大聲唸出來")}</b>{t(",唸對得 ⭐⭐,還會自動在單字表上打勾!")}</p>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {SCHOOL_WORDS.map((s, i) => {
          const on = i === semIdx;
          return (
            <button key={s.key} onClick={() => { setSemIdx(i); goto(0); }}
              style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                padding: "8px 16px", borderRadius: 999, cursor: "pointer",
                border: `3px solid ${on ? T.purpleDark : "#E8E4FA"}`,
                background: on ? T.purple : T.card,
                color: on ? "#fff" : T.ink,
              }}>
              {t(s.label)}
            </button>
          );
        })}
      </div>

      <div style={{ color: T.sub, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{tf("第 {0} / {1} 個・這學期已會 {2} / {3}・本次唸對 {4} 個", idx + 1, queue.length, knownCount, words.length, wins)}</div>

      <div style={{ background: T.card, borderRadius: 24, padding: "26px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {swatch && (
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: swatch,
              border: "2px solid #C9C4E8" }} />
          )}
          <span style={{ fontSize: 46, fontWeight: 800, color: T.ink }}>{word}</span>
        </div>
        {known.has(word) && (
          <div style={{ fontSize: 13, color: T.greenDark, fontWeight: 700, marginTop: 2 }}>{t("✓ 單字表上已經打勾了")}</div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center",
          flexWrap: "wrap", marginTop: 14 }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} style={{ color: T.ink }}
            onClick={() => speak(word)} disabled={status === "listening"}>{t("🔊 先聽一次")}</ChunkyButton>
          {SR ? (
            <ChunkyButton
              color={status === "listening" ? T.red : T.pink}
              dark={status === "listening" ? "#C94F4E" : "#D14B7D"}
              onClick={listen} disabled={status === "listening"}>{status === "listening" ? t("🎤 聽你說…") : t("🎤 換我唸!")}</ChunkyButton>
          ) : (
            <ChunkyButton color={T.green} dark={T.greenDark}
              onClick={() => { setStatus("correct"); setWins((n) => n + 1); addStars(1); markKnown(word); }}>{tf("👍 她唸對了(家長按)")}</ChunkyButton>
          )}
        </div>

        {status === "listening" && (
          <div style={{ marginTop: 14, fontSize: 17, color: T.pink, fontWeight: 700,
            animation: "wp-pulse 1s ease-in-out infinite" }}>{tf("🎙️ 我在聽,大聲唸出來!{0}", heard && ` 「${heard}」`)}</div>
        )}
        {status === "correct" && (
          <div style={{ marginTop: 14, fontSize: 20, color: T.greenDark, fontWeight: 700 }}>{t("🎉 唸對了!+2 ⭐")}</div>
        )}
        {status === "tryagain" && (
          <div style={{ marginTop: 14, fontSize: 15, color: T.sub }}>{tf("{0}再試一次,先按「先聽一次」再慢慢唸 💪", heard ? tf("我聽到「{0}」,", heard) : "")}</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <ChunkyButton color="#B7B2D8" dark="#9A95BF" onClick={() => goto(idx - 1)}>{t("← 上一個")}</ChunkyButton>
        <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => goto(idx + 1)}>{t("下一個 →")}</ChunkyButton>
      </div>

      {!SR && (
        <p style={{ color: "#B7B2D8", fontSize: 12, marginTop: 14 }}>{tf("此瀏覽器不支援語音辨識,改由家長確認模式(建議用 Chrome)")}</p>
      )}
    </div>
  );
}

// ---------- 單字翻翻樂(和認字快手同一套字的配對遊戲)----------
const MATCH_KEY = "wordpop-match-progress";

function MatchMode({ speak, addStars }) {
  const [view, setView] = useState("map"); // map | play | clear
  const [lv, setLv] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress(MATCH_KEY));
  const [cards, setCards] = useState([]); // {id, word}
  const [open, setOpen] = useState([]); // 翻開中(未配對)的卡 index,最多 2 張
  const [matched, setMatched] = useState(() => new Set()); // 配對完成的字
  const [misses, setMisses] = useState(0);
  const [lock, setLock] = useState(false); // 翻錯蓋回去的短暫鎖定
  const [gotStars, setGotStars] = useState(1);
  const words = SIGHT_LEVELS[lv];

  const openLevel = (i) => {
    setLv(i);
    speak.prefetchMany?.(SIGHT_LEVELS[i]);
    const deck = shuffle([...SIGHT_LEVELS[i], ...SIGHT_LEVELS[i]]).map(
      (w, k) => ({ id: k, word: w })
    );
    setCards(deck);
    setOpen([]);
    setMatched(new Set());
    setMisses(0);
    setLock(false);
    setView("play");
  };

  const flip = (i) => {
    if (lock || open.includes(i) || matched.has(cards[i].word)) return;
    speak(cards[i].word);
    if (open.length === 0) {
      setOpen([i]);
      return;
    }
    const j = open[0];
    if (cards[j].word === cards[i].word) {
      const nm = new Set(matched).add(cards[i].word);
      setMatched(nm);
      setOpen([]);
      addStars(1);
      if (nm.size === words.length) {
        // 全部配對完成!失誤少拿越多星
        const s = misses <= 2 ? 3 : misses <= 5 ? 2 : 1;
        setGotStars(s);
        addStars(s);
        setProgress((p) => {
          const np = { ...p, [lv]: Math.max(p[lv] || 0, s) };
          saveProgress(MATCH_KEY, np);
          return np;
        });
        setTimeout(() => setView("clear"), 900);
      }
    } else {
      setOpen([j, i]);
      setLock(true);
      setMisses((m) => m + 1);
      setTimeout(() => {
        setOpen([]);
        setLock(false);
      }, 950);
    }
  };

  // ----- 關卡地圖 -----
  if (view === "map") {
    const crowns = Object.values(progress).filter((s) => s >= 3).length;
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 4px" }}>{t("跟認字快手同一套字!翻牌找到兩個一樣的字配成對。")}</p>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>{tf("記性越好星星越多!👑 {0} / {1}", crowns, SIGHT_LEVELS.length)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {SIGHT_LEVELS.map((_, i) => {
            const unlocked = i === 0 || (progress[i - 1] || 0) >= 1;
            const best = progress[i] || 0;
            return (
              <button
                key={i}
                onClick={() => unlocked && openLevel(i)}
                style={{
                  fontFamily: "inherit", fontWeight: 700, border: "none",
                  borderRadius: 18, padding: "12px 0 10px",
                  cursor: unlocked ? "pointer" : "default",
                  background: unlocked ? (best >= 3 ? "#FFF7DA" : T.card) : "#ECEAF6",
                  color: unlocked ? T.ink : "#C0BBDE",
                  boxShadow: unlocked ? "0 5px 0 #E0DBF7" : "none",
                  transition: "all .15s",
                }}
              >
                <div style={{ fontSize: 22 }}>
                  {unlocked ? (best >= 3 ? "👑" : i + 1) : "🔒"}
                </div>
                <div style={{ fontSize: 12, height: 16, color: T.yellowDark }}>
                  {best > 0 ? "⭐".repeat(best) : ""}
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 16 }}>{t("翻開的每張卡都會唸給你聽,慢慢找沒關係 💜")}</p>
      </div>
    );
  }

  // ----- 過關畫面 -----
  if (view === "clear") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{gotStars >= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0 4px" }}>{tf("第 {0} 關配對完成!", lv + 1)}</h2>
        <div style={{ fontSize: 34 }}>{"⭐".repeat(gotStars)}</div>
        <p style={{ color: T.sub, fontSize: 15, margin: "6px 0 18px" }}>
          {gotStars >= 3 ? t("記性太好了,拿到皇冠!") : t("5 對全部找到,好厲害!")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setView("map")}>{t("回關卡地圖")}</ChunkyButton>
          {lv + 1 < SIGHT_LEVELS.length && (
            <ChunkyButton color={T.green} dark={T.greenDark} onClick={() => openLevel(lv + 1)}>{t("下一關 →")}</ChunkyButton>
          )}
        </div>
      </div>
    );
  }

  // ----- 翻牌盤面 -----
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        <span>{tf("第 {0} 關", lv + 1)}</span>
        <span>{tf("找到 {0} / {1} 對 {2}", matched.size, words.length, "⭐".repeat(matched.size))}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {cards.map((c, i) => {
          const isUp = open.includes(i) || matched.has(c.word);
          const isMatched = matched.has(c.word);
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              style={{
                aspectRatio: "1 / 1.05",
                background: isMatched ? "#E9FBEF" : isUp ? "#FFF7DA" : T.purple,
                border: `3px solid ${isMatched ? T.green : isUp ? T.yellow : T.purpleDark}`,
                borderRadius: 18,
                fontFamily: "inherit",
                fontSize: isUp ? (c.word.length > 4 ? 17 : 22) : 30,
                fontWeight: 700,
                color: T.ink,
                cursor: isUp ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7",
                transition: "all .2s",
                opacity: isMatched ? 0.85 : 1,
              }}
            >
              {isUp ? c.word : "🎈"}
            </button>
          );
        })}
      </div>
      <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 14 }}>{t("點卡片翻開,找到兩張一樣的字!")}</p>
      <button
        onClick={() => setView("map")}
        style={{
          marginTop: 6, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
          background: "none", border: "none", color: T.sub, cursor: "pointer",
        }}
      >{t("← 回關卡地圖")}</button>
    </div>
  );
}

// ---------- 拼字小廚師(照順序點字母拼出單字)----------
const SPELL_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
function makeSpellRound() {
  const pool = ALL_WORDS.filter((w) => /^[a-z]{3,5}$/.test(w.en));
  const word = pool[Math.floor(Math.random() * pool.length)];
  const letters = word.en.split("");
  const extras = [];
  while (extras.length < 3) {
    const ch = SPELL_ALPHABET[Math.floor(Math.random() * 26)];
    if (!letters.includes(ch) && !extras.includes(ch)) extras.push(ch);
  }
  const tiles = shuffle([...letters, ...extras]).map((ch, i) => ({ ch, id: i }));
  return { word, tiles };
}

function SpellMode({ speak, addStars }) {
  const [round, setRound] = useState(makeSpellRound);
  const [used, setUsed] = useState(() => new Set()); // 用掉的字母磚 id
  const [filled, setFilled] = useState(0); // 已拼好前幾個字母
  const [wrongId, setWrongId] = useState(null);
  const [doneWord, setDoneWord] = useState(false);
  const [wins, setWins] = useState(0);
  const { word, tiles } = round;
  const target = word.en;

  useEffect(() => {
    speak.prefetch?.(target);
    const t = setTimeout(() => speak(target), 400);
    return () => clearTimeout(t);
  }, [round, target, speak]);

  const next = () => {
    setRound(makeSpellRound());
    setUsed(new Set());
    setFilled(0);
    setWrongId(null);
    setDoneWord(false);
  };

  const tap = (tile) => {
    if (doneWord || used.has(tile.id)) return;
    if (tile.ch === target[filled]) {
      const nf = filled + 1;
      setUsed((u) => new Set(u).add(tile.id));
      setFilled(nf);
      setWrongId(null);
      if (nf >= target.length) {
        setDoneWord(true);
        setWins((w) => w + 1);
        addStars(2);
        // 先用真人音檔唸單字,唸完再接稱讚
        speak(target, { rate: 0.95, onEnd: () => speak("Great job!", { rate: 1 }) });
      } else {
        // 唸剛拼上的字母名(加句點強迫走合成語音)
        speak(tile.ch.toUpperCase() + ".", { rate: 1 });
      }
    } else {
      setWrongId(tile.id);
      setTimeout(() => setWrongId(null), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("照順序點字母磚,把單字拼出來!拼好一個 +2 ⭐,已完成 {0} 個", wins)}</p>
      <div style={{ background: T.card, borderRadius: 24, padding: "22px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 56 }}>{word.emoji}</div>
        <div style={{ fontSize: 15, color: T.sub, marginBottom: 12 }}>{word.zh}</div>
        {/* 拼字格:淡淡的示範字母,拼對變綠 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 6 }}>
          {target.split("").map((ch, i) => {
            const isFilled = i < filled;
            const isNext = i === filled && !doneWord;
            return (
              <div
                key={i}
                style={{
                  width: 48, height: 56, borderRadius: 12,
                  display: "grid", placeItems: "center",
                  fontSize: 30, fontWeight: 700,
                  background: isFilled ? "#E9FBEF" : "#F6F4FE",
                  border: `3px solid ${isFilled ? T.green : isNext ? T.purple : "#E8E4FA"}`,
                  color: isFilled ? T.greenDark : "#C9C4E8",
                  transition: "all .15s",
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
        {doneWord && (
          <div style={{ marginTop: 10, fontSize: 20, color: T.greenDark, fontWeight: 700 }}>{tf("🎉 拼出 {0} 了!+2 ⭐", target)}</div>
        )}
      </div>
      {/* 字母磚 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
        maxWidth: 320, margin: "0 auto 14px" }}>
        {tiles.map((tile) => {
          const spent = used.has(tile.id);
          const isWrong = wrongId === tile.id;
          return (
            <button
              key={tile.id}
              onClick={() => tap(tile)}
              style={{
                padding: "16px 0", borderRadius: 16,
                fontFamily: "inherit", fontSize: 28, fontWeight: 700,
                background: spent ? "#F1EEFB" : isWrong ? "#FFEDED" : T.yellow,
                border: `3px solid ${isWrong ? T.red : spent ? "#E8E4FA" : T.yellowDark}`,
                color: spent ? "#D2CCED" : T.ink,
                cursor: spent ? "default" : "pointer",
                boxShadow: spent ? "none" : "0 4px 0 #E0B400",
                animation: isWrong ? "wp-shake .3s" : "none",
                transition: "all .15s",
              }}
            >
              {tile.ch}
            </button>
          );
        })}
      </div>
      {doneWord ? (
        <ChunkyButton color={T.green} dark={T.greenDark} onClick={next}>{t("下一個字 →")}</ChunkyButton>
      ) : (
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => speak(target)} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      )}
    </div>
  );
}

// ---------- 押韻火車(找出跟目標字押韻的字)----------
const RHYME_FAMILIES = () => PHONICS_GROUPS.flatMap((g) => PHONICS[g]);
function makeRhymeQ() {
  const fams = RHYME_FAMILIES();
  const fam = fams[Math.floor(Math.random() * fams.length)];
  const [target, correct] = shuffle(fam.ex);
  let other = fam;
  while (other.s === fam.s || fam.s.endsWith(other.s) || other.s.endsWith(fam.s))
    other = fams[Math.floor(Math.random() * fams.length)];
  const wrong = other.ex[Math.floor(Math.random() * other.ex.length)];
  return { s: fam.s, target, correct, options: shuffle([correct, wrong]) };
}

// 把字尾(字節)上色,幫小朋友看見「一樣的結尾」
function RhymeWord({ word, s, highlight, size = 28 }) {
  const idx = word.lastIndexOf(s);
  if (!highlight || idx < 0)
    return <span style={{ fontSize: size, fontWeight: 700 }}>{word}</span>;
  return (
    <span style={{ fontSize: size, fontWeight: 700 }}>
      {word.slice(0, idx)}
      <span style={{ color: T.pink }}>{s}</span>
      {word.slice(idx + s.length)}
    </span>
  );
}

function RhymeMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeRhymeQ);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetchMany?.([q.target, ...q.options]);
    const t = setTimeout(() => speak(q.target, { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (w) => {
    if (picked) return;
    setPicked(w);
    const ok = w === q.correct;
    if (ok) {
      setRight((r) => r + 1);
      addStars(1);
      setFeedback(tf("🎉 {0} 和 {1} 都是 -{2} 結尾,押韻!", q.target, w, q.s));
      // 兩個字各自用真人音檔連著唸
      speak(q.target, { rate: 0.9, onEnd: () => speak(w, { rate: 0.9 }) });
    } else {
      setFeedback(tf("沒關係!{0} 的好朋友是 {1},聽聽看 👂", q.target, q.correct));
      speak(q.target, { rate: 0.75, onEnd: () => speak(q.correct, { rate: 0.75 }) });
    }
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else {
        setRoundNo((r) => r + 1);
        setQ(makeRhymeQ());
        setPicked(null);
        setFeedback("");
      }
    }, 2100);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🚂"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("押韻列車載到 {0} / {1} 位乘客!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeRhymeQ()); setPicked(null); setFeedback(""); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・哪個字跟它「結尾聲音一樣」?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ marginBottom: 8 }}>
          <RhymeWord word={q.target} s={q.s} highlight size={40} />
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => speak(q.target, { rate: 0.85 })} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {q.options.map((w) => {
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (w === q.correct) { bg = "#E9FBEF"; bd = T.green; }
            else if (w === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "20px 8px", fontFamily: "inherit",
                color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
              <RhymeWord word={w} s={q.s} highlight={!!picked && w === q.correct} />
              <span
                onClick={(e) => { e.stopPropagation(); speak(w, { rate: 0.85 }); }}
                style={{ fontSize: 14, color: T.sub, fontWeight: 700 }}
              >{t("🔈 聽聽看")}</span>
            </button>
          );
        })}
      </div>
      {feedback && (
        <div style={{ marginTop: 14, fontSize: 15, color: picked === q.correct ? T.greenDark : T.sub, fontWeight: 700 }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

// ---------- 大小寫配對(找出對應的大小寫字母)----------
function makeCaseQ() {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = abc[Math.floor(Math.random() * 26)];
  const dir = Math.random() < 0.5 ? "u2l" : "l2u"; // 看大寫找小寫 / 看小寫找大寫
  const others = new Set([L]);
  while (others.size < 3) others.add(abc[Math.floor(Math.random() * 26)]);
  return { L, dir, options: shuffle([...others]) };
}

function CaseMatchMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeCaseQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const shown = q.dir === "u2l" ? q.L : q.L.toLowerCase();
  const optCase = (ch) => (q.dir === "u2l" ? ch.toLowerCase() : ch);

  useEffect(() => {
    const t = setTimeout(() => speak(q.L + ".", { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (ch) => {
    if (picked) return;
    setPicked(ch);
    const ok = ch === q.L;
    if (ok) {
      setRight((r) => r + 1);
      addStars(1);
      speak(q.L + "! Great job!", { rate: 0.95 });
    } else {
      speak(q.L + ".", { rate: 0.75 });
    }
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else {
        setRoundNo((r) => r + 1);
        setQ(makeCaseQ());
        setPicked(null);
      }
    }, 1500);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("配對成功 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeCaseQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・大寫小寫是一家人,找出它的家人!", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: T.purple, lineHeight: 1.1 }}>
          {shown}
        </div>
        <div style={{ color: T.sub, fontSize: 15, fontWeight: 700 }}>{q.dir === "u2l" ? t("它的小寫是哪一個?") : t("它的大寫是哪一個?")}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((ch) => {
          const isAns = ch === q.L;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (ch === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={ch} onClick={() => pick(ch)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 40,
                fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {optCase(ch)}
            </button>
          );
        })}
      </div>
      {picked && picked !== q.L && (
        <div style={{ marginTop: 14, fontSize: 15, color: T.sub, fontWeight: 700 }}>{tf("沒關係!{0} 的家人是 {1},看看它們長得像不像 👀", shown, optCase(q.L))}</div>
      )}
    </div>
  );
}

// ---------- 尾音偵探(這個字的結尾字母)----------
function makeEndSoundQ() {
  const pool = ALL_WORDS.filter((w) => /^[a-z]+$/i.test(w.en));
  const ans = pool[Math.floor(Math.random() * pool.length)];
  const last = ans.en[ans.en.length - 1].toUpperCase();
  const letters = new Set([last]);
  while (letters.size < 3) {
    const other = pool[Math.floor(Math.random() * pool.length)];
    const L = other.en[other.en.length - 1].toUpperCase();
    if (L !== last) letters.add(L);
  }
  return { ans, last, options: shuffle([...letters]) };
}

function EndSoundMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeEndSoundQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetch?.(q.ans.en);
    const t = setTimeout(() => speak(q.ans.en), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (L) => {
    if (picked) return;
    setPicked(L);
    const ok = L === q.last;
    // 字母名用合成、單字接真人音檔
    if (ok) { setRight((r) => r + 1); addStars(1); speak(L + ".", { rate: 0.9, onEnd: () => speak(q.ans.en, { rate: 0.9 }) }); }
    else speak(q.last + ".", { rate: 0.8, onEnd: () => speak(q.ans.en, { rate: 0.8 }) });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeEndSoundQ()); setPicked(null); }
    }, 1600);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🦶"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("尾音破案 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeEndSoundQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{tf("第 {0} / {1} 題・這個字的「結尾字母」是哪一個?🦶", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        textAlign: "center", marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.ans.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, margin: "6px 0 12px" }}>
          {picked ? q.ans.en : q.ans.en.slice(0, -1) + "_"}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(q.ans.en)}
          style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((L) => {
          const isAns = L === q.last;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (L === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={L} onClick={() => pick(L)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "20px 0", fontFamily: "inherit", fontSize: 34,
                fontWeight: 700, color: T.purple, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {L}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 字母獵人(聽字母名找字母)----------
function makeHuntQ() {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const target = abc[Math.floor(Math.random() * 26)];
  const lower = Math.random() < 0.5;
  const set = new Set([target]);
  while (set.size < 6) set.add(abc[Math.floor(Math.random() * 26)]);
  return { target, lower, options: shuffle([...set]) };
}

function LetterHuntMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeHuntQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const disp = (ch) => (q.lower ? ch.toLowerCase() : ch);

  useEffect(() => {
    const t = setTimeout(() => speak(q.target + ".", { rate: 0.8 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (ch) => {
    if (picked) return;
    setPicked(ch);
    const ok = ch === q.target;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(q.target + "! Great job!", { rate: 0.95 }); }
    else speak(q.target + ".", { rate: 0.75 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeHuntQ()); setPicked(null); }
    }, 1400);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔎"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("獵到 {0} / {1} 個字母!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeHuntQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・仔細聽,把唸到的字母找出來!", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        {picked && (
          <div style={{ fontSize: 30, fontWeight: 700, color: T.purple, marginBottom: 8 }}>
            {disp(q.target)}
          </div>
        )}
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => speak(q.target + ".", { rate: 0.8 })} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((ch) => {
          const isAns = ch === q.target;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (ch === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={ch} onClick={() => pick(ch)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 38,
                fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {disp(ch)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 少了誰?(觀察記憶)----------
function makeMissingQ(count) {
  const pool = ALL_WORDS.filter((w) => /^[a-z]+$/i.test(w.en));
  const items = shuffle(pool).slice(0, count);
  const missing = items[Math.floor(Math.random() * items.length)];
  return { items, missing };
}

function MissingMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(() => makeMissingQ(3));
  const [phase, setPhase] = useState("memorize"); // memorize | guess
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  // 選項順序每題洗一次就固定,不隨畫面更新亂跳
  const options = useMemo(() => shuffle([...q.items]), [q]);

  useEffect(() => {
    if (phase === "memorize")
      speak.prefetchMany?.(q.items.map((w) => w.en));
  }, [q, phase, speak]);

  const nextRound = () => {
    const r = roundNo + 1;
    setRoundNo(r);
    setQ(makeMissingQ(r > 4 ? 4 : 3)); // 後半場升級成 4 樣
    setPhase("memorize");
    setPicked(null);
  };

  const pick = (w) => {
    if (picked) return;
    setPicked(w.en);
    const ok = w.en === q.missing.en;
    if (ok) {
      setRight((r) => r + 1); addStars(1);
      speak(w.en, { rate: 0.95, onEnd: () => speak("Great job!", { rate: 1 }) });
    } else {
      speak(q.missing.en, { rate: 0.8 });
    }
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else nextRound();
    }, 1700);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🧠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("找到 {0} / {1} 個失蹤的朋友!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeMissingQ(3)); setPhase("memorize"); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  if (phase === "memorize")
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・記住它們!等一下有一個會躲起來 👀", roundNo, TOTAL)}</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${q.items.length}, 1fr)`, gap: 10, marginBottom: 16 }}>
          {q.items.map((w) => (
            <button key={w.en} onClick={() => speak(w.en)}
              style={{
                background: T.card, border: "3px solid #E8E4FA", borderRadius: 20,
                padding: "18px 4px", fontFamily: "inherit", cursor: "pointer",
                boxShadow: "0 5px 0 #E0DBF7",
              }}>
              <div style={{ fontSize: 44 }}>{w.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{w.en}</div>
            </button>
          ))}
        </div>
        <ChunkyButton color={T.pink} dark="#D14B7D" onClick={() => setPhase("guess")}
          style={{ width: "100%" }}>{t("👌 我記好了!")}</ChunkyButton>
      </div>
    );

  const remaining = q.items.filter((w) => w.en !== q.missing.en);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・有一個躲起來了,是誰呢?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", fontSize: 44 }}>
          {remaining.map((w) => (
            <span key={w.en}>{w.emoji}</span>
          ))}
          <span style={{ opacity: 0.5 }}>❓</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${q.items.length}, 1fr)`, gap: 10 }}>
        {options.map((w) => {
          const isAns = w.en === q.missing.en;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (w.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w.en} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "14px 4px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 36 }}>{w.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{w.en}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 相反詞配對 ----------
const OPPOSITES = [
  { a: { en: "big", zh: "大", emoji: "🐘" }, b: { en: "small", zh: "小", emoji: "🐭" } },
  { a: { en: "hot", zh: "熱", emoji: "🥵" }, b: { en: "cold", zh: "冷", emoji: "🥶" } },
  { a: { en: "happy", zh: "開心", emoji: "😀" }, b: { en: "sad", zh: "難過", emoji: "😢" } },
  { a: { en: "up", zh: "上", emoji: "⬆️" }, b: { en: "down", zh: "下", emoji: "⬇️" } },
  { a: { en: "open", zh: "打開", emoji: "📭" }, b: { en: "close", zh: "關上", emoji: "📪" } },
  { a: { en: "in", zh: "裡面", emoji: "📥" }, b: { en: "out", zh: "外面", emoji: "📤" } },
  { a: { en: "fast", zh: "快", emoji: "🐇" }, b: { en: "slow", zh: "慢", emoji: "🐢" } },
  { a: { en: "wet", zh: "濕", emoji: "💦" }, b: { en: "dry", zh: "乾", emoji: "🌵" } },
  { a: { en: "day", zh: "白天", emoji: "☀️" }, b: { en: "night", zh: "晚上", emoji: "🌙" } },
  { a: { en: "long", zh: "長", emoji: "🐍" }, b: { en: "short", zh: "短", emoji: "🐛" } },
];
function makeOppositeQ() {
  const pair = OPPOSITES[Math.floor(Math.random() * OPPOSITES.length)];
  const flip = Math.random() < 0.5;
  const shown = flip ? pair.b : pair.a;
  const answer = flip ? pair.a : pair.b;
  const others = [];
  while (others.length < 2) {
    const p2 = OPPOSITES[Math.floor(Math.random() * OPPOSITES.length)];
    const c = Math.random() < 0.5 ? p2.a : p2.b;
    if (c.en !== shown.en && c.en !== answer.en && !others.some((o) => o.en === c.en))
      others.push(c);
  }
  return { shown, answer, options: shuffle([answer, ...others]) };
}

function OppositeMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeOppositeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetchMany?.([q.shown.en, ...q.options.map((o) => o.en)]);
    const t = setTimeout(() => speak(q.shown.en, { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (w) => {
    if (picked) return;
    setPicked(w.en);
    const ok = w.en === q.answer.en;
    if (ok) {
      setRight((r) => r + 1); addStars(1);
      // 兩個相反詞用真人音檔連著唸
      speak(q.shown.en, { rate: 0.9, onEnd: () => speak(q.answer.en, { rate: 0.9 }) });
    } else {
      speak(q.shown.en, { rate: 0.75, onEnd: () => speak(q.answer.en, { rate: 0.75 }) });
    }
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeOppositeQ()); setPicked(null); }
    }, 1900);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "↔️"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("配對 {0} / {1} 組相反詞!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeOppositeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・它的「相反」是哪一個?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 56 }}>{q.shown.emoji}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: T.ink }}>{q.shown.en}</div>
        <div style={{ fontSize: 14, color: T.sub, marginBottom: 10 }}>{q.shown.zh}</div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => speak(q.shown.en, { rate: 0.85 })} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((w) => {
          const isAns = w.en === q.answer.en;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (w.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w.en} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "16px 4px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 38 }}>{w.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{w.en}</div>
              <div style={{ fontSize: 12, color: T.sub }}>{w.zh}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 共用:a / an ----------
const artA = (w) => (/^[aeiou]/.test(w) ? "an" : "a");

// ---------- 聽指令做動作(Touch the cat!)----------
const LISTEN_CATS = [
  "動物 Animals", "水果 Fruits", "食物 Food", "身體 Body", "衣服 Clothes",
  "交通 Transport", "學校 School", "居家 Home", "自然 Nature", "玩具 Toys",
];
const listenPool = () =>
  LISTEN_CATS.flatMap((c) => WORD_BANK[c]).filter((w) => !w.en.includes("color"));

function makeListenQ() {
  const options = shuffle(listenPool()).slice(0, 4);
  return { options, target: options[Math.floor(Math.random() * 4)] };
}

function ListenDoMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeListenQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(
    () => speak(`Touch the ${q.target.en}!`, { rate: 0.85 }),
    [q, speak]
  );
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (w) => {
    if (picked) return;
    setPicked(w.en);
    const ok = w.en === q.target.en;
    if (ok) { setRight((r) => r + 1); addStars(1); speak("Great job!", { rate: 1 }); }
    else speak(`This is the ${q.target.en}!`, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeListenQ()); setPicked(null); }
    }, 1500);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🎧"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("聽懂了 {0} / {1} 個指令!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeListenQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・仔細聽指令,點出正確的圖!", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {q.options.map((w) => {
          const isAns = w.en === q.target.en;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (w.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w.en} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 20,
                padding: "20px 8px", fontFamily: "inherit",
                cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 52 }}>{w.emoji}</div>
              {picked && isAns && (
                <div style={{ fontSize: 16, fontWeight: 700, color: T.greenDark, marginTop: 4 }}>
                  {w.en}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 數數小市場(three apples!)----------
const COUNT_NAMES = [
  "apple", "banana", "lemon", "egg", "cookie", "cake", "star", "flower",
  "tree", "ball", "robot", "kite", "balloon", "drum", "car", "bus", "boat",
  "duck", "dog", "cat", "bear", "pig", "cow", "frog", "bird", "book", "hat",
];
const NUM_WORDS = ["one", "two", "three", "four", "five", "six"];
function makeCountQ() {
  const pool = ALL_WORDS.filter((w) => COUNT_NAMES.includes(w.en));
  const item = pool[Math.floor(Math.random() * pool.length)];
  const n = 1 + Math.floor(Math.random() * 6);
  const counts = new Set([n]);
  while (counts.size < 3) counts.add(1 + Math.floor(Math.random() * 6));
  return { item, n, options: shuffle([...counts]) };
}

function CountMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeCountQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const phrase = `${NUM_WORDS[q.n - 1]} ${q.item.en}${q.n > 1 ? "s" : ""}`;
  const say = useCallback(
    () => speak(phrase + "!", { rate: 0.8 }),
    [phrase, speak]
  );
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (k) => {
    if (picked !== null) return;
    setPicked(k);
    const ok = k === q.n;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(`Yes! ${phrase}!`, { rate: 0.9 }); }
    else speak(phrase + ".", { rate: 0.7 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeCountQ()); setPicked(null); }
    }, 1700);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔢"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("數對了 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeCountQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・聽數量,點出正確的那一堆!", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        {picked !== null && (
          <div style={{ fontSize: 26, fontWeight: 700, color: T.purple, marginBottom: 8 }}>
            {q.n} · {phrase}
          </div>
        )}
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((k) => {
          const isAns = k === q.n;
          let bg = T.card, bd = "#E8E4FA";
          if (picked !== null) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (k === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={k} onClick={() => pick(k)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "14px 6px", fontFamily: "inherit", minHeight: 96,
                cursor: picked !== null ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
                {Array.from({ length: k }).map((_, i) => (
                  <span key={i} style={{ fontSize: 24 }}>{q.item.emoji}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 是不是?(Is it a cat?)----------
function makeYesNoQ() {
  const pool = listenPool();
  const item = pool[Math.floor(Math.random() * pool.length)];
  const isYes = Math.random() < 0.5;
  let asked = item;
  if (!isYes) {
    do { asked = pool[Math.floor(Math.random() * pool.length)]; } while (asked.en === item.en);
  }
  return { item, asked, isYes };
}

function YesNoMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeYesNoQ);
  const [picked, setPicked] = useState(null); // "yes" | "no"
  const [done, setDone] = useState(false);

  const say = useCallback(
    () => speak(`Is it ${artA(q.asked.en)} ${q.asked.en}?`, { rate: 0.85 }),
    [q, speak]
  );
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (ans) => {
    if (picked) return;
    setPicked(ans);
    const ok = (ans === "yes") === q.isYes;
    if (ok) {
      setRight((r) => r + 1); addStars(1);
      speak(q.isYes ? `Yes! ${artA(q.item.en)} ${q.item.en}!` : `No! It's ${artA(q.item.en)} ${q.item.en}!`, { rate: 0.9 });
    } else {
      speak(`It's ${artA(q.item.en)} ${q.item.en}.`, { rate: 0.75 });
    }
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeYesNoQ()); setPicked(null); }
    }, 1700);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "❓"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("答對 {0} / {1} 題!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeYesNoQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  const correctAns = q.isYes ? "yes" : "no";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・聽問題,它「是不是」呢?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 72 }}>{q.item.emoji}</div>
        {picked && (
          <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, margin: "4px 0 8px" }}>{tf("{0}(問的是 {1})", q.item.en, q.asked.en)}</div>
        )}
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[["yes", "✅ Yes!"], ["no", "❌ No!"]].map(([v, label]) => {
          let bg = v === "yes" ? T.green : T.red;
          let dark = v === "yes" ? T.greenDark : "#C94F4E";
          const dim = picked && v !== correctAns;
          return (
            <ChunkyButton key={v} color={bg} dark={dark}
              onClick={() => pick(v)}
              style={{ fontSize: 24, opacity: dim ? 0.45 : 1 }}>
              {label}
            </ChunkyButton>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 聽顏色著色(Color the star blue!)----------
const COLOR_OPTS = [
  { en: "red", zh: "紅色", css: "#E74C3C" },
  { en: "blue", zh: "藍色", css: "#3498DB" },
  { en: "yellow", zh: "黃色", css: "#F1C40F" },
  { en: "green", zh: "綠色", css: "#2ECC71" },
  { en: "purple", zh: "紫色", css: "#9B59B6" },
  { en: "pink", zh: "粉紅色", css: "#FD79A8" },
  { en: "orange", zh: "橘色", css: "#E67E22" },
  { en: "brown", zh: "棕色", css: "#8D6E63" },
];
const COLOR_SHAPES = [
  { en: "circle", zh: "圓形" },
  { en: "square", zh: "正方形" },
  { en: "star", zh: "星星" },
  { en: "triangle", zh: "三角形" },
];
function makeColorQ() {
  const shape = COLOR_SHAPES[Math.floor(Math.random() * COLOR_SHAPES.length)];
  const color = COLOR_OPTS[Math.floor(Math.random() * COLOR_OPTS.length)];
  const opts = new Set([color]);
  while (opts.size < 4)
    opts.add(COLOR_OPTS[Math.floor(Math.random() * COLOR_OPTS.length)]);
  return { shape, color, options: shuffle([...opts]) };
}

function ShapeView({ shape, fill }) {
  const base = {
    width: 130, height: 130, margin: "0 auto",
    background: fill || "#DDD8F0", transition: "background .3s",
  };
  if (shape === "circle") return <div style={{ ...base, borderRadius: "50%" }} />;
  if (shape === "square") return <div style={{ ...base, borderRadius: 18 }} />;
  if (shape === "triangle")
    return <div style={{ ...base, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />;
  return (
    <div style={{ ...base,
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
  );
}

function ColorGameMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeColorQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(
    () => speak(`Color the ${q.shape.en} ${q.color.en}!`, { rate: 0.85 }),
    [q, speak]
  );
  useEffect(() => {
    speak.prefetch?.(q.color.en);
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say, speak]);

  const pick = (c) => {
    if (picked) return;
    setPicked(c.en);
    const ok = c.en === q.color.en;
    // 顏色單字用真人音檔
    if (ok) { setRight((r) => r + 1); addStars(1); speak(q.color.en, { rate: 0.95, onEnd: () => speak("Great job!", { rate: 1 }) }); }
    else speak(q.color.en, { rate: 0.7 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeColorQ()); setPicked(null); }
    }, 1700);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🎨"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("塗對 {0} / {1} 個顏色!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeColorQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  const filled = picked ? q.color.css : null;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・聽聽要塗什麼顏色!({2})", roundNo, TOTAL, q.shape.zh)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <ShapeView shape={q.shape.en} fill={filled} />
        <div style={{ marginTop: 12 }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {q.options.map((c) => {
          const isAns = c.en === q.color.en;
          return (
            <button key={c.en} onClick={() => pick(c)}
              style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                background: T.card, borderRadius: 16, padding: "10px 4px",
                border: `3px solid ${picked && isAns ? T.green : "#E8E4FA"}`,
                cursor: picked ? "default" : "pointer",
                boxShadow: "0 4px 0 #E0DBF7", color: T.ink,
                opacity: picked && !isAns ? 0.5 : 1, transition: "all .15s",
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: c.css,
                margin: "0 auto 6px", border: "3px solid #fff",
                boxShadow: "0 0 0 2px #E8E4FA",
              }} />
              {c.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 分類小幫手(Where does the cat go?)----------
const SORT_CATS = [
  { cat: "動物 Animals", en: "Animals", zh: "動物", emoji: "🐾" },
  { cat: "水果 Fruits", en: "Fruits", zh: "水果", emoji: "🍓" },
  { cat: "食物 Food", en: "Food", zh: "食物", emoji: "🍽️" },
  { cat: "交通 Transport", en: "Transport", zh: "交通工具", emoji: "🚗" },
  { cat: "衣服 Clothes", en: "Clothes", zh: "衣服", emoji: "👕" },
  { cat: "玩具 Toys", en: "Toys", zh: "玩具", emoji: "🧸" },
];
function makeSortRound() {
  const [a, b] = shuffle(SORT_CATS).slice(0, 2);
  const items = shuffle([
    ...shuffle(WORD_BANK[a.cat]).slice(0, 3).map((w) => ({ ...w, catKey: a.cat })),
    ...shuffle(WORD_BANK[b.cat]).slice(0, 3).map((w) => ({ ...w, catKey: b.cat })),
  ]);
  return { baskets: [a, b], items };
}

function SortMode({ speak, addStars }) {
  const [round, setRound] = useState(makeSortRound);
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState({}); // catKey -> [items]
  const [flash, setFlash] = useState(null); // 剛答的籃子 catKey
  const [lock, setLock] = useState(false);
  const [right, setRight] = useState(0);
  const item = round.items[idx];
  const done = idx >= round.items.length;

  useEffect(() => {
    if (item) {
      const t = setTimeout(
        () => speak(`Where does the ${item.en} go?`, { rate: 0.85 }),
        400
      );
      return () => clearTimeout(t);
    }
  }, [item, speak]);

  const restart = () => {
    setRound(makeSortRound()); setIdx(0); setPlaced({});
    setFlash(null); setLock(false); setRight(0);
  };

  const drop = (basket) => {
    if (lock || !item) return;
    const ok = basket.cat === item.catKey;
    setLock(true);
    if (ok) {
      setRight((r) => r + 1);
      addStars(1);
      speak(`Yes! The ${item.en} is ${artA(basket.en.toLowerCase())}... ${basket.en}!`, { rate: 0.95 });
      setFlash(basket.cat);
      setPlaced((p) => ({ ...p, [basket.cat]: [...(p[basket.cat] || []), item] }));
      setTimeout(() => { setFlash(null); setIdx((i) => i + 1); setLock(false); }, 1200);
    } else {
      speak(`Hmm, the ${item.en} is not ${basket.en}. Try again!`, { rate: 0.85 });
      setTimeout(() => setLock(false), 1200);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>🧺</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("全部整理好了!+{0} ⭐", right)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }} onClick={restart}>{t("再整理一籃")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 個・它是哪一類?點對的籃子!", idx + 1, round.items.length)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 64 }}>{item.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.ink }}>{item.en}</div>
        <div style={{ fontSize: 14, color: T.sub }}>{item.zh}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {round.baskets.map((b) => (
          <button key={b.cat} onClick={() => drop(b)}
            style={{
              background: flash === b.cat ? "#E9FBEF" : "#FFF7DA",
              border: `3px solid ${flash === b.cat ? T.green : T.yellow}`,
              borderRadius: 20, padding: "14px 8px", fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 5px 0 #E0B400",
              transition: "all .15s", minHeight: 120,
            }}>
            <div style={{ fontSize: 34 }}>🧺</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.ink }}>
              {b.emoji} {b.en}
            </div>
            <div style={{ fontSize: 13, color: T.sub, fontWeight: 700 }}>{b.zh}</div>
            <div style={{ fontSize: 20, minHeight: 26 }}>
              {(placed[b.cat] || []).map((it, i) => (
                <span key={i}>{it.emoji}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- 單字泡泡(點破唸到的泡泡)----------
function makeBubbleRound() {
  const pool = ALL_WORDS.filter((w) => /^[a-z]{2,6}$/.test(w.en));
  const words = shuffle(pool).slice(0, 4);
  return { words, target: words[Math.floor(Math.random() * 4)], key: Math.random() };
}
const BUBBLE_COLORS = ["#D6EBFF", "#FFE3EE", "#E3FBE9", "#FFF3D6"];

function BubbleMode({ speak, addStars }) {
  const TOTAL = 8;
  const [round, setRound] = useState(makeBubbleRound);
  const [pops, setPops] = useState(0);
  const [popping, setPopping] = useState(null); // 被點破的字
  const [cheer, setCheer] = useState("");
  const [done, setDone] = useState(false);

  const say = useCallback(
    () => speak(round.target.en, { rate: 0.85 }),
    [round, speak]
  );
  useEffect(() => {
    if (!done) {
      speak.prefetchMany?.(round.words.map((w) => w.en));
      const t = setTimeout(say, 500);
      return () => clearTimeout(t);
    }
  }, [round, say, done, speak]);

  const tap = (w) => {
    if (popping) return;
    if (w.en === round.target.en) {
      setPopping(w.en);
      setCheer("");
      addStars(1);
      speak("Pop! Great job!", { rate: 1 });
      const np = pops + 1;
      setTimeout(() => {
        setPopping(null);
        setPops(np);
        if (np >= TOTAL) setDone(true);
        else setRound(makeBubbleRound());
      }, 700);
    } else {
      setCheer(tf("再聽聽看,要找的是哪個泡泡?🫧"));
      say();
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>🫧✨</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("戳破了 {0} 個泡泡!", TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setPops(0); setDone(false); setRound(makeBubbleRound()); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{tf("聽聲音,戳破正確的泡泡!{0} / {1} 🫧", pops, TOTAL)}</div>
      <div
        style={{
          position: "relative", height: 330, overflow: "hidden",
          background: "linear-gradient(#EAF6FF, #F6FBFF)",
          borderRadius: 24, border: "3px solid #E8E4FA",
          boxShadow: "0 6px 0 #E0DBF7", marginBottom: 12,
        }}
      >
        {round.words.map((w, i) => (
          <button
            key={`${round.key}-${w.en}`}
            onClick={() => tap(w)}
            style={{
              position: "absolute", left: `${4 + i * 24}%`, bottom: -110,
              width: 88, height: 88, borderRadius: "50%",
              background: popping === w.en ? "transparent" : BUBBLE_COLORS[i],
              border: popping === w.en ? "none" : "3px solid #FFFFFFCC",
              boxShadow: popping === w.en ? "none" : "inset -6px -8px 0 #FFFFFF88, 0 3px 8px #B9D4EE66",
              fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              animation: `wp-float ${11 + i * 3.5}s linear infinite`,
              animationDelay: `${-i * 4.2}s`,
              animationPlayState: popping ? "paused" : "running",
            }}
          >
            {popping === w.en ? (
              <span style={{ fontSize: 40 }}>⭐</span>
            ) : (
              <>
                <span style={{ fontSize: 26 }}>{w.emoji}</span>
                <span style={{ fontSize: 14, color: T.ink }}>{w.en}</span>
              </>
            )}
          </button>
        ))}
      </div>
      <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      {cheer && (
        <div style={{ marginTop: 10, fontSize: 15, color: T.sub, fontWeight: 700 }}>{cheer}</div>
      )}
    </div>
  );
}

// ---------- 迷你圖文故事 ----------
const STORIES = [
  {
    title: "小貓吃魚", emoji: "🐱",
    lines: [
      { en: "The cat is hungry.", zh: "小貓肚子餓了", emoji: "🐱" },
      { en: "The cat eats a fish.", zh: "小貓吃了一條魚", emoji: "🐟" },
      { en: "The cat is happy!", zh: "小貓好開心!", emoji: "😀" },
    ],
    q: { en: "What does the cat eat?", zh: "小貓吃了什麼?", ans: "fish",
      options: [{ en: "fish", emoji: "🐟" }, { en: "apple", emoji: "🍎" }, { en: "ball", emoji: "⚽" }] },
  },
  {
    title: "小狗玩球", emoji: "🐶",
    lines: [
      { en: "The dog sees a ball.", zh: "小狗看到一顆球", emoji: "🐶" },
      { en: "The dog runs!", zh: "小狗跑起來!", emoji: "🏃" },
      { en: "The dog plays with the ball.", zh: "小狗玩球", emoji: "⚽" },
    ],
    q: { en: "What does the dog play with?", zh: "小狗玩什麼?", ans: "ball",
      options: [{ en: "ball", emoji: "⚽" }, { en: "fish", emoji: "🐟" }, { en: "cake", emoji: "🎂" }] },
  },
  {
    title: "下雨天", emoji: "🌧️",
    lines: [
      { en: "It is rainy.", zh: "下雨了", emoji: "🌧️" },
      { en: "Mom opens the umbrella.", zh: "媽媽打開雨傘", emoji: "☂️" },
      { en: "We walk to school.", zh: "我們走路去學校", emoji: "🏫" },
    ],
    q: { en: "What does Mom open?", zh: "媽媽打開了什麼?", ans: "umbrella",
      options: [{ en: "umbrella", emoji: "☂️" }, { en: "door", emoji: "🚪" }, { en: "book", emoji: "📖" }] },
  },
  {
    title: "我的生日", emoji: "🎂",
    lines: [
      { en: "Today is my birthday.", zh: "今天是我的生日", emoji: "🎉" },
      { en: "I eat cake with my family.", zh: "我和家人一起吃蛋糕", emoji: "🎂" },
      { en: "I am so happy!", zh: "我好開心!", emoji: "🤩" },
    ],
    q: { en: "What do I eat?", zh: "我吃了什麼?", ans: "cake",
      options: [{ en: "cake", emoji: "🎂" }, { en: "egg", emoji: "🥚" }, { en: "grapes", emoji: "🍇" }] },
  },
  {
    title: "樹上的小鳥", emoji: "🐦",
    lines: [
      { en: "A bird is in the tree.", zh: "有隻小鳥在樹上", emoji: "🌳" },
      { en: "The bird sings.", zh: "小鳥在唱歌", emoji: "🎤" },
      { en: "I listen to the bird.", zh: "我聽小鳥唱歌", emoji: "🎧" },
    ],
    q: { en: "Where is the bird?", zh: "小鳥在哪裡?", ans: "tree",
      options: [{ en: "tree", emoji: "🌳" }, { en: "car", emoji: "🚗" }, { en: "bed", emoji: "🛏️" }] },
  },
  {
    title: "小熊晚安", emoji: "🐻",
    lines: [
      { en: "The bear is tired.", zh: "小熊好累", emoji: "🐻" },
      { en: "The bear goes to bed.", zh: "小熊去睡覺", emoji: "🛏️" },
      { en: "Good night, bear!", zh: "小熊晚安!", emoji: "🌙" },
    ],
    q: { en: "Where does the bear go?", zh: "小熊去哪裡?", ans: "bed",
      options: [{ en: "bed", emoji: "🛏️" }, { en: "school", emoji: "🏫" }, { en: "sea", emoji: "🌊" }] },
  },
  {
    title: "去海邊", emoji: "🏖️",
    lines: [
      { en: "We ride the bus.", zh: "我們搭公車", emoji: "🚌" },
      { en: "The bus goes fast!", zh: "公車跑得好快!", emoji: "💨" },
      { en: "We go to the beach.", zh: "我們到海邊了", emoji: "🏖️" },
    ],
    q: { en: "Where do we go?", zh: "我們去哪裡?", ans: "beach",
      options: [{ en: "beach", emoji: "🏖️" }, { en: "school", emoji: "🏫" }, { en: "mountain", emoji: "⛰️" }] },
  },
  {
    title: "小猴子吃香蕉", emoji: "🐵",
    lines: [
      { en: "The monkey is hungry.", zh: "小猴子肚子餓", emoji: "🐵" },
      { en: "The monkey eats a banana.", zh: "小猴子吃香蕉", emoji: "🍌" },
      { en: "Yummy, yummy!", zh: "好好吃呀!", emoji: "😋" },
    ],
    q: { en: "What does the monkey eat?", zh: "小猴子吃了什麼?", ans: "banana",
      options: [{ en: "banana", emoji: "🍌" }, { en: "pizza", emoji: "🍕" }, { en: "leaf", emoji: "🍃" }] },
  },
];

function StoryMode({ speak, addStars }) {
  const [si, setSi] = useState(0);
  const [heard, setHeard] = useState(() => new Set());
  const [picked, setPicked] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const story = STORIES[si];
  const allHeard = heard.size >= story.lines.length;
  useEffect(() => {
    speak.prefetchMany?.([story.q.ans, ...story.q.options.map((o) => o.en)]);
  }, [story, speak]);

  const goStory = (i) => {
    setSi(i); setHeard(new Set()); setPicked(null); setCelebrate(false);
  };

  const pick = (opt) => {
    if (picked) return;
    setPicked(opt.en);
    const ok = opt.en === story.q.ans;
    if (ok) {
      addStars(2);
      setCelebrate(true);
      // 答案單字用真人音檔,唸完接稱讚
      speak(story.q.ans, { rate: 0.95, onEnd: () => speak("Great job!", { rate: 1 }) });
    } else {
      speak(story.q.ans, { rate: 0.75 });
      setTimeout(() => setPicked(null), 1500); // 再試一次,直到答對
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 10px" }}>{tf("第 {0} / {1} 個小故事・每句都點一下聽,聽完回答問題!", si + 1, STORIES.length)}</p>
      <h2 style={{ color: T.ink, fontSize: 22, margin: "0 0 12px" }}>
        {story.emoji} {story.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {story.lines.map((ln, i) => {
          const ok = heard.has(i);
          return (
            <button key={i}
              onClick={() => { speak(ln.en, { rate: 0.8 }); setHeard((s) => new Set(s).add(i)); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                background: ok ? "#E9FBEF" : T.card,
                border: `3px solid ${ok ? T.green : "#E8E4FA"}`,
                borderRadius: 18, padding: "12px 14px", fontFamily: "inherit",
                cursor: "pointer", boxShadow: "0 4px 0 #E0DBF7", transition: "all .15s",
              }}>
              <span style={{ fontSize: 36 }}>{ln.emoji}</span>
              <span>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.ink }}>{ln.en}</div>
                <div style={{ fontSize: 13, color: T.sub }}>{ln.zh}</div>
              </span>
              <span style={{ marginLeft: "auto", fontSize: 14, color: ok ? T.greenDark : "#C9C4E8" }}>
                {ok ? "✓" : "🔈"}
              </span>
            </button>
          );
        })}
      </div>

      {allHeard && (
        <div style={{ background: T.card, borderRadius: 22, padding: "16px",
          boxShadow: "0 5px 0 #E0DBF7", marginBottom: 12 }}>
          <button
            onClick={() => speak(story.q.en, { rate: 0.8 })}
            style={{ background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: T.purple }}>
              ❓ {story.q.en} 🔈
            </div>
            <div style={{ fontSize: 14, color: T.sub }}>{story.q.zh}</div>
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            {story.q.options.map((opt) => {
              const isAns = opt.en === story.q.ans;
              let bg = T.card, bd = "#E8E4FA";
              if (picked) {
                if (isAns) { bg = "#E9FBEF"; bd = T.green; }
                else if (opt.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
              }
              return (
                <button key={opt.en} onClick={() => pick(opt)}
                  style={{
                    background: bg, border: `3px solid ${bd}`, borderRadius: 16,
                    padding: "12px 4px", fontFamily: "inherit", fontWeight: 700,
                    fontSize: 14, color: T.ink, cursor: "pointer",
                    boxShadow: "0 4px 0 #E0DBF7", transition: "all .15s",
                  }}>
                  <div style={{ fontSize: 34 }}>{opt.emoji}</div>
                  {opt.en}
                </button>
              );
            })}
          </div>
          {celebrate && (
            <div style={{ marginTop: 12, fontSize: 18, color: T.greenDark, fontWeight: 700 }}>{t("🎉 答對了!+2 ⭐")}</div>
          )}
        </div>
      )}

      {celebrate && (
        <ChunkyButton color={T.green} dark={T.greenDark}
          onClick={() => goStory((si + 1) % STORIES.length)}>{t("下一個故事 →")}</ChunkyButton>
      )}
    </div>
  );
}

// ========== 以下為第二批新增的 10 個遊戲 ==========
const NUM10 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// ---------- ABC 接接看(字母順序)----------
function AlphabetOrderMode({ speak, addStars }) {
  const TOTAL = 8;
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const makeQ = () => {
    const i = Math.floor(Math.random() * 24); // 顯示 i,i+1,i+2 -> 問 i+3? 用三連問下一個
    const start = Math.min(i, 23);
    const ans = abc[start + 2] ? abc[start + 2] : abc[start];
    // 顯示前兩個,問第三個
    const shown = [abc[start], abc[start + 1]];
    const target = abc[start + 2];
    const opts = new Set([target]);
    while (opts.size < 3) opts.add(abc[Math.floor(Math.random() * 26)]);
    return { shown, target, options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => speak(`${q.shown[0]}. ${q.shown[1]}. what next?`, { rate: 0.8 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (L) => {
    if (picked) return;
    setPicked(L);
    const ok = L === q.target;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(`${q.target}! Great job!`, { rate: 0.95 }); }
    else speak(`${q.shown[1]}. ${q.target}.`, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1400);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔤"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("接對 {0} / {1} 個字母!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・接下來是哪個字母?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: T.purple, letterSpacing: 8 }}>
          {q.shown[0]} {q.shown[1]} <span style={{ color: "#C9C4E8" }}>?</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((L) => {
          const isAns = L === q.target;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (L === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={L} onClick={() => pick(L)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 36,
                fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {L}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 數字接龍 ----------
function NumberOrderMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const s = 1 + Math.floor(Math.random() * 7); // 1..7
    const target = s + 3;
    const opts = new Set([target]);
    while (opts.size < 3) opts.add(1 + Math.floor(Math.random() * 10));
    return { shown: [s, s + 1, s + 2], target, options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => speak(`${NUM10[q.shown[0]]}, ${NUM10[q.shown[1]]}, ${NUM10[q.shown[2]]}, what next?`, { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (n) => {
    if (picked !== null) return;
    setPicked(n);
    const ok = n === q.target;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(`${NUM10[q.target]}! Great job!`, { rate: 0.95 }); }
    else speak(`${NUM10[q.shown[2]]}, ${NUM10[q.target]}.`, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1400);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔢"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("接對 {0} / {1} 個數字!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・接下來是哪個數字?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: T.purple, letterSpacing: 6 }}>
          {q.shown.join(" ")} <span style={{ color: "#C9C4E8" }}>?</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((n) => {
          const isAns = n === q.target;
          let bg = T.card, bd = "#E8E4FA";
          if (picked !== null) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (n === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={n} onClick={() => pick(n)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 36,
                fontWeight: 700, color: T.ink, cursor: picked !== null ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 加加看(5 以內加法)----------
function AddMode({ speak, addStars }) {
  const TOTAL = 8;
  const EM = ["🍎", "🍓", "⭐", "🎈", "🐟", "🍪"];
  const makeQ = () => {
    const a = 1 + Math.floor(Math.random() * 3);
    const b = 1 + Math.floor(Math.random() * (5 - a));
    const sum = a + b;
    const opts = new Set([sum]);
    while (opts.size < 3) opts.add(2 + Math.floor(Math.random() * 5));
    return { a, b, sum, emoji: EM[Math.floor(Math.random() * EM.length)], options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => speak(`${NUM10[q.a]} and ${NUM10[q.b]}. how many?`, { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (n) => {
    if (picked !== null) return;
    setPicked(n);
    const ok = n === q.sum;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(`${NUM10[q.a]} and ${NUM10[q.b]} makes ${NUM10[q.sum]}!`, { rate: 0.9 }); }
    else speak(`${NUM10[q.a]} and ${NUM10[q.b]} makes ${NUM10[q.sum]}.`, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1900);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "➕"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("算對 {0} / {1} 題!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・數數看,一共有幾個?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 12px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 32 }}>{q.emoji.repeat(q.a)}</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: T.purple }}>+</span>
          <span style={{ fontSize: 32 }}>{q.emoji.repeat(q.b)}</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: T.purple }}>=</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#C9C4E8" }}>?</span>
        </div>
        {picked !== null && (
          <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: T.greenDark }}>
            {q.a} + {q.b} = {q.sum}
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((n) => {
          const isAns = n === q.sum;
          let bg = T.card, bd = "#E8E4FA";
          if (picked !== null) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (n === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={n} onClick={() => pick(n)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 34,
                fontWeight: 700, color: T.ink, cursor: picked !== null ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 音節拍拍(數音節)----------
const SYLLABLE_WORDS = [
  { en: "cat", emoji: "🐱", n: 1 }, { en: "dog", emoji: "🐶", n: 1 },
  { en: "fish", emoji: "🐟", n: 1 }, { en: "star", emoji: "⭐", n: 1 },
  { en: "apple", emoji: "🍎", n: 2 }, { en: "tiger", emoji: "🐯", n: 2 },
  { en: "rabbit", emoji: "🐰", n: 2 }, { en: "monkey", emoji: "🐵", n: 2 },
  { en: "pencil", emoji: "✏️", n: 2 }, { en: "flower", emoji: "🌸", n: 2 },
  { en: "banana", emoji: "🍌", n: 3 }, { en: "elephant", emoji: "🐘", n: 3 },
  { en: "butterfly", emoji: "🦋", n: 3 }, { en: "umbrella", emoji: "☂️", n: 3 },
  { en: "tomato", emoji: "🍅", n: 3 }, { en: "dinosaur", emoji: "🦕", n: 3 },
];
function SyllableMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const w = SYLLABLE_WORDS[Math.floor(Math.random() * SYLLABLE_WORDS.length)];
    return { w, options: [1, 2, 3] };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetch?.(q.w.en);
    const t = setTimeout(() => speak(q.w.en, { rate: 0.8 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (n) => {
    if (picked !== null) return;
    setPicked(n);
    const ok = n === q.w.n;
    if (ok) { setRight((r) => r + 1); addStars(1); speak("Great job!", { rate: 1 }); }
    else speak(q.w.en, { rate: 0.6 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1500);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "👏"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("拍對 {0} / {1} 個字!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・唸唸看,這個字要拍幾下?👏", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.w.emoji}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.ink }}>{q.w.en}</div>
        {picked !== null && (
          <div style={{ fontSize: 26, marginTop: 6 }}>{"👏".repeat(q.w.n)}</div>
        )}
        <div style={{ marginTop: 8 }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(q.w.en, { rate: 0.7 })}
            style={{ color: T.ink }}>{t("🔊 慢慢唸")}</ChunkyButton>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((n) => {
          const isAns = n === q.w.n;
          let bg = T.card, bd = "#E8E4FA";
          if (picked !== null) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (n === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={n} onClick={() => pick(n)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "16px 0", fontFamily: "inherit", cursor: picked !== null ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 26 }}>{"👏".repeat(n)}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.purple }}>{n}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- CVC 短母音字庫(中間的音 + 拼讀共用)----------
const CVC_WORDS = [
  { en: "cat", emoji: "🐱" }, { en: "dog", emoji: "🐶" }, { en: "pig", emoji: "🐷" },
  { en: "sun", emoji: "☀️" }, { en: "bus", emoji: "🚌" }, { en: "hat", emoji: "🧢" },
  { en: "bed", emoji: "🛏️" }, { en: "fox", emoji: "🦊" }, { en: "cup", emoji: "🥤" },
  { en: "bag", emoji: "🎒" }, { en: "box", emoji: "📦" }, { en: "pen", emoji: "🖊️" },
  { en: "hen", emoji: "🐔" }, { en: "bat", emoji: "🦇" }, { en: "net", emoji: "🥅" },
  { en: "web", emoji: "🕸️" },
];
const VOWELS = ["a", "e", "i", "o", "u"];

// ---------- 中間的音(CVC 母音)----------
function MiddleSoundMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const w = CVC_WORDS[Math.floor(Math.random() * CVC_WORDS.length)];
    const v = w.en[1];
    const opts = new Set([v]);
    while (opts.size < 3) opts.add(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
    return { w, v, options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetch?.(q.w.en);
    const t = setTimeout(() => speak(q.w.en, { rate: 0.75 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (v) => {
    if (picked) return;
    setPicked(v);
    const ok = v === q.v;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(q.w.en, { rate: 0.9, onEnd: () => speak("Great job!", { rate: 1 }) }); }
    else speak(q.w.en, { rate: 0.6 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1500);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🅰️"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("找對 {0} / {1} 個中間音!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・中間少了一個音,是哪個母音?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.w.emoji}</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: T.ink, letterSpacing: 4, margin: "4px 0 10px" }}>
          {q.w.en[0]}<span style={{ color: picked ? T.greenDark : "#C9C4E8" }}>{picked ? q.v : "_"}</span>{q.w.en[2]}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(q.w.en, { rate: 0.7 })}
          style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((v) => {
          const isAns = v === q.v;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (v === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={v} onClick={() => pick(v)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 36,
                fontWeight: 700, color: T.purple, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 拼讀小火車(CVC 拼音 → 選圖)----------
function BlendMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const w = CVC_WORDS[Math.floor(Math.random() * CVC_WORDS.length)];
    const others = shuffle(CVC_WORDS.filter((x) => x.en !== w.en)).slice(0, 2);
    return { w, options: shuffle([w, ...others]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [lit, setLit] = useState(-1); // 字母逐一亮起
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  // 逐字母亮起後唸整個字
  const playBlend = useCallback(() => {
    const letters = q.w.en.split("");
    letters.forEach((ch, i) => {
      setTimeout(() => { setLit(i); speak(ch + ".", { rate: 0.9 }); }, i * 650);
    });
    setTimeout(() => { setLit(letters.length); speak(q.w.en, { rate: 0.85 }); }, letters.length * 650 + 200);
  }, [q, speak]);

  useEffect(() => {
    speak.prefetch?.(q.w.en);
    setLit(-1);
    const t = setTimeout(playBlend, 400);
    return () => clearTimeout(t);
  }, [q, playBlend, speak]);

  const pick = (w) => {
    if (picked) return;
    setPicked(w.en);
    const ok = w.en === q.w.en;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(q.w.en, { rate: 0.9, onEnd: () => speak("Great job!", { rate: 1 }) }); }
    else speak(q.w.en, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1600);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "📖"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("拼讀 {0} / {1} 個字!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・把音拼起來,是哪張圖?🚂", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          {q.w.en.split("").map((ch, i) => (
            <span key={i} style={{
              fontSize: 34, fontWeight: 700, width: 46, height: 54,
              display: "grid", placeItems: "center", borderRadius: 12,
              background: lit >= i ? T.purple : "#F3F0FF",
              color: lit >= i ? "#fff" : "#C9C4E8", transition: "all .2s",
            }}>{ch}</span>
          ))}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={playBlend} style={{ color: T.ink }}>{t("🔊 再拼一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((w) => {
          const isAns = w.en === q.w.en;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (w.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={w.en} onClick={() => pick(w)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 4px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 46 }}>{w.emoji}</div>
              {picked && isAns && <div style={{ fontSize: 15, fontWeight: 700, color: T.greenDark }}>{w.en}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 大寫還是小寫? ----------
function UpperLowerMode({ speak, addStars }) {
  const TOTAL = 8;
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const makeQ = () => {
    const L = abc[Math.floor(Math.random() * 26)];
    const upper = Math.random() < 0.5;
    return { L, upper };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const shown = q.upper ? q.L : q.L.toLowerCase();

  useEffect(() => {
    const t = setTimeout(() => speak(q.L + ".", { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (ans) => {
    if (picked) return;
    setPicked(ans);
    const ok = (ans === "upper") === q.upper;
    if (ok) { setRight((r) => r + 1); addStars(1); speak(q.L + "! Great job!", { rate: 0.95 }); }
    else speak(q.L + ".", { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1300);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("答對 {0} / {1} 題!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  const correct = q.upper ? "upper" : "lower";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・這是大寫還是小寫?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 90, fontWeight: 700, color: T.purple, lineHeight: 1.1 }}>{shown}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[["upper", t("🔠 大寫 ABC")], ["lower", t("🔡 小寫 abc")]].map(([v, label]) => {
          const dim = picked && v !== correct;
          return (
            <ChunkyButton key={v} color={v === "upper" ? T.purple : T.pink}
              dark={v === "upper" ? T.purpleDark : "#D14B7D"}
              onClick={() => pick(v)} style={{ fontSize: 19, opacity: dim ? 0.45 : 1 }}>
              {label}
            </ChunkyButton>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 在哪裡?(方位介詞)----------
const PREPS = [
  { en: "on", zh: "在上面" }, { en: "in", zh: "在裡面" },
  { en: "under", zh: "在下面" }, { en: "next to", zh: "在旁邊" },
];
function PrepScene({ prep, big }) {
  const size = big ? 120 : 96;
  const ball = big ? 40 : 30;
  const pos = {
    on: { left: "50%", top: 0, transform: "translate(-50%,-30%)" },
    in: { left: "50%", top: "50%", transform: "translate(-50%,-50%)" },
    under: { left: "50%", bottom: 0, transform: "translate(-50%,40%)" },
    "next to": { right: 0, top: "50%", transform: "translate(60%,-50%)" },
  }[prep];
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: size * 0.7 }}>📦</div>
      <div style={{ position: "absolute", fontSize: ball, ...pos }}>🔴</div>
    </div>
  );
}
function PrepositionMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const target = PREPS[Math.floor(Math.random() * PREPS.length)];
    const others = shuffle(PREPS.filter((p) => p.en !== target.en)).slice(0, 2);
    return { target, options: shuffle([target, ...others]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => speak(`The ball is ${q.target.en} the box.`, { rate: 0.85 }), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (p) => {
    if (picked) return;
    setPicked(p.en);
    const ok = p.en === q.target.en;
    if (ok) { setRight((r) => r + 1); addStars(1); speak("Great job!", { rate: 1 }); }
    else speak(`The ball is ${q.target.en} the box.`, { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1600);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🧭"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("找對 {0} / {1} 個位置!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・聽聽看,球在盒子的哪裡?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => speak(`The ball is ${q.target.en} the box.`, { rate: 0.85 })} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((p) => {
          const isAns = p.en === q.target.en;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (p.en === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={p.en} onClick={() => pick(p)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "14px 4px 10px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <PrepScene prep={p.en} />
              {picked && isAns && (
                <div style={{ fontSize: 14, fontWeight: 700, color: T.greenDark, marginTop: 4 }}>
                  {p.en} · {p.zh}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 記憶排排看(順序記憶)----------
function SequenceMemoryMode({ speak, addStars }) {
  const TOTAL = 6;
  const poolRef = useRef(shuffle(ALL_WORDS.filter((w) => /^[a-z]+$/i.test(w.en))).slice(0, 4));
  const seqLen = (r) => (r <= 2 ? 2 : r <= 4 ? 3 : 4);
  const makeSeq = (r) => {
    const pool = poolRef.current;
    const s = [];
    for (let i = 0; i < seqLen(r); i++) s.push(pool[Math.floor(Math.random() * pool.length)]);
    return s;
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [seq, setSeq] = useState(() => makeSeq(1));
  const [phase, setPhase] = useState("show"); // show | input | good
  const [litIdx, setLitIdx] = useState(-1);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  // 播放序列
  useEffect(() => {
    if (phase !== "show") return;
    clearTimers();
    setLitIdx(-1);
    seq.forEach((w, i) => {
      timers.current.push(setTimeout(() => { setLitIdx(i); speak(w.en); }, 500 + i * 900));
    });
    timers.current.push(setTimeout(() => { setLitIdx(-1); setStep(0); setPhase("input"); }, 500 + seq.length * 900 + 300));
    return clearTimers;
  }, [phase, seq, speak]);

  const startRound = (r) => {
    setSeq(makeSeq(r)); setStep(0); setLitIdx(-1); setPhase("show");
  };

  const tap = (w) => {
    if (phase !== "input") return;
    if (w.en === seq[step].en) {
      speak(w.en);
      const ns = step + 1;
      if (ns >= seq.length) {
        addStars(1);
        setRight((r) => r + 1);
        setPhase("good");
        speak("Great job!", { rate: 1 });
        timers.current.push(setTimeout(() => {
          if (roundNo >= TOTAL) setDone(true);
          else { const nr = roundNo + 1; setRoundNo(nr); startRound(nr); }
        }, 1300));
      } else setStep(ns);
    } else {
      // 記錯了,再看一次同一組,不算失敗
      speak(seq[step].en, { rate: 0.8 });
      timers.current.push(setTimeout(() => setPhase("show"), 700));
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "🧠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("記對 {0} / {1} 組順序!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); startRound(1); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 組・{2}", roundNo, TOTAL, phase === "input" ? t("照剛剛的順序點出來!") : t("記住亮起來的順序 👀"))}</div>
      {/* 播放中:顯示序列亮燈 */}
      {phase !== "input" && (
        <div style={{ background: T.card, borderRadius: 22, padding: "24px 12px",
          marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7", minHeight: 120,
          display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {seq.map((w, i) => (
            <span key={i} style={{
              fontSize: 52, transition: "all .2s",
              transform: litIdx === i ? "scale(1.3)" : "scale(1)",
              opacity: litIdx === i ? 1 : 0.25,
            }}>{w.emoji}</span>
          ))}
        </div>
      )}
      {/* 作答:固定位置的按鈕 */}
      {phase === "input" && (
        <>
          <div style={{ fontSize: 22, marginBottom: 10 }}>
            {seq.map((_, i) => (
              <span key={i}>{i < step ? "⭐" : "⬜"}</span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {poolRef.current.map((w) => (
              <button key={w.en} onClick={() => tap(w)}
                style={{
                  background: T.card, border: "3px solid #E8E4FA", borderRadius: 18,
                  padding: "18px 4px", fontFamily: "inherit", cursor: "pointer",
                  boxShadow: "0 5px 0 #E0DBF7",
                }}>
                <div style={{ fontSize: 44 }}>{w.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{w.en}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- 排大小(依大小排序)----------
const SIZE_ITEMS = [
  { en: "ant", zh: "螞蟻", emoji: "🐜", size: 1 },
  { en: "mouse", zh: "老鼠", emoji: "🐭", size: 2 },
  { en: "fish", zh: "魚", emoji: "🐟", size: 3 },
  { en: "cat", zh: "貓", emoji: "🐱", size: 4 },
  { en: "dog", zh: "狗", emoji: "🐶", size: 5 },
  { en: "pig", zh: "豬", emoji: "🐷", size: 6 },
  { en: "horse", zh: "馬", emoji: "🐴", size: 7 },
  { en: "cow", zh: "牛", emoji: "🐮", size: 8 },
  { en: "elephant", zh: "大象", emoji: "🐘", size: 9 },
  { en: "whale", zh: "鯨魚", emoji: "🐳", size: 10 },
];
function SizeOrderMode({ speak, addStars }) {
  const TOTAL = 6;
  const makeQ = () => {
    const three = shuffle(SIZE_ITEMS).slice(0, 3).sort((a, b) => a.size - b.size);
    return { order: three, display: shuffle([...three]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [progress, setProgress] = useState(0); // 已正確點出前幾個
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);
  const [cleared, setCleared] = useState(false);

  const nextRound = () => {
    if (roundNo >= TOTAL) { setDone(true); return; }
    setRoundNo((r) => r + 1); setQ(makeQ()); setProgress(0); setCleared(false);
  };

  const tap = (item) => {
    if (cleared) return;
    if (item.size === q.order[progress].size) {
      speak(item.en);
      const np = progress + 1;
      setProgress(np);
      setWrong(null);
      if (np >= q.order.length) {
        setRight((r) => r + 1); addStars(1); setCleared(true);
        speak("Great job!", { rate: 1 });
        setTimeout(nextRound, 1300);
      }
    } else {
      setWrong(item.en);
      speak(item.en);
      setTimeout(() => setWrong(null), 500);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "📏"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("排對 {0} / {1} 組!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setProgress(0); setCleared(false); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{tf("第 {0} / {1} 組・從「最小」開始,由小到大點!", roundNo, TOTAL)}</div>
      <div style={{ fontSize: 20, marginBottom: 12, color: T.purple, fontWeight: 700 }}>{t("🐜 小 →→→ 大 🐘")}</div>
      {/* 已排好的 */}
      <div style={{ minHeight: 70, display: "flex", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
        {q.order.slice(0, progress).map((it, i) => (
          <span key={it.en} style={{ fontSize: 30 + i * 12 }}>{it.emoji}</span>
        ))}
        {progress < q.order.length && <span style={{ fontSize: 26, color: "#C9C4E8" }}>{tf("👉 點第 {0} 小的", progress + 1)}</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.display.map((it) => {
          const placed = q.order.slice(0, progress).some((x) => x.en === it.en);
          const isWrong = wrong === it.en;
          return (
            <button key={it.en} onClick={() => tap(it)} disabled={placed}
              style={{
                background: placed ? "#E9FBEF" : isWrong ? "#FFEDED" : T.card,
                border: `3px solid ${placed ? T.green : isWrong ? T.red : "#E8E4FA"}`,
                borderRadius: 18, padding: "16px 4px", fontFamily: "inherit",
                cursor: placed ? "default" : "pointer", boxShadow: "0 5px 0 #E0DBF7",
                opacity: placed ? 0.6 : 1, animation: isWrong ? "wp-shake .3s" : "none",
                transition: "all .15s",
              }}>
              <div style={{ fontSize: 44 }}>{it.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{it.en}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ========== ㄅㄆㄇ 注音符號 ==========
// s=符號, sound=單獨唸這個音用的字, word/emoji=例詞, first=例詞是否以這個注音開頭
const BOPOMOFO = [
  // 聲母 21
  { s: "ㄅ", sound: "波", word: "爸爸", emoji: "👨", first: true },
  { s: "ㄆ", sound: "坡", word: "蘋果", emoji: "🍎", first: true },
  { s: "ㄇ", sound: "摸", word: "媽媽", emoji: "👩", first: true },
  { s: "ㄈ", sound: "佛", word: "飛機", emoji: "✈️", first: true },
  { s: "ㄉ", sound: "得", word: "蛋", emoji: "🥚", first: true },
  { s: "ㄊ", sound: "特", word: "兔子", emoji: "🐰", first: true },
  { s: "ㄋ", sound: "呢", word: "牛", emoji: "🐮", first: true },
  { s: "ㄌ", sound: "勒", word: "老虎", emoji: "🐯", first: true },
  { s: "ㄍ", sound: "哥", word: "狗", emoji: "🐶", first: true },
  { s: "ㄎ", sound: "科", word: "褲子", emoji: "👖", first: true },
  { s: "ㄏ", sound: "喝", word: "花", emoji: "🌸", first: true },
  { s: "ㄐ", sound: "機", word: "雞", emoji: "🐔", first: true },
  { s: "ㄑ", sound: "七", word: "汽車", emoji: "🚗", first: true },
  { s: "ㄒ", sound: "西", word: "西瓜", emoji: "🍉", first: true },
  { s: "ㄓ", sound: "知", word: "豬", emoji: "🐷", first: true },
  { s: "ㄔ", sound: "吃", word: "車子", emoji: "🚙", first: true },
  { s: "ㄕ", sound: "詩", word: "獅子", emoji: "🦁", first: true },
  { s: "ㄖ", sound: "日", word: "熱狗", emoji: "🌭", first: true },
  { s: "ㄗ", sound: "資", word: "嘴巴", emoji: "👄", first: true },
  { s: "ㄘ", sound: "次", word: "草莓", emoji: "🍓", first: true },
  { s: "ㄙ", sound: "思", word: "松鼠", emoji: "🐿️", first: true },
  // 介音 3
  { s: "ㄧ", sound: "衣", word: "椅子", emoji: "🪑", first: true },
  { s: "ㄨ", sound: "屋", word: "襪子", emoji: "🧦", first: true },
  { s: "ㄩ", sound: "魚", word: "魚", emoji: "🐟", first: true },
  // 韻母 13
  { s: "ㄚ", sound: "啊", word: "阿姨", emoji: "👩‍🦰", first: true },
  { s: "ㄛ", sound: "喔", word: "婆婆", emoji: "👵", first: false },
  { s: "ㄜ", sound: "鵝", word: "鵝", emoji: "🦢", first: true },
  { s: "ㄝ", sound: "耶", word: "耶", emoji: "✌️", first: false },
  { s: "ㄞ", sound: "愛", word: "愛心", emoji: "❤️", first: true },
  { s: "ㄟ", sound: "欸", word: "杯子", emoji: "🥤", first: false },
  { s: "ㄠ", sound: "凹", word: "貓", emoji: "🐱", first: false },
  { s: "ㄡ", sound: "歐", word: "手", emoji: "✋", first: false },
  { s: "ㄢ", sound: "安", word: "安全帽", emoji: "⛑️", first: true },
  { s: "ㄣ", sound: "恩", word: "門", emoji: "🚪", first: false },
  { s: "ㄤ", sound: "昂", word: "糖果", emoji: "🍬", first: false },
  { s: "ㄥ", sound: "鞥", word: "燈", emoji: "💡", first: false },
  { s: "ㄦ", sound: "兒", word: "耳朵", emoji: "👂", first: true },
];
const BOPO_SYMBOLS = BOPOMOFO.map((b) => b.s);
const BOPO_FIRST = BOPOMOFO.filter((b) => b.first); // 例詞真的以該注音開頭的,用於猜首音

// 中文語音捷徑:字串裡還有中文就用中文聲音唸,已經翻成英文的就走英文發音管道
const HAS_CJK = /[\u4e00-\u9fff\u3105-\u312f]/;
const zh = (speak, text, opts = {}) =>
  HAS_CJK.test(String(text))
    ? speak(text, { lang: "zh-TW", rate: 0.85, ...opts })
    : speak(text, { rate: 0.9, ...opts });

// ---------- ㄅㄆㄇ 接接看(注音順序)----------
function BopoOrderMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const i = Math.floor(Math.random() * (BOPOMOFO.length - 2));
    const target = BOPOMOFO[i + 2];
    const opts = new Set([target.s]);
    while (opts.size < 3) opts.add(BOPO_SYMBOLS[Math.floor(Math.random() * BOPO_SYMBOLS.length)]);
    return { shown: [BOPOMOFO[i].s, BOPOMOFO[i + 1].s], target, options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(() => {
    const a = BOPOMOFO.find((b) => b.s === q.shown[0]);
    const b2 = BOPOMOFO.find((b) => b.s === q.shown[1]);
    zh(speak, tf("{0}、{1}、然後呢?", a.sound, b2.sound));
  }, [q, speak]);
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (s) => {
    if (picked) return;
    setPicked(s);
    const ok = s === q.target.s;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, tf("{0}!答對了", q.target.sound), { rate: 0.9 }); }
    else zh(speak, tf("是 {0}", q.target.sound), { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1500);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : t("ㄅ")}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("接對 {0} / {1} 個注音!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・接下來是哪個注音?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: T.purple, letterSpacing: 10 }}>
          {q.shown[0]} {q.shown[1]} <span style={{ color: "#C9C4E8" }}>?</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((s) => {
          const isAns = s === q.target.s;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (s === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={s} onClick={() => pick(s)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 40,
                fontWeight: 700, color: T.ink, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 注音獵人(聽詞找注音:這個詞第一個音是什麼)----------
function BopoHuntMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const ans = BOPO_FIRST[Math.floor(Math.random() * BOPO_FIRST.length)];
    const opts = new Set([ans.s]);
    while (opts.size < 3) opts.add(BOPO_FIRST[Math.floor(Math.random() * BOPO_FIRST.length)].s);
    return { ans, options: shuffle([...opts]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(() => zh(speak, q.ans.word, { rate: 0.8 }), [q, speak]);
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (s) => {
    if (picked) return;
    setPicked(s);
    const ok = s === q.ans.s;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, tf("{0}!{1}!答對了", q.ans.sound, q.ans.word), { rate: 0.9 }); }
    else zh(speak, tf("{0},是 {1}", q.ans.word, q.ans.sound), { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1800);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🔍"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("找對 {0} / {1} 個注音!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・這個詞的第一個音是哪個注音?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 64 }}>{q.ans.emoji}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: T.ink, margin: "4px 0 10px" }}>
          {picked ? (
            <span><span style={{ color: T.greenDark }}>{q.ans.s}</span> · {q.ans.word}</span>
          ) : q.ans.word}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((s) => {
          const isAns = s === q.ans.s;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (s === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={s} onClick={() => pick(s)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "18px 0", fontFamily: "inherit", fontSize: 40,
                fontWeight: 700, color: T.purple, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 注音配對(看注音找圖)----------
function BopoMatchMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const ans = BOPO_FIRST[Math.floor(Math.random() * BOPO_FIRST.length)];
    const others = shuffle(BOPO_FIRST.filter((b) => b.s !== ans.s)).slice(0, 2);
    return { ans, options: shuffle([ans, ...others]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(() => zh(speak, q.ans.sound, { rate: 0.75 }), [q, speak]);
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (b) => {
    if (picked) return;
    setPicked(b.s);
    const ok = b.s === q.ans.s;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, tf("{0}!答對了", q.ans.word), { rate: 0.9 }); }
    else zh(speak, tf("{0},是{1}", q.ans.sound, q.ans.word), { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1800);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🧩"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("配對 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・哪一張圖是這個注音開頭的?", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 82, fontWeight: 700, color: T.purple, lineHeight: 1.1 }}>
          {q.ans.s}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((b) => {
          const isAns = b.s === q.ans.s;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (b.s === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={b.s} onClick={() => pick(b)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "16px 4px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 42 }}>{b.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{b.word}</div>
              {picked && isAns && (
                <div style={{ fontSize: 13, color: T.greenDark, fontWeight: 700 }}>{b.s}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ========== ㄅㄆㄇ:對應 ABC 的完整玩法 ==========

// 拼音資料:兩個注音拼成一個字(注音最核心的能力)
const BOPO_SYLLABLES = [
  { parts: ["ㄅ", "ㄚ"], zhu: "ㄅㄚˋ", word: "爸爸", emoji: "👨" },
  { parts: ["ㄇ", "ㄚ"], zhu: "ㄇㄚ",  word: "媽媽", emoji: "👩" },
  { parts: ["ㄇ", "ㄠ"], zhu: "ㄇㄠ",  word: "貓",   emoji: "🐱" },
  { parts: ["ㄍ", "ㄡ"], zhu: "ㄍㄡˇ", word: "狗",   emoji: "🐶" },
  { parts: ["ㄓ", "ㄨ"], zhu: "ㄓㄨ",  word: "豬",   emoji: "🐷" },
  { parts: ["ㄔ", "ㄜ"], zhu: "ㄔㄜ",  word: "車",   emoji: "🚗" },
  { parts: ["ㄕ", "ㄡ"], zhu: "ㄕㄡˇ", word: "手",   emoji: "✋" },
  { parts: ["ㄇ", "ㄣ"], zhu: "ㄇㄣˊ", word: "門",   emoji: "🚪" },
  { parts: ["ㄊ", "ㄤ"], zhu: "ㄊㄤˊ", word: "糖",   emoji: "🍬" },
  { parts: ["ㄉ", "ㄥ"], zhu: "ㄉㄥ",  word: "燈",   emoji: "💡" },
  { parts: ["ㄈ", "ㄟ"], zhu: "ㄈㄟ",  word: "飛機", emoji: "✈️" },
  { parts: ["ㄋ", "ㄞ"], zhu: "ㄋㄞˇ", word: "牛奶", emoji: "🥛" },
  { parts: ["ㄅ", "ㄟ"], zhu: "ㄅㄟ",  word: "杯子", emoji: "🥤" },
  { parts: ["ㄙ", "ㄢ"], zhu: "ㄙㄢ",  word: "三",   emoji: "3️⃣" },
  { parts: ["ㄎ", "ㄨ"], zhu: "ㄎㄨˋ", word: "褲子", emoji: "👖" },
  { parts: ["ㄊ", "ㄨ"], zhu: "ㄊㄨˋ", word: "兔子", emoji: "🐰" },
  { parts: ["ㄐ", "ㄧ"], zhu: "ㄐㄧ",  word: "雞",   emoji: "🐔" },
  { parts: ["ㄕ", "ㄨ"], zhu: "ㄕㄨ",  word: "書",   emoji: "📖" },
  { parts: ["ㄇ", "ㄧ"], zhu: "ㄇㄧˇ", word: "米",   emoji: "🍚" },
];

// 聲調資料:1~4 聲
const TONE_MARKS = ["ˉ", "ˊ", "ˇ", "ˋ"];
const TONE_NAMES = ["一聲", "二聲", "三聲", "四聲"];
const BOPO_TONES = [
  { word: "媽媽", zhu: "ㄇㄚ",   tone: 1, emoji: "👩" },
  { word: "花",   zhu: "ㄏㄨㄚ", tone: 1, emoji: "🌸" },
  { word: "貓",   zhu: "ㄇㄠ",   tone: 1, emoji: "🐱" },
  { word: "書",   zhu: "ㄕㄨ",   tone: 1, emoji: "📖" },
  { word: "牛",   zhu: "ㄋㄧㄡ", tone: 2, emoji: "🐮" },
  { word: "魚",   zhu: "ㄩ",     tone: 2, emoji: "🐟" },
  { word: "羊",   zhu: "ㄧㄤ",   tone: 2, emoji: "🐑" },
  { word: "門",   zhu: "ㄇㄣ",   tone: 2, emoji: "🚪" },
  { word: "馬",   zhu: "ㄇㄚ",   tone: 3, emoji: "🐴" },
  { word: "狗",   zhu: "ㄍㄡ",   tone: 3, emoji: "🐶" },
  { word: "水",   zhu: "ㄕㄨㄟ", tone: 3, emoji: "💧" },
  { word: "傘",   zhu: "ㄙㄢ",   tone: 3, emoji: "☂️" },
  { word: "兔",   zhu: "ㄊㄨ",   tone: 4, emoji: "🐰" },
  { word: "樹",   zhu: "ㄕㄨ",   tone: 4, emoji: "🌳" },
  { word: "月",   zhu: "ㄩㄝ",   tone: 4, emoji: "🌙" },
  { word: "飯",   zhu: "ㄈㄢ",   tone: 4, emoji: "🍚" },
];

// ---------- 認識注音(對應「學習單字」)----------
const BOPO_SECTIONS = [
  { key: "c", label: "聲母(21)", range: [0, 21] },
  { key: "m", label: "介音(3)", range: [21, 24] },
  { key: "v", label: "韻母(13)", range: [24, 37] },
];
function BopoLearnMode({ speak }) {
  const [sec, setSec] = useState(BOPO_SECTIONS[0]);
  const list = BOPOMOFO.slice(sec.range[0], sec.range[1]);
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{t("點一下就唸給你聽:先唸注音,再唸例詞 🔊")}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
        {BOPO_SECTIONS.map((x) => (
          <button key={x.key} onClick={() => setSec(x)}
            style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 14,
              padding: "9px 14px", borderRadius: 999, border: "none", cursor: "pointer",
              background: sec.key === x.key ? T.purple : "#E8E4FA",
              color: sec.key === x.key ? "#fff" : T.sub, transition: "all .15s",
            }}>
            {t(x.label)}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {list.map((b) => (
          <button key={b.s}
            onClick={() => zh(speak, b.sound, { rate: 0.8, onEnd: () => zh(speak, b.word, { rate: 0.85 }) })}
            style={{
              background: T.card, border: "3px solid #E8E4FA", borderRadius: 18,
              padding: "12px 4px", fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 5px 0 #E0DBF7",
            }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: T.purple, lineHeight: 1.1 }}>{b.s}</div>
            <div style={{ fontSize: 30 }}>{b.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{b.word}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- 拼音小火車(對應「拼讀小火車」)----------
function BopoBlendMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => {
    const ans = BOPO_SYLLABLES[Math.floor(Math.random() * BOPO_SYLLABLES.length)];
    const others = shuffle(BOPO_SYLLABLES.filter((x) => x.word !== ans.word)).slice(0, 2);
    return { ans, options: shuffle([ans, ...others]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [lit, setLit] = useState(-1);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const playBlend = useCallback(() => {
    const ps = q.ans.parts;
    ps.forEach((p, i) => {
      setTimeout(() => {
        setLit(i);
        const b = BOPOMOFO.find((x) => x.s === p);
        zh(speak, b ? b.sound : p, { rate: 0.8 });
      }, i * 800);
    });
    setTimeout(() => { setLit(ps.length); zh(speak, q.ans.word, { rate: 0.85 }); }, ps.length * 800 + 250);
  }, [q, speak]);

  useEffect(() => {
    setLit(-1);
    const t = setTimeout(playBlend, 400);
    return () => clearTimeout(t);
  }, [q, playBlend]);

  const pick = (o) => {
    if (picked) return;
    setPicked(o.word);
    const ok = o.word === q.ans.word;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, tf("{0}!答對了", q.ans.word), { rate: 0.9 }); }
    else zh(speak, tf("是{0}", q.ans.word), { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1800);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🚂"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("拼對 {0} / {1} 個字!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・把兩個注音拼起來,是哪張圖?🚂", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
          {q.ans.parts.map((p, i) => (
            <span key={i} style={{
              fontSize: 34, fontWeight: 700, width: 54, height: 62,
              display: "grid", placeItems: "center", borderRadius: 12,
              background: lit >= i ? T.purple : "#F3F0FF",
              color: lit >= i ? "#fff" : "#C9C4E8", transition: "all .2s",
            }}>{p}</span>
          ))}
          <span style={{ fontSize: 26, fontWeight: 700, color: T.sub }}>=</span>
          <span style={{ fontSize: 30, fontWeight: 700, color: lit >= q.ans.parts.length ? T.greenDark : "#C9C4E8" }}>
            {lit >= q.ans.parts.length ? q.ans.zhu : "?"}
          </span>
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={playBlend} style={{ color: T.ink }}>{t("🔊 再拼一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((o) => {
          const isAns = o.word === q.ans.word;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (o.word === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={o.word} onClick={() => pick(o)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "16px 4px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 42 }}>{o.emoji}</div>
              {picked && isAns && (
                <div style={{ fontSize: 14, fontWeight: 700, color: T.greenDark }}>{o.word}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 聲調小老師(中文特有,ABC 沒有的能力)----------
function BopoToneMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeQ = () => BOPO_TONES[Math.floor(Math.random() * BOPO_TONES.length)];
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const say = useCallback(() => zh(speak, q.word, { rate: 0.75 }), [q, speak]);
  useEffect(() => {
    const t = setTimeout(say, 400);
    return () => clearTimeout(t);
  }, [q, say]);

  const pick = (t) => {
    if (picked) return;
    setPicked(t);
    const ok = t === q.tone;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, `${q.word}!${TONE_NAMES[q.tone - 1]}`, { rate: 0.9 }); }
    else zh(speak, tf("{0},是{1}", q.word, TONE_NAMES[q.tone - 1]), { rate: 0.8 });
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, 1800);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🎵"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("聽對 {0} / {1} 個聲調!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・這個字是第幾聲?🎵", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.emoji}</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: T.ink, margin: "2px 0 4px" }}>{q.word}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: picked ? T.greenDark : "#C9C4E8", marginBottom: 10 }}>
          {picked ? q.zhu + (q.tone > 1 ? TONE_MARKS[q.tone - 1] : "") : q.zhu + " ?"}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {[1, 2, 3, 4].map((t) => {
          const isAns = t === q.tone;
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (t === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={t} onClick={() => pick(t)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 16,
                padding: "14px 2px", fontFamily: "inherit", cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: T.purple, lineHeight: 1 }}>
                {TONE_MARKS[t - 1]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 4 }}>
                {TONE_NAMES[t - 1]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 注音泡泡(對應「單字泡泡」)----------
function BopoBubbleMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeRound = () => {
    const four = shuffle(BOPOMOFO).slice(0, 4);
    return { items: four, target: four[Math.floor(Math.random() * 4)], key: Math.random() };
  };
  const [round, setRound] = useState(makeRound);
  const [pops, setPops] = useState(0);
  const [popping, setPopping] = useState(null);
  const [cheer, setCheer] = useState("");
  const [done, setDone] = useState(false);

  const say = useCallback(() => zh(speak, round.target.sound, { rate: 0.8 }), [round, speak]);
  useEffect(() => {
    if (!done) {
      const t = setTimeout(say, 500);
      return () => clearTimeout(t);
    }
  }, [round, say, done]);

  const tap = (b) => {
    if (popping) return;
    if (b.s === round.target.s) {
      setPopping(b.s); setCheer(""); addStars(1);
      zh(speak, tf("{0}!答對了", b.sound), { rate: 0.95 });
      const np = pops + 1;
      setTimeout(() => {
        setPopping(null); setPops(np);
        if (np >= TOTAL) setDone(true); else setRound(makeRound());
      }, 800);
    } else {
      setCheer(t("再聽聽看,是哪一個注音?🫧"));
      say();
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>🫧✨</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("戳破了 {0} 個泡泡!", TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setPops(0); setDone(false); setRound(makeRound()); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{tf("聽聲音,戳破正確的注音泡泡!{0} / {1} 🫧", pops, TOTAL)}</div>
      <div style={{
        position: "relative", height: 330, overflow: "hidden",
        background: "linear-gradient(#EAF6FF, #F6FBFF)",
        borderRadius: 24, border: "3px solid #E8E4FA",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 12,
      }}>
        {round.items.map((b, i) => (
          <button key={`${round.key}-${b.s}`} onClick={() => tap(b)}
            style={{
              position: "absolute", left: `${4 + i * 24}%`, bottom: -110,
              width: 88, height: 88, borderRadius: "50%",
              background: popping === b.s ? "transparent" : BUBBLE_COLORS[i],
              border: popping === b.s ? "none" : "3px solid #FFFFFFCC",
              boxShadow: popping === b.s ? "none" : "inset -6px -8px 0 #FFFFFF88, 0 3px 8px #B9D4EE66",
              fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: `wp-float ${11 + i * 3.5}s linear infinite`,
              animationDelay: `${-i * 4.2}s`,
              animationPlayState: popping ? "paused" : "running",
            }}>
            {popping === b.s ? (
              <span style={{ fontSize: 40 }}>⭐</span>
            ) : (
              <span style={{ fontSize: 36, color: T.ink }}>{b.s}</span>
            )}
          </button>
        ))}
      </div>
      <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      {cheer && (
        <div style={{ marginTop: 10, fontSize: 15, color: T.sub, fontWeight: 700 }}>{cheer}</div>
      )}
    </div>
  );
}

// ---------- 注音翻翻樂(對應「單字翻翻樂」)----------
function BopoPairsMode({ speak, addStars }) {
  const newDeck = () => {
    const five = shuffle(BOPOMOFO).slice(0, 5);
    return shuffle([...five, ...five]).map((b, k) => ({ id: k, b }));
  };
  const [cards, setCards] = useState(newDeck);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [misses, setMisses] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  const flip = (i) => {
    if (lock || open.includes(i) || matched.has(cards[i].b.s)) return;
    zh(speak, cards[i].b.sound, { rate: 0.85 });
    if (open.length === 0) { setOpen([i]); return; }
    const j = open[0];
    if (cards[j].b.s === cards[i].b.s) {
      const nm = new Set(matched).add(cards[i].b.s);
      setMatched(nm); setOpen([]); addStars(1);
      if (nm.size === 5) {
        addStars(2);
        zh(speak, t("全部配對完成!好棒"), { rate: 0.9 });
        setTimeout(() => setDone(true), 900);
      }
    } else {
      setOpen([j, i]); setLock(true); setMisses((m) => m + 1);
      setTimeout(() => { setOpen([]); setLock(false); }, 950);
    }
  };

  const restart = () => {
    setCards(newDeck()); setOpen([]); setMatched(new Set());
    setMisses(0); setLock(false); setDone(false);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{misses <= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{t("5 對注音全部找到!")}</h2>
        <p style={{ color: T.sub, fontSize: 15 }}>{tf("失誤 {0} 次", misses)}</p>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 10 }} onClick={restart}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        <span>{t("翻牌找一樣的注音")}</span>
        <span>{tf("找到 {0} / 5 對{1}", matched.size, "⭐".repeat(matched.size))}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {cards.map((c, i) => {
          const isUp = open.includes(i) || matched.has(c.b.s);
          const isMatched = matched.has(c.b.s);
          return (
            <button key={c.id} onClick={() => flip(i)}
              style={{
                aspectRatio: "1 / 1.05",
                background: isMatched ? "#E9FBEF" : isUp ? "#FFF7DA" : T.purple,
                border: `3px solid ${isMatched ? T.green : isUp ? T.yellow : T.purpleDark}`,
                borderRadius: 18, fontFamily: "inherit",
                fontSize: isUp ? 32 : 30, fontWeight: 700, color: T.ink,
                cursor: isUp ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .2s",
                opacity: isMatched ? 0.85 : 1,
              }}>
              {isUp ? c.b.s : "🎈"}
            </button>
          );
        })}
      </div>
      <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 14 }}>{t("點卡片翻開,找到兩張一樣的注音!")}</p>
    </div>
  );
}

// ---------- 注音跟讀(對應「跟讀小勇士」)----------
function BopoSayMode({ speak, addStars }) {
  const pick = () => BOPO_SYLLABLES[Math.floor(Math.random() * BOPO_SYLLABLES.length)];
  const [item, setItem] = useState(pick);
  const [status, setStatus] = useState("idle"); // idle|listening|correct|tryagain
  const [heard, setHeard] = useState("");
  const [wins, setWins] = useState(0);
  const SR = typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recRef = useRef(null);
  const timerRef = useRef(0);

  const stopListening = useCallback(() => {
    clearTimeout(timerRef.current);
    try { recRef.current?.abort(); } catch { /* 已停止 */ }
    recRef.current = null;
  }, []);
  useEffect(() => stopListening, [stopListening]);

  const next = () => { stopListening(); setItem(pick()); setStatus("idle"); setHeard(""); };

  const listen = () => {
    if (!SR || status === "listening") return;
    window.speechSynthesis?.cancel();
    stopListening();
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = "zh-TW";
      rec.interimResults = true;
      rec.maxAlternatives = 5;
      rec.continuous = false;
      setStatus("listening"); setHeard("");
      const t = item.word;
      let settled = false;
      const succeed = () => {
        if (settled) return;
        settled = true; stopListening(); setStatus("correct");
        setWins((n) => n + 1); addStars(2);
        zh(speak, t("好棒!唸得很好"), { rate: 0.95 });
      };
      const giveUp = () => {
        if (settled) return;
        settled = true; stopListening(); setStatus("tryagain");
      };
      // 中文辨識常帶標點或多字,包含目標字就算過
      const matches = (a) => {
        const clean = a.replace(/[\s。,、!?.,!?]/g, "");
        return clean.includes(t) || t.includes(clean) && clean.length >= 1;
      };
      rec.onresult = (e) => {
        const alts = [];
        for (const res of e.results) for (const alt of res) alts.push(alt.transcript.trim());
        if (alts[0]) setHeard(alts[0]);
        if (alts.some(matches)) succeed();
        else if (e.results[e.results.length - 1].isFinal) giveUp();
      };
      rec.onerror = giveUp;
      rec.onend = () => {
        clearTimeout(timerRef.current);
        setStatus((s) => (s === "listening" ? "tryagain" : s));
      };
      timerRef.current = setTimeout(() => { try { rec.stop(); } catch { giveUp(); } }, 6000);
      rec.start();
    } catch {
      setStatus("tryagain");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("大聲唸出這個字,唸對得 ⭐⭐!已成功 {0} 次", wins)}</p>
      <div style={{ background: T.card, borderRadius: 24, padding: "26px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 64 }}>{item.emoji}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: T.ink }}>{item.word}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.purple, marginBottom: 12 }}>{item.zhu}</div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => zh(speak, item.word, { rate: 0.8 })} style={{ color: T.ink }}>{t("🔊 先聽一次")}</ChunkyButton>
      </div>

      {!SR ? (
        <p style={{ color: T.sub, fontSize: 15 }}>{t("這個瀏覽器不支援語音辨識,建議用 Chrome 或 Safari 😊")}</p>
      ) : status === "correct" ? (
        <div>
          <div style={{ fontSize: 22, color: T.greenDark, fontWeight: 700, marginBottom: 10 }}>{t("🎉 唸得真好!+2 ⭐")}</div>
          <ChunkyButton color={T.green} dark={T.greenDark} onClick={next}>{t("下一個字 →")}</ChunkyButton>
        </div>
      ) : (
        <div>
          <ChunkyButton color={status === "listening" ? T.pink : "#F0932B"}
            dark={status === "listening" ? "#D14B7D" : "#C4731A"}
            onClick={listen} style={{ fontSize: 20, width: "100%" }}>{status === "listening" ? t("🎙️ 我在聽,大聲唸出來!") : t("🎤 換我唸唸看")}</ChunkyButton>
          {heard && (
            <div style={{ marginTop: 10, fontSize: 14, color: T.sub }}>{tf("聽到:{0}", heard)}</div>
          )}
          {status === "tryagain" && (
            <div style={{ marginTop: 10, fontSize: 15, color: T.sub, fontWeight: 700 }}>{t("沒關係,再試一次!先按「先聽一次」聽清楚 💪")}</div>
          )}
        </div>
      )}
    </div>
  );
}


// ========== ㄅㄆㄇ 共用:中文題庫 + 測驗骨架 ==========

// 中文常用詞(注音 + 圖示 + 分類),供多個注音遊戲共用
const ZH_WORDS = [
  { w: "貓", zhu: "ㄇㄠ", e: "🐱", cat: "動物" },
  { w: "狗", zhu: "ㄍㄡˇ", e: "🐶", cat: "動物" },
  { w: "豬", zhu: "ㄓㄨ", e: "🐷", cat: "動物" },
  { w: "牛", zhu: "ㄋㄧㄡˊ", e: "🐮", cat: "動物" },
  { w: "馬", zhu: "ㄇㄚˇ", e: "🐴", cat: "動物" },
  { w: "羊", zhu: "ㄧㄤˊ", e: "🐑", cat: "動物" },
  { w: "魚", zhu: "ㄩˊ", e: "🐟", cat: "動物" },
  { w: "鳥", zhu: "ㄋㄧㄠˇ", e: "🐦", cat: "動物" },
  { w: "兔子", zhu: "ㄊㄨˋ˙ㄗ", e: "🐰", cat: "動物" },
  { w: "老虎", zhu: "ㄌㄠˇㄏㄨˇ", e: "🐯", cat: "動物" },
  { w: "獅子", zhu: "ㄕ˙ㄗ", e: "🦁", cat: "動物" },
  { w: "大象", zhu: "ㄉㄚˋㄒㄧㄤˋ", e: "🐘", cat: "動物" },
  { w: "蘋果", zhu: "ㄆㄧㄥˊㄍㄨㄛˇ", e: "🍎", cat: "食物" },
  { w: "香蕉", zhu: "ㄒㄧㄤㄐㄧㄠ", e: "🍌", cat: "食物" },
  { w: "西瓜", zhu: "ㄒㄧㄍㄨㄚ", e: "🍉", cat: "食物" },
  { w: "草莓", zhu: "ㄘㄠˇㄇㄟˊ", e: "🍓", cat: "食物" },
  { w: "蛋", zhu: "ㄉㄢˋ", e: "🥚", cat: "食物" },
  { w: "麵包", zhu: "ㄇㄧㄢˋㄅㄠ", e: "🍞", cat: "食物" },
  { w: "牛奶", zhu: "ㄋㄧㄡˊㄋㄞˇ", e: "🥛", cat: "食物" },
  { w: "糖果", zhu: "ㄊㄤˊㄍㄨㄛˇ", e: "🍬", cat: "食物" },
  { w: "車子", zhu: "ㄔㄜ˙ㄗ", e: "🚗", cat: "交通" },
  { w: "公車", zhu: "ㄍㄨㄥㄔㄜ", e: "🚌", cat: "交通" },
  { w: "飛機", zhu: "ㄈㄟㄐㄧ", e: "✈️", cat: "交通" },
  { w: "船", zhu: "ㄔㄨㄢˊ", e: "⛵", cat: "交通" },
  { w: "腳踏車", zhu: "ㄐㄧㄠˇㄊㄚˋㄔㄜ", e: "🚲", cat: "交通" },
  { w: "門", zhu: "ㄇㄣˊ", e: "🚪", cat: "居家" },
  { w: "燈", zhu: "ㄉㄥ", e: "💡", cat: "居家" },
  { w: "床", zhu: "ㄔㄨㄤˊ", e: "🛏️", cat: "居家" },
  { w: "杯子", zhu: "ㄅㄟ˙ㄗ", e: "🥤", cat: "居家" },
  { w: "書", zhu: "ㄕㄨ", e: "📖", cat: "學校" },
  { w: "鉛筆", zhu: "ㄑㄧㄢㄅㄧˇ", e: "✏️", cat: "學校" },
  { w: "椅子", zhu: "ㄧˇ˙ㄗ", e: "🪑", cat: "學校" },
  { w: "書包", zhu: "ㄕㄨㄅㄠ", e: "🎒", cat: "學校" },
  { w: "花", zhu: "ㄏㄨㄚ", e: "🌸", cat: "自然" },
  { w: "樹", zhu: "ㄕㄨˋ", e: "🌳", cat: "自然" },
  { w: "月亮", zhu: "ㄩㄝˋㄌㄧㄤˋ", e: "🌙", cat: "自然" },
  { w: "太陽", zhu: "ㄊㄞˋㄧㄤˊ", e: "☀️", cat: "自然" },
  { w: "水", zhu: "ㄕㄨㄟˇ", e: "💧", cat: "自然" },
  { w: "雨傘", zhu: "ㄩˇㄙㄢˇ", e: "☂️", cat: "居家" },
  { w: "帽子", zhu: "ㄇㄠˋ˙ㄗ", e: "🧢", cat: "衣服" },
  { w: "襪子", zhu: "ㄨㄚˋ˙ㄗ", e: "🧦", cat: "衣服" },
  { w: "褲子", zhu: "ㄎㄨˋ˙ㄗ", e: "👖", cat: "衣服" },
  { w: "手", zhu: "ㄕㄡˇ", e: "✋", cat: "身體" },
  { w: "耳朵", zhu: "ㄦˇ˙ㄉㄨㄛ", e: "👂", cat: "身體" },
  { w: "眼睛", zhu: "ㄧㄢˇ˙ㄐㄧㄥ", e: "👀", cat: "身體" },
  { w: "嘴巴", zhu: "ㄗㄨㄟˇ˙ㄅㄚ", e: "👄", cat: "身體" },
];

// 中文顏色 / 相反詞 / 大小排序 / 方位
const ZH_COLORS = [
  { w: "紅色", css: "#E74C3C" }, { w: "藍色", css: "#3498DB" },
  { w: "黃色", css: "#F1C40F" }, { w: "綠色", css: "#2ECC71" },
  { w: "紫色", css: "#9B59B6" }, { w: "粉紅色", css: "#FD79A8" },
  { w: "橘色", css: "#E67E22" }, { w: "咖啡色", css: "#8D6E63" },
];
const ZH_OPPOSITES = [
  { a: { w: "大", e: "🐘" }, b: { w: "小", e: "🐭" } },
  { a: { w: "熱", e: "🥵" }, b: { w: "冷", e: "🥶" } },
  { a: { w: "高興", e: "😀" }, b: { w: "難過", e: "😢" } },
  { a: { w: "上面", e: "⬆️" }, b: { w: "下面", e: "⬇️" } },
  { a: { w: "快", e: "🐇" }, b: { w: "慢", e: "🐢" } },
  { a: { w: "濕", e: "💦" }, b: { w: "乾", e: "🌵" } },
  { a: { w: "白天", e: "☀️" }, b: { w: "晚上", e: "🌙" } },
  { a: { w: "長", e: "🐍" }, b: { w: "短", e: "🐛" } },
  { a: { w: "多", e: "🍇" }, b: { w: "少", e: "🍒" } },
];
const ZH_SIZE = [
  { w: "螞蟻", e: "🐜", size: 1 }, { w: "老鼠", e: "🐭", size: 2 },
  { w: "魚", e: "🐟", size: 3 }, { w: "貓", e: "🐱", size: 4 },
  { w: "狗", e: "🐶", size: 5 }, { w: "豬", e: "🐷", size: 6 },
  { w: "馬", e: "🐴", size: 7 }, { w: "牛", e: "🐮", size: 8 },
  { w: "大象", e: "🐘", size: 9 }, { w: "鯨魚", e: "🐳", size: 10 },
];
const ZH_PREPS = [
  { w: "上面", prep: "on" }, { w: "裡面", prep: "in" },
  { w: "下面", prep: "under" }, { w: "旁邊", prep: "next to" },
];

// 依韻母分家族(押韻/韻母家族用):取注音最後一個韻母符號
const ZH_FINALS = "ㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ".split("");
const stripTone = (z) => z.replace(/[ˊˇˋ˙]/g, "");
function finalOf(zhu) {
  const z = stripTone(zhu);
  for (let i = z.length - 1; i >= 0; i--) if (ZH_FINALS.includes(z[i])) return z[i];
  return null;
}
// 只取「單字」(一個音節)來做韻母家族,多字詞的尾音會混淆
const ZH_RHYME_POOL = ZH_WORDS.filter((x) => x.w.length === 1 && finalOf(x.zhu));
const ZH_FAMILIES = ZH_FINALS
  .map((f) => ({ f, items: ZH_RHYME_POOL.filter((x) => finalOf(x.zhu) === f) }))
  .filter((g) => g.items.length >= 2);

// ---------- 共用測驗骨架(8 題、答錯只鼓勵、答對加星)----------
// 注音與數字兩個科目的選擇題遊戲都用這個外殼;語言由 say 決定
function PickQuiz({
  speak, addStars, TOTAL = 8, hint, makeQ, say,
  options, keyOf, isRight, renderPrompt, renderOption,
  onRight, onWrong, cols = 3, delay = 1800,
  doneIcon = "🏆", doneLabel = (r, t) => tf("答對 {0} / {1} 題!", r, t),
}) {
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  // say 由父層每次 render 重建,用 ref 固定,避免加星後重新念題目
  const sayRef = useRef(say);
  sayRef.current = say;
  const sayQ = useCallback(() => sayRef.current(q), [q]);
  useEffect(() => {
    const t = setTimeout(() => sayRef.current(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  const pick = (o) => {
    if (picked !== null) return;
    setPicked(keyOf(o));
    const ok = isRight(o, q);
    if (ok) { setRight((r) => r + 1); addStars(1); onRight?.(q, o); }
    else onWrong?.(q, o);
    setTimeout(() => {
      if (roundNo >= TOTAL) setDone(true);
      else { setRoundNo((r) => r + 1); setQ(makeQ()); setPicked(null); }
    }, delay);
  };

  const restart = () => {
    setRoundNo(1); setRight(0); setQ(makeQ()); setPicked(null); setDone(false);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= TOTAL - 1 ? "🏆" : doneIcon}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{doneLabel(right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }} onClick={restart}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・{2}", roundNo, TOTAL, hint)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "18px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        {renderPrompt(q, picked)}
        <div style={{ marginTop: 10 }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={sayQ} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
        {options(q).map((o) => {
          const k = keyOf(o);
          const ans = isRight(o, q);
          let bg = T.card, bd = "#E8E4FA";
          if (picked !== null) {
            if (ans) { bg = "#E9FBEF"; bd = T.green; }
            else if (k === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={k} onClick={() => pick(o)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "16px 4px", fontFamily: "inherit",
                cursor: picked !== null ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {renderOption(o, q, picked)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 小工具:從陣列取 n 個不重複、且排除某項
const pickOthers = (arr, n, notKey, keyFn) =>
  shuffle(arr.filter((x) => keyFn(x) !== notKey)).slice(0, n);

// ========== ㄅㄆㄇ:14 個以 PickQuiz 骨架實作的遊戲 ==========
const BOPO_SOUND = Object.fromEntries(BOPOMOFO.map((b) => [b.s, b.sound]));
const ZH_CONSONANTS = BOPOMOFO.slice(0, 21);   // 聲母 21
const ZH_VOWELS = BOPOMOFO.slice(24);          // 韻母 13
const ZH_NUM = ["零", "一", "二", "三", "四", "五", "六"];
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

// 介音在中間的字(中間的音用)
const ZH_MEDIAL = [
  { w: "花", zhu: "ㄏㄨㄚ", m: "ㄨ", e: "🌸" },
  { w: "水", zhu: "ㄕㄨㄟ", m: "ㄨ", e: "💧" },
  { w: "船", zhu: "ㄔㄨㄢ", m: "ㄨ", e: "⛵" },
  { w: "光", zhu: "ㄍㄨㄤ", m: "ㄨ", e: "🔦" },
  { w: "牛", zhu: "ㄋㄧㄡ", m: "ㄧ", e: "🐮" },
  { w: "鳥", zhu: "ㄋㄧㄠ", m: "ㄧ", e: "🐦" },
  { w: "電", zhu: "ㄉㄧㄢ", m: "ㄧ", e: "⚡" },
  { w: "天", zhu: "ㄊㄧㄢ", m: "ㄧ", e: "☁️" },
  { w: "家", zhu: "ㄐㄧㄚ", m: "ㄧ", e: "🏠" },
  { w: "象", zhu: "ㄒㄧㄤ", m: "ㄧ", e: "🐘" },
  { w: "熊", zhu: "ㄒㄩㄥ", m: "ㄩ", e: "🐻" },
  { w: "雪", zhu: "ㄒㄩㄝ", m: "ㄩ", e: "❄️" },
];

const optEmojiWord = (o, _q, picked) => (
  <>
    <div style={{ fontSize: 34 }}>{o.e}</div>
    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{o.w}</div>
    {picked && o.zhu && <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{o.zhu}</div>}
  </>
);

// ---------- 1. 韻母家族 ----------
function ZhFamilyMode({ speak, addStars }) {
  const makeQ = () => {
    const g = pickOne(ZH_FAMILIES);
    const ans = pickOne(g.items);
    const others = shuffle(ZH_RHYME_POOL.filter((x) => finalOf(x.zhu) !== g.f)).slice(0, 2);
    return { f: g.f, ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="👨‍👩‍👧" hint={t("哪一個字的韻母是它?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("找出韻母是 {0} 的字", BOPO_SOUND[q.f]), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => finalOf(o.zhu) === q.f}
      renderPrompt={(q) => (
        <>
          <div style={{ fontSize: 64, fontWeight: 800, color: T.purple }}>{q.f}</div>
          <div style={{ fontSize: 14, color: T.sub, fontWeight: 700 }}>{t("韻母家族")}</div>
        </>
      )}
      renderOption={optEmojiWord}
      onRight={(q, o) => zh(speak, tf("對!{0},韻母是 {1}", o.w, BOPO_SOUND[q.f]), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("答案是 {0}", q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 2. 注音聽力挑戰 ----------
function ZhListenQuizMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(ZH_WORDS);
    const others = pickOthers(ZH_WORDS, 2, ans.w, (x) => x.w);
    return { ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="👂" hint={t("聽聽看,是哪一個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.ans.w, { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => o.w === q.ans.w}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 56 }}>👂</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: picked ? T.greenDark : "#CFC9EE" }}>
            {picked ? `${q.ans.w} ${q.ans.zhu}` : "???"}
          </div>
        </>
      )}
      renderOption={optEmojiWord}
      onRight={(q) => zh(speak, tf("對!{0}", q.ans.w), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("這是 {0}", q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 3. 韻母偵探(尾音)----------
function ZhEndSoundMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(ZH_RHYME_POOL);
    const f = finalOf(ans.zhu);
    const others = shuffle(ZH_FINALS.filter((x) => x !== f)).slice(0, 2);
    return { ans, f, opts: shuffle([f, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔎" hint={t("這個字的韻母(最後的音)是哪個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.ans.w, { rate: 0.7 })}
      options={(q) => q.opts} keyOf={(o) => o}
      isRight={(o, q) => o === q.f}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 56 }}>{q.ans.e}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.ink }}>
            {q.ans.w}{picked ? ` ${q.ans.zhu}` : ""}
          </div>
        </>
      )}
      renderOption={(o, q, picked) => (
        <>
          <div style={{ fontSize: 40, fontWeight: 800, color: T.purple }}>{o}</div>
          {picked && <div style={{ fontSize: 13, color: T.sub }}>{BOPO_SOUND[o]}</div>}
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0} 的韻母是 {1}", q.ans.w, BOPO_SOUND[q.f]), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("{0},韻母是 {1}", q.ans.w, BOPO_SOUND[q.f]), { rate: 0.8 })}
    />
  );
}

// ---------- 4. 押韻火車(注音)----------
function ZhRhymeMode({ speak, addStars }) {
  const POOL = ZH_FAMILIES.filter((g) => g.items.length >= 2);
  const makeQ = () => {
    const g = pickOne(POOL);
    const [cue, ans] = shuffle(g.items).slice(0, 2);
    const others = shuffle(ZH_RHYME_POOL.filter((x) => finalOf(x.zhu) !== g.f)).slice(0, 2);
    return { cue, ans, f: g.f, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🚂" hint={t("哪一個和它押韻?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0},哪一個和 {1} 押韻?", q.cue.w, q.cue.w), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => finalOf(o.zhu) === q.f}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 56 }}>{q.cue.e}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink }}>{q.cue.w}</div>
          <div style={{ fontSize: 15, color: picked ? T.greenDark : T.sub, fontWeight: 700 }}>{picked ? tf("韻母 {0}", q.f) : q.cue.zhu}</div>
        </>
      )}
      renderOption={optEmojiWord}
      onRight={(q, o) => zh(speak, tf("{0}、{1},押韻!", q.cue.w, o.w), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("{0} 和 {1} 押韻", q.cue.w, q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 5. 聽指令點圖(中文)----------
const ZH_ORDERS = ["請點一下", "找找看", "可以指出"];
function ZhListenDoMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(ZH_WORDS);
    const others = pickOthers(ZH_WORDS, 2, ans.w, (x) => x.w);
    return { ans, verb: pickOne(ZH_ORDERS), opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="👉" hint={t("聽指令,點出正確的圖")}
      makeQ={makeQ}
      say={(q) => zh(speak, `${q.verb} ${q.ans.w}`, { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => o.w === q.ans.w}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 52 }}>👉</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: picked ? T.greenDark : "#CFC9EE" }}>{picked ? `${q.verb} ${q.ans.w}` : t("聽聽看老師說什麼")}</div>
        </>
      )}
      renderOption={(o, _q, picked) => (
        <>
          <div style={{ fontSize: 40 }}>{o.e}</div>
          {picked && <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{o.w}</div>}
        </>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, tf("這個才是 {0}", q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 6. 是不是?(中文)----------
function ZhYesNoMode({ speak, addStars }) {
  const makeQ = () => {
    const item = pickOne(ZH_WORDS);
    const same = Math.random() < 0.5;
    const claim = same ? item : pickOne(ZH_WORDS.filter((x) => x.w !== item.w));
    return { item, claim, same };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="✅" hint={t("聽問題,回答是或不是")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("這是 {0} 嗎?", q.claim.w), { rate: 0.8 })}
      options={() => ["yes", "no"]} keyOf={(o) => o}
      isRight={(o, q) => (o === "yes") === q.same}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 64 }}>{q.item.e}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.ink }}>{tf("這是 {0} 嗎?", q.claim.w)}</div>
          {picked && (
            <div style={{ fontSize: 14, color: T.greenDark, fontWeight: 700 }}>{tf("這是 {0}", q.item.w)}</div>
          )}
        </>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{o === "yes" ? t("⭕ 是") : t("❌ 不是")}</div>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, tf("這是 {0}", q.item.w), { rate: 0.8 })}
    />
  );
}

// ---------- 7. 數數小市場(中文)----------
function ZhCountMode({ speak, addStars }) {
  const makeQ = () => {
    const item = pickOne(ZH_WORDS.filter((x) => x.cat === "食物" || x.cat === "動物"));
    const n = 1 + Math.floor(Math.random() * 5);
    const set = new Set([n]);
    while (set.size < 3) set.add(1 + Math.floor(Math.random() * 5));
    return { item, n, opts: shuffle([...set]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🧺" hint={t("數數看,有幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("這裡有幾個 {0}?", q.item.w), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.n}
      renderPrompt={(q) => (
        <>
          <div style={{ fontSize: 34, lineHeight: 1.35 }}>{q.item.e.repeat(q.n)}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>{tf("有幾個 {0}?", q.item.w)}</div>
        </>
      )}
      renderOption={(o) => (
        <>
          <div style={{ fontSize: 34, fontWeight: 800, color: T.purple }}>{o}</div>
          <div style={{ fontSize: 14, color: T.sub, fontWeight: 700 }}>{ZH_NUM[o]}</div>
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}個", ZH_NUM[q.n]), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("一起數:有 {0} 個", ZH_NUM[q.n]), { rate: 0.8 })}
    />
  );
}

// ---------- 8. 聽顏色(中文)----------
function ZhColorMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(ZH_COLORS);
    const others = pickOthers(ZH_COLORS, 2, ans.w, (x) => x.w);
    return { ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🎨" hint={t("聽顏色,點出對的那個")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("哪一個是 {0}?", q.ans.w), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => o.w === q.ans.w}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 56 }}>🎨</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: picked ? q.ans.css : "#CFC9EE" }}>
            {picked ? q.ans.w : "???"}
          </div>
        </>
      )}
      renderOption={(o, _q, picked) => (
        <>
          <div style={{ width: 46, height: 46, borderRadius: "50%", margin: "0 auto",
            background: o.css, boxShadow: "inset 0 -3px 0 rgba(0,0,0,.15)" }} />
          {picked && <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 4 }}>{o.w}</div>}
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}", q.ans.w), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("這個才是 {0}", q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 9. 在哪裡?(中文方位)----------
function ZhPrepMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(ZH_PREPS);
    const others = pickOthers(ZH_PREPS, 2, ans.w, (x) => x.w);
    return { ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🧭" hint={t("聽聽看,球在盒子的哪裡?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("球在盒子的{0}", q.ans.w), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => o.w === q.ans.w}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 44 }}>⚽ 📦</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: picked ? T.greenDark : T.sub }}>{picked ? tf("球在盒子的{0}", q.ans.w) : t("球在盒子的哪裡?")}</div>
        </>
      )}
      renderOption={(o, _q, picked) => (
        <>
          <PrepScene prep={o.prep} />
          {picked && <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 4 }}>{o.w}</div>}
        </>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, tf("球在盒子的{0}", q.ans.w), { rate: 0.8 })}
    />
  );
}

// ---------- 10. 幾個字(音節)----------
function ZhSyllableMode({ speak, addStars }) {
  const makeQ = () => ({ item: pickOne(ZH_WORDS) });
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="👏" hint={t("拍拍看,這個詞有幾個字?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.item.w, { rate: 0.6 })}
      options={() => [1, 2, 3]} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.item.w.length}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 56 }}>{q.item.e}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: 4 }}>
            {q.item.w}
          </div>
          {picked && <div style={{ fontSize: 14, color: T.sub }}>{q.item.zhu}</div>}
        </>
      )}
      renderOption={(o) => (
        <>
          <div style={{ fontSize: 22 }}>{"👏".repeat(o)}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.purple }}>{o}</div>
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}個字", ZH_NUM[q.item.w.length]), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("{0},{1}個字", q.item.w, ZH_NUM[q.item.w.length]), { rate: 0.7 })}
    />
  );
}

// ---------- 11. 中間的音(介音)----------
function ZhMedialMode({ speak, addStars }) {
  const makeQ = () => ({ item: pickOne(ZH_MEDIAL) });
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🅰️" hint={t("中間少了哪個音?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.item.w, { rate: 0.6 })}
      options={() => ["ㄧ", "ㄨ", "ㄩ"]} keyOf={(o) => o}
      isRight={(o, q) => o === q.item.m}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 52 }}>{q.item.e}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: T.ink, letterSpacing: 3 }}>
            {picked
              ? q.item.zhu
              : q.item.zhu.replace(q.item.m, "◯")}
          </div>
          <div style={{ fontSize: 14, color: T.sub, fontWeight: 700 }}>{picked ? q.item.w : ""}</div>
        </>
      )}
      renderOption={(o, _q, picked) => (
        <>
          <div style={{ fontSize: 40, fontWeight: 800, color: T.purple }}>{o}</div>
          {picked && <div style={{ fontSize: 13, color: T.sub }}>{BOPO_SOUND[o]}</div>}
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}", q.item.w), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("是 {0},{1}", BOPO_SOUND[q.item.m], q.item.w), { rate: 0.75 })}
    />
  );
}

// ---------- 12. 注音找找看(聽音認符號)----------
function ZhFindMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(BOPOMOFO);
    const others = pickOthers(BOPOMOFO, 2, ans.s, (x) => x.s);
    return { ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔍" hint={t("聽注音的聲音,找出符號")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.ans.sound, { rate: 0.6 })}
      options={(q) => q.opts} keyOf={(o) => o.s}
      isRight={(o, q) => o.s === q.ans.s}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 52 }}>👂</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: picked ? T.greenDark : "#CFC9EE" }}>
            {picked ? `${q.ans.s}(${q.ans.sound})` : "???"}
          </div>
        </>
      )}
      renderOption={(o, _q, picked) => (
        <>
          <div style={{ fontSize: 42, fontWeight: 800, color: T.purple }}>{o.s}</div>
          {picked && <div style={{ fontSize: 13, color: T.sub }}>{o.sound}</div>}
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0},{1}", q.ans.sound, q.ans.word), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("是這個,{0}", q.ans.sound), { rate: 0.8 })}
    />
  );
}

// ---------- 13. 聲母還是韻母? ----------
function ZhTypeMode({ speak, addStars }) {
  const makeQ = () => {
    const isC = Math.random() < 0.5;
    return { item: pickOne(isC ? ZH_CONSONANTS : ZH_VOWELS), isC };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="🧠" hint={t("這個注音放前面還是後面?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.item.sound, { rate: 0.6 })}
      options={() => ["c", "v"]} keyOf={(o) => o}
      isRight={(o, q) => (o === "c") === q.isC}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 72, fontWeight: 800, color: T.purple }}>{q.item.s}</div>
          <div style={{ fontSize: 15, color: picked ? T.greenDark : T.sub, fontWeight: 700 }}>{picked ? `${q.item.sound} · ${q.item.word}` : t("聽聽看再選")}</div>
        </>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, lineHeight: 1.35 }}>{o === "c" ? t("🅱️ 聲母") : t("🅾️ 韻母")}<div style={{ fontSize: 12, color: T.sub, fontWeight: 700 }}>{o === "c" ? t("放前面") : t("放後面")}</div>
        </div>
      )}
      onRight={(q) => zh(speak, tf("對!{0} 是{1}", q.item.s, q.isC ? t("聲母") : t("韻母")), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("{0} 是{1}", q.item.s, q.isC ? t("聲母,放前面") : t("韻母,放後面")), { rate: 0.8 })}
    />
  );
}

// ---------- 14. 相反詞配對(中文)----------
function ZhOppositeMode({ speak, addStars }) {
  const makeQ = () => {
    const p = pickOne(ZH_OPPOSITES);
    const flip = Math.random() < 0.5;
    const cue = flip ? p.b : p.a;
    const ans = flip ? p.a : p.b;
    const others = shuffle(ZH_OPPOSITES.filter((x) => x !== p))
      .slice(0, 2)
      .map((x) => (Math.random() < 0.5 ? x.a : x.b));
    return { cue, ans, opts: shuffle([ans, ...others]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="↔️" hint={t("哪一個是它的相反?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 的相反是什麼?", q.cue.w), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => o.w}
      isRight={(o, q) => o.w === q.ans.w}
      renderPrompt={(q) => (
        <>
          <div style={{ fontSize: 56 }}>{q.cue.e}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.ink }}>{q.cue.w}</div>
          <div style={{ fontSize: 15, color: T.sub, fontWeight: 700 }}>{t("的相反是?")}</div>
        </>
      )}
      renderOption={optEmojiWord}
      onRight={(q) => zh(speak, tf("對!{0} 的相反是 {1}", q.cue.w, q.ans.w), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("{0} 的相反是 {1}", q.cue.w, q.ans.w), { rate: 0.8 })}
    />
  );
}

// ========== ㄅㄆㄇ:6 個自訂玩法 ==========

// ---------- 15. 拼注音小廚師 ----------
const ZH_SPELL_POOL = ZH_WORDS.filter((x) => x.w.length === 1 && stripTone(x.zhu).length >= 2);
function makeZhSpellRound() {
  const word = pickOne(ZH_SPELL_POOL);
  const parts = stripTone(word.zhu).split("");
  const extras = shuffle(BOPO_SYMBOLS.filter((s) => !parts.includes(s))).slice(0, 2);
  return { word, parts, tiles: shuffle([...parts, ...extras]).map((ch, i) => ({ id: i, ch })) };
}
function ZhSpellMode({ speak, addStars }) {
  const [round, setRound] = useState(makeZhSpellRound);
  const [used, setUsed] = useState(() => new Set());
  const [filled, setFilled] = useState(0);
  const [wrongId, setWrongId] = useState(null);
  const [doneWord, setDoneWord] = useState(false);
  const [wins, setWins] = useState(0);
  const { word, parts, tiles } = round;

  useEffect(() => {
    const t = setTimeout(() => zh(speak, word.w, { rate: 0.7 }), 400);
    return () => clearTimeout(t);
  }, [round, word, speak]);

  const next = () => {
    setRound(makeZhSpellRound()); setUsed(new Set()); setFilled(0);
    setWrongId(null); setDoneWord(false);
  };

  const tap = (tile) => {
    if (doneWord || used.has(tile.id)) return;
    if (tile.ch === parts[filled]) {
      const nf = filled + 1;
      setUsed((u) => new Set(u).add(tile.id));
      setFilled(nf);
      setWrongId(null);
      if (nf >= parts.length) {
        setDoneWord(true); setWins((w) => w + 1); addStars(2);
        zh(speak, word.w, { rate: 0.85, onEnd: () => zh(speak, t("太棒了!"), { rate: 0.95 }) });
      } else zh(speak, BOPO_SOUND[tile.ch], { rate: 0.7 });
    } else {
      setWrongId(tile.id);
      setTimeout(() => setWrongId(null), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("照順序點注音磚,把這個字拼出來!拼好一個 +2 ⭐,已完成 {0} 個", wins)}</p>
      <div style={{ background: T.card, borderRadius: 24, padding: "22px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 56 }}>{word.e}</div>
        <div style={{ fontSize: 22, color: T.ink, fontWeight: 700, marginBottom: 12 }}>{word.w}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {parts.map((ch, i) => {
            const isFilled = i < filled;
            const isNext = i === filled && !doneWord;
            return (
              <div key={i} style={{
                width: 52, height: 60, borderRadius: 12, display: "grid", placeItems: "center",
                fontSize: 32, fontWeight: 700,
                background: isFilled ? "#E9FBEF" : "#F6F4FE",
                border: `3px solid ${isFilled ? T.green : isNext ? T.purple : "#E8E4FA"}`,
                color: isFilled ? T.greenDark : "#C9C4E8", transition: "all .15s",
              }}>{ch}</div>
            );
          })}
        </div>
        {doneWord && (
          <div style={{ marginTop: 10, fontSize: 19, color: T.greenDark, fontWeight: 700 }}>{tf("🎉 拼出「{0}」{1} 了!+2 ⭐", word.w, word.zhu)}</div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
        maxWidth: 320, margin: "0 auto 14px" }}>
        {tiles.map((tile) => {
          const spent = used.has(tile.id);
          const isWrong = wrongId === tile.id;
          return (
            <button key={tile.id} onClick={() => tap(tile)}
              style={{
                padding: "16px 0", borderRadius: 16, fontFamily: "inherit",
                fontSize: 28, fontWeight: 700,
                background: spent ? "#F1EEFB" : isWrong ? "#FFEDED" : T.yellow,
                border: `3px solid ${isWrong ? T.red : spent ? "#E8E4FA" : T.yellowDark}`,
                color: spent ? "#D2CCED" : T.ink, cursor: spent ? "default" : "pointer",
                boxShadow: spent ? "none" : "0 4px 0 #E0B400",
                animation: isWrong ? "wp-shake .3s" : "none", transition: "all .15s",
              }}>{tile.ch}</button>
          );
        })}
      </div>
      {doneWord ? (
        <ChunkyButton color={T.green} dark={T.greenDark} onClick={next}>{t("下一個字 →")}</ChunkyButton>
      ) : (
        <ChunkyButton color={T.yellow} dark={T.yellowDark} style={{ color: T.ink }}
          onClick={() => zh(speak, word.w, { rate: 0.7 })}>{t("🔊 再聽一次")}</ChunkyButton>
      )}
    </div>
  );
}

// ---------- 16. 少了誰?(注音記憶)----------
function makeZhMissingQ(n) {
  const items = shuffle(BOPOMOFO).slice(0, n);
  const missing = pickOne(items);
  return { items, missing, shown: shuffle(items.filter((x) => x.s !== missing.s)) };
}
function ZhMissingMode({ speak, addStars }) {
  const TOTAL = 8;
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(() => makeZhMissingQ(3));
  const [phase, setPhase] = useState("memorize");
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const options = useMemo(() => shuffle([...q.items]), [q]);

  const nextRound = () => {
    const r = roundNo + 1;
    setRoundNo(r); setQ(makeZhMissingQ(r > 4 ? 4 : 3));
    setPhase("memorize"); setPicked(null);
  };

  const pick = (b) => {
    if (picked) return;
    setPicked(b.s);
    const ok = b.s === q.missing.s;
    if (ok) { setRight((r) => r + 1); addStars(1); zh(speak, tf("對!是 {0}", q.missing.sound), { rate: 0.9 }); }
    else zh(speak, tf("少了 {0}", q.missing.sound), { rate: 0.8 });
    setTimeout(() => { if (roundNo >= TOTAL) setDone(true); else nextRound(); }, 1700);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🧠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("答對 {0} / {1} 題!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeZhMissingQ(3)); setPhase("memorize"); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 題・{2}", roundNo, TOTAL, phase === "memorize" ? t("先記住這些注音 👀") : t("少了哪一個注音?"))}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 12px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7", minHeight: 110,
        display: "flex", gap: 14, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        {(phase === "memorize" ? q.items : q.shown).map((b) => (
          <span key={b.s} style={{ fontSize: 46, fontWeight: 800, color: T.purple }}>{b.s}</span>
        ))}
        {phase === "guess" && <span style={{ fontSize: 46 }}>❓</span>}
      </div>
      {phase === "memorize" ? (
        <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setPhase("guess")}>{t("記好了,蓋起來!")}</ChunkyButton>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 10 }}>
          {options.map((b) => {
            const isAns = b.s === q.missing.s;
            let bg = T.card, bd = "#E8E4FA";
            if (picked) {
              if (isAns) { bg = "#E9FBEF"; bd = T.green; }
              else if (b.s === picked) { bg = "#FFF7DA"; bd = T.yellow; }
            }
            return (
              <button key={b.s} onClick={() => pick(b)}
                style={{
                  background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                  padding: "16px 0", fontFamily: "inherit", fontSize: 36, fontWeight: 800,
                  color: T.purple, cursor: picked ? "default" : "pointer",
                  boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
                }}>{b.s}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- 17. 記憶排排看(注音)----------
function ZhSequenceMode({ speak, addStars }) {
  const TOTAL = 6;
  const poolRef = useRef(shuffle(BOPOMOFO).slice(0, 4));
  const seqLen = (r) => (r <= 2 ? 2 : r <= 4 ? 3 : 4);
  const makeSeq = (r) => {
    const pool = poolRef.current;
    const s = [];
    for (let i = 0; i < seqLen(r); i++) s.push(pickOne(pool));
    return s;
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [seq, setSeq] = useState(() => makeSeq(1));
  const [phase, setPhase] = useState("show");
  const [litIdx, setLitIdx] = useState(-1);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    if (phase !== "show") return;
    clearTimers();
    setLitIdx(-1);
    seq.forEach((b, i) => {
      timers.current.push(setTimeout(() => { setLitIdx(i); zh(speak, b.sound, { rate: 0.7 }); }, 500 + i * 950));
    });
    timers.current.push(setTimeout(() => { setLitIdx(-1); setStep(0); setPhase("input"); }, 500 + seq.length * 950 + 300));
    return clearTimers;
  }, [phase, seq, speak]);

  const startRound = (r) => { setSeq(makeSeq(r)); setStep(0); setLitIdx(-1); setPhase("show"); };

  const tap = (b) => {
    if (phase !== "input") return;
    if (b.s === seq[step].s) {
      zh(speak, b.sound, { rate: 0.75 });
      const ns = step + 1;
      if (ns >= seq.length) {
        addStars(1); setRight((r) => r + 1); setPhase("good");
        zh(speak, t("太棒了!"), { rate: 0.95 });
        timers.current.push(setTimeout(() => {
          if (roundNo >= TOTAL) setDone(true);
          else { const nr = roundNo + 1; setRoundNo(nr); startRound(nr); }
        }, 1300));
      } else setStep(ns);
    } else {
      zh(speak, seq[step].sound, { rate: 0.7 });
      timers.current.push(setTimeout(() => setPhase("show"), 700));
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "🧠"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("記對 {0} / {1} 組順序!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); startRound(1); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{tf("第 {0} / {1} 組・{2}", roundNo, TOTAL, phase === "input" ? t("照剛剛的順序點出來!") : t("記住亮起來的順序 👀"))}</div>
      {phase !== "input" && (
        <div style={{ background: T.card, borderRadius: 22, padding: "24px 12px",
          marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7", minHeight: 120,
          display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {seq.map((b, i) => (
            <span key={i} style={{
              fontSize: 48, fontWeight: 800, color: T.purple, transition: "all .2s",
              transform: litIdx === i ? "scale(1.3)" : "scale(1)",
              opacity: litIdx === i ? 1 : 0.25,
            }}>{b.s}</span>
          ))}
        </div>
      )}
      {phase === "input" && (
        <>
          <div style={{ fontSize: 22, marginBottom: 10 }}>
            {seq.map((_, i) => <span key={i}>{i < step ? "⭐" : "⬜"}</span>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {poolRef.current.map((b) => (
              <button key={b.s} onClick={() => tap(b)}
                style={{
                  background: T.card, border: "3px solid #E8E4FA", borderRadius: 18,
                  padding: "18px 4px", fontFamily: "inherit", cursor: "pointer",
                  boxShadow: "0 5px 0 #E0DBF7",
                }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: T.purple }}>{b.s}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.sub }}>{b.sound}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- 18. 排大小(中文)----------
function ZhSizeMode({ speak, addStars }) {
  const TOTAL = 6;
  const makeQ = () => {
    const three = shuffle(ZH_SIZE).slice(0, 3).sort((a, b) => a.size - b.size);
    return { order: three, display: shuffle([...three]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [progress, setProgress] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [done, setDone] = useState(false);
  const [cleared, setCleared] = useState(false);

  const nextRound = () => {
    if (roundNo >= TOTAL) { setDone(true); return; }
    setRoundNo((r) => r + 1); setQ(makeQ()); setProgress(0); setCleared(false);
  };

  const tap = (item) => {
    if (cleared) return;
    if (item.size === q.order[progress].size) {
      zh(speak, item.w, { rate: 0.85 });
      const np = progress + 1;
      setProgress(np); setWrong(null);
      if (np >= q.order.length) {
        setRight((r) => r + 1); addStars(1); setCleared(true);
        zh(speak, t("太棒了!"), { rate: 0.95 });
        setTimeout(nextRound, 1300);
      }
    } else {
      setWrong(item.w);
      zh(speak, item.w, { rate: 0.85 });
      setTimeout(() => setWrong(null), 500);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "📏"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("排對 {0} / {1} 組!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setProgress(0); setCleared(false); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{tf("第 {0} / {1} 組・從「最小」開始,由小到大點!", roundNo, TOTAL)}</div>
      <div style={{ fontSize: 20, marginBottom: 12, color: T.purple, fontWeight: 700 }}>{t("🐜 小 →→→ 大 🐘")}</div>
      <div style={{ minHeight: 70, display: "flex", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
        {q.order.slice(0, progress).map((it, i) => (
          <span key={it.w} style={{ fontSize: 30 + i * 12 }}>{it.e}</span>
        ))}
        {progress < q.order.length && <span style={{ fontSize: 22, color: "#C9C4E8" }}>{tf("👉 點第 {0} 小的", progress + 1)}</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.display.map((it) => {
          const placed = q.order.slice(0, progress).some((x) => x.w === it.w);
          const isWrong = wrong === it.w;
          return (
            <button key={it.w} onClick={() => tap(it)} disabled={placed}
              style={{
                background: placed ? "#E9FBEF" : isWrong ? "#FFEDED" : T.card,
                border: `3px solid ${placed ? T.green : isWrong ? T.red : "#E8E4FA"}`,
                borderRadius: 18, padding: "16px 4px", fontFamily: "inherit",
                cursor: placed ? "default" : "pointer", boxShadow: "0 5px 0 #E0DBF7",
                opacity: placed ? 0.6 : 1, animation: isWrong ? "wp-shake .3s" : "none",
                transition: "all .15s",
              }}>
              <div style={{ fontSize: 44 }}>{it.e}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{it.w}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 19. 注音小故事 ----------
const ZH_STORIES = [
  {
    title: "我的生日", emoji: "🎂",
    lines: [
      { zh: "今天是我的生日", zhu: "ㄐㄧㄣ ㄊㄧㄢ ㄕˋ ㄨㄛˇ ˙ㄉㄜ ㄕㄥ ㄖˋ", e: "🎉" },
      { zh: "我和家人吃蛋糕", zhu: "ㄨㄛˇ ㄏㄢˋ ㄐㄧㄚ ㄖㄣˊ ㄔ ㄉㄢˋ ㄍㄠ", e: "🎂" },
      { zh: "我好開心", zhu: "ㄨㄛˇ ㄏㄠˇ ㄎㄞ ㄒㄧㄣ", e: "🤩" },
    ],
    q: { zh: "我吃了什麼?", ans: "蛋糕",
      options: [{ w: "蛋糕", e: "🎂" }, { w: "蛋", e: "🥚" }, { w: "麵包", e: "🍞" }] },
  },
  {
    title: "樹上的小鳥", emoji: "🐦",
    lines: [
      { zh: "小鳥在樹上", zhu: "ㄒㄧㄠˇ ㄋㄧㄠˇ ㄗㄞˋ ㄕㄨˋ ㄕㄤˋ", e: "🌳" },
      { zh: "小鳥在唱歌", zhu: "ㄒㄧㄠˇ ㄋㄧㄠˇ ㄗㄞˋ ㄔㄤˋ ㄍㄜ", e: "🎤" },
      { zh: "我聽小鳥唱歌", zhu: "ㄨㄛˇ ㄊㄧㄥ ㄒㄧㄠˇ ㄋㄧㄠˇ ㄔㄤˋ ㄍㄜ", e: "🎧" },
    ],
    q: { zh: "小鳥在哪裡?", ans: "樹",
      options: [{ w: "樹", e: "🌳" }, { w: "車子", e: "🚗" }, { w: "床", e: "🛏️" }] },
  },
  {
    title: "小熊晚安", emoji: "🐻",
    lines: [
      { zh: "小熊好累", zhu: "ㄒㄧㄠˇ ㄒㄩㄥˊ ㄏㄠˇ ㄌㄟˋ", e: "🐻" },
      { zh: "小熊去睡覺", zhu: "ㄒㄧㄠˇ ㄒㄩㄥˊ ㄑㄩˋ ㄕㄨㄟˋ ㄐㄧㄠˋ", e: "🛏️" },
      { zh: "小熊晚安", zhu: "ㄒㄧㄠˇ ㄒㄩㄥˊ ㄨㄢˇ ㄢ", e: "🌙" },
    ],
    q: { zh: "小熊去做什麼?", ans: "睡覺",
      options: [{ w: "睡覺", e: "🛏️" }, { w: "上學", e: "🏫" }, { w: "游泳", e: "🏊" }] },
  },
  {
    title: "去海邊", emoji: "🏖️",
    lines: [
      { zh: "我們坐公車", zhu: "ㄨㄛˇ ˙ㄇㄣ ㄗㄨㄛˋ ㄍㄨㄥ ㄔㄜ", e: "🚌" },
      { zh: "公車跑得好快", zhu: "ㄍㄨㄥ ㄔㄜ ㄆㄠˇ ˙ㄉㄜ ㄏㄠˇ ㄎㄨㄞˋ", e: "💨" },
      { zh: "我們到海邊了", zhu: "ㄨㄛˇ ˙ㄇㄣ ㄉㄠˋ ㄏㄞˇ ㄅㄧㄢ ˙ㄌㄜ", e: "🏖️" },
    ],
    q: { zh: "我們去哪裡?", ans: "海邊",
      options: [{ w: "海邊", e: "🏖️" }, { w: "學校", e: "🏫" }, { w: "山", e: "⛰️" }] },
  },
  {
    title: "小猴子吃香蕉", emoji: "🐵",
    lines: [
      { zh: "小猴子肚子餓", zhu: "ㄒㄧㄠˇ ㄏㄡˊ ˙ㄗ ㄉㄨˋ ˙ㄗ ㄜˋ", e: "🐵" },
      { zh: "小猴子吃香蕉", zhu: "ㄒㄧㄠˇ ㄏㄡˊ ˙ㄗ ㄔ ㄒㄧㄤ ㄐㄧㄠ", e: "🍌" },
      { zh: "好好吃呀", zhu: "ㄏㄠˇ ㄏㄠˇ ㄔ ㄧㄚ", e: "😋" },
    ],
    q: { zh: "小猴子吃什麼?", ans: "香蕉",
      options: [{ w: "香蕉", e: "🍌" }, { w: "披薩", e: "🍕" }, { w: "葉子", e: "🍃" }] },
  },
];
function ZhStoryMode({ speak, addStars }) {
  const [si, setSi] = useState(0);
  const [heard, setHeard] = useState(() => new Set());
  const [picked, setPicked] = useState(null);
  const story = ZH_STORIES[si];
  const allHeard = heard.size >= story.lines.length;

  const goStory = (i) => { setSi(i); setHeard(new Set()); setPicked(null); };

  const pick = (opt) => {
    if (picked) return;
    setPicked(opt.w);
    if (opt.w === story.q.ans) {
      addStars(2);
      zh(speak, story.q.ans, { rate: 0.85, onEnd: () => zh(speak, t("太棒了!"), { rate: 0.95 }) });
    } else {
      zh(speak, story.q.zh, { rate: 0.75 });
      setTimeout(() => setPicked(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 10px" }}>{tf("第 {0} / {1} 個小故事・每句都點一下聽,聽完回答問題!", si + 1, ZH_STORIES.length)}</p>
      <h2 style={{ color: T.ink, fontSize: 22, margin: "0 0 12px" }}>
        {story.emoji} {story.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {story.lines.map((ln, i) => {
          const ok = heard.has(i);
          return (
            <button key={i}
              onClick={() => { zh(speak, ln.zh, { rate: 0.75 }); setHeard((s) => new Set(s).add(i)); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                background: ok ? "#E9FBEF" : T.card,
                border: `3px solid ${ok ? T.green : "#E8E4FA"}`,
                borderRadius: 18, padding: "12px 14px", fontFamily: "inherit",
                cursor: "pointer", boxShadow: "0 4px 0 #E0DBF7", transition: "all .15s",
              }}>
              <span style={{ fontSize: 34 }}>{ln.e}</span>
              <span>
                <div style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>{ln.zh}</div>
                <div style={{ fontSize: 12, color: T.sub, letterSpacing: 1 }}>{ln.zhu}</div>
              </span>
              <span style={{ marginLeft: "auto", fontSize: 14, color: ok ? T.greenDark : "#C9C4E8" }}>
                {ok ? "✓" : "🔈"}
              </span>
            </button>
          );
        })}
      </div>

      {allHeard && (
        <div style={{ background: T.card, borderRadius: 22, padding: "16px",
          boxShadow: "0 5px 0 #E0DBF7", marginBottom: 12 }}>
          <button onClick={() => zh(speak, story.q.zh, { rate: 0.8 })}
            style={{ background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.purple }}>❓ {story.q.zh} 🔈</div>
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            {story.q.options.map((opt) => {
              const isAns = opt.w === story.q.ans;
              let bg = T.card, bd = "#E8E4FA";
              if (picked) {
                if (isAns) { bg = "#E9FBEF"; bd = T.green; }
                else if (opt.w === picked) { bg = "#FFF7DA"; bd = T.yellow; }
              }
              return (
                <button key={opt.w} onClick={() => pick(opt)}
                  style={{
                    background: bg, border: `3px solid ${bd}`, borderRadius: 16,
                    padding: "12px 4px", fontFamily: "inherit", fontWeight: 700,
                    cursor: picked ? "default" : "pointer", boxShadow: "0 4px 0 #E0DBF7",
                    transition: "all .15s",
                  }}>
                  <div style={{ fontSize: 36 }}>{opt.e}</div>
                  <div style={{ fontSize: 14, color: T.ink }}>{opt.w}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {ZH_STORIES.map((s, i) => (
          <button key={i} onClick={() => goStory(i)}
            style={{
              fontFamily: "inherit", fontSize: 22, border: "none", borderRadius: 14,
              padding: "8px 12px", cursor: "pointer",
              background: i === si ? T.purple : "#EFECFB",
              boxShadow: i === si ? "0 4px 0 #4B3BAF" : "none",
            }}>{s.emoji}</button>
        ))}
      </div>
    </div>
  );
}

// ---------- 20. 注音快手(關卡制)----------
const ZH_SIGHT_KEY = "wordpop-bopo-sight-progress";
const ZH_SIGHT_LEVELS = [];
for (let i = 0; i < BOPOMOFO.length; i += 5) ZH_SIGHT_LEVELS.push(BOPOMOFO.slice(i, i + 5));
if (ZH_SIGHT_LEVELS.length > 1 && ZH_SIGHT_LEVELS[ZH_SIGHT_LEVELS.length - 1].length < 3) {
  const tail = ZH_SIGHT_LEVELS.pop();
  ZH_SIGHT_LEVELS[ZH_SIGHT_LEVELS.length - 1] = ZH_SIGHT_LEVELS[ZH_SIGHT_LEVELS.length - 1].concat(tail);
}

function ZhSightMode({ speak, addStars }) {
  const [view, setView] = useState("map");
  const [lv, setLv] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress(ZH_SIGHT_KEY));
  const [heard, setHeard] = useState(() => new Set());
  const [queue, setQueue] = useState([]);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [mastered, setMastered] = useState(() => new Set());
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [encourage, setEncourage] = useState("");
  const [gotStars, setGotStars] = useState(1);

  const items = ZH_SIGHT_LEVELS[lv];
  const nChoices = lv < 3 ? 2 : 3;
  const target = queue[0];

  const makeOptions = (b, pool, n) => {
    const others = shuffle(pool.filter((x) => x.s !== b.s)).slice(0, n - 1);
    return shuffle([b, ...others]);
  };

  const openLevel = (i) => { setLv(i); setHeard(new Set()); setView("learn"); };

  const startQuiz = () => {
    const q = shuffle(items);
    setQueue(q); setMastered(new Set()); setWrongSet(new Set());
    setPicked(null); setEncourage("");
    setOptions(makeOptions(q[0], items, nChoices));
    setView("quiz");
  };

  useEffect(() => {
    if (view === "quiz" && target) {
      const t = setTimeout(() => zh(speak, target.sound, { rate: 0.65 }), 400);
      return () => clearTimeout(t);
    }
  }, [view, target, speak]);

  const pick = (b) => {
    if (picked || !target) return;
    setPicked(b.s);
    if (b.s === target.s) {
      addStars(1);
      zh(speak, `${target.sound}!${target.word}`, { rate: 0.85 });
      const nm = new Set(mastered).add(target.s);
      setTimeout(() => {
        setMastered(nm);
        const rest = queue.slice(1);
        if (rest.length === 0) {
          const perfect = items.length - wrongSet.size;
          const starsGot = perfect >= items.length ? 3 : perfect >= items.length - 1 ? 2 : 1;
          setGotStars(starsGot); addStars(starsGot);
          setProgress((p) => {
            const np = { ...p, [lv]: Math.max(p[lv] || 0, starsGot) };
            saveProgress(ZH_SIGHT_KEY, np);
            return np;
          });
          setView("clear");
        } else {
          setQueue(rest); setPicked(null); setEncourage("");
          setOptions(makeOptions(rest[0], items, nChoices));
        }
      }, 1200);
    } else {
      setWrongSet((s) => new Set(s).add(target.s));
      setEncourage(t("沒關係!仔細聽,它等一下還會再出現 💪"));
      zh(speak, target.sound, { rate: 0.6 });
      setTimeout(() => {
        const rest = [...queue.slice(1), queue[0]];
        setQueue(rest); setPicked(null);
        setOptions(makeOptions(rest[0], items, nChoices));
      }, 1600);
    }
  };

  if (view === "map") {
    const crowns = Object.values(progress).filter((s) => s >= 3).length;
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 4px" }}>{t("聽到聲音就要馬上認出注音符號,一關 5 個。")}</p>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>{tf("收集皇冠吧!👑 {0} / {1}", crowns, ZH_SIGHT_LEVELS.length)}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {ZH_SIGHT_LEVELS.map((lvItems, i) => {
            const unlocked = i === 0 || (progress[i - 1] || 0) >= 1;
            const best = progress[i] || 0;
            return (
              <button key={i} onClick={() => unlocked && openLevel(i)}
                style={{
                  fontFamily: "inherit", fontWeight: 700, border: "none",
                  borderRadius: 18, padding: "12px 0 10px",
                  cursor: unlocked ? "pointer" : "default",
                  background: unlocked ? (best >= 3 ? "#FFF7DA" : T.card) : "#ECEAF6",
                  color: unlocked ? T.ink : "#C0BBDE",
                  boxShadow: unlocked ? "0 5px 0 #E0DBF7" : "none", transition: "all .15s",
                }}>
                <div style={{ fontSize: 20 }}>{unlocked ? (best >= 3 ? "👑" : lvItems[0].s) : "🔒"}</div>
                <div style={{ fontSize: 12, height: 16, color: T.yellowDark }}>
                  {best > 0 ? "⭐".repeat(best) : ""}
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 16 }}>{t("每一關都一定會過,答錯的會再出現,答對就好 💜")}</p>
      </div>
    );
  }

  if (view === "clear") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{gotStars >= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0 4px" }}>{tf("第 {0} 關完成!", lv + 1)}</h2>
        <div style={{ fontSize: 34 }}>{"⭐".repeat(gotStars)}</div>
        <p style={{ color: T.sub, fontSize: 15, margin: "6px 0 18px" }}>
          {gotStars >= 3 ? t("全部一次答對,拿到皇冠!") : t("這一關的注音全部學會了,太厲害!")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setView("map")}>{t("回關卡地圖")}</ChunkyButton>
          {lv + 1 < ZH_SIGHT_LEVELS.length && (
            <ChunkyButton color={T.green} dark={T.greenDark} onClick={() => openLevel(lv + 1)}>{t("下一關 →")}</ChunkyButton>
          )}
        </div>
      </div>
    );
  }

  if (view === "learn") {
    const allHeard = heard.size >= items.length;
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{tf("第 {0} 關的 {1} 個注音 👋", lv + 1, items.length)}</p>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 14px" }}>{t("每張卡都點一下聽聽看,全部聽過就可以開始挑戰!")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))", gap: 10, marginBottom: 16 }}>
          {items.map((b) => {
            const ok = heard.has(b.s);
            return (
              <button key={b.s}
                onClick={() => { zh(speak, `${b.sound},${b.word}`, { rate: 0.75 }); setHeard((s) => new Set(s).add(b.s)); }}
                style={{
                  background: ok ? "#E9FBEF" : T.card,
                  border: `3px solid ${ok ? T.green : "#E8E4FA"}`,
                  borderRadius: 18, padding: "16px 4px 12px", fontFamily: "inherit",
                  fontSize: 34, fontWeight: 800, color: T.purple, cursor: "pointer",
                  boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
                }}>
                {b.s}
                <div style={{ fontSize: 12, marginTop: 6, color: ok ? T.greenDark : "#C9C4E8" }}>{ok ? `✓ ${b.word}` : t("🔈 點我")}</div>
              </button>
            );
          })}
        </div>
        <ChunkyButton color={T.pink} dark="#D14B7D" onClick={startQuiz} disabled={!allHeard}
          style={{ width: "100%" }}>{allHeard ? t("🎈 開始挑戰!") : tf("再聽 {0} 張卡就能挑戰", items.length - heard.size)}</ChunkyButton>
        <button onClick={() => setView("map")}
          style={{
            marginTop: 12, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            background: "none", border: "none", color: T.sub, cursor: "pointer",
          }}>{t("← 回關卡地圖")}</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 26, letterSpacing: 4, marginBottom: 10 }}>
        {items.map((b) => <span key={b.s}>{mastered.has(b.s) ? "⭐" : "🎈"}</span>)}
      </div>
      <div style={{ background: T.card, borderRadius: 22, padding: "20px 16px",
        marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <p style={{ color: T.sub, margin: "0 0 10px", fontSize: 15 }}>{t("仔細聽,點出正確的注音,氣球就會變星星!")}</p>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} style={{ color: T.ink }}
          onClick={() => target && zh(speak, target.sound, { rate: 0.65 })}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: nChoices === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
        {options.map((b) => {
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (target && b.s === target.s) { bg = "#E9FBEF"; bd = T.green; }
            else if (b.s === picked) { bg = "#FFF7DA"; bd = T.yellow; }
          }
          return (
            <button key={b.s} onClick={() => pick(b)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "24px 8px", fontFamily: "inherit", fontSize: 40,
                fontWeight: 800, color: T.purple, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>{b.s}</button>
          );
        })}
      </div>
      {encourage && (
        <div style={{ marginTop: 14, fontSize: 15, color: T.sub, fontWeight: 700 }}>{encourage}</div>
      )}
    </div>
  );
}

// ========== 數字/數學:共用資料與零件 ==========

const NUM_ZH = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
const numZh = (n) => (LANG === "en" ? String(n) : (NUM_ZH[n] ?? String(n)));
const NUM_EMOJI = ["🍎", "🍓", "⭐", "🎈", "🐟", "🍪", "🌸", "🚗", "🐛", "🎾", "🍌", "🧸"];
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
// 產生含正解的 n 個不重複數字選項
function numOptions(ans, n, lo, hi) {
  const set = new Set([ans]);
  let guard = 0;
  while (set.size < n && guard++ < 200) set.add(randInt(lo, hi));
  return shuffle([...set]);
}

// 十格框:大班數感的核心教具(滿五、湊十一眼看得出來)
function TenFrame({ n, dot = 20, color = T.purple }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4,
      width: "fit-content", margin: "0 auto", background: "#F6F4FE",
      border: "2px solid #E0DBF7", borderRadius: 12, padding: 6,
    }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{
          width: dot, height: dot, borderRadius: "50%",
          background: i < n ? color : "transparent",
          border: `2px solid ${i < n ? color : "#E0DBF7"}`,
        }} />
      ))}
    </div>
  );
}

// 形狀(用 SVG 畫,才能同一個形狀換顏色與大小)
const SHAPES = [
  { k: "circle", w: "圓形", en: "circle" },
  { k: "square", w: "正方形", en: "square" },
  { k: "triangle", w: "三角形", en: "triangle" },
  { k: "rect", w: "長方形", en: "rectangle" },
  { k: "star", w: "星形", en: "star" },
  { k: "heart", w: "愛心", en: "heart" },
  { k: "oval", w: "橢圓形", en: "oval" },
  { k: "diamond", w: "菱形", en: "diamond" },
];
const SHAPE_COLORS = ["#E74C3C", "#3498DB", "#F1C40F", "#2ECC71", "#9B59B6", "#E67E22", "#FD79A8", "#12CBC4"];
const shapeName = (sh) => (LANG === "en" ? sh.en : sh.w);
function ShapeIcon({ kind, color = T.purple, size = 54 }) {
  const f = { fill: color };
  let el = null;
  if (kind === "circle") el = <circle cx="50" cy="50" r="42" {...f} />;
  else if (kind === "oval") el = <ellipse cx="50" cy="50" rx="46" ry="29" {...f} />;
  else if (kind === "square") el = <rect x="11" y="11" width="78" height="78" rx="7" {...f} />;
  else if (kind === "rect") el = <rect x="3" y="27" width="94" height="46" rx="7" {...f} />;
  else if (kind === "triangle") el = <polygon points="50,8 94,90 6,90" {...f} />;
  else if (kind === "diamond") el = <polygon points="50,5 93,50 50,95 7,50" {...f} />;
  else if (kind === "star") el = <polygon points="50,4 61,37 96,37 68,58 79,92 50,71 21,92 32,58 4,37 39,37" {...f} />;
  else if (kind === "heart") el = <path d="M50 91 C9 62 5 33 24 21 C38 12 50 24 50 32 C50 24 62 12 76 21 C95 33 91 62 50 91 Z" {...f} />;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      {el}
    </svg>
  );
}

// 時鐘(整點與半點)
function ClockFace({ h, m = 0, size = 150 }) {
  const rad = (a) => ((a - 90) * Math.PI) / 180;
  const ha = rad(((h % 12) + m / 60) * 30);
  const ma = rad(m * 6);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={T.purple} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = rad(i * 30);
        return (
          <text key={i} x={50 + 36 * Math.cos(a)} y={50 + 36 * Math.sin(a) + 4}
            textAnchor="middle" fontSize="11" fontWeight="700" fill={T.ink}
            fontFamily="Fredoka, sans-serif">{i === 0 ? 12 : i}</text>
        );
      })}
      <line x1="50" y1="50" x2={50 + 21 * Math.cos(ha)} y2={50 + 21 * Math.sin(ha)}
        stroke={T.ink} strokeWidth="5.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={50 + 31 * Math.cos(ma)} y2={50 + 31 * Math.sin(ma)}
        stroke="#E74C3C" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3.5" fill={T.ink} />
    </svg>
  );
}
const clockZh = (h, m) => (m === 0 ? tf("{0}點", numZh(h)) : tf("{0}點半", numZh(h)));

// 錢幣(新台幣 1 / 5 / 10 元)
function CoinIcon({ v, size = 42 }) {
  const gold = v === 1 || v === 50;
  return (
    <span style={{
      display: "inline-grid", placeItems: "center", width: size, height: size,
      borderRadius: "50%", background: gold ? "#D4A94E" : "#B9BEC6",
      color: "#fff", fontWeight: 800, fontSize: size * 0.42,
      border: "2px solid rgba(0,0,0,.14)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,.16)",
      margin: 3,
    }}>{v}</span>
  );
}

// 比輕重用:差距夠大才出題,避免小朋友爭辯
const NUM_WEIGHT = [
  { w: "羽毛", e: "🪶", kg: 0.01 }, { w: "氣球", e: "🎈", kg: 0.02 },
  { w: "蘋果", e: "🍎", kg: 0.2 }, { w: "書", e: "📖", kg: 0.6 },
  { w: "西瓜", e: "🍉", kg: 6 }, { w: "貓", e: "🐱", kg: 4 },
  { w: "狗", e: "🐶", kg: 15 }, { w: "腳踏車", e: "🚲", kg: 12 },
  { w: "馬", e: "🐴", kg: 400 }, { w: "車子", e: "🚗", kg: 1200 },
  { w: "大象", e: "🐘", kg: 4000 },
];
// 排隊用的角色(序數)
const NUM_LINE = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐸", "🐷", "🦊"];
const NUM_LINE_EN = { "🐶": "dog", "🐱": "cat", "🐰": "rabbit", "🐻": "bear",
  "🐼": "panda", "🐸": "frog", "🐷": "pig", "🦊": "fox" };
const lineName = (e) => (LANG === "en" ? NUM_LINE_EN[e] : NUM_LINE_ZH[e]);
const NUM_LINE_ZH = { "🐶": "小狗", "🐱": "小貓", "🐰": "兔子", "🐻": "小熊", "🐼": "貓熊", "🐸": "青蛙", "🐷": "小豬", "🦊": "狐狸" };
const ORDINAL_ZH = ["", "第一", "第二", "第三", "第四", "第五", "第六"];
const ORDINAL_EN = ["", "1st", "2nd", "3rd", "4th", "5th", "6th"];
const ordinal = (n) => (LANG === "en" ? ORDINAL_EN[n] : ORDINAL_ZH[n]);

// 0–9 的書寫筆順(0–100 座標,頂 15、基線 80),供「數字手寫」用
const DIGIT_STROKES = {
  "0": [[[50, 15], [38, 18], [30, 30], [28, 47], [30, 64], [38, 77], [50, 80],
    [62, 77], [70, 64], [72, 47], [70, 30], [62, 18], [50, 15]]],
  "1": [[[36, 26], [50, 15], [50, 80]]],
  "2": [[[32, 27], [38, 18], [50, 15], [62, 18], [68, 28], [66, 39], [56, 49],
    [42, 62], [30, 80], [72, 80]]],
  "3": [[[33, 22], [42, 16], [54, 15], [65, 20], [68, 30], [62, 40], [50, 44],
    [62, 47], [70, 56], [70, 68], [62, 77], [50, 80], [38, 78], [31, 71]]],
  "4": [[[58, 15], [28, 58], [74, 58]], [[58, 15], [58, 80]]],
  "5": [[[36, 15], [34, 42], [46, 39], [58, 41], [67, 50], [68, 63], [62, 74],
    [50, 80], [38, 79], [31, 73]], [[36, 15], [70, 15]]],
  "6": [[[64, 19], [52, 15], [41, 20], [34, 32], [30, 48], [30, 63], [35, 74],
    [46, 80], [58, 79], [67, 71], [68, 60], [61, 51], [49, 49], [38, 54], [32, 63]]],
  "7": [[[30, 15], [72, 15], [46, 80]]],
  "8": [[[50, 15], [38, 18], [33, 27], [38, 38], [50, 47], [62, 56], [68, 66],
    [63, 76], [50, 80], [37, 76], [32, 66], [38, 56], [50, 47], [62, 38],
    [67, 27], [62, 18], [50, 15]]],
  "9": [[[66, 30], [60, 19], [48, 15], [36, 19], [31, 30], [35, 42], [47, 47],
    [59, 43], [66, 30], [67, 48], [65, 64], [58, 76], [46, 80]]],
};
const DIGITS = Object.keys(DIGIT_STROKES);

// ========== 數字:21 個用 PickQuiz 外殼的遊戲 ==========

// 選項共用畫法:大數字
const optBigNum = (o) => (
  <div style={{ fontSize: 38, fontWeight: 800, color: T.ink }}>{o}</div>
);

// ---------- 1. 數字聽力挑戰(聽英文數字找阿拉伯數字)----------
function NumListenMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = randInt(0, 10);
    return { ans, opts: numOptions(ans, 3, 0, 10) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="👂" hint={t("聽聽看是哪個數字")}
      makeQ={makeQ}
      say={(q) => speak(NUM10[q.ans], { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 52 }}>👂</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: picked ? T.greenDark : "#CFC9EE" }}>
            {picked ? `${q.ans} · ${NUM10[q.ans]} · ${numZh(q.ans)}` : "???"}
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => speak(`${NUM10[q.ans]}! Great job!`, { rate: 0.95 })}
      onWrong={(q) => speak(NUM10[q.ans], { rate: 0.75 })}
    />
  );
}

// ---------- 2. 數數看(數東西選數字)----------
function NumCountMode({ speak, addStars }) {
  const makeQ = () => {
    const n = randInt(1, 10);
    return { n, e: pickOne(NUM_EMOJI), opts: numOptions(n, 3, 1, 10) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🍎" hint={t("數數看,一共有幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, t("數數看,一共有幾個?"), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.n}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 30, lineHeight: 1.4, maxWidth: 260, margin: "0 auto" }}>
            {q.e.repeat(q.n)}
          </div>
          {picked && (
            <div style={{ fontSize: 17, fontWeight: 700, color: T.greenDark, marginTop: 4 }}>{tf("{0} 個・{1}", q.n, numZh(q.n))}</div>
          )}
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!{0}個", numZh(q.n)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("一起數,有 {0} 個", numZh(q.n)), { rate: 0.8 })}
    />
  );
}

// ---------- 3. 數字配對(數字 ↔ 十格框)----------
function NumDotsMode({ speak, addStars }) {
  const makeQ = () => {
    const n = randInt(1, 10);
    return { n, opts: numOptions(n, 3, 1, 10) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🎯" hint={t("哪一個十格框是這個數字?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0},哪一個是 {1} 個點?", numZh(q.n), numZh(q.n)), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.n}
      renderPrompt={(q) => (
        <div style={{ fontSize: 62, fontWeight: 800, color: T.purple }}>{q.n}</div>
      )}
      renderOption={(o) => <TenFrame n={o} dot={13} />}
      onRight={(q) => zh(speak, tf("對!{0}個點", numZh(q.n)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("{0} 是 {1} 個點", numZh(q.n), numZh(q.n)), { rate: 0.8 })}
    />
  );
}

// ---------- 4. 誰比較多? ----------
function NumMoreMode({ speak, addStars }) {
  const makeQ = () => {
    const a = randInt(1, 9);
    let b = randInt(1, 10);
    while (b === a) b = randInt(1, 10);
    const more = Math.random() < 0.5;
    return { a, b, more, e: pickOne(NUM_EMOJI) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="⚖️" hint={t("哪一邊比較多/比較少?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.more ? t("哪一邊比較多?") : t("哪一邊比較少?"), { rate: 0.85 })}
      options={(q) => ["a", "b"]} keyOf={(o) => o}
      isRight={(o, q) => {
        const big = q.a > q.b ? "a" : "b";
        return o === (q.more ? big : big === "a" ? "b" : "a");
      }}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{q.more ? t("哪一邊比較多?") : t("哪一邊比較少?")}</div>
          {picked && (
            <div style={{ fontSize: 16, color: T.greenDark, fontWeight: 700 }}>{tf("{0} 和 {1}", q.a, q.b)}</div>
          )}
        </>
      )}
      renderOption={(o, q, picked) => (
        <>
          <div style={{ fontSize: 22, lineHeight: 1.35, minHeight: 62 }}>
            {q.e.repeat(o === "a" ? q.a : q.b)}
          </div>
          {picked && (
            <div style={{ fontSize: 20, fontWeight: 800, color: T.purple }}>
              {o === "a" ? q.a : q.b}
            </div>
          )}
        </>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, tf("{0} 比 {1} 多", numZh(Math.max(q.a, q.b)), numZh(Math.min(q.a, q.b))), { rate: 0.8 })}
    />
  );
}

// ---------- 5. 數字比大小 ----------
function NumCompareMode({ speak, addStars }) {
  const makeQ = () => {
    const a = randInt(0, 20);
    let b = randInt(0, 20);
    while (b === a) b = randInt(0, 20);
    return { a, b, big: Math.random() < 0.5 };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="🔢" hint={t("哪個數字比較大/比較小?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 和 {1},哪一個比較{2}?", numZh(q.a), numZh(q.b), q.big ? t("大") : t("小")), { rate: 0.85 })}
      options={(q) => [q.a, q.b]} keyOf={(o) => String(o)}
      isRight={(o, q) => o === (q.big ? Math.max(q.a, q.b) : Math.min(q.a, q.b))}
      renderPrompt={(q) => (
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{tf("哪一個比較{0}?", q.big ? t("大") : t("小"))}</div>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 46, fontWeight: 800, color: T.purple }}>{o}</div>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, tf("{0} 比 {1} 大", numZh(Math.max(q.a, q.b)), numZh(Math.min(q.a, q.b))), { rate: 0.8 })}
    />
  );
}

// ---------- 6. 比長短 ----------
const BAR_COLORS = ["#E74C3C", "#3498DB", "#2ECC71"];
function NumLongMode({ speak, addStars }) {
  const makeQ = () => {
    const lens = shuffle([40, 65, 95]);
    return { lens, longest: Math.random() < 0.5 };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="📏" hint={t("哪一條比較長/比較短?")}
      makeQ={makeQ}
      say={(q) => zh(speak, q.longest ? t("哪一條最長?") : t("哪一條最短?"), { rate: 0.85 })}
      options={(q) => [0, 1, 2]} keyOf={(o) => String(o)}
      isRight={(o, q) => {
        const target = q.longest ? Math.max(...q.lens) : Math.min(...q.lens);
        return q.lens[o] === target;
      }}
      renderPrompt={(q) => (
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{tf("哪一條最{0}?", q.longest ? t("長") : t("短"))}</div>
      )}
      renderOption={(o, q) => (
        <div style={{ display: "grid", placeItems: "center", height: 108 }}>
          <div style={{
            width: 16, height: `${q.lens[o]}%`, borderRadius: 8,
            background: BAR_COLORS[o], boxShadow: "inset 0 -3px 0 rgba(0,0,0,.15)",
          }} />
        </div>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, q.longest ? t("最長的是這一條") : t("最短的是這一條"), { rate: 0.8 })}
    />
  );
}

// ---------- 7. 比輕重 ----------
function NumHeavyMode({ speak, addStars }) {
  const makeQ = () => {
    let a = pickOne(NUM_WEIGHT), b = pickOne(NUM_WEIGHT);
    let guard = 0;
    while (guard++ < 50 && (a.w === b.w || Math.max(a.kg, b.kg) / Math.min(a.kg, b.kg) < 5))
      b = pickOne(NUM_WEIGHT);
    return { a, b, heavy: Math.random() < 0.5 };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="⚖️" hint={t("哪一個比較重/比較輕?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("哪一個比較{0}?", q.heavy ? t("重") : t("輕")), { rate: 0.85 })}
      options={(q) => [q.a, q.b]} keyOf={(o) => o.w}
      isRight={(o, q) => {
        const heavier = q.a.kg > q.b.kg ? q.a : q.b;
        const target = q.heavy ? heavier : (heavier === q.a ? q.b : q.a);
        return o.w === target.w;
      }}
      renderPrompt={(q) => (
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{tf("⚖️ 哪一個比較{0}?", q.heavy ? t("重") : t("輕"))}</div>
      )}
      renderOption={(o) => (
        <>
          <div style={{ fontSize: 46 }}>{o.e}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{o.w}</div>
        </>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => {
        const h = q.a.kg > q.b.kg ? q.a : q.b, l = q.a.kg > q.b.kg ? q.b : q.a;
        zh(speak, tf("{0} 比 {1} 重", h.w, l.w), { rate: 0.8 });
      }}
    />
  );
}

// ---------- 8. 減減看(10 以內減法)----------
function NumSubMode({ speak, addStars }) {
  const makeQ = () => {
    const a = randInt(3, 9);
    const b = randInt(1, a - 1);
    return { a, b, ans: a - b, e: pickOne(NUM_EMOJI), opts: numOptions(a - b, 3, 0, 9) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="➖" hint={t("拿走以後,還剩幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 個拿走 {1} 個,還剩幾個?", numZh(q.a), numZh(q.b)), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 30, lineHeight: 1.4 }}>
            {Array.from({ length: q.a }, (_, i) => (
              <span key={i} style={{
                opacity: i >= q.a - q.b ? 0.28 : 1,
                textDecoration: i >= q.a - q.b ? "line-through" : "none",
              }}>{q.e}</span>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.purple }}>
            {q.a} − {q.b} = {picked ? <span style={{ color: T.greenDark }}>{q.ans}</span> : "?"}
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!還剩 {0} 個", numZh(q.ans)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("還剩 {0} 個", numZh(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 9. 湊十高手 ----------
function NumTenMode({ speak, addStars }) {
  const makeQ = () => {
    const n = randInt(1, 9);
    return { n, ans: 10 - n, opts: numOptions(10 - n, 3, 1, 9) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔟" hint={t("還要幾個才滿十?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("已經有 {0} 個,還要幾個才滿十?", numZh(q.n)), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <>
          <TenFrame n={q.n} />
          <div style={{ fontSize: 19, fontWeight: 800, color: T.purple, marginTop: 8 }}>
            {q.n} + {picked ? <span style={{ color: T.greenDark }}>{q.ans}</span> : "?"} = 10
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!{0} 加 {1} 等於十", numZh(q.n), numZh(q.ans)), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("{0} 加 {1} 才是十", numZh(q.n), numZh(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 10. 分一分(數字分解)----------
function NumSplitMode({ speak, addStars }) {
  const makeQ = () => {
    const total = randInt(3, 9);
    const a = randInt(1, total - 1);
    return { total, a, ans: total - a, e: pickOne(NUM_EMOJI), opts: numOptions(total - a, 3, 1, 9) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🍰" hint={t("分成兩堆,另一堆有幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 可以分成 {1} 和幾?", numZh(q.total), numZh(q.a)), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 28 }}>{q.e.repeat(q.total)}</div>
          <div style={{ fontSize: 15, color: T.sub, fontWeight: 700, margin: "2px 0 6px" }}>{tf("一共 {0} 個", q.total)}</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#EFECFB", borderRadius: 14, padding: "8px 14px",
              fontSize: 26, fontWeight: 800, color: T.purple }}>{q.a}</div>
            <span style={{ fontSize: 22, color: T.sub }}>{t("和")}</span>
            <div style={{ background: picked ? "#E9FBEF" : "#F6F4FE", borderRadius: 14,
              padding: "8px 14px", fontSize: 26, fontWeight: 800,
              color: picked ? T.greenDark : "#C9C4E8" }}>{picked ? q.ans : "?"}</div>
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!{0} 和 {1} 合起來是 {2}", numZh(q.a), numZh(q.ans), numZh(q.total)), { rate: 0.85 })}
      onWrong={(q) => zh(speak, tf("是 {0}", numZh(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 11. 一樣多嗎? ----------
function NumEqualMode({ speak, addStars }) {
  const makeQ = () => {
    const a = randInt(2, 9);
    const same = Math.random() < 0.5;
    let b = a;
    if (!same) { b = randInt(2, 9); while (b === a) b = randInt(2, 9); }
    return { a, b, same, ea: pickOne(NUM_EMOJI), eb: pickOne(NUM_EMOJI) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} cols={2} doneIcon="🟰" hint={t("兩邊一樣多嗎?")}
      makeQ={makeQ}
      say={() => zh(speak, t("兩邊一樣多嗎?"), { rate: 0.85 })}
      options={() => ["yes", "no"]} keyOf={(o) => o}
      isRight={(o, q) => (o === "yes") === q.same}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 26, lineHeight: 1.4 }}>{q.ea.repeat(q.a)}</div>
          <div style={{ fontSize: 18, color: T.sub, fontWeight: 700 }}>{t("和")}</div>
          <div style={{ fontSize: 26, lineHeight: 1.4 }}>{q.eb.repeat(q.b)}</div>
          {picked && (
            <div style={{ fontSize: 16, fontWeight: 700, color: T.greenDark, marginTop: 4 }}>{tf("{0} 和 {1}", q.a, q.b)}</div>
          )}
        </>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink }}>{o === "yes" ? t("⭕ 一樣多") : t("❌ 不一樣")}</div>
      )}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={(q) => zh(speak, q.same ? t("兩邊一樣多喔") : tf("{0} 和 {1},不一樣多", numZh(q.a), numZh(q.b)), { rate: 0.8 })}
    />
  );
}

// ---------- 12. 少了誰?(數字)----------
function NumMissingMode({ speak, addStars }) {
  const makeQ = () => {
    const s = randInt(1, 15);
    const seq = [s, s + 1, s + 2, s + 3];
    const hole = randInt(1, 2);
    return { seq, hole, ans: seq[hole], opts: numOptions(seq[hole], 3, 1, 20) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🕵️" hint={t("中間少了哪個數字?")}
      makeQ={makeQ}
      say={(q) => zh(speak, t("中間少了哪個數字?"), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          {q.seq.map((n, i) => (
            <div key={i} style={{
              minWidth: 46, padding: "10px 6px", borderRadius: 12,
              fontSize: 28, fontWeight: 800,
              background: i === q.hole ? (picked ? "#E9FBEF" : "#F6F4FE") : "#EFECFB",
              color: i === q.hole ? (picked ? T.greenDark : "#C9C4E8") : T.purple,
              border: i === q.hole ? `3px dashed ${picked ? T.green : "#C9C4E8"}` : "none",
            }}>{i === q.hole ? (picked ? q.ans : "?") : n}</div>
          ))}
        </div>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!是 {0}", numZh(q.ans)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("少了 {0}", numZh(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 13. 往回數 ----------
function NumBackMode({ speak, addStars }) {
  const makeQ = () => {
    const s = randInt(4, 20);
    const seq = [s, s - 1, s - 2];
    const ans = s - 3;
    return { seq, ans, opts: numOptions(ans, 3, 0, 20) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔙" hint={t("倒著數,接下來是幾?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0},接下來是?", q.seq.map(numZh).join("、")), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q) => (
        <div style={{ fontSize: 40, fontWeight: 800, color: T.purple, letterSpacing: 4 }}>
          {q.seq.join(" ")} <span style={{ color: "#C9C4E8" }}>?</span>
        </div>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!是 {0}", numZh(q.ans)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, `${q.seq.map(numZh).join("、")}、${numZh(q.ans)}`, { rate: 0.75 })}
    />
  );
}

// ---------- 14. 跳著數(2 / 5 / 10)----------
function NumSkipMode({ speak, addStars }) {
  const makeQ = () => {
    const step = pickOne([2, 5, 10]);
    const k = randInt(1, 3);
    const seq = [k * step, (k + 1) * step, (k + 2) * step];
    const ans = (k + 3) * step;
    const set = new Set([ans]);
    while (set.size < 3) set.add(pickOne([ans + step, ans - step, ans + 1, ans - 1, ans + step * 2]));
    return { step, seq, ans, opts: shuffle([...set]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🦘" hint={t("跳著數,接下來是幾?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 個 {1} 個數:{2},接下來?", q.step, q.step, q.seq.join("、")), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q) => (
        <>
          <div style={{ fontSize: 14, color: T.sub, fontWeight: 700 }}>{tf("{0} 個 {1} 個數", q.step, q.step)}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: T.purple, letterSpacing: 3 }}>
            {q.seq.join(" ")} <span style={{ color: "#C9C4E8" }}>?</span>
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!是 {0}", q.ans), { rate: 0.9 })}
      onWrong={(q) => zh(speak, `${q.seq.join("、")}、${q.ans}`, { rate: 0.75 })}
    />
  );
}

// ---------- 15. 找規律 ----------
const PATTERN_KINDS = [
  { name: "AB", seq: [0, 1, 0, 1, 0], next: 1 },
  { name: "AAB", seq: [0, 0, 1, 0, 0], next: 1 },
  { name: "ABB", seq: [0, 1, 1, 0, 1], next: 1 },
  { name: "ABC", seq: [0, 1, 2, 0, 1], next: 2 },
];
function NumPatternMode({ speak, addStars }) {
  const makeQ = () => {
    const k = pickOne(PATTERN_KINDS);
    const es = shuffle(NUM_EMOJI).slice(0, 3);
    const ansE = es[k.next];
    const opts = shuffle([ansE, ...es.filter((e) => e !== ansE).slice(0, 2)]);
    return { k, es, ansE, opts };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔁" hint={t("看規律,接下來是哪一個?")}
      makeQ={() => makeQ()}
      say={() => zh(speak, t("看看規律,接下來是哪一個?"), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => o}
      isRight={(o, q) => o === q.ansE}
      renderPrompt={(q, picked) => (
        <div style={{ fontSize: 30, letterSpacing: 4 }}>
          {q.k.seq.map((i, idx) => <span key={idx}>{q.es[i]}</span>)}
          <span style={{ color: picked ? T.greenDark : "#C9C4E8", fontWeight: 800 }}>
            {picked ? q.ansE : "❓"}
          </span>
        </div>
      )}
      renderOption={(o) => <div style={{ fontSize: 40 }}>{o}</div>}
      onRight={() => zh(speak, t("答對了!"), { rate: 0.95 })}
      onWrong={() => zh(speak, t("再看一次規律"), { rate: 0.8 })}
    />
  );
}

// ---------- 16. 形狀找找看 ----------
function ShapeFindMode({ speak, addStars }) {
  const makeQ = () => {
    const ans = pickOne(SHAPES);
    const others = pickOthers(SHAPES, 2, ans.k, (x) => x.k);
    const cols = shuffle(SHAPE_COLORS).slice(0, 3);
    return { ans, opts: shuffle([ans, ...others]), cols };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔷" hint={t("聽形狀的名字,點出來")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("哪一個是{0}?", shapeName(q.ans)), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => o.k}
      isRight={(o, q) => o.k === q.ans.k}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 48 }}>👀</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: picked ? T.greenDark : T.ink }}>
            {shapeName(q.ans)}
          </div>
        </>
      )}
      renderOption={(o, q, picked) => (
        <>
          <ShapeIcon kind={o.k} color={q.cols[q.opts.indexOf(o) % 3]} size={52} />
          {picked && <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 4 }}>{shapeName(o)}</div>}
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}", shapeName(q.ans)), { rate: 0.9, onEnd: () => speak(q.ans.en, { rate: 0.9 }) })}
      onWrong={(q) => zh(speak, tf("這個才是{0}", shapeName(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 17. 數形狀 ----------
function ShapeCountMode({ speak, addStars }) {
  const makeQ = () => {
    const target = pickOne(SHAPES);
    const other = pickOne(SHAPES.filter((s) => s.k !== target.k));
    const n = randInt(2, 6);
    const noise = randInt(2, 5);
    const items = shuffle([
      ...Array.from({ length: n }, () => target),
      ...Array.from({ length: noise }, () => other),
    ]).map((s, i) => ({ s, c: SHAPE_COLORS[i % SHAPE_COLORS.length], id: i }));
    return { target, n, items, opts: numOptions(n, 3, 1, 8) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🔺" hint={t("數數看,有幾個那個形狀?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("有幾個{0}?", shapeName(q.target)), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.n}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink, marginBottom: 6 }}>{tf("有幾個 {0}?", shapeName(q.target))}</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
            {q.items.map((it) => (
              <div key={it.id} style={{ opacity: picked && it.s.k !== q.target.k ? 0.25 : 1 }}>
                <ShapeIcon kind={it.s.k} color={it.c} size={34} />
              </div>
            ))}
          </div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!{0}個{1}", numZh(q.n), shapeName(q.target)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("有 {0} 個{1}", numZh(q.n), shapeName(q.target)), { rate: 0.8 })}
    />
  );
}

// ---------- 18. 認時鐘(整點與半點)----------
function NumClockMode({ speak, addStars }) {
  const makeQ = () => {
    const h = randInt(1, 12);
    const m = Math.random() < 0.5 ? 0 : 30;
    const set = new Map([[`${h}-${m}`, { h, m }]]);
    let guard = 0;
    while (set.size < 3 && guard++ < 60) {
      const hh = randInt(1, 12), mm = Math.random() < 0.5 ? 0 : 30;
      set.set(`${hh}-${mm}`, { h: hh, m: mm });
    }
    return { h, m, opts: shuffle([...set.values()]) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🕐" hint={t("現在是幾點?")}
      makeQ={makeQ}
      say={() => zh(speak, t("現在是幾點?"), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => `${o.h}-${o.m}`}
      isRight={(o, q) => o.h === q.h && o.m === q.m}
      renderPrompt={(q, picked) => (
        <>
          <ClockFace h={q.h} m={q.m} size={140} />
          {picked && (
            <div style={{ fontSize: 20, fontWeight: 800, color: T.greenDark, marginTop: 4 }}>
              {clockZh(q.h, q.m)}
            </div>
          )}
        </>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>{clockZh(o.h, o.m)}</div>
      )}
      onRight={(q) => zh(speak, tf("對!{0}", clockZh(q.h, q.m)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("現在是{0}", clockZh(q.h, q.m)), { rate: 0.8 })}
    />
  );
}

// ---------- 19. 認錢幣 ----------
function NumCoinMode({ speak, addStars }) {
  const makeQ = () => {
    const coins = [];
    const tens = randInt(0, 1), fives = randInt(0, 1), ones = randInt(1, 4);
    for (let i = 0; i < tens; i++) coins.push(10);
    for (let i = 0; i < fives; i++) coins.push(5);
    for (let i = 0; i < ones; i++) coins.push(1);
    const sum = coins.reduce((a, b) => a + b, 0);
    return { coins, sum, opts: numOptions(sum, 3, 1, 20) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🪙" hint={t("數數看,一共幾元?")}
      makeQ={makeQ}
      say={() => zh(speak, t("一共有幾元?"), { rate: 0.85 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.sum}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {q.coins.map((v, i) => <CoinIcon key={i} v={v} />)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: picked ? T.greenDark : T.ink, marginTop: 6 }}>{picked ? tf("{0} 元", q.sum) : t("一共幾元?")}</div>
        </>
      )}
      renderOption={(o) => (
        <div style={{ fontSize: 28, fontWeight: 800, color: T.ink }}>{tf("{0} 元", o)}</div>
      )}
      onRight={(q) => zh(speak, tf("對!一共 {0} 元", numZh(q.sum)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("一共 {0} 元", numZh(q.sum)), { rate: 0.8 })}
    />
  );
}

// ---------- 20. 第幾個(序數)----------
function NumOrdinalMode({ speak, addStars }) {
  const makeQ = () => {
    const line = shuffle(NUM_LINE).slice(0, 5);
    const idx = randInt(0, 4);
    return { line, idx, ans: idx + 1, opts: numOptions(idx + 1, 3, 1, 5) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🚩" hint={t("從左邊數過來,排第幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("從左邊數過來,{0} 排第幾個?", lineName(q.line[q.idx])), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.ans}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 13, color: T.sub, fontWeight: 700 }}>{t("← 從這邊開始數")}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
            {q.line.map((e, i) => (
              <span key={i} style={{
                fontSize: 34, padding: 3, borderRadius: 10,
                background: i === q.idx ? (picked ? "#E9FBEF" : "#FFF7DA") : "transparent",
              }}>{e}</span>
            ))}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.ink, marginTop: 4 }}>{tf("{0} 排第幾個?", lineName(q.line[q.idx]))}</div>
        </>
      )}
      renderOption={(o) => (
        <>
          <div style={{ fontSize: 30, fontWeight: 800, color: T.purple }}>{o}</div>
          <div style={{ fontSize: 13, color: T.sub, fontWeight: 700 }}>{ordinal(o)}</div>
        </>
      )}
      onRight={(q) => zh(speak, tf("對!{0}個", ordinal(q.ans)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("是{0}個", ordinal(q.ans)), { rate: 0.8 })}
    />
  );
}

// ---------- 21. 分一分點心(平分)----------
function NumShareMode({ speak, addStars }) {
  const KIDS = ["🧒", "👧", "🧑"];
  const makeQ = () => {
    const people = randInt(2, 3);
    const each = randInt(1, 4);
    const total = people * each;
    return { people, each, total, e: pickOne(["🍪", "🍬", "🍎", "🍌"]), opts: numOptions(each, 3, 1, 6) };
  };
  return (
    <PickQuiz speak={speak} addStars={addStars} doneIcon="🍪" hint={t("平分以後,一個人拿幾個?")}
      makeQ={makeQ}
      say={(q) => zh(speak, tf("{0} 個平分給 {1} 個人,一個人幾個?", numZh(q.total), numZh(q.people)), { rate: 0.8 })}
      options={(q) => q.opts} keyOf={(o) => String(o)}
      isRight={(o, q) => o === q.each}
      renderPrompt={(q, picked) => (
        <>
          <div style={{ fontSize: 28, lineHeight: 1.4 }}>{q.e.repeat(q.total)}</div>
          <div style={{ fontSize: 30, margin: "4px 0" }}>
            {KIDS.slice(0, q.people).join(" ")}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: picked ? T.greenDark : T.ink }}>{picked ? tf("一個人 {0} 個", q.each) : tf("{0} 個分給 {1} 個人", q.total, q.people)}</div>
        </>
      )}
      renderOption={optBigNum}
      onRight={(q) => zh(speak, tf("對!一個人 {0} 個", numZh(q.each)), { rate: 0.9 })}
      onWrong={(q) => zh(speak, tf("一個人 {0} 個", numZh(q.each)), { rate: 0.8 })}
    />
  );
}

// ========== 數字:7 個自訂玩法 ==========

const NUM20_EN = [...NUM10, "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

// ---------- 1. 認識數字(0–20 數字表)----------
const NUM_SECTIONS = [
  { key: "a", label: "0–10", range: [0, 11] },
  { key: "b", label: "11–20", range: [11, 21] },
];
function NumLearnMode({ speak }) {
  const [sec, setSec] = useState(NUM_SECTIONS[0]);
  const [n, setN] = useState(1);
  const say = (v) =>
    LANG === "en"
      ? speak(NUM20_EN[v], { rate: 0.9 })
      : zh(speak, numZh(v), { rate: 0.8, onEnd: () => speak(NUM20_EN[v], { rate: 0.9 }) });
  const nums = Array.from({ length: sec.range[1] - sec.range[0] }, (_, i) => sec.range[0] + i);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("點一下數字,先聽中文再聽英文;下面的點點幫她看見「多少」。")}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {NUM_SECTIONS.map((s) => (
          <button key={s.key} onClick={() => { setSec(s); setN(s.range[0] === 0 ? 1 : s.range[0]); }}
            style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 15,
              padding: "8px 16px", borderRadius: 999, cursor: "pointer",
              border: `3px solid ${sec.key === s.key ? T.purpleDark : "#E8E4FA"}`,
              background: sec.key === s.key ? T.purple : T.card,
              color: sec.key === s.key ? "#fff" : T.ink,
            }}>{s.label}</button>
        ))}
      </div>

      <div style={{ background: T.card, borderRadius: 24, padding: "18px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 76, fontWeight: 800, color: T.purple, lineHeight: 1 }}>{n}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, margin: "2px 0 10px" }}>
          {numZh(n)} · {NUM20_EN[n]}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <TenFrame n={Math.min(n, 10)} dot={17} />
          {n > 10 && <TenFrame n={n - 10} dot={17} color={T.pink} />}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => say(n)}
          style={{ color: T.ink, marginTop: 12 }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {nums.map((v) => (
          <button key={v} onClick={() => { setN(v); say(v); }}
            style={{
              fontFamily: "inherit", fontWeight: 800, fontSize: 22,
              padding: "12px 0", borderRadius: 14, cursor: "pointer",
              border: `3px solid ${v === n ? T.purpleDark : "#E8E4FA"}`,
              background: v === n ? T.purple : T.card,
              color: v === n ? "#fff" : T.ink, transition: "all .15s",
            }}>{v}</button>
        ))}
      </div>
    </div>
  );
}

// ---------- 2. 認識形狀 ----------
function ShapeLearnMode({ speak }) {
  const [i, setI] = useState(0);
  const sh = SHAPES[i];
  const say = (s) =>
    LANG === "en"
      ? speak(s.en, { rate: 0.9 })
      : zh(speak, s.w, { rate: 0.85, onEnd: () => speak(s.en, { rate: 0.9 }) });
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("點一下形狀,先聽中文再聽英文;可以一起在家裡找找看有沒有一樣的形狀。")}</p>
      <div style={{ background: T.card, borderRadius: 24, padding: "18px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <ShapeIcon kind={sh.k} color={SHAPE_COLORS[i % SHAPE_COLORS.length]} size={120} />
        <div style={{ fontSize: 24, fontWeight: 800, color: T.ink, marginTop: 8 }}>{shapeName(sh)}</div>
        <div style={{ fontSize: 16, color: T.sub, fontWeight: 700 }}>{sh.en}</div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => say(sh)}
          style={{ color: T.ink, marginTop: 12 }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {SHAPES.map((s, k) => (
          <button key={s.k} onClick={() => { setI(k); say(s); }}
            style={{
              background: k === i ? "#EFECFB" : T.card,
              border: `3px solid ${k === i ? T.purpleDark : "#E8E4FA"}`,
              borderRadius: 18, padding: "10px 4px 8px", fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
            }}>
            <ShapeIcon kind={s.k} color={SHAPE_COLORS[k % SHAPE_COLORS.length]} size={38} />
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginTop: 4 }}>{shapeName(s)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- 3. 點幾個(一個一個數出來)----------
function NumTapMode({ speak, addStars }) {
  const TOTAL = 6;
  const makeRound = () => ({
    target: randInt(2, 8), e: pickOne(NUM_EMOJI), key: Math.random(),
  });
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [round, setRound] = useState(makeRound);
  const [picked, setPicked] = useState(() => new Set());
  const [result, setResult] = useState(null); // null | "ok" | "no"
  const [done, setDone] = useState(false);

  const say = useCallback(
    () => zh(speak, tf("請點出 {0} 個", numZh(round.target)), { rate: 0.85 }),
    [round, speak]
  );
  useEffect(() => {
    if (!done) { const t = setTimeout(say, 400); return () => clearTimeout(t); }
  }, [round, say, done]);

  const toggle = (i) => {
    if (result) return;
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(i)) n.delete(i); else n.add(i);
      zh(speak, numZh(n.size), { rate: 1 });
      return n;
    });
  };

  const check = () => {
    if (result) return;
    if (picked.size === round.target) {
      setResult("ok"); setRight((r) => r + 1); addStars(1);
      zh(speak, tf("對!{0} 個", numZh(round.target)), { rate: 0.9 });
      setTimeout(() => {
        if (roundNo >= TOTAL) setDone(true);
        else { setRoundNo((r) => r + 1); setRound(makeRound()); setPicked(new Set()); setResult(null); }
      }, 1500);
    } else {
      setResult("no");
      zh(speak, tf("你拿了 {0} 個,再數一次", numZh(picked.size)), { rate: 0.8 });
      setTimeout(() => { setPicked(new Set()); setResult(null); }, 1800);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "🧺"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("拿對 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setRound(makeRound()); setPicked(new Set()); setResult(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{tf("第 {0} / {1} 次・一個一個點,拿出老師說的數量", roundNo, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "14px 12px",
        marginBottom: 12, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink }}>{t("請拿出")}<span style={{ color: T.purple, fontSize: 26 }}>{round.target}</span>{t("個")}</div>
        <div style={{ fontSize: 15, color: result === "no" ? T.red : T.sub, fontWeight: 700 }}>{tf("已經拿了 {0} 個", picked.size)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const on = picked.has(i);
          return (
            <button key={`${round.key}-${i}`} onClick={() => toggle(i)}
              style={{
                background: on ? "#E9FBEF" : T.card,
                border: `3px solid ${on ? T.green : "#E8E4FA"}`,
                borderRadius: 16, padding: "10px 0", fontFamily: "inherit",
                fontSize: 30, cursor: result ? "default" : "pointer",
                boxShadow: "0 4px 0 #E0DBF7", transition: "all .12s",
                transform: on ? "scale(0.94)" : "scale(1)",
              }}>{round.e}</button>
          );
        })}
      </div>
      <ChunkyButton color={result === "ok" ? T.green : T.pink}
        dark={result === "ok" ? T.greenDark : "#D14B7D"} onClick={check} style={{ width: "100%" }}>{result === "ok" ? t("🎉 答對了!") : result === "no" ? t("再數一次…") : t("✓ 好了,我數好了")}</ChunkyButton>
      <div style={{ marginTop: 10 }}>
        <button onClick={say}
          style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, background: "none",
            border: "none", color: T.sub, cursor: "pointer" }}>{t("🔊 再聽一次")}</button>
      </div>
    </div>
  );
}

// ---------- 4. 數字泡泡 ----------
function NumBubbleMode({ speak, addStars }) {
  const TOTAL = 8;
  const makeRound = () => {
    const four = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 4);
    return { items: four, target: pickOne(four), key: Math.random() };
  };
  const [round, setRound] = useState(makeRound);
  const [pops, setPops] = useState(0);
  const [popping, setPopping] = useState(null);
  const [cheer, setCheer] = useState("");
  const [done, setDone] = useState(false);

  const say = useCallback(() => zh(speak, numZh(round.target), { rate: 0.8 }), [round, speak]);
  useEffect(() => {
    if (!done) { const t = setTimeout(say, 500); return () => clearTimeout(t); }
  }, [round, say, done]);

  const tap = (n) => {
    if (popping) return;
    if (n === round.target) {
      setPopping(n); setCheer(""); addStars(1);
      zh(speak, tf("{0}!答對了", numZh(n)), { rate: 0.95 });
      const np = pops + 1;
      setTimeout(() => {
        setPopping(null); setPops(np);
        if (np >= TOTAL) setDone(true); else setRound(makeRound());
      }, 800);
    } else {
      setCheer(t("再聽聽看,是哪個數字?🫧"));
      say();
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>🫧✨</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("戳破了 {0} 個泡泡!", TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setPops(0); setDone(false); setRound(makeRound()); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{tf("聽數字,戳破正確的泡泡!{0} / {1} 🫧", pops, TOTAL)}</div>
      <div style={{
        position: "relative", height: 330, overflow: "hidden",
        background: "linear-gradient(#EAF6FF, #F6FBFF)",
        borderRadius: 24, border: "3px solid #E8E4FA",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 12,
      }}>
        {round.items.map((n, i) => (
          <button key={`${round.key}-${n}`} onClick={() => tap(n)}
            style={{
              position: "absolute", left: `${4 + i * 24}%`, bottom: -110,
              width: 88, height: 88, borderRadius: "50%",
              background: popping === n ? "transparent" : BUBBLE_COLORS[i],
              border: popping === n ? "none" : "3px solid #FFFFFFCC",
              boxShadow: popping === n ? "none" : "inset -6px -8px 0 #FFFFFF88, 0 3px 8px #B9D4EE66",
              fontFamily: "inherit", fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: `wp-float ${11 + i * 3.5}s linear infinite`,
              animationDelay: `${-i * 4.2}s`,
              animationPlayState: popping ? "paused" : "running",
            }}>
            {popping === n ? <span style={{ fontSize: 40 }}>⭐</span>
              : <span style={{ fontSize: 34, color: T.ink }}>{n}</span>}
          </button>
        ))}
      </div>
      <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={say} style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      {cheer && <div style={{ marginTop: 10, fontSize: 15, color: T.sub, fontWeight: 700 }}>{cheer}</div>}
    </div>
  );
}

// ---------- 5. 數字翻翻樂(數字 ↔ 點點)----------
function NumPairsMode({ speak, addStars }) {
  const newDeck = () => {
    const five = shuffle(Array.from({ length: 10 }, (_, i) => i + 1)).slice(0, 5);
    const cards = five.flatMap((n) => [{ n, kind: "num" }, { n, kind: "dot" }]);
    return shuffle(cards).map((c, k) => ({ ...c, id: k }));
  };
  const [cards, setCards] = useState(newDeck);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [misses, setMisses] = useState(0);
  const [lock, setLock] = useState(false);
  const [done, setDone] = useState(false);

  const flip = (i) => {
    if (lock || open.includes(i) || matched.has(cards[i].n)) return;
    zh(speak, numZh(cards[i].n), { rate: 0.9 });
    if (open.length === 0) { setOpen([i]); return; }
    const j = open[0];
    if (cards[j].n === cards[i].n) {
      const nm = new Set(matched).add(cards[i].n);
      setMatched(nm); setOpen([]); addStars(1);
      if (nm.size === 5) {
        addStars(2);
        zh(speak, t("全部配對完成!好棒"), { rate: 0.9 });
        setTimeout(() => setDone(true), 900);
      }
    } else {
      setOpen([j, i]); setLock(true); setMisses((m) => m + 1);
      setTimeout(() => { setOpen([]); setLock(false); }, 950);
    }
  };

  const restart = () => {
    setCards(newDeck()); setOpen([]); setMatched(new Set());
    setMisses(0); setLock(false); setDone(false);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{misses <= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{t("5 對數字全部找到!")}</h2>
        <p style={{ color: T.sub, fontSize: 15 }}>{tf("失誤 {0} 次", misses)}</p>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 10 }} onClick={restart}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        <span>{t("數字配點點")}</span>
        <span>{tf("找到 {0} / 5 對{1}", matched.size, "⭐".repeat(matched.size))}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {cards.map((c, i) => {
          const isUp = open.includes(i) || matched.has(c.n);
          const isMatched = matched.has(c.n);
          return (
            <button key={c.id} onClick={() => flip(i)}
              style={{
                aspectRatio: "1 / 1.05", display: "grid", placeItems: "center",
                background: isMatched ? "#E9FBEF" : isUp ? "#FFF7DA" : T.purple,
                border: `3px solid ${isMatched ? T.green : isUp ? T.yellow : T.purpleDark}`,
                borderRadius: 18, fontFamily: "inherit",
                fontSize: 30, fontWeight: 800, color: T.ink,
                cursor: isUp ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .2s",
                opacity: isMatched ? 0.85 : 1,
              }}>
              {!isUp ? "🎈" : c.kind === "num" ? c.n : (
                <span style={{ fontSize: 15, lineHeight: 1.1, maxWidth: 56, wordBreak: "break-all" }}>
                  {"●".repeat(c.n)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 14 }}>{t("翻開卡片,把「數字」和「一樣多的點點」配成一對!")}</p>
    </div>
  );
}

// ---------- 6. 排大小(數字由小到大)----------
function NumSortMode({ speak, addStars }) {
  const TOTAL = 6;
  const makeQ = () => {
    const set = new Set();
    while (set.size < 3) set.add(randInt(1, 20));
    const order = [...set].sort((a, b) => a - b);
    return { order, display: shuffle([...order]) };
  };
  const [roundNo, setRoundNo] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [progress, setProgress] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [cleared, setCleared] = useState(false);
  const [done, setDone] = useState(false);

  const nextRound = () => {
    if (roundNo >= TOTAL) { setDone(true); return; }
    setRoundNo((r) => r + 1); setQ(makeQ()); setProgress(0); setCleared(false);
  };

  const tap = (n) => {
    if (cleared) return;
    if (n === q.order[progress]) {
      zh(speak, numZh(n), { rate: 0.9 });
      const np = progress + 1;
      setProgress(np); setWrong(null);
      if (np >= q.order.length) {
        setRight((r) => r + 1); addStars(1); setCleared(true);
        zh(speak, t("太棒了!"), { rate: 0.95 });
        setTimeout(nextRound, 1300);
      }
    } else {
      setWrong(n); zh(speak, numZh(n), { rate: 0.9 });
      setTimeout(() => setWrong(null), 500);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 5 ? "🏆" : "📊"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("排對 {0} / {1} 組!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRoundNo(1); setRight(0); setQ(makeQ()); setProgress(0); setCleared(false); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{tf("第 {0} / {1} 組・從最小的開始,由小到大點!", roundNo, TOTAL)}</div>
      <div style={{ fontSize: 18, marginBottom: 12, color: T.purple, fontWeight: 700 }}>{t("1️⃣ 小 →→→ 大 🔟")}</div>
      <div style={{ minHeight: 66, display: "flex", gap: 10, justifyContent: "center",
        alignItems: "center", marginBottom: 8 }}>
        {q.order.slice(0, progress).map((n, i) => (
          <span key={n} style={{ fontSize: 26 + i * 8, fontWeight: 800, color: T.greenDark }}>{n}</span>
        ))}
        {progress < q.order.length && (
          <span style={{ fontSize: 20, color: "#C9C4E8" }}>{tf("👉 點第 {0} 小的", progress + 1)}</span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.display.map((n) => {
          const placed = q.order.slice(0, progress).includes(n);
          const isWrong = wrong === n;
          return (
            <button key={n} onClick={() => tap(n)} disabled={placed}
              style={{
                background: placed ? "#E9FBEF" : isWrong ? "#FFEDED" : T.card,
                border: `3px solid ${placed ? T.green : isWrong ? T.red : "#E8E4FA"}`,
                borderRadius: 18, padding: "20px 4px", fontFamily: "inherit",
                fontSize: 38, fontWeight: 800, color: T.ink,
                cursor: placed ? "default" : "pointer", boxShadow: "0 5px 0 #E0DBF7",
                opacity: placed ? 0.6 : 1, animation: isWrong ? "wp-shake .3s" : "none",
                transition: "all .15s",
              }}>{n}</button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 7. 數字手寫(0–9 描寫)----------
const NUM_TRACE_KEY = "wordpop-num-done";
function loadNumDone() {
  try {
    const arr = JSON.parse(localStorage.getItem(NUM_TRACE_KEY) || "[]");
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch { return new Set(); }
}
function NumWriteMode({ speak, addStars }) {
  const [idx, setIdx] = useState(1);
  const [celebrate, setCelebrate] = useState(false);
  const [cheer, setCheer] = useState("");
  const [doneSet, setDoneSet] = useState(loadNumDone);
  const d = DIGITS[idx];
  const color = TRACE_COLORS[idx % TRACE_COLORS.length];

  const sayNum = (v) => zh(speak, numZh(Number(v)), { rate: 0.85, onEnd: () => speak(NUM10[Number(v)], { rate: 0.9 }) });

  const select = (i) => {
    setIdx(i); setCelebrate(false); setCheer(""); sayNum(DIGITS[i]);
  };

  const markDone = () => {
    setCelebrate(true); setCheer(""); addStars(2);
    sayNum(d);
    setDoneSet((prev) => {
      const next = new Set(prev);
      next.add(d);
      try { localStorage.setItem(NUM_TRACE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const onStrokeDone = (n) => {
    setCheer(tf("第 {0} 筆寫對了!換第 {1} 筆 👍", n, n + 1));
    setTimeout(() => setCheer(""), 1400);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("從 1 號圓點開始,照箭頭方向寫;每筆都寫對才會換下一筆!已完成{0}", " ")}<b style={{ color: T.purple }}>{doneSet.size}</b> / {DIGITS.length}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginBottom: 12 }}>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => sayNum(d)}
          style={{ color: T.ink, padding: "10px 18px", fontSize: 16 }}>{tf("🔊 {0} 怎麼唸", d)}</ChunkyButton>
        <div style={{ background: T.card, border: "3px solid #E8E4FA", borderRadius: 16,
          padding: "6px 12px", boxShadow: "0 4px 0 #E0DBF7" }}>
          <TenFrame n={Number(d)} dot={11} />
        </div>
      </div>

      <TraceCanvas
        char={d}
        strokeColor={color}
        strokeData={DIGIT_STROKES[d]}
        grid="tian"
        onStrokeDone={onStrokeDone}
        onComplete={markDone}
      />

      {celebrate ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 22, color: T.greenDark, fontWeight: 700 }}>{tf("🎉 太棒了!{0} 寫得真漂亮!+2 ⭐", d)}</div>
          <ChunkyButton color={T.green} dark={T.greenDark}
            onClick={() => select((idx + 1) % DIGITS.length)} style={{ marginTop: 10 }}>{t("下一個數字 →")}</ChunkyButton>
        </div>
      ) : (
        cheer && (
          <div style={{ marginTop: 14, fontSize: 16, color: T.sub, fontWeight: 700 }}>{cheer}</div>
        )
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 16 }}>
        {DIGITS.map((v, i) => {
          const finished = doneSet.has(v);
          const active = i === idx;
          return (
            <button key={v} onClick={() => select(i)}
              style={{
                fontFamily: "inherit", fontWeight: 800, fontSize: 22,
                padding: "10px 0", borderRadius: 14, cursor: "pointer",
                border: `3px solid ${active ? T.purpleDark : finished ? T.green : "#E8E4FA"}`,
                background: active ? T.purple : finished ? "#E9FBEF" : T.card,
                color: active ? "#fff" : T.ink, transition: "all .15s",
              }}>{v}</button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 首音偵探(音素覺察)----------
function makeSoundQ() {
  const pool = ALL_WORDS.filter((w) => /^[a-z]+$/i.test(w.en));
  const ans = pool[Math.floor(Math.random() * pool.length)];
  const first = ans.en[0].toUpperCase();
  const letters = new Set([first]);
  while (letters.size < 3) {
    const other = pool[Math.floor(Math.random() * pool.length)].en[0].toUpperCase();
    if (other !== first) letters.add(other);
  }
  return { ans, options: shuffle([...letters]) };
}

function FirstSoundMode({ speak, addStars }) {
  const TOTAL = 8;
  const [round, setRound] = useState(1);
  const [right, setRight] = useState(0);
  const [q, setQ] = useState(() => makeSoundQ());
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    speak.prefetch?.(q.ans.en);
    const t = setTimeout(() => speak(q.ans.en), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (L) => {
    if (picked) return;
    setPicked(L);
    const ok = L === q.ans.en[0].toUpperCase();
    // 字母名用合成、單字接真人音檔
    if (ok) { setRight((r) => r + 1); addStars(1); speak(L + ".", { rate: 0.9, onEnd: () => speak(q.ans.en, { rate: 0.9 }) }); }
    else speak(q.ans.en[0].toUpperCase() + ".", { rate: 0.8, onEnd: () => speak(q.ans.en, { rate: 0.8 }) });
    setTimeout(() => {
      if (round >= TOTAL) setDone(true);
      else { setRound((r) => r + 1); setQ(makeSoundQ()); setPicked(null); }
    }, 1600);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🕵️"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>{tf("偵探破案 {0} / {1} 次!", right, TOTAL)}</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRound(1); setRight(0); setQ(makeSoundQ()); setPicked(null); setDone(false); }}>{t("再玩一次")}</ChunkyButton>
      </div>
    );

  return (
    <div>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{tf("第 {0} / {1} 題・這個字的「開頭字母」是哪一個?🕵️", round, TOTAL)}</div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        textAlign: "center", marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.ans.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, margin: "6px 0 12px" }}>
          {picked ? q.ans.en : "_" + q.ans.en.slice(1)}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(q.ans.en)}
          style={{ color: T.ink }}>{t("🔊 再聽一次")}</ChunkyButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {q.options.map((L) => {
          const isAns = L === q.ans.en[0].toUpperCase();
          let bg = T.card, bd = "#E8E4FA";
          if (picked) {
            if (isAns) { bg = "#E9FBEF"; bd = T.green; }
            else if (L === picked) { bg = "#FFEDED"; bd = T.red; }
          }
          return (
            <button key={L} onClick={() => pick(L)}
              style={{
                background: bg, border: `3px solid ${bd}`, borderRadius: 18,
                padding: "20px 0", fontFamily: "inherit", fontSize: 34,
                fontWeight: 700, color: T.purple, cursor: picked ? "default" : "pointer",
                boxShadow: "0 5px 0 #E0DBF7", transition: "all .15s",
              }}>
              {L}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 跟讀小勇士(口說練習)----------
const EASY_WORDS = () => ALL_WORDS.filter((w) => /^[a-z]{2,7}$/i.test(w.en));
function SayItMode({ speak, addStars }) {
  const poolRef = useRef(EASY_WORDS());
  const pickWord = () =>
    poolRef.current[Math.floor(Math.random() * poolRef.current.length)];
  const [word, setWord] = useState(pickWord);
  const [status, setStatus] = useState("idle"); // idle|listening|correct|tryagain
  useEffect(() => { speak.prefetch?.(word.en); }, [word, speak]);
  const [heard, setHeard] = useState("");
  const [wins, setWins] = useState(0);
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recRef = useRef(null);
  const timerRef = useRef(0);

  const stopListening = useCallback(() => {
    clearTimeout(timerRef.current);
    try { recRef.current?.abort(); } catch { /* 已停止就算了 */ }
    recRef.current = null;
  }, []);
  useEffect(() => stopListening, [stopListening]); // 離開頁面時關麥克風

  const next = () => {
    stopListening();
    setWord(pickWord()); setStatus("idle"); setHeard("");
  };

  const listen = () => {
    if (!SR || status === "listening") return;
    // 先停掉還在播的示範音,不然麥克風會收到喇叭的聲音
    window.speechSynthesis?.cancel();
    stopListening();
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = "en-US";
      // 邊聽邊出中途結果:唸對「立刻」過關,不用等瀏覽器判定講完
      rec.interimResults = true;
      rec.maxAlternatives = 5;
      rec.continuous = false;
      setStatus("listening");
      setHeard("");
      const t = word.en.toLowerCase();
      let settled = false;
      const succeed = () => {
        if (settled) return;
        settled = true;
        stopListening();
        setStatus("correct");
        setWins((n) => n + 1);
        addStars(2);
        speak("Great job!", { rate: 1 });
      };
      const giveUp = () => {
        if (settled) return;
        settled = true;
        stopListening();
        setStatus("tryagain");
      };
      const matches = (a) =>
        a === t ||
        a.includes(t) ||
        // 只聽到一部分也算(至少要有目標字一半長,避免亂猜就過)
        (a.length >= Math.ceil(t.length / 2) && t.includes(a));
      rec.onresult = (e) => {
        const alts = [];
        for (const res of e.results)
          for (const alt of res) alts.push(alt.transcript.toLowerCase().trim());
        if (alts[0]) setHeard(alts[0]);
        if (alts.some(matches)) {
          succeed();
        } else if (e.results[e.results.length - 1].isFinal) {
          giveUp();
        }
      };
      rec.onerror = giveUp;
      rec.onend = () => {
        clearTimeout(timerRef.current);
        setStatus((s) => (s === "listening" ? "tryagain" : s));
      };
      // 最多聽 6 秒,不讓小朋友對著麥克風乾等
      timerRef.current = setTimeout(() => {
        try { rec.stop(); } catch { giveUp(); }
      }, 6000);
      rec.start();
    } catch {
      setStatus("tryagain");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("大聲唸出這個字,唸對得 ⭐⭐!已成功 {0} 次", wins)}</p>
      <div style={{ background: T.card, borderRadius: 24, padding: "26px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 64 }}>{word.emoji}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: T.ink }}>{word.en}</div>
        <div style={{ fontSize: 15, color: T.sub, marginBottom: 14 }}>{word.zh}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark}
            onClick={() => speak(word.en)} style={{ color: T.ink }}
            disabled={status === "listening"}>{t("🔊 先聽一次")}</ChunkyButton>
          {SR ? (
            <ChunkyButton
              color={status === "listening" ? T.red : T.pink}
              dark={status === "listening" ? "#C94F4E" : "#D14B7D"}
              onClick={listen} disabled={status === "listening"}>{status === "listening" ? t("🎤 聽你說…") : t("🎤 換我唸!")}</ChunkyButton>
          ) : (
            <ChunkyButton color={T.green} dark={T.greenDark}
              onClick={() => { setStatus("correct"); setWins((n) => n + 1); addStars(1); }}>{tf("👍 我唸對了(家長按)")}</ChunkyButton>
          )}
        </div>
        {status === "listening" && (
          <div style={{
            marginTop: 14, fontSize: 17, color: T.pink, fontWeight: 700,
            animation: "wp-pulse 1s ease-in-out infinite",
          }}>{tf("🎙️ 我在聽,大聲唸出來!{0}", heard && ` 「${heard}」`)}</div>
        )}
        {status === "correct" && (
          <div style={{ marginTop: 14, fontSize: 20, color: T.greenDark, fontWeight: 700 }}>
            🎉 Great job! +2 ⭐
          </div>
        )}
        {status === "tryagain" && (
          <div style={{ marginTop: 14, fontSize: 15, color: T.sub }}>{tf("{0}再試一次,先聽範例再慢慢唸 💪", heard ? tf("我聽到「{0}」,", heard) : "")}</div>
        )}
      </div>
      <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={next}>{t("下一個字 →")}</ChunkyButton>
      {!SR && (
        <p style={{ color: "#B7B2D8", fontSize: 12, marginTop: 14 }}>{tf("此瀏覽器不支援語音辨識,改由家長確認模式(建議用 Chrome)")}</p>
      )}
    </div>
  );
}

// ---------- 手寫練習(A–Z 描寫)----------
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TRACE_SIZE = 480; // 畫布內部解析度(正方形)
const TRACE_KEY = "wordpop-trace-done";

// 找一個以該字母開頭的單字當例字(A is for apple)
function exampleWordFor(letter) {
  return ALL_WORDS.find(
    (w) => /^[a-z]+$/i.test(w.en) && w.en[0].toUpperCase() === letter
  );
}

function loadTraceDone() {
  try {
    const raw = localStorage.getItem(TRACE_KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

// 52 個字母的筆畫路徑(0–100 座標系,依標準書寫筆順排列)
// 大寫:頂 15、基線 80;小寫:x 字高 45、基線 80、上伸 15、下伸 100
const P2 = Math.PI;
function arcPts(cx, cy, rx, ry, a0, a1, n = 20) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}
const LETTER_STROKES = {
  A: [[[50, 15], [28, 80]], [[50, 15], [72, 80]], [[36, 58], [64, 58]]],
  B: [
    [[32, 15], [32, 80]],
    [[32, 15], [48, 15], ...arcPts(48, 31.5, 16, 16.5, -P2 / 2, P2 / 2),
      [48, 48], [33, 48], [50, 48], ...arcPts(50, 64, 18, 16, -P2 / 2, P2 / 2),
      [50, 80], [32, 80]],
  ],
  C: [arcPts(52, 47.5, 26, 32, -P2 / 3, (-5 * P2) / 3)],
  D: [
    [[32, 15], [32, 80]],
    [[32, 15], [47, 15], ...arcPts(47, 47.5, 26, 32.5, -P2 / 2, P2 / 2),
      [47, 80], [32, 80]],
  ],
  E: [[[34, 15], [34, 80]], [[34, 15], [70, 15]], [[34, 47], [62, 47]], [[34, 80], [70, 80]]],
  F: [[[34, 15], [34, 80]], [[34, 15], [70, 15]], [[34, 47], [62, 47]]],
  G: [
    arcPts(52, 47.5, 26, 32, -P2 / 3, (-5 * P2) / 3),
    [[50, 55], [73, 55], [73, 68]],
  ],
  H: [[[30, 15], [30, 80]], [[70, 15], [70, 80]], [[30, 48], [70, 48]]],
  I: [[[50, 15], [50, 80]], [[34, 15], [66, 15]], [[34, 80], [66, 80]]],
  J: [[[62, 15], [62, 62], ...arcPts(46, 62, 16, 16, 0, 0.9 * P2)]],
  K: [[[32, 15], [32, 80]], [[66, 15], [34, 49], [66, 80]]],
  L: [[[34, 15], [34, 80], [70, 80]]],
  M: [[[28, 15], [28, 80]], [[28, 15], [50, 55], [72, 15]], [[72, 15], [72, 80]]],
  N: [[[30, 15], [30, 80]], [[30, 15], [70, 80]], [[70, 15], [70, 80]]],
  O: [arcPts(50, 47.5, 26, 32, -P2 / 2, -P2 / 2 - 2 * P2, 28)],
  P: [
    [[32, 15], [32, 80]],
    [[32, 15], [47, 15], ...arcPts(47, 33, 17, 18, -P2 / 2, P2 / 2), [47, 51], [32, 51]],
  ],
  Q: [arcPts(50, 47.5, 26, 32, -P2 / 2, -P2 / 2 - 2 * P2, 28), [[58, 64], [75, 84]]],
  R: [
    [[32, 15], [32, 80]],
    [[32, 15], [47, 15], ...arcPts(47, 32, 17, 17, -P2 / 2, P2 / 2),
      [47, 49], [34, 49], [68, 80]],
  ],
  S: [[...arcPts(51, 32, 17, 16, -P2 / 4, (-3 * P2) / 2), ...arcPts(49, 64, 18, 16, -P2 / 2, 0.85 * P2)]],
  T: [[[50, 15], [50, 80]], [[26, 15], [74, 15]]],
  U: [[[30, 15], [30, 58], ...arcPts(50, 58, 20, 22, P2, 0), [70, 58], [70, 15]]],
  V: [[[28, 15], [50, 80], [72, 15]]],
  W: [[[24, 15], [38, 80], [50, 30], [62, 80], [76, 15]]],
  X: [[[30, 15], [70, 80]], [[70, 15], [30, 80]]],
  Y: [[[28, 15], [50, 48]], [[72, 15], [50, 48], [50, 80]]],
  Z: [[[28, 15], [72, 15], [28, 80], [72, 80]]],
  a: [arcPts(48, 62.5, 16, 17.5, -P2 / 4, -P2 / 4 - 1.98 * P2, 26), [[64, 45], [64, 80]]],
  b: [[[34, 15], [34, 80]], arcPts(49, 62.5, 16, 17.5, -0.75 * P2, 0.75 * P2)],
  c: [arcPts(50, 62.5, 17, 17.5, -P2 / 3, (-5 * P2) / 3)],
  d: [arcPts(47, 62.5, 16, 17.5, -P2 / 3, (-5 * P2) / 3), [[63, 15], [63, 80]]],
  e: [[[33, 61], [64, 61], ...arcPts(48.5, 62.5, 16.5, 17.5, -0.05 * P2, -1.65 * P2)]],
  f: [
    [...arcPts(58, 28, 11, 10, -0.15 * P2, -P2), [47, 28], [47, 80]],
    [[34, 46], [60, 46]],
  ],
  g: [
    arcPts(47, 62.5, 16, 17.5, -P2 / 3, (-5 * P2) / 3),
    [[63, 45], [63, 86], ...arcPts(49, 86, 14, 12, 0, 0.9 * P2)],
  ],
  h: [[[34, 15], [34, 80]], [...arcPts(48, 58, 14, 13, -P2, 0), [62, 58], [62, 80]]],
  i: [[[50, 45], [50, 80]], [[50, 30], [50.5, 30]]],
  j: [[[56, 45], [56, 86], ...arcPts(44, 86, 12, 11, 0, 0.85 * P2)], [[56, 30], [56.5, 30]]],
  k: [[[34, 15], [34, 80]], [[60, 48], [34, 64], [60, 80]]],
  l: [[[50, 15], [50, 80]]],
  m: [
    [[30, 45], [30, 80]],
    [...arcPts(40, 58, 10, 13, -P2, 0), [50, 58], [50, 80]],
    [...arcPts(60, 58, 10, 13, -P2, 0), [70, 58], [70, 80]],
  ],
  n: [[[34, 45], [34, 80]], [...arcPts(49, 58, 15, 13, -P2, 0), [64, 58], [64, 80]]],
  o: [arcPts(50, 62.5, 17, 17.5, -P2 / 2, -P2 / 2 - 2 * P2, 26)],
  p: [[[34, 45], [34, 100]], arcPts(49, 62.5, 16, 17.5, -0.75 * P2, 0.75 * P2)],
  q: [arcPts(47, 62.5, 16, 17.5, -P2 / 3, (-5 * P2) / 3), [[63, 45], [63, 98], [70, 91]]],
  r: [[[38, 45], [38, 80]], arcPts(50, 58, 12, 13, -P2, -0.25 * P2)],
  s: [[...arcPts(50, 53, 12, 9, -P2 / 4, (-3 * P2) / 2), ...arcPts(49, 71, 13, 9.5, -P2 / 2, 0.85 * P2)]],
  t: [[[46, 22], [46, 80]], [[32, 45], [62, 45]]],
  u: [
    [[34, 45], [34, 64], ...arcPts(48, 64, 14, 14, P2, 0), [62, 64], [62, 45]],
    [[62, 45], [62, 80]],
  ],
  v: [[[34, 45], [50, 80], [66, 45]]],
  w: [[[30, 45], [40, 80], [50, 52], [60, 80], [70, 45]]],
  x: [[[34, 45], [66, 80]], [[66, 45], [34, 80]]],
  y: [[[34, 45], [52, 71]], [[66, 45], [40, 100]]],
  z: [[[34, 45], [66, 45], [34, 80], [66, 80]]],
};

const TRACE_PAD = 20;
const TRACE_SC = (TRACE_SIZE - TRACE_PAD * 2) / 100;
const toPx = ([x, y]) => [TRACE_PAD + x * TRACE_SC, TRACE_PAD + y * TRACE_SC];
const STROKE_BADGE_COLORS = ["#6C5CE7", "#FF6B9D", "#00B8A9", "#F0932B"];

// 沿折線走 dist 距離,回傳該點位置與方向
function walkPolyline(pts, dist) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.hypot(dx, dy);
    if (seg === 0) continue;
    if (acc + seg >= dist) {
      const t = (dist - acc) / seg;
      return {
        x: pts[i - 1][0] + dx * t, y: pts[i - 1][1] + dy * t,
        dx: dx / seg, dy: dy / seg,
      };
    }
    acc += seg;
  }
  const [lx, ly] = pts[pts.length - 1];
  return { x: lx, y: ly, dx: 0, dy: 1 };
}

function polylineLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++)
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return len;
}

// 點到線段的最短距離(判斷手指有沒有經過檢查點)
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

// 沿筆畫等距佈下檢查點,必須「照順序」逐一經過才算描對這一筆
function checkpointsFor(pts, spacing) {
  const total = polylineLength(pts);
  const n = Math.max(2, Math.round(total / spacing));
  const cps = [];
  for (let i = 0; i <= n; i++) {
    const p = walkPolyline(pts, (total * i) / n);
    cps.push([p.x, p.y]);
  }
  return cps;
}

// 點到整條折線的最短距離(判斷手指有沒有離開這一筆的軌道)
function distToPolyline(px, py, pts) {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const d = segDist(px, py, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    if (d < best) best = d;
  }
  return best;
}

const TRACE_HIT = 38;        // 手指要多靠近檢查點才算經過(內部像素)
const TRACE_CP_SPACING = 26; // 檢查點間距,需小於命中半徑才能連續判定
const TRACE_CORRIDOR = 42;   // 離這一筆的軌道超過這距離就算「離線」,進度歸零

// 習字本「四線三格」:頂線 15、中線(小寫身高)45、基線 80、下伸線 100
// 跟 LETTER_STROKES 的座標規範一致,讓小朋友知道字母各部位的正確位置
function drawWritingLines(g) {
  const x0 = TRACE_PAD - 6;
  const x1 = TRACE_SIZE - TRACE_PAD + 6;
  const Y = (v) => TRACE_PAD + v * TRACE_SC;
  // 中間格(小字母的家)淡淡上色
  g.fillStyle = "#FFFBEA";
  g.fillRect(x0, Y(45), x1 - x0, Y(80) - Y(45));
  const line = (y, color, dashed, width = 3) => {
    g.beginPath();
    g.setLineDash(dashed ? [10, 8] : []);
    g.lineWidth = width;
    g.strokeStyle = color;
    g.moveTo(x0, y);
    g.lineTo(x1, y);
    g.stroke();
  };
  line(Y(15), "#C9DBF2", false);      // 頂線
  line(Y(45), "#C9DBF2", true);       // 中線(虛線)
  line(Y(80), "#F2A9BC", false, 3.5); // 基線(紅色,最重要)
  line(Y(100), "#E4E0F5", true);      // 下伸線
  g.setLineDash([]);
}

// 田字格(注音/國字用):外框 + 中間十字虛線
function drawTianGrid(g) {
  const a = TRACE_PAD - 6, b = TRACE_SIZE - TRACE_PAD + 6, m = (a + b) / 2;
  g.fillStyle = "#FFFBEA";
  g.fillRect(a, a, b - a, b - a);
  g.setLineDash([]);
  g.lineWidth = 3;
  g.strokeStyle = "#F2A9BC";
  g.strokeRect(a, a, b - a, b - a);
  g.setLineDash([10, 8]);
  g.lineWidth = 2.5;
  g.strokeStyle = "#E7B9C6";
  g.beginPath(); g.moveTo(a, m); g.lineTo(b, m); g.moveTo(m, a); g.lineTo(m, b); g.stroke();
  g.setLineDash([]);
}

// 依狀態取得筆畫底圖顏色
const bodyColorFor = (i, activeIdx) =>
  i < activeIdx ? "#CDEFDD" : i === activeIdx ? "#E6E0FB" : "#F1EEFB";

function TraceCanvas({
  char, strokeColor, onStrokeDone, onComplete,
  strokeData,   // 外部筆畫(0–100 座標);未給則用 LETTER_STROKES
  outlines,     // 外部字形輪廓(SVG path,0–100 座標),有給就用填色輪廓當底圖
  grid = "latin", // latin = 四線三格,tian = 田字格
}) {
  const guideRef = useRef(null);
  const drawRef = useRef(null);
  const rafRef = useRef(0);
  const drawingRef = useRef(false);
  const prevRef = useRef(null);
  const cpsRef = useRef([]);      // 目前這一筆的檢查點
  const nextCpRef = useRef(0);    // 下一個要經過的檢查點索引
  const idxRef = useRef(0);       // 目前在描第幾筆
  const [strokeIdx, setStrokeIdx] = useState(0);
  const [hint, setHint] = useState("");

  // 這個字的筆畫(換算成畫布像素)
  const strokes = useMemo(() => {
    const s = strokeData || LETTER_STROKES[char];
    return s ? s.map((p) => p.map(toPx)) : null;
  }, [char, strokeData]);
  const total = strokes ? strokes.length : 1;

  // 外部輪廓 → Path2D(畫布座標)
  const outlinePaths = useMemo(() => {
    if (!outlines || typeof Path2D === "undefined") return null;
    try {
      return outlines.map((d) => {
        const p = new Path2D();
        const m = new DOMMatrix().translate(TRACE_PAD, TRACE_PAD).scale(TRACE_SC);
        p.addPath(new Path2D(d), m);
        return p;
      });
    } catch {
      return null;
    }
  }, [outlines]);

  const drawGrid = useCallback((g) => {
    if (grid === "tian") drawTianGrid(g);
    else drawWritingLines(g);
  }, [grid]);

  // 畫引導:已完成的筆變綠打勾,目前這筆亮起(虛線+編號+箭頭+起點光圈),還沒到的筆淡淡的
  const paintGuide = useCallback(
    (activeIdx) => {
      const g = guideRef.current.getContext("2d");
      g.clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
      drawGrid(g);
      if (!strokes) {
        g.font = `700 ${TRACE_SIZE * 0.72}px 'Fredoka', 'Comic Sans MS', ui-rounded, sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#E6E0FB";
        g.fillText(char, TRACE_SIZE / 2, TRACE_SIZE * 0.55);
        return;
      }
      g.lineCap = "round";
      g.lineJoin = "round";
      g.setLineDash([]);
      // 筆身(依狀態上色):有輪廓資料就填真實字形,否則用粗線條近似
      if (outlinePaths) {
        outlinePaths.forEach((p, i) => {
          g.fillStyle = bodyColorFor(i, activeIdx);
          g.fill(p);
        });
      } else {
        strokes.forEach((s, i) => {
          g.lineWidth = 46;
          g.strokeStyle = bodyColorFor(i, activeIdx);
          g.beginPath();
          g.moveTo(s[0][0], s[0][1]);
          for (const [x, y] of s) g.lineTo(x, y);
          g.stroke();
        });
      }
      // 目前這筆的虛線中心線
      const act = strokes[activeIdx];
      if (act) {
        g.lineWidth = 4;
        g.strokeStyle = "#B9AFF0";
        g.setLineDash([11, 9]);
        g.beginPath();
        g.moveTo(act[0][0], act[0][1]);
        for (const [x, y] of act) g.lineTo(x, y);
        g.stroke();
        g.setLineDash([]);
      }
      // 編號圓點 / 箭頭 / 起點光圈
      const badges = [];
      strokes.forEach((s, i) => {
        const s0 = walkPolyline(s, 0.1);
        let bx = s[0][0] - s0.dx * 32;
        let by = s[0][1] - s0.dy * 32;
        for (const [ox, oy] of badges) {
          if (Math.hypot(bx - ox, by - oy) < 34) {
            bx += -s0.dy * 38;
            by += s0.dx * 38;
          }
        }
        badges.push([bx, by]);
        if (i < activeIdx) {
          // 已完成:綠色打勾
          g.beginPath();
          g.arc(bx, by, 15, 0, 2 * P2);
          g.fillStyle = T.green;
          g.fill();
          g.fillStyle = "#fff";
          g.font = "700 18px 'Fredoka', sans-serif";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("✓", bx, by + 1);
          return;
        }
        const active = i === activeIdx;
        const color = active ? STROKE_BADGE_COLORS[i % STROKE_BADGE_COLORS.length] : "#D2CCED";
        if (active) {
          // 方向箭頭
          const a = walkPolyline(s, 46);
          g.fillStyle = color;
          g.beginPath();
          g.moveTo(a.x + a.dx * 14, a.y + a.dy * 14);
          g.lineTo(a.x - a.dy * 10, a.y + a.dx * 10);
          g.lineTo(a.x + a.dy * 10, a.y - a.dx * 10);
          g.closePath();
          g.fill();
          // 起點光圈:告訴小朋友「從這裡開始」
          g.beginPath();
          g.arc(s[0][0], s[0][1], 24, 0, 2 * P2);
          g.strokeStyle = color;
          g.lineWidth = 5;
          g.stroke();
        }
        g.beginPath();
        g.arc(bx, by, 15, 0, 2 * P2);
        g.fillStyle = color;
        g.fill();
        g.fillStyle = "#fff";
        g.font = "700 19px 'Fredoka', sans-serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(String(i + 1), bx, by + 1);
      });
    },
    [strokes, char, outlinePaths, drawGrid]
  );

  // 全筆順示範用的底圖(每一筆都顯示編號和箭頭)
  const paintDemoBase = useCallback(() => {
    const g = guideRef.current.getContext("2d");
    g.clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
    drawGrid(g);
    if (!strokes) return;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.setLineDash([]);
    if (outlinePaths) {
      g.fillStyle = "#E6E0FB";
      for (const p of outlinePaths) g.fill(p);
    } else {
      g.lineWidth = 46;
      g.strokeStyle = "#E6E0FB";
      for (const s of strokes) {
        g.beginPath();
        g.moveTo(s[0][0], s[0][1]);
        for (const [x, y] of s) g.lineTo(x, y);
        g.stroke();
      }
    }
    const badges = [];
    strokes.forEach((s, i) => {
      const color = STROKE_BADGE_COLORS[i % STROKE_BADGE_COLORS.length];
      const a = walkPolyline(s, 46);
      g.fillStyle = color;
      g.beginPath();
      g.moveTo(a.x + a.dx * 13, a.y + a.dy * 13);
      g.lineTo(a.x - a.dy * 9, a.y + a.dx * 9);
      g.lineTo(a.x + a.dy * 9, a.y - a.dx * 9);
      g.closePath();
      g.fill();
      const s0 = walkPolyline(s, 0.1);
      let bx = s[0][0] - s0.dx * 32;
      let by = s[0][1] - s0.dy * 32;
      for (const [ox, oy] of badges) {
        if (Math.hypot(bx - ox, by - oy) < 34) { bx += -s0.dy * 38; by += s0.dx * 38; }
      }
      badges.push([bx, by]);
      g.beginPath();
      g.arc(bx, by, 16, 0, 2 * P2);
      g.fillStyle = color;
      g.fill();
      g.fillStyle = "#fff";
      g.font = "700 20px 'Fredoka', sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(String(i + 1), bx, by + 1);
    });
  }, [strokes, outlinePaths, drawGrid]);

  // 筆順示範:小鉛筆照 1→2→3 順序畫一次給小朋友看
  const playDemo = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (!strokes) return;
    const lens = strokes.map(polylineLength);
    const totLen = lens.reduce((a, b) => a + b, 0);
    const SPEED = 0.28;
    let t0 = null;
    const g = guideRef.current.getContext("2d");
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const drawn = Math.min((ts - t0) * SPEED, totLen);
      paintDemoBase();
      g.lineCap = "round";
      g.lineJoin = "round";
      g.lineWidth = 12;
      g.strokeStyle = strokeColor;
      let remain = drawn;
      let tip = null;
      for (let i = 0; i < strokes.length && remain > 0; i++) {
        const seg = Math.min(remain, lens[i]);
        const s = strokes[i];
        g.beginPath();
        g.moveTo(s[0][0], s[0][1]);
        let acc = 0;
        for (let k = 1; k < s.length; k++) {
          const d = Math.hypot(s[k][0] - s[k - 1][0], s[k][1] - s[k - 1][1]);
          if (acc + d <= seg) { g.lineTo(s[k][0], s[k][1]); acc += d; }
          else { const p = walkPolyline(s, seg); g.lineTo(p.x, p.y); tip = p; break; }
        }
        g.stroke();
        if (seg >= lens[i]) tip = walkPolyline(s, lens[i]);
        remain -= seg;
      }
      if (tip) {
        g.font = "44px serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("✏️", tip.x + 14, tip.y - 16);
      }
      if (drawn < totLen) rafRef.current = requestAnimationFrame(step);
      else setTimeout(() => paintGuide(idxRef.current), 500);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [strokes, paintDemoBase, paintGuide, strokeColor]);

  const resetTo = useCallback(
    (i) => {
      idxRef.current = i;
      setStrokeIdx(i);
      setHint("");
      if (strokes && strokes[i]) cpsRef.current = checkpointsFor(strokes[i], TRACE_CP_SPACING);
      else cpsRef.current = [];
      nextCpRef.current = 0;
      paintGuide(i);
    },
    [strokes, paintGuide]
  );

  // 換字母:回到第一筆、清空筆跡
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    resetTo(0);
    drawRef.current.getContext("2d").clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
    return () => cancelAnimationFrame(rafRef.current);
  }, [char, resetTo]);

  const toCanvasXY = (e) => {
    const rect = drawRef.current.getBoundingClientRect();
    return [
      ((e.clientX - rect.left) * TRACE_SIZE) / rect.width,
      ((e.clientY - rect.top) * TRACE_SIZE) / rect.height,
    ];
  };

  const completeStroke = () => {
    const i = idxRef.current;
    if (i >= total - 1) {
      idxRef.current = total;
      setStrokeIdx(total);
      paintGuide(total); // 全部打勾
      onComplete();
    } else {
      if (onStrokeDone) onStrokeDone(i + 1, total);
      resetTo(i + 1);
    }
  };

  // 依序判定手指有沒有從起點、照方向、沿著線經過每個檢查點
  const gate = (ax, ay, bx, by) => {
    const cps = cpsRef.current;
    const i = idxRef.current;
    if (i >= total || !cps.length || !strokes) return;
    // 離開這一筆的軌道 → 進度歸零(亂塗因此無法過關)
    if (distToPolyline(bx, by, strokes[i]) > TRACE_CORRIDOR) {
      if (nextCpRef.current > 0) {
        nextCpRef.current = 0;
        setHint(tf("要沿著線描喔,回到 {0} 號圓點 →", i + 1));
      }
      return;
    }
    let advanced = false;
    while (nextCpRef.current < cps.length) {
      const [cx, cy] = cps[nextCpRef.current];
      if (segDist(cx, cy, ax, ay, bx, by) <= TRACE_HIT) {
        nextCpRef.current += 1;
        advanced = true;
      } else break;
    }
    if (advanced) {
      setHint("");
      if (nextCpRef.current >= cps.length) completeStroke();
    }
  };

  const inkSeg = (px, py, x, y, width = 30) => {
    const c = drawRef.current.getContext("2d");
    c.lineCap = "round";
    c.lineJoin = "round";
    c.lineWidth = width;
    c.strokeStyle = strokeColor;
    c.beginPath();
    c.moveTo(px, py);
    c.lineTo(x, y);
    c.stroke();
  };

  // Apple Pencil / 觸控筆:筆壓變化的線寬(手指維持固定粗細)
  const widthFor = (ev) =>
    ev.pointerType === "pen"
      ? 18 + 22 * Math.min(1, Math.max(0.25, ev.pressure || 0.5))
      : 30;

  const activeIdRef = useRef(null); // 正在畫的那枝筆/手指
  const lastPenRef = useRef(0);     // 最近用筆的時間(防手掌誤觸)

  const start = (e) => {
    if (!strokes || idxRef.current >= total) return;
    if (e.pointerType === "pen") lastPenRef.current = Date.now();
    // 防手掌誤觸:剛用過 Apple Pencil 的 5 秒內,忽略手掌/手指的觸碰
    else if (e.pointerType === "touch" && Date.now() - lastPenRef.current < 5000) return;
    // 一次只認一枝筆(忽略第二根手指)
    if (activeIdRef.current !== null) return;
    activeIdRef.current = e.pointerId;
    drawingRef.current = true;
    try { drawRef.current.setPointerCapture(e.pointerId); } catch { /* 合成事件沒有 capture */ }
    const [x, y] = toCanvasXY(e);
    prevRef.current = [x, y];
    inkSeg(x, y, x + 0.1, y + 0.1, widthFor(e));
    gate(x, y, x, y);
  };

  const move = (e) => {
    if (!drawingRef.current || e.pointerId !== activeIdRef.current) return;
    if (e.pointerType === "pen") lastPenRef.current = Date.now();
    // Pencil 高頻取樣:把合併的中間點全畫出來,筆跡更順
    const evs =
      (e.nativeEvent && e.nativeEvent.getCoalescedEvents && e.nativeEvent.getCoalescedEvents()) ||
      [e];
    for (const ev of evs.length ? evs : [e]) {
      const [x, y] = toCanvasXY(ev);
      const [px, py] = prevRef.current;
      inkSeg(px, py, x, y, widthFor(ev));
      gate(px, py, x, y);
      prevRef.current = [x, y];
    }
  };

  const end = (e) => {
    if (!drawingRef.current || (e && e.pointerId !== activeIdRef.current)) return;
    drawingRef.current = false;
    activeIdRef.current = null;
    prevRef.current = null;
    // 這一筆還沒開始就放手 → 溫柔提示從起點開始
    if (idxRef.current < total && nextCpRef.current === 0)
      setHint(tf("從 {0} 號圓點開始,跟著箭頭描 →", idxRef.current + 1));
  };

  const clear = () => {
    cancelAnimationFrame(rafRef.current);
    resetTo(0);
    drawRef.current.getContext("2d").clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
  };

  const allDone = strokeIdx >= total;

  return (
    <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: T.purple, marginBottom: 8 }}>{allDone
          ? t("✅ 每一筆都描對了!")
          : tf("✏️ 第 {0} / {1} 筆 · 從 {2} 號圓點開始", strokeIdx + 1, total, strokeIdx + 1)}</div>
      <div style={{ position: "relative", width: "100%" }}>
        <canvas
          ref={guideRef}
          width={TRACE_SIZE}
          height={TRACE_SIZE}
          style={{
            width: "100%", display: "block", background: "#FFFDF5",
            borderRadius: 24, border: "3px solid #E8E4FA",
            boxShadow: "0 6px 0 #E0DBF7",
          }}
        />
        <canvas
          ref={drawRef}
          width={TRACE_SIZE}
          height={TRACE_SIZE}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            touchAction: "none", cursor: "crosshair", borderRadius: 24,
          }}
        />
      </div>
      {/* 按鈕放畫布下方,才不會壓到 g、j、p、q、y 的尾巴 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <button
          onClick={playDemo}
          style={{
            fontFamily: "inherit", fontWeight: 700, fontSize: 15,
            background: T.purple, color: "#fff", border: "none",
            borderRadius: 999, padding: "9px 16px", cursor: "pointer",
            boxShadow: `0 3px 0 ${T.purpleDark}`,
          }}
        >{t("✏️ 筆順示範")}</button>
        <button
          onClick={clear}
          style={{
            fontFamily: "inherit", fontWeight: 700, fontSize: 15,
            background: "#E8E4FA", color: T.sub, border: "none",
            borderRadius: 999, padding: "9px 16px", cursor: "pointer",
            boxShadow: "0 3px 0 #D2CCED",
          }}
        >{t("🧽 擦掉")}</button>
      </div>
      {hint && (
        <div style={{ marginTop: 10, fontSize: 15, color: T.pink, fontWeight: 700 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

const TRACE_COLORS = ["#6C5CE7", "#FF6B9D", "#4ECB71", "#F0932B", "#3FA7E0"];

// ---------- 注音手寫練習(教育部標準筆順)----------
const BOPO_TRACE_KEY = "wordpop-bopo-done";
function loadBopoDone() {
  try {
    const arr = JSON.parse(localStorage.getItem(BOPO_TRACE_KEY) || "[]");
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function BopoWriteMode({ speak, addStars }) {
  const [idx, setIdx] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [cheer, setCheer] = useState("");
  const [doneSet, setDoneSet] = useState(loadBopoDone);
  const item = BOPOMOFO[idx];
  const s = item.s;
  const data = BOPO_STROKES[s];
  const color = TRACE_COLORS[idx % TRACE_COLORS.length];

  const select = (i) => {
    setIdx(i);
    setCelebrate(false);
    setCheer("");
    zh(speak, BOPOMOFO[i].sound, { rate: 0.8 });
  };

  const markDone = () => {
    setCelebrate(true);
    setCheer("");
    addStars(2);
    zh(speak, `${item.sound}!${item.word}`, { rate: 0.9 });
    setDoneSet((prev) => {
      const next = new Set(prev);
      next.add(s);
      try { localStorage.setItem(BOPO_TRACE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const onStrokeDone = (n, tot) => {
    setCheer(tf("第 {0} 筆寫對了!換第 {1} 筆 👍", n, n + 1));
    setTimeout(() => setCheer(""), 1400);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("照教育部標準筆順,從 1 號圓點跟著箭頭寫!已完成{0}", " ")}<b style={{ color: T.purple }}>{doneSet.size}</b> / {BOPOMOFO.length}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginBottom: 12 }}>
        <ChunkyButton color={T.yellow} dark={T.yellowDark}
          onClick={() => zh(speak, item.sound, { rate: 0.8 })}
          style={{ color: T.ink, padding: "10px 18px", fontSize: 16 }}>{tf("🔊 {0} 怎麼唸", s)}</ChunkyButton>
        <button
          onClick={() => zh(speak, item.word, { rate: 0.85 })}
          style={{
            fontFamily: "inherit", fontWeight: 700, fontSize: 15,
            background: T.card, color: T.ink, border: "3px solid #E8E4FA",
            borderRadius: 16, padding: "8px 14px", cursor: "pointer",
            boxShadow: "0 4px 0 #E0DBF7",
          }}>
          {item.emoji} {item.word}
        </button>
      </div>

      <TraceCanvas
        char={s}
        strokeColor={color}
        strokeData={data?.strokes}
        outlines={data?.outlines}
        grid="tian"
        onStrokeDone={onStrokeDone}
        onComplete={markDone}
      />

      {celebrate ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 22, color: T.greenDark, fontWeight: 700 }}>{tf("🎉 太棒了!{0} 寫得真漂亮!+2 ⭐", s)}</div>
          <ChunkyButton color={T.green} dark={T.greenDark}
            onClick={() => select((idx + 1) % BOPOMOFO.length)}
            style={{ marginTop: 10 }}>{t("下一個注音 →")}</ChunkyButton>
        </div>
      ) : (
        cheer && (
          <div style={{ marginTop: 14, fontSize: 16, color: T.sub, fontWeight: 700 }}>
            {cheer}
          </div>
        )
      )}

      {/* 注音選擇表 */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))",
        gap: 8, marginTop: 18,
      }}>
        {BOPOMOFO.map((b, i) => {
          const finished = doneSet.has(b.s);
          const active = i === idx;
          return (
            <button key={b.s} onClick={() => select(i)}
              style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 22,
                padding: "10px 0", borderRadius: 14, cursor: "pointer",
                border: `3px solid ${active ? T.purpleDark : finished ? T.green : "#E8E4FA"}`,
                background: active ? T.purple : finished ? "#E9FBEF" : T.card,
                color: active ? "#fff" : T.ink,
                transition: "all .15s",
              }}>
              {b.s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WriteMode({ speak, addStars }) {
  const [caseMode, setCaseMode] = useState("upper"); // upper | lower
  const [letter, setLetter] = useState("A");
  const [celebrate, setCelebrate] = useState(false);
  const [cheer, setCheer] = useState(""); // 描對一筆的鼓勵語
  const [doneSet, setDoneSet] = useState(loadTraceDone);

  const displayChar = caseMode === "upper" ? letter : letter.toLowerCase();
  const doneKey = `${letter}-${caseMode}`;
  const example = exampleWordFor(letter);
  const color = TRACE_COLORS[LETTERS.indexOf(letter) % TRACE_COLORS.length];
  useEffect(() => {
    if (example) speak.prefetch?.(example.en);
  }, [example, speak]);

  // 加句點強迫走合成語音唸「字母名」,避免查到單字 a / I 的發音
  const sayLetter = useCallback(
    (L) => speak(L + ".", { rate: 0.8 }),
    [speak]
  );

  const selectLetter = (L, cm = caseMode) => {
    setLetter(L);
    setCaseMode(cm);
    setCelebrate(false);
    setCheer("");
    sayLetter(L);
  };

  const markDone = () => {
    setCelebrate(true);
    setCheer("");
    addStars(2);
    // 「A! A is for」用合成,例字接真人音檔
    if (example)
      speak(`${letter}! ${letter} is for`, {
        rate: 0.9,
        onEnd: () => speak(example.en, { rate: 0.9 }),
      });
    else sayLetter(letter);
    setDoneSet((prev) => {
      const next = new Set(prev);
      next.add(doneKey);
      try {
        localStorage.setItem(TRACE_KEY, JSON.stringify([...next]));
      } catch { /* 無痕模式等寫入失敗就不保存 */ }
      return next;
    });
  };

  // 描對一筆時給正向回饋(不換行的小鼓勵)
  const onStrokeDone = (doneCount, totalStrokes) => {
    setCheer(tf("第 {0} 筆描對了!換第 {1} 筆 👍", doneCount, doneCount + 1));
    speak("Good!", { rate: 1 });
    setTimeout(() => setCheer(""), 1400);
  };

  const nextLetter = () => {
    const idx = LETTERS.indexOf(letter);
    if (caseMode === "upper") selectLetter(letter, "lower");
    else selectLetter(LETTERS[(idx + 1) % LETTERS.length], "upper");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>{tf("從 1 號圓點開始,照箭頭方向一筆一筆描;每筆都描對才會換下一筆!已完成{0}", " ")}<b style={{ color: T.purple }}>{doneSet.size}</b> / {LETTERS.length * 2}
      </p>

      {/* 大小寫切換 */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {[["upper", t("大寫 ABC")], ["lower", t("小寫 abc")]].map(([cm, label]) => (
          <button
            key={cm}
            onClick={() => selectLetter(letter, cm)}
            style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 15,
              padding: "9px 18px", borderRadius: 999, border: "none",
              cursor: "pointer",
              background: caseMode === cm ? T.purple : "#E8E4FA",
              color: caseMode === cm ? "#fff" : T.sub,
              transition: "all .15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 例字 + 聽發音 */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, marginBottom: 12,
        }}
      >
        <ChunkyButton
          color={T.yellow} dark={T.yellowDark}
          onClick={() => sayLetter(letter)}
          style={{ color: T.ink, padding: "10px 18px", fontSize: 16 }}
        >{tf("🔊 {0} 怎麼唸", displayChar)}</ChunkyButton>
        {example && (
          <button
            onClick={() => speak(example.en)}
            style={{
              fontFamily: "inherit", fontWeight: 700, fontSize: 15,
              background: T.card, color: T.ink, border: "3px solid #E8E4FA",
              borderRadius: 16, padding: "8px 14px", cursor: "pointer",
              boxShadow: "0 4px 0 #E0DBF7",
            }}
          >
            {example.emoji} {example.en}
          </button>
        )}
      </div>

      <TraceCanvas
        char={displayChar}
        strokeColor={color}
        onStrokeDone={onStrokeDone}
        onComplete={markDone}
      />

      {celebrate ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 22, color: T.greenDark, fontWeight: 700 }}>{tf("🎉 太棒了!{0} 寫得真漂亮!+2 ⭐", displayChar)}</div>
          <ChunkyButton
            color={T.green} dark={T.greenDark} onClick={nextLetter}
            style={{ marginTop: 10 }}
          >{caseMode === "upper" ? tf("接著寫小寫 {0} →", letter.toLowerCase()) : t("下一個字母 →")}</ChunkyButton>
        </div>
      ) : (
        cheer && (
          <div style={{ marginTop: 14, fontSize: 16, color: T.sub, fontWeight: 700 }}>
            {cheer}
          </div>
        )
      )}

      {/* 字母選擇表 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))",
          gap: 8, marginTop: 18,
        }}
      >
        {LETTERS.map((L) => {
          const finished =
            doneSet.has(`${L}-upper`) && doneSet.has(`${L}-lower`);
          const active = L === letter;
          return (
            <button
              key={L}
              onClick={() => selectLetter(L)}
              style={{
                fontFamily: "inherit", fontWeight: 700, fontSize: 19,
                padding: "10px 0", borderRadius: 14, border: "none",
                cursor: "pointer",
                background: active ? T.purple : finished ? "#E9FBEF" : T.card,
                color: active ? "#fff" : finished ? T.greenDark : T.ink,
                boxShadow: active ? `0 4px 0 ${T.purpleDark}` : "0 4px 0 #E0DBF7",
                transition: "all .15s",
              }}
            >
              {finished && !active ? "✓" : ""}{L}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- 主程式 ----------
// 首頁選單:同類遊戲放同一組
// 首頁科目分頁:ABC / 注音 / 數字 分開顯示,不混在一起
const SUBJECTS = [
  { key: "abc",  icon: "🔤", label: "ABC",   color: T.purple, dark: T.purpleDark,
    sub: "英文:聽、說、讀、寫、理解" },
  { key: "bopo", icon: "ㄅ",  label: "ㄅㄆㄇ", color: "#D63031", dark: "#A32320",
    sub: "注音:認符號、拼音、聲調、聽力與標準筆順手寫" },
  { key: "num",  icon: "🔢", label: "數字",  color: "#3867D6", dark: "#284D9E",
    sub: "數學:數數、比大小、加減、形狀、時鐘、錢" },
];
const SUBJECT_KEY = "wordpop-subject";

const MENU_GROUPS = [
  {
    subject: "abc",
    label: "🧠 認識單字",
    items: [
      { mode: "learn", color: T.purple, dark: T.purpleDark, label: "📚 學習單字",
        tip: "當字典用:每天挑一個分類,唸完請她跟著唸一次" },
      { mode: "phonics", color: T.green, dark: T.greenDark, label: "🔤 發音練習",
        tip: "先聽字節再聽例字,引導她發現「結尾聲音都一樣」" },
    ],
  },
  {
    subject: "abc",
    label: "👂 聽聲音找字",
    items: [
      { mode: "quiz", color: T.pink, dark: "#D14B7D", label: "🎯 聽力挑戰",
        tip: "答錯不用急著解釋,讓她按「再聽一次」自己修正" },
      { mode: "sound", color: "#9B59D0", dark: "#7A3FAC", label: "🕵️ 首音偵探",
        tip: "答對後加碼問:還有什麼字也是這個字母開頭?" },
      { mode: "endsound", color: "#6C7A89", dark: "#4B5560", label: "🦶 尾音偵探",
        tip: "結尾音比開頭音難,先玩熟首音偵探再來挑戰" },
      { mode: "rhyme", color: "#2E86DE", dark: "#1F5FA8", label: "🚂 押韻火車",
        tip: "答對時指著粉紅色字尾唸:「cat、hat 屁股一樣!」" },
      { mode: "bubble", color: "#45AAF2", dark: "#2D87C7", label: "🫧 單字泡泡",
        tip: "沒有時間壓力,適合當獎勵遊戲放鬆玩" },
    ],
  },
  {
    subject: "abc",
    label: "💬 聽懂句子",
    items: [
      { mode: "listendo", color: "#E17055", dark: "#B3543F", label: "🎧 聽指令點圖",
        tip: "進階玩法:先不看畫面只用聽的,想好了再看再點" },
      { mode: "yesno", color: "#778BEB", dark: "#5568C4", label: "❓ 是不是?",
        tip: "鼓勵她先大聲回答 Yes! 或 No! 再按按鈕" },
      { mode: "count", color: "#574B90", dark: "#3E3568", label: "🔢 數數小市場",
        tip: "請她用手指一個一個點著數,數完再選答案" },
      { mode: "colorgame", color: "#E66767", dark: "#C04747", label: "🎨 聽顏色著色",
        tip: "延伸:找找家裡有什麼東西也是這個顏色" },
      { mode: "preposition", color: "#487EB0", dark: "#345A80", label: "🧭 在哪裡?",
        tip: "在家拿盒子和球實際擺,邊擺邊說 on/in/under" },
    ],
  },
  {
    subject: "abc",
    label: "📖 拼讀 Phonics",
    items: [
      { mode: "syllable", color: "#00A8A8", dark: "#007878", label: "👏 音節拍拍",
        tip: "跟她一起拍手數音節:ba-na-na 拍三下!" },
      { mode: "middle", color: "#7D5FFF", dark: "#5A43C4", label: "🅰️ 中間的音",
        tip: "短母音最難,答錯陪她慢慢把三個音分開唸" },
      { mode: "blend", color: "#0FB9B1", dark: "#0A8880", label: "📖 拼讀小火車",
        tip: "看字母亮起、一個一個音拼起來——這是自己讀字的第一步" },
    ],
  },
  {
    subject: "abc",
    label: "🧩 拼字與字母",
    items: [
      { mode: "spell", color: "#6AB04C", dark: "#4F8438", label: "🧩 拼字小廚師",
        tip: "拼完請她看著綠色字母,把整個字大聲唸一次" },
      { mode: "casematch", color: "#BE2EDD", dark: "#8F1DAD", label: "🔠 大小寫配對",
        tip: "答對後問她:大寫和小寫哪裡長得像?" },
      { mode: "hunt", color: "#F5A623", dark: "#C6841A", label: "🔎 字母獵人",
        tip: "純用聽的找字母;答錯會再唸一次,讓她自己修正" },
      { mode: "alphabet", color: "#EB4D4B", dark: "#B83A39", label: "🔤 ABC 接接看",
        tip: "接不出來就一起從 A 唱字母歌到那裡" },
      { mode: "upperlower", color: "#22A6B3", dark: "#187D87", label: "🔠 大寫還是小寫?",
        tip: "最容易上手,適合先玩建立信心" },
    ],
  },
  {
    subject: "bopo",
    label: "ㄅ 認識注音",
    items: [
      { mode: "bopolearn", color: T.purple, dark: T.purpleDark, label: "📚 認識注音",
        tip: "當注音表用:點一下先唸注音再唸例詞,一天認幾個就好" },
      { mode: "bopoorder", color: "#D63031", dark: "#A32320", label: "ㄅ ㄅㄆㄇ 接接看",
        tip: "照課本順序接下去;接不出來就一起唸一遍ㄅㄆㄇㄈ" },
    ],
  },
  {
    subject: "bopo",
    label: "👂 聽聲音找注音",
    items: [
      { mode: "zhquiz", color: "#4B7BEC", dark: "#3560BC", label: "👂 注音聽力挑戰",
        tip: "只用聽的選圖;答對後請她跟著唸一次那個詞" },
      { mode: "bopohunt", color: "#0984E3", dark: "#0668B0", label: "🔍 注音獵人",
        tip: "聽詞找開頭的注音;答對後跟著唸一次「ㄅ,爸爸」" },
      { mode: "zhend", color: "#7158E2", dark: "#5341B4", label: "🔎 韻母偵探",
        tip: "聽最後的音;把詞拉長唸「貓——ㄠ」她比較聽得出來" },
      { mode: "zhrhyme", color: "#FF7675", dark: "#CC5250", label: "🚂 押韻火車(注音)",
        tip: "押韻是聽出韻母的第一步,唸給她聽:貓、貓、ㄠ!" },
      { mode: "bopobubble", color: "#45AAF2", dark: "#2D87C7", label: "🫧 注音泡泡",
        tip: "沒有時間壓力,適合當獎勵遊戲放鬆玩" },
    ],
  },
  {
    subject: "bopo",
    label: "💬 聽懂中文句子",
    items: [
      { mode: "zhdo", color: "#20BF6B", dark: "#169553", label: "👉 聽指令點圖(中文)",
        tip: "只給聲音不給字,訓練專心聽完一整句" },
      { mode: "zhyesno", color: "#F79F1F", dark: "#C67C14", label: "❓ 是不是?(中文)",
        tip: "答錯不用急著糾正,再問一次「這是什麼?」" },
      { mode: "zhcount", color: "#EE5A24", dark: "#BC4519", label: "🧺 數數小市場(中文)",
        tip: "陪她用手指一個一個點著數,別用猜的" },
      { mode: "zhcolor", color: "#D980FA", dark: "#A961C6", label: "🎨 聽顏色(中文)",
        tip: "玩完可以在家找找看:哪些東西是紅色的?" },
      { mode: "zhprep", color: "#12CBC4", dark: "#0E9F9A", label: "🧭 在哪裡?(中文)",
        tip: "拿一顆球和盒子實際擺一次,理解最快" },
    ],
  },
  {
    subject: "bopo",
    label: "🚂 拼音與聲調",
    items: [
      { mode: "bopoblend", color: "#0FB9B1", dark: "#0A8880", label: "🚂 拼音小火車",
        tip: "ㄍ+ㄡ=ㄍㄡ,這是自己讀注音的關鍵,值得多玩" },
      { mode: "bopotone", color: "#9B59D0", dark: "#7A3FAC", label: "🎵 聲調小老師",
        tip: "先誇張地唸給她聽:媽、麻、馬、罵,再讓她分辨" },
      { mode: "zhsyll", color: "#00A8A8", dark: "#007878", label: "👏 幾個字(音節)",
        tip: "一起拍手數:腳-踏-車 拍三下!" },
      { mode: "zhmedial", color: "#7D5FFF", dark: "#5A43C4", label: "🅰️ 中間的音(介音)",
        tip: "ㄧㄨㄩ 最容易漏掉,慢慢把三個音分開唸給她聽" },
      { mode: "zhfamily", color: "#FD7272", dark: "#CA5B5B", label: "👨‍👩‍👧 韻母家族",
        tip: "同一個韻母的字排在一起唸,她會發現規律" },
    ],
  },
  {
    subject: "bopo",
    label: "🧩 認符號與拼注音",
    items: [
      { mode: "zhspell", color: "#6AB04C", dark: "#4F8438", label: "🧩 拼注音小廚師",
        tip: "拼完請她看著綠色注音,把整個字大聲唸一次" },
      { mode: "bopomatch", color: "#00B894", dark: "#008B6E", label: "🧩 注音配對",
        tip: "看注音找圖片,是獵人的反向練習" },
      { mode: "zhfind", color: "#F5A623", dark: "#C6841A", label: "🔎 注音找找看",
        tip: "純用聽的找符號;答錯會再唸一次,讓她自己修正" },
      { mode: "zhtype", color: "#22A6B3", dark: "#187D87", label: "🔠 聲母還是韻母?",
        tip: "聲母放前面、韻母放後面,先建立這個概念再拼音" },
    ],
  },
  {
    subject: "bopo",
    label: "🧠 動動腦(注音)",
    items: [
      { mode: "zhmissing", color: "#E056FD", dark: "#AF44CA", label: "🕵️ 少了誰?(注音)",
        tip: "先讓她把注音一個一個唸過再蓋起來,比較記得住" },
      { mode: "zhopp", color: "#FF9F1A", dark: "#CC7F14", label: "↔️ 相反詞配對(中文)",
        tip: "生活中就能練:燈開了/關了、水熱的/冷的" },
      { mode: "zhseq", color: "#B33771", dark: "#8C2B5A", label: "🧠 記憶排排看(注音)",
        tip: "記不住是正常的,遊戲會自動重播,不算失敗" },
      { mode: "zhsize", color: "#3B3B98", dark: "#2C2C74", label: "📏 排大小(中文)",
        tip: "問她:為什麼你覺得這個比較大?說出理由更重要" },
    ],
  },
  {
    subject: "bopo",
    label: "📖 故事",
    items: [
      { mode: "zhstory", color: "#F97F51", dark: "#C6663F", label: "📖 注音小故事",
        tip: "先聽三句再回答問題;可以指著注音一起唸" },
    ],
  },
  {
    subject: "bopo",
    label: "🔤 注音快手",
    items: [
      { mode: "zhsight", color: "#E15F41", dark: "#B44C34", label: "⚡ 注音快手",
        tip: "一關 5 個符號,答錯的會再出現,一定過得了關" },
      { mode: "bopopairs", color: "#EE5A6F", dark: "#C43D52", label: "🎴 注音翻翻樂",
        tip: "翻牌時跟著唸出聲,符號和聲音一起記" },
    ],
  },
  {
    subject: "bopo",
    label: "🗣️ 開口與動手(注音)",
    items: [
      { mode: "boposay", color: "#F0932B", dark: "#C4731A", label: "🎤 注音跟讀",
        tip: "找安靜環境;先按「先聽一次」再自己唸" },
      { mode: "bopowrite", color: "#E17055", dark: "#B3543F", label: "✍️ 注音手寫",
        tip: "教育部標準筆順;先按「筆順示範」看一次再自己寫" },
    ],
  },
  {
    subject: "num",
    label: "🔢 認識數字",
    items: [
      { mode: "numlearn", color: T.purple, dark: T.purpleDark, label: "📚 認識數字",
        tip: "當數字表用:先聽中文再聽英文,下面的點點讓她「看見」多少" },
      { mode: "numorder", color: "#3867D6", dark: "#284D9E", label: "🔢 數字接龍",
        tip: "接不出來就一起從 1 數到那個數字" },
      { mode: "numlisten", color: "#4B7BEC", dark: "#3560BC", label: "👂 數字聽力挑戰",
        tip: "聽英文找數字;答對後跟著唸一次 one、two" },
      { mode: "numwrite", color: "#E17055", dark: "#B3543F", label: "✍️ 數字手寫",
        tip: "0–9 一筆一筆寫,方向錯了不會過關;先看示範再自己寫" },
    ],
  },
  {
    subject: "num",
    label: "🍎 數數看",
    items: [
      { mode: "numcount", color: "#20BF6B", dark: "#169553", label: "🍎 數數看",
        tip: "陪她用手指一個一個點著數,別用猜的" },
      { mode: "numtap", color: "#EE5A24", dark: "#BC4519", label: "🧺 點幾個",
        tip: "邊點邊數出聲音,這是「數量對應」最關鍵的一步" },
      { mode: "numdots", color: "#00B894", dark: "#008B6E", label: "🎯 數字配點點",
        tip: "十格框滿五、滿十一眼看得出來,幫她建立數感" },
      { mode: "numbubble", color: "#45AAF2", dark: "#2D87C7", label: "🫧 數字泡泡",
        tip: "沒有時間壓力,適合當獎勵遊戲放鬆玩" },
      { mode: "numpairs", color: "#EE5A6F", dark: "#C43D52", label: "🎴 數字翻翻樂",
        tip: "翻牌時把點點數出聲,數字和數量一起記" },
    ],
  },
  {
    subject: "num",
    label: "📏 比大小",
    items: [
      { mode: "nummore", color: "#F79F1F", dark: "#C67C14", label: "⚖️ 誰比較多?",
        tip: "先讓她一對一比對,不會數也能比出多少" },
      { mode: "numcompare", color: "#9B59D0", dark: "#7A3FAC", label: "🔢 數字比大小",
        tip: "想不出來就回想數線:後面的數字比較大" },
      { mode: "numsort", color: "#3B3B98", dark: "#2C2C74", label: "📊 排大小(數字)",
        tip: "問她為什麼這個比較小,說出理由更重要" },
      { mode: "numlong", color: "#D980FA", dark: "#A961C6", label: "📏 比長短",
        tip: "可以拿家裡的筆或積木實際比一次,更有感覺" },
      { mode: "numheavy", color: "#8D6E63", dark: "#6B5249", label: "⚖️ 比輕重",
        tip: "兩隻手各拿一樣東西比比看,比用眼睛看更準" },
    ],
  },
  {
    subject: "num",
    label: "🧮 加與減",
    items: [
      { mode: "add", color: "#F0932B", dark: "#C4731A", label: "➕ 加加看",
        tip: "先數左邊再接著數右邊,不要從頭重數" },
      { mode: "numsub", color: "#EB4D4B", dark: "#B83A39", label: "➖ 減減看",
        tip: "被劃掉的就是拿走的;剩下的再數一次就好" },
      { mode: "numten", color: "#0FB9B1", dark: "#0A8880", label: "🔟 湊十高手",
        tip: "湊十是進位加法的地基,值得多玩幾次" },
      { mode: "numsplit", color: "#6AB04C", dark: "#4F8438", label: "🍰 分一分",
        tip: "用真的餅乾分兩堆做一次,她馬上就懂" },
      { mode: "numequal", color: "#22A6B3", dark: "#187D87", label: "🟰 一樣多嗎?",
        tip: "不用數也可以:一個對一個,有剩下就是比較多" },
    ],
  },
  {
    subject: "num",
    label: "🔁 數字規律",
    items: [
      { mode: "nummissing", color: "#E056FD", dark: "#AF44CA", label: "🕵️ 少了誰?(數字)",
        tip: "從前一個數字往下數一個就找得到" },
      { mode: "numback", color: "#B33771", dark: "#8C2B5A", label: "🔙 往回數",
        tip: "倒數比正數難很多,可以先一起大聲倒數 10 到 1" },
      { mode: "numskip", color: "#FF9F1A", dark: "#CC7F14", label: "🦘 跳著數",
        tip: "兩個兩個數、五個五個數,是乘法的前身" },
      { mode: "numpattern", color: "#FD7272", dark: "#CA5B5B", label: "🔁 找規律",
        tip: "請她把規律唸出來:蘋果、香蕉、蘋果、香蕉…" },
    ],
  },
  {
    subject: "num",
    label: "🔷 形狀",
    items: [
      { mode: "shapelearn", color: "#7158E2", dark: "#5341B4", label: "🔷 認識形狀",
        tip: "玩完在家裡找找看:時鐘是圓形、門是長方形" },
      { mode: "shapefind", color: "#12CBC4", dark: "#0E9F9A", label: "👀 形狀找找看",
        tip: "顏色和大小會變,只看「形狀」才不會被騙" },
      { mode: "shapecount", color: "#F97F51", dark: "#C6663F", label: "🔺 數形狀",
        tip: "教她先用手指把同一種形狀圈起來再數" },
    ],
  },
  {
    subject: "num",
    label: "🕐 生活數學",
    items: [
      { mode: "numclock", color: "#0984E3", dark: "#0668B0", label: "🕐 認時鐘",
        tip: "先只看短針指哪裡;整點和半點分清楚就很棒了" },
      { mode: "numcoin", color: "#D4A94E", dark: "#A8863E", label: "🪙 認錢幣",
        tip: "拿真的零錢玩一次,買東西時讓她付錢最有效" },
      { mode: "numordinal", color: "#BE2EDD", dark: "#8F1DAD", label: "🚩 第幾個",
        tip: "「幾個」和「第幾個」不一樣,排隊時可以順便練" },
      { mode: "numshare", color: "#00A8A8", dark: "#007878", label: "🍪 分一分點心",
        tip: "分點心時真的一人一個輪流發,除法就從這裡開始" },
    ],
  },
  {
    subject: "abc",
    label: "🧠 動動腦",
    items: [
      { mode: "missing", color: "#4834D4", dark: "#332592", label: "🧠 少了誰?",
        tip: "按「我記好了」前,陪她把每樣東西唸一次英文" },
      { mode: "opposite", color: "#B33771", dark: "#8A2957", label: "↔️ 相反詞配對",
        tip: "生活中延伸:洗澡時問 hot 的相反是什麼?" },
      { mode: "sequence", color: "#8854D0", dark: "#653EA0", label: "🧠 記憶排排看",
        tip: "看它們依序亮起,再照一樣的順序點回去" },
      { mode: "size", color: "#26A65B", dark: "#1B7A43", label: "📏 排大小",
        tip: "由小到大點;答錯陪她比比看誰的身體比較大" },
    ],
  },
  {
    subject: "abc",
    label: "📖 故事與分類",
    items: [
      { mode: "story", color: "#786FA6", dark: "#5A5280", label: "📖 迷你小故事",
        tip: "睡前一天一個剛剛好;唸完請她用中文說一次故事" },
      { mode: "sort", color: "#CF6A87", dark: "#A84C68", label: "🧺 分類小幫手",
        tip: "答對時跟著唸整句:The cat is an animal!" },
    ],
  },
  {
    subject: "abc",
    label: "🏫 學校單字表",
    items: [
      { mode: "school", color: "#2D98DA", dark: "#1F6E9C", label: "📋 學校單字表",
        tip: "就是學校那張檢核表:點字聽發音,唸得出來讓她自己打勾;考試會先挑還沒打勾的字" },
      { mode: "schoolsay", color: "#F0932B", dark: "#C4731A", label: "🎤 學校單字跟讀",
        tip: "看著字唸出來才算過,比選擇題更接近老師的檢核;唸對會自動幫她在單字表打勾" },
    ],
  },
  {
    subject: "abc",
    label: "🔤 常見字 Sight Words(同一套字)",
    items: [
      { mode: "sight", color: "#3FA7E0", dark: "#2B7BAB", label: "👀 認字快手",
        tip: "前幾關她都會,先讓她連拿皇冠建立信心再往後玩" },
      { mode: "match", color: "#EE5A6F", dark: "#C43D52", label: "🎴 單字翻翻樂",
        tip: "翻牌時鼓勵她跟著唸出聲,字形和聲音記得更牢" },
    ],
  },
  {
    subject: "abc",
    label: "🗣️ 開口與動手",
    items: [
      { mode: "sayit", color: "#F0932B", dark: "#C4731A", label: "🎤 跟讀小勇士",
        tip: "找安靜環境、離麥克風近一點;唸對瞬間就會過關" },
      { mode: "write", color: "#00B8A9", dark: "#00897E", label: "✍️ 手寫練習",
        tip: "先按「筆順示範」看一次,再從 1 號圓點跟著箭頭描" },
    ],
  },
];

export default function WordPop() {
  const speak = useSpeech();
  const [mode, setMode] = useState("home");
  const [stars, setStars] = useState(0);
  const addStars = useCallback((n) => setStars((s) => s + n), []);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  // 介面語言:換語言只要讓最上層重畫一次,底下所有 t() 就會重新取值
  const [lang, setLangState] = useState(LANG);
  const switchLang = (l) => { setLang(l); setLangState(l); };
  // 目前選的科目分頁(記住上次選的)
  const [subject, setSubject] = useState(() => {
    try {
      const v = localStorage.getItem(SUBJECT_KEY);
      return SUBJECTS.some((s) => s.key === v) ? v : "abc";
    } catch { return "abc"; }
  });
  const selectSubject = (k) => {
    setSubject(k);
    try { localStorage.setItem(SUBJECT_KEY, k); } catch { /* ignore */ }
  };

  // 首頁預熱常用字的音檔,第一個遊戲一點就即時出聲
  useEffect(() => {
    const warm = ["the", "a", "cat", "dog", "apple", "ball", "red", "one"];
    const t = setTimeout(() => speak.prefetchMany?.(warm), 800);
    return () => clearTimeout(t);
  }, [speak]);

  // 清空所有學習紀錄(星星 + 三個遊戲的關卡/完成進度)
  const clearRecords = () => {
    try {
      localStorage.removeItem(SIGHT_KEY);
      localStorage.removeItem(MATCH_KEY);
      localStorage.removeItem(TRACE_KEY);
      localStorage.removeItem(BOPO_TRACE_KEY);
      localStorage.removeItem(ZH_SIGHT_KEY);
      localStorage.removeItem(NUM_TRACE_KEY);
      localStorage.removeItem(SCHOOL_KEY);
    } catch { /* 清不掉就算了 */ }
    setStars(0);
    setConfirmClear(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div
      style={{
        minHeight: "100dvh", background: T.bg,
        fontFamily:
          "'Fredoka', 'Baloo 2', 'PingFang TC', 'Noto Sans TC', ui-rounded, system-ui, sans-serif",
        padding: "calc(20px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(40px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
      }}
    >
      <style>{`
@keyframes wp-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(1.05); } }
@keyframes wp-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
@keyframes wp-float { from { transform: translateY(0); } to { transform: translateY(-470px); } }
html { touch-action: manipulation; }
button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none; }
/* 全站關掉文字選取與 iOS 長按選單,避免寫字/點擊時整塊被反藍 */
body { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
canvas { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }`}</style>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setMode("home")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 26, fontWeight: 700,
              color: T.purple, display: "flex", alignItems: "center", gap: 8, padding: 0,
            }}
          >
            <span
              style={{
                background: T.purple, color: "#fff", borderRadius: 14,
                width: 42, height: 42, display: "grid", placeItems: "center",
                boxShadow: `0 4px 0 ${T.purpleDark}`, fontSize: 22,
              }}
            >
              🎈
            </span>
            WordPop
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                background: "#FFF", borderRadius: 999, padding: "7px 13px",
                fontWeight: 700, fontSize: 15, color: T.yellowDark,
                boxShadow: "0 3px 0 #E0DBF7",
              }}
            >
              ⭐ {stars}
            </span>
            {mode !== "home" && (
              <button
                onClick={() => setMode("home")}
                style={{
                  fontFamily: "inherit", fontWeight: 700, fontSize: 14,
                  background: "#E8E4FA", color: T.sub, border: "none",
                  borderRadius: 999, padding: "8px 14px", cursor: "pointer",
                }}
              >{t("← 返回")}</button>
            )}
          </div>
        </header>

        {mode === "home" && (
          <div style={{ textAlign: "center", paddingTop: 28 }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎈🔤</div>
            <h1 style={{ color: T.ink, fontSize: 30, margin: "0 0 6px" }}>{t("點一下,單字 POP 出聲音!")}</h1>
            <p style={{ color: T.sub, fontSize: 16, margin: "0 0 18px" }}>
              {t(SUBJECTS.find((s) => s.key === subject)?.sub || "")}
            </p>

            {/* 科目分頁:ABC / ㄅㄆㄇ / 數字 分開,不混在一起 */}
            <div style={{
              display: "grid", gridTemplateColumns: `repeat(${SUBJECTS.length}, 1fr)`,
              gap: 8, maxWidth: 420, margin: "0 auto 22px",
            }}>
              {SUBJECTS.map((s) => {
                const on = s.key === subject;
                return (
                  <button key={s.key} onClick={() => selectSubject(s.key)}
                    style={{
                      fontFamily: "inherit", fontWeight: 700, fontSize: 16,
                      padding: "12px 4px 10px", borderRadius: 18, cursor: "pointer",
                      border: "none",
                      background: on ? s.color : "#E8E4FA",
                      color: on ? "#fff" : T.sub,
                      boxShadow: on ? `0 4px 0 ${s.dark}` : "none",
                      transform: on ? "none" : "translateY(2px)",
                      transition: "all .15s",
                    }}>
                    <div style={{ fontSize: 22, lineHeight: 1.1 }}>{s.icon}</div>
                    {t(s.label)}
                  </button>
                );
              })}
            </div>

            <div style={{ maxWidth: 420, margin: "0 auto" }}>
              {MENU_GROUPS.filter((g) => g.subject === subject).map((group) => (
                <div key={group.label} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      textAlign: "left", color: T.sub, fontWeight: 700,
                      fontSize: 14, margin: "0 0 8px 4px",
                    }}
                  >
                    {t(group.label)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {group.items.map((g, gi) => (
                      <ChunkyButton
                        key={g.mode} color={g.color} dark={g.dark}
                        onClick={() => setMode(g.mode)}
                        style={{
                          fontSize: 17,
                          // 奇數顆時最後一顆撐滿整排
                          ...(group.items.length % 2 === 1 && gi === group.items.length - 1
                            ? { gridColumn: "1 / -1" }
                            : {}),
                        }}
                      >
                        {t(g.label)}
                      </ChunkyButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* 給爸媽的陪玩指南(可收合,不干擾小朋友)*/}
            <div style={{ maxWidth: 420, margin: "22px auto 0" }}>
              <button
                onClick={() => setShowGuide((s) => !s)}
                style={{
                  fontFamily: "inherit", fontWeight: 700, fontSize: 14,
                  background: showGuide ? T.purple : "#E8E4FA",
                  color: showGuide ? "#fff" : T.sub,
                  border: "none", borderRadius: 999, padding: "10px 18px",
                  cursor: "pointer", transition: "all .15s",
                }}
              >{tf("👨‍👩‍👧 給爸媽的陪玩指南 {0}", showGuide ? t("▲ 收起") : t("▼ 展開"))}</button>
              {showGuide && (
                <div
                  style={{
                    background: T.card, borderRadius: 20, padding: "16px 16px 8px",
                    marginTop: 12, boxShadow: "0 5px 0 #E0DBF7", textAlign: "left",
                  }}
                >
                  <p style={{ color: T.sub, fontSize: 13, margin: "0 0 12px" }}>{tf("每個遊戲的一句話陪玩訣竅。共同原則:孩子答錯時不糾正、 讓遊戲自己引導;多讓她「開口跟著唸」效果加倍 💜")}</p>
                  {SUBJECTS.map((sub) => (
                    <div key={sub.key}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: T.ink,
                        margin: "2px 0 8px", paddingBottom: 4, borderBottom: "2px solid #EFECFB" }}>
                        {sub.icon} {t(sub.label)}
                      </div>
                      {MENU_GROUPS.filter((g) => g.subject === sub.key).map((group) => (
                    <div key={group.label} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: T.purple, marginBottom: 6 }}>
                        {t(group.label)}
                      </div>
                      {group.items.map((g) => (
                        <div key={g.mode} style={{ margin: "0 0 8px 4px" }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>
                            {t(g.label)}
                          </span>
                          <div style={{ fontSize: 13, color: T.sub, lineHeight: 1.5 }}>
                            {t(g.tip)}
                          </div>
                        </div>
                      ))}
                    </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 18 }}>{tf("🎙️ 單字使用真人錄音(Wiktionary),查無音檔時自動改用合成語音")}</p>
            {/* 家長區:清空紀錄(二次確認,避免小朋友誤觸)*/}
            <div style={{ marginTop: 18 }}>
              {cleared ? (
                <p style={{ color: T.greenDark, fontSize: 14, fontWeight: 700 }}>{t("✅ 紀錄已清空,重新開始囉!")}</p>
              ) : confirmClear ? (
                <div>
                  <p style={{ color: T.ink, fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>{t("確定清空所有星星和關卡紀錄嗎?")}</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button
                      onClick={clearRecords}
                      style={{
                        fontFamily: "inherit", fontWeight: 700, fontSize: 14,
                        background: T.red, color: "#fff", border: "none",
                        borderRadius: 999, padding: "9px 18px", cursor: "pointer",
                        boxShadow: "0 3px 0 #C94F4E",
                      }}
                    >{t("確定清空")}</button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      style={{
                        fontFamily: "inherit", fontWeight: 700, fontSize: 14,
                        background: "#E8E4FA", color: T.sub, border: "none",
                        borderRadius: 999, padding: "9px 18px", cursor: "pointer",
                      }}
                    >{t("取消")}</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  style={{
                    fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                    background: "none", border: "none", color: "#B7B2D8",
                    cursor: "pointer", textDecoration: "underline",
                  }}
                >{tf("🧹 清空學習紀錄(家長)")}</button>
              )}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 6,
              justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#B7B2D8", fontWeight: 700 }}>🌐</span>
              {[["zh", "中文"], ["en", "English"]].map(([k, label]) => {
                const on = lang === k;
                return (
                  <button key={k} onClick={() => switchLang(k)}
                    style={{
                      fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                      padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                      border: `2px solid ${on ? T.purpleDark : "#E0DBF7"}`,
                      background: on ? T.purple : "#FFFFFF",
                      color: on ? "#fff" : T.sub, transition: "all .15s",
                    }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <p style={{ color: "#C9C4E8", fontSize: 12, marginTop: 12 }}>
              WordPop {APP_VERSION}{BUILD_DATE ? ` · ${BUILD_DATE}` : ""}
            </p>
          </div>
        )}

        {mode === "learn" && <LearnMode speak={speak} />}
        {mode === "phonics" && <PhonicsMode speak={speak} />}
        {mode === "quiz" && <QuizMode speak={speak} addStars={addStars} onExit={() => setMode("home")} />}
        {mode === "sight" && <SightMode speak={speak} addStars={addStars} />}
        {mode === "school" && <SchoolWordsMode speak={speak} addStars={addStars} />}
        {mode === "schoolsay" && <SchoolSayMode speak={speak} addStars={addStars} />}
        {mode === "sound" && <FirstSoundMode speak={speak} addStars={addStars} />}
        {mode === "sayit" && <SayItMode speak={speak} addStars={addStars} />}
        {mode === "write" && <WriteMode speak={speak} addStars={addStars} />}
        {mode === "match" && <MatchMode speak={speak} addStars={addStars} />}
        {mode === "spell" && <SpellMode speak={speak} addStars={addStars} />}
        {mode === "rhyme" && <RhymeMode speak={speak} addStars={addStars} />}
        {mode === "casematch" && <CaseMatchMode speak={speak} addStars={addStars} />}
        {mode === "listendo" && <ListenDoMode speak={speak} addStars={addStars} />}
        {mode === "yesno" && <YesNoMode speak={speak} addStars={addStars} />}
        {mode === "count" && <CountMode speak={speak} addStars={addStars} />}
        {mode === "colorgame" && <ColorGameMode speak={speak} addStars={addStars} />}
        {mode === "bubble" && <BubbleMode speak={speak} addStars={addStars} />}
        {mode === "story" && <StoryMode speak={speak} addStars={addStars} />}
        {mode === "sort" && <SortMode speak={speak} addStars={addStars} />}
        {mode === "endsound" && <EndSoundMode speak={speak} addStars={addStars} />}
        {mode === "hunt" && <LetterHuntMode speak={speak} addStars={addStars} />}
        {mode === "missing" && <MissingMode speak={speak} addStars={addStars} />}
        {mode === "opposite" && <OppositeMode speak={speak} addStars={addStars} />}
        {mode === "alphabet" && <AlphabetOrderMode speak={speak} addStars={addStars} />}
        {mode === "numorder" && <NumberOrderMode speak={speak} addStars={addStars} />}
        {mode === "add" && <AddMode speak={speak} addStars={addStars} />}
        {mode === "syllable" && <SyllableMode speak={speak} addStars={addStars} />}
        {mode === "middle" && <MiddleSoundMode speak={speak} addStars={addStars} />}
        {mode === "blend" && <BlendMode speak={speak} addStars={addStars} />}
        {mode === "upperlower" && <UpperLowerMode speak={speak} addStars={addStars} />}
        {mode === "preposition" && <PrepositionMode speak={speak} addStars={addStars} />}
        {mode === "sequence" && <SequenceMemoryMode speak={speak} addStars={addStars} />}
        {mode === "size" && <SizeOrderMode speak={speak} addStars={addStars} />}
        {mode === "bopoorder" && <BopoOrderMode speak={speak} addStars={addStars} />}
        {mode === "bopohunt" && <BopoHuntMode speak={speak} addStars={addStars} />}
        {mode === "bopomatch" && <BopoMatchMode speak={speak} addStars={addStars} />}
        {mode === "bopowrite" && <BopoWriteMode speak={speak} addStars={addStars} />}
        {mode === "bopolearn" && <BopoLearnMode speak={speak} />}
        {mode === "bopoblend" && <BopoBlendMode speak={speak} addStars={addStars} />}
        {mode === "bopotone" && <BopoToneMode speak={speak} addStars={addStars} />}
        {mode === "bopobubble" && <BopoBubbleMode speak={speak} addStars={addStars} />}
        {mode === "bopopairs" && <BopoPairsMode speak={speak} addStars={addStars} />}
        {mode === "boposay" && <BopoSayMode speak={speak} addStars={addStars} />}
        {mode === "zhquiz" && <ZhListenQuizMode speak={speak} addStars={addStars} />}
        {mode === "zhend" && <ZhEndSoundMode speak={speak} addStars={addStars} />}
        {mode === "zhrhyme" && <ZhRhymeMode speak={speak} addStars={addStars} />}
        {mode === "zhdo" && <ZhListenDoMode speak={speak} addStars={addStars} />}
        {mode === "zhyesno" && <ZhYesNoMode speak={speak} addStars={addStars} />}
        {mode === "zhcount" && <ZhCountMode speak={speak} addStars={addStars} />}
        {mode === "zhcolor" && <ZhColorMode speak={speak} addStars={addStars} />}
        {mode === "zhprep" && <ZhPrepMode speak={speak} addStars={addStars} />}
        {mode === "zhsyll" && <ZhSyllableMode speak={speak} addStars={addStars} />}
        {mode === "zhmedial" && <ZhMedialMode speak={speak} addStars={addStars} />}
        {mode === "zhfamily" && <ZhFamilyMode speak={speak} addStars={addStars} />}
        {mode === "zhspell" && <ZhSpellMode speak={speak} addStars={addStars} />}
        {mode === "zhfind" && <ZhFindMode speak={speak} addStars={addStars} />}
        {mode === "zhtype" && <ZhTypeMode speak={speak} addStars={addStars} />}
        {mode === "zhmissing" && <ZhMissingMode speak={speak} addStars={addStars} />}
        {mode === "zhopp" && <ZhOppositeMode speak={speak} addStars={addStars} />}
        {mode === "zhseq" && <ZhSequenceMode speak={speak} addStars={addStars} />}
        {mode === "zhsize" && <ZhSizeMode speak={speak} addStars={addStars} />}
        {mode === "zhstory" && <ZhStoryMode speak={speak} addStars={addStars} />}
        {mode === "zhsight" && <ZhSightMode speak={speak} addStars={addStars} />}
        {mode === "numlearn" && <NumLearnMode speak={speak} />}
        {mode === "numlisten" && <NumListenMode speak={speak} addStars={addStars} />}
        {mode === "numwrite" && <NumWriteMode speak={speak} addStars={addStars} />}
        {mode === "numcount" && <NumCountMode speak={speak} addStars={addStars} />}
        {mode === "numtap" && <NumTapMode speak={speak} addStars={addStars} />}
        {mode === "numdots" && <NumDotsMode speak={speak} addStars={addStars} />}
        {mode === "numbubble" && <NumBubbleMode speak={speak} addStars={addStars} />}
        {mode === "numpairs" && <NumPairsMode speak={speak} addStars={addStars} />}
        {mode === "nummore" && <NumMoreMode speak={speak} addStars={addStars} />}
        {mode === "numcompare" && <NumCompareMode speak={speak} addStars={addStars} />}
        {mode === "numsort" && <NumSortMode speak={speak} addStars={addStars} />}
        {mode === "numlong" && <NumLongMode speak={speak} addStars={addStars} />}
        {mode === "numheavy" && <NumHeavyMode speak={speak} addStars={addStars} />}
        {mode === "numsub" && <NumSubMode speak={speak} addStars={addStars} />}
        {mode === "numten" && <NumTenMode speak={speak} addStars={addStars} />}
        {mode === "numsplit" && <NumSplitMode speak={speak} addStars={addStars} />}
        {mode === "numequal" && <NumEqualMode speak={speak} addStars={addStars} />}
        {mode === "nummissing" && <NumMissingMode speak={speak} addStars={addStars} />}
        {mode === "numback" && <NumBackMode speak={speak} addStars={addStars} />}
        {mode === "numskip" && <NumSkipMode speak={speak} addStars={addStars} />}
        {mode === "numpattern" && <NumPatternMode speak={speak} addStars={addStars} />}
        {mode === "shapelearn" && <ShapeLearnMode speak={speak} />}
        {mode === "shapefind" && <ShapeFindMode speak={speak} addStars={addStars} />}
        {mode === "shapecount" && <ShapeCountMode speak={speak} addStars={addStars} />}
        {mode === "numclock" && <NumClockMode speak={speak} addStars={addStars} />}
        {mode === "numcoin" && <NumCoinMode speak={speak} addStars={addStars} />}
        {mode === "numordinal" && <NumOrdinalMode speak={speak} addStars={addStars} />}
        {mode === "numshare" && <NumShareMode speak={speak} addStars={addStars} />}
      </div>
    </div>
  );
}
