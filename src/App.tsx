import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import {
  DROP_CONTENT,
  type ProductItem,
} from './data/content';
import { EditorialImage } from './components/EditorialImage';
import { ConstructionInspector } from './components/ConstructionInspector';
import { ContinuousLookbookCarousel } from './components/ContinuousLookbookCarousel';
import { ViewfinderCursor } from './components/ViewfinderCursor';

type LookbookFilter = 'all' | 'couche' | 'volume' | 'base';
type ProductFilter = 'all' | 'hauts' | 'accessoires';
type ConstructionTab = 'layers' | 'materials' | 'sizing';
type InfoModalType = 'contact' | 'instagram' | 'legal' | 'privacy' | null;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lookbookFilter, setLookbookFilter] = useState<LookbookFilter>('all');
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [constructionTab, setConstructionTab] = useState<ConstructionTab>('layers');

  // Early access visual-only form state
  const [email, setEmail] = useState('');
  const [preferredPiece, setPreferredPiece] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Footer info modal state
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);

  // Lookbook carousel index
  const [lookbookIndex, setLookbookIndex] = useState(0);

  // Active section tracker for sticky sub-bar
  const [activeSection, setActiveSection] = useState<{
    id: string;
    index: string;
    title: string;
    subtitle: string;
    theme: 'chalk' | 'dark';
  } | null>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sections: Array<{
      id: string;
      index: string;
      title: string;
      subtitle: string;
      theme: 'chalk' | 'dark';
    }> = [
      { id: 'manifeste', index: '01', title: 'Manifeste', subtitle: 'Pas une saison. Un système.', theme: 'chalk' },
      { id: 'lookbook', index: '02', title: 'Lookbook', subtitle: 'Silhouettes en situation', theme: 'chalk' },
      { id: 'collection', index: '03', title: 'Collection', subtitle: 'Drop 01 — Outside System', theme: 'chalk' },
      { id: 'construction', index: '04', title: 'Construction & Volumes', subtitle: 'Architecture du système', theme: 'dark' },
      { id: 'access', index: '05', title: 'Accès anticipé', subtitle: 'Le drop arrive bientôt.', theme: 'chalk' },
    ];

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      // Header height is ~64px. Reveal sticky bar once we scroll into content past hero (~500px)
      const threshold = scrollY + 110;
      let current: typeof activeSection = null;

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (top <= threshold) {
            current = sec;
          }
        }
      }

      setActiveSection(current);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredLookbook =
    lookbookFilter === 'all'
      ? DROP_CONTENT.lookbook
      : DROP_CONTENT.lookbook.filter((item) => item.silhouette === lookbookFilter);

  const filteredProducts =
    productFilter === 'all'
      ? DROP_CONTENT.products
      : DROP_CONTENT.products.filter((item) => item.category === productFilter);

  const handleOpenProductById = (productId: string) => {
    const found = DROP_CONTENT.products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      // 64px (header) + 38px (sticky context bar) = 102px
      const headerOffset = 102;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, elementTop - headerOffset),
        behavior: 'smooth',
      });
    }
  };

  const handleNotifyForPiece = (pieceName: string) => {
    setPreferredPiece(pieceName);
    setSelectedProduct(null);
    scrollToSection('access');
  };

  const handleAccessSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setEmailError('Merci de saisir une adresse email valide.');
      return;
    }
    setEmailError('');
    setIsSubmitted(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#E8E7E2] text-[#151515] flex flex-col">
        <ViewfinderCursor />
      {/* 1. Announcement Bar (static at top so mobile sticky height stays minimal) */}
      <div className="bg-[#151515] text-[#E8E7E2] border-b border-[#2B2B28]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono tracking-wide">
          <span>{DROP_CONTENT.drop.name}</span>
          <div className="flex items-center gap-3 text-[#B8BBB7]">
            <span>{DROP_CONTENT.drop.status}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D6FF3F]">{DROP_CONTENT.drop.launchDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Header — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#E8E7E2]/95 backdrop-blur-sm border-b border-[#B8BBB7]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('top');
            }}
            className="font-display text-2xl font-bold tracking-tight uppercase text-[#151515] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
          >
            {DROP_CONTENT.brand.name}
          </a>

          {/* Zone 2: 4 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#151515]"
          >
            <a
              href="#manifeste"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('manifeste');
              }}
              className="hover:text-[#8D4936] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
            >
              Manifeste
            </a>
            <a
              href="#lookbook"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('lookbook');
              }}
              className="hover:text-[#8D4936] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
            >
              Lookbook
            </a>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('collection');
              }}
              className="hover:text-[#8D4936] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
            >
              Collection
            </a>
            <a
              href="#construction"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('construction');
              }}
              className="hover:text-[#8D4936] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515]"
            >
              Construction
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={DROP_CONTENT.drop.primaryCta.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('access');
              }}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151515]"
            >
              {DROP_CONTENT.drop.primaryCta.label}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-[#151515] hover:bg-[#151515]/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigation mobile"
            className="md:hidden border-t border-[#B8BBB7] bg-[#E8E7E2] px-4 py-4 flex flex-col gap-3 text-sm font-medium"
          >
            <a
              href="#manifeste"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('manifeste');
              }}
              className="py-2 border-b border-[#B8BBB7]/50 text-[#151515]"
            >
              Manifeste
            </a>
            <a
              href="#lookbook"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('lookbook');
              }}
              className="py-2 border-b border-[#B8BBB7]/50 text-[#151515]"
            >
              Lookbook
            </a>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('collection');
              }}
              className="py-2 border-b border-[#B8BBB7]/50 text-[#151515]"
            >
              Collection
            </a>
            <a
              href="#construction"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('construction');
              }}
              className="py-2 text-[#151515]"
            >
              Construction
            </a>
          </nav>
        )}

        {/* Compositor-only Scroll Progress Hairline */}
        <motion.div
          aria-hidden="true"
          className="h-[2px] bg-[#151515] origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </header>

      {/* Sticky Section Context Line attached below Navbar (top-16) */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            key={activeSection.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`sticky top-16 z-20 border-b transition-colors duration-300 shadow-xs ${
              activeSection.theme === 'dark'
                ? 'bg-[#151515] text-[#E8E7E2] border-[#2B2B28]'
                : 'bg-[#E8E7E2] text-[#151515] border-[#B8BBB7]'
            }`}
          >
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className={`tabular-nums font-semibold ${
                    activeSection.theme === 'dark' ? 'text-[#D6FF3F]' : 'text-[#8D4936]'
                  }`}
                >
                  {activeSection.index}
                </span>
                <span
                  aria-hidden="true"
                  className={activeSection.theme === 'dark' ? 'text-[#898985]' : 'text-[#898985]'}
                >
                  /
                </span>
                <span
                  className={`uppercase tracking-wider font-semibold ${
                    activeSection.theme === 'dark' ? 'text-[#E8E7E2]' : 'text-[#151515]'
                  }`}
                >
                  {activeSection.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`hidden sm:inline ${
                    activeSection.theme === 'dark' ? 'text-[#898985]' : 'text-[#898985]'
                  }`}
                >
                  —
                </span>
                <span
                  className={`hidden sm:inline truncate ${
                    activeSection.theme === 'dark' ? 'text-[#B8BBB7]' : 'text-[#151515]/75'
                  }`}
                >
                  {activeSection.subtitle}
                </span>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('top');
                }}
                className={`text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  activeSection.theme === 'dark'
                    ? 'text-[#898985] hover:text-[#D6FF3F]'
                    : 'text-[#898985] hover:text-[#151515]'
                }`}
              >
                Haut ↑
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* 3. Hero du Drop 01 — Page-Load Entrance Animation */}
        <section className="border-b border-[#B8BBB7]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
            {/* Unboxed Metadata Line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#898985] mb-6"
            >
              <span className="text-[#151515] font-medium">{DROP_CONTENT.drop.code}</span>
              <span aria-hidden="true">/</span>
              <span>{DROP_CONTENT.drop.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>{DROP_CONTENT.drop.launchDate}</span>
              <span aria-hidden="true">·</span>
              <span>{DROP_CONTENT.drop.status}</span>
            </motion.div>

            {/* Editorial Headline & Promise */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-8"
              >
                <h1
                  className="font-display font-bold uppercase tracking-tight text-[#151515] leading-[0.94]"
                  style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', textWrap: 'balance' }}
                >
                  {DROP_CONTENT.drop.code} — {DROP_CONTENT.drop.subtitle}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-4 flex flex-col gap-6"
              >
                <p className="text-base sm:text-lg text-[#151515] leading-relaxed">
                  {DROP_CONTENT.brand.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={DROP_CONTENT.drop.primaryCta.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('access');
                    }}
                    className="px-6 py-3 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                  >
                    {DROP_CONTENT.drop.primaryCta.label}
                  </a>
                  <a
                    href={DROP_CONTENT.drop.secondaryCta.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('collection');
                    }}
                    className="px-6 py-3 text-xs font-mono uppercase tracking-wider border border-[#151515] text-[#151515] hover:bg-[#151515] hover:text-[#E8E7E2] transition-colors whitespace-nowrap shrink-0"
                  >
                    {DROP_CONTENT.drop.secondaryCta.label}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Dominant 16:9 Hero Visual */}
            <motion.figure
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden border border-[#B8BBB7] bg-[#151515]"
            >
              <div className="aspect-video w-full overflow-hidden">
                <EditorialImage
                  src={DROP_CONTENT.drop.heroImage}
                  alt={DROP_CONTENT.drop.heroImageAlt}
                  fallbackTitle="DROP 01 — OUTSIDE SYSTEM"
                  priority
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <figcaption className="px-4 py-2.5 bg-[#E8E7E2] border-t border-[#B8BBB7] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#898985]">
                <span>Paris · Architecture brute &amp; silhouettes en mouvement</span>
                <span>Visuel de direction artistique — {DROP_CONTENT.drop.status}</span>
              </figcaption>
            </motion.figure>
          </div>
        </section>

        {/* 4. Manifeste */}
        <section id="manifeste" className="border-b border-[#B8BBB7]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 lg:py-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="text-xs font-mono uppercase tracking-wider text-[#898985] mb-3">
                  01. Manifeste
                </p>
                <h2
                  className="font-display font-bold uppercase tracking-tight text-[#151515] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                >
                  {DROP_CONTENT.manifesto.title}
                </h2>
                <p className="mt-5 text-base text-[#151515]/85 leading-relaxed max-w-md">
                  {DROP_CONTENT.manifesto.text}
                </p>
              </div>

              <div className="lg:col-span-7 divide-y divide-[#B8BBB7] border-t border-b border-[#B8BBB7]">
                {DROP_CONTENT.brand.territory.map((item, idx) => (
                  <motion.div
                    key={item.index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline"
                  >
                    <span className="sm:col-span-1 text-xs font-mono text-[#898985] tabular-nums">
                      {item.index}
                    </span>
                    <h3 className="sm:col-span-4 text-sm font-semibold uppercase tracking-wide text-[#151515]">
                      {item.label}
                    </h3>
                    <p className="sm:col-span-7 text-sm text-[#151515]/80 leading-relaxed">
                      {item.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 5. Lookbook — Interactive Carousel */}
        <section id="lookbook" className="border-b border-[#B8BBB7]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 lg:py-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#898985] mb-3">
                  02. Lookbook
                </p>
                <h2
                  className="font-display font-bold uppercase tracking-tight text-[#151515] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                >
                  Silhouettes en situation
                </h2>
              </div>

              {/* Interactive Silhouette Filter */}
              <div
                role="group"
                aria-label="Filtrer les silhouettes du lookbook"
                className="flex flex-wrap items-center gap-1.5 bg-[#151515]/5 p-1 border border-[#B8BBB7]"
              >
                {(
                  [
                    { key: 'all', label: 'Toutes' },
                    { key: 'couche', label: 'Couche' },
                    { key: 'volume', label: 'Volume' },
                    { key: 'base', label: 'Base & Signal' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setLookbookFilter(tab.key);
                      setLookbookIndex(0);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                      lookbookFilter === tab.key
                        ? 'bg-[#151515] text-[#D6FF3F]'
                        : 'text-[#151515] hover:bg-[#151515]/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <ContinuousLookbookCarousel
              frames={filteredLookbook}
              onOpenProduct={handleOpenProductById}
            />
          </motion.div>
        </section>

        {/* 6. Produits — Drop 01 — Outside System */}
        <section id="collection" className="border-b border-[#B8BBB7]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 lg:py-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#898985] mb-3">
                  03. Collection
                </p>
                <h2
                  className="font-display font-bold uppercase tracking-tight text-[#151515] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                >
                  {DROP_CONTENT.drop.name}
                </h2>
              </div>

              {/* Interactive Product Category Filter */}
              <div
                role="group"
                aria-label="Filtrer les pièces par catégorie"
                className="flex flex-wrap items-center gap-1.5 bg-[#151515]/5 p-1 border border-[#B8BBB7]"
              >
                {(
                  [
                    { key: 'all', label: 'Toutes les pièces (4)' },
                    { key: 'hauts', label: 'Hauts & Couches (3)' },
                    { key: 'accessoires', label: 'Accessoires (1)' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setProductFilter(tab.key)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                      productFilter === tab.key
                        ? 'bg-[#151515] text-[#D6FF3F]'
                        : 'text-[#151515] hover:bg-[#151515]/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="border border-[#B8BBB7] bg-[#E8E7E2] grid grid-cols-1 sm:grid-cols-12 overflow-hidden"
                >
                  <div className="sm:col-span-5 aspect-[3/4] sm:aspect-auto bg-[#151515] overflow-hidden">
                    <EditorialImage
                      src={product.image}
                      alt={product.imageAlt}
                      fallbackTitle={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-6 border-t sm:border-t-0 sm:border-l border-[#B8BBB7]">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#898985] mb-3">
                        <span className="tabular-nums">Pièce {product.index}</span>
                        <span>{product.status}</span>
                      </div>

                      <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-[#151515]">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs font-mono text-[#8D4936]">
                        {product.layerRole}
                      </p>

                      <p className="mt-4 text-sm text-[#151515]/85 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#B8BBB7] flex items-center justify-between gap-4">
                      <span className="text-xs font-mono text-[#898985]">
                        Prix &amp; stocks à confirmer
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                      >
                        Fiche technique
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 7. Détails de construction & Système de tailles */}
        <section id="construction" className="bg-[#151515] text-[#E8E7E2] border-b border-[#2B2B28]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 lg:py-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#898985] mb-3">
                  04. Construction &amp; Volumes
                </p>
                <h2
                  className="font-display font-bold uppercase tracking-tight text-[#E8E7E2] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                >
                  Architecture du système
                </h2>
              </div>

              {/* Interactive Construction Tabs */}
              <div
                role="tablist"
                aria-label="Détails de construction et tailles"
                className="flex flex-wrap items-center gap-1.5 bg-[#222220] p-1 border border-[#2B2B28]"
              >
                {(
                  [
                    { key: 'layers', label: '01. Système de couches' },
                    { key: 'materials', label: '02. Matières & Patine' },
                    { key: 'sizing', label: '03. Guide des volumes' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={constructionTab === tab.key}
                    onClick={() => setConstructionTab(tab.key)}
                    className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                      constructionTab === tab.key
                        ? 'bg-[#D6FF3F] text-[#151515] font-medium'
                        : 'text-[#B8BBB7] hover:text-[#E8E7E2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {constructionTab === 'layers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {DROP_CONTENT.construction.layers.map((layer) => (
                  <div
                    key={layer.step}
                    className="border border-[#2B2B28] bg-[#1B1B19] p-6 flex flex-col justify-between gap-4"
                  >
                    <span className="text-xs font-mono text-[#D6FF3F] uppercase">
                      {layer.step}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#E8E7E2]">
                        {layer.name}
                      </h3>
                      <p className="mt-2 text-sm text-[#B8BBB7] leading-relaxed">
                        {layer.purpose}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {constructionTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DROP_CONTENT.construction.materials.map((mat, idx) => (
                  <div
                    key={mat.title}
                    className="border border-[#2B2B28] bg-[#1B1B19] p-6 flex flex-col gap-3"
                  >
                    <span className="text-xs font-mono text-[#898985] tabular-nums">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-semibold text-[#E8E7E2]">
                      {mat.title}
                    </h3>
                    <p className="text-sm text-[#B8BBB7] leading-relaxed">
                      {mat.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {constructionTab === 'sizing' && (
              <div className="border border-[#2B2B28] bg-[#1B1B19] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#2B2B28] text-xs font-mono uppercase text-[#898985]">
                      <th className="py-3.5 px-5">Taille</th>
                      <th className="py-3.5 px-5">Poitrine (cm)</th>
                      <th className="py-3.5 px-5">Longueur dos (cm)</th>
                      <th className="py-3.5 px-5">Épaules (cm)</th>
                      <th className="py-3.5 px-5">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B2B28] text-sm font-mono tabular-nums">
                    {DROP_CONTENT.construction.sizeGuide.map((row) => (
                      <tr key={row.size} className="hover:bg-[#222220] transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#D6FF3F]">
                          {row.size}
                        </td>
                        <td className="py-3.5 px-5 text-[#E8E7E2]">{row.chestCm}</td>
                        <td className="py-3.5 px-5 text-[#E8E7E2]">{row.lengthCm}</td>
                        <td className="py-3.5 px-5 text-[#E8E7E2]">{row.shoulderCm}</td>
                        <td className="py-3.5 px-5 text-[#B8BBB7]">{row.fit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Single Unified Image with Interactive Hover Hotspots */}
            <ConstructionInspector
              image={DROP_CONTENT.construction.systemOverviewImage}
              imageAlt={DROP_CONTENT.construction.systemOverviewAlt}
              hotspots={DROP_CONTENT.construction.systemHotspots}
            />
          </motion.div>
        </section>

        {/* 8. Accès anticipé */}
        <section id="access" className="border-b border-[#B8BBB7]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1360px] mx-auto px-4 sm:px-8 py-16 lg:py-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6">
                <p className="text-xs font-mono uppercase tracking-wider text-[#898985] mb-3">
                  05. Accès anticipé
                </p>
                <h2
                  className="font-display font-bold uppercase tracking-tight text-[#151515] leading-[0.98]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                >
                  {DROP_CONTENT.access.title}
                </h2>
                <p className="mt-4 text-base text-[#151515]/85 leading-relaxed max-w-md">
                  {DROP_CONTENT.access.text}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-[#898985]">
                  <span>{DROP_CONTENT.drop.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{DROP_CONTENT.drop.launchDate}</span>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="border border-[#151515] bg-[#E8E7E2] p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="py-4 flex flex-col gap-4">
                      <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#151515]">
                        <span className="w-5 h-5 bg-[#D6FF3F] border border-[#151515] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-[#151515]" />
                        </span>
                        <span>Inscription enregistrée (démonstration)</span>
                      </div>
                      <p className="text-base font-medium text-[#151515]">
                        {DROP_CONTENT.access.confirmationMessage}
                      </p>
                      <p className="text-xs font-mono text-[#898985]">
                        Adresse : {email}
                        {preferredPiece ? ` · Pièce suivie : ${preferredPiece}` : ''}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail('');
                        }}
                        className="mt-2 self-start text-xs font-mono uppercase underline underline-offset-4 text-[#151515] hover:text-[#8D4936]"
                      >
                        Modifier l’adresse
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAccessSubmit} noValidate className="flex flex-col gap-5">
                      <div>
                        <label
                          htmlFor="early-access-email"
                          className="block text-xs font-mono uppercase tracking-wider text-[#151515] mb-2"
                        >
                          {DROP_CONTENT.access.inputLabel}
                        </label>
                        <input
                          id="early-access-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          placeholder={DROP_CONTENT.access.inputPlaceholder}
                          className="w-full px-4 py-3 bg-[#E8E7E2] border border-[#151515] text-sm text-[#151515] placeholder:text-[#898985] focus:outline-none focus:ring-2 focus:ring-[#151515]"
                        />
                        {emailError && (
                          <p className="mt-1.5 text-xs font-mono text-[#8D4936]">
                            {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="block text-xs font-mono uppercase tracking-wider text-[#898985] mb-2">
                          Pièce d’intérêt (optionnel)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {DROP_CONTENT.products.map((p) => {
                            const active = preferredPiece === p.name;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() =>
                                  setPreferredPiece(active ? '' : p.name)
                                }
                                className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                                  active
                                    ? 'bg-[#151515] text-[#D6FF3F] border-[#151515]'
                                    : 'bg-transparent text-[#151515] border-[#B8BBB7] hover:border-[#151515]'
                                }`}
                              >
                                {p.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                          type="submit"
                          className="px-6 py-3.5 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                        >
                          {DROP_CONTENT.access.buttonLabel}
                        </button>
                        <span className="text-xs font-mono text-[#898985]">
                          Formulaire visuel · Aucun envoi de données
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-[#E8E7E2] text-[#151515]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-tight">
              {DROP_CONTENT.brand.name}
            </p>
            <p className="mt-1 text-xs font-mono text-[#898985]">
              {DROP_CONTENT.brand.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
            {DROP_CONTENT.footer.links.map((link) =>
              'href' in link ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href) {
                      scrollToSection(link.href.replace('#', ''));
                    }
                  }}
                  className="hover:text-[#8D4936] transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => setInfoModal(link.action)}
                  className="uppercase hover:text-[#8D4936] transition-colors"
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#898985]">
            {DROP_CONTENT.footer.legal.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setInfoModal(item.action)}
                className="hover:text-[#151515] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Product Specification Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-[#151515]/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#E8E7E2] border border-[#151515] max-w-2xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:col-span-5 aspect-[3/4] sm:aspect-auto bg-[#151515]">
              <EditorialImage
                src={selectedProduct.image}
                alt={selectedProduct.imageAlt}
                fallbackTitle={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6 border-t sm:border-t-0 sm:border-l border-[#B8BBB7]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-[#898985]">
                    Pièce {selectedProduct.index} · {selectedProduct.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    aria-label="Fermer la fiche technique"
                    className="p-1.5 text-[#151515] hover:bg-[#151515]/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3
                  id="modal-product-title"
                  className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-[#151515]"
                >
                  {selectedProduct.name}
                </h3>
                <p className="text-xs font-mono text-[#8D4936] mt-0.5">
                  {selectedProduct.layerRole}
                </p>

                <p className="mt-4 text-sm text-[#151515] leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[#B8BBB7]">
                  <p className="text-xs font-mono uppercase text-[#898985] mb-2">
                    Détails de construction
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#151515]/85">
                    {selectedProduct.constructionNotes.map((note) => (
                      <li key={note}>— {note}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-[#B8BBB7] space-y-2 text-xs">
                  <p>
                    <span className="font-mono uppercase text-[#898985]">Patine : </span>
                    <span className="text-[#151515]/85">{selectedProduct.patinaNote}</span>
                  </p>
                  <p>
                    <span className="font-mono uppercase text-[#898985]">Coupe : </span>
                    <span className="text-[#151515]/85">{selectedProduct.fitNote}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#B8BBB7] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleNotifyForPiece(selectedProduct.name)}
                  className="w-full px-4 py-3 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors"
                >
                  Être prévenu pour cette pièce
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info Modal (Contact / Instagram / Legal / Privacy) */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 bg-[#151515]/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="bg-[#E8E7E2] border border-[#151515] max-w-md w-full p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#B8BBB7]">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                {infoModal === 'contact' && 'Contact — HORS CHAMP'}
                {infoModal === 'instagram' && 'Instagram — @horschamp.paris'}
                {infoModal === 'legal' && 'Mentions légales'}
                {infoModal === 'privacy' && 'Politique de confidentialité'}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                aria-label="Fermer"
                className="p-1.5 text-[#151515] hover:bg-[#151515]/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-sm text-[#151515]/85 leading-relaxed space-y-3">
              {infoModal === 'contact' && (
                <>
                  <p>
                    HORS CHAMP — Studio de création streetwear parisien.
                  </p>
                  <p className="font-mono text-xs text-[#898985]">
                    contact@horschamp-paris.fr · Paris, France
                  </p>
                </>
              )}
              {infoModal === 'instagram' && (
                <>
                  <p>
                    Archives visuelles, essais de matières et annonces du Drop 01 — Outside System.
                  </p>
                  <p className="font-mono text-xs text-[#898985]">
                    @horschamp.paris (Compte de démonstration)
                  </p>
                </>
              )}
              {infoModal === 'legal' && (
                <p>
                  HORS CHAMP est une marque fictive présentée dans le cadre d’une collection de démonstration (Drop 01 — Outside System). Aucune transaction commerciale n’est effectuée sur cette page.
                </p>
              )}
              {infoModal === 'privacy' && (
                <p>
                  Le formulaire d’accès anticipé est strictement visuel : aucune donnée personnelle n’est transmise à un serveur ou stockée de manière permanente.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="mt-6 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] text-[#E8E7E2] hover:bg-[#D6FF3F] hover:text-[#151515] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      </div>
    </MotionConfig>
  );
}
