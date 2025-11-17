"use client";

import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Left Content Section */}
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0 fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect shadow-modern hover-lift group cursor-pointer">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Book Your Dream Vacation Today
            </span>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="font-bold text-5xl md:text-6xl xl:text-8xl !leading-[114%] tracking-tight">
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              Discover{" "}
            </span>
            <span className="inline-block bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Amazing
            </span>
            <br />
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              Hotels & Experiences
            </span>
          </h1>

          {/* Description with enhanced styling */}
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            Experience the world like never before. Book{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              luxury hotels
            </span>
            ,{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              amazing experiences
            </span>
            , and{" "}
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              unforgettable adventures
            </span>{" "}
            all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <ButtonPrimary
              href="/listing-stay-map"
              sizeClass="px-8 py-4 sm:px-10 text-base font-semibold hover-lift shadow-modern"
            >
              <span className="flex items-center gap-2">
                Start Exploring
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </ButtonPrimary>

            <button className="px-8 py-4 sm:px-10 text-base font-semibold rounded-full border-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-all duration-300 hover-lift shadow-modern">
              Watch Video
            </button>
          </div>

          {/* Stats Section */}
          <div className="flex gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Happy Travelers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                200+
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Destinations
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                5,000+
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Hotels & Stays
              </div>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-grow relative scale-in">
          <div className="relative float-animation">
            <Image
              className="w-full drop-shadow-2xl"
              src={imagePng}
              alt="hero"
              priority
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-40 w-full scale-in">
        <HeroSearchForm />
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default SectionHero;
