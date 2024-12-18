import React from "react";
import Image from "next/image";
import { Link } from "react-scroll";
import { IoChevronDown } from "react-icons/io5";

const Hero: React.FC = () => {
  return (
    <div
      id="hero"
      className="grid grid-cols-1 md:grid-cols-2 px-4 border-b border-gris_oscuro overflow-hidden min-h-screen"
    >
      <div className="flex items-center justify-center md:border-r border-gris_oscuro hero-item">
        <div className="text-left pt-4 md:pt-0">
          <div className="flex gap-1 flex-wrap">
            {/* Envolver cada botón con Link */}
            <Link to="work" spy={true} smooth={true} offset={0} duration={500}>
              <button className="py-1 px-2 shadow-sm mb-2 text-md text-oscuro bg-gris_claro flex items-center text-gris_oscuro hero-item text-small rounded-sm">
                Web Design
              </button>
            </Link>
            <Link to="work" spy={true} smooth={true} offset={0} duration={500}>
              <button className="py-1 px-2 shadow-sm mb-2 text-md text-oscuro bg-gris_claro flex items-center text-gris_oscuro hero-item text-small rounded-sm">
                UX/UI
              </button>
            </Link>
            <Link to="work" spy={true} smooth={true} offset={0} duration={500}>
              <button className="py-1 px-2 shadow-sm mb-2 text-md text-oscuro bg-gris_claro flex items-center text-gris_oscuro hero-item text-small rounded-sm">
                Mobile
              </button>
            </Link>
            <Link to="work" spy={true} smooth={true} offset={0} duration={500}>
              <button className="py-1 px-2 shadow-sm mb-2 text-md text-oscuro bg-gris_claro flex items-center text-gris_oscuro hero-item text-small rounded-sm">
                Front-End Development
              </button>
            </Link>
          </div>
          <h1 className="text-h1 font-bold py-2 hero-item tracking-tight">
            Creating unique digital identities with clarity and purpose
          </h1>
          <Link
            className="pointer hero-item"
            to="work"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
          >
            <button className="rounded-md p-2 mt-4 border-verde border-1 border-black hover:bg-[#0E0E0E]/30 hover:text-gris_claro hover:bg-verde transition-all duration-700 flex items-center animate-pulse text-p">
              Selected Work
              <IoChevronDown className="ml-2 text-#262626" />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center hero-item py-10 md:py-0">
        <a target="_blank" href="https://eldesenfreno.com" className="w-full md:w-auto">
          <Image
            src="/projects-eldesenfreno/eight.png"
            alt="Hero Image"
            width={1000}
            height={1000}
            className="object-contain custom-shadow rounded-md w-full md:w-auto"
          />
        </a>
      </div>
    </div>
  );
};

export default Hero;
