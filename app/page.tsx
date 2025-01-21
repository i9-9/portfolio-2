"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScreenSeparator from "../components/ScreenSeparator";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const ProfileLayout = () => {
  // List of projects for the slideshow
  const projects = [
    {
      title: "El Desenfreno",
      description:
        "Website for poetry publishing company from Buenos Aires, Argentina ",
      image: "/projects-eldesenfreno/eight.png",
      anchor: "https://eldesenfreno.com",
    },
    {
      title: "Kostüme",
      description:
        "Website/E-Commerce showcasing their minimalist fashion collections and unique design approach.",
      image: "/projects-landing/kostume/presentation.png",
      anchor: "https://kostumeweb.net",
    },
    {
      title: "Newtro",
      description: "Website for web3 artist community",
      image: "/path/to/project3-image.jpg",
      anchor: "https://newtro.xyz",
    },
    // Add more projects as needed
  ];

  // State to track the current project and whether the slideshow is active
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  // Function to navigate to the next project
  const nextProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to navigate to the previous project
  const prevProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-[#0C1014] text-light-gray flex flex-col relative overflow-x-hidden">
      <ScreenSeparator />
      {/* Container */}
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray">
        {/* Left Section */}
        <div className="w-full md:w-1/4 p-6 flex flex-col justify-between border-r border-mid-gray">
          {/* Header */}
          <div>
            <Link href="/">
              <h1 className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer">
                Iván Nevares
              </h1>
            </Link>
          </div>
          {/* Footer */}
          <div className="flex flex-col mt-6 text-sm">
            <p className="text-lima">ivannevares9@gmail.com</p>
            <div className="text-sm text-lima mb-2">
              <a
                href="https://dribbble.com/i9i9"
                target="_blank"
                className="hover:text-bluer"
              >
                Dribbble
              </a>
              <span className="mr-1">,</span>
              <a
                href="https://github.com/i9-9"
                target="_blank"
                className="hover:text-bluer"
              >
                Github
              </a>
            </div>
            <p className="text-sm mb-4 font-helveticaNowTextRegular text-mid-gray">
              Designer with experience in websites and applications, dedicated
              to crafting unique, modern, and tailored experiences.
            </p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">
              Currently studying Graphic Design at the Universidad de Buenos
              Aires.
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
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between items-start text-left bg-[#3D3D3E] rounded-xl min-h-[400px] ">
          {/* Default Text or Slideshow */}
          {!isSlideshowActive ? (
            <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack mb-6 text-mid-gray">
              An<span className="text-lima"> experimental </span>designer with a
              focus on visual identity and digital design.
            </h2>
          ) : (
            <motion.div
              className="flex flex-col "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title and Description Above Image */}
              <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack text-mid-gray">
                {projects[currentProjectIndex].title}
              </h2>
              <p className="text-md text-light-gray text-left">
                {projects[currentProjectIndex].description}
              </p>

              {/* Image Below */}
              <Image
                src={projects[currentProjectIndex].image}
                alt={projects[currentProjectIndex].title}
                width={800}
                height={600}
                className="rounded-lg w-full h-96 object-contain"
              />
            </motion.div>
          )}
          <div className="flex text-black mt-4">
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
      </div>

      {/* SVG in the upper right corner */}
      <div className="absolute top-4 right-4 p-4 animate-slow-spin duration-1000 transition-all rotate-x-180">
        <Image
          src="/anim/logo1.png"
          alt="Ivan's Icon 1"
          width={42}
          height={41}
          layout="fixed"
        />
      </div>

      {/* Bottom Bar */}
      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <div>2024</div>
        <div>UX/UI - Web Design - Front/End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
