import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("project_pkey", ["id"], { unique: true })
@Index("project_pro_id_key", ["proId"], { unique: true })
@Index("pro_id", ["proId"], {})
@Index("user_address", ["userAddress"], {})
@Entity("project", { schema: "public" })
export class Project {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character", { name: "user_address", nullable: true, length: 22 })
  userAddress: string | null;

  @Column("bigint", { name: "pro_id", nullable: true, unique: true })
  proId: string | null;

  @Column("character varying", { name: "title", length: 256 })
  title: string;

  @Column("numeric", { name: "budget", precision: 18, scale: 8 })
  budget: string;

  @Column("bigint", { name: "period", nullable: true })
  period: string | null;

  @Column("varchar", { name: "role", nullable: true, array: true })
  role: string[] | null;

  @Column("varchar", { name: "pro_type", nullable: true, array: true })
  proType: string[] | null;

  @Column("character varying", { name: "content", length: 32 })
  content: string;

  @Column("character varying", { name: "attachment", length: 32 })
  attachment: string;

  @Column("smallint", { name: "status", default: () => "1" })
  status: number;

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
