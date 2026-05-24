/**
 * ルート取得と管理を行うカスタムフック
 */

import { useState, useCallback } from 'react'
import { fetchRoute } from '../services/routeService'

/**
 * ルート取得を管理するフック
 * @returns {Object} { route, loading, error, fetchRouteCoords }
 */
export const useRoute = () => {
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * ルート座標を取得
   * @param {Object} startPosition - 開始位置 {lat, lng}
   * @param {Object} endPosition - 終了位置 {lat, lng}
   * @param {string} profileValue - ルーティングプロフィール
   */
  const fetchRouteCoords = useCallback(
    async (startPosition, endPosition, profileValue) => {
      try {
        setLoading(true)
        setError(null)
        const routeCoords = await fetchRoute(startPosition, endPosition, profileValue)
        setRoute(routeCoords)
        return routeCoords
      } catch (err) {
        console.error('ルート取得エラー:', err)
        setError(err.message)
        setRoute(null)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * ルートをリセット
   */
  const resetRoute = useCallback(() => {
    setRoute(null)
    setError(null)
  }, [])

  return {
    route,
    loading,
    error,
    fetchRouteCoords,
    resetRoute
  }
}
