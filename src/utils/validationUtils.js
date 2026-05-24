/**
 * データバリデーションのユーティリティ関数
 */

/**
 * 駅データの妥当性を検証
 * @param {Object} station - 駅データオブジェクト
 * @returns {boolean} 駅データが有効な場合true
 */
export const isValidStation = (station) => {
  return (
    station &&
    typeof station.name === 'string' &&
    typeof station.lat === 'number' &&
    typeof station.lng === 'number'
  )
}

/**
 * 駅データの配列が空でないかチェック
 * @param {Array} stations - 駅データの配列
 * @returns {boolean} 駅データが1件以上存在する場合true
 */
export const hasValidStations = (stations) => {
  return Array.isArray(stations) && stations.length > 0
}

/**
 * 選択された駅データが完全であるか検証
 * @param {Object} selectedStationData - 選択された駅データ
 * @returns {boolean} 駅データが完全な場合true
 */
export const isCompleteStationData = (selectedStationData) => {
  return (
    selectedStationData &&
    isValidStation(selectedStationData)
  )
}
