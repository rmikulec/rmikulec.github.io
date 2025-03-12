"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HoverMenu() {
  const [open, setOpen] = useState(false);

  return (
    // A container that listens for mouse enter/leave events
    <div
      className="fixed top-4 left-4 z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* The trigger button */}
      <Button variant="ghost" className="bg-transparent">
        Menu
      </Button>

      {/* Reveal the menu on hover */}
      <AnimatePresence>
        {open && (
          <motion.div
            // Animations for reveal
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            // Menu styling
            className="mt-2 w-44 bg-black/20 backdrop-blur-sm 
                       rounded-md overflow-hidden shadow-md"
          >
            <ul className="flex flex-col text-gray-50 cursor-pointer">
              <li className="px-4 py-2 hover:bg-black/30">Home</li>
              <li className="px-4 py-2 hover:bg-black/30">About</li>
              <li className="px-4 py-2 hover:bg-black/30">Projects</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
