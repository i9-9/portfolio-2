"use client";

import { useState, lazy, Suspense } from "react";
import { projects } from "./data/projects";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ContactFormModal } from "@/components/ContactFormModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Toast } from "@/components/ui/toast";
import { Mail, Github, Linkedin, Dribbble, MessageSquare, Palette } from "lucide-react";

// Lazy load GeometricFlowCard para reducir el bundle inicial
const GeometricFlowCard = lazy(() => import("@/components/GeometricFlowCard"));

const currentYear = new Date().getFullYear();

const ProfileLayout = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { t } = useLanguage();

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("ivannevares9@gmail.com");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

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
              <TabsList className="!grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8 gap-y-2 gap-x-2 lg:gap-y-3 lg:gap-x-3 px-1 h-auto py-2">
                <TabsTrigger value="kostume" className="font-helveticaNowDisplayBold px-4 lg:px-5">Kostüme</TabsTrigger>
                <TabsTrigger value="heybristol" className="font-helveticaNowDisplayBold px-4 lg:px-5">Hey Bristol</TabsTrigger>
                <TabsTrigger value="vinorodante" className="font-helveticaNowDisplayBold px-4 lg:px-5">Vino Rodante</TabsTrigger>
                <TabsTrigger value="ursulabenavidez" className="font-helveticaNowDisplayBold px-4 lg:px-5">Ursula Benavidez</TabsTrigger>
                <TabsTrigger value="templodetierra" className="font-helveticaNowDisplayBold px-4 lg:px-5">Templo de Tierra</TabsTrigger>
                <TabsTrigger value="desenfreno" className="font-helveticaNowDisplayBold px-4 lg:px-5">El Desenfreno</TabsTrigger>
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
        <aside className="col-span-12 lg:col-span-3 lg:col-start-10 lg:sticky lg:top-32 lg:self-start mt-16 lg:mt-0 w-full max-w-full overflow-hidden">
          <Accordion type="multiple" defaultValue={["contact"]} className="w-full">
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
                  <div className="flex flex-col gap-3 accordion-item-stagger md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-3">
                    <button
                      onClick={copyEmailToClipboard}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular text-left py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span>Mail</span>
                    </button>
                    <a
                      href="https://github.com/i9-9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <Github className="w-4 h-4 flex-shrink-0" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ivan-nevares/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <Linkedin className="w-4 h-4 flex-shrink-0" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://www.behance.net/ivan_nevares"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <Palette className="w-4 h-4 flex-shrink-0" />
                      <span>Behance</span>
                    </a>
                    <a
                      href="https://dribbble.com/i9i9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <Dribbble className="w-4 h-4 flex-shrink-0" />
                      <span>Dribbble</span>
                    </a>
                    <button
                      onClick={() => setIsContactFormOpen(true)}
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-helveticaNowTextRegular text-left py-2 px-2 min-h-[44px] md:min-h-0 -mx-2 md:mx-0 rounded-md hover:bg-accent/50"
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span>{t('contact.form')}</span>
                    </button>
                  </div>
                </AccordionContent>
              </section>
            </AccordionItem>
          </Accordion>

          <Separator className="my-8" />

          <section className="mb-8 w-full max-w-full overflow-hidden">
            <Suspense fallback={<div className="w-full aspect-square bg-muted/50 rounded-lg animate-pulse" />}>
              <GeometricFlowCard />
            </Suspense>
          </section>
        </aside>
      </div>
      <Footer />
      
      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
      
      {/* Toast Notification */}
      <Toast message={t('contact.mailCopied')} isVisible={showToast} />
    </div>
  );
};

export default ProfileLayout;
