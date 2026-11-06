import heroOutsideSystemImg from '../assets/images/hero_outside_system_1793971896524.jpg';
import fieldHoodieImg from '../assets/images/product_field_hoodie_1793971898263.jpg';
import layerShellImg from '../assets/images/product_layer_shell_1793971898025.jpg';
import archiveTeeImg from '../assets/images/product_archive_tee_1793971897886.jpg';
import signalCapImg from '../assets/images/product_signal_cap_1793971897971.jpg';
import systemOverviewImg from '../assets/images/construction_system_overview_1793974344077.jpg';
import type { SystemHotspot } from '../components/ConstructionInspector';

export type Language = 'fr' | 'en';

export interface ProductItem {
  id: string;
  index: string;
  name: string;
  category: 'hauts' | 'accessoires';
  layerRole: string;
  description: string;
  status: string;
  image: string;
  imageAlt: string;
  constructionNotes: string[];
  patinaNote: string;
  fitNote: string;
}

export interface LookbookFrame {
  id: string;
  index: string;
  title: string;
  silhouette: 'couche' | 'volume' | 'base';
  environment: string;
  lighting: string;
  image: string;
  imageAlt: string;
  linkedProductId: string;
}

export interface SizeRow {
  size: 'S' | 'M' | 'L' | 'XL';
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  fit: string;
}

export const DROP_CONTENT_FR = {
  brand: {
    name: 'HORS CHAMP',
    tagline: 'Des vêtements essentiels, construits pour vivre dehors.',
    territory: [
      {
        index: '01',
        label: 'Sobriété parisienne',
        detail: 'Lignes nettes, absence d’ornement superflu, retenue dans les proportions.',
      },
      {
        index: '02',
        label: 'Volume contemporain',
        detail: 'Épaules tombantes, ampleur maîtrisée pour superposer sans contrainte.',
      },
      {
        index: '03',
        label: 'Imperfection assumée',
        detail: 'Lavage pigmentaire, patine douce et coutures pensées pour vieillir.',
      },
      {
        index: '04',
        label: 'Protection technique',
        detail: 'Membranes légères, coupes articulées et détails réfléchissants discrets.',
      },
      {
        index: '05',
        label: 'Nostalgie sportswear',
        detail: 'Codes du vestiaire urbain réinterprétés dans une grammaire utilitaire.',
      },
    ],
  },
  drop: {
    code: 'DROP 01',
    subtitle: 'OUTSIDE SYSTEM',
    name: 'Drop 01 — Outside System',
    status: 'Collection de démonstration',
    launchDate: 'Date à confirmer',
    heroImage: heroOutsideSystemImg,
    heroImageAlt: 'Silhouettes HORS CHAMP Drop 01 — Outside System en mouvement sur parvis en béton',
    primaryCta: {
      label: 'Accéder au drop',
      href: '#access',
    },
    secondaryCta: {
      label: 'Découvrir la collection',
      href: '#collection',
    },
  },
  manifesto: {
    badge: '01. Manifeste',
    title: 'Pas une saison. Un système.',
    text: 'Des pièces simples, pensées pour les déplacements, les couches et les usages quotidiens.',
  },
  lookbook: [
    {
      id: 'look-01',
      index: '01',
      title: 'Couche extérieure & mobilité',
      silhouette: 'couche',
      environment: 'Asphalte humide · Paris 13e',
      lighting: 'Lumière froide naturelle',
      image: layerShellImg,
      imageAlt: 'Silhouette portant la Layer Shell en mouvement sur trottoir parisien',
      linkedProductId: 'layer-shell',
    },
    {
      id: 'look-02',
      index: '02',
      title: 'Volume lourd & patine carbone',
      silhouette: 'volume',
      environment: 'Béton brut · Acier galvanisé',
      lighting: 'Flash direct',
      image: fieldHoodieImg,
      imageAlt: 'Silhouette portant le Field Hoodie devant un mur en béton et acier',
      linkedProductId: 'field-hoodie',
    },
    {
      id: 'look-03',
      index: '03',
      title: 'Base ample & vestiaire',
      silhouette: 'base',
      environment: 'Vestiaire · Métal perforé',
      lighting: 'Tube fluorescent froid',
      image: archiveTeeImg,
      imageAlt: 'Silhouette portant l’Archive Tee dans un vestiaire en béton',
      linkedProductId: 'archive-tee',
    },
    {
      id: 'look-04',
      index: '04',
      title: 'Équipement & point signal',
      silhouette: 'base',
      environment: 'Béton · Aluminium brossé',
      lighting: 'Lumière latérale rasante',
      image: signalCapImg,
      imageAlt: 'Détail de la Signal Cap posée sur béton et aluminium brossé',
      linkedProductId: 'signal-cap',
    },
  ] as LookbookFrame[],
  products: [
    {
      id: 'field-hoodie',
      index: '01',
      name: 'Field Hoodie',
      category: 'hauts',
      layerRole: 'Couche 02 — Volume & Isolation',
      description: 'Hoodie oversize en coton lourd, lavé et structuré.',
      status: 'Produit de démonstration',
      image: fieldHoodieImg,
      imageAlt: 'Field Hoodie — Hoodie oversize en coton lourd lavé',
      constructionNotes: [
        'Coton lourd à tenue structurée, intérieur gratté dense',
        'Épaules tombantes et emmanchures larges pour le port en couche',
        'Capuche doublée sans cordon, bord-côte épais aux poignets',
      ],
      patinaNote: 'Lavage enzymatique et pigmentaire offrant une patine carbone nuancée dès le premier port.',
      fitNote: 'Coupe oversize ample. Prendre sa taille habituelle pour le volume prévu.',
    },
    {
      id: 'layer-shell',
      index: '02',
      name: 'Layer Shell',
      category: 'hauts',
      layerRole: 'Couche 03 — Protection extérieure',
      description: 'Une couche légère pensée pour protéger sans alourdir.',
      status: 'Produit de démonstration',
      image: layerShellImg,
      imageAlt: 'Layer Shell — Veste légère de protection quotidienne',
      constructionNotes: [
        'Toile technique mate déperlante et coupe-vent',
        'Manches articulées permettant une amplitude naturelle en déplacement',
        'Fermeture frontale sous rabat minimaliste et poches zippées dissimulées',
      ],
      patinaNote: 'Finition mate crayeuse qui s’assouplit à l’usage sans brillance synthétique.',
      fitNote: 'Coupe droite technique conçue pour se superposer sur le Field Hoodie.',
    },
    {
      id: 'archive-tee',
      index: '03',
      name: 'Archive Tee',
      category: 'hauts',
      layerRole: 'Couche 01 — Base quotidienne',
      description: 'Un t-shirt ample, marqué par un imprimé discret.',
      status: 'Produit de démonstration',
      image: archiveTeeImg,
      imageAlt: 'Archive Tee — T-shirt ample à imprimé discret',
      constructionNotes: [
        'Jersey de coton sec à grain visible et tombé net',
        'Col rond côtelé épais légèrement usé sur les arêtes',
        'Sérigraphie ton sur ton à encre mate intégrée dans la fibre',
      ],
      patinaNote: 'Teinte craie lavée avec léger effet vécu sur les coutures d’épaule.',
      fitNote: 'Coupe boxy ample et longueur maîtrisée.',
    },
    {
      id: 'signal-cap',
      index: '04',
      name: 'Signal Cap',
      category: 'accessoires',
      layerRole: 'Équipement — Repère visuel',
      description: 'Une casquette souple avec un détail réfléchissant.',
      status: 'Produit de démonstration',
      image: signalCapImg,
      imageAlt: 'Signal Cap — Casquette six panneaux avec détail réfléchissant',
      constructionNotes: [
        'Construction souple à six panneaux non structurés',
        'Passant arrière haute visibilité en ruban réfléchissant Signal',
        'Boucle métallique mate à l’arrière pour un réglage précis',
      ],
      patinaNote: 'Sergé de coton lavé au toucher sec, surpiqûres ton sur ton.',
      fitNote: 'Taille unique réglable.',
    },
  ] as ProductItem[],
  construction: {
    badge: '04. Construction & Volumes',
    title: 'Architecture du système',
    tabs: [
      { key: 'layers', label: '01. Système de couches' },
      { key: 'materials', label: '02. Matières & Patine' },
      { key: 'sizing', label: '03. Guide des volumes' },
    ],
    layers: [
      {
        step: 'Couche 01',
        name: 'Base — Archive Tee',
        purpose: 'Contact direct, respirabilité et tenue sèche sous les couches supérieures.',
      },
      {
        step: 'Couche 02',
        name: 'Volume — Field Hoodie',
        purpose: 'Apport thermique et structure architecturale grâce au coton lourd lavé.',
      },
      {
        step: 'Couche 03',
        name: 'Protection — Layer Shell',
        purpose: 'Barrière légère contre le vent et la pluie fine lors des trajets urbains.',
      },
      {
        step: 'Signal',
        name: 'Équipement — Signal Cap',
        purpose: 'Point de repère réfléchissant discret dans la pénombre urbaine.',
      },
    ],
    materials: [
      {
        title: 'Patine contrôlée',
        detail: 'Chaque pièce subit un lavage spécifique pour éliminer la rigidité du neuf et révéler le grain du textile.',
      },
      {
        title: 'Quincaillerie mate',
        detail: 'Zips, boucles et œillets sélectionnés en finition métal brossé ou carbone mat sans marquage ostentatoire.',
      },
      {
        title: 'Points de tension renforcés',
        detail: 'Doubles surpiqûres aux emmanchures, poches et cols pour accompagner un usage quotidien intensif.',
      },
    ],
    sizeGuide: [
      { size: 'S', chestCm: 116, lengthCm: 67, shoulderCm: 54, fit: 'Ample' },
      { size: 'M', chestCm: 122, lengthCm: 70, shoulderCm: 57, fit: 'Ample' },
      { size: 'L', chestCm: 128, lengthCm: 73, shoulderCm: 60, fit: 'Oversize' },
      { size: 'XL', chestCm: 134, lengthCm: 76, shoulderCm: 63, fit: 'Oversize' },
    ] as SizeRow[],
    systemOverviewImage: systemOverviewImg,
    systemOverviewAlt: 'Silhouette complète HORS CHAMP Drop 01 — Outside System avec les 4 couches',
    systemHotspots: [
      {
        id: 'spot-tee',
        number: '01',
        code: 'Couche 01',
        pieceName: 'Archive Tee',
        title: 'Jersey sec & coupe boxy ample',
        description: 'T-shirt en coton craie lavé à grain sec, pensé comme première couche respirante au quotidien.',
        x: 51,
        y: 78,
      },
      {
        id: 'spot-hoodie',
        number: '02',
        code: 'Couche 02',
        pieceName: 'Field Hoodie',
        title: 'Coton lourd lavé & patine carbone',
        description: 'Hoodie oversize en molleton épais à lavage pigmentaire, offrant structure et isolation thermique.',
        x: 52,
        y: 41,
      },
      {
        id: 'spot-shell',
        number: '03',
        code: 'Couche 03',
        pieceName: 'Layer Shell',
        title: 'Membrane ripstop déperlante & manches articulées',
        description: 'Veste légère coupe-vent en toile technique mate, conçue pour protéger sans alourdir la silhouette.',
        x: 41,
        y: 44,
      },
      {
        id: 'spot-signal',
        number: '04',
        code: 'Signal',
        pieceName: 'Signal Cap',
        title: 'Passant réfléchissant haute visibilité (#D6FF3F)',
        description: 'Ruban réfléchissant jaune-lime intégré sur le côté de la casquette six panneaux en sergé de coton lavé.',
        x: 47,
        y: 12,
        isSignal: true,
      },
    ] as SystemHotspot[],
  },
  access: {
    badge: '05. Accès anticipé',
    title: 'Le drop arrive bientôt.',
    text: 'Inscris-toi pour recevoir l’accès anticipé et les informations de lancement.',
    inputLabel: 'Ton adresse email',
    inputPlaceholder: 'prenom@domaine.fr',
    preferredLabel: 'Pièce d’intérêt (optionnel)',
    buttonLabel: 'Rejoindre la liste',
    confirmationBadge: 'Inscription enregistrée (démonstration)',
    confirmationMessage: 'Merci. Tu recevras les prochaines informations du drop.',
    addressLabel: 'Adresse',
    followedPieceLabel: 'Pièce suivie',
    modifyLabel: 'Modifier l’adresse',
    disclaimer: 'Formulaire visuel · Aucun envoi de données',
  },
  footer: {
    links: [
      { label: 'Collection', href: '#collection' },
      { label: 'Lookbook', href: '#lookbook' },
      { label: 'Manifeste', href: '#manifeste' },
      { label: 'Construction', href: '#construction' },
      { label: 'Contact', action: 'contact' as const },
      { label: 'Instagram', action: 'instagram' as const },
    ],
    legal: [
      { label: 'Mentions légales', action: 'legal' as const },
      { label: 'Politique de confidentialité', action: 'privacy' as const },
    ],
  },
  ui: {
    navManifesto: 'Manifeste',
    navLookbook: 'Lookbook',
    navCollection: 'Collection',
    navConstruction: 'Construction',
    quickTop: 'Haut ↑',
    collectionBadge: '03. Collection',
    allPieces: 'Toutes les pièces (4)',
    topsLayers: 'Hauts & Couches (3)',
    accessories: 'Accessoires (1)',
    priceNotice: 'Prix & stocks à confirmer',
    techSheetBtn: 'Fiche technique',
    lookbookBadge: '02. Lookbook',
    lookbookTitle: 'Silhouettes en situation',
    allLooks: 'Toutes',
    layerLooks: 'Couche',
    volumeLooks: 'Volume',
    baseLooks: 'Base & Signal',
    viewLinkedPiece: 'Voir la pièce associée',
    lookbookSlide: 'Slide',
    notifyBtn: 'Être prévenu pour cette pièce',
    closeBtn: 'Fermer',
    sizeHeaders: ['Taille', 'Poitrine (cm)', 'Longueur dos (cm)', 'Épaules (cm)', 'Volume'],
    patinaLabel: 'Patine',
    fitLabel: 'Coupe',
    constructionDetails: 'Détails de construction',
    themeLabel: 'Thème',
    themeDark: 'Mode sombre',
    themeLight: 'Mode clair',
    langLabel: 'Langue',
    quickSettings: 'Préférences',
  },
};

export const DROP_CONTENT_EN: typeof DROP_CONTENT_FR = {
  brand: {
    name: 'HORS CHAMP',
    tagline: 'Essential garments, engineered for the outside.',
    territory: [
      {
        index: '01',
        label: 'Parisian restraint',
        detail: 'Crisp architectural lines, zero superfluous ornament, deliberate proportions.',
      },
      {
        index: '02',
        label: 'Contemporary volume',
        detail: 'Dropped shoulders and relaxed drape engineered for effortless layering.',
      },
      {
        index: '03',
        label: 'Worn imperfection',
        detail: 'Enzyme garment dye, gentle fading, and seams built to age gracefully.',
      },
      {
        index: '04',
        label: 'Technical protection',
        detail: 'Lightweight weather membranes, articulated sleeves, and discreet reflective hits.',
      },
      {
        index: '05',
        label: 'Sportswear nostalgia',
        detail: 'City wardrobe archetypes reimagined through utilitarian precision.',
      },
    ],
  },
  drop: {
    code: 'DROP 01',
    subtitle: 'OUTSIDE SYSTEM',
    name: 'Drop 01 — Outside System',
    status: 'Demonstration collection',
    launchDate: 'Date to be confirmed',
    heroImage: heroOutsideSystemImg,
    heroImageAlt: 'HORS CHAMP Drop 01 silhouettes walking across brutalist Parisian concrete',
    primaryCta: {
      label: 'Access the drop',
      href: '#access',
    },
    secondaryCta: {
      label: 'Explore collection',
      href: '#collection',
    },
  },
  manifesto: {
    badge: '01. Manifesto',
    title: 'Not a season. A system.',
    text: 'Purpose-built essentials designed for movement, modular layering, and daily wear.',
  },
  lookbook: [
    {
      id: 'look-01',
      index: '01',
      title: 'Outer layer & mobility',
      silhouette: 'couche',
      environment: 'Wet asphalt · Paris 13th',
      lighting: 'Cold daylight',
      image: layerShellImg,
      imageAlt: 'Model wearing Layer Shell walking down a Parisian street',
      linkedProductId: 'layer-shell',
    },
    {
      id: 'look-02',
      index: '02',
      title: 'Heavyweight volume & carbon wash',
      silhouette: 'volume',
      environment: 'Raw concrete · Galvanized steel',
      lighting: 'Direct flash',
      image: fieldHoodieImg,
      imageAlt: 'Model wearing Field Hoodie against raw concrete and steel',
      linkedProductId: 'field-hoodie',
    },
    {
      id: 'look-03',
      index: '03',
      title: 'Relaxed base & locker room',
      silhouette: 'base',
      environment: 'Locker room · Perforated steel',
      lighting: 'Cool fluorescent tube',
      image: archiveTeeImg,
      imageAlt: 'Model wearing Archive Tee in concrete locker room',
      linkedProductId: 'archive-tee',
    },
    {
      id: 'look-04',
      index: '04',
      title: 'Headwear & signal accent',
      silhouette: 'base',
      environment: 'Concrete · Brushed aluminum',
      lighting: 'Low grazing studio light',
      image: signalCapImg,
      imageAlt: 'Signal Cap detail resting on concrete and brushed aluminum',
      linkedProductId: 'signal-cap',
    },
  ],
  products: [
    {
      id: 'field-hoodie',
      index: '01',
      name: 'Field Hoodie',
      category: 'hauts',
      layerRole: 'Layer 02 — Volume & Thermal Base',
      description: 'Oversized hoodie in dense heavyweight cotton, washed and structured.',
      status: 'Demonstration piece',
      image: fieldHoodieImg,
      imageAlt: 'Field Hoodie — Oversized heavyweight washed cotton hoodie',
      constructionNotes: [
        'Dense French terry cotton with structured hand feel',
        'Dropped shoulders and generous armholes for comfortable layering',
        'Double-layered cord-free hood and heavyweight ribbed cuffs',
      ],
      patinaNote: 'Enzyme pigment wash providing nuanced carbon fade from day one.',
      fitNote: 'Relaxed oversized fit. Take true size for intended drape.',
    },
    {
      id: 'layer-shell',
      index: '02',
      name: 'Layer Shell',
      category: 'hauts',
      layerRole: 'Layer 03 — Outer Protective Shield',
      description: 'Lightweight technical layer engineered for everyday weather protection.',
      status: 'Demonstration piece',
      image: layerShellImg,
      imageAlt: 'Layer Shell — Lightweight technical daily shell jacket',
      constructionNotes: [
        'Matte water-repellent and windproof technical ripstop canvas',
        'Articulated sleeves for natural range of motion during transit',
        'Minimalist storm flap front and concealed zippered utility pockets',
      ],
      patinaNote: 'Chalky matte finish softening with wear without synthetic shine.',
      fitNote: 'Technical straight cut sized to slide cleanly over the Field Hoodie.',
    },
    {
      id: 'archive-tee',
      index: '03',
      name: 'Archive Tee',
      category: 'hauts',
      layerRole: 'Layer 01 — Everyday Base Layer',
      description: 'Relaxed boxy t-shirt finished with a subtle tonal archival print.',
      status: 'Demonstration piece',
      image: archiveTeeImg,
      imageAlt: 'Archive Tee — Relaxed boxy t-shirt with tonal print',
      constructionNotes: [
        'Dry cotton jersey with crisp drape and visible textile grain',
        'Heavy ribbed crew neck with subtle pre-distressed edges',
        'Tonal water-based screenprint seamlessly bound into the fibers',
      ],
      patinaNote: 'Washed chalk tint with gentle vintage wear along the shoulder seams.',
      fitNote: 'Boxy cut with wide sleeves and balanced crop.',
    },
    {
      id: 'signal-cap',
      index: '04',
      name: 'Signal Cap',
      category: 'accessoires',
      layerRole: 'Headwear — Hi-Vis Waypoint',
      description: 'Unstructured low-profile cap with reflective Signal tab.',
      status: 'Demonstration piece',
      image: signalCapImg,
      imageAlt: 'Signal Cap — Six-panel unstructured cotton cap with reflective tab',
      constructionNotes: [
        'Six-panel unstructured soft cotton twill construction',
        'Rear high-visibility reflective tab in neon Signal lime',
        'Matte metal buckle slider for precise sizing adjustment',
      ],
      patinaNote: 'Washed cotton twill with dry hand feel and tonal heavy-stitch details.',
      fitNote: 'Adjustable one size fits all.',
    },
  ],
  construction: {
    badge: '04. Construction & Engineering',
    title: 'System Architecture',
    tabs: [
      { key: 'layers', label: '01. Layering Hierarchy' },
      { key: 'materials', label: '02. Materials & Patina' },
      { key: 'sizing', label: '03. Sizing Matrix' },
    ],
    layers: [
      {
        step: 'Layer 01',
        name: 'Base — Archive Tee',
        purpose: 'Direct skin contact, breathable dry drape underneath outer shells.',
      },
      {
        step: 'Layer 02',
        name: 'Volume — Field Hoodie',
        purpose: 'Thermal insulation and architectural volume via dense washed cotton.',
      },
      {
        step: 'Layer 03',
        name: 'Shield — Layer Shell',
        purpose: 'Lightweight barrier against urban wind and rain without heavy bulk.',
      },
      {
        step: 'Signal',
        name: 'Headwear — Signal Cap',
        purpose: 'Discreet high-visibility reflective focal point in low-light urban environments.',
      },
    ],
    materials: [
      {
        title: 'Controlled Patina',
        detail: 'Every piece undergoes specialized enzyme washing to break down initial stiffness and expose fabric grain.',
      },
      {
        title: 'Matte Hardware',
        detail: 'Zippers, buckles, and eyelets selected in brushed gunmetal and carbon matte with no ostentatious logos.',
      },
      {
        title: 'Reinforced Stress Zones',
        detail: 'Double needle top-stitching at armholes, pockets, and collars for intense daily transit wear.',
      },
    ],
    sizeGuide: [
      { size: 'S', chestCm: 116, lengthCm: 67, shoulderCm: 54, fit: 'Relaxed' },
      { size: 'M', chestCm: 122, lengthCm: 70, shoulderCm: 57, fit: 'Relaxed' },
      { size: 'L', chestCm: 128, lengthCm: 73, shoulderCm: 60, fit: 'Oversized' },
      { size: 'XL', chestCm: 134, lengthCm: 76, shoulderCm: 63, fit: 'Oversized' },
    ],
    systemOverviewImage: systemOverviewImg,
    systemOverviewAlt: 'Complete HORS CHAMP Drop 01 system overview showcasing all 4 pieces',
    systemHotspots: [
      {
        id: 'spot-tee',
        number: '01',
        code: 'Layer 01',
        pieceName: 'Archive Tee',
        title: 'Dry cotton jersey & relaxed boxy cut',
        description: 'Chalk-washed heavyweight dry cotton t-shirt built as a breathable daily foundation.',
        x: 51,
        y: 78,
      },
      {
        id: 'spot-hoodie',
        number: '02',
        code: 'Layer 02',
        pieceName: 'Field Hoodie',
        title: 'Dense washed fleece & carbon patina',
        description: 'Oversized hoodie in pigment-washed fleece delivering structural volume and insulation.',
        x: 52,
        y: 41,
      },
      {
        id: 'spot-shell',
        number: '03',
        code: 'Layer 03',
        pieceName: 'Layer Shell',
        title: 'Water-repellent ripstop & articulated sleeves',
        description: 'Lightweight matte technical windbreaker designed to protect without weighing down the silhouette.',
        x: 41,
        y: 44,
      },
      {
        id: 'spot-signal',
        number: '04',
        code: 'Signal',
        pieceName: 'Signal Cap',
        title: 'High-visibility reflective tab (#D6FF3F)',
        description: 'Lime-neon reflective accent tab stitched into the side of the unstructured cotton cap.',
        x: 47,
        y: 12,
        isSignal: true,
      },
    ],
  },
  access: {
    badge: '05. Early Access',
    title: 'Drop launch approaching.',
    text: 'Sign up to receive early priority access and official release details.',
    inputLabel: 'Your email address',
    inputPlaceholder: 'name@domain.com',
    preferredLabel: 'Piece of interest (optional)',
    buttonLabel: 'Join Priority List',
    confirmationBadge: 'Subscription logged (demonstration)',
    confirmationMessage: 'Thank you. You will receive the upcoming drop notifications.',
    addressLabel: 'Email',
    followedPieceLabel: 'Followed piece',
    modifyLabel: 'Change email',
    disclaimer: 'Visual prototype · No personal data is collected or sent',
  },
  footer: {
    links: [
      { label: 'Collection', href: '#collection' },
      { label: 'Lookbook', href: '#lookbook' },
      { label: 'Manifesto', href: '#manifeste' },
      { label: 'Construction', href: '#construction' },
      { label: 'Contact', action: 'contact' as const },
      { label: 'Instagram', action: 'instagram' as const },
    ],
    legal: [
      { label: 'Legal Notice', action: 'legal' as const },
      { label: 'Privacy Policy', action: 'privacy' as const },
    ],
  },
  ui: {
    navManifesto: 'Manifesto',
    navLookbook: 'Lookbook',
    navCollection: 'Collection',
    navConstruction: 'Construction',
    quickTop: 'Top ↑',
    collectionBadge: '03. Collection',
    allPieces: 'All Pieces (4)',
    topsLayers: 'Tops & Layers (3)',
    accessories: 'Accessories (1)',
    priceNotice: 'Pricing & production to be confirmed',
    techSheetBtn: 'Tech Specs',
    lookbookBadge: '02. Lookbook',
    lookbookTitle: 'Silhouettes in Transit',
    allLooks: 'All',
    layerLooks: 'Shell',
    volumeLooks: 'Fleece',
    baseLooks: 'Base & Signal',
    viewLinkedPiece: 'View paired piece',
    lookbookSlide: 'Slide',
    notifyBtn: 'Get notified for this piece',
    closeBtn: 'Close',
    sizeHeaders: ['Size', 'Chest (cm)', 'Back Length (cm)', 'Shoulder (cm)', 'Fit'],
    patinaLabel: 'Patina',
    fitLabel: 'Fit',
    constructionDetails: 'Construction Notes',
    themeLabel: 'Theme',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    langLabel: 'Language',
    quickSettings: 'Preferences',
  },
};

export const DROP_CONTENT = DROP_CONTENT_FR;
