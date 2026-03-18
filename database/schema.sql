-- sissoftware database schema

CREATE DATABASE IF NOT EXISTS `sissoftware` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
USE `sissoftware`;

-- Drop tables in correct order (children first)
DROP TABLE IF EXISTS `patient_ic_ast_results`;
DROP TABLE IF EXISTS `patient_ic_resistance_profiles`;
DROP TABLE IF EXISTS `patient_ic_pathogens`;
DROP TABLE IF EXISTS `patient_bsi_ast_results`;
DROP TABLE IF EXISTS `patient_bsi_resistance_profiles`;
DROP TABLE IF EXISTS `patient_bsi_pathogens`;
DROP TABLE IF EXISTS `patient_targeted_therapies`;
DROP TABLE IF EXISTS `patient_empirical_therapies`;
DROP TABLE IF EXISTS `patient_isolation_sites`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `ast_antibiotics`;
DROP TABLE IF EXISTS `resistance_profiles`;
DROP TABLE IF EXISTS `bsi_pathogens`;
DROP TABLE IF EXISTS `antimicrobial_therapies`;
DROP TABLE IF EXISTS `sites_of_isolation`;
DROP TABLE IF EXISTS `wards_of_admission`;

-- Lookup table: wards of admission
CREATE TABLE `wards_of_admission` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup table: sites of isolation
CREATE TABLE `sites_of_isolation` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup table: antimicrobial therapies
CREATE TABLE `antimicrobial_therapies` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup table: BSI causative pathogens
CREATE TABLE `bsi_pathogens` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup table: resistance profiles
CREATE TABLE `resistance_profiles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup table: AST antibiotics (for susceptibility testing)
CREATE TABLE `ast_antibiotics` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patients table
CREATE TABLE `patients` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `internal_id` VARCHAR(50) DEFAULT NULL,
    `date_of_birth` DATE DEFAULT NULL,
    `sex` TINYINT DEFAULT NULL COMMENT '0=Female, 1=Male',
    `ward_of_admission_id` INT DEFAULT NULL,
    `bsi_onset` TINYINT DEFAULT NULL COMMENT '0=Community-acquired, 1=Hospital-acquired, 2=Healthcare-associated',
    `bsi_diagnosis_date` DATE DEFAULT NULL,
    `admission_date` DATE DEFAULT NULL,
    `discharge_date` DATE DEFAULT NULL,
    `los` INT DEFAULT NULL COMMENT 'Length of stay in days (min 1)',
    `sofa_score` INT DEFAULT NULL,
    `charlson_comorbidity_index` INT DEFAULT NULL,
    `rectal_colonization_status` TINYINT DEFAULT NULL COMMENT '0=No, 1=Yes',
    `rectal_colonization_pathogen_id` INT DEFAULT NULL,
    `mono_poli_microbial` TINYINT DEFAULT NULL COMMENT '0=Monomicrobial, 1=Polymicrobial',
    `combination_therapy` TINYINT DEFAULT NULL COMMENT '0=No, 1=Yes',
    `date_targeted_therapy` DATE DEFAULT NULL,
    `time_to_appropriate_therapy` INT DEFAULT NULL COMMENT 'Days',
    `outcome` TINYINT DEFAULT NULL COMMENT '0=Non-survivor, 1=Survivor',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_patients_ward` (`ward_of_admission_id`),
    INDEX `idx_patients_rectal_pathogen` (`rectal_colonization_pathogen_id`),
    CONSTRAINT `fk_patients_ward` FOREIGN KEY (`ward_of_admission_id`)
        REFERENCES `wards_of_admission`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_patients_rectal_pathogen` FOREIGN KEY (`rectal_colonization_pathogen_id`)
        REFERENCES `bsi_pathogens`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient isolation sites (1:N relationship)
CREATE TABLE `patient_isolation_sites` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_id` INT NOT NULL,
    `site_of_isolation_id` INT NOT NULL,
    `pathogen_order` TINYINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_patient_pathogen_order` (`patient_id`, `pathogen_order`),
    INDEX `idx_pis_patient` (`patient_id`),
    INDEX `idx_pis_site` (`site_of_isolation_id`),
    CONSTRAINT `fk_pis_patient` FOREIGN KEY (`patient_id`)
        REFERENCES `patients`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pis_site` FOREIGN KEY (`site_of_isolation_id`)
        REFERENCES `sites_of_isolation`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient BSI causative pathogens (1:N with patient)
CREATE TABLE `patient_bsi_pathogens` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_id` INT NOT NULL,
    `bsi_pathogen_id` INT NOT NULL,
    `pathogen_order` TINYINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_patient_bsi_order` (`patient_id`, `pathogen_order`),
    INDEX `idx_pbp_patient` (`patient_id`),
    INDEX `idx_pbp_pathogen` (`bsi_pathogen_id`),
    CONSTRAINT `fk_pbp_patient` FOREIGN KEY (`patient_id`)
        REFERENCES `patients`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pbp_pathogen` FOREIGN KEY (`bsi_pathogen_id`)
        REFERENCES `bsi_pathogens`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient BSI resistance profiles (1:N per BSI pathogen)
CREATE TABLE `patient_bsi_resistance_profiles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_bsi_pathogen_id` INT NOT NULL,
    `resistance_profile_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_pbrp_bsi` (`patient_bsi_pathogen_id`),
    INDEX `idx_pbrp_profile` (`resistance_profile_id`),
    CONSTRAINT `fk_pbrp_bsi` FOREIGN KEY (`patient_bsi_pathogen_id`)
        REFERENCES `patient_bsi_pathogens`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pbrp_profile` FOREIGN KEY (`resistance_profile_id`)
        REFERENCES `resistance_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient BSI AST results (per BSI pathogen, per antibiotic: AST value + MIC value)
CREATE TABLE `patient_bsi_ast_results` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_bsi_pathogen_id` INT NOT NULL,
    `ast_antibiotic_id` INT NOT NULL,
    `ast_value` TINYINT DEFAULT NULL COMMENT '0=Not available, 1=Resistant, 2=Susceptible, 3=Intermediate',
    `mic_value` VARCHAR(20) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_bsi_ast` (`patient_bsi_pathogen_id`, `ast_antibiotic_id`),
    INDEX `idx_pbar_bsi` (`patient_bsi_pathogen_id`),
    INDEX `idx_pbar_antibiotic` (`ast_antibiotic_id`),
    CONSTRAINT `fk_pbar_bsi` FOREIGN KEY (`patient_bsi_pathogen_id`)
        REFERENCES `patient_bsi_pathogens`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pbar_antibiotic` FOREIGN KEY (`ast_antibiotic_id`)
        REFERENCES `ast_antibiotics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient empirical therapies (1:N relationship)
CREATE TABLE `patient_empirical_therapies` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_id` INT NOT NULL,
    `antimicrobial_therapy_id` INT NOT NULL,
    `therapy_order` TINYINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_patient_empirical_order` (`patient_id`, `therapy_order`),
    INDEX `idx_pet_patient` (`patient_id`),
    INDEX `idx_pet_therapy` (`antimicrobial_therapy_id`),
    CONSTRAINT `fk_pet_patient` FOREIGN KEY (`patient_id`)
        REFERENCES `patients`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pet_therapy` FOREIGN KEY (`antimicrobial_therapy_id`)
        REFERENCES `antimicrobial_therapies`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient targeted therapies (1:N relationship)
CREATE TABLE `patient_targeted_therapies` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_id` INT NOT NULL,
    `antimicrobial_therapy_id` INT NOT NULL,
    `therapy_order` TINYINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_patient_targeted_order` (`patient_id`, `therapy_order`),
    INDEX `idx_ptt_patient` (`patient_id`),
    INDEX `idx_ptt_therapy` (`antimicrobial_therapy_id`),
    CONSTRAINT `fk_ptt_patient` FOREIGN KEY (`patient_id`)
        REFERENCES `patients`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ptt_therapy` FOREIGN KEY (`antimicrobial_therapy_id`)
        REFERENCES `antimicrobial_therapies`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient infectious complication pathogens (1:N with patient)
CREATE TABLE `patient_ic_pathogens` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_id` INT NOT NULL,
    `bsi_pathogen_id` INT NOT NULL,
    `pathogen_order` TINYINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_patient_ic_order` (`patient_id`, `pathogen_order`),
    INDEX `idx_pic_patient` (`patient_id`),
    INDEX `idx_pic_pathogen` (`bsi_pathogen_id`),
    CONSTRAINT `fk_pic_patient` FOREIGN KEY (`patient_id`)
        REFERENCES `patients`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pic_pathogen` FOREIGN KEY (`bsi_pathogen_id`)
        REFERENCES `bsi_pathogens`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient IC resistance profiles (1:N per IC pathogen)
CREATE TABLE `patient_ic_resistance_profiles` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_ic_pathogen_id` INT NOT NULL,
    `resistance_profile_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_picrp_ic` (`patient_ic_pathogen_id`),
    INDEX `idx_picrp_profile` (`resistance_profile_id`),
    CONSTRAINT `fk_picrp_ic` FOREIGN KEY (`patient_ic_pathogen_id`)
        REFERENCES `patient_ic_pathogens`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_picrp_profile` FOREIGN KEY (`resistance_profile_id`)
        REFERENCES `resistance_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient IC AST results (per IC pathogen, per antibiotic: AST value + MIC value)
CREATE TABLE `patient_ic_ast_results` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `patient_ic_pathogen_id` INT NOT NULL,
    `ast_antibiotic_id` INT NOT NULL,
    `ast_value` TINYINT DEFAULT NULL COMMENT '0=Not available, 1=Resistant, 2=Susceptible, 3=Intermediate',
    `mic_value` VARCHAR(20) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_ic_ast` (`patient_ic_pathogen_id`, `ast_antibiotic_id`),
    INDEX `idx_picar_ic` (`patient_ic_pathogen_id`),
    INDEX `idx_picar_antibiotic` (`ast_antibiotic_id`),
    CONSTRAINT `fk_picar_ic` FOREIGN KEY (`patient_ic_pathogen_id`)
        REFERENCES `patient_ic_pathogens`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_picar_antibiotic` FOREIGN KEY (`ast_antibiotic_id`)
        REFERENCES `ast_antibiotics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
