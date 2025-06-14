import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Play, Settings } from 'lucide-react-native';

export default function HomeScreen() {
  const handleStartGame = () => {
    router.push('/setup');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Banner Ad Placeholder */}
        {/* 
          BANNER AD PLACEMENT: 
          Integrate banner ad component here at the top of the screen
          Recommended size: 320x50 or adaptive banner
        */}
        
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>UNDERCOVER</Text>
            <Text style={styles.subtitle}>BOSS</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Un jeu de déduction sociale où la discrétion est votre meilleure arme
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.playButton} onPress={handleStartGame}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a24']}
                style={styles.playButtonGradient}
              >
                <Play size={24} color="#ffffff" />
                <Text style={styles.playButtonText}>LANCER UNE PARTIE</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Settings size={16} color="#64748b" />
                <Text style={styles.featureText}>3-16 joueurs</Text>
              </View>
              <View style={styles.feature}>
                <Settings size={16} color="#64748b" />
                <Text style={styles.featureText}>Hors ligne</Text>
              </View>
              <View style={styles.feature}>
                <Settings size={16} color="#64748b" />
                <Text style={styles.featureText}>Mode sombre</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Banner Ad Placeholder */}
        {/* 
          BOTTOM BANNER AD PLACEMENT: 
          Integrate banner ad component here at the bottom of the screen
          This should be a persistent banner across the app
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ff6b6b',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: -8,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: '#ff6b6b',
    marginTop: 16,
    borderRadius: 2,
  },
  descriptionContainer: {
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playButton: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 40,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
});