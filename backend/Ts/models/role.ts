// import { DataTypes } from "sequelize";
// import sequelize from "../db";

// const Role = sequelize.define(
//   "role", // table name
//   {
//     // define the columns
//     id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(64),
//       allowNull: false,
//     },
//   },
//   { timestamps: true } // add timestamps
// );

// export default Role;

import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  HasMany,
} from "sequelize-typescript";
import Member from "./member";

@Table({ tableName: "role", timestamps: true })
class Role extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @HasMany(() => Member)
  members!: Member[];
}

export default Role;
