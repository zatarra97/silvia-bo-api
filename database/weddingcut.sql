-- ============================================================
-- WeddingCut — Schema del database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `giopie`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `giopie`;

-- ENTITÀ: services
-- Servizi di montaggio offerti dalla piattaforma

CREATE TABLE IF NOT EXISTS `services` (
  `id`                  INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `name`                VARCHAR(200)      NOT NULL,
  `description`         TEXT              NOT NULL,
  `durationDescription` VARCHAR(500)      DEFAULT NULL,
  `minDuration`         SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Durata minima in minuti',
  `maxDuration`         SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Durata massima in minuti',
  `orientation`         ENUM('vertical','horizontal','both') NOT NULL DEFAULT 'both',
  `priceVertical`       DECIMAL(10,2)     DEFAULT NULL,
  `priceHorizontal`     DECIMAL(10,2)     DEFAULT NULL,
  `priceBoth`           DECIMAL(10,2)     DEFAULT NULL,
  `additionalOptions`   JSON              DEFAULT NULL,
  `createdAt`           TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`           TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
