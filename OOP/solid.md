---
date: 2025-05-03
tags: oop
order: 2
---

# SOLID 原則

SOLID 是物件導向設計的五個基本原則，這些原則能幫助開發者創建更易維護、更具彈性的軟體。

## 單一職責原則 (Single Responsibility Principle)

**核心概念**：一個類別應該只有一個改變的理由，也就是說它只應該負責一項功能領域。

```typescript
// ✅ 遵循 SRP：分離不同職責
class UserRepository {
  constructor(private database: Database) {}
  
  saveUser(user: User): void {
    this.database.save(user);
  }
}

class EmailValidator {
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

class EmailService {
  sendWelcomeEmail(user: User): void {
    console.log(`Sending welcome email to ${user.email}`);
  }
}
```

**優點**
- 每個類別專注於做好一件事情
- 降低類別的複雜度
- 提高可讀性和可維護性
- 當需求變更時，只有直接相關的類別需要修改

## 開放/封閉原則 (Open/Closed Principle)

**核心概念**：軟體實體應該對擴展開放，對修改封閉。這意味著當需要增加新功能時，應該通過擴展現有代碼而不是修改它來實現。

```typescript
// ✅ 遵循 OCP：使用介面和多態
interface ReportFormatter {
  format(data: any[]): string;
}

class PdfFormatter implements ReportFormatter {
  format(data: any[]): string {
    return 'PDF report';
  }
}

class CsvFormatter implements ReportFormatter {
  format(data: any[]): string {
    return 'CSV report';
  }
}

// 新增格式只需實作新類別，不需修改現有程式碼
class ExcelFormatter implements ReportFormatter {
  format(data: any[]): string {
    return 'Excel report';
  }
}

class ReportGenerator {
  generateReport(data: any[], formatter: ReportFormatter): string {
    return formatter.format(data);
  }
}
```

**優點**
- 降低修改現有代碼的風險
- 提高系統的穩定性
- 促進代碼的重用
- 使系統更容易維護和擴展

## 里氏替換原則 (Liskov Substitution Principle)

**核心概念**：子類型必須能夠替換其基類型而不影響程式的正確性。換句話說，如果 S 是 T 的子類型，那麼程式中任何使用 T 的地方都可以安全地使用 S 來替換。

```typescript
// ✅ 遵循 LSP：使用更合適的抽象
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  
  setWidth(width: number): void {
    this.width = width;
  }
  
  setHeight(height: number): void {
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private size: number) {}
  
  setSize(size: number): void {
    this.size = size;
  }
  
  getArea(): number {
    return this.size * this.size;
  }
}
```

**優點**
- 確保類別階層的一致性
- 增強代碼的可重用性
- 提高系統的健壯性
- 支持多態性的正確實現

## 介面隔離原則 (Interface Segregation Principle)

**核心概念**：客戶端不應該被強迫依賴它們不使用的方法。大的介面應該被分割成更小更具體的介面，使客戶端只需要知道它們感興趣的方法。

###

```typescript
// ✅ 遵循 ISP：將介面分割成更小更具體的介面
interface Printable {
  print(document: Document): void;
}

interface Scannable {
  scan(document: Document): void;
}

interface Faxable {
  fax(document: Document): void;
}

interface Copyable {
  copy(document: Document): void;
}

// 簡易印表機只需實作它支援的功能
class SimplePrinter implements Printable {
  print(document: Document): void {
    console.log('Printing document');
  }
}

// 多功能印表機可以實作多個介面
class AllInOnePrinter implements Printable, Scannable, Faxable, Copyable {
  print(document: Document): void {
    console.log('Printing document');
  }
  
  scan(document: Document): void {
    console.log('Scanning document');
  }
  
  fax(document: Document): void {
    console.log('Faxing document');
  }
  
  copy(document: Document): void {
    console.log('Copying document');
  }
}
```

**優點**
- 降低系統的耦合度
- 提高系統的靈活性和可維護性
- 避免實現不必要的方法
- 促進介面的重用

## 依賴反轉原則 (Dependency Inversion Principle)

**核心概念**：高層模組不應該依賴低層模組，兩者都應該依賴於抽象。抽象不應該依賴於細節，細節應該依賴於抽象。

### TypeScript 範例

```typescript
// ✅ 遵循 DIP：依賴抽象而非具體實作
interface Database {
  connect(): void;
  query(sql: string): any[];
}

class MySqlDatabase implements Database {
  connect(): void {
    console.log('Connected to MySQL');
  }
  
  query(sql: string): any[] {
    console.log(`Executing query: ${sql}`);
    return [];
  }
}

class PostgreSqlDatabase implements Database {
  connect(): void {
    console.log('Connected to PostgreSQL');
  }
  
  query(sql: string): any[] {
    console.log(`Executing query: ${sql}`);
    return [];
  }
}

class UserService {
  // 依賴抽象介面
  constructor(private database: Database) {}
  
  getUsers(): User[] {
    this.database.connect();
    return this.database.query('SELECT * FROM users');
  }
}

// 使用依賴注入
const userService = new UserService(new MySqlDatabase());
// 可輕易切換資料庫實作
const userServiceWithPostgres = new UserService(new PostgreSqlDatabase());
```

**優點**
- 降低模組間的耦合度
- 提高系統的靈活性和可測試性
- 支持可替換的組件
- 促進並行開發

## 實際應用：結合多個原則的綜合範例

```typescript
// 定義抽象介面 (DIP)
interface Logger {
  log(message: string): void;
}

interface PaymentGateway {
  processPayment(amount: number): Promise<boolean>;
}

// 具體實作 (SRP)
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] Writing to log file: ${message}`);
  }
}

// 支付閘道實作 (OCP)
class StripeGateway implements PaymentGateway {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via Stripe`);
    return true;
  }
}

class PayPalGateway implements PaymentGateway {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via PayPal`);
    return true;
  }
}

// 訂單處理 (SRP, DIP)
class OrderProcessor {
  constructor(
    private logger: Logger,
    private paymentGateway: PaymentGateway
  ) {}
  
  async processOrder(order: Order): Promise<boolean> {
    try {
      this.logger.log(`Processing order: ${order.id}`);
      const success = await this.paymentGateway.processPayment(order.total);
      
      if (success) {
        this.logger.log(`Order ${order.id} processed successfully`);
      } else {
        this.logger.log(`Failed to process order ${order.id}`);
      }
      
      return success;
    } catch (error) {
      this.logger.log(`Error processing order: ${error.message}`);
      return false;
    }
  }
}

// 使用範例
const processor = new OrderProcessor(
  new ConsoleLogger(),
  new StripeGateway()
);

// 可以輕易替換元件 (LSP)
const alternativeProcessor = new OrderProcessor(
  new FileLogger(),
  new PayPalGateway()
);
```

## SOLID 原則的整體價值

**系統設計層面**
- **可維護性**：遵循 SOLID 原則的代碼更容易理解和修改
- **擴展性**：系統可以在不破壞現有功能的情況下添加新功能
- **靈活性**：組件可以輕鬆替換或重組
- **穩健性**：系統對變化更具彈性，不容易出現連鎖反應式的錯誤

**團隊協作層面**
- **並行開發**：團隊成員可以同時處理不同模組而不相互干擾
- **知識轉移**：代碼更容易理解，新團隊成員更快上手
- **代碼審查**：更容易識別設計問題和潛在缺陷

**長期效益**
- **技術債務減少**：良好的設計減少未來的重構需求
- **更快的開發速度**：雖然初期可能需要更多設計時間，但長期來看能加速功能開發
- **更高的代碼質量**：遵循這些原則通常會產生更少的錯誤和更好的測試覆蓋率

## 實踐建議

1. **漸進式採用**：不需要一次性完全遵循所有原則，可以逐步改進
2. **平衡實用性**：原則是指導方針，不是絕對規則，需要根據具體情況權衡
3. **持續重構**：隨著對系統理解的深入，不斷應用這些原則改進設計
4. **結合設計模式**：許多設計模式天生就體現了 SOLID 原則
5. **關注業務價值**：技術設計應該服務於業務需求，而不是為了設計而設計

通過理解和適當應用這些原則，即使是初學者也能創建出更加健壯、靈活且易於維護的軟體系統。記住，SOLID 原則不是教條，而是幫助我們做出更好設計決策的工具。