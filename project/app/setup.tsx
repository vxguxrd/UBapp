import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Minus,
  Camera,
  Image as ImageIcon,
  Trash2,
  RotateCcw,
  RefreshCw,
  Play,
} from 'lucide-react-native';
import { GameStorage } from '@/utils/gameStorage';
import { PlayerSetup } from '@/components/PlayerSetup';
import { GameRules } from '@/utils/gameRules';
import type { Player, GameSettings } from '@/types/game';

export default function SetupScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [numPlayers, setNumPlayers] = useState(3);
  const [numUndercovers, setNumUndercovers] = useState(1);
  const [hasMrWhite, setHasMrWhite] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedSettings = await GameStorage.getGameSettings();
      if (savedSettings) {
        setPlayers(savedSettings.players);
        setNumPlayers(savedSettings.numPlayers);
        setNumUndercovers(savedSettings.numUndercovers);
        setHasMrWhite(savedSettings.hasMrWhite);
      } else {
        // Initialize with default players
        const defaultPlayers = Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          name: `Joueur ${i + 1}`,
          avatar: null,
        }));
        setPlayers(defaultPlayers);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    const settings: GameSettings = {
      numPlayers,
      numUndercovers,
      hasMrWhite,
      players: players.slice(0, numPlayers),
    };
    await GameStorage.saveGameSettings(settings);
  };

  const handlePlayerCountChange = (delta: number) => {
    const newCount = Math.max(3, Math.min(16, numPlayers + delta));
    setNumPlayers(newCount);
    
    // Adjust players array
    if (newCount > players.length) {
      const newPlayers = [...players];
      for (let i = players.length; i < newCount; i++) {
        newPlayers.push({
          id: i + 1,
          name: `Joueur ${i + 1}`,
          avatar: null,
        });
      }
      setPlayers(newPlayers);
    }
    
    // Adjust undercovers and Mr. White based on rules
    const maxUndercovers = GameRules.getMaxUndercovers(newCount);
    if (numUndercovers > maxUndercovers) {
      setNumUndercovers(maxUndercovers);
    }
    
    if (newCount < 4 && hasMrWhite) {
      setHasMrWhite(false);
    }
  };

  const handleUndercoverCountChange = (delta: number) => {
    const maxUndercovers = GameRules.getMaxUndercovers(numPlayers);
    const newCount = Math.max(1, Math.min(maxUndercovers, numUndercovers + delta));
    setNumUndercovers(newCount);
  };

  const handleMrWhiteToggle = () => {
    if (numPlayers >= 4) {
      setHasMrWhite(!hasMrWhite);
    }
  };

  const updatePlayer = (playerId: number, updatedPlayer: Partial<Player>) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, ...updatedPlayer } : p
    ));
  };

  const removePlayer = (playerId: number) => {
    if (numPlayers > 3) {
      setPlayers(players.filter(p => p.id !== playerId));
      handlePlayerCountChange(-1);
    }
  };

  const resetAllSettings = async () => {
    Alert.alert(
      'Réinitialiser tout',
      'Êtes-vous sûr de vouloir tout réinitialiser ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            await GameStorage.clearGameSettings();
            setNumPlayers(3);
            setNumUndercovers(1);
            setHasMrWhite(false);
            const defaultPlayers = Array.from({ length: 3 }, (_, i) => ({
              id: i + 1,
              name: `Joueur ${i + 1}`,
              avatar: null,
            }));
            setPlayers(defaultPlayers);
          }
        }
      ]
    );
  };

  const resetPlayers = () => {
    Alert.alert(
      'Réinitialiser les joueurs',
      'Êtes-vous sûr de vouloir réinitialiser tous les joueurs ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setNumPlayers(3);
            const defaultPlayers = Array.from({ length: 3 }, (_, i) => ({
              id: i + 1,
              name: `Joueur ${i + 1}`,
              avatar: null,
            }));
            setPlayers(defaultPlayers);
          }
        }
      ]
    );
  };

  const startGame = async () => {
    // Validate all players have names
    const currentPlayers = players.slice(0, numPlayers);
    const hasEmptyNames = currentPlayers.some(p => !p.name.trim());
    
    if (hasEmptyNames) {
      Alert.alert('Erreur', 'Tous les joueurs doivent avoir un nom.');
      return;
    }

    await saveSettings();
    router.push('/game');
  };

  const canHaveMrWhite = numPlayers >= 4;
  const maxUndercovers = GameRules.getMaxUndercovers(numPlayers);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuration</Text>
          <TouchableOpacity 
            style={styles.rulesButton}
            onPress={() => setShowRulesModal(true)}
          >
            <Text style={styles.rulesButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres de partie</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Nombre de joueurs</Text>
              <View style={styles.counter}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handlePlayerCountChange(-1)}
                  disabled={numPlayers <= 3}
                >
                  <Minus size={16} color={numPlayers <= 3 ? '#64748b' : '#ffffff'} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{numPlayers}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handlePlayerCountChange(1)}
                  disabled={numPlayers >= 16}
                >
                  <Plus size={16} color={numPlayers >= 16 ? '#64748b' : '#ffffff'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Undercovers</Text>
              <View style={styles.counter}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleUndercoverCountChange(-1)}
                  disabled={numUndercovers <= 1}
                >
                  <Minus size={16} color={numUndercovers <= 1 ? '#64748b' : '#ffffff'} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{numUndercovers}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleUndercoverCountChange(1)}
                  disabled={numUndercovers >= maxUndercovers}
                >
                  <Plus size={16} color={numUndercovers >= maxUndercovers ? '#64748b' : '#ffffff'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRowSwitch}>
              <Text style={styles.settingLabel}>Mr. White</Text>
              <TouchableOpacity 
                style={[
                  styles.switch,
                  { backgroundColor: hasMrWhite ? '#ff6b6b' : '#334155' },
                  !canHaveMrWhite && styles.switchDisabled
                ]}
                onPress={handleMrWhiteToggle}
                disabled={!canHaveMrWhite}
              >
                <View style={[
                  styles.switchThumb,
                  { transform: [{ translateX: hasMrWhite ? 20 : 0 }] }
                ]} />
              </TouchableOpacity>
            </View>

            {!canHaveMrWhite && (
              <Text style={styles.hintText}>
                Mr. White disponible à partir de 4 joueurs
              </Text>
            )}
          </View>

          {/* Players */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Joueurs ({numPlayers})</Text>
            {players.slice(0, numPlayers).map((player) => (
              <PlayerSetup
                key={player.id}
                player={player}
                onUpdate={(updatedPlayer) => updatePlayer(player.id, updatedPlayer)}
                onRemove={() => removePlayer(player.id)}
                canRemove={numPlayers > 3}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <View style={styles.resetButtons}>
              <TouchableOpacity style={styles.resetButton} onPress={resetPlayers}>
                <RefreshCw size={16} color="#64748b" />
                <Text style={styles.resetButtonText}>Réinitialiser joueurs</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetAllSettings}>
                <RotateCcw size={16} color="#64748b" />
                <Text style={styles.resetButtonText}>Tout réinitialiser</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a24']}
                style={styles.startButtonGradient}
              >
                <Play size={20} color="#ffffff" />
                <Text style={styles.startButtonText}>COMMENCER LA PARTIE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Rules Modal */}
        <Modal
          visible={showRulesModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRulesModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Règles du jeu</Text>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalText}>
                  <Text style={styles.modalBold}>Objectif :</Text>{'\n'}
                  • Civils : Identifier les Undercovers{'\n'}
                  • Undercovers : Ne pas se faire repérer{'\n'}
                  • Mr. White : Deviner le mot des civils{'\n\n'}
                  
                  <Text style={styles.modalBold}>Déroulement :</Text>{'\n'}
                  1. Chaque joueur reçoit secrètement son mot{'\n'}
                  2. À tour de rôle, donnez un indice{'\n'}
                  3. Votez pour éliminer un suspect{'\n'}
                  4. Répétez jusqu'à la victoire{'\n\n'}
                  
                  <Text style={styles.modalBold}>Conditions de victoire :</Text>{'\n'}
                  • Civils : Éliminer tous les Undercovers{'\n'}
                  • Undercovers : Être à égalité avec les civils{'\n'}
                  • Mr. White : Deviner le mot exact
                </Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowRulesModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Compris</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rulesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rulesButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingRowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 24,
    textAlign: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 2,
  },
  switchDisabled: {
    opacity: 0.5,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  actionButtons: {
    paddingBottom: 40,
  },
  resetButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  startButton: {
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  modalBold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalCloseButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});