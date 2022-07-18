import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("apply_info_pkey", ["id"], { unique: true })
@Entity("apply_info", { schema: "public" })
export class ApplyInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "applyAddr", length: 64 })
  applyAddr: string;

  @Column("bigint", { name: "demand_id", nullable: true })
  demandId: string | null;

  @Column("numeric", { name: "preview_price", nullable: true })
  previewPrice: string | null;

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
