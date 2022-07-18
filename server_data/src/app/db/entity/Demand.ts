import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("demand_demandAddr_key", ["demand_addr"], { unique: true })
@Index("demand_addr", ["demand_addr"], {})
@Index("demand_desc", ["demandDesc"], {})
@Index("demand_demand_desc_key", ["demandDesc"], { unique: true })
@Index("demand_demand_id_key", ["demandId"], { unique: true })
@Index("demand_id", ["demandId"], {})
@Index("demand_demand_type_key", ["demandType"], { unique: true })
@Index("demand_pkey", ["id"], { unique: true })
@Index("demand_role_key", ["role"], { unique: true })
@Entity("demand", { schema: "public" })
export class Demand {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "demand_id", nullable: true, unique: true })
  demandId: string | null;

  @Column("character varying", {
    name: "demand_addr",
    nullable: true,
    unique: true,
    length: 64,
  })
  demand_addr: string | null;

  @Column("character varying", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("character varying", { name: "budget", nullable: true, length: 255 })
  budget: string | null;

  @Column("numeric", { name: "period", nullable: true })
  period: string | null;

  @Column("varchar", {
    name: "role",
    nullable: true,
    unique: true,
    array: true,
  })
  role: string[] | null;

  @Column("varchar", {
    name: "demand_type",
    nullable: true,
    unique: true,
    array: true,
  })
  demandType: string[] | null;

  @Column("character varying", {
    name: "demand_desc",
    nullable: true,
    unique: true,
    length: 64,
  })
  demandDesc: string | null;

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

  @Column("smallint", { name: "del", default: () => "1" })
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
