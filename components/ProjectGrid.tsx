import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Kostüme",
    description: "E-Commerce Website",
    image: "/projects-landing/kostume/1 - This is K.png",
    link: "/work/kostume",
    cols: "md:col-span-6"
  },
  {
    title: "El Desenfreno",
    description: "Publishing House Website",
    image: "/projects-eldesenfreno/el_desenfreno_macbook_mockup.png",
    link: "/work/eldesenfreno",
    cols: "md:col-span-3"
  }
];

const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-9 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          className={`col-span-9 ${project.cols} space-y-4`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <Link href={project.link} className="block group">
            <div className="relative aspect-[4/3] bg-accent/5 rounded-none overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                quality={75}
              />
            </div>
            <div className="mt-4">
              <motion.h4 
                className="text-sm font-normal"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                {project.title}
              </motion.h4>
              <motion.p 
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                {project.description}
              </motion.p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid; 