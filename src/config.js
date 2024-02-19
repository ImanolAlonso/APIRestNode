import { config } from "dotenv";

config();

export default {
    host: process.env.MYSQLDB_HOST || "",
    database: process.env.MYSQLDB_BD || "",
    user: process.env.MYSQLDB_USUARIO || "",
    password: process.env.MYSQLDB_PASSWORD || ""
};