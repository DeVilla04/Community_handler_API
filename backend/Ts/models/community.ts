// import sequelize from "../db.ts";
// import { DataTypes } from "sequelize";

// const Community = sequelize.define(
//   // define the model
//   "community", // table name
//   {
//     // define the columns
//     id: {
//       type: DataTypes.STRING, // data type
//       primaryKey: true, // primary key
//     },
//     name: {
//       type: DataTypes.STRING(128),
//       allowNull: false,
//     },
//     slug: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     // owner ref: > user.id, relationship: m2o
//     owner: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   { timestamps: true } // add timestamps
// );

// export default Community;

import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
} from "sequelize-typescript";
import User from "./user";
import Member from "./member";

@Table({ tableName: "community", timestamps: true })
class Community extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING(128), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  owner!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BelongsTo(() => User, "owner")
  communityOwner!: User;

  @HasMany(() => Member, "community")
  members!: Member[];
}

export default Community;
