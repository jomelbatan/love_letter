import Carrots from "@/public/covers/carrots.png";
import Girl from "@/public/covers/girl.png";
import Rabbit from "@/public/images/rabbit.png";
import Cat from "@/public/images/cat.png";
import Seal from "@/public/images/seal.png";
import Bear from "@/public/images/bear.png";
import Otter from "@/public/images/otter.png";
import Chick from "@/public/images/chick.png";
import Penguin from "@/public/images/penguin.png";

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
