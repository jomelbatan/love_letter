export function NoteCard() {
  return (
    <div className="flex min-h-70 items-center justify-center">
      <div className="relative max-w-md -rotate-1 bg-note p-8 shadow-note">
        <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-tape/80" />
        <p className="font-hand text-2xl leading-10 sm:text-3xl">
          &ldquo;Maybe growing up is just learning which little moments are
          worth keeping.&rdquo;
        </p>
        <p className="mt-6 text-sm font-bold text-muted-foreground">
          — a thought left at 11:42 pm ♡
        </p>
      </div>
    </div>
  );
}
