/**
 * ジオロケーション取得と管理を行うカスタムフック
 */

import { useState, useCallback } from 'react'
import { getCurrentLocation } from '../services/geolocationService'

/**
 * 現在地を取得・管理するフック
 * @returns {Object} { location, loading, error, requestLocation }
 */
export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * 現在地を取得
   */
  const requestLocation = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const coords = await getCurrentLocation()
      setLocation(coords)
      return coords
    } catch (err) {
      console.error('位置情報取得エラー:', err)
      setError(err.message)
      setLocation(null)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    location,
    loading,
    error,
    requestLocation
  }
}
