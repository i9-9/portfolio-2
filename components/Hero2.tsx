import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";

const Hero: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen px-4">
      <div className="flex items-center justify-center pb-8 md:pb-32">
        <div className="text-left">
          <button className="pl-1 mb-2 text-md text-oscuro bg-claro underline flex items-center">
            Web Design
          </button>
          <h1 className="text-3xl md:text-6xl font-bold">
            Creating unique digital identities with clarity and purpose
          </h1>
          <Link href="/contact">
            <button className="p-2 mt-4 border-solid border-verde border-[0.5px] hover:bg-[#0E0E0E]/30 hover:text-gris_claro hover:bg-verde transition-all duration-700 flex items-center animate-pulse">
              Selected Work
              <IoChevronDown color="#262626 " className="ml-2" />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center pb-8 md:pb-32">
        <Image
          src="/projects-eldesenfreno/el_desenfreno_macbook_mockup.png"
          alt="Hero Image"
          width={1000}
          height={1000}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;
