import { Heart, Link2, MessageCircleHeart, Send } from "lucide-react";
import { Button } from "@/components/button/button";
import { FlowStep } from "./flow-step";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="paper-speckle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-hand text-lg font-bold text-primary">
              easy as sending a message
            </p>
            <h2 className="mt-2 font-hand text-4xl font-bold sm:text-5xl">
              No sign-up.
              <br />
              No spotlight.
              <br />
              Just share.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              Find something that feels like you? Send it to Afterword on
              Messenger. We&rsquo;ll tuck it into the timeline without your name
              attached.
            </p>
            <Button href="#final-cta" size="lg" className="mt-7">
              <MessageCircleHeart className="size-5" /> Open Messenger
            </Button>
          </div>
          <ol className="relative grid gap-5">
            <FlowStep
              number="01"
              icon={Send}
              title="Send a thought or link"
              text="Message the Afterword Facebook page with a note, song, reel, post, or video."
              color="bg-pink"
            />
            <FlowStep
              number="02"
              icon={Link2}
              title="We recognize the magic"
              text="Afterword finds the platform and prepares the content for its coziest feed view."
              color="bg-butter"
            />
            <FlowStep
              number="03"
              icon={Heart}
              title="It joins the timeline"
              text="Your share appears anonymously with a sweet animal identity—ready to be discovered."
              color="bg-mint"
            />
          </ol>
        </div>
      </div>
    </section>
  );
}
