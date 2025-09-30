/*
  Warnings:

  - Added the required column `goalType` to the `Kpi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('increase', 'decrease');

-- AlterTable
ALTER TABLE "public"."Kpi" ADD COLUMN     "goalType" "public"."GoalType" NOT NULL;
