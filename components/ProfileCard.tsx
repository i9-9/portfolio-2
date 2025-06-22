"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const ProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Card className="bg-accent/5 border-accent/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/profile.jpeg" alt="Ivan Nevares" />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Ivan Nevares</h1>
                <p className="text-gray-400">Full Stack Developer & Designer</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">UI/UX</Badge>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  asChild
                >
                  <a 
                    href="/CV_Ivan_Nevares.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download CV
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="default"
                  className="gap-2"
                  asChild
                >
                  <a 
                    href="mailto:ivannevares9@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Me
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
