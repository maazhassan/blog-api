import { Sequelize } from "sequelize";
import postModel from "../models/post.model";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db/database.sqlite",
});

postModel(sequelize);

export default sequelize;