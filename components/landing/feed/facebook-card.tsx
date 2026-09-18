import { Facebook } from "feather-icons-react";

export function FacebookCard() {
  return (
    <div className="min-h-70 rounded-lg border border-border bg-facebook-soft p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-facebook text-facebook-foreground">
          <Facebook className="size-5" fill="currentColor" />
        </span>
        <div>
          <p className="font-bold">A memory worth passing on</p>
          <p className="text-xs text-muted-foreground">Shared from Facebook</p>
        </div>
      </div>
      <p className="mt-8 font-hand text-2xl leading-9">
        The best afternoons are still the ones with no plan at all.
      </p>
      <div className="mt-8 flex h-24 items-center justify-center rounded-md bg-card text-4xl shadow-sm">
        ☁️ 🌿 ☀️
      </div>
    </div>
  );
}
