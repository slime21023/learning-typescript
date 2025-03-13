---
date: 2025-03-13
tags: basic
order: 5
---
# Advanced Types

## Intersection Types（交集型別）

### **最佳實踐**
1. **用於結合多個型別**：
   - 使用交集型別（`&`）將多個型別結合成一個新型別。
   - 適合用於需要同時滿足多個型別的情況，尤其是在物件合併或多重屬性需求時。

2. **避免過於複雜的交集結構**：
   - 過多的交集型別會使型別變得難以理解，應保持簡單清晰。

3. **搭配介面或類別使用**：
   - 可以將介面或類別與交集型別結合，實現更靈活的型別設計。

### **範例**

#### **基本範例：合併型別**
```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type Staff = Person & Employee;

const staff: Staff = {
  name: "Alice",
  age: 30,
  employeeId: 101,
  department: "HR",
};
console.log(staff);
```

#### **動態型別合併**
```typescript
type A = { a: string };
type B = { b: number };

type Combined = A & B;

const obj: Combined = {
  a: "Hello",
  b: 42,
};
console.log(obj); // { a: 'Hello', b: 42 }
```

---

## Type Guards（型別守衛）

### **最佳實踐**
1. **使用型別守衛進行型別縮小**：
   - 型別守衛用於在執行期間檢查型別，並根據檢查結果縮小型別範圍。
   - 常用於處理聯合型別（`|`）的情況。

2. **使用內建型別守衛**：
   - 使用 `typeof`、`instanceof` 或 `in` 關鍵字來檢查型別。

3. **自定義型別守衛**：
   - 定義自訂函式來檢查型別，並搭配 `is` 關鍵字提升型別安全性。

4. **避免過多的型別守衛邏輯**：
   - 如果型別檢查邏輯過於複雜，應考慮重構程式碼或使用類別與多型解決問題。

### **範例**

#### **使用 `typeof`**
```typescript
function printValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(`String value: ${value.toUpperCase()}`);
  } else {
    console.log(`Number value: ${value.toFixed(2)}`);
  }
}

printValue("hello"); // String value: HELLO
printValue(42);      // Number value: 42.00
```

#### **使用 `instanceof`**
```typescript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else if (animal instanceof Cat) {
    animal.meow();
  }
}

const dog = new Dog();
const cat = new Cat();
makeSound(dog); // Woof!
makeSound(cat); // Meow!
```

#### **使用 `in`**
```typescript
interface Car {
  drive: () => void;
}

interface Boat {
  sail: () => void;
}

function operateVehicle(vehicle: Car | Boat): void {
  if ("drive" in vehicle) {
    vehicle.drive();
  } else if ("sail" in vehicle) {
    vehicle.sail();
  }
}

const car: Car = { drive: () => console.log("Driving...") };
const boat: Boat = { sail: () => console.log("Sailing...") };
operateVehicle(car);  // Driving...
operateVehicle(boat); // Sailing...
```

#### **自定義型別守衛**
```typescript
interface Bird {
  fly: () => void;
}

interface Fish {
  swim: () => void;
}

function isBird(animal: Bird | Fish): animal is Bird {
  return (animal as Bird).fly !== undefined;
}

function move(animal: Bird | Fish): void {
  if (isBird(animal)) {
    animal.fly();
  } else {
    animal.swim();
  }
}

const bird: Bird = { fly: () => console.log("Flying...") };
const fish: Fish = { swim: () => console.log("Swimming...") };
move(bird); // Flying...
move(fish); // Swimming...
```

---

## Type Assertions（型別斷言）

### **最佳實踐**
1. **僅在必要時使用型別斷言**：
   - 型別斷言用於告訴編譯器某個值的型別，但應謹慎使用，避免破壞型別安全。
   - 適用於確定值的型別比編譯器推斷的型別更具體的情況。

2. **優先使用型別守衛**：
   - 如果可以使用型別守衛來縮小型別範圍，應優先選擇型別守衛，而非型別斷言。

3. **避免過度使用 `any` 搭配斷言**：
   - 使用 `any` 型別後進行型別斷言會降低程式碼的安全性，應盡量避免。

4. **使用非空斷言（`!`）謹慎處理空值**：
   - 當確定值不為 `null` 或 `undefined` 時，可以使用非空斷言，但應避免濫用。

### **範例**

#### **基本型別斷言**
```typescript
let value: unknown = "Hello, TypeScript!";

// 使用型別斷言告訴編譯器這是字串
let strLength: number = (value as string).length;
console.log(strLength); // 18
```

#### **非空斷言**
```typescript
function printName(name?: string): void {
  // 確定 name 不為 undefined 或 null
  console.log(name!.toUpperCase());
}

printName("Alice"); // ALICE
// printName(); // 錯誤：執行期間會發生錯誤，因為 name 為 undefined
```

#### **斷言 DOM 元素**
```typescript
const inputElement = document.getElementById("username") as HTMLInputElement;
inputElement.value = "TypeScript";
```

#### **避免過度使用 `any` 搭配斷言**
```typescript
let data: any = "Hello, World!";
// 不建議這樣使用，因為會破壞型別安全
let length: number = (data as number); // 錯誤的斷言
```

---

## **總結**

### **Intersection Types（交集型別）**
- 用於合併多個型別，適合需要同時滿足多重屬性的情況。
- 應避免過於複雜的交集結構，保持型別簡單清晰。

### **Type Guards（型別守衛）**
- 提供型別縮小的能力，讓程式碼更具型別安全性。
- 使用內建守衛（`typeof`、`instanceof`、`in`）或自定義守衛來檢查型別。
- 避免過度複雜的守衛邏輯，保持程式碼乾淨。

### **Type Assertions（型別斷言）**
- 僅在必要時使用型別斷言，避免破壞型別安全。
- 優先使用型別守衛來縮小型別範圍。
- 非空斷言（`!`）應謹慎使用，避免不必要的執行期間錯誤。

