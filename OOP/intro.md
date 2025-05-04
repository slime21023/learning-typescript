---
date: 2025-05-03
tags: oop
order: 1
---

# 什麼是物件導向程式設計？

物件導向程式設計（OOP）是基於「物件」概念的程式設計範式，物件可以包含：
- **資料**：以欄位、屬性或特徵的形式存在
- **程式碼**：以方法或函式的形式存在

## OOP 的六大觀念

### Class（類別）  
   類別是建立物件的藍圖或模板。
   ```typescript
   class Task {
     private id: number;
     private title: string;
     private completed: boolean;

     constructor(id: number, title: string) {
       this.id = id;
       this.title = title;
       this.completed = false;
     }
   }
   ```

### Objects（物件）  
   物件是類別的實例。
   ```typescript
   const task1 = new Task(1, "完成報告");
   const task2 = new Task(2, "購買雜貨");
   ```

### Data Abstraction（資料抽象）  
   只關注重要特徵，隱藏複雜細節。
   ```typescript
   class Car {
     private engine: Engine; // 隱藏引擎細節
     
     public start() {
       // 使用者只需知道可以發動車子
       this.engine.start();
     }
   }
   ```

### Encapsulation（封裝）  
   將資料和方法包裝在一起，並限制外部存取。
   ```typescript
   class User {
     private password: string;

     // 只能透過方法存取密碼
     public authenticate(input: string): boolean {
       return input === this.password;
     }
   }
   ```

### Inheritance（繼承） 
   允許類別繼承其他類別的特性。
   ```typescript
   class Shape {
     protected x: number;
     protected y: number;
   }

   class Circle extends Shape {
     private radius: number;
   }
   ```

### Polymorphism（多型）  
   允許不同類別的物件對相同操作有不同的回應。
   ```typescript
   abstract class Shape {
     abstract calculateArea(): number;
   }

   class Rectangle extends Shape {
     calculateArea(): number {
       return this.width * this.height;
     }
   }

   class Circle extends Shape {
     calculateArea(): number {
       return Math.PI * this.radius ** 2;
     }
   }
   ```

### 實際範例

以下是一個完整的 Task 管理系統範例：

```typescript
class Task {
  private id: number;
  private title: string;
  private description: string;
  private dueDate: Date;
  private completed: boolean;

  constructor(taskInfo: {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
  }) {
    this.id = taskInfo.id;
    this.title = taskInfo.title;
    this.description = taskInfo.description;
    this.dueDate = taskInfo.dueDate;
    this.completed = false;
  }

  public complete() {
    this.completed = true;
  }

  public incomplete() {
    this.completed = false;
  }
}

// 使用範例
const task1 = new Task({
  id: 1,
  title: "完成報告",
  description: "準備季度報告",
  dueDate: new Date("2024-03-25"),
});

task1.complete(); // 標記任務完成
```

這個範例展示了：
- 類別定義（Task）
- 封裝（private 屬性）
- 建構子（constructor）
- 方法定義（complete/incomplete）
- 物件實例化和使用
