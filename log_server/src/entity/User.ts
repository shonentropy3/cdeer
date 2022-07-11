import { Column, Entity } from "typeorm";

@Entity("User", { schema: "public" })
export class User {
  @Column("integer", { name: "id", nullable: true })
  id: number | null;
}
