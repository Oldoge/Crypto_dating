export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  description: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  priceChange24h: number;
}

export interface SwipeAction {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  action: 'like' | 'dislike';
  initialPrice: number;
  timestamp: Date;
  resultChecked?: boolean;
  actualOutcome?: 'up' | 'down';
  wasCorrect?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  totalSwipes: number;
  correctPredictions: number;
  predictions: SwipeAction[];
}