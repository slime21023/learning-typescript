---
date: 2025-04-29
tags: deno
order: 3
---

# 模組管理策略

## 概述

在 Deno 環境中，模組管理與 Node.js 生態系統有很大不同。

Deno 不使用中央化的包管理器（如 npm），而是採用直接從 URL 引入模組的方式。

這種設計簡化了依賴管理流程，但也需要開發者採用不同的策略來組織和維護專案依賴。

## 使用 URL 導入並指定確切版本號

Deno 使用 URL 導入模組，允許直接從網路或本地文件系統加載依賴。

```typescript
// 不推薦：未指定版本
import { serve } from "https://deno.land/std/http/server.ts";

// 推薦：指定確切版本號
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";

// 從 deno.land/x 導入第三方模組
import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

// 從其他 CDN 導入
import { nanoid } from "https://cdn.skypack.dev/nanoid@4.0.2";
```

**最佳實踐**

- 始終在 URL 中指定確切版本號
- 使用官方 CDN（如 deno.land/std、deno.land/x）獲取模組
- 考慮使用 Skypack、esm.sh 等 CDN 導入 npm 包
- 對於關鍵依賴，考慮在組織內部緩存或鏡像重要模組

**實用提示**

```typescript
// 導入 npm 包最佳方式
// esm.sh
import React from "https://esm.sh/react@18.2.0";

// 指定目標環境
import lodash from "https://esm.sh/lodash@4.17.21?target=deno";

// 使用 npm: 說明符 (Deno 1.28+)
import { z } from "npm:zod@3.21.4";
```

## 集中管理依賴於 deps.ts 文件

集中管理依賴是 Deno 專案的常見模式，通過創建一個中央 `deps.ts` 文件重新導出所有外部依賴。

```typescript
// deps.ts
export { assertEquals, assertExists } from "https://deno.land/std@0.180.0/testing/asserts.ts";
export { serve } from "https://deno.land/std@0.180.0/http/server.ts";
export type { Handler } from "https://deno.land/std@0.180.0/http/server.ts";
export { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
export { z } from "npm:zod@3.21.4";

// 在專案中使用
// main.ts
import { serve, z } from "./deps.ts";
```

**最佳實踐**

- 創建一個集中的 `deps.ts` 文件管理外部依賴
- 按功能或來源組織依賴並添加註釋
- 僅導出實際需要的模組和類型
- 考慮為不同類型的依賴創建專門的文件（如 `dev_deps.ts` 用於開發依賴）

**結構示例**

```typescript
// deps.ts - 生產依賴
export { serve } from "https://deno.land/std@0.180.0/http/server.ts";
export { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

// dev_deps.ts - 開發和測試依賴
export {
  assertEquals,
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.180.0/testing/asserts.ts";
export { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
```

## 利用 import maps 簡化導入路徑

Import maps 允許您簡化和標準化模組導入路徑，提高代碼可讀性和可維護性。

```json
// import_map.json
{
  "imports": {
    "std/": "https://deno.land/std@0.180.0/",
    "oak": "https://deno.land/x/oak@v12.5.0/mod.ts",
    "zod": "npm:zod@3.21.4",
    "react": "https://esm.sh/react@18.2.0",
    "$/": "./src/"
  }
}
```

```typescript
// 使用 import map (運行時需加上 --import-map=import_map.json)
import { serve } from "std/http/server.ts";
import { Application } from "oak";
import { z } from "zod";
import { UserService } from "$/services/user.ts";
```

**最佳實踐**

- 在專案根目錄創建 import map 文件
- 使用簡短別名代替長 URL
- 用 `$/` 等前綴表示專案內部模組
- 在 `deno.json` 中設置 import map 路徑

**配置與使用**

```json
// deno.json
{
  "importMap": "./import_map.json",
  "tasks": {
    "start": "deno run --allow-net src/main.ts",
    "test": "deno test --allow-net"
  }
}
```

```typescript
// 不需要指定 import map 路徑
// $ deno run src/main.ts
import { UserService } from "$/services/user.ts";
```

## 使用鎖定文件 (lock.json) 確保一致性

鎖定文件記錄了依賴的完整性雜湊，確保在不同環境中使用相同的依賴版本。

```bash
# 生成鎖定文件
$ deno cache --lock=deno.lock --lock-write src/main.ts

# 使用鎖定文件
$ deno run --lock=deno.lock src/main.ts
```

**最佳實踐**

- 為生產部署建立和使用鎖定文件
- 將鎖定文件加入版本控制
- 定期更新鎖定文件以獲取依賴更新
- 在 CI/CD 流程中驗證鎖定文件

**完整流程**

```bash
# 初始建立依賴和鎖定文件
$ deno cache --lock=deno.lock --lock-write src/deps.ts

# 更新依賴 (修改 deps.ts 後)
$ deno cache --reload --lock=deno.lock --lock-write src/deps.ts

# 在 CI 中使用鎖定文件
$ deno test --allow-net --lock=deno.lock
```

## 避免循環依賴

循環依賴會導致難以追蹤的問題和潛在的性能影響，應當盡量避免。

```typescript
// user.ts - 不良實踐
import { Post } from "./post.ts";

export class User {
  posts: Post[] = [];
}

// post.ts - 創建了循環依賴
import { User } from "./user.ts";

export class Post {
  author: User;
}
```

**最佳實踐**

- 設計清晰的單向依賴結構
- 使用介面打破循環依賴
- 將共享型別抽取到單獨文件
- 使用依賴注入模式

**優化示例**

```typescript
// types.ts - 共享類型
export interface IUser {
  id: string;
  name: string;
}

export interface IPost {
  id: string;
  title: string;
  authorId: string;
}

// user.ts
import { IUser, IPost } from "./types.ts";

export class User implements IUser {
  id: string;
  name: string;
  
  getPosts(posts: IPost[]): IPost[] {
    return posts.filter(post => post.authorId === this.id);
  }
}

// post.ts
import { IPost } from "./types.ts";

export class Post implements IPost {
  id: string;
  title: string;
  authorId: string;
}
```

## 遵循 ESM 模組規範

Deno 完全使用 ECMAScript 模組 (ESM) 系統，不支援 CommonJS 等其他模組格式。

```typescript
// 導出方式
// 單一導出
export default function main() { /* ... */ }

// 多個命名導出
export function helper1() { /* ... */ }
export function helper2() { /* ... */ }
export const CONFIG = { /* ... */ };

// 導入方式
// 導入默認導出
import main from "./main.ts";

// 導入命名導出
import { helper1, helper2 } from "./utils.ts";

// 導入所有導出並重命名
import * as utils from "./utils.ts";
```

**最佳實踐**

- 優先使用命名導出，提高代碼可讀性
- 為模組入口點創建 `mod.ts` 文件
- 使用桶文件 (barrel files) 簡化導入
- 避免動態變更導入路徑（除非必要）

**模組組織示例**

```typescript
// lib/mod.ts - 入口文件
export * from "./utils.ts";
export * from "./constants.ts";
export { default as Database } from "./db.ts";

// 使用者代碼
import { Database, formatDate, API_VERSION } from "./lib/mod.ts";
```

**進階提示**

1. **按需動態導入**：使用動態導入延遲加載大型依賴，提高應用啟動速度。

```typescript
// 只在需要時才載入重量級模組
async function generateReport() {
  const { default: pdfMaker } = await import("https://esm.sh/pdfkit@0.13.0");
  // 使用 pdfMaker
}
```

2. **緩存策略**：使用內建的 `--cached-only` 標誌在離線環境中工作。

```bash
# 預先緩存所有依賴
$ deno cache src/deps.ts

# 僅使用已緩存的模組運行
$ deno run --cached-only src/main.ts
```

3. **子路徑導出**：使用 import maps 實現更精細的子路徑導出。

```json
// import_map.json
{
  "imports": {
    "lodash/": "https://deno.land/x/lodash@4.17.21/",
    "lodash": "https://deno.land/x/lodash@4.17.21/mod.ts"
  }
}
```

```typescript
// 使用特定函數而非整個庫
import get from "lodash/get.ts";
```

4. **供應商目錄 (Vendoring)**：為關鍵依賴建立本地副本，增強離線和長期維護能力。

```bash
# 將依賴下載到本地 vendor 目錄
$ deno vendor src/deps.ts

# 使用 --no-remote 標誌確保僅使用本地文件
$ deno run --no-remote src/main.ts
```

5. **使用 deno.json 配置依賴解析**：配置 JSX 和 JSON 導入等高級選項。

```json
// deno.json
{
  "importMap": "./import_map.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "tasks": {
    "start": "deno run --allow-net src/main.ts"
  }
}
```

通過實施這些模組管理策略，您可以在 Deno 環境中建立更加可靠、可維護和高效的應用程式，同時充分利用 Deno 的安全性和簡潔性優勢。正確的模組管理不僅可以提高開發效率，還能確保專案在長期維護過程中的穩定性和一致性。