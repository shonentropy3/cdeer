import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("order_pkey", ["id"], { unique: true })
@Index("order_orderAddr_key", ["orderAddr"], { unique: true })
@Index("order_order_id_key", ["orderId"], { unique: true })
@Entity("order", { schema: "public" })
export class Order {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "order_id", nullable: true, unique: true })
  orderId: string | null;

  @Column("bigint", { name: "demand_id", nullable: true })
  demandId: string | null;

  @Column("character varying", {
    name: "orderAddr",
    nullable: true,
    unique: true,
    length: 64,
  })
  orderAddr: string | null;

  @Column("character varying", {
    name: "token_addr",
    nullable: true,
    length: 64,
  })
  tokenAddr: string | null;

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
