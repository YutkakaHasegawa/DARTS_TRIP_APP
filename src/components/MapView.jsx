/**
 * マップ表示コンポーネント
 * 
 * Props:
 * - selectedStationData (object): 選択された駅のデータ {name, lat, lng}
 * - routeCoords (array): ルート座標の配列 [[lat, lng], ...]
 * - mapRef (object): マップへのref
 */

import { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { MAP_CONFIG, OPENSTREETMAP_CONFIG } from '../constants/constants'

function MapView({ selectedStationData, routeCoords, mapRef }) {
// https://qiita.com/meiyutianzhong557/items/5a7b0bd4d0629f5e3bab
  const customMarker = () => {
    //以下のページの差分を吸収
    //ローカル開発: http://localhost:5173/
    //GitHub Pages: https://username.github.io/DARTS_TRIP_APP/
    const markerIconUrl = `${import.meta.env.BASE_URL}marker-icon.png`
    return L.icon({
      iconUrl: markerIconUrl,
      iconSize: MAP_CONFIG.MARKER_ICON_SIZE,
      className: 'marker',
    })
  }

  const center = selectedStationData
    ? [selectedStationData.lat, selectedStationData.lng]
    : MAP_CONFIG.DEFAULT_CENTER

  const zoom = selectedStationData
    ? MAP_CONFIG.DESTINATION_ZOOM
    : MAP_CONFIG.DEFAULT_ZOOM

  return (
    <div className="map-container">
      <h2>目的地のマップ</h2>
      <MapContainer
        ref={mapRef}
        key={selectedStationData ? selectedStationData.name : 'default'}
        center={center}
        zoom={zoom}
        className="map"
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url={OPENSTREETMAP_CONFIG.URL}
          attribution={OPENSTREETMAP_CONFIG.ATTRIBUTION}
        />
        {selectedStationData && (
          <Marker
            position={[selectedStationData.lat, selectedStationData.lng]}
            icon={customMarker()}
          >
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
        {routeCoords && (
          <Polyline
            positions={routeCoords}
            color={MAP_CONFIG.POLYLINE_COLOR}
            weight={MAP_CONFIG.POLYLINE_WEIGHT}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default MapView
