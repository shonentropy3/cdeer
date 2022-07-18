import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("apply_info_applyAddr_key", ["applyAddr"], { unique: true })
@Index("apply_info_demand_id_key", ["demandId"], { unique: true })
@Index("apply_info_pkey", ["id"], { unique: true })
@Entity("apply_info", { schema: "public" })
export class ApplyInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "applyAddr",
    nullable: true,
    unique: true,
    length: 64,
  })
  applyAddr: string | null;

  @Column("bigint", { name: "demand_id", nullable: true, unique: true })
  demandId: string | null;

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
