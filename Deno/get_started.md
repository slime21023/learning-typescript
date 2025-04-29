---
date: 2025-04-29
tags: deno
order: 1
---

# Deno 與 TypeScript

## 概述

Deno 是一個現代的 JavaScript 和 TypeScript 執行時環境，由 Node.js 的原創者 Ryan Dahl 開發。

它原生支援 TypeScript，提供了安全、簡單且高效的開發體驗。

## 原生支援 TypeScript

Deno 最大的優勢之一是原生支援 TypeScript，無需額外的編譯步驟或配置文件。

```typescript
// hello.ts
const message: string = "Hello, Deno!";
console.log(message);

// 直接執行:
// $ deno run hello.ts
```

**最佳實踐**
- 直接使用 `.ts` 文件而非 `.js`
- 無需設置 `tsconfig.json` 即可開始項目
- 使用 Deno 自動處理類型檢查和編譯

**實用提示**

如需自定義 TypeScript 配置，可以在項目根目錄建立 `deno.json` 文件：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## 啟用嚴格模式

TypeScript 的嚴格模式可以幫助捕獲更多潛在錯誤，提高程式碼品質。

```typescript
// deno.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**最佳實踐**

- 從專案開始就啟用嚴格模式
- 對現有專案，可考慮逐步引入嚴格配置
- 不要為了方便而忽略型別檢查（避免使用 `// @ts-ignore` 註解）

**示例代碼**

```typescript
// 沒有嚴格模式：
function greet(name) {  // 參數隱式為 any 型別
  console.log("Hello, " + name);
}

// 啟用嚴格模式後：
function greet(name: string) {  // 必須明確型別
  console.log("Hello, " + name);
}
```

## 利用最新的 ECMAScript 特性

Deno 持續跟進最新的 JavaScript 標準，可以直接使用現代 ECMAScript 特性。

```typescript
// 使用頂層 await
const response = await fetch("https://api.example.com/data");
const data = await response.json();

// 使用新的數據結構
const uniqueValues = new Set([1, 2, 3, 3, 4, 4]);
console.log([...uniqueValues]);  // [1, 2, 3, 4]

// 使用可選鏈和空值合併運算符
const user = {
  profile: {
    // name 可能不存在
  }
};
const userName = user.profile?.name ?? "Anonymous";
```

**最佳實踐**

- 使用 async/await 代替回調和 Promise 鏈
- 利用可選鏈（?.）和空值合併（??）提高程式碼健壯性
- 使用解構賦值簡化程式碼
- 使用頂層 await 而不必包裝在 async 函數中

## 了解 Deno 與 Node.js 的差異

雖然 Deno 和 Node.js 都是 JavaScript 執行環境，但它們有顯著差異。

**主要差異**

| 特性 | Deno | Node.js |
|------|------|---------|
| TypeScript 支援 | 原生支援 | 需額外配置 |
| 安全模型 | 默認安全，需顯式權限 | 默認完全訪問 |
| 模組系統 | ES Modules，URL 導入 | CommonJS，npm |
| 包管理 | 無中央化包管理器 | npm/yarn/pnpm |
| 標準庫 | 豐富的內置標準庫 | 較小的核心模組 |

**最佳實踐**

- 使用 ES 模組語法 (`import`/`export`) 而非 CommonJS (`require`/`module.exports`)
- 通過 URL 導入模組，指定版本號
- 顯式聲明所需權限
- 熟悉 Deno 標準庫提供的功能

```typescript
// Node.js 風格 (不推薦):
const fs = require("fs");
const data = fs.readFileSync("file.txt");

// Deno 風格 (推薦):
import { readFile } from "https://deno.land/std@0.180.0/fs/mod.ts";
const data = await readFile("file.txt");

// 顯式請求權限
const data = await Deno.readFile("file.txt"); // 需使用 --allow-read 執行
```

## 使用 TypeScript 編譯選項優化性能

適當的 TypeScript 配置可以提高編譯速度和運行效率。

**常用編譯選項**

```json
// deno.json
{
  "compilerOptions": {
    "strict": true,
    "inlineSourceMap": false,
    "removeComments": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": false,
    "experimentalDecorators": true
  }
}
```

**最佳實踐**

- 對生產環境禁用源映射 (`inlineSourceMap: false`)
- 使用 `removeComments: true` 減小生產代碼體積
- 針對大型項目，考慮使用增量編譯
- 只在必要時啟用實驗性功能

**性能優化示例**

```typescript
// 預先聲明陣列長度，優化性能
const arr = new Array<number>(1000);

// 使用類型推斷避免冗餘類型註解
const cache = new Map(); // Map<unknown, unknown>
const typedCache = new Map<string, number>(); // 明確類型

// 避免過度使用類型斷言
const value = JSON.parse(data) as unknown; // 先斷言為 unknown
const config = value as Config; // 再斷言為具體類型
```

## 進階提示

1. **智能型別收窄**：結合使用型別守衛和辨別聯合類型，讓 TypeScript 編譯器理解你的型別檢查邏輯。

```typescript
type Admin = { role: "admin"; permissions: string[] };
type User = { role: "user"; projects: string[] };
type Member = Admin | User;

function isSuperAdmin(member: Member): member is Admin {
  return member.role === "admin" && 
         member.permissions.includes("superadmin");
}

function handleMember(member: Member) {
  if (member.role === "admin") {
    // TypeScript 知道這裡是 Admin 類型
    console.log(member.permissions);
  } else {
    // TypeScript 知道這裡是 User 類型
    console.log(member.projects);
  }
  
  // 使用自定義類型守衛
  if (isSuperAdmin(member)) {
    // 確定是有 superadmin 權限的管理員
  }
}
```

2. **JSDoc 與 TypeScript 集成**：如需維護與 JavaScript 的兼容性，可以使用 JSDoc 注釋提供類型信息。

```typescript
/**
 * 計算兩個數字的和
 * @param {number} a - 第一個數字
 * @param {number} b - 第二個數字
 * @returns {number} 兩數之和
 */
function add(a, b) {
  return a + b;
}

// 可以與 --allowJs 和 --checkJs 標誌一起使用
```

3. **動態導入**：對於較大的依賴，使用動態導入可以提高應用啟動性能。

```typescript
async function renderChart() {
  // 僅在需要時才載入圖表庫
  const { Chart } = await import("https://cdn.skypack.dev/chart.js");
  return new Chart(/*...*/);
}
```

通過掌握這些 Deno 與 TypeScript 的基礎知識和技巧，您可以充分利用這個現代運行時環境的優勢，編寫類型安全、高效且易於維護的程式碼。