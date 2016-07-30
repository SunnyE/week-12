CREATE DATABASE Bamazon;

USE Bamazon; 

CREATE TABLE Products (
	ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(50) NULL,
    DepartmentName VARCHAR(50) NULL,
    Price DECIMAL(10,2)  NULL, 
    StockQuantity INTEGER(11) NULL,
    PRIMARY KEY(ItemID)
); 
DROP TABLE Products;
CREATE TABLE Departments(
	DepartmentID INTEGER(11) AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts INTEGER(11),
    TotalSales INTEGER(11),
	PRIMARY KEY(DepartmentID)
    );

SELECT * FROM Products;

