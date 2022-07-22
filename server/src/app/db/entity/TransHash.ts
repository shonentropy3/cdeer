import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("trans_hash_hash_key", ["hash"], { unique: true })
@Index("trans_hash_pkey", ["id"], { unique: true })
@Entity("trans_hash", { schema: "public" })
export class TransHash {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "hash",
    nullable: true,
    unique: true,
    length: 128,
  })
  hash: string | null;

  @Column("bigint", { name: "demand_id", nullable: true })
  demandId: string | null;

  @Column("smallint", { name: "category", nullable: true })
  category: number | null;

  @Column("character varying", {
    name: "send_addr",
    nullable: true,
    length: 64,
  })
  sendAddr: string | null;

  @Column("smallint", { name: "is_update", nullable: true, default: () => "0" })
  isUpdate: number | null;

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
