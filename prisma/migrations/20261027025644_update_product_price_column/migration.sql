/*
  Warnings:

  - Added the required column `unit_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;
