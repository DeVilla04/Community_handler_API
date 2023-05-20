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

@Table({ tableName: "role" })
class Role extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  //   @CreatedAt
  //   @Column
  //   createdAt!: Date;

  //   @UpdatedAt
  //   @Column
  //   updatedAt!: Date;

  @HasMany(() => Member)
  members!: Member[];
}

export default Role;
