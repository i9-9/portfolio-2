"use client";

import Image from "next/image";
import React, { useState } from "react";
import NavbarHome from "../../components/NavbarHome";

const InfoPage = () => {
  const [language, setLanguage] = useState(true);

  const handleLanguage = () => {
    setLanguage(!language);
  };

  return (
    <div className="font-supplySans">
      <NavbarHome />
      <div className="grid md:grid-cols-2 px-4">
        <div>
          <div className="flex justify-between mt-2 pr-4 items-baseline">
            <h3 className="text-h3 text-verde font-bold">Ivan Nevares</h3>
            <h4 className="text-p text-verde italic">Digital Design</h4>
          </div>
          <div className="text-verde text-small my-4 flex ">
            <div className="mr-2 bg-gris_oscuro text-gris_claro p-2 py-1 rounded-sm">Web Design</div>
            <div className="mr-2 bg-gris_oscuro text-gris_claro p-2 py-1 rounded-sm">UX/UI</div>
            <div className="bg-gris_oscuro text-gris_claro p-2 py-1 rounded-sm">Front-End Development</div>
          </div>
          <hr className="border-gris_oscuro" />
          <div className="transition-all duration-700 mt-4">
            <div className="flex transition-all duration-700">
              <button
                className={`rounded-md text-sm font-bold shadow-sm border-verde p-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 ${!language ? 'text-verde/25' : 'text-verde'}`}
                onClick={!language ? handleLanguage : undefined}
                style={{ minWidth: '40px' }}
              >
                EN
              </button>
              <button
                className={`rounded-md text-sm font-bold shadow-sm border-verde p-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 ${language ? 'text-verde/25' : 'text-verde'}`}
                onClick={language ? handleLanguage : undefined}
                style={{ minWidth: '40px', marginLeft: '8px' }}
              >
                ES
              </button>
            </div>
            {language ? (
              <p className="text-verde text-p tracking-wide ">
                <br />
                Designer with experience in websites and applications, dedicated to crafting unique, modern, and tailored experiences.<br/><br/>
Currently studying Graphic Design at the Universidad de Buenos Aires.<br/>
Sound Technician, trained at TECSON, Buenos Aires.<br/><br/>
Web Designer at newtro.xyz.<br/>
Available for freelance web projects.<br/><br/>  If you have any questions, feel free to <a href="mailto:ivannevares9@gmail.com" className="text-blue-500 underline">send me an email</a>.
              </p>
            ) : (
              <p className="text-verde text-p tracking-wide">
                <br />
                Diseñador con experiencia en sitios web y aplicaciones, dedicado a crear experiencias únicas, modernas y personalizadas.<br/><br/>
  Actualmente estudiando Diseño Gráfico en la Universidad de Buenos Aires.<br/>
  Técnico en Sonido, formado en TECSON, Buenos Aires.<br/><br/>
  Diseñador Web en newtro.xyz.<br/>
  Disponible para proyectos web freelance.<br/><br/>
  Si tienes alguna pregunta, no dudes en <a href="mailto:ivannevares9@gmail.com" className="text-blue-500 underline">enviarme un correo</a>.
              </p>
            )}
          </div>

          {/* Colocamos la imagen aquí para que se muestre en ambos idiomas */}
          <div className="mt-8">
            <Image
              src="/info/1682109304516.jpeg" // Path relativo a la carpeta public
              alt="Iván Nevares"
              width={250}
              height={150}
              className="rounded-lg" // Clase opcional para ajustar el estilo
            />
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
