-- DropForeignKey
ALTER TABLE "public"."KpiNotification" DROP CONSTRAINT "KpiNotification_kpiId_fkey";

-- AddForeignKey
ALTER TABLE "public"."KpiNotification" ADD CONSTRAINT "KpiNotification_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "public"."Kpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
