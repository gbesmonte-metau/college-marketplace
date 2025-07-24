-- AlterTable
ALTER TABLE "User" ADD COLUMN     "weights" INTEGER[] DEFAULT ARRAY[25, 25, 25, 25]::INTEGER[];

-- CreateTable
CREATE TABLE "RecommendedPosts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isWeighed" BOOLEAN NOT NULL DEFAULT false,
    "bestCategory" INTEGER,
    "isFeedbackPositive" BOOLEAN,

    CONSTRAINT "RecommendedPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendedPosts_postId_key" ON "RecommendedPosts"("postId");

-- AddForeignKey
ALTER TABLE "RecommendedPosts" ADD CONSTRAINT "RecommendedPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedPosts" ADD CONSTRAINT "RecommendedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
