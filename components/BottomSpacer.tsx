import { motion } from "framer-motion";

/** Bottom breathing room after the contact section (not a content footer). */
export default function BottomSpacer() {
  return (
    <motion.div
      className="h-24"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
}
