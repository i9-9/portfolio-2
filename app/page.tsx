// app/page.tsx
"use client";

import ScreenSeparator from "../components/ScreenSeparator";
import Work from "../components/Work";
import Hero from "../components/Hero2";
import NavbarHome from "../components/NavbarHome";
import MyMarquee from "../components/MarqueeLanding";
import Contacto from "../components/Contacto";

const Home: React.FC = () => {
  return (
    <div className="mx-auto relative">
      <ScreenSeparator />
      <div>
        <MyMarquee />
      </div>
      <NavbarHome />
      <Hero />
      <Work />
      <Contacto />
    </div>
  );
};

export default Home;
