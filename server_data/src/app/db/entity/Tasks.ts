import { Column, Entity, Index } from "typeorm";

@Index("tasks_desc_key", ["desc"], { unique: true })
@Index("desc", ["desc"], {})
@Index("tasks_id_key", ["id"], { unique: true })
@Index("id", ["id"], {})
@Index("issuer", ["issuer"], {})
@Entity("tasks", { schema: "public" })
export class Tasks {
  @Column("bigint", { name: "id", nullable: true, unique: true })
  id: string | null;

  @Column("character varying", { name: "issuer", nullable: true, length: 64 })
  issuer: string | null;

  @Column("character varying", { name: "hash", nullable: true, length: 64 })
  hash: string | null;

  @Column("character varying", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("character varying", {
    name: "desc",
    nullable: true,
    unique: true,
    length: 64,
  })
  desc: string | null;

  @Column("bigint", { name: "period", nullable: true })
  period: string | null;

  @Column("numeric", { name: "budget", nullable: true })
  budget: string | null;

  @Column("varchar", { name: "role", nullable: true, array: true })
  role: string[] | null;

  @Column("varchar", { name: "task_type", nullable: true, array: true })
  taskType: string[] | null;

  @Column("character varying", {
    name: "attachment",
    nullable: true,
    length: 64,
  })
  attachment: string | null;

  @Column("smallint", {
    name: "apply_switch",
    nullable: true,
    default: () => "1",
  })
  applySwitch: number | null;

  @Column("smallint", { name: "del", default: () => "0" })
  del: number;

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
