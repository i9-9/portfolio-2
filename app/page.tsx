"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../components/ScreenSeparator";
import ProjectCard from "../components/ProjectCard";
import ProfileIntro from "../components/ProfileIntro";
import FloatingImage from "../components/FloatingImage";
import { projects } from "./data/projects";
import { IoChevronDownOutline } from "react-icons/io5";
import ProfileCard from "@/components/ProfileCard";
import Work from "@/components/Work";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import ProjectGrid from "@/components/ProjectGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { PinContainer } from "@/components/ui/3d-pin";
import Image from "next/image";
import GeometricFlowCard from "@/components/GeometricFlowCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ContactFormModal } from "@/components/ContactFormModal";

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const headlineRef = useRef(null);
  const { t } = useLanguage();

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
    <div className="min-h-screen bg-background">
      <div className="grid-container pt-[120px] pb-[96px] lg:pb-[96px]">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-1 mb-12 lg:mb-0">
          <section className="mb-[80px] lg:mb-[160px]">
            <h1 className="mb-6 lg:mb-8 font-helveticaNowDisplayBold">
              {t('hero.title')}
            </h1>
            <p className="text-base lg:text-lg max-w-[46ch] font-helveticaNowTextRegular whitespace-pre-line">
              {t('hero.subtitle')}
            </p>
          </section>

          <section id="work">
            <h2 className="mb-[48px] lg:mb-[96px] font-helveticaNowDisplayBold">{t('work.title')}</h2>
            <div className="space-y-[48px] lg:space-y-[96px]">
              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">Kostüme</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-lg lg:text-xl mb-3 font-helveticaNowDisplayBold">{t('work.kostume.title')}</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {t('work.kostume.description')}
                  </p>
                  <AnimatedButton href={projects[1].anchor} previewImage={projects[1].previewImage} />
                </div>
              </article>

              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">El Desenfreno</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-lg lg:text-xl mb-3 font-helveticaNowDisplayBold">{t('work.desenfreno.title')}</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {t('work.desenfreno.description')}
                  </p>
                  <AnimatedButton href={projects[0].anchor} previewImage={projects[0].previewImage} />
                </div>
              </article>

              <article className="project-card">
                <div className="project-title">
                  <h3 className="font-helveticaNowDisplayBold">Vino Rodante</h3>
                </div>
                <div className="project-content">
                  <h4 className="text-lg lg:text-xl mb-3 font-helveticaNowDisplayBold">{t('work.vinorodante.title')}</h4>
                  <p className="mb-4 font-helveticaNowTextRegular">
                    {t('work.vinorodante.description')}
                  </p>
                  <AnimatedButton href={projects[2].anchor} previewImage={projects[2].previewImage} />
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* Sidebar - becomes full width on mobile */}
        <aside className="col-span-12 lg:col-span-3 lg:col-start-10 lg:sticky lg:top-[120px] lg:self-start mt-12 lg:mt-0">
          <section id="about" className="focus-section">
            <h2 className="focus-title font-helveticaNowDisplayBold">{t('focus.title')}</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-sm font-helveticaNowDisplayBold">{t('focus.development')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">React</Badge>
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Next.js</Badge>
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">TypeScript</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-helveticaNowDisplayBold">{t('focus.design')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">UX/UI</Badge>
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Adobe</Badge>
                  <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Figma</Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <section className="space-y-6">
            <h2 className="focus-title font-helveticaNowDisplayBold">{t('contact.title')}</h2>
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
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular text-left"
              >
                {t('contact.form')}
              </button>
            </div>
          </section>

          <Separator className="my-8" />
          
          <section className="mb-8">
            <GeometricFlowCard />
          </section>
        </aside>
      </div>
      <Footer />
      
      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </div>
  );
};

export default ProfileLayout;
