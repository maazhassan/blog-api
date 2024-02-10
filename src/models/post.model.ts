import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare author: string;
  declare description: string;
  declare content: string;
}

export default (sequelize: Sequelize) => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
      }
    },
    {
      sequelize
    }
  );
};