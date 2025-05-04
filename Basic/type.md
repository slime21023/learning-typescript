---
date: 2025-03-13
tags: basic
order: 1
---
# Type

## 基本類型
**`number`**：數字（整數或浮點數）
  ```typescript
  let age: number = 25;
  ```
  
**`string`**：文字
  ```typescript
  let name: string = "Alice";
  ```
**`boolean`**：真假值
  ```typescript
  let isActive: boolean = true;
  ```

**設計建議**：為每個變數指定明確的類型，特別是在函數中使用時。

---

## 物件類型
物件是 JavaScript 的核心，TypeScript 讓你定義物件的結構：
```typescript
let person: { name: string; age: number } = {
  name: "Bob",
  age: 30,
};
```
**設計建議**：列出所有屬性與類型，避免意外存取不存在的屬性。

---

## 陣列類型
陣列用來儲存多個相同類型的元素：
```typescript
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];
```
**設計建議**：使用 `類型[]` 語法，確保陣列內容類型一致。

---

## 函數類型
函數的參數和返回值需要指定類型：
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```
- **無返回值**：用 `void`
  ```typescript
  function logMessage(message: string): void {
    console.log(message);
  }
  ```

**設計建議**：總是定義參數與返回值的類型，避免意外錯誤。

---

## 聯合類型（Union Types）
聯合類型讓變數可以是多種類型之一：
```typescript
let id: string | number = "123";
id = 123;  // 合法
```
**設計建議**：用 `|` 連接類型，並在函數中檢查類型：
```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```

---

## 字面量類型（Literal Types）
字面量類型限制變數只能是特定值：
```typescript
let direction: "up" | "down" = "up";
```
**設計建議**：用於固定選項，例如狀態或按鈕名稱。

---

## 類型別名（Type Aliases）
類型別名為複雜類型取一個簡單的名字：
```typescript
type User = { name: string; age: number };
let user: User = { name: "Alice", age: 25 };
```
**設計建議**：常用類型可定義為別名，提升程式碼可讀性。

---

## 處理 `null` 和 `undefined`
當變數可能為空時，使用聯合類型並檢查：
```typescript
let username: string | null = null;
if (username !== null) {
  console.log(username.toUpperCase());
}
```
**設計建議**：明確處理空值，避免運行時錯誤。

---

## Enum（列舉）
Enum 定義一組命名常量：
```typescript
enum Color {
  Red,
  Green,
  Blue
}

let myColor: Color = Color.Green;
```
**設計建議**：適合用於固定選項，提升程式碼可讀性。

---

## Tuple（元組）
Tuple 是固定長度和類型的陣列：
```typescript
let person: [string, number] = ["Alice", 25];
```
**設計建議**：用於結構化資料，例如座標或姓名與年齡的組合。

---

## 特殊類型
**`void`**：函數無返回值
  ```typescript
  function logMessage(): void {
    console.log("No return");
  }
  ```
**`never`**：函數永遠不正常結束
  ```typescript
  function throwError(): never {
    throw new Error("Error");
  }
  ```
**`unknown`**：未知類型，需檢查後使用
  ```typescript
  let data: unknown = "hello";
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
  ```

---

## 設計原則
- **避免使用 `any`**：`any` 關閉類型檢查，應盡量用具體類型。
- **從簡單開始**：先掌握基本類型，再學習進階類型。
- **利用類型推斷**：簡單情況下，TypeScript 會自動推斷類型：
  ```typescript
  let age = 25;  // 自動推斷為 number
  ```

---

## 初學者常見問題
- **Enum 和字面量類型有什麼不同？**
  - 字面量類型適合簡單的固定字串；Enum 適合需要命名的常量集合。
- **Tuple 和 Array 差在哪裡？**
  - Tuple 長度和類型固定；Array 長度可變，類型統一。
- **如何處理可能為 null 的變數？**
  - 用聯合類型並在操作前檢查是否為 null。

---

## **總結**
- **基本類型**：`number`、`string`、`boolean`、`object`、`array`。
- **進階類型**： Union、String Literal、Enum、Tuple。
- **特殊類型**：`void`、`never`、`unknown`。
- **設計建議**：類型明確、避免 `any`、處理空值、保持簡單。
