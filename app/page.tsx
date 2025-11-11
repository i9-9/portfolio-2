"use client";

import { useState } from "react";
import { projects } from "./data/projects";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import GeometricFlowCard from "@/components/GeometricFlowCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ContactFormModal } from "@/components/ContactFormModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="grid-container pt-24 pb-24">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-1 mb-16 lg:mb-0">
          <section className="mb-32 lg:mb-40">
            <h1 className="mb-6 font-helveticaNowDisplayBold pt-1">
              {t('hero.title')}
            </h1>
            <p className="text-base lg:text-lg max-w-[46ch] font-helveticaNowTextRegular whitespace-pre-line">
              {t('hero.subtitle')}
            </p>
          </section>

          <section id="work">
            <h2 className="mb-8 font-helveticaNowDisplayBold">{t('work.title')}</h2>
            <Tabs defaultValue="kostume" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 mb-8 h-auto py-1.5">
                <TabsTrigger value="kostume" className="font-helveticaNowDisplayBold">Kostüme</TabsTrigger>
                <TabsTrigger value="heybristol" className="font-helveticaNowDisplayBold">Hey Bristol</TabsTrigger>
                <TabsTrigger value="vinorodante" className="font-helveticaNowDisplayBold">Vino Rodante</TabsTrigger>
                <TabsTrigger value="ursulabenavidez" className="font-helveticaNowDisplayBold">Ursula Benavidez</TabsTrigger>
                <TabsTrigger value="templodetierra" className="font-helveticaNowDisplayBold">Templo de Tierra</TabsTrigger>
                <TabsTrigger value="desenfreno" className="font-helveticaNowDisplayBold">El Desenfreno</TabsTrigger>
              </TabsList>

              <TabsContent value="kostume" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.kostume.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.kostume.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[1].anchor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="heybristol" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.heybristol.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.heybristol.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[0].anchor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vinorodante" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.vinorodante.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.vinorodante.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[2].anchor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ursulabenavidez" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.ursulabenavidez.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.ursulabenavidez.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[3].anchor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="templodetierra" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.templodetierra.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.templodetierra.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[4].anchor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="desenfreno" className="mt-0">
                <div className="space-y-4">
                  <h4 className="text-lg lg:text-xl font-helveticaNowDisplayBold">{t('work.desenfreno.title')}</h4>
                  <p className="font-helveticaNowTextRegular">
                    {t('work.desenfreno.description')}
                  </p>
                  <div className="pt-2">
                    <AnimatedButton href={projects[5].anchor} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Sidebar - becomes full width on mobile */}
        <aside className="col-span-12 lg:col-span-3 lg:col-start-10 lg:sticky lg:top-32 lg:self-start mt-16 lg:mt-0">
          <Accordion type="multiple" defaultValue={[]} className="w-full">
            <AccordionItem value="focus" className="border-none">
              <section id="about" className="focus-section">
                <AccordionTrigger className="focus-title font-helveticaNowDisplayBold hover:no-underline px-0 pb-6">
                  {t('focus.title')}
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="space-y-8 accordion-item-stagger">
                    <div className="space-y-4">
                      <h3 className="text-sm font-helveticaNowDisplayBold">{t('focus.development')}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">React</Badge>
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Next.js</Badge>
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">TypeScript</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-helveticaNowDisplayBold">{t('focus.design')}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">UX/UI</Badge>
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Adobe</Badge>
                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] uppercase">Figma</Badge>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </section>
            </AccordionItem>

            <Separator className="my-8" />

            <AccordionItem value="contact" className="border-none">
              <section>
                <AccordionTrigger className="focus-title font-helveticaNowDisplayBold hover:no-underline px-0 pb-6">
                  {t('contact.title')}
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 accordion-item-stagger">
                    <a
                      href="mailto:ivannevares9@gmail.com"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
                    >
                      Mail
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
                      href="https://dribbble.com/i9i9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
                    >
                      Dribbble
                    </a>
                    <a
                      href="https://github.com/i9-9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular"
                    >
                      GitHub
                    </a>
                    <button
                      onClick={() => setIsContactFormOpen(true)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular text-left col-span-2"
                    >
                      {t('contact.form')}
                    </button>
                  </div>
                </AccordionContent>
              </section>
            </AccordionItem>
          </Accordion>

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
