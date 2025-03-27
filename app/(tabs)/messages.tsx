import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Dummy conversation data
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Alexis',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    lastMessage: "Hey, how are you?",
    lastMessageTime: '12:30 PM',
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Jennifer',
    age: 29,
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: "What are you up to this weekend?",
    lastMessageTime: 'Yesterday',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Victoria',
    age: 27,
    image: 'https://randomuser.me/api/portraits/women/23.jpg',
    lastMessage: "Nice to meet you!",
    lastMessageTime: 'Tuesday',
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: '4',
    name: 'Sarah',
    age: 25,
    image: 'https://randomuser.me/api/portraits/women/24.jpg',
    lastMessage: "I love hiking too! What's your favorite trail?",
    lastMessageTime: 'Monday',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Emma',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/25.jpg',
    lastMessage: "Let's grab coffee sometime",
    lastMessageTime: 'May 10',
    isOnline: false,
    unreadCount: 0,
  },
];

// Dummy matches without messages yet
const NEW_MATCHES = [
  {
    id: '6',
    name: 'Sophia',
    age: 24,
    image: 'https://randomuser.me/api/portraits/women/26.jpg',
    matchTime: 'Today',
  },
  {
    id: '7',
    name: 'Olivia',
    age: 25,
    image: 'https://randomuser.me/api/portraits/women/27.jpg',
    matchTime: 'Yesterday',
  },
  {
    id: '8',
    name: 'Ava',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    matchTime: '2 days ago',
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderNewMatch = ({ item }: { item: typeof NEW_MATCHES[0] }) => (
    <TouchableOpacity style={styles.newMatchItem}>
      <Image source={{ uri: item.image }} style={styles.newMatchImage} />
      <ThemedText style={styles.newMatchName}>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  const renderConversation = ({ item }: { item: typeof CONVERSATIONS[0] }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <View style={styles.conversationImageContainer}>
        <Image source={{ uri: item.image }} style={styles.conversationImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <ThemedText style={styles.conversationName}>{item.name}, {item.age}</ThemedText>
          <ThemedText style={styles.conversationTime}>{item.lastMessageTime}</ThemedText>
        </View>
        
        <View style={styles.conversationFooter}>
          <ThemedText 
            style={[
              styles.conversationMessage,
              item.unreadCount > 0 && styles.conversationMessageUnread
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </ThemedText>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadBadgeText}>{item.unreadCount}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Filter conversations by search query
  const filteredConversations = CONVERSATIONS.filter(
    convo => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Messages</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search matches"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>
      
      {NEW_MATCHES.length > 0 && (
        <ThemedView>
          <ThemedView style={styles.newMatchesHeader}>
            <ThemedText style={styles.newMatchesTitle}>New Matches</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.newMatchesViewAll}>View All</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <FlatList
            data={NEW_MATCHES}
            renderItem={renderNewMatch}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newMatchesList}
          />
        </ThemedView>
      )}
      
      <ThemedView style={styles.conversationsHeader}>
        <ThemedText style={styles.conversationsTitle}>Messages</ThemedText>
      </ThemedView>
      
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.conversationsList}
        />
      ) : (
        <ThemedView style={styles.emptyStateContainer}>
          <IconSymbol name="message.fill" size={60} color="#ccc" />
          <ThemedText style={styles.emptyStateText}>
            {searchQuery ? 'No matches found' : 'No messages yet'}
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            {searchQuery 
              ? 'Try another search' 
              : 'When you match with someone, you can send messages here'
            }
          </ThemedText>
        </ThemedView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  newMatchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  newMatchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newMatchesViewAll: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  newMatchesList: {
    paddingLeft: 10,
    paddingRight: 15,
  },
  newMatchItem: {
    alignItems: 'center',
    marginLeft: 10,
    width: 70,
  },
  newMatchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  newMatchName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  conversationsHeader: {
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 5,
  },
  conversationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationsList: {
    paddingHorizontal: 15,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  conversationImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  conversationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#777',
    flex: 1,
  },
  conversationMessageUnread: {
    fontWeight: '500',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 