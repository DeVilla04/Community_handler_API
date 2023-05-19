// import Community from "./community";
// import User from "./user";
// import Role from "./role";
// import Member from "./member";

// const defineAssociations = () => {
//   Community.hasMany(Member, {
//     foreignKey: "community",
//     as: "members",
//   });
//   Role.hasMany(Member, {
//     foreignKey: "role",
//     as: "roleMembers",
//   });
//   User.hasMany(Community, {
//     foreignKey: "owner",
//     as: "communityOwner",
//   });
//   User.hasMany(Member, {
//     foreignKey: "user",
//     as: "userMembers",
//   });
//   Member.belongsTo(Community, {
//     foreignKey: "community",
//     as: "members",
//   });
//   Member.belongsTo(User, {
//     foreignKey: "user",
//     as: "userMembers",
//   });
//   Member.belongsTo(Role, {
//     foreignKey: "role",
//     as: "roleMembers",
//   });
//   Community.belongsTo(User, {
//     foreignKey: "owner",
//     as: "communityOwner",
//   });
// };

// export default defineAssociations;
