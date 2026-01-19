import type { AGameState } from "../GameState";
import type { ACharacter } from "../data/Characters";

export interface SaveData {
  version: string;
  time: number;
  dateTime: { day: number; time: number };
  globalResources: Record<string, number>;
  characters: CharacterSaveData[];
  selectedCharacterIndex: number;
}

export interface CharacterSaveData {
  name: string;
  state: Record<string, number>;
  skills: Record<string, { level: number; experience: number }>;
  activityMastery: Array<[string, number]>;
  recentRewards: Array<{
    resource: string;
    amount: number;
    resonance: number;
    time: number;
  }>;
}

const SAVE_VERSION = "1.0.0";
const SAVE_KEY_PREFIX = "mental-sine-waves-save-";

export class SaveSystem {
  /**
   * Save game state to localStorage
   */
  static saveGame(gameState: AGameState, slot: number = 1): boolean {
    try {
      const saveData: SaveData = {
        version: SAVE_VERSION,
        time: gameState.time,
        dateTime: { ...gameState.dateTime },
        globalResources: { ...gameState.globalResources },
        characters: gameState.characters.map((char) => ({
          name: char.name,
          state: { ...char.state },
          skills: Object.entries(char.skills).reduce(
            (acc, [id, skill]) => {
              acc[id] = {
                level: skill.level,
                experience: skill.experience,
              };
              return acc;
            },
            {} as Record<string, { level: number; experience: number }>,
          ),
          activityMastery: Array.from(char.activityMastery.entries()),
          recentRewards: [...char.recentRewards],
        })),
        selectedCharacterIndex: gameState.characters.indexOf(
          gameState.selectedCharacter,
        ),
      };

      const key = `${SAVE_KEY_PREFIX}${slot}`;
      localStorage.setItem(key, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error("Failed to save game:", error);
      return false;
    }
  }

  /**
   * Load game state from localStorage
   */
  static loadGame(gameState: AGameState, slot: number = 1): boolean {
    try {
      const key = `${SAVE_KEY_PREFIX}${slot}`;
      const saveDataStr = localStorage.getItem(key);

      if (!saveDataStr) {
        return false;
      }

      const saveData: SaveData = JSON.parse(saveDataStr);

      // Restore game state
      gameState.time = saveData.time;
      gameState.dateTime = { ...saveData.dateTime };
      gameState.globalResources = { ...saveData.globalResources };

      // Restore characters
      saveData.characters.forEach((charData, index) => {
        const char = gameState.characters[index];
        if (char && char.name === charData.name) {
          // Restore state
          Object.assign(char.state, charData.state);

          // Restore skills
          Object.entries(charData.skills).forEach(([id, skillData]) => {
            const skill = char.getSkill(id);
            if (skill) {
              skill.level = skillData.level;
              skill.experience = skillData.experience;
            }
          });

          // Restore activity mastery
          char.activityMastery = new Map(charData.activityMastery);

          // Restore recent rewards
          char.recentRewards = charData.recentRewards;
        }
      });

      // Restore selected character
      if (
        saveData.selectedCharacterIndex >= 0 &&
        saveData.selectedCharacterIndex < gameState.characters.length
      ) {
        gameState.selectCharacter(
          gameState.characters[saveData.selectedCharacterIndex],
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to load game:", error);
      return false;
    }
  }

  /**
   * Check if a save slot exists
   */
  static hasSave(slot: number = 1): boolean {
    const key = `${SAVE_KEY_PREFIX}${slot}`;
    return localStorage.getItem(key) !== null;
  }

  /**
   * Delete a save slot
   */
  static deleteSave(slot: number = 1): boolean {
    try {
      const key = `${SAVE_KEY_PREFIX}${slot}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to delete save:", error);
      return false;
    }
  }

  /**
   * Get save metadata (time, date) without loading full save
   */
  static getSaveMetadata(slot: number = 1): {
    exists: boolean;
    time?: number;
    dateTime?: { day: number; time: number };
  } {
    const key = `${SAVE_KEY_PREFIX}${slot}`;
    const saveDataStr = localStorage.getItem(key);

    if (!saveDataStr) {
      return { exists: false };
    }

    try {
      const saveData: SaveData = JSON.parse(saveDataStr);
      return {
        exists: true,
        time: saveData.time,
        dateTime: saveData.dateTime,
      };
    } catch {
      return { exists: false };
    }
  }
}
