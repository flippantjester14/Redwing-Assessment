# Database Requirements Analysis

## 1. Entity Relationships

Based on the provided entities and attributes, the relationships are as follows:

*   **Customer to Order (1:N)**:
    *   One **Customer** can place multiple **Orders**.
    *   Each **Order** belongs to exactly one **Customer**.
    *   *Relationship*: One-to-Many.

*   **Order to Order Details (1:N)**:
    *   One **Order** can contain multiple **Order Details** (line items).
    *   Each **Order Detail** belongs to exactly one **Order**.
    *   *Relationship*: One-to-Many.

*   **Product to Order Details (1:N)**:
    *   One **Product** can appear in multiple **Order Details** (across different orders).
    *   Each **Order Detail** refers to exactly one **Product**.
    *   *Relationship*: One-to-Many.

*   **Order to Product (M:N)**:
    *   Orders and Products have a Many-to-Many relationship, which is resolved by the **Order Details** associative entity.

## 2. Primary and Foreign Keys

| Entity | Primary Key | Foreign Keys |
| :--- | :--- | :--- |
| **Customer** | `CustomerID` | None |
| **Product** | `ProductID` | None |
| **Order** | `OrderID` | `CustomerID` (References Customer) |
| **Order Details** | `OrderDetailID` | `OrderID` (References Order)<br>`ProductID` (References Product) |

## 3. Database Selection

**Selected Database Type:** Relational Database Management System (RDBMS).

**Decision Process & Factors:**

1.  **Structured Data**: The data (Customers, Orders, Products) has a predefined schema with specific data types (integers, strings, decimals/money). RDBMS enforces this structure strictly.
2.  **Relationships**: The core of the system relies on relationships between entities (e.g., linking orders to customers). RDBMS is designed specifically for handling these relations efficiently via Foreign Keys and Joins.
3.  **Data Integrity**:
    *   **Referential Integrity**: We need to ensure an order cannot exist without a valid customer, and order details cannot exist without valid products. SQL databases enforce this via Foreign Key constraints.
    *   **ACID Compliance**: Order management involves financial transactions (TotalAmount, Inventory). Atomicity, Consistency, Isolation, and Durability are critical to ensure that an order is fully processed or not at all, preventing data corruption.
4.  **Query Complexity**: The requirements involve complex queries (aggregations like total sales per customer, joins to get customer details for a product). SQL is the standard and most powerful language for these types of analytical queries.

**Specific Recommendation**: **PostgreSQL** or **MySQL**. Both are robust, open-source, and widely used for such applications. For this design, we will use standard SQL compatible with both.
