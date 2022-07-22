import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_pkey", ["id"], { unique: true })
@Index("user_user_addr_key", ["userAddr"], { unique: true })
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
