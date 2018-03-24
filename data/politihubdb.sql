--Simply copy the following into your mySQL

create database politihub;

use politihub;

CREATE USER 'void'@'localhost' IDENTIFIED BY 'lemain';

GRANT ALL ON politihub.* TO 'void'@'localhost' IDENTIFIED BY 'lemain';

create table politician (
id int AUTO_INCREMENT not null,
legalName varchar(70) not null,
twitterAtName varchar(70) null,
facebookId varchar(70) null,
instagramId varchar(70) null,
isVerified bit not null,
isPersonal bit not null,
description varchar(280) null,
country varchar(50) null,
position varchar(100) null,
state_prov varchar(50) null,
profileImgUrl varchar(300) null,
PRIMARY KEY (id)
);
SELECT * FROM politician;

create table user(
id int AUTO_INCREMENT not null,
username varchar(70) not null,
password varchar(70) not null,
firstname varchar(70) not null,
lastname varchar(70) not null,
email varchar(70) not null,
isAdmin bit not null,
PRIMARY KEY (id)
);

create table user_politician (
 id int auto_increment not null,
 userId int not null,
 politicianId int not null,
 PRIMARY KEY (id)
);

-- HERE STARTS INSERTS TO DB
use politihub;

-- POLITICIANS
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Donald J. Trump', 'realDonaldTrump', null, null, true, true, null, 'USA', '45th President of the United States', null, 'http://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Bernie Sanders', 'SenSanders', null, null, true, true, null, 'USA', 'Senator', 'Vermont', '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Bernie Sanders', 'Bernie Sanders', null, null, true, true, null, 'USA', 'Senator', 'Vermont', '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Donald Trump', 'POTUS', null, null, true, false, null, 'USA', '45th President of the United States', null, '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Justin Trudeau', 'JustinTrudeau', null, null, true, true, null, 'Canada', 'Prime Minister of Canada', null, '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Barack Obama', 'BarackObama', null, null, true, true, null, 'USA', '44th President of the United States', null, '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Joe Biden', 'JoeBiden', null, null, true, true, null, 'USA', 'Ex Vice President of the United States', null, '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Mike Pence', 'VP', null, null, true, false, null, 'USA', 'Vice President of the United States', null, '');
INSERT INTO politician (legalName, twitterAtName, facebookId, instagramId, isVerified, isPersonal, description, country, position, state_prov, profileImgUrl)
  VALUES ('Mike Pence', 'mike_pence', null, null, true, true, null, 'USA', 'Vice President of the United States', null, '');

-- USERS
INSERT INTO user (username, password, firstname, lastname, email, isAdmin) VALUES('admin', 'admin', 'admin', 'admin', 'admin@politihub.com', true);
