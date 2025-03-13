---
date: 2025-03-13
tags: basic
order: 3
---
# Class

## Classes（類別）

### **最佳實踐**
- 使用類別來封裝資料和行為，提升程式的可讀性與可維護性。
- 避免將所有邏輯寫在一個類別中，應該根據責任分離原則進行拆分。
- 使用 TypeScript 提供的型別註解，確保類別的屬性和方法有明確的型別。

### **範例**
```typescript
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

const user = new User("Alice", 25);
console.log(user.greet());
```

---

## Access Modifiers（存取修飾詞）

### **最佳實踐**
- **`public`**（預設）：適用於需要被外部存取的屬性或方法。
- **`private`**：用於僅限於類別內部的屬性或方法，避免外部直接操作內部細節。
- **`protected`**：用於允許子類別存取，但不允許外部直接存取的屬性或方法。

### **範例**
```typescript
class Account {
  public accountName: string;
  private balance: number;

  constructor(accountName: string, initialBalance: number) {
    this.accountName = accountName;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    this.balance += amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

const account = new Account("Savings", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.balance = 2000; // 錯誤：無法存取 private 屬性
```

---

## Readonly Properties（唯讀屬性）

### **最佳實踐**
- 使用 `readonly` 關鍵字來保護屬性，讓它只能在初始化時被設定，避免意外修改。
- 適用於常數屬性或不應更改的資料。

### **範例**
```typescript
class Config {
  readonly version: string = "1.0.0";
  readonly createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}

const config = new Config();
console.log(config.version); // 1.0.0
// config.version = "2.0.0"; // 錯誤：無法修改 readonly 屬性
```

---

## Inheritances（繼承）

### **最佳實踐**
- 使用繼承來重用程式碼，但應避免過深的繼承層次，因為這會增加程式的複雜性。
- 如果子類別需要覆寫父類別的方法，應使用 `super` 關鍵字來呼叫父類別的對應方法。

### **範例**
```typescript
class Animal {
  constructor(public name: string) {}

  makeSound(): void {
    console.log(`${this.name} is making a sound.`);
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log(`${this.name} is barking.`);
  }
}

const dog = new Dog("Buddy");
dog.makeSound(); // Buddy is barking.
```

---

## Static Methods and Properties（靜態方法與屬性）

### **最佳實踐**
- 靜態方法與屬性屬於類別本身，而非實例，適合用於工具函式或共享的常數。
- 使用 `static` 關鍵字定義，直接透過類別名稱存取。

### **範例**
```typescript
class MathUtils {
  static readonly PI: number = 3.14159;

  static calculateCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.calculateCircleArea(5)); // 78.53975
```

---

## Abstract Classes（抽象類別）

### **最佳實踐**
- 抽象類別用於定義一個基底類別，提供通用的結構與部分實作。
- 包含抽象方法（`abstract`），由子類別實作具體邏輯。
- 不允許直接實例化抽象類別。

### **範例**
```typescript
abstract class Shape {
  abstract calculateArea(): number;

  describe(): string {
    return "This is a shape.";
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

const circle = new Circle(5);
console.log(circle.calculateArea()); // 78.53981633974483
console.log(circle.describe()); // This is a shape.
```

---

## **總結**
- **Classes** 提供了封裝與結構化的能力，是 TypeScript 的核心特性之一。
- **Access Modifiers** 幫助控制屬性與方法的存取範圍，提升程式的安全性與可維護性。
- **Readonly Properties** 確保資料的不可變性，適合用於常數或初始化後不應更改的屬性。
- **Inheritances** 提供了程式碼重用的能力，但應謹慎設計繼承結構。
- **Static Methods and Properties** 適合用於工具類別或共享的常量。
- **Abstract Classes** 是設計模式中強大的工具，用於定義通用結構與行為。
