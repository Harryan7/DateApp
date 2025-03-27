import React from 'react';
import { StyleSheet, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Dummy user data
const USER = {
  id: '1',
  name: 'John',
  age: 28,
  bio: 'Software engineer | Travel enthusiast | Dog lover 🐶\nLove hiking and trying new restaurants.',
  images: [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/33.jpg',
    'https://randomuser.me/api/portraits/men/34.jpg',
  ],
  jobTitle: 'Software Engineer',
  company: 'Tech Corp',
  school: 'University of Technology',
  living: 'New York City',
  gender: 'Man',
  height: '6\'0" (183 cm)',
  languages: ['English', 'Spanish'],
  interests: ['Hiking', 'Photography', 'Travel', 'Cooking', 'Movies', 'Tech'],
};

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
        <TouchableOpacity style={styles.editButton}>
          <IconSymbol name="pencil" size={22} color="#FF6B6B" />
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.profileImageContainer}>
        <Image source={{ uri: USER.images[0] }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editProfileImageButton}>
          <IconSymbol name="camera.fill" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ThemedView style={styles.nameContainer}>
        <ThemedText style={styles.name}>{USER.name}, {USER.age}</ThemedText>
        <View style={styles.verifiedBadge}>
          <IconSymbol name="checkmark" size={12} color="white" />
        </View>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>About Me</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="pencil" size={18} color="#999" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.bio}>{USER.bio}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>My Photos</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="plus" size={18} color="#999" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.photosGrid}>
          {USER.images.map((image, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: image }} style={styles.photo} />
              <TouchableOpacity style={styles.photoEditButton}>
                <IconSymbol name="pencil" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoContainer}>
            <IconSymbol name="plus" size={30} color="#999" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Personal Info</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="pencil" size={18} color="#999" />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="briefcase" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>Job Title</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.jobTitle}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="building.2" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>Company</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.company}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="graduationcap" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>School</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.school}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="mappin" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>Living in</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.living}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="person" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>Gender</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.gender}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <IconSymbol name="ruler" size={18} color="#777" style={styles.infoIcon} />
          <ThemedView>
            <ThemedText style={styles.infoLabel}>Height</ThemedText>
            <ThemedText style={styles.infoValue}>{USER.height}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Languages</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="plus" size={18} color="#999" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.chipContainer}>
          {USER.languages.map((language, index) => (
            <ThemedView key={index} style={styles.chip}>
              <ThemedText style={styles.chipText}>{language}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedView style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle}>Interests</ThemedText>
          <TouchableOpacity>
            <IconSymbol name="plus" size={18} color="#999" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.chipContainer}>
          {USER.interests.map((interest, index) => (
            <ThemedView key={index} style={styles.chip}>
              <ThemedText style={styles.chipText}>{interest}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>
      
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>Delete Account</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 50,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 130,
    backgroundColor: '#FF6B6B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 1,
    marginBottom: 10,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  photoEditButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoContainer: {
    width: '31%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'underline',
  },
}); 