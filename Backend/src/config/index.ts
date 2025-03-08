import path from "path";
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const config = {
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default config;
