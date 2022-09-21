import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("users_pkey", ["id"], { unique: true })
@Index("users_user_addr_key", ["userAddr"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "user_addr",
    nullable: true,
    unique: true,
    length: 64,
  })
  userAddr: string | null;

  @Column("character varying", {
    name: "avatar",
    nullable: true,
    length: 255
  })
  avatar: string | null

  @Column("character varying",{
    name: "telegram",
    nullable: true,
    length: 64
  })
  telegram: string | null

  @Column("character varying", {
    name: "wechat",
    nullable: true,
    length: 64
  })
  wechat: string | null

  @Column("character varying", {
    name: "skype",
    nullable: true,
    length: 64
  })
  skype: string | null

  @Column("character", {
    name: "role",
    nullable: true,
    array: true
  })
  role: string[] | null;

  @Column("date", {
    name: "create_time",
    nullable: true,
    default: () => "now()",
  })
  createTime: string | null;

  @Column("date", {
    name: "update_time",
    nullable: true,
    default: () => "now()",
  })
  updateTime: string | null;
}
