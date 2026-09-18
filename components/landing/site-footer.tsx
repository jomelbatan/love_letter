export function SiteFooter() {
  return (
    <footer className="bg-foreground py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center sm:flex-row sm:text-left lg:px-8">
        <div>
          <p className="font-hand text-2xl font-bold">afterword. 🐾</p>
          <p className="mt-1 text-sm text-background/60">a soft place for the things we carry</p>
        </div>
        <p className="text-sm text-background/50">made with warm hearts &amp; anonymous thoughts</p>
      </div>
    </footer>
  );
}
