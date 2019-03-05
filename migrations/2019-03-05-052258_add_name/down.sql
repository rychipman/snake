-- This file should undo anything in `up.sql`
DROP TABLE scores;
CREATE TABLE scores (
  id INTEGER PRIMARY KEY NOT NULL,
  score INTEGER NOT NULL,
  email TEXT
);
