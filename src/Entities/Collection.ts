import { Field, ID, ObjectType } from "type-graphql"
import { Column, Entity, Index, ObjectID, ObjectIdColumn } from "typeorm"
import { CollectionQuery } from "./CollectionQuery"

@ObjectType({ description: "Object representing a collection page" })
@Entity()
export class Collection {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Index({ unique: true })
  @Field({
    description:
      "slug version of title, used for pretty URLs (e.g. `kaws-prints` for Kaws Prints ",
  })
  @Column()
  slug: string

  @Field({ description: "Name of the collection" })
  @Column()
  title: string

  @Field({
    nullable: true,
    description:
      "Description of the collection which can include links to other collections",
  })
  @Column({ nullable: true })
  description?: string

  @Field(type => String, {
    nullable: true,
    description: "Background image for the header of the collection page",
  })
  @Column()
  headerImage?: string

  @Field(type => String, {
    description: "Set of keywords used for SEO purposes",
  })
  @Column()
  keywords: string

  @Field({
    nullable: true,
    description: "Image credit for the header image",
  })
  @Column({ nullable: true })
  credit?: string

  @Field(type => String, { description: "Category of the collection" })
  @Column()
  category: string

  @Field(type => CollectionQuery, {
    description: "Structured object used to build filtered artworks query",
  })
  @Column(type => CollectionQuery)
  query: CollectionQuery

  @Field()
  @Column()
  createdAt: Date

  @Field()
  @Column()
  updatedAt: Date
}
