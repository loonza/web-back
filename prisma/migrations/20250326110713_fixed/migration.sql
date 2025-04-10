/*
  Warnings:

  - You are about to drop the column `userId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_userId_fkey";

-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_userId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_warehouseId_fkey";

-- AlterTable
ALTER TABLE "reservation" DROP COLUMN "userId",
DROP COLUMN "warehouseId",
ADD COLUMN     "user_id" INTEGER,
ADD COLUMN     "warehouse_id" INTEGER;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "userId",
DROP COLUMN "warehouseId",
ADD COLUMN     "user_id" INTEGER,
ADD COLUMN     "warehouse_id" INTEGER;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
