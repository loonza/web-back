/*
  Warnings:

  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `warehouse` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "payment" DROP CONSTRAINT "payment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "payment_id_seq";

-- AlterTable
ALTER TABLE "reservation" ALTER COLUMN "warehouse_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "warehouse_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "warehouse_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "warehouse_id_seq";

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
