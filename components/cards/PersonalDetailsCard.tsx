"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { formatDate, getDuration } from "@/libs/date";
import { Briefcase, GraduationCap, Mail } from "lucide-react";

interface PersonalDetailsProps {
  author: Doc<"authors">;
}

export default function PersonalDetailsCard({ author }: PersonalDetailsProps) {
  return (
    <section className="bg-pure-chalk rounded-xl p-4 border border-soft-dust shadow-sm text-deep-charcoal space-y-5">
      {/* 1. Personal Details */}
      {author.personalDetails?.gender && (
        <div>
          <h2 className="text-lg font-kalam-bold text-deep-charcoal mb-2.5">
            Personal details
          </h2>
          <div className="flex items-center gap-3 text-dusty-pink text-sm">
            <div className="w-9 h-9 rounded-full bg-dusty-pink flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-warm-dust stroke-current fill-none stroke-2"
              >
                <circle cx="9" cy="12" r="5" />
                <circle cx="15" cy="12" r="5" />
              </svg>
            </div>
            <span className="font-kalam text-deep-charcoal">
              {author.personalDetails?.gender}
            </span>
          </div>
        </div>
      )}

      {/* 2. Work */}
      {author.work && (
        <div>
          <h2 className="text-lg font-kalam-bold text-deep-charcoal mb-2.5">
            Work
          </h2>

          {author.work?.map((work) => (
            <div
              className="flex items-start gap-3"
              key={author.name + work.role + work.workplace}
            >
              <div className="w-9 h-9 rounded-full bg-dusty-pink flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5 text-warm-dust" />
              </div>
              <div className="text-sm">
                <p className="font-kalam text-deep-charcoal leading-snug">
                  {work.workplace}
                </p>
                <p className="text-deep-charcoal/70 font-kalam text-xs mt-0.5">
                  {work.role}
                </p>
                <p className="text-zinc-400 font-kalam text-xs mt-0.5">
                  On {formatDate(work.startDate!)}{" "}
                  {work.endDate && " - " + formatDate(work.endDate)} ·{" "}
                  {getDuration(work.startDate!)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Education */}
      {author.education && (
        <div>
          <h2 className="text-lg font-kalam-bold text-deep-charcoal mb-2.5">
            Education
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-dusty-pink flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-warm-dust" />
            </div>
            <p className="text-sm font-kalam text-deep-charcoal leading-snug">
              {author.education}
            </p>
          </div>
        </div>
      )}

      {/* 4. Contact info */}
      {author.contactInfo?.email && (
        <div>
          <h2 className="text-lg font-kalam-bold text-deep-charcoal mb-2.5">
            Contact info
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-full bg-dusty-pink flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-warm-dust" />
            </div>
            <div className="flex items-start flex-wrap flex-col">
              <p className="font-kalam text-deep-charcoal leading-snug">
                Email
              </p>
              <a
                href={`mailto:${author.contactInfo?.email}`}
                className="text-text-brown hover:underline font-normal break-all"
              >
                {author.contactInfo?.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
