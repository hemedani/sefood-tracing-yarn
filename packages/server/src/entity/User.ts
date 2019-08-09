import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, ID, registerEnumType, Root } from "type-graphql";
import { Store } from "./Store";

enum UserRole {
  Normal = "Normal",
  Admin = "Admin",
  UnitEmployee = "UnitEmployee",
  StoreBoss = "StoreBoss",
  OrganizationBoss = "OrganizationBoss",
  UniversityBoss = "UniversityBoss",
  DiagnosisPosition = "DiagnosisPosition"
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "the role enums for user access level"
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  name(@Root() parent: User): string | null {
    return parent.firstName && parent.lastName
      ? `${parent.firstName} ${parent.lastName}`
      : parent.firstName
      ? parent.firstName
      : parent.lastName
      ? parent.lastName
      : null;
  }

  @Field()
  @Column("bigint", { unique: true })
  phone: number;

  @Column("integer", { default: 0 })
  authCode: number;

  @Field(() => [String])
  @Column("simple-array")
  devices: string[];

  @Field()
  @Column("bool", { default: false })
  phoneValidate: boolean;

  @Field(() => UserRole)
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.Normal
  })
  role: UserRole;

  @OneToOne(() => Store, store => store.owner)
  @JoinColumn()
  @Field(() => Store, { nullable: true })
  ownStore: Store;
}
