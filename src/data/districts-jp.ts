import { District } from '../types';

export const JAPANESE_OFFICES: District[] = [
  // Tokyo
  { code: '品川', name: 'Shinagawa (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '品川 (Tokyo Transport Bureau Shinagawa Office)' },
  { code: '練馬', name: 'Nerima (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '練馬 (Nerima Office)' },
  { code: '足立', name: 'Adachi (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '足立 (Adachi Office)' },
  { code: '八王子', name: 'Hachioji (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '八王子 (Hachioji Office)' },
  { code: '多摩', name: 'Tama (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '多摩 (Tama Office)' },
  { code: '世田谷', name: 'Setagaya (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '世田谷 (Setagaya Local Plate)' },
  { code: '杉並', name: 'Suginami (Tokyo)', state: 'Tokyo', stateCode: 'tokyo', fullName: '杉並 (Suginami Local Plate)' },

  // Kanagawa
  { code: '横浜', name: 'Yokohama (Kanagawa)', state: 'Kanagawa', stateCode: 'kanagawa', fullName: '横浜 (Kanagawa Transport Branch Office)' },
  { code: '川崎', name: 'Kawasaki (Kanagawa)', state: 'Kanagawa', stateCode: 'kanagawa', fullName: '川崎 (Kawasaki Office)' },
  { code: '湘南', name: 'Shonan (Kanagawa)', state: 'Kanagawa', stateCode: 'kanagawa', fullName: '湘南 (Shonan Office, Hiratsuka)' },

  // Osaka
  { code: '大阪', name: 'Osaka', state: 'Osaka', stateCode: 'osaka', fullName: '大阪 (Osaka Transport Branch Office)' },
  { code: 'なにわ', name: 'Naniwa (Osaka City)', state: 'Osaka', stateCode: 'osaka', fullName: 'なにわ (Naniwa Office, Osaka City)' },
  { code: '堺', name: 'Sakai (Osaka)', state: 'Osaka', stateCode: 'osaka', fullName: '堺 (Sakai Local Plate)' },

  // Aichi
  { code: '名古屋', name: 'Nagoya (Aichi)', state: 'Aichi', stateCode: 'aichi', fullName: '名古屋 (Aichi Transport Branch Office)' },
  { code: '豊田', name: 'Toyota (Aichi)', state: 'Aichi', stateCode: 'aichi', fullName: '豊田 (Toyota City Local Plate - Home of Toyota Motor Corp)' },

  // Kyoto & Hyogo
  { code: '京都', name: 'Kyoto', state: 'Kyoto', stateCode: 'kyoto', fullName: '京都 (Kyoto Transport Branch Office)' },
  { code: '神戸', name: 'Kobe (Hyogo)', state: 'Hyogo', stateCode: 'hyogo', fullName: '神戸 (Hyogo Transport Branch Office)' },

  // Hokkaido & Tohoku
  { code: '札幌', name: 'Sapporo (Hokkaido)', state: 'Hokkaido', stateCode: 'hokkaido', fullName: '札幌 (Hokkaido Transport Bureau Sapporo Office)' },
  { code: '仙台', name: 'Sendai (Miyagi)', state: 'Miyagi', stateCode: 'miyagi', fullName: '仙台 (Sendai Local Plate)' },

  // Chubu / Mt Fuji
  { code: '富士山', name: 'Fujisan (Mt. Fuji)', state: 'Shizuoka / Yamanashi', stateCode: 'shizuoka', fullName: '富士山 (Iconic Mt. Fuji Cross-Prefectural Plate)' },

  // Kyushu & Okinawa
  { code: '福岡', name: 'Fukuoka', state: 'Fukuoka', stateCode: 'fukuoka', fullName: '福岡 (Fukuoka Transport Branch Office)' },
  { code: '沖縄', name: 'Okinawa', state: 'Okinawa', stateCode: 'okinawa', fullName: '沖縄 (Okinawa General Bureau Transport Dept)' },
];
