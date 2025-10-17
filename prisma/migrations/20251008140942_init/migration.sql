-- CreateTable
CREATE TABLE "Espece" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "especeId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    CONSTRAINT "Animal_especeId_fkey" FOREIGN KEY ("especeId") REFERENCES "Espece" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Espece_nom_key" ON "Espece"("nom");
