-- 3. Querying the database

-- a. Retrieve all orders along with customer details (name, email, and phone) for a specific product (e.g., ProductID = 123).
SELECT 
    o.OrderID,
    o.OrderDate,
    o.Status,
    c.Name AS CustomerName,
    c.Email,
    c.Phone
FROM "Order" o
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Customer c ON o.CustomerID = c.CustomerID
WHERE od.ProductID = 123;


-- b. Calculate the total sales (sum of TotalAmount) for each customer.
SELECT 
    c.CustomerID,
    c.Name,
    SUM(o.TotalAmount) AS TotalSales
FROM Customer c
JOIN "Order" o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name;


-- c. Find the customer who has placed the most orders.
SELECT 
    c.CustomerID,
    c.Name,
    COUNT(o.OrderID) AS OrderCount
FROM Customer c
JOIN "Order" o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.Name
ORDER BY OrderCount DESC
LIMIT 1;


-- d. Retrieve the details of orders that have a total amount higher than the average order amount.
SELECT *
FROM "Order"
WHERE TotalAmount > (
    SELECT AVG(TotalAmount)
    FROM "Order"
);


-- e. Get the most recent order for each customer.
-- Method 1: Using Window Function (Standard in modern SQL like PostgreSQL, SQL Server, MySQL 8+)
WITH RankedOrders AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate DESC) as rn
    FROM "Order"
)
SELECT *
FROM RankedOrders
WHERE rn = 1;

-- Method 2: Using Correlated Subquery (Works in older SQL versions too)
SELECT *
FROM "Order" o1
WHERE OrderDate = (
    SELECT MAX(OrderDate)
    FROM "Order" o2
    WHERE o2.CustomerID = o1.CustomerID
);
