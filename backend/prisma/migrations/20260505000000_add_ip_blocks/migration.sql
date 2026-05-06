-- CreateTable
CREATE TABLE `IpBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `manual` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `IpBlock_ip_idx`(`ip`),
    INDEX `IpBlock_userId_idx`(`userId`),
    INDEX `IpBlock_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
