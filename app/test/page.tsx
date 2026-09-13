/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FacebookReel } from "@/components/micro/FacebookReel";

export default function App() {
  const link1 = '"https://www.instagram.com/reel/Da0sqLUqz0Y"';

  const link = "https://www.instagram.com/reels/Da0sqLUqz0Y";
  return (
    <>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/reels/DdCEyeDA8uD/?utm_source=ig_embed&amp;utm_campaign=loading"
        data-instgrm-version="14"
      ></blockquote>
      <div
        className={`fb-post rounded-xl`}
        data-href={`https://www.facebook.com/photo/?fbid=1652055149624360&set=a.263133995183156`}
        data-width="auto"
        data-show-text={false}
      />
      <div
        className={`fb-video rounded-xl`}
        data-href={`https://www.facebook.com/reel/2883680888662434`}
        data-width="auto"
      />
    </>
  );
}
