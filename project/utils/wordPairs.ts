import type { WordPair } from '@/types/game';

/**
 * WORD PAIRS DATABASE
 * 
 * Add more word pairs below following the same format:
 * { civilian: 'word1', undercover: 'word2' }
 * 
 * The civilian word and undercover word should be related but different enough
 * to create interesting gameplay where players give clues that could apply to both.
 */

const WORD_PAIRS: WordPair[] = [
  // Fruits
  { civilian: 'pomme', undercover: 'poire' },
  { civilian: 'orange', undercover: 'citron' },
  { civilian: 'banane', undercover: 'plantain' },
  { civilian: 'fraise', undercover: 'framboise' },
  { civilian: 'raisin', undercover: 'groseille' },
  { civilian: 'ananas', undercover: 'mangue' },
  { civilian: 'cerise', undercover: 'griotte' },
  { civilian: 'pêche', undercover: 'abricot' },

  // Animaux
  { civilian: 'chat', undercover: 'lynx' },
  { civilian: 'chien', undercover: 'loup' },
  { civilian: 'lion', undercover: 'tigre' },
  { civilian: 'éléphant', undercover: 'rhinocéros' },
  { civilian: 'pingouin', undercover: 'manchot' },
  { civilian: 'dauphin', undercover: 'orque' },
  { civilian: 'aigle', undercover: 'faucon' },
  { civilian: 'serpent', undercover: 'python' },
  { civilian: 'papillon', undercover: 'libellule' },
  { civilian: 'abeille', undercover: 'guêpe' },

  // Véhicules
  { civilian: 'voiture', undercover: 'camion' },
  { civilian: 'vélo', undercover: 'moto' },
  { civilian: 'avion', undercover: 'hélicoptère' },
  { civilian: 'bateau', undercover: 'yacht' },
  { civilian: 'train', undercover: 'métro' },
  { civilian: 'bus', undercover: 'tramway' },

  // Vêtements
  { civilian: 'chemise', undercover: 'polo' },
  { civilian: 'pantalon', undercover: 'jean' },
  { civilian: 'robe', undercover: 'jupe' },
  { civilian: 'veste', undercover: 'blouson' },
  { civilian: 'chaussettes', undercover: 'collants' },
  { civilian: 'baskets', undercover: 'chaussures' },
  { civilian: 'chapeau', undercover: 'casquette' },
  { civilian: 'écharpe', undercover: 'foulard' },

  // Nourriture
  { civilian: 'pizza', undercover: 'tarte' },
  { civilian: 'hamburger', undercover: 'sandwich' },
  { civilian: 'spaghetti', undercover: 'linguine' },
  { civilian: 'riz', undercover: 'quinoa' },
  { civilian: 'pain', undercover: 'baguette' },
  { civilian: 'fromage', undercover: 'yaourt' },
  { civilian: 'chocolat', undercover: 'cacao' },
  { civilian: 'café', undercover: 'thé' },
  { civilian: 'eau', undercover: 'soda' },
  { civilian: 'bière', undercover: 'vin' },

  // Sports
  { civilian: 'football', undercover: 'rugby' },
  { civilian: 'tennis', undercover: 'badminton' },
  { civilian: 'natation', undercover: 'plongée' },
  { civilian: 'course', undercover: 'marathon' },
  { civilian: 'boxe', undercover: 'karaté' },
  { civilian: 'ski', undercover: 'snowboard' },
  { civilian: 'basketball', undercover: 'handball' },
  { civilian: 'golf', undercover: 'croquet' },

  // Métiers
  { civilian: 'médecin', undercover: 'infirmier' },
  { civilian: 'professeur', undercover: 'instituteur' },
  { civilian: 'policier', undercover: 'gendarme' },
  { civilian: 'pompier', undercover: 'sauveteur' },
  { civilian: 'cuisinier', undercover: 'chef' },
  { civilian: 'avocat', undercover: 'juge' },
  { civilian: 'pilote', undercover: 'steward' },
  { civilian: 'architecte', undercover: 'ingénieur' },

  // Lieux
  { civilian: 'école', undercover: 'université' },
  { civilian: 'hôpital', undercover: 'clinique' },
  { civilian: 'restaurant', undercover: 'café' },
  { civilian: 'cinéma', undercover: 'théâtre' },
  { civilian: 'parc', undercover: 'jardin' },
  { civilian: 'plage', undercover: 'lac' },
  { civilian: 'montagne', undercover: 'colline' },
  { civilian: 'ville', undercover: 'village' },

  // Objets du quotidien
  { civilian: 'téléphone', undercover: 'tablette' },
  { civilian: 'ordinateur', undercover: 'laptop' },
  { civilian: 'télévision', undercover: 'écran' },
  { civilian: 'livre', undercover: 'magazine' },
  { civilian: 'stylo', undercover: 'crayon' },
  { civilian: 'table', undercover: 'bureau' },
  { civilian: 'chaise', undercover: 'fauteuil' },
  { civilian: 'lit', undercover: 'canapé' },
  { civilian: 'miroir', undercover: 'glace' },
  { civilian: 'lampe', undercover: 'bougie' },

  // Couleurs/Formes
  { civilian: 'rouge', undercover: 'bordeaux' },
  { civilian: 'bleu', undercover: 'turquoise' },
  { civilian: 'vert', undercover: 'émeraude' },
  { civilian: 'carré', undercover: 'rectangle' },
  { civilian: 'cercle', undercover: 'ovale' },
  { civilian: 'triangle', undercover: 'losange' },

  // Musique
  { civilian: 'guitare', undercover: 'basse' },
  { civilian: 'piano', undercover: 'clavier' },
  { civilian: 'violon', undercover: 'alto' },
  { civilian: 'batterie', undercover: 'percussion' },
  { civilian: 'chant', undercover: 'opéra' },
  { civilian: 'rock', undercover: 'metal' },
  { civilian: 'jazz', undercover: 'blues' },

  // Nature
  { civilian: 'arbre', undercover: 'arbuste' },
  { civilian: 'fleur', undercover: 'rose' },
  { civilian: 'forêt', undercover: 'bois' },
  { civilian: 'rivière', undercover: 'ruisseau' },
  { civilian: 'océan', undercover: 'mer' },
  { civilian: 'soleil', undercover: 'étoile' },
  { civilian: 'lune', undercover: 'satellite' },
  { civilian: 'nuage', undercover: 'brouillard' },

  // Technologie
  { civilian: 'internet', undercover: 'wifi' },
  { civilian: 'email', undercover: 'message' },
  { civilian: 'photo', undercover: 'image' },
  { civilian: 'vidéo', undercover: 'film' },
  { civilian: 'jeu', undercover: 'application' },
  { civilian: 'robot', undercover: 'machine' },

  // Emotions/États
  { civilian: 'joie', undercover: 'bonheur' },
  { civilian: 'tristesse', undercover: 'mélancolie' },
  { civilian: 'peur', undercover: 'angoisse' },
  { civilian: 'colère', undercover: 'rage' },
  { civilian: 'surprise', undercover: 'étonnement' },
  { civilian: 'fatigue', undercover: 'épuisement' },

  // Actions
  { civilian: 'marcher', undercover: 'courir' },
  { civilian: 'manger', undercover: 'dévorer' },
  { civilian: 'dormir', undercover: 'rêver' },
  { civilian: 'lire', undercover: 'étudier' },
  { civilian: 'écrire', undercover: 'dessiner' },
  { civilian: 'chanter', undercover: 'crier' },
  { civilian: 'danser', undercover: 'bouger' },
];

export class WordPairs {
  /**
   * Get a random word pair for the game
   */
  static getRandomWordPair(): WordPair {
    const randomIndex = Math.floor(Math.random() * WORD_PAIRS.length);
    return WORD_PAIRS[randomIndex];
  }

  /**
   * Get all available word pairs (for testing/admin purposes)
   */
  static getAllWordPairs(): WordPair[] {
    return [...WORD_PAIRS];
  }

  /**
   * Get total number of word pairs available
   */
  static getWordPairCount(): number {
    return WORD_PAIRS.length;
  }
}