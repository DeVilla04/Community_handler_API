import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import Community from "./community";
import Role from "./role";

@Table({ tableName: "member" })
class Member extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  id!: string;

  @ForeignKey(() => Community)
  @Column({ type: DataType.STRING, allowNull: false })
  community!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  user!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING, allowNull: false })
  role!: string;

  //   @CreatedAt
  //   @Column
  //   createdAt!: Date;

  //   @UpdatedAt
  //   @Column
  //   updatedAt!: Date;

  @BelongsTo(() => User, "user")
  userObj!: User;

  @BelongsTo(() => Community, "community")
  communityObj!: Community;

  @BelongsTo(() => Role, "role")
  roleObj!: Role;
}

export default Member;
