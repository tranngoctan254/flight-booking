/*
  Warnings:

  - You are about to drop the column `pictures` on the `room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `room` DROP COLUMN `pictures`;

-- CreateTable
CREATE TABLE `RoomPicture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `roomId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomPicture` ADD CONSTRAINT `RoomPicture_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
