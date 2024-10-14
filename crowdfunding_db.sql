-- Create a CATEGORY table
CREATE TABLE CATEGORY (
  CATEGORY_ID INT PRIMARY KEY AUTO_INCREMENT,
  NAME VARCHAR(100) NOT NULL
);
-- Create the FUNDRAISER table
CREATE TABLE FUNDRAISER (
  FUNDRAISER_ID INT PRIMARY KEY AUTO_INCREMENT,
  ORGANIZER VARCHAR(255) NOT NULL,
  CAPTION VARCHAR(255),
  TARGET_FUNDING DECIMAL(10, 2),
  CURRENT_FUNDING DECIMAL(10, 2) DEFAULT 0,
  CITY VARCHAR(100),
  ACTIVE BOOLEAN DEFAULT TRUE,
  CATEGORY_ID INT,
  FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID)
);
CREATE TABLE DONATION (
    DONATION_ID INT AUTO_INCREMENT PRIMARY KEY,
    DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    AMOUNT DECIMAL(10, 2) NOT NULL,
    GIVER VARCHAR(255) NOT NULL,
    FUNDRAISER_ID INT,
    FOREIGN KEY (FUNDRAISER_ID) REFERENCES FUNDRAISER(FUNDRAISER_ID)
);
-- Add CATEGORY data
INSERT INTO CATEGORY (NAME) VALUES ('Disaster Relief'), ('Community'),('Medical'), ('Sports'), ('Crisis Relief');
-- Add FUNDRAISER data
INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) 
VALUES 
('Global Aid', 'Hurricane Relief Fund', 25000.00, 18000.00, 'Houston', 1, 2),
('Community Helpers', 'Build Community Garden', 3000.00, 750.00, 'Portland', 1, 1),
('Sports Team', 'Youth Soccer Program', 4000.00, 1200.00, 'Denver', 1, 5),
('Science Innovators', 'Fund New Research', 20000.00, 10000.00, 'Boston', 1, 3),
('Charity Group', 'General Donation Fund', 5000.00, 500.00, 'Miami', 1, 4),
('Relief Group', 'Earthquake Relief', 30000.00, 23000.00, 'Phoenix', 1, 2),
('Neighborhood Assoc.', 'Build New Playground', 4000.00, 1600.00, 'Columbus', 1, 1),
('Athletes Fund', 'Sponsor Athletes', 5000.00, 2500.00, 'Indianapolis', 1, 5),
('Research Hub', 'New Tech Research', 25000.00, 8000.00, 'Detroit', 1, 3),
('Helping Hands', 'Support Various Causes', 6000.00, 1800.00, 'San Antonio', 1, 4);
-- Add data
INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES 
('2024-10-10 01:12:03', 30.00, 'Oscar', 5),
('2024-10-10 02:12:03', 210.00, 'Paul', 6),
('2024-10-10 03:12:03', 130.00, 'Quinn', 7),
('2024-10-10 04:12:03', 40.00, 'Rose', 8),
('2024-10-10 05:12:03', 160.00, 'Sam', 9),
('2024-10-10 06:12:03', 110.00, 'Tina', 10),
('2024-10-10 07:12:03', 35.00, 'Uma', 1),
('2024-10-10 08:12:03', 95.00, 'Victor', 2),
('2024-10-10 09:12:03', 220.00, 'Wendy', 3),
('2024-10-10 10:12:03', 55.00, 'Xander', 4),
('2024-10-10 11:12:03', 105.00, 'Yara', 5),
('2024-10-10 12:12:03', 400.00, 'Zane', 6),
('2024-10-10 13:12:03', 70.00, 'Abby', 7),
('2024-10-10 14:12:03', 145.00, 'Bill', 8),
('2024-10-10 15:12:03', 230.00, 'Cathy', 9),
('2024-10-10 16:12:03', 160.00, 'Dylan', 10);