import type { GameSettings, GameState, Player, PlayerRole, WordPair } from '@/types/game';

export class GameLogic {
  /**
   * Initialize a new game with given settings and word pair
   */
  static initializeGame(settings: GameSettings, wordPair: WordPair): GameState {
    const players = this.assignRoles(settings);
    
    return {
      players,
      alivePlayers: [...players],
      totalPlayers: players.length,
      civilWord: wordPair.civilian,
      undercoverWord: wordPair.undercover,
      currentRound: 1,
      gamePhase: 'playing',
    };
  }

  /**
   * Assign roles to players based on game settings
   */
  private static assignRoles(settings: GameSettings): Player[] {
    const players = [...settings.players];
    const roles: PlayerRole[] = [];

    // Add civilian roles
    const civilianCount = settings.numPlayers - settings.numUndercovers - (settings.hasMrWhite ? 1 : 0);
    for (let i = 0; i < civilianCount; i++) {
      roles.push('civilian');
    }

    // Add undercover roles
    for (let i = 0; i < settings.numUndercovers; i++) {
      roles.push('undercover');
    }

    // Add Mr. White role if enabled
    if (settings.hasMrWhite) {
      roles.push('mrwhite');
    }

    // Shuffle roles
    const shuffledRoles = this.shuffleArray([...roles]);

    // Assign roles to players
    return players.map((player, index) => ({
      ...player,
      role: shuffledRoles[index],
      isAlive: true,
    }));
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get the word that should be shown to a specific player
   */
  static getPlayerWord(player: Player, gameState: GameState): string {
    switch (player.role) {
      case 'civilian':
        return gameState.civilWord;
      case 'undercover':
        return gameState.undercoverWord;
      case 'mrwhite':
        return 'VOUS ÊTES MR. WHITE';
      default:
        return '';
    }
  }

  /**
   * Eliminate a player from the game
   */
  static eliminatePlayer(gameState: GameState, playerId: number): GameState {
    const updatedPlayers = gameState.players.map(player =>
      player.id === playerId ? { ...player, isAlive: false } : player
    );

    const alivePlayers = updatedPlayers.filter(player => player.isAlive);

    return {
      ...gameState,
      players: updatedPlayers,
      alivePlayers,
    };
  }

  /**
   * Check if the game has ended and determine the winner
   */
  static checkGameEnd(gameState: GameState): { isGameOver: boolean; winner?: string } {
    const aliveCivilians = gameState.alivePlayers.filter(p => p.role === 'civilian');
    const aliveUndercovers = gameState.alivePlayers.filter(p => p.role === 'undercover');
    const aliveMrWhite = gameState.alivePlayers.filter(p => p.role === 'mrwhite');

    // Undercovers win if they equal or outnumber civilians
    if (aliveUndercovers.length >= aliveCivilians.length && aliveUndercovers.length > 0) {
      return { isGameOver: true, winner: 'Undercovers' };
    }

    // Civilians win if all undercovers are eliminated (and no Mr. White)
    if (aliveUndercovers.length === 0 && aliveMrWhite.length === 0) {
      return { isGameOver: true, winner: 'Civils' };
    }

    // Mr. White wins if only he remains with civilians (handled separately in UI)
    if (aliveUndercovers.length === 0 && aliveMrWhite.length > 0) {
      // This case is handled by the Mr. White guess functionality
      return { isGameOver: false };
    }

    return { isGameOver: false };
  }

  /**
   * Get current game statistics
   */
  static getGameStats(gameState: GameState) {
    const aliveCivilians = gameState.alivePlayers.filter(p => p.role === 'civilian').length;
    const aliveUndercovers = gameState.alivePlayers.filter(p => p.role === 'undercover').length;
    const aliveMrWhite = gameState.alivePlayers.filter(p => p.role === 'mrwhite').length;

    return {
      aliveCivilians,
      aliveUndercovers,
      aliveMrWhite,
      totalAlive: gameState.alivePlayers.length,
    };
  }
}