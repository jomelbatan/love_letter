"use client";

import { useMemo, useState, useEffect } from "react";
import {
  School,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  FileText,
  Hand,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDate } from "@/libs/date";

export type TabKey =
  "bio" | "personalDetails" | "work" | "education" | "contactInfo";

interface TabConfig {
  key: TabKey;
  label: string;
  hasData: (author: Doc<"authors">) => boolean;
}

// 1. Define tab definitions with validation guards
const ALL_TABS: TabConfig[] = [
  {
    key: "bio",
    label: "Intro",
    hasData: (author) => Boolean(author.bio?.trim()),
  },
  {
    key: "personalDetails",
    label: "Personal details",
    hasData: (author) => {
      const pd = author.personalDetails;
      return Boolean(pd && (pd.gender || pd.location || pd.relationshipStatus));
    },
  },
  {
    key: "work",
    label: "Work",
    hasData: (author) => Boolean(author.work && author.work.length > 0),
  },
  {
    key: "education",
    label: "Education",
    hasData: (author) => Boolean(author.education?.trim()),
  },
  {
    key: "contactInfo",
    label: "Contact info",
    hasData: (author) => {
      const ci = author.contactInfo;
      return Boolean(ci && (ci.email || ci.number));
    },
  },
];

export default function AboutSectionCard({
  author,
}: {
  author: Doc<"authors">;
}) {
  // 2. Filter down to ONLY the tabs that have valid data
  const availableTabs = useMemo(() => {
    return ALL_TABS.filter((tab) => tab.hasData(author));
  }, [author]);

  // 3. Default to the first available tab
  const [activeTab, setActiveTab] = useState<TabKey | null>(
    () => availableTabs[0]?.key ?? null,
  );

  // Sync activeTab if the available tabs change or if current tab is no longer valid
  useEffect(() => {
    function init() {
      if (availableTabs.length > 0) {
        if (!activeTab || !availableTabs.some((t) => t.key === activeTab)) {
          setActiveTab(availableTabs[0].key);
        }
      } else {
        setActiveTab(null);
      }
    }
    init();
  }, [availableTabs, activeTab]);

  return (
    <section className="bg-pure-chalk rounded-xl shadow-sm border border-soft-dust">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* ================= LEFT SUB-NAV ================= */}
        <aside className="py-7 px-2 border-b md:border-b-0 md:border-r border-soft-dust">
          <h2 className="pl-2 text-xl font-kalam-bold text-deep-charcoal mb-3">
            About
          </h2>

          <nav className="mt-1 space-y-1" role="tablist">
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-peach-milk text-chalk-terracotta font-kalam-bold"
                      : "text-zinc-400 hover:bg-warm-dust/10  font-kalam"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ================= RIGHT CONTENT PANE ================= */}
        <main className="p-6">
          {/* Bio Panel */}
          {activeTab === "bio" && author.bio && (
            <div className="space-y-2">
              <h3 className="text-base font-kalam-bold text-deep-charcoal">
                Bio
              </h3>
              <div className="flex flex-row gap-2 items-center">
                <Hand className="w-5 h-5 text-warm-dust rotate-45" />
                <p className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          )}

          {/* Personal Details Panel */}
          {activeTab === "personalDetails" && author.personalDetails && (
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                {author.personalDetails.gender && (
                  <>
                    <h3 className="text-base font-kalam-bold text-deep-charcoal">
                      Gender
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-warm-dust stroke-current fill-none stroke-2"
                      >
                        <circle cx="9" cy="12" r="5" />
                        <circle cx="15" cy="12" r="5" />
                      </svg>
                      <p className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                        {author.personalDetails.gender}
                      </p>
                    </div>
                  </>
                )}
                {author.personalDetails.location && (
                  <>
                    <h3 className="text-base font-kalam-bold text-deep-charcoal">
                      Location
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <MapPin className="w-5 h-5 text-warm-dust " />
                      <p className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                        {author.personalDetails.location}
                      </p>
                    </div>
                  </>
                )}
                {author.personalDetails.relationshipStatus && (
                  <>
                    <h3 className="text-base font-kalam-bold text-deep-charcoal">
                      Relationsip Status
                    </h3>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Heart className="w-5 h-5 text-warm-dust " />
                      <p className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                        {author.personalDetails.relationshipStatus}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Work Panel */}
          {activeTab === "work" && author.work && (
            <div className="space-y-4">
              <h3 className="text-base font-kalam-bold text-deep-charcoal">
                Work
              </h3>
              <div className="space-y-4">
                {author.work.map((job, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-warm-dust " />

                    <div>
                      {job.workplace && (
                        <p className="font-kalam-bold text-deep-charcoal">
                          {job.workplace}
                        </p>
                      )}
                      {job.role && (
                        <p className="text-xl text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                          {job.role}
                        </p>
                      )}
                      {(job.startDate || job.endDate) && (
                        <p className="text-xs font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                          {formatDate(job.startDate!)}
                          {job.endDate
                            ? ` – ${formatDate(job.endDate)}`
                            : " – Present"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Panel */}
          {activeTab === "education" && author.education && (
            <div className="space-y-4">
              <h3 className="text-base font-kalam-bold text-deep-charcoal">
                Education
              </h3>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <School className="w-5 h-5 text-warm-dust " />

                <p className="text-xl text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                  Went to <strong className="">{author.education}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Contact Info Panel */}
          {activeTab === "contactInfo" && author.contactInfo && (
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                {author.contactInfo.email && (
                  <>
                    <h3 className="text-base font-kalam-bold text-deep-charcoal">
                      Email
                    </h3>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-warm-dust " />

                      <a
                        href={`mailto:${author.contactInfo.email}`}
                        className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed"
                      >
                        {author.contactInfo.email}
                      </a>
                    </div>
                  </>
                )}
                {author.contactInfo.number && (
                  <>
                    <h3 className="text-base font-kalam-bold text-deep-charcoal">
                      Phone
                    </h3>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-warm-dust " />

                      <p className="text-xl font-bold text-deep-charcoal font-yuyu whitespace-pre-line leading-relaxed">
                        {author.contactInfo.number}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
