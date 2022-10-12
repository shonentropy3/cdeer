import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("trans_hashes_hash_key", ["hash"], { unique: true })
@Index("trans_hashes_pkey", ["id"], { unique: true })
@Entity("trans_hashes", { schema: "public" })
export class TransHashes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "hash",
    nullable: true,
    unique: true,
    length: 128,
  })
  hash: string | null;

  @Column("bigint", { name: "task_id", nullable: true })
  taskId: string | null;

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
