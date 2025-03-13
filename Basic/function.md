---
date: 2025-03-13
tags: basic
order: 2
---
# Function 

### Functions（函數）
- **為什麼重要**：函數是 TypeScript 的核心，明確的類型檢查能確保參數和返回值的正確性。
- **最佳實踐**：
  - 為每個參數和返回值指定具體的類型。
  - 如果函數沒有返回值，使用 `void`。
- **範例**：
  ```typescript
  function add(a: number, b: number): number {
    return a + b;
  }

  function logMessage(message: string): void {
    console.log(message);
  }
  ```
- **設計建議**：避免使用隱含的 `any` 類型，總是定義清楚的類型以提升程式碼安全性。

---

### Function Types（函數類型）
- **為什麼重要**：函數類型定義了函數的形狀（參數和返回值），特別適合用於變數或回調函數。
- **最佳實踐**：
  - 為函數變數明確指定類型。
  - 使用箭頭函數語法來定義函數類型。
- **範例**：
  ```typescript
  let myAdd: (x: number, y: number) => number;
  myAdd = (a, b) => a + b;
  ```
- **設計建議**：在需要傳遞函數作為參數時（例如回調函數），使用函數類型確保類型安全。

---

### Optional Parameters（可選參數）
- **為什麼重要**：可選參數讓函數更靈活，允許使用者不必傳入所有參數。
- **最佳實踐**：
  - 在參數名稱後加上 `?` 表示該參數為可選。
  - 可選參數必須放在必選參數之後。
- **範例**：
  ```typescript
  function greet(name: string, greeting?: string): string {
    return greeting ? `${greeting}, ${name}` : `Hello, ${name}`;
  }
  console.log(greet("Alice"));      // "Hello, Alice"
  console.log(greet("Bob", "Hi"));  // "Hi, Bob"
  ```
- **設計建議**：在函數內部檢查可選參數是否存在，以避免未定義的錯誤。

---

### Default Parameters（預設參數）
- **為什麼重要**：預設參數能在未傳入值時提供預設值，提升函數的易用性。
- **最佳實踐**：
  - 使用 `=` 在參數後指定預設值。
  - 預設參數可以與可選參數結合使用。
- **範例**：
  ```typescript
  function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}`;
  }
  console.log(greet("Alice"));      // "Hello, Alice"
  console.log(greet("Bob", "Hi"));  // "Hi, Bob"
  ```
- **設計建議**：比起可選參數，優先使用預設參數，因為它更直觀且減少條件檢查。

---

### Rest Parameters（剩餘參數）
- **為什麼重要**：剩餘參數允許函數接受任意數量的參數，非常適合處理可變數量的輸入。
- **最佳實踐**：
  - 使用 `...` 定義剩餘參數，其類型為陣列。
  - 剩餘參數必須是函數的最後一個參數。
- **範例**：
  ```typescript
  function sum(...numbers: number[]): number {
    return numbers.reduce((total, num) => total + num, 0);
  }
  console.log(sum(1, 2, 3));  // 6
  console.log(sum(4, 5));     // 9
  ```
- **設計建議**：當需要處理不確定數量的參數時使用，例如計算總和或記錄多個日誌。

---

### Function Overloadings（函數重載）
- **為什麼重要**：函數重載讓同一個函數名稱可以根據參數類型或數量執行不同的邏輯。
- **最佳實踐**：
  - 先定義所有重載簽名，再提供一個兼容所有簽名的實現。
  - 確保實現的參數和返回值能滿足所有重載情況。
- **範例**：
  ```typescript
  function reverse(str: string): string;
  function reverse(arr: number[]): number[];
  function reverse(input: string | number[]): string | number[] {
    if (typeof input === "string") {
      return input.split("").reverse().join("");
    } else {
      return input.slice().reverse();
    }
  }
  console.log(reverse("hello"));     // "olleh"
  console.log(reverse([1, 2, 3]));   // [3, 2, 1]
  ```
- **設計建議**：僅在必要時使用函數重載，否則優先考慮聯合類型或可選參數來簡化設計。

---

## **總結**
- **Functions**：為參數和返回值指定類型，避免隱含的 `any`。
- **Function Types**：明確定義函數形狀，特別在回調或高階函數中使用。
- **Optional Parameters**：使用 `?` 增加靈活性，注意放置順序。
- **Default Parameters**：使用 `=` 提供預設值，提升易用性。
- **Rest Parameters**：使用 `...` 處理不定數量的參數。
- **Function Overloadings**：適當使用重載處理複雜邏輯，但避免過度使用。

