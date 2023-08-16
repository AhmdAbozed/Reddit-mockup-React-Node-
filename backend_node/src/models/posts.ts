
import client from '../database.js'


export type post = {
    id?: Number;
    op_id: Number;
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
            const results = await conn.query(sql, [post.op_id, post.title, post.text, post.img, post.votes, post.subreddit_id]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }
    /*
            async read(id: number): Promise<post>{
                    const conn = await client.connect();
                    const sql = `SELECT op, posts.title post_title, img, text, votes, subreddit_id, subreddits.title subreddit_title, members 
                    FROM POSTS JOIN subreddits ON posts.id = 5 AND posts.subreddit_id=subreddits.id`;
                    const results = await conn.query(sql, [id]);
                    conn.release();
                    //@ts-ignore
                    return results.rows[0];
            }
    */
    async subredditPosts(subredditID: number): Promise<post[]> {
        const conn = await client.connect();
        const sql = 'SELECT posts.id, posts.op, posts.title, posts.votes, posts.subreddit_id, users.username FROM posts JOIN users ON posts.subreddit_id=($1) AND users.id=posts.op';
        const results = await conn.query(sql, [subredditID]);
        conn.release();
        return results.rows;

    }

    async delete(id: number): Promise<post> {
        const conn = await client.connect();
        const sql = 'DELETE FROM posts WHERE id=($1) RETURNING *';
        const results = await conn.query(sql, [Number(id)]);
        conn.release();
        //@ts-ignore
        return results;

    }
    voteChange(vote: number, old: number) {
        console.log("inside Votechange: " + vote + " " + old)
        switch (old) {
            case 0: return vote;
            case 1: if (vote == 1) return 0; else if (vote == 0) return -1; else return -2;
            case -1: if (vote == 1) return 2; else if (vote == 0) return 1; else return 0;
        }
    }
    async submitVote(post_id: number, user_id: number, subreddit_id: number, vote: number): Promise<boolean> {

        console.log("about to upvote post: " + post_id + " " + user_id)
        const conn = await client.connect();
        //insert the upvote instance, if one already exists, update it and return the vote
        let sql = 'INSERT INTO post_upvotes (post_id, user_id, subreddit_id, vote) VALUES ($1, $2, $3, $4) ON CONFLICT (post_id, user_id) DO UPDATE SET vote=($4) RETURNING (SELECT vote FROM post_upvotes WHERE post_id=($1) AND user_id=($2)) ';
        const results = await conn.query(sql, [post_id, user_id, subreddit_id, vote]).catch(err => { console.error(err) })
        console.log("result of vote query: " + JSON.stringify(results))
        if (results!.rows) {
            console.log("ABOUT TO UPDATE VOTE")

            this.updateVoteCount(results!.rows[0].vote, vote, post_id, conn)
            conn.release();
            return true
        } else {
            conn.release();
            return false
        }

    }

    async deleteVote(post_id: number, user_id: number, subreddit_id: number, vote: number) {
        console.log("about to delete vote post: " + post_id + " " + user_id)
        const conn = await client.connect();
        //insert the upvote instance
        let sql = 'DELETE FROM post_upvotes WHERE post_id=($1) AND user_id=($2) RETURNING (SELECT vote FROM post_upvotes WHERE post_id=($1) AND user_id=($2)) ';
        const results = await conn.query(sql, [post_id, user_id]).catch(err => { console.error(err) })
        console.log("result of delete vote query: " + JSON.stringify(results))
        if (results!.rows) {
            console.log("ABOUT TO UPDATE VOTE (AFTER DELETION)")

            this.updateVoteCount(results!.rows[0].vote, vote, post_id, conn)
            conn.release();
            return true
        }
        conn.release();
        return false
    }

    private async updateVoteCount(oldVote: number, newVote: number, post_id: number, conn: any) {

        //if oldvote is undefined, that means there was no old vote (unvoted), which isn't recorded hence the undefined
        if (!oldVote) oldVote = 0;

        if (Number.isInteger(newVote) && post_id) {
            //See effect of vote on vote count
            const voteCountChange = this.voteChange(newVote, oldVote)
            console.log("votecountchange: " + voteCountChange)
            //change the vote count
            const sql = 'UPDATE posts SET votes = votes + ($1) WHERE id=($2) RETURNING *'
            const result = await conn.query(sql, [voteCountChange, post_id])
            console.log("update vote result: " + result.rows[0]);

            return true
        }
        return false

    }

    async userVotes(subreddit_id: number, user_id: number): Promise<post[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM post_upvotes WHERE subreddit_id=($1) AND user_id=($2)';
        const results = await conn.query(sql, [subreddit_id, user_id]);
        conn.release();
        return results.rows;
    }

}
