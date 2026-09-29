/* 版號與設計 tokens */
// 版號:每次更新往上跳(顯示在首頁底部,方便確認手機拿到最新版)
// 日期由 Vite 建置時自動戳上(見 vite.config.js 的 __BUILD_DATE__)
const APP_VERSION = "v1.41";
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

export { APP_VERSION, BUILD_DATE, T };
