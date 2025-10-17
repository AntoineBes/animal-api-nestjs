/*
  Warnings:

  - Added the required column `updatedAt` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "especeId" INTEGER NOT NULL,
    "regne" TEXT,
    "embranchement" TEXT,
    "classe" TEXT,
    "ordre" TEXT,
    "famille" TEXT,
    "genre" TEXT,
    "statutUICN" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Animal_especeId_fkey" FOREIGN KEY ("especeId") REFERENCES "Espece" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Animal" ("description", "especeId", "id", "imageUrl", "nom") SELECT "description", "especeId", "id", "imageUrl", "nom" FROM "Animal";
DROP TABLE "Animal";
ALTER TABLE "new_Animal" RENAME TO "Animal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
