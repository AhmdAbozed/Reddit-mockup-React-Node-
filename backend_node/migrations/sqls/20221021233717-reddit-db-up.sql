/* Replace with your SQL commands */
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR, email VARCHAR, password VARCHAR, karma INTEGER);
CREATE TABLE subreddits (id SERIAL PRIMARY KEY, title VARCHAR,owner_id INTEGER REFERENCES users(id), subtype VARCHAR, members VARCHAR, creation_date DATE);
CREATE TABLE subreddit_members (id SERIAL PRIMARY KEY, subreddit_id INTEGER REFERENCES subreddits(id), member_id INTEGER REFERENCES users(id)) 
CREATE TABLE posts (id SERIAL PRIMARY KEY, op INTEGER REFERENCES users(id) ON DELETE CASCADE, title VARCHAR, text VARCHAR, img VARCHAR, votes VARCHAR, subreddit_id INTEGER REFERENCES subreddits(id) ON DELETE CASCADE);
CREATE TABLE comments (id SERIAL PRIMARY KEY, post_id INTEGER REFERENCES posts(id), commentor VARCHAR, content VARCHAR, votes VARCHAR);
CREATE TABLE refreshtokens(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), token VARCHAR)
