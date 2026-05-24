/**
 * 駅データ取得サービス
 */

import { API_CONFIG, TOKYO_BOUNDS, FALLBACK_STATIONS } from '../constants/constants'
import { isValidCoordinate } from '../utils/coordinateUtils'

/**
 * 東京都の全駅データを取得
 * @returns {Promise<Array>} 駅データの配列
 */
export const fetchTokyoStations = async () => {
  try {
    console.log('駅データの取得を開始します...')

    // 東京都の路線を取得
    const linesResponse = await fetch(
      `${API_CONFIG.HEARTRAILS_BASE_URL}?method=getLines&prefecture=${encodeURIComponent(API_CONFIG.TOKYO_PREFECTURE)}`
    )

    if (!linesResponse.ok) {
      throw new Error(`HTTP error! status: ${linesResponse.status}`)
    }

    const linesData = await linesResponse.json()
    console.log('路線のレスポンス:', linesData)

    if (!linesData.response || !linesData.response.line) {
      console.error('路線の取得に失敗しました')
      return FALLBACK_STATIONS
    }

    console.log('取得した路線数:', linesData.response.line.length)

    // 各路線から駅を取得して統合
    const allStationsMap = new Map()
    const lines = linesData.response.line

    for (const line of lines) {
      console.log('路線を処理中:', line)
      const stationsResponse = await fetch(
        `${API_CONFIG.HEARTRAILS_BASE_URL}?method=getStations&line=${encodeURIComponent(line)}`
      )

      if (!stationsResponse.ok) {
        console.warn(`路線 ${line} の駅取得に失敗しました`)
        continue
      }

      const stationsData = await stationsResponse.json()

      if (stationsData.response && stationsData.response.station) {
        const stations = stationsData.response.station
        console.log(`路線 ${line} の駅数:`, stations.length)

        // 東京都の駅のみを重複なく取得し、座標情報も保存
        stations.forEach(station => {
          if (station.prefecture === API_CONFIG.TOKYO_PREFECTURE && station.name && station.x && station.y) {
            try {
              const lat = parseFloat(station.y) // yが緯度
              const lng = parseFloat(station.x) // xが経度

              if (
                isValidCoordinate(
                  lat,
                  lng,
                  TOKYO_BOUNDS.MIN_LAT,
                  TOKYO_BOUNDS.MAX_LAT,
                  TOKYO_BOUNDS.MIN_LNG,
                  TOKYO_BOUNDS.MAX_LNG
                )
              ) {
                // 駅名をキーに、座標情報を値として保存（重複排除）
                if (!allStationsMap.has(station.name)) {
                  allStationsMap.set(station.name, {
                    name: station.name,
                    lat: lat,
                    lng: lng,
                  })
                }
              }
            } catch (error) {
              console.warn('駅データの解析に失敗しました:', station, error)
            }
          }
        })
      }
    }

    // マップを配列に変換
    const stationArray = Array.from(allStationsMap.values())
    console.log('最終的な駅数:', stationArray.length)

    if (stationArray.length === 0) {
      console.log('駅データが取得できなかったため、フォールバックデータを使用します')
      return FALLBACK_STATIONS
    }

    console.log('駅データのサンプル:', stationArray.slice(0, 3))
    return stationArray
  } catch (error) {
    console.error('駅情報の取得に失敗しました:', error)
    return FALLBACK_STATIONS
  }
}
