import Link from "next/link";

type MentionTextProps = {
  text: string;
};

export function MentionText({ text }: MentionTextProps) {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (!part.startsWith("@")) {
          return <span key={index}>{part}</span>;
        }

        const username = part.slice(1);

        return (
          <Link
            key={index}
            href={`/${username}`}
            className="text-chalk-terracotta font-bold hover:underline"
          >
            {username}
          </Link>
        );
      })}
    </>
  );
}
