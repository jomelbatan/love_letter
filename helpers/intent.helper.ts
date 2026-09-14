import { Intent, PendingDelete, PendingPost } from "@/types/interception";

export function classifyIntent(
  messageText: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachment: any,
  pendingDelete: PendingDelete | null,
  pendingPost: PendingPost | null,
): Intent {
  const deleteCommandMatch = messageText?.match(/^\/delete:(.+)$/i);
  const noteCommandMatch = messageText?.match(/^\/note:(.+)$/i);
  const urlMatch = messageText?.match(/https?:\/\/\S+/i);
  const isImage = attachment?.type === "image";

  if (pendingDelete)
    return { kind: "confirmDelete", pending: pendingDelete, text: messageText };
  if (deleteCommandMatch)
    return { kind: "startDelete", postId: deleteCommandMatch[1].trim() };
  if (noteCommandMatch)
    return { kind: "createNote", content: noteCommandMatch[1].trim() };

  if (pendingPost) {
    if (isImage)
      return {
        kind: "interruptCaptionWithImage",
        pending: pendingPost,
        imageUrl: attachment.url,
      };
    if (urlMatch)
      return {
        kind: "interruptCaptionWithNewPost",
        pending: pendingPost,
        url: messageText,
      };
    return { kind: "provideCaption", pending: pendingPost, text: messageText };
  }

  if (
    attachment &&
    (attachment.type === "reel" ||
      attachment.type === "post" ||
      attachment.type === "image") &&
    attachment.url
  ) {
    return { kind: "handleAttachment", attachment };
  }

  if (messageText) return { kind: "handleTextOrUrl", text: messageText };
  return { kind: "noop" };
}
