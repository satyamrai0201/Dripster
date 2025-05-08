import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

const fashionItems = [
  { icon: "🕶️", name: "sunglasses", size: "text-5xl" },
  { icon: "👟", name: "sneakers", size: "text-6xl" },
  { icon: "🧢", name: "cap", size: "text-4xl" },
  { icon: "👕", name: "shirt", size: "text-5xl" },
  { icon: "👖", name: "jeans", size: "text-4xl" },
  { icon: "⌚", name: "watch", size: "text-3xl" },
  { icon: "💍", name: "ring", size: "text-3xl" },
  { icon: "👜", name: "bag", size: "text-5xl" }
  // Keeping the original 8 items and their sizes
];

// Generate evenly spread positions for items - Keeping original logic
const generateSpreadPositions = (count: number) => {
  const positions = [];
  const gridSize = Math.ceil(Math.sqrt(count));
  const cellWidth = 100 / (gridSize + 1);
  const cellHeight = 100 / (gridSize + 1);

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    // Add some randomness within each cell
    const randomX = Math.random() * (cellWidth * 0.6);
    const randomY = Math.random() * (cellHeight * 0.6);

    positions.push({
      left: `${(col + 1) * cellWidth - (cellWidth / 2) + randomX}%`,
      top: `${(row + 1) * cellHeight - (cellHeight / 2) + randomY}%`
    });
  }
  return positions;
};

const taglines = [
  "Street Style Redefined",
  "Where Edge Meets Attitude",
  "Your Style, Your Statement",
  "Fashion Forward, Always",
  "Elevate Your Street Game",
]; // Keeping the taglines array as provided

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeItems, setActiveItems] = useState<number[]>([]);
  // Keeping itemPositions initialized with the original generateSpreadPositions
  const [itemPositions] = useState(() => generateSpreadPositions(fashionItems.length));
  const [taglineIndex, setTaglineIndex] = useState(0);

  // No isMobile state or resize effect related to items, as per the provided code structure

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Animate items in sequence with longer delays
    const itemInterval = setInterval(() => {
      setActiveItems(prev => {
        if (prev.length >= fashionItems.length) return prev;
        return [...prev, prev.length];
      });
    }, 400); // Increased delay between items

    return () => {
      clearTimeout(timer);
      clearInterval(itemInterval);
    };
  }, []);

  // Tagline cycling effect
  useEffect(() => {
    if (!isVisible) return;
    const taglineTimer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 1600); // 1.6s per tagline
    return () => clearInterval(taglineTimer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-red-950"
        >
          <div className="relative w-full h-full overflow-hidden">
            {/* Animated background elements */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-zinc-500/10 to-black/20" />
            </motion.div>

            {/* Fashion items animation - Keeping original logic */}
            <div className="absolute inset-0">
              {fashionItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  className={cn(
                    "absolute",
                    item.size, // Using the original fixed size from fashionItems
                    "text-red-400/80 hover:text-red-300 cursor-pointer transition-colors transform -translate-x-1/2 -translate-y-1/2" // Keeping original transform
                  )}
                  style={{
                    left: itemPositions[index].left,
                    top: itemPositions[index].top,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    rotate: -180,
                    y: 100
                  }}
                  animate={activeItems.includes(index) ? {
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0.8],
                    rotate: [-180, 0],
                    y: [100, 0],
                  } : {}}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: index * 0.4 // Increased delay between items
                  }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </div>

            {/* Main content - Added horizontal padding for mobile */}
            {/* Keeping h-full and center justification */}
            {/* px-4 applies 1rem padding on mobile, sm:px-0 removes it on small screens and up */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-0">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center"
              >
                {/* Logo - Added responsive text size */}
                {/* Original was text-8xl */}
                <motion.h1
                  className={cn(
                    "text-5xl sm:text-8xl font-bold mb-4 tracking-tight", // Mobile size text-5xl, Desktop text-8xl
                    "bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  DRIPSTER
                </motion.h1>
                {/* Animated taglines - Keeping original logic (fixed height, fixed size, potential overlap) */}
                {/* Keeping flex, items-center, justify-center, relative, h-12 */}
                {/* Keeping overflow-hidden */}
                <div className="h-12 flex items-center justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* Tagline text - Keeping original fixed size */}
                    {/* Original was text-2xl */}
                    {/* Keeping absolute, w-full, text-center, mb-8, font-light, tracking-wider */}
                    <motion.p
                      key={taglineIndex}
                      className="absolute w-full text-center text-xs sm:text-2xl text-red-300 mb-8 font-light tracking-wider" // Original fixed size text-2xl
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {taglines[taglineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Fashion-inspired decorative elements - Added responsive text size and positioning */}
              {/* Original had absolute bottom-8 left-8 text-sm */}
              <motion.div
                className={cn(
                   "absolute text-red-400/40 tracking-widest", // Base styles (color, tracking)
                   "bottom-4 left-4 text-xs max-w-[45%]", // Mobile styles (bottom, left, size, width constraint)
                   "sm:bottom-8 sm:left-8 sm:text-sm sm:max-w-none" // Desktop styles (original bottom, left, size, no width constraint)
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
              >
                Curating Your Fashion Experience...
              </motion.div>
              {/* Original had absolute bottom-8 right-8 text-sm text-right */}
              <motion.div
                 className={cn(
                   "absolute text-red-400/40 tracking-widest text-right", // Base styles (color, tracking, text-right)
                   "bottom-4 right-4 text-xs max-w-[45%]", // Mobile styles (bottom, right, size, width constraint)
                   "sm:bottom-8 sm:right-8 sm:text-sm sm:max-w-none" // Desktop styles (original bottom, right, size, no width constraint)
                )}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
              >
                Loading Your Style Journey
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;