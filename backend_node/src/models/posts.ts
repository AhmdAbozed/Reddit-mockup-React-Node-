
import client from '../database.js'


export type post = {
    id?: Number;
    op:string;
    title: string;
    text: string;
    img: string;
    votes: Number;
    subreddit_id: string;
}

export class postsStore {
    async index(): Promise<post[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM posts';
            const results = await conn.query(sql);
            conn.release();
            //@ts-ignore
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async create(post: post): Promise<post> {
        try {

            const conn = await client.connect();
            const sql = 'INSERT INTO posts (op, title, text, img, votes, subreddit_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const results = await conn.query(sql, [post.op, post.title, post.text, post.img, post.votes, post.subreddit_id]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async read(id: string): Promise<post> {
        try {
            
            const conn = await client.connect();
            const sql = 'SELECT * FROM posts WHERE id=($1)';
            const results = await conn.query(sql, [id]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }
    
    async subredditPosts(subredditID: string): Promise<post[]> {
        try {
            console.log(subredditID)
            const conn = await client.connect();
            const sql = 'SELECT * FROM posts WHERE subreddit_id=($1)';
            const results = await conn.query(sql, [subredditID]);
            conn.release();
            
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async delete(id: string): Promise<post> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM posts WHERE id=($1) RETURNING *';
            const results = await conn.query(sql, [Number(id)]);
            conn.release();
            //@ts-ignore
            return results;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }
}
