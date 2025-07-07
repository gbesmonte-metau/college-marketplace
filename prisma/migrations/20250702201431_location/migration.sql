-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "buyerId" INTEGER,
ADD COLUMN     "formatted_address" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "formatted_address" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
