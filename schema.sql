CREATE TABLE people (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username VARCHAR,
	password TEXT,
	image TEXT

);
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT, 
  entry TEXT,
  votes INTEGER,
  people_id INTEGER,
  FOREIGN KEY (people_id) REFERENCES people(id)
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT,
  posts_id INTEGER,
  people_id INTEGER,
  FOREIGN KEY (posts_id) REFERENCES posts(id),
  FOREIGN KEY (people_id) REFERENCES people(id)

);

INSERT INTO people(username, password, image) VALUES ("QueenB", "password", "https://pbs.twimg.com/profile_images/378800000689579611/9d6a1dba9a81eae0defa6b40562e095e.png");
INSERT INTO comments(message, posts_id, people_id) VALUES ("hey good job", 1, 1);
