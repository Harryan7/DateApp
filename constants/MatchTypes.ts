export enum MatchType {
  LIKE = 'like',      // Normal beğeni ile eşleşme
  RANDOM = 'random',  // Rastgele eşleşme
}

export enum MatchStatus {
  PENDING = 'pending',     // Onay bekliyor
  ACCEPTED = 'accepted',   // Kabul edildi
  REJECTED = 'rejected',   // Reddedildi
  EXPIRED = 'expired',     // Süresi doldu
}

// Rastgele eşleşme saatleri
export const RANDOM_MATCH_HOURS = {
  START: 12, // Öğlen 12
  END: 18,   // Akşam 6
};

// Eşleşme kabul süresi (6 saat = 21600000 ms)
export const MATCH_EXPIRATION_TIME = 6 * 60 * 60 * 1000; 