import { Column, Entity } from "typeorm";

@Entity("order", { schema: "public" })
export class Order {
  @Column("integer", { name: "oid", nullable: true })
  oid: number | null;

  @Column("integer", { name: "age", nullable: true })
  age: number | null;
}
