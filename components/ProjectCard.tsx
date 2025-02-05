import { motion } from "framer-motion";
import Image from "next/image";

type ProjectProps = {
  project: {
    title: string;
    description: string;
    image: string;
    anchor: string;
    tag?: string; // Optional tag
  };
  index: number;
};

const ProjectCard: React.FC<ProjectProps> = ({ project, index }) => {
  return (
    <motion.div
    initial={{ opacity: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, filter: "blur(0)" }}
    transition={{ delay: index * 0.15, duration: 0.8, ease: "easeInOut" }}
    className="bg-[#070707] rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 border border-mid-gray/40 transition-transform duration-300 ease-in-out"
    >
      {/* Imagen del proyecto */}
      <Image
        src={project.image}
        alt={project.title}
        layout="responsive"
        width={16}
        height={9}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Etiqueta opcional */}
      {project.tag && (
        <span className="bg-lima text-black text-sm px-2 py-1 rounded-full inline-block mb-2">
          {project.tag}
        </span>
      )}

      {/* Título y descripción */}
      <h2 className="text-white font-bold text-xl">{project.title}</h2>
      <p className="text-gray-400 text-sm">{project.description}</p>

      {/* Enlace para ver el proyecto */}
      <a
        href={project.anchor}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title} project`}
        className="text-lima mt-2 inline-block hover-underline-animation text-xs "
      >
        View Project
      </a>
    </motion.div>
  );
};

export default ProjectCard;
