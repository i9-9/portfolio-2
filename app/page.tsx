"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../components/ScreenSeparator";
import ProjectCard from "../components/ProjectCard";
import ProfileIntro from "../components/ProfileIntro";
import { projects } from "./data/projects"; // Asegúrate de que esta ruta sea correcta

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);

  const handleToggleView = () => {
    setIsProjectsVisible((prev) => !prev); // Toggle entre texto y proyectos
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C1014] text-light-gray">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray relative overflow-y-auto">
        {/* Sección de introducción (Sidebar) */}
        <div className="w-full md:w-1/4 p-6 flex flex-col justify-between md:border-r border-mid-gray h-full">
          <div>
            <Link href="/">
              <h1 className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer">
                Iván Nevares
              </h1>
            </Link>
          </div>
          <ProfileIntro />
        </div>

        {/* Sección de proyectos */}
        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-start text-left rounded-xl relative">
          {/* Texto de presentación */}
          {!isProjectsVisible ? (
            <motion.h2
              className="text-4xl md:text-7xl font-helveticaNowDisplayBlack mb-6 text-mid-gray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-lima">Designer</span> and {" "}
              <span className="text-lima">Front-end Developer</span>{" "}
              specializing in visual identity and digital experiences.{" "}
            </motion.h2>
          ) : (
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))
              ) : (
                <p className="text-mid-gray">No projects available.</p>
              )}
            </motion.div>
          )}

          {/* Botón de Scroll (toggle entre las secciones) */}
          <motion.button
            onClick={handleToggleView}
            className="bg-lima text-black py-2 px-6 rounded-md z-10 mt-6 hover:bg-lima/80"
            transition={{ duration: 0.3 }}
          >
            {isProjectsVisible ? "Back to Intro" : "Show Projects"}
          </motion.button>
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
