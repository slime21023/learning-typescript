---
date: 2025-05-04
tags: Patterns
order: 4
---

# 行為設計模式 (Behavioral Design Patterns)

行為設計模式專注於物件之間的互動和通訊方式，定義了物件如何協同工作以完成特定任務。

## 責任鏈模式 (Chain of Responsibility)

**核心概念**

允許請求沿著處理者鏈傳遞，直到有一個處理者處理它為止。

**適用場景**
- 當程式需要按特定順序處理不同種類的請求
- 當處理者的順序在執行時可能變化
- 當你不希望指定具體處理者，而是讓系統自動決定
- 實際應用：中間件系統、事件處理、異常處理

```typescript
abstract class Handler {
  protected next: Handler | null = null;
  
  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }
  
  handle(request: string): string | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class SpamHandler extends Handler {
  handle(request: string): string | null {
    if (request.includes('spam')) {
      return '垃圾郵件已過濾';
    }
    return super.handle(request);
  }
}

class AuthHandler extends Handler {
  handle(request: string): string | null {
    if (request.includes('auth')) {
      return '已處理認證';
    }
    return super.handle(request);
  }
}

// 使用
const spam = new SpamHandler();
const auth = new AuthHandler();
spam.setNext(auth);

console.log(spam.handle('含有spam的訊息')); // 垃圾郵件已過濾
console.log(spam.handle('需要auth的訊息')); // 已處理認證
```

## 命令模式 (Command)

**核心概念**

將請求封裝為物件，從而使你能參數化客戶端與不同請求、佇列或記錄請求，以及支援可撤銷操作。

**適用場景**
- 當你需要將操作參數化
- 當你需要將操作放入佇列中、執行或遠程執行
- 當你需要支持操作的撤銷/重做功能
- 實際應用：GUI按鈕事件、交易系統、巨集錄製、遊戲控制系統

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  private isOn = false;
  
  turnOn(): void {
    this.isOn = true;
    console.log('燈開啟');
  }
  
  turnOff(): void {
    this.isOn = false;
    console.log('燈關閉');
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}
  
  execute(): void {
    this.light.turnOn();
  }
  
  undo(): void {
    this.light.turnOff();
  }
}

// 使用
const light = new Light();
const lightOn = new LightOnCommand(light);

lightOn.execute(); // 燈開啟
lightOn.undo();    // 燈關閉
```

## 解釋器模式 (Interpreter)

**核心概念**
定義語言的文法，並建立解釋器來解釋語言中的句子。

**適用場景**
- 當你需要解釋一種簡單語言或DSL (領域特定語言)
- 當語法可以表示為語法樹
- 當效率不是關鍵考量因素
- 實際應用：SQL解析器、正則表達式引擎、數學表達式求值


```typescript
interface Expression {
  interpret(context: Map<string, boolean>): boolean;
}

class VariableExpression implements Expression {
  constructor(private name: string) {}
  
  interpret(context: Map<string, boolean>): boolean {
    return context.get(this.name) || false;
  }
}

class OrExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}
  
  interpret(context: Map<string, boolean>): boolean {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}

// 使用
const context = new Map<string, boolean>();
context.set('A', true);
context.set('B', false);

const a = new VariableExpression('A');
const b = new VariableExpression('B');
const aOrB = new OrExpression(a, b);

console.log(aOrB.interpret(context)); // true
```

## 迭代器模式 (Iterator)

**核心概念**

提供一種方法來依序存取集合中的元素，而不暴露其內部結構。

**適用場景**
- 當你需要遍歷不同數據結構而不暴露其內部細節
- 當你需要提供多種遍歷方式
- 當你需要為複雜數據結構提供統一的訪問接口
- 實際應用：集合類庫、資料庫查詢結果、分頁數據訪問

```typescript
interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
}

class ArrayIterator<T> implements Iterator<T> {
  private index = 0;
  
  constructor(private collection: T[]) {}
  
  next(): T | null {
    return this.hasNext() ? this.collection[this.index++] : null;
  }
  
  hasNext(): boolean {
    return this.index < this.collection.length;
  }
}

// 使用
const iterator = new ArrayIterator(['A', 'B', 'C']);

while (iterator.hasNext()) {
  console.log(iterator.next());
}
// 輸出: A, B, C
```

## 中介者模式 (Mediator)

**核心概念**

定義一個對象來封裝一組對象之間的交互方式，使這些對象不必直接相互引用。

**適用場景**
- 當對象之間的通信複雜且難以理解
- 當你想要減少組件之間的直接依賴關係
- 當你想要重用組件但又不想處理其依賴關係
- 實際應用：UI控制、航空交通管制系統、聊天室、協調服務

```typescript
interface Mediator {
  notify(sender: Component, event: string): void;
}

abstract class Component {
  constructor(protected mediator: Mediator) {}
  
  abstract send(event: string): void;
  abstract receive(event: string): void;
}

class Button extends Component {
  send(event: string): void {
    this.mediator.notify(this, event);
  }
  
  receive(event: string): void {
    console.log(`按鈕收到: ${event}`);
  }
}

class Dialog implements Mediator {
  private button: Button;
  
  setButton(button: Button): void {
    this.button = button;
  }
  
  notify(sender: Component, event: string): void {
    if (sender instanceof Button) {
      console.log(`對話框處理按鈕事件: ${event}`);
    }
  }
}

// 使用
const dialog = new Dialog();
const button = new Button(dialog);
dialog.setButton(button);

button.send('點擊'); // 對話框處理按鈕事件: 點擊
```

## 備忘錄模式 (Memento)

**核心概念**

在不破壞封裝的前提下，捕獲並儲存物件的內部狀態，以便之後可以恢復到這個狀態。

**適用場景**
- 當你需要創建對象狀態的快照以便稍後恢復
- 當直接訪問對象的狀態會破壞封裝性
- 當你需要實現撤銷/重做功能
- 實際應用：編輯器的撤銷功能、遊戲存檔、事務回滾

```typescript
class Memento {
  constructor(private state: string) {}
  
  getState(): string {
    return this.state;
  }
}

class Editor {
  private content = '';
  
  setContent(content: string): void {
    this.content = content;
  }
  
  getContent(): string {
    return this.content;
  }
  
  save(): Memento {
    return new Memento(this.content);
  }
  
  restore(memento: Memento): void {
    this.content = memento.getState();
  }
}

// 使用
const editor = new Editor();
editor.setContent('第一版');

// 保存狀態
const saved = editor.save();

editor.setContent('第二版');
console.log(editor.getContent()); // 第二版

// 恢復狀態
editor.restore(saved);
console.log(editor.getContent()); // 第一版
```

## 觀察者模式 (Observer)

**核心概念**

定義對象之間的一對多依賴關係，當一個對象改變狀態時，所有依賴它的對象都會自動收到通知。

**適用場景**
- 當一個對象的改變需要通知其他對象，但你不知道這些對象是誰
- 當系統需要在不同抽象層次的對象之間建立動態關係
- 當你需要實現發布-訂閱機制
- 實際應用：事件處理系統、UI更新、消息推送、數據綁定

```typescript
interface Observer {
  update(message: string): void;
}

class Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notify(message: string): void {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}
  
  update(message: string): void {
    console.log(`${this.name} 收到訊息: ${message}`);
  }
}

// 使用
const subject = new Subject();
const observer1 = new ConcreteObserver('觀察者1');
const observer2 = new ConcreteObserver('觀察者2');

subject.attach(observer1);
subject.attach(observer2);

subject.notify('有新消息');
// 輸出:
// 觀察者1 收到訊息: 有新消息
// 觀察者2 收到訊息: 有新消息
```

## 狀態模式 (State)

**核心概念**

允許對象在內部狀態改變時改變其行為，看起來就像改變了對象的類。

**適用場景**
- 當對象的行為取決於其狀態，且必須在運行時根據狀態改變行為
- 當有大量條件語句用於處理不同狀態的行為
- 當你想要避免大型的狀態條件語句
- 實際應用：工作流系統、訂單處理系統、遊戲角色狀態管理

```typescript
interface State {
  handle(context: Context): void;
}

class Context {
  private state: State;
  
  constructor(state: State) {
    this.state = state;
  }
  
  setState(state: State): void {
    this.state = state;
  }
  
  request(): void {
    this.state.handle(this);
  }
}

class ConcreteStateA implements State {
  handle(context: Context): void {
    console.log('處理狀態A的行為');
    context.setState(new ConcreteStateB());
  }
}

class ConcreteStateB implements State {
  handle(context: Context): void {
    console.log('處理狀態B的行為');
    context.setState(new ConcreteStateA());
  }
}

// 使用
const context = new Context(new ConcreteStateA());
context.request(); // 處理狀態A的行為
context.request(); // 處理狀態B的行為
```

## 策略模式 (Strategy)

**核心概念**

定義一系列算法，將每個算法封裝起來，並使它們可以互相替換。

**適用場景**
- 當你需要使用不同的算法變體並希望能在運行時切換
- 當你有許多類似的類，它們只在行為上有所不同
- 當你想要隔離算法的實現細節
- 實際應用：排序算法、驗證策略、支付處理、壓縮算法

```typescript
interface Strategy {
  execute(data: number[]): number;
}

class SumStrategy implements Strategy {
  execute(data: number[]): number {
    return data.reduce((sum, num) => sum + num, 0);
  }
}

class AverageStrategy implements Strategy {
  execute(data: number[]): number {
    const sum = data.reduce((sum, num) => sum + num, 0);
    return sum / data.length;
  }
}

class Context {
  constructor(private strategy: Strategy) {}
  
  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }
  
  executeStrategy(data: number[]): number {
    return this.strategy.execute(data);
  }
}

// 使用
const data = [1, 2, 3, 4, 5];
const context = new Context(new SumStrategy());

console.log(context.executeStrategy(data)); // 15

context.setStrategy(new AverageStrategy());
console.log(context.executeStrategy(data)); // 3
```

## 模板方法模式 (Template Method)

**核心概念**

在一個方法中定義算法的骨架，將一些步驟延遲到子類中實現。

**適用場景**
- 當你想讓客戶端只擴展算法的特定步驟，而不是整個算法
- 當你有幾個類包含幾乎相同的算法，但有一些細微差異
- 當你想控制子類擴展的方式
- 實際應用：框架開發、數據處理流程、報表生成、批處理作業

```typescript
abstract class AbstractClass {
  // 模板方法
  templateMethod(): void {
    this.baseOperation1();
    this.requiredOperation();
    this.baseOperation2();
    this.hook();
  }
  
  baseOperation1(): void {
    console.log('基本操作1');
  }
  
  baseOperation2(): void {
    console.log('基本操作2');
  }
  
  // 子類必須實現
  abstract requiredOperation(): void;
  
  // 鉤子方法，子類可選擇性覆寫
  hook(): void {}
}

class ConcreteClass extends AbstractClass {
  requiredOperation(): void {
    console.log('具體實現');
  }
  
  hook(): void {
    console.log('覆寫鉤子方法');
  }
}

// 使用
const concrete = new ConcreteClass();
concrete.templateMethod();
// 輸出:
// 基本操作1
// 具體實現
// 基本操作2
// 覆寫鉤子方法
```

## 訪問者模式 (Visitor)

**核心概念**

將算法與其操作的對象結構分離，使你可以在不修改對象結構的情況下定義新的操作。

**適用場景**
- 當你需要對一個複雜對象結構中的所有元素執行操作
- 當對象結構很少改變，但經常需要在其上定義新的操作
- 當你想避免"污染"元素類別的操作
- 實際應用：文檔對象模型處理、編譯器抽象語法樹、報表生成

```typescript
interface Visitor {
  visitElementA(element: ElementA): void;
  visitElementB(element: ElementB): void;
}

interface Element {
  accept(visitor: Visitor): void;
}

class ElementA implements Element {
  accept(visitor: Visitor): void {
    visitor.visitElementA(this);
  }
  
  operationA(): string {
    return 'ElementA';
  }
}

class ElementB implements Element {
  accept(visitor: Visitor): void {
    visitor.visitElementB(this);
  }
  
  operationB(): string {
    return 'ElementB';
  }
}

class ConcreteVisitor implements Visitor {
  visitElementA(element: ElementA): void {
    console.log(`訪問 ${element.operationA()}`);
  }
  
  visitElementB(element: ElementB): void {
    console.log(`訪問 ${element.operationB()}`);
  }
}

// 使用
const elements: Element[] = [
  new ElementA(),
  new ElementB()
];

const visitor = new ConcreteVisitor();

for (const element of elements) {
  element.accept(visitor);
}
// 輸出:
// 訪問 ElementA
// 訪問 ElementB
```

## 總結

行為設計模式幫助我們設計更靈活的物件互動方式，主要優點包括：

1. 降低物件之間的耦合度
2. 提高系統的可維護性和可擴展性
3. 使代碼更具靈活性和重用性

選擇合適的設計模式取決於你的具體需求和場景，理解每種模式的核心概念和適用場景將幫助你做出更好的設計決策。