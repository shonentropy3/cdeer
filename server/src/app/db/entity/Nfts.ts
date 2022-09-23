import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("account", ["account"], {})
@Index("nfts_pkey", ["id"], { unique: true })
@Entity("nfts", { schema: "public" })
export class Nfts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("json", { name: "info", nullable: true })
  info: object | null;

  @Column("character varying", { name: "account", nullable: true, length: 42 })
  account: string | null;

  @Column("character varying", { name: "chain", nullable: true, length: 15 })
  chain: string | null;

  @Column("character varying", { name: "erc_type", nullable: true, length: 7 })
  ercType: string | null;

  @Column("bigint", { name: "create_time", nullable: true })
  createTime: string | null;
}
