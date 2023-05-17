import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Community from "./community.js";
import User from "./user.js";
import Role from "./role.js";

const Member = sequelize.define(
  "member", // table name
  {
    // define the columns
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    // community ref: > community.id
    community: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // user ref: > user.id
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // role ref: > role.id
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true } // add timestamps
);

// // relationships
// Member.associate = (models) => {
//   Member.belongsTo(models.Community, {
//     foreignKey: "community",
//     as: "community",
//   });
//   Member.belongsTo(models.User, {
//     foreignKey: "user",
//     as: "user",
//   });
//   Member.belongsTo(models.Role, {
//     foreignKey: "role",
//     as: "role",
//   });
// };

// Member.belongsTo(Community, {
//   foreignKey: "community",
//   as: "community",
// });
// Member.belongsTo(User, {
//   foreignKey: "user",
//   as: "user",
// });
// Member.belongsTo(Role, {
//   foreignKey: "role",
//   as: "role",
// });

// Define associations
const defineAssociations = () => {
  Community.hasMany(Member, {
    foreignKey: "community",
    as: "members",
  });
  Role.hasMany(Member, {
    foreignKey: "role",
    as: "roleMembers",
  });
  User.hasMany(Community, {
    foreignKey: "owner",
    as: "communityOwner",
  });
  User.hasMany(Member, {
    foreignKey: "user",
    as: "userMembers",
  });
  Member.belongsTo(Community, {
    foreignKey: "community",
    as: "members",
  });
  Member.belongsTo(User, {
    foreignKey: "user",
    as: "userMembers",
  });
  Member.belongsTo(Role, {
    foreignKey: "role",
    as: "roleMembers",
  });
  Community.belongsTo(User, {
    foreignKey: "owner",
    as: "communityOwner",
  });
};
// Member.associate(sequelize.models);

// Member.sync({ alter: true });
export { Member, defineAssociations };
