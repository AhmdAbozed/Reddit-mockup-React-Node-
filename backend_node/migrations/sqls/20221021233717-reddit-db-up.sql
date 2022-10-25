/* Replace with your SQL commands */
CREATE TABLE subreddits (id SERIAL PRIMARY KEY, title VARCHAR, members VARCHAR);
CREATE TABLE posts (id SERIAL PRIMARY KEY, op VARCHAR, title VARCHAR, text VARCHAR, img VARCHAR, votes VARCHAR, subreddit_id INTEGER REFERENCES subreddits(id) ON DELETE CASCADE);
CREATE TABLE comments (id SERIAL PRIMARY KEY, post_id INTEGER REFERENCES posts(id), commentor VARCHAR, content VARCHAR, votes VARCHAR);