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
import ProfileCard from "@/components/ProfileCard";
import Work from "@/components/Work";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import ProjectGrid from "@/components/ProjectGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
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
    <div className="min-h-screen bg-background">
      <div className="grid-container pt-[120px] pb-[96px]">
        {/* Main Content */}
        <div className="col-span-6 col-start-1">
          <section className="mb-[160px]">
            <h1 className="mb-8 font-helveticaNowDisplayBold">
              Designer & Developer crafting unique digital experiences
            </h1>
            <p className="text-lg max-w-[46ch] font-helveticaNowTextRegular">
              Working as a freelance web developer.
              <br/>Focused on creating modern, user-centered digital solutions.
            </p>
          </section>

          <section id="work">
            <h2 className="mb-[96px] font-helveticaNowDisplayBold">Selected Work</h2>
            <div className="space-y-[96px]">
              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">Kostüme</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-xl mb-3 font-helveticaNowDisplayBold">Fashion E-commerce</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {projects[1].description}
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 font-helveticaNowTextRegular" asChild>
                    <a href={projects[1].anchor} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </article>

              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">El Desenfreno</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-xl mb-3 font-helveticaNowDisplayBold">Independent Publishing House</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {projects[0].description}
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 font-helveticaNowTextRegular" asChild>
                    <a href={projects[0].anchor} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </article>

              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">Vino Rodante</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-xl mb-3 font-helveticaNowDisplayBold">Wine E-commerce</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {projects[2].description}
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 font-helveticaNowTextRegular" asChild>
                    <a href={projects[2].anchor} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* Sidebar - aligned with main content */}
        <aside className="col-span-3 col-start-10 sticky top-[120px] self-start">
          <section id="about" className="focus-section">
            <h2 className="focus-title font-helveticaNowDisplayBold">Focus</h2>
            <div className="space-y-8">
              <div className="focus-category">
                <h3 className="uppercase-title font-helveticaNowDisplayBold">Development</h3>
                <div className="badge-container">
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">React</Badge>
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">Next.js</Badge>
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">TypeScript</Badge>
                </div>
              </div>
              <div className="focus-category">
                <h3 className="uppercase-title font-helveticaNowDisplayBold">Design</h3>
                <div className="badge-container">
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">UI/UX</Badge>
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">Typography</Badge>
                  <Badge variant="outline" className="skill-badge font-helveticaNowTextRegular">Grid Systems</Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-6">
            <h2 className="focus-title font-helveticaNowDisplayBold">Contact</h2>
            <div className="space-y-4">
              <a 
                href="mailto:ivannevares9@gmail.com" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
              >
                ivannevares9@gmail.com
              </a>
              <a 
                href="https://www.linkedin.com/in/ivan-nevares/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/i9-9" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
              >
                GitHub
              </a>
              <a 
                href="https://dribbble.com/i9i9" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
              >
                Dribbble
              </a>
            </div>
          </section>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
