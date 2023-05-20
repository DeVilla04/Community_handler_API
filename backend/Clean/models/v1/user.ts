import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Scopes,
  HasMany,
  DataType,
} from "sequelize-typescript";
import Community from "./community";
import Member from "./member";

@Scopes(() => ({
  communities: {
    include: [
      {
        model: Community,
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({ tableName: "user" })
class User extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING(64), defaultValue: null })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING(64), allowNull: false })
  password!: string;

  //   @CreatedAt
  //   @Column
  //   createdAt!: Date;

  //   @UpdatedAt
  //   @Column
  //   updatedAt!: Date;

  @HasMany(() => Community, "owner")
  communities!: Community[];

  @HasMany(() => Member, "user")
  memberships!: Member[];
}

export default User;
