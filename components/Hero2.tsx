import React from "react";
import Image from "next/image";
import { Link } from 'react-scroll';
import { IoChevronDown } from "react-icons/io5";

const Hero: React.FC = () => {
  return (
    <div id="hero" className="grid grid-cols-1 md:grid-cols-2 px-4 border-b border-gris_oscuro overflow-hidden h-[calc(100vh - var(--marquee-height) - var(--navbar-height))]">
      <div className="flex items-center justify-center md:border-r border-gris_oscuro hero-item">
        <div className="text-left pt-4 md:pt-0">
          <div className="flex gap-1">
            <button className="px-1 mb-2 text-md text-oscuro bg-gris_claro underline flex items-center text-gris_oscuro hero-item">
              Web Design
            </button>
            <button className="px-1 mb-2 text-md text-oscuro bg-gris_claro underline flex items-center text-gris_oscuro hero-item">
              UX/UI
            </button>
            <button className="px-1 mb-2 text-md text-oscuro bg-gris_claro underline flex items-center text-gris_oscuro hero-item">
              Mobile
            </button>
            <button className="px-1 mb-2 text-md text-oscuro bg-gris_claro underline flex items-center text-gris_oscuro hero-item">
              Front-End Development
            </button>
          </div>
          <h1 className="text-6xl md:text-6xl font-bold py-2 hero-item">
            Creating unique digital identities with clarity and purpose
          </h1>
          <Link className='pointer hero-item' to='work' spy={true} smooth={true} offset={0} duration={500}>
            <button className="p-2 mt-4 border-b border-verde border-0 border-b-[0.5px] hover:bg-[#0E0E0E]/30 hover:text-gris_claro hover:bg-verde transition-all duration-700 flex items-center animate-pulse">
              Selected Work
              <IoChevronDown className="ml-2 text-#262626" />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center pb-8 md:pb-32 hero-item">
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
