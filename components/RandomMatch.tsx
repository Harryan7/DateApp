import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useTranslation } from 'react-i18next';
import { auth } from '@/firebase';
import { 
  getPendingMatchesForUser, 
  updateMatchStatus, 
  UserMatch 
} from '@/services/matchService';
import { MatchStatus } from '@/constants/MatchTypes';

interface RandomMatchProps {
  match?: UserMatch; // Harici olarak sağlanan match objesi
  onStatusChange?: () => void; // Match durumu değiştiğinde çağrılacak
}

export const RandomMatch: React.FC<RandomMatchProps> = ({ match: externalMatch, onStatusChange }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingMatch, setPendingMatch] = useState<UserMatch | null>(externalMatch || null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (externalMatch) {
      // Eğer harici bir match verildiyse, onu kullan
      setPendingMatch(externalMatch);
      setLoading(false);
    } else {
      // Değilse Firebase'den çek
      loadPendingMatch();
    }
  }, [externalMatch]);

  // Zamanlayıcı
  useEffect(() => {
    if (!pendingMatch) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expirationTime = pendingMatch.expiresAt.toMillis();
      const difference = expirationTime - now;

      // Süre dolmuşsa
      if (difference <= 0) {
        setTimeRemaining('00:00:00');
        setStatusMessage(t('randomMatch.matchExpired'));
        setPendingMatch(null);
        return;
      }

      // Zamanı hesapla
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Zaman formatını oluştur
      const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');

      setTimeRemaining(formattedTime);
    };

    // İlk hesaplamayı yap
    calculateTimeRemaining();

    // Her saniye güncelle
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [pendingMatch, t]);

  // Kullanıcının eşleşme durumunu belirle
  useEffect(() => {
    if (!pendingMatch || !auth.currentUser) return;
    
    // Kullanıcının kendi durumunu belirle
    const isUser1 = pendingMatch.userId1 === auth.currentUser.uid;
    const userStatus = isUser1 ? pendingMatch.user1Status : pendingMatch.user2Status;
    const otherUserStatus = isUser1 ? pendingMatch.user2Status : pendingMatch.user1Status;
    
    if (userStatus === MatchStatus.ACCEPTED) {
      if (otherUserStatus === MatchStatus.ACCEPTED) {
        setStatusMessage(t('randomMatch.bothAccepted'));
      } else {
        setStatusMessage(t('randomMatch.waitingForOther'));
      }
    }
  }, [pendingMatch, t]);

  const loadPendingMatch = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const matches = await getPendingMatchesForUser(auth.currentUser.uid);
      
      if (matches.length > 0) {
        // En son eşleşmeyi göster
        setPendingMatch(matches[0]);
      } else {
        setPendingMatch(null);
        setStatusMessage(t('randomMatch.noMatch'));
      }
    } catch (error) {
      console.error('Eşleşme yüklenirken hata:', error);
      setStatusMessage(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!pendingMatch || !auth.currentUser || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await updateMatchStatus(
        pendingMatch.id!,
        auth.currentUser.uid,
        MatchStatus.ACCEPTED
      );
      setStatusMessage(t('randomMatch.matchAccepted'));
      
      // Durumu güncelle ve yeniden yükle
      if (onStatusChange) {
        onStatusChange();
      } else {
        await loadPendingMatch();
      }
    } catch (error) {
      console.error('Eşleşme kabul edilirken hata:', error);
      setStatusMessage(t('common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!pendingMatch || !auth.currentUser || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await updateMatchStatus(
        pendingMatch.id!,
        auth.currentUser.uid,
        MatchStatus.REJECTED
      );
      setStatusMessage(t('randomMatch.matchCanceled'));
      setPendingMatch(null);
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Eşleşme reddedilirken hata:', error);
      setStatusMessage(t('common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </ThemedView>
    );
  }

  if (!pendingMatch) {
    return (
      <ThemedView style={styles.container}>
        <IconSymbol name="person.2.slash" size={50} color="#ccc" />
        <ThemedText style={styles.noMatchText}>{statusMessage}</ThemedText>
        <ThemedText style={styles.description}>{t('randomMatch.description')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{t('randomMatch.pending')}</ThemedText>
      
      <ThemedView style={styles.matchCard}>
        <Image 
          source={{ uri: pendingMatch.otherUser.image }} 
          style={styles.profileImage} 
        />
        
        <ThemedText style={styles.name}>
          {pendingMatch.otherUser.name}, {pendingMatch.otherUser.age}
        </ThemedText>
        
        <ThemedView style={styles.timerContainer}>
          <IconSymbol name="timer" size={18} color="#FF6B6B" />
          <ThemedText style={styles.timer}>
            {t('randomMatch.timeRemaining', { time: timeRemaining })}
          </ThemedText>
        </ThemedView>
        
        {statusMessage ? (
          <ThemedText style={styles.statusMessage}>{statusMessage}</ThemedText>
        ) : (
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]} 
              onPress={handleReject}
              disabled={isProcessing}
            >
              <IconSymbol name="xmark" size={20} color="white" />
              <ThemedText style={styles.buttonText}>{t('randomMatch.reject')}</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]} 
              onPress={handleAccept}
              disabled={isProcessing}
            >
              <IconSymbol name="checkmark" size={20} color="white" />
              <ThemedText style={styles.buttonText}>{t('randomMatch.accept')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  matchCard: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    marginLeft: 5,
    fontSize: 16,
    color: '#FF6B6B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  noMatchText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 20,
  }
}); 