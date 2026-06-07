/**
 * 駅選択パネルコンポーネント
 *
 * Props:
 * - selectedStation (string): 選択された駅の名前
 * - onSelectStation (function): 駅選択時のコールバック
 * - loading (boolean): データ読み込み中フラグ
 * - hasStations (boolean): 駅データが存在するかのフラグ
 */

import { useState } from "react";
import { Box, Button, Collapse, ToggleButton, Typography } from "@mui/material";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";

//Note: MUIのToggleButtonGroupは、単にgapを使った場合に選択されたボタン同士の境界線が消えるため、ボタン同士の間隔をあけても境界線が表示されるようにカスタムスタイルを適用。
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: "1rem",
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
    borderRadius: (theme.vars || theme).shape.borderRadius,
  },

  [`& .MuiToggleButton-root.Mui-selected`]: {
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
  },

  //Note: 両ボタンがONの状態の時に、下記のように右側のボタンの左側の境界線が消える設定にデフォルトでなっているため、それを上書きして両方ONの状態でも境界線が表示されるようにする。
  // .MuiToggleButtonGroup-grouped.Mui-selected + .MuiToggleButtonGroup-grouped.Mui-selected {
  //   border-left: 0;
  //   margin-left: 0;
  // }
  [`& .MuiToggleButtonGroup-grouped.Mui-selected + .MuiToggleButtonGroup-grouped.Mui-selected`]:
    {
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider} !important`,
    },
}));

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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="station-selector">
      <div className="text-area-wrapper">
        <label>目的地</label>
        <textarea value={selectedStation} readOnly className="text-area" />
      </div>

      <Button
        variant="text"
        size="small"
        onClick={() => setShowFilters((prev) => !prev)}
        className="filter-toggle-button"
      >
        {showFilters ? "詳細条件を閉じる" : "詳細条件を設定"}
      </Button>

      <Collapse in={showFilters} timeout="auto" unmountOnExit>
        <Box className="filter-area">
          <Box className="filter-group" component="section">
            <Typography
              component="p"
              sx={{ fontWeight: 600, marginBottom: "8px" }}
            >
              エリア
            </Typography>
            <Box className="toggle-group-wrapper">
              <StyledToggleButtonGroup
                value={selectedAreas}
                onChange={onToggleArea}
                size="small"
                aria-label="area filter"
                color="primary"
              >
                {areaFilters.map((filter) => (
                  <ToggleButton
                    key={filter.value}
                    value={filter.value}
                    aria-label={filter.label}
                  >
                    {filter.label}
                  </ToggleButton>
                ))}
              </StyledToggleButtonGroup>
            </Box>
          </Box>

          <Box className="filter-group" component="section">
            <Typography
              component="p"
              sx={{ fontWeight: 600, marginBottom: "8px" }}
            >
              路線
            </Typography>
            <Box className="toggle-group-wrapper">
              <StyledToggleButtonGroup
                value={selectedLineTypes}
                onChange={onToggleLineType}
                size="small"
                aria-label="line filter"
                color="primary"
              >
                {lineFilters.map((filter) => (
                  <ToggleButton
                    key={filter.value}
                    value={filter.value}
                    aria-label={filter.label}
                  >
                    {filter.label}
                  </ToggleButton>
                ))}
              </StyledToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Collapse>

      <button
        onClick={onSelectStation}
        className="decide-button"
        disabled={loading || !hasStations}
      >
        {loading ? "駅情報を読込中..." : "行先を決める"}
      </button>
    </div>
  );
}

export default StationSelector;
