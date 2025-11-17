"use client";

import React, { FC } from "react";

export interface BgGlassmorphismProps {
  className?: string;
}

const BgGlassmorphism: FC<BgGlassmorphismProps> = ({
  className = "absolute inset-x-0 md:top-10 xl:top-40 min-h-0 pl-20 py-24 flex overflow-hidden z-0",
}) => {
  return (
    <div
      className={`nc-BgGlassmorphism ${className}`}
      data-nc-id="BgGlassmorphism"
    >
      {/* Primary gradient blob */}
      <span className="block bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-[32rem] lg:h-[32rem] animate-blob"></span>

      {/* Secondary gradient blob */}
      <span className="block bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 w-96 h-96 -ml-20 mt-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-[32rem] lg:h-[32rem] animate-blob animation-delay-2000"></span>

      {/* Tertiary gradient blob */}
      <span className="block bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 w-96 h-96 -ml-20 mt-20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 lg:w-[28rem] lg:h-[28rem] animate-blob animation-delay-4000"></span>

      {/* Additional accent blob for depth */}
      <span className="block bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 w-72 h-72 -ml-32 mt-64 rounded-full mix-blend-multiply filter blur-3xl opacity-15 lg:w-96 lg:h-96 animate-blob animation-delay-6000"></span>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
};

export default BgGlassmorphism;
