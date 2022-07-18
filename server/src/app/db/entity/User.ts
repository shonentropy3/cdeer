import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_pkey", ["id"], { unique: true })
@Index("user_userAddr_key", ["userAddr"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "userAddr",
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
