/* Replace with your SQL commands */
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR, email VARCHAR, password VARCHAR, karma INTEGER);
CREATE TABLE subreddits (id SERIAL PRIMARY KEY, title VARCHAR, owner_id INTEGER REFERENCES users(id), subtype VARCHAR, members INTEGER, creation_date DATE);
CREATE TABLE posts (id SERIAL PRIMARY KEY, op INTEGER REFERENCES users(id) ON DELETE CASCADE, title VARCHAR, text VARCHAR, img VARCHAR, votes INTEGER, subreddit_id INTEGER REFERENCES subreddits(id) ON DELETE CASCADE);
INSERT INTO users ("username", "email", "password") VALUES ('admin', 'admin@admin.com', '$2b$08$xXjMfpkirSBsLbTqW5thtOMDQzyJzb6XfSZ1fXa0X3mq1udIfQ83y');
INSERT INTO subreddits ("title", "owner_id", "subtype", "members", "creation_date") VALUES ('TestSub', 1, 'idk', 1, '2/17/2023');
INSERT INTO subreddits ("title", "owner_id", "subtype", "members", "creation_date") VALUES ('TestSub #2', 1, 'idk', 1, '2/17/2023');

INSERT INTO subreddits ("title", "owner_id", "subtype", "members", "creation_date") VALUES ('TestSub #3', 1, 'idk', 1, '2/17/2023');

INSERT INTO posts ("op", "title", "img", "votes", "subreddit_id") VALUES (1, 'TestPost', '31', 10, 1);
CREATE TABLE subreddit_members (id SERIAL PRIMARY KEY, subreddit_id INTEGER REFERENCES subreddits(id), member_id INTEGER REFERENCES users(id), UNIQUE(subreddit_id, member_id));
CREATE TABLE post_upvotes (id SERIAL PRIMARY KEY, post_id INTEGER REFERENCES posts(id), user_id INTEGER REFERENCES users(id), subreddit_id INTEGER REFERENCES subreddits(id), vote INTEGER, UNIQUE(post_id, user_id));
CREATE TABLE comments (id SERIAL PRIMARY KEY, post_id INTEGER REFERENCES posts(id), parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE , user_id INTEGER REFERENCES users(id), text VARCHAR, votes INTEGER);
INSERT INTO comments ("post_id", "user_id", "text") VALUES (1, 1, 'first comment');
INSERT INTO comments ("post_id", "parent_id", "user_id", "text") VALUES (1, 1, 1, 'child of first comment');
CREATE TABLE comment_upvotes (id SERIAL PRIMARY KEY, comment_id INTEGER REFERENCES comments(id), user_id INTEGER REFERENCES users(id), post_id INTEGER REFERENCES posts(id), vote INTEGER, UNIQUE(comment_id, user_id));
CREATE TABLE refreshtokens(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), token VARCHAR);
