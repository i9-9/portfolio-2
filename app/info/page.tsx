"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import React, { useState } from "react";

const InfoPage = () => {
  const [language, setLanguage] = useState(true);

  const handleLanguage = () => {
    setLanguage(!language);
  };

  return (
    <div className="px-4 font-supplySans">
      <Navbar />
      <div className="grid md:grid-cols-2">
        <div>
          <div className="flex justify-between items-center mt-24 md:mt-2 pr-4">
            <h3 className="text-md text-verde">Ivan Nevares</h3>
            <h4 className="text-md text-verde">Digital Design</h4>
          </div>
          <ul className="text-verde text-sm mb-2">
            <li>UX/UI</li>
            <li>Front-End Development</li>
          </ul>
          <div className="transition-all duration-700">
            {language ? (
              <div className="flex transition-all duration-700">
                <button
                  className="text-sm font-bold text-verde border border-verde p-1 hover:bg-violeta transition-all duration-700"
                >
                  EN
                </button>
                <button
                  onClick={handleLanguage}
                  className="text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700"
                >
                  ES
                </button>
              </div>
            ) : (
              <div className="flex transition-all duration-700">
                <button
                  onClick={handleLanguage}
                  className="text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700"
                >
                  EN
                </button>
                <button
                  className="mx-1 text-sm font-bold text-verde border border-verde p-1 hover:bg-violeta transition-all duration-700"
                >
                  ES
                </button>
              </div>
            )}
            {language ? (
              <p className="text-verde text-xs">
                <br />
                At my best when learning, building and contributing to a
                community! I like assembling UIs that look good and perform fast.
                My background is one of a more creative approach, but recently I have
                been combining my skills in design with functional thinking to build
                high-end digital products.
              </p>
            ) : (
              <p className="text-verde text-xs">
                <br />
                Estoy en mi mejor
                momento cuando estoy aprendiendo, construyendo y contribuyendo a una
                comunidad! Me gusta montar aplicaciones UI que se ven bien y se
                ejecutan lo más rápido y óptimo posible.
              </p>
            )}
          </div>
        </div>
        <div className="relative h-[800px] w-full">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src='/sangre.jpg'
            alt="A programmer exploring the unknown"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
