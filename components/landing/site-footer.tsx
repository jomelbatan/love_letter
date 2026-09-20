import Image from "next/image";
import Afterword from "@/public/covers/afterword.png";
export function SiteFooter() {
  return (
    <footer className="bg-foreground py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center sm:flex-row sm:text-left lg:px-8">
        <div>
          <Image
            src={Afterword}
            alt="Afterword Logo"
            height={30}
            width={250}
            className="-mb-3 lg:-ml-5"
          />
          <p className="mt-1 text-sm text-background/60">
            a soft place for the things we carry
          </p>
        </div>
        <p className="text-sm text-background/50">
          made with warm hearts &amp; anonymous thoughts
        </p>
      </div>
    </footer>
  );
}
