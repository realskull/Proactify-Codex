'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import React from 'react';

type LoginCardProps = {
  onLogin: () => void;
  customIcon?: React.ReactNode;
};

export default function LoginCard({ onLogin, customIcon }: LoginCardProps) {
  return (
    <div
      className="
        flex items-center justify-center min-h-screen px-4
        bg-bg
        text-text
      "
    >
      <div
        className="
          p-6 sm:p-8 rounded-xl w-full max-w-[280px] sm:max-w-[340px]
          flex flex-col gap-0
          border-2 border-border
          bg-surface
          text-text
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Login with Discord
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
          <button
            onClick={onLogin}
            className="
              cursor-pointer p-2 rounded-xl flex items-center justify-center
              transition-colors border-2
              bg-surface border-surface
              hover:bg-surface-alt
            hover:border-border

            "
          >
            {customIcon ?? (
              <ExternalLink
                size={24}
                className="sm:w-8 sm:h-8 w-6 h-6 text-text"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

