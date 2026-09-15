export function FriendsCardSkeleton() {
  return Array.from({ length: 9 }).map((_, index) => (
    <div key={index} className="flex flex-col animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-zinc-200 mb-1.5" />
      <div className="h-3.5 w-3/4 rounded bg-zinc-200" />
    </div>
  ));
}
export default function PostCardSkeleton() {
  return (
    <article className="relative bg-pure-chalk rounded-xl p-4 border border-soft-dust space-y-3 flex h-fit flex-col items-center animate-pulse">
      {/* Header */}
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-14 rounded-full bg-chalk-cream border border-chalk-terracotta" />

          {/* Author info */}
          <div className="space-y-2">
            <div className="h-7 w-28 rounded-md bg-soft-dust" />

            <div className="flex items-center gap-1">
              <div className="h-3 w-16 rounded bg-soft-dust" />
              <div className="size-3 rounded-full bg-soft-dust" />
              <div className="h-3 w-3 rounded-full bg-soft-dust" />
            </div>
          </div>
        </div>

        {/* Copy button */}
        <div className="size-8 rounded-full bg-soft-dust" />
      </div>

      {/* Post text */}
      <div className="w-full space-y-2 px-2">
        <div className="h-9 w-full max-w-lg rounded-md bg-soft-dust" />
        <div className="h-9 w-3/4 max-w-md rounded-md bg-soft-dust" />
      </div>

      {/* Embed / media */}
      <div className="w-full h-80 rounded-lg bg-chalk-cream" />
    </article>
  );
}
