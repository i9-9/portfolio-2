"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScreenSeparator from "../components/ScreenSeparator";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const EmbeddedVideo = ({ videoId, className }: { videoId: string; className?: string }) => {
  if (!videoId) return null;

  const videoUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&controls=0`;

  return (
    <div
      className={`relative w-full max-w-full h-0 ${className || ""}`}
      style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
    >
      <iframe
        src={videoUrl}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        className="absolute top-0 left-0 w-full h-full"
        title="Project Video"
      ></iframe>
    </div>
  );
};

const BrowserFrame = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="flex-grow text-center text-sm font-medium text-gray-700">{title}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const ProfileLayout = () => {
  const projects = [
    {
      title: "El Desenfreno",
      description:
        "Website for poetry publishing company from Buenos Aires, Argentina",
      image: "/projects-eldesenfreno/eight.png",
      anchor: "https://eldesenfreno.com",
      videoId: "",
    },
    {
      title: "Kostüme",
      description:
        "Website/E-Commerce showcasing their minimalist fashion collections and unique design approach.",
      image: "/projects-landing/kostume/presentation.png",
      anchor: "https://kostumeweb.net",
      videoId: "1049427357",
    },
    {
      title: "Newtro",
      description: "Website for web3 artist community",
      image: "/path/to/project3-image.jpg",
      anchor: "https://newtro.xyz",
      videoId: "",
    },
  ];

  const [currentProjectIndex] = useState(1); // Set to the "Kostüme" project
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1014] text-light-gray overflow-hidden">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray">
        <div className="w-full md:w-1/4 p-6 flex flex-col justify-between md:border-r border-mid-gray">
          <div>
            <Link href="/">
              <h1
                onClick={() => setIsSlideshowActive(false)}
                className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer"
              >
                Iván Nevares
              </h1>
            </Link>
          </div>
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

        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-start text-left rounded-xl relative">
          {!isSlideshowActive ? (
            <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack mb-6 text-mid-gray">
              An <span className="text-lima">experimental</span> designer with a
              focus on visual identity and digital design.
            </h2>
          ) : (
            <motion.div
              className="flex flex-col p-4 rounded-lg w-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BrowserFrame title={projects[currentProjectIndex].title}>
                {projects[currentProjectIndex].videoId ? (
                  <EmbeddedVideo
                    videoId={projects[currentProjectIndex].videoId}
                    className="rounded-md shadow-lg"
                  />
                ) : (
                  <div className="w-full h-auto bg-[#070707] rounded-lg">
                    <Image
                      src={projects[currentProjectIndex].image}
                      alt={projects[currentProjectIndex].title}
                      layout="responsive"
                      width={700}
                      height={400}
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>  
                )}
              </BrowserFrame>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <div>{currentYear}</div>
        <div>UX/UI - Web Design - Front/End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
