"use client";

import React, { FC } from "react";
import rightImgPng from "@/images/our-features.png";
import Image, { StaticImageData } from "next/image";
import Badge from "@/shared/Badge";

export interface SectionOurFeaturesProps {
  className?: string;
  rightImg?: StaticImageData;
  type?: "type1" | "type2";
}

const SectionOurFeatures: FC<SectionOurFeaturesProps> = ({
  className = "lg:py-14",
  rightImg = rightImgPng,
  type = "type1",
}) => {
  return (
    <div
      className={`nc-SectionOurFeatures relative flex flex-col items-center ${
        type === "type1" ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      data-nc-id="SectionOurFeatures"
    >
      <div className="flex-grow relative">
        <div className="relative float-animation">
          <Image src={rightImg} alt="" className="drop-shadow-2xl" />
          {/* Decorative gradient orbs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>
      </div>
      <div
        className={`max-w-2xl flex-shrink-0 mt-10 lg:mt-0 lg:w-2/5 ${
          type === "type1" ? "lg:pl-16" : "lg:pr-16"
        }`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-md uppercase text-xs font-bold tracking-widest bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          ✨ Benefits
        </span>
        <h2 className="font-bold text-5xl mt-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
          Why Choose Us
        </h2>

        <ul className="space-y-8 mt-12">
          <li className="group p-6 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 hover-lift cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Cost-effective advertising
                </span>
                <span className="block text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  With a free listing, you can advertise your rental with no upfront costs. Start earning today!
                </span>
              </div>
            </div>
          </li>
          <li className="group p-6 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 hover-lift cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Reach millions worldwide
                </span>
                <span className="block text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Millions of people are searching for unique places to stay around the world. Be discovered!
                </span>
              </div>
            </div>
          </li>
          <li className="group p-6 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 hover-lift cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="block text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Secure and simple
                </span>
                <span className="block text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  A secure and easy way to take bookings and payments online with full protection.
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default SectionOurFeatures;
