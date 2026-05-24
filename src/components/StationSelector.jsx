/**
 * 駅選択パネルコンポーネント
 * 
 * Props:
 * - selectedStation (string): 選択された駅の名前
 * - onSelectStation (function): 駅選択時のコールバック
 * - loading (boolean): データ読み込み中フラグ
 * - hasStations (boolean): 駅データが存在するかのフラグ
 */

function StationSelector({
  selectedStation,
  onSelectStation,
  loading,
  hasStations
}) {
  return (
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
        onClick={onSelectStation}
        className="decide-button"
        disabled={loading || !hasStations}
      >
        {loading ? '駅情報を読込中...' : '行先を決める'}
      </button>
    </div>
  )
}

export default StationSelector
