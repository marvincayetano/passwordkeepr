INSERT INTO users (email, password) VALUES
('randomguyfromcaainsurance@caa.com', 'IloveInsurance'),
('sandwichartist@subway.com', 'FootlongMeatball'),
('timmy@timhortons.ca', 'doubleDoublePlease'),
('winwin@winners.ca', 'hellYeahSir'),
('szym40@bookez.site', 'railroad25'),
('paimuchin@hanzganteng.tk', 'helldsakfjeahSir'),
('whoareyou@gymshark.ca', 'steroidBoy');

INSERT INTO category (name, description) VALUES
('Social', 'Social Media (eg. Facebook, Twitter, Instagram, etc)'),
('Work', 'Work Related'),
('Entertainment', 'Entertainment (eg. Youtube, Netflix, etc)');

INSERT INTO organizations(name, description, creator_id) VALUES
('Lighthouse Labs Student', 'Organization for students of lighthouse labs', 1);

UPDATE users SET organization_id=1 WHERE id=1;
