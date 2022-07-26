import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("block_logs_pkey", ["id"], { unique: true })
@Entity("block_logs", { schema: "public" })
export class BlockLogs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "block" })
  block: string;
}
