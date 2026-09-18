import { Pointer, UserRoundCheck, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { formatCount, formatWordS } from "@/libs/format";
import { AuthorProps } from "@/types/props";
import ChatBubble from "../cards/ChatBubble";
import { Doc } from "@/convex/_generated/dataModel";
import { coverImages } from "@/data";

type HeroProps = AuthorProps & { note: Doc<"notes"> | null | undefined };
export default function Hero({ author, note }: HeroProps) {
  const selectedImage = coverImages[author.name.toLocaleLowerCase()];

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video md:aspect-851/315 overflow-hidden lg:rounded-2xl">
        <Image
          src={selectedImage}
          alt="cover-photo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between lg:px-8 -mt-16 lg:mt-0 lg:pt-8">
        <div className="relative shrink-0">
          {note && <ChatBubble note={note} />}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="avatar size-36 md:size-44 bg-chalk-cream rounded-full overflow-hidden">
              <div className="border-2 p-0.5 border-chalk-terracotta w-36 md:w-44 rounded-full ring-2 ring-offset-2 relative">
                <Image
                  src={author.avatarUrl}
                  alt={`${author.name}'s avatar`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col  items-center lg:items-start">
              <p className="text-4xl font-kalam-bold">{author.name}</p>
              <div className="flex flex-row gap-1 font-kalam-bold">
                <p>1 friend</p>
                {author.postCount > 1 && (
                  <>
                    ·
                    <p>{`${formatCount(author.postCount)} ${formatWordS("post", author.postCount)}`}</p>
                  </>
                )}
              </div>
              <p className="font-kalam px-4 lg:px-0">{author.bio}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 h-fit mt-4 lg:mt-0">
          {author.name === "Melo" ? (
            <button className="px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer">
              <UserRoundCheck className="text-chalk-terracotta size-5" />
              <p className="text-chalk-terracotta font-kalam-bold">Friends</p>
            </button>
          ) : (
            <button className="px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer">
              <UserRoundPlus className="text-chalk-terracotta size-5" />
              <p className="text-chalk-terracotta font-kalam-bold">
                Add Friend
              </p>
            </button>
          )}
          <button className="px-4 py-2 bg-chalk-terracotta flex flex-row items-center justify-center gap-2 rounded-xl cursor-pointer">
            <Pointer className="text-white size-5" />
            <p className="text-white font-kalam-bold">Poke</p>
          </button>
        </div>
      </div>

      <div className="border border-soft-dust w-full mt-4"></div>
    </div>
  );
}
