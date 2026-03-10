-- sissoftware seed data

SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `sissoftware`;

-- Wards of admission (id from 0)
INSERT INTO `wards_of_admission` (`id`, `name`) VALUES
    (0, 'Medical'),
    (1, 'Surgical'),
    (2, 'Geriatric'),
    (3, 'Intensive Care Unit - ICU');

-- Sites of isolation (id from 0)
INSERT INTO `sites_of_isolation` (`id`, `name`) VALUES
    (0, 'Blood'),
    (1, 'Urine'),
    (2, 'Sputum and Bronchoaspirate'),
    (3, 'Pus'),
    (4, 'Abdominal Drainage Fluid'),
    (5, 'Urinary catheter Tip');

-- Antimicrobial therapies (IDs match Excel dictionary)
INSERT INTO `antimicrobial_therapies` (`id`, `name`) VALUES
    (0, 'Not administered'),
    (1, 'Piperacillin/Tazobactam'),
    (2, 'Ceftriaxone'),
    (3, 'Cefepime'),
    (4, 'Ceftazidime'),
    (5, 'Ampicillin/Sulbactam'),
    (6, 'Aztreonam'),
    (7, 'Meropenem'),
    (8, 'Imipenem'),
    (9, 'Ceftazidime/Avibactam'),
    (10, 'Cefiderocol'),
    (11, 'Meropenem/Vaborbactam'),
    (12, 'Ceftolozane/Tazobactam'),
    (13, 'Imipenem/Relebactam'),
    (14, 'Colistin'),
    (15, 'Tigecycline'),
    (16, 'Gentamicin'),
    (17, 'Ciprofloxacin'),
    (18, 'Levofloxacin'),
    (19, 'Trimethoprim/Sulfamethoxazole'),
    (20, 'Vancomycin'),
    (21, 'Clindamycin'),
    (22, 'Amoxicillin-Clavulanate'),
    (23, 'Amikacin'),
    (24, 'Ertapenem'),
    (25, 'Fosfomycin');

-- BSI causative pathogens (IDs match Excel dictionary)
INSERT INTO `bsi_pathogens` (`id`, `name`) VALUES
    (0, 'Klebsiella pneumoniae'),
    (1, 'Pseudomonas aeruginosa'),
    (2, 'Escherichia coli'),
    (3, 'Acinetobacter baumannii'),
    (4, 'Clostridium Difficile'),
    (5, 'Proteus mirabilis');

-- Resistance profiles (IDs match Excel dictionary)
INSERT INTO `resistance_profiles` (`id`, `name`) VALUES
    (0, 'KPC producer'),
    (1, 'NDM producer'),
    (2, 'ESBL producer'),
    (3, 'OXA-48 producer'),
    (4, 'AMC positive'),
    (5, 'MDR');

-- AST antibiotics (IDs match Excel dictionary)
INSERT INTO `ast_antibiotics` (`id`, `name`) VALUES
    (0, 'Ampicillin'),
    (1, 'Cefuroxime'),
    (2, 'Amoxicillin-Clavulanate'),
    (3, 'Piperacillin-Tazobactam'),
    (4, 'Cefotaxime'),
    (5, 'Ceftriaxone'),
    (6, 'Ceftazidime'),
    (7, 'Cefepime'),
    (8, 'Gentamicin'),
    (9, 'Tobramycin'),
    (10, 'Amikacin'),
    (11, 'Ciprofloxacin'),
    (12, 'Levofloxacin'),
    (13, 'Trimethoprim/Sulfamethoxazole');

-- Patients (with all data from Excel)
INSERT INTO `patients` (`id`, `name`, `internal_id`, `date_of_birth`, `sex`, `ward_of_admission_id`, `bsi_onset`, `bsi_diagnosis_date`, `sofa_score`, `charlson_comorbidity_index`, `rectal_colonization_status`, `rectal_colonization_pathogen_id`, `mono_poli_microbial`, `combination_therapy`, `date_targeted_therapy`, `time_to_appropriate_therapy`, `outcome`) VALUES
    (0, 'Đorđe Ugrinović', '1350', '1954-01-11', 1, 0, 0, '2022-04-21', 9, 8, 0, NULL, 1, 0, '2022-05-03', NULL, 1),
    (1, 'Radić Jovanović', NULL, '1940-12-10', 1, 0, 1, '2022-06-03', 3, 7, 0, NULL, 1, 1, '2022-06-07', NULL, NULL),
    (2, 'Ante Bekavac', '1544', '1943-09-16', 1, 0, 1, '2022-06-06', 3, 9, 0, NULL, 0, 0, '2022-05-11', NULL, 1);

-- Patient isolation sites
INSERT INTO `patient_isolation_sites` (`patient_id`, `site_of_isolation_id`, `pathogen_order`) VALUES
    (0, 0, 1),  -- Đorđe: Blood, 1st
    (0, 1, 2),  -- Đorđe: Urine, 2nd
    (1, 0, 1),  -- Radić: Blood, 1st
    (1, 0, 2),  -- Radić: Blood, 2nd
    (1, 5, 3),  -- Radić: Urinary catheter Tip, 3rd
    (2, 0, 1);  -- Ante: Blood, 1st

-- Patient BSI causative pathogens
INSERT INTO `patient_bsi_pathogens` (`id`, `patient_id`, `bsi_pathogen_id`, `pathogen_order`) VALUES
    (0, 0, 2, 1),  -- Đorđe: E.coli, 1st
    (1, 0, 1, 2),  -- Đorđe: Pseudomonas, 2nd
    (2, 1, 2, 1),  -- Radić: E.coli, 1st
    (3, 1, 5, 2),  -- Radić: Proteus mirabilis, 2nd
    (4, 1, 1, 3),  -- Radić: Pseudomonas, 3rd
    (5, 2, 5, 1);  -- Ante: Proteus mirabilis, 1st

-- Patient BSI resistance profiles (per BSI pathogen)
INSERT INTO `patient_bsi_resistance_profiles` (`patient_bsi_pathogen_id`, `resistance_profile_id`) VALUES
    (0, 2),  -- Đorđe 1st (E.coli): ESBL producer
    (1, 5),  -- Đorđe 2nd (Pseudomonas): MDR
    (2, 4),  -- Radić 1st (E.coli): AMC positive
    (3, 5),  -- Radić 2nd (Proteus): MDR
    (3, 4),  -- Radić 2nd (Proteus): AMC positive
    (3, 2),  -- Radić 2nd (Proteus): ESBL producer
    (4, 4),  -- Radić 3rd (Pseudomonas): AMC positive
    (5, 2),  -- Ante 1st (Proteus): ESBL producer
    (5, 4);  -- Ante 1st (Proteus): AMC positive

-- Patient empirical therapies
INSERT INTO `patient_empirical_therapies` (`patient_id`, `antimicrobial_therapy_id`, `therapy_order`) VALUES
    (0, 7, 1),  -- Đorđe: Meropenem
    (1, 7, 1),  -- Radić: Meropenem
    (2, 7, 1);  -- Ante: Meropenem

-- Patient targeted therapies
INSERT INTO `patient_targeted_therapies` (`patient_id`, `antimicrobial_therapy_id`, `therapy_order`) VALUES
    (0, 12, 1),  -- Đorđe: Ceftolozane/Tazobactam
    (1, 7, 1),   -- Radić: Meropenem (1st)
    (1, 25, 2),  -- Radić: Fosfomycin (2nd)
    (2, 24, 1);  -- Ante: Ertapenem
