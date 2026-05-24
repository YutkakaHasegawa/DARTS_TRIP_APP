/**
 * Google Maps リンクボタンコンポーネント
 * 
 * Props:
 * - selectedStationData (object): 選択された駅のデータ {name, lat, lng}
 * - disabled (boolean): ボタンが無効かどうか
 */

import { useLocation } from '../hooks/useLocation'

function GoogleMapsLink({ selectedStationData, disabled }) {
  const { requestLocation } = useLocation()

  const handleShowGoogleMaps = async () => {
    if (!selectedStationData) return

    try {
      // 現在地を取得
      const position = await requestLocation()
      const start = `${position.lat},${position.lng}`
      const end = selectedStationData.name

      const url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=transit`
      window.open(url, '_blank')
    } catch (error) {
      console.error('現在地の取得に失敗しました:', error)

      // 位置情報が取れない場合は、目的地のみを Google Maps で表示する
      const end = selectedStationData.name
      const url = `https://www.google.com/maps/dir/?api=1&destination=${end}&travelmode=transit`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="google-route">
      <button
        onClick={handleShowGoogleMaps}
        className="google-maps-button"
        disabled={disabled}
      >
        GoogleMapでルートを確認する
      </button>
    </div>
  )
}

export default GoogleMapsLink
