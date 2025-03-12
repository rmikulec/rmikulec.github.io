import React, { useEffect, useState } from 'react';

interface ScrollBasedBlueBackgroundProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement>;
}

function ScrollBasedBlueBackground({ children, containerRef }: ScrollBasedBlueBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [numScreens, setNumScreens] = useState(1);

  // Define parameters for the blue shades
  const step = 30; // How much to decrease the blue channel per screen
  const minBlue = 100;
  const maxBlue = 255;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      setScrollY(scrollPos);

      // Calculate number of screens based on the container's scrollHeight and its viewport height
      const screens = Math.ceil(container.scrollHeight / container.clientHeight);
      setNumScreens(screens);
    };

    container.addEventListener('scroll', handleScroll);
    // Also update once on mount
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  // Safely get the container's viewport height
  const containerHeight = containerRef.current
    ? containerRef.current.clientHeight
    : (typeof window !== 'undefined' ? window.innerHeight : 0);

  // Generate an array of blocks – one per screen – each with a discrete blue shade
  const blocks = [];
  for (let i = 0; i < numScreens; i++) {
    const blueValue = Math.max(minBlue, maxBlue - i * step);
    blocks.push(
      <div
        key={i}
        style={{
          height: containerHeight,
          background: `rgb(0, 0, ${blueValue})`,
        }}
      />
    );
  }

  // Apply a parallax effect: make the background container move faster (1.5x) than the scroll
  const backgroundTranslate = scrollY * .5;

  return (
    <>
      {/* Fixed background layer with the discrete blue blocks */}
      <div
        style={{
          transform: `translateY(-${backgroundTranslate}px)`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          width: '100%',
        }}
      >
        {blocks}
      </div>
      {/* Render the foreground children */}
      {children}
    </>
  );
}

export default ScrollBasedBlueBackground;
