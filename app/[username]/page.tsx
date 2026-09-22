import Hero from "@/components/major/Hero";
import AfterwordNavbar from "@/components/major/NavBar";
import ProfileNav from "@/components/major/ProfileNav";
import { api } from "@/convex/_generated/api";
import { capitalizeFirstLetter } from "@/libs/format";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserTimeline({ params }: Props) {
  const { username } = await params;
  const author = await fetchQuery(api.author.getAuthorByName, {
    username: capitalizeFirstLetter(username),
  });
  if (!author) {
    notFound();
  }
  const note = await fetchQuery(api.notes.getNote, {
    authorId: author._id,
  });
  return (
    <>
      <AfterwordNavbar />
      <div id="fb-root"></div>
      <div className="relative px-0 lg:px-64">
        <Hero author={author} note={note} />
        <ProfileNav author={author} />
      </div>
      <Script async src="https://www.instagram.com/embed.js" />
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0"
      ></Script>
      <Script src="https://www.youtube.com/iframe_api" async />
    </>
  );
}
