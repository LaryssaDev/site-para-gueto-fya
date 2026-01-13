import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Camisetas
  {
    id: '1',
    name: 'CAMISETA CHRONIC #1',
    description: '✔️ 100% ORIGINAL. Estilo urbano autêntico.',
    price: 64.99,
    category: 'Camisetas',
    stock: 50,
    sizes: ['P', 'M', 'G', 'GG'],
    images: ['https://i.imgur.com/2c7168K.png', 'https://i.imgur.com/lCyxGCB.png']
  },
  {
    id: '2',
    name: 'CAMISETA CHRONIC #2',
    description: '✔️ 100% ORIGINAL. Conforto e atitude.',
    price: 64.99,
    category: 'Camisetas',
    stock: 50,
    sizes: ['P', 'M', 'G', 'GG'],
    images: ['https://i.imgur.com/1ERKSbB.png', 'https://i.imgur.com/NLquKDm.png']
  },
  {
    id: '3',
    name: 'CAMISETA CHRONIC #3',
    description: '✔️ 100% ORIGINAL. Arte exclusiva.',
    price: 64.99,
    category: 'Camisetas',
    stock: 50,
    sizes: ['M', 'G', 'GG'],
    images: ['https://i.imgur.com/T818GPO.png', 'https://i.imgur.com/8xYparx.png']
  },
  // Bonés (Unique Size)
  {
    id: '6',
    name: 'BONÉ CHRONIC STYLE',
    description: '✔️ 100% ORIGINAL. Aba curva, ajuste snapback.',
    price: 90.00,
    category: 'Bonés',
    stock: 30,
    sizes: ['U'],
    images: ['https://i.imgur.com/i1j2zkz.png']
  },
  // Moletons
  {
    id: '8',
    name: 'BLUSA CHRONIC HOODIE #1',
    description: 'Conforto e estilo urbano para dias frios.',
    price: 150.00,
    category: 'Moletons',
    stock: 20,
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    images: ['https://i.imgur.com/sF84OSq.png', 'https://i.imgur.com/EE9X9DH.png']
  },
  // Bermudas
  {
    id: '10',
    name: 'SHORTS CHRONIC #1',
    description: '✔️ 100% ORIGINAL - Alta durabilidade.',
    price: 70.00,
    category: 'Bermudas',
    stock: 40,
    sizes: ['38', '40', '42', '44'],
    images: ['https://i.imgur.com/WpoJgbS.png', 'https://i.imgur.com/aCyQPXm.png']
  }
];

export const LOGO_URL = 'https://i.imgur.com/1ajPNUV.png';
export const DISCOUNT_BANNER_URL = 'https://i.imgur.com/62kpOCt.png';
export const HERO_IMAGE_URL = 'https://i.imgur.com/Xsvf6xa.png';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin22'
};