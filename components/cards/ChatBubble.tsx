import { Doc } from "@/convex/_generated/dataModel";

export default function ChatBubble({ note }: { note: Doc<"notes"> }) {
  if (!note) return;
  return (
    <>
      <div className="absolute z-20 right-full mr-3 bottom-full left-52 -mb-2 lg:-mb-3 md:left-59.5 lg:left-17">
        <div className="flex flex-col items-end">
          <div className="w-max max-w-45 md:max-w-50 lg:max-w-60 rounded-4xl bg-primary-orange px-6 py-4 shadow-lg shadow-black/10">
            <p
              className="
              text-xs md:text-base leading-tight
              text-deep-charcoal
              font-kalam
            "
            >
              {note.content}
            </p>
          </div>
        </div>
      </div>

      <>
        <span className="absolute z-20 top-3 left-47 md:top-4 md:left-56 lg:top-4 lg:left-14 size-1.5 md:size-2 rounded-full bg-primary-orange" />
        <span className="absolute z-20 -top-1 left-43 md:-top-0.5 md:left-51 lg:-top-0.5 lg:left-8 size-4 md:size-5 rounded-full bg-primary-orange" />
      </>
    </>
  );
}
