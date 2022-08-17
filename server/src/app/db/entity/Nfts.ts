import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("nfts_pkey", ["id"], { unique: true })
@Entity("nfts", { schema: "public" })
export class Nfts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("json", { name: "info" })
  info: object;

  @Column("character varying", { name: "create_time", length: 26 })
  createTime: string;

  @Column("character varying", { name: "issuer", length: 64 })
  issuer: string;

  @Column("character varying", { name: "chain", length: 64 })
  chain: string;

  @Column("character varying", { name: "erc_type", length: 64 })
  ercType: string;
}
