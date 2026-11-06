import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react';
import type { LookbookFrame } from '../data/content';
import { EditorialImage } from './EditorialImage';

interface ContinuousLookbookCarouselProps {
  frames: LookbookFrame[];
  onOpenProduct: (productId: string) => void;
}

interface CarouselCardProps {
  frame: LookbookFrame;
  index: number;
  total: number;
  phase: MotionValue<number>;
  isCenter: boolean;
  onCardClick: () => void;
}

function getCyclicDiff(idx: number, currentPhase: number, total: number): number {
  if (total <= 1) return 0;
  let diff = ((idx - currentPhase) % total + total) % total;
  if (diff > total / 2) {
    diff -= total;
  }
  return diff;
}

function CarouselCard({
  frame,
  index,
  total,
  phase,
  isCenter,
  onCardClick,
}: CarouselCardProps) {
  const x = useTransform(phase, (p) => {
    const diff = getCyclicDiff(index, p, total);
    return `${diff * 62}%`;
  });

  const scale = useTransform(phase, (p) => {
    const diff = Math.abs(getCyclicDiff(index, p, total));
    return Math.max(0.74, 1 - Math.min(1.2, diff) * 0.2);
  });

  const opacity = useTransform(phase, (p) => {
    const diff = Math.abs(getCyclicDiff(index, p, total));
    if (total <= 1) return 1;
    const maxVisible = Math.min(1.65, total / 2);
    if (diff >= maxVisible) return 0;
    return Math.max(0, 1 - Math.pow(diff / maxVisible, 2.2));
  });

  const zIndex = useTransform(phase, (p) => {
    const diff = Math.abs(getCyclicDiff(index, p, total));
    return Math.round(30 - diff * 12);
  });

  return (
    <motion.div
      onClick={onCardClick}
      style={{
        x,
        scale,
        opacity,
        zIndex,
      }}
      className="absolute top-0 bottom-0 w-[82%] sm:w-[60%] lg:w-[46%] max-w-[540px] cursor-pointer group select-none will-change-transform"
    >
      <div
        className={`w-full h-full border flex flex-col justify-between overflow-hidden transition-colors duration-500 ${
          isCenter
            ? 'border-[#151515] bg-[#151515] shadow-2xl'
            : 'border-[#B8BBB7] bg-[#E8E7E2] hover:border-[#151515]'
        }`}
      >
        <div className="relative flex-1 w-full overflow-hidden bg-[#151515]">
          <EditorialImage
            src={frame.image}
            alt={frame.imageAlt}
            fallbackTitle={frame.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isCenter ? 'group-hover:scale-105' : ''
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/85 via-transparent to-transparent pointer-events-none" />

          {isCenter && (
            <div className="absolute bottom-4 right-4 text-[11px] font-mono text-[#D6FF3F] bg-[#151515]/90 border border-[#D6FF3F] px-2.5 py-1 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span>Cliquer pour agrandir</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div
          className={`p-4 sm:p-5 border-t transition-colors duration-500 ${
            isCenter
              ? 'bg-[#151515] text-[#E8E7E2] border-[#2B2B28]'
              : 'bg-[#E8E7E2] text-[#151515] border-[#B8BBB7]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-xs font-mono">
            <span className={isCenter ? 'text-[#D6FF3F]' : 'text-[#898985]'}>
              Silhouette {frame.silhouette.toUpperCase()}
            </span>
            <span className="text-[#898985] truncate">{frame.environment}</span>
          </div>
          <h3
            className={`mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight uppercase truncate ${
              isCenter ? 'text-[#E8E7E2]' : 'text-[#151515]'
            }`}
          >
            {frame.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export function ContinuousLookbookCarousel({
  frames,
  onOpenProduct,
}: ContinuousLookbookCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<LookbookFrame | null>(null);

  const phase = useMotionValue(0);
  const targetPhaseRef = useRef<number | null>(null);

  // Reset phase when filter changes
  useEffect(() => {
    phase.set(0);
    targetPhaseRef.current = null;
    setActiveIndex(0);
  }, [frames.length, phase]);

  // Continuous ultra-slow glide (0.125 cards/sec = ~8s per card)
  useAnimationFrame((_, delta) => {
    if (frames.length <= 1) return;

    const dt = Math.min(delta, 50) / 1000; // cap delta to avoid jump after tab switch
    let current = phase.get();

    if (targetPhaseRef.current !== null) {
      // Smoothly ease toward clicked target
      const diff = targetPhaseRef.current - current;
      if (Math.abs(diff) < 0.005) {
        current = targetPhaseRef.current;
        targetPhaseRef.current = null;
      } else {
        current += diff * Math.min(1, dt * 6);
      }
      phase.set(current);
    } else if (!isPaused && !selectedFrame) {
      // Continuous slow forward glide
      current += dt * 0.13;
      phase.set(current);
    }

    const nearest = ((Math.round(current) % frames.length) + frames.length) % frames.length;
    if (nearest !== activeIndex) {
      setActiveIndex(nearest);
    }
  });

  const handlePrev = () => {
    const current = phase.get();
    targetPhaseRef.current = Math.round(current) - 1;
  };

  const handleNext = () => {
    const current = phase.get();
    targetPhaseRef.current = Math.round(current) + 1;
  };

  const handleJumpTo = (idx: number) => {
    const current = phase.get();
    const diff = getCyclicDiff(idx, current, frames.length);
    targetPhaseRef.current = current + diff;
  };

  const currentFrame = frames[activeIndex] ?? frames[0];

  return (
    <div
      className="relative flex flex-col gap-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[#151515] font-semibold tabular-nums">
            0{activeIndex + 1} / 0{frames.length}
          </span>
          <span aria-hidden="true" className="text-[#B8BBB7]">·</span>
          <span className="text-[#898985] hidden sm:inline">
            {isPaused ? 'Défilement suspendu au survol' : 'Défilement continu lent'}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Reprendre le défilement' : 'Mettre en pause'}
            className="p-1 hover:text-[#8D4936] text-[#898985] transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Silhouette précédente"
            className="w-8 h-8 border border-[#B8BBB7] bg-[#E8E7E2] hover:bg-[#151515] hover:text-[#D6FF3F] hover:border-[#151515] transition-colors flex items-center justify-center text-[#151515]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Silhouette suivante"
            className="w-8 h-8 border border-[#B8BBB7] bg-[#E8E7E2] hover:bg-[#151515] hover:text-[#D6FF3F] hover:border-[#151515] transition-colors flex items-center justify-center text-[#151515]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Continuous 3D Flow Stage */}
      <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden flex items-center justify-center py-4">
        {frames.map((frame, idx) => (
          <CarouselCard
            key={frame.id}
            frame={frame}
            index={idx}
            total={frames.length}
            phase={phase}
            isCenter={idx === activeIndex}
            onCardClick={() => {
              if (idx === activeIndex) {
                setSelectedFrame(frame);
              } else {
                handleJumpTo(idx);
              }
            }}
          />
        ))}
      </div>

      {/* Progress Selectors */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {frames.map((frame, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => handleJumpTo(idx)}
              aria-label={`Aller au look ${frame.index}`}
              className={`h-1.5 transition-all duration-300 ${
                isCurrent
                  ? 'w-10 bg-[#151515]'
                  : 'w-3 bg-[#B8BBB7] hover:bg-[#898985]'
              }`}
            />
          );
        })}
      </div>

      {/* Active Silhouette Readout & Quick Product Action Bar */}
      <div className="border border-[#B8BBB7] bg-[#E8E7E2] p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#898985]">
            <span className="text-[#151515] font-semibold tabular-nums">
              {currentFrame.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentFrame.environment}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#151515]">
            {currentFrame.title}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenProduct(currentFrame.linkedProductId)}
          className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors inline-flex items-center gap-2 self-start sm:self-center whitespace-nowrap shrink-0"
        >
          <span>Voir la pièce du système</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lightbox / Zoom Dialog on card click */}
      <AnimatePresence>
        {selectedFrame && (
          <div
            className="fixed inset-0 z-50 bg-[#151515]/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedFrame(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full bg-[#151515] border border-[#2B2B28] text-[#E8E7E2] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black">
                <EditorialImage
                  src={selectedFrame.image}
                  alt={selectedFrame.imageAlt}
                  fallbackTitle={selectedFrame.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 border-t border-[#2B2B28] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#D6FF3F]">
                    <span>{selectedFrame.index}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#B8BBB7]">{selectedFrame.environment}</span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight">
                    {selectedFrame.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProduct(selectedFrame.linkedProductId);
                      setSelectedFrame(null);
                    }}
                    className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#D6FF3F] text-[#151515] font-semibold hover:bg-[#E8E7E2] transition-colors"
                  >
                    Fiche technique
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFrame(null)}
                    className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider border border-[#2B2B28] text-[#E8E7E2] hover:bg-[#222220] transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
