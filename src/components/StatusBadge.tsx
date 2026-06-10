import { motion } from "framer-motion";

export function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
      </span>
      STATUS: ALMOST RELEASED
    </motion.div>
  );
}
