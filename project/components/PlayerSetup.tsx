import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Camera, Image as ImageIcon, Trash2, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import type { Player } from '@/types/game';

interface PlayerSetupProps {
  player: Player;
  onUpdate: (updatedPlayer: Partial<Player>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PlayerSetup({ player, onUpdate, onRemove, canRemove }: PlayerSetupProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameChange = (name: string) => {
    onUpdate({ name });
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (!player.name.trim()) {
      onUpdate({ name: `Joueur ${player.id}` });
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'Permission nécessaire pour accéder à la galerie');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onUpdate({ avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Non disponible', 'La caméra n\'est pas disponible sur le web');
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'Permission nécessaire pour utiliser la caméra');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onUpdate({ avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Choisir une photo',
      'Comment voulez-vous ajouter une photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: pickImageFromLibrary },
        { text: 'Caméra', onPress: takePhoto },
        ...(player.avatar ? [{ text: 'Supprimer', onPress: () => onUpdate({ avatar: null }), style: 'destructive' as const }] : []),
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={showImageOptions}>
        {player.avatar ? (
          <Image source={{ uri: player.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={24} color="#64748b" />
          </View>
        )}
        <View style={styles.cameraIcon}>
          <Camera size={12} color="#ffffff" />
        </View>
      </TouchableOpacity>

      <View style={styles.nameContainer}>
        {isEditingName ? (
          <TextInput
            style={styles.nameInput}
            value={player.name}
            onChangeText={handleNameChange}
            onBlur={handleNameSubmit}
            onSubmitEditing={handleNameSubmit}
            autoFocus
            selectTextOnFocus
            placeholderTextColor="#64748b"
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.nameText}>{player.name}</Text>
          </TouchableOpacity>
        )}
      </View>

      {canRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  nameInput: {
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  nameText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
});