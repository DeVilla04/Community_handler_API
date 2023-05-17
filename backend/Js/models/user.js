import { DataTypes } from "sequelize";
import sequelize from "../db.js";
// import Community from "./community.js";
// import Member from "./member.js";

const User = sequelize.define(
  "user", // table name
  {
    id: {
      // define the columns
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: true } // add timestamps
);

// // relationships
// User.associate = (models) => {
//   User.hasMany(models.Community, {
//     foreignKey: "owner",
//     as: "communities",
//   });
//   User.hasMany(models.Member, {
//     foreignKey: "user",
//     as: "members",
//   });
// };

// User.hasMany(Community, {
//   foreignKey: "owner",
//   as: "communities",
// });
// User.hasMany(Member, {
//   foreignKey: "user",
//   as: "members",
// });
// User.associate(sequelize.models);

// User.sync({ alter: true });
export default User;
