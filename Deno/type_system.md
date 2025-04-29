---
date: 2025-04-29
tags: deno
order: 2
---

# 型別系統運用

## 概述

TypeScript 的核心優勢在於其強大的型別系統，可以幫助開發者在編譯時捕獲錯誤，並提供更好的程式碼自動完成和文檔功能。

在 Deno 環境中，我們可以充分利用 TypeScript 的型別系統來提高程式碼品質和開發效率。

## 使用介面 (interface) 定義可重用結構

介面是 TypeScript 中描述對象結構的強大方式，尤其適合定義可重用的數據結構和 API 合約。

```typescript
// 定義基本用戶介面
interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

// 介面擴展
interface AdminUser extends User {
  permissions: string[];
  role: "admin";
}

// 介面實現
class UserService {
  async getUser(id: string): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${id}`);
    return await response.json();
  }
}
```

**最佳實踐**

- 使用介面定義領域模型和數據傳輸對象 (DTOs)
- 使用介面擴展建立型別層次結構
- 為 API 響應和請求定義明確的介面
- 利用介面定義服務契約

**實用提示**

介面可以合併宣告，這對擴展第三方庫的型別定義特別有用：

```typescript
// 擴展第三方庫介面
interface ExternalLibConfig {
  // 原有屬性...
}

// 添加自定義屬性
interface ExternalLibConfig {
  customOption: boolean;
}
```

## 利用型別別名 (type) 定義複雜型別

型別別名是定義複雜型別結構的強大工具，特別適合創建聯合型別和交叉型別。

```typescript
// 基本型別別名
type ID = string | number;

// 聯合型別
type Status = "pending" | "processing" | "completed" | "failed";

// 辨別聯合型別
type UserEvent = 
  | { type: "login"; userId: string; timestamp: Date }
  | { type: "logout"; userId: string; timestamp: Date }
  | { type: "purchase"; userId: string; productId: string; amount: number };

// 交叉型別
type AdminPermissions = { canManageUsers: boolean; canManageContent: boolean };
type EditorPermissions = { canEditContent: boolean; canPublish: boolean };
type SuperUser = AdminPermissions & EditorPermissions;
```

**最佳實踐**

- 使用聯合型別表示可能的多種型別
- 利用字面量型別創建自文檔化的 API
- 使用辨別聯合型別（標籤聯合）處理複雜狀態
- 用交叉型別組合多個型別定義

**示例用例**

```typescript
// 狀態管理中的應用
type AppState = {
  users: User[];
  selectedUserId: ID | null;
  status: Status;
  error: Error | null;
};

// 處理不同事件
function handleUserEvent(event: UserEvent) {
  switch (event.type) {
    case "login":
      console.log(`User ${event.userId} logged in at ${event.timestamp}`);
      break;
    case "logout":
      console.log(`User ${event.userId} logged out at ${event.timestamp}`);
      break;
    case "purchase":
      console.log(`User ${event.userId} purchased product ${event.productId} for ${event.amount}`);
      break;
  }
}
```

## 優先使用 `unknown` 而非 `any`

`unknown` 型別提供了型別安全的替代方案，避免了 `any` 的危險性。

```typescript
// 不安全的方式，使用 any
function processDataUnsafe(data: any) {
  return data.length; // 運行時可能出錯，編譯器不會警告
}

// 安全的方式，使用 unknown
function processDataSafe(data: unknown) {
  // 需要型別檢查或型別斷言
  if (Array.isArray(data) || typeof data === "string") {
    return data.length; // 安全 - 已驗證型別
  }
  throw new Error("Data must be an array or string");
}
```

**最佳實踐**

- 為外部 API 的響應使用 `unknown`
- 對 JSON 解析結果使用 `unknown`
- 實作型別守衛將 `unknown` 收窄為確定型別
- 避免使用 `any`，除非絕對必要（例如與舊有代碼整合）

**實用模式**

```typescript
// 安全處理 JSON 數據
async function fetchData(): Promise<unknown> {
  const response = await fetch("https://api.example.com/data");
  return await response.json(); // 返回 unknown 而非 any
}

// 使用型別斷言與驗證
interface ApiResponse {
  status: string;
  data: string[];
}

async function processApiResponse() {
  const data = await fetchData();
  
  // 驗證數據結構
  if (
    data && 
    typeof data === "object" &&
    "status" in data &&
    Array.isArray((data as any).data)
  ) {
    // 經過驗證後安全斷言
    const response = data as ApiResponse;
    return response.data.map(item => item.toUpperCase());
  }
  
  throw new Error("Invalid API response");
}
```

## 合理使用泛型增強程式碼重用性

泛型是 TypeScript 中實現靈活且型別安全的程式碼重用的關鍵特性。

```typescript
// 泛型函數
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json() as T;
}

// 泛型類別
class Collection<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return [...this.items];
  }
  
  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }
}
```

**最佳實踐**

- 使用泛型建立通用工具函數
- 在處理集合和資料結構時利用泛型
- 為泛型添加型別約束，限制可用型別
- 使用工廠函數簡化泛型用法

**進階應用**

```typescript
// 泛型型別約束
interface Identifiable {
  id: string | number;
}

function findById<T extends Identifiable>(
  collection: T[],
  id: string | number
): T | undefined {
  return collection.find(item => item.id === id);
}

// 泛型預設型別
function createState<T = {}>(initial: T) {
  let state = initial;
  
  return {
    get: () => state,
    set: (newState: T) => { state = newState; }
  };
}

// 使用泛型映射型別
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

## 利用內建工具型別

TypeScript 提供了許多有用的內建工具型別，可以幫助我們轉換和操作既有的型別定義。

**常用工具型別**

```typescript
// Partial - 所有屬性變為可選
interface User {
  id: string;
  name: string;
  email: string;
}

function updateUser(userId: string, updates: Partial<User>) {
  // 只需更新部分字段
}

// Readonly - 所有屬性變為唯讀
const config: Readonly<AppConfig> = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
// config.timeout = 3000; // 錯誤: 無法分配到唯讀屬性

// Pick - 選擇特定屬性
type UserCredentials = Pick<User, "email" | "password">;

// Omit - 排除特定屬性
type PublicUser = Omit<User, "password" | "securityQuestion">;

// Record - 創建鍵值映射
type UserRoles = Record<string, "admin" | "editor" | "viewer">;
```

**最佳實踐**

- 使用 `Partial<T>` 處理更新操作
- 用 `Readonly<T>` 防止意外修改
- 使用 `Pick<T, K>` 和 `Omit<T, K>` 創建衍生型別
- 利用 `Record<K, T>` 定義映射或字典型別
- 了解更多內建工具型別：`Required<T>`, `NonNullable<T>`, `Parameters<T>` 等

**實用組合**

```typescript
// 組合使用工具型別
type ReadonlyUser = Readonly<User>;
type OptionalReadonlyUser = Partial<ReadonlyUser>;

// 自定義工具型別
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// 使用 Parameters 和 ReturnType
function fetchData(url: string, method: "GET" | "POST"): Promise<unknown> {
  // 實現
  return Promise.resolve({});
}

type FetchParams = Parameters<typeof fetchData>;
type FetchReturn = ReturnType<typeof fetchData>;
```

## 顯式標註函數返回型別

明確標註函數的返回型別可以提高程式碼可讀性，並作為文檔和型別檢查的雙重保障。

```typescript
// 沒有返回型別標註
function findUser(id: string) {
  // 返回型別由實現推斷，可能隨實現變化
}

// 添加返回型別標註
function findUser(id: string): User | undefined {
  // 明確表明返回型別
  // 如果實現不符合，TypeScript 會報錯
}

// 異步函數
async function fetchUserData(id: string): Promise<UserData> {
  // 總是返回 Promise<UserData>
}

// 函數型別定義
type UserValidator = (user: User) => boolean;
```

**最佳實踐**

- 為公共 API 和複雜函數添加返回型別標註
- 使用聯合型別表示多種可能的返回值
- 在異步函數中使用 `Promise<T>` 明確返回型別
- 函數沒有返回值時使用 `void` 或 `never`

**特殊情況**

```typescript
// 永不返回的函數使用 never
function throwError(message: string): never {
  throw new Error(message);
}

// 函數重載提供更精確的型別
function process(input: string): string;
function process(input: number): number;
function process(input: string | number): string | number {
  if (typeof input === "string") {
    return input.toUpperCase();
  } else {
    return input * 2;
  }
}
```

## 善用型別守衛

型別守衛允許在運行時檢查型別，並讓 TypeScript 理解型別收窄的邏輯，從而提供更精確的型別檢查。

```typescript
// 使用 typeof 型別守衛
function process(value: string | number) {
  if (typeof value === "string") {
    // 此處 TypeScript 知道 value 是 string
    return value.toUpperCase();
  } else {
    // 此處 TypeScript 知道 value 是 number
    return value * 2;
  }
}

// 使用 instanceof 型別守衛
function handleError(error: Error | ApiError) {
  if (error instanceof ApiError) {
    // 此處 TypeScript 知道 error 是 ApiError
    console.log(error.statusCode);
  } else {
    // 此處 TypeScript 知道 error 是 Error
    console.log(error.message);
  }
}

// 自定義型別守衛
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

**最佳實踐**

- 使用 `typeof` 判斷基本型別
- 使用 `instanceof` 判斷類別實例
- 對陣列使用 `Array.isArray()`
- 實作自定義型別守衛函數使用 `is` 操作符
- 利用辨別屬性進行型別區分

**進階型別守衛**

```typescript
// 使用辨別屬性
type Action = 
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" };

function handleAction(action: Action) {
  switch (action.type) {
    case "INCREMENT":
      // TypeScript 知道有 amount 屬性
      return counter + action.amount;
    case "DECREMENT":
      // TypeScript 知道有 amount 屬性
      return counter - action.amount;
    case "RESET":
      // TypeScript 知道沒有 amount 屬性
      return 0;
  }
}

// 類型斷言守衛
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // 這裡 value 被視為 string 型別
  return value.toUpperCase();
}
```

## 進階提示

1. **條件型別與推斷**：使用 TypeScript 的條件型別和 `infer` 關鍵字創建靈活的型別轉換。

```typescript
// 從函數型別推斷參數型別
type FirstParameter<T extends (...args: any[]) => any> = 
  T extends (first: infer F, ...rest: any[]) => any ? F : never;

// 提取 Promise 中的型別
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

2. **品牌型別 (Branded Types)**：建立更嚴格的型別安全，避免型別混淆。

```typescript
// 創建品牌型別
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

// 建立轉換函數
function createUserId(id: string): UserId {
  return id as UserId;
}

// 使用品牌型別
function getUser(id: UserId) { /* ... */ }

const regularId = "123";
// getUser(regularId); // 錯誤: 型別不匹配
getUser(createUserId(regularId)); // 正確
```

3. **映射型別修飾符**：使用 `+`, `-`, `?`, `readonly` 修飾符創建更精確的衍生型別。

```typescript
// 移除唯讀屬性
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
};

// 移除可選性
type Required<T> = {
  [K in keyof T]-?: T[K]
};

// 自定義映射型別
type OptionalReadonly<T> = {
  readonly [K in keyof T]?: T[K]
};
```

通過掌握這些 TypeScript 型別系統的進階特性和技巧，您可以在 Deno 環境中建立更健壯、更可維護、自文檔化的應用程式，同時享受強大的型別檢查和編輯器支援。