"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../components/ScreenSeparator";
import ProjectCard from "../components/ProjectCard";
import ProfileIntro from "../components/ProfileIntro";
import { projects } from "./data/projects";
import Image from "next/image";

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleToggleView = () => {
    setIsProjectsVisible((prev) => !prev);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#0C1014] text-light-gray overflow-x-hidden">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray relative overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 px-6 md:px-6 py-6 flex flex-col justify-between md:border-r border-mid-gray h-auto md:h-full relative">
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
          {hovered && (
            <motion.div
              className="fixed w-48 h-48 overflow-hidden rounded-md shadow-lg"
              style={{ top: position.y - 24, left: position.x - 24 }}
              animate={{ x: -10, y: -10 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
            >
              <Image
                src="/profile.jpeg" // Ensure this path is correct
                alt="Iván Nevares"
                width={300} // Optional: Adjust to your preferred size
                height={300} // Optional: Adjust to your preferred size
                className="w-full h-auto max-w-xs object-cover shadow-lg" // Add styles for responsiveness, rounded corners, and shadow
              />
            </motion.div>
          )}

          <div className="border-b border-t border-mid-gray md:border-none -mx-6 px-6 pt-4">
            <ProfileIntro />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6 flex flex-col justify-start items-start text-left rounded-xl relative overflow-y-auto flex-grow">
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
              className="flex flex-wrap gap-4 overflow-y-auto min-h-[60vh]" // Enable vertical scrolling and set minimum height
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </motion.div>
          )}

          {/* Toggle Button */}
          <motion.button
            onClick={handleToggleView}
            className="bg-lima text-black py-2 px-6 rounded-md z-10 mt-6 hover:bg-lima/80"
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
