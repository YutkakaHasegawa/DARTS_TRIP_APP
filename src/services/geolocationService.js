/**
 * ジオロケーションサービス
 */

/**
 * 現在地の座標を取得
 * @returns {Promise<{lat: number, lng: number}>} 緯度経度オブジェクト
 * @throws {Error} Geolocation APIが利用できない、または位置情報取得に失敗した場合
 */
export const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser')
  }

  // Geolocation API を Promise 化して await で取得
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  }
}
