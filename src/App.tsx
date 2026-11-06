import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Menu,
  Moon,
  MoreHorizontal,
  Sun,
  X,
} from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import {
  DROP_CONTENT_FR,
  DROP_CONTENT_EN,
  type Language,
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('fr');
  const [prefsMenuOpen, setPrefsMenuOpen] = useState(false);
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

  const prefsMenuRef = useRef<HTMLDivElement>(null);
  const content = language === 'fr' ? DROP_CONTENT_FR : DROP_CONTENT_EN;

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync language attribute on <html> element
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Close preferences dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (prefsMenuRef.current && !prefsMenuRef.current.contains(e.target as Node)) {
        setPrefsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPrefsMenuOpen(false);
      }
    };
    if (prefsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [prefsMenuOpen]);

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
      {
        id: 'manifeste',
        index: '01',
        title: content.ui.navManifesto,
        subtitle: content.manifesto.title,
        theme: 'chalk',
      },
      {
        id: 'lookbook',
        index: '02',
        title: content.ui.navLookbook,
        subtitle: content.ui.lookbookTitle,
        theme: 'chalk',
      },
      {
        id: 'collection',
        index: '03',
        title: content.ui.navCollection,
        subtitle: content.drop.name,
        theme: 'chalk',
      },
      {
        id: 'construction',
        index: '04',
        title: content.ui.navConstruction,
        subtitle: content.construction.title,
        theme: 'dark',
      },
      {
        id: 'access',
        index: '05',
        title: content.drop.primaryCta.label,
        subtitle: content.access.title,
        theme: 'chalk',
      },
    ];

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
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
  }, [content]);

  const filteredLookbook =
    lookbookFilter === 'all'
      ? content.lookbook
      : content.lookbook.filter((item) => item.silhouette === lookbookFilter);

  const filteredProducts =
    productFilter === 'all'
      ? content.products
      : content.products.filter((item) => item.category === productFilter);

  const handleOpenProductById = (productId: string) => {
    const found = content.products.find((p) => p.id === productId);
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
      setEmailError(
        language === 'fr'
          ? 'Merci de saisir une adresse email valide.'
          : 'Please enter a valid email address.'
      );
      return;
    }
    setEmailError('');
    setIsSubmitted(true);
  };

  // Determine current sticky context bar visual theme
  const isDarkCanvas = theme === 'dark';
  const stickyBarTheme = isDarkCanvas ? 'dark' : (activeSection?.theme ?? 'chalk');

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#E8E7E2] dark:bg-[#151515] text-[#151515] dark:text-[#E8E7E2] transition-colors duration-200 flex flex-col">
        <ViewfinderCursor />

        {/* 1. Announcement Bar */}
        <div className="bg-[#151515] text-[#E8E7E2] border-b border-[#2B2B28] dark:bg-[#0D0D0C] dark:border-[#20201E]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono tracking-wide">
            <span>{content.drop.name}</span>
            <div className="flex items-center gap-3 text-[#B8BBB7]">
              <span>{content.drop.status}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#D6FF3F]">{content.drop.launchDate}</span>
            </div>
          </div>
        </div>

        {/* 2. Header — Strict 3-Zone Top Bar Contract */}
        <header className="sticky top-0 z-30 bg-[#E8E7E2]/95 dark:bg-[#151515]/95 backdrop-blur-sm border-b border-[#B8BBB7] dark:border-[#2B2B28] transition-colors duration-200">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
            {/* Zone 1: Single-line Brand Wordmark */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('top');
              }}
              className="font-display text-2xl font-bold tracking-tight uppercase text-[#151515] dark:text-[#E8E7E2] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
            >
              {content.brand.name}
            </a>

            {/* Zone 2: 4 Concise Single-Line Navigation Links */}
            <nav
              aria-label={language === 'fr' ? 'Navigation principale' : 'Main navigation'}
              className="hidden md:flex items-center gap-8 text-sm font-medium text-[#151515] dark:text-[#E8E7E2]"
            >
              <a
                href="#manifeste"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('manifeste');
                }}
                className="hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
              >
                {content.ui.navManifesto}
              </a>
              <a
                href="#lookbook"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('lookbook');
                }}
                className="hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
              >
                {content.ui.navLookbook}
              </a>
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('collection');
                }}
                className="hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
              >
                {content.ui.navCollection}
              </a>
              <a
                href="#construction"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('construction');
                }}
                className="hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
              >
                {content.ui.navConstruction}
              </a>
            </nav>

            {/* Zone 3: 1 Primary Action + Preferences Menu + Mobile Menu Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={content.drop.primaryCta.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('access');
                }}
                className="px-3.5 sm:px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151515] dark:focus-visible:outline-[#D6FF3F]"
              >
                {content.drop.primaryCta.label}
              </a>

              {/* Preferences Dropdown Button (Theme & Language) */}
              <div className="relative" ref={prefsMenuRef}>
                <button
                  type="button"
                  onClick={() => setPrefsMenuOpen((prev) => !prev)}
                  aria-label={content.ui.quickSettings}
                  aria-haspopup="menu"
                  aria-expanded={prefsMenuOpen}
                  className={`p-2 border transition-colors flex items-center justify-center ${
                    prefsMenuOpen
                      ? 'bg-[#151515] text-[#D6FF3F] border-[#151515] dark:bg-[#E8E7E2] dark:text-[#151515] dark:border-[#E8E7E2]'
                      : 'border-[#B8BBB7] dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2] hover:bg-[#151515]/5 dark:hover:bg-[#222220]'
                  }`}
                  title={`${content.ui.quickSettings} (${theme === 'dark' ? 'Dark' : 'Light'} · ${language.toUpperCase()})`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {prefsMenuOpen && (
                  <div
                    role="menu"
                    aria-label={content.ui.quickSettings}
                    className="absolute right-0 top-full mt-2 w-72 bg-[#E8E7E2] dark:bg-[#1B1B19] border border-[#151515] dark:border-[#2B2B28] shadow-2xl p-4 z-50 flex flex-col gap-4 font-mono text-xs text-[#151515] dark:text-[#E8E7E2] animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between border-b border-[#B8BBB7] dark:border-[#2B2B28] pb-2 text-[11px] uppercase tracking-wider text-[#898985]">
                      <span>{content.ui.quickSettings}</span>
                      <span className="text-[#8D4936] dark:text-[#D6FF3F] font-semibold">
                        HORS CHAMP
                      </span>
                    </div>

                    {/* Theme Option */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#898985]">
                        <span>{content.ui.themeLabel}</span>
                        <span className="text-[#151515] dark:text-[#E8E7E2] font-semibold">
                          {theme === 'dark' ? content.ui.themeDark : content.ui.themeLight}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#151515]/5 dark:bg-[#222220] border border-[#B8BBB7] dark:border-[#2B2B28]">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`py-2 px-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors ${
                            theme === 'light'
                              ? 'bg-[#151515] text-[#D6FF3F] font-semibold'
                              : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? 'Clair' : 'Light'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`py-2 px-2.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#D6FF3F] text-[#151515] font-semibold'
                              : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>{language === 'fr' ? 'Sombre' : 'Dark'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Language Option */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-[#B8BBB7]/50 dark:border-[#2B2B28]">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#898985]">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          {content.ui.langLabel}
                        </span>
                        <span className="text-[#151515] dark:text-[#E8E7E2] font-semibold uppercase">
                          {language === 'fr' ? 'Français' : 'English'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#151515]/5 dark:bg-[#222220] border border-[#B8BBB7] dark:border-[#2B2B28]">
                        <button
                          type="button"
                          onClick={() => setLanguage('fr')}
                          className={`py-2 px-2.5 text-center text-xs uppercase tracking-wider transition-colors ${
                            language === 'fr'
                              ? 'bg-[#151515] text-[#D6FF3F] dark:bg-[#D6FF3F] dark:text-[#151515] font-semibold'
                              : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
                          }`}
                        >
                          FR · Français
                        </button>
                        <button
                          type="button"
                          onClick={() => setLanguage('en')}
                          className={`py-2 px-2.5 text-center text-xs uppercase tracking-wider transition-colors ${
                            language === 'en'
                              ? 'bg-[#151515] text-[#D6FF3F] dark:bg-[#D6FF3F] dark:text-[#151515] font-semibold'
                              : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
                          }`}
                        >
                          EN · English
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={
                  mobileMenuOpen
                    ? language === 'fr' ? 'Fermer le menu' : 'Close menu'
                    : language === 'fr' ? 'Ouvrir le menu' : 'Open menu'
                }
                aria-expanded={mobileMenuOpen}
                className="md:hidden p-2 text-[#151515] dark:text-[#E8E7E2] hover:bg-[#151515]/5 dark:hover:bg-[#222220] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <nav
              aria-label={language === 'fr' ? 'Navigation mobile' : 'Mobile navigation'}
              className="md:hidden border-t border-[#B8BBB7] dark:border-[#2B2B28] bg-[#E8E7E2] dark:bg-[#151515] px-4 py-4 flex flex-col gap-3 text-sm font-medium"
            >
              <a
                href="#manifeste"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('manifeste');
                }}
                className="py-2 border-b border-[#B8BBB7]/50 dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2]"
              >
                {content.ui.navManifesto}
              </a>
              <a
                href="#lookbook"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('lookbook');
                }}
                className="py-2 border-b border-[#B8BBB7]/50 dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2]"
              >
                {content.ui.navLookbook}
              </a>
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('collection');
                }}
                className="py-2 border-b border-[#B8BBB7]/50 dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2]"
              >
                {content.ui.navCollection}
              </a>
              <a
                href="#construction"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('construction');
                }}
                className="py-2 border-b border-[#B8BBB7]/50 dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2]"
              >
                {content.ui.navConstruction}
              </a>

              {/* Mobile Quick Controls: Theme & Language */}
              <div className="pt-2 flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between text-xs text-[#898985]">
                  <span>{content.ui.quickSettings}</span>
                  <span className="text-[#8D4936] dark:text-[#D6FF3F]">HORS CHAMP</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                    className="p-2 border border-[#B8BBB7] dark:border-[#2B2B28] flex items-center justify-center gap-2 bg-[#151515]/5 dark:bg-[#222220] text-[#151515] dark:text-[#E8E7E2]"
                  >
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-[#D6FF3F]" /> : <Sun className="w-4 h-4" />}
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage((l) => (l === 'fr' ? 'en' : 'fr'))}
                    className="p-2 border border-[#B8BBB7] dark:border-[#2B2B28] flex items-center justify-center gap-2 bg-[#151515]/5 dark:bg-[#222220] text-[#151515] dark:text-[#E8E7E2]"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{language.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </nav>
          )}

          {/* Compositor-only Scroll Progress Hairline */}
          <motion.div
            aria-hidden="true"
            className="h-[2px] bg-[#151515] dark:bg-[#D6FF3F] origin-left"
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
                stickyBarTheme === 'dark'
                  ? 'bg-[#151515] text-[#E8E7E2] border-[#2B2B28]'
                  : 'bg-[#E8E7E2] text-[#151515] border-[#B8BBB7]'
              }`}
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`tabular-nums font-semibold ${
                      stickyBarTheme === 'dark' ? 'text-[#D6FF3F]' : 'text-[#8D4936]'
                    }`}
                  >
                    {activeSection.index}
                  </span>
                  <span aria-hidden="true" className="text-[#898985]">
                    /
                  </span>
                  <span
                    className={`uppercase tracking-wider font-semibold ${
                      stickyBarTheme === 'dark' ? 'text-[#E8E7E2]' : 'text-[#151515]'
                    }`}
                  >
                    {activeSection.title}
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline text-[#898985]">
                    —
                  </span>
                  <span
                    className={`hidden sm:inline truncate ${
                      stickyBarTheme === 'dark' ? 'text-[#B8BBB7]' : 'text-[#151515]/75'
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
                    stickyBarTheme === 'dark'
                      ? 'text-[#898985] hover:text-[#D6FF3F]'
                      : 'text-[#898985] hover:text-[#151515]'
                  }`}
                >
                  {content.ui.quickTop}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1">
          {/* 3. Hero du Drop 01 */}
          <section className="border-b border-[#B8BBB7] dark:border-[#2B2B28]">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
              {/* Unboxed Metadata Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#898985] dark:text-[#A0A09C] mb-6"
              >
                <span className="text-[#151515] dark:text-[#E8E7E2] font-medium">{content.drop.code}</span>
                <span aria-hidden="true">/</span>
                <span>{content.drop.subtitle}</span>
                <span aria-hidden="true">·</span>
                <span>{content.drop.launchDate}</span>
                <span aria-hidden="true">·</span>
                <span>{content.drop.status}</span>
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
                    className="font-display font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2] leading-[0.94]"
                    style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', textWrap: 'balance' }}
                  >
                    {content.drop.code} — {content.drop.subtitle}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-4 flex flex-col gap-6"
                >
                  <p className="text-base sm:text-lg text-[#151515] dark:text-[#E8E7E2]/90 leading-relaxed">
                    {content.brand.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={content.drop.primaryCta.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('access');
                      }}
                      className="px-6 py-3 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                    >
                      {content.drop.primaryCta.label}
                    </a>
                    <a
                      href={content.drop.secondaryCta.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('collection');
                      }}
                      className="px-6 py-3 text-xs font-mono uppercase tracking-wider border border-[#151515] dark:border-[#E8E7E2] text-[#151515] dark:text-[#E8E7E2] hover:bg-[#151515] dark:hover:bg-[#E8E7E2] hover:text-[#E8E7E2] dark:hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                    >
                      {content.drop.secondaryCta.label}
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Dominant 16:9 Hero Visual */}
              <motion.figure
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden border border-[#B8BBB7] dark:border-[#2B2B28] bg-[#151515]"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <EditorialImage
                    src={content.drop.heroImage}
                    alt={content.drop.heroImageAlt}
                    fallbackTitle="DROP 01 — OUTSIDE SYSTEM"
                    priority
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <figcaption className="px-4 py-2.5 bg-[#E8E7E2] dark:bg-[#1B1B19] border-t border-[#B8BBB7] dark:border-[#2B2B28] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#898985]">
                  <span>
                    {language === 'fr'
                      ? 'Paris · Architecture brute & silhouettes en mouvement'
                      : 'Paris · Raw architecture & silhouettes in transit'}
                  </span>
                  <span>
                    {language === 'fr'
                      ? `Visuel de direction artistique — ${content.drop.status}`
                      : `Art direction visual — ${content.drop.status}`}
                  </span>
                </figcaption>
              </motion.figure>
            </div>
          </section>

          {/* 4. Manifeste */}
          <section id="manifeste" className="border-b border-[#B8BBB7] dark:border-[#2B2B28]">
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
                    {language === 'fr' ? '01. Manifeste' : '01. Manifesto'}
                  </p>
                  <h2
                    className="font-display font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2] leading-[0.98]"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                  >
                    {content.manifesto.title}
                  </h2>
                  <p className="mt-5 text-base text-[#151515]/85 dark:text-[#E8E7E2]/85 leading-relaxed max-w-md">
                    {content.manifesto.text}
                  </p>
                </div>

                <div className="lg:col-span-7 divide-y divide-[#B8BBB7] dark:divide-[#2B2B28] border-t border-b border-[#B8BBB7] dark:border-[#2B2B28]">
                  {content.brand.territory.map((item, idx) => (
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
                      <h3 className="sm:col-span-4 text-sm font-semibold uppercase tracking-wide text-[#151515] dark:text-[#E8E7E2]">
                        {item.label}
                      </h3>
                      <p className="sm:col-span-7 text-sm text-[#151515]/80 dark:text-[#E8E7E2]/75 leading-relaxed">
                        {item.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* 5. Lookbook — Interactive Carousel */}
          <section id="lookbook" className="border-b border-[#B8BBB7] dark:border-[#2B2B28]">
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
                    {content.ui.lookbookBadge}
                  </p>
                  <h2
                    className="font-display font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2] leading-[0.98]"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                  >
                    {content.ui.lookbookTitle}
                  </h2>
                </div>

                {/* Interactive Silhouette Filter */}
                <div
                  role="group"
                  aria-label={language === 'fr' ? 'Filtrer les silhouettes du lookbook' : 'Filter lookbook silhouettes'}
                  className="flex flex-wrap items-center gap-1.5 bg-[#151515]/5 dark:bg-[#222220] p-1 border border-[#B8BBB7] dark:border-[#2B2B28]"
                >
                  {(
                    [
                      { key: 'all', label: content.ui.allLooks },
                      { key: 'couche', label: content.ui.layerLooks },
                      { key: 'volume', label: content.ui.volumeLooks },
                      { key: 'base', label: content.ui.baseLooks },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setLookbookFilter(tab.key)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                        lookbookFilter === tab.key
                          ? 'bg-[#151515] dark:bg-[#D6FF3F] text-[#D6FF3F] dark:text-[#151515] font-semibold'
                          : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
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
                uiLabels={{
                  paused: language === 'fr' ? 'En pause' : 'Paused',
                  playing: language === 'fr' ? 'En lecture' : 'Playing',
                  expandTooltip: language === 'fr' ? 'Agrandir' : 'Expand',
                  viewPiece: content.ui.viewLinkedPiece,
                  techSheet: content.ui.techSheetBtn,
                  close: content.ui.closeBtn,
                }}
              />
            </motion.div>
          </section>

          {/* 6. Produits — Drop 01 — Outside System */}
          <section id="collection" className="border-b border-[#B8BBB7] dark:border-[#2B2B28]">
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
                    {content.ui.collectionBadge}
                  </p>
                  <h2
                    className="font-display font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2] leading-[0.98]"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                  >
                    {content.drop.name}
                  </h2>
                </div>

                {/* Interactive Product Category Filter */}
                <div
                  role="group"
                  aria-label={language === 'fr' ? 'Filtrer les pièces par catégorie' : 'Filter pieces by category'}
                  className="flex flex-wrap items-center gap-1.5 bg-[#151515]/5 dark:bg-[#222220] p-1 border border-[#B8BBB7] dark:border-[#2B2B28]"
                >
                  {(
                    [
                      { key: 'all', label: content.ui.allPieces },
                      { key: 'hauts', label: content.ui.topsLayers },
                      { key: 'accessoires', label: content.ui.accessories },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setProductFilter(tab.key)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                        productFilter === tab.key
                          ? 'bg-[#151515] dark:bg-[#D6FF3F] text-[#D6FF3F] dark:text-[#151515] font-semibold'
                          : 'text-[#151515] dark:text-[#B8BBB7] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]'
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
                    className="border border-[#B8BBB7] dark:border-[#2B2B28] bg-[#E8E7E2] dark:bg-[#1B1B19] grid grid-cols-1 sm:grid-cols-12 overflow-hidden transition-colors"
                  >
                    <div className="sm:col-span-5 aspect-[3/4] sm:aspect-auto bg-[#151515] overflow-hidden">
                      <EditorialImage
                        src={product.image}
                        alt={product.imageAlt}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-6 border-t sm:border-t-0 sm:border-l border-[#B8BBB7] dark:border-[#2B2B28]">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#898985] mb-3">
                          <span className="tabular-nums">
                            {language === 'fr' ? `Pièce ${product.index}` : `Piece ${product.index}`}
                          </span>
                          <span>{product.status}</span>
                        </div>

                        <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2]">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs font-mono text-[#8D4936] dark:text-[#D6FF3F]">
                          {product.layerRole}
                        </p>

                        <p className="mt-4 text-sm text-[#151515]/85 dark:text-[#E8E7E2]/85 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#B8BBB7] dark:border-[#2B2B28] flex items-center justify-between gap-4">
                        <span className="text-xs font-mono text-[#898985]">
                          {content.ui.priceNotice}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                        >
                          {content.ui.techSheetBtn}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </section>

          {/* 7. Détails de construction & Système de tailles */}
          <section id="construction" className="bg-[#151515] dark:bg-[#10100E] text-[#E8E7E2] border-b border-[#2B2B28]">
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
                    {language === 'fr' ? '04. Construction & Volumes' : '04. Construction & Volumes'}
                  </p>
                  <h2
                    className="font-display font-bold uppercase tracking-tight text-[#E8E7E2] leading-[0.98]"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                  >
                    {content.construction.title}
                  </h2>
                </div>

                {/* Interactive Construction Tabs */}
                <div
                  role="tablist"
                  aria-label={language === 'fr' ? 'Détails de construction et tailles' : 'Construction details and sizing'}
                  className="flex flex-wrap items-center gap-1.5 bg-[#222220] p-1 border border-[#2B2B28]"
                >
                  {(
                    [
                      {
                        key: 'layers',
                        label: language === 'fr' ? '01. Système de couches' : '01. Layering System',
                      },
                      {
                        key: 'materials',
                        label: language === 'fr' ? '02. Matières & Patine' : '02. Materials & Patina',
                      },
                      {
                        key: 'sizing',
                        label: language === 'fr' ? '03. Guide des volumes' : '03. Volume Guide',
                      },
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
                          ? 'bg-[#D6FF3F] text-[#151515] font-semibold'
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
                  {content.construction.layers.map((layer) => (
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
                  {content.construction.materials.map((mat, idx) => (
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
                        {content.ui.sizeHeaders.map((head) => (
                          <th key={head} className="py-3.5 px-5">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B2B28] text-sm font-mono tabular-nums">
                      {content.construction.sizeGuide.map((row) => (
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
                image={content.construction.systemOverviewImage}
                imageAlt={content.construction.systemOverviewAlt}
                hotspots={content.construction.systemHotspots}
                helperText={
                  language === 'fr'
                    ? 'Survolez les points d’intérêt sur la silhouette pour inspecter chaque couche'
                    : 'Hover over silhouette markers to inspect individual system layers'
                }
                badgeText={
                  language === 'fr'
                    ? '4 points actifs · Système complet'
                    : '4 active points · Full system'
                }
                placeholderText={
                  language === 'fr'
                    ? 'Passez la souris sur un repère (01 à 04) pour afficher les détails techniques de la couche.'
                    : 'Hover over a marker (01 to 04) to display technical specifications.'
                }
              />
            </motion.div>
          </section>

          {/* 8. Accès anticipé */}
          <section id="access" className="border-b border-[#B8BBB7] dark:border-[#2B2B28]">
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
                    {content.access.badge}
                  </p>
                  <h2
                    className="font-display font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2] leading-[0.98]"
                    style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                  >
                    {content.access.title}
                  </h2>
                  <p className="mt-4 text-base text-[#151515]/85 dark:text-[#E8E7E2]/85 leading-relaxed max-w-md">
                    {content.access.text}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-[#898985]">
                    <span>{content.drop.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{content.drop.launchDate}</span>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="border border-[#151515] dark:border-[#2B2B28] bg-[#E8E7E2] dark:bg-[#1B1B19] p-6 sm:p-8 transition-colors">
                    {isSubmitted ? (
                      <div className="py-4 flex flex-col gap-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#151515] dark:text-[#E8E7E2]">
                          <span className="w-5 h-5 bg-[#D6FF3F] border border-[#151515] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#151515]" />
                          </span>
                          <span>{content.access.confirmationBadge}</span>
                        </div>
                        <p className="text-base font-medium text-[#151515] dark:text-[#E8E7E2]">
                          {content.access.confirmationMessage}
                        </p>
                        <p className="text-xs font-mono text-[#898985]">
                          {content.access.addressLabel} : {email}
                          {preferredPiece ? ` · ${content.access.followedPieceLabel} : ${preferredPiece}` : ''}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            setEmail('');
                          }}
                          className="mt-2 self-start text-xs font-mono uppercase underline underline-offset-4 text-[#151515] dark:text-[#E8E7E2] hover:text-[#8D4936] dark:hover:text-[#D6FF3F]"
                        >
                          {content.access.modifyLabel}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAccessSubmit} noValidate className="flex flex-col gap-5">
                        <div>
                          <label
                            htmlFor="early-access-email"
                            className="block text-xs font-mono uppercase tracking-wider text-[#151515] dark:text-[#E8E7E2] mb-2"
                          >
                            {content.access.inputLabel}
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
                            placeholder={content.access.inputPlaceholder}
                            className="w-full px-4 py-3 bg-[#E8E7E2] dark:bg-[#151515] border border-[#151515] dark:border-[#383834] text-sm text-[#151515] dark:text-[#E8E7E2] placeholder:text-[#898985] focus:outline-none focus:ring-2 focus:ring-[#151515] dark:focus:ring-[#D6FF3F]"
                          />
                          {emailError && (
                            <p className="mt-1.5 text-xs font-mono text-[#8D4936] dark:text-[#ff7b60]">
                              {emailError}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="block text-xs font-mono uppercase tracking-wider text-[#898985] mb-2">
                            {content.access.preferredLabel}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {content.products.map((p) => {
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
                                      ? 'bg-[#151515] text-[#D6FF3F] border-[#151515] dark:bg-[#D6FF3F] dark:text-[#151515] dark:border-[#D6FF3F]'
                                      : 'bg-transparent text-[#151515] dark:text-[#B8BBB7] border-[#B8BBB7] dark:border-[#2B2B28] hover:border-[#151515] dark:hover:border-[#E8E7E2]'
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
                            className="px-6 py-3.5 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors whitespace-nowrap shrink-0"
                          >
                            {content.access.buttonLabel}
                          </button>
                          <span className="text-xs font-mono text-[#898985]">
                            {content.access.disclaimer}
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
        <footer className="bg-[#E8E7E2] dark:bg-[#151515] text-[#151515] dark:text-[#E8E7E2] transition-colors">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="font-display text-2xl font-bold uppercase tracking-tight">
                {content.brand.name}
              </p>
              <p className="mt-1 text-xs font-mono text-[#898985]">
                {content.brand.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
              {content.footer.links.map((link) =>
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
                    className="hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => setInfoModal(link.action)}
                    className="uppercase hover:text-[#8D4936] dark:hover:text-[#D6FF3F] transition-colors"
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#898985]">
              {content.footer.legal.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setInfoModal(item.action)}
                  className="hover:text-[#151515] dark:hover:text-[#E8E7E2] transition-colors"
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
            className="fixed inset-0 z-50 bg-[#151515]/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-[#E8E7E2] dark:bg-[#1B1B19] border border-[#151515] dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2] max-w-2xl w-full overflow-hidden grid grid-cols-1 sm:grid-cols-12 shadow-2xl"
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
              <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6 border-t sm:border-t-0 sm:border-l border-[#B8BBB7] dark:border-[#2B2B28]">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#898985]">
                      {language === 'fr' ? `Pièce ${selectedProduct.index}` : `Piece ${selectedProduct.index}`} · {selectedProduct.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      aria-label={content.ui.closeBtn}
                      className="p-1.5 text-[#151515] dark:text-[#E8E7E2] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    id="modal-product-title"
                    className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-[#151515] dark:text-[#E8E7E2]"
                  >
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs font-mono text-[#8D4936] dark:text-[#D6FF3F] mt-0.5">
                    {selectedProduct.layerRole}
                  </p>

                  <p className="mt-4 text-sm text-[#151515]/90 dark:text-[#E8E7E2]/90 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#B8BBB7] dark:border-[#2B2B28]">
                    <p className="text-xs font-mono uppercase text-[#898985] mb-2">
                      {content.ui.constructionDetails}
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#151515]/85 dark:text-[#E8E7E2]/85">
                      {selectedProduct.constructionNotes.map((note) => (
                        <li key={note}>— {note}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#B8BBB7] dark:border-[#2B2B28] space-y-2 text-xs">
                    <p>
                      <span className="font-mono uppercase text-[#898985]">{content.ui.patinaLabel} : </span>
                      <span className="text-[#151515]/85 dark:text-[#E8E7E2]/85">{selectedProduct.patinaNote}</span>
                    </p>
                    <p>
                      <span className="font-mono uppercase text-[#898985]">{content.ui.fitLabel} : </span>
                      <span className="text-[#151515]/85 dark:text-[#E8E7E2]/85">{selectedProduct.fitNote}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#B8BBB7] dark:border-[#2B2B28] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleNotifyForPiece(selectedProduct.name)}
                    className="w-full px-4 py-3 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors"
                  >
                    {content.ui.notifyBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info Modal (Contact / Instagram / Legal / Privacy) */}
        {infoModal && (
          <div
            className="fixed inset-0 z-50 bg-[#151515]/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setInfoModal(null)}
          >
            <div
              className="bg-[#E8E7E2] dark:bg-[#1B1B19] border border-[#151515] dark:border-[#2B2B28] text-[#151515] dark:text-[#E8E7E2] max-w-md w-full p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#B8BBB7] dark:border-[#2B2B28]">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                  {infoModal === 'contact' && (language === 'fr' ? 'Contact — HORS CHAMP' : 'Contact — HORS CHAMP')}
                  {infoModal === 'instagram' && 'RadioMeuh — La Yaute'}
                  {infoModal === 'legal' && (language === 'fr' ? 'Mentions légales' : 'Legal Notice')}
                  {infoModal === 'privacy' && (language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy')}
                </h3>
                <button
                  type="button"
                  onClick={() => setInfoModal(null)}
                  aria-label={content.ui.closeBtn}
                  className="p-1.5 text-[#151515] dark:text-[#E8E7E2] hover:bg-[#151515]/10 dark:hover:bg-[#2B2B28]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 text-sm text-[#151515]/85 dark:text-[#E8E7E2]/85 leading-relaxed space-y-3">
                {infoModal === 'contact' && (
                  <>
                    <p>
                      {language === 'fr'
                        ? 'HORS CHAMP — Studio de création streetwear parisien.'
                        : 'HORS CHAMP — Parisian streetwear design studio.'}
                    </p>
                    <p className="font-mono text-xs text-[#898985]">
                      contact@horschamp-paris.fr · Paris, France
                    </p>
                  </>
                )}
                {infoModal === 'instagram' && (
                  <div className="flex flex-col gap-4">
                    {/* Visual RadioMeuh Logo Card */}
                    <div className="p-3 bg-white border border-[#B8BBB7] dark:border-[#2B2B28] flex items-center justify-center">
                      <img
                        src="/assets/aistudio/festival-hop-pop-hop-radio-meuh_1ac4b62a.webp"
                        alt="Radio Meuh — radiomeuh.com"
                        className="w-full max-h-32 object-contain"
                      />
                    </div>

                    <p className="text-base font-medium text-[#151515] dark:text-[#E8E7E2]">
                      {language === 'fr'
                        ? 'Écoute plutôt la bonne musique de la Yaute sur la Radio Meuh'
                        : 'Listen to genuine music and good vibes from Haute-Savoie on Radio Meuh'}
                    </p>
                    <p className="font-mono text-xs text-[#898985]">
                      {language === 'fr'
                        ? 'Web radio indépendante diffusée en continu depuis La Clusaz.'
                        : 'Independent web radio streaming continuous music straight from La Clusaz.'}
                    </p>
                    <div>
                      <a
                        href="https://www.radiomeuh.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors"
                      >
                        <span>radiomeuh.com</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
                {infoModal === 'legal' && (
                  <p>
                    {language === 'fr'
                      ? 'HORS CHAMP est une marque fictive présentée dans le cadre d’une collection de démonstration (Drop 01 — Outside System). Aucune transaction commerciale n’est effectuée sur cette page.'
                      : 'HORS CHAMP is an editorial brand concept presented as a demonstration showcase (Drop 01 — Outside System). No commercial transactions occur on this page.'}
                  </p>
                )}
                {infoModal === 'privacy' && (
                  <p>
                    {language === 'fr'
                      ? 'Le formulaire d’accès anticipé est strictement visuel : aucune donnée personnelle n’est transmise à un serveur ou stockée de manière permanente.'
                      : 'The early access form is strictly a frontend visual prototype: no personal data is transmitted to an external server or persistently stored.'}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="mt-6 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#151515] dark:bg-[#E8E7E2] text-[#E8E7E2] dark:text-[#151515] hover:bg-[#D6FF3F] dark:hover:bg-[#D6FF3F] hover:text-[#151515] dark:hover:text-[#151515] transition-colors"
              >
                {content.ui.closeBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
