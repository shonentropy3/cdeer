import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "address", nullable: true, length: 64 })
  address: string | null;

  @Column("character varying", { name: "username", nullable: true, length: 64 })
  username: string | null;

  @Column("character varying", { name: "avatar", nullable: true, length: 128 })
  avatar: string | null;

  @Column("character varying", { name: "telegram", nullable: true, length: 64 })
  telegram: string | null;

  @Column("character varying", { name: "wechat", nullable: true, length: 64 })
  wechat: string | null;

  @Column("character varying", { name: "skype", nullable: true, length: 64 })
  skype: string | null;

  @Column("varchar", { name: "role", nullable: true, array: true })
  role: string[] | null;

  @Column("date", { name: "date", nullable: true, default: () => "now()" })
  date: string | null;

  @Column("date", { name: "update", nullable: true, default: () => "now()" })
  update: string | null;
}
