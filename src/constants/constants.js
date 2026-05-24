/**
 * アプリケーション全体で使用する定数
 */

// API設定
export const API_CONFIG = {
  HEARTRAILS_BASE_URL: 'https://express.heartrails.com/api/json',
  OPENROUTESERVICE_BASE_URL: 'https://api.openrouteservice.org/v2/directions',
  TOKYO_PREFECTURE: '東京都',
}

// 東京の地理的範囲
export const TOKYO_BOUNDS = {
  MIN_LAT: 35,
  MAX_LAT: 36,
  MIN_LNG: 139,
  MAX_LNG: 140,
}

// ルーティングプロフィール
export const ROUTING_PROFILES = [
  { value: 'car', label: '車' },
  { value: 'bike', label: '自転車' },
  { value: 'walking', label: '徒歩' }
]

// プロフィールのマッピング（OpenRouteService API用）
export const PROFILE_MAPPING = {
  'car': 'driving-car',
  'bike': 'cycling-regular',
  'walking': 'foot-walking'
}

// フォールバック駅データ（API利用不可時）
export const FALLBACK_STATIONS = [
  { name: '東京駅', lat: 35.681236, lng: 139.767125 },
  { name: '新宿駅', lat: 35.689607, lng: 139.700571 },
  { name: '渋谷駅', lat: 35.658034, lng: 139.701636 },
  { name: '池袋駅', lat: 35.728926, lng: 139.71038 },
  { name: '品川駅', lat: 35.628471, lng: 139.73876 },
  { name: '上野駅', lat: 35.713768, lng: 139.777254 },
  { name: '秋葉原駅', lat: 35.698353, lng: 139.773114 },
  { name: '銀座駅', lat: 35.671449, lng: 139.764107 },
  { name: '六本木駅', lat: 35.660463, lng: 139.729426 },
  { name: '恵比寿駅', lat: 35.646685, lng: 139.71007 }
]

// マップ設定
export const MAP_CONFIG = {
  DEFAULT_CENTER: [35.6895, 139.6917],
  DEFAULT_ZOOM: 10,
  DESTINATION_ZOOM: 15,
  MARKER_ICON_SIZE: [25, 41],
  POLYLINE_COLOR: 'blue',
  POLYLINE_WEIGHT: 5,
}

// OpenStreetMap設定
export const OPENSTREETMAP_CONFIG = {
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}
