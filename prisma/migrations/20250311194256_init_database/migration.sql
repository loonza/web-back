-- CreateEnum
CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "reservation_status_enum" AS ENUM ('pending', 'confirmed', 'canceled');

-- CreateEnum
CREATE TYPE "user_role_enum" AS ENUM ('tenant', 'owner');

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "reservation_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "payment_status_enum" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(6),

    CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "status" "reservation_status_enum" NOT NULL DEFAULT 'pending',
    "userId" INTEGER,
    "warehouseId" INTEGER,

    CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "warehouseId" INTEGER,

    CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "role" "user_role_enum" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse" (
    "id" SERIAL NOT NULL,
    "location" VARCHAR NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,

    CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_78a916df40e02a9deb1c4b75edb" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "FK_02d0ebca0aafafe3a4a781dcfc4" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "FK_147fe8b8a49e4fe1e94c854636a" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
