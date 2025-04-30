import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTranslation } from 'react-i18next';
import { auth } from '@/firebase';
import { MatchStatus, MatchType } from '@/constants/MatchTypes';
import { subscribeToUserMatches, UserMatch, updateMatchStatus } from '@/services/matchService';
import { RandomMatch } from '@/components/RandomMatch';

export default function RandomMatchesScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [matches, setMatches] = useState<UserMatch[]>([]);
  
  // Kullanıcının eşleşmelerini dinle
  useEffect(() => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    
    // Realtime updates için abonelik oluştur
    const unsubscribe = subscribeToUserMatches(
      auth.currentUser.uid,
      (updatedMatches) => {
        // Sadece rastgele eşleşmeleri filtrele
        const randomMatches = updatedMatches.filter(
          match => match.type === MatchType.RANDOM
        );
        
        // Eşleşmeleri tarihe göre sırala (en yeniler en üstte)
        randomMatches.sort((a, b) => 
          b.createdAt.toMillis() - a.createdAt.toMillis()
        );
        
        setMatches(randomMatches);
        setLoading(false);
        setRefreshing(false);
      }
    );
    
    // Temizlik fonksiyonu
    return () => unsubscribe();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Yenileme işlemi, subscribeToUserMatches fonksiyonu zaten
    // veritabanındaki güncellemeleri izlediği için otomatik olarak
    // gerçekleşecektir. Sadece refreshing durumunu değiştirerek
    // kullanıcıya geri bildirim sağlıyoruz.
  };
  
  const renderEmptyState = () => {
    return (
      <ThemedView style={styles.emptyContainer}>
        <IconSymbol name="sparkles" size={50} color="#ccc" />
        <ThemedText style={styles.emptyTitle}>{t('randomMatch.noMatch')}</ThemedText>
        <ThemedText style={styles.emptyDescription}>{t('randomMatch.description')}</ThemedText>
      </ThemedView>
    );
  };
  
  // Bekleyen eşleşmeler
  const pendingMatches = matches.filter(match => match.status === MatchStatus.PENDING);
  
  // Kabul edilen/reddedilen/süresi dolmuş eşleşmeler
  const pastMatches = matches.filter(match => match.status !== MatchStatus.PENDING);
  
  const renderMatchCard = ({ item }: { item: UserMatch }) => {
    // Kullanıcı kendi durumunu belirle
    const isUser1 = item.userId1 === auth.currentUser?.uid;
    const userStatus = isUser1 ? item.user1Status : item.user2Status;
    const otherUserStatus = isUser1 ? item.user2Status : item.user1Status;
    
    let statusText = '';
    let statusColor = '#999';
    
    if (item.status === MatchStatus.PENDING) {
      if (userStatus === MatchStatus.ACCEPTED) {
        statusText = t('randomMatch.waitingForOther');
        statusColor = '#FF6B6B';
      } else {
        statusText = t('randomMatch.pending');
        statusColor = '#FF9800';
      }
    } else if (item.status === MatchStatus.ACCEPTED) {
      statusText = t('randomMatch.bothAccepted');
      statusColor = '#4CAF50';
    } else if (item.status === MatchStatus.REJECTED) {
      statusText = t('randomMatch.matchCanceled');
      statusColor = '#F44336';
    } else if (item.status === MatchStatus.EXPIRED) {
      statusText = t('randomMatch.matchExpired');
      statusColor = '#999';
    }
    
    // Eşleşme tarihini formatla
    const matchDate = item.createdAt.toDate();
    const formattedDate = matchDate.toLocaleDateString();
    
    return (
      <ThemedView style={styles.matchCard}>
        <TouchableOpacity style={styles.matchCardHeader}>
          <ThemedView style={styles.userImageContainer}>
            <Image 
              source={{ uri: item.otherUser.image }} 
              style={styles.userImage} 
            />
          </ThemedView>
          
          <ThemedView style={styles.matchInfo}>
            <ThemedText style={styles.userName}>
              {item.otherUser.name}, {item.otherUser.age}
            </ThemedText>
            
            <ThemedText style={[styles.matchStatus, { color: statusColor }]}>
              {statusText}
            </ThemedText>
            
            <ThemedText style={styles.matchDate}>
              {formattedDate}
            </ThemedText>
          </ThemedView>
          
          {item.status === MatchStatus.ACCEPTED && (
            <TouchableOpacity style={styles.messageButton}>
              <IconSymbol name="message.fill" size={24} color="#4CAF50" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </ThemedView>
    );
  };
  
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t('randomMatch.title')}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </ThemedView>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{t('randomMatch.title')}</ThemedText>
      </ThemedView>
      
      <FlatList
        data={pastMatches}
        keyExtractor={(item) => item.id || ''}
        renderItem={renderMatchCard}
        ListEmptyComponent={pendingMatches.length === 0 ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
          />
        }
        ListHeaderComponent={
          pendingMatches.length > 0 ? (
            <ThemedView style={styles.pendingMatchesContainer}>
              <ThemedText style={styles.sectionTitle}>{t('randomMatch.pending')}</ThemedText>
              <RandomMatch 
                match={pendingMatches[0]} 
                onStatusChange={() => setRefreshing(true)} 
              />
            </ThemedView>
          ) : null
        }
        ListFooterComponent={
          pastMatches.length > 0 ? (
            <ThemedView style={styles.pastMatchesContainer}>
              <ThemedText style={styles.sectionTitle}>{t('likes.matches')}</ThemedText>
            </ThemedView>
          ) : null
        }
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  pendingMatchesContainer: {
    marginBottom: 20,
  },
  pastMatchesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
  },
  matchCard: {
    margin: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  matchCardHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  userImageContainer: {
    marginRight: 15,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  matchDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  messageButton: {
    padding: 10,
  },
}); 