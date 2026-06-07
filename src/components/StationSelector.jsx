/**
 * 駅選択パネルコンポーネント
 * 
 * Props:
 * - selectedStation (string): 選択された駅の名前
 * - onSelectStation (function): 駅選択時のコールバック
 * - loading (boolean): データ読み込み中フラグ
 * - hasStations (boolean): 駅データが存在するかのフラグ
 */

import { useState } from 'react'
import { Box, Button, Collapse, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

function StationSelector({
  selectedStation,
  onSelectStation,
  loading,
  hasStations,
  selectedAreas,
  selectedLineTypes,
  onToggleArea,
  onToggleLineType,
  areaFilters,
  lineFilters,
}) {
  const [showFilters, setShowFilters] = useState(false)

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

      <Button
        variant="text"
        size="small"
        onClick={() => setShowFilters((prev) => !prev)}
        className="filter-toggle-button"
      >
        {showFilters ? '詳細条件を閉じる' : '詳細条件を設定'}
      </Button>

      <Collapse in={showFilters} timeout="auto" unmountOnExit>
        <Box className="filter-area">
          <Box className="filter-group" component="section">
            <Typography component="p" sx={{ fontWeight: 600, marginBottom: '8px' }}>
              エリア
            </Typography>
            <Box className="toggle-group-wrapper">
              <ToggleButtonGroup
                value={selectedAreas}
                onChange={onToggleArea}
                size="small"
                aria-label="area filter"
                color="primary"
                sx={{ flexWrap: 'wrap', gap: '8px' }}
              >
                {areaFilters.map((filter) => (
                  <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
                    {filter.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Box className="filter-group" component="section">
            <Typography component="p" sx={{ fontWeight: 600, marginBottom: '8px' }}>
              路線
            </Typography>
            <Box className="toggle-group-wrapper">
              <ToggleButtonGroup
                value={selectedLineTypes}
                onChange={onToggleLineType}
                size="small"
                aria-label="line filter"
                color="primary"
                sx={{ flexWrap: 'wrap', gap: '8px' }}
              >
                {lineFilters.map((filter) => (
                  <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
                    {filter.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Collapse>

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
