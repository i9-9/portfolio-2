import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const ProfileIntro = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full max-w-5xl mx-auto px-6 py-24"
    >
      <div className="space-y-8">
        <div className="max-w-2xl">
          <motion.h1 
            className="text-lg font-normal tracking-tight leading-relaxed max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Designer & Developer crafting unique digital experiences
          </motion.h1>
          
          <motion.p 
            className="text-xs text-muted-foreground max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            I&apos;m a software developer based in Buenos Aires. I specialize in building web applications with a focus on user experience and clean code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            className="flex gap-4"
          >
            <Button 
              variant="default"
              className="gap-2"
              asChild
            >
              <a 
                href="#work"
                className="flex items-center"
              >
                View Projects
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </Button>
            
            <Button 
              variant="outline"
              className="gap-2"
              asChild
            >
              <a 
                href="mailto:ivannevares9@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get in Touch
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
        >
          <Card className="bg-accent/5 border-accent/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Experience</h3>
                  <p className="text-gray-400 text-sm">
                    5+ years of experience in web development and design, working with clients across different industries.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Education</h3>
                  <p className="text-gray-400 text-sm">
                    Graphic Design at UBA<br />
                    Sound Engineering at TECSON
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Services</h3>
                  <p className="text-gray-400 text-sm">
                    Web Development<br />
                    UI/UX Design<br />
                    Brand Identity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProfileIntro;