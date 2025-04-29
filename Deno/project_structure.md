---

date: 2025-04-29
tags: deno
order: 4
---

# 專案結構設計

良好的專案結構是提高程式碼可維護性和可擴展性的關鍵。

在 Deno 環境中使用 TypeScript 時，合理的專案架構能夠顯著提升開發效率和程式碼品質。

## 按功能而非型別組織目錄

將相關功能的程式碼組織在同一目錄下，而不是按照檔案類型（如 models、controllers、services）進行分類。

```
// 不推薦的結構
project/
  ├── models/
  │   ├── user.ts
  │   └── product.ts
  ├── controllers/
  │   ├── userController.ts
  │   └── productController.ts
  └── services/
      ├── userService.ts
      └── productService.ts

// 推薦的結構
project/
  ├── users/
  │   ├── model.ts
  │   ├── controller.ts
  │   └── service.ts
  └── products/
      ├── model.ts
      ├── controller.ts
      └── service.ts
```


功能導向的目錄結構使相關程式碼保持在一起，減少跨目錄導航，並使功能模組更加獨立和自包含。

當需要修改某個功能時，所有相關檔案都在同一目錄下，便於維護和理解。

## 採用一致的命名規範

- 檔案名稱：使用 kebab-case（如 `user-profile.ts`）或 snake_case（如 `user_profile.ts`）
- 類別名稱：使用 PascalCase（如 `UserProfile`）
- 函數和變數：使用 camelCase（如 `getUserProfile`）
- 常數：使用全大寫 SNAKE_CASE（如 `MAX_RETRY_COUNT`）
- 介面：使用 PascalCase，不需要前綴 `I`（如 `UserData` 而非 `IUserData`）

```typescript
// constants.ts
export const MAX_RETRY_COUNT = 3;
export const DEFAULT_TIMEOUT_MS = 5000;

// user-profile.ts
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
}

export class UserProfileManager {
  private readonly cache = new Map<string, UserProfile>();
  
  async getUserProfile(userId: string): Promise<UserProfile> {
    // 實作邏輯
  }
}
```

一致的命名規範提高了程式碼的可讀性，使團隊成員能夠快速理解程式碼的結構和用途。

在 Deno 專案中，建議遵循官方風格指南並在團隊中達成共識。

## 將相關功能放在同一模組

將緊密相關的功能封裝在同一模組中，使用明確的公共 API 進行交互。

```typescript
// auth/mod.ts
import { createToken } from "./token.ts";
import { validateCredentials } from "./credentials.ts";
import { UserPermission } from "./permissions.ts";

export async function login(username: string, password: string): Promise<string> {
  const isValid = await validateCredentials(username, password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  return createToken(username);
}

export { UserPermission };
// 只導出需要公開的 API
```

這種方式創建了清晰的模組邊界，隱藏了實現細節，並提供了一個穩定的公共 API。模組內部可以自由重構，只要保持公共 API 不變，就不會影響其他部分的程式碼。

## 遵循單一職責原則

每個類別、函數和模組應該只有一個明確的責任或變更理由。

```typescript
// 不推薦：混合了多種職責
function processUserData(userData: unknown): void {
  // 驗證數據
  if (typeof userData !== "object" || userData === null) {
    throw new Error("Invalid user data");
  }
  
  // 儲存到資料庫
  const db = connectToDatabase();
  db.users.insert(userData);
  
  // 發送通知
  sendEmail("admin@example.com", "New user registered");
}

// 推薦：職責分離
function validateUserData(userData: unknown): asserts userData is UserData {
  if (typeof userData !== "object" || userData === null) {
    throw new Error("Invalid user data");
  }
  // 更多驗證邏輯
}

async function saveUserToDatabase(userData: UserData): Promise<string> {
  const db = await connectToDatabase();
  return db.users.insert(userData);
}

async function notifyAdminAboutNewUser(userId: string): Promise<void> {
  await sendEmail("admin@example.com", `New user registered: ${userId}`);
}

// 協調者函數
async function processUserData(userData: unknown): Promise<void> {
  validateUserData(userData);
  const userId = await saveUserToDatabase(userData);
  await notifyAdminAboutNewUser(userId);
}
```

單一職責原則使程式碼更容易測試、維護和理解。每個函數或類別專注於一個任務，降低了複雜性，提高了程式碼的可重用性。

## 保持適當的文件大小

避免過大的檔案，通常建議每個檔案不超過 300-500 行程式碼。

較小的檔案更容易理解和維護。當檔案變得過大時，這通常表明它可能承擔了過多的責任，應考慮將其拆分為多個更專注的模組。

## 使用索引文件匯出公共 API


在每個目錄中使用 `mod.ts` 或 `index.ts` 檔案作為公共 API 的統一入口點。


```typescript
// users/model.ts
export interface User {
  id: string;
  name: string;
}

// users/service.ts
import { User } from "./model.ts";

export async function findUser(id: string): Promise<User | null> {
  // 實作邏輯
}

// users/mod.ts
export { User } from "./model.ts";
export { findUser } from "./service.ts";
// 只導出需要公開的 API

// 在其他模組中使用
import { User, findUser } from "./users/mod.ts";
```


索引檔案提供了一個集中的地方來控制模組的公共 API，簡化了導入路徑，並允許在不影響外部程式碼的情況下重構內部實現。

## 實際專案結構範例

```
project/
  ├── deno.json                 # Deno 配置文件
  ├── deps.ts                   # 集中管理外部依賴
  ├── mod.ts                    # 主入口點
  ├── config/                   # 配置相關
  │   ├── mod.ts
  │   └── environment.ts
  ├── common/                   # 共用工具和類型
  │   ├── mod.ts
  │   ├── errors.ts
  │   └── utils.ts
  ├── auth/                     # 身份驗證模組
  │   ├── mod.ts
  │   ├── middleware.ts
  │   └── service.ts
  ├── users/                    # 用戶相關功能
  │   ├── mod.ts
  │   ├── model.ts
  │   ├── controller.ts
  │   ├── service.ts
  │   └── validation.ts
  ├── products/                 # 產品相關功能
  │   ├── mod.ts
  │   ├── model.ts
  │   ├── controller.ts
  │   ├── service.ts
  │   └── validation.ts
  ├── database/                 # 資料庫連接和操作
  │   ├── mod.ts
  │   ├── client.ts
  │   └── migrations/
  ├── middleware/               # 通用中間件
  │   ├── mod.ts
  │   ├── logging.ts
  │   └── error-handler.ts
  └── tests/                    # 測試文件
      ├── users/
      └── products/
```
