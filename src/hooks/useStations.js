/**
 * 駅データの取得と管理を行うカスタムフック
 */

import { useState, useEffect } from 'react'
import { fetchTokyoStations } from '../services/stationService'

/**
 * 駅データを取得・管理するフック
 * @returns {Object} { stations, loading, error, selectRandomStation }
 */
export const useStations = () => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true)
        const stationData = await fetchTokyoStations()
        setStations(stationData)
        setError(null)
      } catch (err) {
        console.error('駅データの読み込みエラー:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStations()
  }, [])

  /**
   * ランダムに駅を選択
   * @returns {Object|null} 選択された駅データ、またはnull
   */
  const selectRandomStation = () => {
    if (stations.length === 0) {
      console.warn('駅データが読み込まれていません')
      return null
    }

    const randomIndex = Math.floor(Math.random() * stations.length)
    const selectedStationInfo = stations[randomIndex]

    if (
      selectedStationInfo &&
      selectedStationInfo.name &&
      typeof selectedStationInfo.lat === 'number' &&
      typeof selectedStationInfo.lng === 'number'
    ) {
      return selectedStationInfo
    }

    console.error('無効な駅データ:', selectedStationInfo)
    return null
  }

  return {
    stations,
    loading,
    error,
    selectRandomStation
  }
}
