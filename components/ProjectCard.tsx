import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowRightIcon } from "@radix-ui/react-icons";

type ProjectProps = {
  project: {
    title: string;
    description: string;
    image: string;
    anchor: string;
    tag?: string;
  };
  index: number;
};

const ProjectCard: React.FC<ProjectProps> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: "easeInOut" }}
      className="w-full group"
    >
      <Card className="w-full border-none bg-transparent hover:bg-accent/5 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-white">{project.title}</CardTitle>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="link" 
                    className="text-lima p-0 h-auto font-normal text-sm"
                    asChild
                  >
                    <a 
                      href={project.anchor}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      View Project
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Click to view the live project
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <CardDescription className="text-gray-400">
              {project.description}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
