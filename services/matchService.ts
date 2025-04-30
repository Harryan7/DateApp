import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  getDoc, 
  Timestamp, 
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { MatchStatus, MatchType, MATCH_EXPIRATION_TIME, RANDOM_MATCH_HOURS } from '@/constants/MatchTypes';

// Eşleşme modeli
export interface Match {
  id?: string;
  userId1: string;
  userId2: string;
  type: MatchType;
  status: MatchStatus;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  user1Status?: MatchStatus;
  user2Status?: MatchStatus;
  lastUpdated?: Timestamp;
}

// Kullanıcı eşleşme arayüzü
export interface UserMatch extends Match {
  otherUser: {
    id: string;
    name: string;
    age: number;
    image: string;
  };
}

/**
 * Rastgele eşleşme saati aralığında mı kontrol eder
 */
export const isRandomMatchTimeWindow = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= RANDOM_MATCH_HOURS.START && hour < RANDOM_MATCH_HOURS.END;
};

/**
 * Rastgele eşleşmeleri oluşturur
 * Bu fonksiyon bir zamanlanmış görev (Cloud Function) olarak çalıştırılabilir
 */
export const createRandomMatches = async (): Promise<void> => {
  // Eğer rastgele eşleşme saati değilse işlem yapma
  if (!isRandomMatchTimeWindow()) {
    console.log('Rastgele eşleşme saati değil');
    return;
  }

  try {
    // Mevcut aktif kullanıcıları al (burada sadece örnek, gerçek uygulamada daha karmaşık bir sorgu olabilir)
    const usersRef = collection(db, 'users');
    const activeUsersQuery = query(usersRef, where('active', '==', true));
    const activeUsersSnapshot = await getDocs(activeUsersQuery);
    
    const activeUsers = activeUsersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Kullanıcı sayısı 2'den az ise eşleşme yapılamaz
    if (activeUsers.length < 2) {
      console.log('Eşleşme için yeterli kullanıcı yok');
      return;
    }
    
    // Kullanıcıları karıştır
    const shuffledUsers = [...activeUsers].sort(() => 0.5 - Math.random());
    
    // Kullanıcıları eşleştir
    const matches = [];
    for (let i = 0; i < shuffledUsers.length - 1; i += 2) {
      const user1 = shuffledUsers[i];
      const user2 = shuffledUsers[i + 1];
      
      // Halihazırda bu iki kullanıcı arasında aktif bir eşleşme var mı kontrol et
      const existingMatchesQuery = query(
        collection(db, 'matches'),
        where('userId1', 'in', [user1.id, user2.id]),
        where('userId2', 'in', [user1.id, user2.id]),
        where('status', '==', MatchStatus.PENDING)
      );
      
      const existingMatchesSnapshot = await getDocs(existingMatchesQuery);
      
      // Eğer aktif bir eşleşme yoksa yeni bir eşleşme oluştur
      if (existingMatchesSnapshot.empty) {
        const now = Timestamp.now();
        const expiresAt = Timestamp.fromMillis(now.toMillis() + MATCH_EXPIRATION_TIME);
        
        const newMatch: Omit<Match, 'id'> = {
          userId1: user1.id,
          userId2: user2.id,
          type: MatchType.RANDOM,
          status: MatchStatus.PENDING,
          createdAt: now,
          expiresAt: expiresAt,
          user1Status: MatchStatus.PENDING,
          user2Status: MatchStatus.PENDING
        };
        
        matches.push(newMatch);
      }
    }
    
    // Eşleşmeleri veritabanına ekle
    const matchesRef = collection(db, 'matches');
    
    for (const match of matches) {
      await addDoc(matchesRef, match);
    }
    
    console.log(`${matches.length} rastgele eşleşme oluşturuldu`);
  } catch (error) {
    console.error('Rastgele eşleşme oluştururken hata:', error);
    throw error;
  }
};

/**
 * Belirli bir kullanıcı için bekleyen eşleşmeleri getirir
 */
export const getPendingMatchesForUser = async (userId: string): Promise<UserMatch[]> => {
  try {
    const matchesRef = collection(db, 'matches');
    const userMatches: UserMatch[] = [];
    
    // Kullanıcının hem userId1 hem de userId2 olarak bulunduğu eşleşmeleri al
    const matches1Query = query(
      matchesRef,
      where('userId1', '==', userId),
      where('status', '==', MatchStatus.PENDING)
    );
    
    const matches2Query = query(
      matchesRef,
      where('userId2', '==', userId),
      where('status', '==', MatchStatus.PENDING)
    );
    
    const [matches1Snapshot, matches2Snapshot] = await Promise.all([
      getDocs(matches1Query),
      getDocs(matches2Query)
    ]);
    
    // İlk sorgudan gelen eşleşmeleri işle
    for (const matchDoc of matches1Snapshot.docs) {
      const matchData = matchDoc.data() as Match;
      const otherUserId = matchData.userId2;
      
      // Diğer kullanıcı bilgilerini al
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
      
      if (otherUserDoc.exists()) {
        const otherUserData = otherUserDoc.data();
        
        userMatches.push({
          id: matchDoc.id,
          ...matchData,
          otherUser: {
            id: otherUserId,
            name: otherUserData.name,
            age: otherUserData.age,
            image: otherUserData.profileImage
          }
        });
      }
    }
    
    // İkinci sorgudan gelen eşleşmeleri işle
    for (const matchDoc of matches2Snapshot.docs) {
      const matchData = matchDoc.data() as Match;
      const otherUserId = matchData.userId1;
      
      // Diğer kullanıcı bilgilerini al
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
      
      if (otherUserDoc.exists()) {
        const otherUserData = otherUserDoc.data();
        
        userMatches.push({
          id: matchDoc.id,
          ...matchData,
          otherUser: {
            id: otherUserId,
            name: otherUserData.name,
            age: otherUserData.age,
            image: otherUserData.profileImage
          }
        });
      }
    }
    
    return userMatches;
  } catch (error) {
    console.error('Bekleyen eşleşmeleri getirirken hata:', error);
    throw error;
  }
};

/**
 * Eşleşme durumunu günceller
 */
export const updateMatchStatus = async (
  matchId: string, 
  userId: string, 
  status: MatchStatus
): Promise<void> => {
  try {
    const matchRef = doc(db, 'matches', matchId);
    const matchDoc = await getDoc(matchRef);
    
    if (!matchDoc.exists()) {
      throw new Error('Eşleşme bulunamadı');
    }
    
    const matchData = matchDoc.data() as Match;
    
    // Kullanıcının bu eşleşmenin parçası olduğunu doğrula
    if (matchData.userId1 !== userId && matchData.userId2 !== userId) {
      throw new Error('Bu eşleşmenin parçası değilsiniz');
    }
    
    const isUser1 = matchData.userId1 === userId;
    
    // Kullanıcının durumunu güncelle
    const updateData: Record<string, any> = isUser1 
      ? { user1Status: status } 
      : { user2Status: status };
    
    // Eğer her iki kullanıcı da kabul ederse, eşleşme durumunu kabul edildi olarak güncelle
    if (status === MatchStatus.ACCEPTED) {
      if (
        (isUser1 && matchData.user2Status === MatchStatus.ACCEPTED) ||
        (!isUser1 && matchData.user1Status === MatchStatus.ACCEPTED)
      ) {
        updateData.status = MatchStatus.ACCEPTED;
      }
    } 
    // Eğer bir kullanıcı reddederse, eşleşme durumunu reddedildi olarak güncelle
    else if (status === MatchStatus.REJECTED) {
      updateData.status = MatchStatus.REJECTED;
    }
    
    updateData.lastUpdated = Timestamp.now();
    
    await updateDoc(matchRef, updateData);
  } catch (error) {
    console.error('Eşleşme durumunu güncellerken hata:', error);
    throw error;
  }
};

/**
 * Süresi dolan eşleşmeleri işler
 * Bu fonksiyon bir zamanlanmış görev (Cloud Function) olarak çalıştırılabilir
 */
export const processExpiredMatches = async (): Promise<void> => {
  try {
    const now = Timestamp.now();
    
    // Süresi dolmuş ama hala PENDING durumunda olan eşleşmeleri bul
    const matchesRef = collection(db, 'matches');
    const expiredMatchesQuery = query(
      matchesRef,
      where('expiresAt', '<', now),
      where('status', '==', MatchStatus.PENDING)
    );
    
    const expiredMatchesSnapshot = await getDocs(expiredMatchesQuery);
    
    // Süresi dolan eşleşmeleri güncelle
    const batch = [];
    for (const matchDoc of expiredMatchesSnapshot.docs) {
      const matchRef = doc(db, 'matches', matchDoc.id);
      batch.push(updateDoc(matchRef, {
        status: MatchStatus.EXPIRED,
        lastUpdated: now
      }));
    }
    
    await Promise.all(batch);
    
    console.log(`${expiredMatchesSnapshot.size} süresi dolmuş eşleşme işlendi`);
  } catch (error) {
    console.error('Süresi dolan eşleşmeleri işlerken hata:', error);
    throw error;
  }
};

/**
 * Kullanıcının eşleşmelerini dinler
 */
export const subscribeToUserMatches = (
  userId: string,
  onMatchesUpdate: (matches: UserMatch[]) => void
) => {
  const matchesRef = collection(db, 'matches');
  
  // Kullanıcının eşleşmelerini dinle
  const matches1Query = query(
    matchesRef,
    where('userId1', '==', userId)
  );
  
  const matches2Query = query(
    matchesRef,
    where('userId2', '==', userId)
  );
  
  // Her iki sorgu için dinleyiciler oluştur
  const unsubscribe1 = onSnapshot(matches1Query, async (snapshot) => {
    await processMatchUpdates(snapshot, userId, onMatchesUpdate);
  });
  
  const unsubscribe2 = onSnapshot(matches2Query, async (snapshot) => {
    await processMatchUpdates(snapshot, userId, onMatchesUpdate);
  });
  
  // Her iki dinleyiciyi de sonlandırmak için bir fonksiyon döndür
  return () => {
    unsubscribe1();
    unsubscribe2();
  };
};

// Eşleşme güncellemelerini işlemek için yardımcı fonksiyon
const processMatchUpdates = async (
  snapshot: QuerySnapshot,
  userId: string,
  onMatchesUpdate: (matches: UserMatch[]) => void
) => {
  try {
    const userMatches: UserMatch[] = [];
    const otherUserIds = new Set<string>();
    
    // Eşleşmeleri topla ve diğer kullanıcı ID'lerini listele
    for (const matchDoc of snapshot.docs) {
      const matchData = matchDoc.data() as Match;
      const otherUserId = matchData.userId1 === userId ? matchData.userId2 : matchData.userId1;
      otherUserIds.add(otherUserId);
    }
    
    // Diğer kullanıcıların bilgilerini bir seferde al
    const userDocs = await Promise.all(
      Array.from(otherUserIds).map(id => getDoc(doc(db, 'users', id)))
    );
    
    // Kullanıcı bilgilerini bir harita olarak düzenle
    const userDataMap = new Map();
    userDocs.forEach(doc => {
      if (doc.exists()) {
        userDataMap.set(doc.id, doc.data());
      }
    });
    
    // Eşleşmeleri tamamla
    for (const matchDoc of snapshot.docs) {
      const matchData = matchDoc.data() as Match;
      const otherUserId = matchData.userId1 === userId ? matchData.userId2 : matchData.userId1;
      
      const otherUserData = userDataMap.get(otherUserId);
      if (otherUserData) {
        userMatches.push({
          id: matchDoc.id,
          ...matchData,
          otherUser: {
            id: otherUserId,
            name: otherUserData.name,
            age: otherUserData.age,
            image: otherUserData.profileImage
          }
        });
      }
    }
    
    onMatchesUpdate(userMatches);
  } catch (error) {
    console.error('Eşleşme güncellemelerini işlerken hata:', error);
  }
}; 