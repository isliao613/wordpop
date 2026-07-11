import { useState, useEffect, useRef, useCallback } from "react";

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
function useSpeech() {
  const voiceRef = useRef(null);
  const cacheRef = useRef({}); // word -> 音檔 URL 或 null(查過但沒有)
  const audioRef = useRef(null);

  useEffect(() => {
    const pick = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      voiceRef.current =
        vs.find((v) => v.lang === "en-US" && v.localService) ||
        vs.find((v) => v.lang.startsWith("en")) ||
        null;
    };
    pick();
    window.speechSynthesis?.addEventListener("voiceschanged", pick);
    return () =>
      window.speechSynthesis?.removeEventListener("voiceschanged", pick);
  }, []);

  const ttsSpeak = useCallback((text, { rate = 0.85, onEnd } = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    if (voiceRef.current) u.voice = voiceRef.current;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  }, []);

  // 查 Free Dictionary API 取得 Wiktionary 真人錄音
  const findHumanAudio = useCallback(async (word) => {
    const key = word.toLowerCase().trim();
    if (key in cacheRef.current) return cacheRef.current[key];
    let url = null;
    try {
      const res = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" +
          encodeURIComponent(key),
        { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined }
      );
      if (res.ok) {
        const data = await res.json();
        outer: for (const entry of Array.isArray(data) ? data : []) {
          for (const p of entry.phonetics || []) {
            if (p.audio) {
              // 優先美式發音
              if (p.audio.includes("-us.")) { url = p.audio; break outer; }
              if (!url) url = p.audio;
            }
          }
        }
      }
    } catch {
      url = null;
    }
    cacheRef.current[key] = url;
    return url;
  }, []);

  return useCallback(
    async (text, { rate = 0.85, onEnd } = {}) => {
      // 停掉正在播的
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
      }
      // 單一單字才查真人音檔;片語直接用合成
      const isSingleWord = /^[a-z]+$/i.test(text.trim());
      if (isSingleWord) {
        const url = await findHumanAudio(text);
        if (url) {
          try {
            const a = new Audio(url);
            audioRef.current = a;
            a.playbackRate = rate < 0.8 ? 0.85 : 1;
            if (onEnd) a.onended = onEnd;
            await a.play();
            return "human";
          } catch {
            /* 播放失敗 → 退回合成 */
          }
        }
      }
      ttsSpeak(text, { rate, onEnd });
      return "tts";
    },
    [findHumanAudio, ttsSpeak]
  );
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
      <span style={{ fontSize: 12, color: speaking ? T.purple : "#C9C4E8" }}>
        {speaking ? "🔊 播放中…" : "🔈 點我聽"}
      </span>
    </button>
  );
}

function LearnMode({ speak }) {
  const [cat, setCat] = useState(CATEGORIES[0]);
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
            {c}
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
  return (
    <div>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>
        共 {total} 個常見字節。點大按鈕聽字節發音,點小字聽例字 👂
      </p>
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
            {g}
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
    const t = setTimeout(playQ, 400);
    return () => clearTimeout(t);
  }, [q, playQ]);

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
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0" }}>
          完成挑戰!
        </h2>
        <p style={{ color: T.sub, fontSize: 16, margin: "4px 0 20px" }}>
          得分 <b style={{ color: T.purple }}>{score}</b>・最長連對{" "}
          <b style={{ color: T.pink }}>{best}</b>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={onExit}>
            回主選單
          </ChunkyButton>
          <ChunkyButton
            color={T.green}
            dark={T.greenDark}
            onClick={() => {
              setRound(1); setScore(0); setStreak(0); setBest(0);
              setUsed([]); setQ(makeQuestion([])); setPicked(null); setDone(false);
            }}
          >
            再玩一次
          </ChunkyButton>
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
        <span>第 {round} / {ROUNDS} 題</span>
        <span>
          🔥 連對 {streak}　<span style={{ color: T.purple }}>分數 {score}</span>
        </span>
      </div>

      <div
        style={{
          background: T.card, borderRadius: 24, padding: "26px 16px",
          textAlign: "center", marginBottom: 16, boxShadow: "0 6px 0 #E0DBF7",
        }}
      >
        <p style={{ color: T.sub, margin: "0 0 12px", fontSize: 15 }}>
          仔細聽,選出正確的單字 👂
        </p>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={playQ}
          style={{ color: T.ink, fontSize: 20 }}>
          🔊 再聽一次
        </ChunkyButton>
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

function loadSightProgress() {
  try {
    const o = JSON.parse(localStorage.getItem(SIGHT_KEY) || "{}");
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function SightMode({ speak, addStars }) {
  const [view, setView] = useState("map"); // map | learn | quiz | clear
  const [lv, setLv] = useState(0);
  const [progress, setProgress] = useState(loadSightProgress); // 關卡 -> 最佳星數
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
            try {
              localStorage.setItem(SIGHT_KEY, JSON.stringify(np));
            } catch { /* 寫入失敗就不保存 */ }
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
      setEncourage("沒關係!仔細聽,它等一下還會再出現 💪");
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
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 4px" }}>
          Sight words 是「看到就要唸得出來」的常見字。
        </p>
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>
          一關 5 個字,收集皇冠吧!👑 {crowns} / {SIGHT_LEVELS.length}
        </p>
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
        <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 16 }}>
          每一關都一定會過,答錯的字會再出現,答對就好 💜
        </p>
      </div>
    );
  }

  // ----- 過關畫面 -----
  if (view === "clear") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 60 }}>{gotStars >= 3 ? "👑" : "🎉"}</div>
        <h2 style={{ color: T.ink, fontSize: 28, margin: "8px 0 4px" }}>
          第 {lv + 1} 關完成!
        </h2>
        <div style={{ fontSize: 34 }}>{"⭐".repeat(gotStars)}</div>
        <p style={{ color: T.sub, fontSize: 15, margin: "6px 0 18px" }}>
          {gotStars >= 3
            ? "全部一次答對,拿到皇冠!"
            : "這 5 個字全部學會了,太厲害!"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={() => setView("map")}>
            回關卡地圖
          </ChunkyButton>
          {lv + 1 < SIGHT_LEVELS.length && (
            <ChunkyButton color={T.green} dark={T.greenDark} onClick={() => openLevel(lv + 1)}>
              下一關 →
            </ChunkyButton>
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
        <p style={{ color: T.ink, fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
          第 {lv + 1} 關的 5 個新朋友 👋
        </p>
        <p style={{ color: T.sub, fontSize: 14, margin: "0 0 14px" }}>
          每張卡都點一下聽聽看,全部聽過就可以開始挑戰!
        </p>
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
                <div style={{ fontSize: 12, marginTop: 6, color: ok ? T.greenDark : "#C9C4E8" }}>
                  {ok ? "✓ 聽過了" : "🔈 點我"}
                </div>
              </button>
            );
          })}
        </div>
        <ChunkyButton
          color={T.pink} dark="#D14B7D" onClick={startQuiz} disabled={!allHeard}
          style={{ width: "100%" }}
        >
          {allHeard ? "🎈 開始挑戰!" : `再聽 ${words.length - heard.size} 張卡就能挑戰`}
        </ChunkyButton>
        <button
          onClick={() => setView("map")}
          style={{
            marginTop: 12, fontFamily: "inherit", fontWeight: 700, fontSize: 14,
            background: "none", border: "none", color: T.sub, cursor: "pointer",
          }}
        >
          ← 回關卡地圖
        </button>
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
        <p style={{ color: T.sub, margin: "0 0 10px", fontSize: 15 }}>
          仔細聽,點出正確的字,氣球就會變星星!
        </p>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(target)}
          style={{ color: T.ink }}>
          🔊 再聽一次
        </ChunkyButton>
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
    const t = setTimeout(() => speak(q.ans.en), 400);
    return () => clearTimeout(t);
  }, [q, speak]);

  const pick = (L) => {
    if (picked) return;
    setPicked(L);
    const ok = L === q.ans.en[0].toUpperCase();
    if (ok) { setRight((r) => r + 1); addStars(1); speak(L + "! " + q.ans.en + "!", { rate: 0.9 }); }
    else speak(q.ans.en[0].toUpperCase() + "! " + q.ans.en, { rate: 0.8 });
    setTimeout(() => {
      if (round >= TOTAL) setDone(true);
      else { setRound((r) => r + 1); setQ(makeSoundQ()); setPicked(null); }
    }, 1600);
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 56 }}>{right >= 7 ? "🏆" : "🕵️"}</div>
        <h2 style={{ color: T.ink, fontSize: 26 }}>偵探破案 {right} / {TOTAL} 次!</h2>
        <ChunkyButton color={T.green} dark={T.greenDark} style={{ marginTop: 14 }}
          onClick={() => { setRound(1); setRight(0); setQ(makeSoundQ()); setPicked(null); setDone(false); }}>
          再玩一次
        </ChunkyButton>
      </div>
    );

  return (
    <div>
      <div style={{ color: T.sub, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
        第 {round} / {TOTAL} 題・這個字的「開頭字母」是哪一個?🕵️
      </div>
      <div style={{ background: T.card, borderRadius: 22, padding: "22px 16px",
        textAlign: "center", marginBottom: 14, boxShadow: "0 5px 0 #E0DBF7" }}>
        <div style={{ fontSize: 60 }}>{q.ans.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, margin: "6px 0 12px" }}>
          {picked ? q.ans.en : "_" + q.ans.en.slice(1)}
        </div>
        <ChunkyButton color={T.yellow} dark={T.yellowDark} onClick={() => speak(q.ans.en)}
          style={{ color: T.ink }}>
          🔊 再聽一次
        </ChunkyButton>
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
  const [heard, setHeard] = useState("");
  const [wins, setWins] = useState(0);
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const next = () => { setWord(pickWord()); setStatus("idle"); setHeard(""); };

  const listen = () => {
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      setStatus("listening");
      rec.onresult = (e) => {
        const alts = Array.from(e.results[0]).map((r) =>
          r.transcript.toLowerCase().trim()
        );
        setHeard(alts[0] || "");
        const t = word.en.toLowerCase();
        const ok = alts.some((a) => a === t || a.includes(t) || t.includes(a));
        if (ok) {
          setStatus("correct"); setWins((n) => n + 1);
          addStars(2); speak("Great job!", { rate: 1 });
        } else setStatus("tryagain");
      };
      rec.onerror = () => setStatus("tryagain");
      rec.onend = () =>
        setStatus((s) => (s === "listening" ? "tryagain" : s));
      rec.start();
    } catch {
      setStatus("tryagain");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>
        大聲唸出這個字,唸對得 ⭐⭐!已成功 {wins} 次
      </p>
      <div style={{ background: T.card, borderRadius: 24, padding: "26px 16px",
        boxShadow: "0 6px 0 #E0DBF7", marginBottom: 14 }}>
        <div style={{ fontSize: 64 }}>{word.emoji}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: T.ink }}>{word.en}</div>
        <div style={{ fontSize: 15, color: T.sub, marginBottom: 14 }}>{word.zh}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <ChunkyButton color={T.yellow} dark={T.yellowDark}
            onClick={() => speak(word.en)} style={{ color: T.ink }}>
            🔊 先聽一次
          </ChunkyButton>
          {SR ? (
            <ChunkyButton
              color={status === "listening" ? T.red : T.pink}
              dark={status === "listening" ? "#C94F4E" : "#D14B7D"}
              onClick={listen} disabled={status === "listening"}>
              {status === "listening" ? "🎤 聽你說…" : "🎤 換我唸!"}
            </ChunkyButton>
          ) : (
            <ChunkyButton color={T.green} dark={T.greenDark}
              onClick={() => { setStatus("correct"); setWins((n) => n + 1); addStars(1); }}>
              👍 我唸對了(家長按)
            </ChunkyButton>
          )}
        </div>
        {status === "correct" && (
          <div style={{ marginTop: 14, fontSize: 20, color: T.greenDark, fontWeight: 700 }}>
            🎉 Great job! +2 ⭐
          </div>
        )}
        {status === "tryagain" && (
          <div style={{ marginTop: 14, fontSize: 15, color: T.sub }}>
            {heard ? `我聽到「${heard}」,` : ""}再試一次,先聽範例再慢慢唸 💪
          </div>
        )}
      </div>
      <ChunkyButton color={T.purple} dark={T.purpleDark} onClick={next}>
        下一個字 →
      </ChunkyButton>
      {!SR && (
        <p style={{ color: "#B7B2D8", fontSize: 12, marginTop: 14 }}>
          此瀏覽器不支援語音辨識,改由家長確認模式(建議用 Chrome)
        </p>
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

function TraceCanvas({ char, strokeColor, onProgress, onComplete }) {
  const guideRef = useRef(null);
  const drawRef = useRef(null);
  const pointsRef = useRef([]); // 引導字母的取樣點
  const drawingRef = useRef(false);
  const doneRef = useRef(false);
  const rafRef = useRef(0);

  const pxStrokes = useCallback(() => {
    const strokes = LETTER_STROKES[char];
    return strokes ? strokes.map((s) => s.map(toPx)) : null;
  }, [char]);

  // 畫引導:淡色粗筆身(withDecor 再加虛線中心線、筆順編號、方向箭頭)
  const paintGuide = useCallback(
    (withDecor) => {
      const g = guideRef.current.getContext("2d");
      g.clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
      const strokes = pxStrokes();
      if (!strokes) {
        // 沒有筆畫資料的字元退回字型描邊
        g.font = `700 ${TRACE_SIZE * 0.72}px 'Fredoka', 'Comic Sans MS', ui-rounded, sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#E6E0FB";
        g.fillText(char, TRACE_SIZE / 2, TRACE_SIZE * 0.55);
        return;
      }
      g.lineCap = "round";
      g.lineJoin = "round";
      g.lineWidth = 46;
      g.strokeStyle = "#E6E0FB";
      g.setLineDash([]);
      for (const s of strokes) {
        g.beginPath();
        g.moveTo(s[0][0], s[0][1]);
        for (const [x, y] of s) g.lineTo(x, y);
        g.stroke();
      }
      if (!withDecor) return;
      // 虛線中心線
      g.lineWidth = 4;
      g.strokeStyle = "#B9AFF0";
      g.setLineDash([11, 9]);
      for (const s of strokes) {
        g.beginPath();
        g.moveTo(s[0][0], s[0][1]);
        for (const [x, y] of s) g.lineTo(x, y);
        g.stroke();
      }
      g.setLineDash([]);
      // 每一筆:方向箭頭 + 筆順編號圓點
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
        // 編號放在起點沿反方向外推處,跟前面的編號重疊就往旁邊挪
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
    },
    [char, pxStrokes]
  );

  // 筆順示範:小鉛筆照 1→2→3 順序畫一次給小朋友看
  const playDemo = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const strokes = pxStrokes();
    if (!strokes) return;
    const lens = strokes.map(polylineLength);
    const total = lens.reduce((a, b) => a + b, 0);
    const SPEED = 0.28; // px/ms
    let t0 = null;
    const g = guideRef.current.getContext("2d");
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const drawn = Math.min((ts - t0) * SPEED, total);
      paintGuide(true);
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
          if (acc + d <= seg) {
            g.lineTo(s[k][0], s[k][1]);
            acc += d;
          } else {
            const p = walkPolyline(s, seg);
            g.lineTo(p.x, p.y);
            tip = p;
            break;
          }
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
      if (drawn < total) rafRef.current = requestAnimationFrame(step);
      else setTimeout(() => paintGuide(true), 600);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [pxStrokes, paintGuide, strokeColor]);

  // 換字母:重畫引導、取樣覆蓋率基準點、清空筆跡
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    doneRef.current = false;
    paintGuide(false); // 先只畫筆身取樣,編號和箭頭才不會被算進覆蓋率
    const g = guideRef.current.getContext("2d");
    const img = g.getImageData(0, 0, TRACE_SIZE, TRACE_SIZE).data;
    const pts = [];
    const step = 10;
    for (let y = 0; y < TRACE_SIZE; y += step)
      for (let x = 0; x < TRACE_SIZE; x += step)
        if (img[(y * TRACE_SIZE + x) * 4 + 3] > 100) pts.push([x, y]);
    pointsRef.current = pts;
    paintGuide(true);

    const d = drawRef.current.getContext("2d");
    d.clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
    return () => cancelAnimationFrame(rafRef.current);
  }, [char, paintGuide]);

  const toCanvasXY = (e) => {
    const rect = drawRef.current.getBoundingClientRect();
    return [
      ((e.clientX - rect.left) * TRACE_SIZE) / rect.width,
      ((e.clientY - rect.top) * TRACE_SIZE) / rect.height,
    ];
  };

  const start = (e) => {
    drawingRef.current = true;
    drawRef.current.setPointerCapture(e.pointerId);
    const ctx = drawRef.current.getContext("2d");
    const [x, y] = toCanvasXY(e);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 34;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    // 點一下也留個圓點
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
  };

  const move = (e) => {
    if (!drawingRef.current) return;
    const ctx = drawRef.current.getContext("2d");
    const [x, y] = toCanvasXY(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    // 計算覆蓋率:引導點上有筆跡的比例
    const pts = pointsRef.current;
    if (!pts.length || doneRef.current) return;
    const img = drawRef.current
      .getContext("2d")
      .getImageData(0, 0, TRACE_SIZE, TRACE_SIZE).data;
    let hit = 0;
    for (const [x, y] of pts)
      if (img[(y * TRACE_SIZE + x) * 4 + 3] > 40) hit++;
    const ratio = hit / pts.length;
    if (ratio >= 0.55) {
      doneRef.current = true;
      onComplete();
    } else {
      onProgress(ratio);
    }
  };

  const clear = () => {
    doneRef.current = false;
    drawRef.current
      .getContext("2d")
      .clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
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
      <button
        onClick={playDemo}
        style={{
          position: "absolute", left: 10, bottom: 10,
          fontFamily: "inherit", fontWeight: 700, fontSize: 15,
          background: T.purple, color: "#fff", border: "none",
          borderRadius: 999, padding: "8px 14px", cursor: "pointer",
          boxShadow: `0 3px 0 ${T.purpleDark}`,
        }}
      >
        ✏️ 筆順示範
      </button>
      <button
        onClick={clear}
        style={{
          position: "absolute", right: 10, bottom: 10,
          fontFamily: "inherit", fontWeight: 700, fontSize: 15,
          background: "#E8E4FA", color: T.sub, border: "none",
          borderRadius: 999, padding: "8px 14px", cursor: "pointer",
        }}
      >
        🧽 擦掉
      </button>
    </div>
  );
}

const TRACE_COLORS = ["#6C5CE7", "#FF6B9D", "#4ECB71", "#F0932B", "#3FA7E0"];

function WriteMode({ speak, addStars }) {
  const [caseMode, setCaseMode] = useState("upper"); // upper | lower
  const [letter, setLetter] = useState("A");
  const [celebrate, setCelebrate] = useState(false);
  const [cheer, setCheer] = useState(""); // 描到一半的鼓勵語
  const [doneSet, setDoneSet] = useState(loadTraceDone);

  const displayChar = caseMode === "upper" ? letter : letter.toLowerCase();
  const doneKey = `${letter}-${caseMode}`;
  const example = exampleWordFor(letter);
  const color = TRACE_COLORS[LETTERS.indexOf(letter) % TRACE_COLORS.length];

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
    if (example) speak(`${letter}! ${letter} is for ${example.en}!`, { rate: 0.9 });
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

  const onProgress = (ratio) => {
    setCheer(
      ratio >= 0.3 ? "快完成了,繼續描!💪" : "很棒的開始,把字母描滿吧!🖍️"
    );
  };

  const nextLetter = () => {
    const idx = LETTERS.indexOf(letter);
    if (caseMode === "upper") selectLetter(letter, "lower");
    else selectLetter(LETTERS[(idx + 1) % LETTERS.length], "upper");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: T.sub, fontSize: 14, margin: "0 0 12px" }}>
        跟著 1、2、3 號碼和箭頭的方向描,描滿就成功!已完成{" "}
        <b style={{ color: T.purple }}>{doneSet.size}</b> / {LETTERS.length * 2}
      </p>

      {/* 大小寫切換 */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {[["upper", "大寫 ABC"], ["lower", "小寫 abc"]].map(([cm, label]) => (
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
        >
          🔊 {displayChar} 怎麼唸
        </ChunkyButton>
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
        onProgress={onProgress}
        onComplete={markDone}
      />

      {celebrate ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 22, color: T.greenDark, fontWeight: 700 }}>
            🎉 太棒了!{displayChar} 寫得真漂亮!+2 ⭐
          </div>
          <ChunkyButton
            color={T.green} dark={T.greenDark} onClick={nextLetter}
            style={{ marginTop: 10 }}
          >
            {caseMode === "upper" ? `接著寫小寫 ${letter.toLowerCase()} →` : "下一個字母 →"}
          </ChunkyButton>
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
export default function WordPop() {
  const speak = useSpeech();
  const [mode, setMode] = useState("home");
  const [stars, setStars] = useState(0);
  const addStars = useCallback((n) => setStars((s) => s + n), []);

  return (
    <div
      style={{
        minHeight: "100vh", background: T.bg,
        fontFamily:
          "'Fredoka', 'Baloo 2', 'PingFang TC', 'Noto Sans TC', ui-rounded, system-ui, sans-serif",
        padding: "20px 16px 40px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');`}</style>

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
              >
                ← 返回
              </button>
            )}
          </div>
        </header>

        {mode === "home" && (
          <div style={{ textAlign: "center", paddingTop: 28 }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎈🔤</div>
            <h1 style={{ color: T.ink, fontSize: 30, margin: "0 0 6px" }}>
              點一下,單字 POP 出聲音!
            </h1>
            <p style={{ color: T.sub, fontSize: 16, margin: "0 0 28px" }}>
              先在學習模式聽熟,再到挑戰模式測驗聽力
            </p>
            <div
              style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                maxWidth: 420, margin: "0 auto",
              }}
            >
              <ChunkyButton color={T.purple} dark={T.purpleDark}
                onClick={() => setMode("learn")} style={{ fontSize: 17 }}>
                📚 學習單字
              </ChunkyButton>
              <ChunkyButton color={T.green} dark={T.greenDark}
                onClick={() => setMode("phonics")} style={{ fontSize: 17 }}>
                🔤 發音練習
              </ChunkyButton>
              <ChunkyButton color={T.pink} dark="#D14B7D"
                onClick={() => setMode("quiz")} style={{ fontSize: 17 }}>
                🎯 聽力挑戰
              </ChunkyButton>
              <ChunkyButton color="#3FA7E0" dark="#2B7BAB"
                onClick={() => setMode("sight")} style={{ fontSize: 17 }}>
                👀 認字快手
              </ChunkyButton>
              <ChunkyButton color="#9B59D0" dark="#7A3FAC"
                onClick={() => setMode("sound")} style={{ fontSize: 17 }}>
                🕵️ 首音偵探
              </ChunkyButton>
              <ChunkyButton color="#F0932B" dark="#C4731A"
                onClick={() => setMode("sayit")} style={{ fontSize: 17 }}>
                🎤 跟讀小勇士
              </ChunkyButton>
              <ChunkyButton color="#00B8A9" dark="#00897E"
                onClick={() => setMode("write")}
                style={{ fontSize: 17, gridColumn: "1 / -1" }}>
                ✍️ 手寫練習
              </ChunkyButton>
            </div>
            <p style={{ color: "#B7B2D8", fontSize: 13, marginTop: 30 }}>
              🎙️ 單字使用真人錄音(Wiktionary),查無音檔時自動改用合成語音
            </p>
          </div>
        )}

        {mode === "learn" && <LearnMode speak={speak} />}
        {mode === "phonics" && <PhonicsMode speak={speak} />}
        {mode === "quiz" && <QuizMode speak={speak} addStars={addStars} onExit={() => setMode("home")} />}
        {mode === "sight" && <SightMode speak={speak} addStars={addStars} />}
        {mode === "sound" && <FirstSoundMode speak={speak} addStars={addStars} />}
        {mode === "sayit" && <SayItMode speak={speak} addStars={addStars} />}
        {mode === "write" && <WriteMode speak={speak} addStars={addStars} />}
      </div>
    </div>
  );
}
