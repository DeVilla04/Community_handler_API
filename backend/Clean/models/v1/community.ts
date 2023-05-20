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

@Table({ tableName: "community" })
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

  //Getting error for this not sure why in all models
  //   @Column({ defaultValue: DataType.NOW })
  //   createdAt!: Date;

  //   @Column({ defaultValue: DataType.NOW, onUpdate: DataType.NOW })
  //   updatedAt!: Date;

  @BelongsTo(() => User, "owner")
  communityOwner!: User;

  @HasMany(() => Member, "community")
  members!: Member[];
}

export default Community;
