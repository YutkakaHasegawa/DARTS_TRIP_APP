/**
 * メインアプリケーションコンポーネント
 * 
 * リファクタリング後の構造：
 * - ビジネスロジックをカスタムフックに分離
 * - API呼び出しをサービス層に抽出
 * - UIコンポーネントを機能単位に分割
 * - 定数とユーティリティを外部ファイルに集約
 */

import { useState, useRef, useMemo } from 'react'
import L from 'leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'

import { useStations } from './hooks/useStations'
import { useRoute } from './hooks/useRoute'
import { ROUTING_PROFILES, AREA_FILTERS, LINE_FILTERS } from './constants/constants'
import { filterStations } from './utils/stationUtils'

import StationSelector from './components/StationSelector'
import MapView from './components/MapView'
import RoutePanel from './components/RoutePanel'
import GoogleMapsLink from './components/GoogleMapsLink'

function App() {
  // 駅データ管理
  const { stations, loading: stationsLoading } = useStations()

  // 選択された駅の管理
  const [selectedStation, setSelectedStation] = useState('')
  const [selectedStationData, setSelectedStationData] = useState(null)

  // フィルタ選択状態
  const [selectedAreas, setSelectedAreas] = useState(AREA_FILTERS.map((filter) => filter.value))
  const [selectedLineTypes, setSelectedLineTypes] = useState(LINE_FILTERS.map((filter) => filter.value))

  const filteredStations = useMemo(
    () => filterStations(stations, selectedAreas, selectedLineTypes),
    [stations, selectedAreas, selectedLineTypes]
  )

  const hasFilteredStations = filteredStations.length > 0

  // ルート管理
  const { route: routeCoords, loading: routeLoading, fetchRouteCoords, resetRoute } = useRoute()

  // ルーティングプロフィール選択
  const [selectedProfile, setProfile] = useState(ROUTING_PROFILES[0])

  // マップ参照
  const mapRef = useRef(null)

  /**
   * 目的地の駅をランダムに選択
   */
  const handleToggleArea = (event, newSelectedAreas) => {
    if (newSelectedAreas.length === 0) {
      return
    }
    setSelectedAreas(newSelectedAreas)
  }

  const handleToggleLineType = (event, newSelectedLineTypes) => {
    if (newSelectedLineTypes.length === 0) {
      return
    }
    setSelectedLineTypes(newSelectedLineTypes)
  }

  const handleDecideDestination = () => {
    if (!hasFilteredStations) {
      console.warn('選択されたフィルタに該当する駅がありません')
      return
    }

    const randomIndex = Math.floor(Math.random() * filteredStations.length)
    const station = filteredStations[randomIndex]

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
        hasStations={hasFilteredStations}
        selectedAreas={selectedAreas}
        selectedLineTypes={selectedLineTypes}
        onToggleArea={handleToggleArea}
        onToggleLineType={handleToggleLineType}
        areaFilters={AREA_FILTERS}
        lineFilters={LINE_FILTERS}
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
