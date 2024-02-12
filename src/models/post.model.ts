import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare filename: string;
  declare title: string;
  declare author: string;
  declare description: string;
  declare content: string;
  declare thumbnail: CreationOptional<string>;
}

export default (sequelize: Sequelize) => {
  Post.init(
    {
      filename: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize
    }
  );
};