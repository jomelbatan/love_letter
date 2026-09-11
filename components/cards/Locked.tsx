import { ShieldKeyhole } from "lucide-react";
import React from "react";

interface LockedProps {
  name: string;
}

export default function Locked({ name }: LockedProps) {
  return (
    <section className="flex flex-row justify-center items-center gap-4 bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <div className="flex items-center justify-center rounded-full p-3 bg-primary-orange w-fit">
        <ShieldKeyhole className="size-10 text-pure-chalk" />
      </div>
      <div className="flex-1 flex-col justify-center items-center h-full ">
        <h2 className="text-xl font-kalam-bold text-deep-charcoal">
          {name} locked their profile
        </h2>
        <p className="font-kalam text-deep-charcoal">
          Only their friends can see what they share on their profile.
        </p>
      </div>
    </section>
  );
}
