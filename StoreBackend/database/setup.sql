-- Run explicitly with sqlcmd -b; never delete or replace existing products.
IF DB_ID(N'Store') IS NULL
    CREATE DATABASE [Store];
GO
USE [Store];
GO
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'dbo.Product', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Product
    (
        ProductId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Product PRIMARY KEY,
        ProductResourceId uniqueidentifier NOT NULL,
        Name nvarchar(50) NULL
    );
END;

IF EXISTS (SELECT ProductResourceId FROM dbo.Product GROUP BY ProductResourceId HAVING COUNT(*) > 1)
BEGIN
    ROLLBACK TRANSACTION;
    THROW 50001, 'Hay identificadores duplicados. Revisar los datos antes de crear el indice unico.', 1;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.Product') AND name = N'IX_Product_ProductResourceId'
)
    CREATE UNIQUE INDEX IX_Product_ProductResourceId ON dbo.Product(ProductResourceId);

COMMIT TRANSACTION;
GO