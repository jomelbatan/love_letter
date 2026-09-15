/* eslint-disable @typescript-eslint/no-explicit-any */
import { Id } from "@/convex/_generated/dataModel";

export interface PendingDelete {
  postId: Id<"posts">;
}

export interface PendingPost {
  type: PostType;
  embedUrl?: string;
  embedType?: EmbedType;
  initialText?: string;
}

export type PostType = "TEXT" | "LETTER" | "IMAGE" | "EMBED";
export type EmbedType =
  "SPOTIFY" | "TIKTOK" | "FACEBOOK" | "YOUTUBE" | "INSTAGRAM" | "LINK";
export interface AuthorRecord {
  _id: Id<"authorAccounts">;
  _creationTime: number;
  pendingDeletePostId?: Id<"posts"> | undefined;
  authorId: Id<"authors">;
  psid: string;
  author: {
    name: string | undefined;
  };
}
export type Intent =
  | { kind: "confirmDelete"; pending: PendingDelete; text: string }
  | { kind: "startDelete"; postId: string }
  | { kind: "createNote"; content: string }
  | { kind: "provideCaption"; pending: PendingPost; text: string }
  | { kind: "interruptCaptionWithNewPost"; pending: PendingPost; url: string }
  | {
      kind: "interruptCaptionWithImage";
      pending: PendingPost;
      imageUrl: string;
    }
  | {
      kind: "interruptCaptionWithAttachment";
      pending: PendingPost;
      attachment: any;
    }
  | { kind: "handleAttachment"; attachment: any }
  | { kind: "handleTextOrUrl"; text: string }
  | { kind: "noop" };
