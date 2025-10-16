import type { CryptoCurrency } from '../types/crypto';
import { mockCryptos } from '../data/mockCryptos';

// CoinGecko API interface
interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export class CoinGeckoService {
  private static instance: CoinGeckoService;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private callbacks: ((coins: CryptoCurrency[]) => void)[] = [];
  private lastSuccessfulFetch: CryptoCurrency[] = [];

  private constructor() {}

  static getInstance(): CoinGeckoService {
    if (!CoinGeckoService.instance) {
      CoinGeckoService.instance = new CoinGeckoService();
    }
    return CoinGeckoService.instance;
  }

  async fetchTopCoins(): Promise<CryptoCurrency[]> {
    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CoinGeckoMarketData[] = await response.json();

      // Filter out stablecoins (expanded list + symbol heuristics)
      const stableIdSet = new Set<string>([
        // USD
        'tether', // USDT
        'usd-coin', // USDC
        'binance-usd', // BUSD
        'true-usd', // TUSD
        'paxos-standard', // USDP old
        'pax-dollar', // USDP new
        'dai',
        'frax',
        'usdd',
        'fei-usd',
        'liquity-usd', // LUSD
        'crvusd',
        'usds', // USDS
        'BSC-USD', // USDB
        'figr_heloc', // FIGR_HELOC
        'first-digital-usd', // FDUSD
        'paypal-usd', // PYUSD
        'ethena-usde', // USDE
        'mountain-protocol-usdm', // USDM
        'usdk', 'usdx', 'usdn', // variants
        // UST
        'terrausd', 'terrausd-classic',
        // EUR
        'stasis-eurs', // EURS
        'euro-coin', // EURC
        'tether-eurt', // EURT
        // Others (fiat-pegged)
        'xsgd',
      ]);
      const stableSymbolRegex = /^(usdt|figr_heloc|BSC-USD|usds|usdc|busd|tusd|usdp|gusd|lusd|usdd|usde|usdm|usdb|usd|pyusd|fdusd|crvusd|dai|frax|ust|ustc|eurt|eurs|eurc|susd)$/i;

      const filteredData = data.filter((coin) => {
        const id = coin.id.toLowerCase();
        const sym = coin.symbol.toLowerCase();
        if (stableIdSet.has(id)) return false; // exclude
        if (stableSymbolRegex.test(sym)) return false; // exclude
        return true; // keep
      });

      const coins: CryptoCurrency[] = filteredData.slice(0, 50).map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        description: this.getCoinDescription(coin.symbol.toUpperCase()),
        image: coin.image,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        priceChange24h: coin.price_change_percentage_24h || 0
      }));

      this.lastSuccessfulFetch = coins;
      return coins;
    } catch (error) {
      console.error('Error fetching coins from CoinGecko:', error);
      
      // Return last successful fetch if available, otherwise return mock data
      if (this.lastSuccessfulFetch.length > 0) {
        console.log('Using last successful fetch data');
        return this.lastSuccessfulFetch;
      }
      
      console.log('Falling back to mock data');
      return mockCryptos;
    }
  }

  private getCoinDescription(symbol: string): string {
    const descriptions: Record<string, string> = {
      'BTC': 'The world\'s first cryptocurrency, Bitcoin is a digital asset that serves as a store of value and medium of exchange.',
      'ETH': 'A decentralized platform that enables smart contracts and decentralized applications (DApps) to be built and operated.',
      'BNB': 'The native cryptocurrency of the Binance ecosystem, used for trading fee discounts and various utilities.',
      'XRP': 'A digital payment protocol that enables fast, low-cost international money transfers.',
      'ADA': 'A blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility.',
      'DOGE': 'Originally created as a joke, Dogecoin has become a popular cryptocurrency with a strong community.',
      'SOL': 'A high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
      'TRX': 'A blockchain-based decentralized protocol that aims to construct a worldwide free content entertainment system.',
      'DOT': 'A multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion.',
      'MATIC': 'A decentralized platform that provides tools and infrastructure for developers to build and connect Ethereum-compatible blockchain networks.',
      'LTC': 'A peer-to-peer cryptocurrency created as a "lite" version of Bitcoin with faster transaction times.',
      'SHIB': 'An Ethereum-based altcoin that features the Shiba Inu dog as its mascot.',
      'AVAX': 'A platform for decentralized applications and custom blockchain networks.',
      'UNI': 'The governance token of Uniswap, a leading decentralized exchange protocol.',
      'LINK': 'A decentralized oracle network that connects smart contracts with real-world data.',
      'ATOM': 'The native token of Cosmos, an ecosystem of connected blockchains.',
      'XMR': 'A privacy-focused cryptocurrency that uses advanced cryptographic techniques.',
      'ETC': 'The original Ethereum blockchain that maintained the original protocol.',
      'BCH': 'A cryptocurrency created from a Bitcoin hard fork to increase transaction capacity.',
      'NEAR': 'A developer-friendly blockchain designed to be fast, secure, and scalable.'
    };

    return descriptions[symbol] || `${symbol} is a cryptocurrency with unique features and use cases in the digital asset ecosystem.`;
  }

  startPolling(callback: (coins: CryptoCurrency[]) => void): void {
    this.callbacks.push(callback);

    // Fetch immediately
    this.fetchAndNotify();

    // Set up polling every 30 seconds (to respect API rate limits)
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        this.fetchAndNotify();
      }, 30000); // 30 seconds to avoid rate limiting
    }
  }

  stopPolling(callback?: (coins: CryptoCurrency[]) => void): void {
    if (callback) {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    } else {
      this.callbacks = [];
    }

    if (this.callbacks.length === 0 && this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async fetchAndNotify(): Promise<void> {
    const coins = await this.fetchTopCoins();
    this.callbacks.forEach(callback => callback(coins));
  }
}

export const coinGeckoService = CoinGeckoService.getInstance();