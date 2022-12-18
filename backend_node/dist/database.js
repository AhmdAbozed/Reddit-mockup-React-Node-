import dotenv from 'dotenv';
import pg from "pg";
var Pool = pg.Pool;
var client = new Pool();
dotenv.config();
var _a = process.env, PG_HOST = _a.PG_HOST, PG_DB = _a.PG_DB, PG_TEST_DB = _a.PG_TEST_DB, PG_USER = _a.PG_USER, PG_PASS = _a.PG_PASS, ENV = _a.ENV;
if (ENV == 'dev') {
    client = new Pool({
        host: PG_HOST,
        database: PG_DB,
        user: PG_USER,
        password: PG_PASS
    });
}
export default client;
