"use client";
import { motion, useScroll, useTransform } from "framer-motion";

// Define the array of blue shades
const blueShades = [
  "#001f3f",
  "#003366",
  "#004080",
  "#004c99",
  "#0059b3",
  "#0066cc",
  "#0073e6",
  "#0080ff",
];

export default function BlueBackground() {
  const { scrollY, scrollYProgress } = useScroll();

  // Create a parallax effect: the background moves upward at 20% of the scroll speed
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  // Create a color transition effect using the normalized scroll progress.
  // The input range is split into eight equal segments (0 to 1/7, 1/7 to 2/7, …, 6/7 to 1),
  // each mapping to a corresponding shade in the blueShades array.
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1/7, 2/7, 3/7, 4/7, 5/7, 6/7, 1],
    blueShades
  );

  return (
    <motion.div
      style={{ y, backgroundColor }}
      className="fixed inset-0 -z-10"
    />
  );
}
