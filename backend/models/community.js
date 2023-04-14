import { DataTypes } from "sequelize";
import sequelize from "../db.js";
// import User from "./user.js";
// import Member from "./member.js";

const Community = sequelize.define(
  "community",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // owner ref: > user.id, relationship: m2o
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// relationships
// Community.associate = (models) => {
//   Community.belongsTo(models.User, {
//     foreignKey: "owner",
//     as: "owner",
//   });
//   Community.hasMany(models.Member, {
//     foreignKey: "community",
//     as: "members",
//   });
// };

// Community.belongsTo(User, {
//   foreignKey: "owner",
//   as: "owner",
// });
// Community.hasMany(Member, {
//   foreignKey: "community",
//   as: "members",
// });

// Community.associate(sequelize.models);

// Community.sync({ alter: true });
export default Community;
