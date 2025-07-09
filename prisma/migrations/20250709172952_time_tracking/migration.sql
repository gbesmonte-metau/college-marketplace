/*
  Warnings:

  - You are about to drop the `_UserLikedPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSavedPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserLikedPosts" DROP CONSTRAINT "_UserLikedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedPosts" DROP CONSTRAINT "_UserLikedPosts_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavedPosts" DROP CONSTRAINT "_UserSavedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSavedPosts" DROP CONSTRAINT "_UserSavedPosts_B_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "formatted_address" SET DEFAULT 'No address available.';

-- DropTable
DROP TABLE "_UserLikedPosts";

-- DropTable
DROP TABLE "_UserSavedPosts";

-- CreateTable
CREATE TABLE "UserViewedPosts" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserViewedPosts_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "UserLikedPosts" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikedPosts_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "UserSavedPosts" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSavedPosts_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "UserViewedPosts" ADD CONSTRAINT "UserViewedPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewedPosts" ADD CONSTRAINT "UserViewedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedPosts" ADD CONSTRAINT "UserLikedPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedPosts" ADD CONSTRAINT "UserLikedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPosts" ADD CONSTRAINT "UserSavedPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPosts" ADD CONSTRAINT "UserSavedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
