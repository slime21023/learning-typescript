---
date: 2025-03-13
tags: basic
order: 6
---
# Generics

## TypeScript Generics（泛型）

1. **使用泛型提升程式的靈活性與型別安全**：
   - 泛型允許我們在定義函式、介面或類別時，使用型別參數來替代具體的型別，提升程式的可重用性。

2. **為泛型參數命名清晰的名稱**：
   - 使用簡短且有意義的名稱，例如 `T`（Type）、`K`（Key）、`V`（Value），但在複雜情況下可以使用更具描述性的名稱。

3. **避免過度使用泛型**：
   - 泛型應該用於需要靈活型別的情況，過度使用可能會使程式碼變得難以閱讀。

4. **結合型別推斷**：
   - TypeScript 通常可以根據上下文推斷泛型型別，因此在某些情況下可以省略明確指定泛型型別。


**基本泛型函式**
```typescript
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("Hello")); // Hello
console.log(identity<number>(42));      // 42
```

**泛型與陣列**
```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

console.log(getFirstElement([1, 2, 3]));     // 1
console.log(getFirstElement(["a", "b", "c"])); // "a"
```

## Generic Constraints（泛型約束）

1. **限制泛型型別的範圍**：
   - 使用 `extends` 關鍵字對泛型進行約束，確保泛型型別具有某些屬性或行為。

2. **避免過於寬鬆的泛型範圍**：
   - 如果泛型型別過於廣泛，可能導致型別不安全或程式邏輯錯誤。

3. **結合內建型別（例如 `keyof`）進行約束**：
   - 利用 `keyof` 和其他工具，進一步限制泛型型別的操作範圍。

**基本泛型約束**
```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): void {
  console.log(value.length);
}

logLength("Hello");           // 5
logLength([1, 2, 3]);         // 3
logLength({ length: 10 });    // 10
// logLength(42);             // 錯誤：數字型別沒有 length 屬性
```

**使用 `keyof` 約束**
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };
console.log(getProperty(person, "name")); // Alice
console.log(getProperty(person, "age"));  // 30
// getProperty(person, "gender");         // 錯誤：gender 不在 person 的屬性中
```

## Generic Interfaces（泛型介面）

1. **使用泛型介面定義靈活的結構**：
   - 泛型介面適合用於描述具有靈活型別的物件，提升程式的重用性。

2. **結合泛型與函式型別**：
   - 泛型介面可以用於定義函式型別，讓函式的參數與返回值更具彈性。

3. **明確指定泛型的用途**：
   - 泛型應該有清楚的用途，避免多層嵌套的泛型結構，保持程式碼清晰。


**基本泛型介面**
```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "Hello" };
const numberBox: Box<number> = { value: 42 };

console.log(stringBox.value); // Hello
console.log(numberBox.value); // 42
```

**泛型函式型別**
```typescript
interface GenericFunction<T> {
  (arg: T): T;
}

const identity: GenericFunction<number> = (arg) => arg;
console.log(identity(42)); // 42
```

**多泛型參數的介面**
```typescript
interface Pair<K, V> {
  key: K;
  value: V;
}

const pair: Pair<string, number> = { key: "age", value: 30 };
console.log(pair); // { key: 'age', value: 30 }
```


## Generic Classes（泛型類別）

1. **使用泛型類別實現靈活的資料結構**：
   - 泛型類別適合用於實現通用的資料結構，例如堆疊（Stack）、佇列（Queue）等。

2. **結合泛型約束**：
   - 在類別中使用泛型時，可以搭配約束來限制泛型型別的範圍。

3. **避免過度複雜的泛型結構**：
   - 如果類別的泛型參數過多，應考慮簡化設計。

**基本泛型類別**
```typescript
class GenericBox<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
  }
}

const stringBox = new GenericBox<string>("Hello");
console.log(stringBox.value); // Hello
stringBox.value = "World";
console.log(stringBox.value); // World
```

**實現資料結構：堆疊**
```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.peek()); // 2
stack.pop();
console.log(stack.peek()); // 1
```

**泛型類別與約束**
```typescript
interface Identifiable {
  id: number;
}

class Repository<T extends Identifiable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

const repo = new Repository<{ id: number; name: string }>();
repo.add({ id: 1, name: "Alice" });
repo.add({ id: 2, name: "Bob" });

console.log(repo.findById(1)); // { id: 1, name: 'Alice' }
```

## **總結**

**TypeScript Generics**
- 泛型提供靈活的型別解決方案，適用於需要重用性和型別安全的情況。
- 避免過度使用泛型，保持程式碼清晰。

**Generic Constraints**
- 使用 `extends` 限制泛型型別的範圍，確保型別安全。
- 結合 `keyof` 等工具進一步限制操作範圍。

**Generic Interfaces**
- 泛型介面適合描述靈活的物件結構或函式型別。
- 避免過於複雜的多層泛型結構。

**Generic Classes**
- 泛型類別適合用於實現通用的資料結構或邏輯。
- 搭配泛型約束，提升類別的型別安全性。
