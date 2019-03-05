-- Your SQL goes here
DROP TABLE scores;
CREATE TABLE scores (
  id INTEGER PRIMARY KEY NOT NULL,
  score INTEGER NOT NULL,
  email TEXT,
  username TEXT
);
