import { Doc, Id } from "@/convex/_generated/dataModel";

export interface AuthorProps {
  author: Doc<"authors">;
}
export interface AuthorIdProps {
  authorId: Id<"authors">;
}
