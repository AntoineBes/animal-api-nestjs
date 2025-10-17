/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Animal_nom_key" ON "Animal"("nom");
