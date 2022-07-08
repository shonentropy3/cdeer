import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("block_log_block_key", ["block"], { unique: true })
@Index("block_log_pkey", ["id"], { unique: true })
@Entity("block_log", { schema: "public" })
export class BlockLog {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "block", unique: true })
  block: string;
}