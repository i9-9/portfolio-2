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
      {/* <h1 className="text-6xl md:text-9xl text-verde font-bold py-2 mx-1">
        INFO
      </h1> */}
      <div className="grid md:grid-cols-2">
        <div className="mt-10">
          <h3 className="mx-1 text-2xl font-bold text-verde ">Ivan Nevares</h3>
          <h4 className=" mx-1 text-xl text-verde font-offBitBold">
            DIGITAL DESIGN
          </h4>
          <ul className="text-verde mx-1 text-md italic my-3">
            <li>
              <span className="">
                -&gt;
              </span>
              Front-End Development</li>
            <li>
              <span className="">
                -&gt;
              </span>
              UX/UI</li>
          </ul>
          <h3 className="mx-1 text-sm font-bold text-verde ">
            Buenos Aires, Arg
          </h3>
          <br />
          <div className="transition-all duration-700">
            {
              language ?
                (<div className="flex transition-all duration-700">
                  <button className="mx-1 text-sm font-bold text-verde border border-verde p-1 hover:bg-violeta transition-all duration-700">
                    EN
                  </button>
                  <button onClick={handleLanguage} className="mx-1 text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700">
                    ES
                  </button>
                </div>
                )
                :
                (
                  <div className="flex transition-all duration-700">
                    <button onClick={handleLanguage} className="mx-1 text-sm font-bold text-verde/25 border border-verde p-1 hover:bg-violeta transition-all duration-700">
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
                  <p className="text-verde text-sm mx-1">
                    <br />
                    At my best when learning, building and contributing to a
                    community! I like assembling UIs that look good and perform fast.
                    My background is one of a more creative approach, but recently I have
                    been combining my skills in design with functional thinking to build
                    high-end digital products.
                    <br /> <br />
                    My favorite front-end tools are
                    JavaScript, Tailwind CSS, React.js, Next.js, and Figma; though I am
                    always trying to learn new technologies and broaden my knowledge
                    with what&apos;s best for my working process. -<br /><br />
                    <br />
                  </p>
                )
                :
                (
                  <p className="text-verde text-base mx-1">
                    <br />
                    Estoy en mi mejor
                    momento cuando estoy aprendiendo, construyendo y contribuyendo a una
                    comunidad! Me gusta montar aplicaciones UI que se ven bien y se
                    ejecutan lo más rápido y óptimo posible.
                    <br /> <br />  Mis herramientas de
                    front-end favoritas son JavaScript, Tailwind CSS, React.js, Next.js,
                    y Figma; aunque siempre trato de aprender nuevas tecnologías y
                    ampliar mi conocimiento para poder mejorar mi proceso de trabajo.
                  </p>
                )
            }

          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Image className="mx-1 p-2 my-2 border border-verde shadow justify-self-end" src='/sangre.jpg' alt="picture of programmer into the unknown" height={500} width={500} />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

