/**
 * ルート取得サービス
 */

import { API_CONFIG, PROFILE_MAPPING } from '../constants/constants'
import { toOpenRouteServiceFormat, toLeafletFormat } from '../utils/coordinateUtils'

/**
 * 2点間のルートを取得
 * @param {Object} startPosition - 開始位置 {lat, lng}
 * @param {Object} endPosition - 終了位置 {lat, lng}
 * @param {string} profileValue - ルーティングプロフィール ('car', 'bike', 'walking')
 * @returns {Promise<Array>} ルート座標の配列 [[lat, lng], ...]
 */
export const fetchRoute = async (startPosition, endPosition, profileValue) => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY

    if (!apiKey) {
      throw new Error('OpenRouteService API Key is not set')
    }

    const profile = PROFILE_MAPPING[profileValue] || PROFILE_MAPPING['bike']
    const start = toOpenRouteServiceFormat(startPosition.lat, startPosition.lng)
    const end = toOpenRouteServiceFormat(endPosition.lat, endPosition.lng)

    console.log('ルート取得開始: start=', start, 'end=', end)

    const response = await fetch(
      `${API_CONFIG.OPENROUTESERVICE_BASE_URL}/${profile}?api_key=${apiKey}&start=${start}&end=${end}`
    )

    console.log('APIレスポンス status:', response.status)
    const data = await response.json()
    console.log('APIレスポンスデータ:', data)

    if (!response.ok) {
      console.error('ルート取得エラー:', data)
      throw new Error(data.message || 'Failed to fetch route')
    }

    if (!data.features || !data.features[0]) {
      console.error('ルートデータが存在しません:', data)
      throw new Error('No route data returned')
    }

    // 取得した経路を Leaflet のポリライン形式に変換
    const coords = data.features[0].geometry.coordinates
    const latlngs = toLeafletFormat(coords)
    console.log('ルート座標:', latlngs)

    return latlngs
  } catch (error) {
    console.error('ルートの取得に失敗しました:', error)
    throw error
  }
}
