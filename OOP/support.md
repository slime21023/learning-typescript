---
date: 2025-05-03
tags: oop
order: 3
---

# TypeScript 中的物件導向支援

TypeScript 作為 JavaScript 的超集，提供了豐富的物件導向程式設計 (OOP) 功能，讓開發者能夠使用類別、介面、繼承等概念來建構更加結構化和可維護的程式碼。以下是 TypeScript 中支援物件導向的主要語法和設計特性。

## 基礎類別語法

### 類別宣告

```typescript
class Person {
  // 屬性宣告
  name: string;
  age: number;
  
  // 建構函式
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // 方法
  greet(): string {
    return `Hello, my name is ${this.name} and I'm ${this.age} years old.`;
  }
}

// 建立實例
const person = new Person("Alice", 30);
console.log(person.greet()); // Hello, my name is Alice and I'm 30 years old.
```

### 存取修飾詞

TypeScript 提供三種存取修飾詞來控制類別成員的可見性：

```typescript
class Employee {
  // 公開成員 - 可從任何地方存取
  public name: string;
  
  // 受保護成員 - 只能從類別內部和子類別存取
  protected department: string;
  
  // 私有成員 - 只能從類別內部存取
  private salary: number;
  
  constructor(name: string, department: string, salary: number) {
    this.name = name;
    this.department = department;
    this.salary = salary;
  }
  
  // 公開方法
  public getDetails(): string {
    return `${this.name} works in ${this.department}`;
  }
  
  // 受保護方法
  protected calculateBonus(): number {
    return this.salary * 0.1;
  }
  
  // 私有方法
  private logSalaryChange(): void {
    console.log(`Salary updated for ${this.name}`);
  }
  
  // 公開方法可以呼叫私有方法
  public updateSalary(newSalary: number): void {
    this.salary = newSalary;
    this.logSalaryChange();
  }
}
```

### 屬性簡寫

TypeScript 提供了在建構函式中直接宣告和初始化類別屬性的簡寫方式：

```typescript
class User {
  // 使用存取修飾詞直接在建構函式參數中宣告屬性
  constructor(
    public username: string,
    private password: string,
    protected email: string
  ) {
    // 不需要額外的賦值語句，TypeScript 會自動處理
  }
  
  getProfile(): object {
    return {
      username: this.username,
      email: this.email
      // password 是私有的，不包含在公開資料中
    };
  }
}

const user = new User("john_doe", "secret123", "john@example.com");
console.log(user.username); // john_doe
// console.log(user.password); // 錯誤：'password' 是私有的
```

## 繼承與多型

### 類別繼承

```typescript
// 基底類別
class Animal {
  constructor(protected name: string) {}
  
  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance} meters.`);
  }
}

// 子類別
class Dog extends Animal {
  constructor(name: string, private breed: string) {
    // 呼叫父類別建構函式
    super(name);
  }
  
  // 覆寫父類別方法
  override move(distance: number = 5): void {
    console.log(`${this.name} the ${this.breed} runs...`);
    // 呼叫父類別方法
    super.move(distance);
  }
  
  // 子類別特有方法
  bark(): void {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.move(); // Rex the German Shepherd runs... Rex moved 5 meters.
dog.bark(); // Woof! Woof!
```

### 抽象類別

抽象類別不能被直接實例化，只能被繼承：

```typescript
abstract class Shape {
  constructor(protected color: string) {}
  
  // 抽象方法必須由子類別實作
  abstract calculateArea(): number;
  
  // 具體方法可以被繼承或覆寫
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }
  
  // 實作抽象方法
  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(color: string, private width: number, private height: number) {
    super(color);
  }
  
  calculateArea(): number {
    return this.width * this.height;
  }
}

// const shape = new Shape("red"); // 錯誤：無法建立抽象類別的實例
const circle = new Circle("blue", 5);
console.log(circle.calculateArea()); // 78.54...
console.log(circle.getColor()); // blue
```

## 介面與型別

### 介面定義

介面是 TypeScript 中定義物件結構的強大方式：

```typescript
interface Vehicle {
  make: string;
  model: string;
  year: number;
  
  // 方法簽名
  start(): void;
  stop(): void;
}

// 實作介面
class Car implements Vehicle {
  constructor(
    public make: string,
    public model: string,
    public year: number
  ) {}
  
  start(): void {
    console.log(`Starting ${this.make} ${this.model}...`);
  }
  
  stop(): void {
    console.log(`Stopping ${this.make} ${this.model}...`);
  }
  
  // 可以新增介面未定義的方法
  honk(): void {
    console.log("Beep beep!");
  }
}

const myCar: Vehicle = new Car("Toyota", "Corolla", 2020);
myCar.start(); // Starting Toyota Corolla...
// myCar.honk(); // 錯誤：'Vehicle' 型別上不存在屬性 'honk'
```

### 介面繼承

介面可以繼承其他介面：

```typescript
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

// 介面繼承多個介面
interface Document extends Printable, Serializable {
  title: string;
  content: string;
}

class Report implements Document {
  constructor(
    public title: string,
    public content: string
  ) {}
  
  print(): void {
    console.log(`Printing ${this.title}...`);
    console.log(this.content);
  }
  
  serialize(): string {
    return JSON.stringify({
      title: this.title,
      content: this.content
    });
  }
}
```

### 選擇性屬性與唯讀屬性

```typescript
interface UserProfile {
  id: number;
  username: string;
  // 唯讀屬性 - 一旦設定就不能修改
  readonly createdAt: Date;
  // 選擇性屬性 - 可以不提供
  bio?: string;
  website?: string;
}

const profile: UserProfile = {
  id: 1,
  username: "jane_doe",
  createdAt: new Date()
  // bio 和 website 是選擇性的，可以省略
};

// profile.createdAt = new Date(); // 錯誤：無法指派至 'createdAt'，因為它是唯讀屬性
```

## 進階特性

### 靜態成員

靜態成員屬於類別本身，而不是類別的實例：

```typescript
class MathUtils {
  // 靜態屬性
  static readonly PI = 3.14159;
  
  // 靜態方法
  static square(x: number): number {
    return x * x;
  }
  
  static cube(x: number): number {
    return x * x * x;
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.square(4)); // 16
console.log(MathUtils.cube(3)); // 27
```

### Getter 和 Setter

TypeScript 支援 getter 和 setter 方法來控制屬性的存取：

```typescript
class BankAccount {
  private _balance: number = 0;
  
  // Getter
  get balance(): number {
    return this._balance;
  }
  
  // Setter
  set balance(value: number) {
    if (value < 0) {
      throw new Error("餘額不能為負數");
    }
    this._balance = value;
  }
  
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("存款金額必須大於零");
    }
    this.balance += amount; // 使用 setter
  }
  
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("提款金額必須大於零");
    }
    if (amount > this.balance) { // 使用 getter
      throw new Error("餘額不足");
    }
    this.balance -= amount; // 使用 setter
  }
}

const account = new BankAccount();
account.deposit(1000);
console.log(account.balance); // 1000
account.withdraw(500);
console.log(account.balance); // 500
// account.balance = -100; // 錯誤：餘額不能為負數
```

### 泛型類別

泛型允許類別處理不同類型的數據，同時保持類型安全：

```typescript
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  peek(): T | undefined {
    return this.items[0];
  }
  
  size(): number {
    return this.items.length;
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// 字串佇列
const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
console.log(stringQueue.dequeue()); // first

// 數字佇列
const numberQueue = new Queue<number>();
numberQueue.enqueue(1);
numberQueue.enqueue(2);
console.log(numberQueue.dequeue()); // 1
```

### 列舉 (Enum)

列舉是一種命名常數集合的方式：

```typescript
enum Direction {
  North,
  East,
  South,
  West
}

// 使用列舉
let direction: Direction = Direction.North;

// 也可以指定值
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500
}

function handleResponse(status: HttpStatus): void {
  if (status === HttpStatus.OK) {
    console.log("請求成功");
  } else if (status >= HttpStatus.BadRequest) {
    console.log("請求失敗");
  }
}

handleResponse(HttpStatus.OK); // 請求成功
```

### 命名空間 (Namespace)

命名空間可以用來組織相關的類別和介面：

```typescript
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }
  
  export class Circle {
    constructor(
      public center: Point,
      public radius: number
    ) {}
    
    area(): number {
      return Math.PI * this.radius ** 2;
    }
  }
  
  // 非匯出的成員在命名空間外不可見
  function distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
  
  export function calculateDistance(p1: Point, p2: Point): number {
    return distance(p1, p2);
  }
}

// 使用命名空間中的類別和介面
const point: Geometry.Point = { x: 0, y: 0 };
const circle = new Geometry.Circle(point, 5);
console.log(circle.area()); // 78.54...

const distance = Geometry.calculateDistance(
  { x: 0, y: 0 },
  { x: 3, y: 4 }
);
console.log(distance); // 5
```

## 設計模式實現

TypeScript 的物件導向特性使其非常適合實現各種設計模式。以下是一些常見設計模式的 TypeScript 實現示例：

### 單例模式 (Singleton)

```typescript
class Singleton {
  private static instance: Singleton | null = null;
  
  // 私有建構函式防止直接建立實例
  private constructor() {}
  
  // 獲取單例實例的靜態方法
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  
  public someMethod(): void {
    console.log("單例方法被呼叫");
  }
}

// 使用
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true - 兩個變數參考相同的實例
```

### 工廠模式 (Factory)

```typescript
// 產品介面
interface Product {
  operation(): string;
}

// 具體產品
class ConcreteProductA implements Product {
  operation(): string {
    return "ConcreteProductA";
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return "ConcreteProductB";
  }
}

// 工廠類別
class ProductFactory {
  public createProduct(type: string): Product {
    switch (type) {
      case "A":
        return new ConcreteProductA();
      case "B":
        return new ConcreteProductB();
      default:
        throw new Error(`不支援的產品類型: ${type}`);
    }
  }
}

// 使用
const factory = new ProductFactory();
const productA = factory.createProduct("A");
console.log(productA.operation()); // ConcreteProductA
```

### 裝飾器模式 (Decorator)

```typescript
// 組件介面
interface Component {
  operation(): string;
}

// 具體組件
class ConcreteComponent implements Component {
  operation(): string {
    return "ConcreteComponent";
  }
}

// 裝飾器基類
abstract class Decorator implements Component {
  constructor(protected component: Component) {}
  
  operation(): string {
    return this.component.operation();
  }
}

// 具體裝飾器
class ConcreteDecoratorA extends Decorator {
  override operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends Decorator {
  override operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`;
  }
}

// 使用
const simple = new ConcreteComponent();
console.log(simple.operation()); // ConcreteComponent

const decoratorA = new ConcreteDecoratorA(simple);
console.log(decoratorA.operation()); // ConcreteDecoratorA(ConcreteComponent)

const decoratorB = new ConcreteDecoratorB(decoratorA);
console.log(decoratorB.operation()); // ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent))
```

## TypeScript 特有的物件導向特性

### 型別保護 (Type Guards)

型別保護幫助 TypeScript 在條件區塊中縮小型別範圍：

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

// 型別謂詞函數
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function getSmallPet(): Fish | Bird {
  // 返回 Fish 或 Bird
  return Math.random() > 0.5 ? 
    { swim: () => {}, layEggs: () => {} } : 
    { fly: () => {}, layEggs: () => {} };
}

const pet = getSmallPet();
pet.layEggs(); // 都有的方法可以直接呼叫

// 使用型別保護
if (isFish(pet)) {
  pet.swim(); // 在這個區塊中，TypeScript 知道 pet 是 Fish
} else {
  pet.fly(); // 在這個區塊中，TypeScript 知道 pet 是 Bird
}
```

### 混入 (Mixins)

混入是一種重用程式碼的方式，允許將多個類別的功能組合到一個類別中：

```typescript
// 混入類別
class Timestamped {
  timestamp = Date.now();
}

class Activatable {
  isActive = false;
  
  activate() {
    this.isActive = true;
  }
  
  deactivate() {
    this.isActive = false;
  }
}

// 基礎類別
class User {
  constructor(public name: string) {}
}

// 混入類型
type Constructor<T = {}> = new (...args: any[]) => T;

// 混入函數
function TimestampedMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

function ActivatableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    
    activate() {
      this.isActive = true;
    }
    
    deactivate() {
      this.isActive = false;
    }
  };
}

// 應用混入
const TimestampedUser = TimestampedMixin(User);
const TimestampedActivatableUser = ActivatableMixin(TimestampedUser);

// 使用混入後的類別
const user = new TimestampedActivatableUser("John");
console.log(user.name); // John
console.log(user.timestamp); // 時間戳
user.activate();
console.log(user.isActive); // true
```

### 裝飾器 (Decorators)

裝飾器是一種獨特的宣告，可以附加到類別、方法、存取器、屬性或參數上：

```typescript
// 類別裝飾器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// 方法裝飾器
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`呼叫 ${propertyKey} 方法，參數：`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} 方法返回：`, result);
    return result;
  };
  
  return descriptor;
}

// 屬性裝飾器
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    let value: any;
    
    const getter = function() {
      return value;
    };
    
    const setter = function(newVal: any) {
      value = formatString.replace("%s", newVal.toString());
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

@sealed
class Greeter {
  @format("Hello, %s!")
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  @log
  greet() {
    return this.greeting;
  }
}

const greeter = new Greeter("World");
console.log(greeter.greeting); // Hello, World!
greeter.greet(); 
// 呼叫 greet 方法，參數： []
// greet 方法返回： Hello, World!
```

## 總結

TypeScript 提供了豐富的物件導向程式設計功能，包括：

1. **類別與物件**：完整支援類別宣告、建構函式、屬性和方法
2. **封裝**：透過存取修飾詞（public、private、protected）控制成員可見性
3. **繼承**：支援類別繼承和方法覆寫
4. **多型**：透過介面和抽象類別實現
5. **抽象**：使用抽象類別和介面定義抽象概念
6. **進階特性**：靜態成員、getter/setter、泛型、列舉等

這些特性使 TypeScript 成為一個功能強大的物件導向程式語言，能夠應用於各種規模的專案，並支援現代軟體開發中的最佳實踐和設計模式。