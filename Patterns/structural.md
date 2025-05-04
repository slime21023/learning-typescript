---
date: 2025-05-04
tags: Patterns
order: 3
---

# 結構型設計模式 (Structural Patterns)

結構型設計模式關注如何組合類別和物件以形成更大的結構，同時保持這些結構的靈活性和高效性。這些模式有助於確保當系統的一部分改變時，整個系統不需要改變。

## 適配器模式 (Adapter)

**核心概念**

將一個類別的介面轉換成客戶端期望的另一個介面，使原本不兼容的類別可以一起工作。

**適用場景**
- 當需要使用現有的類，但其介面與需求不匹配時
- 當需要創建一個可重用的類，該類可以與不相關的類合作
- 當需要使用多個現有子類，但不實際對每個子類進行子類化來添加功能時


```typescript
// 目標介面 - 客戶端期望的介面
interface Target {
  request(): string;
}

// 被適配者 - 現有的類別，有不兼容的介面
class Adaptee {
  public specificRequest(): string {
    return '特定請求';
  }
}

// 適配器 - 使被適配者的介面與目標介面兼容
class Adapter implements Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }

  public request(): string {
    return `適配器：(已轉換) ${this.adaptee.specificRequest()}`;
  }
}

// 使用示例
const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
console.log(adapter.request()); // 輸出: 適配器：(已轉換) 特定請求
```

**優點**
- 提高了類的重用性
- 增加了類的透明性
- 提供了類的轉換介面

**缺點**
- 有時會增加複雜性
- 過多適配器會使系統變得混亂

## 橋接模式 (Bridge)

**核心概念**

將抽象部分與其實現部分分離，使它們可以獨立變化。

**適用場景**
- 當你希望避免抽象和實現之間的永久綁定時
- 當抽象和實現都應該通過子類擴展時
- 當實現的變化不應該影響客戶端時

```typescript
// 實現部分的介面
interface Implementation {
  operationImplementation(): string;
}

// 具體實現 A
class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return '具體實現 A';
  }
}

// 具體實現 B
class ConcreteImplementationB implements Implementation {
  public operationImplementation(): string {
    return '具體實現 B';
  }
}

// 抽象部分
class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    return `抽象: ${this.implementation.operationImplementation()}`;
  }
}

// 使用示例
const implementation1 = new ConcreteImplementationA();
const abstraction1 = new Abstraction(implementation1);
console.log(abstraction1.operation()); // 輸出: 抽象: 具體實現 A

const implementation2 = new ConcreteImplementationB();
const abstraction2 = new Abstraction(implementation2);
console.log(abstraction2.operation()); // 輸出: 抽象: 具體實現 B
```

**優點**
- 分離介面及其實現
- 提高可擴展性
- 實現細節對客戶端透明

**缺點**
- 增加了系統的複雜度

## 組合模式 (Composite)

**核心概念**

將物件組合成樹狀結構以表示「部分-整體」的層次結構，使客戶端可以統一處理單個物件和物件組合。

**適用場景**
- 當你希望表示物件的部分-整體層次結構時
- 當你希望客戶端能夠忽略單個物件和組合物件的差異時
- 當你希望統一處理組合結構中的所有物件時

```typescript
// 組件介面 - 為所有具體組件定義通用行為
abstract class Component {
  protected parent: Component | null = null;

  public setParent(parent: Component | null): void {
    this.parent = parent;
  }

  public add(component: Component): void {}
  public remove(component: Component): void {}
  public isComposite(): boolean {
    return false;
  }

  public abstract operation(): string;
}

// 葉節點 - 表示組合中的葉對象（沒有子節點）
class Leaf extends Component {
  public operation(): string {
    return '葉節點';
  }
}

// 組合 - 表示有子組件的複雜組件
class Composite extends Component {
  protected children: Component[] = [];

  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: Component): void {
    const index = this.children.indexOf(component);
    this.children.splice(index, 1);
    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }

  public operation(): string {
    const results = this.children.map(child => child.operation());
    return `組合(${results.join('+')})`;
  }
}

// 使用示例
const leaf1 = new Leaf();
const leaf2 = new Leaf();
const composite = new Composite();
composite.add(leaf1);
composite.add(leaf2);

console.log(leaf1.operation()); // 輸出: 葉節點
console.log(composite.operation()); // 輸出: 組合(葉節點+葉節點)
```

**優點**
- 可以方便地構建複雜的樹狀結構
- 客戶端可以一致地處理單個物件和組合物件
- 符合開放/封閉原則

**缺點**
- 對於功能差異較大的類，很難設計通用介面
- 可能會使設計變得過於一般化

## 裝飾者模式 (Decorator)

**核心概念**

動態地給物件添加額外的職責，比子類更靈活。

**適用場景**
- 在不影響其他物件的情況下，以動態、透明的方式給單個物件添加職責
- 對於可撤銷的職責
- 當通過子類擴展對象功能不切實際時

```typescript
// 組件介面 - 定義可以動態添加職責的物件介面
interface Component {
  operation(): string;
}

// 具體組件 - 定義可以被裝飾的物件
class ConcreteComponent implements Component {
  public operation(): string {
    return '基本組件';
  }
}

// 裝飾者基類 - 維護一個指向組件對象的引用
abstract class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  public operation(): string {
    return this.component.operation();
  }
}

// 具體裝飾者 A
class ConcreteDecoratorA extends Decorator {
  public operation(): string {
    return `裝飾者A(${super.operation()})`;
  }
}

// 具體裝飾者 B
class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    return `裝飾者B(${super.operation()})`;
  }
}

// 使用示例
const simple = new ConcreteComponent();
const decoratorA = new ConcreteDecoratorA(simple);
const decoratorB = new ConcreteDecoratorB(decoratorA);

console.log(simple.operation()); // 輸出: 基本組件
console.log(decoratorA.operation()); // 輸出: 裝飾者A(基本組件)
console.log(decoratorB.operation()); // 輸出: 裝飾者B(裝飾者A(基本組件))
```

**優點**
- 比靜態繼承更靈活
- 避免在層次結構高層的類別有太多特徵
- 允許將職責動態組合
- 符合單一職責原則

**缺點**
- 裝飾層次過多時，除錯困難
- 可能導致系統中有大量小物件

## 外觀模式 (Facade)

**核心概念**
為子系統中的一組介面提供一個統一的高層介面，使子系統更容易使用。

**適用場景**
- 當需要為複雜子系統提供簡單介面時
- 當系統分層時，可以使用外觀模式定義子系統中每層的入口點
- 當希望將子系統與客戶端和其他子系統解耦時

```typescript
// 子系統類別1
class Subsystem1 {
  public operation1(): string {
    return '子系統1: 準備就緒!';
  }

  public operationN(): string {
    return '子系統1: 開始!';
  }
}

// 子系統類別2
class Subsystem2 {
  public operation1(): string {
    return '子系統2: 準備就緒!';
  }

  public operationZ(): string {
    return '子系統2: 開始!';
  }
}

// 外觀類別
class Facade {
  protected subsystem1: Subsystem1;
  protected subsystem2: Subsystem2;

  constructor() {
    this.subsystem1 = new Subsystem1();
    this.subsystem2 = new Subsystem2();
  }

  public operation(): string {
    let result = '外觀初始化子系統:\n';
    result += this.subsystem1.operation1() + '\n';
    result += this.subsystem2.operation1() + '\n';
    result += '外觀命令子系統執行操作:\n';
    result += this.subsystem1.operationN() + '\n';
    result += this.subsystem2.operationZ() + '\n';
    return result;
  }
}

// 使用示例
const facade = new Facade();
console.log(facade.operation());
```

**優點**
- 對客戶端隱藏子系統組件，減少客戶端需要處理的對象數量
- 鬆散耦合
- 提高了子系統的獨立性和可移植性

**缺點**
- 外觀可能成為與程序中所有類耦合的上帝對象
- 可能違反開放/封閉原則

## 享元模式 (Flyweight)

**核心概念**

通過共享技術有效地支持大量細粒度物件，減少記憶體使用。

**適用場景**
- 當應用需要使用大量相似對象時
- 當對象的大部分狀態都可以設為外部狀態時
- 當移除外部狀態後，可以用較少的共享對象取代許多組對象時

```typescript
// 享元介面
interface Flyweight {
  operation(extrinsicState: string): void;
}

// 具體享元類
class ConcreteFlyweight implements Flyweight {
  private intrinsicState: string;

  constructor(intrinsicState: string) {
    this.intrinsicState = intrinsicState;
  }

  public operation(extrinsicState: string): void {
    console.log(`享元: 內部狀態=${this.intrinsicState}, 外部狀態=${extrinsicState}`);
  }
}

// 享元工廠
class FlyweightFactory {
  private flyweights: {[key: string]: Flyweight} = {};

  public getFlyweight(intrinsicState: string): Flyweight {
    if (!(intrinsicState in this.flyweights)) {
      this.flyweights[intrinsicState] = new ConcreteFlyweight(intrinsicState);
    }
    return this.flyweights[intrinsicState];
  }

  public getFlyweightCount(): number {
    return Object.keys(this.flyweights).length;
  }
}

// 使用示例
const factory = new FlyweightFactory();

// 獲取享元對象並操作
const flyweight1 = factory.getFlyweight("共享狀態A");
flyweight1.operation("客戶端狀態1");

const flyweight2 = factory.getFlyweight("共享狀態A");
flyweight2.operation("客戶端狀態2");

const flyweight3 = factory.getFlyweight("共享狀態B");
flyweight3.operation("客戶端狀態3");

console.log(`享元對象數量: ${factory.getFlyweightCount()}`); // 輸出: 享元對象數量: 2
```

**優點**
- 大幅減少記憶體使用
- 提高性能
- 將內部狀態與外部狀態分離

**缺點**
- 增加了系統的複雜度
- 需要區分內部狀態和外部狀態

## 代理模式 (Proxy)

**核心概念**

為其他物件提供一種代理以控制對這個物件的訪問。

**適用場景**
- 遠程代理：為遠程對象提供本地代表
- 虛擬代理：延遲創建開銷大的對象
- 保護代理：控制對原始對象的訪問
- 智能引用：在訪問對象時執行額外操作

```typescript
// 主題介面
interface Subject {
  request(): void;
}

// 實際主題
class RealSubject implements Subject {
  public request(): void {
    console.log('RealSubject: 處理請求');
  }
}

// 代理
class Proxy implements Subject {
  private realSubject: RealSubject;

  constructor(realSubject: RealSubject) {
    this.realSubject = realSubject;
  }

  public request(): void {
    if (this.checkAccess()) {
      this.realSubject.request();
      this.logAccess();
    }
  }

  private checkAccess(): boolean {
    console.log('Proxy: 檢查訪問權限');
    return true;
  }

  private logAccess(): void {
    console.log('Proxy: 記錄訪問時間');
  }
}

// 使用示例
const realSubject = new RealSubject();
const proxy = new Proxy(realSubject);

proxy.request();
// 輸出:
// Proxy: 檢查訪問權限
// RealSubject: 處理請求
// Proxy: 記錄訪問時間
```

**優點**
- 控制對原始對象的訪問
- 可以在客戶端不知情的情況下添加功能
- 可以管理原始對象的生命週期
- 即使原始對象不可用時也可以工作

**缺點**
- 增加了系統的複雜度
- 可能導致請求處理速度變慢

## 小結

| 模式 | 核心概念 |
|------|---------|
| **適配器** (Adapter) | 將一個類別的介面轉換成客戶端期望的另一個介面 | 
| **橋接** (Bridge) | 將抽象部分與實現部分分離 |
| **組合** (Composite) | 將物件組合成樹狀結構表示部分-整體層次 |
| **裝飾者** (Decorator) | 動態給物件添加額外職責 |
| **外觀** (Facade) | 為子系統提供統一的高層介面 |
| **享元** (Flyweight) | 共享技術支持大量細粒度物件 |
| **代理** (Proxy) | 為其他物件提供代理控制訪問 |
