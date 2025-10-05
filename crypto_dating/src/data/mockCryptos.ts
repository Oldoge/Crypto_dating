import type { CryptoCurrency } from '../types/crypto';

export const mockCryptos: CryptoCurrency[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    description: 'The world\'s first cryptocurrency, Bitcoin is a digital asset that serves as a store of value and medium of exchange.',
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 67420.50,
    marketCap: 847000000000,
    priceChange24h: 2.45
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    description: 'A decentralized platform that enables smart contracts and decentralized applications (DApps) to be built and operated.',
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 3245.80,
    marketCap: 310000000000,
    priceChange24h: -1.23
  },
  {
    id: '3',
    symbol: 'ADA',
    name: 'Cardano',
    description: 'A blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility.',
    image: 'https://images.pexels.com/photos/6771177/pexels-photo-6771177.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 0.52,
    marketCap: 17200000000,
    priceChange24h: 3.67
  },
  {
    id: '4',
    symbol: 'DOT',
    name: 'Polkadot',
    description: 'A multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion.',
    image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 8.95,
    marketCap: 9800000000,
    priceChange24h: -0.89
  },
  {
    id: '5',
    symbol: 'MATIC',
    name: 'Polygon',
    description: 'A decentralized platform that provides tools and infrastructure for developers to build and connect Ethereum-compatible blockchain networks.',
    image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 1.15,
    marketCap: 8500000000,
    priceChange24h: 5.12
  },
  {
    id: '6',
    symbol: 'SOL',
    name: 'Solana',
    description: 'A high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
    image: 'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentPrice: 185.75,
    marketCap: 42000000000,
    priceChange24h: 7.23
  }
];