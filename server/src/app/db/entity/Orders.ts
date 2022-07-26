import { Column, Entity, Index } from "typeorm";

@Index("orders_id_key", ["id"], { unique: true })
@Entity("orders", { schema: "public" })
export class Orders {
  @Column("bigint", { name: "id", nullable: true, unique: true })
  id: string | null;

  @Column("bigint", { name: "task_id", nullable: true })
  taskId: string | null;

  @Column("character varying", { name: "worker", nullable: true, length: 64 })
  worker: string | null;

  @Column("character varying", { name: "hash", nullable: true, length: 64 })
  hash: string | null;

  @Column("character varying", { name: "amount", nullable: true, length: 255 })
  amount: string | null;

  @Column("smallint", { name: "checked", default: () => "0" })
  checked: number;

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
