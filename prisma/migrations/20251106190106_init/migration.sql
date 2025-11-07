-- CreateTable
CREATE TABLE "AudioSummary" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "keywords" TEXT[],
    "transcript" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AudioSummary_owner_id_idx" ON "AudioSummary"("owner_id");

-- AddForeignKey
ALTER TABLE "AudioSummary" ADD CONSTRAINT "AudioSummary_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
