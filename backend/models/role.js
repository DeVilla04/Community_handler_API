import { DataTypes } from "sequelize";
import sequelize from "../db.js";
// import Member from "./member.js";

const Role = sequelize.define(
  "role",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { timestamps: true }
);

// // relationships
// Role.associate = (models) => {
//   Role.hasMany(models.Member, {
//     foreignKey: "role",
//     as: "members",
//   });
// };

// Role.hasMany(Member, {
//   foreignKey: "role",
//   as: "members",
// });
// Role.associate(sequelize.models);

// Role.sync({ alter: true });
export default Role;
