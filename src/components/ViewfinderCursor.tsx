import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function ViewfinderCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 35, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, select, textarea, [role="button"], [role="tab"]'
        );
        setIsInteractive(Boolean(interactive));
      }
    };

    const handleMouseDown = () => {
      setClickCount((prev) => prev + 1);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  const baseRotation = (isInteractive ? 90 : 0) + clickCount * 180;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 hidden md:flex items-center justify-center mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Architectural Camera Viewfinder Frame */}
      <motion.div
        animate={{
          width: isInteractive ? 40 : 24,
          height: isInteractive ? 40 : 24,
          rotate: baseRotation,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        {/* 4 Corner Brackets */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E8E7E2]" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E8E7E2]" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E8E7E2]" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E8E7E2]" />

        {/* Center Signal Point */}
        <motion.span
          key={clickCount}
          initial={{ scale: 2.6 }}
          animate={{ scale: isInteractive ? 1.5 : 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-1.5 h-1.5 bg-[#D6FF3F]"
        />
      </motion.div>
    </motion.div>
  );
}
