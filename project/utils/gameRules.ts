export class GameRules {
  /**
   * Get maximum number of undercovers based on player count
   */
  static getMaxUndercovers(playerCount: number): number {
    if (playerCount < 3) return 0;
    if (playerCount < 7) return 1;
    if (playerCount < 10) return 2;
    if (playerCount < 13) return 3;
    return 4; // Maximum 4 undercovers
  }

  /**
   * Check if Mr. White can be added based on player count
   */
  static canHaveMrWhite(playerCount: number): boolean {
    return playerCount >= 4;
  }

  /**
   * Validate game settings
   */
  static validateGameSettings(
    playerCount: number,
    undercoverCount: number,
    hasMrWhite: boolean
  ): { isValid: boolean; error?: string } {
    if (playerCount < 3) {
      return { isValid: false, error: 'Minimum 3 joueurs requis' };
    }

    if (playerCount > 16) {
      return { isValid: false, error: 'Maximum 16 joueurs autorisés' };
    }

    const maxUndercovers = this.getMaxUndercovers(playerCount);
    if (undercoverCount > maxUndercovers) {
      return { 
        isValid: false, 
        error: `Maximum ${maxUndercovers} undercovers pour ${playerCount} joueurs` 
      };
    }

    if (hasMrWhite && !this.canHaveMrWhite(playerCount)) {
      return { isValid: false, error: 'Mr. White nécessite au moins 4 joueurs' };
    }

    // Ensure there are enough civilians
    const civilianCount = playerCount - undercoverCount - (hasMrWhite ? 1 : 0);
    if (civilianCount < 2) {
      return { isValid: false, error: 'Au moins 2 civils requis' };
    }

    return { isValid: true };
  }
}