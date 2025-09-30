/*
  Warnings:

  - You are about to drop the column `email` on the `KpiNotification` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `KpiNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."KpiNotification" DROP COLUMN "email",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."KpiNotification" ADD CONSTRAINT "KpiNotification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
