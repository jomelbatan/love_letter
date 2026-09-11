import { redirect } from "next/navigation";

export default function Home() {
  const username = "Melo";
  redirect(`/${username}`);
}
