-- Script per creare il database aspeat e la tabella ikea_offer

-- Crea il database aspeat
CREATE DATABASE IF NOT EXISTS `aspeat`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Utilizza il database aspeat
USE `aspeat`;

-- Tabella per memorizzare le offerte Ikea
CREATE TABLE IF NOT EXISTS `ikea_offer` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ikeaId` BIGINT NOT NULL,
  `name` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `imageUrl` VARCHAR(1000) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ikeaId` (`ikeaId`),
  INDEX `idx_price` (`price`),
  INDEX `idx_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
