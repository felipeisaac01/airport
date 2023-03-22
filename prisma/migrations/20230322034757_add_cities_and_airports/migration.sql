/*
  Warnings:

  - Changed the type of `federativeUnit` on the `cities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "federativeUnits" AS ENUM ('BA', 'SP', 'RJ', 'MG', 'RN', 'RS');

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "federativeUnit",
ADD COLUMN     "federativeUnit" "federativeUnits" NOT NULL;

-- DropEnum
DROP TYPE "federative_units";
