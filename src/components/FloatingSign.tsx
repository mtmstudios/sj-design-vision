import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniSign3D } from "./Sign3D";
import { Link } from "react-router-dom";

export default function FloatingSign() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-40"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Link
            to="/kontakt"
            className={`block w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-2xl overflow-hidden transition-transform duration-300 ${
              hovered ? "scale-110" : ""
            }`}
          >
            <MiniSign3D />
          </Link>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-3 py-1.5 text-xs font-semibold"
              >
                Jetzt anfragen
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
