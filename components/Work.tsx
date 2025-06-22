import { motion } from "framer-motion";
import ProjectGrid from "./ProjectGrid";

export default function Work() {
  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="text-sm font-normal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        Selected Work
      </motion.h2>
      <ProjectGrid />
    </motion.section>
  );
}
