"use client"

import NameAnimation from "../components/NameAnimation";
import Work from "../components/Work";
import Hero from "../components/Hero2";
import NavbarHome from "../components/NavbarHome";
import MyMarquee from "../components/MarqueeLanding";
import Contacto from "../components/Contacto";

const Home: React.FC = () => {
  return (
    <div className="mx-auto">
      <div className="">
        <MyMarquee />
      </div>
      <div className="items-center justify-between flex border-verde border-b pb-2 md:border-none md:pb-0 px-4">
      </div>
      <NavbarHome />
      <Hero />
      <Work />
      <Contacto />
    </div>
  );
};

export default Home;
