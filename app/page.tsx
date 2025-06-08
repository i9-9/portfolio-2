"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../components/ScreenSeparator";
import ProjectCard from "../components/ProjectCard";
import ProfileIntro from "../components/ProfileIntro";
import FloatingImage from "../components/FloatingImage";
import { projects } from "./data/projects";
import { IoChevronDownOutline } from "react-icons/io5";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const headlineRef = useRef(null);

  const handleToggleView = () => {
    setIsProjectsVisible((prev) => !prev);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const toggleInfo = () => {
    setIsInfoVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!headlineRef.current) return;
    
    // Ensure text is visible immediately
    gsap.set(headlineRef.current, { opacity: 1, filter: "blur(0px)" });
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, filter: "blur(8px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          delay: 0.5, // Reduced delay
          ease: "power2.out",
          // Removed ScrollTrigger to prevent issues
        }
      );
    }, headlineRef);
    
    return () => ctx.revert();
  }, []);

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
          <FloatingImage hovered={hovered} position={position} imageSrc="/profile.jpeg" />

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
            {!isProjectsVisible ? (
              <h2
                ref={headlineRef}
                className="text-4xl md:text-7xl font-helveticaNowDisplayBlack mb-6 text-mid-gray"
              >
                <span className="text-lima">Designer</span> and{" "}
                <span className="text-lima">Front-End Developer</span>{" "}
                specializing in visual identity and digital experiences.
              </h2>
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
            className="bg-gray border-mid-gray/50 border text-lima drop-shadow-sm py-2 px-6 rounded-md z-10 mt-4 hover:bg-bluer/80 self-end transition-all duration-500"
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
