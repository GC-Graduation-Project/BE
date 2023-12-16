import Sequelize from "sequelize";
import Musicsheet from "./musicsheet.js";
import config from "../config/config.json" assert { type: "json" };

const env = process.env.NODE_ENV || "development";

const db = {};
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

db.sequelize = sequelize;
db.Musicsheet = Musicsheet;

Musicsheet.initiate(sequelize);

export default db;
