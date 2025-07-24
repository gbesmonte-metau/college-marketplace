-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikedPosts" DROP CONSTRAINT "UserLikedPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserSavedPosts" DROP CONSTRAINT "UserSavedPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserViewedPosts" DROP CONSTRAINT "UserViewedPosts_postId_fkey";

-- AddForeignKey
ALTER TABLE "UserViewedPosts" ADD CONSTRAINT "UserViewedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikedPosts" ADD CONSTRAINT "UserLikedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPosts" ADD CONSTRAINT "UserSavedPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
