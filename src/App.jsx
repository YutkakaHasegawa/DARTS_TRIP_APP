/**
 * 参考：
 * https://express.heartrails.com/api.html
 * https://qiita.com/t-kurasawa/items/03e5bc9c9a07d8ff99b7 
 * https://openrouteservice.org/
 * https://www.interpark.co.jp/dev/p0534.htm
 * https://qiita.com/soichirowada/items/2311fd97bbf5841ccaf5
 * 
 */


import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css'

function App() {
  const [tokyoStations, setTokyoStations] = useState([])
  const [selectedStation, setSelectedStation] = useState('')
  const [selectedStationData, setSelectedStationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [routeCoords, setRouteCoords] = useState(null)
  const mapRef = useRef(null)
  const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY

  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log('駅データの取得を開始します...')
        // 東京都の路線を取得
        const linesResponse = await fetch(
          'https://express.heartrails.com/api/json?method=getLines&prefecture=%E6%9D%B1%E4%BA%AC%E9%83%BD'
        )
        
        if (!linesResponse.ok) {
          throw new Error(`HTTP error! status: ${linesResponse.status}`)
        }
        
        const linesData = await linesResponse.json()
        console.log('路線のレスポンス:', linesData)
        
        if (!linesData.response || !linesData.response.line) {
          console.error('路線の取得に失敗しました')
          // APIが利用できない場合のフォールバックデータ
          console.log('フォールバックデータを読み込みます')
          loadFallbackData()
          return
        }

        console.log('取得した路線数:', linesData.response.line.length)

        // 各路線から駅を取得して統合
        // 駅の情報（名前、緯度、経度）を保存するマップ
        const allStationsMap = new Map()
        const lines = linesData.response.line


        for (const line of lines) {
          console.log('路線を処理中:', line)
          const stationsResponse = await fetch(
            `https://express.heartrails.com/api/json?method=getStations&line=${encodeURIComponent(line)}`
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
              if (station.prefecture === '東京都' && station.name && station.x && station.y) {
                try {
                  const lat = parseFloat(station.y) // yが緯度
                  const lng = parseFloat(station.x) // xが経度
                  
                  if (!isNaN(lat) && !isNaN(lng) && lat >= 35 && lat <= 36 && lng >= 139 && lng <= 140) {
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
          console.log('駅データが取得できなかったため、フォールバックデータを読み込みます')
          loadFallbackData()
        } else {
          console.log('駅データのサンプル:', stationArray.slice(0, 3))
          setTokyoStations(stationArray)
          setLoading(false)
        }
      } catch (error) {
        console.error('駅情報の取得に失敗しました:', error)
        // エラーが発生した場合もフォールバックデータを読み込む
        loadFallbackData()
      }
    }

    // フォールバックデータの読み込み関数
    const loadFallbackData = () => {
      console.log('フォールバックデータを設定します')
      const fallbackStations = [
        { name: '東京駅', lat: 35.681236, lng: 139.767125 },
        { name: '新宿駅', lat: 35.689607, lng: 139.700571 },
        { name: '渋谷駅', lat: 35.658034, lng: 139.701636 },
        { name: '池袋駅', lat: 35.728926, lng: 139.71038 },
        { name: '品川駅', lat: 35.628471, lng: 139.73876 },
        { name: '上野駅', lat: 35.713768, lng: 139.777254 },
        { name: '秋葉原駅', lat: 35.698353, lng: 139.773114 },
        { name: '銀座駅', lat: 35.671449, lng: 139.764107 },
        { name: '六本木駅', lat: 35.660463, lng: 139.729426 },
        { name: '恵比寿駅', lat: 35.646685, lng: 139.71007 }
      ]
      setTokyoStations(fallbackStations)
      setLoading(false)
    }

    fetchStations()
  }, [])

  const handleDecideDestination = () => {
    try {
      if (tokyoStations.length > 0) {
        const randomIndex = Math.floor(Math.random() * tokyoStations.length)
        const selectedStationInfo = tokyoStations[randomIndex]
        
        if (selectedStationInfo && selectedStationInfo.name && typeof selectedStationInfo.lat === 'number' && typeof selectedStationInfo.lng === 'number') {
          // 駅名と座標情報を設定
          setSelectedStation(selectedStationInfo.name)
          setSelectedStationData(selectedStationInfo)
          console.log('Selected station:', selectedStationInfo) // デバッグ用
        } else {
          console.error('無効な駅データ:', selectedStationInfo)
        }
      } else {
        console.warn('駅データが読み込まれていません')
      }
    } catch (error) {
      console.error('駅選択中にエラーが発生しました:', error)
    }
  }

  const handleShowRoute = async () => {
    // 目的地とマップ参照がない場合は処理を中断
    if (!selectedStationData || !mapRef.current) {
      console.log('条件を満たしていません: selectedStationData=', selectedStationData, 'mapRef=', mapRef.current)
      return
    }

    try {
      // 現在地を取得し、OpenRouteService API の座標形式 (lng,lat) にする
      const position = await getCurrentLocation()
      const start = `${position.lng},${position.lat}`
      const end = `${selectedStationData.lng},${selectedStationData.lat}`

      console.log('ルート取得開始: start=', start, 'end=', end)

      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${apiKey}&start=${start}&end=${end}`
      )

      console.log('APIレスポンス status:', response.status)
      const data = await response.json()
      console.log('APIレスポンスデータ:', data)

      if (!response.ok) {
        console.error('ルート取得エラー:', data)
        return
      }

      if (!data.features || !data.features[0]) {
        console.error('ルートデータが存在しません:', data)
        return
      }

      // 取得した経路を Leaflet のポリライン形式に変換して表示
      const coords = data.features[0].geometry.coordinates
      const latlngs = coords.map(coord => [coord[1], coord[0]]) // [lat, lng] に変換
      console.log('ルート座標:', latlngs)
      setRouteCoords(latlngs)

      // マップ表示をルート全体に合わせる
      const polyline = L.polyline(latlngs)
      mapRef.current.fitBounds(polyline.getBounds())
    } catch (error) {
      console.error('ルートの取得に失敗しました:', error)
    }
  }

  const handleShowGoogleMaps = async () => {
    if (!selectedStationData) return

    try {
      // 現在地を取得
      const position = await getCurrentLocation()
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

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported')
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

  // https://qiita.com/meiyutianzhong557/items/5a7b0bd4d0629f5e3bab
  const customMarker = () => {
    return L.icon({
      iconUrl: "lib/img/marker-icon.png",
      iconSize: [25, 41],
      className: "marker",
    });
  };

  return (
    <div className="app-container">
      <h1>東京都内ダーツの旅</h1>
      
      <div className="station-selector">
        <div className="text-area-wrapper">
          <label>目的地</label>
          <textarea
            value={selectedStation}
            readOnly
            className="text-area"
          />
        </div>

        <button
          onClick={handleDecideDestination}
          className="decide-button"
          disabled={loading || tokyoStations.length === 0}
        >
          {loading ? '駅情報を読込中...' : '行先を決める'}
        </button>
      </div>

      {/* マップコンポーネント：選択された駅の位置を表示 */}
      <div className="map-container">
        <h2>目的地のマップ</h2>
        {/* MapContainer: React Leaflet マップの基本コンテナ */}
        <MapContainer
          ref={mapRef}
          key={selectedStationData ? selectedStationData.name : 'default'}
          center={selectedStationData ? [selectedStationData.lat, selectedStationData.lng] : [35.6895, 139.6917]}
          zoom={selectedStationData ? 15 : 10}
          className="map"
          style={{ height: '400px', width: '100%' }}
        >
          {/* TileLayer: OpenStreetMap タイルを使用 */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker: 駅の位置を示すピン */}
          {selectedStationData && (
            <Marker
              position={[selectedStationData.lat, selectedStationData.lng]}
              icon={customMarker()}
            >
              {/* Popup: マーカークリック時に表示される情報 */}
              <Popup>
                <div>
                  <h3>{selectedStationData.name}</h3>
                  <p>
                    座標: {selectedStationData.lat.toFixed(6)}, {selectedStationData.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
          {/* ルート polyline */}
          {routeCoords && (
            <Polyline
              positions={routeCoords}
              color="blue"
              weight={5}
            />
          )}
        </MapContainer>
        <button
          onClick={handleShowRoute}
          className="route-button"
          disabled={loading || !selectedStationData}
        >
          簡易ルートを表示する
        </button>
        <button
          onClick={handleShowGoogleMaps}
          className="google-maps-button"
          disabled={loading || !selectedStationData}
        >
          GoogleMapでルートを表示する
        </button>
      </div>
    </div>
  )
}

export default App
