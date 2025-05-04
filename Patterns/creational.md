---
date: 2025-05-04
tags: Patterns
order: 2
---

# 創建型設計模式 (Creational Patterns)

創建型設計模式專注於物件的創建機制，試圖以適合特定情況的方式創建物件。這些模式可以幫助我們在系統中創建物件時，增加靈活性並減少對具體類別的依賴。

## 單例模式 (Singleton)

**核心概念**

確保一個類別只有一個實例，並提供一個全局訪問點。

**適用場景**
- 當需要一個類別在整個應用程序中只有一個實例時
- 當需要嚴格控制全局變數時
- 當需要共享資源（如資料庫連接、文件管理器等）時

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;

  // 私有構造函數，防止外部直接創建實例
  private constructor() {
    this.connectionString = "mongodb://localhost:27017/myapp";
    console.log("資料庫連接已初始化");
  }

  // 提供全局訪問點
  public static getInstance(): DatabaseConnection {
    // 如果實例不存在，則創建一個
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public query(sql: string): void {
    console.log(`使用連接 ${this.connectionString} 執行查詢: ${sql}`);
  }
}

// 使用示例
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

// 驗證是否是同一個實例
console.log(db1 === db2); // 輸出: true

// 執行查詢
db1.query("SELECT * FROM users");
db2.query("SELECT * FROM products");
```

**優點**
- 確保只有一個實例，節省系統資源
- 提供全局訪問點，方便管理
- 延遲初始化，僅在需要時創建

**缺點**
- 可能隱藏類別之間的依賴關係
- 在多執行緒環境中需要特別處理
- 可能使測試變得困難

## 工廠方法模式 (Factory Method)

**核心概念**

定義一個創建物件的介面，但讓子類決定實例化哪個類。工廠方法允許類將實例化延遲到子類。

**適用場景**
- 當一個類無法預知它必須創建的物件的類別時
- 當一個類希望由其子類來指定所創建的物件時
- 當你希望將物件的創建與使用分離時

```typescript
// 產品介面
interface Product {
  operation(): string;
}

// 具體產品
class ConcreteProductA implements Product {
  public operation(): string {
    return "ConcreteProductA 的操作結果";
  }
}

class ConcreteProductB implements Product {
  public operation(): string {
    return "ConcreteProductB 的操作結果";
  }
}

// 創建者抽象類
abstract class Creator {
  // 工廠方法
  public abstract factoryMethod(): Product;

  // 使用工廠方法的操作
  public someOperation(): string {
    const product = this.factoryMethod();
    return `創建者: 與 ${product.operation()} 合作`;
  }
}

// 具體創建者
class ConcreteCreatorA extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProductA();
  }
}

class ConcreteCreatorB extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProductB();
  }
}

// 客戶端代碼
function clientCode(creator: Creator) {
  console.log(creator.someOperation());
}

// 使用示例
console.log("使用 ConcreteCreatorA:");
clientCode(new ConcreteCreatorA());

console.log("使用 ConcreteCreatorB:");
clientCode(new ConcreteCreatorB());
```

**優點**
- 避免創建者和具體產品之間的緊密耦合
- 符合單一職責原則
- 符合開放/封閉原則

**缺點**
- 可能導致代碼變得更複雜，因為需要引入許多新的子類

## 抽象工廠模式 (Abstract Factory)

**核心概念**

提供一個介面來創建一系列相關或相依的物件，而無需指定它們的具體類別。

**適用場景**
- 當系統需要獨立於它所創建的產品時
- 當系統需要由多個產品系列中的一個來配置時
- 當相關產品物件需要一起使用時

```typescript
// 抽象產品 A
interface AbstractProductA {
  usefulFunctionA(): string;
}

// 抽象產品 B
interface AbstractProductB {
  usefulFunctionB(): string;
  // 產品 B 可以與產品 A 協作
  anotherUsefulFunctionB(collaborator: AbstractProductA): string;
}

// 具體產品 A1
class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "產品 A1 的結果";
  }
}

// 具體產品 A2
class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "產品 A2 的結果";
  }
}

// 具體產品 B1
class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "產品 B1 的結果";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `產品 B1 與 (${result}) 協作的結果`;
  }
}

// 具體產品 B2
class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "產品 B2 的結果";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `產品 B2 與 (${result}) 協作的結果`;
  }
}

// 抽象工廠介面
interface AbstractFactory {
  createProductA(): AbstractProductA;
  createProductB(): AbstractProductB;
}

// 具體工廠 1 - 創建產品 A1 和 B1
class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}

// 具體工廠 2 - 創建產品 A2 和 B2
class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA2();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB2();
  }
}

// 客戶端代碼
function clientCode(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(productB.usefulFunctionB());
  console.log(productB.anotherUsefulFunctionB(productA));
}

// 使用示例
console.log("客戶端: 使用第一個工廠類型");
clientCode(new ConcreteFactory1());

console.log("客戶端: 使用第二個工廠類型");
clientCode(new ConcreteFactory2());
```

**優點**
- 確保創建的產品相互匹配
- 避免客戶端與具體產品類別的耦合
- 符合單一職責原則
- 符合開放/封閉原則

**缺點**
- 引入了許多新的介面和類，使代碼更加複雜
- 支援新種類產品變得困難

## 建造者模式 (Builder)

**核心概念**

將複雜物件的構建與其表示分離，使同樣的構建過程可以創建不同的表示。

**適用場景**
- 當創建複雜物件的算法應該獨立於該物件的組成部分和它們的裝配方式時
- 當構建過程必須允許被構建的物件有不同的表示時
- 當需要在某個時間點創建複雜物件時

```typescript
// 產品
class House {
  private parts: string[] = [];

  public addPart(part: string): void {
    this.parts.push(part);
  }

  public listParts(): void {
    console.log(`房屋部件: ${this.parts.join(', ')}`);
  }
}

// 建造者介面
interface Builder {
  reset(): void;
  buildWalls(): void;
  buildDoors(): void;
  buildWindows(): void;
  buildRoof(): void;
  buildGarage(): void;
  getResult(): House;
}

// 具體建造者
class HouseBuilder implements Builder {
  private house!: House;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.house = new House();
  }

  public buildWalls(): void {
    this.house.addPart("牆壁");
  }

  public buildDoors(): void {
    this.house.addPart("門");
  }

  public buildWindows(): void {
    this.house.addPart("窗戶");
  }

  public buildRoof(): void {
    this.house.addPart("屋頂");
  }

  public buildGarage(): void {
    this.house.addPart("車庫");
  }

  public getResult(): House {
    const result = this.house;
    this.reset();
    return result;
  }
}

// 指揮者
class Director {
  private builder!: Builder;

  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  // 建造基本房屋
  public buildMinimalViableHouse(): void {
    this.builder.buildWalls();
    this.builder.buildDoors();
    this.builder.buildWindows();
    this.builder.buildRoof();
  }

  // 建造完整房屋
  public buildFullFeaturedHouse(): void {
    this.builder.buildWalls();
    this.builder.buildDoors();
    this.builder.buildWindows();
    this.builder.buildRoof();
    this.builder.buildGarage();
  }
}

// 客戶端代碼
const director = new Director();
const builder = new HouseBuilder();
director.setBuilder(builder);

console.log("建造基本房屋:");
director.buildMinimalViableHouse();
const basicHouse = builder.getResult();
basicHouse.listParts();

console.log("建造完整房屋:");
director.buildFullFeaturedHouse();
const fullHouse = builder.getResult();
fullHouse.listParts();

// 建造者也可以不通過指揮者使用
console.log("自定義房屋:");
builder.buildWalls();
builder.buildRoof();
builder.buildDoors();
const customHouse = builder.getResult();
customHouse.listParts();
```

**優點**
- 可以分步驟創建物件，延遲步驟或遞迴運行步驟
- 可以重複使用相同的創建代碼來構建不同的物件表示
- 符合單一職責原則

**缺點**
- 需要創建多個新的類，代碼量增加
- 客戶端必須創建建造者和指揮者物件，增加了代碼複雜度

## 原型模式 (Prototype)

**核心概念**

通過複製現有物件來創建新物件，而不是通過實例化類別。

**適用場景**
- 當要創建的物件類型是在運行時決定的
- 當物件的創建、合成和表示應該與系統分離時
- 當物件的創建成本較高時

```typescript
// 原型介面
interface Prototype {
  clone(): Prototype;
}

// 具體原型
class ConcretePrototype implements Prototype {
  public primitive: any;
  public component!: object;
  public circularReference!: ComponentWithBackReference;

  public clone(): this {
    // 創建當前物件的淺拷貝
    const clone = Object.create(this);

    // 克隆複雜物件
    clone.component = Object.create(this.component);

    // 克隆具有反向引用的物件
    clone.circularReference = {
      ...this.circularReference,
      prototype: { ...this },
    };

    return clone;
  }
}

class ComponentWithBackReference {
  public prototype;

  constructor(prototype: ConcretePrototype) {
    this.prototype = prototype;
  }
}

// 客戶端代碼
const p1 = new ConcretePrototype();
p1.primitive = 245;
p1.component = new Date();
p1.circularReference = new ComponentWithBackReference(p1);

// 克隆 p1
const p2 = p1.clone();

// 檢查原始值是否相同
console.log(p1.primitive === p2.primitive); // true

// 檢查組件是否相同（淺拷貝）
console.log(p1.component === p2.component); // false

// 檢查循環引用是否正確處理
console.log(p1.circularReference === p2.circularReference); // false
console.log(p1.circularReference.prototype === p1); // true
console.log(p2.circularReference.prototype === p2); // true
```

**優點**
- 可以在運行時添加或刪除物件
- 通過複製現有原型來創建新物件，而不是實例化類別
- 減少子類別的數量
- 可以動態配置新物件

**缺點**
- 複製複雜物件或有循環引用的物件可能會很困難
- 深拷貝可能會很複雜

## 小結

| 模式 | 核心概念 |
|------|---------|
| **單例模式** (Singleton) | 確保一個類別只有一個實例 |
| **工廠方法** (Factory Method) | 定義創建物件的介面，讓子類決定實例化哪個類 | 
| **抽象工廠** (Abstract Factory) | 創建一系列相關或相依的物件 |
| **建造者** (Builder) | 分離複雜物件的構建與表示 | 
| **原型** (Prototype) | 通過複製現有物件創建新物件 |
