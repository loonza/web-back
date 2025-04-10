-- AlterTable
ALTER TABLE "payment" RENAME CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" TO "payment_pkey";

-- AlterTable
ALTER TABLE "reservation" RENAME CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" TO "reservation_pkey";

-- AlterTable
ALTER TABLE "review" RENAME CONSTRAINT "PK_2e4299a343a81574217255c00ca" TO "review_pkey";

-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "user_pkey";

-- AlterTable
ALTER TABLE "warehouse" RENAME CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" TO "warehouse_pkey";

-- RenameForeignKey
ALTER TABLE "reservation" RENAME CONSTRAINT "FK_02d0ebca0aafafe3a4a781dcfc4" TO "reservation_warehouseId_fkey";

-- RenameForeignKey
ALTER TABLE "reservation" RENAME CONSTRAINT "FK_529dceb01ef681127fef04d755d" TO "reservation_userId_fkey";

-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "FK_1337f93918c70837d3cea105d39" TO "review_userId_fkey";

-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "FK_147fe8b8a49e4fe1e94c854636a" TO "review_warehouseId_fkey";

-- RenameIndex
ALTER INDEX "UQ_78a916df40e02a9deb1c4b75edb" RENAME TO "user_username_key";

-- RenameIndex
ALTER INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" RENAME TO "user_email_key";
