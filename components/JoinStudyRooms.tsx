"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Users } from "lucide-react";

export function ProactifyJoinCard() {
  return (
    <div className="flex items-center justify-center px-4 w-full">
      <div
        className="
          bg-surface
          border-2 border-border
          text-text
          p-6 sm:p-8
          rounded-xl
          flex flex-col gap-0
          w-full
          max-w-[280px] sm:max-w-[340px]
          mt-6
          transition-none
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Join Our Study Discord!
        </h2>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Image
            src="/icons/Discord.svg"
            alt="Discord Logo"
            width={60}
            height={60}
            className="sm:w-20 sm:h-20 w-16 h-16"
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="https://discord.gg/YOUR_INVITE"
            target="_blank"
            className="
              cursor-pointer
              border-2 border-surface
              bg-surface
              p-2 rounded-xl
              flex items-center justify-center
              hover:border-border
              hover:bg-surface-alt
              transition-colors
              transition-none
            "
          >
            <ExternalLink
              size={24}
              className="sm:w-8 sm:h-8 w-6 h-6 text-text"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   PAGE COMPONENT (FLASH SAFE)
------------------------------------------------------------ */
export default function JoinStudyRooms() {
  const communities = [
    {
      name: "JvScholz",
      members: "150k+ members",
      invite: "https://discord.gg/REPLACE1",
    },
    {
      name: "StudyTogether",
      members: "920k+ members",
      invite: "https://discord.gg/REPLACE2",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 text-text transition-none">
      {/* Main invite card */}
      <ProactifyJoinCard />

      {/* Section title */}
      <h3 className="text-lg font-semibold text-center">
        Browse Other Communities
      </h3>

      {/* Community cards */}
      <div className="w-full flex flex-col items-center gap-4">
        {communities.map((c, i) => (
          <div
            key={i}
            className="
              bg-surface
              border-2 border-border
              rounded-xl
              p-4
              flex items-center justify-between
              w-full
              max-w-[280px] sm:max-w-[340px]
              transition-none
            "
          >
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10 h-10 rounded-xl
                  bg-surface-alt
                  flex items-center justify-center
                  border border-border
                "
              >
                <Users className="w-5 h-5 text-text" />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-semibold">{c.name}</span>
                <span className="text-sm opacity-60">{c.members}</span>
              </div>
            </div>

            {/* External link button */}
            <Link
              href={c.invite}
              target="_blank"
              className="
                cursor-pointer
                border-2 border-surface
                bg-surface
                p-2
                rounded-xl
                flex items-center justify-center
                hover:border-border
                hover:bg-surface-alt
                transition-colors
                transition-none
              "
            >
              <ExternalLink className="h-5 w-5 text-text" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

