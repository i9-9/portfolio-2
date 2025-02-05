"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../components/ScreenSeparator";
import ProjectCard from "../components/ProjectCard";
import ProfileIntro from "../components/ProfileIntro";
import { projects } from "./data/projects";
import Image from "next/image";
import { IoChevronDownOutline } from "react-icons/io5";

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const handleToggleView = () => {
    setIsProjectsVisible((prev) => !prev);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const toggleInfo = () => {
    setIsInfoVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#0C1014] text-light-gray overflow-x-hidden">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray/50 relative overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 px-6 md:px-6 py-6 flex flex-col justify-between md:border-r border-mid-gray/50 h-auto md:h-full relative">
          <div>
            <Link href="/">
              <h1
                className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer relative"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={handleMouseMove}
              >
                Iván Nevares
              </h1>
            </Link>
          </div>

          {/* Floating Image */}
          <motion.div
            className="fixed w-48 h-48 overflow-hidden rounded-md shadow-lg pointer-events-none"
            style={{ top: position.y - 24, left: position.x - 24 }}
            animate={{
              opacity: hovered ? 1 : 0,
              scale: hovered ? 1 : 0.9,
              rotateX: hovered ? 0 : -30, // 3D tilt when disappearing
            }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
          >
            <Image
              src="/profile.jpeg"
              alt="Iván Nevares"
              width={200}
              height={200}
              className="w-full h-auto max-w-xs object-cover shadow-lg"
            />
          </motion.div>

          {/* Info Section for Mobile */}
          <div className="md:hidden border-b border-t border-mid-gray/50 -mx-6 px-6 py-4">
            <button
              onClick={toggleInfo}
              className="text-lima w-full text-left py-2 px-4 flex items-center justify-between border border-mid-gray/50 rounded-md"
            >
              Info
              <motion.span
                animate={{ rotate: isInfoVisible ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <IoChevronDownOutline size={20} />
              </motion.span>
            </button>
            <motion.div
              className={`overflow-hidden ${
                isInfoVisible ? "max-h-[500px]" : "max-h-0"
              } transition-all duration-300`}
            >
              <ProfileIntro />
            </motion.div>
          </div>
          {/* Info remains the same for desktop */}
          <div className="hidden md:block border-b border-t border-mid-gray md:border-none -mx-6 px-6 pt-4">
            <ProfileIntro />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-start text-left rounded-xl relative overflow-y-auto flex-grow">
          <div className="flex-grow">
            {/* Presentation Text */}
            {!isProjectsVisible ? (
              <motion.h2
                className="text-4xl md:text-7xl font-helveticaNowDisplayBlack mb-6 text-mid-gray"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-lima">Designer</span> and{" "}
                <span className="text-lima">Front-End Developer</span>{" "}
                specializing in visual identity and digital experiences.
              </motion.h2>
            ) : (
              <motion.div
                className="flex flex-wrap gap-4 overflow-y-auto min-h-[60vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} index={index} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Toggle Button */}
          <motion.button
            onClick={handleToggleView}
            className="bg-gray border-mid-gray/50 border text-lima drop-shadow-sm py-2 px-6 rounded-md z-10 mt-4 hover:bg-bluer/80 self-end "
            transition={{ duration: 0.3 }}
          >
            {isProjectsVisible ? "Back to Intro" : "Show Projects"}
          </motion.button>
        </div>
      </div>

      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between w-full">
        <div>{currentYear}</div>
        <div>UX/UI - Web Design - Front-End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
