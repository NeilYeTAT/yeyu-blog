/*
  Warnings:

  - You are about to drop the `Nonce` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Nonce";
