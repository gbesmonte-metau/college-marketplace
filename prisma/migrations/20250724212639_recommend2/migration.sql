/*
  Warnings:

  - The primary key for the `RecommendedPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RecommendedPosts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecommendedPosts" DROP CONSTRAINT "RecommendedPosts_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RecommendedPosts_pkey" PRIMARY KEY ("userId", "postId");
