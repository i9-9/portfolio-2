"use client"

import Navbar from "../../components/Navbar";
import Image from "next/image";
import React, { useState } from "react";

const InfoPage = () => {

  const handleLanguage = () => {
    setLanguage(!language);
  }

  const [language, setLanguage] = useState(true);

  return (
    <div className="pb-28 px-4">
      <Navbar />
      <div className="grid md:grid-cols-2">
        <div className="">
          <div className="flex justify-between items-center mt-24 md:mt-2 "> 
          <h3 className="text-md text-verde ">Ivan Nevares</h3>
          <h4 className="text-md text-verde ">
            Digital Design
          </h4>
          </div>
          <ul className="text-verde text-sm mb-2">
            <li>
              UX/UI</li>
            <li>
              Front-End Development</li>
          </ul>
          <div className="transition-all duration-700">
            {
              language ?
                (<div className="flex transition-all duration-700">
                  <button className=" text-sm font-bold text-verde border border-verde p-1 hover:bg-violeta transition-all duration-700">
                    EN
                  </button>
                  <button onClick={handleLanguage} className=" text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700">
                    ES
                  </button>
                </div>
                )
                :
                (
                  <div className="flex transition-all duration-700">
                    <button onClick={handleLanguage} className="text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700">
                      EN
                    </button>
                    <button className="mx-1 text-sm font-bold text-verde border border-verde p-1 hover:bg-violeta transition-all duration-700">
                      ES
                    </button>
                  </div>

                )
            }
            {
              language ?
                (
                  <p className="text-verde text-xs ">
                    <br />
                    At my best when learning, building and contributing to a
                    community! I like assembling UIs that look good and perform fast.
                    My background is one of a more creative approach, but recently I have
                    been combining my skills in design with functional thinking to build
                    high-end digital products.

                  </p>
                )
                :
                (
                  <p className="text-verde text-xs">
                    <br />
                    Estoy en mi mejor
                    momento cuando estoy aprendiendo, construyendo y contribuyendo a una
                    comunidad! Me gusta montar aplicaciones UI que se ven bien y se
                    ejecutan lo más rápido y óptimo posible.
                  </p>
                )
            }

          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Image className="mx-1 p-2 my-2 border border-verde shadow justify-self-end" src='/sangre.jpg' alt="picture of programmer into the unknown" height={500} width={500} />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

