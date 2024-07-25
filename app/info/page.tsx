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
          <div className="flex justify-between mt-24 md:mt-2 pr-4 items-baseline">
            <h3 className="text-3xl text-verde font-bold">Ivan Nevares</h3>
            <h4 className="text-md text-verde italic">Digital Design</h4>
          </div>
          <div className="text-verde text-xs my-4 flex ">
            <div className="mr-2 bg-gris_oscuro text-gris_claro p-2 py-1">Web Design</div>
            <div className="mr-2 bg-gris_oscuro text-gris_claro p-2 py-1">UX/UI</div>
            <div className="bg-gris_oscuro text-gris_claro p-2 py-1">Front-End Development</div>
          </div>
          <hr className="border-gris_oscuro" />
          <div className="transition-all duration-700 mt-4">
            <div className="flex transition-all duration-700">
              <button
                className={`text-sm font-bold border border-verde p-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 ${!language ? 'text-verde/25' : 'text-verde'}`}
                onClick={!language ? handleLanguage : undefined}
                style={{ minWidth: '40px' }}
              >
                EN
              </button>
              <button
                className={`text-sm font-bold border border-verde p-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 ${language ? 'text-verde/25' : 'text-verde'}`}
                onClick={language ? handleLanguage : undefined}
                style={{ minWidth: '40px', marginLeft: '8px' }}
              >
                ES
              </button>
            </div>
            {language ? (
              <p className="text-verde text-sm">
                <br />
                Designer with expertise in websites and applications, dedicated to crafting unique, modern, and tailored experiences.<br/><br/>
Currently studying Graphic Design at the Universidad de Buenos Aires.<br/>
Sound Technician, trained at TECSON, Buenos Aires.<br/><br/>
Web Designer at newtro.xyz.<br/>
Available for freelance web projects.
              </p>
            ) : (
              <p className="text-verde text-sm">
                <br />
                Diseñador con experiencia en sitios web y aplicaciones, dedicado a crear experiencias únicas, modernas y personalizadas.<br/><br/>
Actualmente estudiando Diseño Gráfico en la Universidad de Buenos Aires.<br/>
Técnico en Sonido, formado en TECSON, Buenos Aires.<br/><br/>
Diseñador Web en newtro.xyz.<br/>
Disponible para proyectos web freelance.
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
