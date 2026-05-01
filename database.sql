-- =============================================================
-- database.sql
-- Helmet AI — Web Programming 2 Assignment
-- Same schema as the M1 ERD (workers, helmets, sensor_readings, alerts)
-- + a small users table for the website login
-- =============================================================

CREATE DATABASE IF NOT EXISTS smart_helmet_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE smart_helmet_db;

-- Drop child tables first
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS sensor_readings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS helmets;
DROP TABLE IF EXISTS workers;

-- =============================================================
-- Table 1: workers (the people who wear the helmet)
-- =============================================================
CREATE TABLE workers (
    worker_id   INT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(20)  NOT NULL UNIQUE,
    full_name   VARCHAR(100) NOT NULL,
    age         INT,
    job_title   VARCHAR(50)  NOT NULL,
    phone       VARCHAR(20)  UNIQUE,
    hired_at    DATE         NOT NULL DEFAULT (CURRENT_DATE),
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- Table 2: helmets (the smart helmet device)
-- =============================================================
CREATE TABLE helmets (
    helmet_id        VARCHAR(20)  PRIMARY KEY,
    worker_id        INT,
    model            VARCHAR(50)  NOT NULL DEFAULT 'SH-Pi-Zero2W',
    firmware_version VARCHAR(20)  NOT NULL,
    status           ENUM('active','offline','maintenance') NOT NULL DEFAULT 'offline',
    assigned_at      DATETIME,
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id) ON DELETE SET NULL
);

-- =============================================================
-- Table 3: sensor_readings (telemetry from each helmet)
-- =============================================================
CREATE TABLE sensor_readings (
    reading_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    helmet_id       VARCHAR(20)  NOT NULL,
    temperature_c   DECIMAL(5,2),
    pressure_hpa    DECIMAL(7,2),
    gas_adc         INT,
    distance_mm     INT,
    tilt_deg        DECIMAL(5,2),
    imu_magnitude_g DECIMAL(5,3),
    battery_v       DECIMAL(4,2),
    wifi_rssi       INT,
    recorded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (helmet_id) REFERENCES helmets(helmet_id) ON DELETE CASCADE
);

-- =============================================================
-- Table 4: alerts (safety events)
-- =============================================================
CREATE TABLE alerts (
    alert_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    helmet_id    VARCHAR(20) NOT NULL,
    reading_id   BIGINT,
    type         ENUM('gas','fall','tilt','proximity','battery_low') NOT NULL,
    level        ENUM('warning','danger') NOT NULL DEFAULT 'warning',
    message      VARCHAR(255),
    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (helmet_id)  REFERENCES helmets(helmet_id)         ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES sensor_readings(reading_id) ON DELETE SET NULL
);

-- =============================================================
-- Table 5: users (website login — links to workers)
-- =============================================================
CREATE TABLE users (
    user_id   INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(50) NOT NULL UNIQUE,
    password  VARCHAR(50) NOT NULL,
    worker_id INT UNIQUE,
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id) ON DELETE SET NULL
);

-- =============================================================
-- Sample data
-- =============================================================
INSERT INTO workers (national_id, full_name, age, job_title, phone) VALUES
('29801011234567', 'Ziad Emad',          22, 'Site Engineer',        '01012345678'),
('29710159876543', 'Mohamed Ashraf',     23, 'Safety Officer',       '01098765432'),
('29905052468135', 'Mostafa Ahmed',      30, 'Field Technician',     '01012653799'),
('30005052468135', 'Sara Mohamed Eid',   20, 'Junior Site Engineer', '01070086281');

INSERT INTO helmets (helmet_id, worker_id, model, firmware_version, status, assigned_at) VALUES
('HLM-001', 1, 'SH-Pi-Zero2W', '1.4.2', 'active',      '2026-01-15 08:00:00'),
('HLM-002', 2, 'SH-Pi-Zero2W', '1.4.2', 'active',      '2026-01-20 09:30:00'),
('HLM-003', 3, 'SH-Pi-Zero2W', '1.3.9', 'maintenance', '2026-02-01 10:00:00'),
('HLM-004', 4, 'SH-Pi-Zero2W', '1.4.2', 'active',      '2026-04-29 09:00:00');

INSERT INTO sensor_readings
       (helmet_id, temperature_c, pressure_hpa, gas_adc, distance_mm, tilt_deg, imu_magnitude_g, battery_v, wifi_rssi)
VALUES
('HLM-001', 32.50, 1013.20, 120, 2500, 12.40, 1.020, 3.95, -55),
('HLM-001', 33.10, 1013.10, 130, 2480,  8.60, 0.985, 3.92, -58),
('HLM-002', 28.70, 1012.80,  95, 3000,  3.20, 1.005, 4.05, -62),
('HLM-002', 29.10, 1012.50, 410, 2800,  5.10, 0.998, 4.02, -60),
('HLM-003', 35.40, 1011.90, 110,  900, 45.30, 1.450, 3.75, -70),
('HLM-004', 27.80, 1013.50, 105, 3200,  4.20, 1.012, 4.10, -52),
('HLM-004', 28.10, 1013.30, 110, 3100,  3.80, 0.997, 4.08, -54),
('HLM-004', 28.40, 1013.40,  98, 3050,  4.50, 1.005, 4.06, -53);

INSERT INTO alerts (helmet_id, reading_id, type, level, message) VALUES
('HLM-002', 4, 'gas',       'warning', 'Gas level above warning threshold'),
('HLM-003', 5, 'tilt',      'danger',  'High tilt detected — possible fall'),
('HLM-003', 5, 'proximity', 'warning', 'Worker too close to obstacle');

-- Login accounts (linked to workers)
INSERT INTO users (username, password, worker_id) VALUES
('ziad',    'ziad2024',   1),
('ashraf',  'ashraf2024', 2),
('mostafa', 'admin123',   3),
('sara',    'sara2024',   4);
