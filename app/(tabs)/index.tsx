import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated, PanResponder, Text, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

// Dummy user data
const DUMMY_USERS = [
  {
    id: 1,
    name: 'Sarah',
    age: 26,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Adventure seeker, coffee lover'
  },
  {
    id: 2,
    name: 'Jessica',
    age: 24,
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Foodie and yoga enthusiast'
  },
  {
    id: 3,
    name: 'Michael',
    age: 28,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Photographer and world traveler'
  },
  {
    id: 4,
    name: 'David',
    age: 30,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Musician and dog lover'
  },
  {
    id: 5,
    name: 'Emily',
    age: 27,
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'Bookworm and hiking enthusiast'
  }
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [users, setUsers] = useState(DUMMY_USERS);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp'
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      }
    })
  ).current;

  const swipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setUsers(prevUsers => prevUsers.slice(1));
      position.setValue({ x: 0, y: 0 });
    });
  };

  const renderCards = () => {
    if (users.length === 0) {
      return (
        <ThemedView style={styles.noMoreCards}>
          <ThemedText type="title">No more profiles!</ThemedText>
          <ThemedText>Check back later for new matches</ThemedText>
        </ThemedView>
      );
    }

    return users.map((user, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={user.id}
            style={[
              styles.card,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <Image source={{ uri: user.image }} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardName}>{user.name}, {user.age}</Text>
              <Text style={styles.cardBio}>{user.bio}</Text>
            </View>
            
            <Animated.View 
              style={[styles.likeStamp, { opacity: likeOpacity }]}
            >
              <Text style={styles.likeStampText}>LIKE</Text>
            </Animated.View>
            
            <Animated.View 
              style={[styles.nopeStamp, { opacity: nopeOpacity }]}
            >
              <Text style={styles.nopeStampText}>NOPE</Text>
            </Animated.View>
          </Animated.View>
        );
      }
      
      if (index === 1) {
        return (
          <Animated.View
            key={user.id}
            style={[
              styles.card, 
              { 
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardScale }] 
              }
            ]}
          >
            <Image source={{ uri: user.image }} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardName}>{user.name}, {user.age}</Text>
              <Text style={styles.cardBio}>{user.bio}</Text>
            </View>
          </Animated.View>
        );
      }
      
      return null;
    }).reverse();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Discover</ThemedText>
      </ThemedView>
      <ThemedView style={styles.cardsContainer}>
        {renderCards()}
      </ThemedView>
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
  cardsContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  cardTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardBio: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  likeStamp: {
    position: 'absolute',
    top: 50,
    right: 20,
    transform: [{ rotate: '20deg' }],
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#00FF60',
    padding: 10,
  },
  likeStampText: {
    fontSize: 32,
    color: '#00FF60',
    fontWeight: 'bold',
  },
  nopeStamp: {
    position: 'absolute',
    top: 50,
    left: 20,
    transform: [{ rotate: '-20deg' }],
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#FF0060',
    padding: 10,
  },
  nopeStampText: {
    fontSize: 32,
    color: '#FF0060',
    fontWeight: 'bold',
  },
  noMoreCards: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});
