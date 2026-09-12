export function FriendsCardSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-3.5 animate-pulse">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <div className="aspect-square w-full rounded-lg bg-zinc-200 mb-1.5" />
          <div className="h-3.5 w-3/4 rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );
}
