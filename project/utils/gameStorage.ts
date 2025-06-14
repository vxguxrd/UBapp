import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameSettings } from '@/types/game';

const STORAGE_KEYS = {
  GAME_SETTINGS: 'undercover_game_settings',
};

export class GameStorage {
  static async saveGameSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving game settings:', error);
      throw error;
    }
  }

  static async getGameSettings(): Promise<GameSettings | null> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error loading game settings:', error);
      return null;
    }
  }

  static async clearGameSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_SETTINGS);
    } catch (error) {
      console.error('Error clearing game settings:', error);
      throw error;
    }
  }
}