import { Flag, Pointer, UserRoundCheck, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { formatCount, formatWordS } from "@/libs/format";
import { AuthorProps } from "@/types/props";
import ChatBubble from "../cards/ChatBubble";
import { Doc } from "@/convex/_generated/dataModel";
import { coverImages } from "@/data";
import ShareButton from "../button/ShareButton";

type HeroProps = AuthorProps & {
  note: Doc<"notes"> | null | undefined;
};
export default function Hero({ author, note }: HeroProps) {
  const selectedImage = coverImages[author.name.toLocaleLowerCase()];

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video md:aspect-851/315 overflow-hidden lg:rounded-2xl">
        <Image
          src={selectedImage ?? coverImages["default"]}
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
                {author.friendCount > 0 && (
                  <p>{`${author.friendCount} ${formatWordS("friend", author.friendCount)}`}</p>
                )}
                {author.postCount > 1 && (
                  <>
                    ·
                    <p>{`${formatCount(author.postCount)} ${formatWordS("post", author.postCount)}`}</p>
                  </>
                )}
              </div>
              {author.bio && (
                <p className="font-kalam px-4 lg:px-0">{author.bio}</p>
              )}
            </div>
          </div>
        </div>
        <div className="h-fit mt-4 lg:mt-0 shrink-0 gap-2 flex flex-row lg:flex-col p-1">
          <div className="flex flex-row gap-2 ">
            {author.status === "VACANT" ? (
              <button className="px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer">
                <Flag className="text-chalk-terracotta size-5" />
                <p className="text-chalk-terracotta font-kalam-bold text-base">
                  Vaccant
                </p>
              </button>
            ) : author.privacy === "PUBLIC" ? (
              <button className="px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer">
                <UserRoundCheck className="text-chalk-terracotta size-5" />
                <p className="text-chalk-terracotta font-kalam-bold text-base">
                  Friends
                </p>
              </button>
            ) : (
              <button className="px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer">
                <UserRoundPlus className="text-chalk-terracotta size-5" />
                <p className="text-chalk-terracotta font-kalam-bold text-base">
                  Add Friend
                </p>
              </button>
            )}
            <button className="px-4 py-2 bg-chalk-terracotta flex flex-row items-center justify-center gap-2 rounded-xl cursor-pointer">
              <Pointer className="text-white size-5" />
              <p className="text-white font-kalam-bold text-base">Poke</p>
            </button>
          </div>
          <ShareButton />
        </div>
      </div>

      <div className="border border-soft-dust w-full mt-4"></div>
    </div>
  );
}
