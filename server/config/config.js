import dotenv from "dotenv";
dotenv.config();

const base = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
};

export default {
  development: base,
  production: base,
};
