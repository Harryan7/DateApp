import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Dummy data for likes
const LIKES_YOU = [
  {
    id: '1',
    name: 'Amanda',
    age: 25,
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    isNew: true,
  },
  {
    id: '2',
    name: 'Rebecca',
    age: 28,
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    isNew: true,
  },
  {
    id: '3',
    name: 'Emma',
    age: 24,
    image: 'https://randomuser.me/api/portraits/women/13.jpg',
    isNew: false,
  },
  {
    id: '4',
    name: 'Sophia',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/14.jpg',
    isNew: false,
  },
  {
    id: '5',
    name: 'Olivia',
    age: 27,
    image: 'https://randomuser.me/api/portraits/women/15.jpg',
    isNew: false,
  },
];

const MATCHES = [
  {
    id: '1',
    name: 'Alexis',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    lastMessage: "Hey, how are you?",
    isNew: true,
  },
  {
    id: '2',
    name: 'Jennifer',
    age: 29,
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: "What are you up to this weekend?",
    isNew: false,
  },
  {
    id: '3',
    name: 'Victoria',
    age: 27,
    image: 'https://randomuser.me/api/portraits/women/23.jpg',
    lastMessage: "Nice to meet you!",
    isNew: false,
  },
];

export default function LikesScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'likesYou' | 'matches'>('likesYou');

  const renderLikesItem = ({ item }: { item: typeof LIKES_YOU[0] }) => (
    <TouchableOpacity style={styles.likesItem}>
      <View style={styles.likesImageContainer}>
        <Image source={{ uri: item.image }} style={styles.likesImage} />
        {item.isNew && <View style={styles.newBadge} />}
      </View>
      <ThemedText style={styles.likesName}>{item.name}, {item.age}</ThemedText>
    </TouchableOpacity>
  );

  const renderMatchItem = ({ item }: { item: typeof MATCHES[0] }) => (
    <TouchableOpacity style={styles.matchItem}>
      <Image source={{ uri: item.image }} style={styles.matchImage} />
      <View style={styles.matchContent}>
        <ThemedText style={styles.matchName}>{item.name}, {item.age}</ThemedText>
        <ThemedText style={styles.matchMessage}>{item.lastMessage}</ThemedText>
      </View>
      {item.isNew && <View style={styles.newMatchBadge} />}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Likes</ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'likesYou' && 
            { borderBottomColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setActiveTab('likesYou')}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'likesYou' && 
              { color: Colors[colorScheme ?? 'light'].tint }
            ]}
          >
            Likes You · {LIKES_YOU.length}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'matches' && 
            { borderBottomColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setActiveTab('matches')}
        >
          <ThemedText 
            style={[
              styles.tabText, 
              activeTab === 'matches' && 
              { color: Colors[colorScheme ?? 'light'].tint }
            ]}
          >
            Matches · {MATCHES.length}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {activeTab === 'likesYou' ? (
        <ScrollView>
          <ThemedView style={styles.upgradeContainer}>
            <ThemedText style={styles.upgradeTitle}>Upgrade to Gold</ThemedText>
            <ThemedText style={styles.upgradeText}>
              See who likes you and more!
            </ThemedText>
            <TouchableOpacity style={styles.upgradeButton}>
              <ThemedText style={styles.upgradeButtonText}>SEE WHO LIKES YOU</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={styles.sectionTitle}>People who like you</ThemedText>
          <FlatList
            data={LIKES_YOU}
            renderItem={renderLikesItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.likesList}
            scrollEnabled={false} // Disable scrolling since we're inside a ScrollView
          />
        </ScrollView>
      ) : (
        <FlatList
          data={MATCHES}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.matchesList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  upgradeContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#FFE4B5',
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  upgradeText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  upgradeButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
  },
  likesList: {
    paddingHorizontal: 10,
  },
  likesItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 100,
  },
  likesImageContainer: {
    position: 'relative',
  },
  likesImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  newBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF4500',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  likesName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  matchesList: {
    padding: 15,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    position: 'relative',
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  matchContent: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  matchMessage: {
    fontSize: 14,
    color: '#777',
  },
  newMatchBadge: {
    position: 'absolute',
    right: 10,
    top: 30,
    backgroundColor: '#FF4500',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
}); 