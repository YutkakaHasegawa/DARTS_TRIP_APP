/**
 * 座標関連のユーティリティ関数
 */

/**
 * 緯度経度をOpenRouteService API形式に変換
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @returns {string} "lng,lat" 形式の文字列
 */
export const toOpenRouteServiceFormat = (lat, lng) => {
  return `${lng},${lat}`
}

/**
 * OpenRouteService API形式の座標をLeaflet形式に変換
 * @param {Array<Array<number>>} coords - [[lng, lat], [lng, lat], ...] 形式の座標配列
 * @returns {Array<Array<number>>} [[lat, lng], [lat, lng], ...] 形式の座標配列
 */
export const toLeafletFormat = (coords) => {
  return coords.map(coord => [coord[1], coord[0]])
}

/**
 * 座標の妥当性を検証
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} minLat - 最小緯度
 * @param {number} maxLat - 最大緯度
 * @param {number} minLng - 最小経度
 * @param {number} maxLng - 最大経度
 * @returns {boolean} 座標が有効な場合true
 */
export const isValidCoordinate = (lat, lng, minLat, maxLat, minLng, maxLng) => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= minLat &&
    lat <= maxLat &&
    lng >= minLng &&
    lng <= maxLng
  )
}
