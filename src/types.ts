export interface Stat {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface PlatformStats {
  name: string;
  solved: number;
  total: number;
  rating?: number;
  maxRating?: number;
  rank?: string;
  color: string;
  difficultyBreakdown?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  solved: number;
  rating: number;
}
