"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScreenSeparator from "../components/ScreenSeparator";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const projects = [
    {
      title: "El Desenfreno",
      description: "Website for poetry publishing company from Buenos Aires, Argentina",
      image: "/projects-eldesenfreno/eight.png",
      anchor: "https://eldesenfreno.com",
    },
    {
      title: "Kostüme",
      description: "Website/E-Commerce showcasing their minimalist fashion collections and unique design approach.",
      image: "/projects-landing/kostume/presentation.png",
      anchor: "https://kostumeweb.net",
    },
    {
      title: "Newtro",
      description: "Website for web3 artist community",
      image: "/path/to/project3-image.jpg",
      anchor: "https://newtro.xyz",
    },
  ];

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  const nextProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1014] text-light-gray overflow-hidden">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray">
        <div className="w-full md:w-1/4 p-6 flex flex-col justify-between border-r border-mid-gray">
          <div>
            <Link href="/">
              <h1 className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer">
                Iván Nevares
              </h1>
            </Link>
          </div>
          <div className="flex flex-col mt-6 text-sm">
            <p className="text-lima">ivannevares9@gmail.com</p>
            <div className="text-sm text-lima mb-2">
              <a href="https://dribbble.com/i9i9" target="_blank" className="hover:text-bluer">
                Dribbble
              </a>
              <span className="mr-1">,</span>
              <a href="https://github.com/i9-9" target="_blank" className="hover:text-bluer">
                Github
              </a>
            </div>
            <p className="text-sm mb-4 font-helveticaNowTextRegular text-mid-gray">
              Designer with experience in websites and applications, dedicated to crafting unique, modern, and tailored experiences.
            </p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
              Currently studying Graphic Design at the Universidad de Buenos Aires.
            </p>
            <h1 className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
              Sound Technician, trained at TECSON, Buenos Aires.
            </h1>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
              Web Designer at newtro.xyz.
            </p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
              Available for freelance web projects.
              <br /> If you have any questions, feel free to send me an email.
            </p>
          </div>
          <div className="flex mt-4 text-black">
            <button
              onClick={() => {
                prevProject();
                setIsSlideshowActive(true);
              }}
              className="bg-light-gray rounded-md px-4 py-1 border-black border rounded-tr-none rounded-br-none hover:bg-mid-gray"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => {
                nextProject();
                setIsSlideshowActive(true);
              }}
              className="bg-light-gray rounded-md px-4 py-1 border-black border rounded-tl-none rounded-bl-none hover:bg-mid-gray"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-start text-left rounded-xl">
          {!isSlideshowActive ? (
            <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack mb-6 text-mid-gray">
              An <span className="text-lima">experimental</span> designer with a focus on visual identity and digital design.
            </h2>
          ) : (
            <motion.div
              className="flex flex-col p-4 rounded-lg bg-black w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack text-mid-gray">
                {projects[currentProjectIndex].title}
              </h2>
              <p className="text-md text-light-gray text-left">
                {projects[currentProjectIndex].description}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 p-4 animate-slow-spin duration-1000 transition-all rotate-x-180">
        {!isSlideshowActive && (
          <Image
            src="/anim/logo1.png"
            alt="Ivan's Icon 1"
            width={42}
            height={41}
            layout="fixed"
          />
        )}
      </div>

      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <div>{currentYear}</div>
        <div>UX/UI - Web Design - Front/End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
