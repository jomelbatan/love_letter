/* eslint-disable @typescript-eslint/no-explicit-any */

import { Intent, PendingDelete, PendingPost } from "@/types/interception";

// intent.helper.ts
export function classifyIntent(
  messageText: string,
  attachment: any,
  pendingDelete: PendingDelete | null,
  pendingPost: PendingPost | null,
): Intent {
  const deleteCommandMatch = messageText?.match(/^\/delete:(.+)$/i);
  const noteCommandMatch = messageText?.match(/^\/note:(.+)$/i);
  const urlMatch = messageText?.match(/https?:\/\/\S+/i);
  const isPostableAttachment =
    attachment &&
    (attachment.type === "reel" ||
      attachment.type === "post" ||
      attachment.type === "image" ||
      attachment.type === "ig_reel" ||
      attachment.type === "ig_post") &&
    attachment.url;
  console.log("Attachment: ", attachment);
  if (pendingDelete)
    return { kind: "confirmDelete", pending: pendingDelete, text: messageText };
  if (deleteCommandMatch)
    return { kind: "startDelete", postId: deleteCommandMatch[1].trim() };
  if (noteCommandMatch)
    return { kind: "createNote", content: noteCommandMatch[1].trim() };

  if (pendingPost) {
    if (isPostableAttachment)
      return {
        kind: "interruptCaptionWithAttachment",
        pending: pendingPost,
        attachment,
      };
    if (urlMatch)
      return {
        kind: "interruptCaptionWithNewPost",
        pending: pendingPost,
        url: messageText,
      };
    return { kind: "provideCaption", pending: pendingPost, text: messageText };
  }

  if (isPostableAttachment) return { kind: "handleAttachment", attachment };
  if (messageText) return { kind: "handleTextOrUrl", text: messageText };
  return { kind: "noop" };
}
