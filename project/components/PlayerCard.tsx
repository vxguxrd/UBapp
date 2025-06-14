import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { User } from 'lucide-react-native';
import type { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  size?: 'small' | 'medium' | 'large';
}

export function PlayerCard({ player, size = 'medium' }: PlayerCardProps) {
  const avatarSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        {player.avatar ? (
          <Image 
            source={{ uri: player.avatar }} 
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]} 
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { width: avatarSize, height: avatarSize }]}>
            <User size={avatarSize * 0.4} color="#64748b" />
          </View>
        )}
        {!player.isAlive && <View style={styles.eliminatedOverlay} />}
      </View>
      <Text style={[styles.name, { fontSize }]} numberOfLines={1}>
        {player.name}
      </Text>
      {!player.isAlive && (
        <Text style={styles.eliminatedText}>Éliminé</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
    minWidth: 80,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarPlaceholder: {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  eliminatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  name: {
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 80,
  },
  eliminatedText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});