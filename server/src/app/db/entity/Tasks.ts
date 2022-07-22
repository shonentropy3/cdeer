import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("demand_addr", ["demandAddr"], {})
@Index("demand_demand_desc_key", ["demandDesc"], { unique: true })
@Index("demand_desc", ["demandDesc"], {})
@Index("demand_id", ["demandId"], {})
@Index("demand_pkey", ["id"], { unique: true })
@Entity("tasks", { schema: "public" })
export class Tasks {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "demand_id", nullable: true })
  demandId: string | null;

  @Column("character varying", {
    name: "demand_addr",
    nullable: true,
    length: 64,
  })
  demandAddr: string | null;

  @Column("character varying", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("character varying", {
    name: "demand_desc",
    nullable: true,
    unique: true,
    length: 64,
  })
  demandDesc: string | null;

  @Column("bigint", { name: "period", nullable: true })
  period: string | null;

  @Column("numeric", { name: "budget", nullable: true })
  budget: string | null;

  @Column("varchar", { name: "role", nullable: true, array: true })
  role: string[] | null;

  @Column("varchar", { name: "demand_type", nullable: true, array: true })
  demandType: string[] | null;

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
