---
date: 2025-03-13
tags: basic
order: 4
---
# Interface

## Interfaces（介面）

1. **使用介面描述物件的結構**：
   - 使用介面來定義物件的形狀（結構），提供型別安全，讓程式碼更具可讀性與可維護性。
   - 適合用於函式參數、返回值或物件屬性的型別定義。

2. **選擇介面而非類型別名（type alias）**：
   - 當描述物件結構時，優先使用介面（`interface`）而非型別別名（`type`）。介面支援擴展（extends），更靈活。

3. **使用可選屬性（Optional Properties）**：
   - 使用 `?` 定義可選屬性，適合用於某些屬性不是必須的情況。

4. **使用索引簽名（Index Signatures）**：
   - 當物件的屬性名稱未知但結構一致時，可以使用索引簽名。

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可選屬性
}

const user: User = {
  id: 1,
  name: "Alice",
  // email 是可選的，可以省略
};
```

**函式參數與返回值**
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

function getProductInfo(product: Product): string {
  return `Product: ${product.name}, Price: ${product.price}`;
}

const product: Product = { id: 101, name: "Laptop", price: 1500 };
console.log(getProductInfo(product)); // Product: Laptop, Price: 1500
```

**索引簽名**
```typescript
interface StringDictionary {
  [key: string]: string; // 索引簽名：所有屬性名稱都是字串，值也是字串
}

const dictionary: StringDictionary = {
  hello: "world",
  type: "script",
};
console.log(dictionary["hello"]); // world
```

## Extending Interfaces（擴展介面）

1. **使用繼承來擴展介面**：
   - 當一個介面需要基於另一個介面進行擴展時，使用 `extends` 關鍵字。
   - 繼承可以讓介面更具彈性，減少重複定義。

2. **多重擴展**：
   - 一個介面可以同時擴展多個介面，適合用於組合多個結構。

3. **避免過度深層的繼承**：
   - 過多層次的繼承會增加複雜性，應保持繼承結構簡單清晰。


**單一擴展**
```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
};
console.log(myDog); // { name: 'Buddy', age: 3, breed: 'Golden Retriever' }
```

**多重擴展**
```typescript
interface Engine {
  horsepower: number;
}

interface Wheels {
  wheelCount: number;
}

interface Car extends Engine, Wheels {
  brand: string;
}

const myCar: Car = {
  horsepower: 300,
  wheelCount: 4,
  brand: "Tesla",
};
console.log(myCar); // { horsepower: 300, wheelCount: 4, brand: 'Tesla' }
```

**擴展與可選屬性結合**
```typescript
interface BaseUser {
  id: number;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
  email?: string; // 可選屬性
}

const admin: AdminUser = {
  id: 1,
  name: "Admin",
  permissions: ["read", "write", "delete"],
};
console.log(admin); // { id: 1, name: 'Admin', permissions: [ 'read', 'write', 'delete' ] }
```


## 使用介面與類別結合

介面可以用來描述類別的結構，實現更靈活的型別檢查。

```typescript
interface Shape {
  calculateArea(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}

  calculateArea(): number {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(5, 10);
console.log(rectangle.calculateArea()); // 50
```


## 差異與補充：介面 vs 型別別名

| 特性   | 介面 (`interface`)         | 型別別名 (`type`)                    |
| ------ | -------------------------- | ------------------------------------ |
| 擴展   | 支援擴展（`extends`）      | 支援交集（`&`）                      |
| 用途   | 主要用於描述物件結構       | 可用於物件結構、聯合型別、函式型別等 |
| 靈活性 | 更適合描述物件和類別的結構 | 更靈活，但不適合過於複雜的結構       |

```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const myDog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};
```

## 總結

- **Interfaces** 是 TypeScript 中描述物件結構的核心工具，應用於函式參數、返回值及物件屬性。
- **Extending Interfaces** 提供了介面的重用性與靈活性，適合用於描述多層結構或組合型別。
- 使用介面時，應遵循簡單、清晰的原則，避免過度複雜的繼承結構。
- 在適當情況下，可以選擇型別別名（`type`）來補充介面的功能，但應優先考慮使用介面。
