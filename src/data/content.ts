import heroOutsideSystemImg from '../assets/images/hero_outside_system_1793971896524.jpg';
import fieldHoodieImg from '../assets/images/product_field_hoodie_1793971898263.jpg';
import layerShellImg from '../assets/images/product_layer_shell_1793971898025.jpg';
import archiveTeeImg from '../assets/images/product_archive_tee_1793971897886.jpg';
import signalCapImg from '../assets/images/product_signal_cap_1793971897971.jpg';

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

export const DROP_CONTENT = {
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
  },
  access: {
    title: 'Le drop arrive bientôt.',
    text: 'Inscris-toi pour recevoir l’accès anticipé et les informations de lancement.',
    inputLabel: 'Ton adresse email',
    inputPlaceholder: 'prenom@domaine.fr',
    buttonLabel: 'Rejoindre la liste',
    confirmationMessage: 'Merci. Tu recevras les prochaines informations du drop.',
    backendRequired: false,
  },
  footer: {
    links: [
      { label: 'Collection', href: '#collection' },
      { label: 'Manifeste', href: '#manifeste' },
      { label: 'Contact', action: 'contact' as const },
      { label: 'Instagram', action: 'instagram' as const },
    ],
    legal: [
      { label: 'Mentions légales', action: 'legal' as const },
      { label: 'Politique de confidentialité', action: 'privacy' as const },
    ],
  },
};
