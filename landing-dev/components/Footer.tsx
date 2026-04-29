import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      className="h-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
}