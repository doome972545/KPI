-- CreateTable
CREATE TABLE "public"."KpiNotification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "kpiId" INTEGER NOT NULL,

    CONSTRAINT "KpiNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."KpiNotification" ADD CONSTRAINT "KpiNotification_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "public"."Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
