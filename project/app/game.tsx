import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, UserX, SkipForward } from 'lucide-react-native';
import { GameStorage } from '@/utils/gameStorage';
import { WordPairs } from '@/utils/wordPairs';
import { GameLogic } from '@/utils/gameLogic';
import { PlayerCard } from '@/components/PlayerCard';
import type { Player, GameState, PlayerRole } from '@/types/game';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const [showEliminationModal, setShowEliminationModal] = useState(false);
  const [gamePhase, setGamePhase] = useState<'words' | 'clues' | 'voting' | 'ended'>('words');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      const settings = await GameStorage.getGameSettings();
      if (!settings) {
        router.replace('/setup');
        return;
      }

      const wordPair = WordPairs.getRandomWordPair();
      const gameState = GameLogic.initializeGame(settings, wordPair);
      setGameState(gameState);
      setGamePhase('words');
      setCurrentPlayerIndex(0);
    } catch (error) {
      console.error('Error initializing game:', error);
      Alert.alert('Erreur', 'Impossible de charger la partie.');
      router.replace('/setup');
    }
  };

  const showPlayerWord = (playerIndex: number) => {
    setCurrentPlayerIndex(playerIndex);
    setShowWordModal(true);
  };

  const nextPlayer = () => {
    if (!gameState) return;

    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < gameState.alivePlayers.length) {
      setCurrentPlayerIndex(nextIndex);
    } else {
      setShowWordModal(false);
      setGamePhase('clues');
    }
  };

  const startVotingPhase = () => {
    setGamePhase('voting');
  };

  const eliminatePlayer = (playerId: number) => {
    if (!gameState) return;

    const eliminatedPlayer = gameState.alivePlayers.find(p => p.id === playerId);
    if (!eliminatedPlayer) return;

    const newGameState = GameLogic.eliminatePlayer(gameState, playerId);
    setGameState(newGameState);

    // Show eliminated player role
    Alert.alert(
      'Joueur éliminé',
      `${eliminatedPlayer.name} était ${getRoleText(eliminatedPlayer.role)}`,
      [
        {
          text: 'Continuer',
          onPress: () => checkGameEnd(newGameState)
        }
      ]
    );

    setShowEliminationModal(false);
  };

  const checkGameEnd = (currentGameState: GameState) => {
    const result = GameLogic.checkGameEnd(currentGameState);
    
    if (result.isGameOver) {
      setGamePhase('ended');
      
      /* 
        VIDEO AD PLACEMENT:
        Show interstitial video ad here when game ends
        Only show if internet connection is available
      */
      
      Alert.alert(
        'Fin de partie !',
        `Victoire : ${result.winner}`,
        [
          { text: 'Nouvelle partie', onPress: () => router.replace('/setup') },
          { text: 'Accueil', onPress: () => router.replace('/') }
        ]
      );
    } else {
      // Continue to next round
      setRoundNumber(prev => prev + 1);
      setCurrentTurn(0);
      setGamePhase('clues');
    }
  };

  const skipTurn = () => {
    Alert.alert(
      'Passer le tour',
      'Poules mouillées...',
      [
        {
          text: 'Continuer',
          onPress: () => {
            setRoundNumber(prev => prev + 1);
            setCurrentTurn(0);
            setGamePhase('clues');
          }
        }
      ]
    );
  };

  const handleMrWhiteGuess = () => {
    if (!gameState) return;

    Alert.prompt(
      'Mr. White devine',
      'Quel est le mot des civils ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Valider',
          onPress: (guess) => {
            if (guess?.toLowerCase().trim() === gameState.civilWord.toLowerCase()) {
              Alert.alert(
                'Victoire de Mr. White !',
                `Bonne réponse : ${gameState.civilWord}`,
                [
                  { text: 'Nouvelle partie', onPress: () => router.replace('/setup') },
                  { text: 'Accueil', onPress: () => router.replace('/') }
                ]
              );
            } else {
              Alert.alert('Mauvaise réponse', 'Mr. White a échoué !');
            }
          }
        }
      ]
    );
  };

  const getRoleText = (role: PlayerRole) => {
    switch (role) {
      case 'civilian': return 'un Civil';
      case 'undercover': return 'un Undercover';
      case 'mrwhite': return 'Mr. White';
    }
  };

  const getCurrentPlayer = () => {
    if (!gameState || gamePhase !== 'clues') return null;
    return gameState.alivePlayers[currentTurn % gameState.alivePlayers.length];
  };

  const nextTurn = () => {
    if (!gameState) return;
    
    const nextTurnIndex = currentTurn + 1;
    if (nextTurnIndex >= gameState.alivePlayers.length) {
      startVotingPhase();
    } else {
      setCurrentTurn(nextTurnIndex);
    }
  };

  if (!gameState) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {gamePhase === 'words' && 'Distribution des mots'}
            {gamePhase === 'clues' && `Tour ${roundNumber} - Indices`}
            {gamePhase === 'voting' && 'Phase de vote'}
            {gamePhase === 'ended' && 'Partie terminée'}
          </Text>
          <View style={styles.playerCount}>
            <Text style={styles.playerCountText}>{gameState.alivePlayers.length}/{gameState.totalPlayers}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {gamePhase === 'words' && (
            <View style={styles.wordsPhase}>
              <Text style={styles.instruction}>
                Chaque joueur doit voir son mot secrètement
              </Text>
              <View style={styles.playersGrid}>
                {gameState.alivePlayers.map((player, index) => (
                  <TouchableOpacity
                    key={player.id}
                    style={[
                      styles.playerButton,
                      index <= currentPlayerIndex && styles.playerButtonDone
                    ]}
                    onPress={() => showPlayerWord(index)}
                    disabled={index > currentPlayerIndex}
                  >
                    <PlayerCard player={player} />
                    {index <= currentPlayerIndex && (
                      <View style={styles.checkMark}>
                        <Eye size={16} color="#10b981" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {gamePhase === 'clues' && (
            <View style={styles.cluesPhase}>
              <View style={styles.currentPlayerCard}>
                <Text style={styles.currentPlayerLabel}>À vous de jouer :</Text>
                <PlayerCard player={getCurrentPlayer()!} />
                <Text style={styles.clueInstruction}>
                  Donnez un indice pour faire deviner votre mot sans trop en révéler
                </Text>
              </View>
              
              <TouchableOpacity style={styles.nextTurnButton} onPress={nextTurn}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.nextTurnButtonGradient}
                >
                  <Text style={styles.nextTurnButtonText}>Indice donné</Text>
                  <SkipForward size={20} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.playersStatus}>
                <Text style={styles.statusTitle}>Joueurs en vie :</Text>
                <View style={styles.playersGrid}>
                  {gameState.alivePlayers.map((player) => (
                    <View key={player.id} style={styles.playerStatusCard}>
                      <PlayerCard player={player} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {gamePhase === 'voting' && (
            <View style={styles.votingPhase}>
              <Text style={styles.votingTitle}>Qui voulez-vous éliminer ?</Text>
              <View style={styles.playersGrid}>
                {gameState.alivePlayers.map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={styles.eliminationButton}
                    onPress={() => eliminatePlayer(player.id)}
                  >
                    <PlayerCard player={player} />
                    <View style={styles.eliminateIcon}>
                      <UserX size={16} color="#ef4444" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.skipButton} onPress={skipTurn}>
                <Text style={styles.skipButtonText}>Passer le tour</Text>
              </TouchableOpacity>

              {gameState.alivePlayers.some(p => p.role === 'mrwhite') && (
                <TouchableOpacity style={styles.mrWhiteButton} onPress={handleMrWhiteGuess}>
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed']}
                    style={styles.mrWhiteButtonGradient}
                  >
                    <Text style={styles.mrWhiteButtonText}>Mr. White devine</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Word Modal */}
        <Modal
          visible={showWordModal}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.wordModal}>
              {currentPlayerIndex >= 0 && gameState.alivePlayers[currentPlayerIndex] && (
                <>
                  <PlayerCard player={gameState.alivePlayers[currentPlayerIndex]} />
                  <Text style={styles.wordTitle}>Votre mot :</Text>
                  <View style={styles.wordContainer}>
                    <Text style={styles.word}>
                      {GameLogic.getPlayerWord(gameState.alivePlayers[currentPlayerIndex], gameState)}
                    </Text>
                  </View>
                  <Text style={styles.wordInstruction}>
                    Mémorisez bien votre mot et passez le téléphone au joueur suivant
                  </Text>
                  <TouchableOpacity style={styles.wordButton} onPress={nextPlayer}>
                    <LinearGradient
                      colors={['#ff6b6b', '#ee5a24']}
                      style={styles.wordButtonGradient}
                    >
                      <EyeOff size={20} color="#ffffff" />
                      <Text style={styles.wordButtonText}>
                        {currentPlayerIndex < gameState.alivePlayers.length - 1 ? 'Joueur suivant' : 'Commencer la partie'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Bottom Banner Ad Placeholder */}
        {/* 
          BOTTOM BANNER AD PLACEMENT: 
          Integrate banner ad component here at the bottom of the screen
          This should be persistent throughout the game
        */}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  playerCount: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playerCountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
  wordsPhase: {
    flex: 1,
  },
  instruction: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  playerButton: {
    opacity: 0.5,
  },
  playerButtonDone: {
    opacity: 1,
  },
  checkMark: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cluesPhase: {
    flex: 1,
  },
  currentPlayerCard: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  currentPlayerLabel: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 16,
  },
  clueInstruction: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  nextTurnButton: {
    marginBottom: 32,
    borderRadius: 12,
  },
  nextTurnButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  nextTurnButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playersStatus: {
    marginTop: 24,
  },
  statusTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  playerStatusCard: {
    opacity: 0.8,
  },
  votingPhase: {
    flex: 1,
  },
  votingTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  eliminationButton: {
    position: 'relative',
  },
  eliminateIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
  mrWhiteButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  mrWhiteButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  mrWhiteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wordModal: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  wordTitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 24,
    marginBottom: 16,
  },
  wordContainer: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  wordInstruction: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  wordButton: {
    borderRadius: 12,
    width: '100%',
  },
  wordButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  wordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});