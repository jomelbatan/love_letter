import Carrots from "@/public/covers/carrots.png";
import Girl from "@/public/covers/girl.png";
import Rabbit from "@/public/profile/rabbit.png";
import Cat from "@/public/profile/cat.png";
import Seal from "@/public/profile/seal.png";
import Bear from "@/public/profile/bear.png";
import Otter from "@/public/profile/otter.png";
import Chick from "@/public/profile/chick.png";
import Penguin from "@/public/profile/penguin.png";

import { StaticImageData } from "next/image";

export const coverImages: Record<string, StaticImageData> = {
  melo: Carrots,
  nini: Girl,
};

export const avatars: Record<string, StaticImageData> = {
  rabbit: Rabbit,
  cat: Cat,
  seal: Seal,
  bear: Bear,
  otter: Otter,
  chick: Chick,
  penguin: Penguin,
};
