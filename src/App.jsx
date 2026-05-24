/**
 * メインアプリケーションコンポーネント
 * 
 * リファクタリング後の構造：
 * - ビジネスロジックをカスタムフックに分離
 * - API呼び出しをサービス層に抽出
 * - UIコンポーネントを機能単位に分割
 * - 定数とユーティリティを外部ファイルに集約
 */

import { useState, useRef } from 'react'
import L from 'leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'

import { useStations } from './hooks/useStations'
import { useRoute } from './hooks/useRoute'
import { ROUTING_PROFILES } from './constants/constants'

import StationSelector from './components/StationSelector'
import MapView from './components/MapView'
import RoutePanel from './components/RoutePanel'
import GoogleMapsLink from './components/GoogleMapsLink'

function App() {
  // 駅データ管理
  const { stations, loading: stationsLoading, selectRandomStation } = useStations()

  // 選択された駅の管理
  const [selectedStation, setSelectedStation] = useState('')
  const [selectedStationData, setSelectedStationData] = useState(null)

  // ルート管理
  const { route: routeCoords, loading: routeLoading, fetchRouteCoords, resetRoute } = useRoute()

  // ルーティングプロフィール選択
  const [selectedProfile, setProfile] = useState(ROUTING_PROFILES[0])

  // マップ参照
  const mapRef = useRef(null)

  /**
   * 目的地の駅をランダムに選択
   */
  const handleDecideDestination = () => {
    const station = selectRandomStation()
    if (station) {
      setSelectedStation(station.name)
      setSelectedStationData(station)
      resetRoute()
      console.log('Selected station:', station)
    }
  }

  /**
   * ルートを表示
   */
  const handleShowRoute = async () => {
    if (!selectedStationData || !mapRef.current) {
      console.log('条件を満たしていません')
      return
    }

    try {
      // 現在地の取得
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'))
        }
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      // ルート取得（取得した座標を返すようにfetchRouteCoordsを修正）
      const coords = await fetchRouteCoords(currentLocation, selectedStationData, selectedProfile.value)

      // 取得した座標がある場合、マップをルート全体にフィットさせる
      if (coords && mapRef.current) {
        const polyline = L.polyline(coords)
        mapRef.current.fitBounds(polyline.getBounds())
      }
    } catch (error) {
      console.error('ルート取得エラー:', error)
    }
  }

  return (
    <div className="app-container">
      <h1>東京都内ダーツの旅</h1>

      <StationSelector
        selectedStation={selectedStation}
        onSelectStation={handleDecideDestination}
        loading={stationsLoading}
        hasStations={stations.length > 0}
      />

      <MapView
        selectedStationData={selectedStationData}
        routeCoords={routeCoords}
        mapRef={mapRef}
      />

      <RoutePanel
        selectedProfile={selectedProfile}
        onProfileChange={setProfile}
        onShowRoute={handleShowRoute}
        disabled={!selectedStationData}
        loading={routeLoading}
      />

      <GoogleMapsLink
        selectedStationData={selectedStationData}
        disabled={!selectedStationData}
      />
    </div>
  )
}

export default App
